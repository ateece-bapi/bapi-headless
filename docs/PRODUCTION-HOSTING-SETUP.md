# Production Hosting Setup - Kinsta & Vercel

**Launch Date:** April 10, 2026  
**Current Date:** February 11, 2026  
**Days to Launch:** 58 days

---

## Overview

This document outlines the production hosting setup for the BAPI Headless E-Commerce platform:
- **WordPress Backend**: Kinsta (managed WordPress hosting with Redis)
- **Next.js Frontend**: Vercel (edge deployment with CDN)
- **Authentication**: WordPress JWT (no third-party service required)
- **Database**: MySQL 8.0 on Kinsta
- **Object Cache**: Redis on Kinsta

### **Quick Recommendation: Start with Business 1**

**Total Monthly Cost: $270**
- Kinsta Staging: $50
- Kinsta Production (Business 1): $200 ($100 plan + $100 Redis)
- Vercel Pro: $20

**Why Business 1:**
- ✅ B2B e-commerce rarely needs 300K visits/month at launch
- ✅ Instant zero-downtime upgrades if you outgrow it
- ✅ Saves $2,400 first year vs over-provisioning with Business 3
- ✅ All critical features: Redis, CDN, auto-backups, PHP 8.3
- ✅ Same performance (Redis is the key, not the plan tier)

**Traffic Capacity:**
- 50GB bandwidth = ~150,000 page views/month (conservative)
- 100,000 visits/month = ~3,300 visits/day
- Sufficient for Phase 1 launch and growth monitoring

---

## Kinsta WordPress Backend (Production)

### Recommended Plans (Choose Based on Expected Traffic)

#### **Option 1: Business 1** ($100/month) - **RECOMMENDED START**
- **Bandwidth**: 50GB/month
- **Storage**: 10GB SSD
- **Visits**: 100,000/month
- **PHP Workers**: 2 (sufficient for B2B traffic patterns)
- **Best For**: Initial launch, B2B sites with moderate traffic
- **+ Redis**: $100/month
- **Total**: **$200/month**

#### **Option 2: Business 2** ($200/month) - **GROWTH READY**  
- **Bandwidth**: 100GB/month (2.5x staging)
- **Storage**: 20GB SSD
- **Visits**: 200,000/month
- **PHP Workers**: 4 (better for concurrent GraphQL requests)
- **Best For**: Scaling after successful launch, more headroom
- **+ Redis**: $100/month
- **Total**: **$300/month**

#### **Option 3: Business 3** ($300/month) - **HIGH TRAFFIC**
- **Bandwidth**: 200GB/month (5x staging)
- **Storage**: 30GB SSD  
- **Visits**: 300,000/month
- **PHP Workers**: 4-6
- **Best For**: Proven high traffic, Black Friday/peak seasons
- **+ Redis**: $100/month
- **Total**: **$400/month**

#### **All Plans Include:**
- **PHP Version**: 8.3 (fastest for WordPress 6.8.2 + WooCommerce 10.3.5)
- **Free Kinsta CDN**: 50+ global edge locations
- **Auto-scaling**: Handles traffic spikes automatically
- **Daily Backups**: Automatic with 14-day retention
- **Free SSL**: Automatic Let's Encrypt certificates
- **Easy Upgrades**: Scale up instantly if you outgrow your plan

#### Required Add-on (All Plans)
1. **Redis Add-on** - **$100/month** ✅ CRITICAL
   - In-memory object caching
   - Reduces GraphQL query time by 80-90%
   - Essential for 608 products + WooCommerce GraphQL
   - Expected performance: sub-second queries

### **Recommended Choice: Start with Business 1 ($200/month total)**

**Rationale:**
- B2B e-commerce typically has lower traffic than B2C
- 100,000 visits/month = ~3,300 visits/day (sufficient for Phase 1)
- Kinsta allows **instant upgrades** with zero downtime if you need more
- Save $200/month vs Business 3 initially
- Monitor actual traffic in first 3-6 months, then scale if needed

---

### Critical WordPress Plugins (Already on Staging ✅)

Your staging server already has these installed and working:

