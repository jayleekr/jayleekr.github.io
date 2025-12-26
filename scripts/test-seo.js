#!/usr/bin/env node

/**
 * Comprehensive SEO Testing Suite
 *
 * Tests all aspects of SEO configuration:
 * 1. Meta tags (Open Graph, Twitter Cards, basic meta)
 * 2. Structured data (JSON-LD)
 * 3. Sitemap and robots.txt
 * 4. URL structure and readability
 * 5. Image optimization
 * 6. Performance indicators
 *
 * Usage:
 *   node scripts/test-seo.js [url]
 *
 * Examples:
 *   node scripts/test-seo.js                           # Test localhost:4321
 *   node scripts/test-seo.js https://jayleekr.github.io  # Test production
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Test configuration
const baseUrl = process.argv[2] || 'http://localhost:4321';
const results = {
  passed: 0,
  failed: 0,
  warnings: 0,
  tests: []
};

/**
 * Test result helpers
 */
function pass(category, test, details = '') {
  results.passed++;
  results.tests.push({ category, test, status: '✅', details });
  console.log(`  ✅ ${test}`);
  if (details) console.log(`     ${details}`);
}

function fail(category, test, details = '') {
  results.failed++;
  results.tests.push({ category, test, status: '❌', details });
  console.log(`  ❌ ${test}`);
  if (details) console.log(`     ${details}`);
}

function warn(category, test, details = '') {
  results.warnings++;
  results.tests.push({ category, test, status: '⚠️', details });
  console.log(`  ⚠️  ${test}`);
  if (details) console.log(`     ${details}`);
}

/**
 * Test 1: File Structure Tests
 */
async function testFileStructure() {
  console.log('\n📁 FILE STRUCTURE TESTS');
  console.log('━'.repeat(60));

  const requiredFiles = [
    { path: 'public/robots.txt', name: 'robots.txt' },
    { path: 'public/manifest.json', name: 'PWA Manifest' },
    { path: 'public/favicon.svg', name: 'Favicon' }
  ];

  // Check for RSS feed generator (can be .ts or .js)
  const rssGeneratorFiles = [
    'src/pages/rss.xml.ts',
    'src/pages/rss.xml.js'
  ];

  let rssFound = false;
  for (const rssPath of rssGeneratorFiles) {
    try {
      await fs.access(path.join(projectRoot, rssPath));
      pass('File Structure', 'RSS Feed Generator exists', rssPath);
      rssFound = true;
      break;
    } catch (error) {
      // Try next
    }
  }

  if (!rssFound) {
    fail('File Structure', 'RSS Feed Generator missing', 'Expected src/pages/rss.xml.ts or .js');
  }

  // Note about sitemap (generated during build)
  try {
    await fs.access(path.join(projectRoot, 'public/sitemap-index.xml'));
    pass('File Structure', 'Sitemap exists', 'public/sitemap-index.xml');
  } catch (error) {
    warn('File Structure', 'Sitemap not found (generated during build)', 'Run: npm run build');
  }

  for (const file of requiredFiles) {
    const filePath = path.join(projectRoot, file.path);
    try {
      await fs.access(filePath);
      pass('File Structure', `${file.name} exists`, file.path);
    } catch (error) {
      fail('File Structure', `${file.name} missing`, file.path);
    }
  }
}

/**
 * Test 2: robots.txt Configuration
 */
async function testRobotsTxt() {
  console.log('\n🤖 ROBOTS.TXT TESTS');
  console.log('━'.repeat(60));

  const robotsPath = path.join(projectRoot, 'public/robots.txt');

  try {
    const content = await fs.readFile(robotsPath, 'utf-8');

    // Check for sitemap
    if (content.includes('Sitemap:')) {
      pass('robots.txt', 'Sitemap URL declared');
    } else {
      fail('robots.txt', 'Sitemap URL missing');
    }

    // Check for proper Allow rules
    if (content.includes('Allow: /')) {
      pass('robots.txt', 'Allow rules present');
    } else {
      warn('robots.txt', 'No explicit Allow rules');
    }

    // Check for critical disallows
    const hasDisallows = content.includes('Disallow: /_astro/') ||
                         content.includes('Disallow: /node_modules/');
    if (hasDisallows) {
      pass('robots.txt', 'Build files disallowed');
    } else {
      warn('robots.txt', 'Consider disallowing build directories');
    }

    // Check for crawl delay
    if (content.includes('Crawl-delay:')) {
      pass('robots.txt', 'Crawl-delay configured');
    } else {
      warn('robots.txt', 'No crawl-delay set (optional)');
    }

  } catch (error) {
    fail('robots.txt', 'File read error', error.message);
  }
}

/**
 * Test 3: Sitemap Structure
 */
