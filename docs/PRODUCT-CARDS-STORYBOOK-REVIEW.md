# Product Cards - Storybook Review (April 2, 2026)

## Overview for Matt (UI/UX Designer)

All product card components are now available in Storybook for review and design feedback. This document explains what we found and the current state of product card implementations.

---

## 🔍 What We Found: TWO Different ProductCard Implementations

We discovered we have **two separate product card components** with different features and use cases:

### 1. **Basic ProductCard** (`web/src/components/products/ProductCard.tsx`)
**Location in Storybook:** `Components → Products → ProductCard`

**Features:**
- ✅ Grid view mode (default)
- ✅ List view mode (toggle via `viewMode` prop)
- ✅ Part number badge (top-right)
- ✅ Product name with animated yellow underline on hover
- ✅ Short description (HTML stripped, 120-char limit, 2-line clamp)
- ✅ Price display
- ✅ "View Details" CTA with animated arrow
- ✅ Gradient background on hover
- ✅ Decorative corner element
- ✅ Staggered grid animation via `index` prop
- ✅ Image zoom effect on hover

**Current Storybook Coverage:** ✅ **Comprehensive** (12 stories, 600 lines)
- Default, MissingImage, NoPartNumber, NoPrice, NoDescription
- LongTitle, LongDescription, PremiumProduct
- ProductGrid, MobileView, TabletView, DesktopView

**Where is this used?**
- Simple product listings (need to verify in production)
- Potentially legacy component

---

### 2. **Advanced ProductCard** (inside `web/src/components/products/ProductGrid.tsx`)
**Location in Storybook:** `Components → Products → ProductGrid`

**Additional Features (beyond Basic ProductCard):**
- ✅ **Quick View button** (eye icon, hover overlay)
- ✅ **Product Comparison checkbox** (max 3-4 products)
- ✅ **Sale badge** (yellow BAPI accent gradient)
- ✅ **Stock status badge** (green gradient, "In Stock")
- ✅ **Shimmer loading effect** on images
- ✅ **Intersection Observer** for lazy loading/staggered animation
- ✅ **Currency conversion support** (via region store)
- ✅ **Variable product support** (price ranges)
- ✅ **"Contact for Pricing"** when price is null
- ✅ More sophisticated hover effects and gradients

**Current Storybook Coverage:** ✅ **Just Added** (25+ stories)
- Default, EmptyState, SingleProduct, ManyProducts
- WithSale, OutOfStock, NoImages, NoPrices, NoDescriptions, LongNames
- VariableProduct, MixedProductTypes
- Mobile, Tablet, Desktop, WideDesktop
- HoverStates, LoadingImages
- SearchResults, CategoryListing, FilteredResults

**Where is this used?**
- ✅ **PRODUCTION product listings** (confirmed in `/[locale]/products` pages)
- ✅ Category pages
- ✅ Search results
- ✅ Filtered product views

---

### 3. **ProductCardSkeleton** (`web/src/components/skeletons/ProductCardSkeleton.tsx`)
**Location in Storybook:** `Components → Skeletons → ProductCardSkeleton`

**Features:**
- Pulse animation loading state
- Matches ProductCard aspect ratio (3:2 image + content)
- Accessible (sr-only "Loading..." text)
- Neutral gray placeholders

**Current Storybook Coverage:** ✅ **Just Added** (11 stories)
- Default, Grid, GridLarge, GridFullPage
- Mobile, Tablet, Desktop, WideDesktop
- LoadingMoreProducts, FilterUpdate

**Where is this used?**
- Product grid initial load
- Pagination/infinite scroll
- Filter changes

---

## 🎨 Design Review Questions for Matt

### Critical Questions:

1. **Should we consolidate the two ProductCard implementations?**
   - Basic ProductCard has `viewMode` (grid/list) that Advanced ProductCard lacks
   - Advanced ProductCard has Quick View, Comparison, Sale/Stock badges
   - Do we want ONE unified component with all features?

2. **Which design is the "source of truth"?**
   - Advanced ProductCard (in ProductGrid) is used in production
   - Basic ProductCard has more polished animations (yellow underline, decorative corner)
   - Should we merge the best of both?

3. **Sale Badge Design:**
   - Currently: Yellow BAPI accent gradient, "Sale" text
   - Should we show discount percentage? ("25% Off")
   - Badge position: top-left (current) or top-right?

4. **Stock Status Badge:**
   - Currently: Green gradient, "In Stock" text
   - What about low stock? ("Only 3 left")
   - Show "Out of Stock" badge or just hide it?

5. **Part Number Badge:**
   - Only in Basic ProductCard (top-right)
   - Should Advanced ProductCard also show part numbers?
   - Currently only ~20 of 608 products have part numbers

6. **Price Display:**
   - "Contact for Pricing" wording acceptable?
   - Should we show "Request Quote" button instead?
   - Variable products show range: "$299.00 - $599.00" - is this clear?

7. **Hover Effects:**
   - Basic: Yellow underline, decorative corner, gradient background
   - Advanced: Card lift, image zoom, Quick View/Comparison buttons
   - Which effects do we keep/remove?

8. **Empty State:**
   - Current design has icon, message, helpful suggestions
   - Is the messaging helpful or too wordy?

---

## 📊 Storybook Coverage Summary

| Component | File | Stories | Status |
|-----------|------|---------|--------|
| Basic ProductCard | `ProductCard.tsx` | 12 | ✅ Existing |
| Advanced ProductCard | `ProductGrid.tsx` | 25+ | ✅ Just Added |
| ProductCardSkeleton | `ProductCardSkeleton.tsx` | 11 | ✅ Just Added |
| **TOTAL** | | **48+** | ✅ Complete |

