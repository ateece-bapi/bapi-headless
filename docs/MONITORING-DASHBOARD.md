# SEO & Performance Monitoring Dashboard

## Overview

This document provides a comprehensive view of all monitoring tools and how to access them for the BAPI Headless e-commerce platform. Use this as your single source of truth for performance, SEO, and error tracking.

**Last Updated:** February 7, 2026  
**Launch Target:** April 10, 2026

---

## 🎯 Quick Access Dashboard

| Tool | Purpose | Access | Update Frequency |
|------|---------|--------|------------------|
| **Vercel Analytics** | Page views, user behavior | [Vercel Dashboard](https://vercel.com) | Real-time |
| **Vercel Speed Insights** | Core Web Vitals (real users) | [Vercel Dashboard](https://vercel.com) | Real-time |
| **Sentry** | Error tracking, performance | [Sentry Dashboard](https://sentry.io) | Real-time |
| **Google Search Console** | Search performance, indexing | [GSC Dashboard](https://search.google.com/search-console) | 1-2 day delay |
| **Lighthouse CI** | Automated performance tests | GitHub Actions artifacts | On PR |
| **WordPress Admin** | Content, products, orders | [CMS](https://bapiheadlessstaging.kinsta.cloud/wp-admin) | Real-time |
| **Redis Cache** | Backend performance | SSH to Kinsta | Real-time |

---

## 📊 Monitoring Tools Breakdown

### 1. Vercel Speed Insights (Core Web Vitals - Real Users)

**What it tracks:** Core Web Vitals from actual users in production

**Metrics:**
- **LCP** (Largest Contentful Paint): Loading performance
  - Target: < 2.5s
  - Current: Check [Vercel Dashboard → Speed Insights]
- **CLS** (Cumulative Layout Shift): Visual stability
  - Target: < 0.1
  - Current: Check dashboard
- **INP** (Interaction to Next Paint): Responsiveness
  - Target: < 200ms
  - Current: Check dashboard
- **FCP** (First Contentful Paint): Initial render
  - Target: < 1.8s
  - Current: Check dashboard
- **TTFB** (Time to First Byte): Server response
  - Target: < 800ms
  - Current: Check dashboard

**How to Access:**
1. Go to [Vercel Dashboard](https://vercel.com)
2. Select `bapi-headless` project
3. Click "Analytics" tab
4. Click "Speed Insights"

**Features:**
- Device breakdown (mobile vs. desktop)
- Geographic distribution
- Page-level metrics
- Percentile distribution (p50, p75, p95)
- Historical trends (7d, 30d, 90d)

**Status:** ✅ Installed and running (see [AnalyticsClient.tsx](../web/src/components/analytics/AnalyticsClient.tsx))

**How to Interpret:**
- **Green**: Good (meets Google thresholds)
- **Yellow**: Needs improvement
- **Red**: Poor (hurts SEO ranking)

**Action Items:**
- If any metric is yellow/red, refer to [NEXTJS-PERFORMANCE-IMPLEMENTATION.md](./NEXTJS-PERFORMANCE-IMPLEMENTATION.md) for fixes
- Monitor weekly, especially after deployments
- Set up alerts if metrics drop below thresholds

---

### 2. Vercel Analytics (User Behavior)

**What it tracks:** Page views, navigation paths, user demographics

**Metrics:**
- Total page views
- Unique visitors
- Top pages (by visits)
- Referrer sources (Google, direct, social)
- Device types (mobile, desktop, tablet)
- Geographic distribution
- Bounce rate (if configured with events)

**How to Access:**
1. Go to [Vercel Dashboard](https://vercel.com)
2. Select `bapi-headless` project
3. Click "Analytics" tab
4. Default view shows page views

**Status:** ✅ Installed and running (see [AnalyticsClient.tsx](../web/src/components/analytics/AnalyticsClient.tsx))

**Use Cases:**
- Track most popular products
- Identify user journey patterns
- Monitor conversion funnels
- A/B test landing pages
- Measure campaign effectiveness

**Custom Events (Future Enhancement):**
```typescript
// Example: Track add-to-cart events
import { track } from '@vercel/analytics';

track('add_to_cart', {
  product_id: 'abc123',
  product_name: 'Temperature Sensor',
  price: 99.99,
});
```

---

### 3. Sentry (Error Tracking & Performance)

**What it tracks:** JavaScript errors, server errors, performance issues

**Configurations:**
- **Client-side** (browser): `sentry.client.config.ts` ✅ NEW
- **Server-side** (Next.js API): `sentry.server.config.ts` ✅
- **Edge runtime** (middleware): `sentry.edge.config.ts` ✅

**Key Features:**
- **Error Tracking**: Captures exceptions with stack traces
- **Session Replay**: Video-like playback of user sessions (10% sample)
- **Performance Monitoring**: Tracks slow API calls and page loads
- **Breadcrumbs**: User actions leading up to errors
- **Release Tracking**: Compare error rates across deployments

**How to Access:**
1. Go to [Sentry Dashboard](https://sentry.io)
2. Login with BAPI team credentials
3. Select project: `bapi-headless`
4. View Issues, Performance, or Replays tabs

**Environment Setup:**
```env
# Already configured in web/.env
NEXT_PUBLIC_SENTRY_DSN=https://9ccef63fa5c897c5f79eb540eede04dc@o4510828355518464.ingest.us.sentry.io/4510828357091328
NEXT_PUBLIC_SENTRY_ENVIRONMENT=development
```

**Status:** ✅ Fully configured (client + server + edge)

**Alerts:**
- New issue created → Email to dev team
- Error spike (>10 in 5 min) → Slack notification
- Performance degradation (P95 > 3s) → Email

**Response Protocol:**
1. Triage within 24 hours (severity assessment)
2. Critical errors (checkout, payment): Fix within 4 hours
3. Medium errors (product display): Fix within 1 week
4. Low errors (minor UI glitches): Backlog for next sprint

**Integrations:**
- **GitHub**: Link commits to releases, see which code caused errors
- **Slack**: Real-time error notifications
- **Jira**: Create tickets directly from Sentry issues

**Session Replay:**
- **Sample Rate**: 10% of all sessions
- **On Error**: 100% of sessions with errors
- **Privacy**: Text masking disabled (B2B site, no PII concern)
- **Network Logs**: Captures GraphQL requests to debug API issues

---

### 4. Google Search Console (SEO & Indexing)

**What it tracks:** Search performance, indexing status, SEO health

**Key Reports:**
1. **Performance**
   - Total clicks from Google Search
   - Total impressions (how often you appear)
   - Average CTR (click-through rate)
   - Average position (ranking)
   - Query data (what users search)
   - By page, country, device, search appearance

2. **Coverage (Pages)**
   - Indexed pages (608 products + ~30 content pages)
   - Excluded pages (by robots.txt or noindex)
   - Errors (404, 5xx, redirect issues)
   - Warnings (soft 404, blocked by robots.txt)

3. **Core Web Vitals**
   - Real-user LCP, CLS, INP data (28-day rolling average)
   - Mobile vs. desktop breakdown
   - URL groups with issues

4. **Mobile Usability**
   - Mobile-specific issues
   - Viewport configuration
   - Touch targets

5. **Rich Results**
   - Product structured data status
   - Breadcrumb display
   - Organization knowledge graph

**How to Access:**
1. Go to [Google Search Console](https://search.google.com/search-console/)
2. Select property: `bapi.com` (or URL prefix)
3. View reports in left sidebar

**Sitemap:** `https://www.bapi.com/sitemap.xml`

**Status:** ⏳ Pending setup (see [GOOGLE-SEARCH-CONSOLE-SETUP.md](./GOOGLE-SEARCH-CONSOLE-SETUP.md))

**Setup Tasks:**
- [ ] Verify domain ownership (DNS TXT record)
- [ ] Submit sitemap
- [ ] Configure users and permissions
- [ ] Set up email alerts

**Target Metrics (3 months post-launch):**
- 95%+ indexing coverage
- Zero critical errors
- "Good" Core Web Vitals for 75%+ URLs
- CTR > 3% for top pages
- Average position < 10 for target keywords

---

### 5. Lighthouse CI (Automated Performance Testing)

**What it tests:** Performance, accessibility, SEO, best practices on every PR

**Configuration:** `web/lighthouserc.json`

**Thresholds:**
- **Performance**: 90+ ✅
- **Accessibility**: 95+ ✅
- **Best Practices**: 90+ ✅
- **SEO**: 95+ ✅
- **LCP**: < 2.5s ✅
- **CLS**: < 0.1 ✅
- **TBT**: < 300ms ✅

**GitHub Workflow:** `.github/workflows/lighthouse.yml`

**Triggers:**
- On pull request to `main` branch
- When files change: `web/src/**`, `web/public/**`, `next.config.ts`, `package.json`

**How to View Results:**
1. Open any PR on GitHub
2. Scroll to "Checks" section
3. Click "Lighthouse CI" job
4. View summary in PR comment
5. Download artifacts for detailed HTML reports

**Run Locally:**
```bash
cd web

# Option 1: Test local build
pnpm run build
pnpm run start  # In one terminal
pnpm run lighthouse  # In another terminal

# Option 2: Test with Lighthouse CLI directly (recommended for WSL)
pnpm run build
pnpm run start
npx lighthouse http://localhost:3000 --view

# Option 3: Test production site
npx lighthouse https://bapi-headless.vercel.app --view
```

**Status:** ✅ Configured and running on PRs

**CI Pipeline:**
1. Checkout code
2. Install dependencies (pnpm)
3. Build production bundle
4. Start local server
5. Run Lighthouse on key pages (/, /products, /contact)
6. Compare against thresholds
7. Comment results on PR
8. Upload artifacts (30-day retention)

**Artifacts:**
- `.lighthouseci/` directory contains:
  - `manifest.json`: Run metadata
  - `lhr-*.json`: Lighthouse results (JSON)
  - `lhr-*.html`: Lighthouse reports (HTML)

**Failure Handling:**
- If any metric fails, PR shows failed check
- Block merge until fixed (recommended)
- Or allow merge with explanation (for minor regressions)

**Optimization Workflow:**
1. Make code changes
2. Push to PR branch
3. Wait for Lighthouse CI run (~5 minutes)
4. Review results in PR comment
5. If failed, click details to see which metric
6. Fix issue, push again
7. Repeat until all checks pass

---

### 6. Custom Web Vitals Tracking

**What it tracks:** Custom analytics for Core Web Vitals

**Component:** `web/src/components/analytics/WebVitals.tsx`

**Integration Points:**
- Logs metrics to console in development
- Sends to Vercel Speed Insights (automatic)
- Can send to Google Analytics (commented out, ready to enable)
- Can send to Sentry performance (commented out, ready to enable)

**Metrics Captured:**
- LCP, CLS, INP, FCP, TTFB
- Metric ID (unique per page load)
- Rating (good / needs-improvement / poor)

**Status:** ✅ Implemented and running

**Usage in Layout:**
```tsx
// web/src/app/layout.tsx (already added)
import { WebVitalsClient } from '@/components/analytics/WebVitalsClient';

<WebVitalsClient />
```

**Enable Google Analytics Integration:**

1. Add GA4 tracking code to `.env.local`:
```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

2. Uncomment GA4 section in `WebVitals.tsx`:
```typescript
// Currently commented in lines 54-60
if (typeof window !== 'undefined' && window.gtag) {
  window.gtag('event', metric.name, {
    value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
    event_label: metric.id,
    non_interaction: true,
  });
}
```

3. Add Google Analytics script to layout (create `GoogleAnalytics.tsx` component)

---

### 7. WordPress Admin (Content Management)

**What it tracks:** Content updates, order management, product catalog

**Access:**
- URL: https://bapiheadlessstaging.kinsta.cloud/wp-admin
- Username: [Team credentials]
- Password: [Team credentials]

**Key Plugins:**
- WPGraphQL: API for Next.js frontend
- WPGraphQL for WooCommerce: Product data
- WPGraphQL Smart Cache: Performance optimization
- Redis Object Cache: Database query caching

**Cache Monitoring:**
- Go to Tools → Redis Object Cache
- View hit/miss ratio (target: >90% hits)
- Check uptime and memory usage
- Flush cache if needed (after major updates)

**Status:** ✅ Running on Kinsta with Redis cache

**Health Checks:**
- GraphQL endpoint: https://bapiheadlessstaging.kinsta.cloud/graphql
- WordPress REST API: https://bapiheadlessstaging.kinsta.cloud/wp-json
- Redis cache hit ratio: >90%
- Smart Cache query tracking: Active

---

### 8. Redis Cache (Backend Performance)

**What it tracks:** Database query caching for WordPress

**Metrics (from Step 1 verification):**
- **Uptime**: 97.9% over 84 days
- **Hit Ratio**: 93.7% (7,046 hits vs. 472 misses)
- **Memory**: 111 metrics tracked
- **Version**: PhpRedis 6.2.0, Redis 7.2.5

**How to Access:**
1. SSH into Kinsta server (if direct access)
2. Or: WordPress Admin → Tools → Redis Object Cache
3. View diagnostics and flush cache if needed

**Status:** ✅ Active and healthy

**Performance Impact:**
- Without Redis: 500-1000ms query time
- With Redis: 50-100ms query time (10x faster)
- Essential for handling 608 products + 5,438 users

**Maintenance:**
- Auto-flush on product updates (via WPGraphQL Smart Cache)
- Manual flush after major data migrations
- Monitor hit ratio weekly

---

## 📈 Weekly Monitoring Routine

**Monday Morning (15 minutes):**
1. ✅ Check Vercel Speed Insights → Look for red metrics
2. ✅ Check Sentry → Triage new errors
3. ✅ Check Google Search Console → Review coverage issues

**Wednesday Afternoon (30 minutes):**
4. ✅ Review GSC Performance → Analyze top queries and CTR
5. ✅ Check Lighthouse CI → Ensure PRs are passing
6. ✅ Vercel Analytics → Identify trending pages

**Friday End-of-Week (15 minutes):**
7. ✅ Sentry release comparison → Compare error rates vs. last week
8. ✅ Export weekly metrics → Share with stakeholders
9. ✅ Plan optimizations → Prioritize red flags

**Total Time:** ~1 hour/week

---

## 🚨 Alert Configuration

### Critical Alerts (Immediate Response)

**Sentry:**
- 5xx server errors → Page dev team
- Payment/checkout errors → Page on-call engineer
- Error spike (>20 in 5 min) → Slack #dev-alerts

**Vercel:**
- Deployment failure → Email and Slack
- Build time >10 minutes → Investigate dependencies

**Uptime:**
- Site down (5xx for >1 min) → Page on-call, escalate to CTO
- API endpoint down → Page dev team

### Warning Alerts (24-Hour Response)

**Speed Insights:**
- LCP >3s for 3 consecutive days → Email SEO lead
- CLS >0.15 for 3 consecutive days → Email dev lead

**Search Console:**
- Indexing errors >10 → Email SEO lead
- Coverage drop >5% → Email SEO lead

**Sentry:**
- Performance degradation (p95 >5s) → Email dev lead

### Informational Alerts (Weekly Review)

**Analytics:**
- Weekly summary email (every Monday 9am)
- Top 10 pages, traffic trends, conversion rate

**Lighthouse CI:**
- Trend report (performance over last 10 PRs)

---

## 📊 Monthly Report Template

**Recipients:** Marketing Director, CTO, SEO Lead, Product Manager

**Metrics to Include:**

### Traffic & Engagement
- Total page views (MoM % change)
- Unique visitors (MoM % change)
- Top 10 pages by visits
- Average session duration
- Bounce rate

### Search Performance (GSC)
- Total clicks from Google (MoM % change)
- Total impressions (MoM % change)
- Average CTR (MoM % change)
- Average position (MoM % change)
- Top 10 queries driving traffic

### Core Web Vitals
- LCP: p75 value (target: <2.5s)
- CLS: p75 value (target: <0.1)
- INP: p75 value (target: <200ms)
- % of page loads with "Good" rating
- MoM improvement trend

### Errors & Reliability
- Total errors captured (Sentry)
- Error rate (errors / page views)
- Top 3 error types and resolution status
- Uptime percentage (target: 99.9%)
- Deployment success rate

### SEO Health
- Indexed pages (target: 638 total)
- Coverage errors (target: 0)
- Mobile usability issues (target: 0)
- Rich results status (target: 608 products)

### Action Items
- Top 3 performance optimizations for next month
- SEO opportunities identified
- Technical debt to address
- A/B test ideas

**Format:** Google Sheets or Looker Studio dashboard (automated)

---

## 🎓 Training Resources

**For Marketing Team:**
- [Google Search Console Training](https://support.google.com/webmasters/answer/9128668)
- [Core Web Vitals Guide](https://web.dev/vitals/)
- [Vercel Analytics Documentation](https://vercel.com/docs/analytics)

**For Developers:**
- [Sentry Next.js Guide](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Lighthouse CI Documentation](https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/getting-started.md)
- [Web Vitals Library](https://github.com/GoogleChrome/web-vitals)

**For SEO Team:**
- [Schema.org Documentation](https://schema.org/)
- [Google Search Central](https://developers.google.com/search)
- [Rich Results Test](https://search.google.com/test/rich-results)

---

## ✅ Pre-Launch Checklist

**2 Weeks Before Launch (March 27):**
- [ ] Verify Google Search Console setup
- [ ] Submit production sitemap
- [ ] Test all Sentry environments (dev, staging, prod)
- [ ] Configure production alert thresholds
- [ ] Set up monitoring access for team

**1 Week Before Launch (April 3):**
- [ ] Run full Lighthouse CI audit on staging
- [ ] Verify Core Web Vitals meet thresholds
- [ ] Test error tracking end-to-end
- [ ] Configure weekly report automation
- [ ] Train team on dashboard usage

**Launch Day (April 10):**
- [ ] Monitor Vercel Analytics real-time (first 4 hours)
- [ ] Watch Sentry for error spikes
- [ ] Verify GSC starts collecting data
- [ ] Check Speed Insights for initial CWV data
- [ ] Update team in Slack with metrics

**Post-Launch (April 11-17):**
- [ ] Daily monitoring for first week
- [ ] Address any critical errors within 24h
- [ ] Optimize based on real-user data
- [ ] Send first weekly report
- [ ] Schedule 1-month review meeting

---

## 🔗 Related Documentation

- [GOOGLE-SEARCH-CONSOLE-SETUP.md](./GOOGLE-SEARCH-CONSOLE-SETUP.md) - GSC detailed setup
- [PERFORMANCE-MONITORING.md](./PERFORMANCE-MONITORING.md) - Technical implementation
- [NEXTJS-PERFORMANCE-IMPLEMENTATION.md](./NEXTJS-PERFORMANCE-IMPLEMENTATION.md) - Optimization guide
- [SENTRY-INTEGRATION.md](./SENTRY-INTEGRATION.md) - Error tracking setup
- [SEO-PHASE1-ACTION-PLAN.md](./SEO-PHASE1-ACTION-PLAN.md) - Overall strategy

---

## 🎯 Success Metrics (3 Months Post-Launch)

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| **Performance Score** | 90+ | TBD | ⏳ |
| **LCP (p75)** | <2.5s | TBD | ⏳ |
| **CLS (p75)** | <0.1 | TBD | ⏳ |
| **INP (p75)** | <200ms | TBD | ⏳ |
| **Indexed Pages** | 638 (100%) | TBD | ⏳ |
| **GSC Errors** | 0 | TBD | ⏳ |
| **Average Position** | <10 | TBD | ⏳ |
| **CTR** | >3% | TBD | ⏳ |
| **Error Rate** | <0.1% | TBD | ⏳ |
| **Uptime** | 99.9% | TBD | ⏳ |

**Review Date:** July 10, 2026 (3 months post-launch)

---

**Questions? Contact:**
- Performance: Dev Team Lead
- SEO: Marketing Director
- Errors: On-Call Engineer
- Access Issues: IT Administrator
