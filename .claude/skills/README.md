# Claude Code Skills

Custom skills for blog automation and content management.

## Available Skills

### `/notion-sync` - Notion to Blog Sync

Automatically sync new posts from Notion database to blog repository.

**Usage**:
```
/notion-sync [--dry-run] [--since YYYY-MM-DD]
```

**What it does**:
1. Fetches posts with status "Ready to Publish" from Notion
2. Converts Notion blocks to MDX with frontmatter
3. Downloads and optimizes images
4. Saves to appropriate blog directory
5. Creates git commits and push
6. Opens PR for review

**Prerequisites**:
- Notion API key in `.env`
- Notion database ID configured
- Database shared with integration

**Learn more**: See `/docs/features/notion-integration-guide.md`

---

### `/blog-converter` - Blog Post Converter

Convert Notion page content to SEO-optimized blog post format.

**Usage**:
```
/blog-converter --notion-page <page-id> [--output <path>]
```

**What it does**:
1. Extracts frontmatter from Notion properties
2. Converts blocks to semantic markdown
3. Adds H2/H3 headers for SEO
4. Processes and downloads images
5. Validates content quality
6. Formats with prettier

**Quality Gates**:
- Required frontmatter fields validation
- Minimum 2 H2 headers for SEO
- Description 50-160 characters
- No broken links
- Valid markdown syntax

**Learn more**: See `.claude/skills/blog-converter.skill.md`

---

## Creating New Skills

Skills are markdown files with frontmatter:

```markdown
---
skill: skill-name
description: What the skill does
---

# Skill Title

Instructions for how to perform the skill...
```

Place in `.claude/skills/` directory.

**Learn more**: [Claude Agent SDK - Skills Documentation](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview)

## Skill Development Guidelines

1. **Clear Purpose**: Each skill should have one clear purpose
2. **Prerequisites**: Document all requirements upfront
3. **Error Handling**: Include troubleshooting section
4. **Quality Gates**: Define validation criteria
5. **Examples**: Provide usage examples

## Testing Skills

Test skills before using in production:

```bash
# Dry run mode
/notion-sync --dry-run

# Manual testing
npm run notion:sync
```

## Integration with Subagents

Skills can delegate to subagents using the `Task` tool:

```markdown
When complexity is high, delegate to specialized agents:
- **Content Analysis**: Use `analyzer` agent
- **Code Generation**: Use `frontend` or `backend` agent
- **Quality Validation**: Use `qa` agent
```

## Related Documentation

- [Notion Integration Guide](../../docs/features/notion-integration-guide.md)
- [SuperClaude Framework](../COMMANDS.md)
- [Claude Agent SDK](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview)
