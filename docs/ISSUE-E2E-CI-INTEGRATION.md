# E2E Tests: Debug & Add to CI Pipeline

**Issue Type:** Bug / Enhancement  
**Priority:** Medium (Launch blocker: No - Unit + Storybook tests cover critical paths)  
**Effort:** 4-6 hours (more complex than initially estimated)  
**Created:** March 10, 2026  
**Updated:** March 11, 2026  
**Status:** IN PROGRESS - Root cause identified  
**Related PR:** feat/ci-automated-testing (Storybook tests only)

## Problem Summary

Playwright E2E tests have significant reliability issues preventing CI integration:

- **Homepage tests:** 12/12 passing when run alone ✅
- **Product tests:** 3/14 passing (navigation/animation issues) ❌
- **Auth tests:** 0/8 passing (page load timeouts) ❌  
- **Cart tests:** 0/15 passing (navigation issues) ❌
- **Language tests:** 0/7 passing (timeout issues) ❌

**Root Cause:** Tests were written for a simpler page structure. Current site has:
- Complex animations and transitions on category cards
- Lazy-loaded components causing element instability
- Deep category nesting (3+ levels in some cases)
- Hidden navigation elements that tests accidentally target
- React Suspense boundaries causing element detachments

## Investigation Results (March 11, 2026)

### ✅ Confirmed Working
- Dev server starts correctly on port 3000
- GraphQL endpoint is reachable
- Homepage tests pass individually: 12/12 ✅
- Test configuration is correct (Playwright + webServer)

### ❌ Issues Found

**1. Element Stability Problems**
- Subcategory card links found but marked as "not stable"
- Elements detach from DOM during click attempts
- Animations cause 60s timeouts before giving up
- Error: `element was detached from the DOM, retrying`

**2. Hidden Navigation Targeting**
- Tests find links in collapsed menus (hidden state)
- Old selector: `page.locator('a[href*="/products/"]')` - matches nav + content
- Fixed selector: `page.locator('main a[href*="/products/"], section a[href*="/products/"]')` - content only
- Partial improvement but animation issues remain

**3. Deep Category Nesting**
- Some categories have 3+ levels (Temperature > Room Temp > Sensors > Products)
- Tests expect max 2 levels
- Added loop with `maxAttempts = 3` to handle deeper nesting

**4. Search Button Not Found**
- Product search tests timeout looking for search button
- Suggests search UI structure changed or requires interaction to reveal

**5. Authentication Page Load Issues**
- All auth tests failing with page load timeouts
- May indicate sign-in page not loading correctly

## Debugging Steps Completed

### ✅ Step 1: Manual Dev Server Test
```bash
cd web && pnpm run dev
# Result: Server starts successfully, responds to requests
```

### ✅ Step 2: Run Homepage Tests
```bash
pnpm run test:e2e tests/e2e/homepage.spec.ts --project=chromium
# Result: 12/12 passing (35.1s)
```

### ✅ Step 3: Run Full Test Suite
```bash
pnpm run test:e2e:chromium
# Result: 22/67 passing, 45 failing
```

### ✅ Step 4: Fix Navigation Selectors
- Updated to target main content only
- Added loop for deep category nesting
- Added 500ms wait for animations
- Used `force: true` click for unstable elements

### ❌ Step 5: Test Fixed Code
```bash
npx playwright test tests/e2e/products.spec.ts:66 --project=chromium
# Result: Still timing out (element instability persists)
```

## Technical Analysis

### Why Tests Fail Now (But Worked Before)

1. **UI Complexity Increased:**
   - Category cards now have hover animations (translate-y, scale, shadow)
   - Transitions: `duration-300`, `ease-in-out`
   - React Suspense boundaries for lazy loading

2. **Test Assumptions Broken:**
   - Tests assume static elements
   - Tests assume max 2-level navigation
   - Tests assume all links immediately clickable

3. **Timing Sensitivity:**
   - 30s default timeout insufficient for animation + navigation chains
   - `waitForLoadState('networkidle')` doesn't account for CSS animations
   - Element queries happen mid-animation

