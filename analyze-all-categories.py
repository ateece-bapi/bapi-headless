#!/usr/bin/env python3
"""
Analyze ALL product categories to determine which need restructuring.
"""

import json
from collections import defaultdict

def analyze_category(all_products, category_keywords):
    """Analyze products for a specific category."""
    products = []
    for product in all_products:
        categories = product.get('productCategories')
        if categories and categories.get('nodes'):
            for cat in categories['nodes']:
                cat_slug = cat.get('slug', '')
                if any(kw in cat_slug for kw in category_keywords):
                    products.append(product)
                    break
    
    # Group by subcategory and application
    by_subcategory = defaultdict(list)
    by_application = defaultdict(list)
    products_with_no_app = []
    
    for product in products:
        # Get subcategories
        subcats = []
        categories = product.get('productCategories')
        if categories and categories.get('nodes'):
            for cat in categories['nodes']:
                slug = cat.get('slug', '')
                if any(kw in slug for kw in category_keywords):
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
    
    return products, by_subcategory, by_application, products_with_no_app

def main():
    with open('/home/ateece/bapi-headless/all-products-complete.json', 'r') as f:
        all_products = json.load(f)
    
    categories = {
        'Temperature': ['temp', 'temperature'],
        'Humidity': ['humid', 'humidity'],
        'Pressure': ['pressure'],
        'Air Quality': ['air-quality', 'airquality', 'co2', 'voc'],
    }
    
    for cat_name, keywords in categories.items():
        print("\n" + "=" * 80)
        print(f"{cat_name.upper()} SENSORS")
        print("=" * 80)
        
        products, by_sub, by_app, no_app = analyze_category(all_products, keywords)
        
        print(f"\nTotal products: {len(products)}")
        print(f"Products with application tags: {len(products) - len(no_app)} ({(len(products) - len(no_app)) / len(products) * 100:.1f}%)")
        print(f"Products needing tags: {len(no_app)} ({len(no_app) / len(products) * 100:.1f}%)")
        
        print(f"\n--- Current Subcategories ---")
        for subcat, prods in sorted(by_sub.items(), key=lambda x: -len(x[1])):
            print(f"  {subcat:<40} {len(prods):>3} products")
        
        if by_app:
            print(f"\n--- Application Attributes ---")
            for app, prods in sorted(by_app.items(), key=lambda x: -len(x[1])):
                print(f"  {app:<40} {len(prods):>3} products")
        else:
            print("\n⚠️  No application attributes found for this category!")
        
        print(f"\n--- Assessment ---")
        if len(by_sub) > 8:
            print(f"  ⚠️  TOO MANY SUBCATEGORIES ({len(by_sub)}) - consider consolidating")
        elif len(by_sub) < 3:
            print(f"  ⚠️  TOO FEW SUBCATEGORIES ({len(by_sub)}) - products may be hard to find")
        elif len(by_app) > 0 and len(by_app) != len(by_sub):
            print(f"  ⚠️  MISMATCH: {len(by_sub)} subcategories vs {len(by_app)} applications")
            print(f"     Recommendation: Restructure subcategories to match applications")
        else:
            print(f"  ✅ WELL STRUCTURED: {len(by_sub)} subcategories align with {len(by_app)} applications")
        
        if len(no_app) > len(products) * 0.2:
            print(f"  ⚠️  HIGH MISSING TAGS: {len(no_app)} products ({len(no_app) / len(products) * 100:.1f}%) need application attributes")

if __name__ == "__main__":
    main()
