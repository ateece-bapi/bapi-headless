# Tailwind CSS Guidelines

## Principles

1. **Utility-First**: Compose styles with utility classes in JSX
2. **No @apply**: Keep styles co-located with components
3. **No Inline Styles**: Use CSS classes or Tailwind utilities instead
4. **Semantic Tokens**: Use theme tokens (`primary-500`) not arbitrary values
5. **Responsive Mobile-First**: Start with base, add `sm:`, `md:`, `lg:`, `xl:`
6. **Accessibility**: Always include focus states

## Why No Inline Styles?

Inline styles are **anti-pattern** in modern React/Next.js applications:

❌ **Problems with Inline Styles:**
- Cannot be cached by the browser
- Increase bundle size (repeated in every component)
- Hard to maintain (changes require editing JSX)
- Don't support pseudo-states (`:hover`, `:focus`)
- Don't support media queries (responsive design)
- Poor for performance (no optimization)
- Bad for CSP (Content Security Policy)

✅ **Use Instead:**
- **Tailwind utilities**: `bg-primary-500 hover:bg-primary-600`
- **CSS classes**: Define in `globals.css` with semantic names
- **CSS variables**: For dynamic values via `var(--color-primary-500)`

### Example Refactoring

```tsx
// ❌ BAD - Inline styles
<div style={{
  backgroundImage: 'url(/image.jpg)',
  backgroundSize: 'cover',
  transform: 'translateZ(0)'
}}>

// ✅ GOOD - CSS class
<div className="hero-bg-image will-change-transform-safe">

// In globals.css:
.hero-bg-image {
  background-image: url('/image.jpg');
  background-size: cover;
  background-position: center;
}
```

### When Inline Styles ARE Acceptable

**Only use inline styles for truly dynamic, runtime-computed values:**

✅ **Acceptable Cases:**
```tsx
// 1. Dynamic color from user/API data
<div style={{ backgroundColor: product.colorHex }}>

// 2. Progress indicators with dynamic percentages
<div style={{ width: `${progress}%` }}>

// 3. Animation delays in loops (until CSS has calc support)
<div style={{ animationDelay: `${index * 50}ms` }}>

// 4. Canvas/chart libraries that require inline positioning
<div style={{ left: `${x}px`, top: `${y}px` }}>
```

❌ **NOT Acceptable:**
```tsx
// Static colors - use Tailwind or CSS classes
<div style={{ color: 'var(--color-primary-600)' }}>  // ❌
<div className="text-primary-600">                   // ✅

// Fixed backgrounds - use CSS classes
<div style={{ backgroundImage: 'url(...)' }}>        // ❌
<div className="hero-bg-image">                      // ✅

// Hover states - use CSS pseudo-classes
<button onMouseOver={e => e.style.bg = '...'}> // ❌
<button className="hover:bg-primary-600">      // ✅
```

**Rule of Thumb:** If the value doesn't change based on props, state, or API data, it belongs in CSS/Tailwind, not inline styles.

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
  Click Me
</button>
```

## Common Patterns

### Responsive Typography
```tsx
<h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold">
  Responsive Heading
</h1>
```

### Focus States (Accessibility)
```tsx
<a className="focus:outline-none focus:ring-4 focus:ring-primary-500 focus:ring-offset-2">
  Accessible Link
</a>
```

### Hover Transitions
```tsx
<div className="transition-all duration-normal hover:shadow-lg hover:-translate-y-1">
  Interactive Card
</div>
```

### Conditional Classes with clsx
```tsx
import clsx from 'clsx';

<div className={clsx(
  'base-classes',
  isActive && 'active-classes',
  !isActive && 'inactive-classes',
  variant === 'primary' && 'primary-classes'
)}>
```

### Container Queries (v4)
```tsx
<div className="container-query">
  <div className="@sm:text-lg @md:text-xl @lg:text-2xl">
    Responsive based on container, not viewport!
  </div>
</div>
```

### Text Balance for Headings
```tsx
<h1 className="text-balance">
  Better Typography Without Orphan Words
</h1>
```

## Design Token Usage

### Colors
```tsx
// ✅ DO: Use semantic color tokens
<div className="bg-primary-500 text-white border-neutral-200">
<div className="hover:bg-primary-600 focus:ring-primary-500/50">

