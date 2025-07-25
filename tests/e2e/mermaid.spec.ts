import { test, expect } from '@playwright/test';

test.describe('Mermaid Diagram Rendering', () => {
  test('should render mermaid diagrams correctly', async ({ page }) => {
    // Navigate to the AI workflow productivity blog post (contains Mermaid diagram)
    await page.goto('/blog/2025-07-24-ai-workflow-productivity/');
    
    // Wait for the page to load completely
    await page.waitForLoadState('networkidle');
    
    // Wait for mermaid diagrams to be processed
    await page.waitForSelector('.mermaid-diagram', { timeout: 10000 });
    
    // Check if Mermaid diagram containers exist
    const mermaidDiagrams = await page.locator('.mermaid-diagram').count();
    expect(mermaidDiagrams).toBeGreaterThan(0);
    
    // Verify that SVG elements are rendered inside mermaid containers
    const svgElements = await page.locator('.mermaid-diagram svg').count();
    expect(svgElements).toBeGreaterThan(0);
    
    // Check that mermaid diagrams are visible
    const firstDiagram = page.locator('.mermaid-diagram').first();
    await expect(firstDiagram).toBeVisible();
    
    // Verify the diagram has proper CSS classes
    const diagramClasses = await firstDiagram.getAttribute('class');
    expect(diagramClasses).toContain('mermaid-diagram');
    expect(diagramClasses).toContain('flex');
    expect(diagramClasses).toContain('justify-center');
  });

  test('should handle dark theme correctly', async ({ page }) => {
    // Navigate to the blog post
    await page.goto('/blog/2025-07-24-ai-workflow-productivity/');
    
    // Wait for page load
    await page.waitForLoadState('networkidle');
    
    // Toggle to dark theme
    await page.click('[data-testid="theme-toggle"]');
    
    // Wait for theme change and mermaid re-render
    await page.waitForTimeout(1000);
    
    // Check that html has dark class
    const htmlClass = await page.getAttribute('html', 'class');
    expect(htmlClass).toContain('dark');
    
    // Wait for mermaid diagrams to be re-rendered
    await page.waitForSelector('.mermaid-diagram svg', { timeout: 5000 });
    
    // Verify diagrams are still visible in dark mode
    const mermaidDiagrams = await page.locator('.mermaid-diagram').count();
    expect(mermaidDiagrams).toBeGreaterThan(0);
    
    const firstDiagram = page.locator('.mermaid-diagram').first();
    await expect(firstDiagram).toBeVisible();
  });

  test('should handle light theme correctly', async ({ page }) => {
    // Navigate to the blog post
    await page.goto('/blog/2025-07-24-ai-workflow-productivity/');
    
    // Wait for page load
    await page.waitForLoadState('networkidle');
    
    // Ensure we're in light theme (toggle twice if needed)
    await page.click('[data-testid="theme-toggle"]');
    await page.waitForTimeout(500);
    await page.click('[data-testid="theme-toggle"]');
    
    // Wait for theme change
    await page.waitForTimeout(1000);
    
    // Check that html doesn't have dark class
    const htmlClass = await page.getAttribute('html', 'class');
    expect(htmlClass || '').not.toContain('dark');
    
    // Wait for mermaid diagrams to be re-rendered
    await page.waitForSelector('.mermaid-diagram svg', { timeout: 5000 });
    
    // Verify diagrams are visible in light mode
    const mermaidDiagrams = await page.locator('.mermaid-diagram').count();
    expect(mermaidDiagrams).toBeGreaterThan(0);
    
    const firstDiagram = page.locator('.mermaid-diagram').first();
    await expect(firstDiagram).toBeVisible();
  });

  test('should not show mermaid code blocks as plain text', async ({ page }) => {
    // Navigate to the blog post
    await page.goto('/blog/2025-07-24-ai-workflow-productivity/');
    
    // Wait for page load and mermaid processing
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Check that there are no remaining code blocks with language-mermaid class
    const mermaidCodeBlocks = await page.locator('pre code.language-mermaid').count();
    expect(mermaidCodeBlocks).toBe(0);
    
    // Verify that mermaid diagram containers exist instead
    const mermaidDiagrams = await page.locator('.mermaid-diagram').count();
    expect(mermaidDiagrams).toBeGreaterThan(0);
  });

  test('should handle errors gracefully', async ({ page }) => {
    // We'll test error handling by checking console errors
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    await page.goto('/blog/2025-07-24-ai-workflow-productivity/');
    await page.waitForLoadState('networkidle');
    
    // Valid diagrams should not generate errors
    const hasRenderingErrors = consoleErrors.some(error => 
      error.includes('Error rendering Mermaid diagram')
    );
    
    // For valid diagrams, we shouldn't see rendering errors
    expect(hasRenderingErrors).toBe(false);
  });
});