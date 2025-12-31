import { Client } from '@notionhq/client';
import { NotionToMarkdown } from 'notion-to-md';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * NotionConverter - Convert Notion pages to blog posts
 */
export class NotionConverter {
  constructor(apiKey, databaseId) {
    this.notion = new Client({ auth: apiKey });
    this.n2m = new NotionToMarkdown({ notionClient: this.notion });
    this.databaseId = databaseId;
  }

  /**
   * Fetch new posts from Notion database
   * @param {Date} since - Fetch posts created/modified after this date
   * @returns {Promise<Array>} Array of Notion pages
   */
  async fetchNewPosts(since = null) {
    try {
      const filter = {
        and: [
          {
            property: 'Status',
            status: {
              equals: 'Ready to Publish'
            }
          }
        ]
      };

      // Add date filter if provided
      if (since) {
        filter.and.push({
          property: 'Last edited time',
          date: {
            after: since.toISOString()
          }
        });
      }

      const response = await this.notion.databases.query({
        database_id: this.databaseId,
        filter
      });

      return response.results;
    } catch (error) {
      console.error('Error fetching Notion posts:', error);
      throw error;
    }
  }

  /**
   * Convert Notion page to blog post
   * @param {Object} page - Notion page object
   * @returns {Promise<Object>} Blog post data { frontmatter, content, metadata }
   */
  async convertPage(page) {
    try {
      // Extract frontmatter from Notion properties
      const frontmatter = this.extractFrontmatter(page);

      // Get page content as markdown
      const mdblocks = await this.n2m.pageToMarkdown(page.id);
      let content = this.n2m.toMarkdownString(mdblocks).parent;

      // Add semantic headers
      content = this.addSemanticHeaders(content);

      // Process images
      const processedContent = await this.processImages(
        content,
        frontmatter.slug
      );

      return {
        frontmatter,
        content: processedContent,
        metadata: {
          notionId: page.id,
          createdTime: page.created_time,
          lastEditedTime: page.last_edited_time
        }
      };
    } catch (error) {
      console.error(`Error converting page ${page.id}:`, error);
      throw error;
    }
  }

  /**
   * Extract frontmatter from Notion properties
   * @param {Object} page - Notion page object
   * @returns {Object} Frontmatter data
   */
  extractFrontmatter(page) {
    const props = page.properties;

    // Get title
    const title = props.Title?.title?.[0]?.plain_text || 'Untitled';

    // Generate slug
    const slug = this.generateSlug(title);

    // Get publication date
    const pubDate = props.PublishDate?.date?.start
      || page.created_time;

    // Get categories
    const categories = props.Categories?.multi_select?.map(c => c.name) || [];

    // Get tags
    const tags = props.Tags?.multi_select?.map(t => t.name) || [];

    // Get description
    const description = props.Description?.rich_text?.[0]?.plain_text
      || this.generateDescription(title);

    // Get author
    const author = props.Author?.rich_text?.[0]?.plain_text
      || process.env.NOTION_AUTHOR
      || 'Jay Lee';

    return {
      title,
      author,
      pubDate: new Date(pubDate).toISOString(),
      categories,
      tags,
      description,
      slug
    };
  }

  /**
   * Generate URL-friendly slug
   * @param {string} title - Post title
   * @returns {string} URL slug
   */
  generateSlug(title) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9가-힣\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  /**
   * Generate description from title
   * @param {string} title - Post title
   * @returns {string} Description
   */
  generateDescription(title) {
    return `${title} - Blog post by Jay Lee`;
  }

  /**
   * Add semantic H2/H3 headers to content
   * @param {string} content - Markdown content
   * @returns {string} Content with semantic headers
   */
  addSemanticHeaders(content) {
    // Split content into sections
    const lines = content.split('\n');
    const processed = [];

    let inCodeBlock = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Track code blocks
      if (line.startsWith('```')) {
        inCodeBlock = !inCodeBlock;
      }

      // Don't modify lines in code blocks
      if (inCodeBlock) {
        processed.push(line);
        continue;
      }

      // Convert Notion H1 to H2
      if (line.startsWith('# ')) {
        processed.push('##' + line.substring(1));
      }
      // Convert Notion H2 to H3
      else if (line.startsWith('## ')) {
        processed.push('###' + line.substring(2));
      }
      else {
        processed.push(line);
      }
    }

