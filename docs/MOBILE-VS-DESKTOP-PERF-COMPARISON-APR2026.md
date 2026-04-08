# Mobile vs Desktop Performance Comparison
**Launch Date: May 4, 2026 (26 days remaining)**  
**Test Date: April 8, 2026**  
**URL Tested: https://bapi-headless.vercel.app**

## Executive Summary

🚨 **CRITICAL: Mobile Speed Index is 3.1x worse than Desktop** (9.7s vs 3.1s)

While desktop performance is acceptable at 91%, mobile users experience severe degradation:
- Speed Index: **9.7s** (score 0.1) - Unacceptable for May 4 launch
- Total Blocking Time: **240ms** (vs 0ms on desktop) - JS execution blocking UI
- Performance Score: **87%** (vs 91% desktop) - Below 95% target

## Detailed Metrics Comparison

| Metric | Desktop | Score | Mobile | Score | Delta | Status |
|--------|---------|-------|--------|-------|-------|--------|
| **Performance** | 91% | - | 87% | - | -4% | 🟡 |
| **FCP (First Contentful Paint)** | 0.4s | 1.0 | 1.1s | 0.99 | +0.7s | ✅ |
| **LCP (Largest Contentful Paint)** | 1.1s | 1.0 | 1.5s | 1.0 | +0.4s | ✅ |
| **Speed Index** | 3.1s | 0.25 | **9.7s** | **0.1** | **+6.6s** | ❌ |
| **TBT (Total Blocking Time)** | 0ms | 1.0 | 240ms | 0.86 | +240ms | 🟡 |
| **CLS (Cumulative Layout Shift)** | 0.001 | 1.0 | 0.011 | 1.0 | +0.010 | ✅ |

### Desktop Results (April 8, 2026 17:53 UTC)
- Lighthouse Version: 13.0.2
- Device: Desktop
- Performance: **91%**
- **Speed Index**: 3.1s (score 0.25) ⚠️
- FCP: 0.4s (1.0) ✅
- LCP: 1.1s (1.0) ✅
- TBT: 0ms (1.0) ✅
- CLS: 0.001 (1.0) ✅

### Mobile Results (April 8, 2026 18:10 UTC)
- Lighthouse Version: 13.0.2
- Device: Moto G Power (Android 11 emulation)
- Performance: **87%**
- **Speed Index**: 9.7s (score 0.1) ❌ **CRITICAL**
- FCP: 1.1s (0.99) ✅
- LCP: 1.5s (1.0) ✅
- TBT: 240ms (0.86) 🟡
- CLS: 0.011 (1.0) ✅

**Warning (Both Tests):** "The page loaded too slowly to finish within the time limit. Results may be incomplete"

## Root Cause Analysis

### Why Mobile Speed Index is 3x Worse

1. **JavaScript Execution Impact**
   - Desktop TBT: 0ms (perfect)
   - Mobile TBT: 240ms (moderate blocking)
   - **Issue**: Mobile CPUs struggle with JavaScript bundle size
   - Current bundle likely not optimized for mobile devices

2. **Render-Blocking Resources**
   - Speed Index measures visual progress during page load
   - 9.7s Speed Index suggests:
     - Heavy JavaScript blocking initial render
     - Large CSS bundles delaying paint
     - Synchronous scripts preventing progressive rendering

3. **Image Loading Strategy**
   - While we implemented Next.js Image optimization:
     - Desktop handled lazy loading well (3.1s Speed Index)
     - Mobile struggling with same strategy (9.7s Speed Index)
   - **Hypothesis**: Mobile network conditions or device capabilities require different approach

4. **Critical Rendering Path**
   - FCP and LCP are acceptable (1.1s, 1.5s)
   - Speed Index failure indicates content **exists** but takes 9.7s to **appear visually complete**
   - Suggests progressive rendering is broken on mobile

## Recommended Actions (Priority Order)

### 🔴 PRIORITY 1: Reduce JavaScript Blocking (Target: -150ms TBT, -4s Speed Index)

1. **Code Splitting Analysis**
   ```bash
   pnpm run build:analyze
   ```
   - Identify largest chunks
   - Split vendor bundles
   - Implement route-based code splitting

2. **Remove Unused JavaScript**
   - Audit third-party dependencies
   - Use tree-shaking effectively
   - Consider lazy loading non-critical libraries

3. **Defer Non-Critical Scripts**
   - Move analytics to `<Script strategy="lazyOnload">`
   - Defer chat widgets, social media embeds
   - Use `loading="lazy"` on iframes

### 🟡 PRIORITY 2: Optimize Critical Rendering Path (Target: -3s Speed Index)

