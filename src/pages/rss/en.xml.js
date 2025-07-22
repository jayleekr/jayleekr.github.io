import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE_TITLE, SITE_DESCRIPTION } from '../../consts';

export async function GET(context) {
  const posts = await getCollection('blog');
  
  // Filter for English posts and only include published posts
  const englishPosts = posts
    .filter(post => !post.data.draft && post.data.lang === 'en')
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  return rss({
    title: `${SITE_TITLE} - English Tech Blog`,
    description: 'English tech blog posts about software development, DevOps, and technology insights',
    site: context.site,
    language: 'en-US',
    customData: `
      <language>en-US</language>
      <managingEditor>jayleekr0125@gmail.com (Jay Lee)</managingEditor>
      <webMaster>jayleekr0125@gmail.com (Jay Lee)</webMaster>
      <category>Technology</category>
      <category>Software Development</category>
      <category>DevOps</category>
      <ttl>60</ttl>
    `,
    items: englishPosts.map((post) => ({
      title: post.data.title,
      description: post.data.description || 'Tech blog post',
      link: `/en/blog/${post.id}/`,
      pubDate: post.data.pubDate,
      categories: [
        ...(post.data.categories || []),
        ...(post.data.tags || [])
      ],
      author: 'jayleekr0125@gmail.com (Jay Lee)',
      guid: `/en/blog/${post.id}/`,
      customData: `
        ${post.data.heroImage ? `<enclosure url="${post.data.heroImage}" type="image/jpeg" />` : ''}
        <source url="${context.site}rss/en.xml">${SITE_TITLE} - English Tech Blog</source>
      `,
    })),
    stylesheet: '/rss-styles.xsl',
  });
}