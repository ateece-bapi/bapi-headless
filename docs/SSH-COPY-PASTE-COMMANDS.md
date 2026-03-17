# WordPress Migration - Copy/Paste Commands

**Time:** 15-30 minutes  
**Follow in order** - copy each command, paste into terminal, wait for completion before next step.

---

## STEP 1: Connect to Kinsta SSH

```bash
ssh bapiheadlessstaging@35.224.70.159 -p 17338
```
*Enter password when prompted, then press Enter*

✅ **You're connected when you see:** `bapiheadlessstaging@...`

---

## STEP 2: Find WordPress Directory

```bash
cd /www/bapiheadlessstaging_*/public && pwd
```

✅ **Expected output:** `/www/bapiheadlessstaging_123/public` (or similar)

---

## STEP 3: Test WP-CLI Works

```bash
wp --version
```

✅ **Expected output:** `WP-CLI 2.x.x` or similar

---

## STEP 4: Backup Database (CRITICAL!)

```bash
wp db export /tmp/backup-$(date +%Y%m%d-%H%M%S).sql && ls -lh /tmp/backup-*.sql
```

✅ **Expected output:** Shows backup file created with size (e.g., `backup-20260316-143022.sql 15M`)

⚠️ **CRITICAL:** Note the backup filename in case you need to rollback!

---

## STEP 5: Get Parent Category ID

```bash
PARENT_ID=$(wp term list product_cat --slug="temperature-sensors" --field=term_id --format=csv) && echo "Parent ID: $PARENT_ID"
```

✅ **Expected output:** `Parent ID: 123` (some number)

❌ **If output is blank:** Try this instead:
```bash
PARENT_ID=$(wp term list product_cat --search="temperature" --field=term_id --format=csv | head -1) && echo "Parent ID: $PARENT_ID"
```

---

## STEP 6: Create 10 New Categories

Copy/paste this ENTIRE block at once:

```bash
wp term create product_cat "Room Temperature Sensors" --slug="temp-room-temp" --parent=$PARENT_ID --description="Wall-mounted temperature sensors for occupied spaces" && \
wp term create product_cat "Duct Sensors" --slug="temp-duct" --parent=$PARENT_ID --description="Temperature sensors for HVAC ductwork installation" && \
wp term create product_cat "Averaging Sensors" --slug="temp-averaging" --parent=$PARENT_ID --description="Averaging temperature sensors for large spaces" && \
wp term create product_cat "Immersion Sensors" --slug="temp-immersion" --parent=$PARENT_ID --description="Immersion temperature sensors for liquids and tanks" && \
wp term create product_cat "Remote Probes" --slug="temp-remote-probes-and-sensors" --parent=$PARENT_ID --description="Remote probe temperature sensors with separate sensing element" && \
wp term create product_cat "Submersible Sensors" --slug="temp-submersible" --parent=$PARENT_ID --description="Submersible temperature sensors for underwater applications" && \
wp term create product_cat "Outside Air Sensors" --slug="temp-outside-air" --parent=$PARENT_ID --description="Outside air temperature sensors for weather monitoring" && \
wp term create product_cat "Strap Sensors" --slug="temp-strap" --parent=$PARENT_ID --description="Strap-on temperature sensors for pipe attachment" && \
wp term create product_cat "Thermobuffer/Freezer Sensors" --slug="temp-thermobuffer-freezer-cooler" --parent=$PARENT_ID --description="Specialized sensors for freezers, coolers, and thermobuffers" && \
wp term create product_cat "Extreme Temperature Sensors" --slug="temp-extreme-temperature" --parent=$PARENT_ID --description="High-temperature sensors using platinum RTD elements" && \
echo "✅ All 10 categories created!"
```

✅ **Expected output:** 10 success messages ending with `✅ All 10 categories created!`

---

## STEP 7: Verify Categories Created

```bash
wp term list product_cat --parent=$PARENT_ID --fields=name,slug
```

✅ **Expected output:** List of 10 new categories with their slugs

---

## STEP 8: Create Reassignment Script

Copy/paste this ENTIRE block:

