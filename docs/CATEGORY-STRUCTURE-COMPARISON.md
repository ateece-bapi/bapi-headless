# Category Structure: Current Site vs Headless Site

**Date:** March 16, 2026  
**Purpose:** Compare current production site category implementation with new headless site architecture

---

## Current Production Site (www.bapihvac.com)

### System Details
- **WordPress:** 6.x (SpinupWP server)
- **WooCommerce:** 10.4.4
- **Theme:** bapi-v4 (custom theme)
- **Products:** 358 published products
- **Server:** prod-2025.bapihvac.com (104.248.14.80)

### Navigation Structure (Current)

**NO Mega-Menu** - Simple dropdown navigation:

```
Header Nav (281)
├── Products
│   ├── Test Instruments (direct link)
│   ├── Temperature Sensors (category link)
│   ├── Humidity Sensors (category link)
│   ├── Pressure Sensors (category link)
│   ├── Air Quality (category link)
│   ├── Wireless (category link)
│   ├── Accessories (category link)
│   ├── ETA (category link)
│   └── WAM (custom page, not category)
├── Resources
├── About Us
└── Contact Us
```

### Category Hierarchy (Current Production)

**8 Main Categories with varying depth:**

| Category | Products | Levels | Subcategories | Notes |
|----------|----------|--------|---------------|-------|
| Temperature Sensors | 115 | 3 | 2 | Room (30) + Non-Room (85) → 11 series types |
| Humidity Sensors | 33 | 3 | 2 | Room (15) + Non-Room (19) → 5 series types |
| Pressure Sensors | 29 | 2 | 3 | Flat structure - no Level 3 |
| Wireless Sensors | 24 | 3 | 2 | Bluetooth (24) + WAM (0 - empty) → 7 types |
| Air Quality Sensors | 32 | 2 | 6 | Flat structure - types only |
| ETA Line | 70 | 1 | 0 | Flat structure |
| Accessories | 74 | 1 | 0 | Flat structure |
| Test Instruments | 3 | 1 | 0 | Flat structure |

### URL Pattern (Current)

```
Main Category:    /product-category/temperature-sensors/
Subcategory:      /product-category/temperature-sensors/temp-room/
Series/Type:      /product-category/temperature-sensors/temp-room/bapi-stat-quantum-series/
Individual:       /product/ba10k-2-duct-temperature-sensor/
```

**URL Prefix:** `/product-category/` (WooCommerce default)

### Temperature Sensors Detailed Structure

```
Temperature Sensors (302) - 115 products
├── Room (303) - 30 products
│   ├── BAPI-Stat "Quantum" Series (413) - 5 products
│   ├── BAPI-Stat 4 (320) - 9 products
│   ├── Delta Style (324) - 3 products
│   ├── Button Sensor (327) - 3 products
│   ├── Decora Style (326) - 2 products
│   ├── Wall Plates (314) - 8 products
│   └── Transmitters (328) - 4 products
└── Non-Room (319) - 85 products
    ├── Duct (401) - 20 products
    ├── Immersion (402) - 16 products
    ├── Averaging (329) - 18 products
    ├── Outside Air (403) - 7 products
    ├── Strap (404) - 7 products
    ├── Submersible (330) - 8 products
    ├── Thermobuffer (405) - 5 products
    ├── Remote Probes and Sensors (406) - 16 products
    ├── Extreme Temperature (407) - 4 products
    ├── Transmitters (341) - 26 products
    └── Replacement Probes (408) - 0 products ⚠️ EMPTY
```

### Empty Categories Found

⚠️ **Categories with 0 products:**
- WAM - Wireless Asset Monitoring (348)
- WAM Local (349)
- WAM Remote (409)
- Replacement Probes (408)

**Recommendation:** Hide empty categories in headless site or mark as "Coming Soon"

---

## New Headless Site (bapi-headless.vercel.app)

### System Details
- **Backend:** WordPress 6.8.2 + WooCommerce 10.3.5 (Kinsta staging)
- **Frontend:** Next.js 16.0.7 (Vercel)
- **Products:** 608 products (staging data - more than production)
- **GraphQL:** WPGraphQL + WPGraphQL for WooCommerce

### Navigation Structure (New)

**WITH Mega-Menu** - Enhanced visual navigation (Phase 1 priority):

```
Mega Menu (planned)
├── Products
│   ├── [Icon] Temperature Sensors → Hover reveals:
│   │   ├── Room
│   │   │   ├── BAPI-Stat Quantum
│   │   │   ├── BAPI-Stat 4
│   │   │   └── ...more series
│   │   └── Non-Room
│   │       ├── Duct
│   │       ├── Immersion
│   │       └── ...more types
│   ├── [Icon] Humidity Sensors
│   ├── [Icon] Pressure Sensors
│   ├── [Icon] Air Quality Sensors
│   ├── [Icon] Wireless Sensors
│   ├── [Icon] Accessories
│   ├── [Icon] ETA Line
│   └── [Icon] Test Instruments
├── Support (new)
└── Company (new)
```

**Note:** Applications (main nav) and Solutions (footer) deferred to Phase 2 per timeline.

### URL Pattern (New)

