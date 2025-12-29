# 테스트 문서 (Test Documentation)

## 개요
이 문서는 jayleekr.github.io 블로그의 테스트 케이스, 테스트 전략, 그리고 커버리지 목표를 문서화합니다.

## 테스트 구조

### E2E 테스트 (Playwright)
현재 프로젝트는 Playwright를 사용하여 종합적인 E2E 테스트를 수행합니다.

#### 테스트 카테고리

1. **접근성 테스트 (`accessibility.spec.ts`)**
   - WCAG 2.1 AA 준수 검증
   - 키보드 네비게이션
   - 스크린 리더 호환성
   - 색상 대비

2. **다크모드 테스트 (`dark-mode-test.spec.ts`)**
   - 다크모드 토글 기능
   - 색상 스킴 전환
   - 로컬 스토리지 저장
   - 시각적 일관성

3. **레이아웃 테스트 (`layout.spec.ts`, `layout-measurements.spec.ts`)**
   - 그리드 시스템 검증
   - 컴포넌트 배치
   - 스페이싱 일관성
   - 오버랩 감지

4. **Markdown 렌더링 테스트 (`markdown-rendering.spec.ts`)**
   - 코드 블록 하이라이팅
   - 이미지 처리
   - 링크 렌더링
   - 테이블 포맷팅
   - GitHub 스타일 다크모드 호환성

5. **Mermaid 다이어그램 테스트 (`mermaid.spec.ts`)**
   - 다이어그램 렌더링
   - 테마 호환성
   - 반응형 크기 조정

6. **네비게이션 테스트 (`debug-navigation.spec.ts`, `phase2-navigation.spec.ts`)**
   - 메뉴 기능
   - 링크 유효성
   - 브레드크럼
   - 모바일 네비게이션

7. **성능 테스트 (`performance.spec.ts`)**
   - Core Web Vitals (LCP, FID, CLS)
   - 로딩 시간
   - 리소스 최적화
   - 캐싱 전략

8. **반응형 디자인 테스트 (`responsive.spec.ts`, `quick-responsive-test.spec.ts`)**
   - 모바일 뷰포트
   - 태블릿 뷰포트
   - 데스크톱 뷰포트
   - 브레이크포인트 전환

9. **사용자 경험 테스트 (`user-journeys.spec.ts`)**
   - 일반적인 사용자 플로우
   - 검색 기능
   - 댓글 시스템
   - 소셜 공유

10. **시각적 회귀 테스트 (`visual.spec.ts`)**
    - 스크린샷 기반 비교
    - 크로스 브라우저 일관성
    - 다크모드 시각적 검증

11. **PWA 및 Whimsy 기능 (`phase2-pwa-whimsy.spec.ts`)**
    - 오프라인 기능
    - 설치 프롬프트
    - 재미있는 인터랙션

## 테스트 실행

### 로컬 환경

```bash
# 개발 서버 시작
npm run dev

# 모든 테스트 실행
npm test

# 특정 테스트 파일 실행
npx playwright test tests/e2e/dark-mode-test.spec.ts

# UI 모드로 테스트 실행
npx playwright test --ui

# 특정 브라우저에서 테스트
npx playwright test --project=chromium
```

### CI/CD 환경

```bash
# CI 환경에서 테스트 실행
CI=true npm test

# 헤드리스 모드
npx playwright test --headed=false
```

## 테스트 커버리지 목표

### 현재 커버리지
- **E2E 테스트**: 18개 테스트 파일
- **브라우저 커버리지**: Chrome, Safari, Mobile Chrome, Mobile Safari
- **뷰포트 커버리지**: 모바일, 태블릿, 데스크톱, 와이드스크린

### 목표 커버리지
- **기능 커버리지**: 90% 이상
- **브라우저 호환성**: 95% 이상
- **접근성 점수**: 100점
- **성능 점수**: 90점 이상

## 테스트 데이터

### 테스트용 콘텐츠
- 다양한 Markdown 요소가 포함된 테스트 포스트
- 긴 콘텐츠와 짧은 콘텐츠
- 이미지가 많은 포스트
- 코드 블록이 많은 기술 포스트

### 모의 데이터
- 댓글 시스템 테스트용 모의 댓글
- 검색 테스트용 인덱스
- 네비게이션 테스트용 카테고리/태그

## 디버깅 가이드

### 일반적인 이슈

1. **포트 충돌**
   - 문제: 개발 서버가 이미 사용 중인 포트
   - 해결: `playwright.config.ts`에서 포트 변경

2. **타임아웃**
   - 문제: 느린 네트워크나 시스템에서 타임아웃
   - 해결: 타임아웃 값 증가

3. **스크린샷 불일치**
   - 문제: OS나 브라우저 버전 차이로 인한 픽셀 차이
   - 해결: 임계값 조정 또는 스냅샷 업데이트

### 디버깅 명령

```bash
# 디버그 모드로 실행
PWDEBUG=1 npx playwright test

# 트레이스 뷰어로 분석
npx playwright show-trace trace.zip

# 리포트 확인
npx playwright show-report
```

## 지속적 개선

### 월간 리뷰
- 테스트 실패율 분석
- 새로운 기능에 대한 테스트 추가
- 성능 메트릭 트렌드 분석

### 분기별 업데이트
- 브라우저 버전 업데이트
- 테스트 프레임워크 업그레이드
- 테스트 전략 재평가

## 관련 문서
- [TESTING_STRATEGY.md](./TESTING_STRATEGY.md) - 전체 테스트 전략
- [playwright.config.ts](./playwright.config.ts) - Playwright 설정
- [FEATURE_TEST_CHECKLIST.md](./FEATURE_TEST_CHECKLIST.md) - 기능별 테스트 체크리스트