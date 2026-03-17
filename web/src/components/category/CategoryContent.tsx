'use client';

import { useState, useMemo } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import type { GetProductAttributesQuery } from '@/lib/graphql/generated';
import SubcategoryQuickFilter from './SubcategoryQuickFilter';
import SubcategoryCard from './SubcategoryCard';
import FilterSidebar from './FilterSidebar';
import ProductGridSection from './ProductGridSection';

interface Product {
  id: string;
  databaseId?: number | null;
  name?: string | null;
  slug?: string | null;
  shortDescription?: string | null;
  price?: string | null;
  partNumber?: string | null;
  image?: {
    sourceUrl?: string | null;
    altText?: string | null;
  } | null;
  productCategories?: {
    nodes: Array<{
      id: string;
      slug?: string | null;
      parent?: {
        node?: {
          id: string;
          slug?: string | null;
        } | null;
      } | null;
    }>;
  } | null;
  attributes?: {
    nodes: Array<{
      id: string;
      name?: string | null;
      options?: Array<string | null | undefined> | null;
    }>;
  } | null;
}

interface Subcategory {
  id: string;
  name?: string | null;
  slug?: string | null;
  count?: number | null;
}

interface CategoryContentProps {
  categorySlugParam: string;
  subcategories: Subcategory[];
  products: Product[];
  filters: GetProductAttributesQuery;
  locale: string;
  translations: Record<string, string>;
}

type SortOption = 'name' | 'price-asc' | 'price-desc' | 'newest';
type ViewMode = 'grid' | 'list';

interface ActiveFilters {
  subcategory: string[];
  application: string[];
  enclosure: string[];
  output: string[];
  display: string[];
}

/**
 * CategoryContent component displays a filterable and sortable product grid with sidebar filters.
 * Manages filter state and URL synchronization for category browsing.
 */
export default function CategoryContent({
  categorySlugParam,
  subcategories,
  products,
  filters,
  locale,
}: CategoryContentProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Initialize filters from URL
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    subcategory: searchParams?.getAll('subcategory') ?? [],
    application: searchParams?.getAll('application') ?? [],
    enclosure: searchParams?.getAll('enclosure') ?? [],
    output: searchParams?.getAll('output') ?? [],
    display: searchParams?.getAll('display') ?? [],
  });

  const [sortBy, setSortBy] = useState<SortOption>(
    (searchParams?.get('sort') as SortOption) || 'name'
  );
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // Filter products based on active filters
  const filteredProducts = useMemo(() => {
    return products
      .filter(
        (product): product is typeof product & { name: string; slug: string } =>
          !!product.name && !!product.slug
      ) // Only show products with valid name and slug
      .filter((product) => {
      // Subcategory filter
      if (activeFilters.subcategory.length > 0) {
        const productCategories =
          product.productCategories?.nodes
            .map((c) => c.slug)
            .filter((slug): slug is string => !!slug) || [];
        if (
          !activeFilters.subcategory.some((sub) => productCategories.includes(sub))
        ) {
          return false;
        }
      }

      // Attribute filters
      const productAttributes = product.attributes?.nodes || [];

      // Application filter
      if (activeFilters.application.length > 0) {
        const appAttr = productAttributes.find(
          (a) => a.name && (a.name === 'pa_application' || a.name === 'Application')
        );
        const appValues = (appAttr?.options || []).filter(
          (opt): opt is string => !!opt
        );
        if (!activeFilters.application.some((app) => appValues.includes(app))) {
          return false;
        }
      }

      // Enclosure filter
      if (activeFilters.enclosure.length > 0) {
        const enclosureAttr = productAttributes.find(
          (a) => a.name && a.name === 'pa_room-enclosure-style'
        );
        const enclosureValues = (enclosureAttr?.options || []).filter(
          (opt): opt is string => !!opt
        );
        if (
          !activeFilters.enclosure.some((enc) => enclosureValues.includes(enc))
        ) {
          return false;
        }
      }

      // Output filter
      if (activeFilters.output.length > 0) {
        const outputAttr = productAttributes.find(
          (a) =>
            a.name &&
            (a.name === 'pa_temperature-sensor-output' ||
              a.name === 'pa_humidity-sensor-output')
        );
        const outputValues = (outputAttr?.options || []).filter(
          (opt): opt is string => !!opt
        );
        if (!activeFilters.output.some((out) => outputValues.includes(out))) {
          return false;
        }
      }

      // Display filter
      if (activeFilters.display.length > 0) {
        const displayAttr = productAttributes.find(
          (a) => a.name && a.name === 'pa_display'
        );
        const displayValues = (displayAttr?.options || []).filter(
          (opt): opt is string => !!opt
        );
        if (!activeFilters.display.some((disp) => displayValues.includes(disp))) {
          return false;
        }
      }

      return true;
    });
  }, [products, activeFilters]);

  // Sort products
  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];

    switch (sortBy) {
      case 'price-asc':
        return sorted.sort((a, b) => {
          const priceA = parseFloat(a.price || '0');
          const priceB = parseFloat(b.price || '0');
          return priceA - priceB;
        });
      case 'price-desc':
        return sorted.sort((a, b) => {
          const priceA = parseFloat(a.price || '0');
          const priceB = parseFloat(b.price || '0');
          return priceB - priceA;
        });
      case 'name':
        return sorted.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      case 'newest':
        return sorted.sort((a, b) => {
          const idA = a.databaseId || 0;
          const idB = b.databaseId || 0;
          return idB - idA; // Newer IDs first
        });
      default:
        return sorted;
    }
  }, [filteredProducts, sortBy]);

  // Update URL when filters change
  const updateFilters = (newFilters: ActiveFilters) => {
    setActiveFilters(newFilters);

    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, values]) => {
      values.forEach((val: string) => params.append(key, val));
    });
    if (sortBy !== 'name') params.set('sort', sortBy);

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="bg-white py-8 lg:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Subcategory Cards */}
        {subcategories.length > 0 && (
          <div className="mb-12">
            <h2 className="mb-6 text-2xl font-bold text-neutral-900">
              Browse by Category
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {subcategories
                .filter((sub) => sub.name && sub.slug) // Only show subcategories with valid name and slug
                .map((subcategory) => (
                <SubcategoryCard
                  key={subcategory.id}
                  name={subcategory.name!} // We know it's defined because of filter
                  slug={subcategory.slug!} // We know it's defined because of filter
                  count={subcategory.count}
                  description={null}
                  image={null}
                  categorySlug={categorySlugParam}
                  locale={locale}
                />
              ))}
            </div>
          </div>
        )}

        {/* Quick Subcategory Filter */}
        {subcategories.length > 0 && (
          <div className="mb-8">
            <SubcategoryQuickFilter
              subcategories={subcategories}
              activeSubcategories={activeFilters.subcategory}
              onChange={(subs) =>
                updateFilters({ ...activeFilters, subcategory: subs })
              }
            />
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Sidebar */}
          <aside className="lg:col-span-3">
            <FilterSidebar
              subcategories={subcategories}
              filters={filters}
              activeFilters={activeFilters}
              onChange={updateFilters}
              productCount={sortedProducts.length}
            />
          </aside>

          {/* Products */}
          <main className="lg:col-span-9">
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
    </div>
  );
}
