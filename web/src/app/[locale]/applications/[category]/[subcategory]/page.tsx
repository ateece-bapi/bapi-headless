import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  applicationCategories,
  getApplicationCategorySlugs,
  getSubcategorySlugs,
  getWordPressCategoriesForApplication,
  getApplicationBreadcrumbs,
} from '@/lib/navigation/applicationCategories';
import { getProducts, getProductPrice } from '@/lib/graphql';

// Force dynamic rendering (don't pre-render at build time)
export const dynamic = 'force-dynamic';

interface ApplicationSubcategoryPageProps {
  params: Promise<{
    category: string;
    subcategory: string;
  }>;
}

/**
 * Application Subcategory Page with Products
 *
 * Fetches products from WordPress sensor categories and displays them
 * in application-specific context.
 *
 * Example: /applications/building-automation/room-monitoring
 */
export default async function ApplicationSubcategoryPage({
  params,
}: ApplicationSubcategoryPageProps) {
  const { category: categorySlug, subcategory: subcategorySlug } = await params;

  const category = applicationCategories[categorySlug];
  const subcategory = category?.subcategories[subcategorySlug];

  if (!category || !subcategory) {
    notFound();
  }

  // Get WordPress categories to fetch products from
  const wpCategories = getWordPressCategoriesForApplication(categorySlug, subcategorySlug);

  // Fetch products from WordPress
  // Note: We're using category slugs. The GraphQL query may need adjustment
  // to support filtering by multiple category slugs.
  const data = await getProducts(50); // TODO: Filter by wpCategories
  const products = data.products?.nodes || [];

  // Get breadcrumbs
  const breadcrumbs = getApplicationBreadcrumbs(categorySlug, subcategorySlug);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="border-b border-neutral-200 bg-gradient-to-br from-primary-50 to-white">
        <div className="mx-auto max-w-container px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          {/* Breadcrumbs */}
          <nav className="mb-6 text-sm text-neutral-600">
            {breadcrumbs.map((crumb, index) => (
              <span key={crumb.href}>
                {index > 0 && <span className="mx-2">/</span>}
                {index === breadcrumbs.length - 1 ? (
                  <span className="font-medium text-neutral-900">{crumb.name}</span>
                ) : (
                  <Link href={crumb.href} className="hover:text-primary-600">
                    {crumb.name}
                  </Link>
                )}
              </span>
            ))}
          </nav>

          <h1 className="mb-4 text-4xl font-bold text-neutral-900 lg:text-5xl">
            {subcategory.name}
          </h1>
          <p className="max-w-3xl text-lg text-neutral-600">{subcategory.description}</p>

          {/* Application Context Badges */}
          {subcategory.filters && Object.keys(subcategory.filters).length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {Object.entries(subcategory.filters).map(([key, value]) => (
                <span
                  key={key}
                  className="inline-flex items-center rounded-full bg-primary-100 px-3 py-1 text-sm font-medium text-primary-800"
                >
                  {key}: {value}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Products Grid */}
      <section className="mx-auto max-w-container px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-neutral-900">Products for {subcategory.name}</h2>
          <div className="text-neutral-600">{products.length} products</div>
        </div>

        {/* WordPress Categories Info (temporary - for debugging) */}
        <div className="mb-8 rounded-lg border border-neutral-200 bg-neutral-50 p-4">
          <p className="text-sm text-neutral-600">
            <span className="font-medium">Fetching from WordPress categories:</span>{' '}
            {wpCategories.join(', ')}
          </p>
          <p className="mt-1 text-xs text-neutral-500">
            (This is temporary debug info - will be removed in production)
          </p>
        </div>

        {products.length === 0 ? (
          <div className="py-12 text-center">
            <p className="mb-4 text-neutral-600">No products found for this application yet.</p>
            <Link
              href={`/applications/${categorySlug}`}
              className="font-medium text-primary-600 hover:text-primary-700"
            >
              Browse other subcategories
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/en/product/${product.slug}`}
                className="duration-base group overflow-hidden rounded-xl border-2 border-neutral-200 bg-white transition-all hover:border-primary-500 hover:shadow-lg"
              >
                {/* Product Image */}
                {product.image?.sourceUrl && (
                  <div className="aspect-square overflow-hidden bg-neutral-100">
                    <img
                      src={product.image.sourceUrl}
                      alt={product.image.altText || product.name || 'Product'}
                      className="duration-base h-full w-full object-contain p-4 transition-transform group-hover:scale-105"
                    />
                  </div>
                )}

                {/* Product Info */}
                <div className="p-4">
                  <h3 className="mb-2 line-clamp-2 font-bold text-neutral-900 transition-colors group-hover:text-primary-600">
                    {product.name}
                  </h3>

                  {product.shortDescription && (
                    <p className="mb-3 line-clamp-2 text-sm text-neutral-600">
                      {product.shortDescription.replace(/<[^>]*>/g, '')}
                    </p>
                  )}

                  {/* Price */}
                  {getProductPrice(product) && (
                    <div className="mb-2 text-lg font-bold text-primary-600">
                      {getProductPrice(product)}
                    </div>
                  )}

                  {/* View Details Link */}
                  <div className="flex items-center text-sm font-medium text-primary-600">
                    <span>View Details</span>
                    <svg
                      className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Navigation */}
      <section className="mx-auto max-w-container px-4 pb-12 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link
            href={`/applications/${categorySlug}`}
            className="inline-flex items-center font-medium text-primary-600 hover:text-primary-700"
          >
            <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to {category.name}
          </Link>

          <Link href="/applications" className="text-neutral-600 hover:text-primary-600">
            View All Applications
          </Link>
        </div>
      </section>
    </div>
  );
}

/**
 * Generate metadata for SEO
 */
export async function generateMetadata({ params }: ApplicationSubcategoryPageProps) {
  const { category: categorySlug, subcategory: subcategorySlug } = await params;

  const category = applicationCategories[categorySlug];
  const subcategory = category?.subcategories[subcategorySlug];

  if (!category || !subcategory) {
    return {
      title: 'Category Not Found',
    };
  }

  return {
    title: `${subcategory.name} | ${category.name} | BAPI Sensors`,
    description: subcategory.description,
  };
}
