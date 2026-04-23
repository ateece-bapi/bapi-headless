# Quick SSH Diagnostic - Check WordPress Categories

**Goal:** Check what temperature categories actually exist in WordPress before running migration

---

## Step 1: Connect to Kinsta SSH

```bash
# Get SSH credentials from Kinsta MyKinsta dashboard:
# Sites → bapiheadlessstaging → Info → SFTP/SSH

ssh <SSH_USERNAME>@<STAGING_IP> -p <SSH_PORT>
# Enter password when prompted
```

---

## Step 2: Navigate to WordPress Directory

```bash
# Find WordPress installation
cd $(find /www -name "wp-config.php" -path "*/public/*" 2>/dev/null | head -1 | xargs dirname)

# Verify you're in the right place
wp core version
# Should show: 6.8.2
```

---

## Step 3: Run Diagnostic Script

**Option A: Upload and run the script**

```bash
# From your local machine (in a new terminal):
scp -P <SSH_PORT> scripts/check-wordpress-categories.sh <SSH_USERNAME>@<STAGING_IP>:/tmp/

# Back in SSH session:
bash /tmp/check-wordpress-categories.sh
```

**Option B: Quick manual check**

```bash
# Get Temperature Sensors parent ID
PARENT_ID=$(wp term list product_cat --slug="temperature-sensors" --field=term_id --format=csv)
echo "Parent ID: $PARENT_ID"

# List ALL current temperature subcategories
wp term list product_cat --parent=$PARENT_ID --fields=name,slug,count --format=table

# Check if temp-room-temp exists
wp term list product_cat --slug="temp-room-temp" --fields=name,slug,count
```

---

## What You're Looking For

### Scenario 1: Migration Already Complete ✅
```
Temperature subcategories:
+---------------------------+----------------------------------+-------+
| name                      | slug                             | count |
+---------------------------+----------------------------------+-------+
| Room Temperature Sensors  | temp-room-temp                   | 23    |
| Duct Sensors              | temp-duct                        | 27    |
| Averaging Sensors         | temp-averaging                   | 17    |
... (8 more)
+---------------------------+----------------------------------+-------+

✅ If you see this, migration is done! Just need to clear caches.
```

### Scenario 2: Migration Not Started ⚠️
```
Temperature subcategories:
+---------------------------+----------------------------------+-------+
| name                      | slug                             | count |
+---------------------------+----------------------------------+-------+
| Room Sensors              | temp-room                        | 15    |
| Non-Room Sensors          | temp-non-room                    | 35    |
| BAPI-Stat 4               | temp-bapi-stat-4                 | 9     |
... (old categories)
+---------------------------+----------------------------------+-------+

⚠️ Need to run full migration per WORDPRESS-MIGRATION-CHECKLIST-APR23.md
```

### Scenario 3: Different Slug Found 🔍
```
Temperature subcategories:
+---------------------------+----------------------------------+-------+
| name                      | slug                             | count |
+---------------------------+----------------------------------+-------+
| Room & Wall Sensors       | room-wall                        | 23    |
... 
+---------------------------+----------------------------------+-------+

🔍 Frontend is using wrong slug! Need to update config.ts to match WordPress.
```

---

## Quick Fixes Based on Results

### If temp-room-temp EXISTS:
1. Clear WordPress cache: `wp cache flush`
2. Clear Next.js cache: POST to `/api/revalidate?tag=products`
3. Test link: http://localhost:3000/en/products/temperature-sensors/temp-room-temp

### If temp-room-temp DOESN'T EXIST but you see "room-wall":
1. Update frontend config to match actual slug
2. OR create temp-room-temp in WordPress as an alias
3. OR run full migration to standardize slugs

### If NO new categories exist:
1. Run full migration checklist
2. Estimated time: 3-4 hours

---

## Commands to Copy-Paste

```bash
# SSH connection (replace with your credentials)
ssh <USERNAME>@<HOST> -p <PORT>

# Navigate to WordPress
cd /www/*/public

# Quick category check
PARENT_ID=$(wp term list product_cat --slug="temperature-sensors" --field=term_id --format=csv)
wp term list product_cat --parent=$PARENT_ID --fields=name,slug,count

# Check specific category
wp term list product_cat --slug="temp-room-temp" --fields=name,slug,count
wp term list product_cat --slug="room-wall" --fields=name,slug,count

# Count total temperature products
wp post list --post_type=product --category=temperature-sensors --fields=ID --format=count

# Exit SSH
exit
```

---

## What to Report Back

After running the diagnostic, share:

1. **Does `temp-room-temp` exist?** (yes/no)
2. **What slugs DO exist?** (copy table output)
3. **Total product count:** (should be ~115)
4. **Migration status:** (complete/in-progress/not-started)

This will tell us whether we need to:
- Fix frontend config (5 min)
- OR run full migration (3-4 hours)
- OR just clear caches (2 min)
