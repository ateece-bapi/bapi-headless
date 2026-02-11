# Syncing Production Database to Kinsta Staging

**Goal**: Update Kinsta staging database (October 2025) with current SpinupWP production data (February 2026)

**Current Date**: February 11, 2026  
**Risk Level**: Medium (staging only, reversible with Kinsta backups)

---

## ⚠️ IMPORTANT: Before You Start

1. **Verify Kinsta has automatic backup** (should be automatic daily backups)
2. **This will overwrite staging database** - any test data will be lost
3. **Test on staging only** - never do this in reverse (staging → production)
4. **User passwords remain intact** (WordPress stores hashed passwords)

---

## Option 1: Using Kinsta + WP-CLI (Recommended - Fastest)

### Step 1: Export Database from SpinupWP Production

**Via SSH (SpinupWP):**

```bash
# SSH into SpinupWP server
ssh user@your-spinupwp-server

# Navigate to WordPress directory
cd /path/to/wordpress

# Export database using WP-CLI
wp db export bapi-production-$(date +%Y%m%d).sql --allow-root

# Compress for faster transfer
gzip bapi-production-$(date +%Y%m%d).sql

# Download to your local machine
# In a new terminal on your local machine:
scp user@your-spinupwp-server:/path/to/wordpress/bapi-production-*.sql.gz ~/Downloads/
```

**Alternative: Via phpMyAdmin (SpinupWP):**

1. Log in to SpinupWP dashboard
2. Access phpMyAdmin for your site
3. Select WordPress database
4. Click "Export" tab
5. Choose "Quick" export method
6. Click "Go" to download `.sql` file

---

### Step 2: Upload Database to Kinsta Staging

**Via SSH (Kinsta):**

```bash
# SSH into Kinsta staging site
# (Get SSH credentials from Kinsta dashboard → Sites → [Staging] → Info → SSH/SFTP)

ssh your-site@your-site.kinsta.cloud -p port

# Navigate to writable directory
cd ~/public

# Upload from local machine (in new terminal):
scp -P port ~/Downloads/bapi-production-*.sql.gz your-site@your-site.kinsta.cloud:~/public/

# Back in Kinsta SSH:
# Decompress if gzipped
gunzip bapi-production-*.sql.gz

# Backup current staging database first (safety)
wp db export staging-backup-$(date +%Y%m%d).sql

# Import new database
wp db import bapi-production-*.sql

# Search-replace domain URLs (critical!)
# Replace SpinupWP domain with Kinsta staging domain
wp search-replace 'https://your-spinupwp-domain.com' 'https://staging-bapi.kinsta.cloud' --all-tables

# Replace any hardcoded IP addresses or old domains
wp search-replace 'http://your-old-domain.com' 'https://staging-bapi.kinsta.cloud' --all-tables --skip-columns=guid

# Verify admin can log in
wp user list --role=administrator

# Flush object cache (Redis)
wp cache flush

# Clean up SQL files
rm bapi-production-*.sql
```

---

### Step 3: Verify Import Success

**Check critical data:**

```bash
# Count products (should match production)
wp post list --post_type=product --format=count

# Count users (should be 5,438 or current total)
wp user list --format=count

# Count orders
wp post list --post_type=shop_order --format=count

# Verify GraphQL endpoint
curl https://staging-bapi.kinsta.cloud/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ products(first: 1) { nodes { name } } }"}'
```

**Check WordPress Admin:**
1. Log in to staging WordPress admin
2. Navigate to: Products → All Products (verify product count)
3. Navigate to: Users → All Users (verify user count)
4. Navigate to: WooCommerce → Orders (verify recent orders)
5. Navigate to: Settings → GraphQL (verify plugins still active)

---

## Option 2: Using Kinsta Dashboard (Easiest - No SSH Required)

### Step 1: Export from SpinupWP

1. **Via phpMyAdmin:**
   - Log in to SpinupWP → Access phpMyAdmin
   - Select database → Export → Go
   - Download `.sql` file to your computer

2. **Or via SpinupWP CLI:**
   - Log in to SpinupWP dashboard
   - Use backup/export feature if available

---

### Step 2: Import to Kinsta via phpMyAdmin

