# CSS Implementation Guide - Ready-to-Use Code

## 1. Tailwind Configuration Updates

```javascript
// tailwind.config.mjs
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'laptop': '1280px',    // NEW: Standard laptops
        'desktop': '1536px',   // NEW: Renamed from 2xl
        'wide': '1920px',      // NEW: Wide monitors
        '2xl': '1536px',       // Keep for compatibility
      },
      maxWidth: {
        'prose': '65ch',
        'prose-narrow': '55ch',
        'prose-wide': '75ch',
        'content': '800px',    // NEW: Optimal content width
        'content-wide': '900px', // NEW: Wide screen content
      },
      // ... rest of config
    },
  },
  // ... plugins
}
```

## 2. BlogPost.astro Layout Updates

### Replace Current Container (Line 61)
```html
<!-- OLD -->
<div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-8 2xl:px-12">

<!-- NEW -->
<div class="max-w-full laptop:max-w-7xl desktop:max-w-[1400px] wide:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
```

### Replace Desktop Layout Grid (Line 243)
```html
<!-- OLD -->
<div class="hidden lg:grid lg:grid-cols-[220px_minmax(0,1fr)_160px] xl:grid-cols-[260px_minmax(0,1fr)_200px] lg:gap-6 xl:gap-8 2xl:gap-10 lg:items-start">

<!-- NEW: Add Laptop-First Layout -->
<!-- Laptop Layout (1024px - 1535px) - Content Only -->
<div class="hidden lg:block desktop:hidden">
  <article class="max-w-content mx-auto py-16 px-6">
    <!-- Copy content from mobile layout (lines 101-239) but with laptop optimizations -->
  </article>
</div>

<!-- Desktop/Wide Layout (1536px+) -->
<div class="hidden desktop:grid desktop:grid-cols-[220px_1fr] wide:grid-cols-[260px_1fr_220px] desktop:gap-8 wide:gap-10 desktop:items-start">
  <!-- Left TOC -->
  <aside class="sticky top-8 min-w-0">
    <!-- TOC content -->
  </aside>
  
  <!-- Main Content -->
  <main class="min-w-0 py-16 px-4">
    <article class="prose prose-lg dark:prose-invert max-w-content wide:max-w-content-wide mx-auto">
      <!-- Article content -->
    </article>
  </main>
  
  <!-- Right Sidebar - Only on wide screens -->
  <aside class="sticky top-8 min-w-0 hidden wide:block">
    <!-- Tools and widgets -->
  </aside>
</div>
```

## 3. Global CSS Updates

### Add New Layout Classes
```css
/* Add to global.css after line 182 */

/* Content-First Layout System */
.content-container {
  @apply mx-auto px-4 sm:px-6;
  width: 100%;
  
  /* Tablet */
  @media (min-width: 768px) {
    @apply max-w-4xl; /* 896px */
  }
  
  /* Laptop */
  @media (min-width: 1280px) {
    @apply max-w-5xl px-8; /* 1024px */
  }
  
  /* Desktop */
  @media (min-width: 1536px) {
    @apply max-w-7xl; /* 1280px */
  }
  
  /* Wide */
  @media (min-width: 1920px) {
    max-width: 1600px;
    @apply px-12;
  }
}

/* Optimal Reading Width */
.content-prose {
  @apply mx-auto;
  width: 100%;
  
  /* Mobile */
  max-width: 100%;
  
  /* Tablet */
  @media (min-width: 768px) {
    max-width: 65ch; /* ~650px */
  }
  
  /* Laptop and above */
  @media (min-width: 1280px) {
    max-width: 800px;
  }
  
  /* Wide screens */
  @media (min-width: 1920px) {
    max-width: 900px;
  }
}

/* Responsive Grid Layouts */
.blog-grid {
  display: block;
  
  /* Laptop: Still single column */
  @media (min-width: 1280px) {
    display: block;
  }
  
  /* Desktop: 2-column */
  @media (min-width: 1536px) {
    display: grid;
    grid-template-columns: 220px 1fr;
    gap: 2rem;
  }
  
  /* Wide: 3-column */
  @media (min-width: 1920px) {
    grid-template-columns: 260px 1fr 220px;
    gap: 3rem;
  }
}
```

### Update Prose Styles for Better Laptop Reading
```css
/* Replace current .prose section (lines 282-296) */
.prose {
  @apply text-gray-800 dark:text-gray-200;
  font-size: 1rem;
  line-height: 1.75;
  width: 100%;
  max-width: 100%;
  margin-left: auto;
  margin-right: auto;
  
  /* Tablet: Comfortable reading */
  @media (min-width: 768px) {
    font-size: 1.0625rem; /* 17px */
    max-width: 65ch;
  }
  
  /* Laptop: Optimal experience */
  @media (min-width: 1280px) {
    font-size: 1.125rem; /* 18px */
    line-height: 1.75;
    max-width: 800px !important;
  }
  
  /* Desktop: Slightly larger */
  @media (min-width: 1536px) {
    font-size: 1.1875rem; /* 19px */
  }
  
  /* Wide: Maximum comfort */
  @media (min-width: 1920px) {
    font-size: 1.25rem; /* 20px */
    max-width: 900px !important;
  }
}
```

### Remove Conflicting Grid Classes
```css
/* DELETE these lines (593-632) as they conflict with new system */
/* Grid layout definitions for LG breakpoint */
@media (min-width: 1024px) {
  .lg\:grid-cols-\[200px_minmax\(0\,1fr\)_140px\] {
    grid-template-columns: 200px minmax(0, 1fr) 140px;
  }
}

/* DELETE the XL grid definitions too */
```

