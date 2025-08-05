import { test, expect } from '@playwright/test';

test.describe('Dark Mode Enhancements', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to blog post
    await page.goto('/blog/2025-07-28-prd-methodology');
    
    // Set dark mode
    await page.evaluate(() => {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    });
    
    // Wait for transitions
    await page.waitForTimeout(500);
  });

  test('should have proper contrast ratios for text', async ({ page }) => {
    // Check primary heading contrast
    const h1 = page.locator('.prose h1').first();
    const h1Color = await h1.evaluate(el => window.getComputedStyle(el).color);
    expect(h1Color).toBe('rgb(248, 250, 252)'); // --dark-text-primary
    
    // Check body text contrast
    const bodyText = page.locator('.prose p').first();
    const bodyColor = await bodyText.evaluate(el => window.getComputedStyle(el).color);
    expect(bodyColor).toBe('rgb(226, 232, 240)'); // --dark-text-secondary
    
    // Check background
    const bg = await page.evaluate(() => window.getComputedStyle(document.body).backgroundColor);
    expect(bg).toBe('rgb(10, 10, 10)'); // --dark-bg-primary
  });

  test('should have proper code block styling', async ({ page }) => {
    // Create a code block if not present
    await page.evaluate(() => {
      const pre = document.createElement('pre');
      const code = document.createElement('code');
      code.textContent = 'const test = "Hello World";';
      pre.appendChild(code);
      document.querySelector('.prose')?.appendChild(pre);
    });
    
    // Check code block background
    const codeBlock = page.locator('.prose pre').first();
    const codeBg = await codeBlock.evaluate(el => window.getComputedStyle(el).backgroundColor);
    expect(codeBg).toBe('rgb(13, 17, 23)'); // --dark-bg-code
    
    // Check code text color
    const codeText = page.locator('.prose pre code').first();
    const codeColor = await codeText.evaluate(el => window.getComputedStyle(el).color);
    expect(codeColor).toBe('rgb(230, 237, 243)'); // GitHub dark theme color
  });

  test('should have enhanced link visibility', async ({ page }) => {
    // Check link styling
    const link = page.locator('.prose a').first();
    const linkColor = await link.evaluate(el => window.getComputedStyle(el).color);
    expect(linkColor).toBe('rgb(96, 165, 250)'); // --dark-link
    
    // Check link underline
    const underlineThickness = await link.evaluate(el => window.getComputedStyle(el).textDecorationThickness);
    expect(underlineThickness).toBe('1px');
  });

  test('should have proper blockquote styling', async ({ page }) => {
    // Create a blockquote if not present
    await page.evaluate(() => {
      const blockquote = document.createElement('blockquote');
      const p = document.createElement('p');
      p.textContent = 'This is a test quote';
      blockquote.appendChild(p);
      document.querySelector('.prose')?.appendChild(blockquote);
    });
    
    // Check blockquote styling
    const blockquote = page.locator('.prose blockquote').first();
    const borderColor = await blockquote.evaluate(el => window.getComputedStyle(el).borderLeftColor);
    expect(borderColor).toBe('rgb(96, 165, 250)'); // --dark-accent-info
  });

  test('should have proper table styling', async ({ page }) => {
    // Create a table if not present
    await page.evaluate(() => {
      const table = document.createElement('table');
      const thead = document.createElement('thead');
      const tr = document.createElement('tr');
      const th = document.createElement('th');
      th.textContent = 'Header';
      tr.appendChild(th);
      thead.appendChild(tr);
      table.appendChild(thead);
      document.querySelector('.prose')?.appendChild(table);
    });
    
    // Check table header background
    const th = page.locator('.prose th').first();
    const thBg = await th.evaluate(el => window.getComputedStyle(el).backgroundColor);
    expect(thBg).toBe('rgb(38, 38, 38)'); // --dark-bg-tertiary
    
    // Check table header text
    const thColor = await th.evaluate(el => window.getComputedStyle(el).color);
    expect(thColor).toBe('rgb(248, 250, 252)'); // --dark-text-primary
  });

  test('should take dark mode screenshots', async ({ page }) => {
    // Take full page screenshot
    await page.screenshot({ 
      path: 'dark-mode-full-page.png',
      fullPage: true 
    });
    
    // Take specific element screenshots
    const prose = page.locator('.prose').first();
    await prose.screenshot({ 
      path: 'dark-mode-prose.png' 
    });
    
    // Screenshot with different viewport sizes
    await page.setViewportSize({ width: 375, height: 667 });
    await page.screenshot({ 
      path: 'dark-mode-mobile.png',
      fullPage: true 
    });
    
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.screenshot({ 
      path: 'dark-mode-desktop.png',
      fullPage: true 
    });
  });

  test('should verify WCAG AAA contrast ratios', async ({ page }) => {
    // Helper function to calculate contrast ratio
    const getContrastRatio = async (selector1: string, bgSelector: string) => {
      return page.evaluate(([sel1, bgSel]) => {
        const element = document.querySelector(sel1);
        const bgElement = document.querySelector(bgSel) || document.body;
        if (!element) return 0;
        
        const color = window.getComputedStyle(element).color;
        const bgColor = window.getComputedStyle(bgElement).backgroundColor;
        
        // Parse RGB values
        const parseRGB = (str: string) => {
          const match = str.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
          if (!match) return { r: 0, g: 0, b: 0 };
          return {
            r: parseInt(match[1]) / 255,
            g: parseInt(match[2]) / 255,
            b: parseInt(match[3]) / 255
          };
        };
        
        // Calculate relative luminance
        const getLuminance = (rgb: any) => {
          const { r, g, b } = rgb;
          const sRGB = [r, g, b].map(val => {
            if (val <= 0.03928) return val / 12.92;
            return Math.pow((val + 0.055) / 1.055, 2.4);
          });
          return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
        };
        
        const textRGB = parseRGB(color);
        const bgRGB = parseRGB(bgColor);
        
        const textLum = getLuminance(textRGB);
        const bgLum = getLuminance(bgRGB);
        
        const lighter = Math.max(textLum, bgLum);
        const darker = Math.min(textLum, bgLum);
        
        return (lighter + 0.05) / (darker + 0.05);
      }, [selector1, bgSelector]);
    };
    
    // Test primary heading contrast (should be >= 7:1 for WCAG AAA)
    const h1Contrast = await getContrastRatio('.prose h1', 'body');
    expect(h1Contrast).toBeGreaterThanOrEqual(7);
    
    // Test body text contrast
    const bodyContrast = await getContrastRatio('.prose p', 'body');
    expect(bodyContrast).toBeGreaterThanOrEqual(7);
    
    // Test link contrast
    const linkContrast = await getContrastRatio('.prose a', 'body');
    expect(linkContrast).toBeGreaterThanOrEqual(4.5); // Links can be 4.5:1 for AA
  });
});