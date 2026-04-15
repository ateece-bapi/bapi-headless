# Variation SKU Search Implementation

**Date:** April 15, 2026  
**Branch:** `feat/variation-sku-search`  
**Investigation:** Legacy WordPress site analysis via SSH

---

## Executive Summary

**Problem:** Variable products (e.g., "CCGA/10K-2-D" with 4 probe length variations) need to be searchable by variation SKUs, not just parent product names.

**Solution:** Replicate legacy site's Relevanssi Premium behavior where all variation SKUs are indexed as searchable content on the parent product.

**Impact:** 
- ✅ Enables search by exact variation SKU (e.g., `CCGA/10K-2-D-4"-BB4`)
- ✅ Returns parent products (consistent with legacy behavior)
- ✅ Preserves punctuation in SKUs (hyphens, quotes, slashes)

---

## Legacy Site Search Architecture (Discovered via SSH Investigation)

### 1. Search Engine: Relevanssi Premium

**Configuration:**
- **Plugin:** Relevanssi Premium v2.29.0
- **Indexed Post Types:** `post`, `page`, `product` (NOT `product_variation`)
- **Custom Fields Indexed:** `_sku` (parent SKU only)
- **Fuzzy Search:** Enabled (`always`)
- **Operator:** OR (matches any term)
- **Total Indexed:** 804 documents (parent products only)

### 2. Custom Variation SKU Indexing

**File:** `wp-content/themes/bapi-v4/admin/class-admin.php`

**Filter Hook:**
```php
add_filter( 'relevanssi_content_to_index', array( $this, 'rlv_index_variation_skus' ), 10, 2 );
```

**Implementation:**
```php
function rlv_index_variation_skus( $content, $post ) {
    if ( 'product' === $post->post_type ) {
        // Get all variations for this parent product
        $args = array(
            'post_parent'    => $post->ID,
            'post_type'      => 'product_variation',
            'posts_per_page' => -1,
        );
        $variations = get_posts( $args );
        
        if ( ! empty( $variations ) ) {
            // Append ALL variation SKUs to indexed content
            foreach ( $variations as $variation ) {
                $sku = get_post_meta( $variation->ID, '_sku', true );
                $content .= " $sku";
            }
        }
    }
    
    return $content;
}
```

**How It Works:**
1. When indexing a product, Relevanssi calls this filter
2. For variable products, it fetches ALL child variations
3. Extracts the `_sku` from each variation
4. Appends all variation SKUs to the parent's searchable content
5. Parent product becomes searchable by ANY variation SKU

**Example:**
- **Parent Product:** "CCGA/10K-2-D" (ID: 50116)
- **Parent SKU:** Empty/null
- **Variations:**
  - CCGA/10K-2-D-4"-BB4 (4 inch)
  - CCGA/10K-2-D-8"-BB4 (8 inch)
  - CCGA/10K-2-D-12"-BB4 (12 inch)
  - CCGA/10K-2-D-18"-BB4 (18 inch)
- **Indexed Content:** "CCGA/10K-2-D [description] CCGA/10K-2-D-4\"-BB4 CCGA/10K-2-D-8\"-BB4 CCGA/10K-2-D-12\"-BB4 CCGA/10K-2-D-18\"-BB4"

### 3. Punctuation Preservation

**Filter Hook:**
```php
add_filter( 'relevanssi_remove_punctuation', array( $this, 'keep_punctuation' ), 1 );
```

**Implementation:**
```php
function keep_punctuation( $string ) {
    remove_filter( 'relevanssi_remove_punctuation', 'relevanssi_remove_punct' );
    return $string;
}
```

**Purpose:** 
- Preserves hyphens (`-`), quotes (`"`), and slashes (`/`) in SKUs
- Allows exact matching of complex SKUs like `CCGA/10K-2-D-4"-BB4`

### 4. Search Behavior

**Test Results from Legacy Site:**

```bash
# Search for variation SKU
wp post list --post_type=product --s='CCGA/10K-2-D-4"-BB4' --fields=ID,post_title --format=table

Result:
+-------+--------------+
| ID    | post_title   |
+-------+--------------+
| 50116 | CCGA/10K-2-D |  ← Parent product returned
+-------+--------------+
```

**Key Findings:**
- ✅ Searching for variation SKU returns **parent product** (never the variation)
- ✅ Fuzzy search allows partial matches
- ✅ Parent has NO SKU, but variations are indexed into parent's content
- ❌ Individual variations NEVER appear in search results

