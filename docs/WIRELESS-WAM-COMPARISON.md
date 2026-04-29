# Wireless & WAM Implementation Comparison

**Investigation Date:** April 29, 2026  
**Issue:** Terry QA Feedback #4 - Wireless Subcategory Routing Bug  
**Branch:** `investigate/wireless-wam-comparison`

---

## WordPress Category Structure (Actual Data)

```bash
wp term list product_cat --search="Wireless" --format=table
```

### Wireless Hierarchy (3 Levels)

**Level 1: Wireless Sensors** (ID: 310, Slug: `wireless-sensors`, 24 products)
- Parent category - contains all wireless products

**Level 2: Bluetooth Low Energy** (ID: 674, Slug: `bluetooth-wireless`, Parent: 310, 24 products)
- Main wireless system category
- All 24 wireless products are in this category

**Level 3: Bluetooth Subcategories** (All children of 674)
| ID  | Name            | Slug                                        | Products |
|-----|-----------------|---------------------------------------------|----------|
| 678 | Gateway         | `wireless-gateway`                          | 1        |
| 677 | Receivers       | `wireless-receivers-bluetooth-wireless`     | 1        |
| 679 | Output Modules  | `wireless-output-modules-bluetooth-wireless`| 6        |
| 675 | Room            | `wireless-room`                             | 5        |
| 676 | Non-Room        | `wireless-non-room`                         | 7        |
| 680 | Food Probe      | `wireless-food-probe`                       | 2        |
| 682 | Accessories     | `wireless-accessories`                      | 5        |

**Level 2: WAM** (ID: 348, Slug: `wam-wireless-asset-monitoring1`, Parent: 310, 0 products)
- Sibling to Bluetooth Low Energy under Wireless Sensors

**Level 3: WAM Subcategories** (Children of 348)
| ID  | Name       | Slug           | Products |
|-----|------------|----------------|----------|
| 349 | WAM Local  | `wam-local1`   | 0        |
| 409 | WAM Remote | `wam-remote`   | 0        |

---

## Headless Site Implementation (Current)

### MegaMenu Config: Wireless Column

**File:** `web/src/components/layout/Header/config.ts`

```typescript
{
  title: t('products.wireless.title'),
  slug: 'bluetooth-wireless',
  icon: '/images/icons/Wireless_Icon.webp',
  links: [
    {
      label: t('products.wireless.bluetoothSensors'),
      href: '/products/bluetooth-wireless',  // ❌ Generic link
      description: t('products.wireless.bluetoothSensorsDesc'),
      badge: t('badges.popular'),
    },
    {
      label: t('products.wireless.gatewaysReceivers'),
      href: '/products/bluetooth-wireless',  // ❌ Generic link
      description: t('products.wireless.gatewaysReceiversDesc'),
    },
    {
      label: t('products.wireless.outputModules'),
      href: '/products/bluetooth-wireless',  // ❌ Generic link
      description: t('products.wireless.outputModulesDesc'),
    },
    {
      label: t('products.wireless.wirelessAccessories'),
      href: '/products/bluetooth-wireless/wireless-accessories',  // ✅ Specific link
      description: t('products.wireless.wirelessAccessoriesDesc'),
    },
  ],
}
```

### MegaMenu Featured: WAM

```typescript
featured: {
  title: t('products.featured.title'),
  description: t('products.featured.description'),
  cta: t('products.featured.cta'),
  href: '/wam',  // ✅ Specific WAM page
  badge: t('badges.premiumSolution'),
  logo: `${WORDPRESS_URL}/wp-content/uploads/wam-logo.png`,
  logoAlt: 'WAM Wireless Asset Monitoring logo',
}
```

---

## Issues Identified

### Issue #1: Missing Wireless Subcategory Links

**Problem:** 3 out of 4 wireless mega-menu links point to generic `/products/bluetooth-wireless` page instead of specific subcategory pages.

**Expected Links:**
- ❌ **Bluetooth Sensors** → Should go to `/products/bluetooth-wireless/wireless-room` (Room sensors)
- ❌ **Gateways & Receivers** → Should go to `/products/bluetooth-wireless/wireless-gateway` (Gateway category)
- ❌ **Output Modules** → Should go to `/products/bluetooth-wireless/wireless-output-modules-bluetooth-wireless`
- ✅ **Wireless Accessories** → Already correct: `/products/bluetooth-wireless/wireless-accessories`

**WordPress Categories Available:**
- `wireless-gateway` (1 product)
- `wireless-receivers-bluetooth-wireless` (1 product)
- `wireless-output-modules-bluetooth-wireless` (6 products)
- `wireless-room` (5 products)
- `wireless-non-room` (7 products)
- `wireless-food-probe` (2 products)
- `wireless-accessories` (5 products)

**Decision Needed:**
1. Should "Bluetooth Sensors" link to Room sensors (`wireless-room`) or show all sensors?
2. Should "Gateways & Receivers" combine two categories or split them?
3. Do we need a separate mega-menu item for "Room" vs "Non-Room" sensors?

---

### Issue #2: WAM Category Structure Mismatch

