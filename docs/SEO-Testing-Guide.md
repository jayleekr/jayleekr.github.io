# SEO Testing & Monitoring Guide

**Version**: 1.0
**Last Updated**: 2025-12-26
**Status**: Production Ready

---

## Quick Start

```bash
# 1. Run automated SEO tests
node scripts/test-seo.js

# 2. Build and test production
npm run build
node scripts/test-seo.js https://jayleekr.github.io

# 3. Test locally with production build
npm run preview
```

---

## Testing Checklist

### ✅ Pre-Deployment Tests (Local)

#### 1. Build Process
```bash
npm run build
```
**Expected**: No errors, sitemap-index.xml generated in `dist/`

#### 2. Meta Tags Validation
```bash
node scripts/test-seo.js
```
**Expected**: All meta tag tests pass (12/12)

#### 3. URL Structure
```bash
# Check for Korean characters in URLs
find src/content/blog -name "*.mdx" | grep -E '[가-힣]'
```
**Expected**: No results (all URLs are ASCII-only)

#### 4. Robots.txt
```bash
cat public/robots.txt
```
**Check**:
- ✅ Sitemap URL: `https://jayleekr.github.io/sitemap-index.xml`
- ✅ Allow: `/`
- ✅ Disallow build directories: `/_astro/`, `/node_modules/`

#### 5. RSS Feed
```bash
# After build, check RSS
open http://localhost:4321/rss.xml
```
**Expected**: Valid XML feed with all posts

### 🌐 Post-Deployment Tests (Production)

#### 1. Search Engine Visibility

