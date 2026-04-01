# Translation Scripts

## DIY AI Translation (Recommended)

Translate all 8 languages for **$5-20** instead of paying Crowdin $250-500 for AI credits.

### Quick Start

**You already have Claude set up for your chatbot!** Just reuse the same API key:

```bash
# 1. Copy en.json to scripts directory
cd /home/ateece/bapi-headless/web/messages
cp en.json ../../scripts/

# 2. Run translation (your ANTHROPIC_API_KEY from .env will be used)
cd ../../scripts
source ../web/.env  # Load your existing API key
node translate-with-ai.js vi  # Vietnamese first

# 3. Translate all languages
node translate-with-ai.js all

# 4. Copy translated files back
cp *.json ../web/messages/
cd ../web/messages
ls -l *.json  # Verify all 9 language files
```

**That's it!** No new API key needed - uses your existing chatbot credentials.

### What It Does

1. ✅ Reads `en.json` from scripts directory
2. ✅ Sends to Claude 3.5 Sonnet (same API as your chatbot)
3. ✅ Preserves brand names (BAPI, WAM™) and technical terms
4. ✅ Uses professional B2B tone for engineers
5. ✅ Writes to `{lang}.json` in scripts directory
6. ✅ Validates JSON structure

### Cost Comparison

| Method | Time | Cost | Quality |
|--------|------|------|---------|
| **DIY Claude** | 1 hour | **$5-20** | 85-90% |
| Crowdin AI | 10 min | $350-600 | 85-90% |
| Human Translation | 7-10 days | $1,800-2,100 | 95%+ |

### Usage Examples

```bash
# Translate one language
node translate-with-ai.js vi  # Vietnamese
node translate-with-ai.js de  # German
node translate-with-ai.js fr  # French

# Translate all 8 languages
node translate-with-ai.js all

# Check output
cat ../web/messages/vi.json
```

### After Translation

1. **Test locally**:
```bash
cd ../web
pnpm run dev
# Visit http://localhost:3000/vi to test Vietnamese
```

2. **Review quality**:
   - Check homepage tagline sounds natural
   - Verify technical terms stayed in English (BAPI, WAM™, CO₂)
   - Check professional tone (not casual)

3. **Upload to Crowdin** (optional):
   - Go to your Crowdin project
   - Upload translated files
   - Use Crowdin for Translation Memory and GitHub sync

4. **Commit to repo**:
```bash
git add web/messages/*.json
git commit -m "feat(i18n): Add AI-translated content for 8 languages"
git push origin main
```

### Troubleshooting

**Error: Missing ANTHROPIC_API_KEY**
```bash
export ANTHROPIC_API_KEY="your-key-here"
```

**Error: Cannot find module '@anthropic-ai/sdk'**
```bash
npm install @anthropic-ai/sdk
```

**JSON parsing error**
- Claude rarely makes JSON errors, but if it happens:
- Re-run the translation
- Check the output file manually

### Advanced: Batch Translation

Create a shell script for all languages:

```bash
#!/bin/bash
# translate-all.sh

languages=("vi" "de" "fr" "es" "ja" "zh" "ar" "th")

for lang in "${languages[@]}"; do
  echo "Translating $lang..."
  node translate-with-ai.js $lang
  sleep 2  # Rate limiting
done

echo "✅ All translations complete!"
```

### Why This Is Better Than Crowdin AI

1. **98% cheaper**: $5-20 vs $350-600
2. **Full control**: Edit prompt for better quality
3. **No vendor lock-in**: Own your translation workflow
4. **Same model**: Claude 3.5 Sonnet (Crowdin uses same)
5. **Instant**: No waiting for Crowdin credits

### Still Use Crowdin For

- ✅ Translation Memory (free)
- ✅ GitHub integration (free)
- ✅ Glossary management (free)
- ✅ Team collaboration (Pro plan)
- ❌ Skip the AI credits purchase

---

**Total Cost**: $5-20 AI + $99/mo Crowdin Pro = **Saves $250-500** vs Crowdin AI

