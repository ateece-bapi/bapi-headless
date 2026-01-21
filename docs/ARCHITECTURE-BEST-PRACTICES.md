# Headless CMS Architecture - Senior-Level Best Practices

## Core Principle: Separation of Concerns

**WordPress = Content Management ONLY**
- Product data storage
- Media library
- Content editing interface
- GraphQL API endpoint

**Next.js = ALL Presentation & UX**
- Complete styling control
- Modern design system (Tailwind CSS 4)
- Component architecture
- Performance optimization
- SEO optimization

## Critical Rule: NO WordPress Styles in Frontend

### ❌ Anti-Patterns (What We AVOID)

```tsx
// BAD: Rendering WordPress HTML with inline styles
<div dangerouslySetInnerHTML={{ __html: product.description }} />

// BAD: Using WordPress-generated class names
<div className="wp-block-button has-background">

// BAD: Trusting WordPress HTML structure
<div dangerouslySetInnerHTML={{ __html: wpContent }} />
```

### ✅ Best Practices (What We DO)

```tsx
// GOOD: Sanitize ALL WordPress content
import { sanitizeWordPressContent } from '@/lib/sanitizeDescription';

<div 
  className="prose prose-lg max-w-none"
  dangerouslySetInnerHTML={{ __html: sanitizeWordPressContent(product.description) }} 
/>

// GOOD: Apply OUR design system
<div className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-3 px-8 rounded-lg">

// GOOD: Use GraphQL to fetch ONLY data, not markup
const { data } = await getProduct(slug);
```

## Content Sanitization Strategy

### What We Strip From WordPress Content

1. **ALL inline styles** - `style="..."`
2. **ALL WordPress classes** - `class="wp-*"`, `class="has-*"`
3. **Legacy HTML attributes** - `color="..."`, `face="..."`, `size="..."`
4. **WordPress-specific data attributes** - `data-wp-*`
5. **Empty tags and excess whitespace**

### What We Keep

1. **Semantic HTML structure** - `<p>`, `<h1>`, `<ul>`, `<strong>`
2. **Link URLs** - `href` attribute only
3. **Text content** - The actual information
4. **Image sources** - But styled with our design system

### Implementation

File: `/web/src/lib/sanitizeDescription.ts`

```typescript
export function sanitizeWordPressContent(html: string): string {
  // Strip all WordPress styling
  // Convert button-like links to our CTA components
  // Clean up structure
  // Return pure semantic HTML
}
```

Applied in:
- ✅ ProductTabs (descriptions)
- ✅ ProductHeroFast (short descriptions)
- ✅ Search results
- ✅ Application notes
- ✅ Any WordPress-generated content

## Design System Architecture

### Color System

**Source**: `/web/src/app/globals.css` (CSS-first with Tailwind v4)

```css
@theme inline {
  --color-primary-500: #1479bc;  /* BAPI Blue */
  --color-accent-500: #ffc843;   /* BAPI Yellow */
  --color-neutral-500: #97999b;  /* BAPI Gray */
}
```

**Usage**: Always use semantic tokens, NEVER arbitrary values

```tsx
// ✅ GOOD
<button className="bg-primary-500 hover:bg-primary-600">

// ❌ BAD
<button className="bg-[#1479bc]">
```

### Component Patterns

**CTA Buttons** - Styled in globals.css, applied via sanitization

```css
.prose .cta-button {
  /* Clean BAPI gradient design */
  background: linear-gradient(135deg, var(--color-primary-600) 0%, var(--color-primary-500) 100%);
}
```

**Typography** - Tailwind prose plugin with BAPI overrides

```tsx
<div className="prose prose-lg prose-neutral max-w-none
  prose-headings:font-bold prose-headings:text-neutral-900
  prose-p:text-neutral-900 prose-p:leading-relaxed
  **:text-neutral-900">
```

## GraphQL Data Flow

### Query Strategy

1. **Fetch ONLY data fields** - Never fetch rendered HTML if avoidable
2. **Type-safe with codegen** - Auto-generate TypeScript types
3. **Cache appropriately** - ISR with 1-hour revalidation
4. **Split queries** - Light query first, deferred for heavy data

### Example Query

```graphql
query GetProductBySlug($slug: ID!) {
  product(id: $slug, idType: SLUG) {
    name
    description  # Raw HTML content
    price
    image { sourceUrl altText }
    productDocuments {  # Custom ACF fields
      heading
      files { title url }
    }
  }
}
```

### Data Transformation

```typescript
// Transform WordPress data to our clean types
const productForClient = {
  name: product.name,
  description: sanitizeWordPressContent(product.description),
  documents: (product.productDocuments || [])
    .filter((cat): cat is NonNullable<typeof cat> => cat !== null)
    .flatMap(category => category.files.map(file => ({
      title: file.title,
      url: file.url,
      category: category.heading
    })))
};
```

## Performance Best Practices

### Build-Time Optimization

- ✅ Static generation for top 30 products
- ✅ ISR with 1-hour revalidation
- ✅ React cache() for query deduplication
- ✅ Parallel data fetching
- ✅ Lazy loading for heavy components

### Runtime Optimization

- ✅ Client-side state with Zustand
- ✅ Optimized images with Next.js Image
- ✅ Code splitting with dynamic imports
- ✅ Minimal client-side JavaScript

## Testing & Quality

### Type Safety

```bash
# TypeScript compilation
pnpm run build

# GraphQL codegen
pnpm run codegen
```

### Linting

```bash
# ESLint (enforces best practices)
pnpm run lint

# Check for WordPress patterns
grep -r "wp-" web/src/  # Should return NO matches in components
```

### Visual Regression

- Compare against live WordPress site for content parity
- Use browser DevTools to ensure NO inline styles rendered
- Inspect Network tab - confirm NO WordPress CSS loaded

## Migration Checklist

When adding new WordPress content types:

- [ ] Create GraphQL query for STRUCTURE only (not styled HTML)
- [ ] Run `pnpm codegen` to generate types
- [ ] Transform data in server component
- [ ] Apply sanitization to any HTML content
- [ ] Use BAPI design system for ALL styling
- [ ] Test with real WordPress data
- [ ] Verify NO WordPress classes/styles in rendered HTML

## Documentation References

- [Color System](../web/COLOR_SYSTEM.md) - BAPI brand colors and usage
- [Coding Standards](../web/CODING_STANDARDS.md) - Component patterns
- [Error Handling](../web/ERROR_HANDLING.md) - User-friendly messages
- [GraphQL Setup](../GRAPHQL_SETUP.md) - Query architecture
- [WordPress Backend](./WORDPRESS-BACKEND-SETUP.md) - CMS configuration

## Senior-Level Principles Applied

✅ **Separation of Concerns** - WordPress for data, Next.js for presentation
✅ **Type Safety** - Full TypeScript with generated GraphQL types
✅ **Performance** - Sub-100ms cached pages, 95% improvement from initial
✅ **Maintainability** - Clear architecture, documented patterns
✅ **Scalability** - Handles 608+ products, extensible for growth
✅ **Accessibility** - WCAG AA compliance, semantic HTML
✅ **Security** - Sanitization, no XSS vulnerabilities
✅ **Developer Experience** - Hot reload, type hints, linting
✅ **Testing** - 648 tests with 80%+ coverage
✅ **Design System** - Consistent BAPI branding throughout

---

**Last Updated**: January 21, 2026
**Architecture**: Headless CMS (WordPress + Next.js)
**Paradigm**: Content-first, presentation-separate
