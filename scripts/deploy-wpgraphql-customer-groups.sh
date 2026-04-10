#!/bin/bash
#
# Deploy WPGraphQL Customer Groups Registration
#
# This script installs the customer-group taxonomy registration
# to both legacy and headless WordPress instances.
#
# Usage:
#   ./scripts/deploy-wpgraphql-customer-groups.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}WPGraphQL Customer Groups - Deployment${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# Check if source file exists
SOURCE_FILE="$PROJECT_ROOT/cms/files/wpgraphql-customer-groups.php"
if [ ! -f "$SOURCE_FILE" ]; then
    echo -e "${RED}Error: Source file not found: $SOURCE_FILE${NC}"
    exit 1
fi

echo -e "${YELLOW}Source file: $SOURCE_FILE${NC}"
echo ""

# Function to deploy to a server
deploy_to_server() {
    local SERVER=$1
    local TARGET_PATH=$2
    local SERVER_NAME=$3
    
    echo -e "${GREEN}Deploying to $SERVER_NAME...${NC}"
    
    # Check if we can connect to the server
    if ! ssh "$SERVER" "echo 'Connection successful'" 2>/dev/null; then
        echo -e "${RED}Error: Cannot connect to $SERVER${NC}"
        return 1
    fi
    
    # Create mu-plugins directory if it doesn't exist
    ssh "$SERVER" "mkdir -p $TARGET_PATH/wp-content/mu-plugins"
    
    # Copy the file
    scp "$SOURCE_FILE" "$SERVER:$TARGET_PATH/wp-content/mu-plugins/wpgraphql-customer-groups.php"
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Successfully deployed to $SERVER_NAME${NC}"
        
        # Flush GraphQL schema cache
        ssh "$SERVER" "cd $TARGET_PATH && wp graphql clear-schema 2>/dev/null || echo 'Note: GraphQL schema cache clear not available'"
        
        echo ""
        return 0
    else
        echo -e "${RED}✗ Failed to deploy to $SERVER_NAME${NC}"
        echo ""
        return 1
    fi
}

# Deploy to headless/staging server (Kinsta)
echo -e "${YELLOW}1. Deploying to Headless Staging (Kinsta)...${NC}"
deploy_to_server \
    "bapiheadlessstaging@fbj-bapiheadlessstaging-live-prod" \
    "~/public" \
    "Headless Staging"

HEADLESS_STATUS=$?

# Deploy to legacy server (optional - for testing)
echo -e "${YELLOW}2. Deploying to Legacy Server (Optional)...${NC}"
read -p "Deploy to legacy server? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    deploy_to_server \
        "bapihvac@stage-2025" \
        "~/files" \
        "Legacy Server"
    LEGACY_STATUS=$?
else
    echo "Skipping legacy server deployment"
    LEGACY_STATUS=0
fi

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Deployment Summary${NC}"
echo -e "${GREEN}========================================${NC}"

if [ $HEADLESS_STATUS -eq 0 ]; then
    echo -e "${GREEN}✓ Headless Staging: SUCCESS${NC}"
else
    echo -e "${RED}✗ Headless Staging: FAILED${NC}"
fi

if [ $LEGACY_STATUS -eq 0 ] && [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${GREEN}✓ Legacy Server: SUCCESS${NC}"
elif [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}○ Legacy Server: SKIPPED${NC}"
else
    echo -e "${RED}✗ Legacy Server: FAILED${NC}"
fi

echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "1. Download updated GraphQL schema: cd web && pnpm run download-schema"
echo "2. Update GraphQL queries to include customerGroups field"
echo "3. Regenerate types: pnpm run codegen"
echo "4. Test queries in GraphiQL: ${NEXT_PUBLIC_WORDPRESS_GRAPHQL}"
echo ""

if [ $HEADLESS_STATUS -ne 0 ]; then
    exit 1
fi
