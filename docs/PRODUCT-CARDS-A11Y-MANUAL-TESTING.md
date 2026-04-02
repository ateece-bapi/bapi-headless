# Product Cards - Manual Accessibility Testing Checklist

**Date:** April 2, 2026  
**Target:** WCAG 2.1 Level AA compliance  
**Components:** ProductGrid (Advanced), ProductCard (Basic), QuickViewModal  
**Test Environment:** Storybook localhost:6006

---

## 🎯 Testing Overview

This checklist covers **manual accessibility testing** that cannot be automated:
- Keyboard navigation
- Screen reader testing (NVDA, JAWS, VoiceOver)
- Touch device testing (real devices)
- Focus management
- Motion sensitivity

**Automated tests already passing:**
- ✅ Color contrast (4.5:1+ ratios verified)
- ✅ ARIA attributes (axe-core validation)
- ✅ Touch target sizes (44x44px minimum)
- ✅ Semantic HTML structure

---

## 1️⃣ Keyboard Navigation Testing

### Test Environment
- **Story:** ProductGrid → Default (4 products)
- **Browser:** Chrome/Firefox/Safari
- **Tools:** Tab key, Enter/Space, arrow keys, Escape

### Test Cases

#### A. Tab Order & Focus Indicators
| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | Open Storybook → ProductGrid → Default | Story loads | ⬜ |
| 2 | Press `Tab` | Focus moves to first product card Link | ⬜ |
| 3 | Verify focus ring | Blue ring (`ring-4 ring-primary-500/50`) visible | ⬜ |
| 4 | Press `Tab` again | Focus moves to Comparison button (square icon) | ⬜ |
| 5 | Press `Tab` again | Focus moves to Quick View button (eye icon) | ⬜ |
| 6 | Press `Tab` again | Focus moves to second product card Link | ⬜ |
| 7 | Continue tabbing | Tab cycles through all cards in order | ⬜ |
| 8 | Press `Shift+Tab` | Focus moves backward through elements | ⬜ |

**Expected Tab Order per Card:**
1. Product card Link (entire card clickable)
2. Comparison button (checkbox)
3. Quick View button (eye icon)

#### B. Enter/Space Key Activation
| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | Tab to product card Link | Card has focus ring | ⬜ |
| 2 | Press `Enter` | Analytics logs `product_card_click` event | ⬜ |
| 3 | Tab to Comparison button | Button has focus ring | ⬜ |
| 4 | Press `Space` | Product added to comparison, checkbox fills | ⬜ |
| 5 | Verify analytics | Console logs `comparison_added` event | ⬜ |
| 6 | Press `Space` again | Product removed from comparison | ⬜ |
| 7 | Tab to Quick View button | Button has focus ring | ⬜ |
| 8 | Press `Enter` | Quick View modal opens | ⬜ |
| 9 | Verify analytics | Console logs `quick_view_opened` event | ⬜ |
| 10 | Verify focus | Close button (✕) receives focus automatically | ⬜ |

#### C. Quick View Modal Keyboard Navigation
| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | Open Quick View modal | Modal opens, close button focused | ⬜ |
| 2 | Press `Tab` | Focus moves to "View Product Page" link | ⬜ |
| 3 | Press `Tab` | Focus moves to "Add to Cart" button | ⬜ |
| 4 | Press `Tab` | Focus wraps back to Close button (✕) | ⬜ |
| 5 | Press `Shift+Tab` | Focus moves backward: Add to Cart → View Page → Close | ⬜ |
| 6 | Verify focus trap | Focus NEVER leaves modal while open | ⬜ |
| 7 | Press `Escape` | Modal closes, focus returns to Quick View button | ⬜ |
| 8 | Verify analytics | Console logs `quick_view_closed` event with `time_open` | ⬜ |

#### D. Disabled State Handling
| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | Add 4 products to comparison | Comparison buttons on other cards greyed out | ⬜ |
| 2 | Tab to disabled Comparison button | Button receives focus (still tabbable) | ⬜ |
| 3 | Press `Space` or `Enter` | Nothing happens (button disabled) | ⬜ |
| 4 | Verify analytics | Console logs `comparison_limit_reached` event | ⬜ |
| 5 | Verify cursor | Cursor shows `not-allowed` icon on hover | ⬜ |

---

## 2️⃣ Screen Reader Testing

### Test Environment
- **Screen Readers:** 
  - Windows: NVDA (free), JAWS (trial)
  - macOS: VoiceOver (built-in)
  - Linux: Orca
- **Story:** ProductGrid → Default
- **Browser:** Firefox (NVDA), Safari (VoiceOver), Chrome (JAWS)

### NVDA Testing (Windows)

