import { Metadata } from 'next';
import { notFound } from 'next/navigation';
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
import PageContainer from '@/components/layout/PageContainer';
import PageHeader from '@/components/layout/PageHeader';
import { getSubcategoryBreadcrumbs, breadcrumbsToSchemaOrg } from '@/lib/navigation/breadcrumbs';
import { getCategoryIcon } from '@/lib/constants/category-icons';
import {
  getCategoryTranslationKey,
  getSubcategoryTranslationKey,
} from '@/lib/categoryTranslations';
import { getProductCategorySupplement } from '@/lib/productCategorySupplements';

// ISR configuration - revalidate category pages every hour
// Critical for performance: reduces GraphQL query latency on cached pages
export const revalidate = 3600;

interface SubcategoryPageProps {
  params: Promise<{
    locale: string;
    category: string;
    subcategory: string;
  }>;
  searchParams: Promise<Record<string, string | undefined>>;
}

export async function generateMetadata({ params }: SubcategoryPageProps): Promise<Metadata> {
  const { locale, subcategory } = await params;
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
    // Use translation key for i18n support
    const tSubcategories = await getTranslations({ locale, namespace: 'productsPage.subcategories' });
    const pageTitle = subcategory === 'wireless-receivers-bluetooth-wireless'
      ? tSubcategories('wirelessReceiversBluetoothWireless.name')
      : categoryData.name;

    return {
      title: pageTitle,
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
  const isCombinedWirelessCategory = subcategory === 'wireless-receivers-bluetooth-wireless';
  const categorySupplement = getProductCategorySupplement(subcategory);
  const categoriesToFetch: Array<{
    slug: string;
    allowedProductSlugs?: readonly string[];
  }> = isCombinedWirelessCategory
    ? [
        { slug: 'wireless-receivers-bluetooth-wireless' },
        { slug: 'wireless-output-modules-bluetooth-wireless' },
      ]
    : [
        { slug: subcategory },
        ...(categorySupplement
          ? [
              {
                slug: categorySupplement.sourceCategorySlug,
                allowedProductSlugs: categorySupplement.productSlugs,
              },
            ]
          : []),
      ];
  const productIds = new Set<string>();

  // Middle-level categories are navigation hubs; leaf categories own product listings.
  if (!hasSubSubcategories || isCombinedWirelessCategory) {
    for (const categoryToFetch of categoriesToFetch) {
      let after: string | null = null;
      let hasNextPage = true;

      while (hasNextPage && products.length < 1000) {
        const productsData: GetProductsWithFiltersQuery = await client.request<GetProductsWithFiltersQuery>(
          GetProductsWithFiltersDocument,
          {
            categorySlug: categoryToFetch.slug,
            productSlugs: categoryToFetch.allowedProductSlugs,
            first: 24, // WooCommerce standard, safe with WP_MAX_MEMORY_LIMIT=512M
            after: after || undefined,
          }
        );

        const pageNodes = productsData.products?.nodes || [];
        const matchingNodes = categoryToFetch.allowedProductSlugs
          ? pageNodes.filter(
              (product) =>
                product.slug && categoryToFetch.allowedProductSlugs?.includes(product.slug)
            )
          : pageNodes;

        for (const product of matchingNodes) {
          if (!productIds.has(product.id)) {
            products.push(product);
            productIds.add(product.id);
          }
        }

        hasNextPage = productsData.products?.pageInfo?.hasNextPage ?? false;
        after = productsData.products?.pageInfo?.endCursor ?? null;

        // Safety guard: Stop if no valid cursor for next page
        if (!hasNextPage || !after) {
          break;
        }
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
    ? tSubcategories('wirelessReceiversBluetoothWireless.name')
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
      <PageHeader
        breadcrumbs={breadcrumbs}
        breadcrumbSchema={schema}
        title={translatedSubcategoryName}
        description={subcategoryData.description || undefined}
        eyebrow={
          <div className="inline-flex items-center gap-3 rounded-full bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur-sm">
            <Image
              src={getCategoryIcon(parentCategory?.slug || category)}
              alt=""
              width={24}
              height={24}
              className="object-contain"
            />
            {translatedCategoryName || translatedSubcategoryName}
          </div>
        }
        actions={
          parentCategory ? (
            <Link
              href={`/products/${parentCategory.slug}`}
              className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-5 py-2.5 font-medium text-white backdrop-blur-sm hover:bg-white/20"
            >
              {t('backTo', { categoryName: translatedCategoryName })}
            </Link>
          ) : undefined
        }
      />

      {/* Sub-Subcategories Grid (middle-level categories like Room > BAPI-Stat, Delta Style…) */}
      {hasSubSubcategories && (
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-2xl font-bold text-neutral-900">
            {t('subcategories.title')}
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
                  className="group relative overflow-hidden rounded-2xl border-2 border-neutral-200 bg-white transition-all duration-300 hover:border-primary-500 hover:shadow-2xl"
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
                        className="object-contain p-3"
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
                    <div className="bg-bapi-primary-gradient inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-shadow duration-300 group-hover:shadow-lg">
                      <span>{t('subcategories.browseButton')}</span>
                      <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
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
                className="group relative overflow-hidden rounded-2xl border-2 border-neutral-200 bg-white transition-all duration-300 hover:border-primary-500 hover:shadow-2xl"
              >
                {/* BAPI Gradient Top Border */}
                <div className="bg-linear-to-r absolute left-0 top-0 h-1 w-full from-primary-400 via-primary-600 to-primary-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                {/* Product Image */}
                <div className="bg-linear-to-br relative aspect-[3/2] from-neutral-50 to-neutral-100">
                  <Image
                    src="/images/wireless/wireless-receiver-with-output-modules.webp"
                    alt="Receiver and Output Modules"
                    fill
                    className="object-contain p-3"
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
                  <div className="bg-bapi-primary-gradient inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-shadow duration-300 group-hover:shadow-lg">
                    <span>{t('subcategories.browseButton')}</span>
                    <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Main Content: Filters + Products (leaf categories only) */}
      {hasProducts && (
        <PageContainer size="site" className="py-8">
          <div className={`grid grid-cols-1 gap-4 ${subcategory === 'wireless-receivers-bluetooth-wireless' ? '' : 'lg:grid-cols-[256px_minmax(0,1fr)]'}`}>
            {/* Desktop Sidebar Filters (hidden for wireless receivers) */}
            {subcategory !== 'wireless-receivers-bluetooth-wireless' && (
              <aside className="hidden lg:block">
                <div className="sticky top-24">
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
        </PageContainer>
      )}
      
      {/* Fallback if no products */}
      {!hasProducts && !hasSubSubcategories && (
        <PageContainer size="site" className="py-12 text-center">
          <p className="text-neutral-700">{t('noProducts')}</p>
        </PageContainer>
      )}
    </div>
  );
}
