# READY FOR WORDPRESS MIGRATION - Action Items

**Status:** Frontend code complete ✅  
**Next Step:** WordPress admin configuration  
**Timeline:** 3-4 hours to complete Phase 1

---

## What's Been Completed (Frontend)

### ✅ Analysis & Planning
- Fetched all 358 products from WordPress via GraphQL pagination
- Analyzed all 115 temperature products (87.8% already have application tags!)
- Analyzed humidity (33), pressure (29), air quality (30) products
- Created detailed migration plan with realistic timeline

### ✅ Code Changes Complete
**File:** `web/src/components/layout/Header/config.ts`
- Updated Temperature mega-menu: Now links to 6 application-based subcategories
- Updated Humidity mega-menu: Links to existing subcategories
- Updated Pressure mega-menu: Links to existing subcategories (already well-structured)
- Updated Air Quality mega-menu: Uses filters (Phase 2 will add subcategories)

**File:** `web/messages/en.json`
- Added translation keys for new menu items: "Averaging Sensors", "Remote Probes"

**Status:** ✅ No TypeScript errors, ready to deploy after WordPress changes

---

## What You Need to Do (WordPress Admin)

### Step 1: Log into WordPress ⏱️ 30 minutes

**URL:** https://bapiheadlessstaging.kinsta.cloud/wp-admin

**Task:** Tag 14 temperature products with missing `pa_application` attributes

**Process:**
1. Go to: **Products → All Products**
2. Search for each product below
3. Click **Edit**
4. Scroll to: **Product Data → Attributes → Application**
5. Select the appropriate application tag
6. Click **Update**

**Products to Tag:**

| Search For | Add Application Tag |
|------------|---------------------|
| Novar UVC Compatible Aluminum Wall Plate | `room-temp` |
| Novar UVC Compatible Duct Temperature | `duct` |
| Low Profile (Button) Temperature | `room-temp` |
| Aluminum Wall Plate Temperature Sensor with 11K | `room-temp` |
| Outside Air Temperature Transmitter, -40 to 140 | `outside-air` |
| (ALC) Temperature Transmitter, Platinum RTD | `immersion` |
| (ACS) Strap Temperature Sensor | `strap` |
| (ACS) Immersion Temperature Sensor, Nylon | `immersion` |
| (ACS) Duct Averaging Temperature Sensor | `averaging` + `duct` (multi-select!) |
| Temperature Transmitter, Platinum RTD | `immersion` |

**Remaining 4 products:** Search for temperature products with NO application attribute, read description, assign appropriate tag.

**How to find them:**
1. **Products → All Products**
2. Filter by: **Product Category → Temperature Sensors**
3. Sort table by: **Attributes** column
4. Products with blank attributes = need tagging

---

### Step 2: Create New Subcategories ⏱️ 20 minutes

**Task:** Create 10 new temperature subcategories

**Process:**
1. Go to: **Products → Categories**
2. Find **Temperature Sensors** in the list (slug: `temperature-sensors`)
3. For each row in table below:
   - **Name:** Copy from "Display Name" column
   - **Slug:** Copy from "Slug" column (EXACT - very important!)
   - **Parent Category:** Select "Temperature Sensors"
   - **Description:** Copy from "Description" column
   - Click **Add New Category**

**Categories to Create:**

| Display Name | Slug | Description |
|--------------|------|-------------|
| Room Temperature Sensors | `temp-room-temp` | Wall-mounted temperature sensors for occupied spaces |
| Duct Sensors | `temp-duct` | Temperature sensors for HVAC ductwork installation |
| Averaging Sensors | `temp-averaging` | Averaging temperature sensors for large spaces |
| Immersion Sensors | `temp-immersion` | Immersion temperature sensors for liquids and tanks |
| Remote Probes | `temp-remote-probes-and-sensors` | Remote probe temperature sensors with separate sensing element |
| Submersible Sensors | `temp-submersible` | Submersible temperature sensors for underwater applications |
| Outside Air Sensors | `temp-outside-air` | Outside air temperature sensors for weather monitoring |
| Strap Sensors | `temp-strap` | Strap-on temperature sensors for pipe attachment |
| Thermobuffer/Freezer Sensors | `temp-thermobuffer-freezer-cooler` | Specialized sensors for freezers, coolers, and thermobuffers |
| Extreme Temperature Sensors | `temp-extreme-temperature` | High-temperature sensors using platinum RTD elements |

**Critical:** Use EXACT slugs - frontend routing depends on these!

---

### Step 3: Reassign All Products ⏱️ 1-2 hours

**Task:** Move 115 temperature products from old categories to new application-based categories

**Recommended Method: WP All Import Plugin**

1. **Install Plugins:**
   - Go to: **Plugins → Add New**
   - Search: "WP All Export" → Install & Activate
   - Search: "WP All Import" → Install & Activate

2. **Export Current Products:**
   - Go to: **All Export → New Export**
   - Export Type: **WooCommerce Products**
   - Filter: Category = "Temperature Sensors"
   - Include fields: SKU, Name, Categories, Attributes
   - Download CSV

