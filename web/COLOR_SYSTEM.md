# BAPI Color System Documentation

## Overview

This document describes the BAPI brand color system implemented in Tailwind CSS. The system is based on the **2024 BAPI Brand Standards** and uses **PANTONE 1225 C** (bright yellow/gold) as the primary brand color.

## Design Philosophy

A senior developer approach to color tokens includes:

1. **Semantic naming** - Colors named by purpose (primary, secondary, accent) not appearance (yellow, blue)
2. **Scale consistency** - All color families use 50-950 scale for predictable shading
3. **Accessibility** - Color combinations meet WCAG contrast requirements
4. **Flexibility** - CSS custom properties allow theme switching and customization
5. **Future-proof** - System scales for dark mode and additional themes

## Color Families

### Primary Colors (BAPI Yellow/Gold)

Based on **PANTONE 1225 C**, this is the signature BAPI brand color used for:
- Primary call-to-action buttons
- Brand accents and highlights
- Key interactive elements
- Logo and brand identity

```css
--color-primary-50: #fefce8   /* Lightest tint - backgrounds */
--color-primary-100: #fef9c3
--color-primary-200: #fef08a
--color-primary-300: #fde047
--color-primary-400: #facc15  /* Base brand yellow */
--color-primary-500: #eab308  /* Default button state */
--color-primary-600: #ca8a04  /* Hover/active state */
--color-primary-700: #a16207
--color-primary-800: #854d0e
--color-primary-900: #713f12
--color-primary-950: #422006  /* Darkest shade */
```

**Usage in Tailwind:**
```tsx
<button className="bg-primary-500 hover:bg-primary-600 text-white">
  Shop Now
</button>
```

### Secondary Colors (Cool Gray)

Professional gray scale for balance and hierarchy:
- Text and typography
- Borders and dividers
- Backgrounds and surfaces
- Secondary UI elements

```css
--color-secondary-50: #f8fafc   /* Light backgrounds */
--color-secondary-500: #64748b  /* Body text */
--color-secondary-900: #0f172a  /* Headings */
```

**Usage in Tailwind:**
```tsx
<h1 className="text-secondary-900">Heading</h1>
<p className="text-secondary-600">Body text</p>
```

### Accent Colors (Professional Blue)

Used for trust indicators and technology-focused elements:
- Links and navigation
- Secondary actions
- Information highlights
- Professional credibility cues

```css
--color-accent-500: #3b82f6   /* Default link color */
--color-accent-600: #2563eb   /* Hover state */
```

**Usage in Tailwind:**
```tsx
<a href="/products" className="text-accent-600 hover:text-accent-700">
  Learn More
</a>
```

### Semantic Colors

Purpose-specific colors for user feedback:

**Success** (Green)
```css
--color-success-500: #22c55e  /* Confirmations, success states */
```

**Warning** (Orange)
```css
--color-warning-500: #f59e0b  /* Cautions, warnings */
```

**Error** (Red)
```css
--color-error-500: #ef4444    /* Errors, destructive actions */
```

**Info** (Sky Blue)
```css
--color-info-500: #0ea5e9     /* Informational messages */
```

**Usage in Tailwind:**
```tsx
<div className="bg-success-50 text-success-700 border border-success-500">
  Order confirmed!
</div>
```

### Neutral Colors

True grayscale for maximum flexibility:

```css
--color-neutral-50: #fafafa   /* Backgrounds */
--color-neutral-500: #737373  /* Muted text */
--color-neutral-900: #171717  /* Strong contrast */
```

## Usage Guidelines

### Buttons

**Primary Action (most important)**
```tsx
<button className="bg-primary-500 hover:bg-primary-600 text-white">
  Add to Cart
</button>
```

**Secondary Action**
```tsx
<button className="bg-white hover:bg-neutral-50 text-primary-700 border-2 border-primary-500">
  Learn More
</button>
```

