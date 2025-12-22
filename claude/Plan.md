# Implementation Plan: 극 미니멀 리팩토링

> **Based on**: PRD.md - Jay's Blog Ultra Minimal Refactoring
> **Created**: 2025-12-22
> **Target**: 4-6 day implementation
> **Status**: Ready for Execution

---

## Executive Summary

Transform jayleekr.github.io into an **overreacted.io-style ultra-minimalist blog** focused on text-first reading experience while maintaining 100% content preservation and SEO integrity.

### Core Objectives
1. ✅ Remove all UI distractions (search, filters, thumbnails)
2. ✅ Text-first design with optimal typography
3. ✅ Maintain 129 posts + existing URLs
4. ✅ Add View Transitions + improved UX
5. ✅ Achieve <1s load time, 95+ Lighthouse

---

## Phase 0: Pre-Implementation Analysis

### 0.1 Current State Audit

**Components to Remove:**
```
src/components/
├── GlobalSearch.astro          ❌ Remove
├── CategoryHierarchy.astro     ❌ Remove
├── CategoryFilter.astro        ❌ Remove
├── TagCloud.astro              ❌ Remove
├── ArticleCard.astro           ❌ Replace with minimal PostItem
├── Newsletter.astro            ❌ Remove
├── SocialShare.astro           ❌ Remove (optional keep)
└── TableOfContents.astro       ❌ Remove
```

**Pages to Remove/Modify:**
```
src/pages/
├── about.astro                 ❌ Remove (merge into index)
├── categories/[category].astro ❌ Remove
├── tags/[tag].astro            ❌ Remove
└── search.astro                ❌ Remove
```

**Components to Keep:**
```
src/components/
├── ThemeToggle.astro           ✅ Keep (simplify)
├── BaseHead.astro              ✅ Keep (update meta)
└── CodeBlock.astro             ✅ Keep (add copy button)
```

### 0.2 Dependency Analysis

**No New Dependencies Required:**
- View Transitions: Built into Astro 3.0+
- System fonts: No font loading needed
- Minimal Tailwind: Use only utility classes

**Dependencies to Remove:**
- None required (keep existing for backward compatibility)

### 0.3 Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| SEO regression | HIGH | Keep all URLs, add redirects, maintain metadata |
| Content loss | HIGH | No content modification, only layout changes |
| User confusion | MEDIUM | Clear navigation, gradual rollout option |
| Performance regression | LOW | Actually improving (removing features) |
| Build failure | MEDIUM | Incremental changes, test after each phase |

---

## Phase 1: Foundation & Design System (Day 1-2)

### 1.1 Design System Setup

**Task 1.1.1: Create CSS Variables**
```css
/* src/styles/global.css - NEW minimal version */

:root {
  /* Colors - Light Mode */
  --bg: #ffffff;
  --text: #1a1a1a;
  --text-secondary: #666666;
  --link: #0070f3;
  --link-hover: #0051cc;
  --code-bg: #f5f5f5;
  --border: #e5e5e5;

  /* Typography */
  --font-body: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-mono: 'SF Mono', Monaco, 'Cascadia Code', monospace;

  /* Spacing */
  --content-max-width: 680px;
  --content-padding: 24px;
  --post-gap: 48px;
  --section-gap: 32px;

  /* Typography Scale */
  --text-xs: 0.75rem;      /* 12px */
  --text-sm: 0.875rem;     /* 14px */
  --text-base: 1.125rem;   /* 18px */
  --text-lg: 1.5rem;       /* 24px */
  --text-xl: 2rem;         /* 32px */
}

[data-theme="dark"] {
  --bg: #121212;
  --text: #e5e5e5;
  --text-secondary: #888888;
  --link: #58a6ff;
  --link-hover: #79b8ff;
  --code-bg: #1e1e1e;
  --border: #333333;
}

/* Base Styles - Minimal */
body {
  font-family: var(--font-body);
  font-size: var(--text-base);
  line-height: 1.7;
  color: var(--text);
  background-color: var(--bg);
  max-width: var(--content-max-width);
  margin: 0 auto;
  padding: var(--content-padding);
}

/* Reset Tailwind Typography (remove complex prose styles) */
.prose { /* Simplified prose */ }
```

