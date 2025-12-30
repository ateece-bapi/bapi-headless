# BAPI Design Tokens

Comprehensive design token system for the BAPI headless website, ensuring consistency across all UI components and pages.

## Overview

All design tokens are defined in `/web/src/app/globals.css` using the `@theme inline` directive for Tailwind CSS v4. These tokens provide a single source of truth for colors, typography, spacing, animations, and z-index values.

## Color System

### BAPI Brand Colors

The BAPI color system follows the 60-30-10 rule from the 2024 Brand Standards:
- **60%** White/Gray (backgrounds, surfaces)
- **30%** BAPI Blue (primary actions, navigation, trust elements)
- **10%** BAPI Yellow (accents, highlights, CTAs)

### Primary Colors - BAPI Blue (#1479BC)

Used for primary actions, navigation, and trust-building elements.

```css
--color-primary-50: #e6f2f9   /* Lightest - backgrounds */
--color-primary-100: #cce5f3  /* Very light - hover states */
--color-primary-200: #99cbe7  /* Light - borders */
--color-primary-300: #66b1db  /* Light-medium */
--color-primary-400: #3397cf  /* Medium */
--color-primary-500: #1479bc  /* Base brand blue */
--color-primary-600: #106196  /* Medium-dark - primary buttons */
--color-primary-700: #0c4971  /* Dark - text, active states */
--color-primary-800: #08304b  /* Very dark */
--color-primary-900: #041826  /* Darkest */
--color-primary-950: #020c13  /* Ultra dark - backgrounds */
```

**Usage Examples:**
- `bg-primary-600` - Primary button backgrounds
- `text-primary-700` - Primary text and links
- `border-primary-200` - Borders and dividers
- `hover:bg-primary-700` - Button hover states

### Accent Colors - BAPI Yellow (#FFC843)

Used for CTAs, highlights, and attention-grabbing elements.

```css
--color-accent-50: #fffbf0   /* Lightest - backgrounds */
--color-accent-100: #fff7e1  /* Very light - hover states */
--color-accent-200: #ffefc3  /* Light - borders */
--color-accent-300: #ffe7a5  /* Light-medium */
--color-accent-400: #ffdf87  /* Medium */
--color-accent-500: #ffc843  /* Base brand yellow */
--color-accent-600: #e6b43c  /* Medium-dark - CTA buttons */
--color-accent-700: #cca035  /* Dark - text, active states */
--color-accent-800: #b38c2e  /* Very dark */
--color-accent-900: #997827  /* Darkest */
--color-accent-950: #4d3c14  /* Ultra dark */
```

**Usage Examples:**
- `bg-accent-500` - CTA button backgrounds
- `text-accent-700` - Accent text
- `border-accent-200` - Accent borders
- `hover:bg-accent-600` - CTA hover states

### Neutral Colors - BAPI Gray (#97999B)

Used for backgrounds, surfaces, text, and 60% of the UI.

```css
--color-neutral-50: #fafafa   /* Near white - page backgrounds */
--color-neutral-100: #f5f5f5  /* Very light gray - cards */
--color-neutral-200: #e8e8e9  /* Light gray - borders */
--color-neutral-300: #d4d5d6  /* Light-medium gray */
--color-neutral-400: #b5b6b8  /* Medium-light gray */
--color-neutral-500: #97999b  /* Base gray */
--color-neutral-600: #797a7c  /* Medium-dark gray - secondary text */
--color-neutral-700: #5e5f60  /* Dark gray - body text */
--color-neutral-800: #434445  /* Very dark gray - headings */
--color-neutral-900: #282829  /* Near black */
--color-neutral-950: #141415  /* Ultra dark - dark mode backgrounds */
```

**Usage Examples:**
- `bg-neutral-50` - Page backgrounds
- `text-neutral-700` - Body text
- `border-neutral-200` - Dividers and borders
- `text-neutral-600` - Secondary/muted text

