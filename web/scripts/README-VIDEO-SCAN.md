# Finding Products Without Videos

## Quick Summary
According to the latest database scan (DAILY-LOG.md):
- **Total Products:** 608
- **Products WITH Videos:** 447 (73.5%)
- **Products WITHOUT Videos:** 161 (26.5%)

## Method 1: Run the Automated Script (Recommended)

The automated script will scan all products and generate a detailed report.

### Prerequisites
```bash
cd /home/ateece/bapi-headless/web
```

Make sure you have your `.env.local` file with:
```
NEXT_PUBLIC_WORDPRESS_GRAPHQL=https://bapiheadlessstaging.kinsta.cloud/graphql
```

### Run the Scanner

**Console Output (Default):**
```bash
pnpm tsx ../scripts/scan-products-without-videos.ts
```

**Save as JSON:**
```bash
pnpm tsx ../scripts/scan-products-without-videos.ts --output json
```
Creates `products-without-videos.json` with full details.

**Save as CSV:**
```bash
pnpm tsx ../scripts/scan-products-without-videos.ts --output csv
```
Creates `products-without-videos.csv` (Excel/Sheets compatible).

## Method 2: Manual GraphQL Query

You can also query directly in GraphiQL at: `https://bapiheadlessstaging.kinsta.cloud/graphql`

### Query All Products with Video Status

```graphql
query GetProductsWithVideos {
  products(first: 100) {
    pageInfo {
      hasNextPage
      endCursor
    }
    nodes {
      id
      databaseId
      name
      slug
      productVideos {
        heading
        videos {
          url
        }
      }
      ... on SimpleProduct {
        sku
      }
      ... on VariableProduct {
        sku
      }
    }
  }
}
```

**Note:** This query returns 100 products at a time. To get all 608 products, you need to paginate using the `after` cursor:

```graphql
query GetNextPage {
  products(first: 100, after: "CURSOR_FROM_PREVIOUS_QUERY") {
    pageInfo {
      hasNextPage
      endCursor
    }
    nodes {
      # ... same fields as above
    }
  }
}
```

### Identify Products Without Videos

Products without videos will have:
- `productVideos: null`
- `productVideos: []`
- `productVideos: [{ heading: "...", videos: [] }]` (empty videos array)

## Method 3: Direct WordPress Database Query (SSH Access Required)

If you have SSH access to the WordPress server, you can query the database directly:

```sql
-- Find products WITHOUT product_videos
SELECT 
    p.ID,
    p.post_title,
    p.post_name AS slug,
    pm_sku.meta_value AS sku
FROM wp_posts p
LEFT JOIN wp_postmeta pm_videos ON p.ID = pm_videos.post_id AND pm_videos.meta_key = 'product_videos'
LEFT JOIN wp_postmeta pm_sku ON p.ID = pm_sku.post_id AND pm_sku.meta_key = '_sku'
WHERE p.post_type = 'product'
AND p.post_status = 'publish'
AND (
    pm_videos.meta_value IS NULL 
    OR pm_videos.meta_value = '' 
    OR pm_videos.meta_value = 'a:0:{}' -- Empty serialized array
)
ORDER BY p.post_title;
```

## Output Formats

### JSON Output Example
```json
{
  "summary": {
    "total": 608,
    "withVideos": 447,
    "withoutVideos": 161,
    "scanDate": "2026-05-12T10:30:00.000Z"
  },
  "productsWithoutVideos": [
    {
      "id": 123456,
      "name": "BA/10K-2-O-B Temperature Sensor",
      "slug": "ba-10k-2-o-b",
      "sku": "BA/10K-2-O-B",
      "url": "https://bapi.com/product/ba-10k-2-o-b"
    }
  ]
}
```

### CSV Output Example
```csv
Database ID,Name,Slug,SKU,URL
123456,"BA/10K-2-O-B Temperature Sensor",ba-10k-2-o-b,BA/10K-2-O-B,https://bapi.com/product/ba-10k-2-o-b
123457,"Another Product",another-product,BA/1234,https://bapi.com/product/another-product
```

## Next Steps After Identifying Products

1. **Prioritize by Product Category** - Focus on high-traffic product lines first
2. **Check YouTube Channel** - See if videos exist but aren't linked
3. **Content Creation Plan** - Schedule video production for missing products
4. **Bulk Import** - Use the WordPress sync tools in `web/src/lib/youtube/wordpress-sync.ts` to add videos in bulk

## Related Documentation
- [YouTube Video Setup Guide](../docs/YOUTUBE-VIDEO-SETUP.md)
- [Product Videos WordPress Sync](../web/src/lib/youtube/wordpress-sync.ts)
- [Product Videos Frontend Integration](../web/src/lib/productVideos.ts)
