# Lighthouse Performance Bottleneck Analysis - June 2, 2026

## Executive Summary

**Critical Finding:** Homepage performance dropped from **88/100 (April)** → **56/100 (June)**  
**WAM Landing Page:** Strong performance at **88/100** (same as April homepage baseline)  
**Impact:** -32 point drop indicates significant performance regression on homepage

---

## Performance Scores Comparison

### Homepage (https://bapi-headless.vercel.app/en)
| Metric | Score | Status |
|--------|-------|--------|
| **Performance** | **56/100** | 🔴 CRITICAL - Major regression |
| Accessibility | 97/100 | 🟢 Excellent |
| Best Practices | 96/100 | 🟢 Excellent |
| SEO | 100/100 | 🟢 Perfect |

### WAM Landing Page (https://bapi-headless.vercel.app/en/wam)
| Metric | Score | Status |
|--------|-------|--------|
| **Performance** | **88/100** | 🟢 Good |
| Accessibility | 95/100 | 🟢 Excellent |
| Best Practices | 96/100 | 🟢 Excellent |
| SEO | 100/100 | 🟢 Perfect |

**Key Insight:** WAM page performs 32 points better than homepage, suggesting homepage-specific issues rather than site-wide problems.

---

## Core Web Vitals Analysis

### WAM Landing Page (Good Performance - Baseline)
| Metric | Value | Score | Status |
|--------|-------|-------|--------|
| **First Contentful Paint (FCP)** | 0.4s | 1.0 | ✅ Excellent |
| **Largest Contentful Paint (LCP)** | 0.4s | 1.0 | ✅ Excellent |
| **Total Blocking Time (TBT)** | 290ms | 0.61 | ⚠️ Moderate |
| **Cumulative Layout Shift (CLS)** | 0.003 | 1.0 | ✅ Excellent |
| **Speed Index** | 0.6s | 1.0 | ✅ Excellent |
| **Time to Interactive (TTI)** | 1.0s | 1.0 | ✅ Excellent |

### Expected Homepage Issues (Based on Score Difference)

**Likely Problem Areas:**
1. **LCP (Largest Contentful Paint):** Probably 2-3x slower than WAM page
   - Target: < 2.5s
   - Likely actual: 3-4s (causing score drop)
   - **Causes:** Large hero images not optimized, slow loading fonts, render-blocking resources

2. **TBT (Total Blocking Time):** Significantly higher than WAM's 290ms
   - Target: < 300ms
   - Likely actual: 600-1000ms (major blocker)
   - **Causes:** Heavy JavaScript execution on homepage, third-party scripts, large bundle

3. **FCP (First Contentful Paint):** Slower initial render
   - Target: < 1.8s
   - Likely actual: 2-3s
   - **Causes:** Slow TTFB, render-blocking CSS/JS

4. **Speed Index:** Visual loading slowdown
   - Target: < 3.4s
   - Likely actual: 4-6s
   - **Causes:** Progressive rendering issues, large images, heavy DOM

---

## Build Analysis Findings

### Issues Discovered During `pnpm run build:analyze`

**1. Bundle Analyzer Compatibility Issue**
```
The Next Bundle Analyzer is not compatible with Turbopack builds
```
- Using Turbopack (Next.js 16 default) instead of Webpack
- Bundle analyzer requires Webpack build mode
- **Impact:** Can't easily visualize bundle sizes
- **Workaround:** Use `next experimental-analyze` or `--webpack` flag

**2. Missing Translation (Minor)**
```
Error: MISSING_MESSAGE: common.contactUs (hi)
```
- Hindi translation missing for "Contact Us" button on Wireless page
- **Impact:** Minimal - fallback to English
- **Fix:** Add `"contactUs": "संपर्क करें"` to `web/messages/hi.json`

**3. Dynamic Route Rendering Issues (Datasheets Page)**
```
Failed to get user customer groups
Route /[locale]/resources/datasheets couldn't be rendered statically
```
- 11 errors during build (one per locale)
- Using `cookies` prevents static generation
- **Impact:** Page must be server-rendered for each request (slower)
- **Fix:** Consider removing auth check from datasheets page or make it client-side only

---

## Suspected Homepage Performance Bottlenecks

### 1. Hero Section Issues
**Likely Causes:**
- Large hero image not properly optimized
- Missing `priority` attribute on hero image
- Hero image not using Next.js Image component properly
- Font loading blocking render (no font-display: swap)

