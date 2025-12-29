# Testing Strategy Documentation

## Overview

This document outlines the comprehensive testing strategy for the jayleekr.github.io blog site, including unit tests, integration tests, accessibility tests, performance tests, and CI/CD pipeline configuration.

## Test Architecture

### Testing Pyramid Structure

```
                    /\
                   /  \
                  /    \
                 / E2E  \     ← Few tests, high confidence
                /        \
               /          \
              /____________\
             /              \
            /  Integration   \   ← Some tests, medium confidence
           /                  \
          /____________________\
         /                      \
        /      Unit Tests        \  ← Many tests, low confidence
       /________________________\
```

### Test Types Implemented

1. **Unit Tests** (Vitest + Testing Library)
   - Component functionality
   - Utility functions
   - Business logic
   - Fast execution (<100ms per test)

2. **Integration Tests** (Playwright)
   - User journeys
   - Component interactions
   - Cross-browser compatibility
   - API integrations

3. **Accessibility Tests** (Axe + Playwright)
   - WCAG 2.1 AA compliance
   - Screen reader support
   - Keyboard navigation
   - Color contrast

4. **Performance Tests** (Lighthouse CI + Playwright)
   - Core Web Vitals
   - Resource budgets
   - Loading performance
   - Runtime performance

5. **Visual Regression Tests** (Percy + Playwright)
   - UI consistency
   - Cross-browser rendering
   - Responsive design validation

## Test Coverage Goals

- **Unit Tests**: ≥80% code coverage
- **Critical User Paths**: 100% E2E coverage
- **Accessibility**: WCAG 2.1 AA compliance (≥95% score)
- **Performance**: Core Web Vitals within Google's "Good" thresholds

## Critical User Journeys Tested

### 1. Mobile Navigation Journey
- ✅ Mobile bottom navigation functionality
- ✅ Theme toggle on mobile
- ✅ Search modal from mobile
- ✅ Language switching
- ✅ Navigation state persistence

### 2. Desktop Navigation Journey
- ✅ Header navigation
- ✅ Search keyboard shortcuts (Cmd+K, /)
- ✅ Theme toggle functionality
- ✅ Responsive breakpoint behavior

### 3. Search Functionality Journey
- ✅ Search modal open/close
- ✅ Search input and debouncing
- ✅ Keyboard navigation in results
- ✅ Search result interaction
- ✅ Accessibility compliance

### 4. Theme System Journey
- ✅ Light/dark theme toggle
- ✅ System preference detection
- ✅ Theme persistence across pages
- ✅ Smooth transitions
- ✅ Accessibility announcements

### 5. About Page Experience
- ✅ Page loading and rendering
- ✅ Content accessibility
- ✅ Interactive elements
- ✅ Responsive behavior

## Test File Structure

```
tests/
├── e2e/                          # End-to-end tests
│   ├── accessibility.spec.ts     # WCAG compliance tests
│   ├── homepage.spec.ts          # Basic homepage tests
│   ├── performance.spec.ts       # Performance and Core Web Vitals
│   ├── user-journeys.spec.ts     # Critical user flow tests
│   └── visual.spec.ts            # Visual regression tests
│
src/
├── components/
│   └── __tests__/                # Unit tests
│       ├── BaseHead.test.ts
│       ├── FormattedDate.test.ts
│       ├── Navigation.test.ts    # Navigation component tests
│       ├── Search.test.ts        # Search functionality tests
│       └── ThemeToggle.test.ts   # Theme system tests
│
└── test/
    └── setup.ts                  # Test configuration and mocks
```

## Test Configuration

### Vitest (Unit Tests)
- **Environment**: jsdom
- **Setup**: Mock browser APIs, localStorage, matchMedia
- **Coverage**: v8 reporter with HTML output
- **Globals**: Enabled for describe/it/expect

### Playwright (E2E Tests)
- **Browsers**: Chromium, WebKit, Mobile Chrome, Mobile Safari
- **Viewports**: 320px, 375px, 768px, 1024px, 1200px
- **Base URL**: http://localhost:4321
- **Retry**: 2 retries in CI, 0 locally
- **Timeout**: 30s per test, 120s server startup

### Axe (Accessibility)
- **Standard**: WCAG 2.1 AA
- **Tags**: wcag2a, wcag2aa, wcag21aa
- **Integration**: @axe-core/playwright
- **Coverage**: All pages and components

### Lighthouse CI (Performance)
- **Runs**: 3 per URL for consistency
- **URLs**: Homepage, Blog, About page
- **Budgets**: Performance >90%, Accessibility >95%
- **Core Web Vitals**: LCP <2.5s, FID <100ms, CLS <0.1

## Performance Budgets

### Core Web Vitals Thresholds
- **Largest Contentful Paint (LCP)**: <2.5 seconds
- **First Input Delay (FID)**: <100 milliseconds
- **Cumulative Layout Shift (CLS)**: <0.1
- **First Contentful Paint (FCP)**: <1.8 seconds
- **Total Blocking Time (TBT)**: <200 milliseconds

### Resource Budgets
- **HTML**: <50KB per page
- **CSS**: <100KB total
- **JavaScript**: <200KB total
- **Images**: <500KB total
- **Total Page Size**: <1MB

