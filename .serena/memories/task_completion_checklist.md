# Task Completion Checklist

## Before Committing Changes

### 1. Type Checking
```bash
bun run type-check
```
- Ensures all TypeScript errors are resolved
- CRITICAL: Required before deployment

### 2. Linting
```bash
bun run lint
```
- Checks code style and quality
- Fix warnings and errors

### 3. Testing
```bash
bun run test           # Unit tests
bun run test:e2e       # E2E tests (if UI changes)
```
- Verify no regressions
- Add tests for new features

### 4. Build Validation
```bash
bun run build
```
- Ensures production build succeeds
- Catches build-time errors

### 5. Performance Check (Optional but Recommended)
```bash
bun run test:lighthouse
```
- Verify Lighthouse score ≥ 90
- Check Core Web Vitals

## Git Workflow

### 1. Review Changes
```bash
git status
git diff
```

### 2. Stage and Commit
```bash
git add .
git commit -m "feat: descriptive commit message"
```
Commit message format:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation
- `style:` for formatting
- `refactor:` for code restructuring
- `test:` for test additions
- `chore:` for maintenance

### 3. Push and Deploy
```bash
git push origin master
```
- Triggers GitHub Actions deployment
- Wait for Actions to complete (~2-3 minutes)
- Verify at https://jayleekr.github.io

## Deployment Rules (from CLAUDE.md)
- **RULE_DEPLOYMENT_01**: Always push to remote and wait for GitHub Actions completion after major changes
- **RULE_TYPECHECK_01**: Ensure all TypeScript errors are resolved before pushing
- Create Pull Request for all changes (as per CLAUDE.md)

## Workflow State Management (from CLAUDE.md)
- Always check `workflow_state.md` and `project_config.md` before starting
- Update `workflow_state.md` and `project_config.md` after completing work
- Create commit for each TodoList item completion
- Upload to GitHub remote after each commit
- Update all changes to GitHub via Pull Request when all work is finished

## Memory State Management
- Check current memory state regularly
- Update memories with progress and learnings
- Use `list_memories()` to see available memories
- Use `read_memory()` to load relevant context
- Use `write_memory()` to persist important information
