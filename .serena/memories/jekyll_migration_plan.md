# Full Jekyll Migration Audit Plan

## Scope
**Target Posts**: ~95 posts from 2019-2021 requiring migration review

## Phase 1: Discovery & Cataloging (Day 1)

### 1.1 Generate Post Inventory
```bash
# Create comprehensive list of all old posts
find src/content/blog -name "*.mdx" -o -name "*.md" | \
  xargs grep -l "pubDate.*201[9]\\|pubDate.*202[01]" > old_posts_list.txt
```

### 1.2 Categorize Issues
- [ ] Posts with Jekyll `permalink:` field
- [ ] Posts with missing images
- [ ] Posts with broken image paths
- [ ] Posts with incorrect frontmatter
- [ ] Posts with Jekyll-specific syntax
- [ ] Posts with broken internal links

### 1.3 Create Issue Manifest
Document in `claudedocs/migration_issues.md`:
- Post path
- Issue type
- Severity (Critical/Medium/Low)
- Fix required

## Phase 2: Frontmatter Cleanup (Day 1-2)

### 2.1 Remove Jekyll Fields
Remove from all posts:
- `permalink:` (Astro uses file-based routing)
- `layout:` (if present)
- Jekyll-specific tags

### 2.2 Validate Required Fields
Ensure all posts have:
- `title:` ✓
- `author:` ✓
- `pubDate:` ✓
- `categories:` ✓
- `tags:` ✓

### 2.3 Standardize Date Format
Ensure consistent: `"YYYY-MM-DD HH:mm:ss"`

## Phase 3: Image Audit (Day 2)

### 3.1 Find All Image References
```bash
grep -r "!\[" src/content/blog --include="*.mdx" --include="*.md" | \
  grep "202[01]\\|2019" > image_references.txt
```

### 3.2 Verify Image Existence
For each image reference:
- Check if file exists in `public/assets/img/`
- Verify path is correct
- Test image loads in browser

### 3.3 Fix Broken Paths
Common issues:
- Jekyll paths: `/assets/` vs Astro: `/assets/`
- Relative vs absolute paths
- Missing image files

## Phase 4: Content Validation (Day 2-3)

### 4.1 Systematic Post Review
For each post category:
- **TechSavvy/** (technical posts)
- **DeepThinking/** (retrospectives)
- **Collaboration/** (toy projects)

### 4.2 Test in Browser
Navigate to each post:
- Check layout renders correctly
- Verify images display
- Test code blocks work
- Check links aren't broken

### 4.3 Content Issues
Look for:
- Broken markdown syntax
- Jekyll liquid tags ({{ }}, {% %})
- Missing content sections
- Formatting problems

## Phase 5: Specific Post Categories (Day 3)

### 5.1 High-Priority Posts
Review first:
1. **Retrospectives** (2020, 2021, 2022)
2. **Tesla AI Day** (2021-08-22)
3. **Adaptive AUTOSAR** (2021-04-15)
4. **Toy Projects** (2019)

### 5.2 Technical Series
Verify continuity:
- Embedded Linux series (00-04)
- Yocto series
- C++ series
- Bash series

## Phase 6: Automated Fixes (Day 3-4)

### 6.1 Batch Operations
Use scripts for:
- Removing `permalink:` fields
- Standardizing frontmatter
- Fixing common path issues

### 6.2 Validation Script
Create test script:
```bash
# Validate all posts build without errors
npm run build
# Check for broken links
# Verify image paths
```

## Phase 7: Testing & Verification (Day 4)

### 7.1 Build Test
```bash
npm run build
# Should have 0 errors
```

### 7.2 Browser Testing
Test sample posts from each category:
- Homepage listing
- Post page rendering
- Image loading
- Dark mode persistence
- Language switching

### 7.3 Regression Check
Ensure:
- No broken existing posts
- All images still work
- Navigation works
- Search works (if enabled)

## Phase 8: Documentation (Day 4)

### 8.1 Migration Report
Document in `claudedocs/migration_report.md`:
- Total posts audited
- Issues found
- Fixes applied
- Remaining issues (if any)

### 8.2 Update Memories
Update project memories with:
- Migration status
- Known issues
- Post-migration checklist

## Deliverables

1. **Clean Frontmatter**: All Jekyll fields removed
2. **Working Images**: All image paths verified and functional
3. **Valid Content**: No broken markdown or Jekyll syntax
4. **Build Success**: Zero build errors
5. **Browser Tested**: Sample posts verified in browser
6. **Documentation**: Complete migration report

## Timeline
- **Day 1**: Discovery, cataloging, frontmatter cleanup
- **Day 2**: Image audit, content validation start
- **Day 3**: Content validation, specific posts, automated fixes
- **Day 4**: Testing, verification, documentation

## Success Criteria
- [ ] All 95 old posts build without errors
- [ ] All images load correctly
- [ ] No Jekyll-specific syntax remains
- [ ] All posts render correctly in browser
- [ ] Dark mode works on all posts
- [ ] Language switching works
- [ ] Navigation persistence works
