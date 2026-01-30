import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import { getGraphQLClient } from '@/lib/graphql/client';
import {
  GetProductCategoryWithChildrenDocument,
  GetProductCategoryWithChildrenQuery,
  GetProductsWithFiltersDocument,
  GetProductsWithFiltersQuery,
} from '@/lib/graphql/generated';
import { ProductFilters } from '@/components/products/ProductFilters';
import { MobileFilterButton } from '@/components/products/MobileFilterButton';
import FilteredProductGrid from '@/components/products/FilteredProductGrid';

interface SubcategoryPageProps {
  params: Promise<{
    locale: string;
    category: string;
    subcategory: string;
  }>;
  searchParams: Promise<{
    application?: string;
    enclosure?: string;
    output?: string;
    display?: string;
    sort?: string;
    page?: string;
  }>;
}

export async function generateMetadata({
  params,
}: SubcategoryPageProps): Promise<Metadata> {
  const { subcategory } = await params;
  const client = getGraphQLClient(['product-categories'], true);

  try {
    const data = await client.request<GetProductCategoryWithChildrenQuery>(
      GetProductCategoryWithChildrenDocument,
      { slug: subcategory }
    );

    const categoryData = data.productCategory;
    if (!categoryData) {
      return {
        title: 'Category Not Found',
      };
    }

    return {
      title: `${categoryData.name} | BAPI`,
      description:
        categoryData.description ||
        `Browse ${categoryData.name} from BAPI - Building Automation Products Inc.`,
    };
  } catch (error) {
    return {
      title: 'Category Not Found',
    };
  }
}

export default async function SubcategoryPage({
  params,
  searchParams,
}: SubcategoryPageProps) {
  const { category, subcategory, locale } = await params;
  const filters = await searchParams;

  const client = getGraphQLClient(['products', `category-${subcategory}`], true);

  // Fetch category data with hierarchy
  const categoryData = await client.request<GetProductCategoryWithChildrenQuery>(
    GetProductCategoryWithChildrenDocument,
    { slug: subcategory }
  );

  const subcategoryData = categoryData.productCategory;

  if (!subcategoryData) {
    notFound();
  }

  // Fetch products for this category
  const productsData = await client.request<GetProductsWithFiltersQuery>(
    GetProductsWithFiltersDocument,
    {
      categorySlug: subcategory,
      first: 24,
    }
  );

  const products = productsData.products?.nodes || [];
  const hasNextPage = productsData.products?.pageInfo.hasNextPage || false;

  // Build breadcrumb trail
  const parentCategory = subcategoryData.parent?.node;
  const breadcrumbs = [
    { label: 'Home', href: `/${locale}` },
    { label: 'Products', href: `/${locale}/products` },
  ];

  if (parentCategory) {
    breadcrumbs.push({
      label: parentCategory.name || '',
      href: `/${locale}/categories/${parentCategory.slug}`,
    });
  }

  breadcrumbs.push({ label: subcategoryData.name || '', href: '' });

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumbs */}
      <div className="border-b border-neutral-200">
        <div className="max-w-container mx-auto px-4 py-4">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm flex-wrap">
            {breadcrumbs.map((crumb, index) => (
              <div key={index} className="flex items-center gap-2">
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="text-neutral-600 hover:text-primary-500 transition-colors"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-neutral-900 font-medium">{crumb.label}</span>
                )}
                {index < breadcrumbs.length - 1 && (
                  <span className="text-neutral-400">/</span>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>

      {/* Category Header */}
      <div className="bg-gradient-to-br from-neutral-50 to-neutral-100 border-b border-neutral-200">
        <div className="max-w-container mx-auto px-4 py-8">
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-2">
            {subcategoryData.name}
          </h1>
          {subcategoryData.description && (
            <p className="text-neutral-600 max-w-3xl">
              {subcategoryData.description}
            </p>
          )}
        </div>
      </div>

      {/* Main Content: Filters + Products */}
      <div className="max-w-container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters (Desktop) */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-4">
              <Suspense fallback={<div>Loading filters...</div>}>
                <ProductFilters
                  categorySlug={subcategory}
                  products={products}
                  currentFilters={filters}
                />
              </Suspense>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1 min-w-0">
            {/* Sort (Coming soon) */}
            <div className="flex items-center justify-end mb-6 pb-4 border-b border-neutral-200">
              <div className="text-sm text-neutral-500">
                {/* TODO: Add sort dropdown */}
              </div>
            </div>

            {/* Product Grid with Client-Side Filtering */}
            <Suspense
              fallback={
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-neutral-100 rounded-xl h-96 animate-pulse"
                    />
                  ))}
                </div>
              }
            >
              <FilteredProductGrid products={products} locale={locale} />
            </Suspense>

            {/* Pagination (Coming soon) */}
            {hasNextPage && (
              <div className="mt-8 text-center text-sm text-neutral-500">
                More products available...
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Button (Fixed Bottom) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 p-4 z-dropdown shadow-lg">
        <MobileFilterButton
          categorySlug={subcategory}
          products={products}
          currentFilters={filters}
        />
      </div>
    </div>
  );
}