### Semantic Colors

#### Success (Green)
```css
--color-success-50: #f0fdf4
--color-success-500: #22c55e  /* Base success green */
--color-success-600: #16a34a  /* Medium success */
--color-success-700: #15803d  /* Dark success */
```

#### Warning (Yellow - uses BAPI Yellow)
```css
--color-warning-50: #fffbeb
--color-warning-500: #ffc843  /* BAPI Yellow */
--color-warning-600: #e6b43c
--color-warning-700: #cca035
```

#### Error (Red)
```css
--color-error-50: #fef2f2
--color-error-500: #ef4444  /* Base error red */
--color-error-600: #dc2626  /* Medium error */
--color-error-700: #b91c1c  /* Dark error */
```

#### Info (Blue - uses BAPI Blue)
```css
--color-info-50: #e6f2f9
--color-info-500: #1479bc  /* BAPI Blue */
--color-info-600: #106196
--color-info-700: #0c4971
```

## Typography

### Font Family

```css
--font-sans: 'Roboto', Arial, Helvetica, sans-serif
--font-mono: 'Roboto Mono', 'Consolas', monospace
```

**Font Loading:**
- Roboto loaded via Google Fonts with optimized subsets
- Font features enabled: kerning, ligatures, contextual alternates
- Antialiasing applied for smooth rendering

**Usage:**
- All body text uses Roboto
- Headings use Roboto with adjusted weights (700 for h1-h3, 600 for h4-h6)
- Code blocks use Roboto Mono

### Font Features

All fonts have OpenType features enabled:
```css
font-feature-settings: "kern" 1, "liga" 1, "calt" 1;
```

### Font Smoothing

```css
-webkit-font-smoothing: antialiased;
-moz-osx-font-smoothing: grayscale;
```

## Layout & Spacing

### Container Widths

```css
--width-container: 1600px  /* Maximum site width */
--width-content: 1200px    /* Standard content width */
--width-narrow: 800px      /* Narrow content (articles, forms) */
```

**Usage Examples:**
- Full-width layouts: `max-w-[1600px]`
- Standard layouts: `max-w-[1200px]`
- Narrow content: `max-w-[800px]`

### Z-Index Scale

Consistent stacking order for UI layers:

```css
--z-base: 0          /* Base layer */
--z-dropdown: 1000   /* Dropdowns */
--z-sticky: 1020     /* Sticky headers */
--z-fixed: 1030      /* Fixed elements */
--z-modal-backdrop: 1040  /* Modal backgrounds */
--z-modal: 1050      /* Modals */
--z-popover: 1060    /* Popovers */
--z-tooltip: 1070    /* Tooltips */
--z-toast: 1080      /* Toast notifications */
```

**Usage:**
```css
z-[var(--z-modal)]
z-[var(--z-dropdown)]
```

## Animation

### Durations

```css
--duration-fast: 150ms      /* Quick transitions */
--duration-base: 200ms      /* Default transitions */
--duration-normal: 300ms    /* Standard animations */
--duration-slow: 500ms      /* Slow animations */
--duration-slower: 700ms    /* Very slow animations */
```

**Usage Guidelines:**
- **Fast (150ms):** Hover effects, opacity changes, small scale transforms
- **Base (200ms):** Color transitions, border changes
- **Normal (300ms):** Layout shifts, larger transforms, micro-interactions
- **Slow (500ms):** Complex animations, multi-property transitions
- **Slower (700ms):** Page transitions, loading states

### Easing Curves

```css
--ease-linear: linear
--ease-in: cubic-bezier(0.4, 0, 1, 1)        /* Accelerate */
--ease-out: cubic-bezier(0, 0, 0.2, 1)       /* Decelerate (recommended for most) */
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1)  /* Smooth start and end */
```

