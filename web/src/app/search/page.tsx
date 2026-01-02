import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Search, ArrowLeft } from 'lucide-react';

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

async function searchProducts(query: string) {
  const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL || '';

  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `
        query SearchProducts($search: String!) {
          products(where: { search: $search, visibility: VISIBLE }, first: 100) {
            nodes {
              id
              databaseId
              name
              slug
              ... on SimpleProduct {
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
            }
          }
        }
      `,
      variables: { search: query },
    }),
    next: { revalidate: 3600 }, // Cache for 1 hour
  });

  const data = await response.json();
  return data.data?.products?.nodes || [];
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const params = await searchParams;
  const query = params.q || '';

  return {
    title: query ? `Search Results for "${query}" | BAPI` : 'Search Products | BAPI',
    description: `Find BAPI building automation sensors and controllers. Search results for: ${query}`,
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q || '';

  if (!query) {
    return (
      <div className="min-h-screen bg-neutral-50 py-16">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Search className="w-16 h-16 text-neutral-300 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">Search Products</h1>
          <p className="text-lg text-neutral-600 mb-8">
            Use the search bar above to find sensors, controllers, and building automation products.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center justify-center px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition-all"
          >
            Browse All Products
          </Link>
        </div>
      </div>
    );
  }

  const results = await searchProducts(query);

  return (
    <div className="min-h-screen bg-neutral-50 py-8 lg:py-12">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Products
          </Link>
          <h1 className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-2">
            Search Results
          </h1>
          <p className="text-lg text-neutral-600">
            {results.length} {results.length === 1 ? 'result' : 'results'} for <span className="font-semibold">"{query}"</span>
          </p>
        </div>

        {results.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-neutral-200">
            <Search className="w-16 h-16 text-neutral-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-neutral-900 mb-3">No products found</h2>
            <p className="text-neutral-600 mb-6">
              We couldn't find any products matching "{query}". Try different keywords or browse our categories.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/products"
                className="inline-flex items-center justify-center px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition-all"
              >
                Browse All Products
              </Link>
              <Link
                href="/company/contact-us"
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-primary-500 text-primary-600 hover:bg-primary-50 font-semibold rounded-lg transition-all"
              >
                Contact Support
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((product: any) => {
              const category = product.productCategories?.nodes?.[0];
              
              return (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="bg-white rounded-xl p-6 border border-neutral-200 hover:border-primary-500 hover:shadow-lg transition-all duration-300 group"
                >
                  {product.image && (
                    <div className="relative w-full h-48 mb-4 bg-neutral-50 rounded-lg overflow-hidden">
                      <Image
                        src={product.image.sourceUrl}
                        alt={product.image.altText || product.name}
                        fill
                        className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  )}
                  
                  {category && (
                    <span className="inline-block px-3 py-1 bg-primary-50 text-primary-700 text-xs font-semibold rounded-full mb-3">
                      {category.name}
                    </span>
                  )}
                  
                  <h3 className="font-bold text-lg text-neutral-900 mb-2 group-hover:text-primary-600 transition-colors">
                    {product.name}
                  </h3>
                  
                  {product.shortDescription && (
                    <div
                      className="text-sm text-neutral-600 mb-3 line-clamp-2"
                      dangerouslySetInnerHTML={{ __html: product.shortDescription }}
                    />
                  )}
                  
                  {product.price && (
                    <div className="text-xl font-bold text-primary-600 mt-4">
                      {product.price}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
