#!/usr/bin/env node

/**
 * Emoji Reduction Script for Blog Content
 * 
 * This script reduces excessive emojis in markdown files to make content less obviously AI-generated.
 */

import fs from 'fs/promises';
import path from 'path';

// Common emoji patterns that are often overused in AI-generated content
const OVERUSED_EMOJIS = [
  '🚀', '✨', '💡', '🔥', '⚡', '🎯', '📊', '📈', '💪', '🙌',
  '👍', '✅', '❗', '⭐', '🔴', '🟢', '🔵', '🟡', '🟠', '🟣',
  '🎉', '🌟', '💫', '🚪', '🔑', '🎪', '🎭', '🎨', '🎬', '🎵'
];

// Patterns for different reduction strategies
const REDUCTION_STRATEGIES = {
  // Remove standalone emojis at start of lines (common in AI content)
  standaloneStart: /^[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}][\u2000-\u206F\u2E00-\u2E7F]*\s+/gmu,
  
  // Remove multiple consecutive emojis (reduce to 1)
  consecutive: /([\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}])\s*([\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}])+/gu,
  
  // Remove emojis from headers (looks less professional)
  headerEmojis: /(^#+\s*)([\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}])\s*/gmu,
  
  // Remove overused emojis completely
  overused: new RegExp(`[${OVERUSED_EMOJIS.join('')}]`, 'gu'),
  
  // Reduce emojis in bullet points (common AI pattern)
  bulletEmojis: /^(\s*[-*+]\s*)([\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}])\s*/gmu
};

class EmojiReducer {
  constructor(options = {}) {
    this.dryRun = options.dryRun || false;
    this.aggressive = options.aggressive || false;
    this.verbose = options.verbose || false;
    
    this.stats = {
      totalEmojis: 0,
      removedEmojis: 0,
      patterns: {}
    };
  }

