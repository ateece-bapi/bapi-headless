#!/bin/bash

# BAPI Variation SKU Search - Test Script
# Tests variation SKU search functionality via WP-CLI and GraphQL

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}BAPI Variation SKU Search - Test Script${NC}"
echo "=========================================="
echo ""

# Check if environment is specified
if [ -z "$1" ]; then
    echo -e "${RED}Error: Environment not specified${NC}"
    echo "Usage: $0 <staging|production|local>"
    echo ""
    echo "Example:"
    echo "  $0 staging"
    exit 1
fi

ENVIRONMENT=$1

# Helper function to get environment variables with defaults
get_env() {
    VAR_NAME=$1
    DEFAULT_VALUE=$2
    VAR_VALUE="${!VAR_NAME}"
    
    if [ -z "$VAR_VALUE" ]; then
        echo "$DEFAULT_VALUE"
    else
        echo "$VAR_VALUE"
    fi
}

# Set server details based on environment
if [ "$ENVIRONMENT" == "staging" ]; then
    # Headless WordPress staging on Kinsta
    GRAPHQL_ENDPOINT=$(get_env "STAGING_GRAPHQL_ENDPOINT" "https://bapiheadlessstaging.kinsta.cloud/graphql")
    SSH_SERVER=$(get_env "STAGING_SSH_SERVER" "bapiheadlessstaging@35.224.70.159")
    SSH_PORT=$(get_env "STAGING_SSH_PORT" "17338")
elif [ "$ENVIRONMENT" == "production" ]; then
    # Headless WordPress production on Kinsta
    GRAPHQL_ENDPOINT=$(get_env "PRODUCTION_GRAPHQL_ENDPOINT" "")
    SSH_SERVER=$(get_env "PRODUCTION_SSH_SERVER" "")
    SSH_PORT=$(get_env "PRODUCTION_SSH_PORT" "")
elif [ "$ENVIRONMENT" == "local" ]; then
    GRAPHQL_ENDPOINT="http://localhost:8000/graphql"
    SSH_SERVER=""
    SSH_PORT=""
else
    echo -e "${RED}Error: Invalid environment${NC}"
    exit 1
fi

echo -e "${YELLOW}Testing environment: ${ENVIRONMENT}${NC}"
echo "GraphQL Endpoint: $GRAPHQL_ENDPOINT"
echo ""

# Test Case 1: Verify plugin is loaded (via SSH)
echo -e "${BLUE}Test 1: Verify plugin is loaded${NC}"
echo "---------------------------------------"

if [ "$ENVIRONMENT" != "local" ] && [ -n "$SSH_SERVER" ]; then
    ssh -p "${SSH_PORT}" "$SSH_SERVER" "wp plugin list --status=must-use --format=table | grep -i variation || echo 'Plugin not found in mu-plugins list'"
else
    echo "Skipped for local environment"
fi

echo ""

# Test Case 2: Search for known variation SKU using custom resolver
echo -e "${BLUE}Test 2: searchProductsByVariationSku (CCGA/10K-2-D-4\"-BB4)${NC}"
echo "---------------------------------------"

GRAPHQL_QUERY='
query TestVariationSKU {
  searchProductsByVariationSku(sku: "CCGA/10K-2-D-4\"-BB4") {
    databaseId
    name
    sku
  }
}
'

echo "Query: searchProductsByVariationSku(sku: 'CCGA/10K-2-D-4\"-BB4')"
echo "Expected: Parent product 'CCGA/10K-2-D' (ID: 50116)"
echo ""

jq -n --arg query "$GRAPHQL_QUERY" '{query: $query}' | \
  curl -s -X POST "$GRAPHQL_ENDPOINT" \
    -H "Content-Type: application/json" \
    --data-binary @- | jq '.data.searchProductsByVariationSku'

echo ""

# Test Case 3: Search for partial variation SKU using prefix resolver
echo -e "${BLUE}Test 3: searchProductsByVariationSkuPrefix (CCGA/10K-2-D)${NC}"
echo "---------------------------------------"

GRAPHQL_QUERY='
query TestPartialSKU {
  searchProductsByVariationSkuPrefix(prefix: "CCGA/10K-2-D") {
    databaseId
    name
    sku
  }
}
'

echo "Query: searchProductsByVariationSkuPrefix(prefix: 'CCGA/10K-2-D')"
echo "Expected: Multiple products with variations starting with 'CCGA/10K-2-D'"
echo ""

jq -n --arg query "$GRAPHQL_QUERY" '{query: $query}' | \
  curl -s -X POST "$GRAPHQL_ENDPOINT" \
    -H "Content-Type: application/json" \
    --data-binary @- | jq '.data.searchProductsByVariationSkuPrefix'

echo ""

# Test Case 4: Search with punctuation (hyphen)
echo -e "${BLUE}Test 4: Search with punctuation (10K-2)${NC}"
echo "---------------------------------------"

GRAPHQL_QUERY='
query TestPunctuation {
  products(where: { search: "10K-2" }, first: 5) {
    nodes {
      databaseId
      name
      sku
    }
  }
}
'

echo "Query: Search for '10K-2' (with hyphen)"
echo "Expected: Products matching '10K-2' in name or SKUs"
echo ""

curl -s -X POST "$GRAPHQL_ENDPOINT" \
  -H "Content-Type: application/json" \
  -d "{\"query\": \"$GRAPHQL_QUERY\"}" | jq '.data.products.nodes'

echo ""

# Test Case 5: Get variation SKUs for a known variable product
echo -e "${BLUE}Test 5: Verify variation SKUs exist for product 50116${NC}"
echo "---------------------------------------"

if [ "$ENVIRONMENT" != "local" ] && [ -n "$SSH_SERVER" ]; then
    echo "Via WP-CLI (showing variation SKUs):"
    ssh -p "${SSH_PORT}" "$SSH_SERVER" "wp db query \"SELECT p.ID, p.post_title, pm.meta_value as sku FROM wp_posts p LEFT JOIN wp_postmeta pm ON p.ID=pm.post_id AND pm.meta_key='_sku' WHERE p.post_parent=50116 AND p.post_type='product_variation' LIMIT 5\""
else
    echo "Skipped for local environment"
fi

echo ""

# Summary
echo -e "${GREEN}=========================================="
echo "Test Summary"
echo "==========================================${NC}"
echo ""
echo "✓ Test 1: Plugin loaded check"
echo "✓ Test 2: Exact variation SKU search"
echo "✓ Test 3: Partial SKU search"
echo "✓ Test 4: Punctuation preservation"
echo "✓ Test 5: Variation data verification"
echo ""
echo -e "${YELLOW}Review the results above to confirm:${NC}"
echo "  1. Parent products returned (not variations)"
echo "  2. Searching variation SKUs finds parent"
echo "  3. Punctuation preserved in search"
echo "  4. No duplicate results"
echo ""
