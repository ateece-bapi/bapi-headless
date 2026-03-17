# Category Pages - Modern Architecture Plan

**Branch:** `feature/category-product-grid-phase1`  
**Date:** March 16, 2026  
**Phase:** Phase 1 (Pre-Launch)  
**Target:** April 10, 2026 Go-Live

---

## Executive Summary

**Goal:** Build modern, conversion-optimized category pages that show products immediately with intelligent filtering, replacing the old multi-click subcategory navigation pattern.

**Key Improvements:**
- ✅ Show products on first click (reduce friction)
- ✅ Subcategories as filters, not navigation steps
- ✅ Better SEO (product content on category pages)
- ✅ Mobile-optimized filtering
- ✅ Higher conversion rates

---

## Current vs Modern Approach

### ❌ Current Production Site (www.bapihvac.com)

```
User Journey:
1. Click "Temperature Sensors" → See subcategory cards only
2. Click "Room" → See series/type cards only
3. Click "BAPI-Stat Quantum" → Finally see 5 products
4. Click product → Product detail page

= 4 CLICKS TO PURCHASE
```

**Problems:**
- Extra navigation clicks = lost conversions
- No products visible until deep into hierarchy
- Poor mobile UX (lots of drilling)
- Minimal SEO value (category pages = just links)

### ✅ Modern Headless Approach

```
User Journey:
1. Click "Temperature Sensors" → See ALL 115 products + filters
2. (Optional) Filter by "Room" → 30 products
3. (Optional) Filter by "Quantum Series" → 5 products
4. Click product → Product detail page

= 2 CLICKS TO PURCHASE (50% reduction)
```

**Benefits:**
- Immediate value: Products visible on first click
- Power users can filter down
- Casual browsers see full selection
- SEO-rich pages with real product content
- Mobile-friendly (filters collapse)

---

## Architecture Overview

### URL Strategy

```
ROUTES (Next.js App Router):
/products                           → All products landing page
/products/[category]                → Category page with products + filters
/products/[category]/[subcategory]  → Optional: Subcategory with pre-filtered products
/products/[slug]                    → Individual product page

EXAMPLES:
/products/temperature-sensors       → 115 products, filterable by Room/Non-Room
/products/temperature-sensors/temp-room  → 30 Room products, filterable by series
/products/ba10k-2-duct-sensor       → Product detail
```

### Component Hierarchy

```
CategoryPage (Server Component)
├── CategoryHero (Server Component)
│   ├── Title: "Temperature Sensors"
│   ├── Description
│   ├── Image/Icon
│   └── Breadcrumb Navigation
│
├── SubcategoryQuickFilter (Client Component)
│   ├── Pill: "Room (30)"
│   ├── Pill: "Non-Room (85)"
│   └── Active state management
│
└── CategoryContent (Client Component - handles filtering state)
    ├── FilterSidebar (Client Component)
    │   ├── SubcategoryFilter (Room/Non-Room)
    │   ├── ApplicationFilter (pa_application)
    │   ├── EnclosureFilter (pa_room-enclosure-style)
    │   ├── OutputFilter (pa_temperature-sensor-output)
    │   ├── DisplayFilter (pa_display)
    │   └── ClearFiltersButton
    │
    └── ProductGridSection (Client Component)
        ├── ResultsHeader
        │   ├── Count: "Showing 30 of 115 products"
        │   ├── SortDropdown (Price, Name, Newest)
        │   └── ViewToggle (Grid/List)
        ├── ProductGrid
        │   ├── ProductCard × N
        │   └── LoadingState
        └── Pagination (if needed)
```

---

## Component Specifications

### 1. CategoryPage (Server Component)

**File:** `web/src/app/[locale]/products/[category]/page.tsx`

**Responsibilities:**
- Fetch category data via GraphQL
- Fetch ALL products in category (server-side)
- Fetch subcategories (children)
- Fetch product attributes for filters
- Generate metadata for SEO
- Pass data to client components

