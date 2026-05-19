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
  searchParams: Promise<Record<string, string | undefined>>;
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

    // Override title for combined wireless receivers page
    const pageTitle = subcategory === 'wireless-receivers-bluetooth-wireless'
      ? 'Receiver and Output Modules'
      : categoryData.name;

    return {
      title: `${pageTitle} | BAPI`,
      description:
        categoryData.description ||
        `Browse ${pageTitle} from BAPI - Building Automation Products Inc.`,
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

  // Check if this is a middle-level category with its own sub-subcategories
  const subSubcategories = (subcategoryData.children?.nodes || []).filter(
    (sub): sub is NonNullable<typeof sub> & { name: string; slug: string } =>
      !!sub && !!sub.name && !!sub.slug
  );
  const hasSubSubcategories = subSubcategories.length > 0;

  // Type-safe product array from GraphQL
  type ProductNode = NonNullable<GetProductsWithFiltersQuery['products']>['nodes'][number];
  const products: ProductNode[] = [];

  // For wireless receivers, combine both receivers AND output modules
  const categoriesToFetch = subcategory === 'wireless-receivers-bluetooth-wireless'
    ? ['wireless-receivers-bluetooth-wireless', 'wireless-output-modules-bluetooth-wireless']
    : [subcategory];

  // Fetch products from all relevant categories
  for (const categorySlug of categoriesToFetch) {
    let after: string | null = null;
    let hasNextPage = true;

    while (hasNextPage && products.length < 1000) {
      const productsData: GetProductsWithFiltersQuery = await client.request<GetProductsWithFiltersQuery>(
        GetProductsWithFiltersDocument,
        {
          categorySlug: categorySlug,
          first: 24, // WooCommerce standard, safe with WP_MAX_MEMORY_LIMIT=512M
          after: after || undefined,
        }
      );

      const pageNodes = productsData.products?.nodes || [];
      products.push(...pageNodes);

      hasNextPage = productsData.products?.pageInfo?.hasNextPage ?? false;
      after = productsData.products?.pageInfo?.endCursor ?? null;

      // Safety guard: Stop if no valid cursor for next page
      if (!hasNextPage || !after) {
        break;
      }
    }
  }

  const hasProducts = products.length > 0;

  // Build breadcrumb trail
  const parentCategory = subcategoryData.parent?.node;
  
  // Get translated names
  const translatedCategoryName = parentCategory
    ? getTranslatedCategoryName(parentCategory.name)
    : '';
  const translatedSubcategoryName = subcategory === 'wireless-receivers-bluetooth-wireless'
    ? 'Receiver and Output Modules'
    : getTranslatedSubcategoryName(subcategoryData.name);

  let breadcrumbs;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bapi.com';

  if (parentCategory) {
    const grandparent = parentCategory.parent?.node
      ? {
          name: getTranslatedCategoryName(parentCategory.parent.node.name),
          slug: parentCategory.parent.node.slug || '',
        }
      : undefined;

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
      },
      grandparent
    );
  } else {
    // Fallback if no parent category - treat subcategory as root
    breadcrumbs = [
      { label: t('breadcrumb.home'), href: '/' },
      { label: translatedSubcategoryName },
    ];
  }

  const schema = breadcrumbsToSchemaOrg(breadcrumbs, siteUrl, locale);

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumbs with Blue Gradient Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-600 to-primary-800 border-b border-primary-700">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-[url('/images/patterns/grid.svg')] opacity-10" />
        
        <div className="relative mx-auto max-w-container px-4 py-6">
          <Breadcrumbs items={breadcrumbs} schema={schema} variant="gradient" />
        </div>
      </div>

      {/* Category Header with BAPI Gradient */}
      <div className="bg-linear-to-br relative border-b-4 border-accent-500 from-primary-700 via-primary-600 to-primary-500">
        <div className="bg-linear-to-r absolute inset-0 from-transparent via-white/5 to-transparent" />
        <div className="relative mx-auto max-w-container px-4 py-8">
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

      {/* Sub-Subcategories Grid (middle-level categories like Room > BAPI-Stat, Delta Style…) */}
      {hasSubSubcategories && (
        <div className="mx-auto max-w-content px-4 py-12">
          <h2 className="mb-8 text-2xl font-bold text-neutral-900">
            {t('subcategories.title')}
          </h2>
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {subSubcategories
              .filter((subSub) => {
                // For bluetooth-wireless subcategory, filter out specific sub-subcategories
                if (subcategory === 'bluetooth-wireless') {
                  const excludedSlugs = [
                    'wireless-gateway', // Gateway is WAM-only
                    'wireless-receivers-bluetooth-wireless', // Will be combined with Output Modules
                    'wireless-output-modules-bluetooth-wireless', // Will be combined with Receivers
                    'wireless-food-probe', // Food Probe moved to Non-Room Sensors
                  ];
                  return !excludedSlugs.includes(subSub.slug || '');
                }
                return true;
              })
              .map((subSub, index) => {
              const translatedName = getTranslatedSubcategoryName(subSub.name);
              return (
                <Link
                  key={subSub.id}
                  href={`/products/${subcategory}/${subSub.slug}`}
                  className="group relative overflow-hidden rounded-2xl border-2 border-neutral-200 bg-white transition-all duration-300 hover:-translate-y-2 hover:border-primary-500 hover:shadow-2xl"
                >
                  {/* BAPI Gradient Top Border */}
                  <div className="bg-linear-to-r absolute left-0 top-0 h-1 w-full from-primary-400 via-primary-600 to-primary-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  {/* Subcategory Image */}
                  {subSub.image?.sourceUrl ? (
                    <div className="bg-linear-to-br relative aspect-[3/2] from-neutral-50 to-neutral-100">
                      <Image
                        src={subSub.image.sourceUrl}
                        alt={subSub.image.altText || translatedName}
                        fill
                        className="object-contain p-3 transition-transform duration-500 ease-out group-hover:scale-110"
                        sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                        priority={index < 4}
                      />
                    </div>
                  ) : (
                    <div className="relative flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-50">
                      <span className="text-xl font-semibold text-primary-600">{translatedName}</span>
                    </div>
                  )}

                  {/* Info */}
                  <div className="relative z-10 bg-white p-4">
                    <h3 className="mb-3 text-xl font-bold text-neutral-900 transition-colors group-hover:text-primary-600">
                      {translatedName}
                    </h3>
                    {subSub.description && (
                      <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-neutral-700">
                        {subSub.description}
                      </p>
                    )}
                    <div className="bg-bapi-primary-gradient inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg">
                      <span>{t('subcategories.browseButton')}</span>
                      <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </Link>
              );
            })}
            
            {/* Custom "Receiver and Output Modules" card for bluetooth-wireless */}
            {subcategory === 'bluetooth-wireless' && (
              <Link
                href={`/products/${subcategory}/wireless-receivers-bluetooth-wireless`}
                className="group relative overflow-hidden rounded-2xl border-2 border-neutral-200 bg-white transition-all duration-300 hover:-translate-y-2 hover:border-primary-500 hover:shadow-2xl"
              >
                {/* BAPI Gradient Top Border */}
                <div className="bg-linear-to-r absolute left-0 top-0 h-1 w-full from-primary-400 via-primary-600 to-primary-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                {/* Product Image */}
                <div className="bg-linear-to-br relative aspect-[3/2] from-neutral-50 to-neutral-100">
                  <Image
                    src="/images/wireless/wireless-receiver-with-output-modules.png"
                    alt="Receiver and Output Modules"
                    fill
                    className="object-contain p-3 transition-transform duration-500 ease-out group-hover:scale-110"
                    sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                  />
                </div>

                {/* Info */}
                <div className="relative z-10 bg-white p-4">
                  <h3 className="mb-3 text-xl font-bold text-neutral-900 transition-colors group-hover:text-primary-600">
                    Receiver and Output Modules
                  </h3>
                  <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-neutral-700">
                    Wireless receivers, analog and digital output modules
                  </p>
                  <div className="bg-bapi-primary-gradient inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg">
                    <span>{t('subcategories.browseButton')}</span>
                    <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Main Content: Filters + Products (shown when category has products, even if it also has subcategories) */}
      {hasProducts && (
        <div className="mx-auto max-w-content px-4 py-8">
          <div className={`grid grid-cols-1 gap-8 ${subcategory === 'wireless-receivers-bluetooth-wireless' ? '' : 'lg:grid-cols-[280px_1fr]'}`}>
            {/* Desktop Sidebar Filters (hidden for wireless receivers) */}
            {subcategory !== 'wireless-receivers-bluetooth-wireless' && (
              <aside className="hidden lg:block">
                <div className="sticky top-4">
                  <ProductFilters
                    categorySlug={subcategory}
                    products={products}
                    currentFilters={filters}
                  />
                </div>
              </aside>
            )}

            {/* Main Content */}
            <div className="space-y-6">
              {/* Mobile Filter Button (hidden for wireless receivers) */}
              {subcategory !== 'wireless-receivers-bluetooth-wireless' && (
                <div className="lg:hidden">
                  <MobileFilterButton
                    categorySlug={subcategory}
                    products={products}
                    currentFilters={filters}
                  />
                </div>
              )}

              {/* Product Sort */}
              <div className="flex justify-end border-b border-neutral-200 pb-4">
                <ProductSortDropdown />
              </div>

              {/* Product Grid */}
              <FilteredProductGrid products={products} locale={locale} />
            </div>
          </div>
        </div>
      )}
      
      {/* Fallback if no products */}
      {!hasProducts && !hasSubSubcategories && (
        <div className="mx-auto max-w-container px-4 py-12 text-center">
          <p className="text-neutral-700">{t('noProducts')}</p>
        </div>
      )}
    </div>
  );
}