**Google Search Console** (https://search.google.com/search-console)
```
1. Add property: https://jayleekr.github.io
2. Verify ownership (HTML meta tag method)
3. Submit sitemap: https://jayleekr.github.io/sitemap-index.xml
4. Monitor:
   - Pages indexed
   - Coverage issues
   - Core Web Vitals
   - Mobile usability
```

**Bing Webmaster Tools** (https://www.bing.com/webmasters)
```
1. Add site: https://jayleekr.github.io
2. Verify ownership (HTML meta tag)
3. Submit sitemap
4. Monitor indexing status
```

#### 2. Structured Data Validation

**Google Rich Results Test**
```
URL: https://search.google.com/test/rich-results
Test: https://jayleekr.github.io/blog/[any-post]

Expected Results:
✅ BlogPosting schema detected
✅ Author information
✅ Date published/modified
✅ Article section
✅ Keywords
```

**Schema.org Validator**
```
URL: https://validator.schema.org
Test: Any blog post URL

Expected:
✅ Valid JSON-LD
✅ No errors or warnings
```

#### 3. Social Media Preview Testing

**Facebook Debugger**
```
URL: https://developers.facebook.com/tools/debug/
Test: https://jayleekr.github.io/blog/[any-post]

Check:
✅ og:title displays correctly
✅ og:description shows
✅ og:image loads (1200x630px)
✅ og:type = "article"
```

**Twitter Card Validator**
```
URL: https://cards-dev.twitter.com/validator
Test: Any blog post URL

Check:
✅ twitter:card = "summary_large_image"
✅ Image preview loads
✅ Title and description visible
```

**LinkedIn Post Inspector**
```
URL: https://www.linkedin.com/post-inspector/
Test: Any blog post URL

Check:
✅ Preview shows correctly
✅ Image displays
```

#### 4. Performance Testing

**Google PageSpeed Insights**
```
URL: https://pagespeed.web.dev
Test: https://jayleekr.github.io

Target Scores:
✅ Performance: ≥90
✅ Accessibility: ≥95
✅ Best Practices: ≥95
✅ SEO: 100
```

**Core Web Vitals**
```
Metrics to monitor:
✅ LCP (Largest Contentful Paint): <2.5s
✅ FID (First Input Delay): <100ms
✅ CLS (Cumulative Layout Shift): <0.1
```

**WebPageTest** (https://webpagetest.org)
```
Test from multiple locations:
- Seoul, South Korea (primary audience)
- San Francisco, USA
- London, UK

Check:
✅ First Byte Time: <600ms
✅ Speed Index: <3s
✅ Total Page Size: <2MB
```

#### 5. Mobile-Friendliness

**Google Mobile-Friendly Test**
```
URL: https://search.google.com/test/mobile-friendly
Test: https://jayleekr.github.io

Expected:
✅ Page is mobile-friendly
✅ Text is readable without zooming
✅ Tap targets are adequately sized
✅ Content fits screen width
```

#### 6. SSL/HTTPS Validation

**SSL Labs**
```
URL: https://www.ssllabs.com/ssltest/
Test: jayleekr.github.io

Expected:
✅ Grade A or A+
✅ TLS 1.2+ enabled
✅ No known vulnerabilities
```

---

## Monitoring Setup

### 1. Google Search Console (Essential)

**Setup Steps:**
1. Go to https://search.google.com/search-console
2. Add property: `https://jayleekr.github.io`
3. Verify using HTML meta tag:
   ```html
   <meta name="google-site-verification" content="YOUR-CODE" />
   ```
4. Add verification code to `src/components/BaseHead.astro` (line 208)
5. Submit sitemap: `https://jayleekr.github.io/sitemap-index.xml`

**Monitor Weekly:**
- Total clicks and impressions
- Average CTR (Click-Through Rate)
- Average position in search results
- Coverage issues
- Core Web Vitals

**Action Items:**
- Fix coverage errors immediately
- Optimize pages with high impressions but low CTR
- Monitor mobile usability issues

### 2. Google Analytics 4 (Traffic Analysis)

**Already Configured** ✅
- Tracking ID in `src/components/GoogleAnalytics.astro`
- Privacy-compliant (no cookies before consent)

**Monitor:**
- Page views and user engagement
- Traffic sources (organic, direct, referral, social)
- Bounce rate and time on page
- Popular content and trending posts

### 3. Bing Webmaster Tools (Secondary)

**Setup:**
1. Go to https://www.bing.com/webmasters
2. Add site and verify
3. Submit sitemap

**Check Monthly:**
- Indexing status
- Keyword rankings
- Crawl errors

### 4. Uptime Monitoring

**Recommended Tool**: UptimeRobot (https://uptimerobot.com)
```
Monitor: https://jayleekr.github.io
Interval: Every 5 minutes
Alert: Email if down > 2 minutes
```

---

## SEO Best Practices

### Content Optimization

#### Title Tags
```
✅ Good: "How to Build a Blog with Astro | Jay Lee"
❌ Bad: "Blog Post"

Rules:
- 50-60 characters
- Include primary keyword
- Add brand at end
- Unique for each page
```

#### Meta Descriptions
```
✅ Good: "Step-by-step guide to building a modern blog with Astro 5.x,
         including SEO optimization and performance best practices."
❌ Bad: "Learn about Astro"

Rules:
- 150-160 characters
- Include call-to-action
- Natural language
- Summarize page content
```

#### Headings Structure
```html
✅ Correct hierarchy:
<h1>Main Title</h1>
  <h2>Section 1</h2>
    <h3>Subsection 1.1</h3>
  <h2>Section 2</h2>

❌ Wrong:
<h1>Title</h1>
  <h3>Skipped h2</h3>
```

#### URL Structure
```
✅ Good: /blog/techsavvy/ai/2025-12-26-building-with-astro
❌ Bad: /blog/post1234 or /blog/2025-12-26-블로그-포스트

Rules:
- Use hyphens, not underscores
- Lowercase only
- Include keywords
- ASCII characters only (no Korean)
- Date prefix for blogs
```

### Technical SEO

#### Image Optimization
```html
<!-- Always include alt text -->
<img src="/images/hero.jpg"
     alt="Developer working on Astro blog project"
     loading="lazy"
     width="1200"
     height="630" />

Rules:
✅ Descriptive alt text
✅ Proper dimensions specified
✅ Lazy loading for below-fold images
✅ Modern formats (WebP/AVIF)
✅ Compressed (< 200KB per image)
```

#### Internal Linking
```markdown
Link to related posts within content:
- Use descriptive anchor text (not "click here")
- Link to 2-3 related posts per article
- Ensure all pages are within 3 clicks from homepage
```

#### Canonical URLs
```html
<!-- Prevent duplicate content issues -->
<link rel="canonical" href="https://jayleekr.github.io/blog/post-slug" />

Already implemented in BaseHead.astro ✅
```

---

## Common Issues & Solutions

### Issue 1: Pages Not Indexed

**Symptoms**: Pages don't appear in Google search after 2+ weeks

**Solutions**:
1. Check `robots.txt` - ensure pages aren't disallowed
2. Submit sitemap to Google Search Console
3. Request indexing for specific URLs
4. Check for `noindex` meta tags
5. Ensure pages have unique, valuable content

**Verification**:
```
site:jayleekr.github.io blog
```

### Issue 2: Low Click-Through Rate (CTR)

**Symptoms**: High impressions, low clicks in Search Console

**Solutions**:
1. Improve title tags (add numbers, questions, power words)
2. Write compelling meta descriptions with CTAs
3. Add structured data for rich snippets
4. Include dates in titles for freshness

**Example Improvement**:
```
Before: "Building a Blog"
After:  "How to Build a Modern Blog in 2025: Step-by-Step Guide"
```

### Issue 3: Duplicate Content

**Symptoms**: Multiple URLs for same content

**Solutions**:
1. Use canonical URLs (already implemented ✅)
2. Implement 301 redirects for old URLs
3. Use consistent URL structure
4. Check sitemap for duplicates

### Issue 4: Korean URLs Being Encoded

**Status**: ✅ FIXED (2025-12-26)

**Solution Applied**:
- Created `scripts/utils/slugify.js` module
- Extracts English from mixed titles
- Date-based fallback for Korean-only titles
- All new posts have clean ASCII URLs

**Test**:
```bash
node scripts/test-slugify.js
```

### Issue 5: Slow Page Load

**Symptoms**: PageSpeed score < 90

**Solutions**:
1. Optimize images (WebP, compression, lazy loading)
2. Minify CSS/JS (Astro does this automatically)
3. Enable compression (GitHub Pages does this)
4. Use CDN for static assets (GitHub Pages is CDN)
5. Reduce third-party scripts

**Current Status**: ✅ Lighthouse score 95+ achieved

---

## Verification Code Setup

After deployment, add search engine verification codes:

### 1. Google Search Console

**Location**: `src/components/BaseHead.astro` line 208
```html
<meta name="google-site-verification" content="YOUR-CODE-HERE" />
```

**Get Code**:
1. Go to Google Search Console
2. Add property → HTML tag method
3. Copy verification code
4. Update BaseHead.astro
5. Deploy and verify

### 2. Bing Webmaster Tools

**Location**: `src/components/BaseHead.astro` line 211
```html
<meta name="msvalidate.01" content="YOUR-CODE-HERE" />
```

### 3. Yandex Webmaster

**Location**: `src/components/BaseHead.astro` line 215
```html
<meta name="yandex-verification" content="YOUR-CODE-HERE" />
```

---

## Testing Schedule

### Daily (Automated)
- ✅ Uptime monitoring (via UptimeRobot)
- ✅ Build process (via GitHub Actions)

### Weekly
- Google Search Console review
- Analytics dashboard check
- Fix any coverage errors
- Monitor Core Web Vitals

### Monthly
- Full SEO audit (run `node scripts/test-seo.js`)
- PageSpeed Insights test
- Competitor analysis
- Backlink profile check (via Ahrefs/Moz)

### Quarterly
- Comprehensive content audit
- Update outdated posts
- Review and improve underperforming pages
- Schema markup validation

---

## Tools Reference

### Free Tools

| Tool | Purpose | URL |
|------|---------|-----|
| Google Search Console | Indexing, performance | https://search.google.com/search-console |
| PageSpeed Insights | Performance testing | https://pagespeed.web.dev |
| Rich Results Test | Structured data | https://search.google.com/test/rich-results |
| Mobile-Friendly Test | Mobile usability | https://search.google.com/test/mobile-friendly |
| Schema Validator | JSON-LD validation | https://validator.schema.org |
| Facebook Debugger | OG tags testing | https://developers.facebook.com/tools/debug/ |
| Twitter Card Validator | Twitter preview | https://cards-dev.twitter.com/validator |
| SSL Labs | HTTPS security | https://www.ssllabs.com/ssltest/ |

### Paid Tools (Optional)

| Tool | Purpose | Price |
|------|---------|-------|
| Ahrefs | Backlinks, keywords | $99/mo |
| SEMrush | Competitive analysis | $119/mo |
| Moz Pro | SEO suite | $99/mo |
| Screaming Frog | Site crawler | Free/<br>$259/yr |

---

## Success Metrics

### Traffic Goals

**Month 1-3** (Baseline):
- Google Search impressions: 1,000+
- Organic clicks: 50+
- Average position: <30

**Month 4-6** (Growth):
- Impressions: 5,000+
- Organic clicks: 200+
- Average position: <20

**Month 7-12** (Established):
- Impressions: 10,000+
- Organic clicks: 500+
- Average position: <15

### Quality Metrics

- **Lighthouse SEO**: 100/100 ✅
- **Lighthouse Performance**: ≥90 ✅
- **Core Web Vitals**: All green ✅
- **Mobile Usability**: 0 issues ✅
- **Indexing Coverage**: >95% ✅

---

## Next Steps

1. **Immediate** (Before Production):
   - [ ] Run `npm run build` to generate sitemap
   - [ ] Run `node scripts/test-seo.js` to verify all tests pass
   - [ ] Deploy to production

2. **After Deployment** (Week 1):
   - [ ] Add Google Search Console
   - [ ] Add Bing Webmaster Tools
   - [ ] Submit sitemap to search engines
   - [ ] Set up UptimeRobot monitoring
   - [ ] Test all social media previews

3. **Ongoing**:
   - [ ] Follow weekly/monthly testing schedule
   - [ ] Monitor Search Console weekly
   - [ ] Update this guide with learnings
   - [ ] Track SEO performance in spreadsheet

---

**Last Updated**: 2025-12-26
**Maintained By**: Jay Lee
**Review Schedule**: Quarterly
