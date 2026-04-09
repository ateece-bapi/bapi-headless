# Translation Gameplan - April 9, 2026

**Status:** ⏰ START HERE TOMORROW MORNING  
**Context:** Phase 1 Launch in 26 days (May 4, 2026)  
**Translation Method:** Claude API (automated, cost-effective)  
**Current Coverage:** 85-90% (excellent base, gaps identified)

---

## 🎉 What We Accomplished Today (April 8, 2026)

### Performance Work (COMPLETE ✅)
- ✅ Phase 2.1 deployed (Desktop 92%, Mobile 93%)
- ✅ Speed Index improvements validated (600ms faster mobile)
- ✅ TBT trade-off accepted by stakeholder

### Translation Discovery
- ✅ Comprehensive translation infrastructure audit completed
- ✅ Confirmed 11 locales working in production
- ✅ Identified 26 components already using translations
- ✅ Found 4 new hardcoded strings in today's ProductSummaryCard work
- ✅ Validated translation file structure (12 JSON files, 1,500+ keys)

---

## 🎯 Tomorrow's Mission: Translate Today's New Features

### **PRIORITY 1: ProductSummaryCard Translation (HIGH URGENCY)**

**What:** 4 hardcoded strings from Variable Product UX work need translation across 11 locales

**Hardcoded Strings Found:**
```typescript
// web/src/components/products/ProductPage/ProductSummaryCard.tsx
Line 205: "Configure Product"
Line 207: "Select your specifications below to see pricing and part number"
Line 214: aria-label="Scroll to product configurator section"
Line 216: "Start Configuring"
```

**Estimated Time:** 2-3 hours (implementation + testing)

---

## 📋 Step-by-Step Action Plan for Tomorrow

### **Step 1: Add Translation Keys to English Base** (30 minutes)

**File:** `web/messages/en.json`

**Keys to Add:**
```json
"productPage": {
  "summary": {
    "configureProductTitle": "Configure Product",
    "selectSpecificationsDescription": "Select your specifications below to see pricing and part number",
    "scrollToCta": "Start Configuring",
    "scrollToCtaAriaLabel": "Scroll to product configurator section"
  }
}
```

**Action:**
1. Open `web/messages/en.json`
2. Locate existing `"productPage"` section (around line 700-1500)
3. Find or create `"summary"` subsection
4. Add the 4 new keys above
5. Save and commit: `git commit -m "feat: add translation keys for ProductSummaryCard scroll-to-configurator CTA"`

---

### **Step 2: Translate to All 11 Locales Using Claude Script** (45 minutes)

