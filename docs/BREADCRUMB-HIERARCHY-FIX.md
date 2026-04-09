# Breadcrumb Hierarchy Fix - Complete

**Date:** April 9, 2026  
**Issue:** Breadcrumbs showing "Products" instead of actual root category names across all pages
**Scope:** Product pages, Category pages, AND Subcategory pages

## Problem

The old WordPress site showed complete category hierarchy:
```
Home > Humidity Sensors > Room > BAPI-Stat "Quantum" Series > Product Name
Home > Temperature Sensors > Room > BAPI-Stat "Quantum" Series
```

The new headless site was showing:
```
Home > Products > Room > BAPI-Stat "Quantum" Series > Product Name
Home > Products > Temperature Sensors > Room
```

**Root Cause:** 
1. GraphQL queries only fetched one level of parent category (not grandparent)
2. ALL breadcrumb builder functions (`getProductBreadcrumbs`, `getCategoryBreadcrumbs`, `getSubcategoryBreadcrumbs`) hardcoded "Products" instead of using the actual root category name
3. Calling code didn't pass parent/grandparent information to breadcrumb builders

## Solution

### 1. Updated GraphQL Queries

Added support for grandparent categories in:
- `GetProductBySlug` (full query)
- `GetProductBySlugLight` (optimized query)  
- `GetProductCategoryWithChildren` (category/subcategory query)

**Change:**
```graphql
productCategories {
  nodes {
    id
    name
    slug
    parent {
      node {
        id
        name
        slug
        parent {              # ← ADDED: Grandparent support
          node {
            id
            name
            slug
          }
        }
      }
    }
  }
}
```

### 2. Updated ALL Breadcrumb Builder Functions

**File:** `web/src/lib/navigation/breadcrumbs.ts`

#### A. `getProductBreadcrumbs()` - Product Pages

**Key Changes:**
- Accepts `categories` array with nested parent/grandparent structure
- Walks up the full category tree to find root category
- Builds breadcrumbs from root → leaf
- Only falls back to "Products" when no categories exist

**Logic:**
```typescript
// Build full hierarchy
const hierarchy = [];

// Grandparent (root) - e.g., "Humidity Sensors"
if (primaryCategory.parent?.parent) {
  hierarchy.push(primaryCategory.parent.parent);
}

// Parent - e.g., "Room"
if (primaryCategory.parent) {
  hierarchy.push(primaryCategory.parent);
}

// Current category - e.g., "BAPI-Stat Quantum Series"
hierarchy.push(primaryCategory);

// Generate breadcrumbs with proper nested paths
hierarchy.forEach((cat, index) => {
  if (index === 0) {
    // Root: /products/humidity-sensors
  } else {
    // Nested: /products/humidity-sensors/room
  }
});
```

#### B. `getCategoryBreadcrumbs()` - Category Pages

**Key Changes:**
- Now accepts optional `parent` parameter with nested grandparent
- If no parent exists, treats category as root (no "Products" link)
- If parent exists, walks up to grandparent (root) and builds full path

**Logic:**
```typescript
if (parent) {
  if (parent.parent) {
    // Grandparent is root: Home > Grandparent > Parent > Category
  } else {
    // Parent is root: Home > Parent > Category
  }
} else {
  // No parent - this is root: Home > Category
}
```

#### C. `getSubcategoryBreadcrumbs()` - Subcategory Pages

**Key Changes:**
- Now accepts optional `grandparent` parameter
- If grandparent exists, shows full 3-level hierarchy from root
- If no grandparent, parent becomes root (2-level hierarchy)

**Logic:**
```typescript
if (grandparent) {
  // Full hierarchy: Home > Grandparent > Parent > Subcategory
} else {
  // Parent is root: Home > Parent > Subcategory
}
```

#### D. `getSearchBreadcrumbs()` - Search Pages

**No Change:** Search results don't belong to a specific category, so "Products" is appropriate here.

### 3. Updated Calling Code

#### A. Product Page (`web/src/app/[locale]/product/[slug]/page.tsx`)

Added grandparent mapping when passing categories:

```typescript
const categories = (rawProduct.productCategories?.nodes || []).map((cat: any) => ({
  name: cat.name || '',
  slug: cat.slug || '',
  parent: cat.parent?.node
    ? {
        name: cat.parent.node.name || '',
        slug: cat.parent.node.slug || '',
        parent: cat.parent.node.parent?.node  // ← ADDED
          ? {
              name: cat.parent.node.parent.node.name || '',
              slug: cat.parent.node.parent.node.slug || '',
            }
          : undefined,
      }
    : undefined,
}));
```

#### B. Category Page (`web/src/app/[locale]/products/[category]/page.tsx`)

Extracts parent info from GraphQL response and passes to breadcrumb builder:

