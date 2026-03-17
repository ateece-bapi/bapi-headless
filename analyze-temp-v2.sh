#!/bin/bash
# WordPress Temperature Products Analysis - V2

GRAPHQL_URL="https://bapiheadlessstaging.kinsta.cloud/graphql"
TEMP_FILE="/tmp/products-data.json"

echo "🔍 Analyzing Temperature Products..."
echo ""

#Query all products with proper inline fragments
curl -s "$GRAPHQL_URL" \
  -H 'Content-Type: application/json' \
  -d '{"query":"{ products(first: 200) { nodes { id name slug ... on SimpleProduct { productCategories { nodes { name slug parent { node { name slug } } } } attributes { nodes { name options } } } ... on VariableProduct { productCategories { nodes { name slug parent { node { name slug } } } } attributes { nodes { name options } } } } } }"}' > "$TEMP_FILE"

# Analyze with Python
python3 << PYTHON_SCRIPT
import json
from collections import defaultdict

with open('$TEMP_FILE', 'r') as f:
    data = json.load(f)

all_products = data.get('data', {}).get('products', {}).get('nodes', [])

# Filter for temperature products
products = [p for p in all_products if any(
    'temperature' in (cat.get('slug', '') or '').lower() or 
    'temperature' in ((cat.get('parent', {}).get('node', {}).get('slug', '')) or '').lower()
    for cat in (p.get('productCategories', {}).get('nodes', []) or [])
)]

print(f"📊 Temperature products found: {len(products)}")
print(f"    (Out of {len(all_products)} total products)\n")

subcats = defaultdict(int)
applications = defaultdict(int)

for product in products:
    # Count subcategories
    cats = product.get('productCategories', {}).get('nodes', []) or []
    found_subcat = False
    for cat in cats:
        parent = cat.get('parent', {}).get('node', {})
        parent_slug = (parent.get('slug', '') or '').lower()
        if 'temperature' in parent_slug:
            subcats[f"{cat['name']} ({cat['slug']})"] += 1
            found_subcat = True
    if not found_subcat:
        subcats['❌ No Subcategory'] += 1
    
    # Count applications
    attrs = product.get('attributes', {}).get('nodes', []) or []
    found_app = False
    for attr in attrs:
        attr_name = (attr.get('name', '') or '').lower()
        if 'application' in attr_name:
            for option in (attr.get('options', []) or []):
                applications[option] += 1
                found_app = True
    if not found_app:
        applications['❌ No Application'] += 1

print("📂 Current Subcategory Distribution:\n")
for cat, count in sorted(subcats.items(), key=lambda x: -x[1]):
    print(f"   {cat:45} {count} products")

print("\n📋 Application Attribute Distribution:\n")
for app, count in sorted(applications.items(), key=lambda x: -x[1]):
    print(f"   {app:40} {count} products")
PYTHON_SCRIPT

rm "$TEMP_FILE"
echo ""
echo "✅ Analysis complete"
