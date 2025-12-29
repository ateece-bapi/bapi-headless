# Tailwind v4 Modernization Plan

## Current State Assessment

**Status**: Strong foundation with excellent design token system, but using hybrid v3/v4 patterns.

**Version**: Tailwind CSS v4 (using `@tailwindcss/postcss`)

**Strengths**:
- ✅ Modern Tailwind v4 with PostCSS plugin
- ✅ CSS-first theming with `@theme inline`
- ✅ Comprehensive color scale (50-950)
- ✅ Semantic naming (primary/accent/neutral)
- ✅ No `@apply` anti-patterns
- ✅ Excellent responsive patterns
- ✅ TypeScript integration

**Opportunities**:
- ⚠️ Duplicate color definitions (CSS + JS config)
- ⚠️ Legacy v3 config structure
- ⚠️ Arbitrary values when tokens exist
- ⚠️ Custom animations outside theme
- ⚠️ No z-index scale

---

## Phase 1: Streamline Configuration (Highest Priority)

### Action 1.1: Simplify `tailwind.config.js`

With Tailwind v4, most configuration lives in CSS via `@theme`. Your JS config can be drastically simplified.

**Current** (v3-style, 45 lines):
```js
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}", "./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'bapi-blue-50': 'var(--color-primary-50)',
        // ... 30+ lines of color mappings
      },
    },
  },
  plugins: [],
};
```

**Recommended** (v4-style, 8 lines):
```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
};
```

**Why**: Tailwind v4 automatically reads colors from `@theme` in `globals.css`. No need to duplicate them in JS config.

---

### Action 1.2: Remove `bapi-*` Prefixed Colors

Your color tokens in `@theme` already define semantic names (`primary-500`, `accent-500`). The `bapi-blue-500` aliases are unnecessary.

**Update Usage**:
```tsx
// BEFORE
<button className="bg-bapi-blue-500 hover:bg-bapi-blue-600">

// AFTER (cleaner, more semantic)
<button className="bg-primary-500 hover:bg-primary-600">
```

**Global Find & Replace**:
- `bapi-blue-` → `primary-`
- `bapi-accent-` → `accent-`
- `bapi-gray-` → `neutral-`

---

## Phase 2: Define System Utilities in `@theme`

### Action 2.1: Add Z-Index Scale

**Add to `globals.css` after colors**:
```css
@theme inline {
  /* Existing colors... */

  /* Z-Index Scale */
  --z-dropdown: 1000;
  --z-sticky: 1020;
  --z-fixed: 1030;
  --z-modal-backdrop: 1040;
  --z-modal: 1050;
  --z-popover: 1060;
  --z-tooltip: 1070;
  --z-toast: 1080;
}
```

**Usage**:
```tsx
// BEFORE
<div className="z-[9999]">  // Toast

// AFTER
<div className="z-toast">  // Much cleaner
```

---

### Action 2.2: Add Animation System

**Add to `globals.css`**:
```css
@theme inline {
  /* Existing tokens... */

  /* Animation Durations */
  --duration-fast: 150ms;
  --duration-base: 200ms;
  --duration-slow: 300ms;
  --duration-slower: 500ms;

  /* Animation Easings */
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
}
```

**Move custom keyframes to theme**:
```css
/* AFTER color tokens */
@keyframes slide-in-right {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slide-up {
  from {
    transform: translateY(0.5rem);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
```

**Usage**:
```tsx
<div className="animate-[slide-in-right_300ms_ease-out]">
<div className="animate-[fade-in_200ms_ease-in]">
```

---

## Phase 3: Replace Arbitrary Values with Tokens

### Action 3.1: Audit Arbitrary Color Values

**Find all instances** (grep search):
```bash
# Search for hex colors in className
grep -r "className=.*\#[0-9a-fA-F]" src/
```

**Common replacements**:
```tsx
// Navigation gradient
from-[#0054b6] → from-primary-500
to-[#ffc843]   → to-accent-500

// Radial gradients (keep arbitrary - complex values)
bg-[radial-gradient(...)]  ✓ OK to keep
```

---

### Action 3.2: Audit Arbitrary Spacing/Sizing

**Look for**:
```tsx
className="h-[420px]"     // Use h-96 or h-full
className="max-w-[1600px]" // Define in theme as --width-container
className="min-w-[240px]"  // Use min-w-60
```

**Add to `@theme`**:
```css
@theme inline {
  /* Container Widths */
  --width-container: 1600px;
  --width-content: 1200px;
  --width-narrow: 800px;
}
```

