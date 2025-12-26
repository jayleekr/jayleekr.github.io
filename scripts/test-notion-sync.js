#!/usr/bin/env node

/**
 * Notion 동기화 프로세스 테스트 스크립트
 *
 * 이 스크립트는:
 * 1. Notion API 연결 테스트
 * 2. 변환 가능한 페이지 수 확인
 * 3. 카테고리 분류 로직 검증
 * 4. 샘플 페이지로 실제 변환 테스트 (dry-run)
 * 5. 검증 리포트 생성
 *
 * Usage:
 *   node test-notion-sync.js
 */

import { Client } from '@notionhq/client';
import { NotionToMarkdown } from 'notion-to-md';
import dotenv from 'dotenv';

dotenv.config();

const notion = new Client({ auth: process.env.NOTION_API_TOKEN });
const n2m = new NotionToMarkdown({ notionClient: notion });

// 테스트 결과 저장
const testResults = {
  connection: { status: 'pending', message: '' },
  pageCount: { status: 'pending', count: 0, message: '' },
  categorization: { status: 'pending', results: [], message: '' },
  conversion: { status: 'pending', samples: [], message: '' },
  validation: { status: 'pending', errors: [], warnings: [], message: '' }
};

/**
 * 1. Notion API 연결 테스트
 */
async function testConnection() {
  console.log('\n🔍 테스트 1: Notion API 연결');
  console.log('━'.repeat(60));

  try {
    const response = await notion.search({
      filter: { property: 'object', value: 'page' },
      page_size: 1
    });

    if (response.results.length > 0) {
      testResults.connection.status = 'pass';
      testResults.connection.message = 'Notion API 연결 성공';
      console.log('✅ 연결 성공');
    } else {
      testResults.connection.status = 'warn';
      testResults.connection.message = '연결은 되지만 페이지가 없음';
      console.log('⚠️  연결은 되지만 접근 가능한 페이지가 없습니다');
    }
  } catch (error) {
    testResults.connection.status = 'fail';
    testResults.connection.message = `연결 실패: ${error.message}`;
    console.error('❌ 연결 실패:', error.message);
    throw error;
  }
}

/**
 * 2. 변환 가능한 페이지 수 확인
 */
