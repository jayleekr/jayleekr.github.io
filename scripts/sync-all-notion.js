#!/usr/bin/env node

/**
 * 모든 Notion 페이지를 시간순으로 MDX 블로그 포스트로 변환하는 배치 스크립트
 *
 * Usage:
 *   node sync-all-notion.js                    # 전체 동기화 (중복 건너뜀)
 *   node sync-all-notion.js --dry-run          # 테스트 모드 (실제 변환 안 함)
 *   node sync-all-notion.js --limit 5          # 최대 5개만 변환
 *   node sync-all-notion.js --from 2025-07-29  # 특정 날짜 이후만
 *   node sync-all-notion.js --force            # 기존 파일 덮어쓰기
 */

import { Client } from '@notionhq/client';
import { NotionToMarkdown } from 'notion-to-md';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';
import { createWriteStream } from 'fs';
import https from 'https';
import http from 'http';
import { slugify, getSlugReadability } from './utils/slugify.js';
import { formatContentReadability, getContentReadability } from './utils/format-content.js';

dotenv.config();

const notion = new Client({ auth: process.env.NOTION_API_TOKEN });
const n2m = new NotionToMarkdown({ notionClient: notion });

// CLI 인자 파싱
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const forceOverwrite = args.includes('--force');
const limitIndex = args.indexOf('--limit');
const limit = limitIndex !== -1 ? parseInt(args[limitIndex + 1]) : undefined;
const fromDateIndex = args.indexOf('--from');
const fromDate = fromDateIndex !== -1 ? new Date(args[fromDateIndex + 1]) : undefined;

// 통계 객체
const stats = {
  total: 0,
  success: 0,
  updated: 0,
  skipped: 0,
  failed: 0,
  errors: [],
  imagesDownloaded: 0,
  imagesFailed: 0
};

/**
 * 카테고리 자동 분류
 */
function categorizeContent(title, content) {
  const lowerTitle = title.toLowerCase();
  const lowerContent = content.toLowerCase();

  // Hackathon/프로젝트 관련 (우선순위: 높음)
  if (lowerTitle.includes('hackathon') || lowerTitle.includes('프로젝트') ||
      lowerTitle.includes('project') || lowerTitle.includes('pdr')) {
    return {
      category: 'Collaboration/ToyProjects',
      tags: ['Collaboration', 'Project']
    };
  }

  // AI/LLM 관련
  if (lowerTitle.includes('ai') || lowerTitle.includes('llm') || lowerTitle.includes('gpt') ||
      lowerContent.includes('langchain') || lowerContent.includes('openai')) {
    return {
      category: 'TechSavvy/AI',
      tags: ['AI', 'LLM', 'Technology']
    };
  }

  // 기본: 일상/생각
  return {
    category: 'DeepThinking/Daily',
    tags: ['Daily', 'Thoughts']
  };
}

/**
 * 페이지 제목에서 파일명 생성
 * @deprecated Use slugify() from utils/slugify.js instead for better URL readability
 */
function sanitizeFilename(title) {
  return title
    .replace(/[^a-zA-Z0-9가-힣\s]/g, '')
    .replace(/\s+/g, '-')
    .toLowerCase()
    .substring(0, 50);
}

/**
 * MDX에서 문제가 될 수 있는 패턴을 이스케이프 처리
 */
function sanitizeMDXContent(content) {
  let sanitized = content;

  // 1. {변수명} 패턴을 \{변수명\}로 이스케이프 (MDX가 JavaScript 표현식으로 해석하지 않도록)
  sanitized = sanitized.replace(/\{([^}]+)\}/g, '\\{$1\\}');

  // 2. <숫자 패턴을 HTML 엔티티로 변환 (예: <1, <100ms)
  sanitized = sanitized.replace(/<(\d)/g, '&lt;$1');

  // 3. >숫자 패턴을 HTML 엔티티로 변환 (예: >50%, >8)
  sanitized = sanitized.replace(/>(\d)/g, '&gt;$1');

  // 4. XML/HTML 스타일 태그를 이스케이프 (예: <example>, <function call>)
  // 열기 태그
  sanitized = sanitized.replace(/<([a-z_-]+)( [^>]*)?>/gi, '&lt;$1$2&gt;');
  // 닫기 태그
  sanitized = sanitized.replace(/<\/([a-z_-]+)>/gi, '&lt;/$1&gt;');

  return sanitized;
}

