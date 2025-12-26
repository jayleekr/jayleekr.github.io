# SEO Quick Start Guide

**Last Updated**: 2025-12-26
**Status**: Ready for Production

---

## 🚀 Quick Testing (30 seconds)

```bash
# Run automated SEO test
node scripts/test-seo.js
```

**Current Status**: 28/39 tests passed (72%) ✅
- 1 expected failure (sitemap generated during build)
- 10 warnings (verification codes needed after deployment)

---

## 📋 Pre-Deployment Checklist

### 1. Build and Test (5 minutes)

```bash
# Generate sitemap and production assets
npm run build

# Test production build
npm run preview

# Re-run SEO test
node scripts/test-seo.js
```

**Expected**: 37/39 tests pass (only verification code warnings)

### 2. Verify Key Files

```bash
# Check sitemap exists
ls dist/sitemap-index.xml

# Check RSS feed
curl http://localhost:4321/rss.xml

# Verify robots.txt
cat public/robots.txt
```

### 3. Test URL Readability

```bash
# All blog posts should have clean URLs (no Korean chars)
find src/content/blog -name "*.mdx" | grep -E '[가-힣]'
```

**Expected**: No results (all clean) ✅

---

## 🌐 Post-Deployment Steps

### Day 1: Search Engine Registration

**1. Google Search Console** (15 minutes)
```
URL: https://search.google.com/search-console
Steps:
1. Add property: https://jayleekr.github.io
2. Verify with HTML meta tag
3. Submit sitemap: https://jayleekr.github.io/sitemap-index.xml
4. Copy verification code to BaseHead.astro line 208
```

**2. Bing Webmaster Tools** (10 minutes)
```
URL: https://www.bing.com/webmasters
Steps:
1. Add site
2. Verify with HTML meta tag
3. Submit sitemap
4. Copy verification code to BaseHead.astro line 211
```

### Day 2-7: Monitor Indexing

```bash
# Check if pages are indexed
# Google:
site:jayleekr.github.io

# Check specific posts
site:jayleekr.github.io blog
```

### Week 2: Social Media Testing

Test all posts preview correctly:
- Facebook: https://developers.facebook.com/tools/debug/
- Twitter: https://cards-dev.twitter.com/validator
- LinkedIn: https://www.linkedin.com/post-inspector/

**Check**:
- ✅ Image displays (1200x630px)
- ✅ Title shows correctly
- ✅ Description visible
- ✅ URL is clean (no %XX encoding)

---

## 📊 What's Being Tested

### ✅ Passing Tests (28/39)

**File Structure** (4/5):
- ✅ robots.txt exists
- ✅ RSS feed generator exists
- ✅ PWA manifest configured
- ✅ Favicon present
- ⚠️  Sitemap (generated during build)

**Robots.txt** (4/4):
- ✅ Sitemap URL declared
- ✅ Allow rules present
- ✅ Build files disallowed
- ✅ Crawl-delay configured

**Meta Tags** (12/17):
- ✅ All essential meta tags present
- ✅ Open Graph tags complete
- ✅ Twitter Cards configured
- ✅ JSON-LD structured data
- ⚠️  Verification codes pending

**RSS Feed** (2/3):
- ✅ Generator function exists
- ✅ Feed metadata present
- ⚠️  Content type not explicit

**Images** (2/3):
- ✅ Organized by date
- ✅ 6 blog post directories
- ⚠️  No WebP/AVIF (optional)

**Performance** (3/5):
- ✅ Service Worker (PWA)
- ✅ Manifest configured
- ✅ 8 icon sizes
- ⚠️  Compression (GitHub Pages handles)
- ⚠️  Prefetch (optional)

### ⚠️  Warnings (10)

Most warnings are post-deployment tasks:
1. Sitemap not built yet → `npm run build`
2-4. Verification codes → Add after deployment
5. Language tags → Optional (Korean default)
6. Content type → Works without explicit declaration
7-8. Image optimization → Optional enhancement
9-10. Performance config → GitHub Pages handles

### ❌ Critical Issues (0 before build, 1 during dev)

- Sitemap missing → **Expected** (generated during `npm run build`)

---

## 🎯 Success Criteria

### Technical SEO (Automated)
- [x] All meta tags present
- [x] Structured data (JSON-LD)
- [x] robots.txt configured
- [x] RSS feed working
- [x] URL structure clean (no Korean chars)
- [ ] Sitemap generated (`npm run build`)
- [ ] Verification codes added (post-deployment)

### Performance (Manual Testing)
Target after deployment:
- [ ] PageSpeed Insights: ≥90/100
- [ ] Core Web Vitals: All green
- [ ] Mobile-Friendly Test: Pass
- [ ] SSL Labs: Grade A

### Indexing (Week 1-4)
- [ ] Google Search Console setup
- [ ] Sitemap submitted
- [ ] First pages indexed
- [ ] No coverage errors

---

## 🔧 Common Fixes

### "Sitemap not found"
```bash
# Solution: Build the project
npm run build

# Verify
ls dist/sitemap-index.xml
```

### "Korean characters in URL"
```bash
# Run slug test
node scripts/test-slugify.js

# Re-sync posts with new slugify module
node scripts/sync-all-notion.js
```

### "Verification code missing"
```bash
# After deployment:
1. Get code from Google Search Console
2. Edit src/components/BaseHead.astro line 208
3. Commit and deploy
4. Click "Verify" in Search Console
```

---

## 📚 Full Documentation

**Comprehensive Guide**: `docs/SEO-Testing-Guide.md`
- Complete testing procedures
- Tool-by-tool instructions
- Monitoring setup
- Troubleshooting guide
- 750+ lines of detailed documentation

**Testing Script**: `scripts/test-seo.js`
- Automated validation
- 39 comprehensive checks
- Actionable recommendations
- Color-coded results

---

## 🎓 Learning Resources

### Must-Read
1. [Google Search Central](https://developers.google.com/search)
2. [Web.dev Learn SEO](https://web.dev/learn/seo/)
3. [Moz Beginner's Guide](https://moz.com/beginners-guide-to-seo)

### Tools
- **Free**: Google Search Console, PageSpeed Insights
- **Premium**: Ahrefs ($99/mo), SEMrush ($119/mo)

### Metrics to Watch
- **Impressions**: How many times your links appear in search
- **CTR**: Click-through rate (aim for >2%)
- **Average Position**: Ranking in search results (aim for <20)
- **Core Web Vitals**: LCP, FID, CLS (all green)

---

## ✅ Next Actions

1. **Now**: Run `node scripts/test-seo.js` to verify current state
2. **Before Deploy**: Run `npm run build` to generate sitemap
3. **After Deploy**:
   - Add verification codes
   - Submit sitemap to search engines
   - Test social previews
4. **Week 1**: Set up monitoring (Search Console, Analytics)
5. **Monthly**: Run full SEO audit using testing guide

---

**Need Help?** See `docs/SEO-Testing-Guide.md` for detailed instructions.

**Last Test Run**: 2025-12-26
**Next Review**: After production deployment
