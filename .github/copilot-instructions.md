# BAPI Headless E-Commerce - AI Agent Instructions

## Architecture Overview

This is a headless WordPress + Next.js e-commerce platform for building automation products:
- **Backend**: WordPress 6.8.2 + WooCommerce 10.3.5 on Kinsta (`cms/`)
- **Frontend**: Next.js 16.0.7 + TypeScript + Tailwind CSS 4 on Vercel (`web/`)
- **API Layer**: GraphQL via WPGraphQL (endpoint: `NEXT_PUBLIC_WORDPRESS_GRAPHQL`)
- **Auth**: Clerk with Google OAuth, synced with WordPress users
- **State**: Zustand for client state (cart in `web/src/store/cart.ts`)

### Key Integrations
- **GraphQL**: Type-safe queries generated via `graphql-codegen` → `web/src/lib/graphql/generated.ts`
- **Caching**: Next.js ISR + WordPress Smart Cache (GET requests for CDN caching)
- **Preview System**: `/api/preview` + `/api/preview-proxy` for CMS content preview with TLS support

## Critical Commands

```bash
# Development (run from web/)
npm run dev                    # Start Next.js dev server
npm run codegen               # Generate TypeScript types from GraphQL schema
npm run codegen:watch         # Watch mode for GraphQL codegen

# Testing
npm test                      # Run Vitest tests
npm run lint                  # ESLint check
npm run format:check          # Prettier check

# Build & Deploy
npm run build                 # Production build
npm run build:analyze         # Bundle analysis
```

## Project-Specific Conventions

### GraphQL Client Pattern
- **Server-side**: Use `getGraphQLClient(tags, useGetMethod)` from `web/src/lib/graphql/client.ts`
  - Default: GET requests for CDN caching
  - Always pass cache tags for revalidation: `['products']`, `['product-{slug}']`
- **Queries**: Define in `.graphql` files under `web/src/lib/graphql/queries/`
- **Type Generation**: Run `npm run codegen` after schema changes
- **Performance**: Product queries split into light/deferred/variations/related for optimization

### Component Architecture
- **Exports**: Default for Next.js routes/single components, named for utilities/hooks/types
- **File Structure**: See [web/CODING_STANDARDS.md](../web/CODING_STANDARDS.md)
  - PascalCase for components: `AddToCartButton.tsx`
  - camelCase for utilities: `useCart.ts`, `formatPrice.ts`
- **"use client"**: Only when using hooks, events, or browser APIs (prefer Server Components)

### Error Handling
Use the centralized system in `web/src/lib/errors.ts`:
```typescript
import { AppError, getUserErrorMessage, logError } from '@/lib/errors';

// Throw user-friendly errors
throw new AppError('Internal message', 'User message', 'ERROR_CODE', statusCode);

// Handle errors with toast
const { title, message } = getUserErrorMessage(error);
showToast('error', title, message);
```

