#!/bin/bash
# Fix Issue #11: Wireless Products in Wrong Categories
# Remove Temperature Sensors categories from Bluetooth Wireless products

set -e

# True wireless products that should NOT be in Temperature categories
WIRELESS_PRODUCTS=(
  408148  # Wireless BAPI-Stat "Quantum" Temperature and Humidity Sensor
  408050  # Wireless BAPI-Stat "Quantum" Temperature Sensor
  408161  # Wireless Duct Temperature Sensor
  408182  # Wireless Duct Temp/Humidity Sensor
  408194  # Wireless Immersion Temperature Sensor
  408204  # Wireless Remote Probe Temperature Sensor
  408231  # Wireless Outside Air Temperature Sensor
  408238  # Wireless Outside Air Temp/Humidity Sensor
  408248  # Wireless BAPI-Stat "Quantum Slim" Temperature Sensor
  408277  # Wireless BAPI-Stat "Quantum Slim" Temp/Humidity Sensor
  408243  # Wireless Thermobuffer Temperature Sensor
  408283  # Wireless Food Temperature Probe
)

echo "=== Fixing Wireless Product Categorization ==="
echo "Removing Temperature Sensors categories from Bluetooth Wireless products"
echo ""

for PRODUCT_ID in "${WIRELESS_PRODUCTS[@]}"; do
  echo "Processing product $PRODUCT_ID..."
  
  # Remove temperature-related categories
  ssh -p 17338 bapiheadlessstaging@35.224.70.159 << ENDSSH
cd public

PRODUCT_NAME=\$(wp post get $PRODUCT_ID --field=post_title 2>/dev/null || echo "Unknown")
echo "  Product: \$PRODUCT_NAME"

# Get current categories
CURRENT_CATS=\$(wp post term list $PRODUCT_ID product_cat --fields=slug --format=csv | tail -n +2)

# Remove each temperature category
for CAT_SLUG in \$CURRENT_CATS; do
  if [[ \$CAT_SLUG == temp-* ]] || [[ \$CAT_SLUG == temperature-* ]]; then
    wp post term remove $PRODUCT_ID product_cat "\$CAT_SLUG" 2>/dev/null
    echo "    ✓ Removed: \$CAT_SLUG"
  fi
done

# Verify final categories
FINAL_CATS=\$(wp post term list $PRODUCT_ID product_cat --fields=name --format=csv | tail -n +2 | paste -sd, -)
echo "    Final categories: \$FINAL_CATS"
echo ""
ENDSSH
done

echo "=== COMPLETE ==="
echo ""
echo "Next steps:"
echo "1. Verify changes via GraphQL"
echo "2. Test product pages in browser"
echo "3. Commit and create PR"
