#!/usr/bin/env node

/**
 * Social Media Automation Script
 * 
 * 블로그 포스트 발행 시 자동으로 소셜 미디어 포스팅을 생성하는 도구
 * 
 * Usage: node scripts/social-media-automation.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class SocialMediaAutomator {
    constructor() {
        this.contentDir = path.join(__dirname, '../src/content/blog');
        this.templatesDir = path.join(__dirname, '../social-templates');
        this.outputDir = path.join(__dirname, '../social-content');
        
        // 플랫폼별 설정
        this.platforms = {
            linkedin: {
                maxLength: 1300,
                hashtags: 5,
                tone: 'professional'
            },
            twitter: {
                maxLength: 280,
                hashtags: 3,
                tone: 'casual'
            },
            reddit: {
                maxLength: 10000,
                hashtags: 0,
                tone: 'discussion'
            }
        };
        
        this.init();
    }

    init() {
        // 필요한 디렉토리 생성
        [this.templatesDir, this.outputDir].forEach(dir => {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
        });
        
        console.log('🚀 Social Media Automation 도구가 초기화되었습니다.');
    }

    // 최신 블로그 포스트 찾기
    getLatestPost() {
        try {
            const files = fs.readdirSync(this.contentDir)
                .filter(file => file.endsWith('.md'))
                .map(file => {
                    const filePath = path.join(this.contentDir, file);
                    const stat = fs.statSync(filePath);
                    return { file, path: filePath, mtime: stat.mtime };
                })
                .sort((a, b) => b.mtime - a.mtime);

            if (files.length === 0) {
                throw new Error('블로그 포스트를 찾을 수 없습니다.');
            }

            return files[0];
        } catch (error) {
            console.error('❌ 블로그 포스트를 읽는 중 오류:', error.message);
            return null;
        }
    }

    // 마크다운 파일에서 메타데이터 추출
    parseMarkdown(filePath) {
        try {
            const content = fs.readFileSync(filePath, 'utf-8');
            const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
            
            if (!frontmatterMatch) {
                throw new Error('Front matter를 찾을 수 없습니다.');
            }

            const frontmatter = frontmatterMatch[1];
            const body = frontmatterMatch[2];

            // YAML 파싱 (간단한 버전)
            const metadata = {};
            frontmatter.split('\n').forEach(line => {
                const match = line.match(/^(\w+):\s*(.+)$/);
                if (match) {
                    let value = match[2].replace(/^["']|["']$/g, '');
                    
                    // 배열 처리
                    if (value.startsWith('[') && value.endsWith(']')) {
                        value = value.slice(1, -1).split(',').map(item => 
                            item.trim().replace(/^["']|["']$/g, '')
                        );
                    }
                    
                    metadata[match[1]] = value;
                }
            });

            return { metadata, body, content };
        } catch (error) {
            console.error('❌ 마크다운 파싱 오류:', error.message);
            return null;
        }
    }

    // 해시태그 생성
    generateHashtags(categories, tags, platform, lang = 'ko') {
        const maxHashtags = this.platforms[platform].hashtags;
        const allTags = [...(categories || []), ...(tags || [])];
        
        const hashtagMap = {
            ko: {
                'Tech': '기술',
                'Career': '커리어', 
                'Startup': '스타트업',
                'Projects': '프로젝트',
                'AI': 'AI',
                'Development': '개발',
                'Programming': '프로그래밍'
            },
            en: {
                '기술': 'Tech',
                '커리어': 'Career',
                '스타트업': 'Startup', 
                '프로젝트': 'Projects'
            }
        };

        const baseHashtags = lang === 'ko' ? 
            ['개발자', '기술블로그', 'IT'] : 
            ['Developer', 'TechBlog', 'Programming'];

        const convertedTags = allTags.map(tag => {
            const converted = hashtagMap[lang] && hashtagMap[lang][tag];
            return converted || tag;
        });

        const selectedHashtags = [...new Set([...baseHashtags, ...convertedTags])]
            .slice(0, maxHashtags)
            .map(tag => `#${tag.replace(/\s+/g, '')}`);

        return selectedHashtags.join(' ');
    }

    // LinkedIn 포스트 생성
    generateLinkedInPost(metadata, body) {
        const { title, description, categories, tags, lang = 'ko' } = metadata;
        const blogUrl = `https://jayleekr.github.io/blog/${path.basename(metadata.slug || title.toLowerCase().replace(/\s+/g, '-'))}/`;
        
        const hooks = lang === 'ko' ? [
            '🚀 개발자라면 주목!',
            '💡 최근 프로젝트에서 배운 것',
            '🔍 기술 트렌드 분석:',
            '⚡ 실무에서 겪은 경험을 공유합니다',
            '🎯 이것만은 꼭 알아두세요!'
        ] : [
            '🚀 Developers, pay attention!',
            '💡 What I learned from recent project',
            '🔍 Tech trend analysis:',
            '⚡ Sharing real-world experience',
            '🎯 This is what you need to know!'
        ];

        const hook = hooks[Math.floor(Math.random() * hooks.length)];
        const hashtags = this.generateHashtags(categories, tags, 'linkedin', lang);
        
        // 본문에서 핵심 포인트 3개 추출 (간단한 버전)
        const points = this.extractKeyPoints(body, lang);
        
        const template = lang === 'ko' ? 
`${hook}

${title}

${description}

핵심 포인트 3가지:
${points.map((point, i) => `→ ${point}`).join('\n')}

실무에 바로 적용할 수 있는 내용들을 상세히 다뤘습니다.

전체 내용은 블로그에서 확인하세요 ↓
${blogUrl}

${hashtags}

💬 여러분의 경험도 댓글로 공유해주세요!` :
`${hook}

${title}

${description}

Key takeaways:
${points.map((point, i) => `→ ${point}`).join('\n')}

Detailed insights you can apply immediately in your work.

Read the full article on my blog ↓
${blogUrl}

${hashtags}

💬 Share your experience in the comments!`;

        return template.slice(0, this.platforms.linkedin.maxLength);
    }

    // Twitter 스레드 생성
    generateTwitterThread(metadata, body) {
        const { title, description, categories, tags, lang = 'ko' } = metadata;
        const blogUrl = `https://jayleekr.github.io/blog/${path.basename(metadata.slug || title.toLowerCase().replace(/\s+/g, '-'))}/`;
        
        const hashtags = this.generateHashtags(categories, tags, 'twitter', lang);
        const points = this.extractKeyPoints(body, lang);
        
        const thread = [];
        
        // 첫 번째 트윗
        const opener = lang === 'ko' ?
            `🧵 ${title}에 대한 개발자의 관점 (1/${points.length + 2})` :
            `🧵 A developer's perspective on ${title} (1/${points.length + 2})`;
        
        thread.push(`${opener}\n\n${description.slice(0, 200)}...`);
        
        // 각 포인트별 트윗
        points.forEach((point, index) => {
            const tweetNum = index + 2;
            thread.push(`${tweetNum}/ ${point}`);
        });
        
        // 마지막 트윗 (CTA)
        const closer = lang === 'ko' ?
            `${points.length + 2}/ 전체 내용과 코드 예제는 블로그에서:\n\n${blogUrl}\n\n${hashtags}` :
            `${points.length + 2}/ Full article with code examples:\n\n${blogUrl}\n\n${hashtags}`;
        
        thread.push(closer);
        
        return thread;
    }

    // Reddit 포스트 생성
    generateRedditPost(metadata, body) {
        const { title, description, categories, tags, lang = 'ko' } = metadata;
        const blogUrl = `https://jayleekr.github.io/blog/${path.basename(metadata.slug || title.toLowerCase().replace(/\s+/g, '-'))}/`;
        
        const points = this.extractKeyPoints(body, lang);
        
        const template = lang === 'ko' ?
`# ${title}

## 배경
최근 프로젝트에서 ${description}

## 주요 발견사항
${points.map((point, i) => `${i + 1}. ${point}`).join('\n')}

## 궁금한 점
여러분은 비슷한 상황에서 어떤 접근을 취하시나요? 
특히 ${categories && categories[0] ? categories[0] : '이 분야'}에서 다른 의견이나 경험이 있으시면 공유해주세요.

---
더 자세한 내용은 [블로그 포스트](${blogUrl})에서 확인할 수 있습니다.` :
`# ${title}

## Background
Recently working on a project where ${description}

## Key findings
${points.map((point, i) => `${i + 1}. ${point}`).join('\n')}

## Discussion
How do you approach similar situations? 
Would love to hear different perspectives, especially in ${categories && categories[0] ? categories[0] : 'this area'}.

---
More details in my [blog post](${blogUrl}).`;

        return template;
    }

    // 본문에서 핵심 포인트 추출 (간단한 구현)
    extractKeyPoints(body, lang = 'ko', count = 3) {
        const sentences = body
            .replace(/```[\s\S]*?```/g, '') // 코드 블록 제거
            .replace(/#{1,6}\s/g, '') // 헤더 마크다운 제거
            .split(/[.!?]\s+/)
            .filter(sentence => sentence.length > 20 && sentence.length < 200)
            .slice(0, 10); // 상위 10개 문장만 고려

        // 간단한 키워드 기반 중요도 점수
        const keywords = lang === 'ko' ? 
            ['중요', '핵심', '주요', '필수', '결과', '성능', '최적화', '문제', '해결', '방법'] :
            ['important', 'key', 'main', 'essential', 'result', 'performance', 'optimization', 'problem', 'solution', 'method'];

        const scoredSentences = sentences.map(sentence => {
            const score = keywords.reduce((acc, keyword) => {
                return acc + (sentence.toLowerCase().includes(keyword) ? 1 : 0);
            }, 0);
            return { sentence: sentence.trim(), score };
        });

        return scoredSentences
            .sort((a, b) => b.score - a.score)
            .slice(0, count)
            .map(item => item.sentence);
    }

    // 소셜 미디어 콘텐츠 생성 및 저장
    async generateContent() {
        console.log('📝 최신 블로그 포스트 분석 중...');
        
        const latestPost = this.getLatestPost();
        if (!latestPost) {
            return;
        }

        console.log(`📄 분석할 파일: ${latestPost.file}`);

        const parsed = this.parseMarkdown(latestPost.path);
        if (!parsed) {
            return;
        }

        const { metadata, body } = parsed;
        console.log(`📝 제목: ${metadata.title}`);

        const timestamp = new Date().toISOString().split('T')[0];
        const postId = path.basename(latestPost.file, '.md');

        // 각 플랫폼별 콘텐츠 생성
        const contents = {
            linkedin: this.generateLinkedInPost(metadata, body),
            twitter: this.generateTwitterThread(metadata, body),
            reddit: this.generateRedditPost(metadata, body)
        };

        // 파일로 저장
        Object.entries(contents).forEach(([platform, content]) => {
            const filename = `${timestamp}-${postId}-${platform}.txt`;
            const filepath = path.join(this.outputDir, filename);
            
            if (Array.isArray(content)) {
                // Twitter 스레드의 경우
                const threadContent = content.map((tweet, i) => 
                    `=== 트윗 ${i + 1} ===\n${tweet}\n`
                ).join('\n');
                fs.writeFileSync(filepath, threadContent, 'utf-8');
            } else {
                fs.writeFileSync(filepath, content, 'utf-8');
            }
            
            console.log(`✅ ${platform} 콘텐츠 생성: ${filename}`);
        });

        console.log(`\n🎉 모든 소셜 미디어 콘텐츠가 생성되었습니다!`);
        console.log(`📁 생성된 파일 위치: ${this.outputDir}`);
        
        this.showUsageInstructions();
    }

    // 사용법 안내
    showUsageInstructions() {
        console.log('\n📋 다음 단계:');
        console.log('1. 생성된 파일들을 확인하세요');
        console.log('2. 각 플랫폼에 맞게 내용을 수정하세요');
        console.log('3. Buffer나 Hootsuite에서 스케줄링하세요');
        console.log('\n💡 팁:');
        console.log('- LinkedIn: 전문적인 톤으로 수정');
        console.log('- Twitter: 더 캐주얼하게 조정');
        console.log('- Reddit: 커뮤니티 규칙 확인');
    }

    // 템플릿 생성 (최초 한번만 실행)
    createTemplates() {
        const templates = {
            'linkedin-template.md': `# LinkedIn 포스팅 템플릿

## 기본 구조
1. 어텐션 그래버 (🚀, 💡, 🔍 등 이모지 활용)
2. 제목/주제 제시
3. 간략한 설명
4. 핵심 포인트 3가지 (→ 사용)
5. CTA (Call to Action)
6. 블로그 링크
7. 해시태그
8. 댓글 유도

## 톤앤매너
- 전문적이지만 친근함
- 개인적 경험 포함
- 데이터나 구체적 예시 활용`,

            'twitter-template.md': `# Twitter 스레드 템플릿

## 구조
1. 훅이 되는 첫 트윗 (🧵 이모지로 스레드임을 표시)
2. 각 포인트별로 하나씩 트윗
3. 마지막은 블로그 링크와 해시태그

## 주의사항
- 각 트윗 280자 이내
- 번호 매기기 (1/, 2/, 3/)
- 해시태그는 3개 이내
- 이미지나 GIF 활용 고려`,

            'reddit-template.md': `# Reddit 포스팅 템플릿

## 구조
1. 제목 (커뮤니티에 맞게)
2. 배경 상황 설명
3. 구체적 내용/발견사항
4. 토론 유도 질문
5. 블로그 링크 (선택적)

## 주의사항
- 각 서브레딧 규칙 확인
- 자기 홍보로 보이지 않게
- 진정성 있는 토론 유도
- 해시태그 사용하지 않음`
        };

        Object.entries(templates).forEach(([filename, content]) => {
            const filepath = path.join(this.templatesDir, filename);
            if (!fs.existsSync(filepath)) {
                fs.writeFileSync(filepath, content, 'utf-8');
                console.log(`📄 템플릿 생성: ${filename}`);
            }
        });
    }

    // 통계 및 분석
    analyzeContent() {
        if (!fs.existsSync(this.outputDir)) {
            console.log('❌ 생성된 콘텐츠가 없습니다.');
            return;
        }

        const files = fs.readdirSync(this.outputDir);
        const stats = {};

        files.forEach(file => {
            const platform = file.split('-').pop().replace('.txt', '');
            if (!stats[platform]) stats[platform] = 0;
            stats[platform]++;
        });

        console.log('\n📊 생성된 콘텐츠 통계:');
        Object.entries(stats).forEach(([platform, count]) => {
            console.log(`- ${platform}: ${count}개`);
        });

        console.log(`\n총 ${files.length}개의 소셜 미디어 콘텐츠가 생성되었습니다.`);
    }

    // CLI 인터페이스
    async run() {
        const args = process.argv.slice(2);
        const command = args[0] || 'generate';

        switch (command) {
            case 'generate':
                await this.generateContent();
                break;
            case 'templates':
                this.createTemplates();
                break;
            case 'analyze':
                this.analyzeContent();
                break;
            case 'help':
                this.showHelp();
                break;
            default:
                console.log('❌ 알 수 없는 명령어입니다.');
                this.showHelp();
        }
    }

    showHelp() {
        console.log(`
🚀 Social Media Automation Tool

사용법: node scripts/social-media-automation.js [command]

명령어:
  generate   - 최신 블로그 포스트로 소셜 미디어 콘텐츠 생성 (기본값)
  templates  - 포스팅 템플릿 파일 생성
  analyze    - 생성된 콘텐츠 통계 확인
  help       - 이 도움말 표시

예시:
  node scripts/social-media-automation.js generate
  node scripts/social-media-automation.js templates
        `);
    }
}

// 스크립트 직접 실행시 자동으로 시작
if (import.meta.url === `file://${process.argv[1]}`) {
    const automator = new SocialMediaAutomator();
    automator.run().catch(console.error);
}

export default SocialMediaAutomator;