---

## Headless Implementation Strategy

### Current Search Implementation Review

**From:** `docs/SEARCH-ANALYSIS-PART-NUMBER.md`

**Current Search Flow:**
```
User Input → SearchInput.tsx → useSearch hook → /api/search route → WordPress GraphQL → Dual Query
```

**Dual-Query Approach (Already Implemented):**
```typescript
// Query 1: Product name/description search
products(where: { search: query })

// Query 2: Exact SKU match
products(where: { sku: query })
```

**Problem:** Query 2 (`sku`) only searches **parent SKU**, not variation SKUs!

### Solution: Add Variation SKU Query

**New Triple-Query Approach:**

```typescript
// Query 1: Product name/description search
products(where: { search: query })

// Query 2: Parent SKU match
products(where: { sku: query })

// Query 3: Variation SKU match (NEW!)
products(where: {
  variations: {
    some: {
      sku: { contains: query }
    }
  }
})
```

**Wait...** GraphQL doesn't support querying by variation SKU directly. We need a different approach.

### Alternative: WordPress Plugin to Index Variation SKUs

Since WPGraphQL uses WordPress's native search, we can replicate Relevanssi's approach:

**Option A: Create WordPress mu-plugin** (Backend approach)

**File:** `cms/wp-content/mu-plugins/bapi-variation-sku-search.php`

```php
<?php
/**
 * Plugin Name: BAPI Variation SKU Search
 * Description: Index variation SKUs into parent product search content (WPGraphQL compatible)
 */

add_filter('posts_search', 'bapi_index_variation_skus_search', 10, 2);

function bapi_index_variation_skus_search($search, $query) {
    global $wpdb;

    // Only modify WooCommerce product searches via GraphQL
    if ($query->is_search() && $query->get('post_type') === 'product') {
        $search_term = $query->get('s');
        
        if (!empty($search_term)) {
            // Add variation SKU search to query
            $search .= " OR {$wpdb->posts}.ID IN (
                SELECT DISTINCT p.post_parent
                FROM {$wpdb->posts} p
                INNER JOIN {$wpdb->postmeta} pm ON p.ID = pm.post_id
                WHERE p.post_type = 'product_variation'
                AND p.post_status = 'publish'
                AND pm.meta_key = '_sku'
                AND pm.meta_value LIKE '%{$wpdb->esc_like($search_term)}%'
            )";
        }
    }

    return $search;
}
```

**How It Works:**
1. Intercepts WordPress search queries for products
2. Adds SQL subquery to find parent products where ANY variation SKU matches
3. Returns parent products (not variations)
4. Works transparently with WPGraphQL

**Pros:**
- ✅ Proper server-side solution
- ✅ Works with WPGraphQL's native `search` parameter
- ✅ No frontend changes needed
- ✅ Handles punctuation automatically
- ✅ Scales to any number of products/variations

**Cons:**
- ⚠️ Requires WordPress backend deployment
- ⚠️ Slight performance impact (extra postmeta join)

---

**Option B: Frontend Multi-Query Approach** (Frontend workaround)

Since we already have dual-query search, extend it to query variations:

```typescript
// In web/src/app/api/search/route.ts

const [nameResults, skuResults, variationResults] = await Promise.all([
  // Query 1: Name/description
  client.request(SEARCH_PRODUCTS, { search: query }),
  
  // Query 2: Parent SKU
  client.request(SEARCH_BY_SKU, { sku: query }),
  
  // Query 3: Variation SKUs (NEW!)
  client.request(SEARCH_BY_VARIATION_SKU, { sku: query })
]);

// Merge and deduplicate results
const merged = mergeSearchResults(nameResults, skuResults, variationResults);
```

**New GraphQL Query:**
```graphql
query SearchByVariationSku($sku: String!) {
  products(where: {
    variations: {
      nodes: {
        sku: { 
          _like: $sku  # Contains match
        }
      }
    }
  }) {
    nodes {
      id
      databaseId
      name
      slug
      sku
      # ... other fields
    }
  }
}
```

**Wait...** WPGraphQL for WooCommerce doesn't support filtering by variation SKU in the `where` clause. Need to verify this.

---

### Recommended Approach: WordPress Plugin (Option A) ⭐

