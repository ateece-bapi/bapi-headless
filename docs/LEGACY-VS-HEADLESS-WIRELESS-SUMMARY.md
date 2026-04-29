# Legacy vs Headless: Wireless Navigation Comparison

**Date:** April 29, 2026  
**Issue:** Terry QA #4 - Wireless Subcategory Routing Bug  
**Branch:** `investigate/wireless-wam-comparison`

---

## 🎯 EXECUTIVE SUMMARY

### Key Discovery: Our Headless Site is BETTER Than Legacy!

**Legacy Site:** Simple "Wireless" link in top nav → users must browse category page to find subcategories

**Headless Site:** Mega-menu dropdown with 4 subcategory links → **faster navigation IF we fix the generic URLs**

### The Bug is REAL, But It's Also an OPPORTUNITY

✅ **What Works:**
- Category page at `/products/bluetooth-wireless` shows all 7 subcategories perfectly
- Breadcrumb navigation is correct
- WordPress data is clean and well-structured

❌ **What's Broken:**
- 3 out of 4 mega-menu links point to generic parent page instead of specific subcategories

🎯 **What This Means:**
- We have a mega-menu that legacy site DOESN'T HAVE
- But it's not fully functional
- Fixing it makes us objectively better than the legacy site

---

## 📊 DETAILED COMPARISON

### Navigation Structure

| Element | Legacy Site | Headless Site | Winner |
|---------|------------|---------------|--------|
| **Top Nav - Wireless** | Simple link | Mega-menu dropdown | Headless |
| **Dropdown Links** | N/A (no dropdown) | 4 links (3 broken) | Headless (when fixed) |
| **Category Page** | 7 subcategory cards | 7 subcategory cards | Tie |
| **Filtering** | Sidebar with facets | No sidebar filters | Legacy |

### WordPress Category Structure (Source of Truth)

```
310 Wireless Sensors (parent, 0 direct products)
├── 674 Bluetooth Low Energy (24 products)
│   ├── 678 Gateway (1 product)
│   ├── 677 Receivers (1 product)
│   ├── 679 Output Modules (6 products)
│   ├── 675 Room (5 products)
│   ├── 676 Non-Room (7 products)
│   ├── 680 Food Probe (2 products)
│   └── 682 Accessories (5 products)
└── 348 WAM - Wireless Asset Monitoring (0 products)
    ├── 349 WAM Local (0 products)
    └── 409 WAM Remote (0 products)
```

### Current Mega-Menu Implementation (BROKEN)

```typescript
// web/src/components/layout/Header/config.ts (lines ~150-175)
{
  title: t('products.wireless.title'),
  slug: 'bluetooth-wireless',
  icon: '/images/icons/Wireless_Icon.webp',
  links: [
    {
      label: t('products.wireless.bluetoothSensors'),
      href: '/products/bluetooth-wireless',  // ❌ GENERIC (should be specific)
    },
    {
      label: t('products.wireless.gatewaysReceivers'),
      href: '/products/bluetooth-wireless',  // ❌ GENERIC (should be specific)
    },
    {
      label: t('products.wireless.outputModules'),
      href: '/products/bluetooth-wireless',  // ❌ GENERIC (should be specific)
    },
    {
      label: t('products.wireless.wirelessAccessories'),
      href: '/products/bluetooth-wireless/wireless-accessories',  // ✅ SPECIFIC (correct!)
    },
  ],
}
```

---

## 🔧 RECOMMENDED FIX

### Option 1: Direct Mapping (Simplest - 15 minutes)

Map each label to its corresponding WordPress subcategory:

```typescript
links: [
  {
    label: t('products.wireless.bluetoothSensors'),  // Keep label (or change to "Room Sensors")
    href: '/products/bluetooth-wireless/wireless-room',  // ✅ Most popular (5 products)
  },
  {
    label: t('products.wireless.gatewaysReceivers'),  // Keep label
    href: '/products/bluetooth-wireless/wireless-gateway',  // ✅ Gateway subcategory (1 product)
  },
  {
    label: t('products.wireless.outputModules'),  // Keep label
    href: '/products/bluetooth-wireless/wireless-output-modules-bluetooth-wireless',  // ✅ Output Modules (6 products)
  },
  {
    label: t('products.wireless.wirelessAccessories'),  // Already correct
    href: '/products/bluetooth-wireless/wireless-accessories',  // ✅ Already specific
  },
]
```

**Pros:**
- Minimal code changes (just 3 URLs)
- No translation changes needed
- Quick fix (15 minutes)

**Cons:**
- Labels might not perfectly match destination (e.g., "Bluetooth Sensors" → Room Sensors page)

### Option 2: Semantic Restructure (Better UX - 30 minutes)

Update both labels AND URLs to match WordPress categories semantically:

```typescript
links: [
  {
    label: t('products.wireless.roomSensors'),  // NEW: More specific
    href: '/products/bluetooth-wireless/wireless-room',  // ✅ Room (5 products)
    badge: 'Popular',
  },
  {
    label: t('products.wireless.nonRoomSensors'),  // NEW: More specific
    href: '/products/bluetooth-wireless/wireless-non-room',  // ✅ Non-Room (7 products)
  },
  {
    label: t('products.wireless.gatewaysModules'),  // NEW: Combined
    href: '/products/bluetooth-wireless/wireless-gateway',  // ✅ Gateway/Modules landing
  },
  {
    label: t('products.wireless.wirelessAccessories'),  // Existing
    href: '/products/bluetooth-wireless/wireless-accessories',  // ✅ Already correct
  },
]
```

