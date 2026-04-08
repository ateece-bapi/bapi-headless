# Speed Index Optimization - April 8, 2026

## Overview

**Branch:** `performance/speed-index-optimization`  
**Launch Date:** May 4, 2026 (26 days remaining)  
**Issue:** Desktop Speed Index scored 0.25 (3.1s) in Lighthouse, dragging overall performance to 91%  
**Goal:** Improve Speed Index to <2s for 95+ performance score

## Changes Implemented

### 1. ProductGallery Component
**File:** `web/src/components/products/ProductGallery.tsx`

- ✅ Replaced raw `<img>` with Next.js `<Image>` for main gallery image
- ✅ Added `priority={true}` for first image (immediate loading)
- ✅ Added responsive `sizes` attribute for optimal image delivery
- ✅ Thumbnails already used Next.js Image ✓

**Before:**
```tsx
<img
  src={currentImage.sourceUrl}
  alt={currentImage.altText || productName}
  className="max-h-full max-w-full object-contain"
/>
```

**After:**
```tsx
<Image
  src={currentImage.sourceUrl}
  alt={currentImage.altText || productName}
  fill
  priority={selectedIndex === 0}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
  className="object-contain transition-transform duration-300 group-hover:scale-105"
/>
```

### 2. RelatedProducts Component
**File:** `web/src/components/products/ProductPage/RelatedProducts.tsx`

- ✅ Replaced raw `<img>` with Next.js `<Image>`
- ✅ Added responsive `sizes` attribute
- ✅ Uses `fill` for flexible sizing

**Impact:** Below-the-fold images now lazy load automatically

### 3. Footer Component
**File:** `web/src/components/layout/Footer.tsx`

- ✅ Replaced BAPI logo `<img>` with Next.js `<Image>`
- ✅ Replaced award badges (3) with Next.js `<Image>`
- ✅ Replaced certification logos (3) with Next.js `<Image>`

**Impact:** Consistent image optimization across all pages, reduced footer load time

## Expected Performance Improvements

### Speed Index
- **Current:** 3.1s (score: 0.25)
- **Target:** <2s (score: >0.85)
- **Improvement:** ~35-50% faster visual rendering

### Why This Works

1. **Automatic Format Optimization**
   - Next.js serves WebP/AVIF to modern browsers
   - ~30-50% smaller file sizes vs JPEG/PNG
   - Fallback to original format for older browsers

2. **Priority Loading**
   - First gallery image loads immediately (no lazy loading)
   - Critical for LCP and Speed Index metrics

3. **Responsive Sizing**
   - Browser loads appropriately sized image per viewport
   - Mobile: smaller image → faster download
   - Desktop: optimal quality without waste

4. **Lazy Loading** 
   - Below-the-fold images load only when needed
   - Reduces initial page weight
   - Improves TTI (Time to Interactive)

## Next Steps

### 1. Testing (High Priority)

Run Lighthouse desktop test and verify improvements:

```bash
# Using Lighthouse CLI
npm install -g lighthouse
lighthouse https://bapi-headless.vercel.app/en --only-categories=performance --view

# Or Chrome DevTools
# 1. Open DevTools (F12)
# 2. Go to Lighthouse tab
# 3. Select "Desktop" device
# 4. Check "Performance" only
# 5. Click "Analyze page load"
```

**Target Metrics:**
- Speed Index: <2s (currently 3.1s)
- Overall Performance: >95 (currently 91)
- First Contentful Paint: <0.5s ✅ (already excellent)
- Largest Contentful Paint: <1.2s ✅ (already good)

### 2. Additional Optimizations (If Needed)

If Speed Index doesn't reach target, investigate:

#### A. Render-Blocking Resources
```bash
# Check for blocking scripts/styles
pnpm run build:analyze
```

Potential fixes:
- Defer non-critical JavaScript
- Inline critical CSS
- Use `next/script` with `strategy="defer"`

#### B. Third-Party Scripts
Audit any analytics/chat widgets:
- Move to `<Script strategy="lazyOnload">`
- Consider removing non-essential scripts

#### C. Font Loading
```tsx
// In layout.tsx or globals.css
<link
  rel="preconnect"
  href="https://fonts.googleapis.com"
/>
<link
  rel="dns-prefetch"
  href="https://fonts.gstatic.com"
/>
```

### 3. Deployment & Validation

1. **Merge to staging:**
   ```bash
   git push origin performance/speed-index-optimization
   # Create PR to staging
   ```

2. **Test on staging URL:**
   - Run Lighthouse on staging deployment
   - Test on real devices (mobile/tablet/desktop)
   - Verify image quality is acceptable

3. **Deploy to production** (if Speed Index improved):
   - Merge PR to main
   - Vercel auto-deploys
   - Monitor Real User Metrics (Core Web Vitals)

## Monitoring

After deployment, track:

1. **Lighthouse CI** (automated tests)
2. **Vercel Analytics** - Real user Speed Index
3. **Google Search Console** - Core Web Vitals report  
4. **Bounce rate** - Ensure fast loading reduces bounces

## Rollback Plan

If issues arise:
```bash
git revert 42b2efc
git push origin performance/speed-index-optimization
```

## Files Changed

- `web/src/components/products/ProductGallery.tsx` (+15 lines)
- `web/src/components/products/ProductPage/RelatedProducts.tsx` (+8 lines)
- `web/src/components/layout/Footer.tsx` (+7 lines)

**Build Status:** ✅ Passing  
**Lint Status:** ⚠️ Check details (may have pre-existing issues)

## Notes

- Hero component already uses Next.js Image with `priority` ✅
- Lightbox modal still uses raw `<img>` (acceptable - not visible on page load)
- All changes are backward compatible
- No breaking changes to component APIs

---

**Next Review:** After running Lighthouse test, update this doc with actual Speed Index improvement
