# Customer Group Filtering - Slash Pattern Fix

**Date:** April 1, 2026  
**Issue:** Products with `PREFIX/` naming pattern (e.g., `CCG/H205-B4X-Z-CG-WMW`) were not being filtered  
**Status:** ✅ Code Fixed, ⏳ Database Needs Update

## Problem

Two naming patterns exist for customer-specific products:
1. `(PREFIX) Product Name` ← Original pattern (working)
2. `PREFIX/Product-Name` ← Slash pattern (was broken)

**Example:** `CCG/H205-B4X-Z-CG-WMW` was showing to guest users because our regex only matched `(CCG)` with parentheses.

## Fix Applied

### Code Changes (✅ DONE)

1. **Updated `extractCustomerGroupFromTitle()`** to match both patterns:
   ```typescript
   // Pattern 1: (ALC), (ACS), (EMC), (CCG)
   match = productName.match(/^\((\w+)\)/);
   
   // Pattern 2: ALC/, ACS/, EMC/, CCG/
   match = productName.match(/^([A-Z]{3})\//);
   ```

2. **Added 4 new tests** for slash pattern (30 total tests, all passing)

3. **Updated populate script** to search for both patterns

### Database Update Needed (⏳ TO DO)

The WordPress database still has products with `PREFIX/` names that **don't have customer_group1 assigned**.

## Fix Instructions

### Step 1: Restart Dev Server

```bash
# Stop the dev server (Ctrl+C in the terminal running pnpm run dev)
# Then restart it
cd /home/ateece/bapi-headless/web
pnpm run dev
```

### Step 2: Hard Refresh Browser

- **Chrome/Edge:** Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
- **Firefox:** Ctrl+F5 (Windows/Linux) or Cmd+Shift+R (Mac)
- **Or:** Open a new incognito/private window

### Step 3: Re-run Populate Script on Staging

The updated script will now find products with **both** naming patterns:

```bash
# From your local machine
cd /home/ateece/bapi-headless/scripts

# Run the updated populate script
bash setup-customer-groups.sh
```

**What it will do:**
- Search for products with `(ALC)` **AND** `ALC/` patterns
- Search for products with `(ACS)` **AND** `ACS/` patterns  
- Search for products with `(EMC)` **AND** `EMC/` patterns
- Search for products with `(CCG)` **AND** `CCG/` patterns
- Assign `customer_group1` metadata to all matches

### Step 4: Verify the Fix

1. **Check product counts in WordPress:**
   ```bash
   # SSH into staging
   ssh -p 17338 bapiheadlessstaging_582@35.224.70.159
   
   # Check how many products have each pattern
   wp db query "
   SELECT 
     CASE 
       WHEN post_title LIKE '(ALC)%' THEN 'ALC-parens'
       WHEN post_title LIKE 'ALC/%' THEN 'ALC-slash'
       WHEN post_title LIKE '(ACS)%' THEN 'ACS-parens'
       WHEN post_title LIKE 'ACS/%' THEN 'ACS-slash'
       WHEN post_title LIKE '(EMC)%' THEN 'EMC-parens'
       WHEN post_title LIKE 'EMC/%' THEN 'EMC-slash'
       WHEN post_title LIKE '(CCG)%' THEN 'CCG-parens'
       WHEN post_title LIKE 'CCG/%' THEN 'CCG-slash'
       ELSE 'Standard'
     END as pattern,
     COUNT(*) as count
   FROM wp_posts 
   WHERE post_type = 'product' 
   AND post_status = 'publish'
   GROUP BY pattern
   ORDER BY count DESC;
   " --path=/www/bapiheadlessstaging_582/public
   ```

2. **Test in browser:**
   - Navigate to: `http://localhost:3000/en/products/humidity-sensors/humidity-room`
   - **Guest user (incognito):** Should NOT see `CCG/H205-B4X-Z-CG-WMW`
   - **CCG user (`test-ccg@bapihvac.com`):** Should see it after login

## Expected Results After Fix

### Before Fix
- Guest users could see `CCG/H205-B4X-Z-CG-WMW` ❌
- Only products with `(PREFIX)` were filtered

### After Fix
- Guest users CANNOT see `CCG/H205-B4X-Z-CG-WMW` ✅
- Products with BOTH `(PREFIX)` and `PREFIX/` are filtered ✅

## Products to Watch

Based on the naming pattern analysis, we should verify these specific patterns:

1. **CCG products with slash:**
   - `CCG/H205-B4X-Z-CG-WMW` (seen in screenshot)
   - Any other `CCG/` prefixed products

2. **Check for other slash pattern products:**
   ```bash
   wp post list \
     --post_type=product \
     --post_status=publish \
     --s="ALC/" \
     --format=table \
     --fields=ID,post_title \
     --path=/www/bapiheadlessstaging_582/public
   
   # Repeat for ACS/, EMC/, CCG/
   ```

## Rollback Plan

If the fix causes issues:

```bash
# Revert the commit
git revert 1c3d8de

# Restart dev server
cd /home/ateece/bapi-headless/web
pnpm run dev
```

## Notes

- **Regex Pattern 1:** `^\((\w+)\)` → Matches `(ALC)`, `(ACS)`, etc.
- **Regex Pattern 2:** `^([A-Z]{3})\/` → Matches `ALC/`, `ACS/`, etc.
- Both patterns normalize to lowercase for comparison
- WordPress search uses `-s` flag which searches in title and content
- The slash pattern may be a SKU/part number format

## Testing Checklist

After applying all fixes:

- [ ] Dev server restarted
- [ ] Browser cache cleared (or using incognito)
- [ ] Populate script re-run on staging
- [ ] Guest user cannot see `CCG/H205-B4X-Z-CG-WMW`
- [ ] CCG user CAN see `CCG/H205-B4X-Z-CG-WMW` after login
- [ ] No other products broken by the change
- [ ] All 30 tests passing

## Questions?

If products still show after these steps:
1. Check the product name in WordPress admin
2. Verify the `customer_group1` meta field is set
3. Check browser console for any JavaScript errors
4. Verify the dev server picked up the code changes (check timestamp)
