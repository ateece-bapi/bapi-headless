# Phase 1 Category Migration - Implementation Plan

**Date:** March 16, 2026  
**Deadline:** April 10, 2026 (25 days)  
**Scope:** Temperature restructure + Mega-menu updates for all categories

---

## Important: Customer-Specific Products (B2B)

### 🔒 Product Visibility Segmentation

**BAPI uses customer group-based product visibility:**

- **(ALC) Products** → Only visible to ALC customer group members
- **(ACS) Products** → Only visible to ACS customer group members  
- **Standard Products** → Visible to all customers (including guests)

**WordPress Implementation:**
- Products have `customer_group1/2/3` meta fields (see copilot-instructions.md)
- ~5,438 WordPress users with native authentication
- User accounts have customer group assignments
- Frontend must filter GraphQL results based on authenticated user's group

**Product Count Examples (Temperature):**
```
Total analyzed: 115 products
├─ (ALC) prefixed: ~40 products (35%)
├─ (ACS) prefixed: ~5 products (4%)
└─ Public products: ~70 products (61%)
```

**Migration Consideration:**  
When moving products between categories, **preserve existing customer_group meta fields**. The subcategory product counts will vary depending on logged-in user's customer group.

---

## Analysis Summary (All Categories)

| Category | Products | Tagged | Ready? | Action |
|----------|----------|--------|--------|--------|
| **Temperature** | 115 | 87.8% | ✅ YES | **Full restructure** (only 14 to tag) |
| **Humidity** | 33 | 9.1% | ❌ NO | **Phase 2** (30 products to tag) |
| **Pressure** | 29 | 0% | ✅ YES | **Keep as-is** (well-structured subcats) |
| **Air Quality** | 30 | 0% | ❌ NO | **Phase 2** (needs subcategory design) |

---

## Phase 1 Scope (This Sprint)

### 1. Temperature Sensors - FULL RESTRUCTURE ✅
**Current:** 10 inconsistent subcategories (temp-room, temp-non-room, etc.)  
**Target:** 10 application-based subcategories (temp-room-temp, temp-duct, temp-outside-air, etc.)  
**Effort:** 3-4 hours (14 products to tag, 115 to reassign)  
**Priority:** HIGH - mega-menu expects these specific categories

See: [WORDPRESS-CATEGORY-MIGRATION-PLAN.md](./WORDPRESS-CATEGORY-MIGRATION-PLAN.md) for detailed steps.

### 2. Pressure Sensors - VALIDATE EXISTING ✅
**Current:** 3 subcategories (well-organized by product type)
- `pressure-pickup-ports-and-probes` (18 products)
- `pressure-differential-transmitters` (7 products)
- `pressure-differential-switch` (4 products)

**Action:** Update mega-menu links only (no WordPress changes needed)

### 3. Humidity Sensors - MINIMAL UPDATES 🔄
**Current:** 5 subcategories (acceptable for Phase 1)
- `humidity-sensors` (10 products - generic)
- `humidity-duct` (10 products - specific)
- `humidity-bapi-stat-4` (6 products - product line)
- `humidity-delta-style` (4 products - style)
- `bapi-stat-quantum-series-humidity-room` (3 products - product line)

**Action:** Update mega-menu to link to existing subcategories  
**Phase 2:** Tag 30 products, consolidate to application-based categories

### 4. Air Quality Sensors - DEFER RESTRUCTURE ⏸️
**Current:** 1 generic category (all 30 products in air-quality-sensors)
**Action:** Link mega-menu to main category page with filters  
**Phase 2:** Create subcategories (CO2, VOC, Particulate, etc.)

---

## WordPress Tasks (This Week)

### Priority 1: Temperature (WordPress Admin)

**Step 1 - Tag 14 Products (30 minutes):**

Go to: **Products → All Products**, search and tag each:

| Product | Add pa_application |
|---------|-------------------|
| Novar UVC Compatible Aluminum Wall Plate Temperature Sensor | `room-temp` |
| Novar UVC Compatible Duct Temperature Sensor with BAPI-Box 4 Enclosure | `duct` |
| Low Profile (Button) Temperature Sensor | `room-temp` |
| Aluminum Wall Plate Temperature Sensor with 11K-2 Ohm Thermistor | `room-temp` |
| Outside Air Temperature Transmitter, -40 to 140°F Range | `outside-air` |
| (ALC) Temperature Transmitter, Platinum RTD | `immersion` |
| (ACS) Strap Temperature Sensor | `strap` |
| (ACS) Immersion Temperature Sensor, Nylon Fitting | `immersion` |
| (ACS) Duct Averaging Temperature Sensor, Rigid | `averaging` + `duct` |
| Temperature Transmitter, Platinum RTD | `immersion` |
| *(Find 4 more in WordPress and tag based on description)* | |

