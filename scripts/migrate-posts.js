#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BACKUP_DIR = path.join(__dirname, '..', 'backup', 'posts', '_posts');
const OUTPUT_DIR = path.join(__dirname, '..', 'src', 'content', 'blog');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function convertFrontMatter(content) {
  const frontMatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  
  if (!frontMatterMatch) {
    return content;
  }

  const [, frontMatter, bodyContent] = frontMatterMatch;
  const lines = frontMatter.split('\n');
  const newFrontMatter = {};

  lines.forEach(line => {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length > 0) {
      const value = valueParts.join(':').trim();
      
      // Convert common Jekyll fields to Astro format
      switch (key.trim()) {
        case 'title':
          newFrontMatter.title = value.replace(/['"]/g, '');
          break;
        case 'date':
          // Normalize date format - remove timezone info that might be malformed
          let dateValue = value.replace(/['"]/g, '');
          // Remove malformed timezone like +08007, keep basic date
          dateValue = dateValue.replace(/\s+[\+\-]\d{4,}.*$/, '');
          // If it's just a date, add time
          if (dateValue.match(/^\d{4}-\d{2}-\d{2}$/)) {
            dateValue += ' 00:00:00';
          }
          newFrontMatter.pubDate = dateValue;
          break;
        case 'categories':
          // Convert categories array or space-separated string
          if (value.startsWith('[') && value.endsWith(']')) {
            // Parse YAML array format like [Collaboration, ToyProjects]
            const arrayContent = value.slice(1, -1).trim();
            newFrontMatter.categories = arrayContent.split(',').map(item => item.trim());
          } else {
            newFrontMatter.categories = value.split(' ').filter(Boolean);
          }
          break;
        case 'tags':
          // Convert tags array or space-separated string
          if (value.startsWith('[') && value.endsWith(']')) {
            // Parse YAML array format
            const arrayContent = value.slice(1, -1).trim();
            newFrontMatter.tags = arrayContent.split(',').map(item => item.trim());
          } else {
            newFrontMatter.tags = value.split(' ').filter(Boolean);
          }
          break;
        case 'description':
        case 'excerpt':
          newFrontMatter.description = value.replace(/['"]/g, '');
          break;
        case 'image':
        case 'cover':
          newFrontMatter.heroImage = value.replace(/['"]/g, '');
          break;
        default:
          // Keep other fields as-is
          newFrontMatter[key.trim()] = value.replace(/['"]/g, '');
      }
    }
  });

  // Add default values for Astro
  if (!newFrontMatter.pubDate && newFrontMatter.date) {
    newFrontMatter.pubDate = newFrontMatter.date;
  }
  
  // Convert to YAML frontmatter
  const yamlFrontMatter = Object.entries(newFrontMatter)
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return `${key}: [${value.map(v => `"${v}"`).join(', ')}]`;
      }
      return `${key}: "${value}"`;
    })
    .join('\n');

  return `---\n${yamlFrontMatter}\n---\n\n${bodyContent}`;
}

function processMarkdownFiles(dir, outputDir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Create corresponding output directory
      const newOutputDir = path.join(outputDir, file);
      if (!fs.existsSync(newOutputDir)) {
        fs.mkdirSync(newOutputDir, { recursive: true });
      }
      processMarkdownFiles(filePath, newOutputDir);
    } else if (file.endsWith('.md')) {
      // Process markdown file
      const content = fs.readFileSync(filePath, 'utf8');
      const convertedContent = convertFrontMatter(content);
      
      // Change extension to .mdx
      const outputFileName = file.replace('.md', '.mdx');
      const outputFilePath = path.join(outputDir, outputFileName);
      
      fs.writeFileSync(outputFilePath, convertedContent);
      console.log(`Converted: ${filePath} -> ${outputFilePath}`);
    }
  });
}

function main() {
  if (!fs.existsSync(BACKUP_DIR)) {
    console.error(`Backup directory not found: ${BACKUP_DIR}`);
    process.exit(1);
  }

  console.log('Starting Jekyll to Astro MDX migration...');
  console.log(`Source: ${BACKUP_DIR}`);
  console.log(`Output: ${OUTPUT_DIR}`);
  
  processMarkdownFiles(BACKUP_DIR, OUTPUT_DIR);
  
  console.log('\nMigration completed!');
  console.log('Next steps:');
  console.log('1. Review converted files in src/content/blog/');
  console.log('2. Update image paths if needed');
  console.log('3. Test the site with: npm run dev');
}

main();