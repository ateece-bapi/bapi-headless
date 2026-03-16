#!/usr/bin/env python3
"""
Analyze ALL temperature products to design proper category structure.
"""

import json
import sys
from collections import defaultdict

def main():
    with open('/home/ateece/bapi-headless/all-products-complete.json', 'r') as f:
        all_products = json.load(f)
    
    print(f"Total products loaded: {len(all_products)}\n")
    
    # Filter temperature products
    temp_products = []
    for product in all_products:
        categories = product.get('productCategories')
        if categories and categories.get('nodes'):
            for cat in categories['nodes']:
                cat_slug = cat.get('slug', '')
                if 'temp' in cat_slug or 'temperature' in cat_slug:
                    temp_products.append(product)
                    break
    
    print(f"Temperature products found: {len(temp_products)}\n")
    
    # Group by current subcategory
    by_subcategory = defaultdict(list)
    by_application = defaultdict(list)
    products_with_no_app = []
    
    for product in temp_products:
        # Get subcategory
        subcats = []
        categories = product.get('productCategories')
        if categories and categories.get('nodes'):
            for cat in categories['nodes']:
                slug = cat.get('slug', '')
                if 'temp' in slug or 'temperature' in slug:
                    subcats.append(slug)
        
        subcat_key = subcats[0] if subcats else 'none'
        by_subcategory[subcat_key].append(product['name'])
        
        # Get application attribute
        app_found = False
        attributes = product.get('attributes')
        if attributes and attributes.get('nodes'):
            for attr in attributes['nodes']:
                if attr.get('name') == 'pa_application':
                    options = attr.get('options', [])
                    for opt in options:
                        by_application[opt].append(product['name'])
                        app_found = True
        
        if not app_found:
            products_with_no_app.append(product['name'])
    
    # Print current subcategory distribution
    print("=" * 80)
    print("CURRENT SUBCATEGORY DISTRIBUTION")
    print("=" * 80)
    for subcat, products in sorted(by_subcategory.items(), key=lambda x: -len(x[1])):
        print(f"\n{subcat}: {len(products)} products")
        for p in products[:5]:
            print(f"  - {p}")
        if len(products) > 5:
            print(f"  ... and {len(products) - 5} more")
    
    # Print application distribution
    print("\n" + "=" * 80)
    print("APPLICATION ATTRIBUTE DISTRIBUTION")
    print("=" * 80)
    for app, products in sorted(by_application.items(), key=lambda x: -len(x[1])):
        print(f"\n{app}: {len(products)} products")
        for p in products[:3]:
            print(f"  - {p}")
        if len(products) > 3:
            print(f"  ... and {len(products) - 3} more")
    
    # Print products missing application attribute
    print("\n" + "=" * 80)
    print(f"PRODUCTS WITHOUT APPLICATION ATTRIBUTE: {len(products_with_no_app)}")
    print("=" * 80)
    for p in products_with_no_app[:10]:
        print(f"  - {p}")
    if len(products_with_no_app) > 10:
        print(f"  ... and {len(products_with_no_app) - 10} more")
    
    # Recommendations
    print("\n" + "=" * 80)
    print("RECOMMENDED NEW SUBCATEGORY STRUCTURE")
    print("=" * 80)
    print("\nBased on application attributes, create these subcategories:")
    print("(under 'temperature-sensors' parent category)\n")
    
    for app in sorted(by_application.keys()):
        slug = f"temp-{app}"
        count = len(by_application[app])
        print(f"  - {slug:<30} ({count:>3} products)")
    
    # Data quality report
    print("\n" + "=" * 80)
    print("DATA QUALITY SUMMARY")
    print("=" * 80)
    total_temp = len(temp_products)
    tagged = total_temp - len(products_with_no_app)
    pct_tagged = (tagged / total_temp * 100) if total_temp > 0 else 0
    
    print(f"Total temperature products: {total_temp}")
    print(f"Products with application tags: {tagged} ({pct_tagged:.1f}%)")
    print(f"Products needing tags: {len(products_with_no_app)} ({100-pct_tagged:.1f}%)")
    
    if len(products_with_no_app) > 0:
        print("\n⚠️  MIGRATION REQUIRED:")
        print(f"   {len(products_with_no_app)} products need application attribute tagging in WordPress")

if __name__ == "__main__":
    main()
