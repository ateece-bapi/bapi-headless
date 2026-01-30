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
        <div className="max-w-container mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-neutral-900 mb-8">
            Browse by Category
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {subcategories.map((subcategory) => (
              <Link
                key={subcategory.id}
                href={`/${locale}/products/${slug}/${subcategory.slug}`}
                className="group relative bg-white rounded-2xl border-2 border-neutral-200 hover:border-primary-500 hover:shadow-2xl transition-all duration-normal overflow-hidden"
              >
                {/* Subcategory Image - Larger, square aspect */}
                {subcategory.image?.sourceUrl ? (
                  <div className="aspect-[4/3] relative bg-neutral-50">
                    <Image
                      src={subcategory.image.sourceUrl}
                      alt={subcategory.image.altText || subcategory.name || ''}
                      fill
                      className="object-contain p-8 group-hover:scale-105 transition-transform duration-normal"
                      sizes="(min-width: 768px) 50vw, 100vw"
                      priority
                    />
                  </div>
                ) : (
                  <div className="aspect-[4/3] relative bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center">
                    <span className="text-neutral-400 text-lg font-medium">
                      {subcategory.name}
                    </span>
                  </div>
                )}

                {/* Subcategory Info */}
                <div className="p-8 bg-white">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-neutral-900 mb-1 group-hover:text-primary-500 transition-colors">
                        {subcategory.name}
                      </h3>
                      {subcategory.count !== null && (
                        <p className="text-neutral-500 text-base">
                          {subcategory.count} product{subcategory.count !== 1 ? 's' : ''}
                        </p>
                      )}
                    </div>
                  </div>

                  {subcategory.description && (
                    <p className="text-neutral-600 text-base mb-6 line-clamp-3 leading-relaxed">
                      {subcategory.description}
                    </p>
                  )}

                  {/* Browse Button */}
                  <div className="flex items-center text-primary-500 font-semibold text-base group-hover:text-primary-600">
                    <span className="group-hover:translate-x-2 transition-transform duration-normal">
                      Browse Products
                    </span>
                    <svg
                      className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform duration-normal"
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

                {/* Hover Border Accent */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 opacity-0 group-hover:opacity-100 transition-opacity" />
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
