import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts';
import { getReadingTimeFromMarkdown } from '../utils/readingTime';

export async function GET(context) {
	const posts = await getCollection('blog');
	
	// Sort posts by date and only include published posts
	const publishedPosts = posts
		.filter(post => !post.data.draft)
		.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
		.slice(0, 20); // Limit to latest 20 posts for performance

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
			<category>Startup</category>
			<category>Career</category>
			<ttl>60</ttl>
			<image>
				<url>${context.site}favicon.svg</url>
				<title>${SITE_TITLE}</title>
				<link>${context.site}</link>
			</image>
		`,
		items: publishedPosts.map((post) => {
			const readingTime = getReadingTimeFromMarkdown(post.body || '', 'ko');
			const content = post.data.description || post.body?.substring(0, 300) + '...' || '기술 블로그 포스트';
			
			return {
				title: post.data.title,
				description: content,
				content: `
					<p>${post.data.description || ''}</p>
					${post.data.heroImage ? `<img src="${post.data.heroImage}" alt="${post.data.title}" style="max-width:100%; height:auto;">` : ''}
					<p><strong>예상 읽기 시간:</strong> ${readingTime.minutes}분</p>
					<p><strong>카테고리:</strong> ${(post.data.categories || []).join(', ')}</p>
					<p><a href="${context.site}blog/${post.id}/">전체 글 읽기 →</a></p>
				`,
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
					<readingTime>${readingTime.minutes}</readingTime>
				`,
			};
		}),
		stylesheet: '/rss-styles.xsl',
	});
}
