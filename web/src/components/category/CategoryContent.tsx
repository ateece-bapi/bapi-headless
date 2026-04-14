'use client';

import { useState, useMemo } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import type { GetProductAttributesQuery } from '@/lib/graphql/generated';
import { useAuth } from '@/hooks/useAuth';
import { filterProductsByCustomerGroup } from '@/lib/utils/filterProductsByCustomerGroup';
import SubcategoryQuickFilter from './SubcategoryQuickFilter';
import SubcategoryCard from './SubcategoryCard';
import FilterSidebar from './FilterSidebar';
import { ProductGrid } from '@/components/products/ProductGrid';

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
  description?: string | null;
  image?: {
    sourceUrl?: string | null;
    altText?: string | null;
  } | null;
}

interface CategoryContentProps {
  categorySlugParam: string;
  subcategories: Subcategory[];
  products: Product[];
  filters: GetProductAttributesQuery;
  locale: string;
}

type SortOption = 'name' | 'price-asc' | 'price-desc' | 'newest';

interface ActiveFilters {
  subcategory: string[];
  application: string[];
  enclosure: string[];
  output: string[];
  display: string[];
  tempSetpoint: string[];
  optionalTempOutput: string[];
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
  const { user } = useAuth();

  // Initialize filters from URL
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    subcategory: searchParams?.getAll('subcategory') ?? [],
    application: searchParams?.getAll('application') ?? [],
    enclosure: searchParams?.getAll('enclosure') ?? [],
    output: searchParams?.getAll('output') ?? [],
    display: searchParams?.getAll('display') ?? [],
    tempSetpoint: searchParams?.getAll('tempSetpoint') ?? [],
    optionalTempOutput: searchParams?.getAll('optionalTempOutput') ?? [],
  });

  const [sortBy, setSortBy] = useState<SortOption>(
    (searchParams?.get('sort') as SortOption) || 'name'
  );

  // Debug mode flag (outside useMemo to avoid dependency issues)
  const DEBUG = searchParams?.get('debug') === 'filters';

  // Filter products based on active filters
  const filteredProducts = useMemo(() => {
    if (DEBUG) {
      console.log('🔧 DEBUG MODE ACTIVE');
      console.log('Active filters:', activeFilters);
      console.log('Total products before filtering:', products.length);
    }
    
    // Step 1: Filter by customer group (B2B access control)
    // Applied client-side after products are fetched from WordPress
    // User's customerGroups array defaults to ['END USER'] for guests
    const customerGroupFiltered = filterProductsByCustomerGroup(
      products,
      user?.customerGroups || ['END USER']
    );
    
    if (DEBUG) {
      console.log('After customer group filter:', customerGroupFiltered.length);
    }

    // Create slug-to-name maps from filter taxonomy data
    // This allows us to convert user-selected slugs to display names for comparison
    const applicationSlugToName = new Map(
      filters.paApplications?.nodes.map((node) => [node.slug, node.name]) || []
    );
    const enclosureSlugToName = new Map(
      filters.paRoomEnclosureStyles?.nodes.map((node) => [node.slug, node.name]) || []
    );
    const outputSlugToName = new Map(
      [
        ...(filters.paTemperatureSensorOutputs?.nodes || []),
        ...(filters.paHumiditySensorOutputs?.nodes || []),
      ].map((node) => [node.slug, node.name])
    );
    const displaySlugToName = new Map(
      filters.paDisplays?.nodes.map((node) => [node.slug, node.name]) || []
    );
    const tempSetpointSlugToName = new Map(
      filters.paTempSetpointAndOverride?.nodes.map((node) => [node.slug, node.name]) || []
    );
    const optionalTempOutputSlugToName = new Map(
      filters.paOptionalTempSensorOutputs?.nodes.map((node) => [node.slug, node.name]) || []
    );

    return customerGroupFiltered
      .filter(
        (product): product is typeof product & { name: string; slug: string } =>
          !!product.name && !!product.slug
      ) // Only show products with valid name and slug
      .filter((product) => {
      if (DEBUG) {
        console.log(`\n--- Checking product: ${product.name} ---`);
      }
      
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
          (a) => a.name && (a.name === 'pa_application' || a.name === 'Application' || a.name.toLowerCase().includes('application'))
        );
        
        if (!appAttr) {
          return false;
        }
        
        const appValues = (appAttr?.options || [])
          .filter((opt): opt is string => !!opt)
          .map(opt => opt.toLowerCase());
        
        const selectedNames = activeFilters.application
          .map((slug) => {
            const name = applicationSlugToName.get(slug);
            return name ? name.toLowerCase() : slug.toLowerCase();
          });
        
        const hasMatch = selectedNames.some((name) => 
          appValues.some(val => val.includes(name) || name.includes(val))
        );
        
        if (!hasMatch) {
          return false;
        }
      }

      // Enclosure filter
      if (activeFilters.enclosure.length > 0) {
        const enclosureAttr = productAttributes.find(
          (a) => a.name && (a.name === 'pa_room-enclosure-style' || a.name === 'pa_room_enclosure_style' || a.name.toLowerCase().includes('enclosure'))
        );
        
        if (DEBUG && !enclosureAttr) {
          console.log('❌ No enclosure attr:', product.name, {
            allAttributes: productAttributes.map(a => ({ name: a.name, options: a.options })),
          });
        }
        
        if (!enclosureAttr) {
          // No enclosure attribute on this product, so it doesn't match
          return false;
        }
        
        const enclosureValues = (enclosureAttr?.options || [])
          .filter((opt): opt is string => !!opt)
          .map(opt => opt.toLowerCase()); // Normalize to lowercase for comparison
        
        // Convert selected slugs to names and normalize
        const selectedNames = activeFilters.enclosure
          .map((slug) => {
            const name = enclosureSlugToName.get(slug);
            return name ? name.toLowerCase() : slug.toLowerCase();
          })
          .filter((name): name is string => !!name);
        
        if (DEBUG) {
          console.log('🔍 Enclosure match:', product.name, {
            enclosureAttrName: enclosureAttr.name,
            enclosureValues,
            selectedNames,
            hasMatch: selectedNames.some((name) => 
              enclosureValues.some(val => val.includes(name) || name.includes(val))
            ),
          });
        }
        
        const hasMatch = selectedNames.some((name) => 
          enclosureValues.some(val => val.includes(name) || name.includes(val))
        );
        
        if (!hasMatch) {
          return false;
        }
      }

      // Output filter
      if (activeFilters.output.length > 0) {
        const outputAttr = productAttributes.find(
          (a) =>
            a.name &&
            (a.name === 'pa_temperature-sensor-output' ||
              a.name === 'pa_humidity-sensor-output' ||
              a.name.toLowerCase().includes('output'))
        );
        
        if (!outputAttr) {
          return false;
        }
        
        const outputValues = (outputAttr?.options || [])
          .filter((opt): opt is string => !!opt)
          .map(opt => opt.toLowerCase());
        
        const selectedNames = activeFilters.output
          .map((slug) => {
            const name = outputSlugToName.get(slug);
            return name ? name.toLowerCase() : slug.toLowerCase();
          });
        
        const hasMatch = selectedNames.some((name) => 
          outputValues.some(val => val.includes(name) || name.includes(val))
        );
        
        if (!hasMatch) {
          return false;
        }
      }

      // Display filter
      if (activeFilters.display.length > 0) {
        const displayAttr = productAttributes.find(
          (a) => a.name && (a.name === 'pa_display' || a.name.toLowerCase().includes('display'))
        );
        
        if (!displayAttr) {
          return false;
        }
        
        const displayValues = (displayAttr?.options || [])
          .filter((opt): opt is string => !!opt)
          .map(opt => opt.toLowerCase());
        
        const selectedNames = activeFilters.display
          .map((slug) => {
            const name = displaySlugToName.get(slug);
            return name ? name.toLowerCase() : slug.toLowerCase();
          });
        
        const hasMatch = selectedNames.some((name) => 
          displayValues.some(val => val.includes(name) || name.includes(val))
        );
        
        if (!hasMatch) {
          return false;
        }
      }

      // Temperature Setpoint & Override filter
      if (activeFilters.tempSetpoint.length > 0) {
        const tempSetpointAttr = productAttributes.find(
          (a) => a.name && (a.name === 'pa_temp-setpoint-and-override' || a.name === 'pa_temp_setpoint_and_override' || a.name.toLowerCase().includes('setpoint'))
        );
        
        if (!tempSetpointAttr) {
          return false;
        }
        
        const tempSetpointValues = (tempSetpointAttr?.options || [])
          .filter((opt): opt is string => !!opt)
          .map(opt => opt.toLowerCase());
        
        const selectedNames = activeFilters.tempSetpoint
          .map((slug) => {
            const name = tempSetpointSlugToName.get(slug);
            return name ? name.toLowerCase() : slug.toLowerCase();
          });
        
        const hasMatch = selectedNames.some((name) => 
          tempSetpointValues.some(val => val.includes(name) || name.includes(val))
        );
        
        if (!hasMatch) {
          return false;
        }
      }

      // Optional Temperature Sensor Output filter
      if (activeFilters.optionalTempOutput.length > 0) {
        const optionalTempOutputAttr = productAttributes.find(
          (a) => a.name && (a.name === 'pa_optional-temp-sensor-output' || a.name === 'pa_optional_temp_sensor_output' || a.name.toLowerCase().includes('optional'))
        );
        
        if (!optionalTempOutputAttr) {
          return false;
        }
        
        const optionalTempOutputValues = (optionalTempOutputAttr?.options || [])
          .filter((opt): opt is string => !!opt)
          .map(opt => opt.toLowerCase());
        
        const selectedNames = activeFilters.optionalTempOutput
          .map((slug) => {
            const name = optionalTempOutputSlugToName.get(slug);
            return name ? name.toLowerCase() : slug.toLowerCase();
          });
        
        const hasMatch = selectedNames.some((name) => 
          optionalTempOutputValues.some(val => val.includes(name) || name.includes(val))
        );
        
        if (!hasMatch) {
          return false;
        }
      }

      return true;
    });
  }, [products, activeFilters, filters, user?.customerGroups]);

  // Sort products
  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];

    switch (sortBy) {
      case 'price-asc':
        return sorted.sort((a, b) => {
          const priceA = parseFloat((a.price || '0').replace(/[^0-9.]/g, ''));
          const priceB = parseFloat((b.price || '0').replace(/[^0-9.]/g, ''));
          return priceA - priceB;
        });
      case 'price-desc':
        return sorted.sort((a, b) => {
          const priceA = parseFloat((a.price || '0').replace(/[^0-9.]/g, ''));
          const priceB = parseFloat((b.price || '0').replace(/[^0-9.]/g, ''));
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

  // Update URL when sort changes
  const handleSortChange = (newSort: SortOption) => {
    setSortBy(newSort);

    const params = new URLSearchParams();
    Object.entries(activeFilters).forEach(([key, values]) => {
      values.forEach((val: string) => params.append(key, val));
    });
    if (newSort !== 'name') params.set('sort', newSort);

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
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {subcategories
                .filter((sub) => sub.name && sub.slug) // Only show subcategories with valid name and slug
                .map((subcategory) => (
                <SubcategoryCard
                  key={subcategory.id}
                  name={subcategory.name!} // We know it's defined because of filter
                  slug={subcategory.slug!} // We know it's defined because of filter
                  description={subcategory.description}
                  image={subcategory.image}
                  categorySlug={categorySlugParam}
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
            {/* Results Header with Sort Controls */}
            <div className="mb-6 flex flex-col gap-4 border-b border-neutral-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-neutral-700">
                Showing {sortedProducts.length} of {products.length} products
              </p>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <label htmlFor="sort-select" className="text-sm text-neutral-700">
                  Sort:
                </label>
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value as SortOption)}
                  className="rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500"
                >
                  <option value="name">Name (A-Z)</option>
                  <option value="price-asc">Price (Low to High)</option>
                  <option value="price-desc">Price (High to Low)</option>
                  <option value="newest">Newest First</option>
                </select>
              </div>
            </div>

            {/* Product Grid with QuickView - Custom styling for 3-column max */}
            <div className="[&>div]:!grid [&>div]:!grid-cols-1 [&>div]:!gap-6 [&>div]:sm:!grid-cols-2 [&>div]:lg:!grid-cols-3">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              <ProductGrid products={sortedProducts as any} locale={locale} viewMode="grid" />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
