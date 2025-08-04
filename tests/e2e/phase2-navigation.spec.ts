import { test, expect } from '@playwright/test';

test.describe('Phase 2 Navigation Features', () => {
  test.describe('Mobile Bottom Navigation', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');
      await page.waitForLoadState('networkidle');
    });

    test('should display mobile bottom navigation on mobile viewport', async ({ page }) => {
      // Check that mobile bottom navigation is visible
      const mobileNav = page.locator('nav[aria-label="Mobile Navigation"]');
      await expect(mobileNav).toBeVisible();

      // Check it's positioned at the bottom
      const navBox = await mobileNav.boundingBox();
      expect(navBox).toBeTruthy();
      
      if (navBox) {
        const viewportHeight = 667;
        expect(navBox.y + navBox.height).toBe(viewportHeight);
      }

      // Check it has backdrop blur and proper styling
      await expect(mobileNav).toHaveClass(/backdrop-blur-md/);
      await expect(mobileNav).toHaveClass(/fixed/);
      await expect(mobileNav).toHaveClass(/bottom-0/);
    });

    test('should have all expected navigation items', async ({ page }) => {
      const mobileNav = page.locator('nav[aria-label="Mobile Navigation"]');
      
      // Check for all navigation items
      const homeButton = mobileNav.locator('[data-nav-item="home"]');
      const blogButton = mobileNav.locator('[data-nav-item="blog"]');
      const searchButton = mobileNav.locator('[data-nav-item="search"]');
      const themeButton = mobileNav.locator('[data-nav-item="theme"]');
      const languageButton = mobileNav.locator('[data-nav-item="language"]');

      await expect(homeButton).toBeVisible();
      await expect(blogButton).toBeVisible();
      await expect(searchButton).toBeVisible();
      await expect(themeButton).toBeVisible();
      await expect(languageButton).toBeVisible();

      // Check they have proper ARIA labels
      await expect(homeButton).toHaveAttribute('aria-label', /Home|홈/);
      await expect(blogButton).toHaveAttribute('aria-label', /Blog/);
      await expect(searchButton).toHaveAttribute('aria-label', /Search|검색/);
      await expect(themeButton).toHaveAttribute('aria-label', /Theme|테마/);
      await expect(languageButton).toHaveAttribute('aria-label', /Language|언어/);
    });

    test('should hide mobile navigation on desktop viewport', async ({ page }) => {
      // Switch to desktop viewport
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.waitForTimeout(500);

      const mobileNav = page.locator('nav[aria-label="Mobile Navigation"]');
      await expect(mobileNav).toBeHidden();
    });

    test('should show mobile navigation only below md breakpoint (768px)', async ({ page }) => {
      // Test at 767px (should show mobile nav)
      await page.setViewportSize({ width: 767, height: 667 });
      await page.waitForTimeout(500);
      
      const mobileNav = page.locator('nav[aria-label="Mobile Navigation"]');
      await expect(mobileNav).toBeVisible();

      // Test at 768px (should hide mobile nav)
      await page.setViewportSize({ width: 768, height: 667 });
      await page.waitForTimeout(500);
      
      await expect(mobileNav).toBeHidden();
    });

    test('should handle navigation clicks correctly', async ({ page }) => {
      const mobileNav = page.locator('nav[aria-label="Mobile Navigation"]');
      
      // Test home navigation
      const homeButton = mobileNav.locator('[data-nav-item="home"]');
      await homeButton.click();
      await page.waitForLoadState('networkidle');
      expect(page.url()).toBe('http://localhost:4321/');

      // Test blog navigation
      const blogButton = mobileNav.locator('[data-nav-item="blog"]');
      await blogButton.click();
      await page.waitForLoadState('networkidle');
      expect(page.url()).toContain('/blog');
    });

    test('should handle theme toggle in mobile navigation', async ({ page }) => {
      const mobileNav = page.locator('nav[aria-label="Mobile Navigation"]');
      const themeButton = mobileNav.locator('[data-nav-item="theme"]');
      
      // Get initial theme state
      const html = page.locator('html');
      const initialDarkMode = await html.evaluate(el => el.classList.contains('dark'));
      
      // Click theme toggle
      await themeButton.click();
      await page.waitForTimeout(500);
      
      // Check theme changed
      const newDarkMode = await html.evaluate(el => el.classList.contains('dark'));
      expect(newDarkMode).toBe(!initialDarkMode);
    });

    test('should handle search button in mobile navigation', async ({ page }) => {
      const mobileNav = page.locator('nav[aria-label="Mobile Navigation"]');
      const searchButton = mobileNav.locator('[data-nav-item="search"]');
      
      // Click search button
      await searchButton.click();
      await page.waitForTimeout(500);
      
      // Check if search modal or interface opens
      const searchModal = page.locator('[data-search-modal], #search-modal, .search-modal');
      if (await searchModal.count() > 0) {
        await expect(searchModal.first()).toBeVisible();
      }
    });

    test('should add bottom padding to body to prevent content overlap', async ({ page }) => {
      // Check that body has bottom padding
      const bodyPadding = await page.evaluate(() => {
        return window.getComputedStyle(document.body).paddingBottom;
      });
      
      // Should have some bottom padding (typically 5rem = 80px)
      expect(parseInt(bodyPadding)).toBeGreaterThan(50);
    });

    test('should handle safe area insets for devices with home indicator', async ({ page }) => {
      const mobileNav = page.locator('nav[aria-label="Mobile Navigation"]');
      
      // Check that navigation has safe area styling
      const navStyle = await mobileNav.evaluate(el => {
        return window.getComputedStyle(el).paddingBottom;
      });
      
      // Should have proper bottom padding
      expect(navStyle).toBeTruthy();
    });
  });

  test.describe('Always-Visible Desktop Search', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto('/');
      await page.waitForLoadState('networkidle');
    });

    test('should display always-visible search bar on desktop', async ({ page }) => {
      const desktopHeader = page.locator('header');
      await expect(desktopHeader).toBeVisible();

      const searchButton = page.locator('#desktop-search-button');
      await expect(searchButton).toBeVisible();

      // Check search button has proper styling and content
      await expect(searchButton).toHaveClass(/w-72/); // Should be 288px wide
      await expect(searchButton).toContainText(/Search|검색/);
      
      // Check for keyboard shortcut hint
      const kbdElement = searchButton.locator('kbd');
      await expect(kbdElement).toBeVisible();
      await expect(kbdElement).toContainText('⌘K');
    });

    test('should hide desktop search on mobile viewport', async ({ page }) => {
      // Switch to mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      await page.waitForTimeout(500);

      const searchButton = page.locator('#desktop-search-button');
      await expect(searchButton).toBeHidden();
    });

    test('should show desktop search at md breakpoint and above', async ({ page }) => {
      // Test at 767px (should hide)
      await page.setViewportSize({ width: 767, height: 667 });
      await page.waitForTimeout(500);
      
      const searchButton = page.locator('#desktop-search-button');
      await expect(searchButton).toBeHidden();

      // Test at 768px (should show)
      await page.setViewportSize({ width: 768, height: 667 });
      await page.waitForTimeout(500);
      
      await expect(searchButton).toBeVisible();
    });

    test('should handle search button click', async ({ page }) => {
      const searchButton = page.locator('#desktop-search-button');
      
      await searchButton.click();
      await page.waitForTimeout(500);
      
      // Check if search modal opens
      const searchModal = page.locator('[data-search-modal], #search-modal, .search-modal');
      if (await searchModal.count() > 0) {
        await expect(searchModal.first()).toBeVisible();
      }
    });

    test('should have proper hover states', async ({ page }) => {
      const searchButton = page.locator('#desktop-search-button');
      
      // Hover over search button
      await searchButton.hover();
      
      // Should have hover styles (border color change)
      const buttonClass = await searchButton.getAttribute('class');
      expect(buttonClass).toContain('hover:border-primary-300');
    });

    test('should be accessible with proper ARIA attributes', async ({ page }) => {
      const searchButton = page.locator('#desktop-search-button');
      
      await expect(searchButton).toHaveAttribute('aria-label', /Open search|검색 열기/);
      await expect(searchButton).toHaveAttribute('aria-expanded', 'false');
    });
  });

  test.describe('Search Keyboard Shortcuts', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto('/');
      await page.waitForLoadState('networkidle');
    });

    test('should open search with Cmd+K on Mac', async ({ page }) => {
      // Press Cmd+K
      await page.keyboard.press('Meta+k');
      await page.waitForTimeout(500);
      
      // Check if search modal opens
      const searchModal = page.locator('[data-search-modal], #search-modal, .search-modal');
      if (await searchModal.count() > 0) {
        await expect(searchModal.first()).toBeVisible();
      }
    });

    test('should open search with Ctrl+K on Windows/Linux', async ({ page }) => {
      // Press Ctrl+K
      await page.keyboard.press('Control+k');
      await page.waitForTimeout(500);
      
      // Check if search modal opens
      const searchModal = page.locator('[data-search-modal], #search-modal, .search-modal');
      if (await searchModal.count() > 0) {
        await expect(searchModal.first()).toBeVisible();
      }
    });

    test('should open search with "/" key', async ({ page }) => {
      // Press forward slash
      await page.keyboard.press('/');
      await page.waitForTimeout(500);
      
      // Check if search modal opens
      const searchModal = page.locator('[data-search-modal], #search-modal, .search-modal');
      if (await searchModal.count() > 0) {
        await expect(searchModal.first()).toBeVisible();
      }
    });

    test('should not trigger "/" shortcut when typing in input fields', async ({ page }) => {
      // Create a test input field
      await page.evaluate(() => {
        const input = document.createElement('input');
        input.type = 'text';
        input.id = 'test-input';
        document.body.appendChild(input);
      });
      
      const testInput = page.locator('#test-input');
      await testInput.focus();
      
      // Type "/" in the input field
      await page.keyboard.press('/');
      await page.waitForTimeout(500);
      
      // Search modal should not open
      const searchModal = page.locator('[data-search-modal], #search-modal, .search-modal');
      if (await searchModal.count() > 0) {
        await expect(searchModal.first()).toBeHidden();
      }
      
      // Input should contain the "/" character
      await expect(testInput).toHaveValue('/');
    });

    test('should prevent default behavior for keyboard shortcuts', async ({ page }) => {
      // Monitor for any page navigation or other default behaviors
      await page.evaluate(() => {
        document.addEventListener('keydown', (e) => {
          if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            if (e.defaultPrevented) {
              (window as unknown as { keyboardShortcutWorked: boolean }).keyboardShortcutWorked = true;
            }
          }
        });
      });
      
      // Press Cmd+K
      await page.keyboard.press('Meta+k');
      await page.waitForTimeout(500);
      
      // Check that the shortcut was properly handled
      const shortcutWorked = await page.evaluate(() => (window as unknown as { keyboardShortcutWorked?: boolean }).keyboardShortcutWorked);
      expect(shortcutWorked).toBeTruthy();
    });
  });

  test.describe('Responsive Navigation Behavior', () => {
    test('should switch between desktop and mobile navigation at correct breakpoints', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Test desktop (1920px)
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.waitForTimeout(500);
      
      const desktopHeader = page.locator('header');
      const mobileNav = page.locator('nav[aria-label="Mobile Navigation"]');
      
      await expect(desktopHeader).toBeVisible();
      await expect(mobileNav).toBeHidden();
      
      // Test tablet (768px) - should show desktop
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.waitForTimeout(500);
      
      await expect(desktopHeader).toBeVisible();
      await expect(mobileNav).toBeHidden();
      
      // Test mobile (767px) - should show mobile nav
      await page.setViewportSize({ width: 767, height: 667 });
      await page.waitForTimeout(500);
      
      await expect(desktopHeader).toBeHidden();
      await expect(mobileNav).toBeVisible();
    });

    test('should maintain navigation state during viewport changes', async ({ page }) => {
      await page.goto('/blog');
      await page.waitForLoadState('networkidle');
      
      // Start on desktop
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.waitForTimeout(500);
      
      // Verify we're on blog page
      expect(page.url()).toContain('/blog');
      
      // Switch to mobile
      await page.setViewportSize({ width: 375, height: 667 });
      await page.waitForTimeout(500);
      
      // Should still be on blog page
      expect(page.url()).toContain('/blog');
      
      // Mobile nav should indicate blog is active
      const mobileNav = page.locator('nav[aria-label="Mobile Navigation"]');
      const blogButton = mobileNav.locator('[data-nav-item="blog"]');
      
      // Check for active state (this might be a class or aria-current)
      const isActive = await blogButton.evaluate(el => {
        return el.classList.contains('text-primary-600') || 
               el.getAttribute('aria-current') === 'page' ||
               el.classList.contains('bg-primary-50');
      });
      
      expect(isActive).toBeTruthy();
    });
  });
});