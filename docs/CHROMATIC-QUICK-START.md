# Chromatic Quick Start Guide
**Visual Regression Testing Setup - February 20, 2026**

## Overview

This guide walks you through enabling Chromatic visual regression testing for all 122+ Storybook stories. Once complete, every PR will automatically detect visual changes.

---

## Prerequisites

✅ **Already Complete:**
- Chromatic package installed (`@chromatic-com/storybook`)
- GitHub Action workflow enabled (`.github/workflows/chromatic.yml`)
- `pnpm chromatic` script configured
- 122+ Storybook stories ready for testing

⏳ **Needs Setup:**
- Chromatic account
- GitHub secret with project token
- Initial baseline snapshots

---

## Step 1: Create Chromatic Account (5 minutes)

1. Visit **[chromatic.com](https://www.chromatic.com/)**
2. Click **"Sign in with GitHub"**
3. Authorize Chromatic to access your GitHub account
4. Click **"Add project"**
5. Select **`ateece-bapi/bapi-headless`** repository
6. Copy the **Project Token** (starts with `chpt_...`)
   - Save this token securely - you'll need it for the next steps

**Important:** Keep this token private! It allows publishing to your Chromatic project.

---

## Step 2: Add GitHub Secret (2 minutes)

1. Go to GitHub repository: **[Settings → Secrets and variables → Actions](https://github.com/ateece-bapi/bapi-headless/settings/secrets/actions)**
2. Click **"New repository secret"**
3. Configure:
   - **Name:** `CHROMATIC_PROJECT_TOKEN`
   - **Value:** Paste the token from Step 1 (starts with `chpt_...`)
4. Click **"Add secret"**

This allows the GitHub Action to publish builds automatically on every PR.

---

## Step 3: Capture Initial Baseline (10-15 minutes)

Run Chromatic locally to create initial baseline snapshots for all 122+ stories:

```bash
# Navigate to web directory
cd /home/ateece/bapi-headless/web

# Set your Chromatic token (replace with your actual token)
export CHROMATIC_PROJECT_TOKEN=chpt_your_token_here

# Run Chromatic to capture baseline
pnpm chromatic
```

**What happens:**
1. Storybook builds all stories (~30 seconds)
2. Chromatic captures screenshots of all 122+ stories (~5-10 minutes)
3. Uploads snapshots to Chromatic servers (~2 minutes)
4. Publishes build and generates review URL

**Expected Output:**
```
✨ Storybook built in 45s
📦 Build 1 published
🚀 Started build 1
📸 Captured 122 story snapshots
✅ Build 1 passed!

View it in Chromatic: https://www.chromatic.com/build?appId=...&number=1
```

**Troubleshooting:**
- **Error: "Missing project token"** → Check your token is correctly set
- **Build fails** → Check Storybook builds locally: `pnpm run build-storybook`
- **Slow upload** → Expected for first run (122+ stories), subsequent runs are faster

---

## Step 4: Accept Baselines in Chromatic UI (5 minutes)

1. Open the Chromatic URL from the output (Step 3)
2. You'll see all 122+ stories with status "Pending"
3. Click **"✓ Accept all"** button at the top
4. Confirm acceptance

**Why?** This marks these snapshots as the "source of truth" for future visual comparisons.

**Stories you're accepting:**
- Design System: Colors, Typography, Icons
- Components: Cart, Checkout, Products, Navigation
- UI Elements: Button, Toast, Modal, Forms
- Documentation: Accessibility, Chromatic Guide, Interaction Tests

---

## Step 5: Test the Workflow (5 minutes)

Verify the GitHub Action works by creating a test PR:

```bash
# Make a small UI change (example: change button text)
# On your current branch: feat/chromatic-visual-regression

cd /home/ateece/bapi-headless/web

# Make a trivial change to test Chromatic detection
echo "// Chromatic test" >> src/components/ui/Button.tsx

# Commit and push
git add src/components/ui/Button.tsx
git commit -m "test: trigger Chromatic visual regression"
git push --set-upstream origin feat/chromatic-visual-regression
```

**Create PR on GitHub:**
1. Go to: https://github.com/ateece-bapi/bapi-headless/pulls
2. Click **"New pull request"**
3. Base: `main`, Compare: `feat/chromatic-visual-regression`
4. Create pull request

**Watch for Chromatic status check:**
- GitHub Action runs automatically
- Chromatic status appears in ~5-10 minutes
- Click "Details" to review any visual changes

**Revert test change:**
```bash
git revert HEAD
git push
```

---

## Step 6: Document for Team (Optional)

Update your team docs with the Chromatic workflow:

1. How to review visual changes in PRs
2. When to accept vs reject changes
3. How to skip Chromatic for non-UI changes (add `[skip chromatic]` to commit)

---

## What Happens Now?

### On Every Pull Request:
1. ✅ GitHub Action runs automatically
2. 📸 Chromatic captures snapshots of changed stories only
3. 🔍 Compares against approved baselines
4. 💬 Status check appears on PR:
   - **Green check**: No visual changes
   - **Yellow warning**: Visual changes detected (review required)
   - **Red X**: Build failed (rare)

### Your Workflow:
1. Open PR as usual
2. Wait for Chromatic status check
3. If changes detected:
   - Click "Details" to review side-by-side comparison
   - **Accept** if intentional UI change
   - **Reject** if unintended regression
4. Merge when approved

---

## Benefits You Get

### 🚀 Developer Experience
- Build UI components in isolation
- Catch visual regressions automatically
- Test all states without manual clicking

### 👁️ Visual Review
- No more "I didn't realize that changed"
- Side-by-side before/after comparisons
- Every UI change is documented

### ♿ Accessibility
- Combined with `@storybook/addon-a11y`
- Visual + accessibility testing in one place
- WCAG compliance verified

### 🎨 Design System
- Living documentation (122+ examples)
- Consistent component usage
- Easy for designers to review

---

## Quick Reference

### Run Chromatic Locally
```bash
cd web
pnpm chromatic
```

### Test Only Changed Stories
```bash
pnpm chromatic --only-changed
```

### Skip Chromatic for a Commit
```bash
git commit -m "docs: update README [skip chromatic]"
```

### View Your Chromatic Dashboard
https://www.chromatic.com/builds?appId=YOUR_APP_ID

---

## Troubleshooting

### "CHROMATIC_PROJECT_TOKEN not found"
**Solution:** Set the environment variable:
```bash
export CHROMATIC_PROJECT_TOKEN=chpt_your_token_here
```

### GitHub Action fails with "Token not found"
**Solution:** Ensure GitHub secret is named exactly `CHROMATIC_PROJECT_TOKEN`

### Build takes too long
**First run:** Expected (122+ stories)
**Subsequent runs:** Should be faster (~2-5 minutes) due to smart diffing

### Baselines out of date
**Solution:** Run `pnpm chromatic` locally to update baselines

---

## Next Steps

After setup is complete:

1. ✅ **Merge this PR** to enable Chromatic on all future PRs
2. 📚 **Train team** on reviewing visual changes
3. 🎯 **Continue Phase 1 work:**
   - Live Chat Integration
   - Product Navigation (categories, subcategories, mega-menu)
   - Breadcrumb navigation

---

## Support

- **Chromatic Docs:** https://www.chromatic.com/docs
- **Storybook Docs:** https://storybook.js.org/docs
- **Internal Docs:** [CHROMATIC-SETUP.md](./CHROMATIC-SETUP.md)

---

**Estimated Time:** 30-40 minutes total
**Status:** Ready to begin! Follow Step 1 above.

🚀 **Let's catch those visual regressions!**
