import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import Image from 'next/image';
import { Suspense } from 'react';
import { getGraphQLClient } from '@/lib/graphql/client';
import {
  GetProductCategoryWithChildrenDocument,
  GetProductCategoryWithChildrenQuery,
  GetProductsWithFiltersDocument,
  GetProductsWithFiltersQuery,
} from '@/lib/graphql/generated';
import Breadcrumbs from '@/components/products/ProductPage/Breadcrumbs';
import { getCategoryBreadcrumbs, breadcrumbsToSchemaOrg } from '@/lib/navigation/breadcrumbs';
import FilteredProductGrid from '@/components/products/FilteredProductGrid';
import ProductSortDropdown from '@/components/products/ProductSortDropdown';
import { ProductFilters } from '@/components/products/ProductFilters';
import { MobileFilterButton } from '@/components/products/MobileFilterButton';

interface CategoryPageProps {
  params: Promise<{
    locale: string;
    slug: string;
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

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const t = await getTranslations({ locale });
  const client = getGraphQLClient(['product-categories'], true);

  try {
    const data = await client.request<GetProductCategoryWithChildrenQuery>(
      GetProductCategoryWithChildrenDocument,
      { slug }
    );

    const categoryData = data.productCategory;
    if (!categoryData) {
      return {
        title: t('categoryPage.meta.notFound'),
      };
    }

    return {
      title: `${categoryData.name} | BAPI`,
      description:
        categoryData.description ||
        t('categoryPage.meta.descriptionTemplate', { name: categoryData.name || '' }),
    };
  } catch (error) {
    return {
      title: t('categoryPage.meta.notFound'),
    };
  }
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug, locale } = await params;
  const filters = await searchParams;
  const t = await getTranslations({ locale });
  const client = getGraphQLClient(['product-categories'], true);

  const data = await client.request<GetProductCategoryWithChildrenQuery>(
    GetProductCategoryWithChildrenDocument,
    { slug }
  );

  const categoryData = data.productCategory;

  if (!categoryData) {
    notFound();
  }

  const subcategories = categoryData.children?.nodes || [];
  const hasSubcategories = subcategories.length > 0;

  // Fetch products if category has no subcategories (leaf category)
  let products: any[] = [];
  if (!hasSubcategories) {
    try {
      const productsData = await client.request<GetProductsWithFiltersQuery>(
        GetProductsWithFiltersDocument,
        {
          categorySlug: slug,
          first: 100,
        }
      );
      products = productsData.products?.nodes || [];
    } catch (error) {
      console.error('Failed to fetch products for category:', error);
    }
  }