**Usage**:
```tsx
<div className="max-w-container mx-auto">
```

---

## Phase 4: Modern Tailwind v4 Features

### Action 4.1: Enable Container Queries

Container queries allow component-level responsive design (better than viewport breakpoints).

**Add to `globals.css`**:
```css
@import "tailwindcss";

/* Enable container queries */
@layer utilities {
  .container-query {
    container-type: inline-size;
  }
}
```

**Usage**:
```tsx
<div className="container-query">
  <div className="@sm:text-lg @md:text-xl @lg:text-2xl">
    Responsive based on container, not viewport!
  </div>
</div>
```

---

### Action 4.2: Use Cascade Layers

Tailwind v4 has better layer control.

**Add to `globals.css`**:
```css
@layer base {
  /* Base styles - rarely needed with Tailwind */
  body {
    @apply antialiased;
  }
}

@layer components {
  /* Only for truly reusable component patterns */
  .card {
    @apply rounded-xl shadow-lg bg-white border border-neutral-200;
  }
}

@layer utilities {
  /* Custom utilities (use sparingly) */
  .text-balance {
    text-wrap: balance;
  }
}
```

**Note**: Still prefer inline utilities over component classes.

---

## Phase 5: Advanced Optimizations

### Action 5.1: Content Paths Optimization

Ensure Tailwind scans only necessary files for faster builds.

**Update `tailwind.config.js`**:
```js
export default {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}',
    // Exclude test files
    '!./src/**/*.test.{js,ts,jsx,tsx}',
    '!./src/**/*.spec.{js,ts,jsx,tsx}',
  ],
};
```

---

### Action 5.2: Component Variants Pattern

For complex components with many variants, use a pattern like `clsx` + configuration object.

**Example: Button Component**:
```tsx
// src/components/ui/Button.tsx
import { cva, type VariantProps } from 'class-variance-authority';

const button = cva(
  // Base styles
  'inline-flex items-center justify-center rounded-xl font-bold transition-all focus:outline-none focus:ring-4',
  {
    variants: {
      variant: {
        primary: 'bg-primary-500 hover:bg-primary-600 text-white focus:ring-primary-500/50',
        accent: 'bg-accent-500 hover:bg-accent-600 text-neutral-900 focus:ring-accent-500/50',
        outline: 'border-2 border-primary-500 text-primary-500 hover:bg-primary-50',
      },
      size: {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof button> {}

export function Button({ variant, size, className, ...props }: ButtonProps) {
  return (
    <button
      className={button({ variant, size, className })}
      {...props}
    />
  );
}
```

**Install**:
```bash
npm install class-variance-authority
```

---

### Action 5.3: Type-Safe Design Tokens

Export your design tokens for TypeScript autocomplete.

**Create `src/lib/design-tokens.ts`**:
```ts
export const colors = {
  primary: {
    50: 'var(--color-primary-50)',
    100: 'var(--color-primary-100)',
    // ... all shades
    500: 'var(--color-primary-500)',
    950: 'var(--color-primary-950)',
  },
  accent: {
    // ...
  },
  neutral: {
    // ...
  },
} as const;

export const zIndex = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modal: 1050,
  toast: 1080,
} as const;

export const spacing = {
  container: '1600px',
  content: '1200px',
  narrow: '800px',
} as const;
```

**Usage**:
```tsx
import { colors, zIndex } from '@/lib/design-tokens';

<div style={{ backgroundColor: colors.primary[500], zIndex: zIndex.toast }}>
```

---

## Phase 6: Documentation & Guidelines

### Action 6.1: Update COLOR_SYSTEM.md

Add Tailwind v4 specific guidance:

```markdown
## Tailwind v4 Changes

### Direct Token Usage
Colors are now defined in `globals.css` via `@theme inline`.

Use semantic names directly:
- ✅ `bg-primary-500` (preferred)
- ❌ `bg-bapi-blue-500` (legacy, deprecated)

### Custom Properties
All tokens available as CSS variables:
```css
background: var(--color-primary-500);
color: var(--color-accent-500);
```

### Arbitrary Values (Use Sparingly)
Only use arbitrary values for one-off cases:
```tsx
<div className="bg-[radial-gradient(...)]"> ✓ OK (complex)
<div className="text-[#1479bc]">           ✗ Bad (use bg-primary-500)
```
```

---

