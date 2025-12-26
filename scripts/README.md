# Notion → Blog 자동 동기화 스크립트

Notion 페이지를 Astro 블로그의 MDX 포스트로 자동 변환하는 도구 모음입니다.

## 📋 목차

- [설치](#설치)
- [환경 설정](#환경-설정)
- [사용법](#사용법)
- [스크립트 설명](#스크립트-설명)
- [CI/CD 연동](#cicd-연동)
- [문제 해결](#문제-해결)

## 🚀 설치

### 1. 필요한 패키지 설치

```bash
npm install @notionhq/client notion-to-md dotenv
```

### 2. Notion Integration 생성

1. [Notion Integrations](https://www.notion.so/my-integrations) 페이지 접속
2. **New integration** 클릭
3. 설정:
   - Name: "Blog Sync" (원하는 이름)
   - Associated workspace: 본인 워크스페이스
   - Capabilities: "Read content" 체크
4. **Submit** 후 **Internal Integration Token** 복사

### 3. Notion 페이지에 Integration 연결

1. 블로그 글이 있는 Notion 페이지 열기
2. 페이지 우측 상단 `⋯` 메뉴 → **Add connections**
3. 생성한 Integration 선택

## ⚙️ 환경 설정

프로젝트 루트에 `.env` 파일 생성:

```bash
NOTION_API_TOKEN=your_notion_integration_token_here
```

또는 홈 디렉토리(`~/.env`)에 생성하고 symlink:

```bash
ln -s ~/.env .env
```

## 📖 사용법

### 테스트 (연결 확인)

```bash
# Notion 연결 및 변환 로직 테스트
node scripts/test-notion-sync.js
```

**출력 예시:**
```
✅ Notion API 연결: Notion API 연결 성공
✅ 페이지 조회: 총 65개 페이지 발견
✅ 카테고리 분류: 카테고리 분류 정상
✅ MDX 변환: 샘플 변환 성공
✅ 최종 검증: 통과
```

### Dry-run (실제 파일 생성 안 함)

```bash
# 5개만 테스트
node scripts/sync-all-notion.js --dry-run --limit 5

# 전체 테스트
node scripts/sync-all-notion.js --dry-run
```

### 실제 변환

```bash
# 5개만 변환 (스마트 업데이트)
node scripts/sync-all-notion.js --limit 5

# 특정 날짜 이후만 변환
node scripts/sync-all-notion.js --from 2025-07-29

# 전체 변환 (스마트 업데이트)
node scripts/sync-all-notion.js

# 기존 파일 강제 재변환 (업데이트 감지 무시)
node scripts/sync-all-notion.js --force
```

**스마트 업데이트** (v1.2.0부터):
- ✅ Notion에서 **수정된 문서만 자동 감지**하여 업데이트
- ✅ 변경되지 않은 문서는 자동으로 건너뜀 (불필요한 재변환 방지)
- ✅ `lastEditedTime` 비교를 통한 정확한 변경 감지
- ✅ 이미지도 변경 시에만 다시 다운로드
- `--force` 플래그로 스마트 감지 무시하고 강제 재변환

**작동 방식**:
1. 기존 MDX 파일의 `lastEditedTime` 읽기
2. Notion API의 `last_edited_time`과 비교
3. Notion이 더 최신이면 업데이트, 아니면 건너뜀
4. 첫 실행 시 모든 파일에 `lastEditedTime` 자동 추가

### 단일 페이지 변환

```bash
# 페이지 ID로 변환
node scripts/notion-to-mdx.js <notion-page-id>

# 예시
node scripts/notion-to-mdx.js 22c24811-4595-80aa-8042-d75b9515285f
```

## 📚 스크립트 설명

### `test-notion-sync.js`

**목적**: 동기화 시스템 전체 검증

**기능**:
- Notion API 연결 테스트
- 변환 가능한 페이지 수 확인
- 카테고리 자동 분류 로직 검증
- 샘플 페이지 변환 테스트
- 최종 검증 리포트 생성

**언제 사용하나요?**
- 처음 설정할 때
- 문제가 발생했을 때
- 배치 변환 전 사전 검증

### `sync-all-notion.js`

**목적**: 모든 Notion 페이지 배치 변환

**옵션**:
```bash
--dry-run           # 테스트 모드 (파일 생성 안 함)
--limit <number>    # 최대 변환 개수
--from <date>       # 특정 날짜 이후만 (YYYY-MM-DD)
```

**기능**:
- 페이지네이션 지원 (100개씩)
- 자동 카테고리 분류
- MDX 호환성 sanitization
- 진행 상황 표시
- 에러 처리 및 로깅
- 통계 리포트 생성

**MDX Sanitization**:
- `{변수명}` 패턴 자동 이스케이프
- MDX JavaScript 표현식 충돌 방지
- 런타임 에러 방지

### `notion-to-mdx.js`

**목적**: 단일 페이지 변환

**사용법**:
```bash
node scripts/notion-to-mdx.js <page-id>
```

**기능**:
- Notion 페이지 → Markdown 변환
- MDX frontmatter 자동 생성
- 카테고리 자동 분류
- 파일명 자동 생성

### 보조 스크립트

- `notion-test.js`: 기본 연결 테스트
- `find-oldest.js`: 가장 오래된 페이지 찾기

## 🤖 CI/CD 연동

### GitHub Actions 자동화

`.github/workflows/notion-sync.yml` 파일이 포함되어 있습니다.

#### 설정 방법

1. **GitHub Secrets 추가**
   - Repository → Settings → Secrets and variables → Actions
   - **New repository secret** 클릭
   - Name: `NOTION_API_TOKEN`
   - Value: Notion Integration Token

2. **수동 실행**
   - Actions 탭 → "Notion → Blog Sync" 선택
   - **Run workflow** 클릭
   - 옵션 설정:
     - `limit`: 최대 변환 개수 (비우면 전체)
     - `dry_run`: 테스트 모드 (체크하면 파일 생성 안 함)

3. **자동 실행 (선택사항)**

   워크플로우 파일에서 주석 해제:

   ```yaml
   # 매일 자정 실행
   schedule:
     - cron: '0 0 * * *'
   ```

## 🎯 카테고리 자동 분류

변환 시 제목과 내용을 분석해서 자동으로 카테고리를 할당합니다:

| 우선순위 | 키워드 | 카테고리 | 태그 |
|---------|--------|----------|------|
| 1 (높음) | Hackathon, 프로젝트, Project, PDR | `Collaboration/ToyProjects` | Collaboration, Project |
| 2 (중간) | AI, LLM, GPT, LangChain, OpenAI | `TechSavvy/AI` | AI, LLM, Technology |
| 3 (기본) | 기타 | `DeepThinking/Daily` | Daily, Thoughts |

**우선순위 규칙**:
- 프로젝트/Hackathon 키워드가 제목에 있으면 AI 관련 내용이 있어도 프로젝트로 분류
- 우선순위가 높은 규칙부터 순차적으로 적용

### 카테고리 커스터마이징

`sync-all-notion.js`의 `categorizeContent()` 함수를 수정하세요:

```javascript
function categorizeContent(title, content) {
  const lowerTitle = title.toLowerCase();

  // 새로운 카테고리 추가
  if (lowerTitle.includes('리뷰')) {
    return {
      category: 'Reviews/Books',
      tags: ['Review', 'Reading']
    };
  }

  // ...기존 로직
}
```

## 📂 파일 저장 구조

```
src/content/blog/
├── TechSavvy/
│   └── AI/
│       └── 2025-11-28-llm-능력-평가를-위한-테스트-프롬프트-방법론.mdx
├── Collaboration/
│   └── ToyProjects/
│       └── 2025-07-10-최종-pdr.mdx
└── DeepThinking/
    └── Daily/
        └── 2025-12-12-도망자모임단상.mdx
```

## 🔧 문제 해결

### "API connection failed"

**원인**: Notion Integration Token이 잘못됨

**해결**:
1. `.env` 파일 확인
2. Token이 올바른지 확인
3. Integration이 만료되지 않았는지 확인

### "No pages found"

**원인**: Integration이 페이지에 연결되지 않음

**해결**:
1. Notion 페이지 열기
2. `⋯` → **Add connections** → Integration 선택
3. 하위 페이지도 모두 연결

### "Conversion failed"

**원인**: 특정 Notion 블록이 변환되지 않음

**해결**:
1. 에러 메시지 확인
2. 해당 페이지의 특수 블록 확인 (임베드, 데이터베이스 등)
3. `notion-to-md` 라이브러리 업데이트

### Rate Limit 오류

**원인**: Notion API 호출 제한 초과

**해결**:
- `sync-all-notion.js`의 대기 시간 증가:
  ```javascript
  await new Promise(resolve => setTimeout(resolve, 200)); // 100 → 200
  ```

### MDX Build Error (username is not defined)

**원인**: MDX가 `{변수명}` 패턴을 JavaScript 표현식으로 해석

**증상**:
```
username is not defined
MDX component encounters runtime errors
```

**해결**:
- 자동 sanitization 적용됨 (v1.1.0부터)
- `{변수명}` → `\{변수명\}` 자동 이스케이프
- 수동 수정이 필요한 경우:
  ```markdown
  # 변경 전
  workflow_{username}.md

  # 변경 후
  workflow_\{username\}.md
  ```

## 📊 성능 팁

### 대량 변환 시

```bash
# 10개씩 나눠서 변환
node scripts/sync-all-notion.js --limit 10

# 날짜 범위로 나눠서 변환
node scripts/sync-all-notion.js --from 2025-11-01
node scripts/sync-all-notion.js --from 2025-12-01
```

### CI/CD에서

- `limit` 옵션으로 점진적 변환
- 스케줄 실행으로 자동 동기화
- Dry-run으로 먼저 테스트

## 🤝 기여

버그 리포트나 기능 제안은 이슈로 등록해주세요!

## 📝 라이선스

MIT License
