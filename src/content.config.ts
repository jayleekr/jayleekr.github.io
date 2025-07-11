import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: ({ image }) => z.object({
		title: z.string(),
		description: z.string().optional(),
		// Transform string to Date object
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		heroImage: image().optional(),
		// Support for categories and tags from Jekyll
		categories: z.array(z.string()).optional().default([]),
		tags: z.array(z.string()).optional().default([]),
		// Support for draft posts
		draft: z.boolean().optional().default(false),
		// Additional Jekyll frontmatter fields
		author: z.string().optional(),
		excerpt: z.string().optional(),
		layout: z.string().optional(),
		// Language support for i18n
		lang: z.enum(['ko', 'en']).optional().default('ko'),
	}),
});

export const collections = { blog };