1. **Access Kinsta phpMyAdmin:**
   - Kinsta Dashboard → Sites → [Staging Site] → Info
   - Click "Open phpMyAdmin" link
   - Log in with credentials shown

2. **Backup Current Database:**
   - Select database
   - Click "Export" tab
   - Download as `staging-backup-YYYYMMDD.sql` (keep for safety)

3. **Import Production Database:**
   - Click "Import" tab
   - Click "Choose File" → select SpinupWP export file
   - Scroll down → Click "Go"
   - Wait for import to complete (may take 5-10 minutes for large DB)

4. **Run Search-Replace:**
   - After import, you need to update URLs
   - Use Kinsta's built-in search-replace tool:
     - Kinsta Dashboard → Sites → [Staging] → Tools
     - Click "Search and Replace"
     - Find: `https://your-spinupwp-domain.com`
     - Replace: `https://staging-bapi.kinsta.cloud`
     - Select all tables → Run

---

### Step 3: Clear Caches

**In Kinsta Dashboard:**
1. Sites → [Staging Site] → Tools
2. Click "Clear Cache" button

**In WordPress Admin:**
1. Log in to staging WordPress admin
2. Settings → Redis → "Flush Cache"
3. Settings → GraphQL → Cache → "Clear Cache"

---

## Option 3: Using WordPress Plugin (Easiest - No Technical Skills)

### Install on Both Sites:

**Plugin: All-in-One WP Migration** (free, handles up to 512MB)

1. **On SpinupWP Production:**
   - Install "All-in-One WP Migration" plugin
   - Go to: All-in-One WP Migration → Export
   - Export to: File
   - Download exported file

2. **On Kinsta Staging:**
   - Install "All-in-One WP Migration" plugin
   - Go to: All-in-One WP Migration → Import
   - Drag exported file → Import
   - Click "Proceed" when prompted about overwrite
   - Wait for import to complete

**Note**: Free version has 512MB upload limit. If database is larger:
- Use paid version ($69 unlimited)
- Or use Option 1 or 2 above

---

## Post-Import Checklist

After database sync, verify these items:

### WordPress Core
- [ ] Can log in to WordPress admin
- [ ] Dashboard loads without errors
- [ ] Permalinks work (Settings → Permalinks → Save Changes)

### WooCommerce
- [ ] Products visible (Products → All Products)
- [ ] Product count matches production
- [ ] Product images display correctly
- [ ] Orders visible (WooCommerce → Orders)
- [ ] User accounts intact (Users → All Users)

### GraphQL
- [ ] WPGraphQL plugin active (Plugins → Installed Plugins)
- [ ] WPGraphQL Smart Cache active
- [ ] WPGraphQL CORS active
- [ ] Redis Object Cache active (Settings → Redis → "Connected")
- [ ] GraphQL endpoint responds: `/graphql`

### Next.js Frontend
- [ ] Test product page loads on staging frontend
- [ ] Test authentication (sign in with WordPress user)
- [ ] Test cart functionality
- [ ] Verify product images load from staging WordPress

### Custom Fields
- [ ] Product custom fields intact (part_number, compliancy_logos)
- [ ] B2B pricing multipliers preserved
- [ ] Customer groups visible

---

## Troubleshooting Common Issues

### Issue: "Error establishing database connection"

**Solution:**
```bash
# Verify wp-config.php has correct Kinsta database credentials
# Kinsta credentials are different from SpinupWP
# Check: Kinsta Dashboard → Sites → [Staging] → Info → Database Access
```

### Issue: "Site redirects to old SpinupWP domain"

**Solution:**
```bash
# Run search-replace again, check all variations:
wp search-replace 'http://old-domain.com' 'https://staging.kinsta.cloud' --all-tables
wp search-replace 'https://old-domain.com' 'https://staging.kinsta.cloud' --all-tables
wp search-replace 'http://www.old-domain.com' 'https://staging.kinsta.cloud' --all-tables
wp search-replace 'https://www.old-domain.com' 'https://staging.kinsta.cloud' --all-tables
```

### Issue: "Redis not connecting after import"

**Solution:**
```bash
# Re-enable Redis object cache
wp redis enable

# Flush cache
wp cache flush

# Verify connection
wp redis status
```

### Issue: "GraphQL queries returning old data"