**GraphQL Queries:**
```graphql
GetProductCategoryWithChildren($slug: ID!)
GetProductsByCategory($categorySlug: String!, $first: Int = 200)
GetProductAttributes() // For filter options
```

**Server Component Code:**
```typescript
// web/src/app/[locale]/products/[category]/page.tsx
import { getGraphQLClient } from '@/lib/graphql/client';
import { 
  GetProductCategoryWithChildrenDocument,
  GetProductsByCategoryDocument,
  GetProductAttributesDocument 
} from '@/lib/graphql/generated';
import CategoryHero from '@/components/category/CategoryHero';
import CategoryContent from '@/components/category/CategoryContent';

export async function generateMetadata({ params }) {
  const client = getGraphQLClient(['categories']);
  const { data } = await client.query({
    query: GetProductCategoryWithChildrenDocument,
    variables: { slug: params.category }
  });
  
  return {
    title: `${data.productCategory.name} | BAPI`,
    description: data.productCategory.description,
    // ... OpenGraph, etc.
  };
}

export default async function CategoryPage({ params, searchParams }) {
  const { locale, category } = params;
  const client = getGraphQLClient(['categories', `category-${category}`]);
  
  // Parallel data fetching
  const [categoryData, productsData, attributesData] = await Promise.all([
    client.query({
      query: GetProductCategoryWithChildrenDocument,
      variables: { slug: category }
    }),
    client.query({
      query: GetProductsByCategoryDocument,
      variables: { categorySlug: category, first: 200 }
    }),
    client.query({
      query: GetProductAttributesDocument,
      variables: { taxonomy: category } // Filter attributes by category
    })
  ]);
  
  const categoryInfo = categoryData.data.productCategory;
  const subcategories = categoryInfo.children?.nodes || [];
  const allProducts = productsData.data.products.nodes;
  const filters = attributesData.data;
  
  return (
    <div className="category-page">
      <CategoryHero 
        category={categoryInfo}
        breadcrumbs={generateBreadcrumbs(categoryInfo, locale)}
      />
      
      <CategoryContent
        category={categoryInfo}
        subcategories={subcategories}
        products={allProducts}
        filters={filters}
        locale={locale}
      />
    </div>
  );
}
```

---

### 2. CategoryHero (Server Component)

**File:** `web/src/components/category/CategoryHero.tsx`

**Props:**
```typescript
interface CategoryHeroProps {
  category: {
    name: string;
    description: string;
    image?: { sourceUrl: string; altText: string };
    count: number;
  };
  breadcrumbs: BreadcrumbItem[];
}
```

**UI Structure:**
```tsx
<section className="bg-gradient-to-r from-primary-50 to-white py-12">
  <div className="container">
    <Breadcrumbs items={breadcrumbs} />
    
    <div className="grid grid-cols-12 gap-8 mt-6">
      <div className="col-span-8">
        <h1 className="text-4xl font-bold text-neutral-900">
          {category.name}
        </h1>
        <p className="text-lg text-neutral-600 mt-4">
          {category.description}
        </p>
        <div className="mt-4 text-sm text-neutral-500">
          {category.count} products available
        </div>
      </div>
      
      {category.image && (
        <div className="col-span-4">
          <Image
            src={category.image.sourceUrl}
            alt={category.image.altText}
            width={300}
            height={300}
            className="rounded-lg"
          />
        </div>
      )}
    </div>
  </div>
</section>
```

**Styling:**
- Brand colors: Primary blue gradient background
- Responsive: Stack on mobile (col-span-12)
- Semantic HTML: `<section>`, `<h1>`

---

### 3. CategoryContent (Client Component)

**File:** `web/src/components/category/CategoryContent.tsx`

**Purpose:** Manages all filtering state and coordinates FilterSidebar + ProductGrid

