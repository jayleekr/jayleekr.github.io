// Simple translation system
const translations = {
  ko: {
    "navigation.home": "홈",
    "navigation.about": "소개", 
    "navigation.blog": "Blog",
    "navigation.contact": "연락처",
    "hero.title": "Welcome to Jay's small world",
    "hero.subtitle": "Learner, Giver, Hooper",
    "hero.description": "",
    "about.title": "소개",
    "about.description": "임베디드 리눅스 시스템과 컨테이너 기술을 전문으로 하는 소프트웨어 엔지니어입니다.",
    "about.pageTitle": "Jay Lee 소개",
    "about.tagline": "모든 것에 대해 매우 호기심이 많은 사람",
    "about.tagline2": "농구 코트에서 매우 강한 피지컬 컨택을 즐기는 PF",
    "about.education": "학력",
    "about.bachelor": "전기전자컴퓨터공학부 학사",
    "about.masters": "석박사 통합과정 (휴학)",
    "about.vehicularComm": "차량 무선 통신 시스템",
    "about.basketball": "농구 경력",
    "about.representative": "대표 선수",
    "about.anyangCity": "경기도 안양시 (PF 포지션)",
    "about.fibaPlayer": "FIBA 3x3 선수",
    "about.teamYanadoo": "팀 야나두",
    "about.koreaRank": "2019년 1월 - 한국 랭킹 47위",
    "about.career": "경력",
    "about.softwareEngineer": "소프트웨어 엔지니어",
    "about.leadSDE": "선임 소프트웨어 개발 엔지니어",
    "about.assistantManager": "대리",
    "about.present": "현재",
    "about.seoul": "서울, 대한민국",
    "about.swSolutionDivision": "SW 솔루션 사업부 (3년간 대체복무)",
    "about.links": "링크",
    "about.connectMessage": "다양한 플랫폼에서 저와 연결해보세요!",
    "about.sonatusDesc": "미국 산호세에 본사를 둔 선도적인 자동차 소프트웨어 회사인 Sonatus에서 소프트웨어 엔지니어로 일하고 있습니다.",
    "about.autronDesc": "Adaptive AUTOSAR 플랫폼 개발팀에서 차세대 자동차 소프트웨어 플랫폼 개발에 기여했습니다.",
    "home.recentPosts": "최근 글",
    "home.skills": "기술 스택",
    "home.skillCategories.frontend": "Frontend",
    "home.skillCategories.backend": "Backend", 
    "home.skillCategories.devops": "DevOps",
    "home.skillCategories.cloud": "Cloud",
    "common.viewBlog": "블로그 보기",
    "common.viewAll": "전체 보기",
    "blog.noPosts": "아직 게시된 글이 없습니다.",
    "blog.noResults": "검색 결과가 없습니다",
    "blog.noResultsDesc": "다른 검색어나 필터를 시도해보세요.",
    "search.title": "사이트 검색",
    "search.placeholder": "검색어를 입력하세요...",
    "search.button": "검색",
    "search.close": "검색 닫기",
    "search.results": "개의 결과",
    "search.noResults": "검색 결과가 없습니다",
    "search.noResultsDesc": "다른 검색어로 시도해보세요",
    "search.recent": "최근 검색",
    "search.prompt": "결과를 보려면 검색어를 입력하세요"
  },
  en: {
    "navigation.home": "Home",
    "navigation.about": "About",
    "navigation.blog": "Blog", 
    "navigation.contact": "Contact",
    "hero.title": "Welcome to Jay's small world",
    "hero.subtitle": "Learner, Giver, Hooper",
    "hero.description": "",
    "about.title": "About Me",
    "about.description": "I'm a software engineer specializing in embedded Linux systems and container technologies.",
    "about.pageTitle": "About Jay Lee",
    "about.tagline": "Verrrrrrrrrry Curious person about everything",
    "about.tagline2": "PF enjoying a very intense physical contact on the basketball court",
    "about.education": "Education",
    "about.bachelor": "B.S. in Electrical and Computer Engineering",
    "about.masters": "M.S. and Ph.D Candidate",
    "about.vehicularComm": "Vehicular Wireless Communications Systems",
    "about.basketball": "Basketball Career",
    "about.representative": "Representative Player",
    "about.anyangCity": "Anyang City, Gyeonggi-do, Korea (PF position)",
    "about.fibaPlayer": "FIBA 3x3 Player",
    "about.teamYanadoo": "Team Yanadoo",
    "about.koreaRank": "Jan 2019 - 47th Korea Rank",
    "about.career": "Career Experience",
    "about.softwareEngineer": "Software Engineer",
    "about.leadSDE": "Lead Software Development Engineer",
    "about.assistantManager": "Assistant Manager",
    "about.present": "Present",
    "about.seoul": "Seoul, South Korea",
    "about.swSolutionDivision": "SW Solution Business Division (Alternative Military Service for 3 years)",
    "about.links": "Links",
    "about.connectMessage": "Feel free to connect with me on various platforms!",
    "about.sonatusDesc": "Working as a software engineer for Sonatus, a leading automotive software company based in San Jose.",
    "about.autronDesc": "Worked in the Adaptive AUTOSAR platform Development team, contributing to next-generation automotive software platforms.",
    "home.recentPosts": "Recent Posts",
    "home.skills": "Tech Stack",
    "home.skillCategories.frontend": "Frontend",
    "home.skillCategories.backend": "Backend",
    "home.skillCategories.devops": "DevOps", 
    "home.skillCategories.cloud": "Cloud",
    "common.viewBlog": "View Blog",
    "common.viewAll": "View All",
    "blog.noPosts": "No posts published yet.",
    "blog.noResults": "No search results found",
    "blog.noResultsDesc": "Try different keywords or filters.",
    "search.title": "Site Search",
    "search.placeholder": "Enter search terms...",
    "search.button": "Search",
    "search.close": "Close search",
    "search.results": " results",
    "search.noResults": "No search results found",
    "search.noResultsDesc": "Try different search terms",
    "search.recent": "Recent searches",
    "search.prompt": "Enter search terms to see results"
  }
};

export function getLangFromUrl(url: { pathname: string }): string {
  const [, lang] = url.pathname.split('/');
  if (lang === 'en') return 'en';
  return 'ko';
}

export function t(key: string, lang: string = 'ko'): string {
  const langTranslations = translations[lang as keyof typeof translations];
  return langTranslations?.[key as keyof typeof langTranslations] || key;
}

export function getAlternateLangPath(currentPath: string, currentLang: string): string {
  if (currentLang === 'ko') {
    return `/en${currentPath}`;
  } else {
    return currentPath.replace(/^\/en/, '') || '/';
  }
}