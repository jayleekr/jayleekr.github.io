---
skill: blog-converter
description: Convert Notion page content to optimized blog post format
---

# Blog Post Converter Skill

Convert Notion page blocks to SEO-optimized Astro MDX blog post with proper structure.

## Conversion Process

### 1. Frontmatter Generation

Extract and format metadata:

```yaml
---
title: "Post Title from Notion"
author: "Jay Lee"
pubDate: 2025-12-31T00:00:00Z
categories: ["AI", "Tech"]
tags: ["notion", "automation", "blog"]
description: "Auto-generated description from first paragraph or Notion property"
image: "/blog-images/YYYY-MM-DD-slug/hero.jpg"  # if hero image exists
---
```

**Required Fields**:
- `title`: Notion page title
- `author`: From Notion author or config default
- `pubDate`: ISO 8601 format
- `categories`: Array from Notion multi-select
- `description`: Max 160 chars for SEO

**Optional Fields**:
- `tags`: Additional keywords
- `image`: Hero image path
- `draft`: Default false
- `featured`: From Notion checkbox property

### 2. Content Structure

**Semantic Headers**:
- Add H2 (`##`) for major sections
- Add H3 (`###`) for subsections
- Never use H1 (reserved for post title)
- Maintain hierarchy: H2 → H3, not H2 → H4

**Example Structure**:
```markdown
## Introduction
Brief overview of the topic...

## Main Concept
Deep dive into the core idea...

### Subtopic 1
Details about first aspect...

### Subtopic 2
Details about second aspect...

## Practical Applications
Real-world examples...

## Conclusion
Summary and takeaways...
```

### 3. Notion Block Conversions

**Text Blocks**:
- Paragraph → Plain markdown paragraph
- Heading 1 → `##` (H2)
- Heading 2 → `###` (H3)
- Heading 3 → `####` (H4)
- Bulleted list → `- item`
- Numbered list → `1. item`

**Rich Text**:
- **Bold** → `**text**`
- *Italic* → `*text*`
- `Code` → `` `text` ``
- ~~Strikethrough~~ → `~~text~~`

**Code Blocks**:
```markdown
```language
code content
`` `
```

**Callouts**:
```markdown
> **💡 Note**: Callout content here
```

**Images**:
- Download from Notion CDN
- Save to `public/blog-images/YYYY-MM-DD-slug/`
- Reference: `![alt text](/blog-images/YYYY-MM-DD-slug/image.jpg)`
- Optimize: Convert to WebP if >500KB

**Links**:
- External: `[text](url)`
- Internal: Convert Notion page links to blog post paths

**Embeds**:
- YouTube: Use Astro video component
- Twitter: Use embed component
- CodePen: Use iframe component

### 4. Bilingual Content Handling

**Korean Posts**:
- Filename: `YYYY-MM-DD-korean-slug.mdx`
- Categories: Use Korean terms if applicable
- Headers: Korean language headers

**English Posts**:
- Filename: `YYYY-MM-DD-english-slug.mdx`
- Standard English conventions

**Mixed Language**:
- Primary language determines filename
- Use language tags for code-switching sections

### 5. SEO Optimization

**Automatic Enhancements**:
- Generate meta description from first 2-3 sentences
- Extract keywords from categories and tags
- Add reading time estimate
- Generate table of contents from headers
- Add Open Graph metadata
- Add JSON-LD structured data

**Image Optimization**:
- Compress images >200KB
- Generate responsive sizes (400w, 800w, 1200w)
- Add lazy loading attributes
- Use descriptive alt text

### 6. Quality Validation

**Pre-Save Checks**:
- ✅ All required frontmatter fields present
- ✅ At least 2 H2 headers for SEO
- ✅ No orphaned H3 headers (must have parent H2)
- ✅ Description 50-160 characters
- ✅ All images downloaded successfully
- ✅ No broken internal links
- ✅ Valid markdown syntax
- ✅ Proper YAML frontmatter format

**Post-Conversion**:
- Run `prettier` for formatting
- Validate with `astro check`
- Check for common typos
- Verify code block syntax highlighting

## Usage

```bash
/blog-converter --notion-page <page-id> [--output <path>] [--dry-run]
```

### Options

- `--notion-page ID`: Notion page ID to convert
- `--output PATH`: Custom output path (default: auto-detect from categories)
- `--dry-run`: Preview conversion without saving
- `--skip-images`: Skip image downloads (faster for testing)
- `--language ko|en`: Force specific language handling

## Error Recovery

**Image Download Failure**:
```markdown
<!-- TODO: Manual image upload needed -->
<!-- Original URL: https://notion.so/image/... -->
![Image description](placeholder.jpg)
```

**Invalid Frontmatter**:
- Use sensible defaults
- Log warning with details
- Continue conversion

**Unsupported Blocks**:
- Convert to HTML comment
- Log for manual review
- Include original Notion URL

## Integration Points

### With notion-sync Skill
```javascript
// notion-sync calls blog-converter for each post
const converter = new BlogConverter(notionPage);
const mdx = await converter.convert();
await converter.save(mdx, targetPath);
```

### With Git Workflow
```javascript
// After conversion, create commit
await git.add(filePath);
await git.commit(`feat: Add post "${title}" from Notion`);
```

## Output Example

```markdown
---
title: "Building AI-Powered Workflows with Claude"
author: "Jay Lee"
pubDate: 2025-12-31T10:30:00Z
categories: ["AI", "Automation"]
tags: ["claude", "notion", "productivity"]
description: "Learn how to automate your blog workflow using Claude AI and Notion integration for seamless content publishing."
---

## Introduction

In this post, we'll explore how to build an automated blog publishing workflow...

## Why Automate Blog Publishing?

Manual blog publishing involves several repetitive steps...

### Time-Consuming Tasks

- Converting Notion pages to Markdown
- Formatting frontmatter metadata
- Optimizing images

### Error-Prone Processes

Human errors can occur during...

## Implementation Strategy

Let's break down the automation into key components...

## Conclusion

Automation saves time and reduces errors...
```
