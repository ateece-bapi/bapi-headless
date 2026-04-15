# Mega-Menu Fix Complete - April 15, 2026

**Status:** ✅ CODE UPDATED - Ready for testing  
**Files Changed:** 2 (config.ts + en.json)  
**Est. Time to Complete:** 45 minutes (add translations to 10 other locales + test)

---

## ✅ Changes Applied

### 1. Wireless vs WAM Separation (CRITICAL FIX)

**User Requirement:** Keep Wireless (HVAC Bluetooth) and WAM (Asset Monitoring) **SEPARATE**

**Solution Implemented:**
- ✅ **Wireless column** → Now links to Bluetooth HVAC products (`/products/bluetooth-wireless`)
- ✅ **WAM** → Stays in Featured panel (already correct - `/wam` landing page)

**File Updated:** `web/src/components/layout/Header/config.ts` (Lines 129-150)

**Before:**
```typescript
links: [
  { label: t('products.wireless.wamTemperature'), href: '/wireless' },  // ❌ Wrong
  { label: t('products.wireless.wamHumidity'), href: '/wireless' },
  { label: t('products.wireless.wamDoorSensors'), href: '/wireless' },
  { label: t('products.wireless.cloudPlatform'), href: '/wam' },
]
```

**After:**
```typescript
links: [
  { label: t('products.wireless.bluetoothSensors'), href: '/products/bluetooth-wireless' },  // ✅ Fixed
  { label: t('products.wireless.gatewaysReceivers'), href: '/products/bluetooth-wireless' },
  { label: t('products.wireless.outputModules'), href: '/products/bluetooth-wireless' },
  { label: t('products.wireless.wirelessAccessories'), href: '/products/bluetooth-wireless' },
]
```

**Result:**
- ✅ Wireless = HVAC Bluetooth products (building automation)
- ✅ WAM = Asset monitoring platform (stays in Featured)
- ✅ No more 404 errors from wireless links

---

### 2. Pressure Label Mismatch (HIGH PRIORITY FIX)

**Problem:** Label said "Barometric" but linked to "Differential Switch"

**File Updated:** `web/src/components/layout/Header/config.ts` (Line 104)

**Before:**
```typescript
{
  label: t('products.pressure.barometric'),  // ❌ Wrong label
  href: '/products/pressure-sensors/pressure-differential-switch',
}
```

**After:**
```typescript
{
  label: t('products.pressure.differentialSwitch'),  // ✅ Correct label
  href: '/products/pressure-sensors/pressure-differential-switch',
}
```

---

### 3. English Translations Updated

**File Updated:** `web/messages/en.json`

**New Keys Added:**
```json
"pressure": {
  "differentialSwitch": "Differential Switch",
  "differentialSwitchDesc": "Pressure-activated switching"
},
"wireless": {
  "bluetoothSensors": "Bluetooth Sensors",
  "bluetoothSensorsDesc": "Wireless HVAC sensors for building automation",
  "gatewaysReceivers": "Gateways & Receivers",
  "gatewaysReceiversDesc": "Connect wireless sensors to BAS",
  "outputModules": "Output Modules",
  "outputModulesDesc": "Wireless control outputs",
  "wirelessAccessories": "Wireless Accessories",
  "wirelessAccessoriesDesc": "Mounting & installation accessories"
}
```

**Old Keys Removed:**
- `wamTemperature`, `wamHumidity`, `wamDoorSensors`, `cloudPlatform`
- `barometric`, `barometricDesc`

---

## 📋 TODO: Complete Translation Rollout

### Remaining Work (30-45 minutes)

Copy the new English keys to all 10 other locale files:

- [ ] `web/messages/de.json` (German)
- [ ] `web/messages/es.json` (Spanish)
- [ ] `web/messages/fr.json` (French)
- [ ] `web/messages/it.json` (Italian)
- [ ] `web/messages/pt.json` (Portuguese)
- [ ] `web/messages/ja.json` (Japanese)
- [ ] `web/messages/zh.json` (Chinese)
- [ ] `web/messages/ko.json` (Korean)
- [ ] `web/messages/ar.json` (Arabic)
- [ ] `web/messages/hi.json` (Hindi)
- [ ] `web/messages/vi.json` (Vietnamese)

**Translation Template:**
```json
"pressure": {
  "differentialSwitch": "[TRANSLATE: Differential Switch]",
  "differentialSwitchDesc": "[TRANSLATE: Pressure-activated switching]"
},
"wireless": {
  "bluetoothSensors": "[TRANSLATE: Bluetooth Sensors]",
  "bluetoothSensorsDesc": "[TRANSLATE: Wireless HVAC sensors for building automation]",
  "gatewaysReceivers": "[TRANSLATE: Gateways & Receivers]",
  "gatewaysReceiversDesc": "[TRANSLATE: Connect wireless sensors to BAS]",
  "outputModules": "[TRANSLATE: Output Modules]",
  "outputModulesDesc": "[TRANSLATE: Wireless control outputs]",
  "wirelessAccessories": "[TRANSLATE: Wireless Accessories]",
  "wirelessAccessoriesDesc": "[TRANSLATE: Mounting & installation accessories]"
}
```