**Task 1.1.2: Update Tailwind Config**
```javascript
// tailwind.config.mjs - MINIMAL version
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      fontFamily: {
        sans: 'var(--font-body)',
        mono: 'var(--font-mono)',
      },
      maxWidth: {
        'content': 'var(--content-max-width)',
      },
    },
  },
  plugins: [
    // Remove @tailwindcss/typography or simplify drastically
  ],
};
```

**Task 1.1.3: Enable View Transitions**
```javascript
// astro.config.mjs - ADD View Transitions
import { defineConfig } from 'astro/config';

export default defineConfig({
  // ... existing config
  experimental: {
    viewTransitions: true  // Enable page transitions
  },
  markdown: {
    shikiConfig: {
      theme: 'github-dark-dimmed',  // Single dark theme
    }
  }
});
```

### 1.2 Base Layout Refactor

**Task 1.2.1: Create Minimal BaseLayout**
```astro
<!-- src/layouts/BaseLayout.astro - SIMPLIFIED -->
---
import BaseHead from '../components/BaseHead.astro';
import ThemeToggle from '../components/ThemeToggle.astro';
import { ViewTransitions } from 'astro:transitions';

interface Props {
  title: string;
  description?: string;
}

const { title, description } = Astro.props;
---

<!DOCTYPE html>
<html lang="ko">
  <head>
    <BaseHead title={title} description={description} />
    <ViewTransitions />
  </head>
  <body>
    <header>
      <nav>
        <a href="/" class="logo">Jay Lee's Blog</a>
        <ThemeToggle />
      </nav>
    </header>

    <main>
      <slot />
    </main>

    <footer>
      <p>© {new Date().getFullYear()} Jay Lee</p>
    </footer>
  </body>
</html>

<style>
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--section-gap);
  }

  .logo {
    font-size: var(--text-lg);
    font-weight: 600;
    text-decoration: none;
    color: var(--text);
  }

  footer {
    margin-top: calc(var(--section-gap) * 2);
    padding-top: var(--section-gap);
    border-top: 1px solid var(--border);
    text-align: center;
    color: var(--text-secondary);
    font-size: var(--text-sm);
  }
</style>
```

**Task 1.2.2: Simplify ThemeToggle**
```astro
<!-- src/components/ThemeToggle.astro - MINIMAL version -->
<button id="theme-toggle" aria-label="Toggle theme">
  🌙
</button>

<script>
  const toggle = document.getElementById('theme-toggle');
  const html = document.documentElement;

  // Load theme
  const theme = localStorage.getItem('theme') || 'dark';
  html.setAttribute('data-theme', theme);

  toggle?.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });
</script>

<style>
  button {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0.5rem;
  }
</style>
```

### 1.3 Content Schema Update

**Task 1.3.1: Add Translations Field**
```typescript
// src/content/config.ts - ADD translations
import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    pubDate: z.string(),
    description: z.string().optional(),
    categories: z.array(z.string()),
    tags: z.array(z.string()),
    // NEW: Translation links
    translations: z.object({
      ko: z.string().optional(),
      en: z.string().optional(),
    }).optional(),
  }),
});

export const collections = { blog: blogCollection };
```

**Deliverables:**
- ✅ CSS design system with variables
- ✅ Tailwind minimal config
- ✅ View Transitions enabled
- ✅ BaseLayout simplified
- ✅ ThemeToggle minimal version
- ✅ Content schema with translations

**Success Criteria:**
- Build succeeds with new layout
- Dark mode toggle works
- CSS variables applied correctly

---

## Phase 2: Homepage Refactor (Day 2-3)

### 2.1 About Integration

