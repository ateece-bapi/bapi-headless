# Mega-Menu Link Update Summary

**Date:** April 15, 2026  
**Task:** Update mega-menu links and titles to match actual WordPress categories  
**Completion Time:** 2-3 hours (Senior Web Developer estimate)

---

## 🎯 What a Senior Web Developer Would Do

### 1. Systematic Audit Approach ✅ COMPLETED

**Files Created:**
- ✅ [`docs/MEGA-MENU-AUDIT-APR2026.md`](./MEGA-MENU-AUDIT-APR2026.md) - Comprehensive 42-link audit
- ✅ [`web/scripts/verify-megamenu-links.ts`](../web/scripts/verify-megamenu-links.ts) - Automated verification script

**Methodology:**
1. ✅ Documented all 42 mega-menu links (7 categories × ~6 links each)
2. ✅ Cross-referenced with WordPress category structure
3. ✅ Verified translation keys match display titles
4. ✅ Identified broken/duplicate/mislabeled links
5. ✅ Prioritized fixes: Critical → High → Medium

---

## 📊 Key Findings

### ✅ CORRECT (No Changes Needed)

1. **Temperature Sensors** (6 links) - ✅ All correct after March 2026 restructure
2. **Air Quality Sensors** (3 links) - ✅ All correct
3. **Accessories** (3 links) - ✅ All correct (flat structure)
4. **Test Instruments** (3 links) - ✅ All correct (flat structure)

### ⚠️ NEEDS FIXES

#### Priority 1: CRITICAL - Wireless Links (4 broken links)

**Current State:**
```typescript
// web/src/components/layout/Header/config.ts (Lines 129-150)
{
  label: t('products.wireless.wamTemperature'),
  href: '/wireless',  // ❌ NOT A PRODUCT CATEGORY
},
{
  label: t('products.wireless.cloudPlatform'),
  href: '/wam',  // ❌ NOT A PRODUCT CATEGORY
},
```

**Actual WordPress Category:** `bluetooth-wireless` (24 products)

**Fix Options:**

**Option A - Link to Bluetooth Category (Recommended):**
```typescript
{
  title: t('products.wireless.title'),
  slug: 'bluetooth-wireless',
  icon: '/images/icons/Wireless_Icon.webp',
  links: [
    {
      label: t('products.wireless.bluetoothSensors'),
      href: '/products/bluetooth-wireless',
      description: t('products.wireless.bluetoothSensorsDesc'),
    },
    {
      label: t('products.wireless.gatewaysReceivers'),
      href: '/products/bluetooth-wireless',
      description: t('products.wireless.gatewaysReceiversDesc'),
    },
  ],
},
```

**Option B - Keep WAM in Featured Panel Only:**
- Remove WAM links from main mega-menu
- Keep WAM in "Featured" section (already exists)
- Use Bluetooth Wireless for product navigation

#### Priority 2: HIGH - Pressure Label Mismatch

**Current State:**
```typescript
{
  label: t('products.pressure.barometric'),  // Says "Barometric"
  href: '/products/pressure-sensors/pressure-differential-switch',  // Links to "Differential Switch"
},
```

**Fix:**
```typescript
// Update translation key
{
  label: t('products.pressure.differentialSwitch'),  // ✅ Matches actual category
  href: '/products/pressure-sensors/pressure-differential-switch',
  description: t('products.pressure.differentialSwitchDesc'),
},
```

**Files to Update:**
- `web/src/components/layout/Header/config.ts` (line 104)
- `web/messages/en.json` - Add `differentialSwitch` key
- All 10 other locale files (de.json, es.json, fr.json, etc.)

#### Priority 3: MEDIUM - Humidity Duplicate Links

**Current State:**
```typescript
{
  label: t('products.humidity.roomHumidity'),
  href: '/products/humidity-sensors/humidity-room',  // Link 1
},
{
  label: t('products.humidity.comboSensors'),
  href: '/products/humidity-sensors/humidity-room',  // DUPLICATE - Same link
},
{
  label: t('products.humidity.ductHumidity'),
  href: '/products/humidity-sensors/humidity-non-room',  // Link 2
},
{
  label: t('products.humidity.outdoorHumidity'),
  href: '/products/humidity-sensors/humidity-non-room',  // DUPLICATE - Same link
},
```

