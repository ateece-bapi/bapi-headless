#!/bin/bash
# ================================================================
# BAPI Customer Group Setup Script
# ================================================================
# Purpose: Complete setup for customer group filtering system
# Date: April 1, 2026
# Usage: Run from local machine, connects via SSH to Kinsta staging
# ================================================================

set -e  # Exit on error

# Configuration
SSH_HOST="35.224.70.159"
SSH_PORT="17338"
SSH_USER="bapiheadlessstaging"
WP_PATH="/www/bapiheadlessstaging_582/public"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}================================================================"
echo "BAPI Customer Group Setup - Kinsta Staging"
echo "================================================================${NC}"

# Step 1: Verify SSH connection
echo -e "\n${YELLOW}Step 1: Verifying SSH connection...${NC}"
ssh -p $SSH_PORT $SSH_USER@$SSH_HOST "echo 'SSH connection successful'" || {
  echo -e "${RED}ERROR: SSH connection failed. Check credentials and network.${NC}"
  exit 1
}

# Step 2: Count products before update
echo -e "\n${YELLOW}Step 2: Checking current state...${NC}"
ssh -p $SSH_PORT $SSH_USER@$SSH_HOST "wp db query \"SELECT COUNT(*) as total FROM wp_posts WHERE post_type = 'product' AND post_status = 'publish';\" --path=$WP_PATH"

echo -e "\n${YELLOW}Products with company prefixes:${NC}"
ssh -p $SSH_PORT $SSH_USER@$SSH_HOST "wp db query \"SELECT SUBSTRING_INDEX(post_title, ')', 1) AS prefix, COUNT(*) as count FROM wp_posts WHERE post_type = 'product' AND post_status = 'publish' AND post_title LIKE '(%)%' GROUP BY prefix ORDER BY count DESC;\" --path=$WP_PATH"

# Step 3: Run SQL update script
echo -e "\n${YELLOW}Step 3: Populating customer groups for products...${NC}"
echo -e "${YELLOW}This will update customer_group1 meta field for 132 products.${NC}"
read -p "Continue? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo -e "${RED}Aborted by user.${NC}"
  exit 1
fi

# Upload SQL file and execute it
scp -P $SSH_PORT scripts/populate-customer-groups.sql $SSH_USER@$SSH_HOST:/tmp/populate-customer-groups.sql
ssh -p $SSH_PORT $SSH_USER@$SSH_HOST "wp db query \"\$(cat /tmp/populate-customer-groups.sql)\" --path=$WP_PATH && rm /tmp/populate-customer-groups.sql"

# Step 4: Verify updates
echo -e "\n${YELLOW}Step 4: Verifying product updates...${NC}"
ssh -p $SSH_PORT $SSH_USER@$SSH_HOST "wp db query \"SELECT CASE WHEN meta_value LIKE '%alc%' THEN 'ALC' WHEN meta_value LIKE '%acs%' THEN 'ACS' WHEN meta_value LIKE '%emc%' THEN 'EMC' WHEN meta_value LIKE '%ccg%' THEN 'CCG' WHEN meta_value = '' OR meta_value IS NULL THEN 'Standard' ELSE 'Other' END as customer_group, COUNT(*) as count FROM wp_postmeta pm INNER JOIN wp_posts p ON pm.post_id = p.ID WHERE pm.meta_key = 'customer_group1' AND p.post_type = 'product' AND p.post_status = 'publish' GROUP BY customer_group ORDER BY count DESC;\" --path=$WP_PATH"

# Step 5: Create test users
echo -e "\n${YELLOW}Step 5: Creating test users for each customer group...${NC}"

# Function to create/update user with customer group
create_test_user() {
  local email=$1
  local group=$2
  local display_name=$3
  
  echo -e "\n  Creating/updating user: ${email}"
  
  # Check if user exists
  USER_ID=$(ssh -p $SSH_PORT $SSH_USER@$SSH_HOST "wp user get $email --field=ID --path=$WP_PATH 2>/dev/null" || echo "")
  
  if [ -z "$USER_ID" ]; then
    # Create new user
    echo "    → Creating new user..."
    USER_ID=$(ssh -p $SSH_PORT $SSH_USER@$SSH_HOST "wp user create test-$group $email --role=customer --display_name='$display_name' --user_pass='TestBAPI2026!' --path=$WP_PATH --porcelain")
    echo "    → User created with ID: $USER_ID"
  else
    echo "    → User already exists (ID: $USER_ID)"
  fi
  
  # Set customer group meta
  ssh -p $SSH_PORT $SSH_USER@$SSH_HOST "wp user meta update $USER_ID customer_group '$group' --path=$WP_PATH"
  echo "    → Customer group set to: $group"
}

# Create test users
create_test_user "test-alc@bapihvac.com" "alc" "Test User - ALC"
create_test_user "test-acs@bapihvac.com" "acs" "Test User - ACS"
create_test_user "test-emc@bapihvac.com" "emc" "Test User - EMC"
create_test_user "test-ccg@bapihvac.com" "ccg" "Test User - CCG"
create_test_user "test-standard@bapihvac.com" "" "Test User - Standard (No Group)"

# Step 6: Summary
echo -e "\n${GREEN}================================================================"
echo "Setup Complete!"
echo "================================================================${NC}"
echo -e "\n${GREEN}Test Users Created:${NC}"
echo "  • test-alc@bapihvac.com (password: TestBAPI2026!) - Customer Group: alc"
echo "  • test-acs@bapihvac.com (password: TestBAPI2026!) - Customer Group: acs"
echo "  • test-emc@bapihvac.com (password: TestBAPI2026!) - Customer Group: emc"
echo "  • test-ccg@bapihvac.com (password: TestBAPI2026!) - Customer Group: ccg"
echo "  • test-standard@bapihvac.com (password: TestBAPI2026!) - No customer group"

echo -e "\n${GREEN}Expected Product Visibility:${NC}"
echo "  • Guest/Standard: 476 products (no prefixes)"
echo "  • ALC user: 588 products (476 standard + 112 ALC)"
echo "  • ACS user: 480 products (476 standard + 4 ACS)"
echo "  • EMC user: 485 products (476 standard + 9 EMC)"
echo "  • CCG user: 483 products (476 standard + 7 CCG)"

echo -e "\n${YELLOW}Next Steps:${NC}"
echo "  1. Test login with one of the test users"
echo "  2. Verify product visibility on category pages"
echo "  3. Check search results filtering"
echo "  4. Test GraphQL queries return customerGroup fields"

echo -e "\n${GREEN}================================================================${NC}"
