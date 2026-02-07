# Google Search Console Integration Guide

## Overview

Google Search Console (GSC) is essential for monitoring your site's search performance, indexing status, and SEO health. This guide covers setup and optimization for the BAPI Headless e-commerce platform.

## 🎯 What Search Console Provides

1. **Search Performance**
   - Query data (what users search for)
   - Click-through rates (CTR)
   - Average position in search results
   - Impressions and clicks by page/query/country

2. **Indexing Status**
   - Which pages are indexed
   - Why pages aren't indexed (errors)
   - Coverage issues and warnings
   - Sitemap submission and validation

3. **Core Web Vitals**
   - Real-user LCP, CLS, INP data
   - Mobile vs. desktop performance
   - Issues grouped by page type

4. **Mobile Usability**
   - Mobile-specific issues
   - Viewport configuration
   - Touch elements

5. **Rich Results**
   - Structured data validation
   - Product rich snippets status
   - Breadcrumb display
   - Organization knowledge graph

## 📋 Prerequisites

Before setting up Search Console, ensure you have:

- ✅ Domain ownership (access to DNS records or web server)
- ✅ Production site live (or staging URL)
- ✅ Sitemap generated and accessible
- ✅ Robots.txt configured
- ✅ Google account with admin access

## 🚀 Setup Steps

### 1. Create Property

**Option A: Domain Property (Recommended)**
- Covers all subdomains and protocols (http/https)
- Requires DNS verification
- Shows data for www and non-www together

**Option B: URL Prefix Property**
- Specific protocol and subdomain
- Multiple verification methods
- Easier for subdomain testing

