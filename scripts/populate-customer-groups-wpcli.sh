#!/bin/bash
# ================================================================
# BAPI Customer Group Product Assignment (WP-CLI Approach)
# ================================================================
# Purpose: Add customer_group1 meta to restricted products
# Date: April 1, 2026
# Run on: Kinsta staging server (after SSH)
# ================================================================

WP_PATH="/www/bapiheadlessstaging_582/public"

echo "=================================================="
echo "Populating Customer Groups for Products"
echo "=================================================="

# Function to update products by prefix
update_products() {
  local prefix=$1
  local group=$2
  local serialized_value="a:1:{i:0;s:${#group}:\"${group}\";}"
  
  echo -e "\nProcessing ${prefix} products (group: ${group})..."
  
  # Get product IDs
  local product_ids=$(wp post list \
    --post_type=product \
    --post_status=publish \
    --s="(${prefix})" \
    --field=ID \
    --format=csv \
    --path=${WP_PATH})
  
  local count=0
  
  # Add meta to each product
  for id in $product_ids; do
    wp post meta add $id customer_group1 "$serialized_value" --path=${WP_PATH} 2>/dev/null || \
    wp post meta update $id customer_group1 "$serialized_value" --path=${WP_PATH}
    count=$((count + 1))
  done
  
  echo "✓ Updated $count ${prefix} products"
}

# Update each group
update_products "ALC" "alc"
update_products "ACS" "acs"
update_products "EMC" "emc"
update_products "CCG" "ccg"

# Verify
echo -e "\n=================================================="
echo "Verification:"
echo "=================================================="

wp db query "SELECT 
  CASE 
    WHEN meta_value LIKE '%alc%' THEN 'ALC'
    WHEN meta_value LIKE '%acs%' THEN 'ACS'
    WHEN meta_value LIKE '%emc%' THEN 'EMC'
    WHEN meta_value LIKE '%ccg%' THEN 'CCG'
    ELSE 'Other'
  END as customer_group,
  COUNT(*) as product_count
FROM wp_postmeta pm
INNER JOIN wp_posts p ON pm.post_id = p.ID
WHERE pm.meta_key = 'customer_group1'
  AND p.post_type = 'product'
  AND p.post_status = 'publish'
  AND pm.meta_value != ''
GROUP BY customer_group
ORDER BY product_count DESC;" --path=${WP_PATH}

echo -e "\n✓ Customer group population complete!"
