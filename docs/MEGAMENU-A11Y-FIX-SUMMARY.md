# MegaMenu Accessibility Fix Summary
**Date:** April 2, 2026  
**Issue:** Color contrast violations in MegaMenu Storybook stories  
**WCAG Standard:** 2.1 Level AA (4.5:1 contrast for normal text)

---

## Problem Identified

### BrandCompliance Story Violations ✅ FIXED

**Root Cause:** Accent (yellow) text on accent-50 (light yellow) background

#### Failing Color Combinations
```
text-accent-700 (#cca035) on bg-accent-50 (#fffbeb): 2.34:1 ❌
text-accent-800 (#b38c2e) on bg-accent-50 (#fffbeb): 3.02:1 ❌
text-accent-900 (#997827) on bg-accent-50 (#fffbeb): 3.99:1 ❌
```

**Required:** 4.5:1 minimum for WCAG AA  
**Actual:** 2.34:1 to 3.99:1 (all fail)

---

## Solution Applied

### Replace Failing Colors with accent-950

**New Contrast Ratios:**
```
text-accent-950 (#4d3c14) on bg-accent-50 (#fffbeb): 10.27:1 ✅
```

### Files Modified

#### `/web/src/stories/MegaMenu.stories.tsx` - BrandCompliance Story

**Changes Made:**
1. **Line ~546:** Category Order Alert heading
   - Changed: `text-accent-900` → `text-accent-950`
   - Contrast improvement: 3.99:1 → 10.27:1 ✅

2. **Line ~549-552:** Alert body text and ordered list
   - Changed: `text-accent-800` → `text-accent-950`  
   - Contrast improvement: 3.02:1 → 10.27:1 ✅

3. **Line ~561:** Small italic note
   - Changed: `text-accent-700` → `text-accent-950`
   - Contrast improvement: 2.34:1 → 10.27:1 ✅

**Visual Impact:** Text appears darker within the yellow alert box (from medium-dark yellow to very dark brown-yellow), improving readability for users with low vision or color vision deficiency.

---

## Overview Story Investigation

### Test Result
- Test flagged 1 critical violation in Overview story
- Automated test runner did not output specific violation details

### Investigation Findings

**Colors Checked:**
- `text-neutral-700` on white: 6.98:1 ✅ PASS
- `text-neutral-700` on primary-50: 5.66:1 ✅ PASS
- `text-neutral-700` on primary-100: 4.94:1 ✅ PASS (marginal)
- `text-neutral-700` on neutral-50: 6.17:1 ✅ PASS

**No violations found in static analysis:**
- No `text-neutral-600` usage (which would fail at 4.33:1)
- All text-neutral-700 usage on white or light backgrounds passes WCAG AA
- All small text (text-xs = 12px) meets 4.5:1 requirement

### Hypothesis
The Overview story violation may have been related to the BrandCompliance violations or a false positive. After fixing the accent color issues in BrandCompliance, Overview may also pass.

**Recommendation:** Re-run automated tests after committing fixes to verify both stories pass.

---

## Contrast Requirements Reference

### WCAG 2.1 Level AA Standards
- **Normal text** (<18px or <14px bold): 4.5:1 minimum
- **Large text** (≥18px or ≥14px bold): 3:1 minimum

### Text Sizes in MegaMenu Stories
- `text-xs` = 12px → Requires 4.5:1 (normal text)
- `text-sm` = 14px → Requires 4.5:1 (normal text, not bold)
- `text-base` = 16px → Requires 4.5:1 (normal text)
- `text-lg` = 18px → Requires 3:1 (large text threshold)

---

## Color Palette: Before vs After

### Accent Colors on accent-50 Background

| Color Token | Hex | Old Contrast | Status | New Contrast | Status |
|------------|-----|--------------|--------|--------------|--------|
| accent-700 | #cca035 | 2.34:1 | ❌ Fail | 10.27:1 (950) | ✅ Pass |
| accent-800 | #b38c2e | 3.02:1 | ❌ Fail | 10.27:1 (950) | ✅ Pass |
| accent-900 | #997827 | 3.99:1 | ❌ Fail | 10.27:1 (950) | ✅ Pass |
| **accent-950** | **#4d3c14** | **N/A** | **N/A** | **10.27:1** | **✅ Pass** |

### Alternative Compliant Options Considered

| Color Token | Hex | Contrast | Notes |
|------------|-----|----------|-------|
| accent-950 | #4d3c14 | 10.27:1 ✅ | **Selected** - Maintains accent (yellow) family |
| neutral-800 | #434440 | 9.46:1 ✅ | Alternative - Gray, less thematic |
| neutral-900 | #282820 | 14.32:1 ✅ | Alternative - Very dark gray, high contrast |

**Decision Rationale:** accent-950 was chosen to maintain thematic consistency with the yellow alert box while achieving WCAG AAA compliance (7:1+).

---

## Testing Methodology

### Automated Testing
- **Tool:** Storybook Test Runner with axe-playwright
- **Ruleset:** WCAG 2.1 Level A & AA
- **Disabled Rules:** Document-level rules (landmark-one-main, page-has-heading-one, region)
- **Stories Tested:** Overview, BrandCompliance, CategoryColumn (3 of 3 MegaMenu stories)

### Manual Calculation
```javascript
// Luminance calculation (WCAG formula)
function getLuminance(hex) {
  const rgb = parseInt(hex.slice(1), 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = (rgb >> 0) & 0xff;
  
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

// Contrast ratio calculation
function getContrast(fg, bg) {
  const l1 = getLuminance(fg);
  const l2 = getLuminance(bg);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}
```

---

## Verification Checklist

Before closing this issue, verify:

- [x] BrandCompliance story code updated with accent-950
- [ ] Storybook rebuilt with fixes (`pnpm run build-storybook`)
- [ ] Automated tests re-run (`pnpm run test:storybook`)
- [ ] BrandCompliance story passes WCAG AA
- [ ] Overview story passes WCAG AA (or violation identified)
- [ ] Visual inspection: Alert box text remains readable
- [ ] Git commit with descriptive message

---

## Related Documentation

- **Main Audit Report:** [docs/PRODUCT-CARDS-A11Y-AUDIT-RESULTS.md](./PRODUCT-CARDS-A11Y-AUDIT-RESULTS.md)
- **Color System:** [web/COLOR_SYSTEM.md](../web/COLOR_SYSTEM.md)
- **Error Handling:** [web/ERROR_HANDLING.md](../web/ERROR_HANDLING.md)

---

## Next Steps

### Immediate
1. Commit MegaMenu fixes
2. Re-run automated accessibility tests
3. If tests still fail, enable verbose logging in test-runner.ts to capture violation details

### Phase C Remaining Tasks
- Manual keyboard navigation testing
- Screen reader testing (NVDA, JAWS, VoiceOver)
- Touch target size verification (44x44px minimum)
- Focus indicator visibility check
- Motion/animation accessibility (prefers-reduced-motion)

### Future Considerations
- **Global Color Token Review:** Consider updating accent-700/800/900 in tailwind.config.js to meet WCAG AA on light backgrounds by default
- **Design System Documentation:** Add contrast ratio table to Storybook docs for all color combinations
- **Automated CI Check:** Add axe-core tests to GitHub Actions pre-merge checks

---

**Status:** ✅ BrandCompliance fixed, ⏳ Overview under investigation  
**Next Action:** Re-run automated tests to confirm fixes
