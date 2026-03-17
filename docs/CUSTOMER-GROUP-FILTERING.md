# Customer Group Product Filtering - Implementation Guide

**Date:** March 16, 2026  
**Context:** B2B customer segmentation for BAPI product catalog

---

## Business Requirement

**Products with (ALC) or (ACS) prefix are customer-specific:**

- **(ALC)** products → Only visible to users in ALC customer group
- **(ACS)** products → Only visible to users in ACS customer group  
- **Standard** products (no prefix) → Visible to all users including guests

---

## WordPress Data Schema

### Product Meta Fields (wp_postmeta)

```
customer_group1: string | null  # Primary customer group
customer_group2: string | null  # Secondary customer group
customer_group3: string | null  # Tertiary customer group
```

**Example Product Data:**
```php
// (ALC) Immersion Temperature Transmitter
'customer_group1' => 'alc'
'customer_group2' => null
'customer_group3' => null

// (ACS) Thermobuffer Temperature Sensor  
'customer_group1' => 'acs'
'customer_group2' => null
'customer_group3' => null

// Standard product (no prefix)
'customer_group1' => null
'customer_group2' => null
'customer_group3' => null
```

### User Meta Fields

WordPress users (5,438 total) have customer group assignments:
```php
// User meta
'customer_group' => 'alc' | 'acs' | null
```

---

## Frontend Implementation

### Phase 1: Server-Side Filtering (Recommended)

**GraphQL Query with Customer Group Filter:**

```graphql
query GetProductsByCategory(
  $categorySlug: String!
  $customerGroup: String
) {
  products(
    where: {
      category: $categorySlug
      # Filter by customer group - WordPress must support this
      customerGroup: $customerGroup
    }
    first: 100
  ) {
    nodes {
      ... on SimpleProduct {
        id
        name
        slug
        sku
        # Include customer group fields for verification
        customerGroup1
        customerGroup2
        customerGroup3
        productCategories {
          nodes {
            name
            slug
          }
        }
      }
    }
  }
}
```

**Server Component Usage:**

```typescript
// app/[locale]/products/[category]/page.tsx
import { getGraphQLClient } from '@/lib/graphql/client';
import { getCurrentUser } from '@/lib/auth'; // WordPress JWT auth

export default async function CategoryPage({
  params: { category, locale },
}: {
  params: { category: string; locale: string };
}) {
  const user = await getCurrentUser(); // Get authenticated user
  const customerGroup = user?.customerGroup || null; // null for guests

  const client = getGraphQLClient(['products', `category-${category}`]);
  
  const { products } = await client.request(GET_PRODUCTS_BY_CATEGORY, {
    categorySlug: category,
    customerGroup, // Pass to GraphQL query
  });

  return <CategoryContent products={products} />;
}
```

### Phase 2: Client-Side Filtering (Fallback)

If WordPress GraphQL doesn't support customer group filtering:

```typescript
// lib/utils/filterProductsByCustomerGroup.ts
export function filterProductsByCustomerGroup(
  products: Product[],
  userCustomerGroup: string | null
): Product[] {
  return products.filter((product) => {
    const groups = [
      product.customerGroup1,
      product.customerGroup2,
      product.customerGroup3,
    ].filter(Boolean);

    // No customer groups = public product
    if (groups.length === 0) return true;

    // Guest user can only see public products
    if (!userCustomerGroup) return false;

    // Check if user's group matches any product group
    return groups.includes(userCustomerGroup);
  });
}
```

**Usage:**

```typescript
// components/category/CategoryContent.tsx
'use client';

import { useAuth } from '@/hooks/useAuth';
import { filterProductsByCustomerGroup } from '@/lib/utils/filterProductsByCustomerGroup';

export function CategoryContent({ products }: { products: Product[] }) {
  const { user } = useAuth(); // WordPress authenticated user
  
  const visibleProducts = filterProductsByCustomerGroup(
    products,
    user?.customerGroup || null
  );

  return (
    <ProductGrid products={visibleProducts} />
  );
}
```

---

## WordPress Admin Configuration

### Step 1: Verify Customer Group Fields

1. Go to: **Products → All Products**
2. Edit any (ALC) or (ACS) product
3. Scroll to: **Custom Fields** section
4. Verify fields exist:
   - `customer_group1`
   - `customer_group2`  
   - `customer_group3`

