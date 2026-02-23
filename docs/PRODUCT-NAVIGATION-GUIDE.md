# Product Navigation System - Developer Guide

**Status:** ✅ Phase 1 Complete (90%)  
**Last Updated:** February 23, 2026  
**Branch:** `feature/product-navigation-breadcrumbs`

## Overview

The Product Navigation system provides a comprehensive filtering, sorting, and breadcrumb navigation experience for the BAPI e-commerce platform. This guide covers architecture, implementation details, and usage patterns.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Breadcrumb Navigation](#breadcrumb-navigation)
3. [Product Filtering](#product-filtering)
4. [Performance Optimizations](#performance-optimizations)
5. [Analytics & Monitoring](#analytics--monitoring)
6. [Testing](#testing)
7. [Troubleshooting](#troubleshooting)

---

## Architecture Overview

### Component Hierarchy

```
Page Components (Server)
├── categories/[slug]/page.tsx
├── products/[category]/[subcategory]/page.tsx
└── product/[slug]/page.tsx

Navigation Utilities
├── lib/navigation/breadcrumbs.ts (195 lines)
│   ├── getCategoryBreadcrumbs()
│   ├── getSubcategoryBreadcrumbs()
│   ├── getProductBreadcrumbs()
│   ├── getSearchBreadcrumbs()
│   └── breadcrumbsToSchemaOrg()

Filter Components (Client)
├── components/products/ProductFilters.tsx (295 lines)
├── components/products/FilteredProductGrid.tsx (260 lines)
├── components/products/ProductSortDropdown.tsx (206 lines)
├── components/products/MobileFilterButton.tsx (61 lines)
└── components/products/MobileFilterDrawer.tsx
```

### Data Flow

```
Server Component (Category Page)
  ↓
Fetch products via GraphQL
  ↓
Pass to Client Components
  ↓
ProductFilters ← → URL SearchParams ← → FilteredProductGrid
  ↓                                        ↓
Update filters (debounced 300ms)    Apply filters (useMemo)
  ↓                                        ↓
Router.push (no scroll)              ProductGrid + Pagination
```

---

## Breadcrumb Navigation

### Features

✅ **SEO-Optimized**: Schema.org BreadcrumbList structured data  
✅ **Accessible**: WCAG 2.1 AA compliant with aria-labels  
✅ **i18n Ready**: Supports all 11 locales  
✅ **Visual Polish**: ChevronRight icons, gradient hover effects  

### Implementation

#### 1. Category Breadcrumbs

```typescript
import { getCategoryBreadcrumbs, breadcrumbsToSchemaOrg } from '@/lib/navigation/breadcrumbs';

// In your server component
const breadcrumbs = getCategoryBreadcrumbs(
  categoryName,
  categorySlug,
  { locale, includeHome: false }
);

// Add translated labels
const translatedBreadcrumbs = [
  { label: t('breadcrumb.home'), href: `/${locale}` },
  { label: t('breadcrumb.products'), href: `/${locale}/products` },
  { label: categoryName },
];

// Generate Schema.org data
const schema = breadcrumbsToSchemaOrg(translatedBreadcrumbs, siteUrl);

// Render
<Breadcrumbs items={translatedBreadcrumbs} schema={schema} />
```

#### 2. Product Breadcrumbs

```typescript
import { getProductBreadcrumbs } from '@/lib/navigation/breadcrumbs';

// Full hierarchy: Home → Products → Category → Subcategory → Product
const breadcrumbs = getProductBreadcrumbs(
  parentCategoryName,
  parentCategorySlug,
  subcategoryName,
  subcategorySlug,
  productName,
  productSlug,
  { locale }
);
```

### Schema.org Output

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://bapi.com/en"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Products",
      "item": "https://bapi.com/en/products"
    }
  ]
}
```

---

## Product Filtering

### Supported Taxonomies (15 total)

The filter system supports 15 product attribute taxonomies:

| Filter Key | GraphQL Field | Display Name |
|-----------|---------------|--------------|
| `application` | `allPaApplication` | Application |
| `roomEnclosure` | `allPaRoomEnclosureStyle` | Temperature Room Enclosure Style |
| `sensorOutput` | `allPaTemperatureSensorOutput` | Sensor Output |
| `display` | `allPaDisplay` | Display |
| `setpointOverride` | `allPaTempSetpointAndOverride` | Temp Setpoint and Override |
| `optionalTempHumidity` | `allPaOptionalTempHumidity` | Optional Temp & Humidity |
| `optionalSensorOutput` | `allPaOptionalTempSensorOutput` | Optional Input Sensor & Output |
| `humidityApplication` | `allPaHumidityApplication` | Humidity Application |
| `humidityRoomEnclosure` | `allPaHumidityRoomEnclosure` | Humidity Room Enclosure |
| `humiditySensorOutput` | `allPaHumiditySensorOutput` | Humidity Sensor Output |
| `pressureApplication` | `allPaPressureApplication` | Pressure Application |
| `pressureSensorStyle` | `allPaPressureSensorStyle` | Pressure Sensor Style |
| `airQualityApplication` | `allPaAirQualityApplication` | Air Quality Application |
| `airQualitySensorType` | `allPaAirQualitySensorType` | Air Quality Sensor Type |
| `wirelessApplication` | `allPaWirelessApplication` | Wireless Application |

### URL Structure

Filters are stored in URL search parameters:

```
/en/products/temperature-sensors/room-sensors?
  application=hvac,industrial&
  display=lcd&
  sort=price-asc&
  page=2
```

### Filter Logic

**AND between categories, OR within category:**

```typescript
// User selects: application=hvac,industrial + display=lcd
// Result: Products with (HVAC OR Industrial) AND LCD Display
```

### Component Usage

#### Category Page

```typescript
// Server Component
export default async function CategoryPage({ params, searchParams }) {
  const { slug, locale } = await params;
  const filters = await searchParams;
  
  // Fetch products when no subcategories
  if (!hasSubcategories) {
    const products = await fetchProducts(slug);
    
    return (
      <div>
        <ProductFilters 
          categorySlug={slug} 
          products={products} 
          currentFilters={filters} 
        />
        <FilteredProductGrid products={products} locale={locale} />
        <MobileFilterButton 
          categorySlug={slug} 
          products={products} 
          currentFilters={filters} 
        />
      </div>
    );
  }
}
```

### Sort Options

```typescript
const sortOptions = [
  { value: 'default', label: 'Featured' },
  { value: 'name-asc', label: 'Name: A-Z' },
  { value: 'name-desc', label: 'Name: Z-A' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest First' }
];
```

### Pagination

- **Products per page:** 18
- **URL parameter:** `?page=2`
- **Reset on filter:** Automatically returns to page 1 when filters change

---

## Performance Optimizations

### 1. Debounced URL Updates (300ms)

Prevents excessive browser history entries when users rapidly click filters:

```typescript
const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

const handleFilterChange = useCallback((filterType, value, checked) => {
  // Clear existing timeout
  if (updateTimeoutRef.current) {
    clearTimeout(updateTimeoutRef.current);
  }
  
  // Debounce URL update
  updateTimeoutRef.current = setTimeout(() => {
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, 300);
}, []);
```

### 2. useMemo for Filtering

All filtering logic uses `useMemo` for synchronous, optimized rendering:

```typescript
const filteredProducts = useMemo(() => {
  if (!hasActiveFilters) return products;
  
  return products.filter((product) => {
    // Filter logic here
  });
}, [products, hasActiveFilters, activeFilters]);
```

### 3. GraphQL Optimization

- **Batch queries:** Fetch category + products in single request
- **Cache tags:** `['products']`, `['category-{slug}']` for revalidation
- **GET method:** Enables CDN caching with Smart Cache

### 4. Build Performance

```bash
# Production build metrics
✓ Compiled successfully in 8.7s
✓ Generating static pages (771/771) in 42s
```

---

## Analytics & Monitoring

### Sentry Breadcrumbs

Filter usage is automatically tracked via Sentry:

```typescript
Sentry.addBreadcrumb({
  category: 'product-filter',
  message: 'Filter applied',
  level: 'info',
  data: {
    activeFilters: ['application', 'display'],
    filterCount: 2,
    resultCount: 45,
    sortBy: 'price-asc'
  }
});
```

### Metrics Tracked

- **Filter combinations:** Which filters are used together
- **Result counts:** How many products match filters
- **Sort preferences:** User sorting behavior
- **Empty results:** Filter combinations with no matches

### Viewing Analytics

1. **Sentry Dashboard:** Performance → Breadcrumbs → Filter by `product-filter`
2. **Filter popular combinations:** Identify most-used filter sets
3. **Empty state tracking:** Find filter combos that need product additions

---

## Testing

### Manual Test Scenarios

#### Desktop Filters

1. Navigate to `/en/categories/[slug]` (category with no subcategories)
2. Verify filter sidebar appears on left
3. Click multiple filters in same category → Should OR them
4. Click filters in different categories → Should AND them
5. Verify product count updates
6. Verify URL updates with 300ms debounce
7. Click "Clear All" → Should reset to all products

#### Mobile Filters

1. Resize browser to mobile viewport (<1024px)
2. Verify fixed bottom filter button appears
3. Click button → Drawer slides up from bottom
4. Apply filters → Drawer closes, products update
5. Verify badge shows active filter count

#### Sorting

1. Click sort dropdown
2. Select "Price: Low to High"
3. Verify products reorder
4. Verify URL updates with `?sort=price-asc`

#### Pagination

1. Apply filters to get >18 products
2. Verify pagination appears
3. Click page 2
4. Verify URL updates with `?page=2`
5. Change filter → Should reset to page 1

#### Breadcrumbs

1. Navigate product hierarchy
2. Verify breadcrumb trail updates at each level
3. Click breadcrumb link → Should navigate correctly
4. View page source → Verify Schema.org JSON-LD present

### Automated Testing

```bash
# Run filter tests
cd web
pnpm test ProductFilters
pnpm test FilteredProductGrid

# Visual regression (Chromatic)
pnpm run chromatic
```

---

## Troubleshooting

### Issue: Filters not applying

**Symptoms:** Clicking filters doesn't update products  
**Cause:** searchParams not passed to components  
**Fix:** Ensure page has `searchParams` prop:

```typescript
interface PageProps {
  params: Promise<{ slug: string; locale: string }>;
  searchParams: Promise<Record<string, string | undefined>>;  // ← Required!
}
```

### Issue: URL updates too fast

**Symptoms:** Browser history cluttered, performance issues  
**Cause:** Missing debounce  
**Fix:** Verify `updateTimeoutRef` in ProductFilters (should be 300ms)

### Issue: Schema.org validation errors

**Symptoms:** Google Rich Results test fails  
**Cause:** Missing literal types (`as const`)  
**Fix:** Ensure `breadcrumbsToSchemaOrg` uses `as const`:

```typescript
return {
  '@context': 'https://schema.org' as const,
  '@type': 'BreadcrumbList' as const,
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem' as const,  // ← Required!
    // ...
  }))
};
```

### Issue: Filters missing on category page

**Symptoms:** Category shows subcategories instead of products  
**Cause:** Category has subcategories (expected behavior)  
**Fix:** Only leaf categories (no children) show product grid with filters

### Issue: Analytics not tracking

**Symptoms:** No filter breadcrumbs in Sentry  
**Cause:** Sentry not initialized  
**Fix:** Verify `SENTRY_DSN` in environment variables

---

## Phase 1 Completion Status

| Feature | Status | Notes |
|---------|--------|-------|
| Breadcrumb Navigation | ✅ 100% | Schema.org, i18n, 4 page types |
| Category Page Refinement | ✅ 100% | Product grid for leaf categories |
| Filter Infrastructure | ✅ 100% | 15 taxonomies, debouncing |
| Sort Options | ✅ 100% | 6 options with URL state |
| Pagination | ✅ 100% | 18 per page, URL state |
| Mobile UX | ✅ 100% | Drawer, fixed button, badges |
| Analytics | ✅ 100% | Sentry breadcrumbs |
| Empty State | ✅ 100% | Helpful suggestions |
| Documentation | ✅ 100% | This guide |

**Overall: 90% Complete** (remaining: cross-browser testing, production validation)

---

## Next Steps

### Phase 1 Completion (0.5-1 day)

- [ ] Cross-browser testing (Safari, Firefox, Edge)
- [ ] Accessibility audit with screen reader
- [ ] Performance profiling in production
- [ ] Filter analytics review (1 week after launch)

### Phase 2 Enhancements

- [ ] ApplicationCategories filtering (line 304)
- [ ] Advanced filter UI (sliders for ranges)
- [ ] Filter presets ("Popular Filters")
- [ ] Recently viewed filters
- [ ] Filter export/share (URL shortener)

---

## Related Documentation

- [README.md](../README.md) - Project overview
- [GRAPHQL_SETUP.md](../GRAPHQL_SETUP.md) - GraphQL queries
- [web/CODING_STANDARDS.md](../web/CODING_STANDARDS.md) - Code style
- [TODO.md](./TODO.md) - Project roadmap

---

**Questions?** Contact the development team or see [DAILY-LOG.md](./DAILY-LOG.md) for recent changes.
