# Storybook Accessibility Violations - Tracking Log

**Instructions:** As you test each story in Storybook, document violations here. Update status as you fix them.

**Status Key:**
- 🔴 **Open** - Not fixed yet
- 🟡 **In Progress** - Currently being worked on
- ✅ **Fixed** - Resolved and verified in Storybook
- 🔵 **Deferred** - Will fix in future phase

---

## UI Component Stories

### Button.stories.tsx

**Story:** Primary  
**Status:** (Pending review)  
**Violations Found:**  
- None expected (component looks good)

**Story:** Accent  
**Status:** (Pending review)  
**Violations Found:**  

**Story:** Icon Only  
**Status:** (Pending review)  
**Violations Found:**  

---

### Toast.stories.tsx

**Story:** Success  
**Status:** (Pending review)  
**Violations Found:**  

**Story:** Error  
**Status:** (Pending review)  
**Violations Found:**  

**Story:** Warning  
**Status:** (Pending review)  
**Violations Found:**  

---

### ImageModal.stories.tsx

**Story:** Default  
**Status:** 🟡 Needs Review  
**Known Issues:**  
- Missing `role="dialog"` on modal container
- Missing `aria-modal="true"`
- Should add focus trap when open

**Action Items:**
```tsx
// Add to ImageModal.tsx backdrop div:
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
  className="fixed inset-0 z-50..."
>
```

---

### TaglineRotator.stories.tsx

**Story:** Default  
**Status:** (Pending review)  
**Violations Found:**  

**Notes:**  
- Check if rotation respects `prefers-reduced-motion`
- Verify content changes are announced to screen readers

---

## Cart Component Stories

### CartButton.stories.tsx

**Story:** Default  
**Status:** (Pending review)  
**Violations Found:**  

**Story:** With Items  
**Status:** (Pending review)  
**Violations Found:**  
- Check if item count badge is screen-reader accessible

---

### AddToCartButton.stories.tsx

**Story:** Default  
**Status:** (Pending review)  
**Violations Found:**  

**Story:** Loading State  
**Status:** (Pending review)  
**Violations Found:**  
- Check if loading state announced to screen readers
- Verify button properly disabled during loading

---

### CartDrawer.stories.tsx

**Story:** Empty Cart  
**Status:** (Pending review)  
**Violations Found:**  

**Story:** With Items  
**Status:** (Pending review)  
**Violations Found:**  

**Known Concerns:**
- Drawer needs `role="dialog"` and `aria-modal="true"`
- Close button needs aria-label
- Focus management on open/close
- Item count updates need aria-live region

---

## Product Component Stories

### ProductCard.stories.tsx

**Story:** Default  
**Status:** (Pending review)  
**Violations Found:**  

**Expected Issues:**
- Product images may need better alt text
- Check price formatting for screen readers
- Part number badge keyboard accessibility

**Story:** Missing Image  
**Status:** (Pending review)  
**Violations Found:**  

**Story:** No Part Number  
**Status:** (Pending review)  
**Violations Found:**  

---

### ProductHeroFast.stories.tsx

**Story:** Default  
**Status:** (Pending review)  
**Violations Found:**  

**Expected Issues:**
- Hero image needs descriptive alt text
- Check heading hierarchy (should be h1 or configurable)
- CTA buttons need clear labels

---

### ProductGallery.stories.tsx

**Story:** Default  
**Status:** (Pending review)  
**Violations Found:**  

**Expected Issues:**
- All thumbnail images need alt text
- Navigation arrows need aria-labels
- Current image state should be announced
- Keyboard navigation (arrow keys)

---

### FormComponents.stories.tsx

**Story:** (List specific stories)  
**Status:** (Pending review)  
**Violations Found:**  

**High Priority:**
- All form inputs MUST have associated labels
- Error messages need proper ARIA attributes
- Required fields need aria-required="true"

---

## Checkout Component Stories

### CheckoutWizard.stories.tsx

**Story:** Step 1 - Shipping  
**Status:** (Pending review)  
**Violations Found:**  

**Story:** Step 2 - Payment  
**Status:** (Pending review)  
**Violations Found:**  

**Story:** Step 3 - Review  
**Status:** (Pending review)  
**Violations Found:**  

**Critical Checks:**
- Step indicators have proper ARIA roles
- Current step announced to screen readers (`aria-current="step"`)
- Progress bar has `role="progressbar"` with `aria-valuenow`
- Form validation errors accessible
- All form inputs have labels

---

### CheckoutSummary.stories.tsx

**Story:** Default  
**Status:** (Pending review)  
**Violations Found:**  

**Checks:**
- Order total properly labeled
- Tax/shipping costs have semantic markup
- Edit links have descriptive text (not just "Edit")

---

## Example/Demo Stories (Lower Priority)

### Button.stories.ts (Example Story)

**Status:** 🔵 Deferred  
**Notes:** This is the default Storybook example. Can be removed or updated later.

---

### Header.stories.ts (Example Story)

**Status:** 🔵 Deferred  
**Notes:** Example story, low priority.

---

### Page.stories.ts (Example Story)

