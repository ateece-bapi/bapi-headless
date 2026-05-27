# Edge Browser Grid Layout Debugging

## Issue
Homepage product image appears BELOW text in Edge, but side-by-side in Firefox.

## Root Cause Analysis

### Current Hero Layout Code
```tsx
<div className="2xl:grid 2xl:grid-cols-[1fr_1.2fr] 2xl:items-center 2xl:gap-16">
  <div className="2xl:pb-4">
    {/* Text content */}
  </div>
  <div className="mt-12 hidden xl:mt-0 xl:block">
    {/* Product image */}
  </div>
</div>
```

### Breakpoint Behavior

| Viewport Width | Breakpoint | Layout Behavior | Image Position |
|----------------|------------|-----------------|----------------|
| < 1280px | Below xl | Image hidden | N/A |
| 1280-1535px | xl | Vertical stack (NO grid) | **BELOW text** |
| 1536px+ | 2xl | CSS Grid 2-column | **Side-by-side** |

## Possible Causes

### 1. **Viewport Width Difference** (Most Likely)
- **Edge viewport:** 1280-1535px → Image stacks BELOW
- **Firefox viewport:** 1536px+ → Grid layout, side-by-side
- **Fix:** Check browser zoom level and window width

### 2. **Edge CSS Grid Bug with Arbitrary Values**
- Arbitrary grid syntax: `grid-cols-[1fr_1.2fr]`
- Edge (Chromium) should support this, but may have rendering bug
- **Fix:** Use standard Tailwind classes instead

### 3. **Zoom Level Difference**
- Edge at 110% zoom = effective viewport < 1536px
- Firefox at 100% zoom = viewport >= 1536px
- **Fix:** Reset zoom to 100% in both browsers (Ctrl+0)

## Testing Steps

### Step 1: Check Viewport Width
1. Open Edge DevTools (F12)
2. Check responsive mode dimensions
3. Verify actual viewport width >= 1536px for grid to activate

### Step 2: Check Zoom Level
1. Edge: Ctrl+0 to reset zoom to 100%
2. Firefox: Ctrl+0 to reset zoom to 100%
3. Compare layouts again

### Step 3: Inspect Computed Styles
1. Edge DevTools → Inspect hero grid container
2. Check if `display: grid` is applied at 1536px+
3. Check if `grid-template-columns` shows `1fr 1.2fr`

## Recommended Fix

If arbitrary grid values aren't working in Edge, replace with standard Tailwind classes:

```tsx
// CURRENT (arbitrary values)
<div className="2xl:grid 2xl:grid-cols-[1fr_1.2fr] 2xl:items-center 2xl:gap-16">

// ALTERNATIVE (standard classes - better browser compat)
<div className="2xl:grid 2xl:grid-cols-2 2xl:items-center 2xl:gap-16">
  <div className="2xl:col-span-1">...</div>
  <div className="2xl:col-span-1">...</div>
</div>

// OR use lg breakpoint for earlier grid activation
<div className="lg:grid lg:grid-cols-2 lg:items-center lg:gap-16 2xl:gap-20">
```

## Browser Compatibility Check

**CSS Grid with FR units:**
- ✅ Chrome 57+ (March 2017)
- ✅ Edge 16+ (October 2017)
- ✅ Firefox 52+ (March 2017)
- ✅ Safari 10.1+ (March 2017)

**Tailwind arbitrary values:**
- ✅ Supported in Tailwind CSS v2.1+
- ✅ Compiles to standard CSS Grid syntax
- ⚠️ May have SSR/hydration issues in some frameworks

## Next Steps

1. User: Check viewport width in both browsers
2. User: Reset zoom to 100% in both browsers
3. User: Open DevTools and inspect grid container
4. If still broken: Replace arbitrary values with standard classes
5. If still broken: Lower breakpoint from 2xl to lg
