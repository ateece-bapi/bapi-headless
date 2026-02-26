# Storybook Accessibility Setup - Complete ✅

**Date:** February 26, 2026  
**Status:** Ready for testing and remediation

---

## What We've Set Up

### 1. ✅ Storybook Running with A11y Addon
- **URL:** http://localhost:6006
- **Version:** Storybook 10.2.1
- **Addon:** @storybook/addon-a11y
- **Status:** Running successfully (ignore version warning for @storybook/test)

### 2. ✅ Documentation Created

**Primary Guides:**
1. **[STORYBOOK-ACCESSIBILITY-AUDIT.md](../../docs/STORYBOOK-ACCESSIBILITY-AUDIT.md)**
   - Complete accessibility testing guide
   - WCAG 2.1 Level AA compliance goals
   - Common issues and fixes
   - Component-specific checklists
   - Testing methodology

2. **[ACCESSIBILITY_QUICK_FIXES.md](./ACCESSIBILITY_QUICK_FIXES.md)**
   - Quick reference for common violations
   - Copy-paste code examples
   - Before/after comparisons
   - Component-specific checklists
   - Testing workflows

3. **[STORYBOOK-VIOLATIONS-LOG.md](../../docs/STORYBOOK-VIOLATIONS-LOG.md)**
   - Tracking template for violations
   - Story-by-story checklist
   - Priority levels (P0-P2)
   - Progress tracking

### 3. ✅ Example Fix Applied

**Component:** ImageModal.tsx  
**Issue:** Missing dialog role and aria attributes  
**Fix Applied:**
```tsx
// Added to backdrop div:
role="dialog"
aria-modal="true"
aria-label="Product image viewer"
```

**How to Verify:**
1. Open http://localhost:6006
2. Navigate to UI/ImageModal → Default story
3. Click "Accessibility" tab
4. Should see green checkmarks (passes)

---

## How to Test Your Storybook

### Step 1: Access Storybook
```bash
# If not already running:
cd web/
pnpm run storybook
```
Open: http://localhost:6006