#### 1. WPGraphQL Smart Cache ✅ INSTALLED ON STAGING
```bash
# Already configured on staging - will clone to production
# No manual installation needed
```

**Configuration:**
1. Go to: WordPress Admin → Settings → GraphQL → Cache
2. **Object Cache Settings:**
   - ✅ Enable Object Cache
   - Cache Expiration: `3600` (1 hour)
3. **Network Cache Settings:**
   - Cache-Control max-age: `3600`
4. Click "Save Changes"

**Expected Impact:** 6.7s → 1-2s

---

#### 2. WPGraphQL CORS ✅ INSTALLED ON STAGING
```bash
# Already configured on staging - will clone to production
# Verify production domains in CORS settings after cloning
```

**Configuration:**
1. Go to: WordPress Admin → Settings → GraphQL → CORS
2. Add allowed origins (one per line):
   ```
   https://bapi.com
   https://www.bapi.com
   https://bapi-headless.vercel.app
   http://localhost:3000
   ```
3. **Samesite cookie mode**: Keep as "None"
4. Leave all checkboxes UNCHECKED
5. Click "Save Changes"

**Expected Impact:** Enables edge CDN caching (100-300ms cached responses)

---

#### 3. Redis Object Cache ✅ INSTALLED ON STAGING
```bash
# Already configured on staging with $100 Redis addon
# Will move Redis from staging → production for cost optimization
wp redis status  # Verify after production setup
```

**Verify Redis Connection:**
```bash
wp redis status
# Should show: Status: Connected
```

**Configuration:**
1. Go to: WordPress Admin → Settings → Redis
2. Click "Enable Object Cache"
3. Verify status shows "Connected"

**Expected Impact:** 1-2s → 500ms-1s

---

#### 4. WPGraphQL JWT Authentication ✅ INSTALLED ON STAGING
```bash
# Already configured on staging
# Will need to update JWT_SECRET_KEY in production wp-config.php
wp plugin list | grep jwt-authentication
```

**Configuration:**
1. Add to `wp-config.php`:
```php
define('GRAPHQL_JWT_AUTH_SECRET_KEY', 'your-secret-key-from-env');
```

2. Verify endpoint:
```bash
curl -X POST https://your-production-site.kinsta.cloud/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ viewer { id email } }"}'
```

---

### PHP Configuration (Kinsta Dashboard)

1. **PHP Version**: 8.3 (latest stable)
2. **Memory Limit**: 512MB (for WooCommerce + 608 products)
3. **Max Execution Time**: 300 seconds
4. **Max Upload Size**: 128MB (for product images)
5. **PHP Workers**: 4-6 (Business 3 default)

---

### Kinsta CDN Settings

1. **Enable Kinsta CDN**
   - Navigate to: Kinsta Dashboard → Sites → [Your Site] → CDN
   - Toggle "Enable Kinsta CDN"

2. **Custom Cache Rule for GraphQL**
   ```
   Path: /graphql
   Query String Handling: Include all
   Cache TTL: 3600 seconds
   Methods: GET only (POST bypasses cache for mutations)
   ```

3. **Cache Headers** (handled by Next.js frontend via WPGraphQL CORS)
   - GET requests include proper cache-control headers
   - POST requests bypass cache (mutations)

---

### WordPress Configuration Files

#### wp-config.php Additions

Add these constants to `wp-config.php`:

```php
// GraphQL Configuration
define('GRAPHQL_JWT_AUTH_SECRET_KEY', getenv('JWT_SECRET_KEY'));
define('GRAPHQL_DEBUG', false); // Never true in production

// Performance Settings
define('WP_CACHE', true);
define('WP_REDIS_CLIENT', 'phpredis');
define('WP_REDIS_SCHEME', 'tcp');
define('WP_REDIS_HOST', '127.0.0.1');
define('WP_REDIS_PORT', 6379);
define('WP_REDIS_DATABASE', 0);

// WooCommerce Settings
define('WOOCOMMERCE_ALLOW_AJAX_CHECKOUT', false);
define('WC_PRODUCT_CLASS', 'WC_Product');

// Increase limits for GraphQL queries
add_filter('graphql_query_depth_max', function() { return 20; });
add_filter('graphql_query_complexity_max', function() { return 2000; });
add_filter('graphql_batch_query_max', function() { return 20; });
```

