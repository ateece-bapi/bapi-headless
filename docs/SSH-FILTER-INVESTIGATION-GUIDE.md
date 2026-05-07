# SSH WordPress Filter Investigation Guide

**Date:** May 7, 2026  
**Issue:** Missing products and filter discrepancies between legacy and headless sites  
**Objective:** Investigate WordPress database to understand filter implementation and identify missing products

---

## Quick Start Checklist

- [ ] SSH into Kinsta staging server
- [ ] Run taxonomy debug script
- [ ] Execute SQL queries to understand filter structure
- [ ] Compare filter counts between legacy and headless
- [ ] Identify missing products and their taxonomy assignments
- [ ] Document findings for headless implementation

---

## Step 1: SSH into Kinsta Server

### Get SSH Credentials from Kinsta Dashboard

1. Login to Kinsta Dashboard: https://my.kinsta.com
2. Navigate to your staging site
3. Go to **Info** tab
4. Scroll to **SFTP/SSH** section
5. Copy SSH connection string

### Connect via SSH

```bash
# Replace with your actual connection details from Kinsta
ssh [username]@[host] -p [port]

# Example (adjust to your site):
# ssh bapiheadlessstaging_582@[IP] -p 12345
```

### Navigate to WordPress Root

```bash
# Find your WordPress installation path
cd /www/bapiheadlessstaging_582/public

# Verify you're in the right place
ls -la wp-config.php

# Should show wp-config.php file
```

---

## Step 2: Run WordPress Taxonomy Debug Script

### Upload Debug Script (If Not Already Present)

The debug script is located at: `bapi-headless/scripts/debug-wordpress-taxonomy.php`

**Option A: Upload via SFTP**
1. Use FileZilla or your SFTP client
2. Upload `debug-wordpress-taxonomy.php` to WordPress root directory
3. Verify file exists: `ls -la debug-wordpress-taxonomy.php`

**Option B: Create Directly on Server**
```bash
# Create file on server
nano debug-wordpress-taxonomy.php

# Paste the script content from local file
# Save with Ctrl+X, then Y, then Enter
```

### Run Debug Script via WP-CLI

```bash
# Run the debug script
wp eval-file debug-wordpress-taxonomy.php --path=/www/bapiheadlessstaging_582/public

# Save output to file for analysis
wp eval-file debug-wordpress-taxonomy.php --path=/www/bapiheadlessstaging_582/public > taxonomy-debug-output.txt

# View the output
cat taxonomy-debug-output.txt
```

### Expected Output

The script will show:
1. **All Application taxonomy terms** with slugs and counts
2. **Products in "Room" category** with their attributes
3. **Products with "Room Temp" application** (to verify filter accuracy)
4. **Similar term names** (to identify duplicates)

**Example Output:**
```
=== PA_APPLICATION TAXONOMY TERMS ===
ID: 123 | Name: 'Room Temp' | Slug: 'room-temp' | Count: 7
ID: 124 | Name: 'Averaging' | Slug: 'averaging' | Count: 17

=== PRODUCTS IN 'ROOM' CATEGORY ===
Found 42 products in temp-room category

Product: BA/10K-3-D1 (ID: 1234)
  - Application: Room Temp, Averaging
  - Room Enclosure Style: D1
  - Sensor Output: 10K-3
```

---

## Step 3: Investigate Product Taxonomy Assignments

### Query 1: Find ALL Product Attribute Taxonomies

```bash
wp eval "
\$taxonomies = get_taxonomies(['object_type' => ['product']], 'objects');
foreach (\$taxonomies as \$tax) {
    if (strpos(\$tax->name, 'pa_') === 0) {
        echo \$tax->name . ' | ' . \$tax->label . PHP_EOL;
        \$terms = get_terms(['taxonomy' => \$tax->name, 'hide_empty' => false]);
        echo '  Terms: ' . count(\$terms) . PHP_EOL;
    }
}
" --path=/www/bapiheadlessstaging_582/public
```

**Purpose:** Identify ALL product attribute taxonomies used by WooCommerce (pa_* taxonomies)

**Expected Output:**
```
pa_application | Application
  Terms: 25
pa_room_enclosure_style | Room Enclosure Style  
  Terms: 8
pa_temperature_sensor_output | Temperature Sensor Output
  Terms: 12
...
```

### Query 2: Count Products by Category

```bash
wp eval "
\$categories = get_terms(['taxonomy' => 'product_cat', 'hide_empty' => false]);
foreach (\$categories as \$cat) {
    echo sprintf('%s (%s): %d products%s', \$cat->name, \$cat->slug, \$cat->count, PHP_EOL);
}
" --path=/www/bapiheadlessstaging_582/public
```

