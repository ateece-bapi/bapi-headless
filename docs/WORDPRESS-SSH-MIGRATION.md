# WordPress Migration via SSH/WP-CLI - Quick Guide

**Estimated Time:** 15-30 minutes (vs 3-4 hours in admin GUI)

---

## Prerequisites

1. **SSH Access to Kinsta Staging:**
   ```bash
   ssh your-username@your-kinsta-staging-server.kinsta.cloud
   ```

2. **WP-CLI Installed** (Kinsta includes this by default):
   ```bash
   wp --version
   # Should show: WP-CLI 2.x.x
   ```

3. **Navigate to WordPress root:**
   ```bash
   cd /www/bapiheadlessstaging_123/public  # Adjust path for your Kinsta setup
   # Or find it:
   find /www -name "wp-config.php" -path "*/public/*"
   ```

---

## Step 1: Tag 14 Missing Products ⏱️ 5 minutes

### Find Products Without Application Attribute

```bash
# List all temperature products with missing pa_application
wp post list \
  --post_type=product \
  --category=temperature-sensors \
  --fields=ID,post_title \
  --format=table | head -20
```

### Tag Products with WP-CLI

**Option A: One-by-one (recommended for accuracy)**

```bash
# Room temperature products
wp post meta update $(wp post list --post_type=product --name="novar-uvc-compatible-aluminum-wall-plate-temperature-sensor" --field=ID --format=csv) pa_application "room-temp"

wp post meta update $(wp post list --post_type=product --name="low-profile-button-temperature-sensor" --field=ID --format=csv) pa_application "room-temp"

wp post meta update $(wp post list --post_type=product --name="aluminum-wall-plate-temperature-sensor-with-11k-2-ohm-thermistor" --field=ID --format=csv) pa_application "room-temp"

# Duct products
wp post meta update $(wp post list --post_type=product --name="novar-uvc-compatible-duct-temperature-sensor-with-bapi-box-4-enclosure" --field=ID --format=csv) pa_application "duct"

# Outside air products
wp post meta update $(wp post list --post_type=product --name="outside-air-temperature-transmitter-40-to-140f-range" --field=ID --format=csv) pa_application "outside-air"

# Immersion products
wp post meta update $(wp post list --post_type=product --name="alc-temperature-transmitter-platinum-rtd" --field=ID --format=csv) pa_application "immersion"

wp post meta update $(wp post list --post_type=product --name="acs-immersion-temperature-sensor-nylon-fitting" --field=ID --format=csv) pa_application "immersion"

wp post meta update $(wp post list --post_type=product --name="temperature-transmitter-platinum-rtd" --field=ID --format=csv) pa_application "immersion"

# Strap products
wp post meta update $(wp post list --post_type=product --name="acs-strap-temperature-sensor" --field=ID --format=csv) pa_application "strap"

# Averaging + Duct (multi-select)
PRODUCT_ID=$(wp post list --post_type=product --name="acs-duct-averaging-temperature-sensor-rigid" --field=ID --format=csv)
wp post meta update $PRODUCT_ID pa_application "averaging"
wp post meta add $PRODUCT_ID pa_application "duct"
```

**Option B: Bulk script (faster, but check product names first)**

```bash
# Create a temporary script
cat > /tmp/tag-products.sh << 'EOF'
#!/bin/bash

# Function to tag product by slug
tag_product() {
  local slug=$1
  local app=$2
  local id=$(wp post list --post_type=product --name="$slug" --field=ID --format=csv)
  
  if [ -n "$id" ]; then
    wp post meta update $id pa_application "$app"
    echo "✅ Tagged product $id ($slug) with $app"
  else
    echo "❌ Product not found: $slug"
  fi
}

# Room temperature
tag_product "novar-uvc-compatible-aluminum-wall-plate-temperature-sensor" "room-temp"
tag_product "low-profile-button-temperature-sensor" "room-temp"
tag_product "aluminum-wall-plate-temperature-sensor-with-11k-2-ohm-thermistor" "room-temp"

# Duct
tag_product "novar-uvc-compatible-duct-temperature-sensor-with-bapi-box-4-enclosure" "duct"

# Outside air
tag_product "outside-air-temperature-transmitter-40-to-140f-range" "outside-air"

# Immersion
tag_product "alc-temperature-transmitter-platinum-rtd" "immersion"
tag_product "acs-immersion-temperature-sensor-nylon-fitting" "immersion"
tag_product "temperature-transmitter-platinum-rtd" "immersion"

# Strap
tag_product "acs-strap-temperature-sensor" "strap"

# Averaging + duct (multi)
local id=$(wp post list --post_type=product --name="acs-duct-averaging-temperature-sensor-rigid" --field=ID --format=csv)
if [ -n "$id" ]; then
  wp post meta update $id pa_application "averaging"
  wp post meta add $id pa_application "duct"
  echo "✅ Tagged product $id with averaging + duct"
fi

echo ""
echo "Tagged 10 products. Find remaining 4 manually:"
wp post list --post_type=product --category=temperature-sensors --fields=ID,post_title | grep -v "ALC\|ACS" | head -20
EOF

chmod +x /tmp/tag-products.sh
bash /tmp/tag-products.sh
```

