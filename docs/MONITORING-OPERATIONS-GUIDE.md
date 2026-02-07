# Monitoring Operations Guide

## Daily Operations

This guide provides step-by-step instructions for monitoring the BAPI Headless e-commerce platform. Follow these procedures to ensure optimal performance, catch issues early, and maintain world-class SEO.

---

## 🚀 Quick Start (2-Minute Health Check)

Run this checklist every morning (Monday-Friday):

```bash
# 1. Check production site is up
curl -I https://www.bapi.com

# 2. Check GraphQL endpoint health
curl https://bapiheadlessstaging.kinsta.cloud/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ __typename }"}'

# 3. Check Redis cache status
# → Visit WordPress Admin → Tools → Redis Object Cache
# → Verify "Connected" status and >90% hit ratio
```

**Expected Results:**
- ✅ HTTP 200 OK from bapi.com
- ✅ GraphQL returns `{"data":{"__typename":"Query"}}`
- ✅ Redis shows "Connected" with >90% hit ratio

**If any check fails:**
- 🚨 Alert on-call engineer immediately
- 📝 Document issue in incident log
- 🔧 Follow troubleshooting guide (see "Incident Response" section)

---

## 📊 Weekly Monitoring Routine

### Monday Morning (15 minutes)

**Goal:** Triage weekend issues and plan the week

#### 1. Check Vercel Speed Insights