**Status:** 🔵 Deferred  
**Notes:** Example story, low priority.

---

## Design System Stories

### DesignSystem/Colors.stories.tsx

**Status:** (Pending review)  
**Violations Found:**  

**Check:**
- Color contrast ratios documented
- Visual-only information also conveyed through text

---

### DesignSystem/Icons.stories.tsx

**Status:** (Pending review)  
**Violations Found:**  

**Check:**
- Icons used in interactive contexts have labels
- Decorative icons marked with `aria-hidden="true"`

---

### DesignSystem/Typography.stories.tsx

**Status:** (Pending review)  
**Violations Found:**  

**Check:**
- Text samples have sufficient contrast
- Heading hierarchy examples are correct

---

## Navigation Stories

### Navigation.stories.tsx

**Status:** (Pending review)  
**Violations Found:**  

**Key Checks:**
- Language selector keyboard accessible
- Region selector keyboard accessible
- Dropdown menus have proper ARIA roles
- Selected items indicated to screen readers
- Focus management in dropdowns

---

## High Priority Summary

### P0 - Critical (Must Fix Before Phase 1 Launch)

1. **Form Labels** - All checkout form inputs must have labels
2. **Product Images** - Alt text on all ProductCard and ProductHeroFast images
3. **Icon-Only Buttons** - aria-labels on cart close, gallery nav, modal close
4. **Modal Dialogs** - role="dialog" and aria-modal="true" on modals
5. **Focus Indicators** - Visible focus rings on all interactive elements

### P1 - High (Fix During Phase 1)

6. **Color Contrast** - Fix any yellow text on light backgrounds
7. **Heading Hierarchy** - Verify h1→h2→h3 progression on all pages
8. **Link Hrefs** - Replace `<a onClick>` patterns with proper buttons
9. **ARIA Live Regions** - Cart count, toast notifications
10. **Keyboard Navigation** - Tab order logical, all controls reachable

### P2 - Medium (Post-Launch Priority)

11. **Landmark Regions** - Proper header/main/footer/nav structure
12. **ARIA Labels** - Enhanced descriptions for complex interactions
13. **Reduced Motion** - Respect prefers-reduced-motion for animations
14. **Touch Targets** - Minimum 44x44px on mobile

---

## Testing Notes

### Screen Reader Testing Results

**Component:** (Name)  
**Date Tested:** (Date)  
**Screen Reader:** VoiceOver / NVDA / JAWS  
**Result:** Pass / Fail  
**Issues Found:**  
- (List issues)

---

### Keyboard Navigation Testing Results

**Component:** (Name)  
**Date Tested:** (Date)  
**Tab Order:** Pass / Fail  
**Focus Visible:** Pass / Fail  
**Keyboard Controls:** Pass / Fail  
**Issues Found:**  
- (List issues)

---

## Batch Fix Opportunities

### Fix Pattern: Icon-Only Buttons
**Found In:**
- ImageModal close button
- CartDrawer close button
- ProductGallery navigation arrows
- Mobile menu toggle

**Fix:**
```tsx
<button aria-label="Descriptive action">
  <Icon />
</button>
```

---

### Fix Pattern: Form Labels
**Found In:**
- Checkout shipping form
- Checkout payment form
- Product search input
- Newsletter signup
- Account profile forms

**Fix:**
```tsx
<label htmlFor="inputId">Label Text</label>
<input id="inputId" name="inputName" />
```

---

### Fix Pattern: Product Image Alt Text
**Found In:**
- ProductCard (all instances)
- ProductHeroFast
- ProductGallery
- Related products sections

**Fix:**
```tsx
<Image 
  src={product.image.sourceUrl}
  alt={`${product.name} - ${product.shortDescription?.substring(0, 50)}`}
  width={300}
  height={300}
/>
```

---

## Questions for Team Review

1. **Yellow Accent Color:** Accent yellow (#FFC843) fails contrast on white. Should we:
   - Only use as background with dark text? ✅ Recommended
   - Darken the yellow for text use?
   - Create separate text/background variants?

2. **Modal Focus Trap:** Should we add a focus-trap library or implement custom solution?

3. **Screen Reader Testing:** Who on the team has experience with VoiceOver/NVDA?

4. **Automated Testing:** Should we add jest-axe for automated a11y tests in Vitest?

---

## Progress Tracking

**Total Stories:** 58+  
**Stories Reviewed:** 0  
**Violations Found:** 0  
**Violations Fixed:** 0  
**Coverage:** 0%

**Last Updated:** February 26, 2026  
**Next Review Session:** (Schedule date)

---

## Template for New Violation

### ComponentName.stories.tsx

**Story:** StoryName  
**Status:** 🔴 Open  
**Violations Found:**  
- Violation description
- WCAG Rule: X.X.X Name (Level AA)
- Severity: Critical/High/Medium/Low

**Fix Required:**
```tsx
// Code showing the fix
```

**Verification:**
- [ ] Fix applied to component
- [ ] Storybook Accessibility tab shows green
- [ ] Tested with keyboard
- [ ] Tested with screen reader
- [ ] Added to regression tests (if applicable)
