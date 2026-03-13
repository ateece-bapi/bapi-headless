#!/bin/bash
# Verify Product Category Counts
# Compares hardcoded counts with GraphQL API data

set -e

GRAPHQL_URL="https://bapiheadlessstaging.kinsta.cloud/graphql"

echo "🔍 Verifying Product Category Counts"
echo "📡 GraphQL Endpoint: $GRAPHQL_URL"
echo ""

# Define hardcoded counts from web/src/app/[locale]/products/page.tsx
declare -A HARDCODED=(
  ["temperature-sensors"]=119
  ["humidity-sensors"]=33
  ["pressure-sensors"]=39
  ["air-quality-sensors"]=32
  ["wireless-sensors"]=24
  ["accessories"]=45
  ["test-instruments"]=8
  ["eta-line"]=70
)

TOTAL_HARDCODED=370

# Query GraphQL
echo "📊 Fetching category counts from WordPress..."
RESPONSE=$(curl -s -X POST "$GRAPHQL_URL" \
  -H "Content-Type: application/json" \
  -d '{"query": "query { productCategories(first: 100, where: { hideEmpty: false }) { nodes { name slug count } } }"}')

# Check if response is valid
if echo "$RESPONSE" | jq empty 2>/dev/null; then
  echo "✅ GraphQL response received"
  echo ""
else
  echo "❌ Invalid JSON response from GraphQL"
  echo "$RESPONSE"
  exit 1
fi

# Parse and display results
echo "📊 Comparison Report:"
echo ""
echo "Category              | Hardcoded | GraphQL | Match | Diff"
echo "----------------------|-----------|---------|-------|------"

TOTAL_GRAPHQL=0
MATCH_COUNT=0
MISMATCH_COUNT=0

for slug in "${!HARDCODED[@]}"; do
  HARDCODED_COUNT=${HARDCODED[$slug]}
  
  # Extract count from GraphQL response
  GRAPHQL_COUNT=$(echo "$RESPONSE" | jq -r ".data.productCategories.nodes[] | select(.slug == \"$slug\") | .count // 0")
  
  if [ -z "$GRAPHQL_COUNT" ]; then
    GRAPHQL_COUNT=0
  fi
  
  TOTAL_GRAPHQL=$((TOTAL_GRAPHQL + GRAPHQL_COUNT))
  
  # Check match
  if [ "$HARDCODED_COUNT" -eq "$GRAPHQL_COUNT" ]; then
    MATCH="✅"
    MATCH_COUNT=$((MATCH_COUNT + 1))
  else
    MATCH="❌"
    MISMATCH_COUNT=$((MISMATCH_COUNT + 1))
  fi
  
  # Calculate diff
  DIFF=$((GRAPHQL_COUNT - HARDCODED_COUNT))
  if [ $DIFF -gt 0 ]; then
    DIFF_STR="+$DIFF"
  else
    DIFF_STR="$DIFF"
  fi
  
  # Format output
  printf "%-21s | %9d | %7d | %5s | %5s\n" "$slug" "$HARDCODED_COUNT" "$GRAPHQL_COUNT" "$MATCH" "$DIFF_STR"
done

echo "----------------------|-----------|---------|-------|------"
TOTAL_DIFF=$((TOTAL_GRAPHQL - TOTAL_HARDCODED))
if [ $TOTAL_DIFF -gt 0 ]; then
  TOTAL_DIFF_STR="+$TOTAL_DIFF"
else
  TOTAL_DIFF_STR="$TOTAL_DIFF"
fi
printf "%-21s | %9d | %7d |       | %5s\n" "TOTAL" "$TOTAL_HARDCODED" "$TOTAL_GRAPHQL" "$TOTAL_DIFF_STR"

echo ""
echo "📈 Summary:"
echo "   ✅ Matches: $MATCH_COUNT/${#HARDCODED[@]}"
echo "   ❌ Mismatches: $MISMATCH_COUNT/${#HARDCODED[@]}"
echo "   📊 Total Products (Hardcoded): $TOTAL_HARDCODED"
echo "   📊 Total Products (GraphQL): $TOTAL_GRAPHQL"
echo "   📊 Difference: $TOTAL_DIFF_STR"
echo ""

# Check for additional categories
echo "🔍 Checking for additional WordPress categories..."
ADDITIONAL=$(echo "$RESPONSE" | jq -r '.data.productCategories.nodes[] | select(.count != null and .count > 0) | select(.slug | IN("temperature-sensors", "humidity-sensors", "pressure-sensors", "air-quality-sensors", "wireless-sensors", "accessories", "test-instruments", "eta-line") | not) | "\(.name) (\(.slug)): \(.count) products"')

if [ -n "$ADDITIONAL" ]; then
  echo "⚠️  Additional categories in WordPress (not in hardcoded list):"
  echo "$ADDITIONAL" | while read -r line; do
    echo "   - $line"
  done
  echo ""
fi

# Recommendations
if [ $MISMATCH_COUNT -gt 0 ] || [ -n "$ADDITIONAL" ]; then
  echo "💡 Recommendations:"
  if [ $MISMATCH_COUNT -gt 0 ]; then
    echo "   1. Update hardcoded counts in web/src/app/[locale]/products/page.tsx"
  fi
  if [ -n "$ADDITIONAL" ]; then
    echo "   2. Consider adding missing categories to the products page"
  fi
  echo "   3. Consider using GraphQL query instead of hardcoded data for real-time accuracy"
  echo ""
  exit 1
else
  echo "✅ All counts match! No updates needed."
  echo ""
  exit 0
fi
