# Brand Style Guide - jayleekr.github.io

## Brand Identity

### Brand Values
- **Technical Excellence**: Commitment to high-quality, well-architected solutions
- **Knowledge Sharing**: Accessible technical content for developers
- **Cultural Bridge**: Seamless bilingual experience (Korean/English)
- **Developer-First**: Optimized for developer productivity and learning
- **Accessibility**: Inclusive design for all users

### Brand Personality
- **Professional yet Approachable**: Technical authority with human warmth
- **Modern & Clean**: Contemporary design with clear information hierarchy
- **Culturally Aware**: Respectful of both Korean and international audiences
- **Performance-Conscious**: Fast, efficient, and responsive experiences

---

## Visual Identity System

### Color System

#### Primary Palette
```css
/* Primary Blue - Technical Trust */
--primary-50: #f0f9ff;   /* Lightest backgrounds */
--primary-100: #e0f2fe;  /* Subtle accents */
--primary-200: #bae6fd;  /* Light interactions */
--primary-300: #7dd3fc;  /* Soft highlights */
--primary-400: #38bdf8;  /* Interactive elements (dark mode) */
--primary-500: #0ea5e9;  /* Main brand color */
--primary-600: #0284c7;  /* Primary actions (light mode) */
--primary-700: #0369a1;  /* Hover states */
--primary-800: #075985;  /* Active states */
--primary-900: #0c4a6e;  /* Darkest accents */
```

#### Semantic Colors
```css
/* Success - Positive actions, confirmations */
--success: #10b981;
--success-light: #34d399;
--success-dark: #059669;

/* Warning - Cautions, pending states */
--warning: #f59e0b;
--warning-light: #fbbf24;
--warning-dark: #d97706;

/* Error - Errors, destructive actions */
--error: #ef4444;
--error-light: #f87171;
--error-dark: #dc2626;

/* Info - Informational content */
--info: #3b82f6;
--info-light: #60a5fa;
--info-dark: #2563eb;
```

#### Neutral Palette
```css
/* Gray Scale - Text, backgrounds, borders */
--gray-50: #f9fafb;    /* Light backgrounds */
--gray-100: #f3f4f6;   /* Subtle backgrounds */
--gray-200: #e5e7eb;   /* Light borders */
--gray-300: #d1d5db;   /* Default borders */
--gray-400: #9ca3af;   /* Placeholder text */
--gray-500: #6b7280;   /* Secondary text */
--gray-600: #4b5563;   /* Body text (light mode) */
--gray-700: #374151;   /* Headings (light mode) */
--gray-800: #1f2937;   /* Dark backgrounds */
--gray-900: #111827;   /* Darkest backgrounds, text (light mode) */
```

#### Theme Tokens
```css
/* Light Theme */
:root {
  --bg-primary: #ffffff;
  --bg-secondary: #f9fafb;
  --bg-tertiary: #f3f4f6;
  
  --text-primary: #111827;
  --text-secondary: #374151;
  --text-tertiary: #6b7280;
  
  --border-primary: #e5e7eb;
  --border-secondary: #d1d5db;
  
  --accent: #0284c7;
  --accent-hover: #0369a1;
}

/* Dark Theme */
.dark {
  --bg-primary: #111827;
  --bg-secondary: #1f2937;
  --bg-tertiary: #374151;
  
  --text-primary: #f9fafb;
  --text-secondary: #e5e7eb;
  --text-tertiary: #9ca3af;
  
  --border-primary: #374151;
  --border-secondary: #4b5563;
  
  --accent: #38bdf8;
  --accent-hover: #7dd3fc;
}
```

### Typography System

#### Font Stack
```css
/* Primary Font - Inter (Latin + Extended) */
--font-primary: 'Inter', 'Noto Sans KR', 'Atkinson', ui-sans-serif, system-ui, sans-serif;

/* Monospace - Code and Technical Content */
--font-mono: 'JetBrains Mono', 'SF Mono', 'Monaco', 'Consolas', monospace;

/* Display - Large Headlines */
--font-display: 'Inter', 'Noto Sans KR', system-ui, sans-serif;
```

#### Type Scale (Fluid Typography)
```css
/* Fluid Typography with clamp() */
--text-xs: clamp(0.75rem, 0.7rem + 0.25vw, 0.8rem);     /* 12-13px */
--text-sm: clamp(0.875rem, 0.85rem + 0.15vw, 0.9375rem); /* 14-15px */
--text-base: clamp(1rem, 0.95rem + 0.25vw, 1.125rem);    /* 16-18px */
--text-lg: clamp(1.125rem, 1.05rem + 0.35vw, 1.25rem);   /* 18-20px */
--text-xl: clamp(1.25rem, 1.15rem + 0.5vw, 1.5rem);      /* 20-24px */
--text-2xl: clamp(1.5rem, 1.35rem + 0.75vw, 1.875rem);   /* 24-30px */
--text-3xl: clamp(1.875rem, 1.65rem + 1.125vw, 2.25rem); /* 30-36px */
--text-4xl: clamp(2.25rem, 1.95rem + 1.5vw, 3rem);       /* 36-48px */
--text-5xl: clamp(3rem, 2.5rem + 2.5vw, 4rem);           /* 48-64px */
--text-6xl: clamp(4rem, 3rem + 5vw, 6rem);               /* 64-96px */
```

