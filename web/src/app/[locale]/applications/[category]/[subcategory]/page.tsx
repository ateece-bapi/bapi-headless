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
      <section className="bg-gradient-to-br from-primary-50 to-white border-b border-neutral-200">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          {/* Breadcrumbs */}
          <nav className="text-sm text-neutral-600 mb-6">
            {breadcrumbs.map((crumb, index) => (
              <span key={crumb.href}>
                {index > 0 && <span className="mx-2">/</span>}
                {index === breadcrumbs.length - 1 ? (
                  <span className="text-neutral-900 font-medium">{crumb.name}</span>
                ) : (
                  <Link href={crumb.href} className="hover:text-primary-600">
                    {crumb.name}
                  </Link>
                )}
              </span>
            ))}
          </nav>

          <h1 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-4">
            {subcategory.name}
          </h1>
          <p className="text-lg text-neutral-600 max-w-3xl">
            {subcategory.description}
          </p>

          {/* Application Context Badges */}
          {subcategory.filters && Object.keys(subcategory.filters).length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              {Object.entries(subcategory.filters).map(([key, value]) => (
                <span
                  key={key}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800"
                >
                  {key}: {value}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Products Grid */}
      <section className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-neutral-900">
            Products for {subcategory.name}
          </h2>
          <div className="text-neutral-600">
            {products.length} products
          </div>
        </div>

        {/* WordPress Categories Info (temporary - for debugging) */}
        <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 mb-8">
          <p className="text-sm text-neutral-600">
            <span className="font-medium">Fetching from WordPress categories:</span>{' '}
            {wpCategories.join(', ')}
          </p>
          <p className="text-xs text-neutral-500 mt-1">
            (This is temporary debug info - will be removed in production)
          </p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-neutral-600 mb-4">
              No products found for this application yet.
            </p>
            <Link
              href={`/applications/${categorySlug}`}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Browse other subcategories
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/en/products/${product.slug}`}
                className="group bg-white border-2 border-neutral-200 rounded-xl overflow-hidden hover:border-primary-500 hover:shadow-lg transition-all duration-base"
              >
                {/* Product Image */}
                {product.image?.sourceUrl && (
                  <div className="aspect-square bg-neutral-100 overflow-hidden">
                    <img
                      src={product.image.sourceUrl}
                      alt={product.image.altText || product.name || 'Product'}
                      className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-base"
                    />
                  </div>
                )}

                {/* Product Info */}
                <div className="p-4">
                  <h3 className="font-bold text-neutral-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                    {product.name}
                  </h3>

                  {product.shortDescription && (
                    <p className="text-sm text-neutral-600 mb-3 line-clamp-2">
                      {product.shortDescription.replace(/<[^>]*>/g, '')}
                    </p>
                  )}

                  {/* Price */}
                  {getProductPrice(product) && (
                    <div className="text-lg font-bold text-primary-600 mb-2">
                      {getProductPrice(product)}
                    </div>
                  )}

                  {/* View Details Link */}
                  <div className="flex items-center text-sm text-primary-600 font-medium">
                    <span>View Details</span>
                    <svg
                      className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
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
      <section className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="flex items-center justify-between">
          <Link
            href={`/applications/${categorySlug}`}
            className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to {category.name}
          </Link>

          <Link
            href="/applications"
            className="text-neutral-600 hover:text-primary-600"
          >
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