3. **Edit CSV:**
   - Open in Excel/Google Sheets
   - Add column: `new_category`
   - Use this formula to map application → new category:
   ```
   IF Application = "duct" → "temp-duct"
   IF Application = "room-temp" → "temp-room-temp"
   IF Application = "averaging" → "temp-averaging"
   IF Application = "immersion" → "temp-immersion"
   IF Application = "remote-probes-and-sensors" → "temp-remote-probes-and-sensors"
   IF Application = "submersible" → "temp-submersible"
   IF Application = "outside-air" → "temp-outside-air"
   IF Application = "strap" → "temp-strap"
   IF Application = "thermobuffer-freezer-cooler" → "temp-thermobuffer-freezer-cooler"
   IF Application = "extreme-temperature" → "temp-extreme-temperature"
   ```
   - Remove old category columns

4. **Import Back:**
   - Go to: **All Import → New Import**
   - Upload modified CSV
   - Map columns: `new_category` → **Product Category**
   - **Update existing products** (match by SKU)
   - Run import

**Alternative: Manual Bulk Edit** (if you prefer not to use plugins)

1. Go to: **Products → All Products**
2. Filter by: **Temperature Sensors**
3. Sort by: **pa_application** attribute
4. Bulk select all with `application = duct`:
   - **Bulk Actions → Edit**
   - **Categories:** Add `temp-duct`, Remove old categories
   - **Update**
5. Repeat for each of the 10 application types

---

### Step 4: Delete Old Categories ⏱️ 10 minutes

**Task:** Clean up obsolete subcategories

**After confirming all products reassigned:**

1. Go to: **Products → Categories**
2. Find these old categories:
   - `temp-room` → **Delete**
   - `temp-non-room` → **Delete**
   - `temp-bapi-stat-4` → **Delete**
   - `temp-button-sensor` → **Delete**
   - `temp-decora-style` → **Delete**

**BEFORE deleting:** Verify each shows "0 products"!

---

### Step 5: Validate GraphQL ⏱️ 10 minutes

**Task:** Confirm WordPress changes are visible to frontend

1. Go to: https://bapiheadlessstaging.kinsta.cloud/graphql
2. Login with admin credentials
3. Paste this query:

```graphql
query ValidateMigration {
  productCategories(where: {parent: "temperature-sensors"}) {
    nodes {
      name
      slug
      count
    }
  }
}
```

4. Click **Execute**
5. **Verify Results:**
   - Should show 10 subcategories
   - Each with correct product count
   - Total adds up to 115 products

**Expected Output:**
```json
{
  "data": {
    "productCategories": {
      "nodes": [
        {"name": "Room Temperature Sensors", "slug": "temp-room-temp", "count": 23},
        {"name": "Duct Sensors", "slug": "temp-duct", "count": 27},
        {"name": "Averaging Sensors", "slug": "temp-averaging", "count": 17},
        ... (7 more)
      ]
    }
  }
}
```

---

## After WordPress Changes Complete

### Developer Tasks (Next Steps)

1. **Test Mega-Menu Links:** Click through all links in mega-menu
2. **Test Category Pages:** Verify products load correctly
3. **Test Breadcrumbs:** Check hierarchy is correct
4. **Commit Frontend Changes:** 
   ```bash
   git add web/src/components/layout/Header/config.ts web/messages/en.json
   git commit -m "feat: Update mega-menu with proper subcategory links after WordPress restructure"
   git push origin feature/category-product-grid-phase1
   ```
5. **Deploy to Staging:** Merge to staging branch
6. **End-to-End Testing:** Full navigation flow test
7. **Production Deploy:** After validation

---

## Documentation Created

All implementation details in:
1. **[PHASE1-CATEGORY-MIGRATION.md](./PHASE1-CATEGORY-MIGRATION.md)** - Complete Phase 1 plan
2. **[WORDPRESS-CATEGORY-MIGRATION-PLAN.md](./WORDPRESS-CATEGORY-MIGRATION-PLAN.md)** - Detailed WordPress steps
3. **This file** - Quick action checklist

---

## Timeline Summary

| Task | Duration | Status |
|------|----------|--------|
| Analysis & Planning | 2 hours | ✅ Complete |
| Frontend Code Updates | 1 hour | ✅ Complete |
| **→ WordPress: Tag Products** | **30 min** | **⏸️ Ready to start** |
| **→ WordPress: Create Categories** | **20 min** | **⏸️ Waiting** |
| **→ WordPress: Reassign Products** | **1-2 hrs** | **⏸️ Waiting** |
| **→ WordPress: Validate** | **10 min** | **⏸️ Waiting** |
| Frontend Testing | 1 hour | ⏸️ After WordPress |
| Deploy & Monitor | 30 min | ⏸️ After testing |

**Total Remaining:** ~3-4 hours of WordPress work

---

## Questions Before Starting?

- **Q:** Can I test this on staging first?
  **A:** Yes! All WordPress work should be done on **staging environment** first.

- **Q:** What if I make a mistake?
  **A:** Kinsta has automatic daily backups. You can restore from backup if needed.

- **Q:** Can I do this in multiple sessions?
  **A:** Yes! Complete Steps 1-2 today, Step 3 tomorrow, etc. Just don't delete old categories (Step 4) until Step 3 is 100% done.

- **Q:** What if I can't find all 14 untagged products?
  **A:** Filter by Temperature category, sort by Attributes column. Blank = needs tagging.

---

**Ready to start? Begin with Step 1: Log into WordPress and tag the 14 products!**

Let me know when you complete each step and I'll help validate the results.
