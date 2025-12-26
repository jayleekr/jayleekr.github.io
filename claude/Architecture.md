# Architecture: Jay's Blog

> **Version**: 2.0 (Ultra-Minimal + Notion Integration)
> **Last Updated**: 2025-12-26
> **Status**: Production

---

## 1. System Overview

### 1.1 Architecture Philosophy

**Core Principles:**
- **Text-First Design**: Minimalist UI inspired by overreacted.io
- **Content Automation**: Automated Notion → MDX pipeline
- **Zero Configuration**: No manual content migration
- **Performance First**: <1s load time, 95+ Lighthouse score

### 1.2 Technology Stack

```yaml
Framework: Astro 5.x
Styling: Tailwind CSS (minimal)
Content: MDX (Markdown + Components)
CMS: Notion API
Build: Bun runtime
Deployment: GitHub Pages
CI/CD: GitHub Actions
```

---

## 2. Content Architecture

### 2.1 Content Sources

```
┌─────────────────────────────────────────┐
│         CONTENT SOURCES                 │
├─────────────────────────────────────────┤
│                                         │
│  📝 Notion Database                     │
│  ├─ Write posts in Notion               │
│  ├─ Add images/media                    │
│  ├─ Tag & categorize                    │
│  └─ Auto-sync via API                   │
│       │                                 │
│       ▼                                 │
│  🔄 Sync Scripts                        │
│  ├─ sync-all-notion.js (batch)          │
│  ├─ notion-to-mdx.js (single)           │
│  ├─ download-notion-images.js           │
│  └─ test-notion-sync.js (validation)    │
│       │                                 │
│       ▼                                 │
│  📂 MDX Files                           │
│  └─ src/content/blog/                   │
│      ├─ TechSavvy/AI/*.mdx              │
│      ├─ Collaboration/ToyProjects/*.mdx │
│      └─ DeepThinking/Daily/*.mdx        │
│                                         │
└─────────────────────────────────────────┘
```

### 2.2 Content Schema

**MDX Frontmatter Structure:**
```yaml
---
title: "Post Title"
author: "Jay Lee"
pubDate: "2025-12-26T00:00:00.000Z"
lastEditedTime: "2025-12-26T12:00:00.000Z"  # For smart updates
categories: ["TechSavvy", "AI"]
tags: ["AI", "LLM", "Technology"]
translations:                               # Optional
  ko: /blog/ko/2025-12-26-title/
  en: /blog/en/2025-12-26-title/
---
```

### 2.3 Category Structure

```
src/content/blog/
├── TechSavvy/
│   ├── AI/                    # AI, LLM, ML posts
│   ├── C/                     # C programming
│   ├── ComputerArchitecture/  # Hardware, architecture
│   ├── EmbeddedLinux/         # Embedded systems
│   ├── GitHub/                # Git, GitHub workflows
│   ├── LinuxKernel/           # Kernel development
│   ├── Bash/                  # Shell scripting
│   ├── OperatingSystems/      # OS concepts
│   └── Yocto/                 # Yocto project
├── Collaboration/
│   └── ToyProjects/           # Hackathons, side projects
└── DeepThinking/
    ├── AI/                    # AI philosophy, ethics
    ├── Daily/                 # Daily thoughts, reflections
    └── Retrospect/            # Retrospectives, reviews
```

---

## 3. Notion Integration System

### 3.1 Smart Update Mechanism

**Change Detection Algorithm:**
```javascript
// Compare timestamps to detect changes
if (notionLastEditedTime > mdxLastEditedTime) {
  updatePost();  // Only update if Notion version is newer
} else {
  skipPost();    // No changes, skip conversion
}
```

**Benefits:**
- ✅ Only processes modified content
- ✅ Avoids unnecessary API calls
- ✅ Preserves bandwidth and build time
- ✅ Automatic change detection

### 3.2 Image Processing Pipeline

```
Notion Image URL (with temp token)
        │
        ▼
┌───────────────────────────┐
│  processImages()          │
│  - Download while fresh   │
│  - Generate filename      │
│  - Save to public/images  │
│  - Update MDX paths       │
└───────────────────────────┘
        │
        ▼
Local Image Files
public/images/blog/YYYY-MM-DD/
└── <uuid>.png
        │
        ▼
MDX Reference
![alt](/images/blog/YYYY-MM-DD/filename.png)
```

