#!/usr/bin/env node

/**
 * Notion 이미지 다운로드 및 로컬 경로 업데이트 스크립트
 *
 * Usage:
 *   node download-notion-images.js                  # 모든 MDX 파일의 이미지 다운로드
 *   node download-notion-images.js --dry-run        # 테스트 모드 (다운로드 안 함)
 *   node download-notion-images.js --file <path>    # 특정 파일만 처리
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { createWriteStream } from 'fs';
import https from 'https';
import http from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CLI 인자 파싱
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const fileIndex = args.indexOf('--file');
const specificFile = fileIndex !== -1 ? args[fileIndex + 1] : null;

// 통계
const stats = {
  filesProcessed: 0,
  imagesFound: 0,
  imagesDownloaded: 0,
  imagesFailed: 0,
  errors: []
};

/**
 * URL에서 파일 다운로드
 */
async function downloadImage(url, outputPath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;

    protocol.get(url, (response) => {
      // 리다이렉트 처리
      if (response.statusCode === 301 || response.statusCode === 302) {
        return downloadImage(response.headers.location, outputPath)
          .then(resolve)
          .catch(reject);
      }

      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode}: ${url}`));
        return;
      }

      const fileStream = createWriteStream(outputPath);
      response.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        resolve(outputPath);
      });

      fileStream.on('error', (err) => {
        fs.unlink(outputPath).catch(() => {});
        reject(err);
      });
    }).on('error', reject);
  });
}

/**
 * 파일명 생성 (URL에서 추출)
 */
function generateFilename(imageUrl, index) {
  // URL에서 파일 확장자 추출
  let ext = '.png'; // 기본값

  if (imageUrl.includes('.svg')) ext = '.svg';
  else if (imageUrl.includes('.jpg') || imageUrl.includes('.jpeg')) ext = '.jpg';
  else if (imageUrl.includes('.gif')) ext = '.gif';
  else if (imageUrl.includes('.webp')) ext = '.webp';

  // Notion S3 URL에서 UUID 추출
  const uuidMatch = imageUrl.match(/([a-f0-9-]{36})/);
  if (uuidMatch) {
    return `${uuidMatch[1]}${ext}`;
  }

  // Discord URL에서 파일명 추출
  const discordMatch = imageUrl.match(/\/([^/]+)\.(svg|png|jpg|jpeg|gif|webp)/i);
  if (discordMatch) {
    return `${discordMatch[1]}.${discordMatch[2]}`;
  }

  // 그 외의 경우 인덱스 사용
  return `image-${index}${ext}`;
}

/**
 * MDX 파일에서 이미지 URL 찾기 및 다운로드
 */
async function processFile(filePath) {
  console.log(`\n📄 처리 중: ${path.relative(process.cwd(), filePath)}`);

  const content = await fs.readFile(filePath, 'utf-8');

  // 이미지 마크다운 패턴: ![alt](url)
  const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  const matches = [...content.matchAll(imageRegex)];

  if (matches.length === 0) {
    console.log('   ℹ️  이미지 없음');
    return content;
  }

  stats.imagesFound += matches.length;
  console.log(`   🖼️  발견한 이미지: ${matches.length}개`);

  let updatedContent = content;
  const blogPostDate = path.basename(filePath).match(/^(\d{4}-\d{2}-\d{2})/)?.[1] || 'unknown';

  for (let i = 0; i < matches.length; i++) {
    const [fullMatch, altText, imageUrl] = matches[i];

    // Notion/Discord 이미지만 처리
    const isNotionImage = imageUrl.includes('prod-files-secure.s3') ||
                          imageUrl.includes('s3.us-west-2.amazonaws.com') ||
                          imageUrl.includes('discordapp.com');

    if (!isNotionImage) {
      console.log(`   ⏭️  건너뜀 (외부 이미지): ${imageUrl.substring(0, 50)}...`);
      continue;
    }

    try {
      // 이미지 저장 경로 생성
      const filename = generateFilename(imageUrl, i);
      const imageDir = path.join(process.cwd(), 'public/images/blog', blogPostDate);
      const imagePath = path.join(imageDir, filename);
      const relativeImagePath = `/images/blog/${blogPostDate}/${filename}`;

      if (!isDryRun) {
        // 디렉토리 생성
        await fs.mkdir(imageDir, { recursive: true });

        // 이미지 다운로드
        console.log(`   📥 다운로드 중: ${filename}`);
        await downloadImage(imageUrl, imagePath);
        console.log(`   ✅ 저장됨: ${relativeImagePath}`);
      } else {
        console.log(`   🧪 Dry-run: ${filename} → ${relativeImagePath}`);
      }

      // MDX 파일 내용 업데이트
      updatedContent = updatedContent.replace(
        fullMatch,
        `![${altText}](${relativeImagePath})`
      );

      stats.imagesDownloaded++;
    } catch (error) {
      console.error(`   ❌ 실패: ${error.message}`);
      stats.imagesFailed++;
      stats.errors.push({ file: filePath, url: imageUrl, error: error.message });
    }
  }

  // 파일 업데이트
  if (!isDryRun && updatedContent !== content) {
    await fs.writeFile(filePath, updatedContent, 'utf-8');
    console.log('   💾 파일 업데이트 완료');
  }

  stats.filesProcessed++;
  return updatedContent;
}

/**
 * 모든 MDX 파일 찾기
 */
async function findMdxFiles(dir) {
  const files = [];

  async function scan(directory) {
    const entries = await fs.readdir(directory, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        await scan(fullPath);
      } else if (entry.name.endsWith('.mdx')) {
        files.push(fullPath);
      }
    }
  }

  await scan(dir);
  return files;
}

/**
 * 메인 실행
 */
async function main() {
  try {
    console.log('🚀 Notion 이미지 다운로드 시작\n');
    console.log('━'.repeat(60));

    if (isDryRun) {
      console.log('🧪 DRY-RUN 모드: 이미지를 다운로드하지 않습니다');
    }
    console.log('━'.repeat(60));

    let files;
    if (specificFile) {
      files = [path.resolve(specificFile)];
    } else {
      const blogDir = path.join(process.cwd(), 'src/content/blog');
      files = await findMdxFiles(blogDir);
    }

    console.log(`\n📂 처리할 파일: ${files.length}개`);

    for (const file of files) {
      await processFile(file);
    }

    // 최종 리포트
    console.log('\n' + '━'.repeat(60));
    console.log('📊 처리 완료 리포트');
    console.log('━'.repeat(60));
    console.log(`파일 처리:       ${stats.filesProcessed}`);
    console.log(`발견한 이미지:   ${stats.imagesFound}`);
    console.log(`✅ 다운로드 성공: ${stats.imagesDownloaded}`);
    console.log(`❌ 다운로드 실패: ${stats.imagesFailed}`);
    console.log('━'.repeat(60));

    if (stats.errors.length > 0) {
      console.log('\n❌ 오류 상세:');
      stats.errors.forEach(({ file, url, error }, index) => {
        console.log(`${index + 1}. ${path.basename(file)}`);
        console.log(`   URL: ${url.substring(0, 80)}...`);
        console.log(`   오류: ${error}`);
      });
    }

    if (!isDryRun && stats.imagesDownloaded > 0) {
      console.log('\n💡 다음 단계:');
      console.log('   npm run build  # 빌드 확인');
      console.log('   npm run dev    # 로컬 서버에서 이미지 확인');
    }

  } catch (error) {
    console.error('\n❌ 치명적 오류:', error.message);
    console.error(error);
    process.exit(1);
  }
}

main();