**Purpose:** Verify product counts match between WordPress and headless site

### Query 3: Find Products NOT Showing in Headless Site

**First, identify a specific product that's missing.** Then run:

```bash
# Replace PRODUCT_SLUG with the actual product slug
wp eval "
\$product = get_page_by_path('PRODUCT_SLUG', OBJECT, 'product');
if (\$product) {
    echo 'Product ID: ' . \$product->ID . PHP_EOL;
    echo 'Title: ' . \$product->post_title . PHP_EOL;
    echo 'Status: ' . \$product->post_status . PHP_EOL;
    
    \$product_obj = wc_get_product(\$product->ID);
    
    // Check categories
    echo 'Categories: ' . PHP_EOL;
    \$cats = get_the_terms(\$product->ID, 'product_cat');
    foreach (\$cats as \$cat) {
        echo '  - ' . \$cat->name . ' (' . \$cat->slug . ')' . PHP_EOL;
    }
    
    // Check all attributes
    echo 'Attributes: ' . PHP_EOL;
    \$attributes = \$product_obj->get_attributes();
    foreach (\$attributes as \$attribute) {
        if (\$attribute->is_taxonomy()) {
            \$terms = wc_get_product_terms(\$product->ID, \$attribute->get_name(), ['fields' => 'names']);
            echo '  - ' . \$attribute->get_name() . ': ' . implode(', ', \$terms) . PHP_EOL;
        }
    }
    
    // Check customer groups
    echo 'Customer Groups: ' . PHP_EOL;
    echo '  - Group 1: ' . get_post_meta(\$product->ID, 'customer_group1', true) . PHP_EOL;
    echo '  - Group 2: ' . get_post_meta(\$product->ID, 'customer_group2', true) . PHP_EOL;
    echo '  - Group 3: ' . get_post_meta(\$product->ID, 'customer_group3', true) . PHP_EOL;
} else {
    echo 'Product not found';
}
" --path=/www/bapiheadlessstaging_582/public
```

**Purpose:** Investigate why a specific product isn't appearing in headless site

**Possible Reasons:**
1. **Product status** is `draft`, `private`, or `pending` (GraphQL only returns `publish`)
2. **Customer group** filtering is excluding it
3. **Category assignment** is different than expected
4. **Missing taxonomy terms** required by filters

---

## Step 4: Direct Database Queries (Advanced)

### Connect to MySQL Database

```bash
# Get database credentials from wp-config.php
cat wp-config.php | grep DB_NAME
cat wp-config.php | grep DB_USER
cat wp-config.php | grep DB_PASSWORD
cat wp-config.php | grep DB_HOST

# Connect to MySQL
mysql -h [DB_HOST] -u [DB_USER] -p[DB_PASSWORD] [DB_NAME]
```

### SQL Query 1: Find Products with Specific Filter Attributes

```sql
-- Find all products with "Room Temp" application
SELECT 
    p.ID,
    p.post_title,
    p.post_status,
    t.name AS application
FROM wp_posts p
JOIN wp_term_relationships tr ON p.ID = tr.object_id
JOIN wp_term_taxonomy tt ON tr.term_taxonomy_id = tt.term_taxonomy_id
JOIN wp_terms t ON tt.term_id = t.term_id
WHERE p.post_type = 'product'
AND tt.taxonomy = 'pa_application'
AND t.slug LIKE '%room%'
ORDER BY p.post_title;
```

### SQL Query 2: Count Products by Filter Taxonomy

```sql
-- Count products for each application filter option
SELECT 
    t.name AS filter_option,
    t.slug,
    COUNT(DISTINCT p.ID) AS product_count,
    tt.count AS wordpress_count
FROM wp_terms t
JOIN wp_term_taxonomy tt ON t.term_id = tt.term_id
LEFT JOIN wp_term_relationships tr ON tt.term_taxonomy_id = tr.term_taxonomy_id
LEFT JOIN wp_posts p ON tr.object_id = p.ID AND p.post_type = 'product' AND p.post_status = 'publish'
WHERE tt.taxonomy = 'pa_application'
GROUP BY t.term_id, t.name, t.slug, tt.count
ORDER BY product_count DESC;
```

**Purpose:** Compare WordPress term counts with actual published products

### SQL Query 3: Find Products by Customer Group