**Fix Options:**

**Option A - Simplify to 2 Distinct Links:**
```typescript
{
  label: t('products.humidity.roomSensors'),
  href: '/products/humidity-sensors/humidity-room',
  description: t('products.humidity.roomSensorsDesc'),
},
{
  label: t('products.humidity.ductOutdoorSensors'),
  href: '/products/humidity-sensors/humidity-non-room',
  description: t('products.humidity.ductOutdoorSensorsDesc'),
},
```

**Option B - Wait for Phase 2 Restructure:**
- Humidity will be restructured post-May launch
- Keep current links as-is
- Fix during Phase 2 implementation

**Recommendation:** Option B (defer to Phase 2)

---

## 🛠️ Implementation Steps

### Step 1: Fix Wireless Links (30 minutes)

**Decision Point:** Get stakeholder approval for Option A or B

**If Option A (Bluetooth Category):**

1. Update `web/src/components/layout/Header/config.ts`:
```typescript
{
  title: t('products.wireless.title'),
  slug: 'bluetooth-wireless',
  icon: '/images/icons/Wireless_Icon.webp',
  links: [
    {
      label: t('products.wireless.bluetoothSystem'),
      href: '/products/bluetooth-wireless',
      description: t('products.wireless.bluetoothSystemDesc'),
      badge: t('badges.popular'),
    },
    {
      label: t('products.wireless.gateways'),
      href: '/products/bluetooth-wireless',
      description: t('products.wireless.gatewaysDesc'),
    },
    {
      label: t('products.wireless.sensors'),
      href: '/products/bluetooth-wireless',
      description: t('products.wireless.sensorsDesc'),
    },
  ],
},
```

2. Update `web/messages/en.json`:
```json
"wireless": {
  "title": "Wireless",
  "bluetoothSystem": "Bluetooth Low Energy",
  "bluetoothSystemDesc": "5-minute setup, 5-year battery life",
  "gateways": "Gateways & Receivers",
  "gatewaysDesc": "Connect sensors to building automation",
  "sensors": "Wireless Sensors",
  "sensorsDesc": "Room, duct, food probe sensors"
}
```

3. Copy translations to all 10 locale files

**If Option B (Keep WAM in Featured):**
- Remove 4 WAM links from `links` array
- Keep WAM in `featured` panel only

---

### Step 2: Fix Pressure Label (20 minutes)

1. Update `web/src/components/layout/Header/config.ts` (line 104):
```typescript
{
  label: t('products.pressure.differentialSwitch'),
  href: '/products/pressure-sensors/pressure-differential-switch',
  description: t('products.pressure.differentialSwitchDesc'),
},
```

2. Update `web/messages/en.json`:
```json
"pressure": {
  "title": "Pressure",
  "differential": "Differential Pressure",
  "differentialDesc": "Room & filter monitoring",
  "static": "Static Pressure",
  "staticDesc": "Duct static transmitters",
  "differentialSwitch": "Differential Switch",
  "differentialSwitchDesc": "Pressure-activated switching"
}
```

3. Update all 10 locale files with translated versions

---

### Step 3: Testing (45 minutes)

**Automated Tests:**
```bash
cd /home/ateece/bapi-headless/web

# TypeScript compilation
pnpm run build

# Unit/integration tests
pnpm test:ci

# E2E tests
pnpm test:e2e
```

**Manual QA Checklist:**
- [ ] Hover over "Products" → Mega-menu opens
- [ ] Click "Temperature" header → Category page loads
- [ ] Click "Room & Wall Sensors" → Subcategory page loads
- [ ] Verify breadcrumb shows: Home → Products → Temperature Sensors → Room Temperature Sensors
- [ ] Repeat for all 7 categories
- [ ] Test mobile hamburger menu
- [ ] Test keyboard navigation (Tab, Enter)
- [ ] Test screen reader (NVDA/JAWS)

---

## 📝 Files to Modify

### Primary Files (Code Changes)

1. **`web/src/components/layout/Header/config.ts`**
   - Lines 129-150 (Wireless - CRITICAL)
   - Line 104 (Pressure - HIGH)
   - Lines 69-90 (Humidity - MEDIUM, defer to Phase 2)