**Step 2 - Create 10 New Subcategories (20 minutes):**

Go to: **Products → Categories**, create as children of "Temperature Sensors":

| Display Name | Slug | Count |
|--------------|------|-------|
| Room Temperature Sensors | `temp-room-temp` | 23 |
| Duct Sensors | `temp-duct` | 27 |
| Averaging Sensors | `temp-averaging` | 17 |
| Immersion Sensors | `temp-immersion` | 15 |
| Remote Probes | `temp-remote-probes-and-sensors` | 15 |
| Submersible Sensors | `temp-submersible` | 8 |
| Outside Air Sensors | `temp-outside-air` | 7 |
| Strap Sensors | `temp-strap` | 6 |
| Thermobuffer/Freezer Sensors | `temp-thermobuffer-freezer-cooler` | 6 |
| Extreme Temperature Sensors | `temp-extreme-temperature` | 4 |

**Step 3 - Reassign All 115 Products (1-2 hours):**

**Option A - WP All Import (Recommended):**
1. Install: **WP All Export** + **WP All Import** plugins
2. Export temperature products to CSV
3. Map `pa_application` → new category slug (see CSV below)
4. Import back, update existing products

**Option B - Manual Bulk Edit:**
1. Filter: **Products → Temperature Sensors**
2. Sort by: **pa_application**
3. Bulk select all with same application
4. **Bulk Edit → Categories** → Add new, remove old
5. Repeat for each application type

**CSV Mapping for Import:**
```csv
pa_application,add_category,remove_categories
duct,temp-duct,"temp-non-room,temp-averaging,temp-duct"
room-temp,temp-room-temp,"temp-room,temp-bapi-stat-4,temp-button-sensor,temp-decora-style"
averaging,temp-averaging,"temp-averaging,temp-non-room"
immersion,temp-immersion,"temp-immersion,temp-non-room"
remote-probes-and-sensors,temp-remote-probes-and-sensors,temp-non-room
submersible,temp-submersible,"temp-averaging,temp-duct,temp-non-room"
outside-air,temp-outside-air,temp-non-room
strap,temp-strap,temp-non-room
thermobuffer-freezer-cooler,temp-thermobuffer-freezer-cooler,temp-non-room
extreme-temperature,temp-extreme-temperature,temp-extreme-temperature
```

**Step 4 - Delete Old Subcategories (10 minutes):**

After confirming all products reassigned, delete:
- `temp-room` (replaced by `temp-room-temp`)
- `temp-non-room` (replaced by specific application categories)
- `temp-bapi-stat-4` (merged into `temp-room-temp`)
- `temp-button-sensor` (merged into `temp-room-temp`)
- `temp-decora-style` (merged into `temp-room-temp`)

**Verify 0 products before deleting!**

---

## Frontend Tasks (Developer)

### Update Mega-Menu Config

**File:** `web/src/components/layout/Header/config.ts`

**Current:**
```typescript
const megaMenuSections = [
  {
    title: 'Temperature',
    href: '/products/temperature',
    items: [
      { title: 'Room Sensors', href: '/products/temperature/temp-room' },
      { title: 'Duct Sensors', href: '/products/temperature/temp-duct' },
      // ...
    ],
  },
  // ... humidity, pressure, air-quality
];
```

