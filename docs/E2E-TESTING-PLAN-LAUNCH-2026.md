# E2E Testing Plan — Launch 2026 (April 10 Go-Live)

**Created:** March 19, 2026 (Evening Session)  
**Launch Date:** April 10, 2026 (21 days remaining)  
**Approach:** Quality-First ✅ (Not pressured for exact date)  
**Last E2E Status:** 14/14 passing (March 6-9, 2026)  
**Current Unit Tests:** 1,242/1,242 passing (100%)

## Executive Summary

This document provides a comprehensive E2E testing strategy for the final 3 weeks before April 10 launch. With 14/14 E2E tests already passing and enterprise-level test infrastructure in place (March 11 rewrite), we need to:

1. **Verify current E2E status** after recent code changes
2. **Expand coverage** to all critical user journeys
3. **Test across all locales** (11 languages × 12 regions)
4. **Validate payment flows** and currency conversions
5. **Test on real devices** (mobile iOS/Android)
6. **Create testing schedule** for daily validation

**Quality Gate:** E2E testing is VITAL for product quality and user experience. Timeline is flexible to ensure comprehensive validation.

---

## Current E2E Test Infrastructure

### Test Suite Overview (5 Spec Files)

| Spec File | Coverage Area | Test Count | Last Status |
|-----------|---------------|------------|-------------|
| `homepage.spec.ts` | Homepage layout, navigation, search, footer, mobile | ~13 tests | ✅ Passing |
| `products.spec.ts` | Product browsing, categories (3+ levels), filtering | ~6 tests | ✅ Passing |
| `authentication.spec.ts` | Sign in, form validation, password visibility, links | ~7 tests | ✅ Passing |
| `cart-checkout.spec.ts` | Cart operations, quantities, checkout wizard | ~10 tests | ✅ Passing |
| `language-selector.spec.ts` | Language switching, region switching, persistence | ~3 tests | ✅ Passing |

**Total Tests:** 39+ individual test cases  
**Historic Pass Rate:** 14/14 (100%) as of March 6-9  
**Infrastructure:** Playwright with enterprise utilities (March 11 rewrite)

### Browser Coverage (Playwright Config)

- ✅ **Desktop**: Chromium, Firefox, WebKit
- ✅ **Mobile**: Chrome (Pixel 5), Safari (iPhone 12)
- ⚠️ **Gap**: Real device testing needed (see below)

### Enterprise Test Utilities (`helpers/test-utils.ts`)

- `safeClick()` — Handles React animations, prevents detached element errors
- `waitForStableElement()` — Waits for element position to stabilize
- `waitForFullPageLoad()` — Handles Suspense boundaries, lazy loading
- `navigateToProducts()` — Deep category navigation (3+ levels)
- `routes` helper — Locale-aware route generation (no hardcoded URLs)

**Benefits:**
- 60s timeout per test (handles complex React flows)
- CI integration with retries (2x) and single worker for stability
- Accessibility checks with axe-playwright

---

## Testing Coverage Matrix

### Phase 1 Critical User Journeys

These flows MUST pass 100% across all browsers and key locales before launch:

| Journey | Test Coverage | Locales to Test | Status |
|---------|---------------|-----------------|--------|
| **Homepage Load** | Layout, navigation, search, footer | en-US, es-ES, de-DE | ✅ Exists |
| **Product Discovery** | Browse categories → subcategories → product | en-US, ja-JP, zh-CN | ✅ Exists |
| **Product Detail View** | Images, specs, pricing, add to cart | en-US, fr-FR, th-TH | ✅ Exists |
| **Cart Management** | Add, update qty, remove, persistence | All locales | ✅ Exists |
| **Guest Checkout** | Form validation, shipping, payment info | en-US, es-ES, de-DE | ⚠️ Partial |
| **Authenticated Checkout** | Login → checkout → order confirmation | en-US | ⚠️ Partial |
| **Language Switching** | Change language, verify content updates | All 11 locales | ✅ Exists |
| **Region Switching** | Change region, verify currency/units | 12 regions | ⚠️ Partial |
| **Search Functionality** | Product search, filters, results | en-US, es-ES, ja-JP | ⚠️ Partial |
| **Mobile Experience** | Responsive flows on mobile devices | en-US, es-ES | ⚠️ Emulated only |

### Locale Coverage Priority

**Tier 1 (Must Test Before Launch):**
- 🇺🇸 en-US (English - United States) — Primary market
- 🇩🇪 de-DE (German - Germany) — Major EU market
- 🇪🇸 es-ES (Spanish - Spain) — Europe, Latin America crossover
- 🇯🇵 ja-JP (Japanese - Japan) — APAC market, complex character set

