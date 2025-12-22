# PRD: Jay's Blog 극 미니멀 리팩토링

> **Reference**: overreacted.io (Dan Abramov)  
> **Created**: 2025-12-22  
> **Status**: Draft

---

## 1. 프로젝트 개요

### 1.1 목적

현재 블로그를 **overreacted.io 스타일의 극 미니멀 디자인**으로 리팩토링하여 콘텐츠(글) 중심의 읽기 경험을 극대화한다.

### 1.2 핵심 원칙

| 원칙 | 설명 |
|------|------|
| **Text-first** | 텍스트가 주인공, 이미지/장식은 최소화 |
| **No distraction** | 검색, 필터, 사이드바 등 제거 |
| **Fast** | 가벼운 페이지, 빠른 로딩 |
| **Readable** | 큰 폰트, 넉넉한 여백, 편안한 줄간격 |

### 1.3 레퍼런스

- **Primary**: https://overreacted.io (Dan Abramov)
- **Secondary**: https://leerob.com (View Transitions 참고)

### 1.4 스코프

- ✅ 전체 UI 리디자인
- ✅ 기존 콘텐츠 129개 포스트 100% 유지
- ✅ 기존 URL 구조 유지 (SEO 보존)
- ✅ 다국어 지원 방식 변경 (URL → 포스트 내 스위처)
- ✅ About 페이지 → 홈에 통합

---

## 2. 현재 상태 분석 (As-Is)

### 2.1 현재 UI 요소 → To-Be 변경

| 요소 | 현재 상태 | To-Be |
|------|----------|-------|
| 헤더 | 로고 + 네비게이션 + 검색 + 언어 | **단순화** (로고 + 다크모드만) |
| 포스트 카드 | 썸네일 + 제목 + 날짜 + 읽기시간 + 태그 | **제목 + 날짜 + 한줄설명만** |
| 검색 | 실시간 검색 모달 | **제거** |
| 카테고리 필터 | 탭 형태 필터 | **제거** |
| 태그 필터 | 클릭 가능한 태그 버튼 | **제거** |
| About 페이지 | 별도 페이지 | **홈에 통합** |
| 푸터 | 링크들 + 저작권 | **최소화** |
| 다국어 | URL 기반 (/ko/, /en/) | **포스트 내 스위처** |

### 2.2 현재 기술 스택 (유지)

```
Framework: Astro
Styling: Tailwind CSS
Content: MDX
Deployment: GitHub Pages
```

→ **스택 변경 없음, 리디자인만 진행**

---

## 3. 목표 상태 (To-Be)

### 3.1 홈페이지 와이어프레임

```
┌─────────────────────────────────────────┐
│                                         │
│  Jay Lee's Blog                    🌙   │  ← 로고 + 다크모드 토글
│  by [아바타] Jay Lee                    │  ← 저자 정보 (About 통합)
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  ## 포스트 제목 1                       │
│  December 22, 2025                      │
│  한 줄 설명 텍스트...                    │
│                                         │
│  ## 포스트 제목 2                       │
│  December 21, 2025                      │
│  한 줄 설명 텍스트...                    │
│                                         │
│  ... (스크롤로 전체 129개 포스트)        │
│                                         │
└─────────────────────────────────────────┘
```

### 3.2 포스트 페이지 와이어프레임

```
┌─────────────────────────────────────────┐
│                                         │
│  ← Jay Lee's Blog                  🌙   │  ← 홈 링크 + 다크모드
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  # 포스트 제목                          │
│  December 22, 2025 · 🇰🇷 🇺🇸            │  ← 날짜 + 언어 스위처
│                                         │
│  본문 내용...                           │
│  본문 내용...                           │
│                                         │
│  ```code block```                       │
│                                         │
│  본문 내용...                           │
│                                         │
└─────────────────────────────────────────┘
```

---

## 4. 기능 요구사항

### 4.1 제거할 기능 ❌

| 기능 | 이유 |
|------|------|
| 검색 | 극 미니멀 원칙 (스크롤로 탐색) |
| 카테고리 필터 UI | 극 미니멀 원칙 |
| 태그 필터 UI | 극 미니멀 원칙 |
| 썸네일 이미지 | 텍스트 중심 |
| 읽기 시간 표시 | 불필요한 정보 |
| Categories 페이지 | 필터 없이 스크롤 |
| About 페이지 | 홈에 통합 |
| 복잡한 푸터 | 최소화 |

### 4.2 유지할 기능 ✅

| 기능 | 비고 |
|------|------|
| 다크모드 | 토글 버튼 |
| 다국어 | 포스트 내 스위처로 변경 |
| RSS 피드 | SEO |
| 코드 하이라이팅 | 기술 블로그 필수 |
| 카테고리/태그 메타데이터 | 내부 데이터로만 유지 (UI 숨김) |
| URL 구조 | 현재 그대로 유지 (SEO) |

### 4.3 추가할 기능 ✨

| 기능 | 설명 | 우선순위 |
|------|------|----------|
| View Transitions | 페이지 전환 애니메이션 | P1 |
| 언어 스위처 | 포스트 내 🇰🇷/🇺🇸 토글 | P1 |
| 코드 복사 버튼 | 코드 블록에 복사 버튼 | P2 |
| 이전/다음 포스트 | 포스트 하단 네비게이션 | P3 |

---

## 5. 디자인 시스템

