#!/usr/bin/env node

/**
 * Notion 페이지를 MDX 블로그 포스트로 변환하는 스크립트
 */

import { Client } from '@notionhq/client';
import { NotionToMarkdown } from 'notion-to-md';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';

dotenv.config();

const notion = new Client({ auth: process.env.NOTION_API_TOKEN });
const n2m = new NotionToMarkdown({ notionClient: notion });

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

async function convertNotionToMDX(pageId, outputCategory = 'DeepThinking/Daily') {
  try {
    console.log('🔍 Notion 페이지 정보 가져오는 중...\n');

    // 페이지 메타데이터 가져오기
    const page = await notion.pages.retrieve({ page_id: pageId });

    const title = page.properties?.title?.title?.[0]?.plain_text
      || page.properties?.Name?.title?.[0]?.plain_text
      || '제목 없음';

    const createdTime = page.created_time;
    const createdDate = new Date(createdTime);

    // 날짜 형식: YYYY-MM-DD
    const dateStr = createdDate.toISOString().split('T')[0];

    console.log('📄 페이지:', title);
    console.log('📅 생성일:', dateStr);
    console.log('');

    // 페이지 내용을 Markdown으로 변환
    console.log('📝 Markdown으로 변환 중...\n');
    const mdBlocks = await n2m.pageToMarkdown(pageId);
    const mdString = n2m.toMarkdownString(mdBlocks);
    let content = mdString.parent;

    // MDX 호환성을 위한 sanitization
    content = sanitizeMDXContent(content);

    // 카테고리 자동 분류
    let category = outputCategory;
    let tags = [];

    if (title.includes('AI') || title.includes('LLM') || title.includes('GPT')) {
      category = 'TechSavvy/AI';
      tags = ['AI', 'LLM'];
    } else if (title.includes('Hackathon') || title.includes('프로젝트')) {
      category = 'Collaboration/ToyProjects';
      tags = ['Collaboration'];
    } else {
      category = 'DeepThinking/Daily';
      tags = ['Daily', 'Thoughts'];
    }

    // Frontmatter 생성
    const frontmatter = `---
title: "${title}"
author: "Jay Lee"
pubDate: "${createdDate.toISOString()}"
categories: ["${category.split('/')[0]}", "${category.split('/')[1]}"]
tags: ${JSON.stringify(tags)}
---

`;

    const mdxContent = frontmatter + content;

    // 파일명 생성: YYYY-MM-DD-title.mdx
    const sanitizedTitle = title
      .replace(/[^a-zA-Z0-9가-힣\s]/g, '')
      .replace(/\s+/g, '-')
      .toLowerCase()
      .substring(0, 50);

    const filename = `${dateStr}-${sanitizedTitle}.mdx`;

    // 출력 경로
    const outputDir = path.join(process.cwd(), 'src/content/blog', category);
    const outputPath = path.join(outputDir, filename);

    // 디렉토리 생성
    await fs.mkdir(outputDir, { recursive: true });

    // MDX 파일 저장
    await fs.writeFile(outputPath, mdxContent, 'utf-8');

    console.log('✅ 변환 완료!\n');
    console.log('📁 저장 위치:', outputPath);
    console.log('📂 카테고리:', category);
    console.log('🏷️  태그:', tags.join(', '));
    console.log('\n💡 다음 단계:');
    console.log('   npm run dev로 로컬 서버를 실행해서 확인하세요');

  } catch (error) {
    console.error('❌ 오류 발생:', error.message);
    console.error(error);
  }
}

// 명령행 인자로 페이지 ID 받기
const pageId = process.argv[2];

if (!pageId) {
  console.error('❌ 사용법: node notion-to-mdx.js <notion-page-id>');
  console.error('예시: node notion-to-mdx.js 22c24811-4595-80aa-8042-d75b9515285f');
  process.exit(1);
}

convertNotionToMDX(pageId);
