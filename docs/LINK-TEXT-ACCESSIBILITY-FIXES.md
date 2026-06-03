# Link Text Accessibility Fixes - Phase 2

**Created:** June 3, 2026  
**Branch:** `feat/homepage-performance-optimization-phase2`  
**Priority:** Medium (SEO + Accessibility)  
**Context:** Wireless page SEO dropped from 100 → 92 due to generic "Learn more" link text

---

## Issue Identified

**Lighthouse Audit:** `link-text` - Links do not have descriptive text  
**Score:** 0/1 (failing)  
**Impact:** -8 SEO points (100 → 92)  

**Problem:**  
Generic link text like "Learn more" fails Lighthouse accessibility checks even with `aria-label` attributes, because:
1. Screen readers may skip aria-label in certain contexts
2. Visual users don't get context from "Learn more" alone
3. SEO crawlers prefer descriptive visible text

---

## Current Generic Links Found

### Wireless Page (`/web/src/app/[locale]/wireless/page.tsx`)

**Lines 361-367:**
```tsx
<Link
  href={`/product/${sensor.slug}`}
  className="..."
  aria-label={`${tCommon('learnMore')} ${sensor.name}`}  // Has aria-label but still fails
>
  {tCommon('learnMore')}  // ISSUE: Generic "Learn more"
</Link>
```

**Used 6 times** - One for each wireless sensor product card

**Current Text:** "Learn more"  
**Recommended:** "View {ProductName}" or "Explore {ProductName}"

---

## Solution Strategy

### Option 1: Make Link Text Contextual (Recommended ✅)

**Change visible text to include product name:**

```tsx
<Link
  href={`/product/${sensor.slug}`}
  className="..."
>
  {t('common.viewProduct', { product: sensor.name })}
  {/* OR */}
  {t('common.explore')} {sensor.name}
</Link>
```

**Examples:**
- "Learn more" → "View Outside Air Sensor"
- "Learn more" → "Explore BAPI-Stat Quantum Wireless"

**Pros:**
- ✅ Passes Lighthouse audit
- ✅ Better UX (users know what they're clicking)
- ✅ Better SEO (descriptive link text)
- ✅ Accessible without aria-label

**Cons:**
- ⚠️ Longer button text (may affect layout)
- ⚠️ Need to update all 11 language translations

### Option 2: Use Icon + Text Pattern

```tsx
<Link href={`/product/${sensor.slug}`} className="...">
  <span>{sensor.name}</span>
  <ArrowRightIcon className="h-4 w-4" />
</Link>
```

**Pros:**
- ✅ Passes audit
- ✅ Clean design
- ✅ Context from product name above

**Cons:**
- ⚠️ Loses "call to action" feel
- ⚠️ May reduce click-through rate

### Option 3: Hidden Text for Screen Readers (Not Recommended ❌)

```tsx
<Link href={`/product/${sensor.slug}`} className="...">
  {tCommon('learnMore')}
  <span className="sr-only">about {sensor.name}</span>
</Link>
```

**Pros:**
- ✅ Minimal visual change

**Cons:**
- ❌ Still fails Lighthouse (checks visible text)
- ❌ Doesn't help sighted users
- ❌ Doesn't help SEO

---

## Recommended Implementation

### 1. Update Translation Keys

**Add new key to `web/messages/en.json`:**
```json
{
  "common": {
    "learnMore": "Learn more",
    "viewProduct": "View {product}",
    "exploreProduct": "Explore {product}",
    "viewDetails": "View details"
  }
}
```

**Replicate across all 11 languages** (en, de, fr, es, ja, zh, vi, ar, pl, th, hi)

### 2. Update Wireless Page

**File:** `web/src/app/[locale]/wireless/page.tsx`

**BEFORE (Line 361-367):**
```tsx
<Link
  href={`/product/${sensor.slug}`}
  className="..."
  aria-label={`${tCommon('learnMore')} ${sensor.name}`}
>
  {tCommon('learnMore')}
</Link>
```

**AFTER:**
```tsx
<Link
  href={`/product/${sensor.slug}`}
  className="..."
>
  {tCommon('viewProduct', { product: sensor.name })}
</Link>
```

**Impact:** 6 product cards updated with descriptive link text

### 3. Audit Homepage for Similar Issues

**Potential problem areas:**
1. Product category cards - "View Products" (generic)
2. News posts - "Read more" (if exists)
3. Why BAPI section - any generic CTAs

**Scan for patterns:**
- "Learn more"
- "Read more"
- "Click here"
- "Here"
- "More"
- Generic "View Products" without category context

### 4. Verify Fix with Lighthouse

**Test wireless page:**
```bash
npx lighthouse https://bapi-headless.vercel.app/en/wireless --only-categories=seo
```

**Expected result:**
- link-text audit: 1/1 (passing)
- SEO score: 100/100 (restored from 92)

---

## Translation Updates Required

**Languages to update:** 11 total

| Language | Code | New Keys Needed |
|----------|------|-----------------|
| English | en | ✅ viewProduct, exploreProduct |
| German | de | ✅ "Produkt ansehen", "Erkunden {product}" |
| French | fr | ✅ "Voir {product}", "Explorer {product}" |
| Spanish | es | ✅ "Ver {product}", "Explorar {product}" |
| Japanese | ja | ✅ "{product}を見る", "{product}を探索" |
| Chinese | zh | ✅ "查看{product}", "探索{product}" |
| Vietnamese | vi | ✅ "Xem {product}", "Khám phá {product}" |
| Arabic | ar | ✅ "عرض {product}", "استكشف {product}" |
| Polish | pl | ✅ "Zobacz {product}", "Odkryj {product}" |
| Thai | th | ✅ "ดู{product}", "สำรวจ{product}" |
| Hindi | hi | ✅ "{product} देखें", "{product} का अन्वेषण करें" |

**Estimated time:** 30-45 minutes (with AI translation assistance)

---

## Files to Modify

1. **Translation Files (11 files):**
   - `web/messages/en.json`
   - `web/messages/de.json`
   - `web/messages/fr.json`
   - `web/messages/es.json`
   - `web/messages/ja.json`
   - `web/messages/zh.json`
   - `web/messages/vi.json`
   - `web/messages/ar.json`
   - `web/messages/pl.json`
   - `web/messages/th.json`
   - `web/messages/hi.json`

2. **Code Files:**
   - `web/src/app/[locale]/wireless/page.tsx` (6 instances)
   - `web/src/app/[locale]/(public)/page.tsx` (audit for generic links)

3. **Test Files:**
   - Any tests referencing "Learn more" text

---

## Expected Results

**Before:**
- Wireless SEO: 92/100 (link-text: 0/1)
- Homepage SEO: 100/100 (currently passing)

**After:**
- Wireless SEO: **100/100** (link-text: 1/1) ✅
- Homepage SEO: **100/100** (maintained) ✅
- Better UX with contextual link text ✅
- Improved accessibility ✅

---

## Implementation Checklist

- [ ] Add `viewProduct` key to all 11 translation files
- [ ] Update wireless page - replace 6 "Learn more" links
- [ ] Audit homepage for generic link text
- [ ] Update homepage if issues found
- [ ] Run Lighthouse audit on wireless page
- [ ] Verify SEO score returns to 100/100
- [ ] Test in all languages to ensure translations work
- [ ] Build and deploy to preview
- [ ] Validate on production

---

**Status:** 🟡 Ready for implementation (pending user approval)  
**Branch:** `feat/homepage-performance-optimization-phase2`  
**Next:** Review with user, then implement fixes
