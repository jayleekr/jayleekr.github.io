# Modern Design System Specification for jayleekr.github.io

## Executive Summary

This design system addresses critical UX issues identified in the user research:
- **Mobile navigation complexity** → Clean bottom navigation
- **Hidden search functionality** → Always-visible search
- **Information overload** → Streamlined content hierarchy
- **Visual hierarchy problems** → Clear typographic scale
- **Language switching friction** → Improved i18n UX

## 🎨 Design Foundation

### Color System
```css
/* Enhanced theme variables with better contrast ratios */
:root {
  /* Primary Brand Colors */
  --color-primary-50: #f0f9ff;
  --color-primary-100: #e0f2fe;
  --color-primary-200: #bae6fd;
  --color-primary-300: #7dd3fc;
  --color-primary-400: #38bdf8;
  --color-primary-500: #0ea5e9;  /* Main brand */
  --color-primary-600: #0284c7;  /* CTA buttons */
  --color-primary-700: #0369a1;  /* Hover states */
  --color-primary-800: #075985;
  --color-primary-900: #0c4a6e;

  /* Neutral Grays (WCAG AA compliant) */
  --color-neutral-50: #f8fafc;
  --color-neutral-100: #f1f5f9;
  --color-neutral-200: #e2e8f0;
  --color-neutral-300: #cbd5e1;
  --color-neutral-400: #94a3b8;
  --color-neutral-500: #64748b;
  --color-neutral-600: #475569;  /* Secondary text */
  --color-neutral-700: #334155;  /* Primary text */
  --color-neutral-800: #1e293b;
  --color-neutral-900: #0f172a;

  /* Semantic Colors */
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-info: #3b82f6;

  /* Background System */
  --bg-primary: #ffffff;
  --bg-secondary: #f8fafc;
  --bg-tertiary: #f1f5f9;
  --bg-accent: #f0f9ff;
  
  /* Text Colors */
  --text-primary: #0f172a;      /* 4.5:1 contrast ratio */
  --text-secondary: #475569;    /* 4.5:1 contrast ratio */
  --text-tertiary: #64748b;     /* 3:1 contrast ratio */
  --text-inverse: #ffffff;
  
  /* Border Colors */
  --border-light: #e2e8f0;
  --border-medium: #cbd5e1;
  --border-strong: #94a3b8;
}

.dark {
  /* Dark mode adjustments */
  --color-primary-400: #38bdf8;  /* Better contrast in dark mode */
  --color-primary-500: #0ea5e9;
  
  --bg-primary: #0f172a;
  --bg-secondary: #1e293b;
  --bg-tertiary: #334155;
  --bg-accent: #0c4a6e;
  
  --text-primary: #f8fafc;
  --text-secondary: #cbd5e1;
  --text-tertiary: #94a3b8;
  --text-inverse: #0f172a;
  
  --border-light: #334155;
  --border-medium: #475569;
  --border-strong: #64748b;
}
```

