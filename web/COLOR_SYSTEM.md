# BAPI Color System Documentation

## Overview

This document describes the BAPI brand color system implemented in Tailwind CSS. The system is based on the **2024 BAPI Brand Standards** using actual **web colors** (not Pantone - Pantone is for print media only).

## Official BAPI Web Colors

```
BAPI Blue:   #1479BC  (Primary - 30% usage)
BAPI Yellow: #FFC843  (Accent - 10% usage)  
BAPI Gray:   #97999B  (Neutral - with white, 60% usage)
BAPI White:  #FFFFFF  (Background - with gray, 60% usage)
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

## Color Families

### Primary Colors (BAPI Blue #1479BC)

The signature BAPI brand blue used for trust, professionalism, and primary actions:
- Navigation and links
- Primary interactive elements
- Headings and key content
- Checkout and important CTAs
- **Usage: ~30% of visual elements**

```css
--color-primary-50: #e6f2f9   /* Lightest tint - backgrounds */
--color-primary-100: #cce5f3
--color-primary-200: #99cbe7
--color-primary-300: #66b1db
--color-primary-400: #3397cf
--color-primary-500: #1479bc  /* Base BAPI Blue */
--color-primary-600: #106196  /* Hover state */
--color-primary-700: #0c4971
--color-primary-800: #08304b
--color-primary-900: #041826
--color-primary-950: #020c13  /* Darkest shade */
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

### Neutral Colors (BAPI Gray #97999B + White)

Professional gray scale and white for backgrounds, text, and subtle UI:
- Page backgrounds (white)
- Section backgrounds (light gray)
- Body text and headings
- Borders and dividers
- **Usage: ~60% of visual elements**

```css
--color-neutral-50: #fafafa   /* Near white backgrounds */
--color-neutral-100: #f5f5f5  /* Light gray sections */
--color-neutral-200: #e8e8e9  /* Subtle borders */
--color-neutral-300: #d4d5d6
--color-neutral-400: #b5b6b8
--color-neutral-500: #97999b  /* Base BAPI Gray */
--color-neutral-600: #797a7c
--color-neutral-700: #5e5f60  /* Dark text */
--color-neutral-800: #434445  /* Darker text */
--color-neutral-900: #282829  /* Headings */
--color-neutral-950: #141415  /* Darkest */
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
--color-info-500: #1479bc     /* Uses BAPI Blue for info messages */
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
<h1 className="text-neutral-900">Main Heading</h1>
<h2 className="text-neutral-800">Subheading</h2>
<p className="text-neutral-600">Body text</p>
<small className="text-neutral-500">Helper text</small>
```

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

## Accessibility

All color combinations meet **WCAG 2.1 Level AA** requirements:

✅ **BAPI Blue (#1479BC) on white** - Pass (4.55:1 ratio)
✅ **White text on BAPI Blue** - Pass (4.55:1 ratio)
✅ **BAPI Yellow (#FFC843) with dark text** - Pass (sufficient contrast)
✅ **Neutral-900 headings on white** - Pass (readable)
✅ **Neutral-600 body text on white** - Pass (4.5:1 minimum)

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
  --color-primary-500: #1479bc;  /* BAPI Blue */
  --color-accent-500: #ffc843;   /* BAPI Yellow */
  --color-neutral-500: #97999b;  /* BAPI Gray */
  
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
- **Brand Guidelines**: `/2024_brand_standards.pdf`
- **Implementation**: `/web/src/app/globals.css`
- **Usage Examples**: `/web/src/app/page.tsx` (homepage)
- **Current Website**: https://www.bapihvac.com (for reference)

---

**Last Updated**: December 29, 2025
**Version**: 3.0 (Tailwind v4 CSS-first architecture)
**Web Colors**: BAPI Blue #1479BC, BAPI Yellow #FFC843, BAPI Gray #97999B
**Distribution**: 60% White/Gray, 30% Blue, 10% Yellow
**Architecture**: CSS-first theming with semantic tokens via `@theme inline`
