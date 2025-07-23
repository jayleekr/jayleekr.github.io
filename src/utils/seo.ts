// SEO utility functions for better search engine optimization

import type { CollectionEntry } from 'astro:content';

/**
 * Generate optimized meta description
 */
export function generateMetaDescription(content: string, maxLength: number = 160): string {
  if (!content) return '';
  
  // Remove markdown formatting and HTML tags
  const cleanContent = content
    .replace(/#{1,6}\s+/g, '') // Remove markdown headers
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold formatting
    .replace(/\*(.*?)\*/g, '$1') // Remove italic formatting
    .replace(/`(.*?)`/g, '$1') // Remove inline code
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Replace links with text
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/\n+/g, ' ') // Replace newlines with spaces
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();

  if (cleanContent.length <= maxLength) {
    return cleanContent;
  }

  // Find the last complete sentence within the limit
  const truncated = cleanContent.substring(0, maxLength);
  const lastSentence = truncated.lastIndexOf('.');
  const lastQuestion = truncated.lastIndexOf('?');
  const lastExclamation = truncated.lastIndexOf('!');
  
  const lastPunctuation = Math.max(lastSentence, lastQuestion, lastExclamation);
  
  if (lastPunctuation > maxLength * 0.7) {
    return cleanContent.substring(0, lastPunctuation + 1);
  }

  // Fall back to word boundary
  const lastSpace = truncated.lastIndexOf(' ');
  if (lastSpace > maxLength * 0.8) {
    return cleanContent.substring(0, lastSpace) + '...';
  }

  return truncated + '...';
}

/**
 * Extract and optimize keywords from content
 */
export function extractKeywords(content: string, tags: string[] = [], maxKeywords: number = 10): string[] {
  const commonWords = new Set([
    'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have',
    'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
    '은', '는', '이', '가', '을', '를', '의', '에', '와', '과', '으로', '로',
    '하다', '있다', '되다', '그', '이', '그것', '것', '수', '때', '등'
  ]);

  // Clean and tokenize content
  const words = content
    .toLowerCase()
    .replace(/[^\w\s가-힣]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !commonWords.has(word));

  // Count word frequency
  const wordCount = new Map<string, number>();
  words.forEach(word => {
    wordCount.set(word, (wordCount.get(word) || 0) + 1);
  });

  // Sort by frequency and take top words
  const topWords = Array.from(wordCount.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxKeywords - tags.length)
    .map(([word]) => word);

  // Combine with provided tags
  return [...tags, ...topWords].slice(0, maxKeywords);
}

/**
 * Generate structured data for blog posts
 */
export function generateBlogPostStructuredData(post: CollectionEntry<'blog'>, siteUrl: string) {
  const postUrl = `${siteUrl}/blog/${post.id}/`;
  const imageUrl = post.data.heroImage 
    ? `${siteUrl}${typeof post.data.heroImage === 'string' ? post.data.heroImage : post.data.heroImage.src}`
    : `${siteUrl}/assets/default-blog-image.jpg`;

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl
    },
    headline: post.data.title,
    description: post.data.description || generateMetaDescription(post.body || ''),
    image: {
      '@type': 'ImageObject',
      url: imageUrl,
      width: 1200,
      height: 630
    },
    author: {
      '@type': 'Person',
      name: 'Jay Lee',
      url: siteUrl,
      jobTitle: 'Software Engineer',
      worksFor: {
        '@type': 'Organization',
        name: 'Sonatus'
      },
      sameAs: [
        'https://github.com/jayleekr',
        'https://linkedin.com/in/jayleekr'
      ]
    },
    publisher: {
      '@type': 'Organization',
      name: 'Jay Lee Blog',
      url: siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/favicon.svg`,
        width: 32,
        height: 32
      }
    },
    datePublished: post.data.pubDate.toISOString(),
    dateModified: post.data.updatedDate?.toISOString() || post.data.pubDate.toISOString(),
    keywords: (post.data.tags || []).join(', '),
    articleSection: post.data.categories?.[0] || 'Technology',
    inLanguage: 'ko-KR',
    wordCount: post.body ? post.body.split(/\s+/).length : 0,
    timeRequired: `PT${Math.max(1, Math.ceil((post.body?.split(/\s+/).length || 0) / 200))}M`,
    audience: {
      '@type': 'Audience',
      audienceType: 'Software Developers'
    }
  };
}

/**
 * Generate Open Graph image URL
 */
export function generateOGImageUrl(title: string, description?: string): string {
  // Build query string manually to avoid URLSearchParams dependency
  const encodedTitle = encodeURIComponent(title);
  let queryString = `title=${encodedTitle}`;
  
  if (description) {
    const encodedDesc = encodeURIComponent(description.substring(0, 100));
    queryString += `&description=${encodedDesc}`;
  }
  
  // This would be used with a service like Vercel OG or similar
  // For now, return a placeholder
  return `/api/og?${queryString}`;
}

/**
 * Calculate reading time with language awareness
 */
export function calculateSEOReadingTime(content: string, language: 'ko' | 'en' = 'ko'): {
  minutes: number;
  words: number;
  iso8601Duration: string;
} {
  const wordsPerMinute = language === 'ko' ? 200 : 250;
  const words = content.split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / wordsPerMinute));
  
  return {
    minutes,
    words,
    iso8601Duration: `PT${minutes}M`
  };
}

/**
 * Generate canonical URL
 */
export function generateCanonicalUrl(path: string, baseUrl: string): string {
  // Remove trailing slashes and ensure proper format
  const cleanPath = path.replace(/\/+$/, '') || '/';
  const cleanBase = baseUrl.replace(/\/+$/, '');
  
  return `${cleanBase}${cleanPath}`;
}

/**
 * Validate and optimize URL structure
 */
export function optimizeUrlStructure(slug: string): string {
  return slug
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s-]/g, '') // Remove special chars except Korean
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Remove duplicate hyphens
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Generate breadcrumb structured data
 */
export function generateBreadcrumbStructuredData(path: string, siteUrl: string) {
  const segments = path.split('/').filter(Boolean);
  const breadcrumbs = [
    { name: 'Home', url: siteUrl }
  ];

  let currentPath = '';
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    
    // Capitalize and format segment name
    const name = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
    
    if (index === segments.length - 1) {
      // Last item (current page) doesn't need URL
      breadcrumbs.push({ name, url: '' });
    } else {
      breadcrumbs.push({ name, url: `${siteUrl}${currentPath}` });
    }
  });

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      ...(crumb.url && { item: crumb.url })
    }))
  };
}