#### A. Component Announcements
| Step | Action | Expected Announcement | Status |
|------|--------|----------------------|--------|
| 1 | Start NVDA (`Ctrl+Alt+N`) | NVDA starts reading | ⬜ |
| 2 | Navigate to Storybook story | "ProductGrid Default" | ⬜ |
| 3 | Press `Down Arrow` to first card | "Temperature Sensor TS-101, link" | ⬜ |
| 4 | Continue reading | Price announced: "$149.00" | ⬜ |
| 5 | Navigate to Comparison button | "Add to comparison (max 4), button, not checked" | ⬜ |
| 6 | Activate button (`Enter`) | "Add to comparison (max 4), button, checked" | ⬜ |
| 7 | Navigate to Quick View button | "Quick view, button" | ⬜ |
| 8 | Read button hint (`Insert+Tab`) | "View product details without leaving this page" | ⬜ |

#### B. Sale & Stock Badges
| Step | Action | Expected Announcement | Status |
|------|--------|----------------------|--------|
| 1 | Navigate to product with Sale badge | "Sale" announced before product name | ⬜ |
| 2 | Navigate to product with Stock badge | "In Stock" announced after sale badge | ⬜ |
| 3 | Verify badge order | "Sale, In Stock, [Product Name], link" | ⬜ |

#### C. Quick View Modal
| Step | Action | Expected Announcement | Status |
|------|--------|----------------------|--------|
| 1 | Open Quick View modal | "Dialog, Quick view" | ⬜ |
| 2 | Read modal content | Product name announced as heading | ⬜ |
| 3 | Navigate to Close button | "Close quick view, button" | ⬜ |
| 4 | Read button hint | "Close quick view (or press ESC)" | ⬜ |
| 5 | Navigate to Add to Cart | "Add to Cart, button" | ⬜ |
| 6 | Press `Escape` | "Dialog closed" or focus returns to trigger | ⬜ |

#### D. Empty State
| Step | Action | Expected Announcement | Status |
|------|--------|----------------------|--------|
| 1 | Navigate to EmptyState story | Heading: "No products found" | ⬜ |
| 2 | Read suggestion text | "Try adjusting your filters..." | ⬜ |
| 3 | Verify icon | Image description or decorative role | ⬜ |

### VoiceOver Testing (macOS)

| Step | Action (VoiceOver Cmd+Arrows) | Expected Announcement | Status |
|------|-------------------------------|----------------------|--------|
| 1 | Start VoiceOver (`Cmd+F5`) | VoiceOver starts | ⬜ |
| 2 | Navigate to product card | "Temperature Sensor TS-101, link, group" | ⬜ |
| 3 | Rotor to links (`Cmd+U`) | All product cards listed | ⬜ |
| 4 | Rotor to buttons | Comparison + Quick View buttons listed | ⬜ |
| 5 | Open Quick View modal | "Dialog, Quick view" | ⬜ |
| 6 | Verify focus trap | Cannot navigate outside modal | ⬜ |

---

## 3️⃣ Touch Device Testing

### Test Environment
- **Devices:** iPhone 12+ (iOS), Samsung Galaxy (Android), iPad
- **Story:** ProductGrid → Default
- **Browsers:** Safari (iOS), Chrome (Android)

### Test Cases

#### A. Touch Target Sizing
| Device | Action | Expected Result | Status |
|--------|--------|-----------------|--------|
| iPhone | Tap Comparison button (square icon) | Button activates, no mis-clicks | ⬜ |
| iPhone | Tap Quick View button (eye icon) | Modal opens, no adjacent button activated | ⬜ |
| iPhone | Verify button size | Buttons feel "comfortably large" (44x44px) | ⬜ |
| Android | Repeat above tests | Same results as iPhone | ⬜ |
| iPad | Tap buttons in portrait mode | Buttons activate correctly | ⬜ |
| iPad | Tap buttons in landscape mode | Buttons activate correctly | ⬜ |

#### B. Mobile-Specific UI
| Device | Feature | Expected Result | Status |
|--------|---------|-----------------|--------|
| iPhone | Quick View/Comparison buttons | **Always visible** (not hover-dependent) | ⬜ |
| iPhone | Quick View modal | **Full-screen** (not small centered modal) | ⬜ |
| iPhone | Modal close button | Large (44x44px), easy to reach top-right | ⬜ |
| iPhone | Modal padding | Tighter (24px) vs desktop (32px) | ⬜ |
| Android | Repeat above | Same results as iPhone | ⬜ |

