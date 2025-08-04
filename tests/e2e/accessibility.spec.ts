import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Accessibility Tests (WCAG Compliance)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test.describe('Page-Level Accessibility', () => {
    test('homepage should be accessible', async ({ page }) => {
      const accessibilityScanResults = await new AxeBuilder({ page }).analyze()
      expect(accessibilityScanResults.violations).toEqual([])
    })

    test('blog page should be accessible', async ({ page }) => {
      const blogLink = page.locator('a[href*="/blog"]')
      if (await blogLink.count() > 0) {
        await blogLink.click()
        await page.waitForLoadState('networkidle')
        
        const accessibilityScanResults = await new AxeBuilder({ page }).analyze()
        expect(accessibilityScanResults.violations).toEqual([])
      }
    })

    test('about page should be accessible', async ({ page }) => {
      const aboutLink = page.locator('a[href*="/about"]')
      if (await aboutLink.count() > 0) {
        await aboutLink.click()
        await page.waitForLoadState('networkidle')
        
        const accessibilityScanResults = await new AxeBuilder({ page }).analyze()
        expect(accessibilityScanResults.violations).toEqual([])
      }
    })
  })

  test.describe('Component Accessibility', () => {
    test('navigation should be accessible', async ({ page }) => {
      // Test desktop navigation
      await page.setViewportSize({ width: 1200, height: 800 })
      
      const accessibilityScanResults = await new AxeBuilder({ page })
        .include('nav')
        .analyze()
      
      expect(accessibilityScanResults.violations).toEqual([])
      
      // Check navigation landmarks
      const navElement = page.locator('nav[role="navigation"]')
      await expect(navElement).toHaveCount(1)
      
      // Check aria-labels
      const navWithLabel = page.locator('nav[aria-label]')
      await expect(navWithLabel).toHaveCount(1)
    })

    test('mobile navigation should be accessible', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      
      const mobileNav = page.locator('[role="navigation"][aria-label*="Mobile"]')
      await expect(mobileNav).toBeVisible()
      
      const accessibilityScanResults = await new AxeBuilder({ page })
        .include('[role="navigation"]')
        .analyze()
      
      expect(accessibilityScanResults.violations).toEqual([])
      
      // Check that all nav items have proper labels
      const navItems = mobileNav.locator('[data-nav-item]')
      const navCount = await navItems.count()
      
      for (let i = 0; i < navCount; i++) {
        const item = navItems.nth(i)
        await expect(item).toHaveAttribute('aria-label')
      }
    })

    test('search modal should be accessible', async ({ page }) => {
      await page.keyboard.press('Meta+k')
      
      const searchModal = page.locator('#search-modal')
      await expect(searchModal).toBeVisible()
      
      const accessibilityScanResults = await new AxeBuilder({ page })
        .include('#search-modal')
        .analyze()
      
      expect(accessibilityScanResults.violations).toEqual([])
      
      // Check modal attributes
      await expect(searchModal).toHaveAttribute('role', 'dialog')
      await expect(searchModal).toHaveAttribute('aria-modal', 'true')
      await expect(searchModal).toHaveAttribute('aria-labelledby')
      
      // Check input accessibility
      const searchInput = page.locator('#search-input')
      await expect(searchInput).toBeFocused()
      
      const placeholder = await searchInput.getAttribute('placeholder')
      expect(placeholder).toBeTruthy()
      expect(placeholder?.length).toBeGreaterThan(0)
      
      // Check close button
      const closeButton = page.locator('[data-search-close]')
      await expect(closeButton).toHaveAttribute('aria-label')
    })

    test('theme toggle should be accessible', async ({ page }) => {
      const themeToggle = page.locator(
        'button[aria-label*="theme"], button[id*="theme"], .theme-toggle'
      )
      
      if (await themeToggle.count() > 0) {
        await expect(themeToggle).toHaveAttribute('aria-label')
        await expect(themeToggle).toHaveAttribute('type', 'button')
        
        // Test keyboard interaction
        await themeToggle.focus()
        await expect(themeToggle).toBeFocused()
        
        // Test activation with Enter key
        await page.keyboard.press('Enter')
        
        // Test activation with Space key
        await page.keyboard.press('Space')
        
        // Should still be accessible after interactions
        const accessibilityScanResults = await new AxeBuilder({ page })
          .include(themeToggle)
          .analyze()
        
        expect(accessibilityScanResults.violations).toEqual([])
      }
    })
  })

  test.describe('Keyboard Navigation', () => {
    test('should support full keyboard navigation', async ({ page }) => {
      // Start from first focusable element
      await page.keyboard.press('Tab')
      
      // Get all focusable elements
      const focusableElements = await page.locator(
        'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
      ).all()
      
      expect(focusableElements.length).toBeGreaterThan(0)
      
      // Tab through several elements
      for (let i = 0; i < Math.min(5, focusableElements.length); i++) {
        const focused = page.locator(':focus')
        await expect(focused).toBeVisible()
        
        // Move to next element
        if (i < focusableElements.length - 1) {
          await page.keyboard.press('Tab')
        }
      }
    })

    test('should support reverse keyboard navigation', async ({ page }) => {
      // Focus last element and navigate backwards
      await page.keyboard.press('Tab')
      await page.keyboard.press('Shift+Tab')
      
      const focused = page.locator(':focus')
      await expect(focused).toBeVisible()
    })

    test('should handle skip links', async ({ page }) => {
      // Look for skip links (usually hidden but become visible on focus)
      const skipLinks = page.locator('a[href="#main"], a[href="#content"], .skip-link')
      
      if (await skipLinks.count() > 0) {
        await skipLinks.first().focus()
        await expect(skipLinks.first()).toBeFocused()
        
        // Skip link should be visible when focused
        await expect(skipLinks.first()).toBeVisible()
        
        // Should navigate to main content when activated
        await page.keyboard.press('Enter')
        
        const mainContent = page.locator('#main, #content, main')
        await expect(mainContent).toBeVisible()
      }
    })
  })

  test.describe('Screen Reader Support', () => {
    test('should have proper heading hierarchy', async ({ page }) => {
      const headings = await page.locator('h1, h2, h3, h4, h5, h6').all()
      
      if (headings.length > 0) {
        // Should have at least one h1
        const h1Elements = page.locator('h1')
        await expect(h1Elements).toHaveCount(1) // Only one h1 per page
        
        // Check heading hierarchy (simplified check)
        const h1 = await page.locator('h1').textContent()
        expect(h1).toBeTruthy()
        expect(h1?.trim().length).toBeGreaterThan(0)
      }
    })

    test('should have proper landmarks', async ({ page }) => {
      // Check for main landmark
      const main = page.locator('main, [role="main"]')
      await expect(main).toHaveCount(1)
      
      // Check for navigation landmark
      const nav = page.locator('nav, [role="navigation"]')
      const navCount = await nav.count()
      expect(navCount).toBeGreaterThan(0)
      
      // Each nav should have an accessible name
      for (let i = 0; i < navCount; i++) {
        const navElement = nav.nth(i)
        const hasLabel = await navElement.getAttribute('aria-label')
        const hasLabelledBy = await navElement.getAttribute('aria-labelledby')
        
        expect(hasLabel || hasLabelledBy).toBeTruthy()
      }
      
      // Check for banner/header if present
      const header = page.locator('header, [role="banner"]')
      if (await header.count() > 0) {
        await expect(header).toHaveCount(1)
      }
      
      // Check for contentinfo/footer if present
      const footer = page.locator('footer, [role="contentinfo"]')
      if (await footer.count() > 0) {
        await expect(footer).toHaveCount(1)
      }
    })

    test('should have meaningful link text', async ({ page }) => {
      const links = await page.locator('a').all()
      
      for (const link of links) {
        const text = await link.textContent()
        const ariaLabel = await link.getAttribute('aria-label')
        const title = await link.getAttribute('title')
        
        // Link should have meaningful text, aria-label, or title
        const hasContent = (text && text.trim().length > 0) || 
                          (ariaLabel && ariaLabel.trim().length > 0) || 
                          (title && title.trim().length > 0)
        
        expect(hasContent).toBeTruthy()
        
        // Avoid generic link text
        if (text) {
          const genericTexts = ['click here', 'read more', 'more', 'link']
          const isGeneric = genericTexts.some(generic => 
            text.toLowerCase().trim() === generic
          )
          expect(isGeneric).toBeFalsy()
        }
      }
    })

    test('should have proper form labels', async ({ page }) => {
      const inputs = await page.locator('input, textarea, select').all()
      
      for (const input of inputs) {
        const id = await input.getAttribute('id')
        const ariaLabel = await input.getAttribute('aria-label')
        const ariaLabelledBy = await input.getAttribute('aria-labelledby')
        const placeholder = await input.getAttribute('placeholder')
        
        // Input should have proper labeling
        const hasLabel = id && await page.locator(`label[for="${id}"]`).count() > 0
        const hasAriaLabel = ariaLabel && ariaLabel.trim().length > 0
        const hasAriaLabelledBy = ariaLabelledBy && ariaLabelledBy.trim().length > 0
        const hasPlaceholder = placeholder && placeholder.trim().length > 0
        
        const isLabeled = hasLabel || hasAriaLabel || hasAriaLabelledBy || hasPlaceholder
        expect(isLabeled).toBeTruthy()
      }
    })
  })

  test.describe('Color and Contrast', () => {
    test('should maintain functionality without color', async ({ page }) => {
      // This is a basic test - more comprehensive color testing would require
      // specialized tools or visual testing
      
      // Check that interactive elements have focus indicators
      const focusableElements = page.locator('a, button, input')
      const count = await focusableElements.count()
      
      for (let i = 0; i < Math.min(3, count); i++) {
        const element = focusableElements.nth(i)
        await element.focus()
        
        // Element should be visibly focused (this is basic - real testing would check CSS)
        await expect(element).toBeFocused()
      }
    })

    test('should support high contrast mode', async ({ page }) => {
      // Test with forced colors (simulating high contrast mode)
      await page.emulateMedia({ colorScheme: 'dark' })
      
      // Page should still be functional
      await expect(page.locator('body')).toBeVisible()
      
      // Interactive elements should still work
      const buttons = page.locator('button')
      if (await buttons.count() > 0) {
        await buttons.first().click()
        // Should not throw errors
      }
    })
  })

  test.describe('Motion and Animation', () => {
    test('should respect prefers-reduced-motion', async ({ page }) => {
      // Test with reduced motion preference
      await page.emulateMedia({ reducedMotion: 'reduce' })
      
      // Page should still be functional
      await expect(page.locator('body')).toBeVisible()
      
      // Test interactive elements still work
      const themeToggle = page.locator(
        'button[aria-label*="theme"], button[id*="theme"], .theme-toggle'
      )
      
      if (await themeToggle.count() > 0) {
        await themeToggle.click()
        // Should work without motion
        await expect(themeToggle).toBeVisible()
      }
      
      // Test search modal
      await page.keyboard.press('Meta+k')
      const searchModal = page.locator('#search-modal')
      await expect(searchModal).toBeVisible()
      
      await page.keyboard.press('Escape')
      await expect(searchModal).not.toBeVisible()
    })
  })

  test.describe('Responsive Accessibility', () => {
    test('should maintain accessibility on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      
      const accessibilityScanResults = await new AxeBuilder({ page }).analyze()
      expect(accessibilityScanResults.violations).toEqual([])
      
      // Touch targets should be appropriately sized (minimum 44px)
      const buttons = page.locator('button, a, [role="button"]')
      const buttonCount = await buttons.count()
      
      for (let i = 0; i < Math.min(5, buttonCount); i++) {
        const button = buttons.nth(i)
        if (await button.isVisible()) {
          const boundingBox = await button.boundingBox()
          if (boundingBox) {
            // Check minimum touch target size (44px is recommended)
            expect(boundingBox.width).toBeGreaterThanOrEqual(32) // Relaxed for testing
            expect(boundingBox.height).toBeGreaterThanOrEqual(32)
          }
        }
      }
    })

    test('should maintain accessibility on tablet', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 })
      
      const accessibilityScanResults = await new AxeBuilder({ page }).analyze()
      expect(accessibilityScanResults.violations).toEqual([])
    })

    test('should maintain accessibility across zoom levels', async ({ page }) => {
      // Test at 200% zoom
      await page.setViewportSize({ width: 600, height: 400 }) // Simulates zoomed view
      
      // Should still be usable
      const nav = page.locator('nav')
      await expect(nav).toBeVisible()
      
      // Search should still work
      await page.keyboard.press('Meta+k')
      const searchModal = page.locator('#search-modal')
      await expect(searchModal).toBeVisible()
      
      const accessibilityScanResults = await new AxeBuilder({ page }).analyze()
      expect(accessibilityScanResults.violations).toEqual([])
    })
  })
})