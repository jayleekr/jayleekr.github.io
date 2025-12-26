#!/usr/bin/env node
/**
 * Clean up blog posts with Korean characters in filenames
 *
 * Finds and removes .mdx files with Korean characters in their names,
 * so they can be re-synced from Notion with clean ASCII slugs.
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

/**
 * Find all MDX files with Korean characters in filename
 */
async function findKoreanSlugs(directory) {
  const koreanFiles = [];

  async function scanDirectory(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        await scanDirectory(fullPath);
      } else if (entry.name.endsWith('.mdx') && /[가-힣]/.test(entry.name)) {
        const relativePath = path.relative(projectRoot, fullPath);
        koreanFiles.push({
          name: entry.name,
          fullPath,
          relativePath
        });
      }
    }
  }

  await scanDirectory(directory);
  return koreanFiles;
}

/**
 * Main cleanup function
 */
async function cleanup(dryRun = false) {
  console.log('🔍 한글 포함 파일명 검색 중...\n');

  const blogDir = path.join(projectRoot, 'src/content/blog');
  const koreanFiles = await findKoreanSlugs(blogDir);

  if (koreanFiles.length === 0) {
    console.log('✅ 한글 포함 파일명이 없습니다!\n');
    return;
  }

  console.log(`📋 발견된 파일: ${koreanFiles.length}개\n`);
  console.log('━'.repeat(60));

  for (const file of koreanFiles) {
    console.log(`📄 ${file.relativePath}`);
    console.log(`   파일명: ${file.name}`);

    // Extract Korean characters for display
    const koreanChars = file.name.match(/[가-힣]+/g);
    if (koreanChars) {
      console.log(`   한글: ${koreanChars.join(', ')}`);
    }

    if (!dryRun) {
      try {
        await fs.unlink(file.fullPath);
        console.log(`   ✅ 삭제됨`);
      } catch (error) {
        console.log(`   ❌ 삭제 실패: ${error.message}`);
      }
    } else {
      console.log(`   🧪 [DRY RUN] 삭제 예정`);
    }
    console.log('');
  }

  console.log('━'.repeat(60));

  if (dryRun) {
    console.log('\n💡 실제 삭제하려면:');
    console.log('   node scripts/cleanup-korean-slugs.js --delete\n');
    console.log('   그 다음:');
    console.log('   node scripts/sync-all-notion.js\n');
  } else {
    console.log(`\n✅ ${koreanFiles.length}개 파일 삭제 완료!\n`);
    console.log('💡 다음 단계:');
    console.log('   node scripts/sync-all-notion.js');
    console.log('   → 깨끗한 ASCII slug로 파일이 재생성됩니다\n');
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const shouldDelete = args.includes('--delete') || args.includes('-d');

// Run cleanup
cleanup(!shouldDelete).catch(console.error);