**Usage Guidelines:**
- **ease-out:** Use for most UI interactions (buttons, links, hovers)
- **ease-in:** Use for elements exiting the viewport
- **ease-in-out:** Use for reversible animations (toggles, accordions)
- **linear:** Use for continuous animations (spinners, progress bars)

## Micro-Interactions

### Global Transitions

All interactive elements have smooth transitions:

```css
a, button, input, select, textarea {
  transition: color 200ms ease-out,
              background-color 200ms ease-out,
              border-color 200ms ease-out,
              opacity 200ms ease-out,
              transform 200ms ease-out;
}
```

### Utility Classes

#### Hover Effects

```css
.hover-lift        /* Lift on hover (translateY -2px, shadow) */
.hover-scale       /* Scale on hover (1.02x) */
```

#### Transitions

```css
.transition-colors-smooth   /* Smooth color transitions (300ms) */
.transition-weight          /* Font weight transitions (150ms) */
.transition-opacity-smooth  /* Opacity transitions (300ms) */
```

#### Focus States

```css
.focus-glow:focus  /* Blue glow on focus (BAPI Blue) */
```

### Usage Examples

```html
<!-- Lift card on hover -->
<div class="hover-lift bg-white rounded-lg p-6">...</div>

<!-- Smooth color transition on button -->
<button class="transition-colors-smooth bg-primary-600 hover:bg-primary-700">
  Click Me
</button>

<!-- Scale on hover -->
<img class="hover-scale" src="..." alt="..." />
```

## Accessibility

### Color Contrast

All color combinations meet WCAG 2.1 AA standards:
- **Normal text (16px+):** 4.5:1 minimum contrast ratio
- **Large text (24px+):** 3:1 minimum contrast ratio
- **UI components:** 3:1 minimum contrast ratio

### Focus States

All interactive elements have visible focus indicators:
- 2px solid outline in BAPI Blue (`--color-primary-500`)
- 2px offset for clear separation
- Smooth transition on focus

### Reduced Motion

Respect user preferences for reduced motion:
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Usage in Components

### Tailwind Classes

```jsx
// Primary button
<button className="bg-primary-600 hover:bg-primary-700 text-white">
  Click Me
</button>

// Accent/CTA button
<button className="bg-accent-500 hover:bg-accent-600 text-neutral-900">
  Get Started
</button>

// Text with brand colors
<h1 className="text-primary-700">Welcome to BAPI</h1>
<p className="text-neutral-700">Body text goes here</p>

// Card with hover effect
<div className="bg-white hover-lift rounded-lg p-6">
  Card content
</div>
```

### CSS Variables

```css
/* Using variables directly in custom CSS */
.custom-component {
  background: var(--color-primary-50);
  border: 1px solid var(--color-primary-200);
  transition: all var(--duration-normal) var(--ease-out);
}

.custom-component:hover {
  background: var(--color-primary-100);
  transform: translateY(-2px);
}
```

## Maintenance

### Adding New Tokens

1. Add to `@theme inline` block in `globals.css`
2. Update this documentation
3. Add to `tailwind.config.js` if needed for Tailwind utilities
4. Test across all breakpoints and themes

### Deprecating Tokens

1. Mark as deprecated in this documentation
2. Provide migration path
3. Update all usages in codebase
4. Remove after one major version

### Testing Tokens

```bash
# Check for unused CSS variables
npx unused-css-variables --ignore "*.test.*"

# Validate color contrast
npm run test:a11y

# Visual regression testing
npm run test:visual
```

## Resources

- [BAPI Brand Guidelines 2024](../AI/technical-draft.md)
- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [OpenType Features](https://developer.mozilla.org/en-US/docs/Web/CSS/font-feature-settings)

## Changelog

### December 30, 2025
- Initial design token documentation
- Defined complete color system (primary, accent, neutral, semantic)
- Documented typography with Roboto font family
- Added animation durations and easing curves
- Defined micro-interaction utilities
- Documented z-index scale and layout tokens
