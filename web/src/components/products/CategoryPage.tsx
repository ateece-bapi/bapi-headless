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
  const cleanDescription = category.description
    ? category.description.replace(/<[^>]*>/g, '')
    : '';

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 to-primary-800">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/10 rounded-full blur-3xl -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-400/20 rounded-full blur-3xl translate-y-1/3" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-primary-100 mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/products" className="hover:text-white transition-colors">
              Products
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white font-medium">{category.name}</span>
          </nav>

          {/* Header */}
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white font-medium text-sm mb-6">
              <Grid3x3 className="w-4 h-4" />
              Product Category
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight">
              {category.name}
            </h1>
            
            {cleanDescription && (
              <p className="text-xl text-primary-50 leading-relaxed mb-6">
                {cleanDescription}
              </p>
            )}

            {/* Product Count */}
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-6 py-3">
              <Package className="w-5 h-5 text-white" />
              <span className="text-white font-semibold">
                {category.count || productNodes.length} Product{(category.count || productNodes.length) !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
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
                const image = product.image && product.image.sourceUrl
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
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-primary-50 text-primary-700 rounded-lg">
                  <Package className="w-5 h-5" />
                  <span className="font-medium">
                    More products available - pagination coming soon
                  </span>
                </div>
              </div>
            )}
          </>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-6">
              <Package className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              No Products Yet
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              We're currently updating this category. Check back soon for new products, or browse our other categories.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              View All Categories
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        )}
      </section>

      {/* CTA Section */}
      {hasProducts && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl p-10 lg:p-16 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-3">
                  Need Help Choosing?
                </h2>
                <p className="text-primary-50 text-lg max-w-2xl">
                  Our technical team is here to help you select the right products for your application. 
                  Get expert guidance on specifications, compatibility, and installation.
                </p>
              </div>
              
              <Link
                href="/company/contact-us"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-600 font-semibold rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 whitespace-nowrap"
              >
                Contact Support
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
