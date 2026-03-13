#!/bin/bash
# Verify Product Category Counts - Simple version
# Compares hardcoded counts with GraphQL API data

GRAPHQL_URL="https://bapiheadlessstaging.kinsta.cloud/graphql"

echo "🔍 Verifying Product Category Counts"
echo "📡 GraphQL Endpoint: $GRAPHQL_URL"
echo ""
echo "📊 Fetching category counts from WordPress..."

# Query GraphQL and save to temp file
TEMP_FILE=$(mktemp)
curl -s -X POST "$GRAPHQL_URL" \
  -H "Content-Type: application/json" \
  -d '{"query": "query { productCategories(first: 100, where: { hideEmpty: false }) { nodes { name slug count } } }"}' \
  > "$TEMP_FILE"

# Check if we got data
if ! grep -q '"productCategories"' "$TEMP_FILE"; then
  echo "❌ Failed to fetch data from GraphQL"
  cat "$TEMP_FILE"
  rm "$TEMP_FILE"
  exit 1
fi

echo "✅ GraphQL response received"
echo ""
echo "📊 Comparison Report:"
echo ""
printf "%-25s | %9s | %7s | %5s | %6s\n" "Category" "Hardcoded" "GraphQL" "Match" "Diff"
echo "--------------------------|-----------|---------|-------|-------"

# Extract counts for each category using grep and awk
get_count() {
  local slug=$1
  grep -o "\"slug\":\"$slug\",\"count\":[0-9]*" "$TEMP_FILE" | grep -o "[0-9]*$" || echo "0"
}

# Define hardcoded counts (updated March 13, 2026 after GraphQL verification)
declare -A HARD
HARD["temperature-sensors"]=113  # Updated from 119
HARD["humidity-sensors"]=33      # Confirmed ✅
HARD["pressure-sensors"]=29      # Updated from 39
HARD["air-quality-sensors"]=30   # Updated from 32
HARD["bluetooth-wireless"]=24    # Maps to wireless-sensors in UI (was wireless-sensors: 2)
HARD["accessories"]=74           # Updated from 45
HARD["test-instruments"]=3       # Updated from 8
HARD["eta-line"]=70              # Confirmed ✅

TOTAL_HARD=366  # Updated from 370
TOTAL_GQL=0
MATCHES=0
MISMATCHES=0

# Compare each category
for slug in temperature-sensors humidity-sensors pressure-sensors air-quality-sensors bluetooth-wireless accessories test-instruments eta-line; do
  HARD_COUNT=${HARD[$slug]}
  GQL_COUNT=$(get_count "$slug")
  
  TOTAL_GQL=$((TOTAL_GQL + GQL_COUNT))
  
  if [ "$HARD_COUNT" -eq "$GQL_COUNT" ]; then
    MATCH="✅"
    MATCHES=$((MATCHES + 1))
  else
    MATCH="❌"
    MISMATCHES=$((MISMATCHES + 1))
  fi
  
  DIFF=$((GQL_COUNT - HARD_COUNT))
  if [ $DIFF -gt 0 ]; then
    DIFF_STR="+$DIFF"
  elif [ $DIFF -lt 0 ]; then
    DIFF_STR="$DIFF"
  else
    DIFF_STR="0"
  fi
  
  printf "%-25s | %9d | %7d | %5s | %6s\n" "$slug" "$HARD_COUNT" "$GQL_COUNT" "$MATCH" "$DIFF_STR"
done

echo "--------------------------|-----------|---------|-------|-------"
TOTAL_DIFF=$((TOTAL_GQL - TOTAL_HARD))
if [ $TOTAL_DIFF -gt 0 ]; then
  TOTAL_DIFF_STR="+$TOTAL_DIFF"
elif [ $TOTAL_DIFF -lt 0 ]; then
  TOTAL_DIFF_STR="$TOTAL_DIFF"
else
  TOTAL_DIFF_STR="0"
fi
printf "%-25s | %9d | %7d |       | %6s\n" "TOTAL" "$TOTAL_HARD" "$TOTAL_GQL" "$TOTAL_DIFF_STR"

echo ""
echo "📈 Summary:"
echo "   ✅ Matches: $MATCHES/8"
echo "   ❌ Mismatches: $MISMATCHES/8"
echo "   📊 Total Products (Hardcoded): $TOTAL_HARD"
echo "   📊 Total Products (GraphQL): $TOTAL_GQL"
echo "   📊 Difference: $TOTAL_DIFF_STR"
echo ""

# Check for bluetooth-wireless category (might be actual wireless)
BT_WIRELESS=$(get_count "bluetooth-wireless")
if [ "$BT_WIRELESS" -gt 0 ]; then
  echo "⚠️  Note: Found 'bluetooth-wireless' category with $BT_WIRELESS products"
  echo "   This might be the actual wireless sensors category instead of 'wireless-sensors'"
  echo ""
fi

# Show notable additional categories
echo "📋 Other notable WordPress categories:"
grep -o '"name":"[^"]*","slug":"[^"]*","count":[0-9]*' "$TEMP_FILE" | \
  grep -v 'null' | \
  awk -F'"' '{
    gsub(/,slug:/, "", $0)
    gsub(/,count:/, " ", $0)
    split($0, a, " ")
    count = a[2]
    if (count > 10 && $4 !~ /^(temperature-sensors|humidity-sensors|pressure-sensors|air-quality-sensors|wireless-sensors|accessories|test-instruments|eta-line)$/) {
      printf "   - %s (%s): %s products\n", $2, $4, count
    }
  }' | head -10

rm "$TEMP_FILE"

if [ $MISMATCHES -gt 0 ]; then
  echo ""
  echo "💡 Action needed: Update hardcoded counts in web/src/app/[locale]/products/page.tsx"
  exit 1
else
  echo ""
  echo "✅ All counts match!"
  exit 0
fi