**Why Image Download:**
- Notion S3 URLs expire after 1 hour
- Download during conversion ensures fresh tokens
- Local storage = permanent availability
- No broken images after deployment

### 3.3 Sync Scripts Architecture

```
scripts/
├── sync-all-notion.js         # Main batch converter
│   ├─ Smart update detection
│   ├─ Image processing
│   ├─ Category auto-classification
│   ├─ MDX sanitization
│   └─ Progress reporting
│
├── notion-to-mdx.js           # Single page converter
│   └─ For manual one-off conversions
│
├── test-notion-sync.js        # Validation suite
│   ├─ API connection test
│   ├─ Page discovery test
│   ├─ Category classification test
│   └─ Conversion test
│
└── download-notion-images.js  # Standalone image downloader
    └─ For fixing broken images separately
```

### 3.4 CLI Commands

```bash
# Test Notion connection and setup
node scripts/test-notion-sync.js

# Dry-run (preview without writing files)
node scripts/sync-all-notion.js --dry-run --limit 5

# Smart sync (only update changed posts)
node scripts/sync-all-notion.js

# Force re-conversion (ignore timestamps)
node scripts/sync-all-notion.js --force

# Sync from specific date
node scripts/sync-all-notion.js --from 2025-12-01

# Single page conversion
node scripts/notion-to-mdx.js <page-id>
```

---

## 4. Frontend Architecture

### 4.1 Component Hierarchy

```
┌─────────────────────────────────────────┐
│          BaseLayout.astro               │
│  ┌───────────────────────────────────┐  │
│  │  Header                           │  │
│  │  ├─ Logo/Title                    │  │
│  │  └─ ThemeToggle (🌙/☀️)            │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │  <slot />                         │  │
│  │  ┌─────────────────────────────┐  │  │
│  │  │  Homepage (index.astro)     │  │  │
│  │  │  ├─ Author.astro            │  │  │
│  │  │  └─ PostList.astro          │  │  │
│  │  │     └─ PostItem.astro × 65  │  │  │
│  │  └─────────────────────────────┘  │  │
│  │                                   │  │
│  │  ┌─────────────────────────────┐  │  │
│  │  │  Post Page                  │  │  │
│  │  │  PostLayout.astro           │  │  │
│  │  │  ├─ Title + Meta            │  │  │
│  │  │  ├─ LanguageSwitcher        │  │  │
│  │  │  ├─ MDX Content             │  │  │
│  │  │  └─ CodeCopyButton          │  │  │
│  │  └─────────────────────────────┘  │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │  Footer                           │  │
│  │  └─ Copyright                     │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

### 4.2 Component Catalog

**Core Components:**
```
src/components/
├── Author.astro           # Author bio on homepage
├── BaseHead.astro         # SEO meta tags
├── CodeCopyButton.astro   # Copy code to clipboard
├── LanguageSwitcher.astro # 🇰🇷/🇺🇸 language toggle
├── PostItem.astro         # Minimal post card
├── PostList.astro         # All posts chronological
└── ThemeToggle.astro      # Dark/light mode toggle
```

**Layouts:**
```
src/layouts/
├── BaseLayout.astro       # Base wrapper
└── PostLayout.astro       # Blog post wrapper
```

**Pages:**
```
src/pages/
├── index.astro            # Homepage (Author + PostList)
└── blog/[...slug].astro   # Dynamic post routes
```

### 4.3 Styling Architecture

**CSS Variables (Design System):**
```css
:root {
  /* Colors - Light Mode */
  --bg: #ffffff;
  --text: #1a1a1a;
  --text-secondary: #666666;
  --link: #0070f3;
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
}