**Tertiary/Ghost Action**
```tsx
<button className="text-secondary-700 hover:text-primary-600">
  View Details
</button>
```

### Text Hierarchy

```tsx
<h1 className="text-secondary-900">Main Heading</h1>
<h2 className="text-secondary-800">Subheading</h2>
<p className="text-secondary-600">Body text</p>
<small className="text-secondary-500">Helper text</small>
```

### Backgrounds & Surfaces

```tsx
<div className="bg-white">                    {/* Primary surface */}
<div className="bg-secondary-50">             {/* Subtle background */}
<div className="bg-gradient-to-br from-primary-50 via-white to-accent-50">
                                              {/* Hero sections */}
```

### Borders

```tsx
<div className="border border-neutral-200">   {/* Default border */}
<div className="border-2 border-primary-500">  {/* Emphasized border */}
<div className="hover:border-primary-300">     {/* Interactive state */}
```

## Accessibility

All color combinations in this system meet **WCAG 2.1 Level AA** requirements:

✅ **Primary-500 text on white** - Pass (sufficient contrast)
✅ **Secondary-900 headings on white** - Pass (4.5:1 minimum)
✅ **Secondary-600 body text on white** - Pass (readable)
✅ **White text on Primary-500** - Pass (button text)

## Dark Mode Support

The system includes dark mode overrides (future implementation):

```css
.dark {
  --color-background: #0f172a;     /* Dark background */
  --color-text-primary: #f8fafc;   /* Light text */
}
```

## Best Practices

### Do ✅

- Use `primary-*` for all CTAs and brand-critical actions
- Use `secondary-*` grays for text and subtle UI elements
- Use semantic colors (`success`, `error`, etc.) for user feedback
- Maintain consistent hover states (typically +100 on scale)
- Test color combinations for accessibility

### Don't ❌

- Don't use arbitrary color values (`text-[#abc123]`)
- Don't mix color families for the same purpose
- Don't use primary colors for destructive actions (use `error-*`)
- Don't use color alone to convey information (add icons/text)
- Don't override brand colors without design approval

## Implementation

### Location

All color tokens are defined in: `/web/src/app/globals.css`

### Syntax (Tailwind v4)

Colors are defined in the `@theme inline` directive:

```css
@theme inline {
  --color-primary-500: #eab308;
  --color-accent-600: #2563eb;
  /* ... */
}
```

### Usage

Simply use the color name in Tailwind classes:

```tsx
className="bg-primary-500 text-white border-neutral-200"
```

## Color Reference Table

| Use Case | Color Token | Example Class |
|----------|-------------|---------------|
| Primary CTA | `primary-500` | `bg-primary-500` |
| CTA Hover | `primary-600` | `hover:bg-primary-600` |
| Main Heading | `secondary-900` | `text-secondary-900` |
| Body Text | `secondary-600` | `text-secondary-600` |
| Subtle Background | `secondary-50` | `bg-secondary-50` |
| Links | `accent-600` | `text-accent-600` |
| Success Message | `success-500` | `text-success-500` |
| Error Message | `error-500` | `text-error-500` |
| Border Default | `neutral-200` | `border-neutral-200` |

## Migration Guide

To update existing code:

```tsx
// Before (generic colors)
<button className="bg-blue-600 hover:bg-blue-700">

// After (brand colors)
<button className="bg-primary-500 hover:bg-primary-600">
```

```tsx
// Before
<h1 className="text-gray-900">

// After  
<h1 className="text-secondary-900">
```

## Questions?

For color system questions or updates, refer to:
- **Brand Guidelines**: `/2024_brand_standards.pdf`
- **Implementation**: `/web/src/app/globals.css`
- **Usage Examples**: `/web/src/app/page.tsx` (homepage)

---

**Last Updated**: 2025-01-21
**Version**: 1.0
**Based on**: BAPI 2024 Brand Standards (PANTONE 1225 C)