### Loading Performance
- **Page Load Time**: <3 seconds on 3G
- **Time to Interactive**: <3.8 seconds
- **Speed Index**: <3 seconds

## Accessibility Standards

### WCAG 2.1 AA Compliance
- **Level A**: All criteria met
- **Level AA**: All criteria met (target: >95% score)
- **Color Contrast**: 4.5:1 for normal text, 3:1 for large text
- **Keyboard Navigation**: All interactive elements accessible
- **Screen Reader**: Proper semantic markup and ARIA labels

### Tested Accessibility Features
- ✅ Proper heading hierarchy (single H1 per page)
- ✅ Navigation landmarks and labels
- ✅ Form input labels and descriptions
- ✅ Image alt text
- ✅ Link descriptions (no "click here")
- ✅ Focus indicators and keyboard navigation
- ✅ Color-blind friendly design
- ✅ Reduced motion support
- ✅ High contrast mode compatibility

## CI/CD Pipeline

### GitHub Actions Workflow
The CI/CD pipeline runs on every push and pull request:

1. **Lint and Type Check**
   - ESLint for code quality
   - TypeScript type checking
   - Code formatting validation

2. **Unit Tests**
   - Vitest test execution
   - Coverage reporting
   - Upload to Codecov

3. **E2E Tests**
   - Cross-browser testing
   - User journey validation
   - Test artifact upload

4. **Accessibility Tests**
   - WCAG compliance validation
   - Screen reader compatibility
   - Keyboard navigation testing

5. **Performance Tests**
   - Core Web Vitals measurement
   - Resource budget validation
   - Performance regression detection

6. **Lighthouse CI**
   - Automated performance audits
   - SEO validation
   - Best practices checking

7. **Security Audit**
   - Dependency vulnerability scanning
   - Security best practices validation

8. **Quality Gate**
   - All tests must pass
   - Performance budgets met
   - Accessibility standards met
   - No security vulnerabilities

9. **Deployment** (on main/master branch)
   - Build optimization
   - Deploy to GitHub Pages
   - Cache invalidation

### Quality Gates
All of the following must pass for deployment:
- ✅ Lint and type check
- ✅ Unit tests (≥80% coverage)
- ✅ E2E tests (all critical paths)
- ✅ Accessibility tests (≥95% score)
- ✅ Performance tests (meet budgets)
- ✅ Security audit (no high/critical vulnerabilities)

## Running Tests Locally

### Prerequisites
```bash
npm install
npx playwright install --with-deps
```

### Test Commands
```bash
# Run all tests
npm run test:all

# Unit tests
npm run test:unit
npm run test:coverage
npm run test:watch

# E2E tests
npm run test:e2e
npm run test:e2e:headed
npm run test:e2e:ui

# Specific test suites
npm run test:e2e tests/e2e/accessibility.spec.ts
npm run test:e2e tests/e2e/performance.spec.ts

# Lighthouse CI
npm run test:lighthouse

# Development server for testing
npm run dev
npm run preview
```

### Debug Tests
```bash
# Debug E2E tests with browser UI
npm run test:e2e:ui

# Run tests in headed mode
npm run test:e2e:headed

# Debug specific test
npx playwright test tests/e2e/user-journeys.spec.ts --debug
```

## Test Data and Mocks

### Mocked APIs
- `window.matchMedia` - Responsive design testing
- `localStorage` / `sessionStorage` - Theme persistence
- `IntersectionObserver` - Lazy loading and animations
- `ResizeObserver` - Responsive component behavior

### Test Data
- Sample blog posts for search testing
- Category and tag data for navigation
- User personas for accessibility testing
- Performance baselines for regression testing

## Continuous Improvement

### Metrics Tracking
- Test execution time trends
- Flaky test identification
- Coverage trend analysis
- Performance benchmark tracking

### Regular Reviews
- Monthly test suite health check
- Quarterly performance budget review
- Accessibility standard updates
- New browser/device coverage

### Test Maintenance
- Remove or update obsolete tests
- Refactor brittle tests
- Update test data and fixtures
- Performance optimization of test suite

## Troubleshooting

### Common Issues

**Flaky Tests**
- Check for timing issues with `waitForTimeout`
- Use `waitForSelector` instead of fixed timeouts
- Ensure proper test isolation

**Performance Test Failures**
- Check network conditions in CI
- Verify resource budgets are realistic
- Consider server performance variations

**Accessibility Test Failures**
- Validate HTML semantics
- Check ARIA label completeness
- Verify color contrast ratios

**Cross-Browser Issues**
- Test locally with specific browsers
- Check CSS compatibility
- Verify JavaScript API support

### Getting Help
- Check GitHub Actions logs for detailed error messages
- Use Playwright trace viewer for E2E debugging
- Review coverage reports for unit test gaps
- Consult Lighthouse reports for performance insights

## Future Enhancements

### Planned Improvements
- [ ] Visual regression testing with Percy
- [ ] API testing for dynamic content
- [ ] Mobile device farm testing
- [ ] Automated security scanning
- [ ] Performance monitoring dashboard
- [ ] A/B testing framework integration

### Advanced Testing Techniques
- Mutation testing for test quality
- Property-based testing for edge cases
- Contract testing for API boundaries
- Chaos engineering for reliability
- User behavior analytics integration