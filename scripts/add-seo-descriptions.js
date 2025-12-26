import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

const postsPattern = 'src/content/blog/**/*.mdx';

async function extractDescription(body) {
  // Remove code blocks first to avoid extracting code as description
  const withoutCode = body.replace(/```[\s\S]*?```/g, '');

  // Remove inline code
  const withoutInlineCode = withoutCode.replace(/`[^`]+`/g, '');

  // Extract sentences (Korean and English)
  const sentences = withoutInlineCode.match(/[^.!?。]+[.!?。]+/g) || [];

  // Take first 2-3 sentences, but keep it under 160 characters for SEO
  let description = '';
  for (const sentence of sentences) {
    const trimmed = sentence.trim();
    if (description.length + trimmed.length <= 160) {
      description += (description ? ' ' : '') + trimmed;
    } else {
      break;
    }
  }

  // If no good description found, take first paragraph
  if (!description || description.length < 50) {
    const firstParagraph = withoutInlineCode.split('\n\n')[0];
    description = firstParagraph.substring(0, 160).trim();
  }

  return description;
}

async function addDescriptions() {
  const posts = await glob(postsPattern);
  let updated = 0;
  let skipped = 0;
  let errors = 0;

  console.log('📝 Starting SEO description generation...\n');
  console.log(`Found ${posts.length} blog posts\n`);

  for (const postPath of posts) {
    try {
      const content = fs.readFileSync(postPath, 'utf8');
      const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);

      if (!match) {
        console.log(`⚠️  Skipped (no frontmatter): ${path.basename(postPath)}`);
        skipped++;
        continue;
      }

      const [, frontmatter, body] = match;

      // Skip if description already exists
      if (frontmatter.includes('description:')) {
        console.log(`⏭️  Skipped (has description): ${path.basename(postPath)}`);
        skipped++;
        continue;
      }

      // Extract description from body
      const description = await extractDescription(body);

      if (!description || description.length < 20) {
        console.log(`⚠️  Skipped (no valid description): ${path.basename(postPath)}`);
        skipped++;
        continue;
      }

      // Add description to frontmatter
      // Escape quotes in description
      const escapedDescription = description.replace(/"/g, '\\"');
      const newFrontmatter = frontmatter + `\ndescription: "${escapedDescription}"`;
      const newContent = `---\n${newFrontmatter}\n---\n${body}`;

      // Write updated content
      fs.writeFileSync(postPath, newContent, 'utf8');

      console.log(`✅ Added: ${path.basename(postPath)}`);
      console.log(`   "${description.substring(0, 80)}${description.length > 80 ? '...' : ''}"\n`);
      updated++;

    } catch (error) {
      console.error(`❌ Error processing ${path.basename(postPath)}:`, error.message);
      errors++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 Summary:');
  console.log(`   ✅ Updated: ${updated} posts`);
  console.log(`   ⏭️  Skipped: ${skipped} posts (already have descriptions or no frontmatter)`);
  console.log(`   ❌ Errors: ${errors} posts`);
  console.log('='.repeat(60));
}

// Run the script
addDescriptions().catch(console.error);