### Styling & Design System
- **Brand Colors**: BAPI Blue (#1479BC), Yellow (#FFC843), Gray (#97999B)
  - Use semantic tokens: `bg-primary-500`, `bg-accent-500`, `bg-neutral-200`
  - Distribution: 60% White/Gray, 30% Blue, 10% Yellow
- **Tailwind**: Utility-first, NO `@apply`, semantic tokens only (see [web/TAILWIND_GUIDELINES.md](../web/TAILWIND_GUIDELINES.md))
- **Responsive**: Mobile-first (`sm:`, `md:`, `lg:`, `xl:`)

### Authentication (Clerk)
- **Protected Routes**: Handled in `web/src/proxy.ts` via `clerkMiddleware`
- **Public Routes**: `/`, `/products/*`, `/api/preview`, `/api/revalidate`, `/sign-in/*`, `/sign-up/*`
- **Migration**: WordPress users synced to Clerk via `web/scripts/bulk-import-users.mjs`
- **Environment**: Development keys (`pk_test_`, `sk_test_`) safe for staging

### State Management (Zustand)
- **Cart Store**: `web/src/store/cart.ts` with localStorage persistence
- **Pattern**: Simple stores with typed actions, no Redux complexity
```typescript
import { useCartStore } from '@/store';
const { addItem, items, totalItems } = useCartStore();
```

### Cache Revalidation
- **On-Demand**: POST to `/api/revalidate` with secret + tag
- **Tags**: `products`, `product-{slug}`, `categories`, `graphql`
- **WordPress Integration**: Configure webhooks to trigger revalidation on content changes

### Preview System
- **Environment Variables**:
  - `PREVIEW_SECRET`: Shared secret for preview routes
  - `PREVIEW_CA_PATH`: Optional mkcert CA for local TLS (e.g., `$(mkcert -CAROOT)/rootCA.pem`)
  - `PREVIEW_ALLOW_INSECURE`: Dev-only, never in production
- **Health Check**: `/api/preview-proxy/health` for uptime monitoring

## Testing Approach
- **Framework**: Vitest with jsdom environment
- **Setup**: `web/test/setupTests.ts` configures globals
- **MSW**: Mock Service Worker for API mocking (`web/test/msw/`)
- **Run**: `npm test` (watch mode) or `npm run test:ci` (CI mode)

## Key Files Reference

| File/Directory | Purpose |
|----------------|---------|
| `web/src/lib/graphql/client.ts` | GraphQL client with caching + GET method support |
| `web/src/lib/graphql/queries/*.graphql` | GraphQL query definitions |
| `web/src/lib/errors.ts` | Centralized error handling |
| `web/src/store/cart.ts` | Zustand cart state with localStorage |
| `web/src/proxy.ts` | Clerk authentication middleware |
| `web/codegen.ts` | GraphQL Code Generator config |
| `web/next.config.ts` | Next.js config (bundle analyzer, image domains) |
| `.github/instructions/headlessWP.instructions.md` | TypeScript file-specific rules |

## WordPress Backend Setup

**Critical Plugins** (see [docs/WORDPRESS-BACKEND-SETUP.md](../docs/WORDPRESS-BACKEND-SETUP.md)):
- ✅ WPGraphQL (core)
- ✅ WPGraphQL for WooCommerce
- 🔴 **WPGraphQL Smart Cache** (NOT INSTALLED - 80-90% performance gain missing)
- 🔴 **WPGraphQL CORS** (enables GET requests for CDN caching)
- 🔴 **Redis Object Cache** (recommended for sub-second queries)

**Database Schema Notes**:
- **608 products** with extensive custom metadata
- **5,438 WordPress users** requiring Clerk migration
- **Custom B2B fields**: `customer_group1/2/3`, pricing multipliers (`multiplier_buyresell/humidpres/mfg`)
- **Custom product fields**: `compliancy_logos`, `product_documents`, `product_videos`, `part_number`
- **No GraphQL cache tables** - confirms Smart Cache not installed

## Special Considerations

1. **Product `partNumber` Field**: Sparsely populated (only ~20 of 608 products). Always fallback to SKU in UI. Stored in `wp_postmeta` as `part_number`.
2. **B2B Customer Pricing**: Products support customer group multipliers (`multiplier_buyresell`, `multiplier_humidpres`, `multiplier_mfg`) and customer segmentation (`customer_group1/2/3`). Must handle in GraphQL queries.
3. **Custom Product Media**: Products have `compliancy_logos`, `product_documents`, and `product_videos` fields beyond standard WooCommerce schema.
4. **Large User Base**: 5,438 WordPress users require careful Clerk migration planning. See `web/scripts/bulk-import-users.mjs`.
5. **Clerk Development Keys**: Safe for staging/preview environments, update for production.
6. **GraphQL Performance**: Use split queries (light/deferred) for product pages to reduce initial load.
7. **Image Optimization**: Configure Next.js image domains in `next.config.ts` (Kinsta, WordPress.org).
8. **Bundle Analysis**: `npm run build:analyze` to check bundle size.

## Common Workflows

### Adding a New GraphQL Query
1. Create `.graphql` file in `web/src/lib/graphql/queries/`
2. Run `npm run codegen` to generate types
3. Import generated types from `web/src/lib/graphql/generated.ts`
4. Use with `getGraphQLClient(['cache-tag'])`

### Adding a New Protected Route
1. Update `publicRoutes` matcher in `web/src/proxy.ts`
2. If public, add to the `createRouteMatcher()` array

### Debugging GraphQL Performance
1. Check WordPress Smart Cache installation status
2. Verify GET method usage: `getGraphQLClient(tags, true)`
3. Ensure cache-control headers are present
4. Use GraphiQL IDE at `{WORDPRESS_URL}/graphql` for query testing

## Documentation

- **Architecture**: [README.md](../README.md)
- **GraphQL Setup**: [GRAPHQL_SETUP.md](../GRAPHQL_SETUP.md)
- **Coding Standards**: [web/CODING_STANDARDS.md](../web/CODING_STANDARDS.md)
- **Error Handling**: [web/ERROR_HANDLING.md](../web/ERROR_HANDLING.md)
- **Tailwind Guidelines**: [web/TAILWIND_GUIDELINES.md](../web/TAILWIND_GUIDELINES.md)
- **Color System**: [web/COLOR_SYSTEM.md](../web/COLOR_SYSTEM.md)
- **Clerk Auth**: [web/CLERK_SETUP.md](../web/CLERK_SETUP.md)
- **Preview System**: [web/PREVIEW.md](../web/PREVIEW.md)
- **WordPress Setup**: [docs/WORDPRESS-BACKEND-SETUP.md](../docs/WORDPRESS-BACKEND-SETUP.md)
- **Performance**: [docs/WORDPRESS-GRAPHQL-OPTIMIZATION.md](../docs/WORDPRESS-GRAPHQL-OPTIMIZATION.md)