### Typography Scale (Mobile-First)
```css
/* Fluid typography with optimal reading experience */
:root {
  /* Display (Hero Headlines) */
  --text-display: clamp(2.5rem, 2rem + 2.5vw, 4rem);       /* 40px-64px */
  --text-display-line-height: 1.1;
  --text-display-weight: 800;
  --text-display-spacing: -0.025em;

  /* Headings */
  --text-h1: clamp(2rem, 1.5rem + 2.5vw, 3rem);            /* 32px-48px */
  --text-h1-line-height: 1.2;
  --text-h1-weight: 700;
  --text-h1-spacing: -0.025em;

  --text-h2: clamp(1.5rem, 1.25rem + 1.25vw, 2.25rem);     /* 24px-36px */
  --text-h2-line-height: 1.3;
  --text-h2-weight: 600;
  --text-h2-spacing: -0.025em;

  --text-h3: clamp(1.25rem, 1.125rem + 0.625vw, 1.75rem);  /* 20px-28px */
  --text-h3-line-height: 1.4;
  --text-h3-weight: 600;
  --text-h3-spacing: -0.015em;

  --text-h4: clamp(1.125rem, 1.0625rem + 0.3125vw, 1.375rem); /* 18px-22px */
  --text-h4-line-height: 1.5;
  --text-h4-weight: 500;

  /* Body Text */
  --text-body-lg: clamp(1.125rem, 1.05rem + 0.35vw, 1.25rem); /* 18px-20px */
  --text-body-lg-line-height: 1.7;
  --text-body-lg-weight: 400;

  --text-body: clamp(1rem, 0.95rem + 0.25vw, 1.125rem);    /* 16px-18px */
  --text-body-line-height: 1.6;
  --text-body-weight: 400;

  --text-body-sm: clamp(0.875rem, 0.85rem + 0.15vw, 0.9375rem); /* 14px-15px */
  --text-body-sm-line-height: 1.5;
  --text-body-sm-weight: 400;

  /* UI Text */
  --text-caption: 0.75rem;  /* 12px */
  --text-caption-line-height: 1.4;
  --text-caption-weight: 500;

  --text-label: 0.875rem;   /* 14px */
  --text-label-line-height: 1.4;
  --text-label-weight: 500;
}
```

### Spacing System (8px Grid)
```css
:root {
  /* Base unit: 8px */
  --space-0: 0;
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
  --space-20: 5rem;     /* 80px */
  --space-24: 6rem;     /* 96px */

  /* Component-specific spacing */
  --space-section: clamp(3rem, 2.5rem + 2.5vw, 6rem);     /* 48px-96px */
  --space-container: clamp(1rem, 2.5vw, 2rem);            /* 16px-32px */
}
```

### Responsive Breakpoints
```css
/* Mobile-first breakpoints optimized for content */
:root {
  --breakpoint-xs: 375px;    /* Small mobile */
  --breakpoint-sm: 640px;    /* Large mobile */
  --breakpoint-md: 768px;    /* Tablet */
  --breakpoint-lg: 1024px;   /* Small laptop */
  --breakpoint-xl: 1280px;   /* Standard laptop */
  --breakpoint-2xl: 1536px;  /* Desktop */
  --breakpoint-3xl: 1920px;  /* Large desktop */
}
```

## 📱 Component Specifications

### 1. Navigation System

#### Desktop Navigation
```css
.navigation-desktop {
  height: 4rem; /* 64px */
  background: var(--bg-primary);
  border-bottom: 1px solid var(--border-light);
  backdrop-filter: blur(12px);
  position: sticky;
  top: 0;
  z-index: 50;
}

.nav-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 var(--space-6);
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: var(--space-8);
}

.nav-link {
  font-size: var(--text-body);
  font-weight: var(--text-body-weight);
  color: var(--text-secondary);
  text-decoration: none;
  padding: var(--space-2) var(--space-4);
  border-radius: 0.5rem;
  transition: all 0.2s ease;
  min-height: 44px; /* Touch target */
  display: flex;
  align-items: center;
}

.nav-link:hover {
  color: var(--color-primary-600);
  background: var(--bg-accent);
}

.nav-link.active {
  color: var(--color-primary-600);
  font-weight: 500;
}
```

#### Mobile Bottom Navigation (Replaces Hamburger)
```css
.navigation-mobile {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 5rem; /* 80px */
  background: var(--bg-primary);
  border-top: 1px solid var(--border-light);
  backdrop-filter: blur(12px);
  z-index: 50;
  padding: var(--space-2) var(--space-4);
  padding-bottom: calc(var(--space-2) + env(safe-area-inset-bottom));
}

.nav-mobile-container {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 100%;
  max-width: 400px;
  margin: 0 auto;
}

.nav-mobile-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
  min-width: 56px; /* 56px touch target */
  min-height: 56px;
  padding: var(--space-2);
  border-radius: 0.75rem;
  text-decoration: none;
  transition: all 0.2s ease;
  color: var(--text-tertiary);
}

.nav-mobile-item:hover,
.nav-mobile-item.active {
  color: var(--color-primary-600);
  background: var(--bg-accent);
}

.nav-mobile-icon {
  width: 24px;
  height: 24px;
}

.nav-mobile-label {
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1;
}

/* Add bottom padding to body when mobile nav is present */
@media (max-width: 767px) {
  body {
    padding-bottom: 5rem;
  }
}
```