---
---

# Customer Group Filtering - Setup Scripts

**Purpose:** Populate WordPress database with customer group restrictions for B2B product visibility control.

**Date:** April 1, 2026  
**Status:** Ready for execution on Kinsta staging

---

## Overview

These scripts set up the customer group filtering system that restricts product visibility based on user company affiliation:

- **132 restricted products** across 4 customer groups (ALC, ACS, EMC, CCG)
- **476 standard products** visible to all users
- **5 test users** for validation testing

---

## Prerequisites

1. **SSH Access** to Kinsta staging server
   - Host: `35.224.70.159`
   - Port: `17338`
   - User: `bapiheadlessstaging`
   - Password: (provided separately)

2. **WP-CLI** installed on server (Kinsta includes this by default)

3. **ACF Pro** plugin active with CustomerInformation field group

---

## Quick Start

### Option 1: Automated Setup (Recommended)

Run the complete setup script from your local machine:

```bash
cd /home/ateece/bapi-headless
./scripts/setup-customer-groups.sh
```

This script will:
1. ✅ Verify SSH connection
2. ✅ Show current product distribution
3. ✅ Populate `customer_group1` for 132 products
4. ✅ Create 5 test users with appropriate customer groups
5. ✅ Verify all changes

**Time:** ~2-3 minutes

---

### Option 2: Manual Setup

If you prefer to run commands individually:

#### Step 1: Populate Product Customer Groups

```bash
# SSH into Kinsta
ssh -p 17338 bapiheadlessstaging@35.224.70.159

# Upload SQL file (from your local machine)
scp -P 17338 scripts/populate-customer-groups.sql bapiheadlessstaging@35.224.70.159:/tmp/

# Execute SQL (on server, after SSH)
wp db query "$(cat /tmp/populate-customer-groups.sql)" --path=/www/bapiheadlessstaging_582/public
```

#### Step 2: Create Test Users

```bash
# Create ALC test user (run on server after SSH)
# Replace YOUR_SECURE_PASSWORD with actual password from secure storage
wp user create test-alc test-alc@bapihvac.com \
  --role=customer \
  --display_name='Test User - ALC' \
  --user_pass='YOUR_SECURE_PASSWORD' \
  --path=/www/bapiheadlessstaging_582/public

# Set customer group
wp user meta update $(wp user get test-alc@bapihvac.com --field=ID --path=/www/bapiheadlessstaging_582/public) \
  customer_group 'alc' \
  --path=/www/bapiheadlessstaging_582/public

# Repeat for ACS, EMC, CCG, CCGA, and Standard users
```

---

## Verification

### Check Product Distribution

```bash
ssh -p 17338 bapiheadlessstaging@35.224.70.159 \
  "wp db query \"SELECT 
    CASE 
      WHEN meta_value LIKE '%alc%' THEN 'ALC'
      WHEN meta_value LIKE '%acs%' THEN 'ACS'
      WHEN meta_value LIKE '%emc%' THEN 'EMC'
      WHEN meta_value LIKE '%ccga%' THEN 'CCGA'
      WHEN meta_value LIKE '%ccg%' THEN 'CCG'
      WHEN meta_value IS NULL OR meta_value = '' THEN 'Standard'
    END as group_name,
    COUNT(*) as count
  FROM wp_postmeta pm
  INNER JOIN wp_posts p ON pm.post_id = p.ID
  WHERE pm.meta_key = 'customer_group1'
    AND p.post_type = 'product'
    AND p.post_status = 'publish'
  GROUP BY group_name;\" \
  --path=/www/bapiheadlessstaging_582/public"
```

**Expected Output:**
```
group_name  count
ALC         225
CCG         35
EMC         18
CCGA        15
ACS         8
```

### Check Test Users

```bash
ssh -p 17338 bapiheadlessstaging@35.224.70.159 \
  "wp user list --role=customer --fields=user_email,display_name,customer_group --path=/www/bapiheadlessstaging_582/public"
```

