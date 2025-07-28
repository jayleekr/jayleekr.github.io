import { test, expect } from '@playwright/test';

test.describe('Layout Tests', () => {
	test.describe('Blog Post Layout', () => {
		test('should not have overlapping TOC and content on desktop', async ({ page }) => {
			// Set desktop viewport
			await page.setViewportSize({ width: 1920, height: 1080 });
			
			await page.goto('/');
			await page.waitForLoadState('networkidle');
			
			// Find and navigate to a blog post
			const blogPostLink = page.locator('a[href*="/blog/"], a[href*="/posts/"]').first();
			
			if (await blogPostLink.count() > 0) {
				await blogPostLink.click();
				await page.waitForLoadState('networkidle');
				await page.waitForTimeout(1000);
				
				// Check if TOC and main content exist
				const toc = page.locator('aside').first();
				const mainContent = page.locator('main article').first();
				
				if (await toc.count() > 0 && await mainContent.count() > 0) {
					const tocBox = await toc.boundingBox();
					const contentBox = await mainContent.boundingBox();
					
					if (tocBox && contentBox) {
						// TOC should not overlap with main content
						const noHorizontalOverlap = 
							tocBox.x + tocBox.width <= contentBox.x || 
							contentBox.x + contentBox.width <= tocBox.x;
						
						expect(noHorizontalOverlap).toBeTruthy();
						
						// Both elements should be visible
						expect(tocBox.width).toBeGreaterThan(0);
						expect(contentBox.width).toBeGreaterThan(0);
					}
				}
			}
		});

		test('should not have overlapping TOC and content on laptop', async ({ page }) => {
			// Set laptop viewport (1366x768 is common)
			await page.setViewportSize({ width: 1366, height: 768 });
			
			await page.goto('/');
			await page.waitForLoadState('networkidle');
			
			const blogPostLink = page.locator('a[href*="/blog/"], a[href*="/posts/"]').first();
			
			if (await blogPostLink.count() > 0) {
				await blogPostLink.click();
				await page.waitForLoadState('networkidle');
				await page.waitForTimeout(1000);
				
				const toc = page.locator('aside').first();
				const mainContent = page.locator('main article').first();
				
				if (await toc.count() > 0 && await mainContent.count() > 0) {
					const tocBox = await toc.boundingBox();
					const contentBox = await mainContent.boundingBox();
					
					if (tocBox && contentBox) {
						const noHorizontalOverlap = 
							tocBox.x + tocBox.width <= contentBox.x || 
							contentBox.x + contentBox.width <= tocBox.x;
						
						expect(noHorizontalOverlap).toBeTruthy();
						expect(tocBox.width).toBeGreaterThan(0);
						expect(contentBox.width).toBeGreaterThan(0);
					}
				}
			}
		});

		test('should use full screen width appropriately on wide screens', async ({ page }) => {
			// Set wide desktop viewport
			await page.setViewportSize({ width: 2560, height: 1440 });
			
			await page.goto('/');
			await page.waitForLoadState('networkidle');
			
			const blogPostLink = page.locator('a[href*="/blog/"], a[href*="/posts/"]').first();
			
			if (await blogPostLink.count() > 0) {
				await blogPostLink.click();
				await page.waitForLoadState('networkidle');
				await page.waitForTimeout(1000);
				
				// Check that the main container uses a good portion of screen width
				const container = page.locator('div').filter({ hasText: /Content Container/ }).first();
				const mainContent = page.locator('main article').first();
				
				if (await container.count() > 0 && await mainContent.count() > 0) {
					const containerBox = await container.boundingBox();
					const contentBox = await mainContent.boundingBox();
					
					if (containerBox && contentBox) {
						// Container should use most of the screen width
						const screenUsage = containerBox.width / 2560;
						expect(screenUsage).toBeGreaterThan(0.7); // At least 70% of screen width
						
						// Content should have reasonable reading width
						expect(contentBox.width).toBeGreaterThan(600);
						expect(contentBox.width).toBeLessThan(1200); // Not too wide for readability
					}
				}
			}
		});

		test('should have proper spacing between grid columns', async ({ page }) => {
			await page.setViewportSize({ width: 1920, height: 1080 });
			
			await page.goto('/');
			await page.waitForLoadState('networkidle');
			
			const blogPostLink = page.locator('a[href*="/blog/"], a[href*="/posts/"]').first();
			
			if (await blogPostLink.count() > 0) {
				await blogPostLink.click();
				await page.waitForLoadState('networkidle');
				await page.waitForTimeout(1000);
				
				// Check if desktop grid layout is visible
				const desktopGrid = page.locator('.lg\\:grid').first();
				if (await desktopGrid.count() > 0) {
					const isGridVisible = await desktopGrid.isVisible();
					expect(isGridVisible).toBeTruthy();
					
					// Check that mobile layout is hidden on desktop
					const mobileLayout = page.locator('.lg\\:hidden').first();
					if (await mobileLayout.count() > 0) {
						const isMobileHidden = await mobileLayout.isHidden();
						expect(isMobileHidden).toBeTruthy();
					}
					
					// Check basic layout structure exists
					const leftToc = page.locator('.lg\\:grid > aside').first();
					const mainContent = page.locator('.lg\\:grid > main');
					const rightSidebar = page.locator('.lg\\:grid > aside').last();
					
					expect(await leftToc.count()).toBeGreaterThan(0);
					expect(await mainContent.count()).toBeGreaterThan(0); 
					expect(await rightSidebar.count()).toBeGreaterThan(0);
				}
			}
		});

		test('should have readable content width', async ({ page }) => {
			const viewports = [
				{ width: 1366, height: 768 }, // Laptop
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
					await page.waitForTimeout(1000);
					
					const article = page.locator('article.prose').first();
					
					if (await article.count() > 0) {
						const articleBox = await article.boundingBox();
						
						if (articleBox) {
							// Adjust expectations based on viewport and layout
							const minWidth = viewport.width >= 1280 ? 300 : 250; // Lower for grid layout
							const maxWidth = viewport.width >= 1280 ? 800 : 600; // Reasonable max
							
							expect(articleBox.width).toBeGreaterThan(minWidth);
							expect(articleBox.width).toBeLessThan(maxWidth);
						}
					}
				}
			}
		});
	});

	test.describe('Mobile Layout', () => {
		test('should hide desktop TOC on mobile', async ({ page }) => {
			await page.setViewportSize({ width: 375, height: 667 });
			
			await page.goto('/');
			await page.waitForLoadState('networkidle');
			
			const blogPostLink = page.locator('a[href*="/blog/"], a[href*="/posts/"]').first();
			
			if (await blogPostLink.count() > 0) {
				await blogPostLink.click();
				await page.waitForLoadState('networkidle');
				
				// Desktop TOC should be hidden on mobile
				const desktopTocGrid = page.locator('.lg\\:grid');
				if (await desktopTocGrid.count() > 0) {
					await expect(desktopTocGrid.first()).not.toBeVisible();
				}
				
				// Mobile TOC toggle should be visible
				const mobileTocToggle = page.locator('#toc-toggle-mobile');
				if (await mobileTocToggle.count() > 0) {
					await expect(mobileTocToggle).toBeVisible();
				}
			}
		});

		test('should open mobile TOC correctly', async ({ page }) => {
			await page.setViewportSize({ width: 375, height: 667 });
			
			await page.goto('/');
			await page.waitForLoadState('networkidle');
			
			const blogPostLink = page.locator('a[href*="/blog/"], a[href*="/posts/"]').first();
			
			if (await blogPostLink.count() > 0) {
				await blogPostLink.click();
				await page.waitForLoadState('networkidle');
				await page.waitForTimeout(1000);
				
				const mobileTocToggle = page.locator('#toc-toggle-mobile');
				const mobileTocOverlay = page.locator('#toc-overlay-mobile');
				
				if (await mobileTocToggle.count() > 0 && await mobileTocOverlay.count() > 0) {
					// Initially overlay should be hidden
					const isInitiallyHidden = await mobileTocOverlay.evaluate(el => el.classList.contains('hidden'));
					expect(isInitiallyHidden).toBeTruthy();
					
					// Click to open using force to avoid interference from other elements
					await mobileTocToggle.click({ force: true });
					await page.waitForTimeout(1200);
					
					// Check if overlay is now visible
					const isNowVisible = await mobileTocOverlay.evaluate(el => !el.classList.contains('hidden'));
					expect(isNowVisible).toBeTruthy();
					
					// Close by clicking outside the overlay (backdrop click)
					await page.locator('#toc-overlay-mobile').click({ force: true });
					await page.waitForTimeout(1200);
					
					// Should be hidden again
					const isHiddenAgain = await mobileTocOverlay.evaluate(el => el.classList.contains('hidden'));
					expect(isHiddenAgain).toBeTruthy();
				}
			}
		});
	});

	test.describe('Responsive Breakpoints', () => {
		test('should switch layout correctly at LG breakpoint', async ({ page }) => {
			await page.goto('/');
			await page.waitForLoadState('networkidle');
			
			const blogPostLink = page.locator('a[href*="/blog/"], a[href*="/posts/"]').first();
			
			if (await blogPostLink.count() > 0) {
				await blogPostLink.click();
				await page.waitForLoadState('networkidle');
				
				// Test just below LG breakpoint (1023px)
				await page.setViewportSize({ width: 1023, height: 768 });
				await page.waitForTimeout(500);
				
				const mobileLayout = page.locator('.lg\\:hidden');
				await expect(mobileLayout.first()).toBeVisible();
				
				// Test at LG breakpoint (1024px) - laptop should show horizontal layout
				await page.setViewportSize({ width: 1024, height: 768 });
				await page.waitForTimeout(500);
				
				const desktopLayout = page.locator('.hidden.lg\\:grid, .hidden.lg\\:block');
				if (await desktopLayout.count() > 0) {
					await expect(desktopLayout.first()).toBeVisible();
				}
			}
		});
	});
});