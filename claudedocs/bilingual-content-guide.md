# Bilingual Content Strategy for jayleekr.github.io

**Date**: 2025-12-22
**Purpose**: Guide for maintaining Korean/English bilingual blog posts

## Current Structure Analysis

### Directory Layout
```
src/content/blog/
├── en/                    # English translations
├── ko/                    # Korean translations (rarely used)
├── TechSavvy/            # Korean originals (technical posts)
├── DeepThinking/         # Korean originals (reflections)
└── Collaboration/        # Korean originals (collaborations)
```

### URL Generation
**Current Behavior**: URLs are based on file path (post.id)

| File Location | Generated URL |
|--------------|---------------|
| `ko/2020-09-11-creating-github-blog.mdx` | `/blog/ko/2020-09-11-creating-github-blog` |
| `en/2020-09-11-creating-github-blog.mdx` | `/blog/en/2020-09-11-creating-github-blog` |
| `TechSavvy/Github/2020-09-11-post.mdx` | `/blog/TechSavvy/Github/2020-09-11-post` |

### Schema Support (Already Built-in!)

Your `src/content/config.ts` already has bilingual support:

```typescript
schema: z.object({
  lang: z.enum(['ko', 'en']).default('ko'),
  translations: z.object({
    ko: z.string().optional(),
    en: z.string().optional(),
  }).optional(),
})
```

## Problem: Why Duplicates Exist

**Current Issue**: Two separate organizational systems

1. **Category-based** (Korean originals):
   - `TechSavvy/Container/post.mdx` → Korean content
   - URL: `/blog/TechSavvy/Container/post`

2. **Language-based** (English translations):
   - `en/post.mdx` → English translation
   - URL: `/blog/en/post`

**Result**: Same content, different URLs, looks like duplication

## Recommended Solutions

### Option 1: Use Translation Links (Best for Current Structure)

Keep both files but link them with frontmatter:

**Korean Original** (`TechSavvy/Container/2025-03-05-docker.mdx`):
```yaml
---
title: "Docker 자동차 임베디드 교훈"
lang: ko
translations:
  en: "/blog/en/2025-03-05-docker-automotive-embedded-lessons-1"
---
```

**English Translation** (`en/2025-03-05-docker-automotive-embedded-lessons-1.mdx`):
```yaml
---
title: "Docker Automotive Embedded Lessons"
lang: en
translations:
  ko: "/blog/TechSavvy/Container/2025-03-05-docker"
---
```

**Then add language switcher in PostLayout**:
```astro
{frontmatter.translations && (
  <div class="language-switcher">
    {frontmatter.translations.ko && <a href={frontmatter.translations.ko}>🇰🇷 한국어</a>}
    {frontmatter.translations.en && <a href={frontmatter.translations.en}>🇬🇧 English</a>}
  </div>
)}
```

**Pros:**
- ✅ Keep existing URL structure
- ✅ Maintains category organization
- ✅ Minimal code changes
- ✅ Easy to implement

**Cons:**
- ❌ Still have separate files
- ❌ Manual URL management

---

### Option 2: Unified Language Structure (Cleaner but More Work)

Reorganize everything into language-first structure:

```
src/content/blog/
├── ko/
│   ├── techsavvy/
│   │   └── container/
│   │       └── 2025-03-05-docker.mdx
│   └── deepthinking/
│       └── 2025-02-05-retro.mdx
└── en/
    ├── techsavvy/
    │   └── container/
    │       └── 2025-03-05-docker.mdx
    └── deepthinking/
        └── 2025-02-05-retro.mdx
```

**URLs would be:**
- Korean: `/blog/ko/techsavvy/container/2025-03-05-docker`
- English: `/blog/en/techsavvy/container/2025-03-05-docker`

**Pros:**
- ✅ Symmetric structure
- ✅ Predictable URLs
- ✅ Clear language separation
- ✅ Same relative path for both languages

**Cons:**
- ❌ Need to migrate all existing posts
- ❌ URL changes (need redirects)
- ❌ More upfront work

