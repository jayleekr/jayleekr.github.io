# Blog Style Cheatsheet 🎨

## 🎯 Quick Reference

### 색상 클래스 (Tailwind)

#### Primary Colors
```
text-primary-600 dark:text-primary-400  // 링크, 강조
bg-primary-50 dark:bg-primary-900/30    // 배경
border-primary-200 dark:border-primary-800  // 테두리
```

#### Text Colors
```
text-gray-900 dark:text-gray-100        // 제목
text-gray-700 dark:text-gray-300        // 본문
text-gray-600 dark:text-gray-400        // 보조 텍스트
text-gray-500 dark:text-gray-500        // 메타 정보
```

#### Background Colors
```
bg-white dark:bg-gray-900               // 메인 배경
bg-gray-50 dark:bg-gray-800             // 섹션 배경
bg-gray-100 dark:bg-gray-800            // 카드 배경
```

### 타이포그래피 클래스

#### 제목
```
text-6xl font-extrabold                 // H1
text-5xl font-bold                      // H2  
text-4xl font-semibold                  // H3
text-3xl font-semibold                  // H4
text-2xl font-medium                    // H5
text-xl font-medium                     // H6
```

#### 본문
```
text-base leading-relaxed               // 기본 본문
text-lg leading-relaxed                 // 큰 본문
text-sm                                 // 작은 텍스트
text-xs uppercase tracking-wider        // 라벨
```

### 간격 (Spacing)

#### Padding
```
p-4     // 1rem
p-6     // 1.5rem
p-8     // 2rem
px-4 py-2  // 가로 1rem, 세로 0.5rem
```

#### Margin
```
mb-4    // margin-bottom 1rem
mb-6    // margin-bottom 1.5rem
mb-8    // margin-bottom 2rem
my-8    // margin y축 2rem
mt-12   // margin-top 3rem
```

### 컴포넌트 스타일

#### 버튼
```html
<!-- Primary Button -->
<button class="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-all duration-200 hover:scale-105">
  버튼 텍스트
</button>

<!-- Secondary Button -->
<button class="px-6 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-all">
  버튼 텍스트
</button>

<!-- Ghost Button -->
<button class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
  버튼 텍스트
</button>
```

#### 카드
```html
<!-- Basic Card -->
<div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-300">
  카드 내용
</div>

<!-- Hover Effect Card -->
<div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg hover:border-primary-300 dark:hover:border-primary-700 transition-all duration-300">
  카드 내용
</div>
```

#### 태그와 배지
```html
<!-- Category Badge -->
<span class="px-4 py-2 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-lg text-sm font-medium border border-primary-200 dark:border-primary-800">
  카테고리
</span>

<!-- Tag -->
<span class="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md text-sm font-medium">
  #태그
</span>

<!-- Status Badge -->
<span class="px-2.5 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-full text-xs font-semibold">
  완료
</span>
```

### 레이아웃 패턴

#### Container
```html
<!-- Main Container -->
<div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
  내용
</div>

<!-- Wide Container -->
<div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
  내용
</div>

<!-- Article Container -->
<article class="max-w-4xl mx-auto px-4 py-16">
  내용
</article>
```

#### Grid Layouts
```html
<!-- 2 Column Grid -->
<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
  <div>컬럼 1</div>
  <div>컬럼 2</div>
</div>

<!-- 3 Column Grid -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <div>컬럼 1</div>
  <div>컬럼 2</div>
  <div>컬럼 3</div>
</div>
```

### 유틸리티 클래스

#### 호버 효과
```
hover:scale-105                         // 확대
hover:shadow-lg                         // 그림자
hover:bg-gray-100                       // 배경 변경
hover:text-primary-600                  // 텍스트 색상 변경
hover:border-primary-300                // 테두리 색상 변경
```

#### 트랜지션
```
transition-all duration-200             // 모든 속성 전환
transition-colors duration-200          // 색상만 전환
transition-transform duration-300       // 변형만 전환
```

#### 둥근 모서리
```
rounded-md      // 중간 둥글게
rounded-lg      // 크게 둥글게
rounded-xl      // 더 크게 둥글게
rounded-full    // 완전히 둥글게
```

### 반응형 프리픽스

```
sm:     // 640px 이상
md:     // 768px 이상
lg:     // 1024px 이상
xl:     // 1280px 이상
2xl:    // 1536px 이상
```

예시:
```html
<div class="text-sm md:text-base lg:text-lg">
  반응형 텍스트
</div>
```

### 자주 사용하는 패턴

#### 플렉스 센터링
```html
<div class="flex items-center justify-center">
  중앙 정렬된 내용
</div>
```

#### 스페이스 비트윈
```html
<div class="flex justify-between items-center">
  <div>왼쪽</div>
  <div>오른쪽</div>
</div>
```

#### 오버플로우 처리
```html
<div class="overflow-hidden text-ellipsis whitespace-nowrap">
  긴 텍스트가 잘립니다...
</div>
```

#### 그라데이션 배경
```html
<div class="bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20">
  그라데이션 배경
</div>
```

### 접근성 클래스

#### 스크린 리더 전용
```html
<span class="sr-only">스크린 리더만 읽는 텍스트</span>
```

#### 포커스 스타일
```html
<button class="focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
  포커스 가능한 버튼
</button>
```

### 다크모드 토글

항상 `dark:` 프리픽스 사용:
```html
<div class="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
  다크모드 지원 요소
</div>
```

## 📝 빠른 복사용 스니펫

### 섹션 구분선
```html
<hr class="border-0 border-t border-gray-200 dark:border-gray-700 my-8" />
```

### 링크 스타일
```html
<a href="#" class="text-primary-600 dark:text-primary-400 underline decoration-2 underline-offset-2 hover:text-primary-700 dark:hover:text-primary-300">
  링크 텍스트
</a>
```

### 코드 인라인
```html
<code class="px-2 py-0.5 text-sm bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
  코드
</code>
```

### 목록 스타일
```html
<ul class="space-y-2 text-gray-700 dark:text-gray-300">
  <li class="flex items-start">
    <span class="text-primary-600 dark:text-primary-400 mr-2">•</span>
    <span>목록 항목</span>
  </li>
</ul>
```

### 인용구
```html
<blockquote class="border-l-4 border-primary-500 pl-6 py-4 my-8 bg-gray-50 dark:bg-gray-800/50 rounded-r-lg">
  <p class="text-lg text-gray-700 dark:text-gray-300 italic">
    인용문 내용
  </p>
</blockquote>
```

---

**Pro Tip**: VSCode에서 `.vscode/blog-snippets.code-snippets` 파일을 사용하면 이러한 패턴들을 빠르게 삽입할 수 있습니다!