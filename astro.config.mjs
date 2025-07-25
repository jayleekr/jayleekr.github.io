// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import astroI18next from "astro-i18next";
// import remarkMermaid from 'remark-mermaid'; // Disabled due to Puppeteer sandbox issues in CI
// import compress from 'astro-compress'; // Temporarily disabled

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
			filter: (page) => {
				return !page.includes('/draft/') && 
				       !page.includes('/admin/') && 
				       !page.includes('?search=');
			},
			changefreq: 'weekly',
			lastmod: new Date()
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
		service: { entrypoint: 'astro/assets/services/noop' }
	},
	build: {
		assets: 'assets',
		inlineStylesheets: 'auto',
		format: 'directory'
	},
	vite: {
		build: {
			cssMinify: true,
		},
		server: {
			fs: {
				allow: ['..'],
			},
		}
	},
});
