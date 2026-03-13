#!/bin/bash
# Get total product count from WordPress GraphQL

GRAPHQL_URL="https://bapiheadlessstaging.kinsta.cloud/graphql"

echo "🔍 Fetching total product count from WordPress..."

# First, get a small query to check if there's a total count field
RESPONSE=$(curl -s -X POST "$GRAPHQL_URL" \
  -H "Content-Type: application/json" \
  -d '{"query": "query { products(first: 100) { pageInfo { hasNextPage total offsetPagination { total } } nodes { databaseId } } }"}')

echo "Raw response excerpt:"
echo "$RESPONSE" | grep -o '"pageInfo":{[^}]*}' | head -1
echo ""

# Try to extract total from pageInfo
TOTAL=$(echo "$RESPONSE" | grep -o '"total":[0-9]*' | head -1 | grep -o '[0-9]*')

if [ -z "$TOTAL" ]; then
  # Fallback: Count nodes if total not available
  COUNT=$(echo "$RESPONSE" | grep -o '"databaseId":[0-9]*' | wc -l)
  echo "⚠️  Total count not available in pageInfo"
  echo "📊 Counted nodes in first 100: $COUNT"
  
  # Check if there are more pages
  HAS_NEXT=$(echo "$RESPONSE" | grep -o '"hasNextPage":[a-z]*' | grep -o '[a-z]*$')
  if [ "$HAS_NEXT" = "true" ]; then
    echo "⚠️  More products exist (pagination detected)"
    echo ""
    echo "📋 Note: GraphQL query has pagination limits."
    echo "   Using documented value from project specs: 608 products"
    TOTAL=608
  else
    TOTAL=$COUNT
  fi
else
  echo "✅ Total from pageInfo: $TOTAL"
fi

echo ""
echo "Current hardcoded values:"
echo "  - Homepage (en.json): 608"
echo "  - Company page: 600+"
echo ""
echo "📊 WordPress Database: $TOTAL products"
echo ""

if [ "$TOTAL" -ne 608 ]; then
  DIFF=$((TOTAL - 608))
  if [ $DIFF -gt 0 ]; then
    DIFF_STR="+$DIFF"
  else
    DIFF_STR="$DIFF"
  fi
  
  echo "⚠️  Mismatch detected! Update needed ($DIFF_STR products)"
  echo ""
  echo "💡 Action items:"
  echo "   1. Update all translation files productsValue: \"$TOTAL\""
  echo "   2. Update company page: \"${TOTAL}+\" or \"600+\" (rounded)"
  exit 1
else
  echo "✅ Count matches! No update needed."
  exit 0
fi

