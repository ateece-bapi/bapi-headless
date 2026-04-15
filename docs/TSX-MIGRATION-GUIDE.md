# Migrating Scripts from .mjs to tsx

**Date:** April 15, 2026  
**Decision:** Switch to tsx for better TypeScript support  
**Impact:** 40+ scripts in `web/scripts/`

---

## Why tsx?

### Current State: .mjs
```javascript
// scripts/verify-megamenu-links.mjs
import { getGraphQLClient } from '../src/lib/graphql/client.ts';  // ⚠️ Need .ts extension
import { getSdk } from '../src/lib/graphql/generated.ts';         // ⚠️ Need .ts extension

// Limited type checking
// Can't use TypeScript features easily
```

### Better: tsx
```typescript
// scripts/verify-megamenu-links.ts
import { getGraphQLClient } from '../src/lib/graphql/client';  // ✅ No extension needed
import { getSdk } from '../src/lib/graphql/generated';         // ✅ Clean imports

// Full TypeScript support
// Native type checking
// Better IDE integration
```

---

## Installation

```bash
cd /home/ateece/bapi-headless/web
pnpm add -D tsx
```

**Cost:** ~2MB, no runtime impact (dev-only)

---

## Migration Guide

### Step 1: Convert One Script (Example)

**Before:** `scripts/example-script.mjs`
```javascript
/**
 * Run: node scripts/example-script.mjs
 */
import { getGraphQLClient } from '../src/lib/graphql/client.ts';
import { getSdk } from '../src/lib/graphql/generated.ts';
```

**After:** `scripts/example-script.ts`
```typescript
/**
 * Run: pnpm dlx tsx@4.20.3 scripts/example-script.ts
 */
import { getGraphQLClient } from '../src/lib/graphql/client';
import { getSdk } from '../src/lib/graphql/generated';
```

**Changes:**
1. Rename `.mjs` → `.ts`
2. Remove `.ts` extensions from imports
3. Update run command in comments

---

### Step 2: Add npm Script (Optional but Recommended)

**File:** `web/package.json`

```json
{
  "scripts": {
    "verify:megamenu": "tsx scripts/verify-megamenu-links.ts",
    "audit:images": "tsx scripts/audit-images.ts",
    "optimize:images": "tsx scripts/optimize-images.ts"
  }
}
```

**Usage:**
```bash
pnpm run verify:megamenu
pnpm run audit:images
```

---

## Current Scripts to Migrate

**Priority 1: TypeScript-heavy Scripts**
- [x] `verify-megamenu-links.ts` ✅ **Already migrated**
- [ ] `test-product-attributes.mjs` → `.ts`
- [ ] `test-variations.mjs` → `.ts`
- [ ] `bulk-import-users.mjs` → `.ts`

**Priority 2: Simple Scripts (Keep .mjs for now)**
- `audit-images.mjs`
- `optimize-images.mjs`
- `analyze-bundle.mjs`
- `check-404s.mjs`
- `performance-audit.mjs`

**Priority 3: Translation Scripts (Convert later)**
- `translate-*.js` (23 files)
- These use Anthropic API, consider batching conversion

---

## Best Practices

### 1. Use TypeScript Everywhere
```typescript
// ✅ Good: Full type safety
import type { Product } from '@/types';

async function processProducts(products: Product[]): Promise<void> {
  // TypeScript will catch errors
}
```

### 2. Leverage Shared Types
```typescript
// ✅ Good: Reuse application types
import type { MegaMenuItem } from '@/components/layout/Header/types';
import { getSdk } from '@/lib/graphql/generated';

const menuItems: MegaMenuItem[] = [...];
```

### 3. Error Handling
```typescript
// ✅ Good: Proper error types
try {
  await sdk.GetProductCategories();
} catch (error: unknown) {
  if (error instanceof Error) {
    console.error('Failed:', error.message);
  }
}
```

---

## Example: Full Script Migration

### Before: verify-megamenu-links.mjs
```javascript
import { getGraphQLClient } from '../src/lib/graphql/client.ts';
import { getSdk } from '../src/lib/graphql/generated.ts';

const LINKS = [
  { slug: 'temp-room-temp', label: 'Room Sensors' },
];

async function verify() {
  const client = getGraphQLClient(['categories'], true);
  const sdk = getSdk(client);
  
  for (const link of LINKS) {
    const data = await sdk.GetProductCategoryWithChildren({ slug: link.slug });
    console.log(data.productCategory ? '✅' : '❌', link.label);
  }
}

verify();
```

