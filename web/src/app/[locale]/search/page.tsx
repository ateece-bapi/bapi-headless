import { Metadata } from 'next';
import { Link } from '@/lib/navigation';
import { SearchIcon } from '@/lib/icons';
import { getTranslations } from 'next-intl/server';
import Breadcrumbs from '@/components/products/ProductPage/Breadcrumbs';
import { getSearchBreadcrumbs, breadcrumbsToSchemaOrg } from '@/lib/navigation/breadcrumbs';
import SearchResults from '@/components/search/SearchResults';
import { getGraphQLClient } from '@/lib/graphql/client';
import { getSdk } from '@/lib/graphql/generated';
import logger from '@/lib/logger';

interface SearchPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
}

/**
 * SKU pattern detector - helps optimize by only running variation query when needed
 * Typical SKU format: letters, numbers, hyphens (e.g., "TEMP-SENSOR-1000-024")
 * 
 * @param query - Search query string to test
 * @returns True if query matches SKU pattern (alphanumeric with dashes/underscores)
 */
function looksLikeSku(query: string): boolean {
  // Match patterns with alphanumeric + dash/underscore (common SKU formats)
  // At least one letter and one number, may contain dashes/underscores
  return /^[A-Za-z0-9\-_]+$/.test(query) && /[A-Za-z]/.test(query) && /[0-9]/.test(query);
}

/**
 * Server-side search function with variation SKU support
 * 
 * Executes parallel GraphQL queries with priority ordering:
 * 1. Variation SKU (exact configured product match)
 * 2. Product SKU (parent product match)
 * 3. Name search (fuzzy match)
 * 
 * @param query - Search query string
 * @returns Array of up to 24 matching products
 */
async function searchProducts(query: string) {
  try {
    // Use GraphQL client with GET method for CDN caching
    const client = getGraphQLClient(['search'], true);
    const sdk = getSdk(client);

    const normalizedQuery = query.trim().toLowerCase();
    const shouldCheckVariations = looksLikeSku(query);

    // Build query array conditionally - only add variation query if input looks like a SKU
    const queryPromises = [
      // Query 1: Search product name/description (fuzzy match)
      sdk.SearchProducts({ search: query, first: 24 }),
      // Query 2: Search by product SKU (exact match)
      sdk.SearchProductsBySKU({ sku: query, first: 24 }),
    ];

    // Query 3: Only search variable product variations if query looks like a SKU pattern
    // This avoids fetching 50 products × 100 variations (5,000 SKUs) for non-SKU searches
    if (shouldCheckVariations) {
      queryPromises.push(sdk.ListVariableProductsWithVariationSkus({ first: 50 }));
    }

    const results = await Promise.all(queryPromises);
    const [nameData, skuData, variationData] = results;

    // Extract products from GraphQL responses
    const nameResults = nameData.products?.nodes || [];
    const skuResults = skuData.products?.nodes || [];

    // Filter variation products to only those with matching variation SKUs (if query ran)
    const variationResults: typeof nameResults = [];
    if (shouldCheckVariations && variationData) {
      const variationProducts = variationData.products?.nodes || [];

      variationProducts.forEach((product) => {
        // Type guard: only VariableProduct has variations
        if (product.__typename === 'VariableProduct') {
          // Safe to cast after typename check - GraphQL unions make type narrowing complex
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const variableProduct = product as any;
          if (variableProduct.variations?.nodes) {
            // Check if any variation SKU matches the search query exactly
            const hasMatch = variableProduct.variations.nodes.some((variation: { sku?: string | null }) => 
              variation.sku?.toLowerCase() === normalizedQuery
            );
            if (hasMatch) {
              variationResults.push(product);
            }
          }
        }
      });
    }

    // Create a Map to deduplicate by product ID with priority ordering
    // Priority: Variation SKU (exact configured match) > Product SKU (parent match) > Name (fuzzy)
    const resultsMap = new Map();

    // Add variation SKU matches first (highest priority - exact configured product match)
    variationResults.forEach((product) => {
      resultsMap.set(product.id, product);
    });

    // Add product SKU results (second priority - parent product SKU match)
    skuResults.forEach((product) => {
      if (!resultsMap.has(product.id)) {
        resultsMap.set(product.id, product);
      }
    });

    // Add name search results (lowest priority - fuzzy name match)
    nameResults.forEach((product) => {
      if (!resultsMap.has(product.id)) {
        resultsMap.set(product.id, product);
      }
    });

    // Convert Map back to array and limit to 24 results for search page
    const finalResults = Array.from(resultsMap.values()).slice(0, 24);

    // Debug: Log customer group data in server-side search
    console.log('[searchProducts] Server-side debug:', {
      query,
      resultCount: finalResults.length,
      firstProductGroups: finalResults[0] ? {
        name: finalResults[0].name,
        customerGroup1: (finalResults[0] as any).customerGroup1,
        customerGroup2: (finalResults[0] as any).customerGroup2,
        customerGroup3: (finalResults[0] as any).customerGroup3,
      } : null,
    });

    return finalResults;
  } catch (error) {
    logger.error('Search products error', error, { query });
    return [];
  }
}

