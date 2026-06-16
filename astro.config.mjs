// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
	site: 'https://jayleekr.github.io',

	integrations: [
		mdx(),
		sitemap({
			changefreq: 'weekly',
			lastmod: new Date(),
		}),
	],

	markdown: {
		syntaxHighlight: 'shiki',
		shikiConfig: {
			theme: 'github-dark-dimmed',
			wrap: true
		},
	},

	output: 'static',
});
