# Component Consistency Checklist

## Brand Compliance Verification

Use this checklist to ensure all components maintain brand consistency and follow the established design system.

### ✅ Color System Compliance

#### Brand Colors
- [ ] Uses primary brand colors from design tokens (`--brand-primary-*`)
- [ ] Interactive elements use `--interactive-primary` and hover states
- [ ] Semantic colors applied correctly (success, warning, error, info)
- [ ] Dark mode colors switch appropriately with theme
- [ ] High contrast mode support implemented

#### Color Usage Guidelines
- [ ] Primary brand color used for main CTAs and key interactive elements
- [ ] Secondary actions use neutral grays or secondary brand colors  
- [ ] Success/error states use semantic color tokens
- [ ] Text colors follow hierarchy (primary, secondary, tertiary)
- [ ] Background colors maintain proper contrast ratios

### ✅ Typography Consistency

#### Font Application
- [ ] Uses `--font-primary` for body text and UI elements
- [ ] Uses `--font-mono` for code and technical content
- [ ] Uses `--font-display` for large headlines when appropriate
- [ ] Font weights follow design system scale (`--font-weight-*`)

#### Type Scale Usage
- [ ] Font sizes use fluid typography tokens (`--text-*`)
- [ ] Line heights use design tokens (`--leading-*`)
- [ ] Letter spacing follows guidelines (`--tracking-*`)
- [ ] Maintains readable text hierarchy

#### Korean Text Support
- [ ] Korean text renders properly with Noto Sans KR
- [ ] Proper spacing and punctuation for Korean content
- [ ] Mixed Korean/English text displays correctly
- [ ] Appropriate font weights for Korean characters

### ✅ Spacing & Layout System

#### Spacing Consistency
- [ ] Uses 8px grid system spacing tokens (`--space-*`)
- [ ] Padding and margins follow design system
- [ ] Content gaps use semantic spacing (`--content-gap`, `--section-gap`)
- [ ] Touch targets meet minimum size requirements (48px)

#### Layout Patterns
- [ ] Container widths use design tokens (`--container-*`)
- [ ] Reading content respects optimal width (`--prose-width`)
- [ ] Responsive breakpoints use design tokens
- [ ] Grid layouts follow consistent patterns

### ✅ Interactive States

#### Hover States
- [ ] Consistent hover effects across similar elements
- [ ] Uses design token colors for hover states
- [ ] Transitions use standardized durations (`--duration-*`)
- [ ] Hover effects respect reduced motion preferences

#### Focus States
- [ ] Visible focus indicators on all interactive elements
- [ ] Focus rings use design token styles (`--shadow-focus`)
- [ ] Focus indicators meet WCAG contrast requirements
- [ ] Keyboard navigation works properly

#### Active States
- [ ] Consistent active/pressed states
- [ ] Visual feedback for all interactive elements
- [ ] Touch feedback on mobile devices
- [ ] Loading states where appropriate

### ✅ Border & Radius System

#### Border Consistency
- [ ] Border widths consistent across components
- [ ] Border colors use design tokens (`--border-*`)
- [ ] Border radius follows design system (`--radius-*`)
- [ ] Consistent border styles (solid, dashed, etc.)

### ✅ Shadow & Elevation

#### Shadow Application
- [ ] Elevation shadows use design tokens (`--shadow-*`)
- [ ] Consistent shadow usage for similar components
- [ ] Focus shadows use standardized tokens
- [ ] No conflicting or mismatched shadows

### ✅ Animation & Transitions

#### Motion Consistency
- [ ] Transition durations use design tokens (`--duration-*`)
- [ ] Easing curves use design tokens (`--ease-*`)
- [ ] Animations respect `prefers-reduced-motion`
- [ ] No jarring or excessive animations

#### Micro-interactions
- [ ] Consistent button press animations
- [ ] Smooth state transitions
- [ ] Loading animations where appropriate
- [ ] Subtle hover effects enhance usability

### ✅ Accessibility Compliance

#### Color Accessibility
- [ ] All text meets WCAG AA contrast ratios (4.5:1 normal, 3:1 large)
- [ ] Color is not the only means of conveying information
- [ ] High contrast mode support implemented
- [ ] Color blindness considerations addressed

#### Keyboard Accessibility
- [ ] All interactive elements keyboard accessible
- [ ] Logical tab order maintained
- [ ] Skip links provided where appropriate
- [ ] Keyboard shortcuts don't conflict