#### C. Gesture Support
| Device | Gesture | Expected Result | Status |
|--------|---------|-----------------|--------|
| iPhone | Swipe up to scroll grid | Grid scrolls smoothly | ⬜ |
| iPhone | Tap product card body | Analytics logs `product_card_click` | ⬜ |
| iPhone | Tap backdrop (outside modal) | Quick View modal closes | ⬜ |
| iPhone | Pinch-to-zoom product image (modal) | Zoom disabled (by design) or works | ⬜ |
| Android | Repeat above | Same results as iPhone | ⬜ |

#### D. Orientation Change
| Device | Action | Expected Result | Status |
|--------|--------|-----------------|--------|
| iPhone | Rotate to landscape | Grid adjusts columns (2→3), buttons still visible | ⬜ |
| iPhone | Open modal, rotate | Modal adapts to landscape, content readable | ⬜ |
| iPad | Portrait (1 column) | Large cards, buttons accessible | ⬜ |
| iPad | Landscape (2-3 columns) | Grid layout, buttons still 44x44px | ⬜ |

---

## 4️⃣ Focus Management Testing

### Test Cases

#### A. Focus Restoration
| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | Tab to Quick View button (card #2) | Button receives focus | ⬜ |
| 2 | Press `Enter` to open modal | Modal opens, Close button focused | ⬜ |
| 3 | Press `Escape` to close modal | Focus returns to Quick View button (card #2) | ⬜ |
| 4 | Tab to next element | Focus moves to card #3 Link | ⬜ |

#### B. Background Content Inert
| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | Open Quick View modal | Modal opens | ⬜ |
| 2 | Press `Tab` 10 times | Focus stays within modal (wraps around) | ⬜ |
| 3 | Try clicking background card (mouse) | Background still clickable (backdrop closes modal) | ⬜ |
| 4 | Try tabbing to background (keyboard) | **Impossible** - focus trapped in modal | ⬜ |

#### C. Scroll Lock
| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | Scroll page to middle of grid | Page scrolled | ⬜ |
| 2 | Open Quick View modal | Modal opens | ⬜ |
| 3 | Try scrolling with mouse wheel | **Page background does not scroll** | ⬜ |
| 4 | Try scrolling modal content | Modal content scrolls if needed | ⬜ |
| 5 | Close modal | Page scroll position preserved | ⬜ |

---

## 5️⃣ Motion Sensitivity Testing

### Test Cases

#### A. Reduced Motion Preference
| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | Enable reduced motion: Windows Settings → Accessibility → Display → Animation effects (off) | Setting enabled | ⬜ |
| 2 | Refresh Storybook page | Page loads | ⬜ |
| 3 | Observe card entrance animation | Cards still fade in OR appear instantly | ⬜ |
| 4 | Hover over card | Lift animation reduced/disabled | ⬜ |
| 5 | Open Quick View modal | Modal opens without scale animation | ⬜ |
| 6 | Observe shimmer effect (loading) | Shimmer still works OR static placeholder | ⬜ |
| 7 | macOS: System Preferences → Accessibility → Display → Reduce motion | Repeat tests 3-6 | ⬜ |

**Current Implementation Status:**
- ⚠️ **NOT YET IMPLEMENTED** - Add `@media (prefers-reduced-motion: reduce)` styles
- Animations to disable:
  - Card entrance: `translate-y-8 opacity-0` → instant
  - Card hover lift: `hover:-translate-y-1` → none
  - Modal scale-in: `animate-[scale-in_300ms]` → fade only
  - Image shimmer: `animate-[shimmer_2s]` → static grey

---

## 6️⃣ List View Mode Testing (Phase B)

### Test Cases

#### A. Grid vs List Toggle
| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | View Default story (grid mode) | 2-3 column grid layout | ⬜ |
| 2 | Change viewMode prop to 'list' (Controls panel) | Cards change to horizontal layout | ⬜ |
| 3 | Verify list layout | 160px square image, horizontal content | ⬜ |
| 4 | Verify part number badge | Badge visible (if product has one) | ⬜ |
| 5 | Verify buttons | Quick View + Comparison on right side | ⬜ |
| 6 | Tab through list cards | Same tab order as grid (card → comparison → quick view) | ⬜ |
| 7 | Verify analytics | Console logs include `view_mode: 'list'` | ⬜ |

#### B. List View Mobile
| Device | Action | Expected Result | Status |
|--------|--------|-----------------|--------|
| iPhone | View list mode | Cards stack vertically, readable | ⬜ |
| iPhone | Verify touch targets | Buttons still 44x44px | ⬜ |
| iPhone | Tap Comparison button | Button activates, no mis-clicks | ⬜ |

---

## 7️⃣ Part Number Badge Testing

### Test Cases

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | View product WITH partNumber | Badge shows part number (e.g., "TS-101") | ⬜ |
| 2 | Hover badge | Tooltip shows "Part Number" | ⬜ |
| 3 | View product WITHOUT partNumber | Badge shows SKU instead | ⬜ |
| 4 | Hover SKU badge | Tooltip shows "SKU" | ⬜ |
| 5 | View product with no part/SKU | Badge not rendered | ⬜ |
| 6 | Screen reader: Navigate to badge | Badge text announced correctly | ⬜ |

---

## 8️⃣ Analytics Verification

### Test Cases

| Interaction | Expected Console Log | Data Fields to Verify | Status |
|-------------|---------------------|----------------------|--------|
| Card enters viewport | `[Analytics] product_card_view` | product_id, viewport, is_touch_device | ⬜ |
| Hover card (mouse) | `[Analytics] product_card_hover` | hover duration (on leave) | ⬜ |
| Click card | `[Analytics] product_card_click` | timestamp, page_url | ⬜ |
| Check comparison | `[Analytics] comparison_added` | total_in_comparison | ⬜ |
| Uncheck comparison | `[Analytics] comparison_removed` | total_in_comparison | ⬜ |
| Add 5th product | `[Analytics] comparison_limit_reached` | attempted_product_id | ⬜ |
| Open Quick View | `[Analytics] quick_view_opened` | trigger: 'button_click' OR 'keyboard' | ⬜ |
| Close Quick View | `[Analytics] quick_view_closed` | time_open (seconds) | ⬜ |

---

## 🎯 Pass Criteria

To pass manual accessibility testing, the following must be verified:

### Critical (Must Pass)
- [ ] All interactive elements reachable via keyboard (Tab key)
- [ ] Visible focus indicators on all focusable elements (4.5:1 contrast)
- [ ] Enter/Space keys activate buttons and links
- [ ] Escape key closes modals and returns focus
- [ ] Focus trap works in Quick View modal (Tab cycles within modal only)
- [ ] Screen readers announce all content correctly (NVDA/VoiceOver)
- [ ] Touch targets meet 44x44px minimum on mobile devices
- [ ] Mobile controls always visible (not hover-dependent)
- [ ] Disabled buttons properly announced by screen readers

### Important (Should Pass)
- [ ] Focus restoration after closing modal (returns to trigger button)
- [ ] Background scroll locked when modal open
- [ ] Backdrop click closes modal
- [ ] Part number badge has tooltip and accessible name
- [ ] Analytics events fire correctly (console verification)
- [ ] List view mode accessible via keyboard/screen reader

### Nice to Have (Future Enhancement)
- [ ] Reduced motion support (animations disabled when user preference set)
- [ ] High contrast mode support (Windows High Contrast)
- [ ] Zoom to 200% without loss of functionality

---

## 📊 Testing Summary

**Date Tested:** _______________  
**Tested By:** _______________  
**Environment:** _______________

### Results

| Category | Tests Passed | Tests Failed | Pass Rate |
|----------|--------------|--------------|-----------|
| Keyboard Navigation | ___ / 25 | ___ | ___% |
| Screen Reader (NVDA) | ___ / 15 | ___ | ___% |
| Screen Reader (VoiceOver) | ___ / 6 | ___ | ___% |
| Touch Devices | ___ / 16 | ___ | ___% |
| Focus Management | ___ / 9 | ___ | ___% |
| Motion Sensitivity | ___ / 7 | ___ | ___% |
| List View Mode | ___ / 8 | ___ | ___% |
| Part Number Badge | ___ / 6 | ___ | ___% |
| Analytics | ___ / 8 | ___ | ___% |
| **TOTAL** | **___ / 100** | **___** | **___%** |

### Issues Found

| Issue # | Severity | Category | Description | Status |
|---------|----------|----------|-------------|--------|
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |

**Severity Levels:**
- 🔴 **Critical**: Blocks users, violates WCAG AA
- 🟠 **High**: Significant barrier, workaround exists
- 🟡 **Medium**: Minor inconvenience, polish improvement
- 🟢 **Low**: Edge case, cosmetic only

---

## 📝 Notes

### Browser Compatibility
- Chrome: _______________
- Firefox: _______________
- Safari: _______________
- Edge: _______________

### Device Testing
- iPhone (iOS 17+): _______________
- Android (Samsung/Pixel): _______________
- iPad: _______________

### Screen Reader Notes
- NVDA: _______________
- JAWS: _______________
- VoiceOver: _______________

### Recommendations
1. _______________
2. _______________
3. _______________

---

**Next Steps:**
1. Complete this checklist (estimated 2-3 hours)
2. File GitHub issues for any failures
3. Implement fixes
4. Re-test failed cases
5. Document final results in [PRODUCT-CARDS-A11Y-AUDIT-RESULTS.md](./PRODUCT-CARDS-A11Y-AUDIT-RESULTS.md)
