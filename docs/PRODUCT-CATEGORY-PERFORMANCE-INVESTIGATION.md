# Product Category Page Performance Investigation

**Date:** June 3, 2026  
**Branch:** `fix/product-category-performance-critical`  
**File:** `/web/src/app/[locale]/products/[category]/[subcategory]/page.tsx`  
**URL Example:** `/en/products/temperature-sensors/temp-room`

---

## 🔍 Current Implementation Analysis

### Page Configuration

**ISR/Caching:**
- ❌ NO `revalidate` export - defaults to dynamic rendering
- ❌ NO `force-dynamic` export (good)
- ✅ Uses `getGraphQLClient()` with cache tags

**Result:** Page is dynamically rendered on EVERY request (no static generation)

### GraphQL Queries

**Two major queries per page load:**

1. **GetProductCategoryWithChildrenDocument**
   - Fetches category metadata, description, hierarchy
   - Includes parent/grandparent categories
   - Includes child subcategories with images

2. **GetProductsWithFiltersDocument**
   - Fetches ALL products in category (pagination loop)
   - Fetches 24 products per request
   - Loops until all products loaded (up to 1000 product safety limit)
   - For `temp-room` subcategory: ~23 products expected

**Performance Impact:**
- Cold server-side execution on EVERY page view
- Multiple round-trips if >24 products
- Heavy payload for product data

### Image Components

**Category Header Icon:**
```tsx
<Image
  src={getCategoryIcon(parentCategory?.slug || category)}
  alt={...}
  width={16}
  height={16}
/>
```
- ✅ Small size (16x16)
- ✅ Optimized

**Subcategory Cards (if has sub-subcategories):**
```tsx
<Image
  src={subSub.image.sourceUrl}
  alt={...}
  fill
  sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
  priority={index < 4}
/>
```
- ✅ Priority on first 4 images (good!)
- ✅ Responsive sizes
- ⚠️ But uses `fill` prop (aspect-[3/2])

**Product Grid Images (in FilteredProductGrid):**
- ❌ NOT analyzed yet - likely culprit for LCP issues
- Need to check ProductGrid.tsx for image optimization

### Client Components Loading

**Heavy client-side components:**

1. **FilteredProductGrid** (`'use client'`)
   - Client-side filtering by customer group
   - Client-side sorting
   - Pagination (18 products per page)
   - Comparison functionality
   - Quick view modals
   - Intersection observer for lazy loading

2. **ProductFilters** (sidebar)
   - 15 filter taxonomies
   - Client-side filter state

3. **MobileFilterButton** (mobile)
   - Mobile filter drawer

4. **ProductSortDropdown**
   - Client-side sort controls

**TBT Impact:**
- Large JavaScript bundle for product filtering
- Client-side product filtering execution
- useAuth() hook for customer group filtering
- Intersection observers for each product card

---

## 🔴 Root Causes Identified

### Issue #1: No ISR - Dynamic Rendering Every Request

**Problem:** Page has no `revalidate` export  
**Impact:** Server-side GraphQL queries run on EVERY page load  
**LCP Impact:** Cold server execution adds 200-500ms  
**Fix:** Add `export const revalidate = 3600` (1 hour)

### Issue #2: Product Grid Images Not Optimized

**Problem:** Need to analyze ProductGrid component  
**Impact:** Large product images likely causing 4.9s LCP  
**Investigation Needed:**
- Check if product images have priority
- Check image sizes in grid
- Check if images are lazy loaded properly

### Issue #3: Heavy Client-Side JavaScript (TBT 580ms)

**Problem:** Multiple client components with heavy logic  
**Impact:** 580ms blocking time  
**Contributors:**
- FilteredProductGrid filtering logic
- Customer group filtering (useAuth + filtering)
- Product comparison state
- Quick view modals
- Intersection observers

### Issue #4: GraphQL Query Weight

**Problem:** Fetching ALL products in category upfront  
**Impact:** Heavy server-side processing  
**Current:** Loads all 23 products in temp-room  
**Alternative:** Could use pagination with smaller initial load

---

## 🎯 Proposed Fixes - Priority Order

### Fix #1: Add ISR (CRITICAL - Expected +10-15 points)

**Action:**
```tsx
// Add to /web/src/app/[locale]/products/[category]/[subcategory]/page.tsx
export const revalidate = 3600; // 1 hour
```

**Expected Impact:**
- LCP: 4.9s → 3.5-4.0s (saves 500-1000ms on cached pages)
- Performance: +10-15 points
- Reduces GraphQL query latency

**Implementation:** 5 minutes

---