**Verify:**
```bash
# Check that products now have pa_application
wp post meta get <PRODUCT_ID> pa_application
```

---

## Step 2: Create 10 New Categories ⏱️ 2 minutes

```bash
# Get parent category ID first
PARENT_ID=$(wp term list product_cat --name="Temperature Sensors" --field=term_id --format=csv)
echo "Parent category ID: $PARENT_ID"

# Create all 10 subcategories
wp term create product_cat "Room Temperature Sensors" --slug="temp-room-temp" --parent=$PARENT_ID --description="Wall-mounted temperature sensors for occupied spaces"

wp term create product_cat "Duct Sensors" --slug="temp-duct" --parent=$PARENT_ID --description="Temperature sensors for HVAC ductwork installation"

wp term create product_cat "Averaging Sensors" --slug="temp-averaging" --parent=$PARENT_ID --description="Averaging temperature sensors for large spaces"

wp term create product_cat "Immersion Sensors" --slug="temp-immersion" --parent=$PARENT_ID --description="Immersion temperature sensors for liquids and tanks"

wp term create product_cat "Remote Probes" --slug="temp-remote-probes-and-sensors" --parent=$PARENT_ID --description="Remote probe temperature sensors with separate sensing element"

wp term create product_cat "Submersible Sensors" --slug="temp-submersible" --parent=$PARENT_ID --description="Submersible temperature sensors for underwater applications"

wp term create product_cat "Outside Air Sensors" --slug="temp-outside-air" --parent=$PARENT_ID --description="Outside air temperature sensors for weather monitoring"

wp term create product_cat "Strap Sensors" --slug="temp-strap" --parent=$PARENT_ID --description="Strap-on temperature sensors for pipe attachment"

wp term create product_cat "Thermobuffer/Freezer Sensors" --slug="temp-thermobuffer-freezer-cooler" --parent=$PARENT_ID --description="Specialized sensors for freezers, coolers, and thermobuffers"

wp term create product_cat "Extreme Temperature Sensors" --slug="temp-extreme-temperature" --parent=$PARENT_ID --description="High-temperature sensors using platinum RTD elements"
```

**Verify:**
```bash
# List all temperature subcategories
wp term list product_cat --parent=$PARENT_ID --fields=term_id,name,slug,count
```

---

## Step 3: Reassign All 115 Products ⏱️ 5-10 minutes

### Option A: MySQL Direct (Fastest - Advanced Users)

**⚠️ BACKUP FIRST:**
```bash
wp db export /tmp/backup-before-migration.sql
```

**Get term IDs:**
```bash
# Map application attributes to new category term IDs
wp term list product_cat --slug="temp-duct" --field=term_id
wp term list product_cat --slug="temp-room-temp" --field=term_id
# ... repeat for all 10
```

**MySQL script:**
```sql
-- Example: Assign all products with pa_application="duct" to temp-duct category
-- Replace 999 with actual temp-duct term_id from above

-- First, get product IDs with application="duct"
SELECT DISTINCT p.ID, p.post_title
FROM wp_posts p
INNER JOIN wp_postmeta pm ON p.ID = pm.post_id
WHERE pm.meta_key = 'pa_application'
  AND pm.meta_value = 'duct'
  AND p.post_type = 'product';

-- Insert into term relationships (add products to new category)
INSERT INTO wp_term_relationships (object_id, term_taxonomy_id)
SELECT DISTINCT p.ID, 999  -- Replace 999 with temp-duct term_taxonomy_id
FROM wp_posts p
INNER JOIN wp_postmeta pm ON p.ID = pm.post_id
WHERE pm.meta_key = 'pa_application'
  AND pm.meta_value = 'duct'
  AND p.post_type = 'product'
ON DUPLICATE KEY UPDATE term_taxonomy_id = term_taxonomy_id;

-- Repeat for all 10 application types...
```

### Option B: WP-CLI Script (Safer, Recommended)

