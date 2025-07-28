import { test, expect } from '@playwright/test';

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

	test.describe('Blog Post Responsive Layout', () => {
		const blogViewports = [
			{ name: 'Mobile', width: 375, height: 667 },
			{ name: 'Tablet', width: 768, height: 1024 },
			{ name: 'Laptop', width: 1366, height: 768 },
			{ name: 'Desktop', width: 1920, height: 1080 },
			{ name: 'Large Desktop', width: 2560, height: 1440 },
		];

		blogViewports.forEach(({ name, ...viewport }) => {
			test(`blog post should render correctly on ${name}`, async ({ page }) => {
				await page.setViewportSize(viewport);
				await page.goto('/');
				await page.waitForLoadState('networkidle');

				// Try to navigate to a blog post
				const blogPostLink = page.locator('a[href*="/blog/"], a[href*="/posts/"]').first();
				
				if (await blogPostLink.count() > 0) {
					await blogPostLink.click();
					await page.waitForLoadState('networkidle');
					await page.waitForTimeout(1000);

					// Basic layout checks
					await expect(page.locator('main')).toBeVisible();
					await expect(page.locator('article')).toBeVisible();

					// Check TOC behavior based on viewport
					if (viewport.width >= 1280) {
						// Desktop: TOC should be in sidebar
						const desktopToc = page.locator('aside').first();
						if (await desktopToc.count() > 0) {
							await expect(desktopToc).toBeVisible();
						}
					} else {
						// Mobile/Tablet: Mobile TOC toggle should be present
						const mobileTocToggle = page.locator('#toc-toggle-mobile');
						if (await mobileTocToggle.count() > 0) {
							await expect(mobileTocToggle).toBeVisible();
						}
					}

					// Content should not overflow
					const article = page.locator('article').first();
					const articleBox = await article.boundingBox();
					if (articleBox) {
						expect(articleBox.x).toBeGreaterThanOrEqual(0);
						expect(articleBox.width).toBeLessThanOrEqual(viewport.width);
					}

					// Take a screenshot for this specific layout
					await expect(page).toHaveScreenshot(`blog-post-${name.toLowerCase()}.png`);
				}
			});
		});

		test('should maintain readability across all screen sizes', async ({ page }) => {
			const testViewports = [
				{ width: 320, height: 568 }, // Small mobile
				{ width: 375, height: 667 }, // iPhone
				{ width: 768, height: 1024 }, // Tablet portrait
				{ width: 1024, height: 768 }, // Tablet landscape
				{ width: 1280, height: 720 }, // Small laptop
				{ width: 1920, height: 1080 }, // Desktop
			];

			for (const viewport of testViewports) {
				await page.setViewportSize(viewport);
				await page.goto('/');
				await page.waitForLoadState('networkidle');

				const blogPostLink = page.locator('a[href*="/blog/"], a[href*="/posts/"]').first();
				
				if (await blogPostLink.count() > 0) {
					await blogPostLink.click();
					await page.waitForLoadState('networkidle');
					await page.waitForTimeout(500);

					// Check that text is readable (not too small)
					const paragraphs = page.locator('article p').first();
					if (await paragraphs.count() > 0) {
						const fontSize = await paragraphs.evaluate((el) => {
							// eslint-disable-next-line no-undef
							return parseInt(window.getComputedStyle(el).fontSize, 10);
						});
						
						// Font size should be at least 14px for readability
						expect(fontSize).toBeGreaterThanOrEqual(14);
					}

					// Check that content doesn't have horizontal scroll
					const scrollWidth = await page.evaluate(() => {
						// eslint-disable-next-line no-undef
						return document.documentElement.scrollWidth;
					});
					expect(scrollWidth).toBeLessThanOrEqual(viewport.width + 1); // Allow 1px tolerance
				}
			}
		});

		test('should handle very wide screens properly', async ({ page }) => {
			// Ultra-wide screen
			await page.setViewportSize({ width: 3440, height: 1440 });
			await page.goto('/');
			await page.waitForLoadState('networkidle');

			const blogPostLink = page.locator('a[href*="/blog/"], a[href*="/posts/"]').first();
			
			if (await blogPostLink.count() > 0) {
				await blogPostLink.click();
				await page.waitForLoadState('networkidle');
				await page.waitForTimeout(1000);

				// Content should not be stretched too wide
				const article = page.locator('article.prose').first();
				if (await article.count() > 0) {
					const articleBox = await article.boundingBox();
					if (articleBox) {
						// Should maintain readable width even on ultra-wide screens
						expect(articleBox.width).toBeLessThan(1200);
						
						// Should be centered properly
						const containerBox = await page.locator('main').boundingBox();
						if (containerBox) {
							const leftMargin = articleBox.x - containerBox.x;
							const rightMargin = (containerBox.x + containerBox.width) - (articleBox.x + articleBox.width);
							
							// Margins should be reasonably balanced (within 50px difference)
							expect(Math.abs(leftMargin - rightMargin)).toBeLessThan(50);
						}
					}
				}
			}
		});
	});
});