```sql
-- Find all products restricted to specific customer groups
SELECT 
    p.ID,
    p.post_title,
    pm1.meta_value AS customer_group1,
    pm2.meta_value AS customer_group2,
    pm3.meta_value AS customer_group3
FROM wp_posts p
LEFT JOIN wp_postmeta pm1 ON p.ID = pm1.post_id AND pm1.meta_key = 'customer_group1'
LEFT JOIN wp_postmeta pm2 ON p.ID = pm2.post_id AND pm2.meta_key = 'customer_group2'
LEFT JOIN wp_postmeta pm3 ON p.ID = pm3.post_id AND pm3.meta_key = 'customer_group3'
WHERE p.post_type = 'product'
AND p.post_status = 'publish'
AND (pm1.meta_value IS NOT NULL OR pm2.meta_value IS NOT NULL OR pm3.meta_value IS NOT NULL)
ORDER BY p.post_title;
```

**Purpose:** Identify B2B-restricted products that might be filtered out for guest users

### SQL Query 4: Compare Legacy vs Headless Filter Options

```sql
-- Get ALL taxonomy terms with their counts for a specific taxonomy
SELECT 
    t.name,
    t.slug,
    tt.count AS term_count,
    tt.taxonomy
FROM wp_terms t
JOIN wp_term_taxonomy tt ON t.term_id = tt.term_id
WHERE tt.taxonomy IN (
    'pa_application',
    'pa_room_enclosure_style',
    'pa_temperature_sensor_output',
    'pa_display',
    'pa_temp_setpoint_and_override',
    'pa_optional_temp_sensor_output'
)
ORDER BY tt.taxonomy, term_count DESC;
```

**Purpose:** Export complete filter data to compare with headless GraphQL response

---

## Step 5: Rebuild Taxonomy Term Counts

WordPress term counts can become outdated. Rebuild them:

```bash
# Rebuild ALL product attribute taxonomy counts
wp term recount pa_application --all --path=/www/bapiheadlessstaging_582/public
wp term recount pa_room_enclosure_style --all --path=/www/bapiheadlessstaging_582/public
wp term recount pa_temperature_sensor_output --all --path=/www/bapiheadlessstaging_582/public
wp term recount pa_display --all --path=/www/bapiheadlessstaging_582/public
wp term recount pa_temp_setpoint_and_override --all --path=/www/bapiheadlessstaging_582/public
wp term recount pa_optional_temp_sensor_output --all --path=/www/bapiheadlessstaging_582/public

# Or rebuild ALL taxonomy counts at once
wp term recount $(wp term list pa_application --field=taxonomy --path=/www/bapiheadlessstaging_582/public) --all
```

**When to use:** If filter counts in WordPress admin don't match actual products

---

## Step 6: Test GraphQL Queries Directly

### Install GraphiQL Chrome Extension or Use GraphQL IDE

Access: `https://your-staging-url.kinsta.cloud/graphql`

### Query 1: Test Product Filtering

```graphql
query TestProductFilters {
  products(where: { category: "temp-room" }, first: 100) {
    nodes {
      id
      name
      ... on SimpleProduct {
        allPaApplication {
          nodes {
            name
            slug
          }
        }
        allPaRoomEnclosureStyle {
          nodes {
            name
            slug
          }
        }
        allPaTemperatureSensorOutput {
          nodes {
            name
            slug
          }
        }
      }
    }
  }
}
```

**Purpose:** Verify GraphQL returns product attributes correctly

### Query 2: Test Filter Taxonomy Terms

```graphql
query GetFilterOptions {
  paApplications: allPaApplication(first: 100) {
    nodes {
      id
      name
      slug
      count
    }
  }
  
  paRoomEnclosureStyles: allPaRoomEnclosureStyle(first: 100) {
    nodes {
      id
      name
      slug
      count
    }
  }
}
```

**Purpose:** Compare GraphQL taxonomy counts with WordPress database counts

---

## Step 7: Compare Legacy Site Filter Implementation

### Find Legacy Theme Files

```bash
# Find the active theme
wp theme list --status=active --path=/www/bapiheadlessstaging_582/public

# Navigate to theme directory
cd wp-content/themes/[your-theme-name]

# Search for filter implementation
grep -r "product_cat" .
grep -r "pa_application" .
grep -r "WC_Query" .

# Check for custom WooCommerce template overrides
ls -la woocommerce/
```

**Purpose:** Understand how legacy site implements filters (might use custom queries)

### Check for Custom Plugins Affecting Filters

```bash
# List active plugins
wp plugin list --status=active --path=/www/bapiheadlessstaging_582/public

# Search for filter-related code in plugins
cd wp-content/plugins
grep -r "pre_get_posts" .
grep -r "woocommerce_product_query" .
```

**Purpose:** Identify custom code that modifies product queries

---

## Step 8: Export Data for Analysis

### Export All Products with Attributes