**State Management:**
```typescript
'use client';

import { useState, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

interface CategoryContentProps {
  category: ProductCategory;
  subcategories: ProductCategory[];
  products: Product[];
  filters: ProductAttributes;
  locale: string;
}

export default function CategoryContent({
  category,
  subcategories,
  products,
  filters,
  locale
}: CategoryContentProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Filter state from URL params
  const [activeFilters, setActiveFilters] = useState({
    subcategory: searchParams.getAll('subcategory'),
    application: searchParams.getAll('application'),
    enclosure: searchParams.getAll('enclosure'),
    output: searchParams.getAll('output'),
    display: searchParams.getAll('display'),
  });
  
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Filter products client-side (fast for 100-200 products)
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Subcategory filter
      if (activeFilters.subcategory.length > 0) {
        const productCategories = product.productCategories.nodes.map(c => c.slug);
        if (!activeFilters.subcategory.some(sub => productCategories.includes(sub))) {
          return false;
        }
      }
      
      // Attribute filters (pa_*)
      if (activeFilters.application.length > 0) {
        const productApps = product.attributes?.find(a => a.name === 'Application')?.options || [];
        if (!activeFilters.application.some(app => productApps.includes(app))) {
          return false;
        }
      }
      
      // ... more filter logic
      
      return true;
    });
  }, [products, activeFilters]);
  
  // Sort products
  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];
    switch (sortBy) {
      case 'price-asc':
        return sorted.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
      case 'price-desc':
        return sorted.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'newest':
        return sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      default:
        return sorted;
    }
  }, [filteredProducts, sortBy]);
  
  // Update URL when filters change (for sharing/bookmarking)
  const updateFilters = (newFilters: typeof activeFilters) => {
    setActiveFilters(newFilters);
    
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, values]) => {
      values.forEach(val => params.append(key, val));
    });
    if (sortBy !== 'name') params.set('sort', sortBy);
    
    router.push(`?${params.toString()}`, { scroll: false });
  };
  
  return (
    <div className="container py-8">
      {/* Quick subcategory pills */}
      {subcategories.length > 0 && (
        <SubcategoryQuickFilter
          subcategories={subcategories}
          activeSubcategories={activeFilters.subcategory}
          onChange={(subs) => updateFilters({ ...activeFilters, subcategory: subs })}
        />
      )}
      
      <div className="grid grid-cols-12 gap-8 mt-8">
        {/* Sidebar */}
        <aside className="col-span-12 lg:col-span-3">
          <FilterSidebar
            subcategories={subcategories}
            filters={filters}
            activeFilters={activeFilters}
            onChange={updateFilters}
            productCount={filteredProducts.length}
          />
        </aside>
        
        {/* Products */}
        <main className="col-span-12 lg:col-span-9">
          <ProductGridSection
            products={sortedProducts}
            totalCount={products.length}
            filteredCount={sortedProducts.length}
            sortBy={sortBy}
            onSortChange={setSortBy}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            locale={locale}
          />
        </main>
      </div>
    </div>
  );
}
```

**Key Features:**
- ✅ URL-based filter state (shareable, bookmarkable)
- ✅ Client-side filtering (fast for <500 products)
- ✅ Memoized for performance
- ✅ No page refresh when filtering

---

### 4. SubcategoryQuickFilter (Client Component)

**File:** `web/src/components/category/SubcategoryQuickFilter.tsx`

**Visual Design:**
```tsx
'use client';

export default function SubcategoryQuickFilter({ 
  subcategories, 
  activeSubcategories, 
  onChange 
}) {
  return (
    <div className="flex flex-wrap gap-3">
      <span className="text-sm font-medium text-neutral-700 self-center">
        Quick Filter:
      </span>
      
      {subcategories.map((sub) => {
        const isActive = activeSubcategories.includes(sub.slug);
        
        return (
          <button
            key={sub.slug}
            onClick={() => {
              if (isActive) {
                onChange(activeSubcategories.filter(s => s !== sub.slug));
              } else {
                onChange([...activeSubcategories, sub.slug]);
              }
            }}
            className={`
              px-4 py-2 rounded-full text-sm font-medium transition-all
              ${isActive 
                ? 'bg-primary-500 text-white shadow-md' 
                : 'bg-white text-neutral-700 border border-neutral-300 hover:border-primary-300'
              }
            `}
          >
            {sub.name}
            <span className="ml-2 text-xs opacity-75">
              ({sub.count})
            </span>
          </button>
        );
      })}
    </div>
  );
}
```

