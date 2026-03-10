# E2E Tests: Debug & Add to CI Pipeline

**Issue Type:** Bug / Enhancement  
**Priority:** High  
**Effort:** 1-2 hours  
**Created:** March 10, 2026  
**Related PR:** feat/ci-automated-testing (Storybook tests only)

## Problem

Playwright E2E tests are timing out when run locally, preventing CI integration:

```bash
$ pnpm run test:e2e:chromium
# Tests timeout at 30s
# 67 tests attempted, mostly failing with timeouts
```

**Expected:** 14/14 tests passing (per previous documentation)  
**Actual:** Tests timing out, indicating environmental issues

## Root Cause Investigation Needed

1. **Dev Server Startup**
   - Is `pnpm run dev` starting correctly?
   - Port 3000 availability?
   - Check playwright.config.ts webServer settings

2. **Authentication State**
   - Are auth tokens/cookies configured?
   - WordPress GraphQL endpoint reachable?
   - .env variables loaded properly?

3. **Test Configuration**
   - 30s timeout too short?
   - Base URL correct (`http://localhost:3000`)?
   - Proper wait conditions in tests?

4. **Environment Variables**
   - Missing .env.local variables?
   - GraphQL endpoint configuration?
   - Preview secrets?

## Debugging Steps

### 1. Manual Dev Server Test
```bash
cd web
pnpm run dev
# Verify server starts on port 3000
# Visit http://localhost:3000 manually
```

### 2. Run Single E2E Test
```bash
# Run just homepage test with UI mode
pnpm run test:e2e:ui
# Select: tests/e2e/homepage.spec.ts
# Watch for where it fails
```

### 3. Check Test Output
```bash
# Run with debug mode
pnpm run test:e2e:debug
# Launches browser in headed mode
# See what's actually happening
```

### 4. Check Environment
```bash
# Verify webServer config
cat playwright.config.ts | grep -A 10 webServer

# Check if port is free
lsof -i :3000

# Test GraphQL endpoint
curl $NEXT_PUBLIC_WORDPRESS_GRAPHQL
```

## Success Criteria

- [ ] Identify root cause of timeouts
- [ ] Fix environmental issues
- [ ] Get 14/14 tests passing locally
- [ ] Document any required setup steps
- [ ] Add E2E tests to CI workflow
- [ ] Update ci.yml with working configuration

## Proposed CI Configuration (After Fix)

```yaml
- name: Install Playwright browsers
  run: pnpm exec playwright install --with-deps chromium

- name: Run E2E tests
  run: pnpm run test:e2e:chromium
  env:
    CI: true
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
