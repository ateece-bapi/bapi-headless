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
import ProductSortDropdown from '@/components/products/ProductSortDropdown';

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

      {/* Category Header with BAPI Gradient */}
      <div className="relative bg-gradient-to-br from-primary-600 via-primary-500 to-primary-700 border-b-4 border-accent-500">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        <div className="max-w-container mx-auto px-4 py-12 relative">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
              {subcategoryData.name}
            </h1>
            {subcategoryData.description && (
              <p className="text-lg text-white/95 leading-relaxed drop-shadow-md max-w-2xl">
                {subcategoryData.description}
              </p>
            )}
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-5 py-2.5 border border-white/20">
                <svg
                  className="w-5 h-5 text-accent-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
                <span className="text-white font-semibold">
                  {subcategoryData.count || products.length} products
                </span>
              </div>
              {parentCategory && (
                <Link
                  href={`/${locale}/categories/${parentCategory.slug}`}
                  className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-5 py-2.5 border border-white/20 hover:bg-white/20 transition-all"
                >
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  <span className="text-white font-medium">
                    Back to {parentCategory.name}
                  </span>
                </Link>
              )}
            </div>
          </div>
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
            {/* Sort Controls */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-200">
              <p className="text-sm text-neutral-600">
                {products.length} {products.length === 1 ? 'product' : 'products'}
              </p>
              <ProductSortDropdown />
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
