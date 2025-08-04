import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Critical User Journeys', () => {
  test.beforeEach(async ({ page }) => {
    // Start from homepage
    await page.goto('/')
  })

  test.describe('Mobile Navigation Journey', () => {
    test('should complete mobile navigation flow', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 })
      
      // Verify mobile bottom navigation is visible
      const mobileNav = page.locator('[role="navigation"][aria-label*="Mobile"]')
      await expect(mobileNav).toBeVisible()
      
      // Test home navigation
      const homeButton = mobileNav.locator('[data-nav-item="home"]')
      await expect(homeButton).toBeVisible()
      await homeButton.click()
      await expect(page).toHaveURL(/\/$/)
      
      // Test blog navigation
      const blogButton = mobileNav.locator('[data-nav-item="blog"]')
      await expect(blogButton).toBeVisible()
      await blogButton.click()
      await expect(page).toHaveURL(/\/blog/)
      
      // Verify blog page loaded
      await expect(page.locator('h1')).toContainText(/blog|posts/i)
      
      // Test search button
      const searchButton = mobileNav.locator('[data-nav-item="search"]')
      await expect(searchButton).toBeVisible()
      await searchButton.click()
      
      // Verify search modal opens
      const searchModal = page.locator('#search-modal')
      await expect(searchModal).toBeVisible()
      
      // Test theme toggle
      const themeButton = mobileNav.locator('[data-nav-item="theme"]')
      await expect(themeButton).toBeVisible()
      await themeButton.click()
      
      // Verify theme changed (check for dark class or data attribute)
      const htmlElement = page.locator('html')
      await expect(htmlElement).toHaveAttribute('data-theme')
      
      // Test language toggle
      const languageButton = mobileNav.locator('[data-nav-item="language"]')
      await expect(languageButton).toBeVisible()
      await languageButton.click()
      
      // Verify language context or modal appears
      // This would depend on the specific implementation
    })

    test('should handle mobile navigation accessibility', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      
      // Run accessibility scan on mobile navigation
      const accessibilityScanResults = await new AxeBuilder({ page })
        .include('[role="navigation"]')
        .analyze()
      
      expect(accessibilityScanResults.violations).toEqual([])
      
      // Test keyboard navigation
      const mobileNav = page.locator('[role="navigation"][aria-label*="Mobile"]')
      const navItems = mobileNav.locator('[data-nav-item]')
      
      // Focus first nav item
      await navItems.first().focus()
      await expect(navItems.first()).toBeFocused()
      
      // Tab through navigation items
      await page.keyboard.press('Tab')
      await expect(navItems.nth(1)).toBeFocused()
    })

    test('should maintain mobile navigation state across pages', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      
      const mobileNav = page.locator('[role="navigation"][aria-label*="Mobile"]')
      
      // Toggle theme on homepage
      const themeButton = mobileNav.locator('[data-nav-item="theme"]')
      await themeButton.click()
      
      // Navigate to blog
      const blogButton = mobileNav.locator('[data-nav-item="blog"]')
      await blogButton.click()
      
      // Verify theme persisted
      const htmlElement = page.locator('html')
      await expect(htmlElement).toHaveAttribute('data-theme')
      
      // Verify mobile nav still visible and functional
      await expect(mobileNav).toBeVisible()
      await expect(themeButton).toBeVisible()
    })
  })

  test.describe('Desktop Navigation Journey', () => {
    test('should complete desktop navigation flow', async ({ page }) => {
      // Set desktop viewport
      await page.setViewportSize({ width: 1200, height: 800 })
      
      // Verify desktop navigation is visible
      const desktopNav = page.locator('header nav')
      await expect(desktopNav).toBeVisible()
      
      // Test logo/home link
      const logoLink = desktopNav.locator('a').first()
      await expect(logoLink).toBeVisible()
      await logoLink.click()
      await expect(page).toHaveURL(/\/$/)
      
      // Test main navigation links
      const navLinks = desktopNav.locator('a[href*="/blog"], a[href*="/about"]')
      const linkCount = await navLinks.count()
      expect(linkCount).toBeGreaterThan(0)
      
      // Test blog link
      const blogLink = desktopNav.locator('a[href*="/blog"]')
      if (await blogLink.count() > 0) {
        await blogLink.click()
        await expect(page).toHaveURL(/\/blog/)
      }
      
      // Test search functionality
      const searchButton = desktopNav.locator('button[aria-label*="search"], [data-nav-item="search"]')
      if (await searchButton.count() > 0) {
        await searchButton.click()
        
        const searchModal = page.locator('#search-modal')
        await expect(searchModal).toBeVisible()
      }
    })

    test('should handle desktop search keyboard shortcuts', async ({ page }) => {
      await page.setViewportSize({ width: 1200, height: 800 })
      
      // Test Cmd+K shortcut
      await page.keyboard.press('Meta+k')
      
      const searchModal = page.locator('#search-modal')
      await expect(searchModal).toBeVisible()
      
      // Close modal
      await page.keyboard.press('Escape')
      await expect(searchModal).not.toBeVisible()
      
      // Test / shortcut
      await page.keyboard.press('/')
      await expect(searchModal).toBeVisible()
    })
  })

  test.describe('Search Functionality Journey', () => {
    test('should complete full search workflow', async ({ page }) => {
      // Open search modal
      await page.keyboard.press('Meta+k')
      
      const searchModal = page.locator('#search-modal')
      await expect(searchModal).toBeVisible()
      
      const searchInput = page.locator('#search-input')
      await expect(searchInput).toBeFocused()
      
      // Test empty state
      const emptyState = page.locator('[data-search-empty]')
      await expect(emptyState).toBeVisible()
      
      // Type search query
      await searchInput.fill('test')
      
      // Wait for loading state
      await page.waitForTimeout(200)
      
      // Check for search results or no results state
      const resultsOrNoResults = page.locator('[data-search-results-list], [data-search-no-results]')
      await expect(resultsOrNoResults).toBeVisible()
      
      // Test keyboard navigation in results (if results exist)
      const resultsList = page.locator('[data-search-results-list]')
      if (await resultsList.isVisible()) {
        const results = resultsList.locator('[data-result-index]')
        const resultCount = await results.count()
        
        if (resultCount > 0) {
          // Test arrow key navigation
          await page.keyboard.press('ArrowDown')
          await expect(results.first()).toHaveClass(/selected|bg-primary/)
          
          // Test Enter to select
          await page.keyboard.press('Enter')
          // Should navigate to result
        }
      }
      
      // Test modal close
      await page.keyboard.press('Escape')
      await expect(searchModal).not.toBeVisible()
    })

    test('should handle search input debouncing', async ({ page }) => {
      await page.keyboard.press('Meta+k')
      
      const searchInput = page.locator('#search-input')
      
      // Type quickly to test debouncing
      await searchInput.fill('t')
      await searchInput.fill('te')
      await searchInput.fill('tes')
      await searchInput.fill('test')
      
      // Should show loading state after debounce delay
      await page.waitForTimeout(200)
      
      // Verify search functionality works
      const searchResults = page.locator('[data-search-results]')
      await expect(searchResults).toBeVisible()
    })

    test('should handle search accessibility', async ({ page }) => {
      await page.keyboard.press('Meta+k')
      
      const searchModal = page.locator('#search-modal')
      
      // Run accessibility scan on search modal
      const accessibilityScanResults = await new AxeBuilder({ page })
        .include('#search-modal')
        .analyze()
      
      expect(accessibilityScanResults.violations).toEqual([])
      
      // Verify modal attributes
      await expect(searchModal).toHaveAttribute('role', 'dialog')
      await expect(searchModal).toHaveAttribute('aria-modal', 'true')
      
      // Verify input has proper label/placeholder
      const searchInput = page.locator('#search-input')
      const placeholder = await searchInput.getAttribute('placeholder')
      expect(placeholder).toBeTruthy()
    })
  })

  test.describe('Theme Toggle Journey', () => {
    test('should complete theme switching workflow', async ({ page }) => {
      // Test initial theme state
      const htmlElement = page.locator('html')
      
      // Find theme toggle button
      const themeToggle = page.locator(
        'button[aria-label*="theme"], button[id*="theme"], .theme-toggle'
      )
      await expect(themeToggle).toBeVisible()
      
      // Get initial theme state
      const initialTheme = await htmlElement.getAttribute('data-theme')
      const initialHasClass = await htmlElement.evaluate(el => el.classList.contains('dark'))
      
      // Toggle theme
      await themeToggle.click()
      
      // Wait for theme change
      await page.waitForTimeout(300)
      
      // Verify theme changed
      const newTheme = await htmlElement.getAttribute('data-theme')
      const newHasClass = await htmlElement.evaluate(el => el.classList.contains('dark'))
      
      // Theme should have changed
      expect(newTheme !== initialTheme || newHasClass !== initialHasClass).toBeTruthy()
      
      // Toggle back
      await themeToggle.click()
      await page.waitForTimeout(300)
      
      // Verify theme reverted
      const finalTheme = await htmlElement.getAttribute('data-theme')
      const finalHasClass = await htmlElement.evaluate(el => el.classList.contains('dark'))
      
      expect(finalTheme === initialTheme && finalHasClass === initialHasClass).toBeTruthy()
    })

    test('should persist theme across page navigation', async ({ page }) => {
      const htmlElement = page.locator('html')
      const themeToggle = page.locator(
        'button[aria-label*="theme"], button[id*="theme"], .theme-toggle'
      )
      
      // Toggle to dark theme
      await themeToggle.click()
      await page.waitForTimeout(300)
      
      const themeAfterToggle = await htmlElement.getAttribute('data-theme')
      const darkClassAfterToggle = await htmlElement.evaluate(el => el.classList.contains('dark'))
      
      // Navigate to blog page
      const blogLink = page.locator('a[href*="/blog"]')
      if (await blogLink.count() > 0) {
        await blogLink.click()
        await page.waitForTimeout(300)
        
        // Verify theme persisted
        const themeOnNewPage = await htmlElement.getAttribute('data-theme')
        const darkClassOnNewPage = await htmlElement.evaluate(el => el.classList.contains('dark'))
        
        expect(themeOnNewPage).toBe(themeAfterToggle)
        expect(darkClassOnNewPage).toBe(darkClassAfterToggle)
      }
    })
  })

  test.describe('Responsive Behavior Journey', () => {
    test('should adapt navigation between breakpoints', async ({ page }) => {
      // Start with desktop
      await page.setViewportSize({ width: 1200, height: 800 })
      
      // Verify desktop navigation
      const desktopNav = page.locator('header nav')
      await expect(desktopNav).toBeVisible()
      
      // Switch to tablet
      await page.setViewportSize({ width: 768, height: 1024 })
      await page.waitForTimeout(300)
      
      // Navigation should still be visible (might be different layout)
      const nav = page.locator('nav')
      await expect(nav).toBeVisible()
      
      // Switch to mobile
      await page.setViewportSize({ width: 375, height: 667 })
      await page.waitForTimeout(300)
      
      // Mobile bottom navigation should be visible
      const mobileNav = page.locator('[role="navigation"][aria-label*="Mobile"]')
      await expect(mobileNav).toBeVisible()
      
      // Desktop nav should be hidden
      const desktopNavHidden = page.locator('header nav')
      // Check if it's either not visible or has hidden classes
      const isHidden = await desktopNavHidden.evaluate(el => {
        const style = window.getComputedStyle(el)
        return style.display === 'none' || el.classList.contains('hidden') || el.classList.contains('md:hidden')
      }).catch(() => true) // If element doesn't exist, consider it hidden
      
      expect(isHidden).toBeTruthy()
    })

    test('should maintain functionality across all breakpoints', async ({ page }) => {
      const breakpoints = [
        { width: 320, height: 568, name: 'mobile-small' },
        { width: 375, height: 667, name: 'mobile' },
        { width: 768, height: 1024, name: 'tablet' },
        { width: 1024, height: 768, name: 'desktop-small' },
        { width: 1200, height: 800, name: 'desktop' }
      ]
      
      for (const breakpoint of breakpoints) {
        await page.setViewportSize({ width: breakpoint.width, height: breakpoint.height })
        await page.waitForTimeout(300)
        
        // Test search functionality
        await page.keyboard.press('Meta+k')
        const searchModal = page.locator('#search-modal')
        await expect(searchModal).toBeVisible()
        await page.keyboard.press('Escape')
        
        // Test theme toggle
        const themeToggle = page.locator(
          'button[aria-label*="theme"], button[id*="theme"], .theme-toggle'
        )
        if (await themeToggle.count() > 0) {
          await themeToggle.click()
          await page.waitForTimeout(200)
          // Theme should change
          const htmlElement = page.locator('html')
          await expect(htmlElement).toHaveAttribute('data-theme')
        }
      }
    })
  })

  test.describe('About Page Journey', () => {
    test('should complete about page user flow', async ({ page }) => {
      // Navigate to about page
      const aboutLink = page.locator('a[href*="/about"]')
      if (await aboutLink.count() > 0) {
        await aboutLink.click()
        await expect(page).toHaveURL(/\/about/)
        
        // Verify page loaded
        await expect(page.locator('h1')).toBeVisible()
        
        // Test page accessibility
        const accessibilityScanResults = await new AxeBuilder({ page }).analyze()
        expect(accessibilityScanResults.violations).toEqual([])
        
        // Test interactive elements (if any)
        const buttons = page.locator('button')
        const buttonCount = await buttons.count()
        
        for (let i = 0; i < buttonCount; i++) {
          const button = buttons.nth(i)
          if (await button.isVisible()) {
            await expect(button).toHaveAttribute('aria-label')
          }
        }
      }
    })
  })

  test.describe('Blog Navigation Journey', () => {
    test('should navigate blog posts and categories', async ({ page }) => {
      // Navigate to blog
      const blogLink = page.locator('a[href*="/blog"]')
      if (await blogLink.count() > 0) {
        await blogLink.click()
        await expect(page).toHaveURL(/\/blog/)
        
        // Verify blog page loaded
        await expect(page.locator('h1')).toBeVisible()
        
        // Test blog post links
        const postLinks = page.locator('a[href*="/blog/"], article a')
        const postCount = await postLinks.count()
        
        if (postCount > 0) {
          // Click first post
          await postLinks.first().click()
          
          // Verify post page loaded
          await expect(page.locator('article, main')).toBeVisible()
          
          // Test back navigation
          await page.goBack()
          await expect(page).toHaveURL(/\/blog/)
        }
        
        // Test category navigation if available
        const categoryLinks = page.locator('a[href*="/categories"], a[href*="/tags"]')
        const categoryCount = await categoryLinks.count()
        
        if (categoryCount > 0) {
          await categoryLinks.first().click()
          // Should navigate to category page
          await expect(page.locator('h1')).toBeVisible()
        }
      }
    })
  })

  test.describe('Performance and Loading Journey', () => {
    test('should load pages within performance budgets', async ({ page }) => {
      // Start timing
      const startTime = Date.now()
      
      await page.goto('/')
      
      // Wait for page to be fully loaded
      await page.waitForLoadState('networkidle')
      
      const loadTime = Date.now() - startTime
      
      // Basic performance assertions
      expect(loadTime).toBeLessThan(5000) // Page should load within 5 seconds
      
      // Check that essential elements are visible
      await expect(page.locator('header')).toBeVisible()
      await expect(page.locator('main')).toBeVisible()
      
      // Check for JavaScript errors
      const errors: string[] = []
      page.on('pageerror', error => {
        errors.push(error.message)
      })
      
      // Reload to catch any errors
      await page.reload()
      await page.waitForTimeout(1000)
      
      // Should have no JavaScript errors
      expect(errors).toEqual([])
      
      // Check that interactive elements work quickly
      const searchStartTime = Date.now()
      await page.keyboard.press('Meta+k')
      
      const searchModal = page.locator('#search-modal')
      await expect(searchModal).toBeVisible()
      
      const searchResponseTime = Date.now() - searchStartTime
      expect(searchResponseTime).toBeLessThan(300) // Search should open quickly
      
      await page.keyboard.press('Escape')
    })
    
    test('should handle multiple rapid interactions', async ({ page }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      
      // Test rapid theme toggling
      const themeToggle = page.locator(
        'button[aria-label*="theme"], button[id*="theme"], .theme-toggle'
      )
      
      if (await themeToggle.count() > 0) {
        // Rapidly toggle theme multiple times
        for (let i = 0; i < 5; i++) {
          await themeToggle.click()
          await page.waitForTimeout(50) // Brief pause between clicks
        }
        
        // Should still be responsive
        await expect(themeToggle).toBeVisible()
      }
      
      // Test rapid search modal open/close
      for (let i = 0; i < 3; i++) {
        await page.keyboard.press('Meta+k')
        await page.waitForTimeout(100)
        await page.keyboard.press('Escape')
        await page.waitForTimeout(100)
      }
      
      // Should still work
      await page.keyboard.press('Meta+k')
      const searchModal = page.locator('#search-modal')
      await expect(searchModal).toBeVisible()
    })
  })
})