### Step 2: Check WPGraphQL Schema

Test if customer group fields are exposed in GraphQL:

```graphql
query TestCustomerGroupFields {
  products(first: 5) {
    nodes {
      ... on SimpleProduct {
        name
        # These fields need to be registered in WPGraphQL
        customerGroup1
        customerGroup2
        customerGroup3
      }
    }
  }
}
```

**If fields are NOT exposed:** You'll need to register them in `functions.php`:

```php
// wp-content/themes/your-theme/functions.php
add_action('graphql_register_types', function() {
  register_graphql_field('SimpleProduct', 'customerGroup1', [
    'type' => 'String',
    'description' => 'Primary customer group restriction',
    'resolve' => function($product) {
      return get_post_meta($product->ID, 'customer_group1', true);
    }
  ]);
  
  register_graphql_field('SimpleProduct', 'customerGroup2', [
    'type' => 'String',
    'description' => 'Secondary customer group restriction',
    'resolve' => function($product) {
      return get_post_meta($product->ID, 'customer_group2', true);
    }
  ]);
  
  register_graphql_field('SimpleProduct', 'customerGroup3', [
    'type' => 'String',
    'description' => 'Tertiary customer group restriction',
    'resolve' => function($product) {
      return get_post_meta($product->ID, 'customer_group3', true);
    }
  ]);
});
```

---

## Testing Strategy

### Test Cases

| User Type | Customer Group | Should See |
|-----------|----------------|------------|
| Guest (not logged in) | `null` | Only standard products (no ALC/ACS) |
| Logged in - ALC | `'alc'` | Standard + (ALC) products |
| Logged in - ACS | `'acs'` | Standard + (ACS) products |
| Logged in - Other | `'other'` | Only standard products |

### Test Products (Temperature Category)

```typescript
// Test data from analysis
const testProducts = [
  {
    name: '(ALC) Submersible Averaging Temperature Sensor, Flexible',
    customerGroup1: 'alc',
    expectedVisibility: { guest: false, alc: true, acs: false }
  },
  {
    name: '(ACS) Thermobuffer Temperature Sensor',
    customerGroup1: 'acs',
    expectedVisibility: { guest: false, alc: false, acs: true }
  },
  {
    name: 'Novar UVC Compatible Aluminum Wall Plate Temperature Sensor',
    customerGroup1: null,
    expectedVisibility: { guest: true, alc: true, acs: true }
  },
];
```

### Automated Test (Vitest)

```typescript
// test/utils/filterProductsByCustomerGroup.test.ts
import { describe, it, expect } from 'vitest';
import { filterProductsByCustomerGroup } from '@/lib/utils/filterProductsByCustomerGroup';

describe('filterProductsByCustomerGroup', () => {
  const products = [
    { id: 1, name: '(ALC) Product', customerGroup1: 'alc', customerGroup2: null, customerGroup3: null },
    { id: 2, name: '(ACS) Product', customerGroup1: 'acs', customerGroup2: null, customerGroup3: null },
    { id: 3, name: 'Standard Product', customerGroup1: null, customerGroup2: null, customerGroup3: null },
  ];

  it('guest users see only standard products', () => {
    const result = filterProductsByCustomerGroup(products, null);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Standard Product');
  });

  it('ALC users see standard + ALC products', () => {
    const result = filterProductsByCustomerGroup(products, 'alc');
    expect(result).toHaveLength(2);
    expect(result.map(p => p.name)).toContain('(ALC) Product');
    expect(result.map(p => p.name)).toContain('Standard Product');
  });

  it('ACS users see standard + ACS products', () => {
    const result = filterProductsByCustomerGroup(products, 'acs');
    expect(result).toHaveLength(2);
    expect(result.map(p => p.name)).toContain('(ACS) Product');
    expect(result.map(p => p.name)).toContain('Standard Product');
  });
});
```

---

## GraphQL Type Updates

Add to `web/src/lib/graphql/queries/products.graphql`:

```graphql
fragment ProductCustomerGroups on SimpleProduct {
  customerGroup1
  customerGroup2
  customerGroup3
}

fragment ProductCustomerGroups on VariableProduct {
  customerGroup1
  customerGroup2
  customerGroup3
}
```

Then include in product queries:

```graphql
query GetCategoryProducts($slug: String!) {
  products(where: { category: $slug }, first: 100) {
    nodes {
      ... on SimpleProduct {
        ...ProductBasicInfo
        ...ProductCustomerGroups  # ← Add this
      }
      ... on VariableProduct {
        ...ProductBasicInfo
        ...ProductCustomerGroups  # ← Add this
      }
    }
  }
}
```

Run codegen after updating:
```bash
pnpm run codegen
```

---

## Migration Checklist

### WordPress Admin Tasks
- [ ] Verify `customer_group1/2/3` fields exist on all products
- [ ] Confirm (ALC) products have `customer_group1 = 'alc'`
- [ ] Confirm (ACS) products have `customer_group1 = 'acs'`
- [ ] Register GraphQL fields in `functions.php` if not exposed
- [ ] Test GraphQL query returns customer group fields

### Frontend Tasks
- [ ] Add customer group fields to GraphQL fragments
- [ ] Run `pnpm run codegen` to generate TypeScript types
- [ ] Implement `filterProductsByCustomerGroup` utility
- [ ] Update category pages to filter products
- [ ] Update product grid components to respect customer groups
- [ ] Add unit tests for filtering logic
- [ ] Test with different user types (guest, ALC, ACS)

### WordPress User Testing
- [ ] Log in as ALC user → Verify (ALC) products visible
- [ ] Log in as ACS user → Verify (ACS) products visible
- [ ] Browse as guest → Verify NO (ALC) or (ACS) products visible
- [ ] Check product counts match filtered results

---

## Product Count Impact (Temperature Example)

From analysis of 115 temperature products:

| View | Product Count | Notes |
|------|---------------|-------|
| **Admin/All** | 115 products | Total in WordPress database |
| **Guest User** | ~70 products (61%) | Only non-prefixed products |
| **ALC User** | ~110 products (96%) | Standard + ALC products |
| **ACS User** | ~75 products (65%) | Standard + ACS products |

**Subcategory Counts Example:**
```
temp-room-temp:
├─ Total: 23 products
├─ Guest sees: 14 products (61%)
├─ ALC sees: 22 products (96%)
└─ ACS sees: 15 products (65%)
```

---

## Security Considerations

### Server-Side Filtering (Required)

**❌ DO NOT rely on client-side filtering alone:**
```typescript
// INSECURE - User can bypass with DevTools
const visibleProducts = products.filter(p => 
  !p.name.includes('(ALC)') || user.group === 'alc'
);
```

**✅ Server-side filtering is mandatory:**
```typescript
// Server Component - executed on server
const products = await fetchProductsForUserGroup(user.customerGroup);
```

### GraphQL Query Authorization

WordPress should verify authenticated user's customer group:

```php
// WordPress filter to restrict query results
add_filter('graphql_product_query_args', function($args, $source, $input) {
  $current_user = wp_get_current_user();
  $user_customer_group = get_user_meta($current_user->ID, 'customer_group', true);
  
  // Add meta query to filter by customer group
  $args['meta_query'] = [
    'relation' => 'OR',
    [
      'key' => 'customer_group1',
      'compare' => 'NOT EXISTS', // Public products
    ],
    [
      'key' => 'customer_group1',
      'value' => $user_customer_group,
      'compare' => '=',
    ],
  ];
  
  return $args;
}, 10, 3);
```

---

## Phase 1 vs Phase 2

### Phase 1 (This Sprint)
- ✅ Document customer group requirements
- ✅ Preserve customer_group fields during migration
- ⏸️ Implement basic filtering (guest vs authenticated)

### Phase 2 (Post-Launch)
- Create admin UI to manage customer group assignments
- Add customer group indicators in product cards
- Implement advanced pricing multipliers
- Add customer group analytics/reporting

---

## References

- WordPress B2B fields: See `.github/copilot-instructions.md`
- WordPress users: 5,438 total with native authentication
- Pricing multipliers: `multiplier_buyresell`, `multiplier_humidpres`, `multiplier_mfg`
- Custom product fields: `customer_group1/2/3` in `wp_postmeta`

---

**Next Steps:**  
1. WordPress admin: Verify customer group fields exist and are populated
2. WordPress developer: Register GraphQL fields if not exposed
3. Frontend developer: Implement filtering logic and automated tests

Generated March 16, 2026 based on B2B product segmentation requirements.