---

## 🚀 How to Review in Storybook

### Start Storybook:
```bash
cd /home/ateece/bapi-headless/web
pnpm run storybook
```

### Navigate to Stories:
1. **Basic ProductCard:** `Components → Products → ProductCard`
2. **Advanced ProductCard (Production):** `Components → Products → ProductGrid`
3. **Loading Skeleton:** `Components → Skeletons → ProductCardSkeleton`

### Test Interactivity:
- **Hover effects** on all cards
- **Quick View button** (Advanced ProductCard only)
- **Comparison checkbox** (Advanced ProductCard only)
- **Responsive layouts** (Mobile/Tablet/Desktop stories)
- **Different viewports** using Storybook viewport toolbar

---

## 🐛 Known Issues / Considerations

### 1. Component Duplication
- **Issue:** Two separate ProductCard implementations
- **Impact:** Maintenance burden, design inconsistencies
- **Solution:** Consider consolidating or clearly document use cases

### 2. Part Number Data Sparsity
- **Issue:** Only ~20 of 608 products have `partNumber` populated
- **Impact:** Badge rarely shows on Advanced ProductCard (not implemented)
- **Solution:** Decide if we need this field, fallback to SKU, or hide entirely

### 3. List View Missing in Advanced ProductCard
- **Issue:** Basic ProductCard has grid/list toggle, Advanced doesn't
- **Impact:** Can't show compact list view in production pages
- **Solution:** Add list view mode to Advanced ProductCard if needed

### 4. Quick View Modal
- **Issue:** ProductGrid references QuickViewModal but story doesn't test it
- **Impact:** Can't review Quick View interaction in Storybook
- **Solution:** Add QuickViewModal stories or mock interaction

### 5. Product Comparison Hook
- **Issue:** Stories use real `useProductComparison` hook
- **Impact:** Comparison state persists across story navigation
- **Solution:** Consider mocking hook or adding "Reset Comparison" action

### 6. Currency Conversion
- **Issue:** Stories use real `useRegion` hook from regionStore
- **Impact:** Can't easily test different currencies in Storybook
- **Solution:** Add currency controls or mock region store

---

## 📋 Next Steps

### For Matt (UI/UX Designer):
1. ✅ Review all stories in Storybook
2. ✅ Answer design questions above
3. ✅ Provide feedback on hover effects, badges, spacing
4. ✅ Decide on component consolidation strategy
5. ✅ Review responsive layouts (especially mobile)
6. ✅ Check accessibility (color contrast, focus states)

### For Development Team:
1. ⏳ Wait for Matt's feedback
2. ⏳ Implement design changes based on feedback
3. ⏳ Consolidate components if needed
4. ⏳ Add QuickViewModal stories
5. ⏳ Mock hooks for better Storybook isolation
6. ⏳ Run Chromatic visual regression tests

---

## 🔗 Related Documentation

- **Storybook Setup:** [docs/CHROMATIC-SETUP.md](./CHROMATIC-SETUP.md)
- **Component Patterns:** [docs/COMPONENT_PATTERNS.md](./COMPONENT_PATTERNS.md)
- **Design System:** [web/COLOR_SYSTEM.md](../web/COLOR_SYSTEM.md)
- **Tailwind Guidelines:** [web/TAILWIND_GUIDELINES.md](../web/TAILWIND_GUIDELINES.md)
- **Accessibility:** [docs/ACCESSIBILITY-AUDIT-PHASE1.md](./ACCESSIBILITY-AUDIT-PHASE1.md)

---

## 📝 Feedback Template for Matt

**Please review and provide feedback using this template:**

```markdown
## Product Card Design Feedback

### Component Consolidation:
- [ ] Keep both components separate (document use cases clearly)
- [ ] Consolidate into one unified ProductCard component
- [ ] Enhance Advanced ProductCard with missing features from Basic

### Sale Badge:
- Position: [top-left | top-right | other: ___]
- Content: [just "Sale" | show discount % | other: ___]
- Style: [current gradient | solid color | other: ___]

### Stock Status Badge:
- Show for in-stock: [yes | no]
- Show for low stock: [yes | no | threshold: ___]
- Show for out-of-stock: [yes | no]

### Part Number:
- Display in Advanced ProductCard: [yes | no]
- Fallback to SKU if missing: [yes | no]
- Badge position: [top-right | other: ___]

### Price Display:
- "Contact for Pricing" wording: [keep | change to: ___]
- Add "Request Quote" button: [yes | no]
- Variable product range format: [current | show "from $X" | other: ___]

### Hover Effects:
- Card lift: [keep | remove | adjust: ___]
- Image zoom: [keep | remove | adjust: ___]
- Yellow underline: [add to Advanced | remove from Basic | keep as-is]
- Decorative corner: [add to Advanced | remove from Basic | keep as-is]
- Quick View/Comparison reveal: [keep | show always | other: ___]

### Responsive Design:
- Mobile layout: [approve | adjust: ___]
- Tablet layout: [approve | adjust: ___]
- Desktop layout: [approve | adjust: ___]
- Column count at each breakpoint: [approve | adjust: ___]

### Empty State:
- Message clarity: [good | too wordy | adjust: ___]
- Icon choice: [approve | change to: ___]
- Suggestions helpful: [yes | no | adjust: ___]

### General Feedback:
[Add any additional comments, concerns, or suggestions here]

### Priority Changes:
1. [Highest priority change]
2. [Second priority]
3. [Third priority]
```

---

**Branch:** `feature/product-cards-storybook-review`  
**Date Created:** April 2, 2026  
**Status:** Ready for Matt's Review  
**Estimated Review Time:** 30-45 minutes