**Task 2.1.1: Create Author Component**
```astro
<!-- src/components/Author.astro - NEW -->
---
const author = {
  name: 'Jay Lee',
  avatar: '/images/avatar.jpg',
  bio: 'Software Engineer · Learner, Giver, Hooper',
  links: {
    github: 'https://github.com/jayleekr',
    linkedin: 'https://linkedin.com/in/jayleekr',
  }
};
---

<div class="author">
  <img src={author.avatar} alt={author.name} class="avatar" />
  <div class="info">
    <h1>{author.name}</h1>
    <p>{author.bio}</p>
    <div class="links">
      <a href={author.links.github}>GitHub</a>
      <a href={author.links.linkedin}>LinkedIn</a>
    </div>
  </div>
</div>

<style>
  .author {
    display: flex;
    gap: 1rem;
    margin-bottom: var(--section-gap);
    padding-bottom: var(--section-gap);
    border-bottom: 1px solid var(--border);
  }

  .avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
  }

  .info h1 {
    font-size: var(--text-lg);
    margin: 0 0 0.5rem 0;
  }

  .info p {
    color: var(--text-secondary);
    margin: 0 0 0.5rem 0;
  }

  .links a {
    margin-right: 1rem;
    color: var(--link);
  }
</style>
```

### 2.2 Post List Component

**Task 2.2.1: Create Minimal PostItem**
```astro
<!-- src/components/PostItem.astro - NEW minimal version -->
---
interface Props {
  title: string;
  date: string;
  description?: string;
  url: string;
}

const { title, date, description, url } = Astro.props;
---

<article class="post-item">
  <h2>
    <a href={url}>{title}</a>
  </h2>
  <time>{date}</time>
  {description && <p>{description}</p>}
</article>

<style>
  .post-item {
    margin-bottom: var(--post-gap);
  }

  h2 {
    font-size: var(--text-lg);
    font-weight: 600;
    margin: 0 0 0.5rem 0;
  }

  h2 a {
    color: var(--text);
    text-decoration: none;
  }

  h2 a:hover {
    color: var(--link);
  }

  time {
    color: var(--text-secondary);
    font-size: var(--text-sm);
  }

  p {
    color: var(--text-secondary);
    margin: 0.5rem 0 0 0;
  }
</style>
```

**Task 2.2.2: Create PostList Component**
```astro
<!-- src/components/PostList.astro - NEW -->
---
import { getCollection } from 'astro:content';
import PostItem from './PostItem.astro';

// Get all blog posts, sorted by date (newest first)
const allPosts = await getCollection('blog');
const sortedPosts = allPosts
  .filter(post => !post.data.draft)
  .sort((a, b) =>
    new Date(b.data.pubDate).getTime() - new Date(a.data.pubDate).getTime()
  );
---

<div class="post-list">
  {sortedPosts.map(post => (
    <PostItem
      title={post.data.title}
      date={new Date(post.data.pubDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })}
      description={post.data.description}
      url={`/blog/${post.slug}/`}
    />
  ))}
</div>
```

### 2.3 New Homepage

**Task 2.3.1: Rebuild index.astro**
```astro
<!-- src/pages/index.astro - COMPLETE REWRITE -->
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Author from '../components/Author.astro';
import PostList from '../components/PostList.astro';
---

<BaseLayout
  title="Jay Lee's Blog"
  description="Software engineering, embedded systems, and technology insights"
>
  <Author />
  <PostList />
</BaseLayout>
```

**Task 2.3.2: Remove Old Pages**
```bash
# Files to DELETE
rm src/pages/about.astro
rm src/pages/categories/[category].astro
rm src/pages/tags/[tag].astro
rm src/pages/search.astro
rm -rf src/pages/categories/
rm -rf src/pages/tags/
```

**Deliverables:**
- ✅ Author component with bio
- ✅ Minimal PostItem component
- ✅ PostList with all 129 posts
- ✅ New homepage integrating About
- ✅ Old pages removed

**Success Criteria:**
- Homepage shows all posts chronologically
- Author info visible at top
- No search/filter UI present
- All 129 posts accessible

---

## Phase 3: Post Page Refactor (Day 3-4)

### 3.1 Language Switcher

