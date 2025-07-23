/**
 * Social Media Content Templates
 * 
 * 소셜 미디어 포스팅을 위한 간단한 템플릿 생성기
 */

// 소셜 미디어 템플릿 생성 함수들
const SocialTemplates = {
    
    // LinkedIn 포스트 템플릿
    linkedin: {
        professional: (title, description, points) => `🚀 개발자라면 주목!

${title}

${description}

핵심 포인트 3가지:
→ ${points[0] || '첫 번째 인사이트'}
→ ${points[1] || '두 번째 인사이트'}
→ ${points[2] || '세 번째 인사이트'}

실무에 바로 적용할 수 있는 내용들을 상세히 다뤘습니다.

전체 내용은 블로그에서 확인하세요 ↓
[블로그 링크]

#개발자 #기술블로그 #IT #프로그래밍 #개발

💬 여러분의 경험도 댓글로 공유해주세요!`,

        experience: (title, lesson, takeaway) => `💡 최근 프로젝트에서 배운 것

${title}

${lesson}

핵심 깨달음:
${takeaway}

같은 상황을 경험하신 분들이 계실까요?
어떻게 해결하셨는지 궁금합니다!

더 자세한 내용: [블로그 링크]

#개발자경험 #커리어 #성장 #개발자 #기술`
    },

    // Twitter 스레드 템플릿  
    twitter: {
        thread: (title, points) => [
            `🧵 ${title}에 대한 개발자의 관점 (1/${points.length + 2})

최근 프로젝트에서 깨달은 것들을 공유합니다 👇`,
            ...points.map((point, index) => `${index + 2}/ ${point}`),
            `${points.length + 2}/ 전체 내용과 코드 예제는 블로그에서:

[블로그 링크]

#개발자 #기술 #프로그래밍`
        ],

        single: (insight, hashtags = ['개발자', '기술', 'IT']) => `💡 ${insight}

[블로그 링크에서 자세히]

${hashtags.map(tag => `#${tag}`).join(' ')}`
    },

    // Reddit 포스트 템플릿
    reddit: {
        discussion: (title, background, findings, question) => `# ${title}

## 배경
${background}

## 주요 발견사항
${findings.map((finding, i) => `${i + 1}. ${finding}`).join('\n')}

## 궁금한 점
${question}

여러분은 어떤 경험이 있으신가요?

---
더 자세한 내용은 [블로그 포스트]([링크])에서 확인할 수 있습니다.`,

        help: (problem, attempted, asking) => `# [도움 요청] ${problem}

## 시도해본 것들:
${attempted.map((attempt, i) => `- ${attempt}`).join('\n')}

## 질문:
${asking}

비슷한 경험이 있으신 분들의 조언을 구합니다!`
    }
};

// 사용 예시들
const examples = {
    newPost: {
        title: "2025년 개발자가 주목해야 할 기술 트렌드",
        description: "소프트웨어 엔지니어 관점에서 분석한 2025년 핵심 기술 트렌드와 실무 적용 전략",
        points: [
            "AI 개발 도구의 성숙화가 생산성을 크게 향상시킬 것",
            "클라우드 네이티브 기술이 엣지 컴퓨팅으로 확장",
            "웹 플랫폼 API가 네이티브 앱의 경계를 허물고 있음"
        ],
        blogUrl: "https://jayleekr.github.io/blog/2025-tech-trends-for-developers/"
    }
};

// 템플릿 사용법 출력
function showUsage() {
    /* eslint-disable no-console */
    console.log('📝 소셜 미디어 템플릿 사용법:');
    console.log('');
    console.log('1. LinkedIn 전문가 포스트:');
    console.log(SocialTemplates.linkedin.professional(
        examples.newPost.title,
        examples.newPost.description, 
        examples.newPost.points
    ));
    console.log('\n' + '='.repeat(50) + '\n');
    
    console.log('2. Twitter 스레드:');
    const twitterThread = SocialTemplates.twitter.thread(
        examples.newPost.title,
        examples.newPost.points
    );
    twitterThread.forEach((tweet, i) => {
        console.log(`트윗 ${i + 1}:`);
        console.log(tweet);
        console.log('');
    });
    
    console.log('='.repeat(50) + '\n');
    
    console.log('3. Reddit 토론 포스트:');
    console.log(SocialTemplates.reddit.discussion(
        examples.newPost.title,
        "최근 기술 트렌드를 분석하면서 느낀 점들을 정리해봤습니다.",
        examples.newPost.points,
        "여러분이 생각하는 2025년 가장 중요한 기술 변화는 무엇인가요?"
    ));
    /* eslint-enable no-console */
}

// 메인 실행 부분 (Node.js에서 직접 실행시)
if (typeof require !== 'undefined' && require.main === module) {
    showUsage();
}

// 브라우저나 다른 모듈에서 사용할 수 있도록 export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SocialTemplates, examples };
}

// ES6 export (modern environments)
if (typeof exports !== 'undefined') {
    exports.SocialTemplates = SocialTemplates;
    exports.examples = examples;
}