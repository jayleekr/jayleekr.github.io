import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Homepage Tests', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
	});

	test('should load homepage successfully', async ({ page }) => {
		await expect(page).toHaveTitle(/Jay Lee/);
		await expect(page.locator('header')).toBeVisible();
		await expect(page.locator('main')).toBeVisible();
	});

	test('should have working navigation', async ({ page }) => {
		// Check that navigation links are present and clickable
		const navLinks = page.locator('nav a');
		const navCount = await navLinks.count();
		expect(navCount).toBeGreaterThan(0);

		// Test navigation to blog if it exists
		const blogLink = page.locator('nav a[href*="blog"], nav a[href*="posts"]');
		if (await blogLink.count() > 0) {
			await blogLink.first().click();
			expect(page.url()).toContain('blog');
		}
	});

	test('should be accessible', async ({ page }) => {
		const accessibilityScanResults = await new AxeBuilder({ page } as any).analyze();

		expect(accessibilityScanResults.violations).toEqual([]);
	});

	test('should have meta tags for SEO', async ({ page }) => {
		// Check for essential meta tags
		await expect(page.locator('meta[name="description"]')).toHaveCount(1);
		await expect(page.locator('meta[property="og:title"]')).toHaveCount(1);
		await expect(page.locator('meta[property="og:description"]')).toHaveCount(1);
	});

	test('should handle theme toggle', async ({ page }) => {
		// Look for theme toggle button
		const themeToggle = page.locator(
			'button[aria-label*="theme"], button[id*="theme"], .theme-toggle'
		);

		if (await themeToggle.count() > 0) {
			// Check initial state
			const body = page.locator('body');
			const htmlElement = page.locator('html');

			// Click theme toggle
			await themeToggle.first().click();

			// Wait for theme change
			await page.waitForTimeout(500);

			// Verify theme changed (could be class or data attribute)
			const hasThemeClass = await Promise.race([
				body.evaluate(el => el.classList.contains('dark')),
				htmlElement.evaluate(el => el.classList.contains('dark')),
				htmlElement.evaluate(el => el.getAttribute('data-theme') === 'dark'),
			]);

			expect(hasThemeClass).toBeTruthy();
		}
	});
});