```bash
cat > /tmp/reassign-products.sh << 'EOF'
#!/bin/bash

# Get term IDs for new categories
TEMP_DUCT=$(wp term list product_cat --slug="temp-duct" --field=term_id --format=csv)
TEMP_ROOM=$(wp term list product_cat --slug="temp-room-temp" --field=term_id --format=csv)
TEMP_AVERAGING=$(wp term list product_cat --slug="temp-averaging" --field=term_id --format=csv)
TEMP_IMMERSION=$(wp term list product_cat --slug="temp-immersion" --field=term_id --format=csv)
TEMP_REMOTE=$(wp term list product_cat --slug="temp-remote-probes-and-sensors" --field=term_id --format=csv)
TEMP_SUBMERSIBLE=$(wp term list product_cat --slug="temp-submersible" --field=term_id --format=csv)
TEMP_OUTSIDE=$(wp term list product_cat --slug="temp-outside-air" --field=term_id --format=csv)
TEMP_STRAP=$(wp term list product_cat --slug="temp-strap" --field=term_id --format=csv)
TEMP_THERMO=$(wp term list product_cat --slug="temp-thermobuffer-freezer-cooler" --field=term_id --format=csv)
TEMP_EXTREME=$(wp term list product_cat --slug="temp-extreme-temperature" --field=term_id --format=csv)

echo "Category term IDs loaded:"
echo "  temp-duct: $TEMP_DUCT"
echo "  temp-room-temp: $TEMP_ROOM"
echo "  ... (8 more)"
echo ""

# Function to reassign products by application
reassign_by_application() {
  local app=$1
  local new_term_id=$2
  local count=0
  
  echo "Processing application: $app → term_id $new_term_id"
  
  # Get all product IDs with this application
  for product_id in $(wp post list --post_type=product \
    --meta_key=pa_application \
    --meta_value="$app" \
    --field=ID --format=csv); do
    
    # Add new category
    wp post term add $product_id product_cat $new_term_id
    
    # Remove old categories (temp-room, temp-non-room, etc.)
    # Get current categories
    OLD_CATS=$(wp post term list $product_id product_cat --field=slug --format=csv | grep -E "^temp-room$|^temp-non-room$|^temp-bapi-stat-4$|^temp-button-sensor$|^temp-decora-style$")
    
    if [ -n "$OLD_CATS" ]; then
      for old_cat in $(echo $OLD_CATS | tr ',' '\n'); do
        OLD_TERM_ID=$(wp term list product_cat --slug="$old_cat" --field=term_id --format=csv)
        if [ -n "$OLD_TERM_ID" ]; then
          wp post term remove $product_id product_cat $OLD_TERM_ID
        fi
      done
    fi
    
    count=$((count + 1))
  done
  
  echo "  ✅ Reassigned $count products"
}

# Reassign all products by application
reassign_by_application "duct" $TEMP_DUCT
reassign_by_application "room-temp" $TEMP_ROOM
reassign_by_application "averaging" $TEMP_AVERAGING
reassign_by_application "immersion" $TEMP_IMMERSION
reassign_by_application "remote-probes-and-sensors" $TEMP_REMOTE
reassign_by_application "submersible" $TEMP_SUBMERSIBLE
reassign_by_application "outside-air" $TEMP_OUTSIDE
reassign_by_application "strap" $TEMP_STRAP
reassign_by_application "thermobuffer-freezer-cooler" $TEMP_THERMO
reassign_by_application "extreme-temperature" $TEMP_EXTREME

echo ""
echo "Migration complete! ✅"
echo ""
echo "Verifying category counts..."
wp term list product_cat --parent=$(wp term list product_cat --slug="temperature-sensors" --field=term_id --format=csv) --fields=name,slug,count
EOF

chmod +x /tmp/reassign-products.sh
bash /tmp/reassign-products.sh
```

