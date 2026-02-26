# Storybook Accessibility Audit & Remediation Plan

**Date:** February 26, 2026  
**Storybook Version:** 10.2.1  
**A11y Addon:** @storybook/addon-a11y (enabled)

## Executive Summary

This document outlines accessibility issues found in Storybook stories and provides a systematic remediation plan for WCAG 2.1 Level AA compliance.

## How to Use This Guide

### Viewing Accessibility Issues in Storybook

1. **Start Storybook:** `pnpm run storybook` (http://localhost:6006)
2. **Select any story** from the sidebar
3. **Click the "Accessibility" tab** at the bottom of the canvas
4. **Review violations:**
   - 🔴 **Red (Violations)**: Must fix - WCAG failures
   - 🟡 **Yellow (Incomplete)**: Requires manual review
   - 🟢 **Green (Passes)**: All checks passed

### Testing Process

```bash
# 1. Start Storybook
cd web/
pnpm run storybook

# 2. Open http://localhost:6006 in browser
# 3. Navigate through each story category:
#    - Tests/AccessibilityGuide
#    - UI/* (Button, Toast, ImageModal, etc.)
#    - Components/Cart/*
#    - Components/Products/*
#    - Components/Checkout/*

# 4. For each story:
#    - Click "Accessibility" tab
#    - Document violations in this file
#    - Fix issues in component code
#    - Verify fix in Accessibility tab
```

## Common Accessibility Issues & Fixes

### 1. Missing Alt Text on Images

**Issue:** Images without `alt` attributes  
**WCAG:** 1.1.1 Non-text Content (Level A)  
**Severity:** Critical

**Bad:**
```tsx
<Image src="/product.jpg" width={300} height={300} />
```

**Good:**
```tsx
<Image 
  src="/product.jpg" 
  alt="Temperature Sensor Model TS-101 with mounting bracket"
  width={300} 
  height={300} 
/>
```

**Fix Strategy:**
- Product images: Use product name + descriptive details
- Decorative images: Use empty alt (`alt=""`)
- Icon images: Describe the icon's function, not appearance

---

### 2. Insufficient Color Contrast

**Issue:** Text/background combinations failing 4.5:1 ratio  
**WCAG:** 1.4.3 Contrast (Minimum) (Level AA)  
**Severity:** High

**Current BAPI Colors (needs verification):**
- Primary Blue (#1479BC): 4.52:1 on white ✅
- Accent Yellow (#FFC843): 1.78:1 on white ❌
- Neutral Gray (#97999B): 4.92:1 on white ✅

**Yellow Text Issues:**
```tsx
// BAD: Yellow text on white background
<span className="text-accent-500">Add to Cart</span>

// GOOD: Yellow background with dark text
<button className="bg-accent-500 text-neutral-900">Add to Cart</button>
```

**Fix Strategy:**
- Never use yellow for text on light backgrounds
- Yellow should be background color with dark text
- Check all custom text colors with WebAIM Contrast Checker
- Use semantic tokens that ensure proper contrast

---

### 3. Icon-Only Buttons Missing Labels

**Issue:** Buttons with only icons, no accessible name  
**WCAG:** 4.1.2 Name, Role, Value (Level A)  
**Severity:** Critical

**Bad:**
```tsx
<button onClick={handleClose}>
  <X className="h-5 w-5" />
</button>
```

**Good:**
```tsx
<button onClick={handleClose} aria-label="Close modal">
  <X className="h-5 w-5" />
</button>

// OR with visually hidden text
<button onClick={handleClose}>
  <X className="h-5 w-5" />
  <span className="sr-only">Close modal</span>
</button>
```

**Components to Check:**
- Cart drawer close button
- Product gallery navigation arrows
- Search button (magnifying glass icon)
- Filter toggle buttons
- Share/social media icons

---

### 4. Form Inputs Without Labels

**Issue:** Input fields missing associated `<label>` elements  
**WCAG:** 3.3.2 Labels or Instructions (Level A)  
**Severity:** Critical

**Bad:**
```tsx
<input 
  type="text" 
  placeholder="Enter your email" 
  name="email"
/>
```

**Good:**
```tsx
<label htmlFor="email" className="block text-sm font-medium">
  Email Address
</label>
<input 
  type="text" 
  id="email"
  name="email"
  placeholder="you@example.com"
  aria-describedby="email-hint"
/>
<p id="email-hint" className="text-sm text-neutral-600">
  We'll never share your email
</p>
```

**Components to Check:**
- Checkout forms (all steps)
- Product search/filter forms
- Account profile forms
- RMA request form
- Quote request form
- Newsletter signup

---

### 5. Missing Focus Indicators

**Issue:** Interactive elements without visible focus state  
**WCAG:** 2.4.7 Focus Visible (Level AA)  
**Severity:** High

**Bad:**
```tsx
<button className="bg-primary-500 text-white focus:outline-none">
  Click Me
</button>
```

**Good:**
```tsx
<button className="bg-primary-500 text-white focus:outline-none focus:ring-4 focus:ring-primary-500/50">
  Click Me
</button>
```

**BAPI Focus Ring Standard:**
```css
/* Add to all interactive elements */
focus:outline-none 
focus:ring-4 
focus:ring-{color}-500/50
focus:ring-offset-2
```

---

### 6. Incorrect Heading Hierarchy

**Issue:** Skipping heading levels (h1 → h3) or multiple h1 elements  
**WCAG:** 1.3.1 Info and Relationships (Level A)  
**Severity:** Medium

**Bad:**
```tsx
<h1>Products</h1>
<h3>Temperature Sensors</h3>  {/* Skipped h2 */}
```

**Good:**
```tsx
<h1>Products</h1>
<h2>Temperature Sensors</h2>
<h3>High-Accuracy Models</h3>
```

**Fix Strategy:**
- Page title: h1 (only once per page)
- Major sections: h2
- Subsections: h3
- Never skip levels

---

### 7. Links Without Href Attribute

**Issue:** `<a>` tags without `href` or with `href="#"`  
**WCAG:** 2.1.1 Keyboard (Level A)  
**Severity:** High

**Bad:**
```tsx
<a onClick={handleClick}>Learn More</a>
<a href="#">View Details</a>
```

**Good:**
```tsx
// Use button for click handlers
<button onClick={handleClick} className="text-primary-500 underline">
  Learn More
</button>

// Use proper href for navigation
<Link href="/products/ts-101">View Details</Link>
```

---

### 8. Missing Landmark Regions

**Issue:** Page sections without semantic HTML or ARIA landmarks  
**WCAG:** 1.3.1 Info and Relationships (Level A)  
**Severity:** Medium

**Good structure:**
```tsx
<header>
  <nav aria-label="Main navigation">...</nav>
</header>

<main>
  <article>
    <h1>Product Details</h1>
    ...
  </article>
  
  <aside aria-label="Related products">
    ...
  </aside>
</main>

<footer>
  ...
</footer>
```

---

### 9. Missing ARIA Live Regions

**Issue:** Dynamic content updates not announced to screen readers  
**WCAG:** 4.1.3 Status Messages (Level AA)  
**Severity:** Medium

**Components Needing Live Regions:**
- Cart item count updates
- Form validation messages
- Toast notifications
- Search results count
- Product filter results

**Example:**
```tsx
<div 
  role="status" 
  aria-live="polite" 
  aria-atomic="true"
  className="sr-only"
>
  {itemCount} items in cart
</div>
```

---

### 10. Poor Mobile Tap Target Size

**Issue:** Interactive elements smaller than 44×44px on mobile  
**WCAG:** 2.5.5 Target Size (Level AAA, but good practice)  
**Severity:** Low

**Fix:**
```tsx
// Minimum touch target
className="min-h-[44px] min-w-[44px]"

// Or use padding to increase hit area
className="p-3"  /* 12px padding */
```

---

## Component-Specific Audit Checklist

### UI Components

- [ ] **Button.tsx**
  - [ ] All variants have sufficient contrast
  - [ ] Focus rings visible on all states
  - [ ] Disabled state clearly indicated
  - [ ] Icon-only buttons have aria-labels

- [ ] **Toast.tsx**
  - [ ] Has `role="alert"` or `aria-live="assertive"`
  - [ ] Error/success states distinguishable without color
  - [ ] Close button has aria-label
  - [ ] Toast content is keyboard accessible

- [ ] **ImageModal.tsx**
  - [ ] ✅ All control buttons have aria-labels (verified)
  - [ ] ✅ Keyboard navigation works (Escape to close)
  - [ ] Dialog has `role="dialog"` and `aria-modal="true"`
  - [ ] Focus trapped within modal when open
  - [ ] Focus returns to trigger after close

- [ ] **TaglineRotator.tsx**
  - [ ] Rotation doesn't cause motion sickness (provide pause)
  - [ ] Content changes announced to screen readers
  - [ ] Respects `prefers-reduced-motion`

### Cart Components

- [ ] **AddToCartButton.tsx**
  - [ ] Loading state announced to screen readers
  - [ ] Success/error feedback accessible
  - [ ] Button disabled during loading

- [ ] **CartDrawer.tsx**
  - [ ] Drawer has proper dialog role
  - [ ] Focus management on open/close
  - [ ] Close button has aria-label
  - [ ] Item count updates announced

- [ ] **CartButton.tsx**
  - [ ] Item count badge readable by screen readers
  - [ ] Cart icon has descriptive label

### Product Components

- [ ] **ProductCard.tsx**
  - [ ] Product images have descriptive alt text
  - [ ] "View Details" link has accessible name
  - [ ] Price formatted for screen readers
  - [ ] Part number badge is keyboard accessible

- [ ] **ProductHeroFast.tsx**
  - [ ] Hero image has descriptive alt
  - [ ] Heading hierarchy correct
  - [ ] CTA buttons clearly labeled

- [ ] **ProductGallery.stories.tsx**
  - [ ] Thumbnail images have alt text
  - [ ] Navigation buttons have labels
  - [ ] Current image announced
  - [ ] Keyboard navigation supported

### Checkout Components

- [ ] **CheckoutWizard.tsx**
  - [ ] Step indicators keyboard accessible
  - [ ] Current step announced to screen readers
  - [ ] Progress indication accessible

- [ ] **CheckoutSummary.tsx**
  - [ ] Order total clearly associated with label
  - [ ] Tax/shipping costs labeled
  - [ ] Edit links have descriptive text

---

## Automated Testing Strategy

### 1. Run Storybook A11y Addon

**Manual Testing:**
1. Open Storybook: http://localhost:6006
2. Navigate to each story
3. Click "Accessibility" tab
4. Document violations

### 2. Chromatic Visual Regression

```bash
pnpm run chromatic
```

Chromatic captures accessibility violations automatically and tracks them across builds.

### 3. Lighthouse CI (Production)

```bash
pnpm run lighthouse
```

Runs automated accessibility audits on key pages.

### 4. axe-core Integration (Future)

Consider adding axe-core to Vitest for automated a11y testing:

```tsx
// Example test
import { axe, toHaveNoViolations } from 'jest-axe';
expect.extend(toHaveNoViolations);

test('Button has no accessibility violations', async () => {
  const { container } = render(<Button>Click me</Button>);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

---

## Priority Levels

### P0 - Critical (Block Release)
- Missing alt text on product images
- Form inputs without labels
- Icon-only buttons without accessible names
- Keyboard navigation broken
- Color contrast failing WCAG AA

### P1 - High (Fix Before Launch)
- Missing focus indicators
- Incorrect heading hierarchy
- Links without proper href
- Missing ARIA labels on controls

### P2 - Medium (Post-Launch)
- Missing landmark regions
- ARIA live regions for dynamic updates
- Reduced motion preferences
- Touch target sizes on mobile

### P3 - Low (Nice to Have)
- Enhanced screen reader announcements
- Additional ARIA descriptions
- AAA-level contrast
- Advanced keyboard shortcuts

---

## Remediation Workflow

1. **Identify violations** in Storybook Accessibility tab
2. **Categorize by component** and priority
3. **Fix in component source** (not just in stories)
4. **Add Storybook story** demonstrating the fix
5. **Test with screen reader** (VoiceOver, NVDA)
6. **Add automated test** if applicable
7. **Document pattern** for future reference

---

## Screen Reader Testing

### macOS VoiceOver
```bash
# Enable: Cmd + F5
# Navigate: Control + Option + arrows
# Read continuous: Control + Option + A
```

### Windows NVDA (Free)
Download: https://www.nvaccess.org/
```
# Navigate: Arrow keys
# Read continuous: NVDA + Down arrow
# Stop: Control
```

---

## Resources

- **WebAIM Contrast Checker:** https://webaim.org/resources/contrastchecker/
- **WAVE Browser Extension:** https://wave.webaim.org/extension/
- **axe DevTools:** https://www.deque.com/axe/devtools/
- **WCAG 2.1 Guidelines:** https://www.w3.org/WAI/WCAG21/quickref/
- **ARIA Authoring Practices:** https://www.w3.org/WAI/ARIA/apg/

---

## Next Steps

1. ✅ Storybook running with a11y addon
2. ⏳ Complete component-by-component accessibility audit
3. ⏳ Document specific violations for each story
4. ⏳ Create GitHub issues for P0/P1 violations
5. ⏳ Fix violations systematically
6. ⏳ Add automated a11y tests to CI/CD
7. ⏳ Train team on accessibility best practices

---

**Last Updated:** February 26, 2026  
**Next Review:** Weekly during Phase 1 development
