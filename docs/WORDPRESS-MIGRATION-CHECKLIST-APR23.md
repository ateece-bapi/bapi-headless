# WordPress Temperature Category Migration - Action Checklist

**Date:** April 23, 2026  
**Deadline:** May 4, 2026 (11 days remaining!)  
**Estimated Time:** 3-4 hours total  
**WordPress URL:** https://bapiheadlessstaging.kinsta.cloud/wp-admin

---

## 🎯 Goal

Fix the 404 error on `/products/temperature-sensors/temp-room-temp` by creating the 10 planned temperature subcategories in WordPress that the frontend mega-menu expects.

**Current Issue:** Frontend links to `temp-room-temp` but WordPress category doesn't exist yet.

---

## ✅ Pre-Flight Checklist

- [ ] WordPress admin login credentials ready
- [ ] 3-4 hours blocked on calendar
- [ ] GraphiQL access for validation: https://bapiheadlessstaging.kinsta.cloud/graphql
- [ ] Browser with tabs for WordPress admin + GraphiQL + frontend testing

---

## Step 1: Create 10 New Subcategories (⏱️ 30 minutes)

**Location:** WordPress Admin → Products → Categories

**For each subcategory below:**

1. Click **Add New Category** (left panel)
2. Fill in:
   - **Name:** Copy from "Display Name" column
   - **Slug:** Copy from "Slug" column (**EXACT - critical for routing!**)
   - **Parent:** Select "Temperature Sensors"
   - **Description:** Copy from "Description" column
3. Click **Add New Category**
4. ✅ Check off in this list

### Categories to Create

| # | Display Name | Slug (EXACT!) | Description | Status |
|---|--------------|---------------|-------------|--------|
| 1 | Room Temperature Sensors | `temp-room-temp` | Wall-mounted temperature sensors for occupied spaces | ⬜ |
| 2 | Duct Sensors | `temp-duct` | Temperature sensors for HVAC ductwork installation | ⬜ |
| 3 | Averaging Sensors | `temp-averaging` | Averaging temperature sensors for large spaces | ⬜ |
| 4 | Immersion Sensors | `temp-immersion` | Immersion temperature sensors for liquids and tanks | ⬜ |
| 5 | Remote Probes | `temp-remote-probes-and-sensors` | Remote probe temperature sensors with separate sensing element | ⬜ |
| 6 | Submersible Sensors | `temp-submersible` | Submersible temperature sensors for underwater applications | ⬜ |
| 7 | Outside Air Sensors | `temp-outside-air` | Outside air temperature sensors for weather monitoring | ⬜ |
| 8 | Strap Sensors | `temp-strap` | Strap-on temperature sensors for pipe attachment | ⬜ |
| 9 | Thermobuffer/Freezer Sensors | `temp-thermobuffer-freezer-cooler` | Specialized sensors for freezers, coolers, and thermobuffers | ⬜ |
| 10 | Extreme Temperature Sensors | `temp-extreme-temperature` | High-temperature sensors using platinum RTD elements | ⬜ |

**Verification:**
- [ ] All 10 categories created
- [ ] All have parent "Temperature Sensors"
- [ ] All slugs match exactly (no typos!)

---

## Step 2: Tag 14 Missing Products (⏱️ 30 minutes)

**Location:** WordPress Admin → Products → All Products

**Why:** 101 of 115 temperature products already have application tags. These 14 need them before reassignment.

**Process for each product:**

1. Search product name in search box
2. Click **Edit**
3. Scroll to **Product Data → Attributes → Application**
4. Select appropriate application tag from dropdown
5. Click **Update**
6. ✅ Check off below

### Products to Tag

| # | Search For | Application Tag | Status |
|---|------------|----------------|--------|
| 1 | Novar UVC Compatible Aluminum Wall Plate | `room-temp` | ⬜ |
| 2 | Novar UVC Compatible Duct Temperature | `duct` | ⬜ |
| 3 | Low Profile (Button) Temperature | `room-temp` | ⬜ |
| 4 | Aluminum Wall Plate Temperature Sensor with 11K | `room-temp` | ⬜ |
| 5 | Outside Air Temperature Transmitter, -40 to 140 | `outside-air` | ⬜ |
| 6 | (ALC) Temperature Transmitter, Platinum RTD | `immersion` | ⬜ |
| 7 | (ACS) Strap Temperature Sensor | `strap` | ⬜ |
| 8 | (ACS) Immersion Temperature Sensor, Nylon | `immersion` | ⬜ |
| 9 | (ACS) Duct Averaging Temperature Sensor | `averaging` + `duct` | ⬜ |
| 10 | Temperature Transmitter, Platinum RTD | `immersion` | ⬜ |

**Remaining 4 products (find manually):**

11. [ ] Filter Products by "Temperature Sensors" → Sort by "Attributes" → Find products with no application attribute → Assign based on product description
12. [ ] (same process)
13. [ ] (same process)
14. [ ] (same process)