**Task 3.1.1: Create LanguageSwitcher Component**
```astro
<!-- src/components/LanguageSwitcher.astro - NEW -->
---
interface Props {
  translations?: {
    ko?: string;
    en?: string;
  };
  currentLang: 'ko' | 'en';
}

const { translations, currentLang } = Astro.props;

// Only show if translations exist
if (!translations) return null;

const otherLang = currentLang === 'ko' ? 'en' : 'ko';
const otherUrl = translations[otherLang];
---

{otherUrl && (
  <div class="language-switcher">
    <span class="current">{currentLang === 'ko' ? '🇰🇷' : '🇺🇸'}</span>
    <span class="separator">·</span>
    <a href={otherUrl} class="other">
      {otherLang === 'ko' ? '🇰🇷 한국어' : '🇺🇸 English'}
    </a>
  </div>
)}

<style>
  .language-switcher {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-size: var(--text-sm);
    color: var(--text-secondary);
  }

  .other {
    color: var(--link);
    text-decoration: none;
  }

  .other:hover {
    text-decoration: underline;
  }
</style>
```

### 3.2 Post Layout Refactor

**Task 3.2.1: Create Minimal PostLayout**
```astro
<!-- src/layouts/PostLayout.astro - SIMPLIFIED -->
---
import BaseLayout from './BaseLayout.astro';
import LanguageSwitcher from '../components/LanguageSwitcher.astro';

interface Props {
  frontmatter: {
    title: string;
    pubDate: string;
    description?: string;
    translations?: { ko?: string; en?: string };
  };
}

const { frontmatter } = Astro.props;
const currentLang = Astro.url.pathname.includes('/en/') ? 'en' : 'ko';

const formattedDate = new Date(frontmatter.pubDate).toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});
---

<BaseLayout title={frontmatter.title} description={frontmatter.description}>
  <article class="post">
    <header>
      <h1>{frontmatter.title}</h1>
      <div class="meta">
        <time>{formattedDate}</time>
        <LanguageSwitcher
          translations={frontmatter.translations}
          currentLang={currentLang}
        />
      </div>
    </header>

    <div class="content">
      <slot />
    </div>
  </article>
</BaseLayout>

<style>
  .post header {
    margin-bottom: var(--section-gap);
  }

  h1 {
    font-size: var(--text-xl);
    font-weight: 700;
    margin: 0 0 1rem 0;
  }

  .meta {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--text-secondary);
    font-size: var(--text-sm);
  }

  .content {
    /* Minimal prose styles */
  }

  .content h2 {
    font-size: var(--text-lg);
    font-weight: 600;
    margin: 2rem 0 1rem 0;
  }

  .content p {
    margin: 1rem 0;
  }

  .content a {
    color: var(--link);
  }

  .content code {
    background: var(--code-bg);
    padding: 0.2rem 0.4rem;
    border-radius: 0.25rem;
    font-family: var(--font-mono);
    font-size: 0.9em;
  }

  .content pre {
    background: var(--code-bg);
    padding: 1rem;
    border-radius: 0.5rem;
    overflow-x: auto;
    margin: 1.5rem 0;
  }
</style>
```

### 3.3 Code Block Enhancement

**Task 3.3.1: Add Copy Button to Code Blocks**
```astro
<!-- src/components/CodeCopyButton.astro - NEW -->
<button class="copy-button" data-code="">
  Copy
</button>

<script>
  document.querySelectorAll('pre').forEach((pre) => {
    const code = pre.querySelector('code');
    if (!code) return;

    const button = document.createElement('button');
    button.className = 'copy-button';
    button.textContent = 'Copy';

    button.addEventListener('click', async () => {
      await navigator.clipboard.writeText(code.textContent || '');
      button.textContent = 'Copied!';
      setTimeout(() => button.textContent = 'Copy', 2000);
    });

    pre.style.position = 'relative';
    pre.appendChild(button);
  });
</script>

<style is:global>
  .copy-button {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    padding: 0.25rem 0.5rem;
    font-size: var(--text-xs);
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 0.25rem;
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.2s;
  }

  pre:hover .copy-button {
    opacity: 1;
  }
</style>
```