/**
 * 이미 변환된 파일이 있는지 확인 (모든 카테고리 디렉토리 검색)
 * @returns {Object|null} { relativePath: string, fullPath: string } 또는 null
 */
async function checkExistingFile(dateStr) {
  const blogDir = path.join(process.cwd(), 'src/content/blog');
  const categories = [
    'TechSavvy/AI',
    'TechSavvy/C',
    'TechSavvy/ComputerArchitecture',
    'TechSavvy/EmbeddedLinux',
    'TechSavvy/GitHub',
    'TechSavvy/LinuxKernel',
    'TechSavvy/Bash',
    'TechSavvy/OperatingSystems',
    'TechSavvy/Yocto',
    'Collaboration/ToyProjects',
    'DeepThinking/AI',
    'DeepThinking/Daily',
    'DeepThinking/Retrospect'
  ];

  for (const category of categories) {
    const categoryDir = path.join(blogDir, category);
    try {
      const files = await fs.readdir(categoryDir);
      // 같은 날짜로 시작하는 파일이 있는지 확인
      const existingFile = files.find(file => file.startsWith(dateStr));
      if (existingFile) {
        return {
          relativePath: path.join(category, existingFile),
          fullPath: path.join(categoryDir, existingFile)
        };
      }
    } catch (error) {
      // 디렉토리가 없으면 무시
      continue;
    }
  }
  return null;
}

/**
 * MDX 파일에서 lastEditedTime 추출
 */
