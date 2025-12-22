# Suggested Development Commands

## Essential Commands

### Development
```bash
bun run dev              # Start dev server at localhost:4321
bun install              # Install dependencies
```

### Building
```bash
bun run build            # Type check + build production site
bun run preview          # Preview production build locally
```

### Testing
```bash
bun run test             # Run unit tests (Vitest)
bun run test:watch       # Run tests in watch mode
bun run test:coverage    # Generate coverage report
bun run test:e2e         # Run E2E tests (Playwright)
bun run test:e2e:ui      # Run E2E tests with UI
bun run test:lighthouse  # Run Lighthouse performance tests
bun run test:all         # Run all tests (unit + E2E + Lighthouse)
```

### Quality Checks
```bash
bun run type-check       # TypeScript type checking (astro check)
bun run lint             # Run ESLint on src/
bun run format           # Format code with Prettier
```

### Deployment
```bash
./deploy-native.sh       # Direct deployment to GitHub Pages
git push origin master   # Triggers GitHub Actions deployment
```

### Dependency Management
```bash
bun audit                # Check for vulnerabilities
bun audit --fix          # Auto-fix vulnerabilities
bun update               # Update dependencies
bun outdated             # Check for outdated packages
```

## System Commands (macOS Darwin)
```bash
git status               # Check git status
git branch               # List branches
ls -la                   # List files with details
find . -name "*.ts"      # Find files by pattern
grep -r "search" src/    # Search in files
```

## Important Notes
- Use `bun` as primary package manager (faster than npm)
- `npm` commands also work (fallback compatibility)
- All changes auto-deployed via GitHub Actions on push to master
- Local deployment available via `./deploy-native.sh` for immediate updates
