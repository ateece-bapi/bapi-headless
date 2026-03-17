# Kinsta SSH - Quick Start Commands

**Your SSH Connection Details:**
- **Host:** 35.224.70.159
- **Port:** 17338
- **Username:** bapiheadlessstaging
- **Auth:** SSH key + password

---

## 1. Connect to SSH

```bash
ssh bapiheadlessstaging@35.224.70.159 -p 17338
# Enter password when prompted
```

**Or copy from Kinsta dashboard:**
```bash
ssh bapiheadlessstaging -p 17338
# (if you have SSH config set up)
```

---

## 2. Find WordPress Directory

Once connected, run:

```bash
# Find WordPress installation path
pwd
# Should show something like: /www/bapiheadlessstaging_xxx/public

# Or search for it:
find /www -name "wp-config.php" 2>/dev/null | grep bapiheadless

# Navigate there:
cd $(find /www -name "wp-config.php" -path "*/public/*" 2>/dev/null | head -1 | xargs dirname)
pwd
# Should show: /www/bapiheadlessstaging_xxx/public
```

---

## 3. Verify WP-CLI Works

```bash
# Check WP-CLI version
wp --version

# Test WordPress is accessible
wp core version
# Should show: 6.8.2 (or whatever version you're running)

# List product categories to confirm database connection
wp term list product_cat --fields=name,slug,count | head -10
```

---

## 4. Run the Migration Script

**RECOMMENDED: Step-by-step approach**

### Step A: Backup Database (CRITICAL!)

```bash
# Create backup
wp db export /tmp/backup-$(date +%Y%m%d-%H%M%S).sql
ls -lh /tmp/backup-*.sql
# Note the filename for rollback if needed
```

### Step B: Create Categories

```bash
# Get parent category ID
PARENT_ID=$(wp term list product_cat --slug="temperature-sensors" --field=term_id --format=csv)
echo "Parent ID: $PARENT_ID"

# If empty, try:
wp term list product_cat --name="Temperature" --field=term_id

# Create all 10 new categories
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

# Verify categories created
wp term list product_cat --parent=$PARENT_ID --fields=name,slug
```

### Step C: Tag Missing Products (if any found)

```bash
# Find products without pa_application attribute
wp post list --post_type=product --category=temperature-sensors --fields=ID,post_title | head -20

# Example: Tag a product
# wp post meta update <PRODUCT_ID> pa_application "room-temp"
```

### Step D: Reassign Products (Run the full script)

```bash
# Create and run the reassignment script
cat > /tmp/reassign-temp-products.sh << 'SCRIPT_END'
#!/bin/bash

echo "🚀 Starting product reassignment..."

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

echo "✅ Category IDs loaded:"
echo "  temp-duct: $TEMP_DUCT"
echo "  temp-room-temp: $TEMP_ROOM"
echo "  temp-averaging: $TEMP_AVERAGING"
echo "  temp-immersion: $TEMP_IMMERSION"
echo "  temp-remote-probes-and-sensors: $TEMP_REMOTE"
echo "  temp-submersible: $TEMP_SUBMERSIBLE"
echo "  temp-outside-air: $TEMP_OUTSIDE"
echo "  temp-strap: $TEMP_STRAP"
echo "  temp-thermobuffer-freezer-cooler: $TEMP_THERMO"
echo "  temp-extreme-temperature: $TEMP_EXTREME"
echo ""

# Function to reassign products by application
reassign_by_application() {
  local app=$1
  local new_term_id=$2
  local count=0
  
  echo "📦 Processing application: $app → term_id $new_term_id"
  
  # Get all product IDs with this application
  # Note: WooCommerce stores attributes in wp_postmeta with key pattern
  for product_id in $(wp db query "
    SELECT DISTINCT post_id 
    FROM wp_postmeta 
    WHERE meta_key = 'attribute_pa_application' 
    AND meta_value LIKE '%$app%'
  " --skip-column-names); do
    
    # Add new category
    wp post term add $product_id product_cat $new_term_id --silent
    
    # Remove old temperature subcategories
    for old_slug in "temp-room" "temp-non-room" "temp-bapi-stat-4" "temp-button-sensor" "temp-decora-style"; do
      OLD_TERM_ID=$(wp term list product_cat --slug="$old_slug" --field=term_id --format=csv 2>/dev/null)
      if [ -n "$OLD_TERM_ID" ]; then
        wp post term remove $product_id product_cat $OLD_TERM_ID --silent 2>/dev/null
      fi
    done
    
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
echo "✅ Migration complete!"
echo ""
echo "📊 Final category counts:"
wp term list product_cat --parent=$PARENT_ID --fields=name,slug,count
SCRIPT_END

chmod +x /tmp/reassign-temp-products.sh
bash /tmp/reassign-temp-products.sh
```