### 5.1 컬러 팔레트

```css
/* Light Mode */
--bg: #ffffff;
--text: #1a1a1a;
--text-secondary: #666666;
--link: #0070f3;
--code-bg: #f5f5f5;

/* Dark Mode (기본) */
--bg: #121212;
--text: #e5e5e5;
--text-secondary: #888888;
--link: #58a6ff;
--code-bg: #1e1e1e;
```

### 5.2 타이포그래피

| 요소 | 폰트 | 사이즈 | 비고 |
|------|------|--------|------|
| 본문 | 시스템 폰트 | 18px (1.125rem) | line-height: 1.7 |
| 제목 (h1) | 시스템 폰트 | 32px (2rem) | font-weight: 700 |
| 제목 (h2) | 시스템 폰트 | 24px (1.5rem) | font-weight: 600 |
| 날짜/메타 | 시스템 폰트 | 14px (0.875rem) | color: secondary |
| 코드 | Monospace | 15px | font-family: monospace |

### 5.3 여백

```css
--content-max-width: 680px;  /* 본문 최대 너비 */
--content-padding: 24px;      /* 좌우 패딩 */
--post-gap: 48px;             /* 포스트 간 간격 */
--section-gap: 32px;          /* 섹션 간 간격 */
```

### 5.4 시스템 폰트 스택

```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 
             Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 
             'Helvetica Neue', sans-serif;
```

---

## 6. 기술 스펙

### 6.1 폴더 구조 (변경 후)

```
src/
├── components/
│   ├── Header.astro          # 심플 헤더
│   ├── Footer.astro          # 미니멀 푸터  
│   ├── PostList.astro        # 포스트 리스트
│   ├── PostItem.astro        # 개별 포스트 아이템
│   ├── LanguageSwitcher.astro # 언어 스위처
│   ├── ThemeToggle.astro     # 다크모드 토글
│   └── CodeBlock.astro       # 코드 블록 + 복사
├── layouts/
│   ├── BaseLayout.astro      # 기본 레이아웃
│   └── PostLayout.astro      # 포스트 레이아웃
├── pages/
│   ├── index.astro           # 홈 (포스트 리스트)
│   └── blog/[...slug].astro  # 포스트 상세
├── styles/
│   └── global.css            # 글로벌 스타일 (최소화)
└── content/
    └── blog/                 # 기존 MDX 유지
```

### 6.2 Astro 설정

```javascript
// astro.config.mjs
export default defineConfig({
  site: 'https://jayleekr.github.io',
  experimental: {
    viewTransitions: true  // View Transitions 활성화
  },
  markdown: {
    shikiConfig: {
      theme: 'github-dark'  // 다크 테마 코드 하이라이팅
    }
  }
});
```

### 6.3 다국어 처리 로직

**기존 방식:**
```
/blog/ko/2025-07-28-prd/
/blog/en/2025-07-28-prd/
```

**변경 방식:**
```yaml
# frontmatter에 translations 필드 추가
translations:
  en: /blog/en/2025-07-28-prd/
  ko: /blog/ko/2025-07-28-prd/
```

→ 해당 필드가 있으면 포스트 상단에 🇰🇷/🇺🇸 스위처 표시

---

## 7. 마일스톤

### Phase 1: 기반 작업 (1-2일)

- [ ] 디자인 시스템 CSS 변수 정의
- [ ] 기본 레이아웃 컴포넌트 생성
- [ ] View Transitions 설정

### Phase 2: 홈페이지 (1일)

- [ ] 심플 헤더 구현 (로고 + 다크모드)
- [ ] About 정보 홈에 통합
- [ ] 포스트 리스트 구현 (텍스트만, 최신순)
- [ ] 기존 검색/필터 제거

### Phase 3: 포스트 페이지 (1-2일)

- [ ] 포스트 레이아웃 구현
- [ ] 언어 스위처 구현 (🇰🇷/🇺🇸)
- [ ] 코드 블록 스타일링
- [ ] 코드 복사 버튼 추가

### Phase 4: 정리 (1일)

- [ ] 불필요한 컴포넌트/페이지 제거
- [ ] CSS 정리 및 최소화
- [ ] 테스트 및 배포

**예상 총 소요: 4-6일**

---

## 8. 성공 지표

| 지표 | 목표 |
|------|------|
| Lighthouse Performance | 95+ |
| 첫 페이지 로드 | < 1초 |
| 번들 사이즈 | < 50KB (JS) |
| 제거된 UI 요소 | 5개 이상 |
| 코드 라인 감소 | 30% 이상 |

---

## 9. 결정 사항 요약

| 항목 | 결정 |
|------|------|
| 다국어 처리 | 포스트 내 스위처 (🇰🇷/🇺🇸) |
| 검색 기능 | 제거 (스크롤로 탐색) |
| 시리즈 포스트 | 개별 포스트로 표시 |
| 카테고리/태그 | 메타데이터만 유지 (UI 숨김) |
| About 페이지 | 홈에 통합 |
| 포스트 정렬 | 최신순 |
| URL 구조 | 현재 유지 (SEO) |

---

## 10. 참고 링크

- **현재 블로그**: https://jayleekr.github.io/blog/
- **GitHub Repo**: https://github.com/jayleekr/jayleekr.github.io
- **레퍼런스 - overreacted.io**: https://overreacted.io
- **레퍼런스 - leerob.com**: https://leerob.com