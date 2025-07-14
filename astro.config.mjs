// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import astroI18next from "astro-i18next";

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
			filter: (page) => !page.includes('/draft/'),
			changefreq: 'weekly',
			priority: 0.7,
			lastmod: new Date(),
			i18n: {
				defaultLocale: 'ko',
				locales: {
					ko: 'ko-KR',
					en: 'en-US'
				}
			}
		}),
		astroI18next()
	],
	markdown: {
		syntaxHighlight: 'prism',
		remarkPlugins: [],
		rehypePlugins: []
	},
	image: {
		service: { entrypoint: 'astro/assets/services/noop' }
	},
	build: {
		assets: 'assets',
		inlineStylesheets: 'auto',
		assetsPrefix: '/'
	},
	vite: {
		build: {
			cssMinify: true,
			rollupOptions: {
				output: {
					manualChunks: {
						'vendor': ['astro'],
						'utils': ['./src/utils/formatDate.ts']
					}
				}
			}
		},
		ssr: {
			noExternal: ['@astrojs/prism']
		}
	},
});