**WordPress:** WAM is a **subcategory of Wireless Sensors** (ID 348, parent 310)
- Has its own subcategories: WAM Local, WAM Remote
- Currently has 0 products assigned

**Headless:** WAM is a **standalone featured section** in the mega-menu
- Links to `/wam` (standalone page)
- Not part of the Products → Wireless hierarchy

**Questions:**
1. Is WAM a product category or a standalone solution page?
2. Should WAM products appear under Wireless Sensors in WordPress?
3. Is the current mega-menu "featured" placement correct, or should WAM be in the Wireless column?
4. Why are WAM Local and WAM Remote categories created but have 0 products?

---

### Issue #3: Category Naming Inconsistency

**WordPress vs Mega-Menu Labels:**

| WordPress Name              | Mega-Menu Label          | Match? |
|-----------------------------|--------------------------|--------|
| Gateway                     | Gateways & Receivers     | ❌     |
| Receivers                   | Gateways & Receivers     | ❌     |
| Output Modules              | Output Modules           | ✅     |
| Room                        | Bluetooth Sensors        | ❌     |
| Non-Room                    | (Not shown)              | ❌     |
| Food Probe                  | (Not shown)              | ❌     |
| Accessories                 | Wireless Accessories     | ✅     |

**Decision Needed:**
- Should we rename WordPress categories to match mega-menu?
- Or update mega-menu labels to match WordPress?
- Or create a mapping between them?

---

## Legacy Site Comparison

### URLs to Review:
- **Legacy Wireless:** https://www.bapihvac.com/products/bluetooth-wireless/
- **Legacy WAM:** https://www.bapihvac.com/products/wam/
- **Headless Wireless:** https://bapi-headless.vercel.app/en/products/bluetooth-wireless
- **Headless WAM:** https://bapi-headless.vercel.app/en/wam

### Questions for Legacy Site Review:
1. How does the legacy site structure Wireless subcategories in navigation?
2. Is WAM shown as a wireless subcategory or a separate section?
3. What product filtering options are available on the Wireless page?
4. How are Room vs Non-Room sensors differentiated?

---

## Recommendations

### Option A: Match WordPress Structure Exactly
- Create subcategory links for all 7 wireless subcategories
- Expand mega-menu Wireless column to show all options
- Move WAM into Wireless column as a sibling to Bluetooth

### Option B: Simplified Mega-Menu (Current Approach)
- Keep 4 main wireless categories in mega-menu
- Link to specific subcategory pages where appropriate
- Keep WAM as featured section (premium solution callout)
- Use filtering on category pages for detailed navigation

### Option C: Hybrid Approach (Recommended)
- **Mega-Menu Wireless Column** (4 links):
  - "Room Sensors" → `/products/bluetooth-wireless/wireless-room`
  - "Non-Room Sensors" → `/products/bluetooth-wireless/wireless-non-room`
  - "Gateways & Output Modules" → `/products/bluetooth-wireless/wireless-gateway` (or parent page with filters)
  - "Wireless Accessories" → `/products/bluetooth-wireless/wireless-accessories` (already correct)
- **Featured Section:** Keep WAM as premium solution callout
- **Breadcrumb Navigation:** Show full hierarchy (Wireless Sensors > Bluetooth > Room)
- **Category Page Filters:** Allow filtering by all subcategories

---

## Next Steps

1. ✅ Document WordPress category structure
2. ✅ Review legacy site navigation (in progress - browser open)
3. ⏳ Compare legacy vs headless user experience
4. ⏳ Make team decision on navigation structure
5. ⏳ Update MegaMenu config with correct links
6. ⏳ Verify all subcategory pages work correctly
7. ⏳ Test breadcrumb navigation
8. ⏳ Update TERRY-QA-FEEDBACK-APR2026.md Issue #4 with resolution

---

## Related Issues

- **Terry QA Feedback #4:** Wireless Subcategory Routing Bug
- **Terry QA Feedback #22:** WAM "Real World Examples" (content issue, not structure)
- **MEGA-MENU-UPDATE-SUMMARY.md:** Previous wireless category fixes

---

## Technical Notes

**WordPress Category Parent-Child Relationships:**
```
310 (Wireless Sensors)
├── 674 (Bluetooth Low Energy) - 24 products
│   ├── 678 (Gateway) - 1 product
│   ├── 677 (Receivers) - 1 product
│   ├── 679 (Output Modules) - 6 products
│   ├── 675 (Room) - 5 products
│   ├── 676 (Non-Room) - 7 products
│   ├── 680 (Food Probe) - 2 products
│   └── 682 (Accessories) - 5 products
└── 348 (WAM) - 0 products
    ├── 349 (WAM Local) - 0 products
    └── 409 (WAM Remote) - 0 products
```

**Product Distribution:**
- Total Wireless Products: 24 (all under Bluetooth Low Energy)
- WAM Products: 0 (categories exist but no products assigned)

**URL Patterns:**
- Parent: `/products/wireless-sensors` (if needed)
- Main: `/products/bluetooth-wireless` (24 products)
- Subcategory: `/products/bluetooth-wireless/{subcategory-slug}`
- WAM: `/wam` (standalone page, not a product category)
