import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/lib/navigation';
import Image from 'next/image';
import logger from '@/lib/logger';
import { getGraphQLClient } from '@/lib/graphql/client';
import {
  GetProductCategoryWithChildrenDocument,
  GetProductCategoryWithChildrenQuery,
  GetProductsWithFiltersDocument,
  GetProductsWithFiltersQuery,
} from '@/lib/graphql/generated';
import Breadcrumbs from '@/components/products/ProductPage/Breadcrumbs';
import { getCategoryBreadcrumbs, breadcrumbsToSchemaOrg } from '@/lib/navigation/breadcrumbs';
import { ProductFilters } from '@/components/products/ProductFilters';
import { MobileFilterButton } from '@/components/products/MobileFilterButton';
import FilteredProductGrid from '@/components/products/FilteredProductGrid';
import ProductSortDropdown from '@/components/products/ProductSortDropdown';
import { getCategoryIcon, getCategoryIconName } from '@/lib/constants/category-icons';
import {
  getCategoryTranslationKey,
  getSubcategoryTranslationKey,
} from '@/lib/categoryTranslations';
import WirelessCategoryHero from '@/components/category/WirelessCategoryHero';
import WirelessBenefits from '@/components/category/WirelessBenefits';
import WirelessCTA from '@/components/category/WirelessCTA';

interface CategoryPageProps {
  params: Promise<{
    locale: string;
    category: string;
  }>;
  searchParams: Promise<Record<string, string | undefined>>;
}

/**
 * Generates metadata for category pages including title and description.
 * @param root0 - Component props
 * @param root0.params - Category page parameters containing locale and category slug
 * @returns Metadata object for Next.js
 */
export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category, locale } = await params;
  const t = await getTranslations({ locale });
  const client = getGraphQLClient(['product-categories'], true);

  try {
    const data = await client.request<GetProductCategoryWithChildrenQuery>(
      GetProductCategoryWithChildrenDocument,
      { slug: category }
    );

    const categoryData = data.productCategory;
    if (!categoryData) {
      return {
        title: t('categoryPage.meta.notFound'),
      };
    }

    return {
      title: categoryData.name,
      description:
        categoryData.description ||
        t('categoryPage.meta.descriptionTemplate', { name: categoryData.name || '' }),
    };
  } catch {
    return {
      title: t('categoryPage.meta.notFound'),
    };
  }
}

/**
 * Category page component displaying subcategories or products with context-aware filtering.
 * Fetches category hierarchy and products (with taxonomy fields for filter extraction) from GraphQL.
 * Filters are extracted dynamically from products in the current category.
 *
 * @param root0 - Component props
 * @param root0.params - Category page parameters containing locale and category slug
 * @param root0.searchParams - URL search parameters for filters, sort, and pagination
 * @returns JSX.Element
 */
