# Coding Standards

## Export Patterns

### Default Exports

**Use for:**

1. **Next.js Special Files** (Required by framework)
```typescript
// app/products/page.tsx
export default function ProductPage() { }

// app/layout.tsx
export default function RootLayout({ children }) { }

// app/error.tsx
export default function ErrorBoundary() { }

// app/loading.tsx
export default function Loading() { }
```

2. **Single-Component Files**
```typescript
// components/cart/AddToCartButton.tsx
export default function AddToCartButton(props) {
  // Component implementation
}
```

3. **Index File Re-exports** (For convenience)
```typescript
// components/cart/index.ts
export { default as CartIcon } from './CartIcon';
export { default as AddToCartButton } from './AddToCartButton';
export { default as CartDrawer } from './CartDrawer';
```

### Named Exports

**Use for:**

1. **Utility Functions** (Multiple exports per file)
```typescript
// lib/errors.ts
export function getUserErrorMessage(error: unknown) { }
export function logError(context: string, error: unknown) { }
export class AppError extends Error { }
export const ERROR_MESSAGES = { };
```

2. **React Hooks**
```typescript
// store/hooks.ts
export function useCart() { }
export function useCartDrawer() { }

// components/ui/Toast.tsx
export function useToast() { }
export function ToastProvider({ children }) { }
```

3. **Constants and Configuration**
```typescript
// components/Hero/config.ts
export const HERO_CONFIG = { };

// lib/constants.ts
export const API_ENDPOINTS = { };
export const DEFAULT_SETTINGS = { };
```

4. **Type Definitions**
```typescript
// types/cart.ts
export type CartItem = { };
export interface CartState { }
export type { Product } from './product';
```

### Import Patterns

```typescript
// ✅ Default exports
import AddToCartButton from '@/components/cart/AddToCartButton';
import { AddToCartButton } from '@/components/cart'; // Via index

// ✅ Named exports
import { useCart, useCartDrawer } from '@/store';
import { ERROR_MESSAGES, logError } from '@/lib/errors';

// ✅ Mixed (when needed)
import Toast, { useToast } from '@/components/ui/Toast';
```

### Rationale

**Default exports:**
- Required by Next.js for routes/layouts/special files
- Simple for single-component files
- Clean re-export pattern through index files
- Matches React and Next.js conventions

**Named exports:**
- Better for multiple exports from one file
- Explicit about what's exported
- Better IDE refactoring support
- Tree-shaking friendly for utilities

### Migration Note

Existing code uses this pattern correctly. No changes required. Follow these standards for new code.

---

## Component Structure

### File Naming

```
✅ PascalCase for components: AddToCartButton.tsx
✅ camelCase for utilities: useCart.ts, formatPrice.ts
✅ kebab-case for CSS modules: button.module.css
✅ lowercase for Next.js: page.tsx, layout.tsx, loading.tsx
```

### Component Template

```typescript
'use client'; // Only if using client features

import React from 'react';
import type { ComponentProps } from './types';

/**
 * Component description
 * 
 * @param prop1 - Description
 * @param prop2 - Description
 */
export default function ComponentName({ 
  prop1, 
  prop2 
}: ComponentProps) {
  // Component logic
  
  return (
    // JSX
  );
}
```

### Utility Template

```typescript
/**
 * Utility description
 */

export type UtilityOptions = {
  // Type definitions
};

export function utilityFunction(params: UtilityOptions) {
  // Implementation
}

export const UTILITY_CONSTANT = {
  // Constants
};
```

---

## Type Definitions

### Co-location

Keep types close to usage:

```typescript
// ✅ Component types in same file or adjacent types.ts
// components/cart/AddToCartButton.tsx
interface AddToCartButtonProps {
  product: CartItem;
  quantity?: number;
}

// ✅ Shared types in dedicated file
// types/cart.ts
export interface CartItem {
  id: string;
  name: string;
  price: string;
}
```

### Export Pattern

```typescript
// ✅ Export types for reuse
export type { CartItem };
export interface Product { }

// ✅ Type-only imports
import type { CartItem } from '@/types/cart';
```

---

## Error Handling

### User-Facing Components

```typescript
import { useToast } from '@/components/ui/Toast';
import { getUserErrorMessage, logError } from '@/lib/errors';

function MyComponent() {
  const { showToast } = useToast();
  
  const handleAction = async () => {
    try {
      await someAction();
      showToast('success', 'Success!', 'Action completed.');
    } catch (error) {
      const { title, message } = getUserErrorMessage(error);
      logError('component.action', error, { metadata });
      showToast('error', title, message);
    }
  };
}
```

### API Routes