**Options:**
1. **Manual:** Copy/paste and translate each file
2. **ChatGPT:** Feed each locale file and ask for translations
3. **Script:** Use `pnpm run translate:section -- megaMenu.products` if available

---

## 🧪 Testing Checklist

### 1. Build Test (5 minutes)

```bash
cd /home/ateece/bapi-headless/web
pnpm run build
```

**Expected:** ✅ Build succeeds with no TypeScript errors

---

### 2. Local Testing (15 minutes)

```bash
pnpm run dev
# Open http://localhost:3000
```

**Manual Tests:**
- [ ] Hover "Products" → Mega-menu opens
- [ ] Click "Wireless" header → Opens `/products/bluetooth-wireless` (NOT `/wireless`)
- [ ] Click "Bluetooth Sensors" link → Product category page loads (NOT 404)
- [ ] Verify products display (24 Bluetooth HVAC products)
- [ ] Scroll to Featured panel → WAM™ still shows with "Learn More" → `/wam`
- [ ] Click "Pressure" header → Opens `/products/pressure-sensors`
- [ ] Verify "Differential Switch" label displays (NOT "Barometric")
- [ ] Click "Differential Switch" → Correct subcategory loads

---

### 3. E2E Tests (Optional - 10 minutes)

```bash
pnpm test:e2e
```

**Note:** Existing tests should still pass. May need to update mega-menu test if it checks specific labels.

---

## 🔧 tsx vs .mjs Question

### Recommendation: Switch to tsx ✅

**Install:**
```bash
cd /home/ateece/bapi-headless/web
pnpm add -D tsx
```

**Benefits:**
- ✅ Native TypeScript support
- ✅ No need for `.ts` extensions in imports
- ✅ Full type checking
- ✅ Industry standard (2024+)
- ✅ Works perfectly with Next.js

**Convert Script:**
```bash
# Rename script
mv scripts/verify-megamenu-links.mjs scripts/verify-megamenu-links.ts

# Update imports (no need for .ts extensions)
# Change: import { x } from '../src/lib/file.ts'
# To:     import { x } from '../src/lib/file'

# Run with tsx
pnpm tsx scripts/verify-megamenu-links.ts
```

**Update package.json:**
```json
{
  "scripts": {
    "verify:megamenu": "tsx scripts/verify-megamenu-links.ts"
  }
}
```

---

## 📊 Summary

### Before Fix
- ❌ 4 broken wireless links (404 errors)
- ⚠️ 1 pressure label mismatch
- ⚠️ 2 duplicate humidity links (deferred to Phase 2)

### After Fix
- ✅ Wireless links now point to Bluetooth HVAC products
- ✅ WAM stays separate in Featured panel
- ✅ Pressure label matches actual category
- ✅ English translations updated
- ⏳ 10 locale translations remaining

---

## 🚀 Next Steps (Priority Order)

1. **Complete Translations** (30-45 min)
   - Copy new keys to 10 locale files
   - Translate or use ChatGPT

2. **Test Locally** (15 min)
   - `pnpm run dev`
   - Click through all mega-menu links
   - Verify no 404 errors

3. **Install tsx** (2 min)
   - `pnpm add -D tsx`
   - Update verification script

4. **Git Commit & PR** (20 min)
   ```bash
   git checkout -b fix/mega-menu-wireless-wam-separation
   git add web/src/components/layout/Header/config.ts
   git add web/messages/*.json
   git commit -m "fix: separate Wireless (HVAC) and WAM in mega-menu

   - Wireless column now links to Bluetooth HVAC products
   - WAM stays in Featured panel as asset monitoring solution
   - Fixed pressure 'barometric' label mismatch
   - Updated translations for new wireless product links
   
   Closes #XXX"
   git push origin fix/mega-menu-wireless-wam-separation
   ```

5. **Merge & Deploy** (After PR approval)

---

## ✅ Definition of Done

- [x] Wireless links updated (Bluetooth HVAC products)
- [x] Pressure label fixed (differentialSwitch)
- [x] English translations updated
- [ ] All 10 locale translations updated
- [ ] Build succeeds
- [ ] Manual QA passed
- [ ] PR merged
- [ ] Verified in staging

---

**Last Updated:** April 15, 2026 14:30  
**Status:** Code changes complete, translations in progress  
**Launch Impact:** 🔴 HIGH - Critical navigation fix for May 8 launch
