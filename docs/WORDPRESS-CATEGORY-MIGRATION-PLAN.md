# WordPress Category Migration Plan - Temperature Sensors

**Date:** March 16, 2026  
**Project:** BAPI Headless Phase 1 - Product Navigation  
**Target:** April 10, 2026

## Executive Summary

Based on complete product analysis of **115 temperature products**:
- ✅ **87.8%** (101 products) already have proper `pa_application` tags
- ⚠️ **12.2%** (14 products) need application attribute tagging
- 🎯 **10 new subcategories** to create based on application types

This migration is **feasible within timeline** - only 14 products need manual attention.

---

## Current vs. Proposed Structure

### Current Structure (Inconsistent)
```
temperature-sensors/
├── temp-room/ (15 products)
├── temp-non-room/ (35 products)
├── temp-averaging/ (18 products)
├── temp-duct/ (15 products)
├── temp-immersion/ (13 products)
├── temp-bapi-stat-4/ (9 products)
├── temp-extreme-temperature/ (4 products)
├── temp-button-sensor/ (3 products)
└── temp-decora-style/ (2 products)
```

**Problem:** Mix of location-based (room/non-room) and application-based categories. Users can't find "Outside Air Sensors" because they're buried in "temp-non-room".

### Proposed Structure (Application-Based)
```
temperature-sensors/
├── temp-room-temp/ (23 products) - "Room Sensors"
├── temp-duct/ (27 products) - "Duct Sensors"
├── temp-averaging/ (17 products) - "Averaging Sensors"
├── temp-immersion/ (15 products) - "Immersion Sensors"
├── temp-remote-probes-and-sensors/ (15 products) - "Remote Probes"
├── temp-submersible/ (8 products) - "Submersible Sensors"
├── temp-outside-air/ (7 products) - "Outside Air Sensors"
├── temp-strap/ (6 products) - "Strap Sensors"
├── temp-thermobuffer-freezer-cooler/ (6 products) - "Thermobuffer/Freezer"
└── temp-extreme-temperature/ (4 products) - "Extreme Temperature"
```

**Benefits:**
- ✅ Matches how customers think ("I need a duct sensor")
- ✅ Aligns with mega-menu expectations
- ✅ Mirrors competitor site structures (Belimo, etc.)
- ✅ Better SEO (descriptive URLs)

---

## Customer-Specific Product Visibility (B2B Segmentation)

### 🔒 Important Business Rule

**Products are segmented by customer group:**

| Product Prefix | Visibility | Example |
|----------------|------------|--------|
| **(ALC)** | ALC customer group only | `(ALC) Immersion Temperature Transmitter, Stainless Steel Fitting` |
| **(ACS)** | ACS customer group only | `(ACS) Thermobuffer Temperature Sensor` |
| **No prefix** | All customers (public) | `Novar UVC Compatible Aluminum Wall Plate Temperature Sensor` |

**WordPress Fields:**
- Product meta: `customer_group1`, `customer_group2`, `customer_group3`
- User meta: Customer group assignment
- Pricing multipliers: `multiplier_buyresell`, `multiplier_humidpres`, `multiplier_mfg`

**Frontend Implementation Required:**
```graphql
# GraphQL query should filter based on user context
query GetProducts($customerGroup: String) {
  products(where: { customerGroup: $customerGroup }) {
    nodes {
      name
      customerGroup1
      customerGroup2
      # ...
    }
  }
}
```

**Migration Impact:**
- Preserve all `customer_group` meta fields when reassigning categories
- Product counts shown in analysis are TOTAL (all groups combined)
- Actual visible products depend on logged-in user's customer group
- Guest users see only non-prefixed products (~60-70% of inventory)

---

## Migration Steps

### Phase 1: Tag Missing Products (14 products)

