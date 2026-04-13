#!/bin/bash
# Fix test users - Update customer group fields to use ACF field names
# Problem: Old script set 'customer_group' but auth reads 'customer_group1/2/3'
# Solution: Update user meta to use correct ACF field names

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Kinsta staging SSH details
SSH_HOST="35.224.70.159"
SSH_PORT="17338"
SSH_USER="bapiheadlessstaging"
WP_PATH="/www/bapiheadlessstaging_582/public"

echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}Fix Test Users - ACF Field Names${NC}"
echo -e "${YELLOW}========================================${NC}"

# Function to update user customer group
update_user_group() {
  local email=$1
  local group=$2
  
  echo -e "\n${GREEN}→ Processing: $email${NC}"
  
  # Get user ID
  USER_ID=$(ssh -p $SSH_PORT $SSH_USER@$SSH_HOST "wp user get $email --field=ID --path=$WP_PATH 2>/dev/null || echo ''")
  
  if [ -z "$USER_ID" ]; then
    echo -e "${RED}  ✗ User not found: $email${NC}"
    return 1
  fi
  
  echo "  User ID: $USER_ID"
  
  # Update customer_group1 ACF field (primary group)
  if [ -n "$group" ]; then
    ssh -p $SSH_PORT $SSH_USER@$SSH_HOST "wp user meta update $USER_ID customer_group1 '$group' --path=$WP_PATH"
    echo -e "${GREEN}  ✓ Set customer_group1 = '$group'${NC}"
  else
    # Clear customer_group1 for standard user
    ssh -p $SSH_PORT $SSH_USER@$SSH_HOST "wp user meta delete $USER_ID customer_group1 --path=$WP_PATH 2>/dev/null || true"
    echo -e "${GREEN}  ✓ Cleared customer_group1 (standard user)${NC}"
  fi
  
  # Clear old incorrect field name if exists
  ssh -p $SSH_PORT $SSH_USER@$SSH_HOST "wp user meta delete $USER_ID customer_group --path=$WP_PATH 2>/dev/null || true"
}

# Update all test users
update_user_group "test-alc@bapihvac.com" "ALC"
update_user_group "test-acs@bapihvac.com" "ACS"
update_user_group "test-emc@bapihvac.com" "EMC"
update_user_group "test-ccg@bapihvac.com" "CCG"
update_user_group "test-ccga@bapihvac.com" "CCGA" "Test User - CCGA"
update_user_group "test-standard@bapihvac.com" "" "Test User - Standard"

echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}All test users updated successfully!${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "\n${YELLOW}Next steps:${NC}"
echo "1. Refresh your browser at staging site"
echo "2. Run: fetch('/api/auth/me').then(r => r.json()).then(console.log)"
echo "3. Verify customerGroups: ['alc'] (not ['end-user'])"
echo "4. Check Button Sensor category - should see ALC products"