  // Generate breadcrumbs with i18n support
  const breadcrumbs = getCategoryBreadcrumbs(
    categoryData.name || '',
    slug,
    {
      locale,
      includeHome: true,
      labels: {
        home: t('categoryPage.breadcrumb.home'),
        products: t('categoryPage.breadcrumb.products'),
      },
    }
  );

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bapi.com';
  const schema = breadcrumbsToSchemaOrg(breadcrumbs, siteUrl);

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumbs */}
      <div className="border-b border-neutral-200">
        <div className="mx-auto max-w-content px-4 py-4">
          <Breadcrumbs items={breadcrumbs} schema={schema} />
        </div>
      </div>

      {/* Category Header with BAPI Gradient */}
      <div className="relative border-b-4 border-accent-500 bg-gradient-to-br from-primary-600 via-primary-500 to-primary-600">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent-500/10 to-transparent" />
        <div className="relative mx-auto max-w-content px-4 py-16">
          <div className="max-w-3xl">
            <h1 className="mb-5 text-5xl font-bold text-white drop-shadow-lg md:text-6xl">
              {categoryData.name}
            </h1>
            {categoryData.description && (
              <p className="text-xl leading-relaxed text-white/95 drop-shadow-md">
                {categoryData.description}
              </p>
            )}
            <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-6 py-3 backdrop-blur-sm">
              <svg
                className="h-5 w-5 text-accent-300"
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
              <span className="font-semibold text-white">
                {t('categoryPage.header.productsAvailable', { count: categoryData.count || 0 })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Subcategories Grid */}
      {hasSubcategories && (
        <div className="mx-auto max-w-container px-4 py-12">
          <h2 className="mb-8 text-2xl font-bold text-neutral-900">{t('categoryPage.subcategories.title')}</h2>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2">
            {subcategories.map((subcategory) => (
              <Link
                key={subcategory.id}
                href={`/${locale}/products/${slug}/${subcategory.slug}`}
                className="group relative overflow-hidden rounded-2xl border-2 border-neutral-200 bg-white transition-all duration-300 hover:-translate-y-2 hover:border-primary-500 hover:shadow-2xl"
              >
                {/* BAPI Gradient Top Border */}
                <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-accent-500 via-primary-500 to-accent-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                {/* Subtle gradient overlay on hover */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary-50/0 to-accent-50/0 transition-all duration-300 group-hover:from-primary-50/20 group-hover:to-accent-50/10" />

                {/* Subcategory Image - Larger, square aspect */}
                {subcategory.image?.sourceUrl ? (
                  <div className="relative aspect-[4/3] bg-gradient-to-br from-neutral-50 to-neutral-100">
                    <Image
                      src={subcategory.image.sourceUrl}
                      alt={subcategory.image.altText || subcategory.name || ''}
                      fill
                      className="object-contain p-8 transition-transform duration-500 ease-out group-hover:scale-110"
                      sizes="(min-width: 768px) 50vw, 100vw"
                      priority
                    />
                  </div>
                ) : (
                  <div className="relative flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-primary-100 via-accent-100 to-primary-100">
                    <span className="text-xl font-semibold text-primary-600">
                      {subcategory.name}
                    </span>
                  </div>
                )}

                {/* Subcategory Info */}
                <div className="relative z-10 bg-white p-8">
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <h3 className="mb-2 text-2xl font-bold text-neutral-900 transition-colors group-hover:text-primary-600">
                        {subcategory.name}
                      </h3>
                      {subcategory.count !== null && (
                        <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary-100 to-accent-100 px-3 py-1">
                          <svg
                            className="h-4 w-4 text-primary-600"
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
                          <span className="text-sm font-semibold text-primary-700">
                            {subcategory.count === 1
                              ? t('categoryPage.subcategories.productCount', { count: subcategory.count || 0 })
                              : t('categoryPage.subcategories.productCountPlural', { count: subcategory.count || 0 })}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {subcategory.description && (
                    <p className="mb-6 line-clamp-3 text-base leading-relaxed text-neutral-600">
                      {subcategory.description}
                    </p>
                  )}

                  {/* Browse Button with Gradient */}
                  <div className="bg-bapi-primary-gradient inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg">
                    <span>{t('categoryPage.subcategories.browseButton')}</span>
                    <svg
                      className="h-4 w-4 transition-transform group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Product Grid for Leaf Categories (no subcategories) */}
      {!hasSubcategories && (
        <div className="mx-auto max-w-content px-4 py-12">
          <div className="flex flex-col gap-8 lg:flex-row">
            {/* Desktop Sidebar Filters */}
            <aside className="hidden shrink-0 lg:block lg:w-64">
              <div className="sticky top-4">
                <Suspense fallback={<div className="h-96 animate-pulse rounded-lg bg-neutral-100" />}>
                  <ProductFilters categorySlug={slug} products={products} currentFilters={filters} />
                </Suspense>
              </div>
            </aside>

            {/* Main Product Grid */}
            <div className="flex-1">
              {/* Sort Dropdown */}
              <div className="mb-6 flex items-center justify-between">
                <p className="text-sm text-neutral-600">
                  {t('categoryPage.products.showing', { count: products.length })}
                </p>
                <ProductSortDropdown />
              </div>

              {/* Product Grid with Filters */}
              <Suspense fallback={<div className="h-96 animate-pulse rounded-lg bg-neutral-100" />}>
                <FilteredProductGrid products={products} locale={locale} />
              </Suspense>
            </div>
          </div>

          {/* Mobile Filter Button */}
          <MobileFilterButton categorySlug={slug} products={products} currentFilters={filters} />
        </div>
      )}

      {/* Quick Links */}
      <div className="border-t border-neutral-200 bg-neutral-50">
        <div className="mx-auto max-w-content px-4 py-8">
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href={`/${locale}/products`}
              className="text-sm text-neutral-600 transition-colors hover:text-primary-500"
            >
              {t('categoryPage.quickLinks.backToProducts')}
            </Link>
            <span className="text-neutral-300">|</span>
            <Link
              href={`/${locale}/contact`}
              className="text-sm text-neutral-600 transition-colors hover:text-primary-500"
            >
              {t('categoryPage.quickLinks.needHelp')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