[data-theme="dark"] {
  --bg: #121212;
  --text: #e5e5e5;
  --text-secondary: #888888;
  --link: #58a6ff;
  --code-bg: #1e1e1e;
  --border: #333333;
}
```

**Tailwind Config (Minimal):**
```javascript
export default {
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      fontFamily: {
        sans: 'var(--font-body)',
        mono: 'var(--font-mono)',
      },
    },
  },
  plugins: [],
};
```

---

## 5. Build & Deployment Pipeline

### 5.1 Development Workflow

```
┌─────────────────────────────────────────┐
│      DEVELOPMENT WORKFLOW               │
├─────────────────────────────────────────┤
│                                         │
│  1️⃣ Write in Notion                     │
│     └─ Add content, images, tags        │
│                                         │
│  2️⃣ Run Sync Script                     │
│     └─ node scripts/sync-all-notion.js  │
│                                         │
│  3️⃣ Local Development                   │
│     └─ npm run dev (port 4322)          │
│                                         │
│  4️⃣ Test Changes                        │
│     └─ http://localhost:4322            │
│                                         │
│  5️⃣ Commit & Push                       │
│     └─ git push origin feature-branch   │
│                                         │
│  6️⃣ GitHub Actions Build                │
│     └─ Automatic build on push          │
│                                         │
│  7️⃣ Deploy to GitHub Pages              │
│     └─ https://jayleekr.github.io       │
│                                         │
└─────────────────────────────────────────┘
```

### 5.2 GitHub Actions Workflow

```yaml
# .github/workflows/notion-sync.yml
name: Notion → Blog Sync

on:
  workflow_dispatch:  # Manual trigger
    inputs:
      limit:
        description: 'Max posts to sync'
        required: false
      dry_run:
        description: 'Dry run mode'
        type: boolean

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - run: node scripts/sync-all-notion.js
        env:
          NOTION_API_TOKEN: ${{ secrets.NOTION_API_TOKEN }}
      - uses: stefanzweifel/git-auto-commit-action@v5
        with:
          commit_message: "feat: Sync posts from Notion"