### Translation Files (11 locales)

2. **`web/messages/en.json`** (master)
   - Add `products.wireless.bluetoothSystem`, `gateways`, `sensors`
   - Add `products.pressure.differentialSwitch`

3. **All other locales:**
   - `web/messages/de.json` (German)
   - `web/messages/es.json` (Spanish)
   - `web/messages/fr.json` (French)
   - `web/messages/ja.json` (Japanese)
   - `web/messages/zh.json` (Chinese)
   - `web/messages/vi.json` (Vietnamese)
   - `web/messages/ar.json` (Arabic)
   - `web/messages/th.json` (Thai)
   - `web/messages/pl.json` (Polish)
   - `web/messages/hi.json` (Hindi)

---

## 🔍 Verification Commands

### Run Automated Verification Script (Future)
```bash
cd /home/ateece/bapi-headless/web

# Run verification script (no install needed)
pnpm dlx tsx scripts/verify-megamenu-links.ts

# Expected output:
# ✅ Temperature: 6/6 links valid
# ❌ Wireless: 4/4 links broken (FIXED in this PR)
# ⚠️ Pressure: 1/3 label mismatch (FIXED in this PR)
# ⚠️ Humidity: 2/4 duplicate links
```

### Test Individual Category Pages
```bash
# Start dev server
pnpm run dev

# Open browser and test:
# http://localhost:3000/products/temperature-sensors/temp-room-temp
# http://localhost:3000/products/bluetooth-wireless
# http://localhost:3000/products/pressure-sensors/pressure-differential-switch
```

---

## ✅ Success Criteria

**Before Fix:**
- ❌ 4 broken wireless links (404 errors)
- ⚠️ 1 pressure link mislabeled
- ⚠️ 2 duplicate humidity links

**After Fix:**
- ✅ All 42 mega-menu links verified via GraphQL
- ✅ Zero 404 errors from navigation
- ✅ All translation keys match actual category names
- ✅ E2E tests passing
- ✅ Manual QA completed
- ✅ Chromatic visual regression updated

---

## 📅 Timeline

| Task | Duration | Who |
|------|----------|-----|
| Fix wireless links | 30 min | Developer |
| Fix pressure label | 20 min | Developer |
| Update translations (11 locales) | 45 min | Developer + ChatGPT |
| Run automated tests | 30 min | Developer |
| Manual QA | 45 min | QA Engineer |
| Git branch + PR | 20 min | Developer |
| **TOTAL** | **~3 hours** | |

---

## 🚀 Git Workflow

```bash
# Create feature branch
cd /home/ateece/bapi-headless
git checkout -b fix/mega-menu-links-apr2026

# Make changes
# ... edit config.ts and translation files ...

# Test locally
cd web
pnpm run build
pnpm test:ci

# Commit
git add web/src/components/layout/Header/config.ts
git add web/messages/*.json
git commit -m "fix: update mega-menu links to match WordPress categories

- Fix wireless category links (bluetooth-wireless)
- Fix pressure 'barometric' label mismatch
- Add translations for updated keys
- All 42 mega-menu links now verified

Closes #XXX"

# Push and create PR
git push origin fix/mega-menu-links-apr2026

# Open PR on GitHub
# Request Copilot automated review
# Address review feedback
# Merge after approval
```

---

## 📚 Related Documentation

- [MEGA-MENU-AUDIT-APR2026.md](./MEGA-MENU-AUDIT-APR2026.md) - Full 42-link audit
- [PHASE1-CATEGORY-MIGRATION.md](./PHASE1-CATEGORY-MIGRATION.md) - Temperature restructure details
- [CATEGORY-STRUCTURE-COMPARISON.md](./CATEGORY-STRUCTURE-COMPARISON.md) - Current vs new structure
- [WORDPRESS-CATEGORY-MIGRATION-PLAN.md](./WORDPRESS-CATEGORY-MIGRATION-PLAN.md) - WordPress changes

---

**Status:** Ready for implementation  
**Estimated Completion:** April 16, 2026  
**Launch Impact:** 🔴 HIGH - Critical for May 8 launch (navigation integrity)