1. **Inline Critical CSS**
   - Extract above-the-fold CSS
   - Inline critical styles in `<head>`
   - Defer non-critical stylesheets

2. **Optimize Web Fonts**
   - Use `font-display: swap` or `optional`
   - Preload critical fonts
   - Consider system font stack

3. **Resource Hints**
   ```html
   <link rel="preconnect" href="https://cms.yourdomain.com">
   <link rel="dns-prefetch" href="https://analytics.google.com">
   ```

### 🟢 PRIORITY 3: Mobile-Specific Optimizations (Target: -2s Speed Index)

1. **Responsive Images (Enhanced)**
   - Already implemented Next.js Image
   - **Add**: Mobile-specific breakpoints with smaller sizes
   ```tsx
   sizes="(max-width: 640px) 90vw, (max-width: 768px) 50vw, 40vw"
   ```

2. **Adaptive Loading**
   - Detect slow connections (`navigator.connection.effectiveType`)
   - Serve lower quality images on 3G/4G
   - Skip non-essential features on mobile

3. **Mobile JavaScript Bundle**
   - Consider separate mobile bundle (smaller)
   - Use dynamic imports for desktop-only features

## Implementation Plan (May 4 Launch - 26 Days)

### Week 1 (Apr 9-15): JavaScript Optimization
- [ ] Bundle analysis with `pnpm run build:analyze`
- [ ] Identify and remove unused dependencies
- [ ] Implement code splitting for large routes
- [ ] Defer non-critical scripts
- [ ] **Target**: TBT < 100ms, Speed Index < 6s on mobile

### Week 2 (Apr 16-22): Critical Rendering Path
- [ ] Extract and inline critical CSS
- [ ] Optimize font loading strategy
- [ ] Add resource hints for critical domains
- [ ] Test progressive rendering on mobile
- [ ] **Target**: Speed Index < 4s on mobile

### Week 3 (Apr 23-29): Mobile-Specific Tuning
- [ ] Enhanced responsive image sizes
- [ ] Implement adaptive loading
- [ ] Mobile bundle optimization
- [ ] Staging deployment and validation
- [ ] **Target**: Speed Index < 2.5s, Performance > 95%

### Week 4 (Apr 30 - May 4): Final Testing & Launch
- [ ] E2E testing on real mobile devices
- [ ] Performance monitoring setup
- [ ] Production deployment
- [ ] **Go-Live: May 4, 2026**

## Testing Strategy

1. **Lighthouse CI**
   - Add mobile-specific budgets to `lighthouserc.json`
   - Set Speed Index budget: < 3s (mobile), < 2s (desktop)
   - Set TBT budget: < 150ms (mobile), < 100ms (desktop)

2. **Real Device Testing**
   - Test on actual Moto G Power or similar mid-range Android
   - Test on iPhone 12 or equivalent
   - Use throttling profiles (Fast 3G, Slow 4G)

3. **Monitoring (Post-Launch)**
   - Core Web Vitals tracking (Google Search Console)
   - RUM (Real User Monitoring) with Vercel Analytics
   - Set alerts for Speed Index > 3s on mobile

## Success Criteria (May 4 Launch)

- ✅ Mobile Performance Score: **≥ 95%**
- ✅ Mobile Speed Index: **< 2s** (vs current 9.7s)
- ✅ Mobile TBT: **< 100ms** (vs current 240ms)
- ✅ Desktop Performance Score: **≥ 95%** (maintain current)
- ✅ Desktop Speed Index: **< 2s** (vs current 3.1s)

## Next Steps

1. **Immediate Action** (Today):
   - Run `pnpm run build:analyze` to identify largest bundles
   - Create ticket for JavaScript optimization in GitHub project

2. **This Week**:
   - Begin Priority 1 work (JavaScript blocking reduction)
   - Schedule mid-week mobile Lighthouse test to validate progress

3. **Communication**:
   - Update stakeholders on mobile performance issue
   - Revise launch timeline if Priority 1 work reveals deeper issues

## Resources

- [Desktop Lighthouse Report](/docs/desktop_lighthouse04082026.json)
- [Mobile Lighthouse Report](/docs/mobile_lighthouse04082026.json)
- [Speed Index Optimization Guide](/docs/SPEED-INDEX-OPTIMIZATION-APR2026.md)
- [Web.dev Speed Index](https://web.dev/speed-index/)
- [Core Web Vitals](https://web.dev/vitals/)

---
**Document Version**: 1.0  
**Last Updated**: April 8, 2026  
**Next Review**: April 11, 2026 (after Priority 1 work)
