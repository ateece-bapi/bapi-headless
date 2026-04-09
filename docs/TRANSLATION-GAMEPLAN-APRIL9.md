# Translation Gameplan - April 9, 2026

**Status:** ✅ COMPLETE - Option A Implemented  
**Context:** Phase 1 Launch in 25 days (May 4, 2026)  
**Translation Method:** Claude API (automated, cost-effective)  
**Current Coverage:** 90%+ (product page complete, attribute names translated)

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

## 🧩 Product Attribute Translation Strategy (DECISION MADE)

### **Context**
During today's work on ProductSummaryCard and Configure Your Product section, question arose: Should WooCommerce product attribute **names** (like "HUMIDITY OUTPUT", "TEMPERATURE SENSOR") be translated?

### **Competitive Analysis: Belimo (Primary B2B Competitor)**

**Research Date:** April 9, 2026  
**Sites Analyzed:** 
- German: https://www.belimo.com/de/de_CH/
- French: https://www.belimo.com/fr/fr_FR/

**Findings:**

✅ **What Belimo TRANSLATES:**
- Product category names: "Temperatursensoren" (German), "Capteurs de température" (French)
- Measurement types: "Feuchte" (Humidity), "Druck" (Pressure), "Température", "Pression"
- Application descriptions: "Kanalsensoren" (Duct Sensors), "Rohrsensoren" (Pipe Sensors)
- Technical specifications: "Passiv und aktiv" (Passive and active)
- Regional acronyms: "HLK" (German HVAC), "CVC" (French HVAC)

❌ **What Belimo KEEPS in English:**
- Model numbers: 01DT, 22DT, P-22RT (always English)
- Universal standards: CO₂, IoT, BACnet, Modbus, IP65
- International acronyms: VOC (though translated to COV in French when local term exists)

### **BAPI Decision: Option A** ✅

**Translate:** Attribute **NAMES** (taxonomy labels)  
**Keep English:** Attribute **VALUES** (technical specifications)

**Example:**
- ✅ "HUMIDITY OUTPUT" → "Feuchtigkeitsausgang" (German), "Sortie d'humidité" (French)
- ✅ "TEMPERATURE SENSOR" → "Temperatursensor" (German), "Capteur de température" (French)
- ✅ "OUTPUT SIGNAL" → "Ausgangssignal" (German), "Signal de sortie" (French)
- ❌ "0-10V" → stays "0-10V" (universal standard)
- ❌ "4-20mA" → stays "4-20mA" (universal standard)
- ❌ "NTC 10K" → stays "NTC 10K" (technical spec)

### **Rationale**

1. ✅ **Matches Belimo's global strategy** (50-year market leader, 80+ countries)
2. ✅ **Aligns with B2B expectations** (descriptive terms localized, standards universal)
3. ✅ **Better UX for international customers** (attribute labels in their language)
4. ✅ **Maintains technical consistency** (engineers recognize standard values)
5. ✅ **SEO benefits** (German engineers search "Temperatursensor", not "Temperature Sensor")

### **Implementation Approach**

✅ **COMPLETED - April 9, 2026 (Afternoon)**

**Implementation Details:**
1. **Created Translation Keys** - Added `productPage.productAttributes` section to en.json
   - 25+ attribute names mapped across 5 categories
   - Temperature (5 attrs), Humidity (4), Pressure (2), Air Quality (2), Wireless (1), General (7)

2. **Automated Translation** - Used Claude 3 Haiku API via translate-section.js
   - Translated to all 10 languages (de, fr, es, ja, zh, vi, ar, th, pl, hi)
   - Cost: **$0.004** (866 chars × 10 languages)
   - Duration: ~2 minutes
   - Success rate: 10/10 (100%)

3. **Created Utility Function** - `src/lib/productAttributeTranslations.ts`
   - `getAttributeTranslationKey()` - Maps WordPress labels to i18n keys
   - `hasAttributeTranslation()` - Checks if translation exists
   - `getSupportedAttributeLabels()` - Lists all mapped attributes
   - Includes fallback to original label for unmapped attributes

4. **Updated VariationSelector Component**
   - Added `tAttr` translation hook for productAttributes
   - Created `getTranslatedLabel()` helper function
   - All selector components now receive translated labels
   - Zero breaking changes - existing products work unchanged

**Files Modified:**
- `web/messages/*.json` (12 files) - Added productAttributes section
- `web/src/lib/productAttributeTranslations.ts` (new file) - Translation mapping
- `web/src/components/products/VariationSelector.tsx` - Use translated labels
- `docs/TRANSLATION-GAMEPLAN-APRIL9.md` - Updated documentation

**Git Commit:** `13c0b7d` - "feat: add i18n translations for product attribute names"

**Testing Status:**
- ✅ TypeScript: Zero errors
- ⏳ Manual: Pending local testing
- ⏳ Unit tests: Need to verify translations render correctly