### 2. Search Component (Always Visible)

#### Desktop Search Bar
```css
.search-desktop {
  position: relative;
  width: 100%;
  max-width: 320px;
}

.search-input {
  width: 100%;
  height: 44px;
  padding: var(--space-3) var(--space-4) var(--space-3) var(--space-12);
  font-size: var(--text-body);
  background: var(--bg-secondary);
  border: 1px solid var(--border-light);
  border-radius: 0.75rem;
  transition: all 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 3px var(--color-primary-100);
  background: var(--bg-primary);
}

.search-icon {
  position: absolute;
  left: var(--space-4);
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  color: var(--text-tertiary);
}

.search-shortcut {
  position: absolute;
  right: var(--space-3);
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.75rem;
  color: var(--text-tertiary);
  background: var(--bg-tertiary);
  padding: var(--space-1) var(--space-2);
  border-radius: 0.25rem;
}
```

#### Mobile Search (In Bottom Nav)
```css
.search-mobile {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
  min-width: 56px;
  min-height: 56px;
  padding: var(--space-2);
  border-radius: 0.75rem;
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--text-tertiary);
}

.search-mobile:active {
  color: var(--color-primary-600);
  background: var(--bg-accent);
  transform: scale(0.95);
}
```

### 3. Hero Sections

#### Homepage Hero
```css
.hero-home {
  padding: var(--space-24) var(--space-6) var(--space-20);
  text-align: center;
  background: linear-gradient(
    135deg,
    var(--bg-primary) 0%,
    var(--bg-accent) 100%
  );
}

.hero-title {
  font-size: var(--text-display);
  line-height: var(--text-display-line-height);
  font-weight: var(--text-display-weight);
  letter-spacing: var(--text-display-spacing);
  margin-bottom: var(--space-6);
  background: linear-gradient(
    135deg,
    var(--color-primary-600) 0%,
    var(--color-primary-800) 100%
  );
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-subtitle {
  font-size: var(--text-h2);
  color: var(--text-secondary);
  margin-bottom: var(--space-8);
  max-width: 42rem; /* ~672px */
  margin-left: auto;
  margin-right: auto;
}

.hero-cta-group {
  display: flex;
  gap: var(--space-4);
  justify-content: center;
  flex-wrap: wrap;
}

@media (max-width: 640px) {
  .hero-home {
    padding: var(--space-16) var(--space-4) var(--space-12);
  }
  
  .hero-cta-group {
    flex-direction: column;
    align-items: center;
    gap: var(--space-3);
  }
}
```

#### Blog Post Hero
```css
.hero-blog-post {
  padding: var(--space-20) var(--space-6) var(--space-16);
  max-width: 1024px;
  margin: 0 auto;
}

.hero-blog-title {
  font-size: var(--text-h1);
  line-height: var(--text-h1-line-height);
  font-weight: var(--text-h1-weight);
  letter-spacing: var(--text-h1-spacing);
  color: var(--text-primary);
  margin-bottom: var(--space-6);
}

.hero-blog-meta {
  display: flex;
  align-items: center;
  gap: var(--space-6);
  font-size: var(--text-body-sm);
  color: var(--text-secondary);
  margin-bottom: var(--space-8);
}

.hero-blog-description {
  font-size: var(--text-body-lg);
  line-height: var(--text-body-lg-line-height);
  color: var(--text-secondary);
  max-width: 65ch;
}

@media (max-width: 768px) {
  .hero-blog-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-2);
  }
}
```

### 4. Content Cards

