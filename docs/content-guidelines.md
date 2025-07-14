# 콘텐츠 관리 가이드라인

## 1. 콘텐츠 작성 원칙

### 1.1 톤 앤 매너
- **전문적이면서 친근한 톤**: 기술적 정확성을 유지하면서도 읽기 쉽게 작성
- **한국어 기본**: 한국어를 기본으로 하되, 기술 용어는 영어 병기
- **독자 중심**: 독자가 이해하고 활용할 수 있는 실용적인 내용

### 1.2 콘텐츠 품질 기준
- **정확성**: 기술적 내용의 정확성 검증
- **최신성**: 최신 버전과 트렌드 반영
- **완결성**: 독립적으로 이해 가능한 내용
- **실용성**: 실제 적용 가능한 예제 포함

## 2. 블로그 포스트 작성

### 2.1 파일 명명 규칙
```
src/content/blog/YYYY-MM-DD-post-title-in-english.mdx
```
- 날짜 형식: YYYY-MM-DD
- 제목: 소문자, 하이픈으로 단어 구분
- 확장자: .mdx (MDX 형식)

### 2.2 프론트매터 템플릿
```yaml
---
title: '포스트 제목 (한국어)'
description: '포스트 요약 설명 (150자 이내)'
pubDate: 'YYYY-MM-DD'
updatedDate: 'YYYY-MM-DD'  # 선택사항
heroImage: '/assets/img/post/hero-image.jpg'  # 선택사항
tags: ['JavaScript', 'React', 'Web Development']
category: 'Development'  # Development, DevOps, Career, etc.
draft: false  # true일 경우 게시되지 않음
---
```

### 2.3 포스트 구조
```markdown
# 제목

## 소개
포스트의 목적과 다룰 내용을 간단히 소개

## 목차
- [섹션 1](#섹션-1)
- [섹션 2](#섹션-2)
- [결론](#결론)

## 섹션 1
### 소제목
내용...

## 섹션 2
### 소제목
내용...

## 결론
핵심 내용 요약 및 다음 단계 제시

## 참고 자료
- [링크 제목](URL)
- [링크 제목](URL)
```

## 3. 이미지 관리

### 3.1 이미지 저장 위치
```
public/assets/img/
├── post/           # 블로그 포스트 이미지
│   └── YYYY/       # 연도별 폴더
├── projects/       # 프로젝트 이미지
├── profile/        # 프로필 이미지
└── misc/          # 기타 이미지
```

### 3.2 이미지 명명 규칙
- 소문자 사용
- 공백 대신 하이픈(-) 사용
- 설명적인 이름 사용
- 예: `react-component-lifecycle-diagram.png`

### 3.3 이미지 최적화
```bash
# WebP 변환 (권장)
npx sharp-cli input.jpg --format webp --quality 85 -o output.webp

# 크기 조정
npx sharp-cli input.jpg --resize 1200 --withoutEnlargement -o output.jpg

# 일괄 처리
for img in *.jpg; do
  npx sharp-cli "$img" --format webp --quality 85 -o "${img%.jpg}.webp"
done
```

### 3.4 이미지 사용 가이드
- 최대 너비: 1200px
- 파일 크기: 500KB 이하 권장
- 형식: WebP 우선, JPG/PNG 대체
- Alt 텍스트: 반드시 포함

## 4. 코드 블록 작성

### 4.1 기본 코드 블록
````markdown
```javascript
// 언어 명시 필수
const greeting = 'Hello, World!';
console.log(greeting);
```
````

### 4.2 파일명 표시
````markdown
```javascript title="src/components/Button.jsx"
export const Button = ({ children, onClick }) => {
  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
};
```
````

### 4.3 라인 하이라이트
````markdown
```javascript {2,4-6}
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);  // 하이라이트

// 여러 줄 하이라이트
const sum = doubled.reduce((acc, cur) => {
  return acc + cur;
}, 0);
```
````

## 5. SEO 최적화

### 5.1 제목 최적화
- H1: 포스트당 하나만 사용 (제목)
- H2-H3: 논리적 계층 구조 유지
- 키워드 자연스럽게 포함

