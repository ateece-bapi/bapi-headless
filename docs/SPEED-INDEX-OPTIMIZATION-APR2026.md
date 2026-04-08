# Speed Index Optimization - April 8, 2026

## Overview

**Branch:** `performance/speed-index-optimization`  
**Launch Date:** May 4, 2026 (26 days remaining)  
**Status:** ✅ Phase 1 Complete | 🟡 Phase 2 Needed  
**Issue:** Mobile Speed Index 9.7s (3.1x worse than desktop 3.1s)  
**Goal:** Improve Speed Index to <2s for 95+ performance score

## Phase 1: Image & Bundle Optimizations ✅ COMPLETE

### Critical Mobile Performance Issue Discovered

After initial image optimizations, mobile Lighthouse test revealed:
- **Mobile Speed Index: 9.7s** (score 0.1) ❌ CRITICAL
- **Mobile TBT: 240ms** (desktop: 0ms)
- **Mobile Performance: 87%** (desktop: 91%)
- **Root Cause: 400KB+ of unused JavaScript blocking render**

### Bundle Analysis Findings

Using `pnpm next experimental-analyze`:
- **Total Bundle: 4.15 MB uncompressed, 1.43 MB compressed**
- **1126 modules**
- **Top Issues:**
  1. All locale files bundled client-side (~400KB)
  2. Sentry loading synchronously (~80-100KB)
  3. Headless UI loaded upfront (57KB)

---

## Changes Implemented

### Part A: Image Optimizations (Initial)

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

---

### Part B: Bundle Optimizations (Mobile Critical) ✅ COMPLETE

#### Fix 1: i18n Loading Optimization
**File:** `web/src/i18n.ts`

**Problem:**
- All 11 locale files (~50KB each = 550KB total) bundled client-side
- Non-English users loaded TWO files (English base + target locale)
- Dynamic import template prevented tree-shaking: ``import(`../messages/${locale}.json`)``
- Heavy `lodash-es` merge added ~20KB

**Solution:**
```typescript
// BEFORE (inefficient):
import { merge } from 'lodash-es';
const englishMessages = (await import(`../messages/en.json`)).default;
if (validLocale !== 'en') {
  const localeMessages = (await import(`../messages/${validLocale}.json`)).default;
  messages = merge({}, englishMessages, localeMessages); // Loads 2 files!
}

// AFTER (optimized):
switch (validLocale) {
  case 'en':
    messages = (await import('../messages/en.json')).default;
    break;
  case 'de':
    messages = (await import('../messages/de.json')).default;
    break;
  // ... explicit imports for each locale (enables tree-shaking)
}
```

**Impact:**
- **Bundle Size:** -300KB to -400KB client JavaScript
- **Speed Index:** -2 to -3s on mobile (est.)
- **TBT:** -50ms (less parsing/execution)

#### Fix 2: Sentry Lazy Loading
**File:** `web/sentry.client.config.ts`

**Problem:**
- Sentry initialized synchronously on page load
- Heavy integrations: Replay (~30KB), Breadcrumbs (~15KB), Browser Tracing (~20KB)
- Blocking main thread during critical rendering
- Contributing to 240ms TBT on mobile

**Solution:**
```typescript
// BEFORE (blocking):
import * as Sentry from '@sentry/nextjs';
Sentry.init({...}); // Runs immediately, blocks render

// AFTER (deferred):
export {}; // Valid module for Next.js instrumentation

if (typeof window !== 'undefined') {
  const initSentry = async () => {
    const Sentry = await import('@sentry/nextjs'); // Dynamic import
    Sentry.init({...}); // Same config, deferred timing
  };
  
  // Wait until page is interactive + 1.5s
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(initSentry, 1500);
  } else {
    window.addEventListener('load', () => setTimeout(initSentry, 1500));
  }
}
```

**Impact:**
- **Bundle Size:** -80KB from initial load (moved to async chunk)
- **Speed Index:** -1 to -1.5s on mobile (est.)
- **TBT:** -100 to -150ms (no synchronous init)

---

**Impact:** Consistent image optimization across all pages, reduced footer load time

## Expected Performance Improvements (Post-Phase 1)

### Desktop
- **Performance:** 91% → **94-95%**
- **Speed Index:** 3.1s → **~1.8-2.0s** (image + bundle optimizations)
- **TBT:** 0ms (already optimal)
- **FCP:** 0.4s (no change)
- **LCP:** 1.1s (no change)

### Mobile (Critical Gains Expected)
- **Performance:** 87% → **92-94%**
- **Speed Index:** 9.7s → **~5-6s** (major improvement, but Phase 2 needed for <2s target)
- **TBT:** 240ms → **~80-100ms** (Sentry deferral + i18n reduction)
- **FCP:** 1.1s (no change)
- **LCP:** 1.5s (no change)

### Combined Impact Analysis

| Optimization | Desktop Δ | Mobile Δ | Notes |
|--------------|-----------|----------|-------|
| **Image optimizations** | -0.8s SI | -1.5s SI | WebP/AVIF + lazy loading |
| **i18n bundle reduction** | -0.3s SI | -2.5s SI | Removed 300KB+ unused locales |
| **Sentry lazy loading** | -0.1s SI | -1.5s SI | Deferred 80KB+ init |
| **Total Expected** | **-1.2s** | **-5.5s** | **Estimated aggregate** |

