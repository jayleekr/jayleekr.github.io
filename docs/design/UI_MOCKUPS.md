# UI Layout Mockups - Visual Design Guide

## Current vs Proposed Layout Comparison

### Current Problem: 3-Column Layout on Laptops (1024-1439px)

```
┌─────────────────────────────────────────────────────────┐
│                    Container: 1152px                     │
├─────────┬─────────────────────────────────┬─────────────┤
│  TOC    │        Main Content             │   Sidebar   │
│  220px  │         ~544px                  │    160px    │
│         │   (TOO NARROW FOR READING!)     │             │
│ ░░░░░░░ │ Lorem ipsum dolor sit amet,     │ Progress: █ │
│ ░░░░░░░ │ consectetur adipiscing elit.     │             │
│ ░░░░░░░ │ This content is squeezed into   │             │
│         │ a narrow column making it hard   │             │
│         │ to read comfortably...           │             │
└─────────┴─────────────────────────────────┴─────────────┘
```

### Proposed Solution: Content-First Layouts

## 1. Mobile Layout (< 768px)

```
┌─────────────────────┐
│ ≡  Jay Lee's Blog   │  <- Header with menu
├─────────────────────┤
│                     │
│   Article Title     │  <- Full width content
│                     │
│ Lorem ipsum dolor   │
│ sit amet, consect   │
│ adipiscing elit...  │
│                     │
│ [Float TOC Button]  │  <- Bottom right FAB
└─────────────────────┘
```

**Key Features:**
- Single column layout
- Floating TOC button (bottom right)
- Full width content with padding
- Optimal mobile typography

## 2. Tablet Layout (768px - 1023px)

```
┌───────────────────────────────────────┐
│          Jay Lee's Blog               │
├───────────────────────────────────────┤
│ ▼ Table of Contents                   │  <- Collapsible
├───────────────────────────────────────┤
│                                       │
│        Article Title                  │
│        ─────────────                  │
│                                       │
│    Lorem ipsum dolor sit amet,        │
│    consectetur adipiscing elit.       │
│    Content is nicely centered         │
│    with optimal reading width...      │
│                                       │
└───────────────────────────────────────┘
```

**Key Features:**
- Collapsible TOC above content
- Content max-width: 65ch (~650px)
- Centered layout
- Comfortable reading experience

## 3. Laptop Layout (1024px - 1535px) - NEW!

```
┌─────────────────────────────────────────────────────┐
│                  Jay Lee's Blog                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│            ┌─────────────────────────┐              │
│            │    Article Title        │              │
│            │    ═════════════        │              │
│            │                         │              │
│            │  Lorem ipsum dolor sit  │              │  
│            │  amet, consectetur      │              │
│            │  adipiscing elit. This  │              │
│            │  content now has the    │              │
│            │  perfect width for      │              │
│            │  comfortable reading    │              │
│            │  on laptop screens...   │              │
│            │                         │              │
│            │  Max-width: 800px       │              │
│            └─────────────────────────┘              │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Key Features:**
- **NO SIDEBARS** - Content is king!
- Content width: 800px (optimal for reading)
- Centered in viewport
- Clean, distraction-free reading

## 4. Desktop Layout (1536px - 1919px)

```
┌──────────────────────────────────────────────────────────┐
│                    Jay Lee's Blog                        │
├────────────┬─────────────────────────────────────────────┤
│            │                                             │
│   TOC      │         Article Title                      │
│            │         ═════════════                      │
│ ░ Intro    │                                            │
│ ░ Section1 │    Lorem ipsum dolor sit amet,             │
│ ░ Section2 │    consectetur adipiscing elit.            │
│ ░ Section3 │    Now with a helpful table of             │
│            │    contents on the left, the               │
│   220px    │    content still maintains                 │
│            │    optimal reading width...                │
│            │                                            │
│            │    Content width: 800px                    │
│            │                                            │
└────────────┴─────────────────────────────────────────────┘
```

**Key Features:**
- Left TOC sidebar (220px)
- Content width: 800px
- Better use of screen space
- TOC for navigation

## 5. Wide Desktop Layout (1920px+)

```
┌───────────────────────────────────────────────────────────────────┐
│                         Jay Lee's Blog                            │
├─────────────┬──────────────────────────────────┬─────────────────┤
│             │                                   │                 │
│    TOC      │        Article Title              │   Tools         │
│             │        ═════════════              │                 │
│ ░ Intro     │                                   │ Reading: 45%    │
│ ░ Section1  │   Lorem ipsum dolor sit amet,     │ ████████░░░░    │
│ ░ Section2  │   consectetur adipiscing elit.    │                 │
│ ░ Section3  │   With plenty of screen space,    │ Time: 3 min     │
│ ░ Section4  │   we can now show additional      │                 │
│             │   tools and features while        │ Share:          │
│    260px    │   maintaining excellent           │ [Twitter] [FB]  │
│             │   readability...                  │                 │
│             │                                   │ Related:        │
│             │   Content width: 900px            │ • Article 1     │
│             │                                   │ • Article 2     │
│             │                                   │                 │
└─────────────┴──────────────────────────────────┴─────────────────┘
```

**Key Features:**
- Full 3-column layout
- TOC (260px) + Content (900px) + Tools (220px)
- Progressive enhancement
- All features visible

## Responsive Behavior Visualization

### Container Width Transitions

```
Device Width:  320px -------- 768px ------- 1024px ------ 1536px ------ 1920px+
               ↓              ↓             ↓             ↓              ↓
