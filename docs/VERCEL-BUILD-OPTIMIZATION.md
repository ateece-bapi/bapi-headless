# Vercel Build Optimization - Senior Best Practices

**Created:** March 12, 2026  
**Status:** Production-Ready Configuration  
**Estimated Savings:** 70-80% reduction in build minutes

---

## 📋 Overview

This document outlines the professional Vercel build optimization strategy implemented for BAPI Headless. The configuration automatically skips unnecessary builds to reduce costs while maintaining deployment reliability.

---

## 🎯 What's Been Implemented

### 1. Smart Build Detection Script
**File:** `scripts/should-build.sh`

Automatically determines if a build is necessary based on changed files:

**Skips builds for:**
- Documentation changes (`docs/`, `*.md`)
- Test file updates (`*.test.ts`, `*.spec.ts`)
- CI/CD config changes (`.github/`)
- Storybook stories (`*.stories.tsx`)
- Development tooling updates (`.vscode/`, `.editorconfig`)
- Commits with `[skip ci]` tag

**Requires builds for:**
- Source code changes (`web/src/`)
- Configuration changes (`web/next.config.ts`, `web/package.json`)
- Public asset changes (`web/public/`)
- Dependency updates that affect runtime

### 2. Vercel Ignore File
**File:** `.vercelignore`

Pre-filters files before the build script runs. Prevents Vercel from even considering these files as build triggers:
- Documentation directories
- Test files and coverage reports
- CI/CD workflows
- Development environment files
- Storybook static builds (deployed to Chromatic)

### 3. Vercel Configuration
**File:** `vercel.json`

Professional Vercel project configuration:
- Monorepo setup (builds from `web/` directory)
- PNPM with frozen lockfile (consistent dependencies)
- Custom ignore command integration
- Auto job cancellation (stops old builds when new commits arrive)
- Locale rewrites for i18n support
- Production-only deployment from `main` branch

---

## 🚀 Setup Instructions

### Step 1: Make Build Script Executable
```bash
chmod +x scripts/should-build.sh
```

### Step 2: Configure Vercel Dashboard

