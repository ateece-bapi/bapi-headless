#!/bin/bash
# WordPress Product Analysis - Final Version

GRAPHQL_URL="https://bapiheadlessstaging.kinsta.cloud/graphql"

echo "🔍 Analyzing WordPress Products..."
echo ""

# Fetch and analyze in one go
curl -s "$GRAPHQL_URL" \
  -H 'Content-Type: application/json' \
  -d '{"query":"{ products(first: 200) { nodes { id name slug ... on SimpleProduct { productCategories { nodes { name slug parent { node { name slug } } } } attributes { nodes { name options } } } ... on VariableProduct { productCategories { nodes { name slug parent { node { name slug } } } } attributes { nodes { name options } } } } } }"}' | \
python3 - << 'PYTHON_SCRIPT'
import json, sys
from collections import defaultdict

data = json.load(sys.stdin)
all_products = data.get('data', {}).get('products', {}).get('nodes', [])

# Filter for temperature products (handle None values)
products = []
for p in all_products:
    cats = p.get('productCategories', {})
    if cats is None:
        continue
    cat_nodes = cats.get('nodes', [])
    if cat_nodes is None:
        continue
        
    for cat in cat_nodes:
        if cat is None:
            continue
        cat_slug = cat.get('slug', '') or ''
        parent = cat.get('parent', {})
        parent_slug = ''
        if parent and parent.get('node'):
            parent_slug = parent['node'].get('slug', '') or ''
            
        if 'temperature' in cat_slug.lower() or 'temperature' in parent_slug.lower():
            products.append(p)
            break

print(f"📊 Temperature products found: {len(products)}")
print(f"    (Out of {len(all_products)} total products)\n")

subcats = defaultdict(int)
applications = defaultdict(int)

for product in products:
    cats_obj = product.get('productCategories', {})
    if not cats_obj:
        continue
        
    cats = cats_obj.get('nodes', []) or []
    found_subcat = False
    
    for cat in cats:
        if not cat:
            continue
        parent_obj = cat.get('parent', {})
        if not parent_obj:
            continue
        parent_node = parent_obj.get('node', {})
        if not parent_node:
            continue
        parent_slug = parent_node.get('slug', '') or ''
        
        if 'temperature' in parent_slug.lower():
            cat_name = cat.get('name', 'Unknown')
            cat_slug = cat.get('slug', 'unknown')
            subcats[f"{cat_name} ({cat_slug})"] += 1
            found_subcat = True
            
    if not found_subcat:
        subcats['❌ No Subcategory'] += 1
    
    # Count applications
    attrs_obj = product.get('attributes', {})
    if not attrs_obj:
        applications['❌ No Application'] += 1
        continue
        
    attrs = attrs_obj.get('nodes', []) or []
    found_app = False
    
    for attr in attrs:
        if not attr:
            continue
        attr_name = (attr.get('name', '') or '').lower()
        if 'application' in attr_name:
            options = attr.get('options', []) or []
            for option in options:
                if option:
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

print("\n" + "="*60)
print("💡 RECOMMENDATIONS")
print("="*60 + "\n")

# Generate recommendations
app_list = [(app, count) for app, count in applications.items() if not app.startswith('❌')]
app_list.sort(key=lambda x: -x[1])

if len(app_list) > 0:
    print("Suggested new subcategories based on application data:\n")
    for app, count in app_list[:10]:
        slug = app.lower().replace(' ', '-').replace('/', '-').replace('(', '').replace(')', '')
        print(f"   temp-{slug:40} {count:3} products")
PYTHON_SCRIPT

echo ""
echo "✅ Analysis complete"
