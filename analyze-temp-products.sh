#!/bin/bash
# WordPress Temperature Products Analysis

GRAPHQL_URL="https://bapiheadlessstaging.kinsta.cloud/graphql"

echo "🔍 Analyzing Temperature Products..."
echo ""

# Query to get all products with their categories and attributes
QUERY='{
  "query": "{ products(first: 200) { nodes { id name slug ... on SimpleProduct { productCategories { nodes { name slug parent { node { name slug } } } } attributes { nodes { name options } } } ... on VariableProduct { productCategories { nodes { name slug parent { node { name slug } } } } attributes { nodes { name options } } } } } }"
}'

RESULT=$(curl -s "$GRAPHQL_URL" \
  -H 'Content-Type: application/json' \
  -d "$QUERY")

# Analyze subcategories and applications
echo "$RESULT" | python3 << 'PYTHON_SCRIPT'
import json, sys
from collections import defaultdict

try:
    data = json.load(sys.stdin)
    all_products = data.get('data', {}).get('products', {}).get('nodes', [])
    
    # Filter for temperature products
    products = [p for p in all_products if any(
        'temperature' in cat.get('slug', '').lower() or 
        (cat.get('parent', {}).get('node', {}).get('slug', '') or '').lower().startswith('temperature')
        for cat in p.get('productCategories', {}).get('nodes', [])
    )]
    
    print(f"📊 Temperature products found: {len(products)}\n")
    
    subcats = defaultdict(int)
    applications = defaultdict(int)
    
    for product in products:
        # Count subcategories
        cats = product.get('productCategories', {}).get('nodes', [])
        found_subcat = False
        for cat in cats:
            parent = cat.get('parent', {}).get('node', {})
            if parent.get('slug', '').startswith('temperature'):
                subcats[f"{cat['name']} ({cat['slug']})"] += 1
                found_subcat = True
        if not found_subcat:
            subcats['❌ No Subcategory'] += 1
        
        # Count applications
        attrs = product.get('attributes', {}).get('nodes', [])
        found_app = False
        for attr in attrs:
            if 'application' in attr.get('name', '').lower():
                for option in attr.get('options', []):
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
    
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()
PYTHON_SCRIPT

echo ""
echo "✅ Analysis complete"
