// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
	site: 'https://jayleekr.github.io',

	integrations: [
		tailwind({
			applyBaseStyles: false,
		}),
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
