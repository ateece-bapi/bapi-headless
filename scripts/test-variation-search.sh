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

# Set server details based on environment
if [ "$ENVIRONMENT" == "staging" ]; then
    # Headless WordPress staging on Kinsta
    GRAPHQL_ENDPOINT="https://bapiheadlessstaging.kinsta.cloud/graphql"
    SSH_SERVER="bapihvac@bapiheadlessstaging.kinsta.cloud"  # Update SSH user from MyKinsta
elif [ "$ENVIRONMENT" == "production" ]; then
    # Headless WordPress production on Kinsta
    GRAPHQL_ENDPOINT="https://TBD/graphql"  # TODO: Update with production URL
    SSH_SERVER="TBD@TBD"
elif [ "$ENVIRONMENT" == "local" ]; then
    GRAPHQL_ENDPOINT="http://localhost:8000/graphql"
    SSH_SERVER=""
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

if [ "$ENVIRONMENT" != "local" ]; then
    ssh "$SSH_SERVER" "wp plugin list --status=must-use --format=table | grep -i variation || echo 'Plugin not found in mu-plugins list'"
else
    echo "Skipped for local environment"
fi

echo ""

# Test Case 2: Search for known variation SKU
echo -e "${BLUE}Test 2: Search for variation SKU (CCGA/10K-2-D-4\"-BB4)${NC}"
echo "---------------------------------------"

GRAPHQL_QUERY='
query TestVariationSKU {
  products(where: { search: "CCGA/10K-2-D-4\"-BB4" }, first: 5) {
    nodes {
      databaseId
      name
      sku
    }
  }
}
'

echo "Query: Search for 'CCGA/10K-2-D-4\"-BB4'"
echo "Expected: Parent product 'CCGA/10K-2-D' (ID: 50116)"
echo ""

curl -s -X POST "$GRAPHQL_ENDPOINT" \
  -H "Content-Type: application/json" \
  -d "{\"query\": \"$GRAPHQL_QUERY\"}" | jq '.data.products.nodes'

echo ""

# Test Case 3: Search for partial variation SKU
echo -e "${BLUE}Test 3: Search for partial SKU (CCGA/10K-2-D)${NC}"
echo "---------------------------------------"

GRAPHQL_QUERY='
query TestPartialSKU {
  products(where: { search: "CCGA/10K-2-D" }, first: 10) {
    nodes {
      databaseId
      name
      sku
    }
  }
}
'

echo "Query: Search for 'CCGA/10K-2-D'"
echo "Expected: Multiple products with '10K-2-D' in name or variation SKUs"
echo ""

curl -s -X POST "$GRAPHQL_ENDPOINT" \
  -H "Content-Type: application/json" \
  -d "{\"query\": \"$GRAPHQL_QUERY\"}" | jq '.data.products.nodes'

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

if [ "$ENVIRONMENT" != "local" ]; then
    echo "Via WP-CLI (showing variation SKUs):"
    ssh "$SSH_SERVER" "wp db query \"SELECT p.ID, p.post_title, pm.meta_value as sku FROM wp_posts p LEFT JOIN wp_postmeta pm ON p.ID=pm.post_id AND pm.meta_key='_sku' WHERE p.post_parent=50116 AND p.post_type='product_variation' LIMIT 5\""
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