**Navigate to:** [Vercel Dashboard](https://vercel.com/dashboard) → Your Project → Settings

#### A. Git Configuration
1. **Settings → Git → Ignored Build Step**
2. Enable: ✅ "Override the default Ignored Build Step"
3. Command:
   ```bash
   bash scripts/should-build.sh
   ```
4. Save

#### B. Build & Development Settings
1. **Settings → General → Build & Development Settings**
2. Verify these settings match `vercel.json`:
   - **Framework Preset:** Next.js
   - **Build Command:** `cd web && pnpm run build`
   - **Output Directory:** `web/.next`
   - **Install Command:** `pnpm install --frozen-lockfile`

#### C. Deployment Configuration
1. **Settings → Git → Production Branch**
2. Set to: `main`
3. **Settings → Git → Preview Branches**
4. Recommendation: Disable for `docs/*` and `chore/*` branches

#### D. Usage & Billing Alerts
1. **Settings → Usage**
2. Set spending limit: `$50/month` (adjust as needed)
3. Enable email alerts:
   - 50% of limit
   - 75% of limit
   - 90% of limit

---

## 📊 Cost Optimization Strategies

### Strategy 1: Commit Message Tags (Immediate)
Use `[skip ci]` in commit messages for doc-only changes:
```bash
git commit -m "docs: Update README [skip ci]"
```

### Strategy 2: Branch Naming Convention
Follow this pattern for automatic handling:
```
feat/*      → Builds (new features)
fix/*       → Builds (bug fixes)
docs/*      → Auto-skip via should-build.sh
chore/*     → Auto-skip (dependency updates, tooling)
test/*      → Auto-skip (test improvements)
storybook/* → Builds only if src/ changes
```

### Strategy 3: Local Preview Before Push
Test locally before pushing to avoid failed builds:
```bash
# Test production build
cd web && pnpm run build

# Run tests
pnpm test

# Only push when confident
git push
```

### Strategy 4: Batch Commits
Group related changes into single commits to reduce build count:
```bash
# Instead of 5 commits = 5 builds
git commit -m "docs: Update section 1 [skip ci]"
git commit -m "docs: Update section 2 [skip ci]"
git commit -m "docs: Update section 3 [skip ci]"
git commit -m "docs: Update section 4 [skip ci]"
git commit -m "docs: Final review [skip ci]"
git push  # Only 1 build (or skipped entirely)

# Do this:
# Make all changes, then:
git add docs/
git commit -m "docs: Complete documentation update [skip ci]"
git push  # 0 builds
```

### Strategy 5: PR Review Process
Professional workflow for feature branches:
```bash
# 1. Create feature branch
git checkout -b feat/new-feature

# 2. Work with skip tags during development
git commit -m "wip: initial structure [skip ci]"
git commit -m "wip: add component [skip ci]"
git commit -m "wip: add tests [skip ci]"

# 3. Test locally before final commit
cd web && pnpm run build && pnpm test

# 4. Final commit WITHOUT skip tag
git commit -m "feat: Complete new feature with tests"
git push  # Only 1 build for the entire feature
```

---

## 🔍 Testing the Configuration

### Test 1: Documentation Change (Should Skip)
```bash
echo "test" >> docs/TODO.md
git add docs/TODO.md
git commit -m "docs: Test build skip"
git push
```

**Expected:** Vercel shows "Build Skipped" with script output

### Test 2: Source Code Change (Should Build)
```bash
# Make any change in web/src/
echo "// test" >> web/src/app/page.tsx
git add web/src/app/page.tsx
git commit -m "feat: Test build trigger"
git push
```

**Expected:** Vercel runs full build and deployment

### Test 3: Explicit Skip Tag (Should Skip)
```bash
# Any change with [skip ci]
git commit -m "chore: Update dependencies [skip ci]"
git push
```

**Expected:** Vercel skips build regardless of changed files

---

## 📈 Monitoring & Metrics

### Weekly Review Checklist
□ Check Vercel dashboard for build count
□ Review "Skipped Builds" log
□ Verify no false skips (production code not deployed)
□ Check billing usage vs. budget
□ Adjust ignore patterns if needed

### Monthly Cost Analysis
1. **Vercel Dashboard → Usage**
2. Compare metrics:
   - Total builds this month
   - Builds skipped
   - Build minutes used
   - Estimated cost
   - Savings from optimization

### Expected Metrics (after optimization)
- **Before:** ~100 builds/week = ~400 builds/month
- **After:** ~30 builds/week = ~120 builds/month
- **Reduction:** 70% fewer builds
- **Cost Savings:** Significant reduction in build minutes

---

## 🛠️ Troubleshooting

### Issue: Build Skipped When It Shouldn't
**Cause:** Ignore pattern too aggressive  
**Fix:** Update `scripts/should-build.sh` IGNORE_PATTERNS array

### Issue: Build Running When It Should Skip
**Cause:** Script not configured in Vercel Dashboard  
**Fix:** Verify "Ignored Build Step" command is set correctly

### Issue: Script Permission Denied
**Cause:** `should-build.sh` not executable  
**Fix:** `chmod +x scripts/should-build.sh` and commit

### Issue: High Build Costs Continue
**Cause:** Preview deployments enabled for all branches  
**Fix:** Disable preview deployments for non-critical branches

---

## 🔐 Security Considerations

### Build Script Safety
- Script runs in Vercel's build environment (no access to secrets during ignore step)
- Uses git commands only (no external API calls)
- Exit codes control build: 0 = skip, 1 = build
- No destructive operations

### Safe File Patterns
The ignore patterns are conservative:
- ✅ Skips obvious non-production files (docs, tests)
- ❌ Never skips `web/src/` or production code
- ❌ Never skips `web/package.json` or dependencies
- ❌ Never skips `web/next.config.ts` or configuration

---

## 📚 Additional Resources

### Vercel Documentation
- [Ignored Build Step](https://vercel.com/docs/concepts/projects/overview#ignored-build-step)
- [Deployment Configuration](https://vercel.com/docs/concepts/deployments/configure-a-build)
- [Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

### GitHub Actions Integration
Consider moving some testing to GitHub Actions (free tier):
- Unit tests (Vitest)
- E2E tests (Playwright)
- Linting (ESLint)
- Type checking (TypeScript)

Only use Vercel for actual deployments.

---

## 💡 Pro Tips

1. **Combine with GitHub Actions:** Run tests in GitHub Actions (free), only deploy to Vercel when tests pass
2. **Use Vercel CLI locally:** `vercel dev` for production environment testing
3. **Monitor build times:** Optimize slow builds to reduce cost per build
4. **Cache dependencies:** Vercel automatically caches `node_modules` between builds
5. **Staged rollouts:** Use Vercel's deployment system for gradual rollouts

---

## ✅ Checklist: Implementation Complete

- [x] Created `scripts/should-build.sh` with smart detection logic
- [x] Created `.vercelignore` with comprehensive ignore patterns
- [x] Created `vercel.json` with professional configuration
- [x] Made build script executable
- [x] Documented setup process
- [ ] **TODO:** Configure Vercel Dashboard (Settings → Git → Ignored Build Step)
- [ ] **TODO:** Set spending limits and alerts
- [ ] **TODO:** Test with documentation commit
- [ ] **TODO:** Verify build skip works correctly

---

## 🎯 Expected Outcome

After full implementation:
- **Cost Reduction:** 70-80% fewer builds
- **Faster Feedback:** No waiting for unnecessary builds
- **Better DX:** Focus on code, not build management
- **Professional Setup:** Industry-standard Vercel configuration

**Estimated Monthly Savings:** Significant reduction in Vercel bill while maintaining full production reliability.

---

**Questions or issues?** Review the Troubleshooting section or Vercel's official documentation.
