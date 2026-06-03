# Product Category Performance Fix Plan

**Branch:** `fix/product-category-performance-critical`  
**Target:** 42/100 → 75-80/100 minimum  
**Deadline:** May 6, 2026 (URGENT!)

---

## 🔴 ROOT CAUSES CONFIRMED

### 1. ALL Product Images Use `loading="lazy"` ❌

**Location:** `/web/src/components/products/ProductGrid.tsx` line ~460

**Current Code:**
```tsx
<Image
  src={image.sourceUrl}
  alt={image.altText || product.name || 'Product'}
  fill
  sizes="(min-width: 1536px) 20vw, (min-width: 1280px) 25vw, (min-width: 640px) 33vw, 50vw"
  onLoad={() => setImageLoaded(true)}
  loading="lazy"  // ❌ WRONG for first 6-8 products!
/>
```

**Problem:** First 6-8 products are above the fold but browser delays loading them!

**Impact:** LCP 4.9s (LCP element is likely product #1-3 image)

**Fix:**
- First 6-8 products: Use `priority` (no `loading` prop)
- Products 9+: Keep `loading="lazy"`

**Expected Impact:** LCP 4.9s → 1.8-2.2s (+15-20 performance points)

---

### 2. No ISR - Dynamic Rendering Every Request ❌

**Location:** `/web/src/app/[locale]/products/[category]/[subcategory]/page.tsx`

**Current:** No `revalidate` export - page is dynamically rendered on EVERY request

**Fix:** Add `export const revalidate = 3600;`

**Expected Impact:** LCP 4.9s → 3.5-4.0s on cached pages (+10-15 performance points)

---

## 🎯 Implementation Order

### Fix #1: Add Priority to Above-Fold Product Images (CRITICAL)

**File:** `/web/src/components/products/ProductGrid.tsx`

**Changes:**
1. Add `priority` logic based on `positionInGrid` prop
2. First 8 products: Add `priority` prop, remove `loading="lazy"`
3. Products 9+: Keep `loading="lazy"`

**Code Change:**
```tsx
// Line ~460 in ProductCard component
<Image
  src={image.sourceUrl}
  alt={image.altText || product.name || 'Product'}
  fill
  className={`object-contain p-3 transition-all duration-500 ease-out group-hover:scale-110 ${
    imageLoaded ? 'opacity-100' : 'opacity-0'
  }`}
  sizes="(min-width: 1536px) 20vw, (min-width: 1280px) 25vw, (min-width: 640px) 33vw, 50vw"
  onLoad={() => setImageLoaded(true)}
  // Prioritize first 8 products (2 rows on desktop, more on mobile)
  {...(positionInGrid < 8 ? { priority: true } : { loading: 'lazy' as const })}
/>
```

**Testing:**
- Build succeeds
- First 8 product images load immediately
- Products 9+ still lazy load

**Estimated Time:** 10 minutes

---

### Fix #2: Add ISR to Category Pages (CRITICAL)

**File:** `/web/src/app/[locale]/products/[category]/[subcategory]/page.tsx`

**Changes:**
Add after imports (around line 25):

```tsx
// ISR configuration - revalidate every hour
export const revalidate = 3600;
```

**Testing:**
- Build succeeds
- Route table shows "1h" revalidation
- Pages cached after first visit

**Estimated Time:** 5 minutes

---

### Fix #3: Reduce Image Quality (OPTIONAL)

**File:** `/web/src/components/products/ProductGrid.tsx`

**Changes:**
Add `quality={85}` to Image component (Next.js default is 75, but some configs override to 100)

```tsx
<Image
  src={image.sourceUrl}
  alt={image.altText || product.name || 'Product'}
  fill
  quality={85}  // Reduce from potential 100 to 85 (good balance)
  // ...rest of props
/>
```

**Expected Impact:** Smaller image files = faster LCP

**Estimated Time:** 2 minutes

---

## 📊 Expected Results

### Phase 1: Critical Fixes (Fix #1 + #2)

**Implementation Time:** 15-20 minutes  
**Expected Performance:** 42/100 → **75-80/100** ✅  
**Expected LCP:** 4.9s → **1.8-2.2s** (passes <2.5s Core Web Vitals!) ✅  
**Expected TBT:** 580ms → **500-550ms** (still high but improved)

**Launch Ready:** ✅ YES - Meets minimum 75/100 target

---

### Phase 2: Full Optimization (All fixes)

**Implementation Time:** 20-25 minutes total  
**Expected Performance:** 42/100 → **80-85/100** ✅  
**Expected LCP:** 4.9s → **1.5-2.0s** (<2.5s target) ✅  
**Expected TBT:** 580ms → **450-500ms** (improved)

**Launch Ready:** ✅ YES - Exceeds minimum target

---

## 🚀 Deployment Plan

### Step 1: Implement Fixes (20 min)

1. ✅ Branch created: `fix/product-category-performance-critical`
2. [ ] Modify ProductGrid.tsx for priority images
3. [ ] Add ISR to subcategory page
4. [ ] Add image quality setting (optional)
5. [ ] Test build locally
6. [ ] Commit changes

### Step 2: Test Build (5 min)

```bash
cd web
pnpm run build
```

**Validation:**
- Build succeeds with no errors
- Route table shows ISR for `/[locale]/products/[category]/[subcategory]`
- No TypeScript errors
- No accessibility warnings

### Step 3: Push & Deploy (10 min)

```bash
git push origin fix/product-category-performance-critical
```

- GitHub PR auto-created
- Vercel preview deployment triggered
- Wait for deployment (~2-3 minutes)

### Step 4: Lighthouse Test on Preview (10 min)

1. Get Vercel preview URL
2. Open `/en/products/temperature-sensors/temp-room` on preview
3. Run Lighthouse in Chrome DevTools (Desktop mode)
4. Validate:
   - Performance ≥ 75/100 ✅
   - LCP < 2.5s ✅
   - No regressions in other metrics

### Step 5: Merge to Production (5 min)

1. Review PR
2. Merge to main
3. Production deployment automatic
4. Validate production Lighthouse

---

## ✅ Success Criteria

### Must Pass (Blocking Launch)

- [ ] Performance ≥ 75/100
- [ ] LCP < 2.5s (Core Web Vitals passing)
- [ ] TBT < 600ms (no regression)
- [ ] Build succeeds with no errors
- [ ] All 608 products still accessible
- [ ] No visual regressions
- [ ] Lighthouse test on preview validates improvements

### Nice to Have (Post-Launch)

- [ ] Performance ≥ 85/100
- [ ] LCP < 2.0s
- [ ] TBT < 400ms
- [ ] Code splitting for filters
- [ ] Optimize FilteredProductGrid client logic

---

## 🔬 Verification Tests

After deployment, test these URLs:

1. **temp-room** (Temperature - Room & Wall Sensors):
   - `/en/products/temperature-sensors/temp-room`
   - Expected: 23 products
   - Target: Performance 75-80/100, LCP <2.5s

2. **temp-duct** (Temperature - Duct Sensors):
   - `/en/products/temperature-sensors/temp-duct`
   - Expected: 27 products
   - Target: Performance 75-80/100, LCP <2.5s

3. **wireless-room-sensors** (Wireless - Room Sensors):
   - `/en/products/bluetooth-wireless/wireless-room-sensors`
   - Expected: ~15 products
   - Target: Performance 80-85/100, LCP <2.0s

---

**Status:** Ready to implement  
**Risk:** LOW - Changes are minimal and focused  
**Rollback:** Easy - revert PR if issues arise  
**Timeline:** 50 minutes total (implementation + testing + deployment)