### Action 6.2: Create TAILWIND_GUIDELINES.md

**New file** with team standards:

```markdown
# Tailwind CSS Guidelines

## Principles

1. **Utility-First**: Compose styles with utility classes in JSX
2. **No @apply**: Keep styles co-located with components
3. **Semantic Tokens**: Use theme tokens (`primary-500`) not arbitrary values
4. **Responsive Mobile-First**: Start with base, add `sm:`, `md:`, `lg:`, `xl:`
5. **Accessibility**: Always include focus states

## Class Order (Recommended)

1. Layout (flex, grid, position)
2. Box model (w-, h-, p-, m-)
3. Typography (text-, font-)
4. Visual (bg-, border-, shadow-)
5. Interactive (hover:, focus:, active:)
6. Responsive (sm:, md:, lg:, xl:)

Example:
```tsx
<button className="
  flex items-center justify-center
  px-6 py-3 rounded-xl
  text-lg font-bold
  bg-primary-500 border-2 border-primary-600 shadow-lg
  hover:bg-primary-600 focus:ring-4 focus:ring-primary-500/50
  sm:px-8 sm:py-4 lg:text-xl
">
```

## Common Patterns

### Responsive Typography
```tsx
<h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl">
```

### Focus States (Accessibility)
```tsx
<a className="focus:outline-none focus:ring-4 focus:ring-primary-500 focus:ring-offset-2">
```

### Hover Transitions
```tsx
<div className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
```

### Conditional Classes
```tsx
import clsx from 'clsx';

<div className={clsx(
  'base classes',
  isActive && 'active classes',
  !isActive && 'inactive classes'
)}>
```

## Anti-Patterns (Avoid)

❌ **Using @apply in CSS**
```css
/* Bad */
.button {
  @apply px-4 py-2 bg-blue-500;
}
```
✅ Use utilities directly in JSX instead

❌ **Arbitrary values when tokens exist**
```tsx
<div className="text-[#1479bc]">  /* Bad */
<div className="text-primary-500"> /* Good */
```

❌ **Overly nested arbitrary values**
```tsx
<div className="bg-[rgba(20,121,188,0.15)]">  /* Bad */
```
Define in theme instead

❌ **Inline styles for theme values**
```tsx
<div style={{ color: '#1479bc' }}>  /* Bad */
<div className="text-primary-500">  /* Good */
```
```

---

## Implementation Checklist

### Immediate (No Breaking Changes)
- [ ] Simplify `tailwind.config.js` to minimal v4 structure
- [ ] Add z-index scale to `@theme`
- [ ] Add container width tokens to `@theme`
- [ ] Document Tailwind v4 patterns in COLOR_SYSTEM.md

### Short-Term (Minor Refactoring)
- [ ] Replace `bapi-*` colors with semantic names across codebase
- [ ] Replace arbitrary hex values with theme tokens
- [ ] Create `design-tokens.ts` for type safety
- [ ] Add animation durations to theme

### Long-Term (Optional Enhancements)
- [ ] Implement `class-variance-authority` for complex components
- [ ] Enable container queries for component-responsive design
- [ ] Create Tailwind guidelines document
- [ ] Set up automated class sorting (Prettier plugin)

---

## Migration Risk Assessment

**Risk Level**: Low
- Tailwind v4 is backwards compatible
- Changes are mostly organizational (no functionality impact)
- Can be done incrementally

**Testing Strategy**:
1. Visual regression testing after color name changes
2. Test responsive breakpoints across devices
3. Verify dark mode (if applicable)
4. Check accessibility (focus states, contrast)

---

## Expected Benefits

### Developer Experience
- ✅ Faster builds (optimized content paths)
- ✅ Better autocomplete (type-safe tokens)
- ✅ Cleaner JSX (semantic names)
- ✅ Less duplication (CSS-first config)

### Maintainability
- ✅ Single source of truth (`@theme` in CSS)
- ✅ Easier to update brand colors
- ✅ Better team onboarding (clear patterns)

### Performance
- ✅ Smaller CSS bundle (no unused variants)
- ✅ Faster incremental builds

---

## Resources

- [Tailwind CSS v4 Docs](https://tailwindcss.com/docs/v4-beta)
- [CSS-First Configuration](https://tailwindcss.com/docs/v4-beta#css-first-configuration)
- [Design Tokens in Tailwind](https://tailwindcss.com/docs/customizing-colors)
- [class-variance-authority](https://cva.style/docs)