---

## Test Credentials

**Password:** Retrieve from secure storage (not committed to repo)

| Email | Customer Group | Description |
|-------|----------------|-------------|
| `test-alc@bapihvac.com` | alc | ALC customer group |
| `test-acs@bapihvac.com` | acs | ACS customer group |
| `test-emc@bapihvac.com` | emc | EMC customer group |
| `test-ccg@bapihvac.com` | ccg | CCG customer group |
| `test-ccga@bapihvac.com` | ccga | CCGA customer group |
| `test-standard@bapihvac.com` | none | Standard user (no group) |

---

## Data Format Notes

### ACF Serialized Arrays

ACF stores select field values as serialized PHP arrays:

```php
// Single value selected: "alc"
'a:1:{i:0;s:3:"alc";}'

// Deserialized equivalent:
array(1) {
  [0] => string(3) "alc"
}
```

### Customer Group Values

- **Lowercase in database:** `'alc'`, `'acs'`, `'emc'`, `'ccg'`, `'ccga'`
- **Uppercase in product titles:** `'(ALC)'`, `'(ACS)'`, `'(EMC)'`, `'(CCG)'`, `'(CCGA)'`
- **Slash format:** `'ALC/'`, `'ACS/'`, `'EMC/'`, `'CCG/'`, `'CCGA/'` (3-4 letter prefixes)
- **Matching logic:** Case-insensitive comparison in filtering code

---

## Troubleshooting

### Issue: "This does not seem to be a WordPress installation"

**Solution:** Always specify `--path=/www/bapiheadlessstaging_582/public` with WP-CLI commands.

### Issue: User creation fails with "Email already exists"

**Solution:** User already exists. Just update the meta field:
```bash
wp user meta update <user_id> customer_group 'alc' --path=/www/bapiheadlessstaging_582/public
```

### Issue: Products not showing customer group in GraphQL

**Solution:** 
1. Verify ACF field group "CustomerInformation" is assigned to Products
2. Check WPGraphQL settings include ACF fields
3. Run schema regeneration: `wp graphql update-schema --path=/www/bapiheadlessstaging_582/public`

---

## Rollback

To remove all customer group assignments:

```bash
# Clear all product customer groups (run on server)
wp db query "UPDATE wp_postmeta SET meta_value = '' WHERE meta_key IN ('customer_group1', 'customer_group2', 'customer_group3');" --path=/www/bapiheadlessstaging_582/public

# Remove test users
wp user delete test-alc@bapihvac.com --yes --path=/www/bapiheadlessstaging_582/public
wp user delete test-acs@bapihvac.com --yes --path=/www/bapiheadlessstaging_582/public
wp user delete test-emc@bapihvac.com --yes --path=/www/bapiheadlessstaging_582/public
wp user delete test-ccg@bapihvac.com --yes --path=/www/bapiheadlessstaging_582/public
wp user delete test-standard@bapihvac.com --yes --path=/www/bapiheadlessstaging_582/public
```

---

## Next Steps After Running Scripts

1. **Verify GraphQL Schema** - Check that `customerGroup1/2/3` are queryable
2. **Implement Frontend Filtering** - Follow implementation plan in `docs/DAILY-LOG.md`
3. **Add User CustomerGroup to Auth** - Update `GET_CURRENT_USER_QUERY` to include `customerGroup`
4. **Create Filtering Utility** - Build `filterProductsByCustomerGroup()` function
5. **Integration Testing** - Test with all 5 test users across all browsing contexts

---

## Customer Group Files

- `populate-customer-groups.sql` - SQL script to update product meta
- `setup-customer-groups.sh` - Automated setup script (recommended)

---

## Support

For questions or issues, refer to:
- **Implementation Plan:** `docs/DAILY-LOG.md` (April 1, 2026 entry)
- **Architecture:** `docs/CUSTOMER-GROUP-FILTERING.md`
- **GraphQL Schema:** `web/src/lib/graphql/generated.ts` (lines 5638-5642)
