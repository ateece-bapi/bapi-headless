# E2E Test Validation Plan - March 24, 2026

## 🎯 Purpose
Validate fixes made to E2E test suite after debugging session:
1. **Accessibility fix** (f94fe0a) - heading-order violation in navigation
2. **Products test fix** (b4a9bbc) - simplified test setup

## 📊 Expected Improvements

### Before Fixes
- **Worker Count**: 6 workers → dev server overload → 75% failure rate
- **Accessibility**: heading-order violation → authentication tests blocked
- **Products Tests**: 73% failure rate (4/15 passing, 27%)
  - Complex 4-step navigation in beforeEach
  - 40+ lines of fragile setup code

### After Fixes
- **Worker Count**: 2 workers (committed yesterday c81c53e)
- **Accessibility**: h3/h4 → div elements ✅
- **Products Tests**: Direct navigation (11 lines, expected 100% pass rate)

## 🧪 Validation Commands

### Option 1: Full Suite (910 tests, ~10-15 minutes)
```bash
cd /home/ateece/bapi-headless/web
pnpm test:e2e --reporter=html,list
```

**Note**: Full suite may have terminal output issues. Use HTML report instead:
```bash
# After tests complete:
pnpm exec playwright show-report
```

### Option 2: Targeted Validation (Recommended)
Test only the files we fixed:

```bash
cd /home/ateece/bapi-headless/web

# 1. Homepage (baseline - should be 100%)
pnpm test:e2e tests/e2e/homepage.spec.ts --project=chromium

# 2. Authentication (accessibility fix validation)
pnpm test:e2e tests/e2e/authentication.spec.ts --project=chromium

# 3. Products (navigation fix validation)
pnpm test:e2e tests/e2e/products.spec.ts --project=chromium
```

### Option 3: HTML Report Review
If tests were run previously, check existing results:

```bash
cd /home/ateece/bapi-headless/web
pnpm exec playwright show-report
```

## 📋 Success Criteria

### Homepage (Baseline)
- ✅ **Expected**: 12/12 passing (100%)
- **Status**: Validated with 2 workers (yesterday)

### Authentication (Accessibility Fix)
- ✅ **Before**: Blocked by heading-order violation
- ✅ **After**: Should pass with no a11y violations
- **Key Test**: "should pass accessibility checks"

### Products (Navigation Fix)
- ⚠️ **Before**: 4/15 passing (27%)
- ✅ **After**: Expected 15/15 passing (100%)
- **Key Improvement**: Product Detail Page section (12 tests)

## 🔍 What to Look For

### 1. Products Test Results
Look for these specific tests in "Product Detail Page" section:
- should display product information
- should display breadcrumb navigation
- should show product SKU or part number  
- should add product to cart
- should display product images gallery
- should show product description
- should display related products
- should be responsive on mobile
- should pass accessibility checks
- should handle quantity selection
- should display product specifications

**Expected**: All 12 passing (was 4/12 before)

### 2. Authentication Test Results
Look for accessibility test:
- "should pass accessibility checks"

**Expected**: Passing (was failing on heading-order before)

### 3. Performance Improvements
- **Test execution time**: Should be ~60s faster for products (eliminated navigation)
- **Test reliability**: Fewer timeout failures
- **Setup complexity**: 11 lines vs 40+ lines in beforeEach

## 📊 Results Tracking

### Manual Test Run Results
Record results here after validation:

**Date**: _____________  
**Time**: _____________  
**Branch**: debug/e2e-test-failures

#### Homepage Tests
- Total: _____ / 12
- Pass Rate: _____%

#### Authentication Tests  
- Total: _____ / 14
- Pass Rate: _____%
- Accessibility test: PASS / FAIL

#### Products Tests
- Total: _____ / 18 (4 landing + 12 detail + 2 search)
- Pass Rate: _____%
- Product Detail section: _____ / 12

## 🚀 Next Steps After Validation

### If All Tests Pass ✅
1. Create PR from debug/e2e-test-failures → main
2. Request team review
3. Merge after approval
4. Continue with cart/checkout E2E validation

### If Some Tests Still Fail ⚠️
1. Capture failure details:
   - Which tests?
   - Error messages?
   - Common patterns?
2. Analyze root cause
3. Apply additional fixes
4. Re-validate

### If Major Failures ❌
1. Review DAILY-LOG.md for context
2. Check git log for recent changes
3. Consider reverting to last known good state
4. Debug systematically (like we did today)

## 📝 Notes

- **Timeline**: 17 days to Phase 1 launch (April 10, 2026)
- **Priority**: Cart/checkout tests are critical for launch
- **Methodology**: Data-driven, systematic debugging
- **Commits**: 3 commits pushed (f94fe0a, b4a9bbc, 62a7c9e)

## 🔗 Related Documentation

- [DAILY-LOG.md](./DAILY-LOG.md) - March 24 entry details full debugging session
- [playwright.config.ts](../web/playwright.config.ts) - Worker configuration
- [products.spec.ts](../web/tests/e2e/products.spec.ts) - Simplified beforeEach
- [Navigation.a11y.test.tsx](../web/src/components/layout/Header/Navigation.a11y.test.tsx) - Unit test updates
