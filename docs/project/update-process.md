# 정기 업데이트 프로세스

## 1. 업데이트 주기

### 1.1 일일 업데이트
- **콘텐츠**: 새 블로그 포스트 작성 및 게시
- **수정사항**: 오타 수정, 링크 업데이트
- **모니터링**: 사이트 정상 작동 확인

### 1.2 주간 업데이트
- **의존성**: npm 패키지 보안 업데이트
- **성능**: Lighthouse 점수 체크
- **백업**: 전체 프로젝트 백업

### 1.3 월간 업데이트
- **주요 의존성**: Astro 및 주요 패키지 업데이트
- **보안**: 보안 취약점 스캔
- **리뷰**: 콘텐츠 품질 검토

## 2. 콘텐츠 업데이트

### 2.1 블로그 포스트 추가
```bash
# 1. 새 포스트 파일 생성
touch src/content/blog/YYYY-MM-DD-post-title.mdx

# 2. 프론트매터 템플릿
---
title: '포스트 제목'
description: '포스트 설명'
pubDate: 'YYYY-MM-DD'
heroImage: '/assets/img/post-image.jpg'
tags: ['tag1', 'tag2']
---

# 3. 로컬 미리보기
npm run dev

# 4. 빌드 확인
npm run build

# 5. 커밋 및 푸시
git add .
git commit -m "feat: Add new blog post - [title]"
git push origin master
```

### 2.2 이미지 최적화
```bash
# 1. 이미지 압축 (WebP 변환)
npx sharp-cli input.jpg --format webp --quality 80 -o output.webp

# 2. 적절한 디렉토리에 저장
cp output.webp public/assets/img/

# 3. MDX에서 참조
![설명](/assets/img/output.webp)
```

## 3. 의존성 업데이트

### 3.1 보안 업데이트 (주간)
```bash
# 1. 보안 취약점 확인
npm audit

# 2. 자동 수정
npm audit fix

# 3. 강제 수정 (주의)
npm audit fix --force

# 4. 테스트 실행
npm test
npm run build
```

### 3.2 일반 업데이트 (월간)
```bash
# 1. 오래된 패키지 확인
npm outdated

# 2. 안전한 업데이트 (마이너 버전)
npm update

# 3. 주요 버전 업데이트 (신중하게)
npm install package@latest

# 4. 호환성 테스트
npm run test
npm run build
npm run preview
```

### 3.3 Astro 업데이트
```bash
# 1. Astro 최신 버전 확인
npm info astro version

# 2. 업데이트 (변경사항 확인 필수)
npm install astro@latest

# 3. 관련 패키지 업데이트
npm install @astrojs/mdx@latest @astrojs/sitemap@latest

# 4. 설정 파일 마이그레이션 (필요시)
# astro.config.mjs 확인 및 수정

# 5. 전체 테스트
npm run build
```

## 4. 성능 모니터링

### 4.1 Lighthouse 체크 (주간)
```bash
# 1. Lighthouse CI 실행
npx lighthouse https://jayleekr.github.io \
  --output html \
  --output-path ./lighthouse-report.html

# 2. 주요 지표 확인
# - Performance: 90+ 목표
# - Accessibility: 100 목표
# - Best Practices: 100 목표
# - SEO: 100 목표
```

### 4.2 번들 크기 분석 (월간)
```bash
# 1. 번들 분석
npm run build

# 2. 크기 확인
du -sh dist/

# 3. 상세 분석 (필요시)
npx vite-bundle-visualizer
```

## 5. SEO 및 접근성

### 5.1 SEO 체크리스트 (월간)
- [ ] 메타 태그 업데이트
- [ ] 사이트맵 생성 확인
- [ ] robots.txt 검토
- [ ] 구조화된 데이터 검증
- [ ] Open Graph 태그 확인

### 5.2 접근성 체크리스트 (월간)
- [ ] 키보드 네비게이션 테스트
- [ ] 스크린 리더 호환성
- [ ] 색상 대비 확인
- [ ] ARIA 레이블 검토
- [ ] 포커스 표시 확인

## 6. 자동화 스크립트

### 6.1 일일 업데이트 스크립트
```bash
#!/bin/bash
# daily-update.sh

echo "=== Daily Update Starting ==="

# 1. Git 상태 확인
git status

# 2. 최신 변경사항 풀
git pull origin master

# 3. 로컬 빌드 테스트
npm run build

# 4. 사이트 상태 확인
curl -I https://jayleekr.github.io

echo "=== Daily Update Complete ==="
```

### 6.2 주간 업데이트 스크립트
```bash
#!/bin/bash
# weekly-update.sh

echo "=== Weekly Update Starting ==="

# 1. 보안 업데이트
npm audit fix

# 2. 의존성 업데이트
npm update

# 3. 테스트 실행
npm test

# 4. 빌드 확인
npm run build

# 5. Lighthouse 실행
npx lighthouse https://jayleekr.github.io --output json > lighthouse-report.json

# 6. 백업 생성
./backup.sh

echo "=== Weekly Update Complete ==="
```

## 7. 체크리스트

### 7.1 배포 전 체크리스트
- [ ] 모든 테스트 통과
- [ ] 빌드 성공
- [ ] 이미지 최적화
- [ ] 링크 검증
- [ ] 모바일 반응형 확인
- [ ] 브라우저 호환성 테스트

### 7.2 배포 후 체크리스트
- [ ] 사이트 접속 확인
- [ ] 주요 페이지 로딩 테스트
- [ ] 검색 기능 작동 확인
- [ ] 폼 제출 테스트
- [ ] 404 페이지 확인
- [ ] SSL 인증서 상태

## 8. 트러블슈팅

### 8.1 빌드 실패
```bash
# 1. 캐시 삭제
rm -rf node_modules .astro dist

# 2. 의존성 재설치
npm install

# 3. 빌드 재시도
npm run build
```

### 8.2 배포 실패
```bash
# 1. GitHub Actions 로그 확인
# GitHub 저장소 > Actions 탭

# 2. 로컬에서 프로덕션 빌드 테스트
npm run build
npm run preview

# 3. 환경 변수 확인
# GitHub 저장소 > Settings > Secrets
```

### 8.3 성능 저하
```bash
# 1. 이미지 크기 확인
find public/assets/img -type f -size +1M

# 2. 번들 크기 분석
npm run build -- --analyze

# 3. 불필요한 의존성 제거
npm prune
```

## 9. 모니터링 도구

### 9.1 Google Search Console
- 주간 크롤링 오류 확인
- 검색 성능 모니터링
- 사이트맵 상태 확인

### 9.2 Google Analytics
- 일일 트래픽 확인
- 인기 콘텐츠 분석
- 사용자 행동 패턴 분석

### 9.3 Uptime 모니터링
- UptimeRobot 또는 Pingdom 설정
- 다운타임 알림 설정
- 응답 시간 추적

## 10. 문서 업데이트

### 10.1 README.md
- 새로운 기능 추가 시 업데이트
- 설치 및 실행 방법 최신화
- 기여 가이드라인 유지

### 10.2 CHANGELOG.md
- 모든 변경사항 기록
- 버전 관리 (Semantic Versioning)
- 주요 변경사항 하이라이트

---

최종 업데이트: 2025-01-14