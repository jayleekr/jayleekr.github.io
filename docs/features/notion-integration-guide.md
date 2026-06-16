# Notion Integration Guide

Automated blog posting workflow from Notion to GitHub Pages.

## 🎯 Overview

This integration allows you to:
- Write blog posts in Notion (familiar editing experience)
- Automatically convert to MDX with proper formatting
- Sync to GitHub repository with proper structure
- Create pull requests for review
- Publish to blog after merge

## 📋 Prerequisites

1. **Notion Account** with a database for blog posts
2. **Notion API Integration** with database access
3. **Environment Variables** configured in `.env`
4. **GitHub CLI** (`gh`) for PR creation (optional but recommended)

## 🚀 Setup Instructions

### Step 1: Create Notion Integration

1. Go to [https://www.notion.so/my-integrations](https://www.notion.so/my-integrations)
2. Click **"+ New integration"**
3. Name it: `Blog Sync Integration`
4. Select your workspace
5. Click **"Submit"**
6. Copy the **Internal Integration Secret** (starts with `secret_`)

### Step 2: Create Notion Database

Create a database in Notion with these properties:

| Property Name | Type | Description |
|--------------|------|-------------|
| Title | Title | Post title (required) |
| Status | Status | "Draft", "Ready to Publish", "Published" |
| Categories | Multi-select | AI, Tech, Daily, etc. |
| Tags | Multi-select | Additional tags |
| PublishDate | Date | Publication date (optional, defaults to created time) |
| Author | Text | Author name (optional, defaults to env var) |
| Description | Text | Meta description (optional, auto-generated if empty) |

**Status Options**:
- 🟡 Draft - Work in progress
- 🟢 Ready to Publish - Will be synced
- 🔵 Published - Already synced

### Step 3: Share Database with Integration

1. Open your Notion database
2. Click **"•••"** (three dots) in top right
3. Click **"Connect to"**
4. Find and select your **"Blog Sync Integration"**

### Step 4: Get Database ID

From your database URL:
```
https://notion.so/[workspace]/[DATABASE_ID]?v=...
                              ^^^^^^^^^^^^^^^^
```

Copy the 32-character ID (without hyphens).

### Step 5: Configure Environment Variables

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Edit `.env` with your values:
```env
NOTION_API_KEY=secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_AUTHOR=Jay Lee
```

3. **Important**: Never commit `.env` to git (already in `.gitignore`)

### Step 6: Install GitHub CLI (Optional)

For automatic PR creation:

**macOS**:
```bash
brew install gh
gh auth login
```

**Linux**:
```bash
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
sudo apt update
sudo apt install gh
gh auth login
```

## 📝 Usage

### Using Claude Code Skill

```bash
/notion-sync
```

This will:
1. Fetch posts with status "Ready to Publish"
2. Convert to MDX with frontmatter
3. Save to appropriate directory
4. Create commits
5. Push to GitHub
6. Create PR

### Using npm Script

```bash
npm run notion:sync
```

### Direct Execution

```bash
./scripts/notion-to-blog.mjs
```

## 📂 How It Works

### 1. Fetching Posts

Queries Notion database for posts where:
- `Status = "Ready to Publish"`
- `Last edited time > Last sync time`

### 2. Content Conversion

**Notion Blocks → Markdown**:
- Heading 1 → `## H2`
- Heading 2 → `### H3`
- Heading 3 → `#### H4`
- Paragraph → Plain text
- Code blocks → ` ```language`
- Images → Downloaded to `public/blog-images/[slug]/`
- Links → Preserved

**Frontmatter Generation**:
```yaml
---
title: "Post Title"
author: "Jay Lee"
pubDate: 2025-12-31T00:00:00Z
categories: ["AI", "Tech"]
tags: ["notion", "automation"]
description: "Auto-generated or from Notion property"
---
```

### 3. Directory Placement

Posts are placed based on categories:

| Category | Directory |
|----------|-----------|
| AI | `src/content/blog/DeepThinking/AI/` |
| Daily | `src/content/blog/DeepThinking/Daily/` |
| Tech | `src/content/blog/Tech/` |
| Other | `src/content/blog/DeepThinking/Daily/` (default) |

### 4. Git Workflow

```bash
# Create feature branch
git checkout -b notion-sync/2025-12-31

# For each post
git add src/content/blog/[category]/[date]-[slug].mdx
git commit -m "feat: Add post \"[title]\" from Notion"

# Push to remote
git push -u origin notion-sync/2025-12-31

# Create PR (if gh CLI available)
gh pr create --title "Notion sync: X new post(s)" --body "..."
```

## 🎨 Notion Writing Tips

### Use Semantic Structure

**Good**:
```
# Introduction
Your intro paragraph...

# Main Concept
Deep dive content...

## Subtopic 1
Details...

## Subtopic 2
More details...

# Conclusion
Wrap up...
```

**Result**:
```markdown
## Introduction
Your intro paragraph...

## Main Concept
Deep dive content...

### Subtopic 1
Details...

### Subtopic 2
More details...

## Conclusion
Wrap up...
```

### Images

- Paste images directly in Notion (they'll be auto-downloaded)
- Add alt text via image caption
- Large images will be optimized

### Code Blocks

Use Notion's code blocks with language selection:
```
/code
```

### Callouts

Notion callouts become blockquotes:
> **💡 Note**: Important information

## 🔍 Troubleshooting

### "Missing required environment variables"

**Problem**: `.env` file not found or missing variables

**Solution**:
```bash
cp .env.example .env
# Edit .env with your actual values
```

### "Notion API error: object not found"

**Problem**: Integration doesn't have access to database

**Solution**:
1. Open Notion database
2. Click "•••" → "Connect to"
3. Select your integration

### "Image download failed"

**Problem**: Notion CDN image expired or network issue

**Solution**:
- Re-upload image in Notion
- Check network connectivity
- Try sync again

### "File already exists"

**Problem**: Post was already synced

**Solution**:
- This is normal behavior (prevents duplicates)
- Delete the file if you want to re-sync
- Or change the title to create a new slug

### PR creation failed

**Problem**: `gh` CLI not authenticated

**Solution**:
```bash
gh auth login
# Follow the prompts
```

## 📊 Sync State Tracking

Sync state is saved in `.claude/notion-sync-state.json`:

```json
{
  "lastSync": "2025-12-31T10:30:00.000Z",
  "updatedAt": "2025-12-31T10:35:00.000Z"
}
```

This prevents re-syncing the same posts.

**To reset sync state**:
```bash
rm .claude/notion-sync-state.json
```

## 🎯 Best Practices

1. **Use Status Property**: Keep "Draft" posts separate from "Ready to Publish"
2. **Fill All Properties**: Complete categories, tags, description for better SEO
3. **Review Before Sync**: Mark as "Ready to Publish" only when content is final
4. **Review PRs**: Always review the PR before merging (check formatting, images)
5. **Update Status**: Change to "Published" in Notion after merge

## 🚦 Next Steps

After syncing:

1. **Review PR**: Check formatting and images
2. **Test Locally**:
   ```bash
   git checkout notion-sync/2025-12-31
   npm run dev
   # Visit http://localhost:4321/blog/
   ```
3. **Merge PR**: Approve and merge to master
4. **Deploy**: GitHub Actions will auto-deploy
5. **Update Notion**: Change status to "Published"

## 📚 Related Documentation

- [Blog Post Writing Guide](../content/blog-writing-guide.md)
- [Bilingual Content Guide](../../claudedocs/bilingual-content-guide.md)
- [SEO Optimization Guide](../analytics/seo-optimization-guide.md)
