# Code Style and Conventions

## File Naming
- **kebab-case** for files and directories
- **camelCase** for variables and functions
- **PascalCase** for components and types

## TypeScript
- Strict mode enabled
- Proper null/undefined checks required
- Type hints preferred over any
- Interface over type when possible

## Code Formatting (Prettier)
- Semi-colons: required (true)
- Quotes: single quotes preferred
- Tab width: 2 spaces (tabs for .ts/.astro, spaces for .md/.mdx)
- Trailing commas: ES5 style
- Print width: 80 characters
- End of line: LF (Unix)

## Linting (ESLint)
- No unused variables: warn
- No explicit any: warn
- No console: warn (allowed in development)
- Prefer const over let: error
- No var: error

## Component Structure
- Astro components in src/components/
- Layouts in src/layouts/
- Pages in src/pages/ (file-based routing)
- Utilities in src/utils/
- Types in src/types/

## Content Organization
- Blog posts in src/content/blog/[Category]/[Subcategory]/
- MDX frontmatter required with title, author, pubDate, categories, tags
- Categories: TechSavvy, DeepThinking, Collaboration
- Subcategories: EmbeddedLinux, Container, Yocto, C++, Bash, Daily, Retrospect, AI, ToyProjects

## Development Philosophy
- Content-first minimalist design
- Mobile-first responsive approach
- Accessibility-first development (WCAG 2.1 AA)
- Performance-optimized with lazy loading
- TypeScript strict mode for type safety
