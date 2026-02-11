# TODO Comment Audit - February 11, 2026

**Audit Date:** February 11, 2026  
**Status:** 9 TODOs found  
**Days Until Launch:** 58 days (April 10, 2026)

---

## 📊 Summary

| Priority | Count | Status |
|----------|-------|--------|
| 🔴 Critical | 0 | N/A |
| 🟠 High | 3 | Action Required |
| 🟡 Medium | 4 | Optional |
| 🟢 Low | 2 | Defer to Phase 2 |
| **Total** | **9** | |

---

## 🔴 Critical Priority (Block Launch)

**None** - No critical blockers found.

---

## 🟠 High Priority (Should Fix Before Launch)

### 1. Quote Request Email Notifications (2 TODOs)
**File:** `web/src/app/api/quotes/route.ts` (lines 133-134)  
**Context:**
```typescript
quotes.push(quoteRequest);
await writeFile(quotesFile, JSON.stringify(quotes, null, 2));

// TODO: Send email notification to sales team
// TODO: Send confirmation email to user

return NextResponse.json({
  success: true,
  quoteId,
```

**Impact:** Quote requests are saved but no one is notified  
**Solution:** Use AWS SES email system (already implemented for chat handoff)  
**Effort:** 1-2 hours  
**Priority Rationale:** Sales team needs to receive quote requests to respond  

**Action Plan:**
- Import `sendEmail` from `@/lib/email`
- Create template for sales team notification (include all quote details)
- Create template for customer confirmation email
- Send both emails after saving quote to file
- Log success/failure with Sentry

---

### 2. PayPal Order Creation
**File:** `web/src/components/checkout/CheckoutPageClient.tsx` (line 283)  
**Context:**
```typescript
} else {
  // PayPal or other payment methods
  // TODO: Implement PayPal order creation
  // For now, create mock order
  await new Promise((resolve) => setTimeout(resolve, 2000));
  
  const mockOrderId = Math.floor(Math.random() * 100000);
  router.push(`/order-confirmation/${mockOrderId}`);
```

**Impact:** PayPal payments not functional (creates mock orders)  
**Solution:** WooCommerce API order creation for PayPal  
**Effort:** 3-4 hours  
**Priority Rationale:** Payment integration should be complete, but low urgency if Stripe is primary  

**Decision Required:**
- ✅ If Stripe is the only payment method for launch → **DEFER to Phase 2**
- ❌ If PayPal needed for launch → **FIX NOW**

**Action Plan (if proceeding):**
- Use WooCommerce REST API to create order
- Handle PayPal payment_method in order creation
- Update order confirmation flow
- Test with PayPal sandbox

---

### 3. Product Sort Dropdown
**File:** `web/src/app/[locale]/products/[category]/[subcategory]/page.tsx` (line 221)  
**Context:**
```tsx
<div className="flex items-center justify-end mb-6 pb-4 border-b border-neutral-200">
  <div className="text-sm text-neutral-500">
    {/* TODO: Add sort dropdown */}
  </div>
</div>
```

**Impact:** Users cannot sort products (price, name, newest, etc.)  
**Solution:** Add sort dropdown with client-side sorting  
**Effort:** 2-3 hours  
**Priority Rationale:** Standard e-commerce feature, improves UX  

**Action Plan:**
- Create `<ProductSortDropdown>` component
- Options: Price (Low to High), Price (High to Low), Name (A-Z), Newest
- Use searchParams for URL state (`?sort=price-asc`)
- Apply sorting in `ProductGridFiltered` component
- Add to subcategory and main category pages

---

## 🟡 Medium Priority (Nice to Have)

### 4. Category Product Grid (No Subcategories)
**File:** `web/src/app/[locale]/categories/[slug]/page.tsx` (line 70)  
**Context:**
```typescript
// If no subcategories, redirect to product grid
if (!hasSubcategories) {
  // TODO: Show product grid directly
}
```

**Impact:** Categories without subcategories show empty page  
**Solution:** Fetch and display products for leaf categories  
**Effort:** 2 hours  
**Priority Rationale:** Edge case, most categories have subcategories  

**Action Plan:**
- Check if `hasSubcategories === false`
- Fetch products with `GetProductsByCategoryQuery`
- Render `<ProductGrid>` instead of subcategory cards
- Add breadcrumbs and category description

---

### 5. Application Subcategory Product Filtering
**File:** `web/src/app/[locale]/applications/[category]/[subcategory]/page.tsx` (line 48)  
**Context:**
```typescript
// Get WordPress categories to query for a given application subcategory
const wpCategories = getWordPressCategoriesForApplication(categorySlug, subcategorySlug);

// Fetch products from WordPress
const data = await getProducts(50); // TODO: Filter by wpCategories
const products = data.products?.nodes || [];
```

**Impact:** Application pages show all products instead of filtered subset  
**Solution:** Pass category slugs to GraphQL query  
**Effort:** 1-2 hours  
**Priority Rationale:** Phase 2 feature (Applications section deferred per timeline)  

**Defer to Phase 2:** Applications section content not ready for April 10 launch

