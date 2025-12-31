---
skill: notion-sync
description: Sync new posts from Notion database to blog repository
---

# Notion to Blog Sync Skill

Automatically fetch new posts from Notion database and convert them to blog posts.

## Prerequisites

- Notion API key set in environment (`NOTION_API_KEY`)
- Notion database ID configured (`NOTION_DATABASE_ID`)
- Blog repository structure with `src/content/blog/` directory

## Workflow Steps

1. **Fetch New Posts**
   - Query Notion database for posts with `status: "Ready to Publish"`
   - Filter posts created/modified after last sync timestamp
   - Store last sync time in `.claude/notion-sync-state.json`

2. **Convert to Blog Format**
   - Use `notion-to-md` library to convert Notion blocks to Markdown
   - Generate frontmatter with:
     - title (from Notion page title)
     - pubDate (from Notion created time or custom property)
     - author (from Notion author or config)
     - categories (from Notion multi-select property)
     - tags (from Notion tags property)
     - description (from Notion description property or first paragraph)
   - Handle bilingual content (Korean/English)
   - Process images and save to `public/blog-images/`

3. **Save Blog Posts**
   - Determine target directory based on categories:
     - AI → `src/content/blog/DeepThinking/AI/`
     - Daily → `src/content/blog/DeepThinking/Daily/`
     - Tech → `src/content/blog/Tech/`
   - Generate filename: `YYYY-MM-DD-slug.mdx`
   - Add semantic H2/H3 headers for SEO

4. **Git Operations**
   - Create feature branch: `notion-sync/YYYY-MM-DD`
   - Commit each post separately
   - Push to remote and create PR

## Usage

```bash
/notion-sync [--dry-run] [--since YYYY-MM-DD] [--database-id ID]
```

### Options

- `--dry-run`: Preview posts without saving
- `--since DATE`: Sync posts since specific date (overrides last sync time)
- `--database-id ID`: Use specific Notion database (overrides config)

## Configuration

Create `.env` file in project root:

```env
NOTION_API_KEY=secret_xxxxxxxxxxxxxxxxxxxxx
NOTION_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_AUTHOR=Jay Lee
```

## Error Handling

- **API Rate Limits**: Implement exponential backoff with 3 retries
- **Image Download Failures**: Log error and continue with post (manual fix needed)
- **Duplicate Posts**: Skip if file with same slug already exists
- **Invalid Frontmatter**: Validate before saving, use defaults for missing fields

## Quality Gates

- ✅ Validate Notion API connection before starting
- ✅ Check all required frontmatter fields exist
- ✅ Verify target directory exists
- ✅ Ensure images are downloaded successfully
- ✅ Run markdown linter on converted content
- ✅ Verify git status before commit

## Post-Sync Actions

1. Update sync state file with latest timestamp
2. Generate summary report:
   - Number of posts synced
   - Categories distribution
   - Any errors or warnings
3. Open PR link in browser for review
