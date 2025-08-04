// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import astroI18next from "astro-i18next";
// import remarkMermaid from 'remark-mermaid'; // Disabled due to Puppeteer sandbox issues in CI
// import compress from 'astro-compress'; // Temporarily disabled

// Security and performance configuration
const isDev = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

// https://astro.build/config
export default defineConfig({
	site: 'https://jayleekr.github.io',
	base: '/',
	
	// Security configuration
	security: {
		checkOrigin: true
	},
	
	integrations: [
		tailwind({
			applyBaseStyles: false, // We use our own global.css
		}),
		mdx(),
		sitemap({
			filter: (page) => {
				return !page.includes('/draft/') && 
				       !page.includes('/admin/') && 
				       !page.includes('?search=') &&
				       !page.includes('/test-results/') &&
				       !page.includes('/playwright-report/');
			},
			changefreq: 'weekly',
			lastmod: new Date(),
			i18n: {
				defaultLocale: 'en',
				locales: ['en', 'ko']
			}
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
		remarkPlugins: [], // remarkMermaid disabled for CI compatibility
		rehypePlugins: []
	},
	
	image: {
		service: { entrypoint: 'astro/assets/services/noop' },
		remotePatterns: [
			{
				protocol: 'https',
				hostname: '**.githubusercontent.com'
			},
			{
				protocol: 'https',
				hostname: 'images.unsplash.com'
			}
		]
	},
	
	build: {
		assets: 'assets',
		inlineStylesheets: 'auto',
		format: 'directory',
		split: true, // Enable code splitting for better performance
		assetsPrefix: isDev ? undefined : '/', // Use CDN prefix in production if needed
		concurrency: 4 // Optimize build performance
	},
	
	vite: {
		build: {
			cssMinify: isProduction,
			minify: isProduction ? 'esbuild' : false,
			sourcemap: isDev,
			target: 'es2020',
			// Optimize chunk splitting
			rollupOptions: {
				output: {
					manualChunks: {
						'vendor': ['astro'],
						'utils': ['date-fns', 'lodash']
					}
				}
			}
		},
		server: {
			fs: {
				allow: ['..'],
				strict: isProduction
			},
			host: isDev ? 'localhost' : false,
			port: 4321,
			strictPort: false
		},
		// Performance optimizations
		optimizeDeps: {
			include: ['astro', '@astrojs/mdx', '@astrojs/sitemap']
		},
		define: {
			'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
			'import.meta.env.BUILD_TIME': JSON.stringify(new Date().toISOString())
		}
	},
	
	// Output configuration for GitHub Pages
	output: 'static',
	adapter: undefined, // Static site, no adapter needed
	
	// Experimental features for performance
	experimental: {
		optimizeHoistedScript: true,
		contentCollectionCache: true
	}
});