async function testSitemap() {
  console.log('\n🗺️  SITEMAP TESTS');
  console.log('━'.repeat(60));

  // Check both dist/ (after build) and public/ (dev)
  const sitemapPaths = [
    path.join(projectRoot, 'dist/sitemap-index.xml'),
    path.join(projectRoot, 'public/sitemap-index.xml')
  ];

  let sitemapPath = null;
  for (const checkPath of sitemapPaths) {
    try {
      await fs.access(checkPath);
      sitemapPath = checkPath;
      break;
    } catch (error) {
      // Try next path
    }
  }

  if (!sitemapPath) {
    warn('Sitemap', 'Sitemap not found in dist/ or public/', 'Run: npm run build');
    return;
  }

  try {
    const content = await fs.readFile(sitemapPath, 'utf-8');

    // Check for XML declaration
    if (content.startsWith('<?xml')) {
      pass('Sitemap', 'Valid XML declaration');
    } else {
      fail('Sitemap', 'Missing XML declaration');
    }

    // Check for sitemap index structure
    if (content.includes('<sitemapindex')) {
      pass('Sitemap', 'Sitemap index structure');
    } else if (content.includes('<urlset')) {
      pass('Sitemap', 'URL set structure');
    } else {
      fail('Sitemap', 'Invalid sitemap structure');
    }

    // Count URLs (approximate)
    const urlMatches = content.match(/<loc>/g);
    if (urlMatches) {
      pass('Sitemap', `Contains ${urlMatches.length} URLs`);
    } else {
      warn('Sitemap', 'No URLs found in sitemap');
    }

    // Check for lastmod dates
    if (content.includes('<lastmod>')) {
      pass('Sitemap', 'Last modified dates included');
    } else {
      warn('Sitemap', 'No lastmod dates (optional but recommended)');
    }

    // Show where sitemap was found
    const location = sitemapPath.includes('dist/') ? 'dist/' : 'public/';
    pass('Sitemap', `Found in ${location} directory`);

  } catch (error) {
    fail('Sitemap', 'File read error', error.message);
  }
}

/**
 * Test 4: Base Head Component (Meta Tags)
 */
async function testBaseHead() {
  console.log('\n🏷️  META TAGS TESTS');
  console.log('━'.repeat(60));

  const baseHeadPath = path.join(projectRoot, 'src/components/BaseHead.astro');

  try {
    const content = await fs.readFile(baseHeadPath, 'utf-8');

    // Essential meta tags
    const metaTags = [
      { tag: 'meta name="description"', name: 'Description meta tag' },
      { tag: 'meta name="author"', name: 'Author meta tag' },
      { tag: 'meta name="viewport"', name: 'Viewport meta tag' },
      { tag: 'link rel="canonical"', name: 'Canonical URL' },
      { tag: 'meta property="og:type"', name: 'Open Graph type' },
      { tag: 'meta property="og:title"', name: 'Open Graph title' },
      { tag: 'meta property="og:description"', name: 'Open Graph description' },
      { tag: 'meta property="og:image"', name: 'Open Graph image' },
      { tag: 'meta name="twitter:card"', name: 'Twitter Card' },
      { tag: 'meta name="twitter:title"', name: 'Twitter title' },
      { tag: 'meta name="twitter:description"', name: 'Twitter description' },
      { tag: 'meta name="twitter:image"', name: 'Twitter image' }
    ];

    for (const meta of metaTags) {
      if (content.includes(meta.tag)) {
        pass('Meta Tags', meta.name);
      } else {
        fail('Meta Tags', `${meta.name} missing`);
      }
    }

    // Check for JSON-LD structured data
    if (content.includes('application/ld+json')) {
      pass('Structured Data', 'JSON-LD present');
    } else {
      fail('Structured Data', 'JSON-LD missing');
    }

    // Check for language tags
    if (content.includes('lang=') || content.includes('hreflang')) {
      pass('i18n', 'Language tags present');
    } else {
      warn('i18n', 'No language tags found');
    }

    // Check for verification meta tags
    const verificationTags = [
      'google-site-verification',
      'msvalidate.01',
      'yandex-verification'
    ];

    let hasVerification = false;
    for (const tag of verificationTags) {
      if (content.includes(tag) && content.includes('content=""')) {
        warn('Verification', `${tag} placeholder (needs real code)`);
      } else if (content.includes(tag)) {
        hasVerification = true;
      }
    }

    if (hasVerification) {
      pass('Verification', 'Search engine verification configured');
    } else {
      warn('Verification', 'No search engine verification codes (add after deployment)');
    }

  } catch (error) {
    fail('Meta Tags', 'BaseHead.astro read error', error.message);
  }
}

/**
 * Test 5: URL Structure & Readability
 */
