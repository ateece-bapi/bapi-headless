# BAPI Color System Documentation

## Overview

This document describes the BAPI brand color system implemented in Tailwind CSS. The system is based on the **2026 BAPI Brand Standards** using actual **web colors** (not Pantone - Pantone is for print media only).

## Official BAPI Web Colors (2026 Brand Guide)

```
BAPI Blue (Web/Digital): #166fb9  (Primary - 30% usage)
BAPI Yellow:            #ffc843  (Accent - 10% usage)  
BAPI Gray:              #97999b  (Neutral - with white, 60% usage)
BAPI White:             #FFFFFF  (Background - with gray, 60% usage)
```

**Note:** The 2026 Brand Guide specifies three BAPI Blues for different applications:
- **Web/Digital:** #166fb9 (used in this codebase)
- **Internal Printing:** #0063bc (darker)
- **Business Cards/Booths:** #1479bc (lighter)

We use the **Web/Digital** specification (#166fb9) throughout the digital platform.

## Official BAPI Gradients (2026 Brand Guide)

**Yellow/Orange Gradient (Accent)**
```
Gradient: #f89623 (15%) → #ffc843 (85%) at 135deg
Hover:    #e6872c (15%) → #e6b43c (85%) at 135deg
```
*Note: Per brand guide, lighter color should be 85% of gradient*

**Blue Gradient (Primary)**
```
Gradient: #044976 (0%) → #166fb9 (100%) at 135deg
Hover:    #033a5f (0%) → #125994 (100%) at 135deg
```
*Note: Blue gradient uses full 0-100% range for smoother visual transition*

**Usage in Code:**
```css
/* CSS Variables */
background: var(--gradient-accent);
background: var(--gradient-primary);

/* Utility Classes */
.bg-bapi-accent-gradient
.bg-bapi-primary-gradient
```

## Button Specifications (2026 Brand Guide)

**Yellow Buttons (Primary CTAs):**
- Background: Official yellow gradient
- Text: Black (#000000)
- Text Shadow: **NONE** (per brand guide)
- Drop Shadow: Yes (on button)
- Use for: Add to Cart, Primary CTAs

**Blue Buttons (Secondary CTAs):**
- Background: Official blue gradient
- Text: White (#FFFFFF)
- Text Shadow: **WITH slight drop shadow** (0 1px 2px rgba(0,0,0,0.25))
- Drop Shadow: Yes (on button)
- Use for: View Details, Continue, Secondary actions

**Usage in Code:**
```tsx
<button className="btn-bapi-accent">Add to Cart</button>
<button className="btn-bapi-primary">Continue</button>
```

## Color Distribution Guidelines

**60% White/Gray** - Backgrounds, surfaces, subtle UI elements
**30% BAPI Blue** - Navigation, primary actions, headings, trust elements
**10% BAPI Yellow** - Call-to-action buttons, highlights, accents

These percentages are guidelines for visual balance, not strict rules.

## Design Philosophy

A senior developer approach to color tokens includes:

1. **Semantic naming** - Colors named by purpose (primary, accent) not appearance
2. **Scale consistency** - All color families use 50-950 scale for predictable shading
3. **Accessibility** - Color combinations meet WCAG contrast requirements
4. **Flexibility** - CSS custom properties allow theme switching
5. **Brand alignment** - Matches existing BAPI website color scheme
6. **Official gradients** - 2026 Brand Guide specifications for buttons and graphical elements

## Color Families

### Primary Colors (BAPI Blue #166fb9 - Web/Digital)

The signature BAPI brand blue for web and digital applications used for trust, professionalism, and primary actions:
- Navigation and links
- Primary interactive elements
- Headings and key content
- Checkout and important CTAs
- **Usage: ~30% of visual elements**

```css
--color-primary-50: #e5f1f8   /* Lightest tint - backgrounds */
--color-primary-100: #cce3f2
--color-primary-200: #99c7e4
--color-primary-300: #66abd7
--color-primary-400: #338fc9
--color-primary-500: #166fb9  /* Base BAPI Blue (Web/Digital) */
--color-primary-600: #125994  /* Hover state */
--color-primary-700: #0d436f
--color-primary-800: #092c4a
--color-primary-900: #041625
--color-primary-950: #020b13  /* Darkest shade */
```

**Usage in Tailwind:**
```tsx
<button className="bg-primary-500 hover:bg-primary-600 text-white">
  Proceed to Checkout
</button>
<Link className="text-primary-500 hover:text-primary-600">
  Learn More
</Link>
```

### Accent Colors (BAPI Yellow #FFC843)

High-visibility accent color for drawing attention to key actions:
- Primary call-to-action buttons
- Special offers and highlights  
- Important notifications
- Add to cart buttons
- **Usage: ~10% of visual elements**

```css
--color-accent-50: #fffbf0   /* Lightest tint */
--color-accent-100: #fff7e1
--color-accent-200: #ffefc3
--color-accent-300: #ffe7a5
--color-accent-400: #ffdf87
--color-accent-500: #ffc843  /* Base BAPI Yellow */
--color-accent-600: #e6b43c  /* Hover state */
--color-accent-700: #cca035
--color-accent-800: #b38c2e
--color-accent-900: #997827
--color-accent-950: #4d3c14  /* Darkest shade */
```

**Usage in Tailwind:**
```tsx
<button className="bg-accent-500 hover:bg-accent-600 text-neutral-900">
  Add to Cart
</button>
```

### Neutral Colors (BAPI Gray #979990 + White)

Professional gray scale and white for backgrounds, text, and subtle UI:
- Page backgrounds (white)
- Section backgrounds (light gray)
- Body text and headings
- Borders and dividers
- **Usage: ~60% of visual elements**

```css
--color-neutral-50: #fafafa   /* Near white backgrounds */
--color-neutral-100: #f5f5f5  /* Light gray sections */
--color-neutral-200: #e8e8e7  /* Subtle borders */
--color-neutral-300: #d4d5d3
--color-neutral-400: #b5b6b4
--color-neutral-500: #979990  /* Base BAPI Gray */
--color-neutral-600: #797a74
--color-neutral-700: #5e5f5a  /* Dark text */
--color-neutral-800: #434440  /* Darker text */
--color-neutral-900: #282820  /* Headings */
--color-neutral-950: #141410  /* Darkest */
```

**Usage in Tailwind:**
```tsx
<div className="bg-white">                    {/* Primary surface */}
<div className="bg-neutral-50">               {/* Subtle background */}
<h1 className="text-neutral-900">Main Title</h1>
<p className="text-neutral-600">Body text</p>
```

### Semantic Colors

Purpose-specific colors for user feedback (using BAPI palette where appropriate):

**Success** (Green)
```css
--color-success-500: #22c55e  /* Confirmations, success states */
```

**Warning** (BAPI Yellow)
```css
--color-warning-500: #ffc843  /* Uses BAPI Yellow for warnings */
```

**Error** (Red)
```css
--color-error-500: #ef4444    /* Errors, destructive actions */
```

**Info** (BAPI Blue)
```css
--color-info-500: #166fb9     /* Uses BAPI Blue (Web/Digital) for info messages */
```

**Usage in Tailwind:**
```tsx
<div className="bg-success-50 text-success-700 border border-success-500">
  Order confirmed!
</div>
```

## Usage Guidelines

### Button Hierarchy

**Primary Action (Yellow - 10% usage)**
```tsx
<button className="bg-accent-500 hover:bg-accent-600 text-neutral-900 font-semibold">
  Add to Cart
</button>
```

**Secondary Action (Blue - 30% usage)**
```tsx
<button className="bg-primary-500 hover:bg-primary-600 text-white font-semibold">
  Proceed to Checkout
</button>
```

**Tertiary/Ghost Action**
```tsx
<button className="text-neutral-700 hover:text-primary-500">
  View Details
</button>
```

### Text Hierarchy

```tsx
<h1 className="text-neutral-900">Main Heading (14.73:1 contrast)</h1>
<h2 className="text-neutral-800">Subheading (9.76:1 contrast)</h2>
<p className="text-neutral-700">Body text - WCAG AA standard (6.40:1 contrast)</p>
<small className="text-neutral-700">Helper text - Use neutral-700 minimum</small>

{/* DEPRECATED - Do not use for text content: */}
{/* <small className="text-neutral-500">❌ WCAG VIOLATION (2.86:1)</small> */}
{/* <p className="text-neutral-600">❌ DEPRECATED (4.30:1 fails AA)</p> */}
```

**Accessibility Note:** All text content must use `text-neutral-700` or darker to meet WCAG 2.1 Level AA (4.5:1 minimum contrast). The `text-neutral-500` and `text-neutral-600` classes should **only** be used for decorative elements like icons and borders, never for readable text.

### Backgrounds & Surfaces (60% usage)

```tsx
<div className="bg-white">                    {/* Primary surface */}
<div className="bg-neutral-50">               {/* Subtle section background */}
<div className="bg-neutral-100">              {/* Cards on gray background */}
```

### Links & Navigation (30% usage - Blue)

```tsx
<Link className="text-primary-500 hover:text-primary-600">
  Products
</Link>
<a className="text-primary-500 underline">Learn more</a>
```

### Borders

```tsx
<div className="border border-neutral-200">   {/* Default border */}
<div className="border-2 border-primary-500">  {/* Emphasized border */}
<div className="hover:border-primary-300">     {/* Interactive state */}
```

## Accessibility & WCAG 2.1 Compliance

**Last Updated:** March 5, 2026 (Site-wide accessibility audit)

### WCAG 2.1 Level AA Requirements

**Normal Text (< 18pt or < 14pt bold):**
- Minimum contrast ratio: **4.5:1**
- Applies to: Body text, labels, links, descriptions

**Large Text (≥ 18pt or ≥ 14pt bold):**
- Minimum contrast ratio: **3:1**
- Applies to: Headings, hero text, large CTAs

### BAPI Custom Neutral Colors - Contrast Analysis

All neutral colors tested on **white background (#FFFFFF)**:

| Color | Hex | Contrast | Normal Text | Large Text | Recommended Use |
|-------|-----|----------|-------------|------------|-----------------|
| `neutral-500` | `#979990` | **2.86:1** | ❌ FAILS | ❌ FAILS | ⚠️ Icons, borders, decorative only |
| `neutral-600` | `#797a74` | **4.30:1** | ❌ FAILS | ✅ PASSES | ⚠️ **DEPRECATED** - Use 700+ for text |
| `neutral-700` | `#5e5f5a` | **6.40:1** | ✅ PASSES | ✅ PASSES | ✅ **Body text standard** |
| `neutral-800` | `#434440` | **9.76:1** | ✅ PASSES | ✅ PASSES | ✅ Emphasized text |
| `neutral-900` | `#282820` | **14.73:1** | ✅ PASSES | ✅ PASSES | ✅ Headings |

**Critical Finding (March 2026 Audit):**
- `neutral-600` previously used site-wide **FAILED WCAG AA** (4.30:1 vs 4.5:1 required)
- 1,123 instances replaced with `neutral-700` across 157 files
- `neutral-500` should **NEVER** be used for text content (2.86:1 contrast)

### Approved Color Combinations

✅ **Primary (BAPI Blue) Usage:**
- `bg-primary-500 text-white` - 4.55:1 ✅ PASSES AA
- `text-primary-500` on white - 4.55:1 ✅ PASSES AA
- `bg-primary-600 text-white` - Higher contrast ✅ PASSES AA

✅ **Accent (BAPI Yellow) Usage:**
- `bg-accent-500 text-neutral-900` - High contrast ✅ PASSES AA
- `bg-accent-600 text-neutral-900` - Hover state ✅ PASSES AA

✅ **Text on White Background:**
- `text-neutral-700` - **STANDARD for body text** (6.40:1)
- `text-neutral-800` - Emphasized text (9.76:1)
- `text-neutral-900` - Headings (14.73:1)

❌ **Prohibited for Text Content:**
- `text-neutral-500` - Too light (2.86:1) ❌ FAILS AA
- `text-neutral-600` - Deprecated (4.30:1) ❌ FAILS AA

### Safe Usage Guidelines

#### ✅ DO Use neutral-700 or Darker for Text
```tsx
✅ <p className="text-neutral-700">Body text (6.40:1 contrast)</p>
✅ <h2 className="text-neutral-800">Subheading (9.76:1 contrast)</h2>
✅ <h1 className="text-neutral-900">Main heading (14.73:1 contrast)</h1>
```

#### ⚠️ neutral-500/600 Only for Non-Text Elements
```tsx
✅ <Icon className="text-neutral-500" /> {/* Decorative, not content */}
✅ <div className="border-neutral-500" /> {/* Borders are exempt */}
✅ <div className="bg-neutral-500" /> {/* Backgrounds with contrasting text */}

❌ <p className="text-neutral-500">Body text</p> {/* WCAG VIOLATION */}
❌ <span className="text-neutral-600">Label</span> {/* WCAG VIOLATION */}
```

#### Special Cases
```tsx
✅ <small className="text-sm text-neutral-700">
     Metadata (still needs 4.5:1 for normal text)
   </small>

✅ <h2 className="text-2xl font-bold text-neutral-700">
     Large text can use neutral-700+ (passes 3:1 for large text)
   </h2>
```

### Testing Tools

**Automated:**
- `axe-playwright` in E2E tests (enabled site-wide)
- ESLint plugin: `eslint-plugin-jsx-a11y`

**Manual:**
- WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/
- Chrome DevTools: Lighthouse Accessibility Audit

### Historical Context

**March 2026 Site-Wide Accessibility Fixes:**
1. ✅ Replaced 1,123 instances of `text-neutral-600` → `text-neutral-700`
2. ✅ 157 files updated across entire codebase
3. ✅ Established `neutral-700` as minimum standard for text
4. ⏳ Identified 205 instances of `text-neutral-500` requiring audit

**Design System Standard (Established March 2026):**
- **Always use `neutral-700` or darker for text content**
- neutral-500/600 reserved for decorative elements only
- All new components must pass axe accessibility tests

## Color Distribution in Practice

Based on current BAPI website (reference screenshot):

### Homepage Example
- **60% White/Gray**: Background, product cards, section backgrounds
- **30% Blue**: Header, navigation, "Learn More" buttons, product prices, icons
- **10% Yellow**: Hero CTA button ("Browse Products"), special callouts

### Product Cards
- White background (60%)
- Blue text for product name and price (30%)
- Yellow "Add to Cart" button (10%)

### Navigation
- White background
- Blue logo and active links
- Hover states use blue

## Best Practices

### Do ✅

- Use BAPI Yellow (`accent-*`) sparingly for high-priority CTAs
- Use BAPI Blue (`primary-*`) for navigation, links, and trust elements
- Maintain 60/30/10 color distribution for visual balance
- Use white and light gray for majority of backgrounds
- Test color combinations for accessibility
- Match the established BAPI website aesthetic

### Don't ❌

- Don't overuse yellow - it loses impact (stay near 10%)
- Don't use arbitrary color values (`text-[#abc123]`)
- Don't use Pantone references for web (Pantone is print-only)
- Don't use color alone to convey information
- Don't stray far from the 60/30/10 guideline
- Don't use yellow for destructive actions (use `error-*`)

## Implementation

### Location

All design tokens (colors, spacing, animations) are defined in: `/web/src/app/globals.css`

### Syntax (Tailwind v4)

With Tailwind v4, configuration is **CSS-first** using the `@theme inline` directive. The JavaScript config file (`tailwind.config.js`) only contains content paths.

Colors are defined in globals.css:

```css
@theme inline {
  /* Colors */
  --color-primary-500: #166fb9;  /* BAPI Blue (Web/Digital) */
  --color-accent-500: #ffc843;   /* BAPI Yellow */
  --color-neutral-500: #979990;  /* BAPI Gray */
  
  /* Z-Index Scale */
  --z-dropdown: 1000;
  --z-modal: 1050;
  --z-toast: 1080;
  
  /* Container Widths */
  --width-container: 1600px;
  --width-content: 1200px;
  
  /* Animation Durations */
  --duration-fast: 150ms;
  --duration-base: 200ms;
  --duration-normal: 300ms;
  
  /* ... full scale 50-950 for each color */
}
```

### Usage in Components

**Direct Utility Classes** (Preferred):
```tsx
<div className="bg-primary-500 text-white border-neutral-200">
  Semantic color tokens in utilities
</div>
```

**CSS Custom Properties** (When needed in style prop):
```tsx
<div style={{ backgroundColor: 'var(--color-primary-500)' }}>
  Using CSS variables directly
</div>
```

**Z-Index Usage**:
```tsx
<div className="z-toast">       {/* Toast notifications */}
<div className="z-modal">       {/* Modal dialogs */}
<div className="z-dropdown">    {/* Dropdown menus */}
```

**Container Widths**:
```tsx
<div className="max-w-container mx-auto">  {/* 1600px max */}
<div className="max-w-content mx-auto">    {/* 1200px max */}
<div className="max-w-narrow mx-auto">     {/* 800px max */}
```

**Animation Timing**:
```tsx
<div className="transition-all duration-base">     {/* 200ms */}
<div className="transition-colors duration-fast">  {/* 150ms */}
<div className="animate-[fade-in_300ms_ease-out]"> {/* Custom keyframe */}
```

### Tailwind v4 Migration Notes

**What Changed:**
- ✅ Colors now defined in CSS via `@theme`, not in JS config
- ✅ No need for `theme.extend.colors` in tailwind.config.js
- ✅ Automatic CSS variable generation for all theme values
- ✅ Semantic token names used directly in classes

**Removed:**
- ❌ Legacy `bapi-blue-*`, `bapi-accent-*`, `bapi-gray-*` prefixes
- ❌ Duplicate color definitions in tailwind.config.js
- ❌ Complex JavaScript theme configuration

**How to Update Code:**
```tsx
// OLD (v3 style with bapi- prefix)
<button className="bg-bapi-blue-500 hover:bg-bapi-blue-600">

// NEW (v4 style with semantic names)
<button className="bg-primary-500 hover:bg-primary-600">

// OLD (arbitrary hex values)
<div className="text-[#1479bc]">

// NEW (semantic tokens)
<div className="text-primary-500">

// OLD (hardcoded z-index)
<div className="z-[9999]">

// NEW (semantic scale)
<div className="z-toast">
```

## Color Reference Table

| Use Case | Color Token | Hex Value | Example Class |
|----------|-------------|-----------|---------------|
| Primary CTA (Yellow) | `accent-500` | `#FFC843` | `bg-accent-500` |
| Secondary CTA (Blue) | `primary-500` | `#1479BC` | `bg-primary-500` |
| CTA Hover (Yellow) | `accent-600` | `#E6B43C` | `hover:bg-accent-600` |
| CTA Hover (Blue) | `primary-600` | `#106196` | `hover:bg-primary-600` |
| Main Heading | `neutral-900` | `#282829` | `text-neutral-900` |
| Body Text | `neutral-600` | `#797A7C` | `text-neutral-600` |
| Links | `primary-500` | `#1479BC` | `text-primary-500` |
| Light Background | `neutral-50` | `#FAFAFA` | `bg-neutral-50` |
| White Background | - | `#FFFFFF` | `bg-white` |
| Border Default | `neutral-200` | `#E8E8E9` | `border-neutral-200` |

## Migration Guide

To update existing code:

```tsx
// Before (generic colors)
<button className="bg-blue-600 hover:bg-blue-700">

// After (BAPI blue - secondary actions)
<button className="bg-primary-500 hover:bg-primary-600">

// Before (yellow/gold)
<button className="bg-yellow-500">

// After (BAPI yellow - primary CTAs)
<button className="bg-accent-500 hover:bg-accent-600">

// Before (gray text)
<p className="text-gray-600">

// After (BAPI gray)
<p className="text-neutral-600">
```

## Questions?

For color system questions or updates, refer to:
- **Brand Guidelines**: `/2026 BAPI Brand Guide v7.pdf`
- **Implementation**: `/web/src/app/globals.css`
- **Usage Examples**: `/web/src/app/page.tsx` (homepage)
- **Current Website**: https://www.bapihvac.com (for reference)

---

**Last Updated**: December 29, 2025
**Version**: 3.0 (Tailwind v4 CSS-first architecture)
**Web Colors**: BAPI Blue #166fb9 (Web/Digital), BAPI Yellow #FFC843, BAPI Gray #979990
**Distribution**: 60% White/Gray, 30% Blue, 10% Yellow
**Architecture**: CSS-first theming with semantic tokens via `@theme inline`
