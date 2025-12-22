# Jekyll Migration Issue Manifest
**Generated**: 2025-12-22
**Total Posts**: 95 (from 2019-2021)

## Summary Statistics

| Category | Count | Status |
|----------|-------|--------|
| Total Old Posts | 95 | To Review |
| Posts with `permalink:` | 8 | **Critical** |
| Posts with Images | 39 | To Verify |
| Korean Posts (`ko/`) | 31 | To Review |
| English Posts (`en/`) | 31 | To Review |
| TechSavvy Posts | 27 | To Review |
| DeepThinking Posts | 5 | To Review |
| Collaboration Posts | 1 | To Review |

## Issue Categories

### 🔴 Critical: Permalink Cleanup (8 posts)
**Issue**: Jekyll `permalink:` field not used by Astro
**Action**: Remove field from frontmatter
**Files**:
```
(List in posts_with_permalinks.txt)
```

### 🟡 Medium: Image Verification (39 posts)
**Issue**: Need to verify all image paths work
**Action**: Check each image loads correctly
**Files**:
```
(List in posts_with_images.txt)
```

### 🟢 Low: General Review (95 posts)
**Issue**: Validate frontmatter and content
**Action**: Systematic review
**Files**:
```
(List in old_posts_list.txt)
```

## Post Distribution by Category

### TechSavvy (27 posts)
- EmbeddedLinux: 5 posts
- Bash: 11 posts
- Yocto: 2 posts
- C++: 3 posts
- ComputerArchitecture: 3 posts
- Container: 1 post
- LinuxKernel: 1 post
- Git: 1 post

### Multilingual (62 posts)
- Korean (`ko/`): 31 posts
- English (`en/`): 31 posts

### DeepThinking (5 posts)
- Retrospect series

### Collaboration (1 post)
- ToyProjects

## High-Priority Posts for Review

### Retrospectives
- [ ] 2020-12-31-year-end-retrospective.mdx (ko/en)
- [ ] 2021-12-31-year-retrospective.mdx (ko/en)
- [ ] 2021-04-15-adaptive-autosar-retrospect.mdx (ko/en)
- [ ] DeepThinking/Retrospect/2021-12-31-retro.mdx
- [ ] DeepThinking/Retrospect/2021-04-15-retro.mdx

### Tech Series
- [ ] EmbeddedLinux series (00-04): 5 posts
- [ ] Bash series: 11 posts
- [ ] Yocto series: 2 posts
- [ ] C++ series: 3 posts

### Notable Posts
- [ ] 2019-04-17-toyproject1.mdx (has 7 images)
- [ ] Tesla AI Day (if exists in 2021)

## Next Steps

1. **Phase 1 Complete** ✓
   - [x] Generate inventory (95 posts)
   - [x] Categorize issues
   - [x] Create manifest

2. **Phase 2: Start**
   - [ ] Review permalink posts
   - [ ] Remove Jekyll fields
   - [ ] Validate frontmatter

3. **Phase 3: Start**
   - [ ] Verify all 39 posts with images
   - [ ] Check image file existence
   - [ ] Test loading in browser