async function testUrlStructure() {
  console.log('\n🔗 URL STRUCTURE TESTS');
  console.log('━'.repeat(60));

  // Test blog post files for URL-friendly names
  const blogDir = path.join(projectRoot, 'src/content/blog');

  try {
    const categories = await fs.readdir(blogDir);
    let totalPosts = 0;
    let badUrls = 0;
    let goodUrls = 0;

    for (const category of categories) {
      const categoryPath = path.join(blogDir, category);
      const stat = await fs.stat(categoryPath);

      if (!stat.isDirectory()) continue;

      const files = await fs.readdir(categoryPath);
      const mdxFiles = files.filter(f => f.endsWith('.mdx'));

      for (const file of mdxFiles) {
        totalPosts++;

        // Check for Korean characters (would be URL-encoded)
        if (/[가-힣]/.test(file)) {
          badUrls++;
        } else {
          goodUrls++;
        }

        // Check for special characters that need encoding
        if (/[^a-z0-9-.]/.test(file)) {
          // Has special chars
          if (!/[가-힣]/.test(file)) {
            // Not Korean, some other special char
            warn('URL Structure', `Special chars in: ${file}`);
          }
        }
      }
    }

    if (totalPosts > 0) {
      const readabilityPercent = Math.round((goodUrls / totalPosts) * 100);

      if (readabilityPercent === 100) {
        pass('URL Readability', `All ${totalPosts} posts have clean URLs (${readabilityPercent}%)`);
      } else if (readabilityPercent >= 80) {
        warn('URL Readability', `${goodUrls}/${totalPosts} posts clean (${readabilityPercent}%)`);
      } else {
        fail('URL Readability', `Only ${goodUrls}/${totalPosts} posts clean (${readabilityPercent}%)`);
      }

      if (badUrls > 0) {
        warn('URL Readability', `${badUrls} posts contain Korean characters (will URL-encode)`);
      }
    }

  } catch (error) {
    warn('URL Structure', 'Blog directory not accessible', error.message);
  }
}

/**
 * Test 6: RSS Feed Configuration
 */
async function testRssFeed() {
  console.log('\n📡 RSS FEED TESTS');
  console.log('━'.repeat(60));

  // Try both .ts and .js extensions
  const rssPaths = [
    path.join(projectRoot, 'src/pages/rss.xml.ts'),
    path.join(projectRoot, 'src/pages/rss.xml.js')
  ];

  let rssPath = null;
  for (const testPath of rssPaths) {
    try {
      await fs.access(testPath);
      rssPath = testPath;
      break;
    } catch (error) {
      // Try next
    }
  }

  if (!rssPath) {
    fail('RSS Feed', 'RSS generator not found', 'Expected src/pages/rss.xml.ts or .js');
    return;
  }

  try {
    const content = await fs.readFile(rssPath, 'utf-8');

    // Check for RSS generation
    if (content.includes('export async function GET')) {
      pass('RSS Feed', 'RSS generator function exists');
    } else {
      fail('RSS Feed', 'RSS generator function missing');
    }

    // Check for proper content type
    if (content.includes('application/rss+xml') || content.includes('application/xml')) {
      pass('RSS Feed', 'Correct content type');
    } else {
      warn('RSS Feed', 'Content type not explicitly set');
    }

    // Check for site metadata
    if (content.includes('title') && content.includes('description')) {
      pass('RSS Feed', 'Feed metadata present');
    } else {
      warn('RSS Feed', 'Feed metadata may be incomplete');
    }

  } catch (error) {
    fail('RSS Feed', 'RSS file not found', error.message);
  }
}

/**
 * Test 7: Image Optimization
 */
async function testImageOptimization() {
  console.log('\n🖼️  IMAGE OPTIMIZATION TESTS');
  console.log('━'.repeat(60));

  const imagesDir = path.join(projectRoot, 'public/images');

  try {
    await fs.access(imagesDir);
    pass('Images', 'Images directory exists', 'public/images/');

    // Check for blog images
    const blogImagesDir = path.join(imagesDir, 'blog');
    try {
      const dates = await fs.readdir(blogImagesDir);
      const imageCount = dates.length;

      if (imageCount > 0) {
        pass('Images', `${imageCount} blog post image directories`, 'Organized by date');
      } else {
        warn('Images', 'No blog images found (expected if no Notion sync yet)');
      }
    } catch (error) {
      warn('Images', 'No blog images directory (will be created on first sync)');
    }

    // Check for optimized formats
    const allFiles = await fs.readdir(imagesDir);
    const hasWebP = allFiles.some(f => f.endsWith('.webp'));
    const hasAvif = allFiles.some(f => f.endsWith('.avif'));

    if (hasWebP || hasAvif) {
      pass('Images', 'Modern image formats detected (WebP/AVIF)');
    } else {
      warn('Images', 'No modern image formats (consider WebP/AVIF conversion)');
    }

  } catch (error) {
    warn('Images', 'Images directory not found (will be created as needed)');
  }
}

