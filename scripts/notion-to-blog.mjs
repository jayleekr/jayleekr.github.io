#!/usr/bin/env node

import 'dotenv/config';
import { NotionConverter } from './lib/notion-converter.mjs';
import { execSync } from 'child_process';
import fs from 'fs/promises';
import path from 'path';

const STATE_FILE = '.claude/notion-sync-state.json';

/**
 * Main sync function
 */
async function syncNotionToBlog() {
  console.log('🚀 Starting Notion to Blog sync...\n');

  // Validate environment variables
  const apiKey = process.env.NOTION_API_KEY;
  const databaseId = process.env.NOTION_DATABASE_ID;

  if (!apiKey || !databaseId) {
    console.error('❌ Missing required environment variables:');
    console.error('   - NOTION_API_KEY');
    console.error('   - NOTION_DATABASE_ID');
    console.error('\nPlease create a .env file with these variables.');
    process.exit(1);
  }

  try {
    // Initialize converter
    const converter = new NotionConverter(apiKey, databaseId);

    // Load last sync state
    const lastSync = await loadSyncState();
    console.log(`📅 Last sync: ${lastSync ? lastSync.toISOString() : 'Never'}\n`);

    // Fetch new posts
    console.log('🔍 Fetching new posts from Notion...');
    const pages = await converter.fetchNewPosts(lastSync);
    console.log(`   Found ${pages.length} post(s)\n`);

    if (pages.length === 0) {
      console.log('✅ No new posts to sync');
      return;
    }

    // Create feature branch
    const branchName = `notion-sync/${new Date().toISOString().split('T')[0]}`;
    try {
      execSync(`git checkout -b ${branchName}`, { stdio: 'inherit' });
    } catch (error) {
      // Branch might already exist
      execSync(`git checkout ${branchName}`, { stdio: 'inherit' });
    }

    // Process each post
    const results = {
      success: [],
      skipped: [],
      failed: []
    };

    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      const pageTitle = page.properties.Title?.title?.[0]?.plain_text || 'Untitled';

      console.log(`\n📝 Processing (${i + 1}/${pages.length}): ${pageTitle}`);

      try {
        // Convert page to blog post
        const post = await converter.convertPage(page);

        // Save blog post
        const filepath = await converter.saveBlogPost(post);

        if (filepath) {
          // Commit the new post
          execSync(`git add ${filepath}`, { stdio: 'inherit' });
          execSync(
            `git commit -m "feat: Add post \\"${post.frontmatter.title}\\" from Notion"`,
            { stdio: 'inherit' }
          );

          results.success.push({
            title: pageTitle,
            file: filepath
          });
        } else {
          results.skipped.push({
            title: pageTitle,
            reason: 'File already exists'
          });
        }
      } catch (error) {
        console.error(`❌ Failed to process "${pageTitle}":`, error.message);
        results.failed.push({
          title: pageTitle,
          error: error.message
        });
      }
    }

    // Print summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 SYNC SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Successfully synced: ${results.success.length}`);
    console.log(`⏭️  Skipped: ${results.skipped.length}`);
    console.log(`❌ Failed: ${results.failed.length}`);

    if (results.success.length > 0) {
      console.log('\n✅ Successfully synced posts:');
      results.success.forEach(r => {
        console.log(`   - ${r.title}`);
        console.log(`     ${r.file}`);
      });
    }

    if (results.skipped.length > 0) {
      console.log('\n⏭️  Skipped posts:');
      results.skipped.forEach(r => {
        console.log(`   - ${r.title} (${r.reason})`);
      });
    }

    if (results.failed.length > 0) {
      console.log('\n❌ Failed posts:');
      results.failed.forEach(r => {
        console.log(`   - ${r.title}`);
        console.log(`     Error: ${r.error}`);
      });
    }

    // Push to remote and create PR if we have commits
    if (results.success.length > 0) {
      console.log('\n📤 Pushing to remote...');
      execSync(`git push -u origin ${branchName}`, { stdio: 'inherit' });

      console.log('\n🔗 Creating pull request...');
      const prTitle = `Notion sync: ${results.success.length} new post(s)`;
      const prBody = generatePRBody(results);

      try {
        const prUrl = execSync(
          `gh pr create --title "${prTitle}" --body "${prBody}"`,
          { encoding: 'utf-8' }
        ).trim();

        console.log(`\n✅ Pull request created: ${prUrl}`);
      } catch (error) {
        console.log('\n⚠️  Could not create PR automatically.');
        console.log('   Please create PR manually from GitHub.');
      }
    }

    // Update sync state
    await saveSyncState(new Date());
    console.log('\n✅ Sync completed successfully!');

  } catch (error) {
    console.error('\n❌ Sync failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

/**
 * Load last sync timestamp
 */
async function loadSyncState() {
  try {
    const data = await fs.readFile(STATE_FILE, 'utf-8');
    const state = JSON.parse(data);
    return new Date(state.lastSync);
  } catch {
    return null;
  }
}

/**
 * Save sync timestamp
 */
async function saveSyncState(timestamp) {
  const state = {
    lastSync: timestamp.toISOString(),
    updatedAt: new Date().toISOString()
  };

  await fs.mkdir(path.dirname(STATE_FILE), { recursive: true });
  await fs.writeFile(STATE_FILE, JSON.stringify(state, null, 2));
}

/**
 * Generate PR body
 */
function generatePRBody(results) {
  let body = '## Notion Sync Results\\n\\n';

  body += `- ✅ Successfully synced: ${results.success.length}\\n`;
  body += `- ⏭️  Skipped: ${results.skipped.length}\\n`;
  body += `- ❌ Failed: ${results.failed.length}\\n\\n`;

  if (results.success.length > 0) {
    body += '### New Posts\\n\\n';
    results.success.forEach(r => {
      body += `- ${r.title}\\n`;
    });
  }

  body += '\\n---\\n🤖 Generated with [Claude Code](https://claude.com/claude-code)';

  return body;
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  syncNotionToBlog().catch(console.error);
}

export { syncNotionToBlog };