**Steps:**
1. Go to [Google Search Console](https://search.google.com/search-console/)
2. Click "Add Property"
3. Choose property type:
   - Domain: `bapi.com` (requires DNS TXT record)
   - URL Prefix: `https://www.bapi.com` (multiple verification options)
4. Complete verification (see below)

### 2. Verify Ownership

**Method 1: DNS Verification (Domain Property)**
```dns
Type: TXT
Host: @
Value: google-site-verification=XXXXXXXXXXXXXXXXXXXX
TTL: 3600
```

**Method 2: HTML File Upload**
```bash
# Download verification file from GSC
# Upload to: /home/ateece/bapi-headless/web/public/google<token>.html

# File will be accessible at:
# https://www.bapi.com/google<token>.html
```

**Method 3: HTML Meta Tag**
```tsx
// Add to web/src/app/layout.tsx in metadata
export const metadata: Metadata = {
  verification: {
    google: 'YOUR_VERIFICATION_CODE',
  },
};
```

**Method 4: Google Analytics** (if already installed)
- Use existing GA tracking code
- Requires admin access to GA property

**Method 5: Google Tag Manager** (if already installed)
- Use GTM container ID
- Requires publish permissions

### 3. Submit Sitemap

**Sitemap Location:** `https://www.bapi.com/sitemap.xml`

**Steps:**
1. Go to "Sitemaps" in left sidebar
2. Enter `sitemap.xml` in the "Add a new sitemap" field
3. Click "Submit"
4. Wait 24-48 hours for initial processing

**Expected Sitemaps:**
```
sitemap.xml (index)
├── sitemap-0-pages.xml (~30 pages)
├── sitemap-1-products.xml (~608 products)
├── sitemap-2-categories.xml (~50 categories)
└── sitemap-3-news.xml (~20 articles)
```

**Verification:**
```bash
# Test locally
curl https://www.bapi.com/sitemap.xml

# Validate with Google
https://www.xml-sitemaps.com/validate-xml-sitemap.html
```

### 4. Configure Settings

**URL Inspection:**
- Request indexing for critical pages
- Check mobile usability
- View rendered HTML (how Googlebot sees it)

**URL Parameters:**
- Configure handling of query strings
- Example: `?sort=price&filter=category`
- Mark as "Representative URLs" if duplicate content

**Address Changes:**
- If migrating from old domain
- Set up 301 redirect confirmation
- Preserve search equity

**International Targeting:**
- Set target country (if applicable)
- Configure hreflang tags (for multi-language)

**Disavow Links:**
- Only if you have manual action
- Upload list of spammy backlinks
- Use cautiously (can harm rankings)

### 5. Set Up Users & Permissions

**Access Levels:**
- **Owner**: Full control (transfer property, manage users)
- **Full User**: View all data, take actions
- **Restricted User**: View most data, limited actions
- **Associate**: View data in Search Analytics and Performance reports only

**Add Team Members:**
1. Settings → Users and Permissions
2. Click "Add User"
3. Enter email, select permission level
4. Click "Add"

**Recommended Setup:**
- SEO Lead: Owner
- Marketing Team: Full Users
- Developers: Restricted Users (for technical issues)
- Stakeholders: Associates (view-only for reports)

## 📊 Key Reports to Monitor

### 1. Performance Report
**URL:** Search Console → Performance

**Metrics to Track:**
- Total clicks (traffic from Google)
- Total impressions (how often you appear)
- Average CTR (clicks / impressions)
- Average position (1 = #1 result)

**Filters:**
- By page: Which pages get traffic?
- By query: What are users searching for?
- By country: Where is traffic coming from?
- By device: Mobile vs. desktop performance

**Optimization Tips:**
- CTR < 3%: Improve title/description
- Position 4-10: Optimize content for featured snippet
- Impressions high, clicks low: Meta description not compelling

### 2. Coverage Report
**URL:** Search Console → Coverage (now "Pages")

**Status Types:**
- **Indexed**: Pages successfully indexed ✅
- **Excluded**: Pages blocked by robots.txt or noindex
- **Error**: Pages with indexing issues ❌
- **Valid with warnings**: Indexed but with issues ⚠️

**Common Issues:**
- "Discovered - currently not indexed": Low priority (increase internal links)
- "Crawled - currently not indexed": Low quality (improve content)
- "Submitted URL not found (404)": Fix broken links in sitemap
- "Redirect error": Check 301/302 redirect chains
- "Server error (5xx)": Check WordPress/server logs

**Target:** 100% of important pages indexed, zero errors

### 3. Core Web Vitals Report
**URL:** Search Console → Experience → Core Web Vitals

**Metrics:**
- LCP (Largest Contentful Paint): < 2.5s
- CLS (Cumulative Layout Shift): < 0.1
- INP (Interaction to Next Paint): < 200ms

**Status:**
- Good: Green ✅
- Needs Improvement: Yellow ⚠️
- Poor: Red ❌

**Fix Issues:**
- Poor URLs: Click to see affected pages
- Group by pattern (e.g., all product pages)
- Fix in Next.js, then request re-validation

**Timeline:**
- Takes 28 days to update after fixes
- Based on 28-day rolling average of real users
- Changes won't appear immediately

### 4. Mobile Usability Report
**URL:** Search Console → Experience → Mobile Usability

**Common Issues:**
- Text too small to read (< 12px)
- Clickable elements too close (< 48px spacing)
- Content wider than screen (viewport issue)
- Viewport not set

**Fix:**
- Ensure responsive design
- Test with Chrome DevTools mobile emulation
- Verify viewport meta tag: `<meta name="viewport" content="width=device-width">`

### 5. Rich Results Report
**URL:** Search Console → Enhancements → Rich Results

**Structured Data Types:**
- Product (price, availability, reviews)
- Breadcrumb (navigation trail)
- Organization (company info)
- Website (search box)

**Validation:**
- Use [Rich Results Test](https://search.google.com/test/rich-results)
- Fix errors in Schema.org markup
- Monitor "Items" count (should match product count)

## 🔧 Technical Setup Checklist

### Robots.txt Configuration

**Location:** `web/public/robots.txt`

**Recommended Configuration:**
```
User-agent: *
Allow: /

# Block admin and internal pages
Disallow: /admin/
Disallow: /api/
Disallow: /checkout/
Disallow: /account/

# Allow Google to crawl CSS and JS
User-agent: Googlebot
Allow: /_next/static/
Allow: /static/

# Sitemap location
Sitemap: https://www.bapi.com/sitemap.xml
```

**Verification:**
```bash
# Test locally
curl https://www.bapi.com/robots.txt

# Validate in GSC
Search Console → Settings → robots.txt
```

### Sitemap Configuration

**Next.js Sitemap Generation:**

Create `web/src/app/sitemap.ts`:
```typescript
import { MetadataRoute } from 'next';
import { getGraphQLClient } from '@/lib/graphql/client';
import { GetAllProductSlugsDocument } from '@/lib/graphql/generated';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const client = getGraphQLClient(['products'], true);
  
  // Fetch all product slugs
  const { data } = await client.request(GetAllProductSlugsDocument);
  
  const products = data.products?.nodes.map((product) => ({
    url: `https://www.bapi.com/products/${product.slug}`,
    lastModified: product.modified || new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  })) || [];
  
  // Static pages
  const staticPages = [
    {
      url: 'https://www.bapi.com',
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: 'https://www.bapi.com/products',
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: 'https://www.bapi.com/support',
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: 'https://www.bapi.com/company',
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
  ];
  
  return [...staticPages, ...products];
}
```

**Verify Sitemap:**
```bash
# Test locally (requires build)
pnpm run build
pnpm run start
curl http://localhost:3000/sitemap.xml

