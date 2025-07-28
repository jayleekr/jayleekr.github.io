import { test } from '@playwright/test';
import percySnapshot from '@percy/playwright';

test.describe('Visual Regression Tests', () => {
	test('should capture homepage screenshots', async ({ page }) => {
		await page.goto('/');

		// Wait for page to be fully loaded
		await page.waitForLoadState('networkidle');

		// Take Percy snapshot
		await percySnapshot(page, 'Homepage');
	});

	test('should capture homepage in dark mode', async ({ page }) => {
		await page.goto('/');
		await page.waitForLoadState('networkidle');

		// Toggle to dark mode if theme toggle exists
		const themeToggle = page.locator(
			'button[aria-label*="theme"], button[id*="theme"], .theme-toggle'
		);

		if (await themeToggle.count() > 0) {
			await themeToggle.first().click();
			await page.waitForTimeout(500);
		} else {
			// Manually add dark class if no toggle
			await page.evaluate(() => {
				// eslint-disable-next-line no-undef
				document.documentElement.classList.add('dark');
			});
		}

		await percySnapshot(page, 'Homepage - Dark Mode');
	});

	test('should capture blog listing page', async ({ page }) => {
		await page.goto('/');

		// Find and navigate to blog/posts page
		const blogLink = page.locator(
			'a[href*="blog"], a[href*="posts"], nav a:has-text("Blog"), nav a:has-text("Posts")'
		);

		if (await blogLink.count() > 0) {
			await blogLink.first().click();
			await page.waitForLoadState('networkidle');
			await percySnapshot(page, 'Blog Listing Page');
		}
	});

	test('should capture mobile layout', async ({ page }) => {
		await page.setViewportSize({ width: 375, height: 667 });
		await page.goto('/');
		await page.waitForLoadState('networkidle');

		await percySnapshot(page, 'Homepage - Mobile');
	});

	test('should capture tablet layout', async ({ page }) => {
		await page.setViewportSize({ width: 768, height: 1024 });
		await page.goto('/');
		await page.waitForLoadState('networkidle');

		await percySnapshot(page, 'Homepage - Tablet');
	});

	test('should capture blog post layout on desktop', async ({ page }) => {
		// Set desktop viewport
		await page.setViewportSize({ width: 1920, height: 1080 });
		
		// Look for blog posts to test
		await page.goto('/');
		await page.waitForLoadState('networkidle');
		
		// Try to find a blog post link
		const blogPostLink = page.locator('a[href*="/blog/"], a[href*="/posts/"]').first();
		
		if (await blogPostLink.count() > 0) {
			await blogPostLink.click();
			await page.waitForLoadState('networkidle');
			
			// Wait for any animations to complete
			await page.waitForTimeout(1000);
			
			await percySnapshot(page, 'Blog Post - Desktop Layout');
		}
	});

	test('should capture blog post layout on laptop', async ({ page }) => {
		// Set laptop viewport (common laptop resolution)
		await page.setViewportSize({ width: 1366, height: 768 });
		
		await page.goto('/');
		await page.waitForLoadState('networkidle');
		
		const blogPostLink = page.locator('a[href*="/blog/"], a[href*="/posts/"]').first();
		
		if (await blogPostLink.count() > 0) {
			await blogPostLink.click();
			await page.waitForLoadState('networkidle');
			await page.waitForTimeout(1000);
			
			await percySnapshot(page, 'Blog Post - Laptop Layout');
		}
	});

	test('should capture blog post layout on large desktop', async ({ page }) => {
		// Set large desktop viewport
		await page.setViewportSize({ width: 2560, height: 1440 });
		
		await page.goto('/');
		await page.waitForLoadState('networkidle');
		
		const blogPostLink = page.locator('a[href*="/blog/"], a[href*="/posts/"]').first();
		
		if (await blogPostLink.count() > 0) {
			await blogPostLink.click();
			await page.waitForLoadState('networkidle');
			await page.waitForTimeout(1000);
			
			await percySnapshot(page, 'Blog Post - Large Desktop Layout');
		}
	});

	test('should capture blog post with TOC on mobile', async ({ page }) => {
		await page.setViewportSize({ width: 375, height: 667 });
		
		await page.goto('/');
		await page.waitForLoadState('networkidle');
		
		const blogPostLink = page.locator('a[href*="/blog/"], a[href*="/posts/"]').first();
		
		if (await blogPostLink.count() > 0) {
			await blogPostLink.click();
			await page.waitForLoadState('networkidle');
			
			// Try to open mobile TOC if it exists
			const tocToggle = page.locator('#toc-toggle-mobile');
			if (await tocToggle.count() > 0) {
				await tocToggle.click();
				await page.waitForTimeout(500);
				await percySnapshot(page, 'Blog Post - Mobile with TOC Open');
			} else {
				await percySnapshot(page, 'Blog Post - Mobile Layout');
			}
		}
	});
});