```typescript
import { NextResponse } from 'next/server';
import logger from '@/lib/logger';

export async function POST(request: Request) {
  try {
    // Handle request
    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error('api.route_name', { error });
    return NextResponse.json({
      error: 'Error Title',
      message: 'User-friendly message'
    }, { status: 500 });
  }
}
```

---

## Best Practices

### Component Organization

```
components/
  ├── cart/
  │   ├── index.ts          # Re-exports
  │   ├── AddToCartButton.tsx
  │   ├── CartDrawer.tsx
  │   └── CartIcon.tsx
  ├── layout/
  │   ├── Header/
  │   │   ├── index.tsx     # Main component
  │   │   ├── types.ts      # Type definitions
  │   │   ├── config.ts     # Configuration
  │   │   ├── hooks/        # Component hooks
  │   │   └── components/   # Sub-components
  │   └── Footer.tsx
  └── ui/                   # Reusable UI components
      ├── Toast.tsx
      └── index.ts
```

### Import Order

```typescript
// 1. React/Next.js
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

// 2. External libraries
import { clsx } from 'clsx';
import { z } from 'zod';

// 3. Internal utilities
import { getUserErrorMessage } from '@/lib/errors';
import logger from '@/lib/logger';

// 4. Components
import { AddToCartButton } from '@/components/cart';
import { useToast } from '@/components/ui/Toast';

// 5. Types
import type { CartItem } from '@/types/cart';
import type { ComponentProps } from './types';

// 6. Styles (if needed)
import styles from './component.module.css';
```

### Client/Server Components

```typescript
// ✅ Explicit about client components
'use client';

// ✅ Server components (default)
// No directive needed

// ✅ Mark async server components
export default async function ProductPage() { }
```

---

## JSDoc Documentation

### When to Write JSDoc

**REQUIRED for:**

1. **Public API functions** - Exported utilities used across codebase
2. **Complex business logic** - Non-obvious behavior that needs explanation
3. **Functions with side effects** - State mutations, API calls, etc.
4. **Hooks and context providers** - Setup requirements and usage patterns

**OPTIONAL/Skip for:**

1. **Self-explanatory functions** - Name and TypeScript types are clear
2. **Private helpers** - Internal implementation details
3. **Simple type guards** - TypeScript is sufficient
4. **Component props** - TypeScript interfaces document these

### JSDoc Template

**Basic format:**
```typescript
/**
 * Brief one-line description of what the function does
 * 
 * More detailed explanation if needed. Explain WHY and HOW,
 * not just WHAT (TypeScript already shows what).
 * 
 * @param paramName - Parameter description
 * @param optionalParam - Optional parameter (don't duplicate TypeScript info)
 * @returns What the function returns and any important details
 * 
 * @example
 * ```ts
 * // Show real-world usage
 * const result = myFunction(input);
 * ```
 * 
 * @see https://related-docs.com - Link to relevant documentation
 * @throws {ErrorType} When this error might occur
 */
export function myFunction(paramName: string, optionalParam?: number): ReturnType {
  // Implementation
}
```

### Good JSDoc Examples

```typescript
/**
 * Normalizes WooCommerce product responses from GraphQL
 * 
 * WP/WooCommerce returns inconsistent field names (image vs featuredImage).
 * This normalizer ensures consistent shape before validation layer.
 * 
 * @param raw - Raw GraphQL response (unknown type for safety)
 * @returns Normalized product with consistent field names
 * 
 * @example
 * ```ts
 * const normalized = normalizeProduct(graphqlResponse);
 * const valid = productSchema.parse(normalized);
 * ```
 */
export function normalizeProductQueryResponse(raw: unknown): GetProductBySlugQuery {
  // Implementation
}

/**
 * Rate limits requests using sliding window algorithm
 * 
 * Tracks requests per IP address in-memory. Automatically
 * cleans up expired entries every minute to prevent memory leaks.
 * Not suitable for distributed systems (use Redis instead).
 * 
 * @param clientIP - IP address to rate limit
 * @param options - Configuration for limit and time window
 * @returns Success status with remaining quota and reset time
 * 
 * @example
 * ```ts
 * const result = checkRateLimit(ip, { limit: 10, windowMs: 60000 });
 * if (!result.success) {
 *   return new Response('Rate limited', {
 *     status: 429,
 *     headers: { 'Retry-After': String(result.reset) }
 *   });
 * }
 * ```
 */
export function checkRateLimit(clientIP: string, options: RateLimitOptions) {
  // Implementation
}

/**
 * Custom hook for cart state management with localStorage persistence
 * 
 * Cart state syncs across browser tabs and persists page refreshes.
 * Use this hook instead of accessing the Zustand store directly.
 * 
 * @returns Cart state and mutation methods
 * 
 * @example
 * ```tsx
 * function CartButton() {
 *   const { items, totalItems, addItem } = useCart();
 *   return (
 *     <button onClick={() => addItem(product, 1)}>
 *       Add to Cart ({totalItems})
 *     </button>
 *   );
 * }
 * ```
 */
export function useCart() {
  // Implementation
}
```