#### Blog Post Card
```css
.card-blog-post {
  background: var(--bg-primary);
  border: 1px solid var(--border-light);
  border-radius: 1rem;
  padding: var(--space-6);
  transition: all 0.2s ease;
  display: block;
  text-decoration: none;
  color: inherit;
}

.card-blog-post:hover {
  border-color: var(--color-primary-200);
  box-shadow: 
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transform: translateY(-2px);
}

.card-title {
  font-size: var(--text-h3);
  line-height: var(--text-h3-line-height);
  font-weight: var(--text-h3-weight);
  color: var(--text-primary);
  margin-bottom: var(--space-3);
}

.card-description {
  font-size: var(--text-body);
  line-height: var(--text-body-line-height);
  color: var(--text-secondary);
  margin-bottom: var(--space-4);
}

.card-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: var(--text-body-sm);
  color: var(--text-tertiary);
}

.card-tags {
  display: flex;
  gap: var(--space-2);
  flex-wrap: wrap;
}

.card-tag {
  padding: var(--space-1) var(--space-3);
  background: var(--bg-secondary);
  color: var(--text-secondary);
  border-radius: 9999px;
  font-size: var(--text-caption);
  font-weight: 500;
}
```

#### Category Card
```css
.card-category {
  background: var(--bg-primary);
  border: 1px solid var(--border-light);
  border-radius: 0.75rem;
  padding: var(--space-5);
  text-align: center;
  transition: all 0.2s ease;
  display: block;
  text-decoration: none;
  color: inherit;
}

.card-category:hover {
  border-color: var(--color-primary-500);
  background: var(--bg-accent);
}

.card-category-icon {
  width: 48px;
  height: 48px;
  margin: 0 auto var(--space-4);
  background: var(--color-primary-100);
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary-600);
}

.card-category-title {
  font-size: var(--text-body-lg);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--space-2);
}

.card-category-count {
  font-size: var(--text-body-sm);
  color: var(--text-tertiary);
}
```

### 5. Form Components

#### Primary Button
```css
.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-6);
  font-size: var(--text-body);
  font-weight: 600;
  line-height: 1.5;
  color: var(--text-inverse);
  background: var(--color-primary-600);
  border: 1px solid var(--color-primary-600);
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  min-height: 44px; /* Touch target */
  min-width: 44px;
}

.btn-primary:hover:not(:disabled) {
  background: var(--color-primary-700);
  border-color: var(--color-primary-700);
  transform: translateY(-1px);
}

.btn-primary:active {
  transform: translateY(0);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary:focus {
  outline: none;
  box-shadow: 0 0 0 3px var(--color-primary-200);
}
```

#### Secondary Button
```css
.btn-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-6);
  font-size: var(--text-body);
  font-weight: 500;
  line-height: 1.5;
  color: var(--color-primary-600);
  background: transparent;
  border: 1px solid var(--color-primary-300);
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  min-height: 44px;
  min-width: 44px;
}

.btn-secondary:hover:not(:disabled) {
  background: var(--bg-accent);
  border-color: var(--color-primary-500);
}
```

#### Form Input
```css
.form-input {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  font-size: var(--text-body);
  line-height: 1.5;
  color: var(--text-primary);
  background: var(--bg-primary);
  border: 1px solid var(--border-medium);
  border-radius: 0.5rem;
  transition: all 0.2s ease;
  min-height: 44px;
}

.form-input:focus {
  outline: none;
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 3px var(--color-primary-100);
}

.form-input::placeholder {
  color: var(--text-tertiary);
}

.form-label {
  display: block;
  font-size: var(--text-label);
  font-weight: var(--text-label-weight);
  color: var(--text-primary);
  margin-bottom: var(--space-2);
}
```