#### Font Weights
```css
--font-light: 300;    /* Subtle text, captions */
--font-normal: 400;   /* Body text */
--font-medium: 500;   /* UI elements, emphasis */
--font-semibold: 600; /* Subheadings */
--font-bold: 700;     /* Headings */
--font-extrabold: 800; /* Display text */
```

#### Line Heights
```css
--leading-tight: 1.25;    /* Headlines */
--leading-snug: 1.375;    /* Subheadings */
--leading-normal: 1.5;    /* UI text */
--leading-relaxed: 1.625; /* Body text */
--leading-loose: 1.75;    /* Reading content */
```

#### Letter Spacing
```css
--tracking-tighter: -0.05em; /* Large headlines */
--tracking-tight: -0.025em;  /* Headlines */
--tracking-normal: 0em;      /* Body text */
--tracking-wide: 0.025em;    /* UI text */
--tracking-wider: 0.05em;    /* Buttons, labels */
--tracking-widest: 0.1em;    /* Captions, badges */
```

### Spacing System (8px Grid)

#### Base Unit
```css
--space-unit: 0.25rem; /* 4px base unit */
```

#### Spacing Scale
```css
--space-0: 0;           /* 0px */
--space-1: 0.25rem;     /* 4px */
--space-2: 0.5rem;      /* 8px */
--space-3: 0.75rem;     /* 12px */
--space-4: 1rem;        /* 16px */
--space-5: 1.25rem;     /* 20px */
--space-6: 1.5rem;      /* 24px */
--space-8: 2rem;        /* 32px */
--space-10: 2.5rem;     /* 40px */
--space-12: 3rem;       /* 48px */
--space-16: 4rem;       /* 64px */
--space-20: 5rem;       /* 80px */
--space-24: 6rem;       /* 96px */
```

#### Content Spacing
```css
--content-gap: 1.5rem;    /* 24px - Default content spacing */
--section-gap: 3rem;      /* 48px - Section spacing */
--page-gap: 4rem;         /* 64px - Page-level spacing */
```

### Border Radius System

```css
--radius-none: 0;
--radius-sm: 0.125rem;    /* 2px - Small elements */
--radius-default: 0.25rem; /* 4px - Buttons, inputs */
--radius-md: 0.375rem;    /* 6px - Cards, panels */
--radius-lg: 0.5rem;      /* 8px - Large cards */
--radius-xl: 0.75rem;     /* 12px - Prominent elements */
--radius-2xl: 1rem;       /* 16px - Hero sections */
--radius-full: 9999px;    /* Full rounded - Pills, avatars */
```

### Shadow System

```css
/* Elevation Shadows */
--shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);

/* Interactive Shadows */
--shadow-focus: 0 0 0 3px rgba(59, 130, 246, 0.1);
--shadow-focus-dark: 0 0 0 3px rgba(147, 197, 253, 0.1);
```

### Animation & Transitions

```css
/* Duration */
--duration-fast: 150ms;      /* Quick interactions */
--duration-normal: 200ms;    /* Standard transitions */
--duration-slow: 300ms;      /* Smooth transitions */
--duration-slower: 500ms;    /* Emphasis transitions */

/* Timing Functions */
--ease-linear: linear;
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);

/* Common Transitions */
--transition-colors: color var(--duration-normal) var(--ease-in-out),
                    background-color var(--duration-normal) var(--ease-in-out),
                    border-color var(--duration-normal) var(--ease-in-out);

--transition-transform: transform var(--duration-normal) var(--ease-in-out);
--transition-opacity: opacity var(--duration-normal) var(--ease-in-out);
--transition-all: all var(--duration-normal) var(--ease-in-out);
```

---

## Component Design Tokens

### Buttons
```css
/* Button Sizing */
--btn-size-sm: 2rem;      /* 32px height */
--btn-size-md: 2.5rem;    /* 40px height */
--btn-size-lg: 3rem;      /* 48px height */

/* Button Padding */
--btn-padding-sm: 0.5rem 0.75rem;
--btn-padding-md: 0.625rem 1rem;
--btn-padding-lg: 0.75rem 1.5rem;
```

### Form Elements
```css
/* Input Sizing */
--input-height-sm: 2rem;
--input-height-md: 2.5rem;
--input-height-lg: 3rem;

/* Input Padding */
--input-padding-x: 0.75rem;
--input-padding-y: 0.5rem;
```

### Cards & Containers
```css
--card-padding: 1.5rem;
--card-padding-sm: 1rem;
--card-padding-lg: 2rem;

--container-padding: 1rem;
--container-padding-md: 1.5rem;
--container-padding-lg: 2rem;
```