### What NOT to Document

```typescript
// ❌ BAD - Just repeats TypeScript types
/**
 * Gets product price
 * @param product - The product
 * @returns The price
 */
export function getProductPrice(product: Product): string | null {
  return product.price;
}

// ✅ GOOD - Adds context TypeScript can't express
/**
 * Extracts formatted price from WooCommerce product
 * 
 * Handles various product types (Simple, Variable, Group) which
 * may have different price structures. Returns pre-formatted string
 * from WooCommerce (e.g., "$19.99", "$10.00 - $25.00").
 * 
 * @param product - Product from GraphQL (nullable for safe guards)
 * @returns Formatted price with currency, or null if unavailable
 */
export function getProductPrice(product: Product | null): string | null {
  return product?.price ?? null;
}

// ✅ ALSO GOOD - Simple function, skip JSDoc entirely
export function isSimpleProduct(product: Product | null): product is SimpleProduct {
  return product?.__typename === 'SimpleProduct';
}
```

### JSDoc Tags Reference

**Common tags:**
- `@param {type} name - Description` - Parameter documentation
- `@returns {type} Description` - Return value (but TypeScript shows type)
- `@example` - Code example (most valuable!)
- `@see https://...` - Link to related docs
- `@throws {ErrorType}` - When function throws
- `@deprecated Use newFunction() instead` - Mark as deprecated
- `@internal` - Private/internal API
- `@since 1.2.0` - When feature was added

**Avoid:**
- `@type` - TypeScript handles this
- `@typedef` - Use TypeScript types instead
- `@template` - TypeScript generics are clearer

### ESLint Configuration

JSDoc is enforced via ESLint but only for exported function declarations:

```javascript
// eslint.config.mjs
'jsdoc/require-jsdoc': [
  'warn', // Warning, not error
  {
    require: {
      FunctionDeclaration: true,  // Only function declarations
      ArrowFunctionExpression: false,  // Skip arrow functions
    },
    contexts: [
      'ExportNamedDeclaration > FunctionDeclaration', // Only exports
    ],
    exemptEmptyFunctions: true, // Skip empty functions
  },
]
```

This keeps JSDoc requirements pragmatic - only warns for public API functions.

---

## Magic Numbers

### Constants Organization

Extract magic numbers to constants files when they represent:

1. **Configuration values** - Cache times, rate limits, timeouts
2. **Business rules** - Thresholds, limits, quotas
3. **Reused values** - Same number used in multiple places
4. **Tunable parameters** - Values likely to change

**Keep inline when:**
- One-off values with clear context
- UI-specific values (padding, animation timing)
- Test data and fixtures
- Self-documenting (e.g., `items.slice(0, 5)`)

### Constants Structure

```typescript
// lib/constants/cache.ts
/**
 * Cache revalidation times for Next.js
 * Values in seconds
 */
export const CACHE_REVALIDATION = {
  /** Products catalog - 1 hour */
  PRODUCTS: 3600,
  /** Categories - 2 hours */
  CATEGORIES: 7200,
  /** Default - 1 hour */
  DEFAULT: 3600,
} as const;

// lib/constants/rate-limits.ts
/**
 * Rate limiting configs per API endpoint
 */
export const RATE_LIMITS = {
  /** Preview API: 10 req/min */
  PREVIEW_API: {
    limit: 10,
    windowMs: 60000,
  },
  /** Revalidate API: 5 req/min */
  REVALIDATE_API: {
    limit: 5,
    windowMs: 60000,
  },
} as const;
```

### Usage

```typescript
// ❌ Magic numbers
export const getGraphQLClient = (tags?: string[]) => {
  return new GraphQLClient(endpoint, {
    next: {
      revalidate: 3600, // What does this mean?
    },
  });
};

// ✅ Named constants
import { CACHE_REVALIDATION } from '@/lib/constants/cache';

export const getGraphQLClient = (tags?: string[]) => {
  return new GraphQLClient(endpoint, {
    next: {
      revalidate: CACHE_REVALIDATION.DEFAULT,
    },
  });
};
```

### Benefits

✅ **Single source of truth** - Update in one place  
✅ **Self-documenting** - Clear intent from name  
✅ **Type safety** - `as const` ensures immutability  
✅ **Discoverability** - IDE autocomplete shows all options