Container:     100%-2rem      max-4xl       max-5xl       max-7xl        max-[1600px]
               (288px)        (896px)       (1024px)      (1280px)       (1600px)

Content Width: 100%           65ch          800px         800px          900px
               (288px)        (~650px)      (800px)       (800px)        (900px)

Layout:        Single         Single        Single        2-Column       3-Column
               Column         Column        Column        TOC+Content    Full
```

### Visual Breakpoint Guide

```
Mobile (<768px)
├─ Extra Small (320-475px): Minimal UI, maximum content
└─ Small (475-767px): Slightly larger typography

Tablet (768-1023px)
└─ Collapsible TOC, centered content

Laptop (1024-1535px) ← NEW CATEGORY!
├─ Small Laptop (1024-1279px): 13" screens
└─ Standard Laptop (1280-1535px): 14-15" screens

Desktop (1536-1919px)
└─ Standard desktop with TOC

Wide (1920px+)
├─ Full HD (1920-2559px): All features
└─ 4K+ (2560px+): Maximum enhancement
```

## Typography Scaling

### Font Size Progression

```
                Mobile    Tablet    Laptop    Desktop   Wide
Base Text:      16px      17px      18px      19px      20px
Line Height:    1.75      1.7       1.75      1.7       1.7

H1:             32px      36px      40px      44px      48px
H2:             24px      28px      32px      36px      40px
H3:             20px      22px      24px      28px      32px

Prose Width:    100%      65ch      800px     800px     900px
                (~300px)  (~650px)  (800px)   (800px)   (900px)
```

## Interactive Elements

### TOC Behavior by Device

```
Mobile: Slide-out Overlay
┌─────────┐     ┌─────────┬─────┐
│ Content │ →   │ Content │ TOC │
│ [≡]     │     │ (dim)   │     │
└─────────┘     └─────────┴─────┘

Tablet: Accordion Style
┌─────────────┐     ┌─────────────┐
│ ▶ TOC       │ →   │ ▼ TOC       │
├─────────────┤     │   • Item 1  │
│ Content     │     │   • Item 2  │
└─────────────┘     ├─────────────┤
                    │ Content     │
                    └─────────────┘

Desktop: Fixed Sidebar
┌────┬────────┐
│TOC │Content │  ← Always visible
│    │        │     with highlighting
└────┴────────┘
```

## Color Scheme & Styling

### Visual Hierarchy

```
Background Layers:
┌─────────────────────────────┐
│ Page Background             │ gray-50 / gray-900
│ ┌─────────────────────────┐ │
│ │ Content Background      │ │ white / gray-800
│ │ ┌─────────────────────┐ │ │
│ │ │ TOC Background      │ │ │ gray-50 / gray-850
│ │ └─────────────────────┘ │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘

Accent Colors:
Primary: blue-600 / blue-400
Secondary: gray-600 / gray-400
Success: green-600 / green-400
Warning: yellow-600 / yellow-400
```

## Implementation Priority

### Phase 1 (Quick Wins)
1. Fix laptop layout (remove sidebars)
2. Increase container widths
3. Adjust content max-width

### Phase 2 (Core Redesign)
1. Implement new breakpoint system
2. Create responsive grid layouts
3. Refactor TOC component

### Phase 3 (Enhancement)
1. Add reading progress features
2. Implement smooth animations
3. Add keyboard navigation
4. Optimize for print

## Conclusion

This mockup guide provides a clear visual representation of how the content-first approach will dramatically improve readability across all devices, with special attention to the neglected laptop screen sizes that many developers use daily.