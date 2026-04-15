#!/bin/bash

# BAPI Variation SKU Search - Deployment Script
# Deploys mu-plugin to Kinsta WordPress staging/production

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}BAPI Variation SKU Search - Deployment Script${NC}"
echo "=================================================="
echo ""

# Check if environment is specified
if [ -z "$1" ]; then
    echo -e "${RED}Error: Environment not specified${NC}"
    echo "Usage: $0 <staging|production>"
    echo ""
    echo "Example:"
    echo "  $0 staging"
    exit 1
fi

ENVIRONMENT=$1

# Set server details based on environment
if [ "$ENVIRONMENT" == "staging" ]; then
    SERVER="bapiheadlessstaging.kinsta.cloud"
    SSH_USER="bapiheadlessstaging"
    REMOTE_PATH="/www/bapiheadlessstaging_111/public/wp-content/mu-plugins/"
elif [ "$ENVIRONMENT" == "production" ]; then
    SERVER="bapi-headless-production.kinsta.cloud" # TODO: Update with actual production domain
    SSH_USER="bapiheadless"
    REMOTE_PATH="/www/bapiheadless_111/public/wp-content/mu-plugins/"
else
    echo -e "${RED}Error: Invalid environment${NC}"
    echo "Must be 'staging' or 'production'"
    exit 1
fi

echo -e "${YELLOW}Deploying to: ${ENVIRONMENT}${NC}"
echo "Server: $SERVER"
echo ""

# Check if mu-plugin file exists
PLUGIN_FILE="cms/wp-content/mu-plugins/bapi-variation-sku-search.php"

if [ ! -f "$PLUGIN_FILE" ]; then
    echo -e "${RED}Error: Plugin file not found${NC}"
    echo "Expected: $PLUGIN_FILE"
    exit 1
fi

echo "✓ Plugin file found: $PLUGIN_FILE"
echo ""

# Show file contents for review
echo -e "${YELLOW}Plugin file preview (first 20 lines):${NC}"
head -20 "$PLUGIN_FILE"
echo "..."
echo ""

# Confirm deployment
echo -e "${YELLOW}Ready to deploy to $ENVIRONMENT${NC}"
read -p "Continue? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Deployment cancelled"
    exit 0
fi

# Deploy via SCP
echo ""
echo "Deploying plugin..."
echo "Target: ${SSH_USER}@${SERVER}:${REMOTE_PATH}"
echo ""

# Create mu-plugins directory if it doesn't exist
ssh "${SSH_USER}@${SERVER}" "mkdir -p ${REMOTE_PATH}"

# Copy file
scp "$PLUGIN_FILE" "${SSH_USER}@${SERVER}:${REMOTE_PATH}bapi-variation-sku-search.php"

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✓ Plugin deployed successfully!${NC}"
    echo ""
    
    # Verify file exists on server
    echo "Verifying deployment..."
    ssh "${SSH_USER}@${SERVER}" "ls -lh ${REMOTE_PATH}bapi-variation-sku-search.php"
    
    echo ""
    echo -e "${GREEN}Next Steps:${NC}"
    echo "1. Log into WordPress Admin: https://${SERVER}/wp-admin"
    echo "2. Go to Plugins → Must-Use"
    echo "3. Verify 'BAPI Variation SKU Search' is listed"
    echo "4. Test search via GraphiQL: https://${SERVER}/graphql"
    echo "5. Run test script: ./scripts/test-variation-search.sh ${ENVIRONMENT}"
    echo ""
else
    echo ""
    echo -e "${RED}✗ Deployment failed${NC}"
    exit 1
fi