### Step 2: Navigate Stories
Expand the sidebar to see all story categories:
- **Tests/** - AccessibilityGuide with examples
- **UI/** - Button, Toast, ImageModal, TaglineRotator
- **Components/Cart/** - CartButton, AddToCartButton, CartDrawer
- **Components/Products/** - ProductCard, ProductHeroFast, ProductGallery
- **Components/Checkout/** - CheckoutWizard, CheckoutSummary
- **DesignSystem/** - Colors, Icons, Typography

### Step 3: Check Accessibility for Each Story

1. **Click a story** from the sidebar
2. **Click "Accessibility" tab** at bottom of canvas
3. **Review results:**
   - 🟢 **Passes** - No issues found
   - 🟡 **Incomplete** - Needs manual review
   - 🔴 **Violations** - Must fix

4. **Click on violation** to see:
   - Rule description
   - Element(s) affected
   - How to fix
   - WCAG reference

### Step 4: Document Violations

Open [STORYBOOK-VIOLATIONS-LOG.md](../../docs/STORYBOOK-VIOLATIONS-LOG.md) and record:
- Story name
- Violation description
- WCAG rule violated
- Priority level
- Fix required

### Step 5: Fix Violations

Use [ACCESSIBILITY_QUICK_FIXES.md](./ACCESSIBILITY_QUICK_FIXES.md) as reference:
1. Find the pattern matching your violation
2. Apply the fix to the component (not just the story)
3. Reload Storybook
4. Verify fix in Accessibility tab

### Step 6: Test with Keyboard

For each story with interactive elements:
- Press **Tab** to navigate through interactive elements
- Verify **focus ring is visible** on each element
- Press **Enter** or **Space** to activate buttons
- Press **Escape** to close modals/dropdowns
- Use **Arrow keys** for custom controls

### Step 7: Test with Screen Reader (Advanced)

**macOS - VoiceOver:**
```bash
# Enable/Disable: Cmd + F5
# Navigate: Control + Option + Arrow keys
# Read continuous: Control + Option + A
# Stop: Control
```

**Windows - NVDA (Free):**
Download: https://www.nvaccess.org/
- Navigate: Arrow keys
- Read continuous: NVDA + Down arrow
- Stop: Control

---

## Common Violations You'll Find

### Top 5 Expected Issues

1. **Images without alt text**
   - **Where:** ProductCard, ProductHeroFast, ProductGallery
   - **Fix:** Add descriptive `alt` attribute
   - **Example:** `alt="Temperature Sensor TS-101 with digital display"`

2. **Buttons without accessible names**
   - **Where:** Modal close buttons, gallery arrows, menu toggles
   - **Fix:** Add `aria-label` attribute
   - **Example:** `<button aria-label="Close modal"><X /></button>`

3. **Form inputs without labels**
   - **Where:** Checkout forms, search inputs, filters
   - **Fix:** Add `<label htmlFor="inputId">` before input
   - **Example:** `<label htmlFor="email">Email</label><input id="email" />`

4. **Insufficient color contrast**
   - **Where:** Yellow text on light backgrounds
   - **Fix:** Use yellow as background with dark text instead
   - **Example:** `className="bg-accent-500 text-neutral-900"`

5. **Missing focus indicators**
   - **Where:** Custom styled buttons/links
   - **Fix:** Add BAPI focus ring classes
   - **Example:** `focus:outline-none focus:ring-4 focus:ring-primary-500/50`

---

## Priority Levels

### P0 - Critical (Block Phase 1 Launch)
- Missing form labels (checkout forms)
- Missing alt text on product images
- Icon-only buttons without labels
- Dialog modals missing proper ARIA roles
- Color contrast failures

**Goal:** Fix before April 6 stakeholder presentation

### P1 - High (Fix During Phase 1)
- Missing focus indicators
- Incorrect heading hierarchy
- Links without proper href
- ARIA live regions for dynamic updates

**Goal:** Fix before April 10 launch

### P2 - Medium (Post-Launch)
- Landmark regions
- Reduced motion preferences
- Touch target sizes
- Enhanced ARIA descriptions

**Goal:** Address in Phase 2

---

## Example Workflow

### Fixing ProductCard Image Alt Text

**1. Find violation in Storybook:**
```
Story: Components/Products/ProductCard → Default
Violation: <img> element missing alt attribute
WCAG: 1.1.1 Non-text Content (Level A)
```

**2. Locate component:**
```
web/src/components/products/ProductCard.tsx
```

**3. Find the Image component:**
```tsx
<Image 
  src={image.sourceUrl}
  width={300}
  height={300}
/>
```

**4. Add descriptive alt text:**
```tsx
<Image 
  src={image.sourceUrl}
  alt={`${name}${partNumber ? ` (${partNumber})` : ''}`}
  width={300}
  height={300}
/>
```

**5. Reload Storybook and verify:**
- Accessibility tab shows green for image-alt rule
- Screen reader reads the alt text

**6. Update violations log:**
```markdown
### ProductCard.stories.tsx
**Story:** Default
**Status:** ✅ Fixed
**Violation:** Missing alt text on product image
**Fix Applied:** Added descriptive alt combining product name and part number
**Verified:** 2026-02-26
```

---

## Tools & Resources

### Browser Extensions
- **WAVE:** https://wave.webaim.org/extension/
- **axe DevTools:** https://www.deque.com/axe/devtools/
- **Lighthouse:** Built into Chrome DevTools

### Testing Tools
- **Contrast Checker:** https://webaim.org/resources/contrastchecker/
- **Screen Reader:** VoiceOver (macOS), NVDA (Windows, free)
- **Keyboard:** Built into every browser

### Documentation
- **WCAG 2.1 Quick Ref:** https://www.w3.org/WAI/WCAG21/quickref/
- **ARIA Patterns:** https://www.w3.org/WAI/ARIA/apg/
- **Storybook A11y Docs:** https://storybook.js.org/addons/@storybook/addon-a11y
- **axe Rules List:** https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md

---

## Next Steps

### Immediate Actions (This Week)

1. **Review AccessibilityGuide Stories**
   - Open Tests/AccessibilityGuide in Storybook
   - Review good vs bad examples
   - Understand the patterns

2. **Audit UI Components (2-3 hours)**
   - Button.stories.tsx
   - Toast.stories.tsx
   - ImageModal.stories.tsx ✅ (already fixed)
   - TaglineRotator.stories.tsx

3. **Audit Cart Components (1-2 hours)**
   - CartButton.stories.tsx
   - AddToCartButton.stories.tsx
   - CartDrawer.stories.tsx

4. **Start Violations Log**
   - Document issues as you find them
   - Prioritize P0 violations
   - Assign to team members

### Week 2 Actions

5. **Audit Product Components (3-4 hours)**
   - ProductCard.stories.tsx (critical - many instances)
   - ProductHeroFast.stories.tsx
   - ProductGallery.stories.tsx
   - FormComponents.stories.tsx

6. **Fix P0 Violations**
   - Form labels
   - Image alt text
   - Icon button labels
   - Color contrast

### Week 3 Actions

7. **Audit Checkout Components (2-3 hours)**
   - CheckoutWizard.stories.tsx (critical - payment forms)
   - CheckoutSummary.stories.tsx

8. **Screen Reader Testing**
   - Test fixed components with VoiceOver/NVDA
   - Document any issues not caught by automated tools

9. **Keyboard Navigation Testing**
   - Tab through entire checkout flow
   - Test product browsing and cart interactions

### Week 4 Actions

10. **Final Review & Documentation**
    - Verify all P0 violations fixed
    - Update violations log with status
    - Create accessibility compliance report
    - Present to stakeholders (April 6 target)

---

## Success Metrics

**Target for Phase 1 Launch (April 10, 2026):**
- ✅ 100% of P0 violations fixed
- ✅ 90%+ of P1 violations fixed
- ✅ All checkout forms fully accessible
- ✅ All product images have alt text
- ✅ All interactive elements keyboard accessible
- ✅ WCAG 2.1 Level AA compliance achieved

**How to Track Progress:**
```markdown
Total Stories: 58+
Stories Reviewed: 0 → Update as you go
Violations Found: 0 → Document each one
Violations Fixed: 0 → Update as you fix
Coverage: 0% → Target 100% by April 6
```

---

## Questions?

**Common Questions:**

**Q: Do I need to fix violations in the example stories (Button.stories.ts, Header.stories.ts)?**
A: No, those are Storybook defaults. Focus on your actual component stories in Components/ and UI/ folders.

**Q: What about the @storybook/test version warning?**
A: Safe to ignore. The test package doesn't have a v10 release yet but Storybook still works fine.

**Q: Should I fix issues in the story file or the component file?**
A: Always fix in the component file (e.g., ProductCard.tsx), not the story file. Stories are just for documentation.

**Q: What if an accessibility rule doesn't apply to our use case?**
A: Document it in the violations log with explanation and mark as "Deferred" with justification.

**Q: How do I handle decorative images?**
A: Use empty alt: `alt=""` - this tells screen readers to skip the image.

**Q: What's the difference between aria-label and aria-labelledby?**
- `aria-label="Close"` - Provides a text label directly
- `aria-labelledby="elementId"` - References another element's text as the label

---

## Contact & Support

**For Accessibility Questions:**
- Review this documentation first
- Check WCAG Quick Reference: https://www.w3.org/WAI/WCAG21/quickref/
- Ask in team Slack channel
- Consult with senior developers

**Escalation Path:**
1. Try to fix using quick fixes guide
2. Check WCAG documentation
3. Ask team member who has screen reader experience
4. Document as "needs review" and continue with next item

---

**Last Updated:** February 26, 2026  
**Created By:** GitHub Copilot  
**Status:** Ready for team use ✅