### Fix #2: Optimize Product Grid Images (CRITICAL - Expected +15-20 points)

**Investigation Steps:**
1. Read ProductGrid.tsx to find image implementation
2. Check if product images have priority attribute
3. Check image sizes and quality settings
4. Verify lazy loading strategy

**Potential Fixes:**
- Add priority to first 6 product images (above fold)
- Reduce image quality from default to 85
- Optimize image sizes
- Preload LCP image

**Expected Impact:**
- LCP: 4.0s → 2.0-2.5s (saves 1.5-2.0s!)
- Performance: +15-20 points

**Implementation:** 30-60 minutes

---

### Fix #3: Code Splitting for Filters (Medium - Expected +5-10 points)

**Action:**
- Lazy load ProductFilters component
- Lazy load MobileFilterButton
- Defer non-critical filter taxonomies

**Expected Impact:**
- TBT: 580ms → 400-450ms (saves ~150ms)
- Performance: +5-10 points

**Implementation:** 20-30 minutes

---

### Fix #4: Optimize FilteredProductGrid (Medium - Expected +5-10 points)

**Actions:**
- Reduce initial products shown (12 instead of 18)
- Defer customer group filtering until after first paint
- Optimize useAuth hook execution
- Code split comparison functionality

**Expected Impact:**
- TBT: 450ms → 300-350ms (saves ~100ms)
- Performance: +5-10 points

**Implementation:** 45-60 minutes

---

## 📊 Expected Performance Improvements

### Phase 1: Quick Wins (Fix #1 + #2)

**Timeline:** 1-2 hours  
**Expected Results:**
- Performance: 42/100 → **70-75/100** (+28-33 points) ✅
- LCP: 4.9s → **2.0-2.5s** (meets <2.5s target!) ✅
- TBT: 580ms → **500-550ms** (still high)

**Status:** **MINIMUM VIABLE** for launch

---

### Phase 2: Full Optimization (All fixes)

**Timeline:** 3-4 hours total  
**Expected Results:**
- Performance: 42/100 → **80-90/100** (+38-48 points) ✅
- LCP: 4.9s → **1.8-2.2s** (<2.5s target) ✅
- TBT: 580ms → **250-350ms** (<350ms target) ✅

**Status:** **IDEAL** - matches homepage/wireless performance

---

## 📋 Implementation Plan

### Step 1: Add ISR (5 min) ⚡

1. Edit `/web/src/app/[locale]/products/[category]/[subcategory]/page.tsx`
2. Add `export const revalidate = 3600` after imports
3. Test build succeeds
4. Commit: "feat: add ISR to product category pages"

### Step 2: Investigate Product Grid Images (15 min) 🔍

1. Read ProductGrid.tsx image implementation
2. Read ProductCard.tsx (likely exists)
3. Identify LCP image element
4. Document current vs ideal state

### Step 3: Optimize Product Images (30-45 min) 🖼️

1. Add priority to first 6 product cards
2. Optimize image sizes/quality
3. Add preload for LCP image if needed
4. Test locally with Lighthouse
5. Commit: "perf: optimize product grid images for LCP"

### Step 4: Test on Vercel Preview (10 min) 📊

1. Push branch to GitHub
2. Wait for Vercel preview deployment
3. Run Lighthouse on preview URL
4. Validate 70-75/100 minimum achieved

### Step 5: Code Splitting (Optional - 30 min)

1. Lazy load filters
2. Code split heavy components
3. Test and commit

---

## 🚨 Launch Readiness Assessment

### Must Have (Blocking)

- [ ] **ISR implemented** (Fix #1)
- [ ] **Product images optimized** (Fix #2)
- [ ] **LCP < 2.5s** (Core Web Vitals passing)
- [ ] **Performance ≥ 75/100** (minimum acceptable)
- [ ] **Build succeeds** (no errors)
- [ ] **Lighthouse test on preview** (validated)

### Should Have (Post-Launch)

- [ ] **Code splitting** (Fix #3)
- [ ] **FilteredProductGrid optimization** (Fix #4)
- [ ] **Performance ≥ 85/100** (target)
- [ ] **TBT < 350ms** (target)

---

## 🔬 Next Investigation: ProductGrid Images

**Immediate action:** Read ProductGrid.tsx to find image implementation and identify LCP issue.

**Files to analyze:**
1. `/web/src/components/products/ProductGrid.tsx` ✅ Started
2. `/web/src/components/products/ProductCard.tsx` (if exists)
3. Product image queries in GraphQL

**Goal:** Find why LCP is 4.9s and how to optimize it to <2.0s.