**This script will:**
- Get all 10 new category term IDs
- For each application type, find all products
- Add new category to each product
- Remove old categories (temp-room, temp-non-room, etc.)
- Preserve customer_group fields (doesn't touch them)

---

## Step 4: Delete Old Categories ⏱️ 1 minute

**First verify they're empty:**
```bash
# Check product counts for old categories
wp term list product_cat --slug="temp-room" --fields=name,count
wp term list product_cat --slug="temp-non-room" --fields=name,count
wp term list product_cat --slug="temp-bapi-stat-4" --fields=name,count
wp term list product_cat --slug="temp-button-sensor" --fields=name,count
wp term list product_cat --slug="temp-decora-style" --fields=name,count
```

**If all show count=0, delete them:**
```bash
wp term delete product_cat $(wp term list product_cat --slug="temp-room" --field=term_id --format=csv)
wp term delete product_cat $(wp term list product_cat --slug="temp-non-room" --field=term_id --format=csv)
wp term delete product_cat $(wp term list product_cat --slug="temp-bapi-stat-4" --field=term_id --format=csv)
wp term delete product_cat $(wp term list product_cat --slug="temp-button-sensor" --field=term_id --format=csv)
wp term delete product_cat $(wp term list product_cat --slug="temp-decora-style" --field=term_id --format=csv)

echo "✅ Old categories deleted"
```

---

## Final Validation ⏱️ 2 minutes

### 1. Check Category Structure

```bash
# List all temperature subcategories with counts
PARENT_ID=$(wp term list product_cat --slug="temperature-sensors" --field=term_id --format=csv)
wp term list product_cat --parent=$PARENT_ID --fields=name,slug,count

# Should show 10 subcategories, total count = 115
```

### 2. Test GraphQL

```bash
curl -s "https://bapiheadlessstaging.kinsta.cloud/graphql" \
  -H 'Content-Type: application/json' \
  -d '{
    "query": "{ productCategories(where: {parent: \"temperature-sensors\"}) { nodes { name slug count } } }"
  }' | python3 -m json.tool
```

**Expected output:**
```json
{
  "data": {
    "productCategories": {
      "nodes": [
        {"name": "Room Temperature Sensors", "slug": "temp-room-temp", "count": 23},
        {"name": "Duct Sensors", "slug": "temp-duct", "count": 27},
        ... (8 more)
      ]
    }
  }
}
```

### 3. Verify Customer Group Fields Preserved

```bash
# Check that customer_group fields still exist
wp post meta get <PRODUCT_ID> customer_group1
wp post meta get <PRODUCT_ID> customer_group2
wp post meta get <PRODUCT_ID> customer_group3

# Should return existing values, not empty
```

---

## Rollback Plan

**If something goes wrong:**

```bash
# Restore from backup
wp db import /tmp/backup-before-migration.sql

# Or restore specific tables
wp db query "SELECT * FROM wp_term_relationships WHERE object_id IN (SELECT ID FROM wp_posts WHERE post_type='product') LIMIT 10;"
```

---

## One-Liner Complete Migration

**If you're confident and want to run everything at once:**

```bash
# BACKUP FIRST!
wp db export /tmp/backup-$(date +%Y%m%d-%H%M%S).sql && \

# Create categories
PARENT_ID=$(wp term list product_cat --slug="temperature-sensors" --field=term_id --format=csv) && \
wp term create product_cat "Room Temperature Sensors" --slug="temp-room-temp" --parent=$PARENT_ID --porcelain && \
wp term create product_cat "Duct Sensors" --slug="temp-duct" --parent=$PARENT_ID --porcelain && \
wp term create product_cat "Averaging Sensors" --slug="temp-averaging" --parent=$PARENT_ID --porcelain && \
wp term create product_cat "Immersion Sensors" --slug="temp-immersion" --parent=$PARENT_ID --porcelain && \
wp term create product_cat "Remote Probes" --slug="temp-remote-probes-and-sensors" --parent=$PARENT_ID --porcelain && \
wp term create product_cat "Submersible Sensors" --slug="temp-submersible" --parent=$PARENT_ID --porcelain && \
wp term create product_cat "Outside Air Sensors" --slug="temp-outside-air" --parent=$PARENT_ID --porcelain && \
wp term create product_cat "Strap Sensors" --slug="temp-strap" --parent=$PARENT_ID --porcelain && \
wp term create product_cat "Thermobuffer/Freezer Sensors" --slug="temp-thermobuffer-freezer-cooler" --parent=$PARENT_ID --porcelain && \
wp term create product_cat "Extreme Temperature Sensors" --slug="temp-extreme-temperature" --parent=$PARENT_ID --porcelain && \

echo "✅ Categories created. Run reassign script next."
```

---

## Time Comparison

| Method | Time | Difficulty |
|--------|------|------------|
| **WordPress Admin GUI** | 3-4 hours | Easy |
| **SSH + WP-CLI (this guide)** | 15-30 min | Medium |
| **Direct MySQL** | 5-10 min | Advanced |

---

## Kinsta-Specific Notes

**SSH Access:**
- Available on all Kinsta plans
- Find credentials in: MyKinsta → Sites → SSH/SFTP

**WP-CLI Location:**
```bash
which wp
# Usually: /usr/local/bin/wp
```

**WordPress Path:**
```bash
# Kinsta structure:
/www/sitename_123/public/
# where 123 is your site ID
```

**After Migration:**
- Kinsta Smart Cache will auto-purge
- No manual cache clearing needed
- GraphQL queries will reflect changes immediately

---

**Ready to run via SSH?** Start with the database backup, then run each step sequentially. Let me know if you need help with any commands!
