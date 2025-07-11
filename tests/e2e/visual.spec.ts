import { test, expect } from '@playwright/test';
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
});