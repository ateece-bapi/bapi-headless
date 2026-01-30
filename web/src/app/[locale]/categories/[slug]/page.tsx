import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getGraphQLClient } from '@/lib/graphql/client';
import {
  GetProductCategoryWithChildrenDocument,
  GetProductCategoryWithChildrenQuery,
} from '@/lib/graphql/generated';

interface CategoryPageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const client = getGraphQLClient(['product-categories'], true);

  try {
    const data = await client.request<GetProductCategoryWithChildrenQuery>(
      GetProductCategoryWithChildrenDocument,
      { slug }
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
  const { slug, locale } = await params;
  const client = getGraphQLClient(['product-categories'], true);

  const data = await client.request<GetProductCategoryWithChildrenQuery>(
    GetProductCategoryWithChildrenDocument,
    { slug }
  );

  const categoryData = data.productCategory;

  if (!categoryData) {
    notFound();
  }

  const subcategories = categoryData.children?.nodes || [];
  const hasSubcategories = subcategories.length > 0;

  // If no subcategories, redirect to product grid
  if (!hasSubcategories) {
    // TODO: Show product grid directly
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumbs */}
      <div className="border-b border-neutral-200">
        <div className="max-w-content mx-auto px-4 py-4">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm">
            <Link
              href={`/${locale}`}
              className="text-neutral-600 hover:text-primary-500 transition-colors"
            >
              Home
            </Link>
            <span className="text-neutral-400">/</span>
            <Link
              href={`/${locale}/products`}
              className="text-neutral-600 hover:text-primary-500 transition-colors"
            >
              Products
            </Link>
            <span className="text-neutral-400">/</span>
            <span className="text-neutral-900 font-medium">{categoryData.name}</span>
          </nav>
        </div>
      </div>

      {/* Category Header */}
      <div className="bg-gradient-to-br from-neutral-50 to-neutral-100 border-b border-neutral-200">
        <div className="max-w-content mx-auto px-4 py-12">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
            {categoryData.name}
          </h1>
          {categoryData.description && (
            <p className="text-lg text-neutral-600 max-w-3xl">
              {categoryData.description}
            </p>
          )}
          <div className="mt-4 text-sm text-neutral-500">
            {categoryData.count} products available
          </div>
        </div>
      </div>

      {/* Subcategories Grid */}
      {hasSubcategories && (
        <div className="max-w-content mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-neutral-900 mb-8">
            Browse by Category
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subcategories.map((subcategory) => (
              <Link
                key={subcategory.id}
                href={`/${locale}/products/${slug}/${subcategory.slug}`}
                className="group relative bg-white rounded-xl border-2 border-neutral-200 hover:border-primary-500 hover:shadow-lg transition-all duration-normal overflow-hidden"
              >
                {/* Subcategory Image */}
                {subcategory.image?.sourceUrl && (
                  <div className="aspect-video relative bg-neutral-100">
                    <Image
                      src={subcategory.image.sourceUrl}
                      alt={subcategory.image.altText || subcategory.name || ''}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-normal"
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    />
                  </div>
                )}

                {/* Subcategory Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-neutral-900 mb-2 group-hover:text-primary-500 transition-colors">
                    {subcategory.name}
                  </h3>
                  {subcategory.description && (
                    <p className="text-neutral-600 text-sm mb-4 line-clamp-2">
                      {subcategory.description}
                    </p>
                  )}
                  {subcategory.count !== null && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-neutral-500">
                        {subcategory.count} products
                      </span>
                      <span className="text-primary-500 font-medium text-sm group-hover:translate-x-1 transition-transform">
                        Browse →
                      </span>
                    </div>
                  )}
                </div>

                {/* Hover Accent */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-primary-700 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Quick Links */}
      <div className="bg-neutral-50 border-t border-neutral-200">
        <div className="max-w-content mx-auto px-4 py-8">
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href={`/${locale}/products`}
              className="text-sm text-neutral-600 hover:text-primary-500 transition-colors"
            >
              ← Back to All Products
            </Link>
            <span className="text-neutral-300">|</span>
            <Link
              href={`/${locale}/contact`}
              className="text-sm text-neutral-600 hover:text-primary-500 transition-colors"
            >
              Need Help? Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
