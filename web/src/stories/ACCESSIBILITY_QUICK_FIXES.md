# Accessibility Quick Fixes - Storybook Reference

Quick reference for fixing common accessibility issues found in Storybook's a11y addon.

## 🚨 Most Common Issues

### 1. Images Missing Alt Text

**Error in Storybook:** `Images must have alternate text`

```tsx
// ❌ BAD
<Image src="/product.jpg" width={300} height={300} />

// ✅ GOOD - Descriptive alt for content images
<Image 
  src="/product.jpg" 
  alt="Temperature Sensor TS-101 with digital display and mounting bracket"
  width={300} 
  height={300} 
/>

// ✅ GOOD - Empty alt for decorative images
<Image 
  src="/decorative-bg.jpg" 
  alt=""  // Empty string for decorative images
  width={300} 
  height={300} 
/>
```

**Where to check:**
- ProductCard component (product images)
- ProductHeroFast (hero images)
- ProductGallery (thumbnail and main images)
- Company page (team photos, facility images)

---

### 2. Button Without Accessible Name

**Error in Storybook:** `Buttons must have discernible text`

```tsx
// ❌ BAD - Icon-only button
<button onClick={handleClose}>
  <X className="h-5 w-5" />
</button>

// ✅ GOOD - aria-label
<button onClick={handleClose} aria-label="Close dialog">
  <X className="h-5 w-5" />
</button>

// ✅ ALSO GOOD - Visually hidden text
<button onClick={handleClose}>
  <X className="h-5 w-5" aria-hidden="true" />
  <span className="sr-only">Close dialog</span>
</button>
```

**Where to check:**
- Modal close buttons (ImageModal, dialogs)
- Cart drawer close button
- Product gallery navigation arrows
- Search button (magnifying glass icon)
- Filter toggle buttons

---

### 3. Color Contrast Insufficient

**Error in Storybook:** `Elements must have sufficient color contrast`

**BAPI Brand Colors - Contrast Ratios:**
- Primary Blue #1479BC on white: **4.52:1** ✅ (WCAG AA pass)
- Accent Yellow #FFC843 on white: **1.78:1** ❌ (WCAG fail)
- Neutral Gray #97999B on white: **4.92:1** ✅ (WCAG AA pass)

```tsx
// ❌ BAD - Yellow text on white (fails contrast)
<span className="text-accent-500 bg-white">Add to Cart</span>

// ✅ GOOD - Yellow background with dark text
<button className="bg-accent-500 text-neutral-900">Add to Cart</button>

// ✅ GOOD - Blue text on white (meets 4.5:1 ratio)
<span className="text-primary-600 bg-white">View Details</span>

// ❌ BAD - Light gray text on white
<p className="text-neutral-300">Secondary text</p>

// ✅ GOOD - Dark gray text on white
<p className="text-neutral-700">Secondary text</p>
```

**Quick Test:**
1. Open Chrome DevTools
2. Inspect element
3. Look for ⚠️ contrast warning in Styles panel
4. Use WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/

---

### 4. Form Input Without Label

**Error in Storybook:** `Form elements must have labels`

```tsx
// ❌ BAD - No label
<input type="text" name="email" placeholder="Email" />

// ✅ GOOD - Visible label
<label htmlFor="email" className="block text-sm font-medium">
  Email Address
</label>
<input 
  type="text" 
  id="email" 
  name="email" 
/>

// ✅ ALSO GOOD - aria-label (when visual label not desired)
<input 
  type="search" 
  aria-label="Search products"
  placeholder="Search..."
/>
```

**Where to check:**
- Checkout forms (all 4 steps)
- Product search bar
- Filter inputs
- Newsletter signup
- Account forms

---

### 5. Missing Focus Indicator

**Error in Storybook:** `Elements must have a focus indicator`

```tsx
// ❌ BAD - Focus outline removed
<button className="focus:outline-none">Click Me</button>

// ✅ GOOD - BAPI Standard Focus Ring
<button className="focus:outline-none focus:ring-4 focus:ring-primary-500/50 focus:ring-offset-2">
  Click Me
</button>

// ✅ GOOD - For links
<Link 
  href="/products" 
  className="focus:outline-none focus:ring-4 focus:ring-primary-500/50 focus:ring-offset-2 rounded-lg"
>
  View Products
</Link>
```

**BAPI Focus Ring Classes:**
```tsx
// Primary variant
focus:outline-none focus:ring-4 focus:ring-primary-500/50

// Accent variant
focus:outline-none focus:ring-4 focus:ring-accent-500/50

// With offset (for filled backgrounds)
focus:ring-offset-2
```

---

### 6. Heading Hierarchy Skipped

**Error in Storybook:** `Heading levels should only increase by one`

```tsx
// ❌ BAD - Skips h2, goes straight to h3
<h1>Products</h1>
<h3>Temperature Sensors</h3>

// ✅ GOOD - Proper hierarchy
<h1>Products</h1>
<h2>Temperature Sensors</h2>
<h3>High Accuracy Models</h3>
```

**Heading Structure Rules:**
- **h1**: Page title (only once per page)
- **h2**: Major sections
- **h3**: Subsections
- **Never skip levels** (h1 → h2 → h3, not h1 → h3)
- **Visual styling ≠ semantic level** (use CSS to style)

```tsx
// ✅ Semantic heading with custom styling
<h2 className="text-sm font-medium">Small Section Title</h2>
```

---

### 7. Link Without Href

**Error in Storybook:** `Links must have an href`

