# Codebase Structure

## Root Directory Organization

### Source Code (`/src`)
```
src/
├── components/        # Reusable Astro components
├── content/          # Blog posts and content collections
│   └── blog/         # Organized by categories
│       ├── ko/       # Korean blog posts
│       └── en/       # English blog posts
├── layouts/          # Page layouts (BaseLayout, BlogLayout)
├── pages/            # Site pages and routes (file-based routing)
│   ├── index.astro   # Homepage
│   ├── blog/         # Blog listing pages
│   ├── about.astro   # About page
│   └── [lang]/       # Internationalized routes
├── styles/           # Global CSS and Tailwind
├── utils/            # Utility functions (date, reading time, SEO)
├── types/            # TypeScript type definitions
├── scripts/          # Client-side scripts
├── assets/           # Images, icons, fonts
├── content.config.ts # Content collections schema
└── consts.ts         # Site-wide constants
```

### Configuration Files
```
/
├── astro.config.mjs       # Astro configuration
├── tailwind.config.mjs    # Tailwind CSS config
├── tsconfig.json          # TypeScript config
├── eslint.config.js       # ESLint config
├── .prettierrc            # Prettier config
├── package.json           # Dependencies and scripts
├── bun.lock              # Bun lockfile
└── astro-i18next.config.ts # i18n configuration
```

### Testing
```
/
├── tests/                 # Test files
│   ├── unit/             # Vitest unit tests
│   └── e2e/              # Playwright E2E tests
├── playwright.config.ts   # Playwright configuration
├── vitest.config.ts      # Vitest configuration
└── .lighthouserc.js      # Lighthouse CI config
```

### Deployment & CI/CD
```
/
├── .github/
│   └── workflows/
│       └── deploy.yml    # GitHub Actions deployment
├── deploy-native.sh      # Native deployment script
└── public/               # Static assets (copied to dist/)
```

### Documentation
```
/
├── README.md                  # Project overview
├── CLAUDE.md                  # Development notes for AI
├── workflow_state.md          # Current project state
├── project_config.md          # Project configuration
├── BLOG_IMPROVEMENT_PLAN.md   # Feature roadmap
├── LAUNCH_CHECKLIST.md        # Pre-launch validation
└── docs/                      # Additional documentation
```

### Legacy Files (Maintained for History)
```
/
├── _config.yml           # Jekyll config (archived)
├── Gemfile              # Ruby dependencies (archived)
├── tools/               # Jekyll scripts (archived)
└── .jekyll-cache/       # Jekyll build cache (ignored)
```

## Key Directories to Focus On

### For Development
- `src/components/` - UI components
- `src/layouts/` - Page templates
- `src/pages/` - Routes and pages
- `src/utils/` - Helper functions

### For Content Creation
- `src/content/blog/ko/` - Korean blog posts
- `src/content/blog/en/` - English blog posts
- `public/images/` - Blog images

### For Testing
- `tests/unit/` - Component and utility tests
- `tests/e2e/` - User interaction tests