**Translation Changes Required:**
```json
// web/messages/en.json
{
  "products": {
    "wireless": {
      "roomSensors": "Room Sensors",
      "roomSensorsDesc": "Temperature & humidity sensors for indoor environments",
      "nonRoomSensors": "Industrial Sensors",
      "nonRoomSensorsDesc": "Duct, outside air, and specialized applications",
      "gatewaysModules": "Gateways & Modules",
      "gatewaysModulesDesc": "Receivers, gateways, and output modules"
    }
  }
}
```

**Pros:**
- Semantically correct (label matches destination)
- Better user experience
- Clearer navigation intent
- Highlights most popular category ("Room Sensors")

**Cons:**
- Requires translation file changes
- Slightly more effort (30 minutes vs 15)

---

## 🔍 WAM FINDINGS

### Legacy Site WAM Structure

**URL:** `https://www.bapihvac.com/wam/`

**Navigation:** Top-level Products menu item (same level as Wireless, Accessories, Temperature, etc.)

**Page Type:** Standalone solution/brand landing page

**Products:** NOT a product category - it's a solution showcase

### Headless Site WAM Structure

**Current Implementation:** Featured section in Products mega-menu

**URL:** `/wam/` (same as legacy)

**WordPress Categories:** 3 unused categories (348, 349, 409) with 0 products

### Recommendation: Current WAM Implementation is CORRECT ✅

- ✅ Headless correctly treats WAM as standalone page (not product category)
- ✅ Featured section in mega-menu is good prominence
- ⏳ **Action:** Remove unused WordPress categories 348, 349, 409 (cleanup task)

---

## ✅ IMPLEMENTATION PLAN

### Step 1: Choose Fix Approach (Decision Needed)

**Quick Fix (Option 1):** 15 minutes, URL changes only  
**Proper Fix (Option 2):** 30 minutes, URL + translation changes

### Step 2: Update Mega-Menu Config

**File:** `web/src/components/layout/Header/config.ts`  
**Lines:** ~150-175  
**Changes:** Update 3 `href` values (and optionally labels)

### Step 3: Update Translations (Option 2 only)

**File:** `web/messages/en.json`  
**Changes:** Add new translation keys for updated labels

### Step 4: Test Navigation

- [ ] Mega-menu Wireless section shows 4 links
- [ ] Each link navigates to correct subcategory page
- [ ] Breadcrumbs show correct hierarchy
- [ ] Category page still shows all 7 subcategories
- [ ] No broken links

### Step 5: WordPress Cleanup (Optional - Separate Task)

```bash
# Remove unused WAM categories
ssh -p 17338 bapiheadlessstaging@35.224.70.159
cd public
wp term delete product_cat 348 --force  # WAM - Wireless Asset Monitoring
wp term delete product_cat 349 --force  # WAM Local
wp term delete product_cat 409 --force  # WAM Remote
```

### Step 6: Documentation

- [ ] Update `docs/TERRY-QA-FEEDBACK-APR2026.md` (Issue #4 → Complete)
- [ ] Add session to `docs/DAILY-LOG.md`
- [ ] Git commit + PR

---

## 📈 IMPACT ASSESSMENT

### User Experience Impact
- **Before:** Users click mega-menu link → land on generic page → must browse subcategories
- **After:** Users click mega-menu link → land on specific subcategory page → faster access to products

### Navigation Comparison

| User Goal | Legacy Site (clicks) | Headless Before (clicks) | Headless After (clicks) | Improvement |
|-----------|---------------------|-------------------------|------------------------|-------------|
| Find Room Sensors | Wireless → Category → Room card = **3** | Wireless → Bluetooth → Room card = **3** | Wireless → Room Sensors = **2** | ✅ 33% faster |
| Browse All Wireless | Wireless = **1** | Wireless → Bluetooth = **2** | Wireless → Bluetooth = **2** | ⚠️ Same |
| Find Accessories | Wireless → Category → Accessories = **3** | Wireless → Accessories = **2** | Wireless → Accessories = **2** | ✅ Already better |

### SEO Impact
- ✅ Better internal linking structure
- ✅ More entry points to subcategory pages
- ✅ Improved navigation depth

---

## 🎯 RECOMMENDATION

**Choose Option 2 (Semantic Restructure - 30 minutes)**

**Why:**
- Only 15 minutes more than quick fix
- Semantically correct (labels match destinations)
- Better user experience
- Professional quality (not a hack)
- Easier to maintain long-term

**Timeline:**
- Implementation: 30 minutes
- Testing: 15 minutes
- Documentation: 10 minutes
- **Total: ~1 hour**

**Priority:** P1 (Pre-Launch) - Issue #4 from Terry QA

**Blocker Status:** None - can proceed immediately

**Post-Fix:** Our wireless navigation will be objectively better than the legacy site!
