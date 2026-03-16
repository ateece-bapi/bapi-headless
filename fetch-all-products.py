#!/usr/bin/env python3
"""
Fetch ALL products from WordPress GraphQL using cursor-based pagination.
Overcomes the 96-product query limit by making multiple paginated requests.
"""

import json
import requests
import sys

GRAPHQL_URL = "https://bapiheadlessstaging.kinsta.cloud/graphql"

QUERY = """
query GetProducts($after: String) {
  products(first: 100, after: $after) {
    pageInfo {
      hasNextPage
      endCursor
    }
    nodes {
      ... on SimpleProduct {
        id
        name
        slug
        sku
        productCategories {
          nodes {
            name
            slug
          }
        }
        attributes {
          nodes {
            name
            options
          }
        }
      }
      ... on VariableProduct {
        id
        name
        slug
        sku
        productCategories {
          nodes {
            name
            slug
          }
        }
        attributes {
          nodes {
            name
            options
          }
        }
      }
    }
  }
}
"""

def fetch_page(after_cursor=None):
    """Fetch one page of products."""
    variables = {}
    if after_cursor:
        variables["after"] = after_cursor
    
    response = requests.post(
        GRAPHQL_URL,
        json={"query": QUERY, "variables": variables},
        headers={"Content-Type": "application/json"}
    )
    
    if response.status_code != 200:
        print(f"Error: HTTP {response.status_code}", file=sys.stderr)
        print(response.text, file=sys.stderr)
        sys.exit(1)
    
    return response.json()

def main():
    all_products = []
    after_cursor = None
    page_num = 1
    
    print("Fetching products with pagination...", file=sys.stderr)
    
    while True:
        print(f"Fetching page {page_num}...", file=sys.stderr)
        data = fetch_page(after_cursor)
        
        if "errors" in data:
            print(f"GraphQL errors: {data['errors']}", file=sys.stderr)
            break
        
        products = data["data"]["products"]["nodes"]
        page_info = data["data"]["products"]["pageInfo"]
        
        all_products.extend(products)
        print(f"  Got {len(products)} products (total: {len(all_products)})", file=sys.stderr)
        
        if not page_info["hasNextPage"]:
            print("No more pages.", file=sys.stderr)
            break
        
        after_cursor = page_info["endCursor"]
        page_num += 1
    
    print(f"\nTotal products fetched: {len(all_products)}", file=sys.stderr)
    
    # Output JSON to stdout
    json.dump(all_products, sys.stdout, indent=2)

if __name__ == "__main__":
    main()