**Option A: Use Existing Homepage Script as Template** (if section script doesn't exist yet)

```bash
cd web

# Check if the universal script exists
ls scripts/translate-section.js

# If it doesn't exist, use the homepage script as reference
ls scripts/sync-home-translations.js
```

**If Universal Script Exists:**
```bash
cd web
node scripts/translate-section.js productPage.summary
# Or if it translates entire sections:
node scripts/translate-section.js productPage
```

**If Universal Script Doesn't Exist (Manual Approach):**
```bash
# Adapt the homepage script to translate productPage.summary section
# Copy and modify scripts/sync-home-translations.js
cp scripts/sync-home-translations.js scripts/translate-product-summary.js

# Then edit translate-product-summary.js:
# 1. Change section from "home" to "productPage.summary"
# 2. Run the script
node scripts/translate-product-summary.js
```

**Expected Output:**
```
🚀 Translating productPage.summary to 10 languages...
✅ German (de.json) - Updated with 4 keys
✅ French (fr.json) - Updated with 4 keys
✅ Spanish (es.json) - Updated with 4 keys
✅ Japanese (ja.json) - Updated with 4 keys
✅ Chinese (zh.json) - Updated with 4 keys
✅ Vietnamese (vi.json) - Updated with 4 keys
✅ Arabic (ar.json) - Updated with 4 keys
✅ Thai (th.json) - Updated with 4 keys
✅ Polish (pl.json) - Updated with 4 keys
✅ Hindi (hi.json) - Updated with 4 keys

Translation complete! Estimated cost: $0.02
```

**Languages to Translate:** de, fr, es, ja, zh, vi, ar, th, pl, hi (10 non-English locales)

---

### **Step 3: Update ProductSummaryCard Component** (30 minutes)

**File:** `web/src/components/products/ProductPage/ProductSummaryCard.tsx`

**Changes Needed:**

1. **Add import at top of file:**
```typescript
'use client';

import React from 'react';
import { useTranslations } from 'next-intl'; // ADD THIS
import { BriefcaseIcon, HeartIcon } from '@/lib/icons';
// ... rest of imports
```

2. **Add translation hook in component:**
```typescript
export default function ProductSummaryCard({
  product,
  variation,
  // ... other props
}: ProductSummaryCardProps) {
  const t = useTranslations('productPage.summary'); // ADD THIS
  const { region, currency, preferredUnits } = useRegion();
  // ... rest of component
```

3. **Replace hardcoded strings:**
```typescript
// BEFORE (Lines 205-216):
<p className="mb-3 font-medium text-neutral-700">Configure Product</p>
<p className="mb-4 text-sm text-neutral-700">
  Select your specifications below to see pricing and part number
</p>

<button
  onClick={scrollToConfigurator}
  className="group relative inline-flex items-center gap-2 rounded-lg bg-bapi-accent-gradient px-6 py-3 font-semibold text-neutral-900 shadow-lg transition-all duration-200 hover:bg-bapi-accent-gradient-hover hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2"
  aria-label="Scroll to product configurator section"
>
  <span>Start Configuring</span>
  {/* ... SVG icon */}
</button>

// AFTER:
<p className="mb-3 font-medium text-neutral-700">
  {t('configureProductTitle')}
</p>
<p className="mb-4 text-sm text-neutral-700">
  {t('selectSpecificationsDescription')}
</p>

<button
  onClick={scrollToConfigurator}
  className="group relative inline-flex items-center gap-2 rounded-lg bg-bapi-accent-gradient px-6 py-3 font-semibold text-neutral-900 shadow-lg transition-all duration-200 hover:bg-bapi-accent-gradient-hover hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2"
  aria-label={t('scrollToCtaAriaLabel')}
>
  <span>{t('scrollToCta')}</span>
  {/* ... SVG icon */}
</button>
```

**Git Commit:**
```bash
git add web/src/components/products/ProductPage/ProductSummaryCard.tsx
git commit -m "feat: add i18n support to ProductSummaryCard scroll-to-configurator CTA"
```

---

### **Step 4: Test in Development** (30 minutes)

**Local Testing:**
```bash
cd web
pnpm dev
```

**Test URLs:**
- English: http://localhost:3000/en/products/[any-variable-product]
- German: http://localhost:3000/de/products/[any-variable-product]
- Japanese: http://localhost:3000/ja/products/[any-variable-product]
- Vietnamese: http://localhost:3000/vi/products/[any-variable-product]

**Checklist:**
- [ ] "Start Configuring" button shows translated text in German
- [ ] Aria-label is translated (check with browser DevTools)
- [ ] "Configure Product" heading is translated
- [ ] Description text is translated
- [ ] No console errors about missing translation keys
- [ ] Button still scrolls correctly (functionality preserved)
- [ ] Mobile responsive layout still works

---

### **Step 5: Run Test Suite** (15 minutes)

```bash
cd web
pnpm test
```

**Expected:** All 648 tests should still pass (no regressions from translation changes)

If tests fail, check:
- Mock data in test files may need translation keys
- Test assertions may be checking for English strings

**Fix Pattern:**
```typescript
// BEFORE (test file):
expect(screen.getByText('Start Configuring')).toBeInTheDocument();

// AFTER:
expect(screen.getByRole('button', { name: /start configuring/i })).toBeInTheDocument();
// OR use translation mock:
expect(screen.getByText(t('productPage.summary.scrollToCta'))).toBeInTheDocument();
```

---

### **Step 6: Deploy to Staging & Manual QA** (20 minutes)

**Push to Remote:**
```bash
git push origin main
# Or if you're on a feature branch:
git push origin feature/product-summary-i18n
```

**Vercel Auto-Deploy:**
- Staging URL: `https://bapi-headless-[branch].vercel.app`
- Wait for deployment (usually 2-3 minutes)

**QA Checklist (Test on Staging):**
- [ ] Switch language to German → CTA shows "Konfiguration starten" (or similar)
- [ ] Switch language to Japanese → CTA shows Japanese characters
- [ ] Switch language to Vietnamese → CTA shows Vietnamese text
- [ ] Arabic (RTL test) → Button layout mirrors correctly
- [ ] Performance: No slowdown in page load time
- [ ] Lighthouse score: Still 90+ (run quick test)

---

## ⏱️ Time Budget Summary

| Task | Estimated Time | Notes |
|------|----------------|-------|
| Step 1: Add English keys | 30 min | Straightforward JSON edit |
| Step 2: Claude translation | 45 min | Script execution + verification |
| Step 3: Update component | 30 min | Import hook + replace 4 strings |
| Step 4: Local testing | 30 min | Test 3-4 languages manually |
| Step 5: Test suite | 15 min | Automated test run |
| Step 6: Staging QA | 20 min | Deploy + manual verification |
| **Total** | **2 hours 50 min** | Buffer: 3 hours realistic |

**Start Time:** 8:00 AM  
**Expected Completion:** 11:00 AM  
**Slack Time:** 10 minutes for coffee/breaks ☕

---

## 🚀 Stretch Goals (If Time Permits - Afternoon)

### **Option A: Build Universal Translation Script** (2-3 hours)
Based on `TRANSLATION-SCALING-STRATEGY.md`, create:
- `web/scripts/translate-section.js` - Translate any JSON section
- Usage: `node scripts/translate-section.js productPage`

**Why:** Automates future translation work (cart, checkout, etc.)

**Deliverable:** Reusable script for all remaining translation tasks

---

### **Option B: Quick Audit for Other Hardcoded Strings** (1-2 hours)
Search for hardcoded strings in critical components:
```bash
cd web
# Find potential hardcoded strings (English words in JSX)
grep -r "className.*>Add to" src/components/ --include="*.tsx"
grep -r "className.*>Configure" src/components/ --include="*.tsx"
grep -r "className.*>View" src/components/ --include="*.tsx"
```

**Focus Areas:**
1. ProductHero.tsx (product page header)
2. ProductTabs.tsx (tabs: Overview, Specs, Documents)
3. AddToCartButton.tsx (cart button text)
4. CartSummary.tsx (subtotal, tax, shipping labels)

**Deliverable:** List of remaining hardcoded strings for future sprints

---

### **Option C: Translation Coverage Report** (30 minutes)
Create a script to check coverage:
```bash
node scripts/check-translation-coverage.js

# Output:
# 📊 Translation Coverage Report
# Base: English (en.json) - 310 keys
# 
# DE: ████████████████░░░░ 82% (254/310)
# FR: ███████████████░░░░░ 78% (242/310)
# ES: ███████████████░░░░░ 79% (245/310)
# JA: ████████████████░░░░ 83% (257/310)
# ZH: ██████████████░░░░░░ 72% (223/310)
# VI: ██████████████████░░ 92% (285/310) ⭐
# AR: ████████████████░░░░ 83% (257/310)
# TH: ████████████████████ 100% (310/310) ✅
# PL: ████████████████░░░░ 85% (263/310)
# HI: ████████████████░░░░ 81% (251/310)
```

**Benefit:** Visual understanding of translation progress across locales

---

## 📝 Notes for Future You

### **Translation Philosophy (Your Approach)**
- ✅ Use Claude API for cost-effective automation ($0.02 per section vs $15,000 professional)
- ✅ Focus on UI strings first (buttons, navigation, forms)
- ✅ Product descriptions can stay English for technical accuracy
- ✅ Keep technical terms in English (NIST, BACnet, WAM™, SKU, etc.)
- ✅ Prioritize Phase 1 critical pages (products, cart, checkout)

### **What's Already Translated (Don't Duplicate Work)**
- ✅ Homepage (100% complete across 11 languages)
- ✅ Navigation & Mega Menu (Products, Support, Company)
- ✅ Footer (all sections, certifications, contact)
- ✅ Sign-In page & 2FA system
- ✅ Account Dashboard (orders, favorites, quotes, settings)
- ✅ Cart page (existing cart UI)
- ✅ Checkout wizard (shipping, payment, review steps)
- ✅ Region/Language/Currency selectors

### **What Remains (Post-April 9 Work)**
Refer to `TRANSLATION-SCALING-STRATEGY.md` for full roadmap:
- 🔶 Product page tabs (Overview, Specs, Documents, Videos)
- 🔶 Category pages (filters, sorting, breadcrumbs)
- 🔶 Search results page
- 🔶 Order confirmation page
- 🔶 Application notes section (Phase 2)
- 🔶 Solutions pages (Phase 2)
- 🔶 Error messages (scattered across components)

### **Claude Translation Script Reference**
Existing script location: `web/scripts/sync-home-translations.js`

**How it works:**
1. Reads `en.json` for English source strings
2. Calls Claude API with translation prompt per locale
3. Preserves JSON structure and formatting
4. Writes translated strings to each locale file (de.json, fr.json, etc.)
5. Cost: ~$0.002 per section per language

**To adapt for new sections:**
- Change section path from `"home"` to `"productPage.summary"`
- Run script with `node scripts/[your-script].js`

---

## 🎯 Success Criteria for Tomorrow

By end of day April 9, you should have:
- ✅ 4 new translation keys added to all 11 locale files
- ✅ ProductSummaryCard component using `useTranslations()` hook
- ✅ All tests passing (648 tests, zero regressions)
- ✅ Staging deployment verified in 3+ languages
- ✅ Git commits pushed to remote
- ✅ (Stretch) Universal translation script built OR hardcoded string audit complete

---

## 🔥 If You Hit Blockers

### **Blocker 1: Claude API Quota/Cost Limits**
- **Cost:** ~$0.02 for 4 keys × 10 languages = **negligible**
- **Solution:** This should not be an issue, but if it is, translate manually for now

### **Blocker 2: Translation Script Doesn't Exist**
- **Solution:** Manually copy `en.json` keys to each locale file, then use ChatGPT/Claude web interface:
  ```
  Prompt: "Translate these 4 JSON keys to German, preserving JSON format:
  {
    "scrollToCta": "Start Configuring",
    ...
  }"
  ```
- **Time Impact:** +30 minutes (manual translation for 10 languages)

### **Blocker 3: Tests Fail After Translation Changes**
- **Root Cause:** Test assertions checking for English strings
- **Solution:** Update test to use `screen.getByRole()` or mock translation function
- **Time Impact:** +15-30 minutes per failing test

### **Blocker 4: Vercel Deployment Fails**
- **Check:** Build logs on Vercel dashboard
- **Common Issue:** TypeScript errors from missing translation keys
- **Solution:** Ensure all locale files have the same keys, run `pnpm build` locally first

---

## 💬 Communication Plan

### **Stakeholder Update (End of Day April 9)**
"✅ **Translation Update:** Today's new ProductSummaryCard features (scroll-to-configurator CTA) are now fully translated across all 11 languages. Automated Claude translation system working well - cost: $0.02 for 4 keys × 10 languages. Next: Continue translating remaining product page elements per TRANSLATION-SCALING-STRATEGY.md roadmap."

---

## 📚 Reference Documents

1. **Translation Strategy:** `docs/TRANSLATION-SCALING-STRATEGY.md` (comprehensive roadmap)
2. **Daily Log:** `docs/DAILY-LOG.md` (today's work already documented)
3. **Translation Files:** `web/messages/*.json` (11 locale files)
4. **Copilot Instructions:** `.github/copilot-instructions.md` (project conventions)

---

## ⏰ Tomorrow Morning Checklist

Before you start coding:
- [ ] Read this entire document (5 minutes)
- [ ] Open VSCode in `bapi-headless/web/` directory
- [ ] Start terminal: `pnpm dev` (background process)
- [ ] Open files:
  - `web/messages/en.json`
  - `web/src/components/products/ProductPage/ProductSummaryCard.tsx`
  - `web/scripts/sync-home-translations.js` (for reference)
- [ ] Check git status: `git status` (ensure clean working tree)
- [ ] Create feature branch (optional): `git checkout -b feat/product-summary-i18n`

**LET'S GO! 🚀**

You've got this. 3 hours to ship 11-language support for today's new features. Simple, focused, automated.

---

**Last Updated:** April 8, 2026 11:47 PM  
**Next Update:** April 9, 2026 11:00 AM (post-completion)  
**Phase 1 Launch:** 26 days remaining (May 4, 2026)
