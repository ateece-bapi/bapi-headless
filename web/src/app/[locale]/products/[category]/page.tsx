import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getGraphQLClient } from '@/lib/graphql/client';
import {
  GetProductCategoryWithChildrenDocument,
  GetProductCategoryWithChildrenQuery,
  GetProductsWithFiltersDocument,
  GetProductsWithFiltersQuery,
} from '@/lib/graphql/generated';
import { ArrowRight, ChevronRight } from 'lucide-react';

// Map short slugs to full category slugs
const CATEGORY_SLUG_MAP: Record<string, string> = {
  temperature: 'temperature-sensors',
  humidity: 'humidity-sensors',
  pressure: 'pressure-sensors',
  'air-quality': 'air-quality-sensors',
  wireless: 'wireless-sensors',
  accessories: 'accessories',
  'test-instruments': 'test-instruments',
  'current-sensors': 'current-sensors',
  controllers: 'controllers',
};

interface CategoryPageProps {
  params: Promise<{
    locale: string;
    category: string;
  }>;
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const fullSlug = CATEGORY_SLUG_MAP[category] || category;
  const client = getGraphQLClient(['product-categories'], true);

  try {
    const data = await client.request<GetProductCategoryWithChildrenQuery>(
      GetProductCategoryWithChildrenDocument,
      { slug: fullSlug }
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

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category, locale } = await params;
  const fullSlug = CATEGORY_SLUG_MAP[category] || category;

  const client = getGraphQLClient(['products', `category-${fullSlug}`], true);

  // Fetch category data with children
  const categoryData = await client.request<GetProductCategoryWithChildrenQuery>(
    GetProductCategoryWithChildrenDocument,
    { slug: fullSlug }
  );

  const categoryInfo = categoryData.productCategory;

  if (!categoryInfo) {
    notFound();
  }

  // Get subcategories (children)
  const subcategories = categoryInfo.children?.nodes || [];

  // Fetch sample products for this category
  const productsData = await client.request<GetProductsWithFiltersQuery>(
    GetProductsWithFiltersDocument,
    {
      categorySlug: fullSlug,
      first: 12,
    }
  );

  const products = productsData.products?.nodes || [];
  const productCount = productsData.products?.pageInfo.total || 0;

  return (
    <main className="min-h-screen bg-neutral-50">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link
              href={`/${locale}`}
              className="text-neutral-600 hover:text-primary-500"
            >
              Home
            </Link>
            <ChevronRight className="w-4 h-4 text-neutral-400" />
            <Link
              href={`/${locale}/products`}
              className="text-neutral-600 hover:text-primary-500"
            >
              Products
            </Link>
            <ChevronRight className="w-4 h-4 text-neutral-400" />
            <span className="text-neutral-900 font-medium">
              {categoryInfo.name}
            </span>
          </nav>
        </div>
      </div>

      {/* Category Hero */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              {categoryInfo.name}
            </h1>
            {categoryInfo.description && (
              <p className="text-xl text-primary-100">
                {categoryInfo.description}
              </p>
            )}
            {productCount > 0 && (
              <p className="mt-4 text-lg text-primary-200">
                {productCount} products available
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Subcategories Grid */}
      {subcategories.length > 0 && (
        <section className="py-12 lg:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-neutral-900 mb-8">
              Browse by Type
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {subcategories.map((subcat) => (
                <Link
                  key={subcat.id}
                  href={`/${locale}/products/${category}/${subcat.slug}`}
                  className="group bg-white rounded-xl p-6 border-2 border-neutral-200 hover:border-primary-500 hover:shadow-xl transition-all duration-300"
                >
                  {subcat.image?.sourceUrl && (
                    <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden bg-neutral-100">
                      <Image
                        src={subcat.image.sourceUrl}
                        alt={subcat.name || 'Category image'}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-neutral-900 mb-2 group-hover:text-primary-600 transition-colors">
                    {subcat.name}
                  </h3>
                  {subcat.description && (
                    <p className="text-neutral-600 text-sm mb-4 line-clamp-2">
                      {subcat.description}
                    </p>
                  )}
                  {subcat.count !== null && (
                    <p className="text-sm text-neutral-500 mb-4">
                      {subcat.count} products
                    </p>
                  )}
                  <span className="inline-flex items-center text-primary-500 font-semibold group-hover:gap-2 transition-all">
                    View Products
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      {products.length > 0 && (
        <section className="py-12 lg:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl lg:text-3xl font-bold text-neutral-900">
                {subcategories.length > 0 ? 'Featured Products' : 'All Products'}
              </h2>
              {productCount > products.length && subcategories.length === 0 && (
                <Link
                  href={`/${locale}/products/${category}/all`}
                  className="text-primary-500 hover:text-primary-600 font-semibold inline-flex items-center gap-2"
                >
                  View All
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/${locale}/products/${product.slug}`}
                  className="group bg-neutral-50 rounded-xl overflow-hidden border border-neutral-200 hover:border-primary-500 hover:shadow-lg transition-all duration-300"
                >
                  {product.image?.sourceUrl && (
                    <div className="relative w-full h-48 bg-white">
                      <Image
                        src={product.image.sourceUrl}
                        alt={product.name || 'Product image'}
                        fill
                        className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-bold text-neutral-900 mb-1 group-hover:text-primary-600 transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                    {product.shortDescription && (
                      <p
                        className="text-sm text-neutral-600 line-clamp-2"
                        dangerouslySetInnerHTML={{
                          __html: product.shortDescription,
                        }}
                      />
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-12 lg:py-16 bg-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl lg:text-3xl font-bold text-neutral-900 mb-4">
            Need Help Finding the Right Product?
          </h2>
          <p className="text-lg text-neutral-600 mb-8 max-w-2xl mx-auto">
            Our technical team can help you select the perfect sensor for your
            application.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:shadow-xl"
            >
              Contact Sales
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href={`/${locale}/request-quote`}
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-neutral-50 text-neutral-900 border-2 border-neutral-300 hover:border-primary-500 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300"
            >
              Request Quote
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
