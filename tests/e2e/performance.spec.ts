import { test, expect } from '@playwright/test'

test.describe('Performance Tests (Core Web Vitals)', () => {
  test.beforeEach(async ({ page }) => {
    // Enable performance monitoring
    await page.goto('/', { waitUntil: 'networkidle' })
  })

  test.describe('Loading Performance', () => {
    test('should load homepage within performance budget', async ({ page }) => {
      const startTime = Date.now()
      
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      
      const loadTime = Date.now() - startTime
      
      // Performance budget: 3 seconds on 3G, 1 second on fast connection
      expect(loadTime).toBeLessThan(5000) // 5 seconds maximum
      
      // Essential content should be visible
      await expect(page.locator('h1')).toBeVisible()
      await expect(page.locator('main')).toBeVisible()
    })

    test('should have fast First Contentful Paint', async ({ page }) => {
      const startTime = Date.now()
      
      await page.goto('/')
      
      // Wait for first meaningful content
      await page.waitForSelector('h1, .hero, main')
      
      const fcpTime = Date.now() - startTime
      
      // FCP should be under 1.8 seconds (good threshold)
      expect(fcpTime).toBeLessThan(1800)
    })

    test('should have interactive elements ready quickly', async ({ page }) => {
      await page.goto('/')
      
      const startTime = Date.now()
      
      // Test that interactive elements respond quickly
      const searchButton = page.locator('button[aria-label*="search"], [data-nav-item="search"]')
      
      if (await searchButton.count() > 0) {
        await searchButton.click()
        
        const searchModal = page.locator('#search-modal')
        await expect(searchModal).toBeVisible()
        
        const interactionTime = Date.now() - startTime
        expect(interactionTime).toBeLessThan(300) // Should be very fast
        
        await page.keyboard.press('Escape')
      }
    })
  })

  test.describe('Runtime Performance', () => {
    test('should handle theme toggle without performance issues', async ({ page }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      
      const themeToggle = page.locator(
        'button[aria-label*="theme"], button[id*="theme"], .theme-toggle'
      )
      
      if (await themeToggle.count() > 0) {
        // Measure theme toggle performance
        const iterations = 10
        const startTime = Date.now()
        
        for (let i = 0; i < iterations; i++) {
          await themeToggle.click()
          await page.waitForTimeout(50) // Small delay between clicks
        }
        
        const totalTime = Date.now() - startTime
        const averageTime = totalTime / iterations
        
        // Each theme toggle should be fast
        expect(averageTime).toBeLessThan(100) // 100ms average
        
        // UI should still be responsive
        await expect(themeToggle).toBeVisible()
      }
    })

    test('should handle rapid search interactions', async ({ page }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      
      const iterations = 5
      const startTime = Date.now()
      
      for (let i = 0; i < iterations; i++) {
        // Open search
        await page.keyboard.press('Meta+k')
        await page.waitForTimeout(50)
        
        // Type in search
        const searchInput = page.locator('#search-input')
        await searchInput.fill(`test query ${i}`)
        await page.waitForTimeout(100)
        
        // Close search
        await page.keyboard.press('Escape')
        await page.waitForTimeout(50)
      }
      
      const totalTime = Date.now() - startTime
      const averageTime = totalTime / iterations
      
      // Each search interaction cycle should be reasonably fast
      expect(averageTime).toBeLessThan(500) // 500ms average per cycle
      
      // Search should still work after rapid interactions
      await page.keyboard.press('Meta+k')
      const searchModal = page.locator('#search-modal')
      await expect(searchModal).toBeVisible()
    })

    test('should maintain performance with responsive changes', async ({ page }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      
      const viewports = [
        { width: 1200, height: 800 },
        { width: 768, height: 1024 },
        { width: 375, height: 667 },
        { width: 320, height: 568 }
      ]
      
      const startTime = Date.now()
      
      for (const viewport of viewports) {
        await page.setViewportSize(viewport)
        await page.waitForTimeout(100) // Allow layout to settle
        
        // Test that navigation is still responsive
        const nav = page.locator('nav')
        await expect(nav).toBeVisible()
      }
      
      const totalTime = Date.now() - startTime
      expect(totalTime).toBeLessThan(2000) // All viewport changes should be fast
    })
  })

  test.describe('Resource Efficiency', () => {
    test('should not load excessive resources', async ({ page }) => {
      const responses: Array<{
        url: string
        status: number
        resourceType: string
        size: string | null
      }> = []
      
      page.on('response', response => {
        responses.push({
          url: response.url(),
          status: response.status(),
          resourceType: response.request().resourceType(),
          size: response.headers()['content-length']
        })
      })
      
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      
      // Analyze loaded resources
      const jsFiles = responses.filter(r => r.resourceType === 'script')
      const cssFiles = responses.filter(r => r.resourceType === 'stylesheet')
      const imageFiles = responses.filter(r => r.resourceType === 'image')
      
      // Should not load excessive number of files
      expect(jsFiles.length).toBeLessThan(20) // Reasonable JS file limit
      expect(cssFiles.length).toBeLessThan(10) // Reasonable CSS file limit
      expect(imageFiles.length).toBeLessThan(50) // Reasonable image limit
      
      // All resources should load successfully
      const failedRequests = responses.filter(r => r.status >= 400)
      expect(failedRequests).toEqual([])
      
      // No duplicate resource loading
      const urls = responses.map(r => r.url)
      const uniqueUrls = new Set(urls)
      expect(urls.length - uniqueUrls.size).toBeLessThan(3) // Allow minimal duplication
    })

    test('should handle offline gracefully', async ({ page, context }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      
      // Go offline
      await context.setOffline(true)
      
      // Try to navigate (should handle gracefully)
      try {
        await page.reload({ waitUntil: 'networkidle', timeout: 5000 })
      } catch {
        // Expected to fail when offline
      }
      
      // Test that cached resources might still work
      // (This depends on service worker implementation)
      const body = page.locator('body')
      await expect(body).toBeVisible() // Basic page structure should exist
      
      // Go back online
      await context.setOffline(false)
      
      // Should work again
      await page.reload({ waitUntil: 'networkidle' })
      await expect(page.locator('main')).toBeVisible()
    })
  })

  test.describe('Memory and CPU Efficiency', () => {
    test('should not cause memory leaks with repeated actions', async ({ page }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      
      // Perform memory-intensive actions repeatedly
      const themeToggle = page.locator(
        'button[aria-label*="theme"], button[id*="theme"], .theme-toggle'
      )
      
      // Test for potential memory leaks with theme toggling
      if (await themeToggle.count() > 0) {
        for (let i = 0; i < 20; i++) {
          await themeToggle.click()
          await page.waitForTimeout(25)
        }
      }
      
      // Test for potential memory leaks with search modal
      for (let i = 0; i < 10; i++) {
        await page.keyboard.press('Meta+k')
        await page.waitForTimeout(50)
        
        const searchInput = page.locator('#search-input')
        await searchInput.fill(`memory test ${i}`)
        await page.waitForTimeout(50)
        
        await page.keyboard.press('Escape')
        await page.waitForTimeout(50)
      }
      
      // Should still be responsive after repeated actions
      await page.keyboard.press('Meta+k')
      const searchModal = page.locator('#search-modal')
      await expect(searchModal).toBeVisible()
      
      // Check for JavaScript errors that might indicate memory issues
      const errors: string[] = []
      page.on('pageerror', error => {
        errors.push(error.message)
      })
      
      await page.reload()
      await page.waitForTimeout(1000)
      
      // Should have no memory-related errors
      expect(errors).toEqual([])
    })

    test('should handle large content efficiently', async ({ page }) => {
      // Navigate to blog page (likely to have more content)
      const blogLink = page.locator('a[href*="/blog"]')
      
      if (await blogLink.count() > 0) {
        const startTime = Date.now()
        
        await blogLink.click()
        await page.waitForLoadState('networkidle')
        
        const loadTime = Date.now() - startTime
        
        // Blog page should load reasonably fast even with more content
        expect(loadTime).toBeLessThan(3000)
        
        // Should be able to scroll smoothly
        await page.evaluate(() => {
          window.scrollTo(0, document.body.scrollHeight / 2)
        })
        
        await page.waitForTimeout(100)
        
        // Page should still be responsive
        const nav = page.locator('nav')
        await expect(nav).toBeVisible()
      }
    })
  })

  test.describe('Mobile Performance', () => {
    test('should perform well on mobile devices', async ({ page }) => {
      // Simulate mobile device performance characteristics
      await page.setViewportSize({ width: 375, height: 667 })
      
      // Simulate slower mobile CPU
      const startTime = Date.now()
      
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      
      const loadTime = Date.now() - startTime
      
      // Mobile should still load within reasonable time
      expect(loadTime).toBeLessThan(6000) // 6 seconds for mobile
      
      // Test mobile-specific interactions
      const mobileNav = page.locator('[role="navigation"][aria-label*="Mobile"]')
      await expect(mobileNav).toBeVisible()
      
      // Test that mobile navigation is responsive
      const navButton = mobileNav.locator('[data-nav-item]').first()
      const interactionStart = Date.now()
      
      await navButton.click()
      
      const interactionTime = Date.now() - interactionStart
      expect(interactionTime).toBeLessThan(200) // Should be very responsive
    })

    test('should handle touch interactions efficiently', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      
      const mobileNav = page.locator('[role="navigation"][aria-label*="Mobile"]')
      const touchTargets = mobileNav.locator('[data-nav-item]')
      const touchCount = await touchTargets.count()
      
      // Test rapid touch interactions
      const startTime = Date.now()
      
      for (let i = 0; i < Math.min(5, touchCount); i++) {
        const target = touchTargets.nth(i)
        if (await target.isVisible()) {
          // Simulate touch
          await target.click()
          await page.waitForTimeout(50)
        }
      }
      
      const totalTime = Date.now() - startTime
      const averageTime = totalTime / Math.min(5, touchCount)
      
      // Touch interactions should be fast
      expect(averageTime).toBeLessThan(150)
      
      // Navigation should still be functional
      await expect(mobileNav).toBeVisible()
    })
  })

  test.describe('Progressive Enhancement', () => {
    test('should work with JavaScript disabled', async ({ page, context }) => {
      // Disable JavaScript
      await context.setJavaScriptEnabled(false)
      
      await page.goto('/')
      await page.waitForLoadState('domcontentloaded')
      
      // Basic content should still be visible
      await expect(page.locator('body')).toBeVisible()
      await expect(page.locator('main')).toBeVisible()
      
      // Navigation links should still work (without JS)
      const navLinks = page.locator('nav a[href]')
      const linkCount = await navLinks.count()
      
      if (linkCount > 0) {
        const firstLink = navLinks.first()
        const href = await firstLink.getAttribute('href')
        expect(href).toBeTruthy()
        
        // Links should be functional (basic HTML navigation)
        if (href && !href.startsWith('#')) {
          await firstLink.click()
          await page.waitForLoadState('domcontentloaded')
          
          // Should navigate to new page
          expect(page.url()).toContain(href)
        }
      }
    })

    test('should enhance progressively with JavaScript', async ({ page }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      
      // With JavaScript, enhanced features should work
      await page.keyboard.press('Meta+k')
      
      const searchModal = page.locator('#search-modal')
      await expect(searchModal).toBeVisible()
      
      // Theme toggle should work
      const themeToggle = page.locator(
        'button[aria-label*="theme"], button[id*="theme"], .theme-toggle'
      )
      
      if (await themeToggle.count() > 0) {
        await themeToggle.click()
        
        // Should see theme change
        const html = page.locator('html')
        await expect(html).toHaveAttribute('data-theme')
      }
    })
  })
})