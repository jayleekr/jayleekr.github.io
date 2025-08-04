#!/usr/bin/env node

/**
 * Launch Validation Script
 * Comprehensive pre-launch and post-launch validation
 */

import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';

const COLORS = {
  GREEN: '\x1b[32m',
  RED: '\x1b[31m',
  YELLOW: '\x1b[33m',
  BLUE: '\x1b[34m',
  RESET: '\x1b[0m',
  BOLD: '\x1b[1m'
};

const log = {
  success: (msg) => process.stdout.write(`${COLORS.GREEN}✅ ${msg}${COLORS.RESET}\n`),
  error: (msg) => process.stdout.write(`${COLORS.RED}❌ ${msg}${COLORS.RESET}\n`),
  warning: (msg) => process.stdout.write(`${COLORS.YELLOW}⚠️  ${msg}${COLORS.RESET}\n`),
  info: (msg) => process.stdout.write(`${COLORS.BLUE}ℹ️  ${msg}${COLORS.RESET}\n`),
  header: (msg) => process.stdout.write(`\n${COLORS.BOLD}${COLORS.BLUE}🚀 ${msg}${COLORS.RESET}\n\n`)
};

class LaunchValidator {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      tests: []
    };
  }

  async runTest(name, testFn) {
    try {
      log.info(`Running: ${name}`);
      const result = await testFn();
      if (result.success) {
        log.success(`${name}: ${result.message || 'PASSED'}`);
        this.results.passed++;
      } else {
        log.error(`${name}: ${result.message || 'FAILED'}`);
        this.results.failed++;
      }
      this.results.tests.push({ name, ...result });
    } catch (error) {
      log.error(`${name}: ${error.message}`);
      this.results.failed++;
      this.results.tests.push({ name, success: false, message: error.message });
    }
  }

  async validatePreLaunch() {
    log.header('PRE-LAUNCH VALIDATION');

    // 1. TypeScript compilation
    await this.runTest('TypeScript Compilation', async () => {
      try {
        execSync('bun run type-check', { stdio: 'pipe' });
        return { success: true, message: 'All TypeScript files compile successfully' };
      } catch {
        return { success: false, message: 'TypeScript compilation failed' };
      }
    });

    // 2. Build process
    await this.runTest('Production Build', async () => {
      try {
        execSync('bun run build', { stdio: 'pipe' });
        return { success: true, message: 'Production build completed successfully' };
      } catch {
        return { success: false, message: 'Build process failed' };
      }
    });

    // 3. Essential files existence
    await this.runTest('Essential Files Check', async () => {
      const requiredFiles = [
        'src/pages/index.astro',
        'src/pages/blog/[...slug].astro', 
        'src/layouts/Layout.astro',
        'src/components/PerformanceMonitor.astro',
        'public/manifest.json',
        'public/sw.js'
      ];

      const missing = requiredFiles.filter(file => !existsSync(file));
      if (missing.length === 0) {
        return { success: true, message: `All ${requiredFiles.length} essential files present` };
      } else {
        return { success: false, message: `Missing files: ${missing.join(', ')}` };
      }
    });

    // 4. Package.json validation
    await this.runTest('Package Configuration', async () => {
      try {
        const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
        const requiredScripts = ['build', 'dev', 'test', 'test:e2e'];
        const missingScripts = requiredScripts.filter(script => !pkg.scripts[script]);
        
        if (missingScripts.length === 0) {
          return { success: true, message: 'All required scripts configured' };
        } else {
          return { success: false, message: `Missing scripts: ${missingScripts.join(', ')}` };
        }
      } catch {
        return { success: false, message: 'Package.json validation failed' };
      }
    });

    // 5. PWA Manifest validation
    await this.runTest('PWA Manifest', async () => {
      try {
        const manifest = JSON.parse(readFileSync('public/manifest.json', 'utf8'));
        const requiredFields = ['name', 'short_name', 'start_url', 'display', 'icons'];
        const missing = requiredFields.filter(field => !manifest[field]);
        
        if (missing.length === 0 && manifest.icons.length >= 2) {
          return { success: true, message: 'PWA manifest is valid and complete' };
        } else {
          return { success: false, message: `Invalid manifest: missing ${missing.join(', ')}` };
        }
      } catch {
        return { success: false, message: 'PWA manifest validation failed' };
      }
    });

    // 6. Service Worker validation
    await this.runTest('Service Worker', async () => {
      try {
        const sw = readFileSync('public/sw.js', 'utf8');
        const hasCache = sw.includes('cache') && sw.includes('fetch');
        const hasOffline = sw.includes('offline') || sw.includes('fallback');
        
        if (hasCache && hasOffline) {
          return { success: true, message: 'Service worker configured with caching and offline support' };
        } else {
          return { success: false, message: 'Service worker missing essential features' };
        }
      } catch {
        return { success: false, message: 'Service worker validation failed' };
      }
    });
  }

  generateReport() {
    log.header('LAUNCH VALIDATION REPORT');
    
    process.stdout.write(`Total Tests: ${this.results.tests.length}\n`);
    process.stdout.write(`${COLORS.GREEN}Passed: ${this.results.passed}${COLORS.RESET}\n`);
    process.stdout.write(`${COLORS.RED}Failed: ${this.results.failed}${COLORS.RESET}\n`);
    
    const successRate = Math.round((this.results.passed / this.results.tests.length) * 100);
    process.stdout.write(`\nSuccess Rate: ${successRate}%\n`);

    if (this.results.failed === 0) {
      log.success('🎉 ALL VALIDATION TESTS PASSED - READY FOR LAUNCH!');
      return true;
    } else {
      log.error('❌ VALIDATION FAILED - RESOLVE ISSUES BEFORE LAUNCH');
      process.stdout.write('\nFailed Tests:\n');
      this.results.tests
        .filter(test => !test.success)
        .forEach(test => {
          process.stdout.write(`  - ${test.name}: ${test.message}\n`);
        });
      return false;
    }
  }
}

async function main() {
  const validator = new LaunchValidator();
  
  log.header('LAUNCH VALIDATION - PRE-LAUNCH');
  
  await validator.validatePreLaunch();
  const success = validator.generateReport();
  
  process.exit(success ? 0 : 1);
}

process.on('unhandledRejection', (error) => {
  log.error(`Unhandled error: ${error.message}`);
  process.exit(1);
});

main().catch((error) => {
  log.error(`Validation failed: ${error.message}`);
  process.exit(1);
});