---

### Option 3: Single File with Both Languages (Not Recommended for Your Case)

Use one file with both languages:

```yaml
---
title:
  ko: "Docker 자동차 임베디드 교훈"
  en: "Docker Automotive Embedded Lessons"
content:
  ko: |
    [Korean content here]
  en: |
    [English content here]
---
```

**Pros:**
- ✅ Single source of truth
- ✅ No duplication

**Cons:**
- ❌ Large files
- ❌ Complex frontmatter
- ❌ Harder to edit
- ❌ Doesn't match your workflow

## Recommendation: Option 1 (Translation Links)

For your existing structure, **Option 1** is the best approach:

### Implementation Steps

1. **Decide on Korean post location**:
   - Original Korean posts stay in category folders (`TechSavvy/`, `DeepThinking/`)
   - English translations go in `en/` folder

2. **Add translation links to existing bilingual posts**:
   ```bash
   # Find posts that exist in both languages
   # Add translations frontmatter to both
   ```

3. **Update PostLayout.astro**:
   - Add language switcher component
   - Show available translations

4. **Future posts**:
   - Write Korean original in category folder
   - Write English translation in `en/` folder with matching filename
   - Link both with `translations` frontmatter

### Example Workflow

**Step 1**: Write Korean post
```bash
src/content/blog/TechSavvy/Container/2025-12-22-new-feature.mdx
```

**Step 2**: Translate to English
```bash
src/content/blog/en/2025-12-22-new-feature.mdx
```

**Step 3**: Link them (Korean frontmatter):
```yaml
---
title: "새로운 기능"
lang: ko
translations:
  en: "/blog/en/2025-12-22-new-feature"
---
```

**Step 4**: Link them (English frontmatter):
```yaml
---
title: "New Feature"
lang: en
translations:
  ko: "/blog/TechSavvy/Container/2025-12-22-new-feature"
---
```

## Avoiding Duplication

### Rules to Follow

1. **One Korean original per topic** - Choose the location:
   - Category-based: `TechSavvy/Container/post.mdx`
   - OR Language-based: `ko/post.mdx`
   - **NOT BOTH**

2. **English translations only in `en/`**:
   - Always: `en/post.mdx`
   - Never: `TechSavvy/Container/post-en.mdx`

3. **Use `translations` frontmatter**:
   - Always link bilingual posts
   - Makes language switching possible

4. **Consistent naming**:
   - Use same filename for translations
   - `2025-03-05-docker.mdx` in both locations

### Before Publishing Checklist

- [ ] Korean original in correct category folder
- [ ] English translation (if exists) in `en/` folder only
- [ ] Both files have `translations` frontmatter
- [ ] Both files have correct `lang` field
- [ ] URLs in `translations` are correct and working
- [ ] No duplicate files in multiple locations

## Migration Plan for Existing Posts

If you want to clean up existing structure:

1. **Audit**: Find all posts with translations
2. **Decide**: Which location for Korean (category vs ko/)
3. **Move**: Consolidate to chosen structure
4. **Link**: Add translations frontmatter
5. **Verify**: Check all URLs work
6. **Deploy**: Update in one commit

## Tools to Help

### Find Duplicate Posts
```bash
# Find posts that might have duplicates
find src/content/blog -name "*.mdx" | sort | \
  awk -F'/' '{print $NF}' | uniq -d
```

### Check Translation Coverage
```bash
# Posts in en/ without Korean original
# Posts with Korean original without English translation
```

### Verify Translation Links
```bash
# Check that translation URLs are valid
# Parse frontmatter and verify links
```

## Summary

**Current State**:
- Mixed structure (category-based + language-based)
- Some duplication between TechSavvy/ and en/

**Recommended Approach**:
- Keep category-based for Korean originals
- Keep `en/` for English translations
- Link with `translations` frontmatter
- Add language switcher to UI

**Future Posts**:
- Korean original → Category folder
- English translation → `en/` folder
- Always link with `translations`
- Never duplicate in multiple locations