---

### Environment Variables (Production)

Set in Kinsta Dashboard → Sites → [Your Site] → Environment Variables:

```bash
JWT_SECRET_KEY="your-production-secret-key-minimum-32-characters"
GRAPHQL_DEBUG="false"
WORDPRESS_ENV="production"
WP_ENVIRONMENT_TYPE="production"
```

---

## Kinsta Staging Server (Optimized)

### Current Plan: **Single 40GB Bandwidth Monthly** ($50/month)

#### Optimization: Remove Redis from Staging
- **Current**: $50 plan + $100 Redis = **$150/month**
- **Optimized**: $50 plan (no Redis) = **$50/month**
- **Savings**: $100/month (reallocated to production)

**Rationale:**
- Staging traffic is minimal (internal QA only)
- Slower queries acceptable (6-7s) for testing environments
- Redis not needed for functionality testing
- Focus performance resources on production

**Action Items:**
1. Remove Redis addon from staging in Kinsta dashboard
2. Disable Redis Object Cache plugin: `wp redis disable`
3. Keep WPGraphQL Smart Cache + CORS plugins active
4. Verify tests still pass with slower query times

---

## Vercel Next.js Frontend (Production)

### Recommended Plan: **Pro Plan** ($20/month per seat)

#### Plan Specifications
- **Bandwidth**: Unlimited (complements Kinsta)
- **Compute**: 100GB-hr/month (sufficient for Phase 1)
- **Image Optimization**: Built-in, unlimited
- **Build Minutes**: 6,000/month
- **Preview Deployments**: Unlimited
- **Concurrent Builds**: 2
- **Team Members**: Included
- **Analytics**: Advanced web vitals tracking

**Total Vercel Cost:** **$20/month** (1 seat)

---

### Production Environment Variables

Set in Vercel Dashboard → Settings → Environment Variables (Production):

```bash
# WordPress GraphQL Endpoint (CRITICAL - Update to production domain)
NEXT_PUBLIC_WORDPRESS_GRAPHQL="https://your-production-site.kinsta.cloud/graphql"
WORDPRESS_GRAPHQL_ENDPOINT="https://your-production-site.kinsta.cloud/graphql"

# Authentication (WordPress JWT)
JWT_SECRET_KEY="same-secret-as-wordpress-wp-config"

# Next.js Revalidation
REVALIDATION_SECRET="your-webhook-secret-for-cache-invalidation"

# Preview System
PREVIEW_SECRET="your-preview-secret-key"
PREVIEW_ALLOW_INSECURE="false" # Always false in production

# Sentry Error Tracking
SENTRY_DSN="your-sentry-production-dsn"
SENTRY_ORG="bapi"
SENTRY_PROJECT="bapi-headless-frontend"
NEXT_PUBLIC_SENTRY_DSN="your-public-sentry-dsn"

# Analytics
NEXT_PUBLIC_VERCEL_ANALYTICS_ID="auto-generated-by-vercel"

# Feature Flags
NEXT_PUBLIC_ENABLE_LIVE_CHAT="true" # Phase 1 feature
NEXT_PUBLIC_ENABLE_TRANSLATIONS="true" # Phase 1 feature

# API Rate Limiting
API_RATE_LIMIT_PER_MINUTE="100"
```

**Important:** 
- DO NOT use `sk_test_` or `pk_test_` keys in production
- Verify all URLs use `https://` (never `http://`)
- WordPress GraphQL endpoint must match production Kinsta domain

---

### Vercel Build Configuration

#### vercel.json

```json
{
  "buildCommand": "pnpm run build",
  "installCommand": "pnpm install",
  "framework": "nextjs",
  "regions": ["iad1"],
  "functions": {
    "app/**/*": {
      "maxDuration": 10
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-DNS-Prefetch-Control",
          "value": "on"
        },
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=31536000; includeSubDomains; preload"
        },
        {
          "key": "X-Frame-Options",
          "value": "SAMEORIGIN"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    }
  ]
}
```

---

## Combined Monthly Costs (By Production Tier)