**Updated (all categories):**
```typescript
{
  title: 'Temperature',
  href: '/products/temperature-sensors',
  description: 'Temperature sensing solutions for HVAC and building automation',
  items: [
    { title: 'Room Sensors', href: '/products/temperature-sensors/temp-room-temp' },
    { title: 'Duct Sensors', href: '/products/temperature-sensors/temp-duct' },
    { title: 'Averaging Sensors', href: '/products/temperature-sensors/temp-averaging' },
    { title: 'Immersion Sensors', href: '/products/temperature-sensors/temp-immersion' },
    { title: 'Outside Air Sensors', href: '/products/temperature-sensors/temp-outside-air' },
    { title: 'Remote Probes', href: '/products/temperature-sensors/temp-remote-probes-and-sensors' },
  ],
},
{
  title: 'Humidity',
  href: '/products/humidity-sensors',
  description: 'Humidity measurement for optimal climate control',
  items: [
    { title: 'Room Sensors', href: '/products/humidity-sensors/humidity-sensors' },
    { title: 'Duct Sensors', href: '/products/humidity-sensors/humidity-duct' },
    { title: 'BAPI-Stat Series', href: '/products/humidity-sensors/humidity-bapi-stat-4' },
    { title: 'Outside Air Sensors', href: '/products/humidity-sensors/humidity-sensors?application=outside-air' }, // filtered
  ],
},
{
  title: 'Pressure',
  href: '/products/pressure-sensors',
  description: 'Differential pressure sensing and monitoring',
  items: [
    { title: 'Pickup Ports & Probes', href: '/products/pressure-sensors/pressure-pickup-ports-and-probes' },
    { title: 'Differential Transmitters', href: '/products/pressure-sensors/pressure-differential-transmitters' },
    { title: 'Differential Switches', href: '/products/pressure-sensors/pressure-differential-switch' },
  ],
},
{
  title: 'Air Quality',
  href: '/products/air-quality-sensors',
  description: 'IAQ monitoring for healthy indoor environments',
  items: [
    { title: 'All Air Quality Sensors', href: '/products/air-quality-sensors' },
    { title: 'CO₂ Sensors', href: '/products/air-quality-sensors?type=co2' }, // Phase 2: create subcategory
    { title: 'VOC Sensors', href: '/products/air-quality-sensors?type=voc' }, // Phase 2: create subcategory
  ],
},
```

**Notes:**
- Temperature: Links to NEW subcategories after WordPress migration
- Pressure: Links to EXISTING subcategories (no WordPress changes)
- Humidity: Links to existing + uses filter for "Outside Air" (Phase 1 workaround)
- Air Quality: Uses filters until Phase 2 subcategories created

---

## Testing Checklist

### After WordPress Changes
- [ ] GraphQL query returns 10 temperature subcategories
- [ ] Each subcategory has correct product count (totals 115)
- [ ] Old subcategories (temp-room, temp-non-room) deleted
- [ ] Staging site: Category pages load with products

### After Frontend Deploy
- [ ] Mega-menu links work for all 4 categories
- [ ] Temperature subcategory pages display correct products
- [ ] Breadcrumbs show correct hierarchy
- [ ] Pressure links work (existing subcategories)
- [ ] Humidity/Air Quality links work (existing structure)
- [ ] Mobile mega-menu navigation works
- [ ] No 404 errors on any mega-menu link

### GraphQL Validation Query
```graphql
query ValidateMigration {
  temperatureCategories: productCategories(
    where: { parent: "temperature-sensors" }
  ) {
    nodes {
      name
      slug
      count
    }
  }
  
  pressureCategories: productCategories(
    where: { parent: "pressure-sensors" }
  ) {
    nodes {
      name
      slug
      count
    }
  }
}
```

**Expected:**
- Temperature: 10 subcategories
- Pressure: 3 subcategories

---

## Timeline

| Date | Tasks | Owner |
|------|-------|-------|
| **Mar 16 (Today)** | Tag 14 temp products<br>Create 10 new subcategories | WordPress Admin |
| **Mar 17** | Reassign 115 products<br>Delete old subcategories<br>Validate GraphQL | WordPress Admin + Dev |
| **Mar 18** | Update mega-menu config<br>Test all routes | Developer |
| **Mar 19** | End-to-end testing<br>Fix any issues | Both |
| **Mar 20** | Deploy to production<br>Monitor | Both |

**Total Time:** 3-4 days (well ahead of April 10 deadline)

---

## Phase 2 Scope (Post-Launch)

**Deferred to after April 10, 2026:**

1. **Humidity Restructure:**
   - Tag 30 products with application attributes
   - Create application-based subcategories (humid-room, humid-duct, humid-outside-air, etc.)
   - Consolidate product-line categories into applications

2. **Air Quality Subcategories:**
   - Analyze 30 products to determine subcategory needs
   - Likely categories: CO2, VOC, Particulate Matter, Multi-Sensor
   - Create subcategories and reassign products

3. **Application Attribute Standardization:**
   - Establish naming conventions for pa_application
   - Backfill missing attributes across all categories
   - Create WordPress documentation for content team

---

## Success Criteria (Phase 1)

- ✅ Temperature sensors fully restructured (10 application-based subcategories)
- ✅ All mega-menu links functional and pointing to correct pages
- ✅ Pressure sensors validated (existing structure confirmed good)
- ✅ Humidity/Air Quality working with existing structure
- ✅ Zero 404 errors on navigation
- ✅ Breadcrumbs accurate across all category levels
- ✅ Mobile navigation tested and working

**Phase 1 Complete = Product Navigation Priority #3 Achieved** ✅

---

Generated March 16, 2026 based on analysis of 358 total products.