```
Main Category:    /products/temperature-sensors
Subcategory:      /products/temperature-sensors/temp-room
Series/Type:      /products/temperature-sensors/temp-room/bapi-stat-quantum-series (TBD)
Individual:       /products/ba10k-2-duct-temperature-sensor
```

**URL Prefix:** `/products/` (cleaner, SEO-friendly)

### GraphQL Implementation

**Queries Available:**
- `GetProductCategoryWithChildren` - Full hierarchy with parent/child/ancestors
- `GetProductsByCategory` - Products filtered by category
- `GetProductAttributes` - Filter attributes (pa_*)

**File:** `web/src/lib/graphql/queries/products.graphql` (lines 425-500+)

---

## Key Differences

| Aspect | Current Site | Headless Site |
|--------|--------------|---------------|
| **Navigation** | Simple dropdown | Mega-menu with icons |
| **URL Prefix** | `/product-category/` | `/products/` |
| **Product Count** | 358 | 608 |
| **Subcategories** | Clickable links | Cards + Mega-menu |
| **Level 3 Categories** | Full pages? | TBD (filters vs pages?) |
| **Empty Categories** | Visible | Should hide |
| **Breadcrumbs** | Basic | Locale-aware, full hierarchy |
| **Filters** | WooCommerce native | Custom + GraphQL attributes |

---

## Critical Decisions Needed

### 1. Level 3 Category Display

**Current Site:** Each series (BAPI-Stat Quantum, Duct, etc.) appears to be a full category page

**Options for Headless:**
- **Option A:** Replicate as full pages (`/products/temperature-sensors/temp-room/bapi-stat-quantum-series`)
  - Pros: SEO-friendly, maintains URL structure
  - Cons: More pages to build, maintain
- **Option B:** Use as sidebar filters on subcategory pages
  - Pros: Simpler UX, fewer pages
  - Cons: Changes URL structure, potential SEO impact
- **Option C:** Hybrid - Major series get pages, minor ones are filters
  - Pros: Best of both worlds
  - Cons: Complexity in deciding which is which

**Recommendation:** Check analytics to see if Level 3 pages get direct traffic before deciding.

### 2. Empty Categories

**Found on production:**
- WAM categories (intentional - separate landing page exists)
- Replacement Probes (likely discontinued)

**Action:** Hide from navigation, return 404 or redirect to parent category.

### 3. URL Migration

**Current:** `/product-category/temperature-sensors/temp-room/`  
**New:** `/products/temperature-sensors/temp-room`

**Action Required:** 301 redirects for all category URLs to preserve SEO.

### 4. Mega-Menu Category Icons

**Current site:** No icons  
**New site:** 8 product category SVG icons required

**Status:** ✅ Icons documented in brand assets

---

## Implementation Status

### Phase 1 Priorities (Current Focus)

- ✅ **GraphQL Queries:** Category hierarchy queries implemented
- ✅ **Mega-Menu Structure:** Main categories mapped
- ⏳ **Subcategory Pages:** Need implementation
- ⏳ **Breadcrumb Navigation:** Implemented but needs testing with 3-level hierarchy
- ⏳ **Sidebar Filters:** Product attributes identified, UI needed
- ⏳ **Empty Category Handling:** Not yet implemented

### Questions for Stakeholder Review

1. **Do we want to maintain the exact 3-level structure or simplify it?**
2. **Should Level 3 categories be full pages or just filters?**
3. **Are there any category names that should change (e.g., "ETA" vs "ETA Line")?**
4. **Should WAM stay as a separate page or become a product category?**
5. **Timeline for updating 358 → 608 products on production?**

---

## Decision Summary (March 16, 2026)

### ✅ **APPROVED: Modern Category Page Approach**

After reviewing the current production site implementation, we've decided to **improve the UX** rather than replicate the old multi-click subcategory navigation.

**Old Approach (Production):**
- Categories show subcategory cards only
- Requires 4 clicks to purchase
- High friction, low conversion

**New Approach (Headless):**
- Show ALL products immediately on category pages
- Subcategories as filter pills + sidebar filters
- 2 clicks to purchase (50% reduction)
- Better SEO, mobile UX, and conversion

**Branch:** `feature/category-product-grid-phase1`  
**Architecture:** See [CATEGORY-PAGES-ARCHITECTURE.md](./CATEGORY-PAGES-ARCHITECTURE.md)

---

## Next Steps

1. ✅ **Architecture Plan Created:** [CATEGORY-PAGES-ARCHITECTURE.md](./CATEGORY-PAGES-ARCHITECTURE.md)
2. ✅ **Branch Created:** `feature/category-product-grid-phase1`
3. ⏳ **Review with Stakeholders:** Confirm modern approach approval
4. ⏳ **Start Implementation:** Build components per architecture plan
5. ⏳ **Testing:** Target completion by March 30 for April 10 launch

---

## Reference Files

- **Current Production Audit:** This document
- **Headless Category Documentation:** `docs/PRODUCT-CATEGORY-AUDIT.md`
- **GraphQL Queries:** `web/src/lib/graphql/queries/products.graphql`
- **Mega-Menu Data:** `web/src/data/megaMenuData.ts`
- **Brand Assets:** `docs/BRAND-ASSETS.md`
- **Color System:** `web/COLOR_SYSTEM.md`