### 5.2 메타 설명
- 150-160자 이내
- 핵심 키워드 포함
- 클릭을 유도하는 문구

### 5.3 태그 사용
- 관련성 높은 태그만 선택
- 3-5개 권장
- 일관된 태그 체계 유지

## 6. 카테고리 분류

### 6.1 주요 카테고리
- **Development**: 프로그래밍, 프레임워크, 라이브러리
- **DevOps**: CI/CD, 클라우드, 인프라
- **Career**: 커리어 개발, 면접, 성장
- **Review**: 책, 강의, 도구 리뷰
- **Project**: 프로젝트 소개 및 회고

### 6.2 태그 체계
```yaml
# 기술 스택
tags: ['JavaScript', 'TypeScript', 'React', 'Node.js']

# 주제
tags: ['Performance', 'Security', 'Testing', 'Architecture']

# 레벨
tags: ['Beginner', 'Intermediate', 'Advanced']
```

## 7. 링크 관리

### 7.1 내부 링크
```markdown
[관련 포스트](/blog/2024-01-15-related-post)
[프로젝트 페이지](/projects/project-name)
```

### 7.2 외부 링크
```markdown
[MDN Web Docs](https://developer.mozilla.org){:target="_blank" rel="noopener noreferrer"}
```

### 7.3 앵커 링크
```markdown
[섹션으로 이동](#섹션-제목)
```

## 8. 콘텐츠 검토 체크리스트

### 8.1 작성 전
- [ ] 주제가 독자에게 가치 있는가?
- [ ] 유사한 콘텐츠가 이미 있는가?
- [ ] 충분한 자료 조사를 했는가?

### 8.2 작성 중
- [ ] 명확한 구조를 가지고 있는가?
- [ ] 예제 코드가 작동하는가?
- [ ] 이미지가 적절히 사용되었는가?

### 8.3 게시 전
- [ ] 맞춤법 검사 완료
- [ ] 코드 문법 검증
- [ ] 링크 작동 확인
- [ ] 메타 정보 작성
- [ ] 모바일 미리보기 확인

## 9. 버전 관리

### 9.1 초안 관리
```yaml
---
draft: true  # 초안 상태
---
```

### 9.2 업데이트 기록
```yaml
---
updatedDate: 'YYYY-MM-DD'
updateNote: '섹션 3 내용 추가 및 예제 코드 업데이트'
---
```

### 9.3 주요 변경사항
- 포스트 하단에 업데이트 노트 추가
- 중요한 변경은 별도 포스트 작성 고려

## 10. 협업 가이드

### 10.1 기여 프로세스
1. 이슈 생성 또는 논의
2. 포크 및 브랜치 생성
3. 콘텐츠 작성
4. Pull Request 제출
5. 리뷰 및 수정
6. 머지 및 게시

### 10.2 리뷰 기준
- 기술적 정확성
- 가독성 및 구조
- 코드 예제 품질
- SEO 최적화
- 이미지 최적화

### 10.3 피드백 반영
- 건설적인 피드백 수용
- 변경사항 명확히 기록
- 리뷰어에게 감사 표시

## 11. 법적 고려사항

### 11.1 저작권
- 출처 명시 필수
- 라이선스 확인
- 인용 규칙 준수

### 11.2 개인정보
- 개인정보 포함 금지
- 회사 기밀 정보 제외
- 민감한 데이터 마스킹

### 11.3 면책 조항
- 필요시 면책 조항 추가
- 책임 한계 명시

## 12. 분석 및 개선

### 12.1 성과 측정
- 페이지뷰 및 체류 시간
- 공유 및 댓글 수
- 검색 유입 키워드

### 12.2 개선 사항
- 독자 피드백 반영
- 오래된 콘텐츠 업데이트
- 인기 주제 추가 작성

### 12.3 A/B 테스트
- 제목 변형 테스트
- 썸네일 이미지 테스트
- 콘텐츠 구조 실험

---

최종 업데이트: 2025-01-14