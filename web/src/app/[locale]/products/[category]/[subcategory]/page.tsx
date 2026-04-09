import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/lib/navigation';
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
import Breadcrumbs from '@/components/products/ProductPage/Breadcrumbs';
import { getSubcategoryBreadcrumbs, breadcrumbsToSchemaOrg } from '@/lib/navigation/breadcrumbs';
import { getCategoryIcon, getCategoryIconName } from '@/lib/constants/category-icons';
import {
  getCategoryTranslationKey,
  getSubcategoryTranslationKey,
} from '@/lib/categoryTranslations';

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

export async function generateMetadata({ params }: SubcategoryPageProps): Promise<Metadata> {
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

export default async function SubcategoryPage({ params, searchParams }: SubcategoryPageProps) {
  const { category, subcategory, locale } = await params;
  const filters = await searchParams;
  const t = await getTranslations({ locale, namespace: 'subcategoryPage' });
  const tCategories = await getTranslations({ locale, namespace: 'productsPage.categories' });
  const tSubcategories = await getTranslations({ locale, namespace: 'productsPage.subcategories' });
  const tBreadcrumb = await getTranslations({ locale, namespace: 'productPage.breadcrumb' });

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

  // Get translated category name
  const getTranslatedCategoryName = (wordpressName: string | null | undefined): string => {
    if (!wordpressName) return tBreadcrumb('products');
    const key = getCategoryTranslationKey(wordpressName);
    if (key) {
      return tCategories(`${key}.name`);
    }
    return wordpressName;
  };

  // Get translated subcategory name
  const getTranslatedSubcategoryName = (wordpressName: string | null | undefined): string => {
    if (!wordpressName) return '';
    const key = getSubcategoryTranslationKey(wordpressName);
    if (key) {
      return tSubcategories(`${key}.name`);
    }
    return wordpressName;
  };

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
  
  // Get translated names
  const translatedCategoryName = parentCategory
    ? getTranslatedCategoryName(parentCategory.name)
    : '';
  const translatedSubcategoryName = getTranslatedSubcategoryName(subcategoryData.name);

  let breadcrumbs;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bapi.com';

  if (parentCategory) {
    breadcrumbs = getSubcategoryBreadcrumbs(
      translatedCategoryName,
      parentCategory.slug || '',
      translatedSubcategoryName,
      subcategory,
      {
        locale,
        labels: {
          home: t('breadcrumb.home'),
          products: t('breadcrumb.products'),
        },
      }
    );
  } else {
    // Fallback if no parent category
    breadcrumbs = [
      { label: t('breadcrumb.home'), href: `/${locale}` },
      { label: t('breadcrumb.products'), href: `/${locale}/products` },
      { label: translatedSubcategoryName },
    ];
  }

  const schema = breadcrumbsToSchemaOrg(breadcrumbs, siteUrl);

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumbs */}
      <div className="border-b border-neutral-200">
        <div className="mx-auto max-w-container px-4 py-4">
          <Breadcrumbs items={breadcrumbs} schema={schema} />
        </div>
      </div>

      {/* Category Header with BAPI Gradient */}
      <div className="bg-linear-to-br relative border-b-4 border-accent-500 from-primary-700 via-primary-600 to-primary-500">
        <div className="bg-linear-to-r absolute inset-0 from-transparent via-white/5 to-transparent" />
        <div className="relative mx-auto max-w-container px-4 py-12">
          <div className="max-w-4xl">
            <h1 className="mb-4 text-4xl font-bold text-white drop-shadow-lg md:text-5xl">
              {translatedSubcategoryName}
            </h1>
            {subcategoryData.description && (
              <p className="max-w-2xl text-lg leading-relaxed text-white/95 drop-shadow-md">
                {subcategoryData.description}
              </p>
            )}
            <div className="mt-6 flex flex-wrap items-center gap-4">
              {/* BAPI Category Icon Badge */}
              <div className="bg-linear-to-br inline-flex items-center gap-3 rounded-full border border-white/20 from-white/10 to-white/5 px-5 py-2.5 backdrop-blur-sm">
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-white/20">
                  <Image
                    src={getCategoryIcon(parentCategory?.slug || category)}
                    alt={`${getCategoryIconName(parentCategory?.slug || category)} icon`}
                    width={16}
                    height={16}
                    className="object-contain"
                  />
                </div>
                <span className="text-sm font-medium text-white">
                  {translatedCategoryName || translatedSubcategoryName}
                </span>
              </div>
              {parentCategory && (
                <Link
                  href={`/products/${parentCategory.slug}`}
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 backdrop-blur-sm transition-all hover:bg-white/20"
                >
                  <svg
                    className="h-4 w-4 text-white"
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
                  <span className="font-medium text-white">{t('backTo', { categoryName: translatedCategoryName })}</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content: Filters + Products */}
      <div className="mx-auto max-w-container px-4 py-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Sidebar Filters (Desktop) */}
          <aside className="hidden w-64 shrink-0 lg:block">
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
          <div className="min-w-0 flex-1">
            {/* Sort Controls */}
            <div className="mb-6 flex items-center justify-between border-b border-neutral-200 pb-4">
              <p className="text-sm text-neutral-700">
                {products.length} {products.length === 1 ? 'product' : 'products'}
              </p>
              <ProductSortDropdown />
            </div>

            {/* Product Grid with Client-Side Filtering */}
            <Suspense
              fallback={
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-96 animate-pulse rounded-xl bg-neutral-100" />
                  ))}
                </div>
              }
            >
              <FilteredProductGrid products={products} locale={locale} />
            </Suspense>

            {/* Pagination (Coming soon) */}
            {hasNextPage && (
              <div className="mt-8 text-center text-sm text-neutral-700">
                More products available...
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Button (Fixed Bottom) */}
      <div className="z-dropdown fixed bottom-0 left-0 right-0 border-t border-neutral-200 bg-white p-4 shadow-lg lg:hidden">
        <MobileFilterButton
          categorySlug={subcategory}
          products={products}
          currentFilters={filters}
        />
      </div>
    </div>
  );
}