### **Option 1: Business 1 (Recommended)**
| Service | Environment | Plan | Add-ons | Total |
|---------|-------------|------|---------|-------|
| **Kinsta** | Staging | Single 40GB | None | **$50** |
| **Kinsta** | Production | Business 1 | Redis ($100) | **$200** |
| **Vercel** | Both | Pro | None | **$20** |
| **TOTAL** | | | | **$270/month** |

**Compared to Current:**
- Current: Staging ($50) + Redis ($100) = $150/month
- New: Staging ($50) + Production ($200) + Vercel ($20) = $270/month
- **Increase: $120/month** for full production infrastructure

---

### **Option 2: Business 2 (Growth Ready)**
| Service | Environment | Plan | Add-ons | Total |
|---------|-------------|------|---------|-------|
| **Kinsta** | Staging | Single 40GB | None | **$50** |
| **Kinsta** | Production | Business 2 | Redis ($100) | **$300** |
| **Vercel** | Both | Pro | None | **$20** |
| **TOTAL** | | | | **$370/month** |

**Increase: $220/month** from current setup

---

### **Option 3: Business 3 (High Traffic)**
| Service | Environment | Plan | Add-ons | Total |
|---------|-------------|------|---------|-------|
| **Kinsta** | Staging | Single 40GB | None | **$50** |
| **Kinsta** | Production | Business 3 | Redis ($100) | **$400** |
| **Vercel** | Both | Pro | None | **$20** |
| **TOTAL** | | | | **$470/month** |

**Increase: $320/month** from current setup

---

### **Cost Comparison Summary**

| Tier | Total/Month | vs Current | Monthly Savings vs Business 3 | Best For |
|------|-------------|------------|-------------------------------|----------|
| **Business 1** | **$270** | +$120 | **$200** | Launch & moderate traffic |
| **Business 2** | **$370** | +$220 | **$100** | Proven traffic, room to grow |
| **Business 3** | **$470** | +$320 | $0 | High traffic, peak seasons |

---

## Decision Guide: Which Kinsta Plan?

### **Start with Business 1 ($200/month) if:**
- ✅ First production launch
- ✅ B2B business model (typically lower traffic than B2C)
- ✅ Expecting <3,000 daily visitors initially
- ✅ Want to minimize costs and scale as needed
- ✅ Budget-conscious but need Redis performance

**You can always upgrade instantly with zero downtime**

### **Choose Business 2 ($300/month) if:**
- ✅ Proven traffic from old site exceeds 100K/month
- ✅ Expecting aggressive marketing campaigns
- ✅ Need extra headroom for growth
- ✅ Budget allows for $100/month more

### **Choose Business 3 ($400/month) if:**
- ✅ Current site traffic exceeds 200K/month
- ✅ Planning major product launches or promotions
- ✅ Need maximum PHP workers for concurrent GraphQL
- ✅ High-traffic B2C model

### **Traffic Estimation Guide**

For **608 products** and **B2B e-commerce**:
- Conservative estimate: 50,000-100,000 visits/month → **Business 1**
- Moderate estimate: 100,000-200,000 visits/month → **Business 2**  
- Aggressive estimate: 200,000+ visits/month → **Business 3**

**Real-World B2B Benchmark:** Most B2B e-commerce sites with <1,000 products see 50K-150K monthly visits in first year.

---

## Scaling Up (When You Need It)

### **Kinsta Instant Upgrades - Zero Downtime**

If you start with Business 1 and outgrow it:

1. **How to Upgrade:**
   - Log in to Kinsta Dashboard
   - Click "Change Plan"
   - Select Business 2 or 3
   - Upgrade takes effect immediately (no migration needed)

2. **When to Upgrade:**
   - Approaching 80% of bandwidth limit
   - PHP workers showing saturation (>80% usage)
   - Page load times increasing during peak hours
   - Kinsta will email you before you hit limits

3. **Cost Impact:**
   - Prorated billing (pay only for remaining days on new tier)
   - No setup fees or migration costs

4. **What You Keep:**
   - Same IP address
   - Same domain configuration
   - All plugins and settings
   - All backups and data

**Bottom Line:** Start with Business 1, monitor for 3 months, upgrade only if needed. This saves $2,400/year vs starting with Business 3 prematurely.

