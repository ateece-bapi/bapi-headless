#!/bin/bash
# WordPress Category Diagnostic - Check Current State
# Run this via SSH on Kinsta staging to see what actually exists

echo "🔍 WordPress Category Diagnostic"
echo "================================"
echo ""

# Check WordPress connection
echo "📌 Step 1: Verify WordPress"
echo "----------------------------"
wp core version
echo ""

# Get parent category ID
echo "📌 Step 2: Find Temperature Sensors Parent"
echo "-------------------------------------------"
PARENT_ID=$(wp term list product_cat --slug="temperature-sensors" --field=term_id --format=csv)
if [ -n "$PARENT_ID" ]; then
  echo "✅ Found Temperature Sensors (ID: $PARENT_ID)"
else
  echo "❌ ERROR: Temperature Sensors parent category not found!"
  exit 1
fi
echo ""

# List ALL current temperature subcategories
echo "📌 Step 3: Current Temperature Subcategories"
echo "---------------------------------------------"
wp term list product_cat --parent=$PARENT_ID --fields=name,slug,count --format=table
echo ""

# Count total products
TOTAL=$(wp term list product_cat --parent=$PARENT_ID --field=count --format=csv | paste -sd+ | bc)
echo "Total products across subcategories: $TOTAL"
echo ""

# Check if new categories exist
echo "📌 Step 4: Check for New Application-Based Categories"
echo "------------------------------------------------------"
NEW_CATS=("temp-room-temp" "temp-duct" "temp-averaging" "temp-immersion" "temp-remote-probes-and-sensors" "temp-submersible" "temp-outside-air" "temp-strap" "temp-thermobuffer-freezer-cooler" "temp-extreme-temperature")

for slug in "${NEW_CATS[@]}"; do
  TERM_ID=$(wp term list product_cat --slug="$slug" --field=term_id --format=csv 2>/dev/null)
  if [ -n "$TERM_ID" ]; then
    COUNT=$(wp term list product_cat --slug="$slug" --field=count --format=csv)
    echo "✅ $slug (ID: $TERM_ID, $COUNT products)"
  else
    echo "❌ $slug - NOT FOUND (needs to be created)"
  fi
done
echo ""

# Check if old categories exist
echo "📌 Step 5: Check for Old Categories to Remove"
echo "----------------------------------------------"
OLD_CATS=("temp-room" "temp-non-room" "temp-bapi-stat-4" "temp-button-sensor" "temp-decora-style")

for slug in "${OLD_CATS[@]}"; do
  TERM_ID=$(wp term list product_cat --slug="$slug" --field=term_id --format=csv 2>/dev/null)
  if [ -n "$TERM_ID" ]; then
    COUNT=$(wp term list product_cat --slug="$slug" --field=count --format=csv)
    echo "⚠️  $slug (ID: $TERM_ID, $COUNT products) - Should be removed after migration"
  else
    echo "✅ $slug - Already removed"
  fi
done
echo ""

# Check for products without application attribute
echo "📌 Step 6: Products Missing Application Attribute"
echo "---------------------------------------------------"
# This query finds products in temperature-sensors without pa_application
MISSING_COUNT=$(wp db query "
  SELECT COUNT(DISTINCT p.ID)
  FROM wp_posts p
  INNER JOIN wp_term_relationships tr ON p.ID = tr.object_id
  INNER JOIN wp_term_taxonomy tt ON tr.term_taxonomy_id = tt.term_taxonomy_id
  INNER JOIN wp_terms t ON tt.term_id = t.term_id
  LEFT JOIN wp_postmeta pm ON p.ID = pm.post_id AND pm.meta_key = 'attribute_pa_application'
  WHERE p.post_type = 'product'
  AND t.slug = 'temperature-sensors'
  AND pm.meta_id IS NULL
" --skip-column-names)

echo "Products without application attribute: $MISSING_COUNT"
if [ "$MISSING_COUNT" -gt "0" ]; then
  echo ""
  echo "📋 List of products needing application tags:"
  wp db query "
    SELECT p.ID, p.post_title
    FROM wp_posts p
    INNER JOIN wp_term_relationships tr ON p.ID = tr.object_id
    INNER JOIN wp_term_taxonomy tt ON tr.term_taxonomy_id = tt.term_taxonomy_id
    INNER JOIN wp_terms t ON tt.term_id = t.term_id
    LEFT JOIN wp_postmeta pm ON p.ID = pm.post_id AND pm.meta_key = 'attribute_pa_application'
    WHERE p.post_type = 'product'
    AND t.slug = 'temperature-sensors'
    AND pm.meta_id IS NULL
    LIMIT 20
  " --skip-column-names
fi
echo ""

# Summary
echo "📌 Step 7: Migration Status Summary"
echo "------------------------------------"
NEW_EXISTS=0
for slug in "${NEW_CATS[@]}"; do
  TERM_ID=$(wp term list product_cat --slug="$slug" --field=term_id --format=csv 2>/dev/null)
  if [ -n "$TERM_ID" ]; then
    NEW_EXISTS=$((NEW_EXISTS + 1))
  fi
done

echo "New categories created: $NEW_EXISTS / 10"
echo "Products needing application tags: $MISSING_COUNT"
echo ""

if [ "$NEW_EXISTS" -eq "10" ] && [ "$MISSING_COUNT" -eq "0" ]; then
  echo "✅ MIGRATION COMPLETE - Frontend should work!"
elif [ "$NEW_EXISTS" -eq "0" ]; then
  echo "⚠️  MIGRATION NOT STARTED - Need to run full migration"
else
  echo "⚠️  MIGRATION IN PROGRESS - Need to complete remaining steps"
fi
echo ""

echo "🔗 Next Steps:"
echo "--------------"
if [ "$NEW_EXISTS" -lt "10" ]; then
  echo "1. Create missing categories (see KINSTA-SSH-QUICKSTART.md Step B)"
fi
if [ "$MISSING_COUNT" -gt "0" ]; then
  echo "2. Tag $MISSING_COUNT products with application attribute"
fi
if [ "$NEW_EXISTS" -eq "10" ]; then
  echo "3. Run reassignment script (KINSTA-SSH-QUICKSTART.md Step D)"
  echo "4. Validate GraphQL results"
  echo "5. Test frontend links"
fi
echo ""