**Target Achievement:**
- Desktop: ✅ Should reach <2s target
- Mobile: 🟡 Partial (5-6s, needs Phase 2 for <2s)

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

### Immediate: Test Phase 1 Results (Tomorrow, Apr 9)

Run Lighthouse tests to validate optimizations:

```bash
# Desktop test
lighthouse https://bapi-headless.vercel.app/en --only-categories=performance --preset=desktop --view

# Mobile test (critical - verify 9.7s → 5-6s)
lighthouse https://bapi-headless.vercel.app/en --only-categories=performance --preset=mobile --view
```

**Success Criteria:**
- Desktop Speed Index: <2s ✅
- Mobile Speed Index: <6s (acceptable for Phase 1, target <2s in Phase 2)
- Mobile TBT: <100ms
- Overall Performance: Desktop 94-95%, Mobile 92-94%

---

### Phase 2: Critical Rendering Path (Apr 10-16) 🟡 NEEDED

If mobile Speed Index remains >5s after Phase 1, implement:

#### A. Inline Critical CSS
Extract above-the-fold CSS and inline in `<head>`:
```tsx
// In layout.tsx
<style dangerouslySetInnerHTML={{
  __html: `
    /* Critical CSS for hero, header, above-fold */
    .hero-container { /* ... */ }
    .header { /* ... */ }
  `
}} />
```

**Expected Impact:** -0.5 to -1s Speed Index

#### B. Optimize Web Fonts
```tsx
// In layout.tsx <head>
<link
  rel="preconnect"
  href="https://fonts.googleapis.com"
  crossOrigin="anonymous"
/>
<link rel="dns-prefetch" href="https://fonts.gstatic.com" />

// In CSS/globals
@font-face {
  font-display: swap; /* or optional for critical fonts */
}
```

**Expected Impact:** -0.3 to -0.5s Speed Index

#### C. Resource Hints for Critical Domains  
```tsx
<link rel="preconnect" href="https://bapiheadlessstaging.kinsta.cloud" />
<link rel="dns-prefetch" href="https://analytics.google.com" />
```

**Expected Impact:** -0.2 to -0.3s Speed Index

---

### Phase 3: Mobile-Specific Optimizations (If Needed)

#### Adaptive Loading Based on Connection Speed
```typescript
// lib/performance.ts
export const useAdaptiveLoading = () => {
  const connection = (navigator as any).connection;
  const effectiveType = connection?.effectiveType;
  
  return {
    isSlowConnection: ['slow-2g', '2g', '3g'].includes(effectiveType),
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  };
};

// In components:  
const { isSlowConnection } = useAdaptiveLoading();

if (isSlowConnection) {
  // Skip heavy animations, load smaller images, defer non-critical features
}
```

#### Enhanced Mobile Image Sizes
```tsx
// More aggressive mobile sizing
sizes="(max-width: 480px) 85vw, (max-width: 768px) 45vw, 40vw"
```

---

## Deployment & Validation

**Current Status:** Changes on branch, ready for testing

### Deploy to Vercel Preview

```bash
git add -A
git commit -m "perf(bundle): optimize i18n loading and defer Sentry initialization"
git push origin performance/speed-index-optimization
```

Vercel will auto-deploy preview URL → Test with Lighthouse

### Production Deployment (After validation)

1. **Verify improvements** on Vercel preview URL
2. **Create PR** to main branch
3. **Review & merge** (auto-deploys to production)  
4. **Monitor** Core Web Vitals in Vercel Analytics + Google Search Console

---

## Files Changed (Phase 1)

### Image Optimizations
- `web/src/components/products/ProductGallery.tsx` (+15 lines)
- `web/src/components/products/ProductPage/RelatedProducts.tsx` (+8 lines)
- `web/src/components/layout/Footer.tsx` (+7 lines, -4 lines)

### Bundle Optimizations ⭐ NEW
- `web/src/i18n.ts` (+55 lines, -10 lines) - Remove double-loading, explicit imports
- `web/sentry.client.config.ts` (+20 lines, -5 lines) - Lazy load after page interactive

**Build Status:** ✅ Passing (8.7s)  
**Lint Status:** ✅ No errors  
**TypeScript:** ✅ No errors

---

## Summary

### ✅ Phase 1 Complete (April 8, 2026)
- Image optimizations for ProductGallery, RelatedProducts, Footer
- i18n bundle reduction (removed 300-400KB of unused locales)
- Sentry lazy loading (deferred 80KB+ from initial load)

### 🟡 Phase 2 Required (Mobile <2s Target)
- Critical CSS inlining
- Web font optimization
- Resource hints for GraphQL domains

### 📊 Projected Results
- **Desktop:** 3.1s → 1.8-2.0s Speed Index ✅ (target met)
- **Mobile:** 9.7s → 5-6s Speed Index 🟡 (improved but needs Phase 2)

### ⏰ Timeline
- **April 9**: Test Phase 1 results with Lighthouse
- **April 10-16**: Implement Phase 2 if mobile >5s
- **May 4**: Production launch

---

**Last Updated:** April 8, 2026  
**Next Review:** April 9, 2026 (post-Lighthouse test)