### **Cost Savings Analysis (First Year)**

**Scenario 1: Start with Business 1, Upgrade at Month 6**
- Months 1-6: Business 1 ($200/mo) = $1,200
- Months 7-12: Business 2 ($300/mo) = $1,800
- **Year 1 Total**: $3,000

**Scenario 2: Start with Business 3 from Day 1**
- Months 1-12: Business 3 ($400/mo) = $4,800
- **Year 1 Total**: $4,800

**Savings: $1,800** (and you may never need to upgrade!)

---

## Migration Timeline

### Week 1: Feb 11-17 (Setup Production Environment)
- [ ] **Decide on plan tier**: Business 1 ($200 total) vs Business 2 ($300 total) vs Business 3 ($400 total)
- [ ] Provision chosen Kinsta plan
- [ ] Add Redis addon to production ($100/month)
- [ ] **Clone staging site to production** (all plugins already configured ✅)
- [ ] Update DNS for production domain
- [ ] Verify cloned plugins active:
  - [ ] WPGraphQL Smart Cache (verify cache settings)
  - [ ] WPGraphQL CORS (update allowed origins to production domain)
  - [ ] Redis Object Cache (enable Redis, verify connection)
  - [ ] WPGraphQL JWT Authentication (update JWT secret)
- [ ] Confirm PHP 8.3 + 512MB memory (should match staging)
- [ ] Update environment variables in wp-config.php (JWT_SECRET_KEY)
- [ ] Verify Redis connection: `wp redis status`
- [ ] **Remove Redis from staging** (save $100/month)

### Week 2: Feb 18-24 (Testing & Optimization)
- [ ] Run GraphQL performance tests (target: <1s response)
- [ ] Verify Redis object caching functional
- [ ] Test CDN cache headers on GET requests
- [ ] Load testing with 1,000+ concurrent users
- [ ] Verify 608 products load correctly
- [ ] Test authentication flow (JWT tokens)
- [ ] Verify WooCommerce cart functionality

### Week 3: Feb 25-Mar 3 (Frontend Integration)
- [ ] Set up Vercel Pro plan
- [ ] Update `NEXT_PUBLIC_WORDPRESS_GRAPHQL` to production URL
- [ ] Configure WPGraphQL CORS for production domain
- [ ] Test authentication between Next.js + WordPress
- [ ] Verify cart/checkout flow end-to-end
- [ ] Run Lighthouse performance audits (target: 90+ score)
- [ ] Set up Sentry error tracking for production

### Week 4-8: Mar 4 - Apr 5 (Testing & Refinement)
- [ ] Phase 1 feature testing (i18n, live chat, categories)
- [ ] Security audit (JWT tokens, CORS, HTTPS)
- [ ] Performance monitoring (New Relic/Kinsta APM)
- [ ] Backup verification (test restore from backup)
- [ ] Load testing (simulate 10,000 users/day)
- [ ] Monitor Redis memory usage
- [ ] Optimize slow queries (target: all <500ms)

### Week 9: Apr 6 (Final Approval)
- [ ] Stakeholder presentation
- [ ] Performance metrics review
- [ ] Security checklist verification
- [ ] Final production deployment test

### April 10, 2026: **GO LIVE** 🚀

---

## Post-Launch Monitoring

### Kinsta Dashboard Metrics to Watch
1. **PHP Execution Time**: Should be <500ms average
2. **Redis Hit Rate**: Target 90%+ cache hit ratio
3. **Bandwidth Usage**: Monitor against 200GB limit
4. **PHP Worker Saturation**: Should stay <80%
5. **MySQL Slow Queries**: Investigate any >1s queries

### Vercel Analytics to Monitor
1. **Web Vitals**: LCP <2.5s, FID <100ms, CLS <0.1
2. **Build Duration**: Should be <5 minutes
3. **Function Invocations**: Track API route usage
4. **Edge Requests**: Monitor CDN cache hit rate
5. **Deploy Success Rate**: Target 100%

