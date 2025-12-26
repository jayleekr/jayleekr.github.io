#!/usr/bin/env node

/**
 * Notion API 연결 테스트 스크립트
 * Notion 워크스페이스의 페이지 구조를 확인합니다.
 */

import { Client } from '@notionhq/client';
import dotenv from 'dotenv';

// .env 파일 로드
dotenv.config();

const notion = new Client({ auth: process.env.NOTION_API_TOKEN });

async function testNotionConnection() {
  try {
    console.log('🔍 Notion API 연결 테스트 중...\n');

    // Search API를 사용해서 접근 가능한 페이지들 검색
    const response = await notion.search({
      filter: {
        property: 'object',
        value: 'page'
      },
      page_size: 10,
      sort: {
        direction: 'descending',
        timestamp: 'last_edited_time'
      }
    });

    console.log(`✅ 연결 성공! ${response.results.length}개의 페이지를 찾았습니다.\n`);

    // 각 페이지 정보 출력
    for (const page of response.results) {
      const title = page.properties?.title?.title?.[0]?.plain_text
        || page.properties?.Name?.title?.[0]?.plain_text
        || '(제목 없음)';

      console.log('📄 페이지:', title);
      console.log('   ID:', page.id);
      console.log('   URL:', page.url);
      console.log('   마지막 수정:', page.last_edited_time);
      console.log('');
    }

    console.log('\n💡 다음 단계:');
    console.log('1. 블로그 글이 들어있는 부모 페이지의 ID를 복사하세요');
    console.log('2. notion-sync.js 스크립트를 실행할 때 해당 ID를 사용하세요');

  } catch (error) {
    console.error('❌ 오류 발생:', error.message);
    if (error.code === 'unauthorized') {
      console.error('\n💡 해결 방법:');
      console.error('1. Notion Integration이 올바르게 생성되었는지 확인하세요');
      console.error('2. 블로그 페이지에 Integration이 연결되었는지 확인하세요');
      console.error('   (페이지 → ⋯ 메뉴 → Add connections)');
    }
  }
}

testNotionConnection();
