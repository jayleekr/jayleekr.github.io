# Markdown Rendering Test Plan

## Issue Summary
Dark mode rendering issue where inline code blocks and possibly other markdown elements appear as black bars instead of readable text.

## Root Cause Analysis
CSS specificity conflicts in dark mode causing:
- Text color inheriting dark color on dark background
- Conflicting styles between Shiki syntax highlighting and custom CSS
- Multiple CSS files applying different colors to code elements

## Test Scenarios

### 1. Theme Switching Tests
- [ ] Light mode → Dark mode transition
- [ ] Dark mode → Light mode transition
- [ ] Page reload in dark mode
- [ ] Page reload in light mode
- [ ] System preference detection

### 2. Code Block Rendering Tests
- [ ] Inline code in light mode
- [ ] Inline code in dark mode
- [ ] Code blocks with syntax highlighting (light)
- [ ] Code blocks with syntax highlighting (dark)
- [ ] Multi-line code blocks
- [ ] Nested code elements

### 3. Browser Compatibility Tests
- [ ] Chrome/Chromium
- [ ] Firefox
- [ ] Safari/WebKit
- [ ] Edge

### 4. Content Type Tests
- [ ] Korean text with inline code
- [ ] English text with inline code
- [ ] Mixed language content
- [ ] Special characters in code
- [ ] Long code lines (horizontal scroll)

### 5. Visual Regression Tests
- [ ] Compare screenshots before/after fix
- [ ] Check color contrast ratios
- [ ] Verify syntax highlighting colors
- [ ] Check border and background colors

## Implementation Strategy

### Phase 1: Quick Fix
1. Add emergency CSS override for immediate resolution
2. Ensure proper text color in dark mode for all code elements
3. Test across all browsers

### Phase 2: Permanent Solution
1. Consolidate CSS rules for code elements
2. Fix specificity issues
3. Ensure Shiki theme integration
4. Add CSS custom properties for maintainability

### Phase 3: Prevention
1. Add visual regression tests
2. Implement automated color contrast checking
3. Add CSS linting rules
4. Document theme integration guidelines

## Success Criteria
- [ ] All code elements visible in both light and dark modes
- [ ] Proper syntax highlighting maintained
- [ ] No visual regressions
- [ ] WCAG AAA color contrast compliance
- [ ] Consistent rendering across browsers
- [ ] Smooth theme transitions

## Automated Test Implementation
Will use Playwright for E2E testing with visual comparisons and accessibility checks.