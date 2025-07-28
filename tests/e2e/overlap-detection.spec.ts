import { test, expect } from '@playwright/test';

test.describe('Overlap Detection Tests', () => {
	test.describe('TOC and Content Overlap Detection', () => {
		test('should detect and prevent TOC-content overlap on laptop screens', async ({ page }) => {
			// Common laptop resolutions
			const laptopViewports = [
				{ width: 1366, height: 768 },
				{ width: 1440, height: 900 },
				{ width: 1536, height: 864 },
				{ width: 1280, height: 720 },
			];

			for (const viewport of laptopViewports) {
				await page.setViewportSize(viewport);
				await page.goto('/');
				await page.waitForLoadState('networkidle');

				const blogPostLink = page.locator('a[href*="/blog/"], a[href*="/posts/"]').first();
				
				if (await blogPostLink.count() > 0) {
					await blogPostLink.click();
					await page.waitForLoadState('networkidle');
					await page.waitForTimeout(1000);

					// Get all potential overlapping elements
					const leftToc = page.locator('aside').first();
					const rightSidebar = page.locator('aside').last();
					const mainContent = page.locator('main article').first();
					const tocMobile = page.locator('#toc-toggle-mobile');

					// Check desktop layout elements
					if (viewport.width >= 1280) {
						if (await leftToc.count() > 0 && await mainContent.count() > 0) {
							const tocBox = await leftToc.boundingBox();
							const contentBox = await mainContent.boundingBox();

							if (tocBox && contentBox) {
								// Detect horizontal overlap
								const horizontalOverlap = !(
									tocBox.x + tocBox.width <= contentBox.x || 
									contentBox.x + contentBox.width <= tocBox.x
								);

								// If overlap detected, this is a critical failure
								if (horizontalOverlap) {
									throw new Error(
										`TOC-Content overlap detected at ${viewport.width}x${viewport.height}! ` +
										`TOC: (${tocBox.x}, ${tocBox.x + tocBox.width}), ` +
										`Content: (${contentBox.x}, ${contentBox.x + contentBox.width})`
									);
								}

								// Ensure minimum spacing
								const spacing = Math.abs(contentBox.x - (tocBox.x + tocBox.width));
								expect(spacing).toBeGreaterThan(0);
							}
						}

						// Check right sidebar overlap if it exists
						if (await rightSidebar.count() > 0 && await mainContent.count() > 0) {
							const sidebarBox = await rightSidebar.boundingBox();
							const contentBox = await mainContent.boundingBox();

							if (sidebarBox && contentBox) {
								const horizontalOverlap = !(
									sidebarBox.x + sidebarBox.width <= contentBox.x || 
									contentBox.x + contentBox.width <= sidebarBox.x
								);

								if (horizontalOverlap) {
									throw new Error(
										`Right sidebar-Content overlap detected at ${viewport.width}x${viewport.height}!`
									);
								}
							}
						}
					} else {
						// Mobile/tablet: ensure desktop TOC is hidden
						const desktopTocGrid = page.locator('.hidden.xl\\:grid, .hidden.xl\\:block');
						if (await desktopTocGrid.count() > 0) {
							await expect(desktopTocGrid.first()).not.toBeVisible();
						}

						// Mobile TOC should be available
						if (await tocMobile.count() > 0) {
							await expect(tocMobile).toBeVisible();
						}
					}
				}
			}
		});

		test('should prevent content overflow on all screen sizes', async ({ page }) => {
			const viewports = [
				{ width: 320, height: 568 },   // Small mobile
				{ width: 375, height: 667 },   // iPhone
				{ width: 414, height: 896 },   // iPhone Pro Max
				{ width: 768, height: 1024 },  // iPad portrait
				{ width: 1024, height: 768 },  // iPad landscape
				{ width: 1280, height: 720 },  // Small laptop
				{ width: 1366, height: 768 },  // Common laptop
				{ width: 1440, height: 900 },  // MacBook
				{ width: 1920, height: 1080 }, // Desktop
				{ width: 2560, height: 1440 }, // Large desktop
			];

			for (const viewport of viewports) {
				await page.setViewportSize(viewport);
				await page.goto('/');
				await page.waitForLoadState('networkidle');

				const blogPostLink = page.locator('a[href*="/blog/"], a[href*="/posts/"]').first();
				
				if (await blogPostLink.count() > 0) {
					await blogPostLink.click();
					await page.waitForLoadState('networkidle');
					await page.waitForTimeout(500);

					// Check that no element extends beyond viewport
					const allElements = page.locator('main *, aside *, header *');
					const count = await allElements.count();

					for (let i = 0; i < Math.min(count, 20); i++) { // Check first 20 elements
						const element = allElements.nth(i);
						const box = await element.boundingBox();

						if (box && box.width > 0 && box.height > 0) {
							// Element should not extend beyond right edge of viewport
							if (box.x + box.width > viewport.width + 10) { // 10px tolerance for scrollbars
								const elementInfo = await element.evaluate((el) => ({
									tagName: el.tagName,
									className: el.className,
									id: el.id
								}));

								throw new Error(
									`Element overflow detected at ${viewport.width}x${viewport.height}! ` +
									`Element: ${elementInfo.tagName}.${elementInfo.className}#${elementInfo.id} ` +
									`extends to ${box.x + box.width}px (viewport: ${viewport.width}px)`
								);
							}
						}
					}
				}
			}
		});

		test('should maintain proper grid spacing at XL breakpoint', async ({ page }) => {
			// Test around the XL breakpoint (1280px)
			const breakpointViewports = [
				{ width: 1279, height: 768 }, // Just below XL
				{ width: 1280, height: 768 }, // At XL breakpoint
				{ width: 1281, height: 768 }, // Just above XL
			];

			for (const viewport of breakpointViewports) {
				await page.setViewportSize(viewport);
				await page.goto('/');
				await page.waitForLoadState('networkidle');

				const blogPostLink = page.locator('a[href*="/blog/"], a[href*="/posts/"]').first();
				
				if (await blogPostLink.count() > 0) {
					await blogPostLink.click();
					await page.waitForLoadState('networkidle');
					await page.waitForTimeout(1000);

					if (viewport.width >= 1280) {
						// Should show desktop grid layout
						const gridContainer = page.locator('.xl\\:grid');
						if (await gridContainer.count() > 0) {
							await expect(gridContainer.first()).toBeVisible();

							// Check grid column spacing
							const leftToc = page.locator('aside').first();
							const mainContent = page.locator('main').nth(1); // Desktop main
							const rightSidebar = page.locator('aside').last();

							if (await leftToc.count() > 0 && await mainContent.count() > 0) {
								const leftBox = await leftToc.boundingBox();
								const centerBox = await mainContent.boundingBox();

								if (leftBox && centerBox) {
									const gap = centerBox.x - (leftBox.x + leftBox.width);
									expect(gap).toBeGreaterThan(15); // Minimum gap
									expect(gap).toBeLessThan(100); // Not too much gap
								}
							}

							if (await mainContent.count() > 0 && await rightSidebar.count() > 0) {
								const centerBox = await mainContent.boundingBox();
								const rightBox = await rightSidebar.boundingBox();

								if (centerBox && rightBox) {
									const gap = rightBox.x - (centerBox.x + centerBox.width);
									expect(gap).toBeGreaterThan(15); // Minimum gap
									expect(gap).toBeLessThan(100); // Not too much gap
								}
							}
						}
					} else {
						// Should show mobile layout
						const mobileLayout = page.locator('.xl\\:hidden');
						if (await mobileLayout.count() > 0) {
							await expect(mobileLayout.first()).toBeVisible();
						}
					}
				}
			}
		});

		test('should handle dynamic content without causing overlaps', async ({ page }) => {
			await page.setViewportSize({ width: 1366, height: 768 });
			await page.goto('/');
			await page.waitForLoadState('networkidle');

			const blogPostLink = page.locator('a[href*="/blog/"], a[href*="/posts/"]').first();
			
			if (await blogPostLink.count() > 0) {
				await blogPostLink.click();
				await page.waitForLoadState('networkidle');
				await page.waitForTimeout(1000);

				// Simulate scrolling which might trigger layout changes
				await page.evaluate(() => {
					// eslint-disable-next-line no-undef
					window.scrollTo(0, 500);
				});
				await page.waitForTimeout(300);

				// Check for overlaps after scroll
				const toc = page.locator('aside').first();
				const content = page.locator('main article').first();

				if (await toc.count() > 0 && await content.count() > 0) {
					const tocBox = await toc.boundingBox();
					const contentBox = await content.boundingBox();

					if (tocBox && contentBox) {
						const noOverlap = 
							tocBox.x + tocBox.width <= contentBox.x || 
							contentBox.x + contentBox.width <= tocBox.x;

						expect(noOverlap).toBeTruthy();
					}
				}

				// Test window resize
				await page.setViewportSize({ width: 1280, height: 768 });
				await page.waitForTimeout(500);

				// Check again after resize
				if (await toc.count() > 0 && await content.count() > 0) {
					const tocBoxAfterResize = await toc.boundingBox();
					const contentBoxAfterResize = await content.boundingBox();

					if (tocBoxAfterResize && contentBoxAfterResize) {
						const noOverlapAfterResize = 
							tocBoxAfterResize.x + tocBoxAfterResize.width <= contentBoxAfterResize.x || 
							contentBoxAfterResize.x + contentBoxAfterResize.width <= tocBoxAfterResize.x;

						expect(noOverlapAfterResize).toBeTruthy();
					}
				}
			}
		});

		test('should prevent mobile TOC overlay from interfering with content', async ({ page }) => {
			await page.setViewportSize({ width: 375, height: 667 });
			await page.goto('/');
			await page.waitForLoadState('networkidle');

			const blogPostLink = page.locator('a[href*="/blog/"], a[href*="/posts/"]').first();
			
			if (await blogPostLink.count() > 0) {
				await blogPostLink.click();
				await page.waitForLoadState('networkidle');

				const tocToggle = page.locator('#toc-toggle-mobile');
				const tocOverlay = page.locator('#toc-overlay-mobile');

				if (await tocToggle.count() > 0 && await tocOverlay.count() > 0) {
					// Initially, overlay should be hidden
					await expect(tocOverlay).not.toBeVisible();

					// Content should be accessible
					const article = page.locator('article').first();
					if (await article.count() > 0) {
						await expect(article).toBeVisible();
					}

					// Open TOC
					await tocToggle.click();
					await page.waitForTimeout(500);

					// Overlay should be visible and properly positioned
					await expect(tocOverlay).toBeVisible();

					const overlayBox = await tocOverlay.boundingBox();
					if (overlayBox) {
						// Overlay should cover screen but not extend beyond
						expect(overlayBox.x).toBeLessThanOrEqual(0);
						expect(overlayBox.y).toBeLessThanOrEqual(0);
						expect(overlayBox.width).toBeGreaterThanOrEqual(375);
						expect(overlayBox.height).toBeGreaterThanOrEqual(667);
					}

					// Close TOC and verify content is accessible again
					const closeBtn = page.locator('#toc-close-mobile');
					if (await closeBtn.count() > 0) {
						await closeBtn.click();
						await page.waitForTimeout(500);
						await expect(tocOverlay).not.toBeVisible();
					}
				}
			}
		});
	});
});