export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { category, locale } = await params;
  const filters = await searchParams;
  const t = await getTranslations({ locale });
  const tCategories = await getTranslations({ locale, namespace: 'productsPage.categories' });
  const tSubcategories = await getTranslations({ locale, namespace: 'productsPage.subcategories' });
  const tBreadcrumb = await getTranslations({ locale, namespace: 'productPage.breadcrumb' });
  
  // Use comprehensive cache tags for precise revalidation
  const client = getGraphQLClient(['products', 'product-categories', `category-${category}`], true);

  const data = await client.request<GetProductCategoryWithChildrenQuery>(
    GetProductCategoryWithChildrenDocument,
    { slug: category }
  );

  const categoryData = data.productCategory;

  if (!categoryData) {
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

  const translatedCategoryName = getTranslatedCategoryName(categoryData.name);

  // Filter subcategories to only include valid entries with required fields
  // Exclude WAM subcategory as it has no products and is shown separately on dedicated WAM page
  const subcategories = (categoryData.children?.nodes || []).filter(
    (sub): sub is NonNullable<typeof sub> & { name: string; slug: string } =>
      !!sub && 
      !!sub.name && 
      !!sub.slug &&
      !sub.slug.includes('wam') // Exclude WAM subcategory
  );
  const hasSubcategories = subcategories.length > 0;

  // Type-safe product array from GraphQL
  type ProductNode = NonNullable<GetProductsWithFiltersQuery['products']>['nodes'][number];
  const products: ProductNode[] = [];

  // Fetch products if category has no subcategories (leaf category)
  if (!hasSubcategories) {
    try {
      // Paginate through products with smaller batch size to prevent memory exhaustion
      let after: string | null = null;
      let hasNextPage = true;

      while (hasNextPage && products.length < 1000) {
        const productsData: GetProductsWithFiltersQuery = await client.request<GetProductsWithFiltersQuery>(
          GetProductsWithFiltersDocument,
          {
            categorySlug: category,
            first: 24,  // WooCommerce standard, safe with WP_MAX_MEMORY_LIMIT=512M
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

      if (products.length >= 1000) {
        logger.warn('Category hit 1000 product limit', {
          categoryName: categoryData.name,
          categorySlug: category,
          productCount: products.length,
          locale,
        });
      }
    } catch (error) {
      logger.error('Failed to fetch products for category', error, {
        categorySlug: category,
        categoryName: categoryData.name,
        locale,
      });
    }
  }

  // Generate breadcrumbs with i18n support
  const parent = categoryData.parent?.node
    ? {
        name: getTranslatedCategoryName(categoryData.parent.node.name),
        slug: categoryData.parent.node.slug || '',
        parent: categoryData.parent.node.parent?.node
          ? {
              name: getTranslatedCategoryName(categoryData.parent.node.parent.node.name),
              slug: categoryData.parent.node.parent.node.slug || '',
            }
          : undefined,
      }
    : undefined;

  const breadcrumbs = getCategoryBreadcrumbs(
    translatedCategoryName,
    category,
    {
      locale,
      includeHome: true,
      labels: {
        home: t('categoryPage.breadcrumb.home'),
        products: t('categoryPage.breadcrumb.products'),
      },
    },
    parent
  );

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bapi.com';
  const schema = breadcrumbsToSchemaOrg(breadcrumbs, siteUrl, locale);

  // Check if this is the bluetooth-wireless category for enhanced layout
  const isWirelessCategory = category === 'bluetooth-wireless';

  // Prepare wireless-specific translations (only load if needed)
  const wirelessTranslations = isWirelessCategory
    ? {
        hero: {
          title: 'Wireless Sensors',
          subtitle: 'No Wiring. No Limits.',
          description:
            'Battery-powered sensors with 5+ year battery life. Easy installation for retrofit, hard-to-reach locations, and temporary monitoring.',
          browseCTA: 'Browse Products',
          quoteCTA: 'Request Quote',
        },
        benefits: {
          benefit1Title: 'No Wiring',
          benefit1Text: 'Install anywhere without running cables',
          benefit2Title: '5+ Year Battery',
          benefit2Text: 'Long-lasting power, low maintenance',
          benefit3Title: 'Cloud Ready',
          benefit3Text: 'Integrate with BMS and cloud platforms',
          benefit4Title: 'Easy Install',
          benefit4Text: 'Mount in minutes, configure remotely',
        },
        cta: {
          title: 'Need help choosing the right wireless sensor?',
          description: "Talk to our technical experts. We'll help you find the perfect solution.",
          contactCTA: 'Contact Sales',
          viewAllCTA: 'View All Products',
        },
      }
    : null;

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumbs - Always shown */}
      <div className="bg-linear-to-br relative overflow-hidden from-primary-600 to-primary-800">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-[url('/images/patterns/grid.svg')] opacity-10" />
        
        <div className="relative mx-auto max-w-content px-4 py-6">
          <Breadcrumbs items={breadcrumbs} schema={schema} variant="gradient" />
        </div>
      </div>

      {/* Conditional Wireless Hero OR Standard Category Header */}
      {isWirelessCategory && wirelessTranslations ? (
        <>
          {/* Enhanced Wireless Category Hero */}
          <WirelessCategoryHero locale={locale} translations={wirelessTranslations.hero} />

          {/* Wireless Benefits Bar */}
          <WirelessBenefits translations={wirelessTranslations.benefits} />
        </>
      ) : (
        /* Standard Category Header */
        <div className="bg-linear-to-br relative border-b-4 border-accent-500 from-primary-700 via-primary-600 to-primary-500">
          <div className="bg-linear-to-r absolute inset-0 from-transparent via-primary-500/10 to-transparent" />
          <div className="relative mx-auto max-w-content px-4 py-8">
            <div className="max-w-3xl">
              <div className="mb-2 flex items-center gap-3">
                {/* BAPI Category Icon Badge */}
                <div className="bg-linear-to-br inline-flex shrink-0 items-center justify-center rounded-xl from-white/20 to-white/10 p-2.5 shadow-md backdrop-blur-sm">
                  <Image
                    src={getCategoryIcon(category)}
                    alt={`${getCategoryIconName(category)} icon`}
                    width={32}
                    height={32}
                    className="object-contain drop-shadow-md"
                  />
                </div>
                <h1 className="text-4xl font-bold text-white drop-shadow-lg md:text-5xl">
                  {translatedCategoryName}
                </h1>
              </div>
              {categoryData.description && (
                <p className="text-lg leading-relaxed text-white/95 drop-shadow-md">
                  {categoryData.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Subcategories Grid (shown for all categories with subcategories) */}
      {hasSubcategories && (
        <div id="categories" className="mx-auto max-w-container px-4 py-12">
          <h2 className="mb-8 text-2xl font-bold text-neutral-900">
            {t('categoryPage.subcategories.title')}
          </h2>
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {subcategories
              .filter((sub) => {
                // For bluetooth-wireless category, filter out specific subcategories
                if (category === 'bluetooth-wireless') {
                  const excludedSlugs = [
                    'wireless-gateway', // Gateway is WAM-only
                    'wireless-receivers-bluetooth-wireless', // Will be combined with Output Modules
                    'wireless-output-modules-bluetooth-wireless', // Will be combined with Receivers
                    'wireless-food-probe', // Food Probe moved to Non-Room Sensors
                  ];
                  return !excludedSlugs.includes(sub.slug || '');
                }
                return true;
              })
              .map((subcategory, index) => {
              const translatedSubcategoryName = getTranslatedSubcategoryName(subcategory.name);
              
              return (
              <Link
                key={subcategory.id}
                href={`/products/${category}/${subcategory.slug}`}
                className="group relative overflow-hidden rounded-2xl border-2 border-neutral-200 bg-white transition-all duration-300 hover:-translate-y-2 hover:border-primary-500 hover:shadow-2xl"
              >
                {/* BAPI Gradient Top Border */}
                <div className="bg-linear-to-r absolute left-0 top-0 h-1 w-full from-primary-400 via-primary-600 to-primary-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                {/* Subtle gradient overlay on hover */}
                <div className="bg-linear-to-br pointer-events-none absolute inset-0 from-primary-50/0 to-primary-100/0 transition-all duration-300 group-hover:from-primary-50/20 group-hover:to-primary-100/10" />

                {/* Subcategory Image - Compact aspect */}
                {subcategory.image?.sourceUrl ? (
                  <div className="bg-linear-to-br relative aspect-[3/2] from-neutral-50 to-neutral-100">
                    <Image
                      src={subcategory.image.sourceUrl}
                      alt={subcategory.image.altText || translatedSubcategoryName}
                      fill
                      className="object-contain p-3 transition-transform duration-500 ease-out group-hover:scale-110"
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      priority={index < 2}
                    />
                  </div>
                ) : (
                  <div className="bg-linear-to-br relative flex aspect-[4/3] items-center justify-center from-primary-50 via-white to-primary-50">
                    <span className="text-xl font-semibold text-primary-600">
                      {translatedSubcategoryName}
                    </span>
                  </div>
                )}

                {/* Subcategory Info */}
                <div className="relative z-10 bg-white p-4">
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <h3 className="mb-2 text-2xl font-bold text-neutral-900 transition-colors group-hover:text-primary-600">
                        {translatedSubcategoryName}
                      </h3>
                    </div>
                  </div>

                  {subcategory.description && (
                    <p className="mb-6 line-clamp-3 text-base leading-relaxed text-neutral-700">
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
                       
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </div>
                </div>
              </Link>
            );
            })}
            
            {/* Custom "Receiver and Output Modules" card for bluetooth-wireless */}
            {category === 'bluetooth-wireless' && (
              <Link
                href={`/products/${category}`}
                className="group relative overflow-hidden rounded-2xl border-2 border-neutral-200 bg-white transition-all duration-300 hover:-translate-y-2 hover:border-primary-500 hover:shadow-2xl"
              >
                {/* BAPI Gradient Top Border */}
                <div className="bg-linear-to-r absolute left-0 top-0 h-1 w-full from-primary-400 via-primary-600 to-primary-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                {/* Subtle gradient overlay on hover */}
                <div className="bg-linear-to-br pointer-events-none absolute inset-0 from-primary-50/0 to-primary-100/0 transition-all duration-300 group-hover:from-primary-50/20 group-hover:to-primary-100/10" />

                {/* Placeholder Image */}
                <div className="bg-linear-to-br relative flex aspect-[3/2] items-center justify-center from-primary-50 via-white to-primary-50">
                  <span className="text-xl font-semibold text-primary-600">
                    Receiver and Output Modules
                  </span>
                </div>

                {/* Subcategory Info */}
                <div className="relative z-10 bg-white p-4">
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <h3 className="mb-2 text-2xl font-bold text-neutral-900 transition-colors group-hover:text-primary-600">
                        Receiver and Output Modules
                      </h3>
                    </div>
                  </div>

                  <p className="mb-6 line-clamp-3 text-base leading-relaxed text-neutral-700">
                    Wireless receivers, analog and digital output modules
                  </p>

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
                       
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </div>
                </div>
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Product Grid for Leaf Categories (no subcategories) */}
      {!hasSubcategories && (
        <div className="mx-auto max-w-content px-4 py-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
            {/* Desktop Sidebar Filters */}
            <aside className="hidden lg:block">
              <div className="sticky top-4">
                <ProductFilters
                  categorySlug={category}
                  products={products}
                  currentFilters={filters}
                />
              </div>
            </aside>

            {/* Main Content */}
            <div className="space-y-6">
              {/* Mobile Filter Button */}
              <div className="lg:hidden">
                <MobileFilterButton
                  categorySlug={category}
                  products={products}
                  currentFilters={filters}
                />
              </div>

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

      {/* Bottom CTA - Wireless category gets enhanced CTA, others get standard quick links */}
      {isWirelessCategory && wirelessTranslations ? (
        <WirelessCTA locale={locale} translations={wirelessTranslations.cta} />
      ) : (
        <div className="border-t border-neutral-200 bg-neutral-50">
          <div className="mx-auto max-w-content px-4 py-8">
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/products"
                className="text-sm text-neutral-700 transition-colors hover:text-primary-500"
              >
                {t('categoryPage.quickLinks.backToProducts')}
              </Link>
              <span className="text-neutral-300">|</span>
              <Link
                href="/contact"
                className="text-sm text-neutral-700 transition-colors hover:text-primary-500"
              >
                {t('categoryPage.quickLinks.needHelp')}
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