/**
 * Generate metadata for search results page
 */
export async function generateMetadata({
  params,
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const { locale } = await params;
  const queryParams = await searchParams;
  const query = queryParams.q || '';
  const t = await getTranslations({ locale, namespace: 'searchPage.meta' });

  return {
    title: query ? t('titleWithQuery', { query }) : t('titleDefault'),
    description: t('descriptionTemplate', { query }),
  };
}

/**
 * Search results page component
 * 
 * Server-rendered page showing search results with breadcrumbs and schema.org markup
 */
export default async function SearchPage({ params, searchParams }: SearchPageProps) {
  const { locale } = await params;
  const queryParams = await searchParams;
  const query = queryParams.q || '';
  const t = await getTranslations({ locale, namespace: 'searchPage' });

  if (!query) {
    return (
      <div className="min-h-screen bg-neutral-50 py-16">
        <div className="mx-auto max-w-container px-4 text-center sm:px-6 lg:px-8">
          <SearchIcon className="mx-auto mb-6 h-16 w-16 text-neutral-300" />
          <h1 className="mb-4 text-3xl font-bold text-neutral-900">{t('emptyQuery.title')}</h1>
          <p className="mb-8 text-lg text-neutral-700">{t('emptyQuery.description')}</p>
          <Link
            href="/products"
            className="inline-flex items-center justify-center rounded-lg bg-primary-500 px-6 py-3 font-semibold text-white transition-all hover:bg-primary-600"
          >
            {t('emptyQuery.browseButton')}
          </Link>
        </div>
      </div>
    );
  }

  const results = await searchProducts(query);

  // Generate breadcrumbs
  const breadcrumbItems = getSearchBreadcrumbs(query, {
    locale,
    labels: {
      home: t('breadcrumb.home'),
      products: t('breadcrumb.products'),
      search: t('breadcrumb.search'),
    },
  });
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bapi.com';
  const schema = breadcrumbsToSchemaOrg(breadcrumbItems, siteUrl, locale);

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Breadcrumbs */}
      <div className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-container px-4 py-4">
          <Breadcrumbs items={breadcrumbItems} schema={schema} />
        </div>
      </div>

      <SearchResults
        products={results}
        query={query}
        locale={locale}
        translations={{
          backToProducts: t('results.backToProducts'),
          title: t('results.title'),
          resultsCount: t.raw('results.resultsCount'),
          resultsCountPlural: t.raw('results.resultsCountPlural'),
          noResultsTitle: t('noResults.title'),
          noResultsDescription: t.raw('noResults.description'),
          browseButton: t('noResults.browseButton'),
          contactButton: t('noResults.contactButton'),
        }}
      />
    </div>
  );
}
