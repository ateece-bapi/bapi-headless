import { sanitizeWordPressContent } from '@/lib/sanitizeDescription';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Link } from '@/lib/navigation';
import Image from 'next/image';
import { SearchIcon, ArrowLeftIcon } from '@/lib/icons';
import { getTranslations } from 'next-intl/server';
import Breadcrumbs from '@/components/products/ProductPage/Breadcrumbs';
import { getSearchBreadcrumbs, breadcrumbsToSchemaOrg } from '@/lib/navigation/breadcrumbs';
import SearchResults from '@/components/search/SearchResults';

interface SearchPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
}

async function searchProducts(query: string) {
  const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL || '';

  const productFields = `
    id
    databaseId
    name
    slug
    ... on SimpleProduct {
      sku
      partNumber
      price
      shortDescription
      image {
        sourceUrl
        altText
      }
      productCategories {
        nodes {
          name
          slug
        }
      }
    }
    ... on VariableProduct {
      sku
      price
      shortDescription
      image {
        sourceUrl
        altText
      }
      productCategories {
        nodes {
          name
          slug
        }
      }
    }
  `;

  // Run both queries in parallel: name/description search + SKU search
  const [nameSearchResponse, skuSearchResponse] = await Promise.all([
    // Query 1: Search product name/description
    fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          query SearchProducts($search: String!) {
            products(where: { search: $search, visibility: VISIBLE }, first: 100) {
              nodes {
                ${productFields}
              }
            }
          }
        `,
        variables: { search: query },
      }),
      next: { revalidate: 3600 },
    }),
    // Query 2: Search by SKU (exact match)
    fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          query SearchProductsBySKU($sku: String!) {
            products(where: { sku: $sku, visibility: VISIBLE }, first: 100) {
              nodes {
                ${productFields}
              }
            }
          }
        `,
        variables: { sku: query },
      }),
      next: { revalidate: 3600 },
    }),
  ]);

  const [nameData, skuData] = await Promise.all([
    nameSearchResponse.json(),
    skuSearchResponse.json(),
  ]);

  // Merge results from both queries, removing duplicates by ID
  const nameResults = nameData.data?.products?.nodes || [];
  const skuResults = skuData.data?.products?.nodes || [];

  // Create a Map to deduplicate by product ID
  const resultsMap = new Map();

  // Add SKU results first (higher priority for exact SKU matches)
  skuResults.forEach((product: { id: string }) => {
    resultsMap.set(product.id, product);
  });

  // Add name search results (won't override if already exists)
  nameResults.forEach((product: { id: string }) => {
    if (!resultsMap.has(product.id)) {
      resultsMap.set(product.id, product);
    }
  });

  // Convert Map back to array and limit to 100 results
  return Array.from(resultsMap.values()).slice(0, 100);
}

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
          resultsCount: t('results.resultsCount'),
          resultsCountPlural: t('results.resultsCountPlural'),
          noResultsTitle: t('noResults.title'),
          noResultsDescription: t('noResults.description'),
          browseButton: t('noResults.browseButton'),
          contactButton: t('noResults.contactButton'),
        }}
      />
    </div>
  );
}
