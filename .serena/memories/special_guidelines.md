# Special Guidelines and Patterns

## Design Principles
1. **Content-First Philosophy**: All design decisions prioritize content readability
2. **Minimalist Design**: Clean, simple interfaces without clutter
3. **Typography Focus**: Excellent typography with Inter + Noto Sans KR fonts
4. **Responsive-First**: Mobile-first approach with progressive enhancement

## Development Patterns

### Astro Component Pattern
```astro
---
// Component script (server-side)
import type { ComponentProps } from './types';

interface Props {
  title: string;
  optional?: boolean;
}

const { title, optional = false } = Astro.props;
---

<div>
  <!-- Component template -->
  <h1>{title}</h1>
</div>

<script>
  // Client-side JavaScript
</script>

<style>
  /* Scoped styles */
</style>
```

### Content Collection Pattern
```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    author: z.string(),
    pubDate: z.string(),
    categories: z.array(z.string()),
    tags: z.array(z.string()),
    description: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});
```

### Component Organization
- **Atomic Design**: Components organized by complexity (atoms, molecules, organisms)
- **Single Responsibility**: Each component has one clear purpose
- **Composition over Inheritance**: Prefer composition patterns

## Performance Guidelines
1. **Lighthouse Score**: Maintain ≥ 90 performance score
2. **First Load Time**: Target ≤ 3 seconds
3. **Core Web Vitals**: LCP < 2.5s, FID < 100ms, CLS < 0.1
4. **Image Optimization**: Use Astro Image component with lazy loading
5. **Code Splitting**: Intelligent chunking via Vite rollup configuration

## Accessibility Guidelines
1. **WCAG 2.1 AA Compliance**: All features must meet accessibility standards
2. **Semantic HTML**: Use proper HTML5 semantic elements
3. **ARIA Attributes**: Add where HTML semantics insufficient
4. **Keyboard Navigation**: All interactive elements keyboard accessible
5. **Color Contrast**: Minimum 4.5:1 contrast ratio for text

## SEO Best Practices
1. **Structured Data**: JSON-LD for articles, breadcrumbs, organization
2. **Meta Tags**: Open Graph and Twitter Cards for social sharing
3. **Sitemap**: Auto-generated with proper i18n configuration
4. **Robots.txt**: Proper crawling directives
5. **Performance**: Fast loading times benefit SEO

## Multilingual Strategy
1. **Content Organization**: Separate /ko and /en directories
2. **URL Structure**: Language prefix in URLs (/en/blog/, /ko/blog/)
3. **Navigation**: Language switcher in header
4. **SEO**: hreflang tags for language variants
5. **i18n**: astro-i18next for routing and translations

## AI Content Policy (CRITICAL)
- **NO AI-GENERATED BLOG POSTS**: AI must not create blog posts or personal content
- **AI Role**: Technical implementation, structure, editing assistance only
- **Human Authorship**: All blog content must be human-written
- **Content Authenticity**: Maintain personal voice and experience

## Deployment Best Practices
1. **Type Safety**: Always run type-check before deployment
2. **Testing**: Run unit and E2E tests for critical changes
3. **Build Validation**: Ensure production build succeeds
4. **GitHub Actions**: Use automated deployment for consistency
5. **Native Deployment**: Use deploy-native.sh for immediate updates only when necessary

## Design System Constraints
1. **Typography**: Inter (headings), Noto Sans KR (Korean), JetBrains Mono (code)
2. **Color Palette**: Tailwind CSS default with custom dark theme
3. **Spacing**: Tailwind spacing scale (4px increments)
4. **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px), 2xl (1536px)
5. **Component Library**: Custom Astro components, no external UI library