**Task 3.3.2: Update Post Dynamic Route**
```astro
<!-- src/pages/blog/[...slug].astro - SIMPLIFIED -->
---
import { getCollection } from 'astro:content';
import PostLayout from '../../layouts/PostLayout.astro';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map(post => ({
    params: { slug: post.slug },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await post.render();
---

<PostLayout frontmatter={post.data}>
  <Content />
</PostLayout>
```

**Deliverables:**
- ✅ Language switcher component
- ✅ Simplified PostLayout
- ✅ Code copy button
- ✅ Updated post route

**Success Criteria:**
- Post pages render correctly
- Language switcher appears when translations exist
- Code blocks have copy button
- Typography is readable

---

## Phase 4: Cleanup & Optimization (Day 4-5)

### 4.1 Component Removal

**Task 4.1.1: Delete Unused Components**
```bash
# Components to DELETE
rm src/components/GlobalSearch.astro
rm src/components/CategoryHierarchy.astro
rm src/components/CategoryFilter.astro
rm src/components/TagCloud.astro
rm src/components/ArticleCard.astro
rm src/components/Newsletter.astro
rm src/components/TableOfContents.astro
rm src/components/SocialShare.astro  # Optional: keep if desired
rm src/components/ReadingTime.astro
```

**Task 4.1.2: Clean Up Utilities**
```bash
# Utilities to DELETE or simplify
rm src/utils/search.ts
rm src/utils/categoryUtils.ts
# Keep: src/utils/dateUtils.ts (for date formatting)
```

### 4.2 CSS Cleanup

**Task 4.2.1: Remove Unused Styles**
```bash
# Review and remove:
# - Complex prose styles
# - Grid layouts for cards
# - Filter UI styles
# - Search modal styles
```

**Task 4.2.2: Final global.css**
```css
/* src/styles/global.css - FINAL minimal version */

/* CSS Variables (from Phase 1) */
:root { /* ... */ }
[data-theme="dark"] { /* ... */ }

/* Reset */
* { box-sizing: border-box; margin: 0; padding: 0; }

/* Base */
body { /* minimal styles */ }

/* Typography */
h1, h2, h3, h4, h5, h6 { /* minimal heading styles */ }
p { /* minimal paragraph styles */ }
a { /* minimal link styles */ }

/* Code */
code { /* inline code */ }
pre { /* code blocks */ }

/* Lists */
ul, ol { /* minimal list styles */ }

/* That's it - MINIMAL! */
```

### 4.3 Performance Optimization

**Task 4.3.1: Bundle Analysis**
```bash
# Run build and check bundle size
bun run build

# Target metrics:
# - Total JS: < 50KB
# - Total CSS: < 10KB
# - No unused dependencies
```

**Task 4.3.2: Lighthouse Audit**
```bash
# Test on homepage and sample post
bun run test:lighthouse

# Target scores:
# - Performance: 95+
# - Accessibility: 100
# - Best Practices: 100
# - SEO: 100
```

### 4.4 Testing & Validation

**Task 4.4.1: Manual Testing Checklist**
```markdown
Homepage:
- [ ] Shows all 129 posts
- [ ] Author info visible
- [ ] Dark mode toggle works
- [ ] No search/filter UI
- [ ] Posts sorted newest first
- [ ] Links work correctly

Post Page:
- [ ] Content renders correctly
- [ ] Language switcher appears (if translations)
- [ ] Code blocks have copy button
- [ ] Dark mode works
- [ ] Typography readable
- [ ] View Transitions smooth

Mobile:
- [ ] Responsive layout
- [ ] Touch targets adequate
- [ ] No horizontal scroll
- [ ] Dark mode toggle accessible
```

**Task 4.4.2: Cross-Browser Testing**
```markdown
- [ ] Chrome (desktop + mobile)
- [ ] Safari (desktop + mobile)
- [ ] Firefox (desktop)
- [ ] Edge (desktop)
```

**Task 4.4.3: SEO Validation**
```bash
# Check:
- [ ] All URLs still accessible
- [ ] Meta tags correct
- [ ] Sitemap generated
- [ ] Robots.txt correct
- [ ] No broken links
```