### Examples

**Extract these:**
```typescript
// ❌ Before
setTimeout(cleanup, 300000); // What's 300000?
fetch(url, { timeout: 5000 });
if (items.length > 100) { ... }

// ✅ After
const TIMEOUTS = {
  CLEANUP_INTERVAL: 5 * 60 * 1000, // 5 minutes
  API_REQUEST: 5000, // 5 seconds
} as const;

const LIMITS = {
  MAX_ITEMS_PER_PAGE: 100,
} as const;
```

**Keep inline:**
```typescript
// ✅ Context is clear
showToast('success', message, 3000);
items.slice(0, 10); // Top 10
const isValid = score >= 0 && score <= 100;
```

### Organization

```
lib/
  constants/
    cache.ts         # Cache revalidation times
    rate-limits.ts   # API rate limiting configs
    pagination.ts    # Page sizes, limits
    timeouts.ts      # Request/operation timeouts
```

---

## Code Quality

### Accessibility

```typescript
// ✅ ARIA labels
<button aria-label="Close notification">
  <X className="w-4 h-4" />
</button>

// ✅ Semantic HTML
<nav aria-label="Main navigation">
  <ul role="list">
    <li><a href="/">Home</a></li>
  </ul>
</nav>

// ✅ Role and live regions
<div role="alert" aria-live="assertive">
  Error message
</div>
```

### Performance

```typescript
// ✅ Image optimization
<Image
  src={product.image}
  alt={product.name}
  width={800}
  height={600}
  priority={isAboveFold}
  sizes="(min-width: 1024px) 33vw, 100vw"
/>

// ✅ Dynamic imports for heavy components
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <LoadingSkeleton />
});

// ✅ Suspense boundaries
<Suspense fallback={<Loading />}>
  <AsyncComponent />
</Suspense>
```

### Type Safety

```typescript
// ✅ Explicit types
export function formatPrice(price: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(price);
}

// ✅ Type guards
function isCartItem(obj: unknown): obj is CartItem {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'name' in obj
  );
}
```

---

## Testing Considerations

### Component Tests

```typescript
// components/__tests__/AddToCartButton.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import AddToCartButton from '../AddToCartButton';

describe('AddToCartButton', () => {
  it('adds item to cart on click', () => {
    const product = { id: '1', name: 'Test' };
    render(<AddToCartButton product={product} />);
    
    const button = screen.getByRole('button', { name: /add to cart/i });
    fireEvent.click(button);
    
    // Assert behavior
  });
});
```

### Utility Tests

```typescript
// lib/__tests__/errors.test.ts
import { getUserErrorMessage, ERROR_MESSAGES } from '../errors';

describe('Error handling', () => {
  it('returns friendly message for network errors', () => {
    const error = new Error('fetch failed');
    const result = getUserErrorMessage(error);
    expect(result).toEqual(ERROR_MESSAGES.NETWORK_ERROR);
  });
});
```

---

## Documentation

### Component Documentation

```typescript
/**
 * Button for adding products to cart with error handling
 * 
 * @example
 * ```tsx
 * <AddToCartButton 
 *   product={product} 
 *   quantity={2}
 *   showCartOnAdd={true}
 * />
 * ```
 * 
 * @param product - Product to add (omit quantity)
 * @param quantity - Number of items (default: 1)
 * @param showCartOnAdd - Open cart drawer after add (default: true)
 */
export default function AddToCartButton({ ... }) { }
```

### Utility Documentation

```typescript
/**
 * Extract user-friendly error message from any error type
 * 
 * Maps technical errors to predefined user-friendly messages.
 * Falls back to generic message for unknown errors.
 * 
 * @param error - Error object (Error, AppError, or unknown)
 * @returns Object with title and message
 * 
 * @example
 * ```ts
 * try {
 *   await fetchData();
 * } catch (error) {
 *   const { title, message } = getUserErrorMessage(error);
 *   showToast('error', title, message);
 * }
 * ```
 */
export function getUserErrorMessage(error: unknown) { }
```

---

## Git Commit Messages

```bash
# Format
<type>(<scope>): <subject>

# Types
feat:     New feature
fix:      Bug fix
docs:     Documentation only
style:    Formatting, missing semicolons, etc
refactor: Code change that neither fixes bug nor adds feature
perf:     Performance improvement
test:     Adding tests
chore:    Maintenance tasks

# Examples
feat(cart): add toast notifications on cart actions
fix(products): handle null image gracefully
docs(error): add error handling guide
refactor(exports): standardize component exports
perf(images): add priority loading for LCP images
```

---

This document represents current best practices for the codebase. Update as patterns evolve.
