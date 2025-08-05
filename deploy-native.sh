#!/bin/bash

# Native GitHub Pages Deployment Script
# This script builds and deploys the Astro site directly to gh-pages branch
# for immediate deployment without waiting for GitHub Actions

set -e

echo "🚀 Starting native GitHub Pages deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Cleanup function
cleanup() {
    if [ -d "dist" ]; then
        print_status "Cleaning up dist directory..."
        rm -rf dist/.git 2>/dev/null || true
    fi
}

# Set up trap for cleanup
trap cleanup EXIT

# Check if we're in the right directory
if [ ! -f "astro.config.mjs" ]; then
    print_error "astro.config.mjs not found. Are you in the project root?"
    exit 1
fi

# Check if we have uncommitted changes
if ! git diff-index --quiet HEAD -- 2>/dev/null; then
    print_warning "You have uncommitted changes in your working directory."
    print_warning "Consider committing them before deployment."
fi

# Build the site
print_status "Building Astro site..."
if ! bun astro build; then
    print_error "Build failed. Please fix the errors and try again."
    exit 1
fi
print_success "Build completed successfully!"

# Add .nojekyll file to prevent Jekyll processing
touch dist/.nojekyll
print_status "Added .nojekyll file"

# Generate build info
BUILD_TIME=$(date -u +%Y-%m-%dT%H:%M:%SZ)
COMMIT_HASH=$(git rev-parse --short HEAD)
COMMIT_MESSAGE=$(git log -1 --pretty=%B)

cat > dist/build-info.json << EOF
{
  "buildTime": "$BUILD_TIME",
  "commit": "$COMMIT_HASH",
  "commitMessage": "$COMMIT_MESSAGE",
  "deployer": "native-script"
}
EOF
print_status "Generated build info"

# Deploy to gh-pages branch
print_status "Deploying to gh-pages branch..."

cd dist

# Initialize git repository in dist
git init -q
git config user.name "GitHub Pages Deploy"
git config user.email "noreply@github.com"

# Add all files and commit
git add .
git commit -q -m "Deploy Astro site - $BUILD_TIME

Commit: $COMMIT_HASH
Built with: native deployment script"

# Add remote and force push to gh-pages
git remote add origin https://github.com/jayleekr/jayleekr.github.io.git
git branch -M gh-pages

if git push -f origin gh-pages; then
    print_success "Successfully deployed to gh-pages branch!"
    print_success "Your site will be available at: https://jayleekr.github.io"
    print_status "Note: It may take a few minutes for GitHub Pages to update."
else
    print_error "Failed to push to gh-pages branch"
    exit 1
fi

cd ..

print_success "Native GitHub Pages deployment completed! 🎉"
print_status "Deployment details:"
print_status "  - Build time: $BUILD_TIME"
print_status "  - Commit: $COMMIT_HASH"
print_status "  - No GitHub Actions required - immediate deployment!"