#### Screen Reader Support
- [ ] Proper semantic HTML structure
- [ ] ARIA labels where necessary
- [ ] Alt text for all meaningful images
- [ ] Screen reader friendly error messages

#### Touch & Mobile Accessibility
- [ ] Touch targets minimum 48px × 48px
- [ ] Sufficient spacing between interactive elements
- [ ] Mobile-friendly hover states
- [ ] Readable text sizes on mobile

### ✅ Responsive Design

#### Breakpoint Consistency
- [ ] Uses design token breakpoints
- [ ] Mobile-first responsive approach
- [ ] Content remains readable at all screen sizes
- [ ] Images and media scale appropriately

#### Device-Specific Optimizations
- [ ] Touch device optimizations
- [ ] High-DPI display support
- [ ] Device orientation handling
- [ ] Safe area support for devices with notches

### ✅ Content & Microcopy

#### Brand Voice Consistency
- [ ] Tone matches brand guidelines
- [ ] Technical language appropriate for audience
- [ ] Error messages are helpful and clear
- [ ] Consistent terminology throughout

#### Bilingual Support
- [ ] Korean content uses appropriate formality level
- [ ] Text direction and spacing correct for both languages
- [ ] Language switching works smoothly
- [ ] Cultural sensitivity maintained

### ✅ Performance Considerations

#### Loading Performance
- [ ] Critical CSS inlined for above-the-fold content
- [ ] Non-critical CSS loaded asynchronously
- [ ] Font loading optimized (font-display: swap)
- [ ] Images optimized and properly sized

#### Runtime Performance
- [ ] Smooth animations and transitions
- [ ] No layout thrashing during interactions
- [ ] Efficient CSS selectors used
- [ ] Minimal repaints and reflows

### ✅ Browser Compatibility

#### Cross-Browser Testing
- [ ] Tested in Chrome, Firefox, Safari, Edge
- [ ] Fallbacks for unsupported features
- [ ] Progressive enhancement applied
- [ ] Graceful degradation for older browsers

### ✅ Component-Specific Checks

#### Buttons
- [ ] Consistent sizing across all button variants
- [ ] Proper disabled states
- [ ] Loading states implemented
- [ ] Icon alignment and spacing

#### Forms
- [ ] Consistent input styling
- [ ] Proper validation states
- [ ] Clear error messages
- [ ] Accessible form labels

#### Cards
- [ ] Consistent padding and spacing
- [ ] Proper shadow and border usage
- [ ] Responsive behavior
- [ ] Content hierarchy maintained

#### Navigation
- [ ] Active state indicators
- [ ] Breadcrumb consistency
- [ ] Mobile navigation patterns
- [ ] Keyboard navigation support

## Usage Guidelines

### Before Component Release
1. Review all applicable checklist items
2. Test across different devices and browsers
3. Validate accessibility compliance
4. Performance audit completed
5. Peer review conducted

### Regular Maintenance
- Monthly accessibility audits
- Quarterly design system compliance review
- Performance monitoring and optimization
- User feedback integration

### Documentation Requirements
- Component API documentation
- Usage examples and guidelines
- Accessibility notes
- Browser support matrix
- Performance considerations

## Tools & Resources

### Design System Tools
- Design token CSS file: `/src/styles/design-tokens.css`
- Brand style guide: `/docs/brand-style-guide.md`
- Component library: Storybook (if implemented)

### Testing Tools
- Accessibility: axe-core, WAVE
- Performance: Lighthouse, WebPageTest
- Cross-browser: BrowserStack, Playwright
- Visual regression: Percy, Chromatic

### Validation Commands
```bash
# Accessibility testing
npm run test:a11y

# Performance testing  
npm run test:lighthouse

# Cross-browser testing
npm run test:e2e

# Visual regression testing
npm run test:percy
```

---

## Quick Brand Audit Checklist

For rapid component review, ensure these 8 core elements are consistent:

1. **Colors** → Uses design token colors, proper contrast
2. **Typography** → Design token fonts, sizes, weights
3. **Spacing** → 8px grid system, consistent gaps
4. **Borders** → Design token radius and border styles
5. **Shadows** → Consistent elevation system
6. **States** → Hover, focus, active states implemented
7. **Motion** → Standardized transitions and timing
8. **Accessibility** → WCAG compliance, keyboard support

**Remember**: Consistency builds trust. Every pixel should reinforce the brand identity while serving the user's needs.