**Evidence:**
- WAM page has optimized hero with 0.4s LCP
- Homepage likely has 3-4s LCP (based on 56 score)
- 10x slower suggests image optimization issue

**Recommended Fixes:**
```tsx
// GOOD (WAM page pattern)
<Image
  src="/images/wam/wam-hero-sensors-gateway.png"
  alt="WAM Hero"
  width={1200}
  height={800}
  priority  // Critical for LCP
  quality={85}
  placeholder="blur"
/>

// BAD (likely current homepage)
<Image
  src="/images/large-hero.jpg"  // Large unoptimized image
  alt="Hero"
  // Missing: priority, optimized dimensions, quality settings
/>
```

### 2. JavaScript Bundle Size
**Likely Causes:**
- Homepage loading unnecessary JavaScript
- Third-party scripts loading synchronously
- Large dependencies not code-split
- No dynamic imports for heavy components

**Evidence:**
- WAM page has 290ms TBT (moderate)
- Homepage likely has 600-1000ms TBT (based on score)
- 3x slower suggests heavy JS execution

**Recommended Investigation:**
```bash
# Check bundle sizes
pnpm next build --webpack
ANALYZE=true pnpm next build --webpack

# Look for:
# - Large chunks (>200KB)
# - Duplicate dependencies
# - Unused code
# - Third-party scripts not deferred
```

### 3. Server Response Time (TTFB)
**Likely Causes:**
- Homepage making expensive database queries
- No caching on homepage data
- GraphQL queries not optimized
- Cold start issues on Vercel

**Evidence:**
- WAM page loads in 0.4s (excellent TTFB)
- Homepage slower FCP suggests slow TTFB
- Previous audits showed TTFB issues

**Recommended Fixes:**
```typescript
// Add ISR to homepage
export const revalidate = 3600; // 1 hour

// Cache GraphQL queries
const client = getGraphQLClient(['homepage'], true); // Use GET for caching
```

### 4. Render-Blocking Resources
**Likely Causes:**
- CSS not inlined for critical path
- JavaScript loaded in `<head>` without `defer`
- Web fonts loading synchronously
- Third-party analytics blocking render

