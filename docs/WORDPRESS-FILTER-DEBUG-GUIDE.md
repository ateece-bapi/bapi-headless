# WordPress Filter Debugging Guide

## Issue: "Room Temp" Filter Returns 0 Products

**Screenshot Evidence:** Legacy site shows "Room Temp" filter selected but displays "No Products Found"

This indicates a WordPress data issue, not a headless implementation problem.

---

## Step 1: SSH into Kinsta Staging Server

```bash
ssh [your-kinsta-staging-server]
cd /www/[your-site-path]/public
```

---

## Step 2: Run WordPress Taxonomy Debug Script

Upload `scripts/debug-wordpress-taxonomy.php` to your WordPress root, then:

```bash
wp eval-file debug-wordpress-taxonomy.php
```

This will output:
1. **All Application taxonomy terms** with their slugs and product counts
2. **All products in "Room" category** with their actual attribute values
3. **Products that have "Room Temp" application** (should show why count is 0)
4. **Similar term names** to identify potential duplicates

---

## Step 3: Analyze Results

### Scenario A: Term Exists But No Products Assigned
**Symptom:** `pa_application` term "Room Temp" shows `count: 0`

**Cause:** Taxonomy term was created but never assigned to products

**Fix:**
1. Go to WordPress Admin → Products → Attributes → Application
2. Edit "Room Temp" term
3. Delete it if unused, OR
4. Manually assign to relevant products

### Scenario B: Products Use Different Term Name
**Symptom:** Products have attribute like "Room Temperature" or "Space Temp"

**Cause:** Multiple similar terms exist (data inconsistency)

**Fix:**
1. Identify the correct term name from most products
2. Merge duplicate terms:
   ```bash
   # WP-CLI command to merge terms
   wp term recount pa_application
   ```
3. Or create term alias mapping in headless frontend:
   ```typescript
   const TERM_ALIASES: Record<string, string[]> = {
     'room-temperature': ['room-temp', 'space-temp', 'room'],
   };
   ```

### Scenario C: Products Are Miscategorized
**Symptom:** Expected products are in different category

**Cause:** Products assigned to wrong product_cat

**Fix:**
1. Bulk edit products in WordPress admin
2. Re-assign to correct category

---

## Step 4: Verify GraphQL Data

Test in GraphQL IDE (https://[staging-url]/graphql):

```graphql
query TestRoomProducts {
  products(where: { category: "temp-room" }, first: 10) {
    nodes {
      name
      ... on SimpleProduct {
        attributes {
          nodes {
            name
            options
          }
        }
      }
    }
  }
  
  paApplications: allPaApplication {
    nodes {
      name
      slug
      count
    }
  }
}
```

**Expected Result:**
- Products should have `pa_application` attribute with values
- `allPaApplication` should show term counts matching product assignments

**If counts don't match:**
```bash
# Rebuild term counts
wp term recount pa_application --all
```

---

## Step 5: Test in Headless Site

After fixing WordPress data:

1. Clear Next.js cache:
   ```bash
   # In web/ directory
   rm -rf .next
   pnpm run dev
   ```

2. Visit: `http://localhost:3000/en/products/temperature-sensors/temp-room`

3. Check Filter Sidebar:
   - "Room Temp" should show correct count
   - Selecting it should display products

4. Enable debug mode: `?debug=filters`
   - Check console for filter matching logs

---

## Step 6: Compare Legacy vs Headless

Create test spreadsheet:

| Filter Option | Legacy Count | Headless Count | WordPress DB Count | Status |
|---------------|--------------|----------------|-------------------|--------|
| Room Temp | 0 | 0 | 0 | ✅ Match (data issue) |
| Averaging | 17 | 17 | ? | ❓ Verify |
| Duct Temp | 0 | ? | ? | ❓ Check |

**Goal:** Identify if discrepancies are due to:
- WordPress data issues (fix at source)
- GraphQL query issues (fix query)
- Client-side filter logic issues (fix TypeScript)

---

## Common WordPress Product Attribute Issues

### Issue 1: Orphaned Taxonomy Terms
**Symptom:** Term shows in filter but has 0 count

**Cause:** Products were deleted but terms remain

**Fix:**
```bash
wp term recount pa_application --all
```

### Issue 2: Inconsistent Term Naming
**Symptom:** "Room Temp" vs "Room Temperature" vs "Room Sensor"

**Cause:** Manual data entry without validation

**Fix:**
1. Export all terms: `wp term list pa_application --format=csv > terms.csv`
2. Identify duplicates
3. Merge using WordPress admin or WP-CLI
4. Standardize naming convention

### Issue 3: Hidden/Draft Products
**Symptom:** Term count includes unpublished products

**Cause:** Default WordPress term count doesn't filter by post_status

**Fix:**
```sql
-- SQL to check product statuses
SELECT post_status, COUNT(*) 
FROM wp_posts 
WHERE post_type = 'product' 
GROUP BY post_status;
```

Only published products should count toward filters.

### Issue 4: Variation Products vs Simple Products
**Symptom:** Variations have attributes, parent products don't

**Cause:** WooCommerce stores variation attributes separately

**Fix:** Ensure GraphQL query fetches both:
```graphql
... on VariableProduct {
  attributes {
    nodes {
      name
      options
    }
  }
}
```

---

## Testing Checklist

After fixing WordPress data:

- [ ] Run `wp term recount pa_application --all`
- [ ] Verify term counts in WordPress admin
- [ ] Test GraphQL query returns correct product attributes
- [ ] Test legacy site filter shows correct counts
- [ ] Test headless site filter shows correct counts
- [ ] Verify product count matches between legacy and headless
- [ ] Test with different customer groups (END USER, B2B)
- [ ] Document any remaining discrepancies

---

## Next Steps

1. **Run debug script** on Kinsta staging
2. **Share output** with development team
3. **Fix WordPress data** based on findings
4. **Re-test both sites** to confirm parity
5. **Update FILTER-PARITY-ANALYSIS.md** with actual root causes found

---

**Document Created:** April 13, 2026  
**Related:** FILTER-PARITY-ANALYSIS.md  
**Status:** Investigation in progress