**Behavior:**
- Pill design (rounded-full)
- Active state: Primary blue fill
- Multiple selection allowed
- Product count badges

---

### 5. FilterSidebar (Client Component)

**File:** `web/src/components/category/FilterSidebar.tsx`

**Structure:**
```tsx
'use client';

import { useState } from 'react';

export default function FilterSidebar({ 
  subcategories, 
  filters, 
  activeFilters, 
  onChange,
  productCount 
}) {
  // Mobile: collapsed by default
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const hasActiveFilters = Object.values(activeFilters).some(arr => arr.length > 0);
  
  return (
    <div className="filter-sidebar">
      {/* Mobile toggle */}
      <button
        className="lg:hidden w-full mb-4 px-4 py-3 bg-white border rounded-lg flex items-center justify-between"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        <span className="font-medium">
          Filters {hasActiveFilters && `(${countActiveFilters(activeFilters)})`}
        </span>
        <ChevronDownIcon className={`transform ${mobileOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {/* Filter groups */}
      <div className={`space-y-6 ${mobileOpen ? 'block' : 'hidden lg:block'}`}>
        {/* Subcategories */}
        {subcategories.length > 0 && (
          <FilterGroup title="Category">
            {subcategories.map((sub) => (
              <FilterCheckbox
                key={sub.slug}
                label={sub.name}
                count={sub.count}
                checked={activeFilters.subcategory.includes(sub.slug)}
                onChange={(checked) => {
                  const newSubs = checked
                    ? [...activeFilters.subcategory, sub.slug]
                    : activeFilters.subcategory.filter(s => s !== sub.slug);
                  onChange({ ...activeFilters, subcategory: newSubs });
                }}
              />
            ))}
          </FilterGroup>
        )}
        
        {/* Application Filter (pa_application) */}
        {filters.paApplications?.nodes.length > 0 && (
          <FilterGroup title="Application">
            {filters.paApplications.nodes.map((app) => (
              <FilterCheckbox
                key={app.slug}
                label={app.name}
                count={app.count}
                checked={activeFilters.application.includes(app.slug)}
                onChange={(checked) => {
                  const newApps = checked
                    ? [...activeFilters.application, app.slug]
                    : activeFilters.application.filter(a => a !== app.slug);
                  onChange({ ...activeFilters, application: newApps });
                }}
              />
            ))}
          </FilterGroup>
        )}
        
        {/* More filter groups... */}
        
        {/* Clear all filters */}
        {hasActiveFilters && (
          <button
            onClick={() => onChange({
              subcategory: [],
              application: [],
              enclosure: [],
              output: [],
              display: []
            })}
            className="w-full px-4 py-2 text-sm text-primary-600 hover:text-primary-700 border border-primary-300 rounded-lg hover:bg-primary-50 transition-colors"
          >
            Clear All Filters
          </button>
        )}
        
        {/* Results count */}
        <div className="text-sm text-neutral-600 border-t pt-4">
          Showing {productCount} products
        </div>
      </div>
    </div>
  );
}
```

**Responsive Behavior:**
- Desktop: Always visible sidebar
- Mobile: Collapsible, starts collapsed
- Sticky on scroll (optional)

---

### 6. ProductGridSection (Client Component)

**File:** `web/src/components/category/ProductGridSection.tsx`

**Features:**
- Results header with count
- Sort dropdown
- View mode toggle (grid/list)
- Product grid
- Pagination (if needed)

```tsx
'use client';

