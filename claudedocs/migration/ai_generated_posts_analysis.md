# AI-Generated Posts Analysis

**Date**: 2025-12-22
**Purpose**: Identify AI-generated blog posts for user verification before deletion

## Methodology

Analyzed blog posts for AI-generation markers:
- **Tone Analysis**: Overly friendly/casual tone inconsistent with user's technical writing style
- **Content Type**: Generic tech topics (trends, tutorials, best practices)
- **Structure**: Perfect formatting, comprehensive coverage, tutorial-style
- **Date Analysis**: Future-dated posts from creation time (though not definitive)
- **Author Voice**: Compare against authentic user posts (retrospectives, technical deep-dives)

## Confirmed AI-Generated Posts

### 1. Tech Trends Series (3 versions)
**High Confidence: 95%**

**Files:**
- `src/content/blog/2025-tech-trends-for-developers.md`
- `src/content/blog/en/2025-tech-trends-for-developers.md`
- `src/content/blog/ko/2025-tech-trends-for-developers.md`

**pubDate:** 2025-01-22

**AI Markers:**
- ❌ Overly conversational opening: "Hello everyone! As the new year begins, I'm sure many of you are wondering..."
- ❌ Generic broad topic: "2025 tech trends" - typical AI content
- ❌ Perfect structure with roadmaps, tables, matrices
- ❌ Emoji usage in casual context (🚀, inconsistent with user's style)
- ❌ Tone doesn't match user's authentic retrospectives

**Evidence:**
```markdown
# 2025년, 우리가 함께 주목해야 할 기술 이야기

안녕하세요! 새해가 시작되면서 많은 분들이 "올해는 어떤 기술을 배워야 할까?"라는 고민을 하고 계실 것 같아요.
```

**Verdict:** AI-generated generic tech trends content

---

### 2. Microservices with Kubernetes Series (3 versions)
**High Confidence: 98%**

**Files:**
- `src/content/blog/building-scalable-microservices-with-kubernetes.md` (Korean)
- `src/content/blog/en/building-scalable-microservices-with-kubernetes.md` (English)
- `src/content/blog/ko/building-scalable-microservices-with-kubernetes.md` (Korean duplicate)

**pubDate:** 2025-01-18

**AI Markers:**
- ❌ Extremely casual tone: "안녕하세요! 오늘은 지난 1년간 제가 겪었던 마이크로서비스 도입 여정을 솔직하게 풀어보려고 해요"
- ❌ Emojis throughout: 😅, 😊 (not consistent with user's technical posts)
- ❌ Overly detailed, perfect tutorial structure
- ❌ Generic microservices topic with comprehensive coverage
- ❌ "삽질과 깨달음의 1년" (1 year of trial and error) - generic AI narrative
- ❌ 450+ lines of perfectly formatted tutorial content

**Evidence:**
```markdown
# 마이크로서비스 여행기: 삽질과 깨달음의 1년

안녕하세요! 오늘은 지난 1년간 제가 겪었던 마이크로서비스 도입 여정을 솔직하게 풀어보려고 해요. 성공담보다는 실패담이 더 많을 수도 있는데, 그래도 누군가에게는 도움이 될 것 같아서 용기를 내어 써봅니다.
```

**Verdict:** AI-generated tutorial-style content

---

## Summary Statistics

| Metric | Count |
|--------|-------|
| Total AI Posts Identified | 6 files (2 topics × 3 language versions) |
| High Confidence (>90%) | 6 files |
| Medium Confidence (70-90%) | 0 files |
| Low Confidence (<70%) | 0 files |

## Comparison with Authentic User Content

### Authentic User Writing Style (from retrospectives):

**From:** `DeepThinking/Retrospect/2021-04-15-retro.mdx`
```markdown
간만에 일기 겸 긴 글을 남기고 싶어서 이 글을 시작한다.

필자는 Adaptive AUTOSAR 표준 기반 플랫폼 개발을 해온지 일년반정도 됐다.

Adaptive AUTOSAR는 AUTOSAR 컨소시엄에서 제정해오고있는...
```
- **Style**: Direct, technical, no excessive friendliness
- **Tone**: Reflective, personal without being overly casual
- **Format**: Natural flow, not tutorial-structured

**From:** `DeepThinking/Retrospect/2021-12-31-retro.mdx`
```markdown
2021년은 내 짧은 커리어 역사상(?) 가장 다이나믹했던 해 였던 것 같다.

올해 머리속에 자리잡은 강렬한 기억들의 대부분은 Sonatus와 조금이라도 연결된 걸보니 올해는 온통 내 머리속에 Sonatus 뿐인듯 하다.
```
- **Style**: Personal reflection, natural Korean
- **Tone**: Genuine introspection, specific experiences
- **Format**: Free-flowing narrative, not structured tutorial

### AI-Generated Writing Style:

```markdown
# 2025년, 우리가 함께 주목해야 할 기술 이야기

안녕하세요! 새해가 시작되면서 많은 분들이 "올해는 어떤 기술을 배워야 할까?"라는 고민을 하고 계실 것 같아요.
```
- **Style**: Overly friendly greeting, assumes broad audience
- **Tone**: Generic, tutorial-like, not personal
- **Format**: Perfect structure with sections, roadmaps, tables

## Key Differentiators

| Aspect | Authentic User Posts | AI-Generated Posts |
|--------|---------------------|-------------------|
| Opening | Direct, natural | "안녕하세요!" with generic greeting |
| Tone | Technical, reflective | Overly friendly, tutorial-style |
| Emojis | Rare or none | Frequent (😅, 😊, 🚀) |
| Structure | Natural flow | Perfect sections, tables, roadmaps |
| Topics | Specific experiences | Generic tech topics |
| Language | Natural, varied | Polished, consistent |

## Recommended Actions

1. **Delete All 6 Files:**
   - All 3 versions of tech trends posts
   - All 3 versions of microservices posts

2. **Build Verification:**
   - Run `npm run build` after deletion
   - Expected: Page count reduction from 132 to ~126

3. **Git Commit:**
   - Message: "content: Remove AI-generated tech tutorial posts"
   - Include list of deleted files in commit message

## Additional Notes

- User's authentic writing style is technical, direct, and personally reflective
- AI posts have generic topics with perfect tutorial structure
- Future content should maintain authentic voice and specific experiences
- Consider content review process to prevent AI content from being published
