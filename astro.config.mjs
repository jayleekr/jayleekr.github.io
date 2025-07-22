// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import astroI18next from "astro-i18next";
import compress from 'astro-compress';

// https://astro.build/config
export default defineConfig({
	site: 'https://jayleekr.github.io',
	base: '/',
	integrations: [
		tailwind({
			applyBaseStyles: false, // We use our own global.css
		}),
		mdx(),
		sitemap({
			// Enhanced sitemap configuration for better SEO
			filter: (page) => {
				// Exclude draft pages, admin areas, and search results
				return !page.includes('/draft/') && 
				       !page.includes('/admin/') && 
				       !page.includes('?search=') &&
				       !page.includes('/test/');
			},
			changefreq: 'weekly',
			priority: (page) => {
				// Dynamic priority based on page type
				if (page === 'https://jayleekr.github.io/') return 1.0; // Homepage
				if (page.includes('/blog/')) return 0.8; // Blog posts
				if (page.includes('/about')) return 0.9; // About page
				if (page.includes('/categories')) return 0.6; // Category pages
				return 0.7; // Default priority
			},
			lastmod: new Date(),
			i18n: {
				defaultLocale: 'ko',
				locales: {
					ko: 'ko-KR',
					en: 'en-US'
				}
			},
			customPages: [
				'https://jayleekr.github.io/rss.xml',
				'https://jayleekr.github.io/rss/en.xml'
			]
		}),
		astroI18next()
	],
	markdown: {
		syntaxHighlight: 'shiki',
		shikiConfig: {
			theme: 'one-dark-pro',
			themes: {
				light: 'one-light',
				dark: 'one-dark-pro'
			},
			wrap: true
		},
		remarkPlugins: [],
		rehypePlugins: []
	},
	image: {
		service: { entrypoint: 'astro/assets/services/noop' }
	},
	build: {
		assets: 'assets',
		inlineStylesheets: 'auto',
		assetsPrefix: '/',
		// Enhanced build optimizations
		split: true,
		format: 'esm'
	},
	vite: {
		build: {
			cssMinify: true,
			minify: 'terser',
			terserOptions: {
				compress: {
					drop_console: true,
					drop_debugger: true
				}
			},
			rollupOptions: {
				output: {
					manualChunks: (id) => {
						// More intelligent code splitting
						if (id.includes('node_modules')) {
							return 'vendor';
						}
						if (id.includes('/src/components/')) {
							return 'components';
						}
						if (id.includes('/src/utils/')) {
							return 'utils';
						}
						if (id.includes('search') || id.includes('Search')) {
							return 'search';
						}
						return 'main';
					}
				}
			}
		},
		server: {
			// Development server optimizations
			fs: {
				allow: ['..'],
			},
		},
		optimizeDeps: {
			// Pre-bundle dependencies
			include: ['astro', '@astrojs/tailwind'],
		},
		ssr: {
			noExternal: ['@astrojs/prism']
		}
	},
});
