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

      {/* Category Header with BAPI Gradient */}
      <div className="relative bg-gradient-to-br from-primary-600 via-primary-500 to-primary-600 border-b-4 border-accent-500">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent-500/10 to-transparent" />
        <div className="max-w-content mx-auto px-4 py-16 relative">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-5 drop-shadow-lg">
              {categoryData.name}
            </h1>
            {categoryData.description && (
              <p className="text-xl text-white/95 leading-relaxed drop-shadow-md">
                {categoryData.description}
              </p>
            )}
            <div className="mt-6 inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
              <svg
                className="w-5 h-5 text-accent-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
              <span className="text-white font-semibold">
                {categoryData.count} products available
              </span>
            </div>
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
                className="group relative bg-white rounded-2xl border-2 border-neutral-200 hover:border-primary-500 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden"
              >
                {/* BAPI Gradient Top Border */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent-500 via-primary-500 to-accent-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Subtle gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-50/0 to-accent-50/0 group-hover:from-primary-50/20 group-hover:to-accent-50/10 transition-all duration-300 pointer-events-none" />
                
                {/* Subcategory Image - Larger, square aspect */}
                {subcategory.image?.sourceUrl ? (
                  <div className="aspect-[4/3] relative bg-gradient-to-br from-neutral-50 to-neutral-100">
                    <Image
                      src={subcategory.image.sourceUrl}
                      alt={subcategory.image.altText || subcategory.name || ''}
                      fill
                      className="object-contain p-8 group-hover:scale-110 transition-transform duration-500 ease-out"
                      sizes="(min-width: 768px) 50vw, 100vw"
                      priority
                    />
                  </div>
                ) : (
                  <div className="aspect-[4/3] relative bg-gradient-to-br from-primary-100 via-accent-100 to-primary-100 flex items-center justify-center">
                    <span className="text-primary-600 text-xl font-semibold">
                      {subcategory.name}
                    </span>
                  </div>
                )}

                {/* Subcategory Info */}
                <div className="p-8 bg-white relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-neutral-900 mb-2 group-hover:text-primary-600 transition-colors">
                        {subcategory.name}
                      </h3>
                      {subcategory.count !== null && (
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-100 to-accent-100 px-3 py-1 rounded-full">
                          <svg
                            className="w-4 h-4 text-primary-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                            />
                          </svg>
                          <span className="text-primary-700 font-semibold text-sm">
                            {subcategory.count} product{subcategory.count !== 1 ? 's' : ''}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {subcategory.description && (
                    <p className="text-neutral-600 text-base mb-6 line-clamp-3 leading-relaxed">
                      {subcategory.description}
                    </p>
                  )}

                  {/* Browse Button with Gradient */}
                  <div className="inline-flex items-center gap-2 bg-bapi-primary-gradient text-white font-semibold text-sm px-5 py-2.5 rounded-lg group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
                    <span>Browse Products</span>
                    <svg
                      className="w-4 h-4 group-hover:translate-x-1 transition-transform"
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
