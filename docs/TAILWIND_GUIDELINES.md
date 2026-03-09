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

## Z-Index Best Practices

### Why Semantic Z-Index Matters

Managing z-index is one of the most challenging aspects of CSS at scale. Random z-index values (like `z-[9999]`) create **z-index wars** where developers keep adding higher numbers without understanding the stacking order.

**Our Solution**: A semantic z-index system with named layers.

### The Z-Index Scale

All z-index values are defined as **CSS variables** in `globals.css`:

```css
/* @theme inline in globals.css */
--z-base: 0;              /* Default stacking */
--z-dropdown: 1000;       /* Dropdown menus */
--z-sticky: 1020;         /* Sticky headers/footers */
--z-fixed: 1030;          /* Fixed positioning */
--z-modal-backdrop: 1040; /* Modal overlay backgrounds */
--z-modal: 1050;          /* Modal dialogs */
--z-popover: 1060;        /* Popovers & tooltips */
--z-tooltip: 1070;        /* Pure tooltips */
--z-toast: 1080;          /* Toast notifications (highest) */
```

### Using Z-Index Utilities

Always use the **semantic utility classes** that reference these variables:

```tsx
// ✅ CORRECT: Semantic utility classes
<div className="fixed top-4 right-4 z-toast">
  {/* Toast notification - highest layer */}
</div>

<div className="fixed inset-0 z-modal-backdrop">
  {/* Modal backdrop */}
</div>

<div className="fixed inset-0 z-modal flex items-center justify-center">
  {/* Modal dialog */}
</div>

<div className="sticky top-0 z-sticky">
  {/* Sticky header */}
</div>

<div className="relative z-dropdown">
  {/* Dropdown menu */}
</div>
```

```tsx
// ❌ WRONG: Arbitrary z-index values
<div className="z-[9999]">           /* Creates z-index wars */
<div className="z-[1000]">           /* Not part of system */
<div style={{ zIndex: 99999 }}>     /* Inline styles + arbitrary */
```

### Z-Index Hierarchy (Lowest to Highest)

| Layer | z-index | Utility Class | Use Case |
|-------|---------|---------------|----------|
| **Base** | 0 | `.z-base` | Default stacking |
| **Dropdown** | 1000 | `.z-dropdown` | Dropdown menus, autocomplete |
| **Sticky** | 1020 | `.z-sticky` | Sticky headers, navigation |
| **Fixed** | 1030 | `.z-fixed` | Fixed positioning |
| **Modal Backdrop** | 1040 | `.z-modal-backdrop` | Modal overlay backgrounds |
| **Modal** | 1050 | `.z-modal` | Modal dialogs, image galleries |
| **Popover** | 1060 | `.z-popover` | Popovers (with backdrop) |
| **Tooltip** | 1070 | `.z-tooltip` | Pure tooltips (no backdrop) |
| **Toast** | 1080 | `.z-toast` | Toast notifications (highest) |

### Component Examples

**Toast Notification System:**
```tsx
// ToastContainer (web/src/components/ui/Toast.tsx)
function ToastContainer({ toasts, removeToast }) {
  return (
    <div className="fixed top-4 right-4 z-toast flex flex-col gap-2 max-w-md">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
}
```

**Modal Dialog:**
```tsx
// ImageModal (web/src/components/ui/ImageModal.tsx)
function ImageModal({ isOpen }) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-modal-backdrop bg-black/90 backdrop-blur-sm" />
      
      {/* Modal content */}
      <div className="fixed inset-0 z-modal flex items-center justify-center p-4">
        <div className="relative max-w-5xl">
          <img src="..." alt="..." />
        </div>
      </div>
    </>
  );
}
```

**Sticky Header:**
```tsx
function Header() {
  return (
    <header className="sticky top-0 z-sticky bg-white border-b border-neutral-200">
      <nav className="max-w-container mx-auto px-4">
        {/* Navigation content */}
      </nav>
    </header>
  );
}
```

**Dropdown Menu:**
```tsx
function DropdownMenu() {
  return (
    <div className="relative">
      <button>Menu</button>
      <div className="absolute top-full left-0 z-dropdown bg-white shadow-lg rounded-lg">
        {/* Dropdown items */}
      </div>
    </div>
  );
}
```

### When to Add New Z-Index Layers

**Only add new layers if:**
1. The component truly needs a unique stacking position
2. No existing layer fits the use case
3. You've documented the new layer in this guide

**Process for adding new layers:**
1. Update `globals.css` with new CSS variable in `@theme`
2. Add utility class in `@layer utilities`
3. Document in this guide
4. Update [COLOR_SYSTEM.md](./COLOR_SYSTEM.md) if needed

Example:
```css
/* globals.css - @theme inline */
--z-my-new-layer: 1090;

/* globals.css - @layer utilities */
.z-my-new-layer {
  z-index: var(--z-my-new-layer);
}
```

### Debugging Z-Index Issues

**Common Problems:**

1. **Element not appearing above others**
   - Check if parent has lower z-index (creates new stacking context)
   - Verify you're using semantic utility class (`.z-toast`, not `.z-[1080]`)
   - Ensure element has `position: relative/absolute/fixed` (z-index requires positioning)

2. **Multiple layers overlapping incorrectly**
   - Review hierarchy table above
   - Check if backdrop and content use correct classes (`.z-modal-backdrop` + `.z-modal`)

3. **Tooltip hidden behind modal**
   - Tooltips (`.z-tooltip` = 1070) < Modals (`.z-modal` = 1050)
   - Expected behavior: tooltips should appear inside modals, not above them

**Debugging Tips:**
```tsx
// Temporarily add borders to see stacking
<div className="z-modal border-4 border-red-500">
  {/* If you see this border, z-index is working */}
</div>

// Check in DevTools
// Elements → Computed → z-index (should show numeric value, not "auto")
```

### Migration Notes

**If you see arbitrary z-index values:**
```tsx
// ❌ OLD (before Tailwind v4 migration)
<div className="z-[9999]">
<div className="z-50">
<div style={{ zIndex: 1000 }}>

// ✅ NEW (semantic utilities)
<div className="z-toast">    /* Replace z-[9999] with highest layer */
<div className="z-modal">    /* Replace z-50 with appropriate layer */
<div className="z-dropdown"> /* Remove inline styles */
```

**Reference Table for Common Values:**
- `z-[9999]` or `z-[99999]` → `.z-toast` (1080)
- `z-50` → Check context: modal = `.z-modal`, dropdown = `.z-dropdown`
- `z-40` → `.z-sticky` (1020)
- `z-30` → `.z-fixed` (1030)
- `z-20` → `.z-dropdown` (1000)
- `z-10` → `.z-base` (0) or remove entirely

### Benefits of This Approach

✅ **Self-Documenting**: `.z-toast` tells you it's a toast notification  
✅ **Maintainable**: Change `--z-toast` once, updates everywhere  
✅ **Prevents Wars**: No more `z-[99999]` battles  
✅ **Type-Safe**: Matches design system (like `bg-primary-500`)  
✅ **Scalable**: Easy to add new layers when needed

### Real-World Example: Toast Fix (Feb 10, 2026)

**Problem**: Toast notifications stopped working after Lighthouse optimizations.

**Root Cause**: CSS variables defined (`--z-toast: 1080`) but utility classes never created.

**Solution**: Added semantic utilities in `globals.css`:
```css
@layer utilities {
  .z-toast {
    z-index: var(--z-toast);
  }
  /* ... other z-index utilities */
}
```

**Result**: All components using `className="z-toast"` now have proper stacking order.

**Lesson**: Always create utility classes for design tokens, not just the variables.

---

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
