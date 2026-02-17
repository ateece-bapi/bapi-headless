import Link from 'next/link';
import { Package, Grid3x3, ChevronRight } from 'lucide-react';
import { ProductCard } from './ProductCard';
import type { GetProductsByCategoryQuery, GetProductCategoryQuery } from '@/lib/graphql';

interface CategoryPageProps {
  category: NonNullable<GetProductCategoryQuery['productCategory']>;
  products: GetProductsByCategoryQuery['products'];
}

export function CategoryPage({ category, products }: CategoryPageProps) {
  const productNodes = products?.nodes || [];
  const hasProducts = productNodes.length > 0;

  // Clean HTML from category description
  const cleanDescription = category.description ? category.description.replace(/<[^>]*>/g, '') : '';

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 to-primary-800">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="absolute right-0 top-0 h-[600px] w-[600px] -translate-y-1/3 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-96 w-96 translate-y-1/3 rounded-full bg-primary-400/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          {/* Breadcrumb */}
          <nav
            className="mb-6 flex items-center gap-2 text-sm text-primary-100"
            aria-label="Breadcrumb"
          >
            <Link href="/" className="transition-colors hover:text-white">
              Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/products" className="transition-colors hover:text-white">
              Products
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="font-medium text-white">{category.name}</span>
          </nav>

          {/* Header */}
          <div className="max-w-4xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
              <Grid3x3 className="h-4 w-4" />
              Product Category
            </div>

            <h1 className="mb-4 text-5xl font-bold tracking-tight text-white lg:text-6xl">
              {category.name}
            </h1>

            {cleanDescription && (
              <p className="mb-6 text-xl leading-relaxed text-primary-50">{cleanDescription}</p>
            )}

            {/* Product Count */}
            <div className="inline-flex items-center gap-3 rounded-xl bg-white/10 px-6 py-3 backdrop-blur-sm">
              <Package className="h-5 w-5 text-white" />
              <span className="font-semibold text-white">
                {category.count || productNodes.length} Product
                {(category.count || productNodes.length) !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        {hasProducts ? (
          <>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {productNodes.map((product, index) => {
                if (!product) return null;

                // Get price from product type
                let price: string | null = null;
                if ('price' in product && product.price) {
                  price = product.price as string;
                }

                // Get part number
                let partNumber: string | null = null;
                if ('partNumber' in product && product.partNumber) {
                  partNumber = product.partNumber as string;
                }

                // Transform image to match ProductCard expected type
                const image =
                  product.image && product.image.sourceUrl
                    ? {
                        sourceUrl: product.image.sourceUrl,
                        altText: product.image.altText || null,
                      }
                    : null;

                return (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name || 'Unnamed Product'}
                    slug={product.slug || ''}
                    partNumber={partNumber}
                    price={price}
                    image={image}
                    shortDescription={product.shortDescription}
                    index={index}
                  />
                );
              })}
            </div>

            {/* Pagination Info */}
            {products?.pageInfo?.hasNextPage && (
              <div className="mt-12 text-center">
                <div className="inline-flex items-center gap-2 rounded-lg bg-primary-50 px-6 py-3 text-primary-700">
                  <Package className="h-5 w-5" />
                  <span className="font-medium">
                    More products available - pagination coming soon
                  </span>
                </div>
              </div>
            )}
          </>
        ) : (
          /* Empty State */
          <div className="mx-auto max-w-2xl rounded-2xl bg-white p-12 text-center shadow-xl">
            <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
              <Package className="h-10 w-10 text-gray-400" />
            </div>
            <h2 className="mb-3 text-3xl font-bold text-gray-900">No Products Yet</h2>
            <p className="mb-8 text-lg text-gray-600">
              We&apos;re currently updating this category. Check back soon for new products, or browse
              our other categories.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              View All Categories
              <ChevronRight className="h-5 w-5" />
            </Link>
          </div>
        )}
      </section>

      {/* CTA Section */}
      {hasProducts && (
        <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 to-primary-700 p-10 shadow-2xl lg:p-16">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
            <div className="absolute right-0 top-0 h-96 w-96 -translate-y-1/2 translate-x-1/2 rounded-full bg-white/10 blur-3xl" />

            <div className="relative flex flex-col items-center justify-between gap-8 text-center lg:flex-row lg:text-left">
              <div>
                <h2 className="mb-3 text-3xl font-bold text-white lg:text-4xl">
                  Need Help Choosing?
                </h2>
                <p className="max-w-2xl text-lg text-primary-50">
                  Our technical team is here to help you select the right products for your
                  application. Get expert guidance on specifications, compatibility, and
                  installation.
                </p>
              </div>

              <Link
                href="/company/contact-us"
                className="inline-flex items-center gap-2 whitespace-nowrap rounded-xl bg-white px-8 py-4 font-semibold text-primary-600 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                Contact Support
                <ChevronRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