**Deliverables:**
- ✅ Unused components removed
- ✅ CSS minimized
- ✅ Bundle size optimized
- ✅ Lighthouse 95+ achieved
- ✅ All tests passing

**Success Criteria:**
- Build size reduced by 30%+
- Lighthouse performance 95+
- All 129 posts accessible
- No regressions in functionality

---

## Phase 5: Deployment & Monitoring (Day 5-6)

### 5.1 Pre-Deployment Checklist

**Task 5.1.1: Final Validation**
```bash
# Run all checks
bun run type-check
bun run lint
bun run test
bun run build
bun run test:lighthouse
```

**Task 5.1.2: Git Workflow**
```bash
# Create feature branch
git checkout -b refactor/ultra-minimal

# Stage changes incrementally by phase
git add src/styles/global.css src/layouts/
git commit -m "feat(phase1): implement minimal design system and base layout"

git add src/pages/index.astro src/components/Author.astro src/components/PostList.astro
git commit -m "feat(phase2): refactor homepage with integrated About and minimal post list"

git add src/layouts/PostLayout.astro src/components/LanguageSwitcher.astro
git commit -m "feat(phase3): refactor post pages with language switcher and code copy"

git add .
git commit -m "feat(phase4): remove unused components and optimize bundle"

# Push and create PR
git push origin refactor/ultra-minimal
# Create Pull Request via GitHub UI
```

### 5.2 Deployment Strategy

**Option A: Direct Deploy (Recommended)**
```bash
# After PR approval and merge to master
git checkout master
git pull origin master
./deploy-native.sh
```

**Option B: GitHub Actions Deploy**
```bash
# Push to master triggers automatic deployment
git push origin master
# Wait for GitHub Actions to complete
```

### 5.3 Post-Deployment Monitoring

**Task 5.3.1: Immediate Validation (First 1 hour)**
```markdown
- [ ] Site loads correctly (https://jayleekr.github.io)
- [ ] Homepage renders all posts
- [ ] Sample post pages work
- [ ] Dark mode toggle functions
- [ ] Language switcher works (where available)
- [ ] No 404 errors in browser console
- [ ] Mobile view correct
```

**Task 5.3.2: 24-Hour Monitoring**
```markdown
- [ ] Google Search Console: no crawl errors
- [ ] Analytics: traffic patterns normal
- [ ] Lighthouse CI: scores maintained
- [ ] User feedback: no critical issues
```

**Task 5.3.3: Performance Metrics**
```markdown
Target Metrics:
- Lighthouse Performance: 95+
- First Contentful Paint: < 1s
- Largest Contentful Paint: < 1.5s
- Total Blocking Time: < 200ms
- Cumulative Layout Shift: < 0.1
- Bundle Size (JS): < 50KB
- Bundle Size (CSS): < 10KB
```

---

## Risk Mitigation Plan

### High-Risk Items

**Risk 1: SEO Regression**
- **Mitigation**: Keep all URL structures, add proper redirects if needed
- **Validation**: Check Google Search Console after deployment
- **Rollback**: Revert to previous version if crawl errors spike

**Risk 2: Content Loss**
- **Mitigation**: No content file modifications, only layout/component changes
- **Validation**: Verify all 129 posts accessible after each phase
- **Rollback**: Git revert to specific commit

**Risk 3: User Confusion (No Search)**
- **Mitigation**: Clear communication, simple navigation
- **Validation**: Monitor user behavior via analytics
- **Contingency**: Can add simple search back if critical feedback

### Medium-Risk Items

**Risk 4: Build Failures**
- **Mitigation**: Incremental changes, test after each phase
- **Validation**: TypeScript checks, build tests
- **Rollback**: Git revert to last working commit

**Risk 5: Performance Regression**
- **Mitigation**: Lighthouse tests throughout development
- **Validation**: Compare before/after metrics
- **Rollback**: Optimize or revert specific features

---

## Success Metrics & Acceptance Criteria

### Quantitative Metrics