// ❌ DON'T: Use arbitrary hex values
<div className="bg-[#1479bc]">
```

### Z-Index
```tsx
// ✅ DO: Use semantic z-index scale
<div className="z-dropdown">   /* 1000 */
<div className="z-modal">      /* 1050 */
<div className="z-toast">      /* 1080 */

// ❌ DON'T: Use arbitrary values
<div className="z-[9999]">
```

### Container Widths
```tsx
// ✅ DO: Use semantic container tokens
<div className="max-w-container mx-auto">  /* 1600px */
<div className="max-w-content mx-auto">    /* 1200px */
<div className="max-w-narrow mx-auto">     /* 800px */

// ❌ DON'T: Use arbitrary pixel values
<div className="max-w-[1600px]">
```

### Animation Timing
```tsx
// ✅ DO: Use duration tokens
<div className="transition-all duration-fast">      /* 150ms */
<div className="transition-colors duration-base">   /* 200ms */
<div className="animate-[fade-in_duration-normal]"> /* 300ms */

// ❌ DON'T: Use arbitrary milliseconds
<div className="transition-all duration-[250ms]">
```

## Anti-Patterns (Avoid)

### ❌ Using @apply in CSS
```css
/* Bad */
.button {
  @apply px-4 py-2 bg-blue-500;
}
```
✅ Use utilities directly in JSX instead

### ❌ Arbitrary values when tokens exist
```tsx
<div className="text-[#1479bc]">    /* Bad */
<div className="text-primary-500">  /* Good */
```

### ❌ Inline styles for theme values
```tsx
<div style={{ color: '#1479bc' }}>  /* Bad */
<div className="text-primary-500">  /* Good */
```

### ❌ Overly complex arbitrary values
```tsx
<div className="bg-[rgba(20,121,188,0.15)]">  /* Bad */
```
Define in theme or use existing opacity utilities

### ❌ Missing accessibility states
```tsx
/* Bad - no focus state */
<button className="bg-primary-500 hover:bg-primary-600">

/* Good - includes focus */
<button className="bg-primary-500 hover:bg-primary-600 focus:ring-4 focus:ring-primary-500/50">
```

## Component Patterns

### Button Variants
```tsx
const buttonVariants = {
  primary: 'bg-primary-500 hover:bg-primary-600 text-white',
  accent: 'bg-accent-500 hover:bg-accent-600 text-neutral-900',
  outline: 'border-2 border-primary-500 text-primary-500 hover:bg-primary-50',
};

<button className={clsx('px-6 py-3 rounded-xl font-bold', buttonVariants.primary)}>
```

### Card Components
```tsx
<div className="
  bg-white rounded-xl shadow-lg border border-neutral-200
  hover:shadow-xl hover:-translate-y-1
  transition-all duration-normal
  p-6
">
  Card Content
</div>
```

### Gradient Backgrounds
```tsx
<div className="bg-gradient-to-r from-primary-700 via-primary-500 to-primary-700">
<div className="bg-gradient-to-br from-accent-50 to-accent-100">
```

### Responsive Containers
```tsx
<div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
  Content
</div>
```

## Performance Tips

1. **Group repeated utilities**: Use `clsx` for reusable class combinations
2. **Avoid deep nesting**: Extract complex components
3. **Use semantic tokens**: Smaller CSS bundle with token reuse
4. **Leverage @layer**: Proper cascade order for utilities

## Testing Checklist

- [ ] All interactive elements have focus states
- [ ] Colors meet WCAG contrast requirements
- [ ] Responsive breakpoints tested on mobile/tablet/desktop
- [ ] Hover states work on touch devices (fallback)
- [ ] Animations respect prefers-reduced-motion
- [ ] Z-index stacking is correct

## Resources

- [Tailwind v4 Documentation](https://tailwindcss.com/docs/v4-beta)
- [COLOR_SYSTEM.md](./COLOR_SYSTEM.md) - Brand color usage
- [TAILWIND_MODERNIZATION.md](./TAILWIND_MODERNIZATION.md) - Implementation guide
- [Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

**Last Updated**: December 29, 2025
**Version**: 1.0 (Tailwind v4)