# Production
curl https://www.bapi.com/sitemap.xml
```

### Canonical URLs

**Ensure all pages have canonical tags:**

Already implemented in `web/src/lib/seo.ts`:
```typescript
export function generateCanonical(path: string): string {
  return `${SITE_CONFIG.url}${path}`;
}
```

**Verification:**
```bash
# Check source for:
<link rel="canonical" href="https://www.bapi.com/products/abc123" />
```

## 📈 Performance Optimization for GSC

### 1. Improve Core Web Vitals

Based on GSC data, prioritize fixes:

**LCP Issues:**
- Optimize hero images (use WebP, sizes attribute)
- Reduce server response time (use Redis cache)
- Preload critical resources
- Use CDN for static assets

**CLS Issues:**
- Set explicit width/height on images
- Avoid inserting content above existing content
- Use CSS aspect-ratio for responsive elements
- Load fonts with font-display: swap

**INP Issues:**
- Reduce JavaScript execution time
- Code-split large bundles
- Debounce input handlers
- Use next/dynamic for heavy components

### 2. Increase Indexing Coverage

**Priority Pages:**
1. Homepage (rank: 1.0)
2. Product category pages (rank: 0.9)
3. Individual product pages (rank: 0.8)
4. Support/company pages (rank: 0.7)

**Strategies:**
- Add internal links from high-authority pages
- Improve page quality (content depth, uniqueness)
- Ensure proper robots.txt configuration
- Fix technical errors (4xx, 5xx, redirect chains)

### 3. Optimize Click-Through Rate

**Title Tag Best Practices:**
- Include target keyword
- Keep under 60 characters
- Add brand name (BAPI)
- Make it compelling (use power words)

**Meta Description Best Practices:**
- 150-160 characters
- Include call-to-action
- Highlight unique value proposition
- Use schema markup for rich snippets

**Example Product Page:**
```typescript
title: 'BA/10K-3-I-4 Indoor Temperature Sensor | BAPI'
description: 'Precision 10K thermistor sensor for HVAC control. ±0.2°C accuracy, -40°C to +105°C range. UL listed. Free shipping on orders $500+. Order now!'
```

## 🚨 Common Issues & Solutions

### Issue: "Discovered - currently not indexed"

**Cause:** Google found the URL but hasn't crawled it yet
**Solution:**
- Request indexing via URL Inspection tool
- Add internal links from high-priority pages
- Increase content quality/length
- Ensure page provides unique value

### Issue: "Crawled - currently not indexed"

**Cause:** Google crawled but deemed page low quality
**Solution:**
- Improve content depth (add 500+ words)
- Add unique images and media
- Ensure mobile-friendly design
- Remove duplicate content

### Issue: "Submitted URL not found (404)"

**Cause:** URL in sitemap returns 404 error
**Solution:**
- Remove deleted pages from sitemap
- Fix broken redirects
- Verify URL structure in Next.js routing

### Issue: "Server error (5xx)"

**Cause:** WordPress/Next.js returning server error
**Solution:**
- Check server logs: `pnpm run dev` or Vercel logs
- Verify WordPress GraphQL endpoint health
- Check database connections (Redis cache)
- Monitor with Sentry error tracking

### Issue: "Redirect error"

**Cause:** Redirect chain or loop
**Solution:**
- Check redirect rules in `next.config.ts`
- Ensure 301 (not 302) for permanent redirects
- Avoid redirect chains (A → B → C)
- Test with `curl -I https://www.bapi.com`

### Issue: Poor Core Web Vitals

