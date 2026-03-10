# GraphQL Client Infrastructure Setup Complete

## ✅ What We Built

### 1. GraphQL Client (`src/lib/graphql/client.ts`)
- Configured `graphql-request` client with WordPress GraphQL endpoint
- Created server-side and client-side client instances
- Added Next.js 15+ caching support

### 2. Type Generation (`codegen.ts`)
- Set up GraphQL Code Generator
- Configured to generate TypeScript types from WordPress GraphQL schema
- Added scripts: `npm run codegen` and `npm run codegen:watch`
- Enabled public introspection on WordPress backend

### 3. GraphQL Queries (`src/lib/graphql/queries/products.graphql`)
- `GetProducts` - Fetch products with pagination, includes all product types
- `GetProductBySlug` - Fetch single product with full details, variations, related products
- `GetProductCategories` - Fetch product categories with counts

### 4. Type-Safe Query Functions (`src/lib/graphql/queries.ts`)
- `getProducts(first, after)` - Server-side product fetching
- `getProductBySlug(slug)` - Server-side single product fetch
- `getProductCategories(first)` - Server-side category fetch

### 5. Type Guards & Utilities (`src/lib/graphql/types.ts`)
- Type definitions for all product types (SimpleProduct, VariableProduct, etc.)
- Type guard functions: `isSimpleProduct()`, `isVariableProduct()`, etc.
- Utility functions: `getProductPrice()`, `getProductStockStatus()`, `isProductOnSale()`
- Full TypeScript type safety with discriminated unions

### 6. Centralized Exports (`src/lib/graphql/index.ts`)
- Single import point for all GraphQL functionality
- Clean API for consuming components

### 7. Test Page (`src/app/products-test/page.tsx`)
- Working example of using the GraphQL client
- Displays products with images, prices, stock status
- Demonstrates type-safe product handling

## 📦 Installed Packages

```json
{
  "dependencies": {
    "graphql": "^16.12.0",
    "graphql-request": "^7.3.4",
    "graphql-tag": "^2.12.6"
  },
  "devDependencies": {
    "@graphql-codegen/cli": "^6.1.0",
    "@graphql-codegen/typescript": "^5.0.5",
    "@graphql-codegen/typescript-graphql-request": "^6.3.0",
    "@graphql-codegen/typescript-operations": "^5.0.5"
  }
}
```

## 🔧 WordPress Configuration

Enabled public GraphQL introspection via WP-CLI:
```bash
wp option update graphql_general_settings '{"public_introspection_enabled":"on"}' --format=json
```

## 📄 Schema Management

The GraphQL schema is stored locally in `web/schema.json` (3.7MB) to avoid cache issues during code generation. This file is committed to the repository for consistency across development environments.

### Regenerating the Schema

If the WordPress GraphQL schema changes (e.g., after plugin updates or custom field additions), regenerate the local schema:

```bash
cd web
pnpm run schema:download
```

This will introspect the GraphQL endpoint defined in `NEXT_PUBLIC_WORDPRESS_GRAPHQL` and update `schema.json`.

### After Schema Updates

Always run code generation after updating the schema:

```bash
cd web
pnpm run codegen
```

This regenerates TypeScript types in `src/lib/graphql/generated.ts` based on your queries and the updated schema.

## 🚀 Usage Examples

### Fetch Products in Server Component
```typescript
import { getProducts, getProductPrice } from '@/lib/graphql';

export default async function ProductsPage() {
  const data = await getProducts(10);
  const products = data.products?.nodes || [];
  
  return (
    <div>
      {products.map(product => (
        <div key={product.id}>
          <h2>{product.name}</h2>
          <p>{getProductPrice(product)}</p>
        </div>
      ))}
    </div>
  );
}
```

### Type-Safe Product Handling
```typescript
import { isSimpleProduct, isVariableProduct } from '@/lib/graphql';

if (isSimpleProduct(product)) {
  // TypeScript knows this is a SimpleProduct
  console.log(product.price, product.stockStatus);
}

if (isVariableProduct(product)) {
  // TypeScript knows this is a VariableProduct
  console.log(product.variations);
}
```

## 📝 NPM Scripts

- `npm run codegen` - Generate TypeScript types from GraphQL schema
- `npm run codegen:watch` - Watch mode for type generation
- `npm run dev` - Start development server
- `npm run build` - Build for production

## 🎯 Next Steps

1. **Design Component Architecture** - Plan reusable product components
2. **Build Product Listing Page** - `/products` with pagination
3. **Build Product Detail Page** - `/products/[slug]` with full details
4. **Implement Cart** - State management and persistence
5. **Build Checkout** - Multi-step checkout flow

## 🔍 Test Your Setup

Visit: http://localhost:3000/products-test

You should see your products from the WordPress backend displayed with:
- Product images
- Names and prices
- Stock status
- Product type indicators

## 🎉 Benefits

✅ **Full Type Safety** - TypeScript types generated from your actual schema  
✅ **Developer Experience** - Autocomplete, type checking, refactoring support  
✅ **Performance** - Built-in caching, server-side rendering  
✅ **Scalability** - Clean architecture ready for complex features  
✅ **Maintainability** - Centralized GraphQL logic, easy to test