```bash
cat > /tmp/reassign.sh << 'ENDSCRIPT'
#!/bin/bash

echo "🚀 Starting product reassignment..."

# Get term IDs
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

echo "✅ Term IDs loaded"

# Function to reassign products
reassign() {
  local app=$1
  local term_id=$2
  echo "📦 Processing: $app"
  
  for id in $(wp db query "SELECT DISTINCT post_id FROM wp_postmeta WHERE meta_key='attribute_pa_application' AND meta_value LIKE '%$app%'" --skip-column-names --batch); do
    wp post term add $id product_cat $term_id --silent 2>/dev/null
    
    for old in "temp-room" "temp-non-room" "temp-bapi-stat-4" "temp-button-sensor" "temp-decora-style"; do
      OLD_ID=$(wp term list product_cat --slug="$old" --field=term_id --format=csv 2>/dev/null)
      [ -n "$OLD_ID" ] && wp post term remove $id product_cat $OLD_ID --silent 2>/dev/null
    done
  done
}

# Reassign all
reassign "duct" $TEMP_DUCT
reassign "room-temp" $TEMP_ROOM
reassign "averaging" $TEMP_AVERAGING
reassign "immersion" $TEMP_IMMERSION
reassign "remote-probes-and-sensors" $TEMP_REMOTE
reassign "submersible" $TEMP_SUBMERSIBLE
reassign "outside-air" $TEMP_OUTSIDE
reassign "strap" $TEMP_STRAP
reassign "thermobuffer-freezer-cooler" $TEMP_THERMO
reassign "extreme-temperature" $TEMP_EXTREME

echo "✅ Reassignment complete!"
ENDSCRIPT

chmod +x /tmp/reassign.sh && echo "✅ Script created"
```

✅ **Expected output:** `✅ Script created`

---

## STEP 9: Run Reassignment Script

```bash
bash /tmp/reassign.sh
```

✅ **Expected output:** 
```
🚀 Starting product reassignment...
✅ Term IDs loaded
📦 Processing: duct
📦 Processing: room-temp
... (10 lines total)
✅ Reassignment complete!
```

⏱️ **Takes:** 5-10 minutes (be patient!)

---

## STEP 10: Verify Product Counts

```bash
wp term list product_cat --parent=$PARENT_ID --fields=name,slug,count
```

✅ **Expected output:** 10 categories with product counts (should total ~115)

Example:
```
Room Temperature Sensors    temp-room-temp                  23
Duct Sensors               temp-duct                        27
Averaging Sensors          temp-averaging                   17
...
```

---

## STEP 11: Delete Old Categories

**ONLY if Step 10 shows correct counts!**

```bash
for slug in "temp-room" "temp-non-room" "temp-bapi-stat-4" "temp-button-sensor" "temp-decora-style"; do
  ID=$(wp term list product_cat --slug="$slug" --field=term_id --format=csv 2>/dev/null)
  if [ -n "$ID" ]; then
    COUNT=$(wp term list product_cat --slug="$slug" --field=count --format=csv)
    if [ "$COUNT" = "0" ]; then
      wp term delete product_cat $ID && echo "✅ Deleted $slug"
    else
      echo "⚠️  Skipping $slug - has $COUNT products"
    fi
  fi
done
```

✅ **Expected output:** 5 messages showing categories deleted

---

## STEP 12: Final Validation

```bash
wp term list product_cat --parent=$PARENT_ID --fields=name,count
```

✅ **Expected output:** 10 categories, no old ones, counts add up to ~115

---

## STEP 13: Disconnect from SSH

```bash
exit
```

---

## STEP 14: Test GraphQL from Your Local Machine

Open a NEW terminal on your local machine (not SSH):

```bash
curl -s "https://bapiheadlessstaging.kinsta.cloud/graphql" \
  -H 'Content-Type: application/json' \
  -d '{
    "query": "{ productCategories(where: {parent: \"temperature-sensors\"}) { nodes { name slug count } } }"
  }' | python3 -m json.tool
```

✅ **Expected output:** JSON showing 10 subcategories

---

## ✅ DONE!

Your WordPress categories are restructured. The frontend mega-menu will now work with the new subcategories.

---

## 🆘 If Something Goes Wrong

**Rollback to backup:**

1. Reconnect to SSH:
   ```bash
   ssh bapiheadlessstaging@35.224.70.159 -p 17338
   ```

2. Find your backup file:
   ```bash
   ls -lh /tmp/backup-*.sql
   ```

3. Restore it:
   ```bash
   wp db import /tmp/backup-20260316-143022.sql
   # (use your actual filename)
   ```

---

## Next Steps After Migration

1. ✅ Test mega-menu links on staging site
2. ✅ Merge frontend changes to staging branch
3. ✅ Deploy to production
4. ✅ Mark todos complete! 🎉
