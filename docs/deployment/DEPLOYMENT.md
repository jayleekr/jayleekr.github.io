# Native GitHub Pages Deployment

This repository has been configured for **native GitHub Pages deployment** to eliminate GitHub Actions costs and complexity while providing immediate deployment on push to master.

## Overview

**Before**: GitHub Actions → Build → Deploy → Wait (costs and delays)
**After**: Local Build → Direct Push → Immediate Deployment (free and fast)

## How It Works

1. **Build Process**: Astro builds static files to `dist/` directory
2. **Direct Deployment**: Built files are pushed directly to `gh-pages` branch
3. **Native Serving**: GitHub Pages serves files from `gh-pages` branch immediately
4. **No Actions**: No GitHub Actions workflows required for deployment

## Quick Deployment

### Option 1: Use the deployment script
```bash
./deploy-native.sh
```

### Option 2: Manual deployment
```bash
# Build the site
bun astro build

# Add .nojekyll to prevent Jekyll processing
touch dist/.nojekyll

# Deploy to gh-pages branch
cd dist
git init
git add .
git commit -m "Deploy site - $(date -u +%Y-%m-%dT%H:%M:%SZ)"
git branch -M gh-pages
git remote add origin https://github.com/jayleekr/jayleekr.github.io.git
git push -f origin gh-pages
cd ..
```

## Configuration Details

### GitHub Pages Settings
- **Source**: Deploy from `gh-pages` branch
- **Path**: `/` (root directory)
- **Build Type**: Legacy (native GitHub Pages)
- **URL**: https://jayleekr.github.io

### Repository Structure
```
├── src/                    # Astro source files
├── public/                 # Static assets
├── dist/                   # Built files (generated, not committed)
├── deploy-native.sh        # Deployment script
├── astro.config.mjs        # Astro configuration
└── .github/workflows/      # GitHub Actions (disabled for deployment)
```

## Benefits

### ✅ Advantages
- **Immediate Deployment**: No waiting for Actions to complete
- **Zero Cost**: No GitHub Actions minutes consumed
- **Simple Workflow**: Direct push to deploy
- **Full Control**: Manual control over when to deploy
- **Fast Feedback**: See changes live in seconds

### ⚠️ Considerations
- **Manual Process**: Must run deployment script or commands manually
- **Local Build**: Requires local build environment (Bun/Node.js)
- **No Automatic Checks**: No automated testing before deployment
- **Branch Management**: Must manage `gh-pages` branch separately

## Workflow Integration

### Disabled GitHub Actions
The following workflows have been disabled for deployment:
- `.github/workflows/deploy.yml` - Now manual trigger only
- `.github/workflows/production-deploy.yml` - Now manual trigger only

### Active GitHub Actions
These workflows remain active for development:
- `ci.yml` - Continuous integration and testing
- `pr-check.yml` - Pull request validation
- `monitoring.yml` - Site monitoring
- `rollback.yml` - Rollback capabilities

## Development Workflow

1. **Develop**: Make changes to source files
2. **Test**: Run local development server (`bun dev`)
3. **Commit**: Commit changes to master branch
4. **Deploy**: Run `./deploy-native.sh` when ready to deploy
5. **Verify**: Check https://jayleekr.github.io

## Troubleshooting

### Build Fails
```bash
# Check for TypeScript errors
bun astro check

# Run without type check
bun astro build --no-check
```

### Deployment Fails
```bash
# Check git authentication
gh auth status

# Force push to gh-pages (be careful!)
cd dist && git push -f origin gh-pages
```

### Site Not Updating
1. Check GitHub Pages build status at repository Settings → Pages
2. Wait 1-2 minutes for CDN cache to clear
3. Hard refresh browser (Ctrl+F5 or Cmd+Shift+R)

## Security Considerations

### Headers and Configuration
- `_headers` file in `public/` configures security headers
- `.nojekyll` prevents Jekyll processing
- `robots.txt` and `sitemap.xml` handled by Astro

### Branch Protection
The `gh-pages` branch is force-pushed on each deployment. This is intentional and safe since it only contains built files.

## Migration Notes

This repository was migrated from GitHub Actions deployment to native GitHub Pages deployment on 2025-08-05. The previous GitHub Actions workflows remain available for manual triggering if needed.

## Additional Commands

### Preview Build Locally
```bash
bun astro build
bun astro preview
```

### Check GitHub Pages Status
```bash
gh api repos/jayleekr/jayleekr.github.io/pages
```

### View Deployment History
```bash
git log --oneline origin/gh-pages
```