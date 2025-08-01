import { test, expect } from '@playwright/test';

test.describe('Quick Responsive Verification', () => {
  test('verify mobile improvements', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check that page doesn't have horizontal scroll
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    console.log(`Mobile - Scroll width: ${scrollWidth}, Client width: ${clientWidth}`);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
    
    // Check font sizes on mobile
    const bodyFontSize = await page.locator('body').evaluate((el) => 
      window.getComputedStyle(el).fontSize
    );
    console.log(`Mobile - Body font size: ${bodyFontSize}`);
    
    // Navigate to a blog post
    const blogLink = page.locator('a[href*="/blog/"]').first();
    if (await blogLink.count() > 0) {
      await blogLink.click();
      await page.waitForLoadState('networkidle');
      
      // Check article font size
      const articleFontSize = await page.locator('article').first().evaluate((el) => 
        window.getComputedStyle(el).fontSize
      );
      console.log(`Mobile - Article font size: ${articleFontSize}`);
      
      // Check touch targets
      const links = page.locator('article a');
      const linkCount = await links.count();
      for (let i = 0; i < Math.min(linkCount, 3); i++) {
        const box = await links.nth(i).boundingBox();
        if (box) {
          console.log(`Mobile - Link ${i} size: ${box.width}x${box.height}`);
          // Touch targets should be at least 44x44px
          expect(box.height).toBeGreaterThanOrEqual(44);
        }
      }
    }
  });
  
  test('verify tablet improvements', async ({ page }) => {
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check layout at md breakpoint
    const mainElement = page.locator('main').first();
    const mainBox = await mainElement.boundingBox();
    console.log(`Tablet - Main content width: ${mainBox?.width}`);
    
    // Navigate to blog post
    const blogLink = page.locator('a[href*="/blog/"]').first();
    if (await blogLink.count() > 0) {
      await blogLink.click();
      await page.waitForLoadState('networkidle');
      
      // Check article width
      const article = page.locator('article').first();
      const articleBox = await article.boundingBox();
      console.log(`Tablet - Article width: ${articleBox?.width}`);
    }
  });
  
  test('verify laptop improvements', async ({ page }) => {
    // Test laptop viewport
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Navigate to blog post
    const blogLink = page.locator('a[href*="/blog/"]').first();
    if (await blogLink.count() > 0) {
      await blogLink.click();
      await page.waitForLoadState('networkidle');
      
      // Check grid layout spacing
      const article = page.locator('article').first();
      const articleBox = await article.boundingBox();
      console.log(`Laptop - Article width: ${articleBox?.width}`);
      
      // Check if TOC is visible (should be visible at lg breakpoint)
      const toc = page.locator('aside').first();
      if (await toc.count() > 0) {
        const isVisible = await toc.isVisible();
        console.log(`Laptop - TOC visible: ${isVisible}`);
      }
    }
  });
  
  test('check color contrast', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check text color contrast
    const textColor = await page.locator('body').evaluate((el) => 
      window.getComputedStyle(el).color
    );
    const bgColor = await page.locator('body').evaluate((el) => 
      window.getComputedStyle(el).backgroundColor
    );
    console.log(`Color - Text: ${textColor}, Background: ${bgColor}`);
    
    // Check in dark mode
    const themeToggle = page.locator('[data-test-id="theme-toggle"], button[aria-label*="theme"], button[title*="theme"]').first();
    if (await themeToggle.count() > 0) {
      await themeToggle.click();
      await page.waitForTimeout(500);
      
      const darkTextColor = await page.locator('body').evaluate((el) => 
        window.getComputedStyle(el).color
      );
      const darkBgColor = await page.locator('body').evaluate((el) => 
        window.getComputedStyle(el).backgroundColor
      );
      console.log(`Dark mode - Text: ${darkTextColor}, Background: ${darkBgColor}`);
    }
  });
  
  test('verify zoom support', async ({ page }) => {
    await page.goto('/');
    
    // Check viewport meta tag
    const viewportMeta = await page.locator('meta[name="viewport"]').getAttribute('content');
    console.log(`Viewport meta tag: ${viewportMeta}`);
    expect(viewportMeta).toContain('user-scalable=yes');
  });
});