| Metric | Before | Target | Measurement |
|--------|--------|--------|-------------|
| Lighthouse Performance | 96 | 95+ | Lighthouse CI |
| First Page Load | ~1.5s | < 1s | Chrome DevTools |
| Bundle Size (JS) | ~150KB | < 50KB | Build output |
| Bundle Size (CSS) | ~30KB | < 10KB | Build output |
| Components Count | ~25 | < 15 | File count |
| Code Lines (src/) | ~8000 | < 5500 | cloc |

### Qualitative Metrics

- [ ] **Design Quality**: Matches overreacted.io minimalist aesthetic
- [ ] **Readability**: Text-first, comfortable reading experience
- [ ] **Navigation**: Simple, intuitive, no confusion
- [ ] **Accessibility**: WCAG 2.1 AA maintained
- [ ] **Mobile UX**: Smooth, responsive, fast
- [ ] **Developer Experience**: Clean code, easy to maintain

### User Acceptance Criteria

- [ ] All 129 blog posts accessible and readable
- [ ] No broken links or missing content
- [ ] Dark mode works on all pages
- [ ] Language switcher appears on translated posts
- [ ] Code blocks readable with copy functionality
- [ ] Fast page loads and smooth transitions
- [ ] Mobile experience excellent

---

## Implementation Checklist

### Phase 0: Pre-Implementation ✅
- [ ] Read and understand PRD
- [ ] Audit current codebase
- [ ] Identify components to remove
- [ ] Create implementation plan (this document)
- [ ] Get plan approval

### Phase 1: Foundation (Day 1-2)
- [ ] Create CSS design system with variables
- [ ] Update Tailwind config (minimal)
- [ ] Enable View Transitions in Astro config
- [ ] Create minimal BaseLayout
- [ ] Simplify ThemeToggle component
- [ ] Update content schema (add translations field)
- [ ] Test: Build succeeds, dark mode works

### Phase 2: Homepage (Day 2-3)
- [ ] Create Author component (About integration)
- [ ] Create minimal PostItem component
- [ ] Create PostList component (all 129 posts)
- [ ] Rebuild index.astro (new homepage)
- [ ] Remove old pages (about, categories, tags, search)
- [ ] Test: Homepage shows all posts, author info visible

### Phase 3: Post Pages (Day 3-4)
- [ ] Create LanguageSwitcher component
- [ ] Create minimal PostLayout
- [ ] Add code copy button functionality
- [ ] Update post dynamic route ([...slug].astro)
- [ ] Test: Post pages render, language switcher works, code copy works

### Phase 4: Cleanup (Day 4-5)
- [ ] Delete unused components (search, filters, cards, etc.)
- [ ] Clean up unused utilities
- [ ] Remove unused CSS (complex prose, grids, etc.)
- [ ] Optimize bundle size
- [ ] Run Lighthouse audit (target 95+)
- [ ] Manual testing (all browsers, devices)
- [ ] SEO validation (URLs, meta tags, sitemap)
- [ ] Test: Bundle reduced 30%+, Lighthouse 95+

### Phase 5: Deployment (Day 5-6)
- [ ] Run final validation (type-check, lint, test, build)
- [ ] Create feature branch commits (by phase)
- [ ] Push and create Pull Request
- [ ] Review and merge PR
- [ ] Deploy to production
- [ ] Post-deployment validation (1 hour)
- [ ] Monitor metrics (24 hours)
- [ ] Document changes in workflow_state.md

---

## Notes & Considerations

### Design Decisions

1. **System Fonts**: Using system font stack eliminates font loading, improves performance
2. **Dark Mode Default**: Follows developer preference, less eye strain
3. **No Search**: Trust in scroll/browser Cmd+F, reduces complexity
4. **Inline Language Switcher**: Better UX than separate URL structure
5. **View Transitions**: Smooth page changes enhance minimal design

### Technical Decisions

1. **No New Dependencies**: Use Astro built-ins, minimize bundle
2. **Minimal Tailwind**: Only essential utilities, most styling in components
3. **CSS Variables**: Easy theming, better than Tailwind config
4. **Component Scoped Styles**: Better encapsulation, easier maintenance
5. **Content Collections**: Keep existing structure, just change UI

