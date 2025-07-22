import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE_TITLE, SITE_DESCRIPTION } from '../../consts';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  
  // Get all unique categories
  const categories = [...new Set(posts.flatMap(post => post.data.categories || []))];
  
  return categories.map(category => ({
    params: { category: category.toLowerCase().replace(/\s+/g, '-') },
    props: { category }
  }));
}

export async function GET(context) {
  const { category } = context.props;
  const posts = await getCollection('blog');
  
  // Filter posts by category and only include published posts
  const categoryPosts = posts
    .filter(post => 
      !post.data.draft && 
      (post.data.categories || []).includes(category)
    )
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  return rss({
    title: `${SITE_TITLE} - ${category} Posts`,
    description: `${SITE_DESCRIPTION} - ${category} 카테고리의 글들`,
    site: context.site,
    language: 'ko-KR',
    customData: `
      <language>ko-KR</language>
      <managingEditor>jayleekr0125@gmail.com (Jay Lee)</managingEditor>
      <webMaster>jayleekr0125@gmail.com (Jay Lee)</webMaster>
      <category>${category}</category>
      <ttl>60</ttl>
    `,
    items: categoryPosts.map((post) => ({
      title: post.data.title,
      description: post.data.description || `${category} 관련 기술 블로그 포스트`,
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
        <source url="${context.site}rss/${category.toLowerCase().replace(/\s+/g, '-')}.xml">${SITE_TITLE} - ${category}</source>
      `,
    })),
    stylesheet: '/rss-styles.xsl',
  });
}