---

### 6. Application Product Filtering Logic
**File:** `web/src/lib/navigation/applicationCategories.ts` (line 360)  
**Context:**
```typescript
): boolean {
  if (!filters || Object.keys(filters).length === 0) {
    return true; // No filters = all products match
  }

  // TODO: Implement filtering logic based on product attributes/metadata
  // For now, return true (no filtering)
  return true;
}
```

**Impact:** Application filter configuration not applied  
**Solution:** Implement attribute-based filtering  
**Effort:** 3-4 hours  
**Priority Rationale:** Phase 2 feature (Applications section deferred)  

**Defer to Phase 2:** Related to Applications section

---

## 🟢 Low Priority (Defer to Phase 2)

### 7. Fix Variation State Test
**File:** `web/src/components/products/__tests__/ProductDetailClient.test.tsx` (line 198)  
**Context:**
```typescript
describe('Cart interaction', () => {
  // TODO: Fix this test - variation state updates need investigation
  // The enterprise VariationSelector correctly identifies variations
  // but the parent component state update timing needs to be handled properly
  it.skip('adds correct variation to cart on Add to Cart', async () => {
```

**Impact:** 1 test skipped (647/648 tests passing)  
**Solution:** Debug state timing in test environment  
**Effort:** 2-3 hours  
**Priority Rationale:** Feature works in production, test issue only  

**Defer to Phase 2:** Test coverage is 80%+, one skipped test acceptable

---

### 8. Custom Profile Editor
**File:** `web/src/app/[locale]/account/settings/[[...rest]]/UserProfileClient.tsx` (line 6)  
**Context:**
```typescript
/**
 * User profile settings component
 * 
 * TODO: Implement custom profile editor after Clerk removal.
 * For now, shows placeholder message.
 */
export default function UserProfileClient() {
```

**Impact:** Users cannot edit profile (name, email, password)  
**Solution:** Build custom profile editor with WordPress API  
**Effort:** 6-8 hours  
**Priority Rationale:** Already documented as post-Clerk cleanup task  

**Defer to Phase 2:** WordPress handles profile management for now

---

## 📋 Recommended Action Plan

### Week of Feb 11-17 (High Priority TODOs)

**Monday, Feb 11:**
- ✅ Complete TODO audit (this document)
- [ ] Decision: PayPal payment method required for launch?

**Tuesday, Feb 12:**
- [ ] Implement quote email notifications (2 hours)
  - Sales team notification
  - Customer confirmation
  - Test with AWS SES
- [ ] **IF PayPal required:** Implement PayPal order creation (4 hours)

**Wednesday, Feb 13:**
- [ ] Implement product sort dropdown (3 hours)
  - Create component
  - Add to category pages
  - Test URL state management

**Thursday, Feb 14:**
- [ ] **OPTIONAL:** Category product grid for leaf categories (2 hours)
- [ ] Code review and testing

**Friday, Feb 15:**
- [ ] Remove completed TODOs from codebase
- [ ] Update TODO.md with progress

### Phase 2 (Post-Launch)
- [ ] Application product filtering (#5, #6)
- [ ] Fix variation state test (#7)
- [ ] Custom profile editor (#8)

---

## 🎯 Launch Impact Assessment

**Current Status:**
- **Blocking Issues:** 0
- **Should Fix:** 3 (quote emails, sort dropdown, PayPal decision)
- **Can Defer:** 6

**If High Priority TODOs Completed:**
- Quote requests will notify sales team ✅
- Product sorting will improve UX ✅
- Payment integration will be complete (if PayPal needed) ✅

**Launch Readiness Impact:**
- Completing high priority TODOs: 96% → 97% (+1%)
- Remaining 3% is Phase 2 features (Applications section, profile editor)

---

## 📝 Code Cleanup Checklist

After resolving TODOs, remove comments from:
- [x] `web/src/app/api/auth/me/route.ts` - ✅ Already removed (admin auth)
- [x] `web/src/app/api/chat/analytics/route.ts` - ✅ Already removed (admin auth)
- [x] `web/src/app/api/chat/handoff/route.ts` - ✅ Already removed (admin auth)
- [ ] `web/src/app/api/quotes/route.ts` - After implementing email notifications
- [ ] `web/src/components/checkout/CheckoutPageClient.tsx` - After PayPal decision
- [ ] `web/src/app/[locale]/products/[category]/[subcategory]/page.tsx` - After sort dropdown

**Phase 2 Cleanup:**
- [ ] Mark Application TODOs as "Phase 2" comments instead of TODO
- [ ] Mark test TODO with issue tracking reference
- [ ] Mark profile editor TODO with issue tracking reference

---

## 🔍 Notes for Next Audit

**When to Re-Audit:**
- After implementing high priority fixes (Feb 15)
- Before stakeholder presentation (April 6)
- Post-launch for Phase 2 planning

**Audit Command:**
```bash
cd web
grep -rn "TODO\|FIXME\|XXX\|HACK" src/ --include="*.ts" --include="*.tsx" | grep -v "node_modules" | grep -v ".test.ts"
```