### Alert Thresholds (Business 1 Baseline)
- [ ] Set up Kinsta alerts for 80% bandwidth usage (40GB of 50GB)
- [ ] Set up alerts for 80K monthly visits (80% of 100K limit)
- [ ] Set up Vercel alerts for failed deployments
- [ ] Set up Sentry alerts for error rate >1%
- [ ] Set up Redis memory usage alerts at 80%
- [ ] Monitor PHP worker saturation (>80% = time to upgrade)

**Note:** If you start with Business 1, these thresholds tell you when to upgrade to Business 2.

---

## Emergency Rollback Plan

### If Production Issues Occur:

1. **Immediate**: Point DNS back to staging server
2. **Kinsta**: Restore from automatic daily backup
3. **Vercel**: Redeploy previous stable version (instant)
4. **Notify**: Stakeholders via email/Slack
5. **Debug**: Use Kinsta staging clone to reproduce issue
6. **Fix & Test**: On staging before re-deploying to production
7. **Redeploy**: Once issue confirmed resolved

---

## Security Checklist

- [ ] All HTTP-only cookies enabled (auth_token)
- [ ] WordPress admin exposed only via VPN/IP whitelist
- [ ] WPGraphQL introspection disabled in production
- [ ] JWT secret keys 32+ characters, rotated quarterly
- [ ] CORS origins limited to production domains only
- [ ] Redis password protected (Kinsta default)
- [ ] SSL certificates valid and auto-renewing
- [ ] WordPress users: Admin accounts use 2FA
- [ ] Firewall rules: Block wp-admin except whitelisted IPs
- [ ] Security headers: CSP, HSTS, X-Frame-Options

---

## Performance Targets (April 10 Launch)

| Metric | Current (Staging) | Target (Production) |
|--------|-------------------|---------------------|
| GraphQL Query Time | 6.7s | <500ms |
| Lighthouse Desktop | 47 | 90+ |
| Lighthouse Mobile | Unknown | 80+ |
| LCP (Largest Contentful Paint) | 10.2s | <2.5s |
| FID (First Input Delay) | Unknown | <100ms |
| CLS (Cumulative Layout Shift) | Unknown | <0.1 |
| Redis Cache Hit Rate | N/A (not installed) | 90%+ |
| CDN Cache Hit Rate | Unknown | 80%+ |
| Time to First Byte (TTFB) | Unknown | <600ms |

---

## Next Steps (Action Items)

### This Week (Feb 11-17)
1. ✅ Document production hosting requirements
2. [ ] **Decide production tier**: Business 1 (recommended) vs 2 vs 3
3. [ ] Contact Kinsta: Provision chosen plan + Redis addon
3. [ ] Contact Vercel: Upgrade to Pro plan
4. [ ] **Clone staging site to production** (all plugins already configured)
5. [ ] Update production-specific settings (CORS domains, JWT secret)
6. [ ] **Remove Redis from staging** after production Redis confirmed working

### Next Week (Feb 18-24)
1. [ ] Run comprehensive performance testing
2. [ ] Verify Redis object caching functional
3. [ ] Load test with 1,000+ concurrent users
4. [ ] Document baseline performance metrics

### Questions for Stakeholders
1. What is the production domain name? (e.g., `https://bapi.com`)
2. Do we need staging preview URL for client demos?
3. What is expected traffic for first 3-6 months? (helps determine Business 1 vs 2 vs 3)
4. What is the budget approval process for hosting? ($270-$470/month depending on tier)
5. Who has access to Kinsta/Vercel production dashboards?
6. What is the escalation process for production incidents?

---

## Additional Resources

- **Kinsta Documentation**: https://kinsta.com/docs/
- **Vercel Documentation**: https://vercel.com/docs
- **WPGraphQL Smart Cache**: https://github.com/wp-graphql/wp-graphql-smart-cache
- **WPGraphQL CORS**: https://github.com/funkhaus/wp-graphql-cors
- **Next.js Performance**: https://nextjs.org/docs/advanced-features/measuring-performance
- **WordPress JWT Authentication**: https://github.com/wp-graphql/wp-graphql-jwt-authentication

---

**Document Version**: 1.0  
**Last Updated**: February 11, 2026  
**Owner**: Technical Team  
**Review Date**: March 1, 2026 (3 weeks before testing ends)