**Verification:**
- [ ] All 14 products now have application attribute
- [ ] Multi-select used where appropriate (e.g., "averaging + duct")

---

## Step 3: Reassign Products to New Categories (⏱️ 1-2 hours)

**Choose ONE method:**

### Method A: Bulk Edit (Recommended if no plugins installed)

**Process:**

1. **Products → All Products**
2. Filter by **Product Category → Temperature Sensors**
3. Click **Screen Options** (top right) → Set "Number of items per page" to 100
4. Sort table by **Attributes** column

**For each application type (10 iterations):**

1. Select all products with same application (use checkboxes)
   - Example: All products with `application = duct`
2. **Bulk Actions → Edit** (top dropdown)
3. **Categories:**
   - ✅ Add: New subcategory (e.g., `temp-duct`)
   - ❌ Remove: Old subcategories (e.g., `temp-non-room`)
   - ✅ Keep: Main category `temperature-sensors`
4. Click **Update**
5. ✅ Check off below

**Bulk Assignment Checklist:**

| Application Attribute | New Category | Products Count | Status |
|----------------------|--------------|----------------|--------|
| `room-temp` | temp-room-temp | ~23 products | ⬜ |
| `duct` | temp-duct | ~27 products | ⬜ |
| `averaging` | temp-averaging | ~17 products | ⬜ |
| `immersion` | temp-immersion | ~15 products | ⬜ |
| `remote-probes-and-sensors` | temp-remote-probes-and-sensors | ~15 products | ⬜ |
| `submersible` | temp-submersible | ~8 products | ⬜ |
| `outside-air` | temp-outside-air | ~7 products | ⬜ |
| `strap` | temp-strap | ~6 products | ⬜ |
| `thermobuffer-freezer-cooler` | temp-thermobuffer-freezer-cooler | ~6 products | ⬜ |
| `extreme-temperature` | temp-extreme-temperature | ~4 products | ⬜ |

### Method B: WP All Import Plugin (Alternative)

**Only if you prefer automated import:**

1. **Install Plugins:**
   - [ ] Plugins → Add New → Search "WP All Export" → Install & Activate
   - [ ] Plugins → Add New → Search "WP All Import" → Install & Activate

2. **Export:**
   - [ ] All Export → New Export → WooCommerce Products
   - [ ] Filter: Category = "Temperature Sensors"
   - [ ] Download CSV

3. **Edit CSV in Excel:**
   - [ ] Add column `new_category`
   - [ ] Use IF formula to map `pa_application` → `new_category_slug`
   - [ ] Remove old category columns

4. **Import:**
   - [ ] All Import → New Import → Upload CSV
   - [ ] Map: `new_category` → Product Category
   - [ ] Update existing products (match by SKU)
   - [ ] Run import

**Verification:**
- [ ] Total products across 10 subcategories = ~115
- [ ] No products lost (check parent "Temperature Sensors" count)

---

## Step 4: Validate with GraphQL (⏱️ 10 minutes)

**Location:** https://bapiheadlessstaging.kinsta.cloud/graphql

**Query to run:**

