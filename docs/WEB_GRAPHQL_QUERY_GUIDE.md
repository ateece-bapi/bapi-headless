# GraphQL Query Complexity Guide

This document tracks the **complexity budget** for every GraphQL query and mutation used by
the Next.js frontend. Review after adding new fields; re-measure quarterly via the WPGraphQL
Introspection tool or a static analyzer.

> **Complexity budget**: The production WPGraphQL instance enforces a hard limit of **1 000**
> complexity units per request. Queries approaching or exceeding **500** are marked ⚠️ expensive
> and must use GET-method caching + split-query patterns (see
> [GRAPHQL_SETUP.md](../GRAPHQL_SETUP.md)).

---

## Complexity Tiers

| Tier | Range | Label | Required strategy |
|------|-------|-------|-------------------|
| Cheap | 0 – 100 | ✅ cheap | None |
| Moderate | 101 – 300 | 🟡 moderate | Cache tags required |
| Heavy | 301 – 500 | 🟠 heavy | Cache tags + GET method |
| Expensive | 501 – 999 | ⚠️ expensive | Split query + deferred loading |
| Over budget | ≥ 1 000 | 🚫 blocked | Refactor before shipping |

---

## Query Inventory

### `products.graphql`

#### `GetProducts` — 🟠 heavy (~350)

```graphql
query GetProducts($first: Int = 10, $after: String) { … }
```

| Factor | Cost |
|--------|------|
| `products(first: 10)` list resolver | 100 |
| Per-node fields (name, slug, desc, shortDescription) | 40 |
| `productCategories.nodes` (nested list) | 60 |
| SimpleProduct/VariableProduct inline fragments with pricing + stock | 80 |
| `image` with `mediaDetails` | 70 |
| **Estimated total** | **~350** |

Cache tag: `['products']`  
Pagination strategy: cursor-based (`after` / `endCursor`).

---

#### `GetProductBySlug` — ⚠️ expensive (~620)

```graphql
query GetProductBySlug($slug: ID!) { … }
```

| Factor | Cost |
|--------|------|
| Single product lookup | 10 |
| Core fields + custom meta (partNumber, compliancy, docs, videos) | 80 |
| SimpleProduct fragment (price, stock, customerGroup1-3, sku) | 40 |
| VariableProduct fragment + `variations.nodes` (unbounded) | 200 |
| `image` + `galleryImages.nodes` | 80 |
| `productCategories` (3-level parent chain) | 90 |
| `productTags.nodes` | 20 |
| `related(first: 6)` sub-list | 100 |
| **Estimated total** | **~620** |

Cache tag: `['product-{slug}']`  
⚠️ Split strategy in use: load base data first, defer `variations` and `related`.

---

### `search.graphql`

#### `SearchProducts` — 🟠 heavy (~420)

```graphql
query SearchProducts($search: String!, $first: Int = 20) { … }
```

| Factor | Cost |
|--------|------|
| Full-text product search (first: 20) | 120 |
| Per-node: sku, partNumber, price, shortDescription | 40 |
| customerGroup1-3 per variant type | 30 |
| `image` | 40 |
| `productCategories` (2-level parent) per node | 120 |
| VariableProduct duplicate fields | 70 |
| **Estimated total** | **~420** |

Cache tag: none (volatile search, short TTL).  
Debounce client input at ≥ 300 ms to limit query frequency.

---

### `cart.graphql`

#### `AddToCart` — 🟡 moderate (~220)

```graphql
mutation AddToCart($productId: Int!, $quantity: Int = 1, $variationId: Int) { … }
```

| Factor | Cost |
|--------|------|
| Mutation base cost | 10 |
| Cart totals (total, subtotal, tax, shipping) | 30 |
| `contents.nodes` with product + variation nested | 110 |
| Image sub-field | 40 |
| `cartItem.key` return | 10 |
| Session cookie overhead | 20 |
| **Estimated total** | **~220** |

Mutations bypass GET-method caching. Uses WooCommerce session cookies for cart persistence.

> Additional cart mutations (`RemoveCartItem`, `UpdateCartItemQuantity`, `ClearCart`,
> `ApplyCoupon`) follow a similar structure and are estimated at **~180–240** each.

---

### `orders.graphql`

#### `Checkout` — ⚠️ expensive (~560)

```graphql
mutation Checkout($input: CheckoutInput!) { … }
```

| Factor | Cost |
|--------|------|
| Mutation base cost | 10 |
| Full billing + shipping address objects | 80 |
| Order line items with product + quantity + totals | 200 |
| Tax lines, fee lines, shipping lines | 120 |
| Customer info sub-object | 50 |
| Payment method details | 30 |
| Transaction/order metadata | 70 |
| **Estimated total** | **~560** |

⚠️ Only executed at checkout step; not batched or called speculatively.

---

### `pages.graphql`

#### `GetPageBySlug` — ✅ cheap (~40)

Single-page lookup: id, title, content, slug, dates, featuredImage.

Cache tag: `['pages', 'page-{slug}']`

#### `GetPages` — 🟡 moderate (~130)

```graphql
query GetPages($first: Int = 100) { … }
```

Bulk page list for sitemaps / navigation. Avoid calling on every render; use ISR with long TTL.

Cache tag: `['pages']`

---

### `posts.graphql`

#### `GetPosts` — 🟡 moderate (~200)

```graphql
query GetPosts($first: Int = 20, $after: String) { … }
```

Includes author name, categories, featuredImage. Cache tag: `['posts']`

#### `GetPostBySlug` — 🟡 moderate (~150)

Single post. Cache tag: `['post-{slug}']`

---

### `resources.graphql`

#### `GetResources` — 🟡 moderate (~180)

```graphql
query GetResources($first: Int = 100, $after: String) { … }
```

PDF media library list. Note: `first: 100` is large; prefer paginated loads for SEO pages.  
Cache tag: `['resources']`

#### `SearchResources` — 🟡 moderate (~130)

Full-text PDF search. No cache tag; short TTL.

---

### `applicationNotes.graphql`

#### `GetApplicationNotes` — 🟡 moderate (~240)

```graphql
query GetApplicationNotes($first: Int = 100, $after: String) { … }
```

Includes categories, featured image with mediaDetails. Cache tag: `['application-notes']`

---

## Rules of Thumb

1. **Never exceed 750 complexity** in a single query. Leave headroom for WPGraphQL's own
   introspection overhead.
2. **Always pass cache tags** to `getGraphQLClient(tags)` for queries in the ✅/🟡/🟠 tiers.
3. **Expensive queries (⚠️)** must use GET-method caching:
   ```ts
   getGraphQLClient(['product-{slug}'], /* useGetMethod */ true)
   ```
4. **Mutations** never use GET; they always bypass CDN caching.
5. **Re-measure** after adding B2B fields (`customerGroup*`, multipliers) — each adds ~15–20 units
   per product node.
6. **`GetProductBySlug` variations sub-query** is the highest-risk field; if variation count grows
   past ~50 per product, split it into a dedicated `GetProductVariations($id)` query.

---

## Measuring Actual Complexity

Enable query complexity logging in WPGraphQL (`wp-config.php`):

```php
define( 'GRAPHQL_DEBUG', true );
```

Then inspect the `X-WPGraphQL-Query-Complexity` response header (or the `extensions.queryStats`
JSON field) in GraphiQL or DevTools → Network.

Alternatively, use the [graphql-query-complexity](https://github.com/slicknode/graphql-query-complexity)
npm package as a pre-flight check in CI.

---

*Last audited: 2026-07-10*