### After: verify-megamenu-links.ts
```typescript
import { getGraphQLClient } from '@/lib/graphql/client';
import { getSdk } from '@/lib/graphql/generated';

interface MegaMenuLink {
  slug: string;
  label: string;
  expectedProducts?: number;
}

const LINKS: MegaMenuLink[] = [
  { slug: 'temp-room-temp', label: 'Room Sensors', expectedProducts: 23 },
];

async function verify(): Promise<void> {
  const client = getGraphQLClient(['categories'], true);
  const sdk = getSdk(client);
  
  for (const link of LINKS) {
    try {
      const data = await sdk.GetProductCategoryWithChildren({ slug: link.slug });
      const status = data.productCategory ? '✅' : '❌';
      console.log(status, link.label, `(${data.productCategory?.count ?? 0} products)`);
    } catch (error: unknown) {
      console.error('❌', link.label, error instanceof Error ? error.message : 'Unknown error');
    }
  }
}

verify().catch((error: unknown) => {
  console.error('Script failed:', error);
  process.exit(1);
});
```

**Improvements:**
- ✅ Type-safe interfaces
- ✅ Proper error handling
- ✅ Clean imports (no `.ts` extensions)
- ✅ Promise return types
- ✅ Unknown error type (strict)

---

## Migration Checklist

### One-Time Setup
- [ ] `pnpm add -D tsx`
- [ ] Test with one script: `pnpm tsx scripts/verify-megamenu-links.ts`
- [ ] Update `.gitignore` if needed (shouldn't be necessary)

### Per-Script Migration
- [ ] Rename `.mjs` → `.ts`
- [ ] Remove `.ts` from imports: `'../src/lib/file.ts'` → `'@/lib/file'`
- [ ] Add type annotations: `function verify(): Promise<void>`
- [ ] Use proper error types: `catch (error: unknown)`
- [ ] Test script runs: `pnpm tsx scripts/your-script.ts`
- [ ] Add npm script to `package.json` (optional)

### Rollout Strategy
1. **Week 1:** Convert high-priority TypeScript-heavy scripts (4 scripts)
2. **Week 2:** Convert medium-priority utility scripts (10 scripts)
3. **Week 3:** Convert translation scripts in batch (23 scripts)

**Total Effort:** ~4-6 hours (spread over 3 weeks)

---

## Performance Comparison

### .mjs (Node.js native)
```bash
$ time node scripts/verify-megamenu-links.mjs
# ~500ms
```

### tsx (TypeScript runtime)
```bash
$ time pnpm tsx scripts/verify-megamenu-links.ts
# ~600ms (20% slower, but negligible for scripts)
```

**Verdict:** 100ms overhead is acceptable for developer experience gains.

---

## Common Issues & Solutions

### Issue 1: Import Paths
```typescript
// ❌ Wrong: Relative path with extension
import { x } from '../src/lib/file.ts';

// ✅ Correct: Use alias without extension
import { x } from '@/lib/file';
```

### Issue 2: Shared Config
```typescript
// ❌ Wrong: Can't import Next.js config
import nextConfig from '../next.config';

// ✅ Correct: Use environment variables
const API_URL = process.env.NEXT_PUBLIC_API_URL;
```

### Issue 3: ESM vs CommonJS
```typescript
// ✅ tsx handles both automatically
import fs from 'fs';              // ESM
const fs = require('fs');         // CommonJS (still works)
```

---

## Recommendation

**Start Now:**
1. Install tsx: `pnpm add -D tsx`
2. Convert `verify-megamenu-links.mjs` → `.ts` (already done)
3. Test: `pnpm tsx scripts/verify-megamenu-links.ts`
4. Add to package.json: `"verify:megamenu": "tsx scripts/verify-megamenu-links.ts"`

**Roll Out Gradually:**
- Convert scripts as you touch them
- Don't migrate all 40 at once
- Prioritize TypeScript-heavy scripts

**Long-term:**
- All new scripts should be `.ts` by default
- Deprecate `.mjs` over 3-6 months

---

**Status:** Ready to implement  
**Blockers:** None - tsx is stable and widely used  
**Risk:** Low - scripts are dev-only, no production impact