## Proposed Solutions

### Option A: Disable Animations for E2E Tests ⭐ **RECOMMENDED**
**Effort:** 1-2 hours  
**Pros:** Makes tests reliable, fast, and maintainable  
**Cons:** Doesn't test actual user animations  

```typescript
// playwright.config.ts
use: {
  baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
  ...headlessConfig(),
  // Disable CSS animations/transitions
  styleTag: `
    *, *::before, *::after {
      animation-duration: 0s !important;
      transition-duration: 0s !important;
    }
  `,
},
```

### Option B: Rewrite Tests for Current UI
**Effort:** 6-8 hours  
**Pros:** Tests match actual UI behavior  
**Cons:** High effort, may break again with UI changes  

- Add explicit waits for animations: `page.waitForTimeout(1000)`
- Use `page.waitForFunction()` to poll for element stability
- Increase timeouts to 60s for navigation chains
- Add retry logic for all navigation interactions

### Option C: Skip E2E Tests for Phase 1 Launch ⭐ **PRAGMATIC**
**Effort:** 0 hours (already have non-blocking Storybook tests)  
**Pros:** Focus on launch priorities, revisit post-launch  
**Cons:** No automated full-stack testing  

**Coverage without E2E:**
- ✅ Unit tests: 1,202 passing (business logic)
- ✅ Storybook: 23 component stories (visual QA)
- ✅ Accessibility: 186 automated checks (WCAG compliance)
- ⚠️ No automated: Full user journeys, multi-page flows

### Option D: Increase Timeouts + Simplify Tests
**Effort:** 2-3 hours  
**Pros:** Quick fix, some test coverage  
**Cons:** Slower CI, may still be flaky  

- Increase test timeout: 30s → 90s
- Remove deep navigation from tests (test leaf categories only)
- Skip tests that require complex interactions

## Recommendation: Option A + C

**Phase 1 (Pre-Launch - March 11-31):**
- Use Option C: Skip E2E tests for CI (30 days to launch)
- Keep unit tests (1,202 passing) + Storybook (23 stories) + a11y (186 checks)
- Manual QA for critical user journeys

**Phase 2 (Post-Launch - April+):**
- Implement Option A: Disable animations for E2E
- Rewrite key tests (auth, checkout, product search)
- Add back to CI with 60s timeout

**Rationale:**
- 30 days to launch: Focus on features > fixing flaky tests
- Current coverage adequate: Unit + Storybook + a11y = 1,411 automated checks
- E2E value < effort for pre-launch timeline
- Post-launch: More time for test stabilization

## Success Criteria (Post-Launch)

- [ ] E2E tests pass with animations disabled
- [ ] At least 50% of tests passing (34/67)
- [ ] Tests complete in < 5 minutes
- [ ] < 5% flakiness rate (retries succeed)
- [ ] CI pipeline includes E2E with 60s timeout

## Files Modified (March 11, 2026)

- `tests/e2e/products.spec.ts` - Fixed navigation selectors, added deep nesting support, added animation waits

## Next Actions

1. **User Decision Required:** Choose Option A, B, C, or D
2. **If Option A/B:** Continue debugging and implementation
3. **If Option C:** Document decision, update TODO, move to Chromatic setup
4. **If Option D:** Implement timeout increases and test simplification
    # May need additional env vars here

- name: Upload E2E test results
  if: failure()
  uses: actions/upload-artifact@v4
  with:
    name: playwright-report
    path: web/playwright-report/
    retention-days: 7
```

## Timeline

**Target:** March 11-12, 2026 (before next PR)  
**Estimated Time:** 1-2 hours debugging + 30 min CI integration

## Notes

- Tests worked previously (14/14 passing per docs)
- Something environmental changed
- Not blocking current Storybook PR (#XXX)
- Will be addressed in follow-up PR

## Related Files

- `web/playwright.config.ts` - Playwright configuration
- `web/tests/e2e/*.spec.ts` - Test files
- `web/tests/e2e/README.md` - E2E documentation
- `.github/workflows/ci.yml` - CI configuration