export default function ProductGridSection({
  products,
  totalCount,
  filteredCount,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  locale
}) {
  return (
    <div>
      {/* Results header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b">
        <div className="text-sm text-neutral-600">
          Showing {filteredCount} of {totalCount} products
        </div>
        
        <div className="flex items-center gap-4">
          {/* Sort dropdown */}
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="px-3 py-2 border border-neutral-300 rounded-lg text-sm"
          >
            <option value="name">Name (A-Z)</option>
            <option value="price-asc">Price (Low to High)</option>
            <option value="price-desc">Price (High to Low)</option>
            <option value="newest">Newest First</option>
          </select>
          
          {/* View toggle */}
          <div className="hidden sm:flex gap-1 border border-neutral-300 rounded-lg p-1">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary-100' : ''}`}
            >
              <GridIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary-100' : ''}`}
            >
              <ListIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Product grid */}
      {products.length === 0 ? (
        <EmptyState message="No products match your filters" />
      ) : (
        <div className={`
          ${viewMode === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' 
            : 'space-y-4'
          }
        `}>
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              locale={locale}
              viewMode={viewMode}
            />
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## Data Flow

```
Server (CategoryPage)
  ↓
  Fetch all data via GraphQL
  ↓
  Pass to Client Component
  ↓
CategoryContent (manages state)
  ↓
  ├─→ SubcategoryQuickFilter (visual pills)
  ├─→ FilterSidebar (checkboxes)
  └─→ ProductGridSection (filtered products)
  
User clicks filter
  ↓
Update activeFilters state
  ↓
useMemo re-filters products (instant)
  ↓
Update URL params (shareable)
  ↓
Re-render grid (no fetch)
```

**Performance:**
- Initial render: Server-side (fast)
- Filtering: Client-side (instant, no network)
- For 100-200 products: Client filtering is faster than server requests
- For 500+ products: Consider server-side pagination

---

## GraphQL Query Updates

### Add to `products.graphql`:

```graphql
# Get all product attribute terms for a category
query GetProductAttributesByCategory($categorySlug: String!) {
  # Temperature-specific attributes
  paApplications: allPaApplication(
    first: 100
    where: { 
      hideEmpty: true
      # Filter to products in this category
    }
  ) {
    nodes {
      id
      databaseId
      name
      slug
      count
    }
  }
  
  paRoomEnclosureStyles: allPaRoomEnclosureStyle(first: 100) {
    nodes { id databaseId name slug count }
  }
  
  paTemperatureSensorOutputs: allPaTemperatureSensorOutput(first: 100) {
    nodes { id databaseId name slug count }
  }
  
  paDisplays: allPaDisplay(first: 100) {
    nodes { id databaseId name slug count }
  }
  
  # Humidity-specific
  paHumidityApplications: allPaHumidityApplication(first: 100) {
    nodes { id databaseId name slug count }
  }
  
  # ... more attributes as needed
}
```

---

## File Structure

```
web/src/
├── app/[locale]/products/
│   ├── [category]/
│   │   ├── page.tsx                    # ✨ NEW: Main category page
│   │   ├── loading.tsx                 # Loading state
│   │   └── [subcategory]/
│   │       ├── page.tsx                # ✨ NEW: Subcategory page (optional)
│   │       └── loading.tsx
│   └── page.tsx                        # All products landing
│
├── components/category/                 # ✨ NEW: Category components
│   ├── CategoryHero.tsx                # Server component
│   ├── CategoryContent.tsx             # Client component (state manager)
│   ├── SubcategoryQuickFilter.tsx     # Client component
│   ├── FilterSidebar.tsx               # Client component
│   ├── FilterGroup.tsx                 # Reusable filter group
│   ├── FilterCheckbox.tsx              # Reusable checkbox
│   └── ProductGridSection.tsx          # Client component
│
├── components/products/
│   ├── ProductCard.tsx                 # Existing, reuse
│   └── ProductGrid.tsx                 # Existing, reuse
│
├── lib/graphql/queries/
│   └── products.graphql                # Add new queries
│
└── hooks/
    └── useProductFilters.ts            # ✨ NEW: Filter logic hook (optional)
```

---

## Styling Guidelines

### Tailwind Classes

**Filters:**
- Filter group: `border-b pb-4 mb-4 last:border-b-0`
- Checkbox: `accent-primary-500`
- Active pill: `bg-primary-500 text-white`
- Inactive pill: `bg-white border border-neutral-300`

**Product Grid:**
- Desktop: `grid-cols-3`
- Tablet: `grid-cols-2`
- Mobile: `grid-cols-1`
- Gap: `gap-6`

**Color Usage:**
- Primary blue: Filter states, CTAs
- Neutral grays: Text, borders, backgrounds
- Yellow accent: Minimal use (badges, highlights)

**Accessibility:**
- ✅ Proper ARIA labels on filters
- ✅ Keyboard navigation
- ✅ Focus indicators
- ✅ Screen reader-friendly counts

---

## SEO Optimization

### Metadata

```typescript
export async function generateMetadata({ params }) {
  const category = await getCategory(params.category);
  
  return {
    title: `${category.name} | Building Automation Products | BAPI`,
    description: category.description || `Shop ${category.count} ${category.name} from BAPI. High-quality sensors for HVAC and building automation.`,
    openGraph: {
      title: category.name,
      description: category.description,
      images: [category.image?.sourceUrl],
      type: 'website',
    },
    alternates: {
      canonical: `/products/${params.category}`,
      languages: {
        'en': `/en/products/${params.category}`,
        'de': `/de/products/${params.category}`,
        // ... all 11 locales
      }
    }
  };
}
```

### Structured Data

```typescript
const structuredData = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": category.name,
  "description": category.description,
  "url": `https://bapi-headless.vercel.app/products/${category.slug}`,
  "breadcrumb": {
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs
  },
  "mainEntity": {
    "@type": "ItemList",
    "numberOfItems": products.length,
    "itemListElement": products.map((product, index) => ({
      "@type": "Product",
      "position": index + 1,
      "name": product.name,
      "url": `/products/${product.slug}`,
      "offers": {
        "@type": "Offer",
        "price": product.price,
        "priceCurrency": "USD"
      }
    }))
  }
};
```

---

## Performance Optimization

### Server-Side

1. **GraphQL Caching:**
   - Use `getGraphQLClient(['categories', 'category-${slug}'])`
   - Enable ISR: `revalidate: 3600` (1 hour)
   - On-demand revalidation when products change

2. **Data Fetching:**
   - Parallel queries with `Promise.all()`
   - Only fetch needed fields
   - Use query fragments for reuse

### Client-Side

1. **Filtering:**
   - `useMemo` for filtered products
   - Client-side for <500 products (faster than server)
   - Debounce search inputs

2. **Images:**
   - Next.js Image component
   - Lazy loading below fold
   - WebP with fallback

3. **Code Splitting:**
   - Lazy load FilterSidebar on mobile
   - Dynamic imports for less-used features

### Metrics Goals

- **LCP:** < 2.5s (product images optimized)
- **FID:** < 100ms (client filtering is instant)
- **CLS:** 0 (reserve space for images)
- **Time to Interactive:** < 3s

---

## Mobile Optimization

### Responsive Breakpoints

```typescript
// tailwind.config.ts
screens: {
  'sm': '640px',   // Tablet portrait
  'md': '768px',   // Tablet landscape
  'lg': '1024px',  // Desktop
  'xl': '1280px',  // Large desktop
}
```

### Mobile-Specific Features

1. **Filter Sidebar:**
   - Collapsed by default
   - Full-screen overlay when expanded
   - Sticky "Apply Filters" button

2. **Quick Filters:**
   - Horizontal scroll on mobile
   - Larger touch targets (44×44px minimum)

3. **Product Cards:**
   - Single column on mobile
   - Larger images (better tap targets)
   - Lazy load images

---

## Testing Strategy

### Unit Tests (Vitest)

```typescript
// FilterSidebar.test.tsx
describe('FilterSidebar', () => {
  it('renders all filter groups', () => {});
  it('updates filters on checkbox click', () => {});
  it('clears all filters', () => {});
  it('displays correct product count', () => {});
});

// CategoryContent.test.tsx
describe('CategoryContent', () => {
  it('filters products by subcategory', () => {});
  it('filters products by multiple attributes', () => {});
  it('sorts products correctly', () => {});
  it('updates URL params on filter change', () => {});
});
```

### Integration Tests

1. Filter application works end-to-end
2. URL parameters sync with filters
3. Products load and render correctly
4. Mobile filter overlay works

### E2E Tests (Playwright - optional)

1. Navigate to category page
2. Apply filters
3. Verify URL updates
4. Verify product count changes
5. Clear filters
6. Verify all products show

---

## Migration Plan

### Phase 1: Build Components (Week 1)

**Days 1-2:**
- ✅ Create CategoryPage server component
- ✅ Implement GraphQL queries
- ✅ Build CategoryHero

**Days 3-4:**
- ✅ Build FilterSidebar
- ✅ Build SubcategoryQuickFilter
- ✅ Implement filter state management

**Days 5-7:**
- ✅ Build ProductGridSection
- ✅ Wire everything together
- ✅ Test filtering logic

### Phase 2: Polish & Optimize (Week 2)

**Days 8-10:**
- ✅ Mobile optimization
- ✅ Add loading states
- ✅ Implement sort/view modes
- ✅ Add empty states

**Days 11-12:**
- ✅ SEO metadata
- ✅ Structured data
- ✅ Accessibility audit
- ✅ Performance optimization

**Days 13-14:**
- ✅ Testing (unit + integration)
- ✅ Bug fixes
- ✅ Documentation

### Phase 3: Deploy & Monitor (Week 3)

**Days 15-16:**
- ✅ Deploy to staging
- ✅ Stakeholder review
- ✅ Fix feedback

**Day 17:**
- ✅ Production deployment
- ✅ Monitor analytics
- ✅ Watch error logs

---

## Success Metrics

### Before Launch (Current Site)

- Avg clicks to product: **4**
- Category page bounce rate: **~40-50%** (estimated)
- Products visible on category page: **0**
- Mobile usability score: **~70-80** (estimated)

### After Launch (Headless Site)

- Target clicks to product: **2** (50% reduction)
- Target bounce rate: **<30%**
- Products visible on category page: **All**
- Mobile usability score: **>90**

### Tracking

- Google Analytics 4: Track filter usage
- Hotjar: Heatmaps on category pages
- Conversion rate: Track add-to-cart from category pages

---

## Open Questions / Decisions Needed

1. ✅ **Confirmed:** Show products immediately on category pages
2. ✅ **Confirmed:** Use subcategories as filters, not navigation
3. ⏳ **TBD:** Keep Level 3 URLs for SEO? (redirect or full pages?)
4. ⏳ **TBD:** Product limit per page before pagination? (suggest 48)
5. ⏳ **TBD:** Default sort order? (suggest: name A-Z)
6. ⏳ **TBD:** Should filters persist across category changes? (suggest: no)

---

## Related Documentation

- [CATEGORY-STRUCTURE-COMPARISON.md](./CATEGORY-STRUCTURE-COMPARISON.md) - Production vs headless comparison
- [PRODUCT-CATEGORY-AUDIT.md](./PRODUCT-CATEGORY-AUDIT.md) - Original category structure audit
- [web/CODING_STANDARDS.md](../web/CODING_STANDARDS.md) - Component patterns
- [web/COLOR_SYSTEM.md](../web/COLOR_SYSTEM.md) - Brand colors and tokens
- [web/TAILWIND_GUIDELINES.md](../web/TAILWIND_GUIDELINES.md) - Styling conventions

---

## Next Steps

1. Review this architecture with stakeholders
2. Get approval on "show products immediately" approach
3. Start implementation on `feature/category-product-grid-phase1` branch
4. Target: Complete by March 30 for testing before April 10 launch
