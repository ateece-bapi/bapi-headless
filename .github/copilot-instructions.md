# BAPI Headless E-Commerce - AI Agent Instructions

## Project Timeline & Current Phase

**Current Phase:** Phase 1 (January - April 2026)  
**Go-Live Target:** April 10, 2026

### Timeline
- **Early March 2026**: Testing begins
- **March 25, 2026**: Testing concludes
- **April 6, 2026**: Stakeholder presentation for final approval
- **April 10, 2026**: Production release

### Phase 1 Priorities (Current Focus)
1. **Translation Services & Regional Support** - i18n, currency conversion, measurement units
2. **Live Chat Integration** - Customer support chat system
3. **Product Navigation** - Categories, subcategories, breadcrumb navigation, mega-menu integration

### Phase 2 (Post-Launch)
- **Applications Section** - New content (currently in main nav, defer to Phase 2)
- **Solutions Section** - New content (currently in footer, defer to Phase 2)

**Note:** Focus all development efforts on Phase 1 priorities. Applications and Solutions sections require new content creation that may not be ready by April deadline.

---

## Architecture Overview

This is a headless WordPress + Next.js e-commerce platform for building automation products:
- **Backend**: WordPress 6.8.2 + WooCommerce 10.3.5 on Kinsta (`cms/`)
- **Frontend**: Next.js 16.0.7 + TypeScript + Tailwind CSS 4 on Vercel (`web/`)
- **API Layer**: GraphQL via WPGraphQL (endpoint: `NEXT_PUBLIC_WORDPRESS_GRAPHQL`)
- **Auth**: WordPress WPGraphQL JWT Authentication (native WordPress users)
- **State**: Zustand for client state (cart in `web/src/store/cart.ts`)

### Key Integrations
- **GraphQL**: Type-safe queries generated via `graphql-codegen` → `web/src/lib/graphql/generated.ts`
- **Caching**: Next.js ISR + WordPress Smart Cache (GET requests for CDN caching)
- **Preview System**: `/api/preview` + `/api/preview-proxy` for CMS content preview with TLS support

## Critical Commands