```graphql
query ValidateTemperatureSubcategories {
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

```json
{
  "data": {
    "productCategories": {
      "nodes": [
        {"name": "Room Temperature Sensors", "slug": "temp-room-temp", "count": 23},
        {"name": "Duct Sensors", "slug": "temp-duct", "count": 27},
        {"name": "Averaging Sensors", "slug": "temp-averaging", "count": 17},
        {"name": "Immersion Sensors", "slug": "temp-immersion", "count": 15},
        {"name": "Remote Probes", "slug": "temp-remote-probes-and-sensors", "count": 15},
        {"name": "Submersible Sensors", "slug": "temp-submersible", "count": 8},
        {"name": "Outside Air Sensors", "slug": "temp-outside-air", "count": 7},
        {"name": "Strap Sensors", "slug": "temp-strap", "count": 6},
        {"name": "Thermobuffer/Freezer Sensors", "slug": "temp-thermobuffer-freezer-cooler", "count": 6},
        {"name": "Extreme Temperature Sensors", "slug": "temp-extreme-temperature", "count": 4}
      ]
    }
  }
}
```

**Validation Checklist:**

- [ ] GraphQL query returns 10 subcategories
- [ ] All slugs match exactly (copy-paste to verify)
- [ ] Product counts total ~115 (may vary due to customer groups)
- [ ] Each count > 0 (no empty categories)

---

## Step 5: Test Frontend Links (⏱️ 15 minutes)

**Location:** http://localhost:3000 (or staging URL)

**Test each mega-menu link:**

1. [ ] Home → Products (hover) → Temperature → **Room & Wall Sensors**
   - URL should be: `/en/products/temperature-sensors/temp-room-temp`
   - Should load product grid (not 404)
   - Products displayed: ~23

2. [ ] Products → Temperature → **Duct Sensors**
   - URL: `/en/products/temperature-sensors/temp-duct`
   - Products: ~27

3. [ ] Products → Temperature → **Immersion & Well**
   - URL: `/en/products/temperature-sensors/temp-immersion`
   - Products: ~15

4. [ ] Products → Temperature → **Outdoor Sensors**
   - URL: `/en/products/temperature-sensors/temp-outside-air`
   - Products: ~7

5. [ ] Products → Temperature → **Averaging Sensors**
   - URL: `/en/products/temperature-sensors/temp-averaging`
   - Products: ~17

6. [ ] Products → Temperature → **Remote Probes**
   - URL: `/en/products/temperature-sensors/temp-remote-probes-and-sensors`
   - Products: ~15

**Additional Tests:**

- [ ] Breadcrumb shows: Home → Products → Temperature Sensors → [Subcategory]
- [ ] Category icon displays correctly
- [ ] Product filters work
- [ ] Product sorting works
- [ ] Click individual product → Detail page loads

**Issues Found:**
- ❌ Record any 404s or errors here:

---

## Step 6: Clean Up Old Categories (⏱️ 10 minutes)

**⚠️ ONLY AFTER CONFIRMING STEP 5 PASSES!**

**Location:** WordPress Admin → Products → Categories

**Categories to Delete (if count = 0):**

1. [ ] `temp-room` (old location-based) → **Delete**
2. [ ] `temp-non-room` (old location-based) → **Delete**
3. [ ] `temp-bapi-stat-4` (old product line category) → **Delete**
4. [ ] `temp-button-sensor` (old style category) → **Delete**
5. [ ] `temp-decora-style` (old style category) → **Delete**

**Before deleting each:**
- ✅ Verify count = 0 products
- ✅ If count > 0, go back to Step 3 and reassign those products

**Verification:**
- [ ] Only new application-based subcategories remain under "Temperature Sensors"
- [ ] No orphaned products

---

## Step 7: Cache Invalidation (⏱️ 5 minutes)

**WordPress Cache:**
- [ ] If using Redis Object Cache plugin: **Settings → Redis → Flush Cache**
- [ ] If using Kinsta cache: **Kinsta Dashboard → Clear Cache**

**Next.js Cache:**
- [ ] Trigger revalidation: POST to frontend `/api/revalidate` with tag `products`
- [ ] Or redeploy Vercel site to clear all caches

**Browser Cache:**
- [ ] Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- [ ] Test in incognito window

---

## 🎉 Success Criteria

- ✅ http://localhost:3000/en/products/temperature-sensors/temp-room-temp loads (no 404)
- ✅ All 6 mega-menu temperature links work
- ✅ GraphQL returns 10 subcategories with correct counts
- ✅ Products display correctly in each subcategory
- ✅ Breadcrumbs show correct hierarchy
- ✅ No broken links or 404s

---

## 📋 Post-Migration Tasks

**Document Changes:**
- [ ] Update [DAILY-LOG.md](./DAILY-LOG.md) with completion date
- [ ] Mark WORDPRESS-TODO.md as complete
- [ ] Screenshot GraphQL results for records

**Next Phase:**
- [ ] Humidity category migration (Phase 2)
- [ ] Live chat integration
- [ ] Translation services setup

---

## 🆘 Troubleshooting

### Issue: GraphQL doesn't show new categories

**Solution:**
1. Flush WordPress cache (Settings → Redis → Flush Cache)
2. Check WPGraphQL Smart Cache plugin is active
3. Verify categories have `parent = temperature-sensors` set correctly

### Issue: Frontend still shows 404

**Solution:**
1. Check slug spelling (must be EXACT: `temp-room-temp` not `temp-room`)
2. Clear Next.js cache: `/api/revalidate?tag=products`
3. Hard refresh browser: Ctrl+Shift+R
4. Check Vercel deployment logs for errors

### Issue: Product count doesn't match expected

**Solution:**
1. Remember: (ALC) and (ACS) products are customer-specific
2. Guest users see fewer products than total count
3. Check product visibility settings (Published vs Draft)
4. Some products may have multiple applications (counted in multiple categories)

### Issue: Can't find specific product to tag

**Solution:**
1. Products → All Products
2. Filter by "Temperature Sensors"
3. Click "Screen Options" → Show "Attributes" column
4. Sort by "Attributes" to find products with no application attribute
5. Search by SKU if product name search fails

---

## 📞 Need Help?

- **GraphQL Testing:** https://bapiheadlessstaging.kinsta.cloud/graphql
- **Documentation:** See [WORDPRESS-CATEGORY-MIGRATION-PLAN.md](./WORDPRESS-CATEGORY-MIGRATION-PLAN.md)
- **Product Analysis:** See [PHASE1-CATEGORY-MIGRATION.md](./PHASE1-CATEGORY-MIGRATION.md)

---

**Time Started:** ___________  
**Time Completed:** ___________  
**Total Duration:** ___________  
**Issues Encountered:** ___________________________
