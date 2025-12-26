#!/usr/bin/env node

/**
 * Notion에서 가장 오래된 페이지들을 찾는 스크립트
 */

import { Client } from '@notionhq/client';
import dotenv from 'dotenv';

dotenv.config();

const notion = new Client({ auth: process.env.NOTION_API_TOKEN });

async function findOldestPages() {
  try {
    console.log('🔍 가장 오래된 Notion 페이지 검색 중...\n');

    // ascending으로 정렬해서 오래된 순서로 가져오기
    const response = await notion.search({
      filter: {
        property: 'object',
        value: 'page'
      },
      page_size: 20,
      sort: {
        direction: 'ascending',
        timestamp: 'last_edited_time'
      }
    });

    console.log(`✅ ${response.results.length}개의 페이지를 찾았습니다.\n`);

    // 각 페이지 정보 출력
    for (const page of response.results) {
      const title = page.properties?.title?.title?.[0]?.plain_text
        || page.properties?.Name?.title?.[0]?.plain_text
        || '(제목 없음)';

      console.log('📄 페이지:', title);
      console.log('   ID:', page.id);
      console.log('   생성일:', page.created_time);
      console.log('   수정일:', page.last_edited_time);
      console.log('');
    }

  } catch (error) {
    console.error('❌ 오류 발생:', error.message);
  }
}

findOldestPages();