**Access:** [Vercel Dashboard](https://vercel.com) → bapi-headless → Analytics → Speed Insights

**What to look for:**
- Any metric in red (poor) or yellow (needs improvement)
- Sudden drops in performance vs. last week
- Geographic outliers (e.g., slow in specific region)

**Action items:**
```markdown
If LCP > 3s:
  - [ ] Check hero image optimization
  - [ ] Verify CDN cache hit rate
  - [ ] Review server response times

If CLS > 0.15:
  - [ ] Audit layout shifts in Chrome DevTools
  - [ ] Check image dimensions (width/height set?)
  - [ ] Review dynamic content injection

If INP > 250ms:
  - [ ] Profile JavaScript execution in DevTools
  - [ ] Check for long tasks (>50ms)
  - [ ] Review event handler performance
```

**Document findings:**
```bash
# Create ticket if needed
echo "Performance Issue: LCP 3.2s on product pages" >> /tmp/weekly-issues.txt
```

#### 2. Check Sentry Errors

**Access:** [Sentry Dashboard](https://sentry.io) → bapi-headless → Issues

**Filters:**
- Status: Unresolved
- Time: Last 7 days
- Sort by: Event count (descending)

**Triage process:**
```
For each error:
  1. Severity assessment:
     - Critical: Checkout, payment, authentication
     - High: Product display, cart, navigation
     - Medium: UI glitches, minor features
     - Low: Edge cases, non-critical features
  
  2. Assign priority:
     - P0 (Critical): Fix today
     - P1 (High): Fix this week
     - P2 (Medium): Fix next sprint
     - P3 (Low): Backlog
  
  3. Assign owner:
     - Frontend issues → Frontend dev
     - Backend issues → Backend dev
     - GraphQL issues → API team
  
  4. Create GitHub issue:
     - Title: [Sentry] Brief error description
     - Body: Link to Sentry issue, repro steps
     - Labels: bug, priority-P0/P1/P2/P3
```

**Example triage:**
```markdown
Error: "Cannot read property 'addToCart' of undefined"
- Severity: High (cart functionality)
- Priority: P1 (fix this week)
- Owner: @frontend-dev
- Issue: #1234 created

Error: "GraphQL query timeout"
- Severity: Medium (affects search, not critical)
- Priority: P2 (next sprint)
- Owner: @backend-dev
- Issue: #1235 created
```

#### 3. Check Google Search Console

**Access:** [GSC](https://search.google.com/search-console/) → bapi.com → Coverage

**What to look for:**
- New errors (red line going up)
- Indexing drops (valid pages going down)
- Coverage warnings

**Common issues and fixes:**
```
"Discovered - currently not indexed" (URLs > 50):
  → Fix: Add internal links from high-authority pages
  → Request indexing via URL Inspection tool

"Crawled - currently not indexed" (URLs > 20):
  → Fix: Improve content quality (add 500+ words)
  → Check for duplicate content

"Submitted URL not found (404)" (URLs > 0):
  → Fix: Remove from sitemap or fix redirect

"Server error (5xx)" (URLs > 0):
  → Fix: Check server logs, alert backend team
  → CRITICAL: Fix immediately

"Redirect error" (URLs > 0):
  → Fix: Remove redirect chains (A → B → C)
  → Use 301 (not 302) for permanent redirects
```

**Document findings:**
```bash
# Export coverage issues
# GSC → Coverage → Export → Save as coverage-2026-02-10.csv
```

---

### Wednesday Afternoon (30 minutes)

**Goal:** Deep dive into performance trends and user behavior

#### 4. Analyze Search Performance

**Access:** GSC → Performance → Last 28 days

**Metrics to export:**
- Total clicks (traffic from Google)
- Total impressions (visibility in search)
- Average CTR (engagement)
- Average position (ranking)

**Analysis checklist:**
```markdown
✅ Compare vs. last 28 days:
   - Clicks up? → Success! What changed?
   - Clicks down? → Investigate: Algorithm update? Competitor? Technical issue?

✅ Identify top queries:
   - CTR < 3% → Improve meta description
   - Position 4-10 → Optimize for featured snippet
   - High impressions, low clicks → Title not compelling

✅ Identify top pages:
   - What content resonates?
   - Can we create similar content?
   - Cross-link to boost other pages

✅ Geographic distribution:
   - Any new markets emerging?
   - Translation opportunities?

✅ Device breakdown:
   - Mobile vs. desktop performance
   - Mobile-specific issues?
```

**Export data:**
```bash
# GSC → Performance → Export → Download CSV
# Save as: search-performance-2026-02-10.csv
```

**Create growth report:**
```markdown
## Search Performance Report (Week of Feb 10, 2026)

**Overall Metrics:**
- Total Clicks: 1,245 (+8.2% vs. last period)
- Total Impressions: 45,678 (+12.1%)
- Average CTR: 2.73% (-0.3pp)
- Average Position: 8.4 (-0.6)

**Top Queries:**
1. "building automation sensors" - 234 clicks (pos 4.2)
2. "temperature sensor HVAC" - 189 clicks (pos 3.8)
3. "BAPI sensors" - 156 clicks (pos 1.2)

**Action Items:**
- [ ] Optimize "sensors for BMS" (pos 12.4 → target 8.0)
- [ ] Improve CTR for "CO2 sensor" (1.8% → target 3.0%)
- [ ] Create content for "humidity sensor installation"

**Opportunities:**
- Query "wireless building sensors" has 5,678 impressions (pos 18)
  → Create dedicated landing page
```

#### 5. Review Lighthouse CI Trends

**Access:** GitHub → Actions → Lighthouse CI → Recent runs

**What to look for:**
- Performance score trends (last 10 runs)
- Any failing checks in recent PRs
- Metric regressions (LCP, CLS getting worse)

**Analysis:**
```bash
# Download last 10 Lighthouse artifacts
gh run list --workflow=lighthouse.yml --limit=10

# Compare scores manually or create script
# Example: lighthouse-trend-analysis.sh
```

**If trends show degradation:**
```markdown
Performance dropping (95 → 92 → 89):
  - [ ] Review recent PRs for heavy imports
  - [ ] Check bundle size (pnpm run build:analyze)
  - [ ] Profile with Chrome DevTools

Accessibility dropping (98 → 96):
  - [ ] Run axe DevTools on affected pages
  - [ ] Check recent UI changes
  - [ ] Review ARIA attributes
```

#### 6. Check Vercel Analytics

**Access:** Vercel Dashboard → Analytics → Last 7 days

**Metrics to review:**
- Total page views
- Unique visitors
- Top pages (by visits)
- Bounce rate (if configured)

**Questions to answer:**
```markdown
1. What are the most popular pages?
   → Products? Categories? Support docs?
   → Why? Good SEO? User need?

2. What are the least visited pages?
   → Low traffic = poor SEO or low demand?
   → Should we improve or deprioritize?

3. What's the user journey?
   → Homepage → Products → Checkout?
   → Or: Search → Product → Exit?
   → Where do users drop off?

4. Are traffic patterns expected?
   → Weekday vs. weekend
   → Business hours vs. off-hours
   → Seasonal trends (HVAC industry)
```

**Export data for stakeholders:**
```bash
# Vercel Analytics → Export → CSV
# Save as: vercel-analytics-2026-02-10.csv
```

---

### Friday End-of-Week (15 minutes)

**Goal:** Week wrap-up and next week planning

#### 7. Sentry Release Comparison

**Access:** Sentry → Releases → Compare

**Compare:**
- This week's deployments vs. last week
- Error rate per release
- New issues introduced

**Questions:**
```markdown
Did new releases introduce errors?
  - Yes → Rollback or hotfix?
  - No → Great! Document what went well.

Are error rates trending up or down?
  - Down → Improvements working!
  - Up → Need more testing/monitoring?

Any patterns in errors?
  - Specific pages/features?
  - Specific user segments?
  - Time of day?
```

**Document:**
```bash
# Create release notes
cat << EOF > release-notes-2026-02-10.md
## Release Notes (Week of Feb 10, 2026)

**Deployments:**
- v1.2.3 (Feb 6): Performance improvements
- v1.2.4 (Feb 8): Bug fixes

**Error Rate:**
- This week: 0.08% (↓ 0.02pp vs. last week)
- Total errors: 45 (↓ 15 vs. last week)

**Top Issues Resolved:**
- Fixed cart not updating on quantity change
- Resolved mobile menu z-index issue
- Fixed product image lazy loading

**New Issues:**
- Search bar focus state (P2, assigned to @dev1)

**Verdict:** ✅ Successful week, no major regressions
EOF
```

#### 8. Export Weekly Metrics

**Create stakeholder report:**

```bash
# Run this script every Friday
cat << 'EOF' > export-weekly-metrics.sh
#!/bin/bash

DATE=$(date +%Y-%m-%d)
REPORT_DIR="./weekly-reports/$DATE"
mkdir -p "$REPORT_DIR"

echo "📊 Exporting weekly metrics for $DATE..."

# 1. Vercel Speed Insights (manual export)
echo "→ Export Vercel Speed Insights to: $REPORT_DIR/speed-insights.csv"
echo "   (Visit Vercel Dashboard → Speed Insights → Export)"

# 2. Search Console Performance (manual export)
echo "→ Export GSC Performance to: $REPORT_DIR/gsc-performance.csv"
echo "   (Visit Search Console → Performance → Export)"

# 3. Vercel Analytics (manual export)
echo "→ Export Vercel Analytics to: $REPORT_DIR/vercel-analytics.csv"
echo "   (Visit Vercel Dashboard → Analytics → Export)"

# 4. Sentry Summary (API - requires token)
if [ -n "$SENTRY_AUTH_TOKEN" ]; then
  curl -H "Authorization: Bearer $SENTRY_AUTH_TOKEN" \
    "https://sentry.io/api/0/organizations/bapi/issues/" \
    > "$REPORT_DIR/sentry-issues.json"
  echo "✅ Sentry data exported"
else
  echo "⚠️  SENTRY_AUTH_TOKEN not set. Manual export required."
fi

echo ""
echo "✅ Weekly export complete!"
echo "📁 Reports saved to: $REPORT_DIR"
echo ""
echo "Next steps:"
echo "1. Review all CSV/JSON files"
echo "2. Create summary in weekly-summary-$DATE.md"
echo "3. Share with stakeholders via email/Slack"
EOF

chmod +x export-weekly-metrics.sh
./export-weekly-metrics.sh
```

#### 9. Plan Next Week's Optimizations

**Based on week's findings, prioritize:**

```markdown
## Optimization Backlog (Week of Feb 17, 2026)

**P0 - Must Do This Week:**
- [ ] Fix 5xx errors on /api/checkout (blocking orders)
- [ ] Resolve LCP >4s on mobile product pages

**P1 - Should Do This Week:**
- [ ] Improve CTR for top 5 queries (add compelling descriptions)
- [ ] Fix indexing errors in GSC (12 URLs not found)
- [ ] Optimize hero image on homepage (reduce LCP)

**P2 - Nice to Have:**
- [ ] Add FAQ schema to product pages
- [ ] Improve mobile navigation UX
- [ ] Create landing page for "wireless sensors" query

**P3 - Future Sprint:**
- [ ] Implement breadcrumb navigation on all pages
- [ ] Add video snippets to product schema
- [ ] Create blog content for long-tail keywords
```

---

## 🚨 Incident Response

### Critical Site Down (5xx errors, site unreachable)

**Severity:** P0 - Immediate response required

**Detection:**
- Uptime monitoring alert
- User reports
- Sentry error spike

**Response protocol:**

```bash
# 1. Verify outage (3 minutes)
curl -I https://www.bapi.com
# Expected: HTTP 200 OK
# Actual: HTTP 500/502/503 or timeout

# Check status page
open https://www.bapi.com  # Browser test
open https://downforeveryoneorjustme.com/bapi.com

# 2. Check Vercel deployment status (2 minutes)
# → Vercel Dashboard → Deployments
# → Look for failed deployments or errors

# 3. Check WordPress/GraphQL endpoint (2 minutes)
curl https://bapiheadlessstaging.kinsta.cloud/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ __typename }"}'

# If WordPress down:
#   → Contact Kinsta support immediately
#   → Check Kinsta status: https://status.kinsta.com

# 4. Rollback if recent deployment caused issue (5 minutes)
# → Vercel Dashboard → Deployments → "..." → Redeploy (select previous version)

# 5. Alert team (1 minute)
# → Slack #critical-alerts
# → Include: What's down, ETA, current status

# 6. Monitor recovery (ongoing)
# → Watch Sentry error rate
# → Check user reports
# → Verify all pages accessible
```

**Post-incident:**
```markdown
## Incident Report: Site Down (Feb X, 2026)

**Duration:** 2:15pm - 2:47pm EST (32 minutes)

**Impact:**
- 100% of users unable to access site
- Estimated 450 lost page views
- 12 potential customers affected

**Root Cause:**
- GraphQL endpoint timeout due to Redis cache failure
- Kinsta server disk full (logs not rotated)

**Resolution:**
- Contacted Kinsta support (2:18pm)
- Cleared logs, restarted Redis (2:35pm)
- Verified site recovery (2:47pm)

**Prevention:**
- [ ] Set up disk space monitoring
- [ ] Implement log rotation policy
- [ ] Add Redis backup plan

**Status:** Resolved
**Owner:** @backend-lead
```

### Performance Degradation

**Severity:** P1 - Response within 24 hours

**Detection:**
- Vercel Speed Insights alert (LCP >4s for 3 days)
- Lighthouse CI threshold violation
- User complaints about slow site

**Response protocol:**

```bash
# 1. Verify issue (10 minutes)
# Run Lighthouse locally
pnpm run build
pnpm run start
npx lighthouse http://localhost:3000 --view

# Check Vercel Speed Insights
# → Look for specific pages with issues

# 2. Profile performance (30 minutes)
# Chrome DevTools → Performance tab
# → Record page load
# → Identify bottlenecks:
#   - Long tasks (>50ms)
#   - Large JavaScript bundles
#   - Slow API calls
#   - Unoptimized images

# 3. Check recent changes (15 minutes)
git log --oneline --since="3 days ago"
# → Any new heavy dependencies?
# → Any large images added?
# → Any slow GraphQL queries?

# 4. Quick wins (varies)
# → Optimize largest images (convert to WebP)
# → Code-split heavy components
# → Add loading states
# → Preload critical resources

# 5. Create optimization ticket
# → GitHub issue with profiling screenshots
# → Assign to responsible team
# → Target fix date
```

### SEO Issues (Coverage/Indexing Errors)

**Severity:** P2 - Response within 1 week

**Detection:**
- GSC alert: >10 new errors
- Indexing coverage drop >5%

**Response protocol:**

```bash
# 1. Identify error type (10 minutes)
# → GSC → Coverage → View details
# → Export affected URLs

# 2. Categorize issues (15 minutes)
# → 404 errors: Broken links or removed pages?
# → 5xx errors: Server issues?
# → Redirect errors: Too many hops?
# → Noindex: Intentional or mistake?

# 3. Fix common issues (varies)

# 404 errors:
# → Update sitemap to remove deleted pages
# → Add redirects for moved pages

# 5xx errors:
# → Check server logs
# → Verify all pages load correctly
# → Fix server errors (see above)

# Redirect errors:
# → Simplify redirect chains (A → C instead of A → B → C)
# → Change 302 to 301 for permanent redirects

# 4. Request re-indexing
# → GSC → URL Inspection
# → Enter fixed URL
# → Click "Request Indexing"

# 5. Monitor for 2 weeks
# → Check if errors resolved in GSC
# → Verify indexed count increasing
```

---

## 📈 Monthly Reporting

### Last Friday of Month (2 hours)

**Generate comprehensive monthly report:**

```bash
# Run monthly report script
cat << 'EOF' > generate-monthly-report.sh
#!/bin/bash

MONTH=$(date +%B_%Y)
REPORT="monthly-report-$MONTH.md"

cat << REPORT > "$REPORT"
# Monthly SEO & Performance Report
## $(date +"%B %Y")

---

## Executive Summary

**Overall Status:** 🟢 On Track | 🟡 Needs Attention | 🔴 Off Track

**Key Highlights:**
- [Fill in top 3 wins]
- [Fill in top 3 challenges]
- [Fill in growth %]

---

## Traffic & Engagement

### Vercel Analytics (Page Views)
- **Total:** [X,XXX] (±X% MoM)
- **Unique Visitors:** [X,XXX] (±X% MoM)
- **Top Pages:**
  1. [Page 1]: [X,XXX] views
  2. [Page 2]: [X,XXX] views
  3. [Page 3]: [X,XXX] views

### Search Console (Organic Traffic)
- **Clicks:** [X,XXX] (±X% MoM)
- **Impressions:** [XXX,XXX] (±X% MoM)
- **Average CTR:** [X.X%] (±X.Xpp MoM)
- **Average Position:** [X.X] (±X.X MoM)

**Top Queries:**
1. "[Query 1]": [XXX] clicks (pos [X.X])
2. "[Query 2]": [XXX] clicks (pos [X.X])
3. "[Query 3]": [XXX] clicks (pos [X.X])

---

## Core Web Vitals

### Vercel Speed Insights (p75)
- **LCP:** [X.Xs] | Target: <2.5s | Status: [✅/⚠️/❌]
- **CLS:** [0.XX] | Target: <0.1 | Status: [✅/⚠️/❌]
- **INP:** [XXXms] | Target: <200ms | Status: [✅/⚠️/❌]

### Google Search Console
- **Good URLs:** [X%] (mobile), [X%] (desktop)
- **Needs Improvement:** [X%] (mobile), [X%] (desktop)
- **Poor URLs:** [X%] (mobile), [X%] (desktop)

**Trend:** [Improving / Stable / Declining]

---

## SEO Health

### Indexing Coverage
- **Indexed Pages:** [XXX] / [XXX] total ([XX%])
- **Errors:** [X] URLs (Target: 0)
- **Warnings:** [X] URLs
- **Excluded:** [X] URLs (intentional)

### Rich Results
- **Product Pages:** [XXX] / [XXX] with valid schema ([XX%])
- **Breadcrumbs:** [XXX] / [XXX] implemented ([XX%])
- **Organization:** [✅/❌] Knowledge graph eligible

### Mobile Usability
- **Issues:** [X] URLs with problems (Target: 0)
- **Status:** [✅ No issues / ⚠️ Minor issues / ❌ Critical issues]

---

## Errors & Reliability

### Sentry
- **Total Errors:** [X,XXX] ([±X%] MoM)
- **Error Rate:** [X.XX%] (errors / page views)
- **New Issues:** [XX] introduced this month
- **Resolved Issues:** [XX] closed this month

**Top 3 Errors:**
1. [Error type]: [XXX] events
2. [Error type]: [XXX] events
3. [Error type]: [XXX] events

### Uptime
- **Availability:** [XX.XX%] (Target: 99.9%)
- **Major Incidents:** [X] (Duration: [X] minutes total)
- **Minor Incidents:** [X] (Duration: [X] minutes total)

---

## Achievements This Month

✅ [Achievement 1]
✅ [Achievement 2]
✅ [Achievement 3]

---

## Challenges & Blockers

⚠️ [Challenge 1] - Impact: [High/Medium/Low]
⚠️ [Challenge 2] - Impact: [High/Medium/Low]

---

## Action Items for Next Month

### P0 - Critical
- [ ] [Action item 1]
- [ ] [Action item 2]

### P1 - High Priority
- [ ] [Action item 3]
- [ ] [Action item 4]

### P2 - Medium Priority
- [ ] [Action item 5]

---

## Growth Forecast

Based on current trends:
- **Traffic:** [Expected growth %]
- **Rankings:** [Expected improvement]
- **Conversions:** [Expected increase]

---

**Report Generated:** $(date)
**Prepared By:** SEO Team
**Next Report:** $(date -d "next month" +"%B 1, %Y")

REPORT

echo "✅ Monthly report template created: $REPORT"
echo "📝 Fill in actual data from:"
echo "   1. Vercel Analytics export"
echo "   2. GSC Performance export"
echo "   3. Vercel Speed Insights"
echo "   4. Sentry dashboard"
echo ""
echo "📧 Share with stakeholders when complete"
EOF

chmod +x generate-monthly-report.sh
./generate-monthly-report.sh
```

**Distribution:**
```markdown
To: marketing-director@bapi.com, cto@bapi.com, seo-lead@bapi.com
Subject: Monthly SEO & Performance Report - [Month Year]

Hi team,

Please find attached this month's SEO and performance report.

Key highlights:
- Traffic: +X% month-over-month
- Core Web Vitals: All green
- Errors: Down X% from last month

Let me know if you have any questions or want to dive deeper into any metrics.

Best,
[Your Name]
SEO Team
```

---

## 🛠️ Tools & Scripts

### 1. Quick Health Check Script

```bash
#!/bin/bash
# health-check.sh - Run daily for 2-minute health check

echo "🏥 BAPI Headless Health Check"
echo "=============================="
echo ""

# 1. Check production site
echo "1️⃣ Checking production site..."
if curl -s -o /dev/null -w "%{http_code}" https://www.bapi.com | grep -q "200"; then
  echo "   ✅ Site is up (HTTP 200)"
else
  echo "   ❌ Site is down or returning error"
  exit 1
fi

# 2. Check GraphQL endpoint
echo "2️⃣ Checking GraphQL endpoint..."
GRAPHQL_RESPONSE=$(curl -s -X POST https://bapiheadlessstaging.kinsta.cloud/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ __typename }"}')

if echo "$GRAPHQL_RESPONSE" | grep -q "Query"; then
  echo "   ✅ GraphQL is responding"
else
  echo "   ❌ GraphQL error: $GRAPHQL_RESPONSE"
  exit 1
fi

# 3. Check Redis cache (requires WordPress admin access)
echo "3️⃣ Redis cache status..."
echo "   ℹ️  Manual check required:"
echo "   → Visit: https://bapiheadlessstaging.kinsta.cloud/wp-admin/tools.php?page=redis-object-cache"
echo "   → Verify: Status = Connected, Hit Ratio > 90%"

# 4. Check Sentry for error spikes
echo "4️⃣ Checking Sentry..."
echo "   ℹ️  Manual check required:"
echo "   → Visit: https://sentry.io/organizations/bapi/issues/"
echo "   → Count open issues (should be <10)"

echo ""
echo "✅ Health check complete!"
echo "📅 Next check: Tomorrow at 9am"
```

### 2. Performance Audit Script

```bash
#!/bin/bash
# performance-audit.sh - Run weekly for detailed analysis

echo "⚡ Performance Audit"
echo "==================="
echo ""

# Build production bundle
echo "1️⃣ Building production bundle..."
cd web
pnpm run build

# Analyze bundle size
echo "2️⃣ Analyzing bundle size..."
pnpm run build:analyze

# Run Lighthouse
echo "3️⃣ Running Lighthouse audit..."
pnpm run start &
SERVER_PID=$!
sleep 10  # Wait for server to start

npx lighthouse http://localhost:3000 \
  --output=html \
  --output-path=./lighthouse-report-$(date +%Y-%m-%d).html \
  --view

# Clean up
kill $SERVER_PID

echo ""
echo "✅ Performance audit complete!"
echo "📊 Report: ./lighthouse-report-$(date +%Y-%m-%d).html"
```

### 3. SEO Audit Script

```bash
#!/bin/bash
# seo-audit.sh - Monthly SEO health check

echo "🔍 SEO Audit"
echo "==========="
echo ""

# 1. Check robots.txt
echo "1️⃣ Checking robots.txt..."
curl -s https://www.bapi.com/robots.txt | head -20
echo ""

# 2. Check sitemap
echo "2️⃣ Checking sitemap..."
curl -s https://www.bapi.com/sitemap.xml | head -30
echo ""

# 3. Check structured data (sample product page)
echo "3️⃣ Checking structured data..."
curl -s https://www.bapi.com/products/sample-product | \
  grep -o '<script type="application/ld+json">.*</script>' | \
  head -1
echo ""

# 4. Check canonical tags
echo "4️⃣ Checking canonical tags..."
curl -s https://www.bapi.com/ | grep -o '<link rel="canonical".*>' | head -3
echo ""

# 5. Validate with Google tools
echo "5️⃣ Validate with Google:"
echo "   → Rich Results Test: https://search.google.com/test/rich-results"
echo "   → Mobile-Friendly Test: https://search.google.com/test/mobile-friendly"
echo "   → PageSpeed Insights: https://pagespeed.web.dev/"
echo ""

echo "✅ SEO audit complete!"
```

---

## 📚 Resources & Training

### Documentation
- [MONITORING-DASHBOARD.md](./MONITORING-DASHBOARD.md) - All monitoring tools
- [GOOGLE-SEARCH-CONSOLE-SETUP.md](./GOOGLE-SEARCH-CONSOLE-SETUP.md) - GSC setup
- [PERFORMANCE-MONITORING.md](./PERFORMANCE-MONITORING.md) - Technical details
- [SENTRY-INTEGRATION.md](./SENTRY-INTEGRATION.md) - Error tracking

### External Resources
- [Web.dev Learn](https://web.dev/learn/) - Core Web Vitals training
- [Google Search Central](https://developers.google.com/search) - SEO best practices
- [Lighthouse Documentation](https://developer.chrome.com/docs/lighthouse/) - Performance optimization
- [Sentry Docs](https://docs.sentry.io/) - Error monitoring

### Team Training Schedule
- **Week 1 (Feb 10):** Monitoring dashboard overview (1 hour)
- **Week 2 (Feb 17):** Google Search Console deep dive (1 hour)
- **Week 3 (Feb 24):** Sentry error triage process (1 hour)
- **Week 4 (Mar 3):** Performance optimization workshop (2 hours)

---

## ✅ Checklist

**Daily Checklist (2 minutes):**
- [ ] Run health-check.sh
- [ ] Check Sentry for critical errors
- [ ] Verify no alerts in Slack/email

**Weekly Checklist (1 hour):**
- [ ] Monday: Speed Insights + Sentry + GSC Coverage
- [ ] Wednesday: GSC Performance + Lighthouse trends + Vercel Analytics
- [ ] Friday: Sentry release comparison + Export metrics + Plan next week

**Monthly Checklist (2 hours):**
- [ ] Generate monthly report
- [ ] Review all metrics vs. targets
- [ ] Present to stakeholders
- [ ] Update roadmap based on findings

---

**Last Updated:** February 7, 2026  
**Owner:** SEO Team Lead  
**Review Frequency:** Monthly