```typescript
const parent = categoryData.parent?.node
  ? {
      name: getTranslatedCategoryName(categoryData.parent.node.name),
      slug: categoryData.parent.node.slug || '',
      parent: categoryData.parent.node.parent?.node
        ? {
            name: getTranslatedCategoryName(categoryData.parent.node.parent.node.name),
            slug: categoryData.parent.node.parent.node.slug || '',
          }
        : undefined,
    }
  : undefined;

const breadcrumbs = getCategoryBreadcrumbs(
  translatedCategoryName,
  category,
  options,
  parent  // ← ADDED
);
```

#### C. Subcategory Page (`web/src/app/[locale]/products/[category]/[subcategory]/page.tsx`)

Extracts grandparent info and passes to breadcrumb builder:

```typescript
const grandparent = parentCategory.parent?.node
  ? {
      name: getTranslatedCategoryName(parentCategory.parent.node.name),
      slug: parentCategory.parent.node.slug || '',
    }
  : undefined;

breadcrumbs = getSubcategoryBreadcrumbs(
  translatedCategoryName,
  parentCategory.slug || '',
  translatedSubcategoryName,
  subcategory,
  options,
  grandparent  // ← ADDED
);
```

### 4. Regenerated Types

Ran `pnpm run codegen` to update TypeScript types from modified GraphQL queries.

## Testing

To verify the fix across all page types:

### 1. Product Pages
Navigate to any product page (e.g., `/en/product/bapi-stat-quantum-humidity-sensor`)
- ✅ Should show: `Home > Humidity Sensors > Room > Series > Product Name`
- ❌ Should NOT show: `Home > Products > ...`

### 2. Category Pages  
Navigate to a category page (e.g., `/en/products/room`)
- ✅ Should show: `Home > Humidity Sensors > Room` (if Room has parent)
- ✅ Should show: `Home > Humidity Sensors` (if root category)
- ❌ Should NOT show: `Home > Products > ...`

### 3. Subcategory Pages
Navigate to a subcategory (e.g., `/en/products/humidity-sensors/room`)
- ✅ Should show: `Home > Humidity Sensors > Room`
- ❌ Should NOT show: `Home > Products > ...`

### 4. Search Pages
Search for products (e.g., `/en/search?q=sensor`)
- ✅ Should show: `Home > Products > Search: "sensor"` (correct - no specific category)

## Examples

### Product Page
**Before:**
```
Home > Products > Room > BAPI-Stat "Quantum" Series > Product Name
```

**After:**
```
Home > Humidity Sensors > Room > BAPI-Stat "Quantum" Series > Product Name
```

### Category Page (with parent)
**Before:**
```
Home > Products > Room
```

**After:**
```
Home > Humidity Sensors > Room
```

### Category Page (root)
**Before:**
```
Home > Products > Humidity Sensors
```

**After:**
```
Home > Humidity Sensors
```

### Subcategory Page
**Before:**
```
Home > Products > Temperature Sensors > Room
```

**After:**
```
Home > Temperature Sensors > Room
```

## Category Hierarchy Support

The fix supports up to 3 levels of category nesting:
- **Level 1 (Root):** Humidity Sensors, Temperature Sensors, Test Instruments, etc.
- **Level 2 (Parent):** Room, Duct, Outside Air, etc.
- **Level 3 (Child):** BAPI-Stat "Quantum" Series, BAPI-Stat 3, etc.

If a product/category has fewer levels, the breadcrumb adjusts accordingly.

## Performance Impact

**Minimal:** GraphQL query adds ~100 bytes per category (8 additional fields × ~12 bytes each). With typical 1-2 categories per product, total overhead is ~200 bytes.

**Benefit:** Eliminates need for additional queries to fetch category hierarchy separately.

## Files Changed

1. `web/src/lib/graphql/queries/products.graphql` - Added grandparent support to 3 queries
2. `web/src/lib/navigation/breadcrumbs.ts` - Updated all breadcrumb builder functions
3. `web/src/app/[locale]/product/[slug]/page.tsx` - Updated category mapping
4. `web/src/app/[locale]/products/[category]/page.tsx` - Added parent parameter
5. `web/src/app/[locale]/products/[category]/[subcategory]/page.tsx` - Added grandparent parameter
6. `web/src/lib/graphql/generated.ts` - Auto-generated from codegen (TypeScript types)

## Related

- Phase 1 Priority: Product Navigation (Categories, subcategories, breadcrumb navigation)
- [CATEGORY-PAGES-ARCHITECTURE.md](./CATEGORY-PAGES-ARCHITECTURE.md)
- [web/src/components/products/ProductPage/Breadcrumbs.tsx](../web/src/components/products/ProductPage/Breadcrumbs.tsx)
