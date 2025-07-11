import { test, expect, devices } from '@playwright/test';

test.describe('Responsive Design Tests', () => {
	const viewports = [
		{ name: 'Mobile', width: 375, height: 667 },
		{ name: 'Tablet', width: 768, height: 1024 },
		{ name: 'Desktop', width: 1920, height: 1080 },
	];

	viewports.forEach(({ name, ...viewport }) => {
		test.describe(`${name} viewport`, () => {
			test.beforeEach(async ({ page }) => {
				await page.setViewportSize(viewport);
				await page.goto('/');
			});

			test(`should render correctly on ${name}`, async ({ page }) => {
				// Check that main content is visible
				await expect(page.locator('main')).toBeVisible();
				await expect(page.locator('header')).toBeVisible();

				// Take screenshot for visual comparison
				await expect(page).toHaveScreenshot(`homepage-${name.toLowerCase()}.png`);
			});

			test(`navigation should work on ${name}`, async ({ page }) => {
				const header = page.locator('header');
				await expect(header).toBeVisible();

				// Check if there's a mobile menu toggle for smaller screens
				if (name === 'Mobile') {
					const menuToggle = page.locator(
						'button[aria-label*="menu"], .hamburger, .menu-toggle, button[aria-expanded]'
					);

					if (await menuToggle.count() > 0) {
						await menuToggle.first().click();
						// Wait for menu animation
						await page.waitForTimeout(300);

						// Check if navigation menu is now visible
						const nav = page.locator('nav');
						await expect(nav).toBeVisible();
					}
				}
			});

			test(`text should be readable on ${name}`, async ({ page }) => {
				// Check that text has appropriate size and isn't cut off
				const textElements = page.locator('h1, h2, h3, p, a');
				const count = await textElements.count();

				for (let i = 0; i < Math.min(count, 5); i++) {
					const element = textElements.nth(i);
					const boundingBox = await element.boundingBox();

					if (boundingBox) {
						expect(boundingBox.width).toBeGreaterThan(0);
						expect(boundingBox.height).toBeGreaterThan(0);
					}
				}
			});
		});
	});

	test('should handle orientation changes', async ({ page }) => {
		// Start with portrait mobile
		await page.setViewportSize({ width: 375, height: 667 });
		await page.goto('/');

		await expect(page.locator('main')).toBeVisible();

		// Switch to landscape
		await page.setViewportSize({ width: 667, height: 375 });
		await page.waitForTimeout(300);

		await expect(page.locator('main')).toBeVisible();
		await expect(page.locator('header')).toBeVisible();
	});
});