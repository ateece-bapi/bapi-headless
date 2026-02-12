import { sanitizeWordPressContent } from '@/lib/sanitizeDescription';
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
        <div className="mx-auto max-w-container px-4 text-center sm:px-6 lg:px-8">
          <Search className="mx-auto mb-6 h-16 w-16 text-neutral-300" />
          <h1 className="mb-4 text-3xl font-bold text-neutral-900">Search Products</h1>
          <p className="mb-8 text-lg text-neutral-600">
            Use the search bar above to find sensors, controllers, and building automation products.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center justify-center rounded-lg bg-primary-500 px-6 py-3 font-semibold text-white transition-all hover:bg-primary-600"
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
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/products"
            className="mb-4 inline-flex items-center gap-2 font-semibold text-primary-600 transition-colors hover:text-primary-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Products
          </Link>
          <h1 className="mb-2 text-3xl font-bold text-neutral-900 lg:text-4xl">Search Results</h1>
          <p className="text-lg text-neutral-600">
            {results.length} {results.length === 1 ? 'result' : 'results'} for{' '}
            <span className="font-semibold">"{query}"</span>
          </p>
        </div>

        {results.length === 0 ? (
          <div className="rounded-xl border border-neutral-200 bg-white p-12 text-center">
            <Search className="mx-auto mb-6 h-16 w-16 text-neutral-300" />
            <h2 className="mb-3 text-2xl font-bold text-neutral-900">No products found</h2>
            <p className="mb-6 text-neutral-600">
              We couldn't find any products matching "{query}". Try different keywords or browse our
              categories.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/products"
                className="inline-flex items-center justify-center rounded-lg bg-primary-500 px-6 py-3 font-semibold text-white transition-all hover:bg-primary-600"
              >
                Browse All Products
              </Link>
              <Link
                href="/company/contact-us"
                className="inline-flex items-center justify-center rounded-lg border-2 border-primary-500 px-6 py-3 font-semibold text-primary-600 transition-all hover:bg-primary-50"
              >
                Contact Support
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {results.map((product: any) => {
              const category = product.productCategories?.nodes?.[0];

              return (
                <Link
                  key={product.id}
                  href={`/en/product/${product.slug}`}
                  className="group rounded-xl border border-neutral-200 bg-white p-6 transition-all duration-300 hover:border-primary-500 hover:shadow-lg"
                >
                  {product.image && (
                    <div className="relative mb-4 h-48 w-full overflow-hidden rounded-lg bg-neutral-50">
                      <Image
                        src={product.image.sourceUrl}
                        alt={product.image.altText || product.name}
                        fill
                        className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  )}

                  {category && (
                    <span className="mb-3 inline-block rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700">
                      {category.name}
                    </span>
                  )}

                  <h3 className="mb-2 text-lg font-bold text-neutral-900 transition-colors group-hover:text-primary-600">
                    {product.name}
                  </h3>

                  {product.shortDescription && (
                    <div
                      className="mb-3 line-clamp-2 text-sm text-neutral-600"
                      dangerouslySetInnerHTML={{
                        __html: sanitizeWordPressContent(product.shortDescription),
                      }}
                    />
                  )}

                  {product.price && (
                    <div className="mt-4 text-xl font-bold text-primary-600">{product.price}</div>
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