**Cause:** Real-user metrics below thresholds
**Solution:**
- Run Lighthouse CI locally: `pnpm run lighthouse:build`
- Use Vercel Speed Insights for real data
- Profile with Chrome DevTools Performance tab
- Fix issues identified in Step 2 (Next.js optimizations)

## 📅 Monitoring Schedule

### Daily
- [ ] Check for new critical errors (email alerts)
- [ ] Monitor indexing coverage (should be stable)
- [ ] Review top queries and CTR trends

### Weekly
- [ ] Analyze performance report (clicks, impressions)
- [ ] Check Core Web Vitals status
- [ ] Review new rich results issues
- [ ] Inspect top-performing pages

### Monthly
- [ ] Deep dive into query performance
- [ ] Identify content gaps (high impressions, low CTR)
- [ ] Review mobile usability issues
- [ ] Analyze backlink profile (if integrated)
- [ ] Export data for growth tracking

### Quarterly
- [ ] Compare year-over-year growth
- [ ] Audit sitemap accuracy (add new pages)
- [ ] Review international targeting (if applicable)
- [ ] Conduct structured data audit
- [ ] Optimize underperforming pages

## 🔗 Integration with Analytics

### Link to Google Analytics 4

**Benefits:**
- Cross-reference search traffic with on-site behavior
- See which queries lead to conversions
- Track assisted conversions from organic search

**Setup:**
1. Go to Search Console → Settings → Associations
2. Click "Associate" next to Google Analytics
3. Select GA4 property
4. Confirm association

**Verification:**
- GA4: Acquisition → Traffic Acquisition → Source: "google / organic"
- Cross-check clicks with GSC Performance report

### Export Data for Dashboards

**Method 1: Google Data Studio (Looker Studio)**
```
1. Go to https://lookerstudio.google.com/
2. Create → Data Source → Google Search Console
3. Select property and date range
4. Build custom dashboard with:
   - CTR trends
   - Position changes
   - Core Web Vitals
   - Indexing coverage
```

**Method 2: Search Console API**
```typescript
// web/src/lib/search-console.ts
import { google } from 'googleapis';

const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GSC_SERVICE_ACCOUNT || '{}'),
  scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
});

const searchconsole = google.searchconsole({ version: 'v1', auth });

export async function getSearchAnalytics(startDate: string, endDate: string) {
  const response = await searchconsole.searchanalytics.query({
    siteUrl: 'https://www.bapi.com',
    requestBody: {
      startDate,
      endDate,
      dimensions: ['page', 'query'],
      rowLimit: 1000,
    },
  });
  
  return response.data.rows;
}
```

**Method 3: Manual Export**
- Performance report → Export → CSV
- Schedule weekly exports
- Import to Excel/Google Sheets for analysis

## 📚 Resources

- [Google Search Console Help](https://support.google.com/webmasters/)
- [Structured Data Testing Tool](https://developers.google.com/search/docs/appearance/structured-data)
- [Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)
- [Rich Results Test](https://search.google.com/test/rich-results)
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [Search Console API Documentation](https://developers.google.com/webmaster-tools/v1/api_reference_index)

## ✅ Success Criteria

After 3 months, you should see:
- ✅ 95%+ indexing coverage (important pages)
- ✅ Zero critical errors
- ✅ "Good" Core Web Vitals for 75%+ URLs
- ✅ Month-over-month clicks growth
- ✅ Average position < 10 for target keywords
- ✅ CTR > 3% for top pages
- ✅ Rich results appearing for product pages

## 🎓 Next Steps

1. **Set up property and verify ownership** (1 hour)
2. **Submit sitemap** (15 minutes)
3. **Configure settings and users** (30 minutes)
4. **Review initial data** (wait 48-72 hours)
5. **Fix critical errors** (ongoing)
6. **Monitor weekly** (15 minutes/week)
7. **Optimize based on data** (ongoing)

For technical implementation details, see:
- [NEXTJS-PERFORMANCE-IMPLEMENTATION.md](./NEXTJS-PERFORMANCE-IMPLEMENTATION.md)
- [PERFORMANCE-MONITORING.md](./PERFORMANCE-MONITORING.md)
- [SEO-PHASE1-ACTION-PLAN.md](./SEO-PHASE1-ACTION-PLAN.md)