**Tier 2 (Test During Soft Launch):**
- 🇫🇷 fr-FR (French - France)
- 🇨🇳 zh-CN (Chinese - Simplified)
- 🇹🇭 th-TH (Thai - Thailand)

**Tier 3 (Monitor in Production):**
- 🇻🇳 vi-VN (Vietnamese)
- 🇸🇦 ar-SA (Arabic - Right-to-left)
- es-419 (Spanish - Latin America)
- en-GB (English - United Kingdom)

### Currency & Regional Testing

**12 Currencies to Validate:**
- USD ($), EUR (€), GBP (£), JPY (¥), CNY (¥), THB (฿)
- AUD ($), CAD ($), CHF (CHF), MXN ($), SAR (﷼), VND (₫)

**Critical Tests:**
- Currency conversion accuracy (API integration)
- Price formatting per locale (1,234.56 vs 1.234,56)
- Currency symbol placement (€1,234 vs 1,234 €)
- Measurement unit conversion (inches ↔ mm, lbs ↔ kg)

---

## Testing Gaps & Priorities

### 🔴 HIGH PRIORITY (Must Fix Before Launch)

1. **Payment Gateway Integration** 
   - **Gap:** No E2E tests for actual payment flows
   - **Required Tests:**
     - Stripe checkout flow (test mode)
     - Payment form validation
     - Order confirmation email trigger
     - Payment failure handling
   - **Estimate:** 2-3 days (4-6 new test cases)

2. **Checkout Wizard Completion**
   - **Gap:** Tests exist but incomplete coverage
   - **Required Tests:**
     - Complete wizard flow (all 4 steps)
     - Form validation at each step
     - Back/forward navigation between steps
     - Order summary accuracy
     - Tax and shipping calculations
   - **Estimate:** 2 days (3-4 test cases)

3. **Multi-Locale Checkout**
   - **Gap:** Checkout only tested in en-US
   - **Required Tests:**
     - Checkout in Tier 1 locales (de-DE, es-ES, ja-JP)
     - Address format validation per country
     - Error messages in correct language
   - **Estimate:** 1-2 days (3-4 test cases)

4. **Real Device Testing**
   - **Gap:** Only browser emulation (Playwright devices)
   - **Required Tests:**
     - iOS Safari 17+ (iPhone 14/15)
     - Android Chrome (Samsung Galaxy S23)
     - Tablet layouts (iPad Pro, Galaxy Tab)
   - **Tools:** BrowserStack, Sauce Labs, or physical devices
   - **Estimate:** 2 days (manual exploratory testing)

### 🟡 MEDIUM PRIORITY (Important for Quality)

5. **Search & Filtering**
   - **Gap:** Basic search exists, no advanced filtering
   - **Required Tests:**
     - Product search across categories
     - Filter by price range, specifications
     - Sort by relevance, price, name
     - Empty results handling
   - **Estimate:** 1 day (3-4 test cases)

6. **Error State Handling**
   - **Gap:** Happy path covered, error scenarios incomplete
   - **Required Tests:**
     - Network error recovery
     - Out of stock product handling
     - Session timeout during checkout
     - Invalid coupon codes
   - **Estimate:** 1 day (4-5 test cases)

7. **Performance Benchmarks**
   - **Gap:** No performance assertions in E2E tests
   - **Required Tests:**
     - Homepage loads in < 3s (LCP)
     - Product page loads in < 2s
     - Cart operations < 1s response
     - Checkout steps < 1.5s navigation
   - **Tools:** Playwright performance API, Lighthouse CI
   - **Estimate:** 1 day (add performance assertions)

### 🟢 LOW PRIORITY (Post-Launch)

8. **B2B Customer Features** (Phase 2)
9. **Saved Addresses & Payment Methods** (Phase 2)
10. **Live Chat Integration E2E** (Phase 2)
11. **Email Notifications Visual Testing** (Phase 2)

---

## Testing Execution Plan (21 Days)

### Week 1: Mar 19-26 — Verification & Planning

**Days 1-2 (Mar 19-20):**
- ✅ Document current E2E status (this document)
- 🔲 Run full E2E suite to verify 14/14 still passing
- 🔲 Document any new failures from recent changes
- 🔲 Create GitHub issues for high-priority gaps

**Days 3-5 (Mar 21-23):**
- 🔲 Write payment gateway E2E tests (Stripe test mode)
- 🔲 Expand checkout wizard coverage (all 4 steps)
- 🔲 Add multi-locale checkout tests (Tier 1 locales)