    return processed.join('\n');
  }

  /**
   * Process images in content
   * @param {string} content - Markdown content
   * @param {string} slug - Post slug
   * @returns {Promise<string>} Processed content
   */
  async processImages(content, slug) {
    const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
    const images = [];
    let match;

    // Find all images
    while ((match = imageRegex.exec(content)) !== null) {
      images.push({
        alt: match[1],
        url: match[2],
        original: match[0]
      });
    }

    // Process each image
    let processedContent = content;
    for (let i = 0; i < images.length; i++) {
      const image = images[i];

      // Skip if already local
      if (!image.url.startsWith('http')) {
        continue;
      }

      try {
        // Download and save image
        const imageDir = path.join(
          process.cwd(),
          'public',
          'blog-images',
          slug
        );

        await fs.mkdir(imageDir, { recursive: true });

        const ext = path.extname(new URL(image.url).pathname) || '.jpg';
        const filename = `image-${i + 1}${ext}`;
        const imagePath = path.join(imageDir, filename);

        // Download image
        const response = await fetch(image.url);
        const buffer = await response.arrayBuffer();
        await fs.writeFile(imagePath, Buffer.from(buffer));

        // Update content with local path
        const localPath = `/blog-images/${slug}/${filename}`;
        processedContent = processedContent.replace(
          image.original,
          `![${image.alt}](${localPath})`
        );

        console.log(`✅ Downloaded image: ${filename}`);
      } catch (error) {
        console.error(`❌ Failed to download image ${i + 1}:`, error.message);
        // Keep original URL as fallback
      }
    }

    return processedContent;
  }

  /**
   * Determine target directory based on categories
   * @param {Array<string>} categories - Post categories
   * @returns {string} Target directory path
   */
  getTargetDirectory(categories) {
    const baseDir = 'src/content/blog';

    if (categories.includes('AI')) {
      return path.join(baseDir, 'DeepThinking', 'AI');
    } else if (categories.includes('Daily')) {
      return path.join(baseDir, 'DeepThinking', 'Daily');
    } else if (categories.includes('Tech')) {
      return path.join(baseDir, 'Tech');
    } else {
      return path.join(baseDir, 'DeepThinking', 'Daily');
    }
  }

  /**
   * Generate filename for blog post
   * @param {Object} frontmatter - Frontmatter data
   * @returns {string} Filename
   */
  generateFilename(frontmatter) {
    const date = new Date(frontmatter.pubDate);
    const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
    return `${dateStr}-${frontmatter.slug}.mdx`;
  }

  /**
   * Save blog post to file
   * @param {Object} post - Blog post data { frontmatter, content, metadata }
   * @returns {Promise<string>} File path
   */
  async saveBlogPost(post) {
    const { frontmatter, content } = post;

    // Determine target directory
    const targetDir = this.getTargetDirectory(frontmatter.categories);
    const fullPath = path.join(process.cwd(), targetDir);

    // Ensure directory exists
    await fs.mkdir(fullPath, { recursive: true });

    // Generate filename
    const filename = this.generateFilename(frontmatter);
    const filepath = path.join(fullPath, filename);

    // Check if file already exists
    try {
      await fs.access(filepath);
      console.log(`⚠️  File already exists: ${filename}`);
      return null;
    } catch {
      // File doesn't exist, proceed
    }

    // Build full content with frontmatter
    const fullContent = this.buildFullContent(frontmatter, content);

    // Save file
    await fs.writeFile(filepath, fullContent, 'utf-8');

    console.log(`✅ Saved: ${filename}`);
    return filepath;
  }

  /**
   * Build full content with frontmatter
   * @param {Object} frontmatter - Frontmatter data
   * @param {string} content - Markdown content
   * @returns {string} Full MDX content
   */
  buildFullContent(frontmatter, content) {
    const yaml = `---
title: "${frontmatter.title}"
author: "${frontmatter.author}"
pubDate: ${frontmatter.pubDate}
categories: [${frontmatter.categories.map(c => `"${c}"`).join(', ')}]
tags: [${frontmatter.tags.map(t => `"${t}"`).join(', ')}]
description: "${frontmatter.description}"
---

${content}`;

    return yaml;
  }
}