**Why:**
1. Replicates proven legacy behavior exactly
2. Works with existing GraphQL queries (no frontend changes)
3. Proper server-side indexing (like Relevanssi)
4. Single source of truth for search behavior

**Implementation Steps:**

1. **Create mu-plugin** (30 min)
   - File: `cms/wp-content/mu-plugins/bapi-variation-sku-search.php`
   - Code: See above

2. **Deploy to Kinsta staging** (15 min)
   - SSH into staging server
   - Create file in `wp-content/mu-plugins/`
   - Verify plugin loads (WP Admin → Plugins)

3. **Test search functionality** (30 min)
   - Test variation SKU search via GraphQL
   - Test via frontend search UI
   - Verify parent products returned (not variations)

4. **Production deployment** (15 min)
   - Deploy to production via Kinsta
   - Monitor performance

**Total Effort:** ~2 hours

---

## Testing Plan

### Test Cases

**Test Case 1: Simple Product SKU Search (Existing Behavior)**
- Search: `BA/10K-3-O-BB6`
- Expected: Simple product appears
- Status: ✅ Already works (dual-query)

**Test Case 2: Variable Product - Parent Has SKU**
- Search: Parent SKU (if exists)
- Expected: Parent product appears
- Status: ✅ Already works (dual-query)

**Test Case 3: Variable Product - Search by Variation SKU** ⭐ NEW
- Search: `CCGA/10K-2-D-4"-BB4` (4-inch variation)
- Expected: Parent product "CCGA/10K-2-D" appears
- Current: ❌ Does not work
- After Fix: ✅ Should work

**Test Case 4: Partial Variation SKU Match**
- Search: `CCGA/10K-2-D`
- Expected: Parent product appears (matches beginning of all variation SKUs)
- Current: ✅ Works (name match)
- After Fix: ✅ Enhanced (also matches variation SKU prefix)

**Test Case 5: Punctuation in SKU**
- Search: `10K-2` (with hyphen)
- Expected: All products with "10K-2" in SKU or variation SKUs
- After Fix: ✅ Should preserve hyphens

**Test Case 6: Quotes in SKU**
- Search: `4"-BB4` (with quote)
- Expected: All products with 4-inch variations
- After Fix: ✅ Should preserve quotes

### Test Products (From SSH Investigation)

**Variable Product Example:**
- **Parent:** CCGA/10K-2-D (ID: 50116)
- **Variations:**
  1. CCGA/10K-2-D-4"-BB4 (ID: 139317)
  2. CCGA/10K-2-D-8"-BB4 (ID: 139318)
  3. CCGA/10K-2-D-12"-BB4 (ID: 139319)
  4. CCGA/10K-2-D-18"-BB4 (ID: 400673)

**SQL to Find More Test Products:**
```sql
SELECT 
    p.ID as parent_id,
    p.post_title,
    COUNT(v.ID) as variation_count,
    GROUP_CONCAT(vm.meta_value SEPARATOR ', ') as variation_skus
FROM wp_posts p
INNER JOIN wp_posts v ON v.post_parent = p.ID
INNER JOIN wp_postmeta vm ON v.ID = vm.post_id AND vm.meta_key = '_sku'
WHERE p.post_type = 'product'
  AND v.post_type = 'product_variation'
  AND p.post_status = 'publish'
  AND v.post_status = 'publish'
GROUP BY p.ID
ORDER BY variation_count DESC
LIMIT 10;
```

---

## Implementation Checklist

### Phase 1: Backend Implementation

- [ ] Create `bapi-variation-sku-search.php` mu-plugin
- [ ] Test SQL query performance on staging database
- [ ] Deploy to Kinsta staging server
- [ ] Verify plugin loads in WP Admin
- [ ] Test via GraphiQL (GraphQL IDE)
- [ ] Monitor query performance (Query Monitor plugin)

### Phase 2: Frontend Verification

- [ ] Test search UI with variation SKUs
- [ ] Verify parent products returned (not variations)
- [ ] Test punctuation preservation (hyphens, quotes, slashes)
- [ ] Test partial SKU matches
- [ ] Verify result deduplication works

### Phase 3: Documentation

- [ ] Update SEARCH-ANALYSIS-PART-NUMBER.md with variation findings
- [ ] Document mu-plugin in WORDPRESS-BACKEND-SETUP.md
- [ ] Add variation search behavior to user guide
- [ ] Create video/screenshots for QA testing

### Phase 4: Production Deployment