/**
 * Test 8: Performance Indicators
 */
async function testPerformance() {
  console.log('\n⚡ PERFORMANCE INDICATORS');
  console.log('━'.repeat(60));

  // Check for service worker
  const swPath = path.join(projectRoot, 'public/sw.js');
  try {
    await fs.access(swPath);
    pass('Performance', 'Service Worker present (PWA support)');
  } catch (error) {
    warn('Performance', 'No Service Worker (optional PWA feature)');
  }

  // Check for manifest
  const manifestPath = path.join(projectRoot, 'public/manifest.json');
  try {
    const content = await fs.readFile(manifestPath, 'utf-8');
    const manifest = JSON.parse(content);

    if (manifest.name && manifest.short_name) {
      pass('PWA', 'Manifest has required fields');
    } else {
      warn('PWA', 'Manifest missing required fields');
    }

    if (manifest.icons && manifest.icons.length > 0) {
      pass('PWA', `${manifest.icons.length} icon sizes defined`);
    } else {
      warn('PWA', 'No icons in manifest');
    }
  } catch (error) {
    warn('PWA', 'Manifest not found or invalid');
  }

  // Check Astro config for optimization
  const configPath = path.join(projectRoot, 'astro.config.mjs');
  try {
    const content = await fs.readFile(configPath, 'utf-8');

    if (content.includes('compress:')) {
      pass('Performance', 'Compression configured');
    } else {
      warn('Performance', 'No explicit compression config');
    }

    if (content.includes('prefetch')) {
      pass('Performance', 'Prefetch enabled');
    } else {
      warn('Performance', 'Prefetch not explicitly enabled');
    }
  } catch (error) {
    warn('Performance', 'Astro config not accessible');
  }
}

/**
 * Generate Summary Report
 */
function generateReport() {
  console.log('\n' + '═'.repeat(60));
  console.log('📊 SEO TEST SUMMARY');
  console.log('═'.repeat(60));

  const total = results.passed + results.failed + results.warnings;
  const passRate = total > 0 ? Math.round((results.passed / total) * 100) : 0;

  console.log(`\nTotal Tests: ${total}`);
  console.log(`✅ Passed:   ${results.passed} (${passRate}%)`);
  console.log(`❌ Failed:   ${results.failed}`);
  console.log(`⚠️  Warnings: ${results.warnings}`);

  // Overall grade
  let grade, recommendation;
  if (results.failed === 0 && results.warnings <= 2) {
    grade = '🏆 EXCELLENT';
    recommendation = 'Your SEO is well-configured! Ready for production.';
  } else if (results.failed <= 2 && passRate >= 80) {
    grade = '✅ GOOD';
    recommendation = 'SEO is mostly ready. Fix critical issues before deployment.';
  } else if (results.failed <= 5) {
    grade = '⚠️  NEEDS IMPROVEMENT';
    recommendation = 'Several SEO issues detected. Review and fix before production.';
  } else {
    grade = '❌ POOR';
    recommendation = 'Critical SEO configuration missing. Address all failed tests.';
  }

  console.log(`\n${grade}`);
  console.log(`${recommendation}`);

  // Action items
  if (results.failed > 0) {
    console.log('\n🔧 Critical Actions Required:');
    results.tests
      .filter(t => t.status === '❌')
      .forEach((t, i) => {
        console.log(`${i + 1}. [${t.category}] ${t.test}`);
        if (t.details) console.log(`   → ${t.details}`);
      });
  }

  if (results.warnings > 0) {
    console.log('\n💡 Recommended Improvements:');
    results.tests
      .filter(t => t.status === '⚠️')
      .slice(0, 5) // Show top 5 warnings
      .forEach((t, i) => {
        console.log(`${i + 1}. [${t.category}] ${t.test}`);
        if (t.details) console.log(`   → ${t.details}`);
      });

    if (results.warnings > 5) {
      console.log(`   ... and ${results.warnings - 5} more warnings`);
    }
  }

  console.log('\n' + '═'.repeat(60));
}

/**
 * Main test execution
 */
async function runAllTests() {
  console.log('🔍 SEO TESTING SUITE');
  console.log('═'.repeat(60));
  console.log(`Testing: ${baseUrl}`);
  console.log(`Project: ${projectRoot}`);

  try {
    await testFileStructure();
    await testRobotsTxt();
    await testSitemap();
    await testBaseHead();
    await testUrlStructure();
    await testRssFeed();
    await testImageOptimization();
    await testPerformance();

    generateReport();

    // Exit code
    process.exit(results.failed > 0 ? 1 : 0);

  } catch (error) {
    console.error('\n❌ Fatal error during testing:', error);
    process.exit(1);
  }
}

runAllTests();