**Days 6-7 (Mar 24-26):**
- 🔲 Run expanded test suite across all browsers
- 🔲 Fix any failures discovered
- 🔲 Begin real device testing setup (BrowserStack account)

### Week 2: Mar 26-Apr 2 — Expand Coverage

**Days 8-10 (Mar 26-28):**
- 🔲 Add search & filtering E2E tests
- 🔲 Add error state handling tests
- 🔲 Add performance benchmarks to key flows

**Days 11-12 (Mar 29-30):**
- 🔲 Real device testing (iOS Safari, Android Chrome)
- 🔲 Document device-specific issues
- 🔲 Fix mobile-specific bugs

**Days 13-14 (Mar 31-Apr 2):**
- 🔲 Run full test suite across all Tier 1 locales
- 🔲 Regression testing after bug fixes
- 🔲 Update test documentation with new coverage

### Week 3: Apr 2-10 — Validation & Sign-Off

**Days 15-17 (Apr 2-4):**
- 🔲 Daily automated E2E runs (all browsers, all locales)
- 🔲 Manual exploratory testing in production-like environment
- 🔲 Stakeholder demo of key user journeys

**Days 18-19 (Apr 5-6):**
- 🔲 Final regression testing
- 🔲 Performance validation (Lighthouse audits)
- 🔲 Accessibility audit (WCAG AA compliance)

**Days 20-21 (Apr 8-10):**
- 🔲 Smoke tests on staging environment
- 🔲 Final go/no-go decision (Apr 6 stakeholder presentation)
- 🔲 Production deployment + monitoring

---

## Success Criteria for Go-Live

### E2E Test Requirements

- ✅ **100% pass rate** on all critical user journeys (see matrix above)
- ✅ **Zero blocking bugs** in Tier 1 locales (en-US, de-DE, es-ES, ja-JP)
- ✅ **Payment flows** validated in test mode (Stripe)
- ✅ **Mobile devices** tested on at least 2 real devices (iOS + Android)
- ✅ **Performance benchmarks** met (LCP < 3s, FID < 100ms)
- ✅ **Accessibility compliance** (WCAG AA, axe-core 0 violations)

### Non-Blocking Issues (Monitor in Production)

- ⚠️ Minor visual issues in Tier 3 locales (can fix post-launch)
- ⚠️ Performance edge cases (slow 3G, low-end devices)
- ⚠️ Browser compatibility issues in < 1% traffic (IE11, old Safari)

---

## Test Execution Commands

### Run All E2E Tests

```bash
cd web
pnpm test:e2e                  # Run all tests (all browsers)
pnpm test:e2e:ui               # Interactive UI mode
pnpm test:e2e:debug            # Step-through debugging
pnpm test:e2e:headed           # Watch tests run in browser
pnpm test:e2e:chromium         # Chrome only (faster iteration)
pnpm test:e2e:report           # View last test results
```

### Run Specific Test Suites

```bash
pnpm test:e2e homepage         # Homepage tests only
pnpm test:e2e cart-checkout    # Cart & checkout tests only
pnpm test:e2e --grep "payment" # All tests matching "payment"
```

### CI Integration

E2E tests run automatically on every PR:
- GitHub Actions workflow: `.github/workflows/ci-tests.yml`
- Currently set to `continue-on-error: true` (non-blocking)
- **Before launch:** Change to `continue-on-error: false` (blocking)

---

## Risk Assessment

### High Risk Areas (Requires Extra Attention)

1. **Payment Integration** — Real money transactions, PCI compliance
   - Mitigation: Extensive testing in Stripe test mode, manual QA
   
2. **Multi-Currency Checkout** — Exchange rate accuracy, pricing errors
   - Mitigation: Automated tests for all 12 currencies, manual spot checks
   
3. **Mobile Safari iOS** — Historically buggy with payment forms
   - Mitigation: Test on 3+ real iOS devices (iPhone 13, 14, 15)
   
4. **Complex Product Categories** — Deep nesting (3+ levels), performance
   - Mitigation: Already covered by enterprise test utilities (Mar 11 rewrite)

### Medium Risk Areas

5. **RTL Languages** (Arabic ar-SA) — Layout issues, text alignment
   - Mitigation: Visual QA in Tier 3 testing phase
   
