import { test, expect } from '@playwright/test';

test.describe('Blog Layout Measurements', () => {
  const blogUrl = 'https://jayleekr.github.io/blog/2025-07-28-prd-methodology/';
  
  test('measure layout widths on laptop (1366px)', async ({ page }) => {
    // Set viewport to common laptop size
    await page.setViewportSize({ width: 1366, height: 768 });
    await page.goto(blogUrl);
    
    // Wait for content to load
    await page.waitForLoadState('networkidle');
    
    // Measure the grid container
    const container = await page.locator('.max-w-6xl.mx-auto').first();
    const containerBox = await container.boundingBox();
    console.log('Container width:', containerBox?.width);
    
    // Check if desktop layout is visible
    const desktopGrid = await page.locator('.hidden.lg\\:grid').first();
    const isDesktopVisible = await desktopGrid.isVisible();
    console.log('Desktop layout visible:', isDesktopVisible);
    
    if (isDesktopVisible) {
      // Measure TOC
      const toc = await page.locator('aside').first();
      const tocBox = await toc.boundingBox();
      console.log('TOC width:', tocBox?.width);
      
      // Measure main content
      const mainContent = await page.locator('main').first();
      const mainBox = await mainContent.boundingBox();
      console.log('Main content width:', mainBox?.width);
      
      // Measure right sidebar
      const rightSidebar = await page.locator('aside').nth(1);
      const sidebarBox = await rightSidebar.boundingBox();
      console.log('Right sidebar width:', sidebarBox?.width);
      
      // Measure the actual prose content
      const proseContent = await page.locator('.prose').first();
      const proseBox = await proseContent.boundingBox();
      console.log('Prose content width:', proseBox?.width);
      
      // Calculate total used width
      const totalUsed = (tocBox?.width || 0) + (mainBox?.width || 0) + (sidebarBox?.width || 0);
      console.log('Total used width:', totalUsed);
      console.log('Container vs used difference:', (containerBox?.width || 0) - totalUsed);
    }
    
    // Take a screenshot for visual reference
    await page.screenshot({ 
      path: 'layout-laptop-1366px.png',
      fullPage: false 
    });
  });
  
  test('measure layout widths on desktop (1920px)', async ({ page }) => {
    // Set viewport to desktop size
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto(blogUrl);
    
    // Wait for content to load
    await page.waitForLoadState('networkidle');
    
    // Measure the grid container
    const container = await page.locator('.max-w-6xl.mx-auto').first();
    const containerBox = await container.boundingBox();
    console.log('Container width:', containerBox?.width);
    
    // Measure desktop grid elements
    const desktopGrid = await page.locator('.hidden.lg\\:grid').first();
    const isDesktopVisible = await desktopGrid.isVisible();
    
    if (isDesktopVisible) {
      // Measure TOC
      const toc = await page.locator('aside').first();
      const tocBox = await toc.boundingBox();
      console.log('TOC width:', tocBox?.width);
      
      // Measure main content
      const mainContent = await page.locator('main').first();
      const mainBox = await mainContent.boundingBox();
      console.log('Main content width:', mainBox?.width);
      
      // Measure right sidebar
      const rightSidebar = await page.locator('aside').nth(1);
      const sidebarBox = await rightSidebar.boundingBox();
      console.log('Right sidebar width:', sidebarBox?.width);
      
      // Measure the actual prose content
      const proseContent = await page.locator('.prose').first();
      const proseBox = await proseContent.boundingBox();
      console.log('Prose content width:', proseBox?.width);
    }
    
    // Take a screenshot for visual reference
    await page.screenshot({ 
      path: 'layout-desktop-1920px.png',
      fullPage: false 
    });
  });
  
  test('compare layout measurements across breakpoints', async ({ page }) => {
    const viewports = [
      { name: 'Mobile', width: 375, height: 667 },
      { name: 'Tablet', width: 768, height: 1024 },
      { name: 'Laptop', width: 1366, height: 768 },
      { name: 'Desktop', width: 1920, height: 1080 },
      { name: '4K', width: 2560, height: 1440 }
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto(blogUrl);
      await page.waitForLoadState('networkidle');
      
      // Check which layout is active
      const mobileLayout = await page.locator('.lg\\:hidden article').first();
      const desktopLayout = await page.locator('.hidden.lg\\:grid').first();
      
      const isMobile = await mobileLayout.isVisible();
      const isDesktop = await desktopLayout.isVisible();
      
      console.log(`\n${viewport.name} (${viewport.width}x${viewport.height}):`);
      console.log('Mobile layout:', isMobile);
      console.log('Desktop layout:', isDesktop);
      
      // Measure content width
      const content = await page.locator('.prose').first();
      const contentBox = await content.boundingBox();
      console.log('Content width:', contentBox?.width);
      
      // Take screenshot
      await page.screenshot({ 
        path: `layout-${viewport.name.toLowerCase()}-${viewport.width}px.png`,
        fullPage: false 
      });
    }
  });
});