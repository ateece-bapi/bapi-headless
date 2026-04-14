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
  GetProductAttributesDocument,
  GetProductAttributesQuery,
} from '@/lib/graphql/generated';
import Breadcrumbs from '@/components/products/ProductPage/Breadcrumbs';
import { getCategoryBreadcrumbs, breadcrumbsToSchemaOrg } from '@/lib/navigation/breadcrumbs';
import CategoryContent from '@/components/category/CategoryContent';
import { getCategoryIcon, getCategoryIconName } from '@/lib/constants/category-icons';
import {
  getCategoryTranslationKey,
  getSubcategoryTranslationKey,
} from '@/lib/categoryTranslations';

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
      title: `${categoryData.name} | BAPI`,
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
 * Category page component displaying subcategories or products with filtering.
 * Fetches category hierarchy, products, and filter attributes from GraphQL.
 * @param root0 - Component props
 * @param root0.params - Category page parameters containing locale and category slug
 * @param root0.searchParams - URL search parameters (unused but required by Next.js)
 * @returns JSX.Element
 */
export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { category, locale } = await params;
  await searchParams; // Required by Next.js async API
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
  const subcategories = (categoryData.children?.nodes || []).filter(
    (sub): sub is NonNullable<typeof sub> & { name: string; slug: string } =>
      !!sub && !!sub.name && !!sub.slug
  );
  const hasSubcategories = subcategories.length > 0;

  // Type-safe product array from GraphQL
  type ProductNode = NonNullable<GetProductsWithFiltersQuery['products']>['nodes'][number];
  // eslint-disable-next-line prefer-const -- products is mutated via push in loop below
  let products: ProductNode[] = [];
  
  // Fetch product attributes for filtering (required by CategoryContent)
  let productAttributesData: GetProductAttributesQuery | null = null;

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
            first: 50,  // Reduced from 100 to prevent PHP memory exhaustion
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
    
    // Fetch product attributes for filters
    try {
      productAttributesData = await client.request<GetProductAttributesQuery>(
        GetProductAttributesDocument
      );
    } catch (error) {
      logger.error('Failed to fetch product attributes', error, {
        categorySlug: category,
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

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumbs */}
      <div className="border-b border-neutral-200">
        <div className="mx-auto max-w-content px-4 py-4">
          <Breadcrumbs items={breadcrumbs} schema={schema} />
        </div>
      </div>

      {/* Category Header with BAPI Gradient */}
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

      {/* Subcategories Grid */}
      {hasSubcategories && (
        <div className="mx-auto max-w-container px-4 py-12">
          <h2 className="mb-8 text-2xl font-bold text-neutral-900">
            {t('categoryPage.subcategories.title')}
          </h2>
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {subcategories.map((subcategory, index) => {
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
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </div>
                </div>
              </Link>
            );
            })}
          </div>
        </div>
      )}

      {/* Product Grid for Leaf Categories (no subcategories) */}
      {!hasSubcategories && (
        <CategoryContent
          categorySlugParam={category}
          subcategories={[]}
          products={products}
          filters={productAttributesData || ({} as GetProductAttributesQuery)} // Graceful fallback for filter failure
          locale={locale}
        />
      )}

      {/* Quick Links */}
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
    </div>
  );
}
