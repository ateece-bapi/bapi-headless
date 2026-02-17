# Senior-Level ESLint Refactoring Plan

**Branch:** `refactor/eslint-senior-code-quality`  
**Created:** February 17, 2026  
**Target:** Zero ESLint errors with enterprise-grade code quality  
**Current Status:** 1,076 problems (353 errors, 723 warnings)

---

## Senior-Level Best Practices Strategy

### Philosophy
This refactoring implements enterprise-grade code quality standards:
- **Type Safety First**: Eliminate all `any` types with proper TypeScript interfaces
- **Performance Optimization**: Use Next.js `<Link>` for client-side navigation
- **Security & Accessibility**: Proper JSX entity escaping and WCAG compliance
- **Maintainability**: Comprehensive JSDoc documentation for all public APIs
- **React Best Practices**: Proper hooks usage with correct dependencies

### Priority Order (Risk-Based)

#### Priority 1: Next.js Link Migration (🔴 80+ errors)
**Rule:** `@next/next/no-html-link-for-pages`  
**Impact:** Performance degradation, full page reloads, loss of client-side routing  
**Files Affected:** ~30 component files (navigation, CTAs, mega menu, footer)

**Before:**
```tsx
<a href="/products/" className="nav-link">
  Products
</a>
```

**After (Senior Pattern):**
```tsx
import Link from 'next/link';

<Link href="/products/" className="nav-link">
  Products
</Link>
```

**Key Considerations:**
- Preserve all className, style, and ARIA attributes
- Maintain i18n locale-aware routing
- Verify external links remain as `<a>` with `target="_blank" rel="noopener noreferrer"`
- Test navigation state persistence

#### Priority 2: React Entity Escaping (🔴 16+ errors)
**Rule:** `react/no-unescaped-entities`  
**Impact:** XSS vulnerability potential, rendering issues, JSX parsing errors

**Before:**
```tsx
<p>Don't use unescaped quotes</p>
<h2>BAPI's Solutions</h2>
```

**After (Senior Pattern):**
```tsx
<p>Don&apos;t use unescaped quotes</p>
<h2>BAPI&apos;s Solutions</h2>
{/* OR use template literals for complex text: */}
<p>{"Don't use unescaped quotes"}</p>
```

**Entity Reference:**
- Apostrophe: `&apos;` or `&#39;`
- Quote: `&quot;` or `&#34;`
- Less than: `&lt;` or `&#60;`
- Greater than: `&gt;` or `&#62;`
- Ampersand: `&amp;` or `&#38;`

#### Priority 3: TypeScript Type Safety (⚠️ 100+ warnings)
**Rule:** `@typescript-eslint/no-explicit-any`  
**Impact:** Loss of type safety, runtime errors, reduced IDE intelligence

**Files to Fix:**
- `src/lib/wordpress.ts` (GraphQL type handlers)
- `src/lib/seo.ts` (metadata generators)
- `src/lib/navigation/applicationCategories.ts`
- `src/types/react-simple-maps.d.ts` (third-party type definitions)

**Senior Pattern 1: Generic Type Parameters**
```typescript
// ❌ Before
function processData(data: any) {
  return data.map((item: any) => item.id);
}

// ✅ After
function processData<T extends { id: string }>(data: T[]): string[] {
  return data.map((item) => item.id);
}
```

**Senior Pattern 2: Discriminated Unions**
```typescript
// ❌ Before
function handleResponse(response: any) {
  if (response.error) {
    // handle error
  }
}

// ✅ After
type SuccessResponse<T> = { success: true; data: T };
type ErrorResponse = { success: false; error: string };
type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

function handleResponse<T>(response: ApiResponse<T>) {
  if (response.success) {
    // TypeScript knows response.data exists
  } else {
    // TypeScript knows response.error exists
  }
}
```

**Senior Pattern 3: Unknown Instead of Any**
```typescript
// ❌ Before
function parseJSON(json: string): any {
  return JSON.parse(json);
}

// ✅ After
function parseJSON<T>(json: string): T {
  return JSON.parse(json) as T;
}
// OR for truly unknown data:
function parseJSON(json: string): unknown {
  const result = JSON.parse(json);
  // Force type guard validation before use
  return result;
}
```

#### Priority 4: JSDoc Documentation (⚠️ 50+ warnings)
**Rule:** `jsdoc/require-jsdoc`  
**Impact:** Reduced maintainability, poor developer onboarding, no IDE tooltips