### 6. Footer Component
```css
.footer {
  background: var(--bg-secondary);
  border-top: 1px solid var(--border-light);
  padding: var(--space-12) var(--space-6) var(--space-8);
  margin-top: var(--space-20);
}

.footer-container {
  max-width: 1280px;
  margin: 0 auto;
}

.footer-content {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-8);
  margin-bottom: var(--space-8);
}

@media (min-width: 768px) {
  .footer-content {
    grid-template-columns: 2fr 1fr 1fr;
    gap: var(--space-12);
  }
}

.footer-section-title {
  font-size: var(--text-body-lg);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--space-4);
}

.footer-link {
  display: block;
  font-size: var(--text-body);
  color: var(--text-secondary);
  text-decoration: none;
  padding: var(--space-1) 0;
  transition: color 0.2s ease;
}

.footer-link:hover {
  color: var(--color-primary-600);
}

.footer-bottom {
  padding-top: var(--space-6);
  border-top: 1px solid var(--border-light);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-4);
  font-size: var(--text-body-sm);
  color: var(--text-tertiary);
}

.footer-social {
  display: flex;
  gap: var(--space-4);
}

.footer-social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  color: var(--text-tertiary);
  border-radius: 0.5rem;
  transition: all 0.2s ease;
}

.footer-social-link:hover {
  color: var(--color-primary-600);
  background: var(--bg-accent);
}
```

## 🎯 Component States & Interactions

### Interactive States
```css
/* Focus States (WCAG 2.1 AA) */
.focusable:focus {
  outline: 2px solid var(--color-primary-500);
  outline-offset: 2px;
}

/* Loading States */
.loading {
  position: relative;
  pointer-events: none;
}

.loading::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 20px;
  height: 20px;
  margin: -10px 0 0 -10px;
  border: 2px solid var(--color-primary-200);
  border-top-color: var(--color-primary-600);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Error States */
.error {
  border-color: var(--color-error);
  background: color-mix(in srgb, var(--color-error) 5%, transparent);
}

.error:focus {
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-error) 20%, transparent);
}

/* Success States */
.success {
  border-color: var(--color-success);
  background: color-mix(in srgb, var(--color-success) 5%, transparent);
}
```

## 📱 Responsive Implementation

### Mobile-First Media Queries
```css
/* Base styles (mobile) */
.component {
  /* Mobile styles */
}

/* Small mobile (375px+) */
@media (min-width: 23.4375rem) {
  .component {
    /* Small mobile adjustments */
  }
}

/* Large mobile (640px+) */
@media (min-width: 40rem) {
  .component {
    /* Large mobile styles */
  }
}

/* Tablet (768px+) */
@media (min-width: 48rem) {
  .component {
    /* Tablet styles */
  }
}

/* Small laptop (1024px+) */
@media (min-width: 64rem) {
  .component {
    /* Small laptop styles */
  }
}

/* Standard laptop (1280px+) */
@media (min-width: 80rem) {
  .component {
    /* Standard laptop styles */
  }
}

/* Desktop (1536px+) */
@media (min-width: 96rem) {
  .component {
    /* Desktop styles */
  }
}
```

### Container System
```css
.container {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding-left: var(--space-container);
  padding-right: var(--space-container);
}

.container-sm { max-width: 640px; }
.container-md { max-width: 768px; }
.container-lg { max-width: 1024px; }
.container-xl { max-width: 1280px; }
.container-2xl { max-width: 1536px; }

/* Content-optimized containers */
.container-prose {
  max-width: 65ch; /* ~1040px */
  margin-left: auto;
  margin-right: auto;
  padding-left: var(--space-6);
  padding-right: var(--space-6);
}
```

## ♿ Accessibility Specifications

### WCAG 2.1 AA Compliance
```css
/* High Contrast Mode Support */
@media (prefers-contrast: high) {
  :root {
    --text-primary: #000000;
    --text-secondary: #000000;
    --bg-primary: #ffffff;
    --border-light: #000000;
  }
  
  .dark {
    --text-primary: #ffffff;
    --text-secondary: #ffffff;
    --bg-primary: #000000;
    --border-light: #ffffff;
  }
}

/* Reduced Motion Support */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* Focus Visible Support */
.focus-visible:focus:not(:focus-visible) {
  outline: none;
}

.focus-visible:focus-visible {
  outline: 2px solid var(--color-primary-500);
  outline-offset: 2px;
}
```