```bash
# Development (run from web/ - uses PNPM, not NPM!)
pnpm install                  # Install dependencies (5.6x faster than npm)
pnpm run dev                  # Start Next.js dev server with Turbopack
pnpm run codegen              # Generate TypeScript types from GraphQL schema
pnpm run codegen:watch        # Watch mode for GraphQL codegen

# Testing & Quality
pnpm test                     # Run Vitest tests (648 tests, 80%+ coverage)
pnpm test:ci                  # CI mode (no watch)
pnpm run lint                 # ESLint check
pnpm run format:check         # Prettier check

# Component Development
pnpm run storybook            # Start Storybook on localhost:6006 (58 stories)
pnpm run build-storybook      # Build static Storybook
pnpm run chromatic            # Run visual regression tests

# Build & Deploy
pnpm run build                # Production build (includes codegen)
pnpm run build:analyze        # Bundle analysis with @next/bundle-analyzer
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

### Authentication (WordPress JWT)
- **Protected Routes**: Handled in `web/src/proxy.ts` via JWT token in cookies
- **Public Routes**: `/`, `/products/*`, `/api/preview`, `/api/revalidate`
- **Auth Hook**: `useAuth()` from `web/src/hooks/useAuth.ts` (checks `/api/auth/me`)
- **WordPress Plugin**: WPGraphQL JWT Authentication (wp-graphql-jwt-authentication)
- **Token Storage**: HTTP-only cookie (`auth_token`) for security

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
- **Setup**: `web/test/setupTests.ts` configures globals + MSW
- **MSW**: Mock Service Worker for API mocking (`web/test/msw/`)
  - GraphQL handlers: `web/test/msw/graphql/product.ts`
  - Mock fixtures: `web/test/msw/fixtures.ts` (reusable across tests + Storybook)
- **Run**: `pnpm test` (watch mode) or `pnpm test:ci` (CI mode)
- **Coverage**: 648 tests passing (80%+ coverage)
  - 125 unit tests (utilities, formatters, type guards)
  - 309 integration tests (products, cart, components)
  - 214 checkout tests (wizard, summary, steps)

### Storybook Testing
- **Location**: `web/src/stories/*.stories.tsx` (58 stories across 8 components)
- **MSW Integration**: Shares fixtures from `web/test/msw/fixtures.ts`
- **Visual Regression**: Chromatic integration for automated screenshot testing
- **Components Covered**: Button, Toast, ImageModal, TaglineRotator, ProductHeroFast
- **Run**: `pnpm run storybook` → localhost:6006
- **Purpose**: Component isolation, visual QA, design system docs

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
- ✅ **WPGraphQL Smart Cache** (INSTALLED on staging)
- ✅ **WPGraphQL CORS** (enables GET requests for CDN caching)
- ✅ **Redis Object Cache** (INSTALLED on staging with $100 addon)
- ✅ **WPGraphQL JWT Authentication** (native WordPress auth)

**Database Schema Notes**:
- **608 products** with extensive custom metadata
- **5,438 WordPress users** with native authentication (no migration required)
- **Custom B2B fields**: `customer_group1/2/3`, pricing multipliers (`multiplier_buyresell/humidpres/mfg`)
- **Custom product fields**: `compliancy_logos`, `product_documents`, `product_videos`, `part_number`

## Special Considerations

1. **Phase 1 Navigation Scope**: Only implement Products, Support, and Company in main navigation. Applications (main nav) and Solutions (footer) are deferred to Phase 2 due to content creation timeline.
2. **Product Categories**: Must match current website structure with correct breadcrumb navigation and mega-menu integration (Phase 1 priority).
3. **Translation & Regional Support**: Phase 1 requires i18n implementation with currency conversion and measurement unit localization.
4. **Live Chat**: Integration required for Phase 1 launch (customer support priority).
5. **Product `partNumber` Field**: Sparsely populated (only ~20 of 608 products). Always fallback to SKU in UI. Stored in `wp_postmeta` as `part_number`.
6. **B2B Customer Pricing**: Products support customer group multipliers (`multiplier_buyresell`, `multiplier_humidpres`, `multiplier_mfg`) and customer segmentation (`customer_group1/2/3`). Must handle in GraphQL queries.
7. **Custom Product Media**: Products have `compliancy_logos`, `product_documents`, and `product_videos` fields beyond standard WooCommerce schema.
8. **WordPress Authentication**: Uses native WordPress users + WPGraphQL JWT Authentication plugin (no third-party auth service). JWT tokens stored in HTTP-only cookies for security.
9. **GraphQL Performance**: Use split queries (light/deferred) for product pages to reduce initial load.
10. **Image Optimization**: Configure Next.js image domains in `next.config.ts` (Kinsta, WordPress.org).
11. **Bundle Analysis**: `pnpm run build:analyze` to check bundle size.

## Common Workflows

### Adding a New GraphQL Query
1. Create `.graphql` file in `web/src/lib/graphql/queries/`
2. Run `pnpm run codegen` to generate types
3. Import generated types from `web/src/lib/graphql/generated.ts`
4. Use with `getGraphQLClient(['cache-tag'])`

### Adding a New Protected Route
1. Add route to `protectedRoutes` array in `web/src/proxy.ts`
2. Middleware will check for `auth_token` cookie and redirect to `/sign-in` if missing

### Debugging GraphQL Performance
1. Check WordPress Smart Cache installation status
2. Verify GET method usage: `getGraphQLClient(tags, true)`
3. Ensure cache-control headers are present
4. Use GraphiQL IDE at `{WORDPRESS_URL}/graphql` for query testing

### Creating Storybook Stories
1. Create `ComponentName.stories.tsx` in `web/src/stories/`
2. Import component + mock fixtures from `web/test/msw/fixtures.ts`
3. Use MSW handlers from `web/test/msw/graphql/` for GraphQL data
4. Test variants: Default, Loading, Error, Empty, Edge cases
5. Run `pnpm run storybook` to verify
6. Visual regression: `pnpm run chromatic` (requires CHROMATIC_PROJECT_TOKEN)

## Documentation

- **Architecture**: [README.md](../README.md)
- **GraphQL Setup**: [GRAPHQL_SETUP.md](../GRAPHQL_SETUP.md)
- **Coding Standards**: [web/CODING_STANDARDS.md](../web/CODING_STANDARDS.md)
- **Error Handling**: [web/ERROR_HANDLING.md](../web/ERROR_HANDLING.md)
- **Tailwind Guidelines**: [web/TAILWIND_GUIDELINES.md](../web/TAILWIND_GUIDELINES.md)
- **Color System**: [web/COLOR_SYSTEM.md](../web/COLOR_SYSTEM.md)
- **Preview System**: [web/PREVIEW.md](../web/PREVIEW.md)
- **WordPress Setup**: [docs/WORDPRESS-BACKEND-SETUP.md](../docs/WORDPRESS-BACKEND-SETUP.md)
- **Performance**: [docs/WORDPRESS-GRAPHQL-OPTIMIZATION.md](../docs/WORDPRESS-GRAPHQL-OPTIMIZATION.md)