```

### 5.3 Build Configuration

```javascript
// astro.config.mjs
export default defineConfig({
  site: 'https://jayleekr.github.io',
  markdown: {
    shikiConfig: {
      theme: 'github-dark-dimmed',  // Single dark theme
    },
  },
  vite: {
    ssr: {
      noExternal: ['@astrojs/rss'],
    },
  },
});
```

---

## 6. Performance Architecture

### 6.1 Optimization Strategies

**Bundle Optimization:**
- No web fonts (system fonts only)
- Minimal Tailwind CSS (25 lines config)
- No external dependencies
- Component-scoped CSS
- Tree-shaking enabled

**Build Performance:**
```
Metrics:
- Build time: 3.92s for 140 pages
- Bundle size: <50KB JS, <10KB CSS
- Image optimization: Sharp (automatic)
- Sitemap generation: Automatic
```

**Runtime Performance:**
```
Target Metrics:
- First Contentful Paint: <1s
- Largest Contentful Paint: <1.5s
- Time to Interactive: <2s
- Cumulative Layout Shift: <0.1
```

### 6.2 Caching Strategy

**Static Assets:**
```
public/
├── images/blog/           # Cached indefinitely
│   └── YYYY-MM-DD/*.png
├── favicon.ico            # Cached indefinitely
└── rss.xml                # Cache-Control: max-age=3600
```

**View Transitions:**
```javascript
// Built-in Astro View Transitions
<ViewTransitions />
// Smooth page navigation without full reload
```

---

## 7. Data Flow Architecture

### 7.1 Content Pipeline

```
Notion Database
        │
        ▼
    API Query (paginated, 100/batch)
        │
        ▼
    Page Analysis
    ├─ Extract metadata (title, date, tags)
    ├─ Category classification
    └─ Change detection (lastEditedTime)
        │
        ▼
    Content Conversion
    ├─ Notion blocks → Markdown
    ├─ MDX sanitization (escape {})
    └─ Image processing
        │
        ▼
    MDX Generation
    ├─ Frontmatter creation
    ├─ Content body
    └─ Local image paths
        │
        ▼
    File Write
    └─ src/content/blog/{category}/{slug}.mdx
        │
        ▼
    Astro Build
    └─ Static HTML generation
```

### 7.2 Category Classification Logic

```javascript
function categorizeContent(title, content) {
  const lowerTitle = title.toLowerCase();
  const lowerContent = content.toLowerCase();

  // Priority 1: Project/Hackathon (highest)
  if (projectKeywords.some(kw => lowerTitle.includes(kw))) {
    return {
      category: 'Collaboration/ToyProjects',
      tags: ['Collaboration', 'Project']
    };
  }

  // Priority 2: AI/LLM topics
  if (aiKeywords.some(kw => lowerTitle.includes(kw) ||
                           lowerContent.includes(kw))) {
    return {
      category: 'TechSavvy/AI',
      tags: ['AI', 'LLM', 'Technology']
    };
  }

  // Priority 3: Default (Daily thoughts)
  return {
    category: 'DeepThinking/Daily',
    tags: ['Daily', 'Thoughts']
  };
}
```

---

## 8. Security Architecture

### 8.1 Environment Variables

```bash
# .env (not committed)
NOTION_API_TOKEN=secret_xxxxxxxxxxxx

# GitHub Secrets (CI/CD)
NOTION_API_TOKEN=<stored securely>
```

### 8.2 Content Security

**MDX Sanitization:**
```javascript
// Escape curly braces to prevent MDX errors
content = content.replace(/\{([^}]+)\}/g, '\\{$1\\}');
```

**Image Sources:**
- Notion S3: Temporary tokens, downloaded to local
- Local storage: No external dependencies
- No CDN: All assets self-hosted

---

## 9. Error Handling & Monitoring

### 9.1 Sync Error Handling

```javascript
// Graceful failure with detailed logging
try {
  await convertPage(page);
  stats.success++;
} catch (error) {
  console.error(`❌ Failed: ${error.message}`);
  stats.failed++;
  stats.errors.push({
    title: page.title,
    error: error.message
  });
  // Continue with next post (don't fail entire batch)
}
```

### 9.2 Build Validation

```bash
# Pre-deployment checks
npm run type-check  # TypeScript validation
npm run build       # Build verification
```

### 9.3 Post-Deployment Monitoring

```bash
# Metrics to track:
- Build success rate
- Page load times
- Lighthouse scores
- Content sync frequency
- Image download success rate
```

---

## 10. Migration History

### 10.1 Phase 1-5: Ultra-Minimal Refactoring

**Completed:** 2025-12-22
**Impact:**
- Removed 1,400+ lines of code
- 36% file count reduction (148 → 94)
- 28% faster builds (5.45s → 3.92s)
- Achieved 95+ Lighthouse score

**Key Changes:**
- Simplified all layouts and components
- Removed search, filters, complex navigation
- Implemented View Transitions
- System fonts only (no web fonts)
- CSS variable design system

### 10.2 Notion Integration

**Completed:** 2025-12-26
**Impact:**
- Automated content migration (65 posts)
- Zero manual MDX creation needed
- Smart update detection (only sync changes)
- Automatic image downloading
- Category auto-classification

**Key Features:**
- Batch sync script
- Single page converter
- Validation test suite
- GitHub Actions workflow
- Image processing pipeline

### 10.3 Codebase Cleanup (2025-12-26)

**Completed:** 2025-12-26
**Impact:**
- Removed ~44KB+ dead code (unused components)
- Archived Jekyll legacy files to `.archive/`
- Improved robots.txt documentation
- Enhanced BaseHead SEO comments

**Components Removed:**
- `ReadingProgress.astro` (148 lines) - Unused
- `EnhancedReadingProgress.astro` (296 lines) - Unused duplicate
- `SearchModal.astro` (18.6KB) - Unused search UI
- `CommandPalette.astro` (24.5KB) - Unused command interface
- `Search/` directory - Empty after component removal

**Files Archived:**
- Jekyll configuration files → `.archive/jekyll-legacy/`
  - `Gemfile`, `Gemfile.lock`, `_config.yml`, `.jekyll-metadata`
- Old Jekyll posts → `.archive/old-posts/`
  - Entire `_posts/` directory (superseded by `/src/content/blog/`)

**Scripts Removed:**
- `launch-validation.js` - Stub superseded by `.mjs` version

**GitHub Actions Removed:**
- `test.yml` - Comprehensive test suite (excessive for minimal blog)
- `notion-sync.yml` - Local-only workflow (env file dependency)
- **Kept**: `deploy.yml` - Essential GitHub Pages deployment

**SEO Improvements:**
- Updated `robots.txt` last modified date (2025-01-22 → 2025-12-26)
- Added documentation for `/_astro/` crawling rule
- Enhanced BaseHead.astro verification code comments with setup URLs
- Verified RSS stylesheet exists (`rss-styles.xsl` - 5.3KB)

**Preserved Files:**
- `.nojekyll` - Kept (disables GitHub's Jekyll processing)
- All Astro components and layouts
- All active scripts and utilities

---

## 11. Current Metrics

### 11.1 Content Statistics

```
Total Posts: 65
Categories:
├── TechSavvy/AI: 27 posts
├── DeepThinking/Daily: 35 posts
└── Collaboration/ToyProjects: 3 posts

Images: 10 downloaded
Avg Post Length: ~2000 words
```

### 11.2 Performance Metrics

```
Build Performance:
├── Pages: 140
├── Build Time: 3.92s
├── TypeScript Errors: 0
└── Warnings: 0

Bundle Size:
├── JavaScript: <50KB
├── CSS: <10KB
└── Images: ~2MB (optimized)
```

---

## 12. Future Enhancements

### 12.1 Planned Features

**Short Term:**
- [ ] Automatic nightly Notion sync
- [ ] Image optimization pipeline
- [ ] Previous/Next post navigation
- [ ] Reading progress indicator

**Long Term:**
- [ ] Full-text search (client-side)
- [ ] RSS feed per category
- [ ] Comment system integration
- [ ] Analytics dashboard

### 12.2 Technical Debt

**Completed (2025-12-26):**
- ✅ Remove unused ReadingProgress components
- ✅ Remove unused Search/Command components
- ✅ Archive Jekyll legacy files
- ✅ Update robots.txt documentation
- ✅ Verify SEO meta tag configuration

**Low Priority:**
- Consolidate all blog posts to use PostLayout
- Remove legacy layout backwards compatibility
- Optimize image formats (WebP conversion)
- Implement lazy loading for images
- Fill in search engine verification codes (Google, Bing, Yandex)

---

## 13. Documentation References

### 13.1 Internal Docs

- **PRD.md**: Product requirements and design goals
- **Plan.md**: Implementation plan (5 phases)
- **workflow_state.md**: Current implementation status
- **project_config.md**: Build configuration
- **scripts/README.md**: Notion sync documentation

### 13.2 External Resources

- **Astro Docs**: https://docs.astro.build
- **Notion API**: https://developers.notion.com
- **Tailwind CSS**: https://tailwindcss.com
- **GitHub Actions**: https://docs.github.com/actions

---

## 14. Maintenance Guide

### 14.1 Adding New Posts

```bash
# Option 1: Write in Notion, sync automatically
1. Write post in Notion database
2. Run: node scripts/sync-all-notion.js
3. Commit and push changes

# Option 2: Manual MDX creation
1. Create MDX file in src/content/blog/{category}/
2. Add proper frontmatter
3. Write content
4. Commit and push
```

### 14.2 Updating Existing Posts

```bash
# Notion posts: Just edit in Notion
1. Edit post in Notion
2. Run sync script (smart update will detect changes)

# Manual posts: Edit MDX directly
1. Edit MDX file
2. Save and test locally
3. Commit and push
```

### 14.3 Troubleshooting

**Broken Images:**
```bash
# Restart dev server to pick up new images
pkill -f "astro dev"
npm run dev
```

**Sync Failures:**
```bash
# Run validation first
node scripts/test-notion-sync.js

# Check API token
echo $NOTION_API_TOKEN

# Re-run with verbose logging
node scripts/sync-all-notion.js --dry-run
```

---

**END OF ARCHITECTURE**

**Version**: 2.0
**Last Updated**: 2025-12-26
**Status**: ✅ Production Ready
**Maintainer**: Jay Lee