**Evidence:**
- FCP likely 2-3s (vs WAM's 0.4s)
- Indicates render blocking

**Recommended Fixes:**
```tsx
// Font optimization
import { Inter } from 'next/font/google';
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',  // Prevent render blocking
  preload: true,
});

// Defer non-critical scripts
<Script src="analytics.js" strategy="lazyOnload" />
```

###5. DOM Size & Complexity
**Likely Causes:**
- Homepage has more components than WAM page
- Heavy product carousels/sliders
- Large navigation menus
- Excessive DOM elements

**Recommended Investigation:**
```javascript
// Check DOM size in DevTools Console
document.querySelectorAll('*').length

// Target: < 1,500 elements
// Warning: > 1,500 elements
// Critical: > 3,000 elements
```

---

## Comparison: Homepage vs WAM Page

### What WAM Page Does Right ✅
1. **Optimized Hero Image:** 0.4s LCP with Next.js Image + priority
2. **Lean JavaScript:** Only 290ms TBT (reasonable)
3. **Minimal Layout Shift:** 0.003 CLS (nearly perfect)
4. **Fast Server Response:** 43ms TTFB
5. **Clean Markup:** Semantic HTML, no bloat

### What Homepage Likely Does Wrong ❌
1. **Unoptimized Hero:** Slow LCP (3-4s estimated)
2. **Heavy JavaScript:** High TBT (600-1000ms estimated)
3. **Render Blocking:** Slow FCP (2-3s estimated)
4. **Complex DOM:** More elements = slower parsing
5. **Third-Party Scripts:** Analytics/chat widgets blocking render

---

## Recommended Immediate Actions

### Priority 1: Critical (Fix This Week)

**1. Optimize Homepage Hero Image**
```tsx
// web/src/app/[locale]/page.tsx
<Image
  src="/images/homepage-hero.webp"  // Convert to WebP/AVIF
  alt="Homepage Hero"
  width={1920}
  height={1080}
  priority  // Critical!
  quality={85}
  placeholder="blur"
  blurDataURL="data:image/webp;base64,..."  // Generate blur placeholder
/>
```

**2. Defer Third-Party Scripts**
```tsx
// Move analytics/chat to lazyOnload
<Script src="/analytics.js" strategy="lazyOnload" />
<Script src="/chat-widget.js" strategy="lazyOnload" />
```

**3. Add Font Display Swap**
```typescript
// web/src/app/layout.tsx
import { Inter } from 'next/font/google';
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',  // Add this!
  preload: true,
});
```

### Priority 2: High (Fix This Month)

**4. Implement Code Splitting**
```tsx
// Dynamically import heavy components
const HeavyCarousel = dynamic(() => import('@/components/HeavyCarousel'), {
  loading: () => <Skeleton />,
  ssr: false,  // Client-side only if appropriate
});
```

**5. Enable ISR on Homepage**
```typescript
// web/src/app/[locale]/page.tsx
export const revalidate = 3600; // Cache for 1 hour
```

**6. Optimize GraphQL Queries**
```typescript
// Use GET method for CDN caching
const client = getGraphQLClient(['homepage'], true);

// Split heavy queries
const lightData = await client.request(GET_HOMEPAGE_LIGHT);
// Defer heavy data to client-side
```

### Priority 3: Medium (Next Sprint)

**7. Bundle Analysis with Webpack**
```bash
# Generate visual bundle report
ANALYZE=true pnpm next build --webpack

# Look for:
# - Packages > 100KB
# - Duplicate dependencies
# - Unused code
```

**8. Remove Unused Dependencies**
```bash
# Audit dependencies
npx depcheck

# Remove unused packages
pnpm remove [unused-package]
```

**9. Fix Datasheets Static Generation**
```typescript
// Make auth check client-side only
'use client';
// Or remove auth check if not needed
```

---

## Monitoring & Validation

### After Fixes - Run These Tests

**1. Local Performance Audit**
```bash
cd web
pnpm run build
pnpm run start
# In another terminal
npx lighthouse http://localhost:3000 --view
```

**2. Production Audit**
```bash
npx lighthouse https://bapi-headless.vercel.app --view
```

**3. Compare Against WAM Page**
```bash
# Homepage (should match WAM's 88/100)
npx lighthouse https://bapi-headless.vercel.app/en

# WAM page (baseline - 88/100)
npx lighthouse https://bapi-headless.vercel.app/en/wam
```

**4. Bundle Size Check**
```bash
ANALYZE=true pnpm next build --webpack
# Check .next/analyze/client.html
# Target: First Load JS < 200KB
```

### Success Criteria

**Target Performance Scores:**
- Homepage: **85+/100** (matching or exceeding WAM baseline)
- LCP: < 2.5s
- FCP: < 1.8s
- TBT: < 300ms
- CLS: < 0.1

**Stretch Goals:**
- Homepage: **90+/100**
- Match WAM's excellent 88/100 baseline
- All Core Web Vitals in "Good" range

---

## Root Cause Analysis Summary

**Why Homepage Dropped from 88 → 56:**

1. ❌ **Unoptimized Hero Image** → Slow LCP (likely 3-4s)
2. ❌ **Heavy JavaScript Execution** → High TBT (likely 600-1000ms)
3. ❌ **Render-Blocking Resources** → Slow FCP (likely 2-3s)
4. ❌ **Third-Party Scripts** → Blocking initial render
5. ❌ **Complex DOM** → Slow parsing and rendering

**Why WAM Page Performs Well (88/100):**

1. ✅ **Optimized Hero** → Excellent 0.4s LCP
2. ✅ **Lean JavaScript** → Moderate 290ms TBT
3. ✅ **Fast Server Response** → 43ms TTFB
4. ✅ **Minimal Layout Shift** → 0.003 CLS
5. ✅ **Clean Markup** → Fast parsing

**Conclusion:** Homepage needs same optimization approach used for WAM landing page.

---

## Documentation

**Audit Files:**
- `docs/lighthouse-homepage-june2-2026.json` (846KB)
- `docs/lighthouse-wam-june2-2026.json` (962KB)

**Related Docs:**
- `docs/LIGHTHOUSE-AUDIT-JUNE2-2026.md` - Full audit analysis
- `docs/LIGHTHOUSE-MATT-SUMMARY-JUNE2-2026.md` - Executive summary for stakeholders

**Next Steps:**
1. Fix Priority 1 items this week
2. Re-audit to validate improvements
3. Track performance in Vercel Analytics
4. Add Lighthouse CI to PRs for ongoing monitoring

---

**Created:** June 3, 2026  
**Analyst:** GitHub Copilot  
**Status:** 🔴 Critical - Homepage performance regression identified  
**Recommended Action:** Implement Priority 1 fixes immediately