**Senior Documentation Standard:**
```typescript
/**
 * Fetches product data from WordPress GraphQL API with caching.
 * 
 * @description
 * Implements ISR caching with tag-based revalidation for optimal
 * performance. Uses GET method for CDN caching via WPGraphQL Smart Cache.
 * 
 * @param {string} slug - Product slug (URL-safe identifier)
 * @param {string} [locale='en'] - i18n locale code (ISO 639-1)
 * @returns {Promise<Product | null>} Product data or null if not found
 * 
 * @throws {ProductNotFoundError} If product doesn't exist
 * @throws {GraphQLError} If API request fails
 * 
 * @example
 * ```typescript
 * const product = await fetchProduct('wireless-temp-sensor', 'en');
 * if (product) {
 *   console.log(product.name); // "Wireless Temperature Sensor"
 * }
 * ```
 * 
 * @see {@link https://docs.bapi.com/api/products | Product API Docs}
 * @since 2.0.0
 */
export async function fetchProduct(
  slug: string,
  locale: string = 'en'
): Promise<Product | null> {
  // Implementation
}
```

**Required JSDoc Elements:**
- `@description` - Detailed explanation with context
- `@param` - All parameters with types and descriptions
- `@returns` - Return type and meaning
- `@throws` - All possible exceptions
- `@example` - Working code example
- `@see` - Related documentation links
- `@since` - Version introduced

**Files Requiring JSDoc:**
- `src/pages/api/send-email.ts`
- `test/msw/fixtures.ts`
- `src/lib/logger.ts`
- All API route handlers
- All exported utility functions

#### Priority 5: React Hooks Compliance (🔴 Moderate errors)
**Rule:** `react-hooks/exhaustive-deps`, `react-hooks/rules-of-hooks`  
**Impact:** Infinite loops, stale closures, memory leaks, cascading renders

**Senior Pattern 1: Exhaustive Dependencies**
```typescript
// ❌ Before
useEffect(() => {
  setState(computeValue(prop));
}, []); // Missing 'prop' dependency

// ✅ After
useEffect(() => {
  setState(computeValue(prop));
}, [prop]); // All dependencies included
```

**Senior Pattern 2: Memoized Callbacks**
```typescript
// ❌ Before
useEffect(() => {
  const fetchData = async () => {
    const result = await api.fetch(id);
    setData(result);
  };
  fetchData();
}, [id]); // Missing fetchData causes lint warning

// ✅ Senior Pattern: useCallback for stable reference
const fetchData = useCallback(async () => {
  const result = await api.fetch(id);
  setData(result);
}, [id]);

useEffect(() => {
  fetchData();
}, [fetchData]);
```

**Senior Pattern 3: Ref for Non-Reactive Values**
```typescript
// ❌ Before
function Component({ onChange }: Props) {
  useEffect(() => {
    // Runs on every render if onChange changes
    const handler = () => onChange(data);
    element.addEventListener('click', handler);
    return () => element.removeEventListener('click', handler);
  }, [onChange, data]);
}

// ✅ Senior Pattern: useRef for callbacks
function Component({ onChange }: Props) {
  const onChangeRef = useRef(onChange);
  
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);
  
  useEffect(() => {
    const handler = () => onChangeRef.current(data);
    element.addEventListener('click', handler);
    return () => element.removeEventListener('click', handler);
  }, [data]); // Only re-run when data changes
}
```

---

## Implementation Phases

### Phase 1: Automated Safe Fixes (2-3 hours)
**Status:** 🟡 IN PROGRESS

1. **Run ESLint Auto-Fix**
   ```bash
   pnpm run lint --fix
   ```
   ✅ Result: 0 auto-fixable issues (all require manual intervention)

2. **Bulk Next.js Link Replacement** (VSCode Find/Replace with Regex)
   - Pattern: `<a href="(/[^"]+)"`
   - Replace: `<Link href="$1"`
   - Manual verification for external links
   - Add imports: `import Link from 'next/link';`

3. **Bulk Entity Escaping** (VSCode Find/Replace)
   - Find: `>([^<]*)'([^<]*)<`
   - Replace: `>$1&apos;$2<`
   - Verify in preview mode

### Phase 2: TypeScript Type Safety (3-4 hours)
**Status:** ⏸️ NOT STARTED

1. **wordpress.ts Refactor**
   - Create proper GraphQL response types
   - Implement type guards for API responses
   - Replace all `any` with generic types