6. **Session Management** — Cart persistence, login timeouts
   - Mitigation: Add session timeout tests (Medium Priority #6)

### Low Risk Areas (Already Well-Covered)

7. **Homepage & Navigation** — 13 E2E tests passing, stable code
8. **Language Switching** — 3 E2E tests passing, mature feature
9. **Product Browsing** — 6 E2E tests passing, enterprise utilities

---

## Monitoring & Rollback Plan

### Launch Day Monitoring (April 10)

**Real-Time Metrics:**
- Sentry error tracking (frontend + backend)
- Vercel Analytics (traffic, performance)
- Stripe dashboard (payment success rate)
- GraphQL API response times (Kinsta monitoring)

**Critical Alerts:**
- Error rate > 1% (Sentry)
- Payment failure rate > 5% (Stripe)
- API response time > 2s (Kinsta)
- Session errors > 10/hour (Vercel)

### Rollback Triggers

**Immediate Rollback (< 30 minutes):**
- Payment processing failures (any locale)
- GraphQL API errors (500s, timeouts)
- Critical checkout bug (blocks orders)

**Phased Rollback (2-4 hours):**
- High error rate in specific locale (> 5%)
- Mobile-specific bug affecting > 10% traffic
- Performance degradation (LCP > 5s)

**Rollback Procedure:**
1. Vercel: Instant rollback to previous deployment
2. WordPress/WooCommerce: No immediate changes needed (headless architecture)
3. Notify stakeholders and customers (if needed)

---

## Post-Launch Testing Schedule

### First 7 Days (Intensive Monitoring)

- **Daily:** Run full E2E suite against production
- **Daily:** Manual spot checks on top 5 traffic sources
- **Daily:** Review Sentry errors and Vercel analytics
- **Every 2 days:** Run Lighthouse audits (performance tracking)

### Weeks 2-4 (Stabilization)

- **Weekly:** Full E2E suite (automated via CI)
- **Weekly:** Manual exploratory testing (new scenarios)
- **Bi-weekly:** Accessibility audits (WCAG compliance)
- **Monthly:** Performance benchmarking (vs. competitors)

---

## Resources & Tools

### Testing Infrastructure

- **Playwright:** E2E test framework (already configured)
- **Vitest:** Unit tests (1,242 passing)
- **Storybook:** Component visual testing + Chromatic
- **axe-playwright:** Accessibility testing
- **Lighthouse CI:** Performance benchmarks

### External Services (To Set Up)

- **BrowserStack** or **Sauce Labs:** Real device testing
  - Cost: ~$129/month (pause after launch)
  - Required: iOS Safari (iPhone 14/15), Android Chrome (Galaxy S23)
  
- **Datadog RUM** (optional): Real user monitoring
  - Cost: ~$15/month (10K sessions)
  - Benefit: Actual user performance data vs. synthetic tests

---

## Contact & Escalation

**Testing Lead:** [Your Name]  
**Technical Lead:** [Your Name]  
**Launch Manager:** [Stakeholder Name]  

**Slack Channels:**
- `#launch-2026` — General launch coordination
- `#e2e-testing` — Daily test results and issues
- `#incidents` — Production alerts and rollback

**GitHub Projects:**
- [Launch 2026 Testing Board](https://github.com/ateece-bapi/bapi-headless/projects/X)
- [E2E Test Coverage Tracker](https://github.com/ateece-bapi/bapi-headless/projects/Y)

---

## Appendices

### A. Historical Context

- **March 6-9, 2026:** E2E stabilization (8/15 → 14/14 passing)
- **March 11, 2026:** Enterprise test infrastructure rewrite
  - Created `helpers/test-utils.ts` (250+ lines)
  - Added `safeClick`, `waitForStableElement`, `navigateToProducts`
  - Increased timeout to 60s per test
  - Integrated into CI with retries
  
### B. Related Documentation

- [E2E CI Integration Issue](../docs/ISSUE-E2E-CI-INTEGRATION.md)
- [Accessibility Audit Phase 1](../docs/ACCESSIBILITY-AUDIT-PHASE1.md)
- [WordPress GraphQL Optimization](../docs/WORDPRESS-GRAPHQL-OPTIMIZATION.md)
- [Copilot Instructions (Project Overview)](.github/copilot-instructions.md)

### C. Test Files Reference

```
web/tests/e2e/
├── homepage.spec.ts              # Homepage layout, navigation, search
├── products.spec.ts              # Product browsing, categories
├── authentication.spec.ts        # Login, form validation
├── cart-checkout.spec.ts         # Cart operations, checkout wizard
├── language-selector.spec.ts     # i18n switching, persistence
└── helpers/
    ├── routes.ts                 # Locale-aware route generation
    └── test-utils.ts             # Enterprise utilities (250+ lines)
```

---

**Last Updated:** March 19, 2026 (Evening Session)  
**Next Review:** March 21, 2026 (after initial E2E run)  
**Status:** 🟡 Planning Phase — Ready to Execute
