# Project Configuration

**Project**: jayleekr.github.io
**Type**: Personal Blog & Portfolio
**Framework**: Astro + MDX
**Last Updated**: 2025-12-26

## Repository Information

- **Remote**: https://github.com/jayleekr/jayleekr.github.io.git
- **Main Branch**: `master`
- **Current Branch**: `feature/ultra-minimal-refactoring`
- **Working Directory**: `/Users/jaylee/CodeWorkspace/jayleekr.github.io`

## Development Workflow

### Branch Strategy
- Main branch: `master` (production)
- Feature branches: `feature/*` naming convention
- All work must be done through Pull Requests
- No direct commits to `master`

### Commit Guidelines
- Create commits after completing each TODO item
- Upload commits to remote immediately after creation
- Always upload final work to GitHub regardless of review status
- Use conventional commit format (feat:, fix:, docs:, style:, etc.)
- Include Claude Code signature in commits

### Required Checks Before Commit
1. Review `workflow_state.md` for current state
2. Update `workflow_state.md` with completed work
3. Verify all TODOs are tracked and updated
4. Check memory state periodically

## Notion Integration

### Configuration
- **API Source**: Notion Database
- **Sync Script**: `scripts/sync-all-notion.js`
- **Content Pipeline**: Notion → Markdown → MDX → Blog Post
- **Image Handling**: Download to `public/blog-images/`
- **URL Generation**: Slugified (Korean → English)
- **Content Formatting**: Automated readability improvements

### Sync Flags
- `--force`: Re-sync all posts regardless of modification date
- Default: Only sync new or updated posts

### Content Processing Pipeline
1. Fetch from Notion API
2. Convert to Markdown
3. Sanitize for MDX compatibility
4. Apply content formatting (spacing, headers, paragraphs)
5. Process and download images
6. Generate frontmatter
7. Write to blog directory

## Build System

### Framework
- **Static Site Generator**: Astro
- **Content**: MDX (Markdown + JSX)
- **Styling**: Tailwind CSS
- **Components**: React-based

### Build Commands
- `npm run build`: Production build
- `npm run dev`: Local development server
- `npm run preview`: Preview production build

## Content Structure

### Blog Categories
- `DeepThinking/Daily`: Daily thoughts and reflections
- `TechSavvy/AI`: AI and technology content
- `Collaboration/ToyProjects`: Collaborative projects

### File Naming Convention
- Format: `YYYY-MM-DD-slug.mdx`
- Example: `2025-12-10-20251209-anthropic-bun.mdx`
- Slugs: English-only, lowercase, hyphen-separated

### Frontmatter Schema
```yaml
---
title: "Post Title"
author: "Jay Lee"
pubDate: "YYYY-MM-DDTHH:MM:SS.SSSZ"
lastEditedTime: "YYYY-MM-DDTHH:MM:SS.SSSZ"
categories: ["Category1", "Category2"]
tags: ["tag1", "tag2", "tag3"]
---
```

## Quality Standards

### Content Readability
- **Target Score**: 80+ / 100
- **Blank Line Ratio**: 40-60% (optimal)
- **Paragraph Length**: <800 characters (auto-break at sentences)
- **Header Spacing**: Blank lines before and after all headers
- **List Formatting**: Proper spacing between items

### Code Quality
- ESLint compliance
- TypeScript strict mode
- Prettier formatting
- Git hooks for pre-commit checks

## Memory Management

### Session Persistence
- Use Serena MCP for project memory
- Regular checkpoints during long sessions
- Update workflow_state.md at session end
- Clean up temporary files and completed memories

### Important Files to Track
- `/docs/workflow_state.md`: Current sprint and task status
- `/docs/project_config.md`: This file (project configuration)
- `/scripts/sync-all-notion.js`: Main sync script
- `/scripts/utils/format-content.js`: Content formatting utilities
- `/scripts/utils/slugify.js`: URL slugification

## Dependencies

### Core
- Node.js (latest LTS)
- npm package manager
- Git version control

### Major Packages
- `@astrojs/mdx`: MDX integration
- `@notionhq/client`: Notion API client
- `slugify`: URL slug generation
- `axios`: HTTP client for image downloads

## Environment

### System
- Platform: macOS (darwin)
- OS Version: Darwin 24.5.0
- Date: 2025-12-26

### Git Status
- Repository: Clean working directory (after recent commits)
- Remote: Up to date with origin

## Notes

- Always use system time for date operations
- All uploads must go through Pull Requests
- Periodically verify and update memory state
- Documentation in `/docs/` directory
- Test scripts are temporary and should be cleaned up