### Touch Target Specifications
- Minimum touch target: 44px × 44px (iOS/Android guidelines)
- Recommended touch target: 48px × 48px (Material Design)
- Spacing between targets: minimum 8px
- Interactive elements have visual feedback

## 🌙 Dark Mode Implementation

### Theme Toggle Component
```css
.theme-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-light);
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--text-secondary);
}

.theme-toggle:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

.theme-toggle-icon {
  width: 20px;
  height: 20px;
  transition: transform 0.2s ease;
}

.theme-toggle:active .theme-toggle-icon {
  transform: scale(0.9);
}
```

## 🌍 Internationalization Support

### Language Switcher
```css
.language-switcher {
  position: relative;
}

.language-button {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  background: var(--bg-secondary);
  border: 1px solid var(--border-light);
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: var(--text-body-sm);
  color: var(--text-secondary);
  min-height: 44px;
}

.language-button:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

.language-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: var(--space-2);
  background: var(--bg-primary);
  border: 1px solid var(--border-light);
  border-radius: 0.75rem;
  box-shadow: 
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  min-width: 120px;
  z-index: 50;
}

.language-option {
  display: block;
  width: 100%;
  padding: var(--space-3) var(--space-4);
  text-align: left;
  font-size: var(--text-body-sm);
  color: var(--text-secondary);
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.language-option:hover,
.language-option.active {
  background: var(--bg-accent);
  color: var(--color-primary-600);
}

.language-option:first-child {
  border-top-left-radius: 0.75rem;
  border-top-right-radius: 0.75rem;
}

.language-option:last-child {
  border-bottom-left-radius: 0.75rem;
  border-bottom-right-radius: 0.75rem;
}
```

## 🚀 Performance Optimizations

### CSS Custom Properties Strategy
- Use CSS custom properties for theme values
- Minimize specificity conflicts
- Enable efficient theme switching
- Reduce CSS bundle size through reuse

### Loading Strategies
```css
/* Critical CSS above the fold */
.above-fold {
  /* Inline critical styles */
}

/* Progressive enhancement */
.enhanced {
  /* Non-critical styles loaded async */
}

/* Font loading optimization */
@font-face {
  font-family: 'Inter';
  font-display: swap; /* FOIT prevention */
  src: url('/fonts/inter-var.woff2') format('woff2');
}
```

## 📋 Implementation Checklist

### Phase 1: Foundation
- [ ] Update CSS custom properties system
- [ ] Implement responsive typography scale
- [ ] Set up spacing system (8px grid)
- [ ] Configure dark mode variables

### Phase 2: Navigation
- [ ] Implement desktop navigation with visible search
- [ ] Create mobile bottom navigation
- [ ] Add search modal/dropdown functionality
- [ ] Implement language switcher improvements

### Phase 3: Components
- [ ] Create hero section variants
- [ ] Build content card components
- [ ] Design form elements and buttons
- [ ] Implement footer component

### Phase 4: Accessibility
- [ ] Test WCAG 2.1 AA compliance
- [ ] Implement focus management
- [ ] Add screen reader support
- [ ] Test keyboard navigation

### Phase 5: Performance
- [ ] Optimize CSS delivery
- [ ] Implement font loading strategy
- [ ] Test mobile performance
- [ ] Validate Core Web Vitals

## 🎨 Tailwind CSS Classes

### Primary Components
```html
<!-- Navigation Desktop -->
<nav class="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 backdrop-blur-sm">

<!-- Navigation Mobile Bottom -->
<nav class="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 z-50 pb-safe">

<!-- Primary Button -->
<button class="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-all duration-200 min-h-[44px]">

<!-- Blog Post Card -->
<article class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:border-primary-200 hover:shadow-lg transition-all duration-200">

<!-- Search Input -->
<input class="w-full h-11 px-4 pl-12 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all">

<!-- Hero Title -->
<h1 class="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
```

This comprehensive design system addresses all the UX issues identified while maintaining modern aesthetics, accessibility compliance, and optimal performance for the jayleekr.github.io blog.