```tsx
// ❌ BAD
<a onClick={handleClick}>Learn More</a>
<a href="#">Top</a>

// ✅ GOOD - Use button for actions
<button onClick={handleClick} className="text-primary-500 underline">
  Learn More
</button>

// ✅ GOOD - Use Link with proper href
<Link href="/about">Learn More</Link>

// ✅ GOOD - External link
<a 
  href="https://example.com" 
  target="_blank" 
  rel="noopener noreferrer"
>
  External Resource
  <span className="sr-only"> (opens in new tab)</span>
</a>
```

---

### 8. Modal/Dialog Issues

**Error in Storybook:** `Dialogs should have role and aria attributes`

```tsx
// ✅ GOOD - Accessible modal
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
  aria-describedby="modal-description"
  className="fixed inset-0 z-50"
>
  <div className="bg-white p-6 rounded-lg">
    <h2 id="modal-title">Confirm Deletion</h2>
    <p id="modal-description">Are you sure you want to delete this item?</p>
    
    <button onClick={handleConfirm}>Confirm</button>
    <button onClick={handleCancel}>Cancel</button>
  </div>
</div>
```

**Modal Accessibility Checklist:**
- [ ] Has `role="dialog"`
- [ ] Has `aria-modal="true"`
- [ ] Has `aria-labelledby` pointing to title
- [ ] Has `aria-describedby` pointing to description (optional)
- [ ] Focus trapped within modal
- [ ] Escape key closes modal
- [ ] Focus returns to trigger on close
- [ ] Close button has aria-label

---

### 9. List Items Outside List

**Error in Storybook:** `List items must be contained in ul or ol`

```tsx
// ❌ BAD
<div>
  <li>Item 1</li>
  <li>Item 2</li>
</div>

// ✅ GOOD
<ul>
  <li>Item 1</li>
  <li>Item 2</li>
</ul>

// ✅ GOOD - Navigation list
<nav aria-label="Main navigation">
  <ul>
    <li><Link href="/products">Products</Link></li>
    <li><Link href="/support">Support</Link></li>
  </ul>
</nav>
```

---

### 10. ARIA Hidden Elements With Focusable Content

**Error in Storybook:** `Hidden elements should not be focusable`

```tsx
// ❌ BAD - Button inside aria-hidden element
<div aria-hidden="true">
  <button>Click Me</button>  {/* Still keyboard accessible! */}
</div>

// ✅ GOOD - Prevent focus with inert
<div aria-hidden="true" inert>
  <button>Click Me</button>  {/* Now truly hidden from keyboard */}
</div>

// ✅ GOOD - Hide icon, keep button accessible
<button>
  <ShoppingCart aria-hidden="true" />
  Add to Cart
</button>
```

---

## Component-Specific Checklists

### ImageModal ✅ (Already Good!)
- [x] All control buttons have aria-labels
- [x] Keyboard navigation (Escape closes)
- [ ] Add `role="dialog"` and `aria-modal="true"`
- [ ] Focus trap when open

### ProductCard
- [ ] Product image has descriptive alt text
- [ ] Part number badge is keyboard accessible
- [ ] Price has semantic markup (not just styled)

### AddToCartButton
- [ ] Loading state announced to screen readers
- [ ] Success message has `role="status"` or `aria-live="polite"`
- [ ] Button disabled during loading

### CartDrawer
- [ ] Has `role="dialog"` and `aria-modal="true"`
- [ ] Close button has aria-label
- [ ] Focus trapped when open
- [ ] Item count updates announced

### CheckoutWizard
- [ ] Step indicators have proper ARIA roles
- [ ] Current step announced to screen readers
- [ ] Progress bar has `role="progressbar"` with aria-valuenow

---

## Testing Checklist

### In Storybook
1. Open story: http://localhost:6006
2. Click "Accessibility" tab
3. Check for:
   - 🔴 **Violations** (must fix)
   - 🟡 **Incomplete** (manual review needed)
   - 🟢 **Passes** (all green)

### Keyboard Navigation
1. Tab through all interactive elements
2. Verify focus visible on each element
3. Enter/Space activates buttons
4. Arrow keys work in custom controls (dropdowns, sliders)
5. Escape closes modals/dialogs

### Screen Reader (VoiceOver on macOS)
```bash
# Enable: Cmd + F5
# Navigate: Control + Option + Arrow keys
# Read continuous: Control + Option + A
# Stop: Control
```

**What to test:**
- All text content is read
- Button labels are descriptive
- Form inputs have labels
- Images have alt text
- Heading hierarchy makes sense
- Page structure is logical

---

## Quick Fix Utilities

### sr-only Class (Screen Reader Only)
```tsx
// Hides visually but keeps for screen readers
<span className="sr-only">
  3 items in cart
</span>
```

**Tailwind sr-only defined as:**
```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

### Focus Ring Utility
```tsx
// Reusable focus ring class
const focusRing = "focus:outline-none focus:ring-4 focus:ring-primary-500/50 focus:ring-offset-2";

<button className={`bg-primary-500 ${focusRing}`}>
  Click Me
</button>
```

---

## Resources

- **Storybook A11y Addon Docs:** https://storybook.js.org/addons/@storybook/addon-a11y
- **WCAG Quick Reference:** https://www.w3.org/WAI/WCAG21/quickref/
- **WebAIM Contrast Checker:** https://webaim.org/resources/contrastchecker/
- **ARIA Authoring Practices:** https://www.w3.org/WAI/ARIA/apg/
- **axe Rules:** https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md

---

**Next Steps:**
1. Run through each Storybook story
2. Fix violations using this guide
3. Re-test in Accessibility tab
4. Add accessibility tests to Vitest
5. Document any new patterns in this guide