## 4. Table of Contents Component Updates

```astro
<!-- TableOfContents.astro -->
<nav class={`
  toc-container
  ${className}
  
  /* Mobile: Hidden by default */
  hidden
  
  /* Tablet: Collapsible above content */
  md:block md:mb-8 md:p-4 md:bg-gray-50 dark:md:bg-gray-800 
  md:rounded-lg md:border md:border-gray-200 dark:md:border-gray-700
  
  /* Laptop: Hidden to maximize content space */
  laptop:hidden
  
  /* Desktop: Fixed sidebar */
  desktop:block desktop:sticky desktop:top-8 desktop:bg-white/80 
  dark:desktop:bg-gray-800/80 desktop:backdrop-blur-sm 
  desktop:rounded-lg desktop:border desktop:border-gray-200 
  dark:desktop:border-gray-700 desktop:p-6 desktop:shadow-sm
  
  /* Wide: Enhanced sidebar */
  wide:min-w-[240px]
`}>
  <h3 class="
    text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4
    md:text-base desktop:text-lg
  ">
    {showNumbers ? 'Table of Contents' : 'Contents'}
  </h3>
  
  <div class="space-y-2">
    <!-- TOC items with responsive sizing -->
  </div>
</nav>
```

## 5. Mobile TOC Button Updates

```html
<!-- Update floating button position and behavior -->
<button 
  id="toc-toggle-mobile" 
  class="
    fixed z-40 
    bottom-6 right-6 
    laptop:hidden 
    w-14 h-14 
    bg-primary-600 hover:bg-primary-700 
    text-white rounded-full shadow-lg 
    transition-all duration-300 
    flex items-center justify-center
    
    /* Add pulse animation for discoverability */
    animate-pulse laptop:animate-none
  "
  aria-label="Toggle table of contents"
>
  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
          d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
  </svg>
</button>
```

## 6. Typography Responsive Scaling

```css
/* Add to global.css - Fluid Typography */
.prose h1 {
  /* Mobile: 2rem → Laptop: 2.5rem → Wide: 3rem */
  font-size: clamp(2rem, 1.5rem + 2.5vw, 3rem);
  line-height: 1.1;
  
  @media (min-width: 1280px) {
    font-size: 2.5rem;
  }
  
  @media (min-width: 1920px) {
    font-size: 3rem;
  }
}

.prose h2 {
  /* Mobile: 1.5rem → Laptop: 2rem → Wide: 2.25rem */
  font-size: clamp(1.5rem, 1.25rem + 1.25vw, 2.25rem);
  line-height: 1.2;
  
  @media (min-width: 1280px) {
    font-size: 2rem;
  }
  
  @media (min-width: 1920px) {
    font-size: 2.25rem;
  }
}

.prose h3 {
  /* Mobile: 1.25rem → Laptop: 1.5rem → Wide: 1.75rem */
  font-size: clamp(1.25rem, 1.125rem + 0.625vw, 1.75rem);
  line-height: 1.3;
  
  @media (min-width: 1280px) {
    font-size: 1.5rem;
  }
  
  @media (min-width: 1920px) {
    font-size: 1.75rem;
  }
}

/* Paragraph spacing for better readability */
.prose p {
  @apply mb-6;
  
  @media (min-width: 1280px) {
    @apply mb-8; /* More breathing room on larger screens */
  }
}
```

## 7. Quick Implementation Script

```javascript
// Add to a new file: update-layout.js
// Run with: node update-layout.js

const fs = require('fs');
const path = require('path');

// Files to update
const files = [
  {
    path: './src/layouts/BlogPost.astro',
    replacements: [
      {
        old: 'max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-8 2xl:px-12',
        new: 'max-w-full laptop:max-w-7xl desktop:max-w-[1400px] wide:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8'
      },
      {
        old: 'hidden lg:grid lg:grid-cols-[220px_minmax(0,1fr)_160px]',
        new: 'hidden desktop:grid desktop:grid-cols-[220px_1fr] wide:grid-cols-[260px_1fr_220px]'
      }
    ]
  }
];

// Apply replacements
files.forEach(file => {
  let content = fs.readFileSync(file.path, 'utf8');
  
  file.replacements.forEach(replacement => {
    content = content.replace(replacement.old, replacement.new);
  });
  
  fs.writeFileSync(file.path, content);
  console.log(`Updated: ${file.path}`);
});

console.log('Layout updates complete!');
```

## 8. Testing Checklist

```markdown
## Pre-Implementation Testing
- [ ] Backup current layout files
- [ ] Create feature branch: `git checkout -b content-first-layout`
- [ ] Test current layout on all breakpoints
- [ ] Document current issues with screenshots

## Post-Implementation Testing
- [ ] Mobile (320px, 375px, 414px)
- [ ] Tablet (768px, 834px, 1024px)
- [ ] Laptop (1280px, 1366px, 1440px)
- [ ] Desktop (1536px, 1920px)
- [ ] Wide (2560px, 3840px)

## Content Width Verification
- [ ] Mobile: Full width minus padding
- [ ] Tablet: ~650px (65ch)
- [ ] Laptop: 800px
- [ ] Desktop: 800px
- [ ] Wide: 900px

## Performance Metrics
- [ ] Lighthouse score maintained >90
- [ ] No layout shift issues
- [ ] Smooth transitions between breakpoints
```

This implementation guide provides ready-to-use code that can be directly applied to fix the layout issues and create a content-first reading experience.