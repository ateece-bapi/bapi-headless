-- ================================================================
-- BAPI Customer Group Product Assignment Script
-- ================================================================
-- Purpose: Populate customer_group1 meta field for restricted products
-- Date: April 1, 2026
-- Run via SSH: wp db query "$(cat populate-customer-groups.sql)" --path=/www/bapiheadlessstaging_582/public
--
-- Product Distribution (verified via SSH):
-- - 112 (ALC) products
-- - 9 (EMC) products  
-- - 7 (CCG) products
-- - 4 (ACS) products
-- - Total: 132 restricted products
-- ================================================================

-- Step 1: Ensure customer_group1 meta_key exists for all products
-- (Insert if not exists - ACF typically creates this on product edit)
INSERT INTO wp_postmeta (post_id, meta_key, meta_value)
SELECT p.ID, 'customer_group1', ''
FROM wp_posts p
WHERE p.post_type = 'product'
  AND p.post_status = 'publish'
  AND NOT EXISTS (
    SELECT 1 FROM wp_postmeta pm 
    WHERE pm.post_id = p.ID 
    AND pm.meta_key = 'customer_group1'
  );

-- Step 2: Update (ALC) products - 112 products
-- ACF stores select fields as serialized PHP arrays
-- Format: a:1:{i:0;s:3:"alc";} means array with 1 element, value "alc"
UPDATE wp_postmeta pm
INNER JOIN wp_posts p ON pm.post_id = p.ID
SET pm.meta_value = 'a:1:{i:0;s:3:"alc";}'
WHERE pm.meta_key = 'customer_group1'
  AND p.post_type = 'product'
  AND p.post_status = 'publish'
  AND p.post_title LIKE '(ALC)%';

-- Step 3: Update (ACS) products - 4 products
UPDATE wp_postmeta pm
INNER JOIN wp_posts p ON pm.post_id = p.ID
SET pm.meta_value = 'a:1:{i:0;s:3:"acs";}'
WHERE pm.meta_key = 'customer_group1'
  AND p.post_type = 'product'
  AND p.post_status = 'publish'
  AND p.post_title LIKE '(ACS)%';

-- Step 4: Update (EMC) products - 9 products
UPDATE wp_postmeta pm
INNER JOIN wp_posts p ON pm.post_id = p.ID
SET pm.meta_value = 'a:1:{i:0;s:3:"emc";}'
WHERE pm.meta_key = 'customer_group1'
  AND p.post_type = 'product'
  AND p.post_status = 'publish'
  AND p.post_title LIKE '(EMC)%';

-- Step 5: Update (CCG) products - 7 products
UPDATE wp_postmeta pm
INNER JOIN wp_posts p ON pm.post_id = p.ID
SET pm.meta_value = 'a:1:{i:0;s:3:"ccg";}'
WHERE pm.meta_key = 'customer_group1'
  AND p.post_type = 'product'
  AND p.post_status = 'publish'
  AND p.post_title LIKE '(CCG)%';

-- ================================================================
-- Verification Queries
-- ================================================================

-- Count products by customer group
SELECT 
  CASE 
    WHEN meta_value LIKE '%alc%' THEN 'ALC'
    WHEN meta_value LIKE '%acs%' THEN 'ACS'
    WHEN meta_value LIKE '%emc%' THEN 'EMC'
    WHEN meta_value LIKE '%ccg%' THEN 'CCG'
    WHEN meta_value = '' OR meta_value IS NULL THEN 'Standard (no restriction)'
    ELSE 'Other'
  END as customer_group,
  COUNT(*) as product_count
FROM wp_postmeta pm
INNER JOIN wp_posts p ON pm.post_id = p.ID
WHERE pm.meta_key = 'customer_group1'
  AND p.post_type = 'product'
  AND p.post_status = 'publish'
GROUP BY customer_group
ORDER BY product_count DESC;

-- Show sample of products with customer groups
SELECT 
  p.post_title,
  pm.meta_value as customer_group1_raw,
  CASE 
    WHEN pm.meta_value LIKE '%alc%' THEN 'alc'
    WHEN pm.meta_value LIKE '%acs%' THEN 'acs'
    WHEN pm.meta_value LIKE '%emc%' THEN 'emc'
    WHEN pm.meta_value LIKE '%ccg%' THEN 'ccg'
    ELSE 'none'
  END as customer_group_parsed
FROM wp_posts p
INNER JOIN wp_postmeta pm ON p.ID = pm.post_id
WHERE p.post_type = 'product'
  AND p.post_status = 'publish'
  AND pm.meta_key = 'customer_group1'
  AND pm.meta_value != ''
ORDER BY p.post_title
LIMIT 20;