  /**
   * Count emojis in text
   */
  countEmojis(text) {
    const emojiRegex = /[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu;
    const matches = text.match(emojiRegex);
    return matches ? matches.length : 0;
  }

  /**
   * Apply reduction strategies to text
   */
  reduceEmojis(text) {
    let result = text;
    const originalCount = this.countEmojis(text);
    this.stats.totalEmojis += originalCount;

    // Strategy 1: Remove standalone emojis at start of lines
    const beforeStandalone = this.countEmojis(result);
    result = result.replace(REDUCTION_STRATEGIES.standaloneStart, '');
    const afterStandalone = this.countEmojis(result);
    this.stats.patterns.standaloneStart = (this.stats.patterns.standaloneStart || 0) + (beforeStandalone - afterStandalone);

    // Strategy 2: Reduce consecutive emojis to single emoji
    const beforeConsecutive = this.countEmojis(result);
    result = result.replace(REDUCTION_STRATEGIES.consecutive, '$1 ');
    const afterConsecutive = this.countEmojis(result);
    this.stats.patterns.consecutive = (this.stats.patterns.consecutive || 0) + (beforeConsecutive - afterConsecutive);

    // Strategy 3: Remove emojis from headers
    const beforeHeaders = this.countEmojis(result);
    result = result.replace(REDUCTION_STRATEGIES.headerEmojis, '$1');
    const afterHeaders = this.countEmojis(result);
    this.stats.patterns.headerEmojis = (this.stats.patterns.headerEmojis || 0) + (beforeHeaders - afterHeaders);

    // Strategy 4: Remove bullet point emojis
    const beforeBullets = this.countEmojis(result);
    result = result.replace(REDUCTION_STRATEGIES.bulletEmojis, '$1');
    const afterBullets = this.countEmojis(result);
    this.stats.patterns.bulletEmojis = (this.stats.patterns.bulletEmojis || 0) + (beforeBullets - afterBullets);

    // Strategy 5 (Aggressive): Remove overused emojis completely
    if (this.aggressive) {
      const beforeOverused = this.countEmojis(result);
      result = result.replace(REDUCTION_STRATEGIES.overused, '');
      const afterOverused = this.countEmojis(result);
      this.stats.patterns.overused = (this.stats.patterns.overused || 0) + (beforeOverused - afterOverused);
    }

    // Clean up extra whitespace
    result = result.replace(/\s{3,}/g, '  ').replace(/\n{3,}/g, '\n\n');

    const finalCount = this.countEmojis(result);
    this.stats.removedEmojis += (originalCount - finalCount);

    return result;
  }

  /**
   * Process a single file
   */
  async processFile(filePath) {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const originalEmojiCount = this.countEmojis(content);
      
      if (originalEmojiCount === 0) {
        if (this.verbose) {
          // eslint-disable-next-line no-console
          console.log(`⏭️  Skipping ${filePath} (no emojis found)`);
        }
        return { processed: false, reason: 'no-emojis' };
      }

      const processedContent = this.reduceEmojis(content);
      const finalEmojiCount = this.countEmojis(processedContent);
      const reductionPercent = Math.round(((originalEmojiCount - finalEmojiCount) / originalEmojiCount) * 100);

      if (this.dryRun) {
        // eslint-disable-next-line no-console
        console.log(`🔍 DRY RUN: ${filePath}`);
        // eslint-disable-next-line no-console
        console.log(`   Original emojis: ${originalEmojiCount}`);
        // eslint-disable-next-line no-console
        console.log(`   After reduction: ${finalEmojiCount} (-${reductionPercent}%)`);
        return { processed: false, reason: 'dry-run', stats: { originalEmojiCount, finalEmojiCount, reductionPercent } };
      }

      // Only write if there were changes
      if (content !== processedContent) {
        await fs.writeFile(filePath, processedContent, 'utf-8');
        // eslint-disable-next-line no-console
        console.log(`✅ Processed ${filePath}`);
        // eslint-disable-next-line no-console
        console.log(`   Emojis: ${originalEmojiCount} → ${finalEmojiCount} (-${reductionPercent}%)`);
        return { processed: true, stats: { originalEmojiCount, finalEmojiCount, reductionPercent } };
      } else {
        // eslint-disable-next-line no-console
        console.log(`⏭️  No changes needed for ${filePath}`);
        return { processed: false, reason: 'no-changes' };
      }

    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`❌ Error processing ${filePath}:`, error.message);
      return { processed: false, reason: 'error', error: error.message };
    }
  }

  /**
   * Process multiple files in a directory
   */
  async processDirectory(dirPath) {
    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true });
      const results = [];

      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);

        if (entry.isDirectory()) {
          // Recursively process subdirectories
          const subResults = await this.processDirectory(fullPath);
          results.push(...subResults);
        } else if (entry.isFile() && entry.name.endsWith('.md')) {
          const result = await this.processFile(fullPath);
          results.push({ file: fullPath, ...result });
        }
      }

      return results;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`❌ Error processing directory ${dirPath}:`, error.message);
      return [];
    }
  }

  /**
   * Print summary statistics
   */
  printStats() {
    // eslint-disable-next-line no-console
    console.log('\n📊 Summary Statistics:');
    // eslint-disable-next-line no-console
    console.log(`   Total emojis found: ${this.stats.totalEmojis}`);
    // eslint-disable-next-line no-console
    console.log(`   Total emojis removed: ${this.stats.removedEmojis}`);
    if (this.stats.totalEmojis > 0) {
      const reductionPercent = Math.round((this.stats.removedEmojis / this.stats.totalEmojis) * 100);
      // eslint-disable-next-line no-console
      console.log(`   Overall reduction: ${reductionPercent}%`);
    }

    if (Object.keys(this.stats.patterns).length > 0) {
      // eslint-disable-next-line no-console
      console.log('\n   Breakdown by strategy:');
      for (const [strategy, count] of Object.entries(this.stats.patterns)) {
        if (count > 0) {
          // eslint-disable-next-line no-console
          console.log(`     ${strategy}: ${count} emojis removed`);
        }
      }
    }
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    // eslint-disable-next-line no-console
    console.log(`
🧹 Emoji Reduction Tool

Reduces excessive emojis in markdown files to make content less obviously AI-generated.

Usage:
  node reduce-emojis.mjs [path] [options]

Arguments:
  path                File or directory path (default: src/content/blog)

Options:
  --dry-run          Show what would be changed without modifying files
  --aggressive       Remove overused emojis completely (🚀✨💡🔥⚡🎯 etc.)
  --verbose          Show detailed output
  --help, -h         Show this help message

Examples:
  node reduce-emojis.mjs                                    # Process all blog posts
  node reduce-emojis.mjs src/content/blog/my-post.md       # Process specific file
  node reduce-emojis.mjs --dry-run --aggressive            # Preview aggressive reduction
    `);
    return;
  }

  const options = {
    dryRun: args.includes('--dry-run'),
    aggressive: args.includes('--aggressive'),
    verbose: args.includes('--verbose')
  };

  // Get the target path (default to blog directory)
  const targetPath = args.find(arg => !arg.startsWith('--')) || 'src/content/blog';
  
  // eslint-disable-next-line no-console
  console.log(`🧹 Emoji Reduction Tool ${options.dryRun ? '(DRY RUN)' : ''}`);
  // eslint-disable-next-line no-console
  console.log(`📁 Target: ${targetPath}`);
  // eslint-disable-next-line no-console
  console.log(`⚙️  Mode: ${options.aggressive ? 'Aggressive' : 'Standard'}`);
  // eslint-disable-next-line no-console
  console.log();

  const reducer = new EmojiReducer(options);

  try {
    const stats = await fs.stat(targetPath);
    let results;

    if (stats.isFile()) {
      const result = await reducer.processFile(targetPath);
      results = [{ file: targetPath, ...result }];
    } else if (stats.isDirectory()) {
      results = await reducer.processDirectory(targetPath);
    } else {
      // eslint-disable-next-line no-console
      console.error('❌ Target path is not a file or directory');
      process.exit(1);
    }

    // Print results summary
    const processed = results.filter(r => r.processed).length;
    const skipped = results.filter(r => !r.processed).length;
    
    // eslint-disable-next-line no-console
    console.log(`\n📋 Results:`);
    // eslint-disable-next-line no-console
    console.log(`   Processed: ${processed} files`);
    // eslint-disable-next-line no-console
    console.log(`   Skipped: ${skipped} files`);

    // Print detailed stats
    reducer.printStats();

    if (options.dryRun) {
      // eslint-disable-next-line no-console
      console.log('\n💡 Run without --dry-run to apply changes');
    }

  } catch (error) {
    if (error.code === 'ENOENT') {
      // eslint-disable-next-line no-console
      console.error(`❌ File or directory not found: ${targetPath}`);
    } else {
      // eslint-disable-next-line no-console
      console.error(`❌ Error:`, error.message);
    }
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { EmojiReducer };