- [ ] Code review with team
- [ ] Performance testing on staging
- [ ] Deploy to production
- [ ] Monitor search performance (first 24 hours)
- [ ] User acceptance testing

---

## Performance Considerations

### SQL Query Performance

**Original Search Query:**
```sql
SELECT * FROM wp_posts 
WHERE post_type = 'product' 
  AND (post_title LIKE '%search%' OR post_content LIKE '%search%')
```

**With Variation SKU Filter:**
```sql
SELECT * FROM wp_posts 
WHERE post_type = 'product' 
  AND (
    post_title LIKE '%search%' 
    OR post_content LIKE '%search%'
    OR ID IN (
      SELECT DISTINCT post_parent
      FROM wp_posts 
      INNER JOIN wp_postmeta ON ID = post_id
      WHERE post_type = 'product_variation'
        AND meta_key = '_sku'
        AND meta_value LIKE '%search%'
    )
  )
```

**Indexing Requirements:**
- ✅ `wp_posts.post_parent` - Already indexed
- ✅ `wp_postmeta(post_id, meta_key)` - Already indexed
- ✅ No new indexes needed

**Expected Performance:**
- Simple products: No change (subquery skipped if no variations)
- Variable products: +10-20ms (one extra subquery)
- Total search time: Still under 100ms for 608 products

### Caching Strategy

Leverage existing Next.js ISR caching:
- Search results cached on frontend (5-minute TTL)
- GraphQL cache tags: `['products', 'search']`
- Revalidate on product updates

---

## Alternative Approaches (Rejected)

### ❌ Approach 1: Index Variations as Separate Products

**Idea:** Make variations searchable as individual products

**Why Rejected:**
- Breaks legacy behavior (users expect parent products)
- Confusing UX (4 results for one product)
- Complicates cart/checkout (variations require parent context)

### ❌ Approach 2: Frontend-Only Solution (Fetch All Products)

**Idea:** Download all products to frontend, search client-side

**Why Rejected:**
- 608 products × variations = ~2,000+ items
- Large initial download (200KB+ JSON)
- Doesn't scale beyond Phase 1

### ❌ Approach 3: Elasticsearch Integration

**Idea:** Replace WordPress search with Elasticsearch

**Why Rejected for Phase 1:**
- Overkill for 608 products
- High cost ($5k-15k setup)
- Can revisit in Phase 2

---

## Success Criteria

### Functional Requirements

- ✅ Searching for variation SKU returns parent product
- ✅ Parent products appear once (no duplicates)
- ✅ Punctuation preserved in searches (hyphens, quotes, slashes)
- ✅ Partial SKU matches work (e.g., "10K-2" matches "CCGA/10K-2-D-4\"-BB4")
- ✅ Performance under 100ms for typical searches

### Non-Functional Requirements

- ✅ No breaking changes to existing search behavior
- ✅ Works with current dual-query search implementation
- ✅ WordPress mu-plugin under 50 lines of code
- ✅ Zero frontend code changes required
- ✅ Production-ready by May 4, 2026 (launch date)

---

## Open Questions

1. **Performance:** Should we add Redis caching for variation SKU lookups?
2. **Ranking:** Should variation SKU matches rank higher than name matches?
3. **Fuzzy Match:** Should we implement Levenshtein distance for typo tolerance?
4. **Analytics:** Track which searches use variation SKUs vs. product names?

---

## Related Documentation

- [SEARCH-ANALYSIS-PART-NUMBER.md](SEARCH-ANALYSIS-PART-NUMBER.md) - Initial search investigation
- [WORDPRESS-BACKEND-SETUP.md](WORDPRESS-BACKEND-SETUP.md) - WordPress plugin setup
- [WORDPRESS-GRAPHQL-OPTIMIZATION.md](WORDPRESS-GRAPHQL-OPTIMIZATION.md) - GraphQL performance
- [FILTER-PARITY-ANALYSIS.md](FILTER-PARITY-ANALYSIS.md) - Future Elasticsearch integration

---

**Investigation Date:** April 15, 2026  
**Investigation Method:** SSH into `stage.bapihvac.com` (138.197.74.68)  
**Legacy Theme:** bapi-v4 v2.0.9  
**Legacy Search:** Relevanssi Premium v2.29.0  
**Implementation Branch:** `feat/variation-sku-search`  
**Status:** 📝 **READY FOR IMPLEMENTATION**