---

## Content Guidelines

### Reading Optimization
```css
/* Optimal Reading Widths */
--prose-width: 65ch;        /* ~600-700px - Optimal */
--prose-width-narrow: 55ch; /* ~500-550px - Mobile */
--prose-width-wide: 75ch;   /* ~700-800px - Wide layouts */
```

### Content Hierarchy
1. **H1**: Page title, article headlines (--text-5xl, --font-extrabold)
2. **H2**: Section titles (--text-4xl, --font-bold)
3. **H3**: Subsection titles (--text-3xl, --font-semibold)
4. **H4**: Content blocks (--text-2xl, --font-semibold)
5. **Body**: Main content (--text-base, --font-normal)
6. **Caption**: Supporting text (--text-sm, --font-normal)

---

## Accessibility Standards

### Contrast Requirements
- **Normal text**: 4.5:1 minimum (WCAG AA)
- **Large text**: 3:1 minimum (WCAG AA)
- **Interactive elements**: 4.5:1 minimum
- **Focus indicators**: 3:1 minimum against background

### Touch Targets
- **Minimum size**: 44px × 44px (iOS), 48px × 48px (Android)
- **Spacing**: 8px minimum between interactive elements
- **Focus area**: Minimum 24px × 24px

### Motion & Animation
- Respect `prefers-reduced-motion`
- Maximum animation duration: 500ms for non-essential animations
- Essential animations: Use duration ≤ 200ms

---

## Responsive Design Tokens

### Breakpoints
```css
--breakpoint-xs: 475px;
--breakpoint-sm: 640px;
--breakpoint-md: 768px;    /* Tablet */
--breakpoint-lg: 1024px;   /* Small laptop */
--breakpoint-laptop: 1280px; /* Standard laptop */
--breakpoint-xl: 1366px;   /* Large laptop */
--breakpoint-desktop: 1536px; /* Desktop */
--breakpoint-2xl: 1680px;  /* Large desktop */
--breakpoint-wide: 1920px; /* Ultra-wide */
```

### Container Sizes
```css
--container-xs: 100%;
--container-sm: 640px;
--container-md: 768px;
--container-lg: 1024px;
--container-xl: 1280px;
--container-2xl: 1536px;
```

---

## Brand Voice & Tone

### Writing Principles
1. **Clear & Concise**: Technical accuracy without jargon overload
2. **Helpful & Supportive**: Guidance-focused, solution-oriented
3. **Culturally Sensitive**: Respectful of both Korean and international contexts
4. **Professional & Friendly**: Authoritative yet approachable

### Content Tone Guidelines

#### Technical Documentation
- **Tone**: Direct, precise, instructional
- **Voice**: Expert guide, patient teacher
- **Language**: Clear technical language with explanations

#### Blog Posts
- **Tone**: Conversational, insightful, engaging
- **Voice**: Experienced developer sharing knowledge
- **Language**: Technical but accessible, with real-world examples

#### UI Microcopy
- **Tone**: Helpful, clear, reassuring
- **Voice**: Supportive assistant
- **Language**: Simple, actionable, positive

### Bilingual Content Standards

#### Korean Content (ko)
- Use formal speech level (존댓말) for professional content
- Maintain technical accuracy in Korean terms
- Provide English technical terms in parentheses when helpful
- Respect Korean typography conventions (proper spacing, punctuation)

#### English Content (en)
- American English spelling and conventions
- Clear, direct technical writing
- Inclusive language
- International audience awareness

---

## Implementation Checklist

### Design System Implementation
- [ ] CSS custom properties defined in `:root`
- [ ] Dark mode variables in `.dark` class
- [ ] Responsive breakpoints configured
- [ ] Typography scale implemented
- [ ] Color system tokens applied
- [ ] Spacing system based on 8px grid
- [ ] Component tokens defined

### Accessibility Implementation
- [ ] Color contrast ratios validated (WCAG AA)
- [ ] Focus indicators implemented
- [ ] Touch targets meet minimum sizes
- [ ] Reduced motion preferences respected
- [ ] High contrast mode supported
- [ ] Screen reader compatibility tested

### Performance Optimization
- [ ] Font loading optimized (font-display: swap)
- [ ] CSS custom properties used for theming
- [ ] Minimal CSS bundle size
- [ ] Critical CSS inlined
- [ ] Unused styles purged

### Content Quality
- [ ] Reading widths optimized (55-75ch)
- [ ] Typography hierarchy clear
- [ ] Bilingual content properly structured
- [ ] Code syntax highlighting implemented
- [ ] Image optimization and alt text

### Brand Consistency
- [ ] Color usage follows guidelines
- [ ] Typography hierarchy maintained
- [ ] Spacing system applied consistently
- [ ] Component design tokens used
- [ ] Brand voice reflected in all content

---

This brand style guide establishes the foundation for a cohesive, accessible, and professional developer blog that serves both Korean and international audiences while maintaining excellent technical standards.