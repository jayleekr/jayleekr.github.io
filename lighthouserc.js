module.exports = {
  ci: {
    collect: {
      // Run Lighthouse on these URLs
      url: [
        'http://localhost:4321/',
        'http://localhost:4321/blog',
        'http://localhost:4321/about'
      ],
      // Number of times to run Lighthouse on each URL
      numberOfRuns: 3,
      settings: {
        // Lighthouse settings
        chromeFlags: '--no-sandbox --disable-dev-shm-usage',
        // Preset configurations
        preset: 'desktop'
      }
    },
    assert: {
      // Performance budgets
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
        
        // Core Web Vitals
        'first-contentful-paint': ['error', { maxNumericValue: 1800 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['error', { maxNumericValue: 200 }],
        
        // Additional performance metrics
        'speed-index': ['error', { maxNumericValue: 3000 }],
        'interactive': ['error', { maxNumericValue: 3800 }],
        
        // Resource budgets
        'resource-summary:document:size': ['error', { maxNumericValue: 50000 }], // 50KB HTML
        'resource-summary:stylesheet:size': ['error', { maxNumericValue: 100000 }], // 100KB CSS
        'resource-summary:script:size': ['error', { maxNumericValue: 200000 }], // 200KB JS
        'resource-summary:image:size': ['error', { maxNumericValue: 500000 }], // 500KB images
        'resource-summary:total:size': ['error', { maxNumericValue: 1000000 }], // 1MB total
        
        // Accessibility audits
        'color-contrast': 'error',
        'heading-order': 'error',
        'html-has-lang': 'error',
        'image-alt': 'error',
        'link-name': 'error',
        'meta-description': 'error',
        
        // Best practices
        'errors-in-console': 'error',
        'uses-https': 'error',
        'is-on-https': 'error',
        
        // SEO
        'document-title': 'error',
        'hreflang': 'off', // Disable if not using hreflang
        'canonical': 'error'
      }
    },
    upload: {
      // Upload results to Lighthouse CI server if configured
      target: 'temporary-public-storage'
    },
    server: {
      // Local server configuration for CI
      port: 9001,
      storage: './lighthouseci'
    }
  }
}