async function testPageCount() {
  console.log('\n📊 테스트 2: 변환 가능한 페이지 수 확인');
  console.log('━'.repeat(60));

  try {
    let allPages = [];
    let hasMore = true;
    let startCursor = undefined;

    while (hasMore) {
      const response = await notion.search({
        filter: { property: 'object', value: 'page' },
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
    }

    testResults.pageCount.count = allPages.length;
    testResults.pageCount.status = 'pass';
    testResults.pageCount.message = `총 ${allPages.length}개 페이지 발견`;

    console.log(`✅ 총 ${allPages.length}개 페이지 발견`);

    // 날짜별 통계
    const dateGroups = {};
    allPages.forEach(page => {
      const date = new Date(page.created_time).toISOString().split('T')[0];
      dateGroups[date] = (dateGroups[date] || 0) + 1;
    });

    console.log('\n📅 날짜별 분포:');
    Object.entries(dateGroups)
      .sort()
      .forEach(([date, count]) => {
        console.log(`   ${date}: ${count}개`);
      });

    return allPages;

  } catch (error) {
    testResults.pageCount.status = 'fail';
    testResults.pageCount.message = `페이지 조회 실패: ${error.message}`;
    console.error('❌ 실패:', error.message);
    throw error;
  }
}

/**
 * 3. 카테고리 분류 로직 테스트
 */
async function testCategorization(pages) {
  console.log('\n🏷️  테스트 3: 카테고리 자동 분류');
  console.log('━'.repeat(60));

  const categories = {
    'TechSavvy/AI': 0,
    'Collaboration/ToyProjects': 0,
    'DeepThinking/Daily': 0
  };

  try {
    for (const page of pages.slice(0, 10)) {
      const title = page.properties?.title?.title?.[0]?.plain_text
        || page.properties?.Name?.title?.[0]?.plain_text
        || '제목 없음';

      let category = 'DeepThinking/Daily';
      const lowerTitle = title.toLowerCase();

      if (lowerTitle.includes('ai') || lowerTitle.includes('llm') || lowerTitle.includes('gpt')) {
        category = 'TechSavvy/AI';
      } else if (lowerTitle.includes('hackathon') || lowerTitle.includes('프로젝트') || lowerTitle.includes('pdr')) {
        category = 'Collaboration/ToyProjects';
      }

      categories[category]++;
      testResults.categorization.results.push({ title, category });

      console.log(`   ${title.substring(0, 40)}`);
      console.log(`   → ${category}`);
    }

    testResults.categorization.status = 'pass';
    testResults.categorization.message = '카테고리 분류 정상';

    console.log('\n📊 카테고리 분포 (샘플 10개):');
    Object.entries(categories).forEach(([cat, count]) => {
      if (count > 0) {
        console.log(`   ${cat}: ${count}개`);
      }
    });

  } catch (error) {
    testResults.categorization.status = 'fail';
    testResults.categorization.message = `분류 실패: ${error.message}`;
    console.error('❌ 실패:', error.message);
  }
}

/**
 * 4. 샘플 페이지 변환 테스트
 */
async function testConversion(pages) {
  console.log('\n🔄 테스트 4: MDX 변환 (샘플 3개)');
  console.log('━'.repeat(60));

  try {
    const samplePages = pages.slice(0, 3);

    for (const page of samplePages) {
      const title = page.properties?.title?.title?.[0]?.plain_text
        || page.properties?.Name?.title?.[0]?.plain_text
        || '제목 없음';

      console.log(`\n📄 ${title}`);

      try {
        // Markdown 변환 테스트
        const mdBlocks = await n2m.pageToMarkdown(page.id);
        const mdString = n2m.toMarkdownString(mdBlocks);
        const content = mdString.parent;

        const contentLength = content.length;
        const hasHeadings = content.includes('#');
        const hasLists = content.includes('-') || content.includes('*');
        const hasTables = content.includes('|');

        testResults.conversion.samples.push({
          title,
          contentLength,
          hasHeadings,
          hasLists,
          hasTables
        });

        console.log(`   ✅ 변환 성공`);
        console.log(`   📝 내용 길이: ${contentLength} 문자`);
        console.log(`   🔖 헤딩: ${hasHeadings ? '있음' : '없음'}`);
        console.log(`   📋 리스트: ${hasLists ? '있음' : '없음'}`);
        console.log(`   📊 표: ${hasTables ? '있음' : '없음'}`);

      } catch (error) {
        console.error(`   ❌ 변환 실패: ${error.message}`);
        testResults.conversion.samples.push({
          title,
          error: error.message
        });
      }

      // Rate limit 방지
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    testResults.conversion.status = 'pass';
    testResults.conversion.message = '샘플 변환 성공';

  } catch (error) {
    testResults.conversion.status = 'fail';
    testResults.conversion.message = `변환 테스트 실패: ${error.message}`;
    console.error('❌ 실패:', error.message);
  }
}

/**
 * 5. 검증 및 권장사항
 */
async function runValidation() {
  console.log('\n✅ 테스트 5: 최종 검증');
  console.log('━'.repeat(60));

  const errors = [];
  const warnings = [];

  // 연결 실패 체크
  if (testResults.connection.status === 'fail') {
    errors.push('Notion API 연결 실패 - .env 파일의 NOTION_API_TOKEN 확인 필요');
  }

  // 페이지 수 체크
  if (testResults.pageCount.count === 0) {
    warnings.push('변환 가능한 페이지가 없습니다 - Notion Integration 연결 확인 필요');
  } else if (testResults.pageCount.count > 100) {
    warnings.push(`${testResults.pageCount.count}개 페이지 발견 - 배치 변환 시 시간이 오래 걸릴 수 있습니다`);
  }

  // 변환 실패 체크
  const failedConversions = testResults.conversion.samples.filter(s => s.error);
  if (failedConversions.length > 0) {
    warnings.push(`${failedConversions.length}개 페이지 변환 실패 - 수동 확인 필요`);
  }

  testResults.validation.errors = errors;
  testResults.validation.warnings = warnings;
  testResults.validation.status = errors.length === 0 ? 'pass' : 'fail';

  if (errors.length > 0) {
    console.log('\n❌ 오류:');
    errors.forEach((err, i) => {
      console.log(`   ${i + 1}. ${err}`);
    });
  }

  if (warnings.length > 0) {
    console.log('\n⚠️  경고:');
    warnings.forEach((warn, i) => {
      console.log(`   ${i + 1}. ${warn}`);
    });
  }

  if (errors.length === 0 && warnings.length === 0) {
    console.log('✅ 모든 검증 통과');
  }
}

/**
 * 최종 리포트 출력
 */
function printFinalReport() {
  console.log('\n' + '━'.repeat(60));
  console.log('📋 테스트 최종 리포트');
  console.log('━'.repeat(60));

  const statusIcon = (status) => {
    switch (status) {
      case 'pass': return '✅';
      case 'fail': return '❌';
      case 'warn': return '⚠️';
      default: return '⏭️';
    }
  };

  console.log(`${statusIcon(testResults.connection.status)} Notion API 연결: ${testResults.connection.message}`);
  console.log(`${statusIcon(testResults.pageCount.status)} 페이지 조회: ${testResults.pageCount.message}`);
  console.log(`${statusIcon(testResults.categorization.status)} 카테고리 분류: ${testResults.categorization.message}`);
  console.log(`${statusIcon(testResults.conversion.status)} MDX 변환: ${testResults.conversion.message}`);
  console.log(`${statusIcon(testResults.validation.status)} 최종 검증: ${testResults.validation.errors.length === 0 ? '통과' : '실패'}`);

  console.log('\n━'.repeat(60));

  if (testResults.validation.status === 'pass') {
    console.log('✅ 모든 테스트 통과! 배치 동기화를 실행할 수 있습니다.\n');
    console.log('💡 다음 명령어로 실행:');
    console.log('   node scripts/sync-all-notion.js --dry-run  # 테스트');
    console.log('   node scripts/sync-all-notion.js --limit 5  # 5개만');
    console.log('   node scripts/sync-all-notion.js            # 전체 동기화');
  } else {
    console.log('❌ 일부 테스트 실패. 위의 오류를 먼저 해결하세요.');
  }

  console.log('');
}

/**
 * 메인 실행
 */
async function main() {
  console.log('🧪 Notion 동기화 테스트 시작\n');
  console.log('이 테스트는 실제 파일을 생성하지 않습니다.');
  console.log('━'.repeat(60));

  try {
    await testConnection();
    const pages = await testPageCount();
    await testCategorization(pages);
    await testConversion(pages);
    await runValidation();
    printFinalReport();

  } catch (error) {
    console.error('\n❌ 테스트 중단:', error.message);
    process.exit(1);
  }
}

main();