### Step E: Validate Results

```bash
# Check new category counts
PARENT_ID=$(wp term list product_cat --slug="temperature-sensors" --field=term_id --format=csv)
wp term list product_cat --parent=$PARENT_ID --fields=name,slug,count

# Should show 10 categories with products distributed by application
# Total should be ~115 products
```

### Step F: Delete Old Categories (Only if Step E shows correct counts!)

```bash
# First verify old categories are empty
wp term list product_cat --slug="temp-room" --fields=name,count
wp term list product_cat --slug="temp-non-room" --fields=name,count

# If count=0 for all, delete them:
for old_cat in "temp-room" "temp-non-room" "temp-bapi-stat-4" "temp-button-sensor" "temp-decora-style"; do
  TERM_ID=$(wp term list product_cat --slug="$old_cat" --field=term_id --format=csv 2>/dev/null)
  if [ -n "$TERM_ID" ]; then
    COUNT=$(wp term list product_cat --slug="$old_cat" --field=count --format=csv)
    if [ "$COUNT" = "0" ]; then
      wp term delete product_cat $TERM_ID
      echo "✅ Deleted $old_cat"
    else
      echo "⚠️  Skipping $old_cat - still has $COUNT products"
    fi
  fi
done
```

---

## 5. Test GraphQL Result

```bash
# From your local machine (not SSH), test the GraphQL endpoint
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

---

## 6. Rollback (If Needed)

```bash
# If something goes wrong, restore from backup
wp db import /tmp/backup-20260316-123456.sql
# (use the actual filename from Step A)
```

---

## Common Issues & Fixes

### Issue: "wp: command not found"

```bash
# Find WP-CLI path
which wp
# Or use full path:
/usr/local/bin/wp --version
```

### Issue: "Error establishing database connection"

```bash
# Check if you're in the right directory
ls -la wp-config.php
# Should exist in current directory

# Test database connection
wp db check
```

### Issue: Parent category not found

```bash
# Find temperature category by different search
wp term list product_cat --search="temperature" --fields=term_id,name,slug

# Or list all parent categories
wp term list product_cat --fields=term_id,name,slug | grep -i temp
```

---

## Time Estimate via SSH

- ✅ Steps A-B (Backup + Create categories): **5 minutes**
- ✅ Step C (Tag missing products): **5 minutes** (if needed)
- ✅ Step D (Reassign all products): **5-10 minutes**
- ✅ Step E (Validate): **2 minutes**
- ✅ Step F (Delete old): **1 minute**

**Total: ~15-30 minutes** vs 3-4 hours in WordPress admin GUI

---

## Next Steps After SSH Migration

1. ✅ Complete SSH migration (Steps A-F above)
2. ✅ Validate GraphQL returns correct structure
3. ✅ Return to your **local development** environment
4. ✅ Test mega-menu links work with new categories
5. ✅ Deploy frontend to staging/production

---

**Ready to start?** 

1. Copy the SSH command: `ssh bapiheadlessstaging@35.224.70.159 -p 17338`
2. Enter your password
3. Run the commands step-by-step starting with Step A (backup!)

Let me know when you're connected and I'll guide you through each step! 🚀