async function getLastEditedTime(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const match = content.match(/lastEditedTime:\s*"([^"]+)"/);
    if (match) {
      return new Date(match[1]);
    }
  } catch (error) {
    // 파일 읽기 실패 또는 필드 없음
  }
  return null;
}

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
function generateImageFilename(imageUrl, index) {
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
 * Markdown 컨텐츠에서 이미지 다운로드 및 경로 업데이트
 */
async function processImages(content, dateStr) {
  // 이미지 마크다운 패턴: ![alt](url)
  const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  const matches = [...content.matchAll(imageRegex)];

  if (matches.length === 0) {
    return content;
  }

  let updatedContent = content;
  let imageIndex = 0;

  for (const match of matches) {
    const [fullMatch, altText, imageUrl] = match;

    // Notion/Discord 이미지만 처리
    const isNotionImage = imageUrl.includes('prod-files-secure.s3') ||
                          imageUrl.includes('s3.us-west-2.amazonaws.com') ||
                          imageUrl.includes('discordapp.com');

    if (!isNotionImage) {
      continue;
    }

    try {
      // 이미지 저장 경로 생성
      const filename = generateImageFilename(imageUrl, imageIndex);
      const imageDir = path.join(process.cwd(), 'public/images/blog', dateStr);
      const imagePath = path.join(imageDir, filename);
      const relativeImagePath = `/images/blog/${dateStr}/${filename}`;

      // 디렉토리 생성
      await fs.mkdir(imageDir, { recursive: true });

      // 이미지 다운로드
      await downloadImage(imageUrl, imagePath);
      console.log(`      📥 이미지 다운로드: ${filename}`);

      // MDX 컨텐츠 내용 업데이트
      updatedContent = updatedContent.replace(
        fullMatch,
        `![${altText}](${relativeImagePath})`
      );

      stats.imagesDownloaded++;
      imageIndex++;
    } catch (error) {
      console.error(`      ⚠️  이미지 다운로드 실패: ${error.message}`);
      stats.imagesFailed++;
    }
  }

  return updatedContent;
}

/**
 * 단일 페이지를 MDX로 변환
 */
async function convertPage(page) {
  const pageId = page.id;
  const title = page.properties?.title?.title?.[0]?.plain_text
    || page.properties?.Name?.title?.[0]?.plain_text
    || '제목 없음';

  const createdTime = page.created_time;
  const createdDate = new Date(createdTime);
  const lastEditedTime = page.last_edited_time;
  const lastEditedDate = new Date(lastEditedTime);
  const dateStr = createdDate.toISOString().split('T')[0];

  console.log(`\n📄 [${stats.success + stats.failed + 1}/${stats.total}] ${title}`);
  console.log(`   생성일: ${dateStr}`);

  // 날짜 필터링
  if (fromDate && createdDate < fromDate) {
    console.log('   ⏭️  건너뜀 (날짜 필터)');
    stats.skipped++;
    return;
  }

  // 중복 체크 및 수정 시간 비교 (--force 플래그가 없을 때만)
  let isUpdate = false;
  if (!forceOverwrite) {
    const existingFile = await checkExistingFile(dateStr);
    if (existingFile) {
      // 기존 파일의 lastEditedTime 확인
      const existingLastEditedTime = await getLastEditedTime(existingFile.fullPath);

      if (existingLastEditedTime && lastEditedDate <= existingLastEditedTime) {
        // Notion에서 수정되지 않았으면 건너뜀
        console.log(`   ⏭️  건너뜀 (변경 없음: ${existingFile.relativePath})`);
        stats.skipped++;
        return;
      } else {
        // Notion에서 수정되었으면 업데이트
        console.log(`   🔄 업데이트 (수정됨: ${existingFile.relativePath})`);
        isUpdate = true;
      }
    }
  }

  if (isDryRun) {
    console.log('   🧪 Dry-run 모드: 변환 스킵');
    stats.success++;
    return;
  }

  try {
    // Markdown 변환
    const mdBlocks = await n2m.pageToMarkdown(pageId);
    const mdString = n2m.toMarkdownString(mdBlocks);
    let content = mdString.parent;

    // MDX 호환성을 위한 sanitization
    content = sanitizeMDXContent(content);

    // 콘텐츠 가독성 향상 (빈 줄, 헤더 간격 등)
    content = formatContentReadability(content);

    // 이미지 다운로드 및 경로 업데이트
    console.log('   🖼️  이미지 처리 중...');
    content = await processImages(content, dateStr);

    // 카테고리 분류
    const { category, tags } = categorizeContent(title, content);

    // Frontmatter 생성
    const frontmatter = `---
title: "${title}"
author: "Jay Lee"
pubDate: "${createdDate.toISOString()}"
lastEditedTime: "${lastEditedDate.toISOString()}"
categories: ["${category.split('/')[0]}", "${category.split('/')[1]}"]
tags: ${JSON.stringify(tags)}
---
`;

    const mdxContent = frontmatter + content;

    // 파일명 생성 (readable URL-safe slug)
    const slug = slugify(title, dateStr);
    const filename = `${dateStr}-${slug}.mdx`;

    // URL 가독성 체크
    const readability = getSlugReadability(slug);
    if (readability.readabilityScore < 80) {
      console.log(`   📊 URL 가독성: ${readability.readabilityScore}/100 (${readability.recommendation})`);
      if (readability.hasKorean) {
        console.log(`   ⚠️  한글 포함: URL 인코딩 발생 가능 → 영문 slug 사용 권장`);
      }
    }

    // 콘텐츠 가독성 체크
    const contentReadability = getContentReadability(content);
    if (contentReadability.readabilityScore < 80) {
      console.log(`   📝 콘텐츠 가독성: ${contentReadability.readabilityScore}/100 (여백: ${contentReadability.blankLineRatio})`);
    }

    // 출력 경로
    const outputDir = path.join(process.cwd(), 'src/content/blog', category);
    const outputPath = path.join(outputDir, filename);

    // 디렉토리 생성
    await fs.mkdir(outputDir, { recursive: true });

    // 파일 저장
    await fs.writeFile(outputPath, mdxContent, 'utf-8');

    if (isUpdate) {
      console.log(`   ✅ 업데이트 완료: ${category}/${filename}`);
      stats.updated++;
    } else {
      console.log(`   ✅ 저장됨: ${category}/${filename}`);
      stats.success++;
    }
    console.log(`   🏷️  태그: ${tags.join(', ')}`);

  } catch (error) {
    console.error(`   ❌ 실패: ${error.message}`);
    stats.failed++;
    stats.errors.push({ title, error: error.message });
  }
}

/**
 * 모든 Notion 페이지 가져오기 (페이지네이션 지원)
 */
async function getAllPages() {
  const allPages = [];
  let hasMore = true;
  let startCursor = undefined;

  console.log('🔍 Notion 페이지 검색 중...\n');

  while (hasMore) {
    const response = await notion.search({
      filter: {
        property: 'object',
        value: 'page'
      },
      page_size: 100,
      sort: {
        direction: 'ascending',
        timestamp: 'last_edited_time'
      },
      start_cursor: startCursor
    });

    allPages.push(...response.results);
    hasMore = response.has_more;
    startCursor = response.next_cursor;

    console.log(`   찾음: ${response.results.length}개 (총 ${allPages.length}개)`);
  }

  return allPages;
}

/**
 * 메인 실행 함수
 */
async function main() {
  try {
    console.log('🚀 Notion → MDX 배치 변환 시작\n');
    console.log('━'.repeat(60));

    if (isDryRun) {
      console.log('🧪 DRY-RUN 모드: 실제 파일을 생성하지 않습니다');
    }
    if (forceOverwrite) {
      console.log('⚠️  FORCE 모드: 기존 파일을 덮어씁니다');
    } else {
      console.log('✅ 중복 체크: 이미 존재하는 파일은 건너뜁니다');
    }
    if (limit) {
      console.log(`📊 제한: 최대 ${limit}개 변환`);
    }
    if (fromDate) {
      console.log(`📅 필터: ${fromDate.toISOString().split('T')[0]} 이후`);
    }
    console.log('━'.repeat(60));

    // 모든 페이지 가져오기
    const pages = await getAllPages();
    stats.total = limit ? Math.min(pages.length, limit) : pages.length;

    console.log(`\n✅ 총 ${pages.length}개 페이지 발견`);
    console.log(`📝 ${stats.total}개 페이지 변환 예정\n`);
    console.log('━'.repeat(60));

    // 페이지 변환
    const pagesToProcess = limit ? pages.slice(0, limit) : pages;

    for (const page of pagesToProcess) {
      await convertPage(page);

      // API Rate Limit 방지 (100ms 대기)
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // 최종 리포트
    console.log('\n' + '━'.repeat(60));
    console.log('📊 변환 완료 리포트');
    console.log('━'.repeat(60));
    console.log(`총 페이지:     ${stats.total}`);
    console.log(`✅ 신규 생성:   ${stats.success}`);
    console.log(`🔄 업데이트:   ${stats.updated}`);
    console.log(`⏭️  건너뜀:     ${stats.skipped}`);
    console.log(`❌ 실패:       ${stats.failed}`);
    console.log('━'.repeat(60));
    console.log(`📥 이미지 다운로드: ${stats.imagesDownloaded}`);
    console.log(`⚠️  이미지 실패:   ${stats.imagesFailed}`);
    console.log('━'.repeat(60));

    if (stats.errors.length > 0) {
      console.log('\n❌ 오류 상세:');
      stats.errors.forEach(({ title, error }, index) => {
        console.log(`${index + 1}. ${title}`);
        console.log(`   ${error}`);
      });
    }

    if (!isDryRun && stats.success > 0) {
      console.log('\n💡 다음 단계:');
      console.log('   npm run build  # 빌드 확인');
      console.log('   npm run dev    # 로컬 서버에서 확인');
    }

  } catch (error) {
    console.error('\n❌ 치명적 오류:', error.message);
    console.error(error);
    process.exit(1);
  }
}

main();
