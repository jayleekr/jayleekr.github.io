import { test, expect } from '@playwright/test';

test.describe('Debug Navigation Rendering', () => {
  test('should verify what navigation elements are actually rendered', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Wait a bit more for any async rendering
    await page.waitForTimeout(2000);
    
    // Take a screenshot to see what's actually rendered
    await page.screenshot({ path: 'test-results/debug-mobile-nav.png', fullPage: true });
    
    // Get all navigation elements
    const allNavs = await page.locator('nav').all();
    console.log(`Found ${allNavs.length} nav elements`);
    
    for (let i = 0; i < allNavs.length; i++) {
      const nav = allNavs[i];
      const isVisible = await nav.isVisible();
      const classes = await nav.getAttribute('class');
      const ariaLabel = await nav.getAttribute('aria-label');
      
      console.log(`Nav ${i}: visible=${isVisible}, classes="${classes}", aria-label="${ariaLabel}"`);
    }
    
    // Check if MobileBottomNav component exists at all
    const mobileNavs = await page.locator('nav').all();
    const mobileNavExists = mobileNavs.length > 0;
    
    console.log('Mobile nav exists:', mobileNavExists);
    
    // Check for specific mobile nav selectors
    const specificSelectors = [
      'nav[aria-label="Mobile Navigation"]',
      '[data-nav-item]',
      '#mobile-search-button',
      '#mobile-theme-toggle',
      '#mobile-language-toggle'
    ];
    
    for (const selector of specificSelectors) {
      const count = await page.locator(selector).count();
      console.log(`Selector "${selector}": found ${count} elements`);
    }
    
    // Check page HTML source for mobile nav related content
    const htmlContent = await page.content();
    const hasMobileNavInHTML = htmlContent.includes('Mobile Navigation') || 
                               htmlContent.includes('data-nav-item') ||
                               htmlContent.includes('mobile-search-button');
    
    console.log('Mobile nav in HTML source:', hasMobileNavInHTML);
    
    // Basic test to ensure something renders
    await expect(page.locator('body')).toBeVisible();
  });
  
  test('should verify desktop navigation elements', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Take a screenshot
    await page.screenshot({ path: 'test-results/debug-desktop-nav.png', fullPage: true });
    
    // Check for desktop search
    const desktopSearch = await page.locator('#desktop-search-button').count();
    console.log(`Desktop search button: found ${desktopSearch} elements`);
    
    // Check for header navigation
    const headers = await page.locator('header').all();
    console.log(`Found ${headers.length} header elements`);
    
    for (let i = 0; i < headers.length; i++) {
      const header = headers[i];
      const isVisible = await header.isVisible();
      const classes = await header.getAttribute('class');
      
      console.log(`Header ${i}: visible=${isVisible}, classes="${classes}"`);
    }
  });
});