```bash
# Export to CSV for spreadsheet analysis
wp eval "
\$products = get_posts(['post_type' => 'product', 'posts_per_page' => -1, 'post_status' => 'publish']);
echo 'ID,Title,Categories,Application,Enclosure,Output,Customer_Group1' . PHP_EOL;
foreach (\$products as \$p) {
    \$product = wc_get_product(\$p->ID);
    \$cats = wp_get_post_terms(\$p->ID, 'product_cat', ['fields' => 'names']);
    \$apps = wp_get_post_terms(\$p->ID, 'pa_application', ['fields' => 'names']);
    \$enc = wp_get_post_terms(\$p->ID, 'pa_room_enclosure_style', ['fields' => 'names']);
    \$out = wp_get_post_terms(\$p->ID, 'pa_temperature_sensor_output', ['fields' => 'names']);
    \$cg = get_post_meta(\$p->ID, 'customer_group1', true);
    
    echo sprintf(
        '%d,%s,%s,%s,%s,%s,%s%s',
        \$p->ID,
        \$p->post_title,
        implode('|', \$cats),
        implode('|', \$apps),
        implode('|', \$enc),
        implode('|', \$out),
        \$cg,
        PHP_EOL
    );
}
" --path=/www/bapiheadlessstaging_582/public > products-export.csv
```

**Download the CSV:**
```bash
# From your local machine
scp [username]@[host]:/www/bapiheadlessstaging_582/public/products-export.csv ./
```

**Purpose:** Analyze all products in spreadsheet to identify patterns

---

## Common Issues & Solutions

### Issue 1: Product Shows in Legacy but NOT in Headless

**Diagnosis Steps:**
1. Check product status: `wp post get [ID] --path=...`
2. Verify customer group: `wp post meta get [ID] customer_group1 --path=...`
3. Test GraphQL query for that specific product

**Possible Causes:**
- Product is `draft` or `private` (GraphQL only returns `publish`)
- Customer group filtering excludes it
- Category assignment differs from expected
- Missing in GraphQL response due to query limits

### Issue 2: Filter Count Mismatch

**Diagnosis:**
1. Run `wp term recount pa_application --all`
2. Compare SQL query count vs WordPress term count
3. Check for unpublished products included in counts

**Possible Causes:**
- Outdated term counts (rebuild with `wp term recount`)
- Draft products counted in WordPress but not GraphQL
- Customer group filtering applied differently

### Issue 3: Filter Option Exists but Returns 0 Products

**Diagnosis:**
1. Run taxonomy debug script
2. Check if products actually have that taxonomy term assigned
3. Verify term slug matches query

**Possible Causes:**
- Orphaned taxonomy term (no products assigned)
- Term name/slug mismatch between legacy and headless
- Products in different category than expected

---

## Checklist for Investigation

- [ ] SSH into Kinsta staging server
- [ ] Run `debug-wordpress-taxonomy.php` script
- [ ] Execute WP-CLI commands to list all taxonomies
- [ ] Run SQL queries to count products by filter
- [ ] Rebuild taxonomy term counts with `wp term recount`
- [ ] Test GraphQL queries in GraphiQL
- [ ] Compare filter counts: WordPress DB vs GraphQL vs Legacy Site vs Headless
- [ ] Export product data to CSV for analysis
- [ ] Check for custom legacy theme filter code
- [ ] Document findings in a summary document
- [ ] Identify specific missing products (IDs and names)
- [ ] Determine root cause (data issue, query issue, or filter logic issue)

---

## Next Steps After Investigation

1. **Create Investigation Summary Document**
   - List all filter discrepancies found
   - Identify missing products with IDs
   - Document taxonomy term inconsistencies
   - Note customer group filtering differences

2. **Fix WordPress Data Issues**
   - Publish draft products if needed
   - Correct taxonomy term assignments
   - Merge duplicate taxonomy terms
   - Rebuild term counts

3. **Update Headless GraphQL Queries**
   - Add missing taxonomies to queries
   - Verify all 15 filter taxonomies are included
   - Test query performance with full attribute data

4. **Update Headless Filter Logic**
   - Ensure filter matching logic handles all cases
   - Add customer group filtering if needed
   - Update filter UI to match legacy site

5. **Test & Validate**
   - Compare filter counts between legacy and headless
   - Verify all products appear in correct categories
   - Test with different customer group users
   - Document remaining discrepancies (if any)

---

**Document Created:** May 7, 2026  
**Related Docs:**
- `/docs/FILTER-PARITY-ANALYSIS.md`
- `/docs/WORDPRESS-FILTER-DEBUG-GUIDE.md`
- `/docs/CUSTOMER-GROUP-FILTERING.md`
- `/scripts/debug-wordpress-taxonomy.php`

**Status:** Ready for investigation
