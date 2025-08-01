// Quick test for the new responsive layout
import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Test the deployed page with the problematic layout
  await page.goto('https://jayleekr.github.io/blog/2025-07-28-prd-methodology/');
  
  console.log('=== Layout Analysis ===');
  
  // Wait for content to load
  await page.waitForLoadState('networkidle');
  
  // Get viewport size
  const viewport = page.viewportSize();
  console.log(`Viewport: ${viewport.width}x${viewport.height}`);
  
  // Check if we're in desktop mode (should use new layout)
  const isDesktop = viewport.width >= 1024;
  console.log(`Desktop mode: ${isDesktop}`);
  
  if (isDesktop) {
    // Test the new desktop layout
    const mainContainer = await page.locator('div.max-w-4xl.mx-auto').first();
    const mainContainerBox = await mainContainer.boundingBox();
    
    const tocSidebar = await page.locator('aside.fixed.left-6').first();
    const tocVisible = await tocSidebar.isVisible();
    
    const contentArea = await page.locator('div.xl\\:ml-72').first();
    const contentBox = await contentArea.boundingBox();
    
    console.log('=== Desktop Layout Measurements ===');
    console.log(`Main container width: ${mainContainerBox?.width || 'N/A'}px`);
    console.log(`Main container x position: ${mainContainerBox?.x || 'N/A'}px`);
    console.log(`TOC sidebar visible: ${tocVisible}`);
    console.log(`Content area width: ${contentBox?.width || 'N/A'}px`);
    console.log(`Content area x position: ${contentBox?.x || 'N/A'}px`);
    
    // Calculate if content is properly centered
    if (mainContainerBox && contentBox) {
      const screenCenter = viewport.width / 2;
      const contentCenter = contentBox.x + (contentBox.width / 2);
      const offsetFromCenter = Math.abs(contentCenter - screenCenter);
      console.log(`Content center: ${contentCenter}px`);
      console.log(`Screen center: ${screenCenter}px`);
      console.log(`Offset from center: ${offsetFromCenter}px`);
      
      // Good centering should be within 100px of center
      const isCentered = offsetFromCenter < 100;
      console.log(`Content is centered: ${isCentered}`);
    }
    
    // Check prose content width
    const proseContent = await page.locator('.prose').first();
    const proseBox = await proseContent.boundingBox();
    if (proseBox) {
      console.log(`Prose content width: ${proseBox.width}px`);
      // Optimal reading width should be around 600-800px
      const isOptimalWidth = proseBox.width >= 600 && proseBox.width <= 900;
      console.log(`Prose width is optimal: ${isOptimalWidth}`);
    }
    
  } else {
    console.log('Mobile layout - testing mobile TOC');
    const mobileTOCButton = await page.locator('#toc-toggle-mobile').first();
    const mobileTOCVisible = await mobileTOCButton.isVisible();
    console.log(`Mobile TOC button visible: ${mobileTOCVisible}`);
  }
  
  // Take a screenshot for visual inspection
  await page.screenshot({ path: 'layout-test.png', fullPage: true });
  console.log('Screenshot saved as layout-test.png');
  
  await browser.close();
})();