**Solution:**
```bash
# Clear GraphQL Smart Cache
wp graphql clear

# Or via WordPress admin:
# Settings → GraphQL → Cache → "Clear Cache"
```

### Issue: "Images not displaying"

**Solution:**
- Images may still point to SpinupWP URLs
- Check: Media Library → Click image → Copy URL
- If shows old domain, run search-replace on `wp_posts.guid` column:
  ```bash
  wp search-replace 'https://old-domain.com' 'https://staging.kinsta.cloud' wp_posts --include-columns=guid
  ```

### Issue: "Users can't log in after import"

**Cause:** Sessions/auth tokens may be stale

**Solution:**
```bash
# Clear all user sessions
wp db query "DELETE FROM wp_usermeta WHERE meta_key = 'session_tokens';"

# Clear transients
wp transient delete --all

# Flush Redis
wp cache flush
```

---

## Database Size Reference

To check database size before export:

**SpinupWP:**
```bash
wp db size --human-readable
```

**Expected size for BAPI:**
- 608 products + 5,438 users + order history
- Estimated size: 50-200MB (manageable)

---

## Automation (Optional - For Regular Syncs)

If you need to sync staging with production regularly, create a bash script:

**File: `scripts/sync-staging-db.sh`**
```bash
#!/bin/bash

# Sync SpinupWP production → Kinsta staging
# Run manually: bash sync-staging-db.sh

set -e

echo "🔍 Starting database sync..."

# 1. Export from SpinupWP production
echo "📦 Exporting production database..."
ssh user@spinupwp-server "cd /path/to/wp && wp db export - --allow-root" > /tmp/production-export.sql

# 2. Import to Kinsta staging
echo "📥 Importing to staging..."
ssh kinsta-staging "wp db import - < /tmp/production-export.sql"

# 3. Search-replace URLs
echo "🔄 Updating URLs..."
ssh kinsta-staging "wp search-replace 'https://live-domain.com' 'https://staging.kinsta.cloud' --all-tables"

# 4. Clear caches
echo "🧹 Clearing caches..."
ssh kinsta-staging "wp cache flush && wp redis flush"

echo "✅ Database sync complete!"
```

Make executable:
```bash
chmod +x scripts/sync-staging-db.sh
```

---

## Security Notes

🔒 **Important:**
- **Never sync staging → production** (only production → staging)
- Keep database exports off public web directories
- Delete SQL files after import (contain sensitive data)
- Don't commit database exports to Git (already in .gitignore)
- SpinupWP credentials should be in password manager only

---

## Rollback Plan (If Something Goes Wrong)

### Option 1: Kinsta Automatic Backup
1. Kinsta Dashboard → Sites → [Staging]
2. Click "Backups" tab
3. Find backup from before import
4. Click "Restore" → Select "Database Only"

### Option 2: Manual Backup (If You Created One)
```bash
# SSH into Kinsta staging
ssh your-site@your-site.kinsta.cloud

# Import your backup
wp db import staging-backup-YYYYMMDD.sql

# Verify
wp user list --role=administrator
```

---

## Timeline Estimate

| Method | Time Required | Technical Skill | Best For |
|--------|---------------|----------------|----------|
| **Option 1: WP-CLI/SSH** | 15-30 min | Advanced | Fastest, most control |
| **Option 2: Kinsta Dashboard** | 30-45 min | Intermediate | No SSH needed |
| **Option 3: Plugin** | 20-40 min | Beginner | Easiest, GUI-based |

**Recommended:** Start with Option 2 (Kinsta Dashboard) if you're not comfortable with SSH.

---

## Next Steps After Sync

1. [ ] Verify product count matches production
2. [ ] Test GraphQL endpoint with sample query
3. [ ] Test Next.js staging frontend with new data
4. [ ] Update team: "Staging database synced with production (Feb 2026)"
5. [ ] Schedule regular syncs (monthly or as needed)

---

**Questions Before Starting?**

1. What is your SpinupWP production domain?
2. What is your Kinsta staging domain?
3. Do you have SSH access to both servers?
4. Do you have WordPress admin access to both sites?
5. What's the approximate database size on SpinupWP?

---

**Last Updated**: February 11, 2026  
**Owner**: Technical Team  
**Risk Level**: Medium (staging environment, reversible with backups)
