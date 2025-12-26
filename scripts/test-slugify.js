#!/usr/bin/env node

/**
 * Test script to demonstrate slug readability improvements
 *
 * Usage:
 *   node scripts/test-slugify.js
 */

import { slugify, getSlugReadability, isValidSlug } from './utils/slugify.js';

const testCases = [
  { title: 'Anthropic Bun 인수', date: '2025-12-10' },
  { title: '한글 제목만 있는 경우', date: '2025-12-11' },
  { title: 'AI and 머신러닝 Trends', date: '2025-12-12' },
  { title: 'GitHub Copilot 사용법', date: '2025-12-13' },
  { title: 'React 18 새로운 기능들', date: '2025-12-14' },
  { title: 'Astro 5.x Migration Guide', date: '2025-12-15' },
  { title: '2024년 회고', date: '2024-12-31' },
  { title: 'The Future of Web Development', date: '2025-01-01' },
  { title: 'TypeScript 타입 시스템 깊게 알아보기', date: '2025-12-16' },
  { title: 'notion-to-md 라이브러리', date: '2025-12-17' }
];

console.log('━'.repeat(80));
console.log('🧪 Slug Readability Test - Before vs After');
console.log('━'.repeat(80));
console.log();

testCases.forEach((test, index) => {
  console.log(`${index + 1}. "${test.title}"`);
  console.log('   ━'.repeat(38));

  // Old method (Korean chars preserved)
  const oldSlug = test.title
    .replace(/[^a-zA-Z0-9가-힣\s]/g, '')
    .replace(/\s+/g, '-')
    .toLowerCase()
    .substring(0, 50);

  // New method (readable ASCII)
  const newSlug = slugify(test.title, test.date);

  // Generate URLs
  const oldUrl = `http://localhost:4321/blog/category/${test.date}-${oldSlug}`;
  const newUrl = `http://localhost:4321/blog/category/${test.date}-${newSlug}`;

  console.log(`   OLD: ${oldUrl}`);
  console.log(`   NEW: ${newUrl}`);
  console.log();

  // Readability analysis
  const oldReadability = getSlugReadability(oldSlug);
  const newReadability = getSlugReadability(newSlug);

  console.log(`   Old Readability: ${oldReadability.readabilityScore}/100 (${oldReadability.recommendation})`);
  console.log(`   New Readability: ${newReadability.readabilityScore}/100 (${newReadability.recommendation})`);

  if (oldReadability.hasKorean) {
    console.log(`   ⚠️  Old slug contains Korean → will URL-encode`);
  }
  if (!newReadability.hasKorean) {
    console.log(`   ✅ New slug is ASCII-only → no URL-encoding needed`);
  }

  console.log();
});

console.log('━'.repeat(80));
console.log('📊 Summary');
console.log('━'.repeat(80));
console.log();
console.log('✅ Benefits of new slug generation:');
console.log('   1. No URL encoding (%XX%XX) for Korean characters');
console.log('   2. Readable URLs in browser address bar');
console.log('   3. Better for SEO and sharing');
console.log('   4. Automatic fallback for Korean-only titles');
console.log();
console.log('💡 Usage:');
console.log('   import { slugify } from "./utils/slugify.js";');
console.log('   const slug = slugify(title, dateStr);');
console.log();