### Future Enhancements (Out of Scope)

- Previous/Next post navigation
- Reading progress indicator
- Keyboard shortcuts
- RSS feed improvements
- Comments system
- Newsletter integration

---

## Timeline Estimate

| Phase | Tasks | Estimated Time | Cumulative |
|-------|-------|----------------|------------|
| 0. Pre-Implementation | Analysis, Planning | 0.5 days | 0.5 days |
| 1. Foundation | Design system, layouts | 1.5 days | 2 days |
| 2. Homepage | Author, PostList, index | 1 day | 3 days |
| 3. Post Pages | PostLayout, switcher, code | 1.5 days | 4.5 days |
| 4. Cleanup | Remove, optimize, test | 1 day | 5.5 days |
| 5. Deployment | Deploy, monitor | 0.5 days | 6 days |

**Total Estimate: 6 days**

### Buffer Time
- Add 1-2 days for unforeseen issues
- Total with buffer: **7-8 days**

---

## Rollback Plan

### Immediate Rollback (< 1 hour after deployment)

```bash
# If critical issues detected immediately
git revert HEAD
git push origin master
./deploy-native.sh
```

### Selective Rollback (Specific Phase)

```bash
# Revert to specific commit (e.g., before Phase 3)
git log --oneline  # Find commit hash
git revert <commit-hash>
git push origin master
```

### Full Rollback (Nuclear Option)

```bash
# Revert all changes, go back to previous stable
git checkout <last-stable-commit>
git checkout -b rollback/revert-minimal
git push origin rollback/revert-minimal
# Create emergency PR and merge
```

---

## Communication Plan

### Pre-Launch
- Update CLAUDE.md with implementation notes
- Update workflow_state.md with current phase
- Commit messages follow conventional format

### During Implementation
- TodoWrite for task tracking
- Update memories with progress
- Regular commits after each phase

### Post-Launch
- Update workflow_state.md with completion
- Update project_config.md changelog
- Document lessons learned in memory

---

## Appendix

### A. File Changes Summary

**Files to Create:**
- `src/components/Author.astro`
- `src/components/PostList.astro`
- `src/components/PostItem.astro`
- `src/components/LanguageSwitcher.astro`
- `src/components/CodeCopyButton.astro` (script in PostLayout)

**Files to Modify:**
- `src/layouts/BaseLayout.astro` (simplify)
- `src/layouts/PostLayout.astro` (simplify)
- `src/components/ThemeToggle.astro` (simplify)
- `src/pages/index.astro` (complete rewrite)
- `src/pages/blog/[...slug].astro` (simplify)
- `src/styles/global.css` (minimize)
- `tailwind.config.mjs` (minimize)
- `astro.config.mjs` (add View Transitions)
- `src/content/config.ts` (add translations field)

**Files to Delete:**
- `src/pages/about.astro`
- `src/pages/categories/[category].astro`
- `src/pages/tags/[tag].astro`
- `src/pages/search.astro`
- `src/components/GlobalSearch.astro`
- `src/components/CategoryHierarchy.astro`
- `src/components/CategoryFilter.astro`
- `src/components/TagCloud.astro`
- `src/components/ArticleCard.astro`
- `src/components/Newsletter.astro`
- `src/components/TableOfContents.astro`
- `src/components/ReadingTime.astro`
- `src/utils/search.ts`
- `src/utils/categoryUtils.ts`

### B. Reference Links

- **Current Blog**: https://jayleekr.github.io
- **GitHub Repo**: https://github.com/jayleekr/jayleekr.github.io
- **Overreacted.io**: https://overreacted.io
- **Astro View Transitions**: https://docs.astro.build/en/guides/view-transitions/
- **Astro Content Collections**: https://docs.astro.build/en/guides/content-collections/

---

**END OF PLAN**

**Status**: ✅ Ready for Implementation
**Next Action**: Begin Phase 1 - Foundation & Design System
**Approval Required**: Yes (User confirmation before proceeding)
