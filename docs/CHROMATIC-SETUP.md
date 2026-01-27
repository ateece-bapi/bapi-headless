# Chromatic Visual Regression Testing Setup

## Overview

Chromatic provides automated visual regression testing for Storybook components. It captures screenshots of all stories and detects unintended UI changes in pull requests.

## Setup Steps

### 1. Create Chromatic Account

1. Visit [chromatic.com](https://www.chromatic.com/)
2. Sign in with GitHub
3. Click "Add project" → Select `ateece-bapi/bapi-headless` repository
4. Copy the **Project Token** (starts with `chpt_`)

### 2. Add GitHub Secret

1. Go to GitHub repository: Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Name: `CHROMATIC_PROJECT_TOKEN`
4. Value: Paste the token from Chromatic dashboard
5. Click "Add secret"

### 3. Initial Baseline Capture

Run Chromatic locally to create initial baseline snapshots:

```bash
cd web

# Set your token temporarily (don't commit this!)
export CHROMATIC_PROJECT_TOKEN=chpt_your_token_here

# Run Chromatic to capture baseline
pnpm chromatic

# Or manually with token
pnpm dlx chromatic --project-token=chpt_your_token_here
```

**Expected Output:**
```
✔ Storybook built in 15s
✔ Build 1 published
✔ Started build 1
✔ Build 1 passed!

View it in Chromatic: https://www.chromatic.com/build?appId=...
```

### 4. Accept Baselines in Chromatic UI

1. Open the Chromatic URL from the output
2. Review all 20 stories (ProductHeroFast, Toast, ImageModal, TaglineRotator)
3. Click "✓ Accept" to approve baselines
4. This creates the reference snapshots for future comparisons

## GitHub Action Workflow

The workflow (`.github/workflows/chromatic.yml`) runs automatically on:
- **Pull requests** to `main` branch
- **Pushes** to `main` branch

### Workflow Features

- ✅ **Smart diffing**: Only tests changed stories (`onlyChanged: true`)
- ✅ **Non-blocking**: UI changes don't fail builds (`exitZeroOnChanges: true`)
- ✅ **Fast uploads**: Exits immediately after upload (`exitOnceUploaded: true`)
- ✅ **Full history**: Uses `fetch-depth: 0` for accurate baselines
- ✅ **pnpm caching**: Speeds up dependency installation

### Manual Chromatic Run

```bash
# In web/ directory
pnpm chromatic

# With specific options
pnpm chromatic --only-changed  # Only test changed stories
pnpm chromatic --auto-accept-changes  # Auto-approve (use with caution!)
```

## Pull Request Workflow

### When You Open a PR

1. **GitHub Action runs** automatically
2. **Chromatic captures** screenshots of all stories
3. **Comparison** against baseline snapshots
4. **Status check** appears on PR:
   - ✅ **Green**: No visual changes detected
   - 🔶 **Yellow**: Visual changes detected (requires review)
   - ❌ **Red**: Build failed (rare)

### Reviewing Visual Changes

1. Click "Details" on the Chromatic status check
2. Chromatic shows side-by-side comparisons:
   - **Baseline** (left) vs **Current** (right)
   - Highlights differences in red
3. Options:
   - **✓ Accept**: Approve changes, update baseline
   - **✗ Reject**: Reject changes, fix the code
   - **Comment**: Leave feedback for the author

### Example Scenarios

**Scenario 1: Intentional color change**
```
PR: "feat: update primary button color to match brand"
Chromatic: Shows button color changed blue → yellow
Action: ✓ Accept (intentional change)
```

**Scenario 2: Unintended layout shift**
```
PR: "fix: typo in product description"
Chromatic: Shows entire layout shifted 10px down
Action: ✗ Reject (unintended side effect, needs fix)
```

**Scenario 3: Font rendering difference**
```
PR: "docs: update README"
Chromatic: Shows slight text anti-aliasing difference
Action: ✓ Accept (browser rendering variance, acceptable)
```

## Chromatic Configuration

### Current Settings

- **Build command**: `build-storybook`
- **Working directory**: `web/`
- **Only changed stories**: Enabled (faster builds)
- **Exit on changes**: Disabled (non-blocking)

### Customization

Edit `.storybook/main.ts` to configure Chromatic behavior:

```typescript
const config: StorybookConfig = {
  // ... existing config
  
  // Chromatic-specific options
  staticDirs: ['../public'],  // Include assets
  
  // Control which stories are tested
  stories: [
    '../src/**/*.stories.@(js|jsx|mjs|ts|tsx|mdx)',
    '!../src/**/*.skip.stories.*',  // Exclude .skip files
  ],
};
```

## Troubleshooting

### Issue: "Missing CHROMATIC_PROJECT_TOKEN"

**Cause**: GitHub secret not configured  
**Fix**: Follow "Setup Steps" → "Add GitHub Secret" above

---

### Issue: Chromatic detects too many changes

**Cause**: CSS animations, dates, dynamic content  
**Fix**: Use Chromatic's delay option or freeze time:

```tsx
// In story
export const WithAnimation: Story = {
  parameters: {
    chromatic: {
      delay: 500,  // Wait 500ms before screenshot
      pauseAnimationAtEnd: true,  // Freeze animations
    },
  },
};
```

---

### Issue: Fonts render differently in Chromatic

**Cause**: CI environment uses different font rendering  
**Fix**: Use web fonts (not system fonts) or accept minor differences

---

### Issue: GitHub Action fails with "Module not found"

**Cause**: pnpm lockfile out of sync  
**Fix**: 
```bash
cd web
rm -rf node_modules pnpm-lock.yaml
pnpm install
git add pnpm-lock.yaml
git commit -m "chore: regenerate lockfile"
```

---

### Issue: Want to skip Chromatic for a specific PR

**Solution**: Add `[skip chromatic]` to commit message:
```bash
git commit -m "docs: update README [skip chromatic]"
```

## Chromatic Dashboard

### Key Features

1. **Build History**: View all past builds and changes
2. **Component Library**: Browse all stories with live previews
3. **Baselines**: Manage approved snapshots
4. **Collaborate**: Comment on specific UI changes
5. **Integrations**: Link Jira, Slack, etc.

### Useful Links

- **Dashboard**: https://www.chromatic.com/builds?appId=YOUR_APP_ID
- **Docs**: https://www.chromatic.com/docs
- **Support**: https://www.chromatic.com/docs/support

## Best Practices

### 1. Keep Stories Stable

Avoid dynamic data that changes on every run:

```tsx
// ❌ Bad: Changes every run
export const WithTimestamp: Story = {
  args: {
    timestamp: new Date().toISOString(),
  },
};

// ✅ Good: Static data
export const WithTimestamp: Story = {
  args: {
    timestamp: '2026-01-27T12:00:00Z',
  },
};
```

### 2. Use MSW for API Data

Mock API responses for consistent screenshots:

```tsx
export const LoadedState: Story = {
  parameters: {
    msw: {
      handlers: [
        graphql.query('GetProductBySlug', () => {
          return HttpResponse.json({
            data: { product: mockProduct },
          });
        }),
      ],
    },
  },
};
```

### 3. Test Edge Cases

Create stories for all visual states:

- Empty states
- Loading states
- Error states
- Long text
- Missing images
- Mobile/desktop viewports

### 4. Review Regularly

- Accept baselines promptly to avoid backlog
- Reject accidental changes early
- Comment on ambiguous changes for team discussion

## Phase 4 Completion Checklist

- [x] Chromatic package installed
- [x] GitHub Action workflow created (`.github/workflows/chromatic.yml`)
- [x] `pnpm chromatic` script added to package.json
- [ ] Chromatic account created
- [ ] `CHROMATIC_PROJECT_TOKEN` added to GitHub secrets
- [ ] Initial baseline captured (20 stories)
- [ ] Baselines accepted in Chromatic UI
- [ ] Test PR created to verify workflow
- [ ] Team trained on visual review process

## Next Steps

1. **Create Chromatic account** (if not already done)
2. **Add GitHub secret** with project token
3. **Run initial baseline**: `pnpm chromatic`
4. **Accept all baselines** in Chromatic UI
5. **Test workflow**: Create a test PR with UI change
6. **Document** any team-specific conventions

---

**Questions?** Check [Chromatic docs](https://www.chromatic.com/docs) or reach out to the team.
