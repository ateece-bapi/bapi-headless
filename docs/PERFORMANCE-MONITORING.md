# Performance Monitoring & Core Web Vitals

## Overview

This project implements comprehensive performance monitoring to ensure optimal user experience and SEO performance. We track Core Web Vitals (Google's UX quality signals) and enforce performance budgets via automated testing.

## 🎯 Performance Goals

**Core Web Vitals Targets (Google Recommended):**
- **LCP (Largest Contentful Paint)**: < 2.5s
- **CLS (Cumulative Layout Shift)**: < 0.1
- **INP (Interaction to Next Paint)**: < 200ms
- **FCP (First Contentful Paint)**: < 1.8s
- **TTFB (Time to First Byte)**: < 800ms

**Overall Scores:**
- Performance: > 90
- Accessibility: > 95
- Best Practices: > 90
- SEO: > 95

## 📊 Monitoring Stack

### 1. Vercel Speed Insights (Real User Monitoring)
**What it does:** Tracks Core Web Vitals from real users in production

**Implementation:**
```tsx
// src/app/layout.tsx
import { SpeedInsights } from '@vercel/speed-insights/next';

<SpeedInsights />
```

**Dashboard:** https://vercel.com/[your-project]/analytics/speed-insights

**Benefits:**
- ✅ Zero configuration
- ✅ Real user data (not synthetic)
- ✅ Automatic Core Web Vitals tracking
- ✅ Device/location breakdowns
- ✅ Free on Vercel

### 2. Vercel Analytics (User Behavior)
**What it does:** Tracks page views, user paths, conversion funnels

**Implementation:**
```tsx
// src/app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

<Analytics />
```

**Dashboard:** https://vercel.com/[your-project]/analytics

### 3. Custom Web Vitals Tracking
**What it does:** Logs metrics to console (dev) and custom analytics (production)

**Implementation:**
```tsx
// src/components/analytics/WebVitals.tsx
export function WebVitals() {
  useReportWebVitals((metric) => {
    // Log in dev, send to analytics in prod
  });
}
```

**Supported metrics:**
- LCP, CLS, INP, FCP, TTFB
- Automatic rating (good/needs-improvement/poor)
- Integration with Google Analytics, Sentry, etc.

### 4. Lighthouse CI (Automated Testing)
**What it does:** Runs Lighthouse audits on every PR, fails builds if metrics regress

**Configuration:** `web/lighthouserc.json`

**Run locally:**
```bash
cd web
pnpm run lighthouse
```

**Automated on PRs:**
- GitHub Actions workflow: `.github/workflows/lighthouse.yml`
- Tests 4 key pages: home, products, contact, support
- 3 runs per page (average)
- Desktop preset with realistic throttling

**Assertions (will fail PR if violated):**
```json
{
  "categories:performance": 0.9,
  "first-contentful-paint": 1800,
  "largest-contentful-paint": 2500,
  "cumulative-layout-shift": 0.1
}
```

### 5. Performance Budgets
**What it does:** Enforces bundle size limits at build time

**Configuration:** `web/next.config.ts`

```typescript
performance: {
  maxInitialJSBundleSize: 200 * 1024, // 200KB per route
  maxPageSize: 500 * 1024, // 500KB total
}
```

Build fails if budgets exceeded.

## 🚀 Usage

### Local Development

**1. View Web Vitals in console:**
```bash
pnpm run dev
# Open http://localhost:3000
# Check browser console for Web Vitals logs
```

**2. Run Lighthouse audit:**
```bash
pnpm run build
pnpm run start
pnpm run lighthouse
```

**3. Analyze bundle size:**
```bash
pnpm run build:analyze
# Opens interactive bundle visualization
```

### Production Monitoring

**1. Vercel Dashboard:**
- Speed Insights: Real-time Core Web Vitals
- Analytics: User behavior and conversions
- Functions: API route performance

**2. Check Web Vitals rating:**
```javascript
// All metrics automatically logged in production
// Check Vercel dashboard or custom analytics
```

### CI/CD Integration

**Lighthouse runs automatically on every PR:**
1. Create PR with frontend changes
2. GitHub Actions runs Lighthouse CI
3. Results posted as PR comment
4. Build fails if performance thresholds violated

**Manual CI run:**
```bash
pnpm run lighthouse:ci
```

## 📈 Interpreting Metrics

### Largest Contentful Paint (LCP)
**What it measures:** Loading performance - when main content appears

**Good:** < 2.5s  
**Needs Improvement:** 2.5s - 4s  
**Poor:** > 4s

**How to improve:**
- Optimize images (WebP, lazy loading, srcset)
- Reduce server response time (TTFB)
- Remove render-blocking resources
- Use Next.js Image component

### Cumulative Layout Shift (CLS)
**What it measures:** Visual stability - unexpected layout shifts

**Good:** < 0.1  
**Needs Improvement:** 0.1 - 0.25  
**Poor:** > 0.25

**How to improve:**
- Set explicit width/height on images
- Reserve space for dynamic content
- Avoid inserting content above existing content
- Use CSS aspect-ratio

### Interaction to Next Paint (INP)
**What it measures:** Responsiveness - time to respond to user input

**Good:** < 200ms  
**Needs Improvement:** 200ms - 500ms  
**Poor:** > 500ms

**How to improve:**
- Reduce JavaScript execution time
- Break up long tasks
- Use Web Workers for heavy computations
- Optimize event handlers

### First Contentful Paint (FCP)
**What it measures:** Time to first DOM content render

**Good:** < 1.8s  
**Needs Improvement:** 1.8s - 3s  
**Poor:** > 3s

**How to improve:**
- Optimize CSS (critical inline, defer non-critical)
- Reduce server response time
- Minimize render-blocking resources

### Time to First Byte (TTFB)
**What it measures:** Server response time

**Good:** < 800ms  
**Needs Improvement:** 800ms - 1800ms  
**Poor:** > 1800ms

**How to improve:**
- Enable CDN caching
- Optimize database queries
- Use ISR (Incremental Static Regeneration)
- Upgrade server resources

## 🔧 Troubleshooting

### Poor LCP score
1. Check image optimization: `pnpm run build:analyze`
2. Review server response time (TTFB)
3. Ensure priority loading for hero images:
   ```tsx
   <Image priority src={heroImage} />
   ```

### High CLS score
1. Add explicit dimensions to all images
2. Check for dynamically inserted content
3. Use Lighthouse CI to see which elements shift

### Build fails on performance budgets
1. Run bundle analyzer: `pnpm run build:analyze`
2. Identify large dependencies
3. Use dynamic imports for heavy components:
   ```tsx
   const HeavyComponent = dynamic(() => import('./Heavy'));
   ```

### Lighthouse CI fails
1. Check `.lighthouseci` folder for detailed reports
2. Review specific failing assertions
3. Run locally: `pnpm run lighthouse`

## 📚 Resources

- [Web Vitals](https://web.dev/vitals/)
- [Lighthouse Documentation](https://developers.google.com/web/tools/lighthouse)
- [Next.js Performance](https://nextjs.org/docs/app/building-your-application/optimizing)
- [Vercel Speed Insights](https://vercel.com/docs/speed-insights)
- [Core Web Vitals SEO Impact](https://developers.google.com/search/docs/appearance/page-experience)

## 🎯 Continuous Improvement

**Monthly Review Checklist:**
- [ ] Check Vercel Speed Insights dashboard
- [ ] Review failing Lighthouse CI runs
- [ ] Analyze bundle size trends
- [ ] Compare Core Web Vitals to competitors
- [ ] Update performance budgets if needed

**Target Timeline:**
- **Feb 2026:** Baseline metrics established
- **Mar 2026:** Optimization based on real data
- **Apr 2026 Launch:** All metrics in "Good" range

---

**Last Updated:** February 4, 2026  
**Status:** Performance monitoring fully implemented ✅
