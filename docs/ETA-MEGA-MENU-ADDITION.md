# ETA Mega-Menu Addition - April 29, 2026

## Issue

ETA product line (70 products) was completely missing from the headless site's mega-menu navigation.

## Investigation

### WordPress Structure

```bash
ssh -p 17338 bapiheadlessstaging@35.224.70.159 "cd public && wp term list product_cat --search='ETA' --fields=term_id,name,slug,parent,count"

# Result:
term_id name      slug      parent  count
309     ETA Line  eta-line  0       70

# Check for subcategories:
wp term list product_cat --parent=309 --fields=term_id,name,slug,count

# Result: EMPTY (no subcategories)
```

**Finding:**
- ETA Line is a top-level category (parent=0)
- Has 70 products
- Has NO subcategories
- Same pattern as Accessories and Test Instruments

### Legacy Site Comparison

**URL:** https://www.bapihvac.com/

**Navigation Structure:**
```
Products (dropdown)
  ├── Test Instruments → /products/test-instruments/
  ├── Temperature Sensors → /products/temperature-sensors/
  ├── Humidity Sensors → /products/humidity-sensors/
  ├── Pressure Sensors → /products/pressure-sensors/
  ├── Air Quality → /products/air-quality-sensors/
  ├── Wireless → /products/wireless-sensors/
  ├── Accessories → /products/accessories/
  ├── ETA → /products/eta-line/  ✅ Simple link
  └── WAM → /wam/
```

**Key Finding:** ETA appears in Products dropdown as a simple link (no subcategories), same pattern as Accessories and Test Instruments.

### Headless Site Current State

**Before Fix:**
- ETA was **completely absent** from mega-menu
- No config entry in `web/src/components/layout/Header/config.ts`
- Users could only access `/products/eta-line` via footer or direct URL

**Footer had ETA:**
```json
// web/messages/en.json (lines 767-769)
"etaLine": {
  "name": "ETA Line",
  "description": "Modular I/O and control"
}
```

But no mega-menu entry.

## Solution Implemented

Applied same single-link pattern as Accessories and Test Instruments:

### 1. Added ETA to Mega-Menu Config

```typescript
// web/src/components/layout/Header/config.ts
{
  title: t('products.etaLine.title'),
  slug: 'eta-line',
  icon: '/images/icons/ETA_Icon.webp',
  links: [
    {
      label: t('products.etaLine.allEtaLine'),
      href: '/products/eta-line',
      description: t('products.etaLine.allEtaLineDesc'),
    },
  ],
}
```

### 2. Added Translation Keys

```json
// web/messages/en.json
"etaLine": {
  "title": "ETA Line",
  "allEtaLine": "All ETA Products",
  "allEtaLineDesc": "Modular I/O and control solutions for building automation"
}
```

**Note:** Enhanced description from footer's "Modular I/O and control" to more descriptive "Modular I/O and control solutions for building automation"

## Impact

### Before
❌ ETA completely missing from main navigation  
❌ Users cannot discover ETA products via mega-menu  
❌ Inconsistent with legacy site navigation  
❌ Missing 70 products from primary navigation path

### After
✅ ETA appears in Products mega-menu  
✅ Single "All ETA Products" link to `/products/eta-line`  
✅ Matches WordPress structure (no subcategories)  
✅ Consistent with legacy site navigation  
✅ Follows same pattern as Accessories and Test Instruments  
✅ Clear, descriptive mega-menu entry

## Pattern Recognition

**Categories with NO WordPress subcategories → Single "All" link:**
1. ✅ Accessories (Issue #9) - Fixed April 29, 2026
2. ✅ Test Instruments - Fixed April 29, 2026
3. ✅ ETA Line - Fixed April 29, 2026 (this fix)

**Categories with real subcategories → Multiple links:**
- Temperature Sensors (6 subcategories in mega-menu)
- Humidity Sensors (3 subcategories)
- Pressure Sensors (3 subcategories)
- Air Quality Sensors (6 subcategories)
- Wireless (4 subcategories)

## Testing

### Build Validation
```bash
cd /home/ateece/bapi-headless/web && pnpm run build
# ✓ Compiled successfully in 9.0s
# ✓ TypeScript validation passed
# ✓ Generated 852 static pages
# Exit code: 0 ✅
```

### Manual QA Needed
- [ ] Verify ETA appears in mega-menu on staging
- [ ] Click "All ETA Products" link navigates to `/products/eta-line`
- [ ] Verify icon displays correctly (ETA_Icon.webp)
- [ ] Test mega-menu layout with 8 columns (temp, humidity, pressure, air quality, wireless, accessories, test instruments, ETA)
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)

## Files Changed

1. `web/src/components/layout/Header/config.ts` - Added ETA column to mega-menu
2. `web/messages/en.json` - Added etaLine translation keys with enhanced description

## Related Issues

- Issue #9: Accessories Subcategories Wrong (same pattern, resolved)
- Test Instruments fix (same pattern, resolved April 29, 2026)

## Recommendations

1. **Icon Asset:** Verify `/images/icons/ETA_Icon.webp` exists in production, or update path if different
2. **Mega-Menu Layout:** With 8 product columns, consider UI/UX review for optimal spacing
3. **Systematic Review:** All top-level categories now verified against WordPress:
   - ✅ Temperature (6 subcategories)
   - ✅ Humidity (3 subcategories)
   - ✅ Pressure (3 subcategories)
   - ✅ Air Quality (6 subcategories)
   - ✅ Wireless (4 subcategories)
   - ✅ Accessories (0 subcategories - single link)
   - ✅ Test Instruments (0 subcategories - single link)
   - ✅ ETA Line (0 subcategories - single link)
   - ✅ WAM (featured section - separate pattern)

## Business Context

**ETA Line** is a significant product category with 70 products (more than Test Instruments' 13 products). Missing it from the main navigation was a critical gap in product discoverability.

**Product Examples from WordPress:**
- Modular I/O controllers
- Building automation control modules
- Input/output expansion cards
- Integration solutions

These are professional-grade products that should be prominently featured alongside sensors in the mega-menu.
