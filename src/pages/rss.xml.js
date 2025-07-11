import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts';

export async function GET(context) {
	const posts = await getCollection('blog');
	
	// Sort posts by date and only include published posts
	const publishedPosts = posts
		.filter(post => !post.data.draft)
		.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

	return rss({
		title: `${SITE_TITLE} - Tech Blog`,
		description: SITE_DESCRIPTION,
		site: context.site,
		language: 'ko-KR',
		customData: `
			<language>ko-KR</language>
			<managingEditor>jayleekr0125@gmail.com (Jay Lee)</managingEditor>
			<webMaster>jayleekr0125@gmail.com (Jay Lee)</webMaster>
			<category>Technology</category>
			<category>Software Development</category>
			<category>DevOps</category>
			<ttl>60</ttl>
		`,
		items: publishedPosts.map((post) => ({
			title: post.data.title,
			description: post.data.description || '기술 블로그 포스트',
			link: `/blog/${post.id}/`,
			pubDate: post.data.pubDate,
			categories: [
				...(post.data.categories || []),
				...(post.data.tags || [])
			],
			author: 'jayleekr0125@gmail.com (Jay Lee)',
			guid: `/blog/${post.id}/`,
			customData: `
				${post.data.heroImage ? `<enclosure url="${post.data.heroImage}" type="image/jpeg" />` : ''}
				<source url="${context.site}rss.xml">${SITE_TITLE} - Tech Blog</source>
			`,
		})),
		stylesheet: '/rss-styles.xsl',
	});
}