**WordPress Admin Steps:**
1. Go to: **Products → All Products**
2. Search for each product below
3. Edit → Assign **Product attributes → Application**
4. **Save** (don't publish yet - just save draft)

**Products Needing Tags:**

| Product Name | Recommended Application Tag |
|--------------|----------------------------|
| Novar UVC Compatible Aluminum Wall Plate Temperature Sensor | `room-temp` |
| Novar UVC Compatible Duct Temperature Sensor with BAPI-Box 4 Enclosure | `duct` |
| Low Profile (Button) Temperature Sensor | `room-temp` |
| Aluminum Wall Plate Temperature Sensor with 11K-2 Ohm Thermistor | `room-temp` |
| Outside Air Temperature Transmitter, -40 to 140°F Range | `outside-air` |
| (ALC) Temperature Transmitter, Platinum RTD | `immersion` |
| (ACS) Strap Temperature Sensor | `strap` |
| (ACS) Immersion Temperature Sensor, Nylon Fitting | `immersion` |
| (ACS) Duct Averaging Temperature Sensor, Rigid | `averaging` + `duct` (multi-select) |
| Temperature Transmitter, Platinum RTD | `immersion` |

**Remaining 4 products:** Check names in WordPress admin and assign based on product description/specifications.

---

### Phase 2: Create New Subcategories

**WordPress Admin Steps:**
1. Go to: **Products → Categories**
2. Find parent: **Temperature Sensors** (slug: `temperature-sensors`)
3. Create each subcategory below as **child of Temperature Sensors**

**New Categories to Create:**

| Display Name | Slug | Parent | Description | Count |
|--------------|------|--------|-------------|-------|
| Room Temperature Sensors | `temp-room-temp` | temperature-sensors | Wall-mounted temperature sensors for occupied spaces | 23 |
| Duct Sensors | `temp-duct` | temperature-sensors | Temperature sensors for HVAC ductwork installation | 27 |
| Averaging Sensors | `temp-averaging` | temperature-sensors | Averaging temperature sensors for large spaces | 17 |
| Immersion Sensors | `temp-immersion` | temperature-sensors | Immersion temperature sensors for liquids and tanks | 15 |
| Remote Probes | `temp-remote-probes-and-sensors` | temperature-sensors | Remote probe temperature sensors with separate sensing element | 15 |
| Submersible Sensors | `temp-submersible` | temperature-sensors | Submersible temperature sensors for underwater applications | 8 |
| Outside Air Sensors | `temp-outside-air` | temperature-sensors | Outside air temperature sensors for weather monitoring | 7 |
| Strap Sensors | `temp-strap` | temperature-sensors | Strap-on temperature sensors for pipe attachment | 6 |
| Thermobuffer/Freezer Sensors | `temp-thermobuffer-freezer-cooler` | temperature-sensors | Specialized sensors for freezers, coolers, and thermobuffers | 6 |
| Extreme Temperature Sensors | `temp-extreme-temperature` | temperature-sensors | High-temperature sensors using platinum RTD elements | 4 |

**Important:**
- ✅ Use **exact slugs** above - frontend routing depends on these
- ✅ Set **Parent Category** to "Temperature Sensors"
- ✅ Write brief **descriptions** for SEO

---

### Phase 3: Reassign Products to New Categories

**Option A: Manual (Small Batches)**
1. Go to: **Products → All Products**
2. Filter by: **Product Category → Temperature Sensors**
3. Sort by: **Product Attribute → Application**
4. Bulk select products with same application (e.g., all "duct" products)
5. **Bulk Actions → Edit**
6. Set **Categories** → Add new subcategory, remove old subcategory
7. **Update**

**Option B: WP All Import Plugin (Recommended for 100+ products)**
1. Export current products: **WP All Export** → Products with temperature category
2. Excel/CSV column mapping:
   - Map `pa_application=duct` → `categories=temp-duct`
   - Map `pa_application=room-temp` → `categories=temp-room-temp`
   - etc.
3. Import back with **WP All Import** → Update existing products
4. Validate GraphQL reflects changes

**Mappings (for CSV/import):**

```csv
pa_application,new_category_slug
duct,temp-duct
room-temp,temp-room-temp
averaging,temp-averaging
immersion,temp-immersion
remote-probes-and-sensors,temp-remote-probes-and-sensors
submersible,temp-submersible
outside-air,temp-outside-air
strap,temp-strap
thermobuffer-freezer-cooler,temp-thermobuffer-freezer-cooler
extreme-temperature,temp-extreme-temperature
```

---

### Phase 4: Cleanup Old Categories

**After confirming all products reassigned:**

1. Go to: **Products → Categories**
2. Find old categories:
   - `temp-room` → **Delete** (products moved to `temp-room-temp`)
   - `temp-non-room` → **Delete** (products moved to specific application categories)
   - `temp-bapi-stat-4` → **Delete** (products moved to `temp-room-temp`)
   - `temp-button-sensor` → **Delete** (products moved to `temp-room-temp`)
   - `temp-decora-style` → **Delete** (products moved to `temp-room-temp`)
3. **Before deleting:** Verify no products assigned (should show "0 products")

---

### Phase 5: Validate GraphQL

**Test Query:**
```graphql
query TestNewCategories {
  productCategories(where: {parent: "temperature-sensors"}) {
    nodes {
      name
      slug
      count
    }
  }
}
```

**Expected Results:**
- Should show **10 subcategories**
- Each with correct **product count**
- Total adds up to **115 products**

**Run in GraphiQL:** https://bapiheadlessstaging.kinsta.cloud/graphql

---

## Frontend Updates Required

### 1. Update Mega-Menu Config

**File:** `web/src/components/layout/Header/config.ts`

**Current (Temperature section):**
```typescript
{
  title: 'Temperature',
  href: '/products/temperature',
  description: 'Temperature sensing solutions',
  items: [
    { title: 'Room Sensors', href: '/products/temperature/temp-room' },
    { title: 'Duct Sensors', href: '/products/temperature/temp-duct' },
    { title: 'Averaging Sensors', href: '/products/temperature/temp-averaging' },
    { title: 'Immersion Sensors', href: '/products/temperature/temp-immersion' },
  ],
}
```

**Updated:**
```typescript
{
  title: 'Temperature',
  href: '/products/temperature',
  description: 'Temperature sensing solutions',
  items: [
    { title: 'Room Sensors', href: '/products/temperature/temp-room-temp' },
    { title: 'Duct Sensors', href: '/products/temperature/temp-duct' },
    { title: 'Averaging Sensors', href: '/products/temperature/temp-averaging' },
    { title: 'Immersion Sensors', href: '/products/temperature/temp-immersion' },
    { title: 'Outside Air Sensors', href: '/products/temperature/temp-outside-air' },
    { title: 'Remote Probes', href: '/products/temperature/temp-remote-probes-and-sensors' },
  ],
}
```

**Note:** Only show top 6 applications in mega-menu (cover 80%+ of products). Other subcategories accessible via category page.

### 2. Update Category Page URLs (if needed)

**Current routes work:** `/products/temperature-sensors` redirects to `/products/temperature`  
**Subcategory routes:** `/products/temperature/temp-room-temp` (auto-generated by Next.js dynamic routing)

No code changes needed - Next.js `[category]/[subcategory]` route handles all subcategories automatically.

### 3. Test Routes After WordPress Changes

```bash
# Test mega-menu links
curl -I https://bapi-headless.vercel.app/products/temperature/temp-room-temp
curl -I https://bapi-headless.vercel.app/products/temperature/temp-duct
curl -I https://bapi-headless.vercel.app/products/temperature/temp-outside-air

# Should all return 200 OK with product listings
```

---

## Rollback Plan

**If issues arise during migration:**

1. **Database Backup:** Kinsta automatic daily backups available
2. **Staging First:** Test entire process on staging before production
3. **Revert Categories:** Delete new categories, restore old ones from backup
4. **Revert Products:** WP All Import allows "Undo" on recent imports

**Critical:** Test on **staging WordPress** first!

---

## Success Criteria

- ✅ All 115 temperature products assigned to correct application-based subcategories
- ✅ No products remain in old `temp-room` or `temp-non-room` categories
- ✅ 14 previously untagged products now have `pa_application` attributes
- ✅ GraphQL query returns 10 subcategories with expected counts
- ✅ Mega-menu links navigate to populated category pages
- ✅ Breadcrumbs show correct category hierarchy
- ✅ Frontend routing works for all new subcategory slugs

---

## Timeline Estimate

| Phase | Duration | Owner |
|-------|----------|-------|
| Tag 14 missing products | 30 min | WordPress Admin |
| Create 10 new subcategories | 20 min | WordPress Admin |
| Reassign 115 products (WP All Import) | 1-2 hours | WordPress Admin |
| Validate GraphQL, test frontend | 30 min | Developer |
| Update mega-menu config | 15 min | Developer |
| End-to-end testing | 1 hour | Both |
| **Total** | **3-4 hours** | |

**Recommended Schedule:**
- ✅ **Today (March 16):** Execute WordPress changes on staging
- ✅ **Tomorrow (March 17):** Update frontend code, test end-to-end
- ✅ **March 18:** Deploy to production, monitor

---

## Next Steps

1. **Log into WordPress Admin:** https://bapiheadlessstaging.kinsta.cloud/wp-admin
2. **Start with Phase 1:** Tag the 14 missing products (use table above)
3. **Notify developer when Phase 1-3 complete:** So we can validate GraphQL
4. **Proceed with Phase 4-5:** After developer confirms structure is correct

**Questions?** Review this document with developer before starting.

---

Generated by automated analysis of 358 total products, 115 temperature products analyzed.
