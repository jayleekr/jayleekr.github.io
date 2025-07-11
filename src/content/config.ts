import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
	type: 'content',
	schema: z.object({
		title: z.string(),
		author: z.string().optional(),
		description: z.string().optional(),
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		heroImage: z.string().optional(),
		categories: z.array(z.string()).optional(),
		tags: z.array(z.string()).optional(),
		draft: z.boolean().default(false),
		excerpt: z.string().optional(),
		layout: z.string().optional(),
		permalink: z.string().optional(),
		lang: z.enum(['ko', 'en']).default('ko'),
	}),
});

export const collections = { blog };