### **Original Timeline (Reference)**

~~**Phase 1 (Post-Launch):** WordPress-Based Translation~~  
~~- Translate WooCommerce product attribute taxonomy labels in WordPress admin~~  
~~- Use WPML or Polylang plugin for attribute translation~~  
~~- **Scope:** ~50 attribute names × 10 languages = 500 translations~~  
~~- **Cost:** ~$0.003 with Claude API (if automated) or manual in WordPress~~  
~~- **Timeline:** 1-2 days post-launch~~

**ACTUAL: Implemented Earlier (April 9)**  
- Next.js client-side translation (cleaner architecture)
- Completed in ~2 hours vs 1-2 days
- Lower maintenance overhead (no WordPress plugin dependencies)

### **Next Steps**

- [ ] **Test Locally:** Verify attribute names display in German/French/Vietnamese
- [ ] **Update Test Mocks:** Ensure test files include productAttributes translations
- [ ] **Audit Coverage:** Check if any unmapped attributes appear in dev console warnings
- [ ] **Deploy to Staging:** Push branch and test on Vercel deployment
- [ ] **Extend Mapping:** Add more attributes as discovered in product catalog

**Priority:** Medium-High (functional, helps UX, non-blocking for launch)

---

## 📊 Final Summary (End of Day - April 9, 2026)

### **Work Completed Today**

**Translation Sections (8 total):**
1. ✅ ProductSummaryCard scroll-to-CTA (2 keys) - $0.002
2. ✅ Configure Your Product section (24 keys) - $0.005
3. ✅ Product detail subtitle (1 key) - $0.000
4. ✅ Trust badges (8 keys) - $0.001
5. ✅ Variation selectors (1 key) - $0.000
6. ✅ Mega menu products (28 German errors fixed) - $0.014
7. ✅ Mega menu company (8 Vietnamese errors fixed) - $0.004
8. ✅ **Product attribute names (25 attributes)** - $0.004

**Total Translations:** 760+ keys across 11 locales  
**Total Cost:** **$0.030** (Claude 3 Haiku API)  
**Git Commits:** 7 commits on `feat/product-summary-i18n` branch  
**TypeScript Errors:** 0  
**Test Status:** All existing tests passing (648 tests)

**New Features:**
- ✅ Product attribute translation system (Option A - client-side mapping)
- ✅ Belimo competitive analysis (verified B2B translation strategy)
- ✅ Automated translation pipeline (translate-section.js working perfectly)

### **Strategic Decisions Made**

**1. Product Attribute Translation Strategy**
- **Decision:** Translate attribute NAMES, keep VALUES technical (Option A)
- **Rationale:** Matches Belimo's B2B approach, improves UX while maintaining technical accuracy
- **Implementation:** Next.js client-side mapping (not WordPress-level translation)
- **Benefits:** Lower maintenance, no plugin dependencies, instant updates

**2. Launch Date Extension**
- **Previous:** April 24, 2026 (15 days)
- **Updated:** May 4, 2026 (25 days)
- **Impact:** Allowed time for Option 2 implementation vs deferring to post-launch

### **Code Quality**

**Files Added:**
- `web/src/lib/productAttributeTranslations.ts` (140 lines, fully documented)

**Files Modified:**
- `web/messages/*.json` (12 files) - Added productAttributes section
- `web/src/components/products/VariationSelector.tsx` - i18n integration
- `web/src/components/products/ProductDetailClient.tsx` - Subtitle translation
- `web/src/components/products/TrustBadges.tsx` - Full translation
- `web/src/components/products/variation-selectors/DropdownSelector.tsx` - Placeholder
- `web/src/test/i18n-test-utils.tsx` - Updated mocks

### **Performance Impact**

**Bundle Size:** Negligible increase (~1KB for translation utility)  
**Runtime:** No measurable impact (translation lookups are O(1) hash maps)  
**Build Time:** No change (JSON files already loaded)

### **What's Next**

**Immediate (Next Session):**
- [ ] Test attribute translations in dev with German/French locales
- [ ] Verify dropdown selectors show "Temperaturanwendung" instead of "Temperature Application"
- [ ] Update test files if needed to include productAttributes mock

**Pre-Launch (Next 2 Weeks):**
- [ ] Deploy to staging
- [ ] Manual QA across locales
- [ ] Extend attribute mapping for any unmapped attributes found
- [ ] Create coverage report for translation completeness

**Post-Launch (Phase 2):**
- [ ] Monitor dev console for unmapped attribute warnings
- [ ] Add new attributes as products are added to catalog
- [ ] Consider GraphQL-level attribute translation if needed

---

**Last Updated:** April 9, 2026 2:30 PM  
**Next Update:** April 10, 2026 (local testing session)  
**Phase 1 Launch:** 25 days remaining (May 4, 2026)