2. **SEO & Metadata Types**
   - Define OpenGraph interfaces
   - Create structured data types
   - Type all metadata generators

3. **react-simple-maps.d.ts Cleanup**
   - Import official @types if available
   - Define proper prop interfaces
   - Use TypeScript utility types

### Phase 3: JSDoc Documentation (2-3 hours)
**Status:** ⏸️ NOT STARTED

1. **API Routes Documentation**
   - Complete JSDoc for all route handlers
   - Include request/response examples
   - Document error codes

2. **Test Fixtures Documentation**
   - Document mock data structures
   - Add usage examples
   - Link to actual test files

3. **Utility Functions**
   - Document all exported functions
   - Include complexity warnings
   - Add performance notes

### Phase 4: React Hooks Optimization (2-3 hours)
**Status:** ⏸️ NOT STARTED

1. **Product Filtering Components**
   - Fix useEffect dependencies
   - Implement useCallback for handlers
   - Add useMemo for expensive computations

2. **State Management Review**
   - Audit cascading setState calls
   - Optimize re-render triggers
   - Implement React.memo where appropriate

---

## Quality Gates

### Before Committing
- [ ] All 353 errors resolved
- [ ] Warning count < 100 (from 723)
- [ ] `pnpm run lint` passes with 0 errors
- [ ] `pnpm test:ci` maintains 100% pass rate
- [ ] `pnpm run build` succeeds

### Code Review Checklist
- [ ] All Next.js Links preserve locale routing
- [ ] External links use `<a>` with proper security attributes
- [ ] No XSS vulnerabilities introduced
- [ ] TypeScript types accurate and well-documented
- [ ] JSDoc follows enterprise standard
- [ ] React Hooks follow official best practices
- [ ] No performance regressions

### Testing Requirements
- [ ] Manual navigation testing across all locales
- [ ] Verify cart state preserved during routing
- [ ] Test all CTAs and mega menu links
- [ ] Validate all forms still submit correctly
- [ ] Check mobile navigation functionality

---

## Success Metrics

| Metric | Before | Target | Current |
|--------|--------|--------|---------|
| Total Problems | 1,076 | 0-50 | 1,076 |
| Errors | 353 | 0 | 353 |
| Warnings | 723 | 0-50 | 723 |
| `any` Types | ~100 | 0 | ~100 |
| Missing JSDoc | ~50 | 0 | ~50 |
| Build Time | 7.7s | ≤8s | 7.7s |
| Test Pass Rate | 100% | 100% | 100% |

---

## Risk Mitigation

### High Risk: Navigation Breaking Changes
- **Mitigation:** Test all navigation after each batch of Link conversions
- **Rollback Plan:** Git revert specific commits if issues found
- **Validation:** Run full manual navigation test suite

### Medium Risk: Type Safety Breaking Existing Code
- **Mitigation:** Make changes incrementally with builds between changes
- **Validation:** Run `pnpm run build` after each file
- **Rollback Plan:** Revert to `any` types temporarily if blocking

### Low Risk: JSDoc Comment Errors
- **Mitigation:** Use IDE JSDoc validation before committing
- **Validation:** ESLint JSDoc plugin catches syntax errors
- **Rollback Plan:** Fix JSDoc syntax without reverting code

---

## Progress Tracking

### Session 1 - February 17, 2026
- [x] Branch created: `refactor/eslint-senior-code-quality`
- [x] Implementation plan documented
- [x] ESLint baseline established: 1,076 problems
- [x] Auto-fix attempted: 0 changes (all manual)
- [ ] Phase 1 in progress: Next.js Link conversion
- [ ] Commit checkpoint 1: Link conversions
- [ ] Commit checkpoint 2: Entity escaping
- [ ] Phase 2: TypeScript types
- [ ] Phase 3: JSDoc documentation
- [ ] Phase 4: React Hooks optimization
- [ ] Final validation & merge to main

---

## Related Documentation
- [CODEBASE-REVIEW-FEB17-2026.md](./CODEBASE-REVIEW-FEB17-2026.md)
- [CODING_STANDARDS.md](../web/CODING_STANDARDS.md)
- [ERROR_HANDLING.md](../web/ERROR_HANDLING.md)
- [Next.js Best Practices](https://nextjs.org/docs/pages/building-your-application/routing/linking-and-navigating)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [React Hooks Rules](https://react.dev/reference/rules/rules-of-hooks)
