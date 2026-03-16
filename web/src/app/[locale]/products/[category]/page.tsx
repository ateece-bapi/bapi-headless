import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getGraphQLClient } from '@/lib/graphql/client';
import {
  GetProductCategoryWithChildrenDocument,
  GetProductCategoryWithChildrenQuery,
  GetProductsByCategoryDocument,
  GetProductsByCategoryQuery,
  GetProductAttributesDocument,
  GetProductAttributesQuery,
} from '@/lib/graphql/generated';
import CategoryHero from '@/components/category/CategoryHero';
import CategoryContent from '@/components/category/CategoryContent';

// Map short slugs to full category slugs
// Updated March 13, 2026 based on GraphQL verification
const CATEGORY_SLUG_MAP: Record<string, string> = {
  temperature: 'temperature-sensors',
  humidity: 'humidity-sensors',
  pressure: 'pressure-sensors',
  'air-quality': 'air-quality-sensors',
  wireless: 'bluetooth-wireless', // WordPress uses 'bluetooth-wireless' (24 products)
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
      title: `${categoryData.name} | Building Automation Products | BAPI`,
      description:
        categoryData.description ||
        `Shop ${categoryData.count || 0} ${categoryData.name} from BAPI. High-quality sensors for HVAC and building automation.`,
      openGraph: {
        title: categoryData.name,
        description: categoryData.description || '',
        images: categoryData.image?.sourceUrl
          ? [categoryData.image.sourceUrl]
          : [],
        type: 'website',
      },
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

  try {
    // Fetch all data in parallel for maximum performance
    const [categoryData, productsData, attributesData] = await Promise.all([
      client.request<GetProductCategoryWithChildrenQuery>(
        GetProductCategoryWithChildrenDocument,
        { slug: fullSlug }
      ),
      client.request<GetProductsByCategoryQuery>(
        GetProductsByCategoryDocument,
        { categorySlug: fullSlug, first: 200 }
      ),
      client.request<GetProductAttributesQuery>(GetProductAttributesDocument),
    ]);

    const categoryInfo = categoryData.productCategory;
    const productsResult = productsData.products;
    const filters = attributesData;

    if (!categoryInfo) {
      notFound();
    }

    const subcategories = categoryInfo.children?.nodes || [];
    const allProducts = productsResult?.nodes || [];

    // Generate breadcrumbs
    const breadcrumbs = [
      {
        label: 'Home',
        href: `/${locale}`,
      },
      {
        label: 'Products',
        href: `/${locale}/products`,
      },
      {
        label: categoryInfo.name,
        href: `/${locale}/products/${category}`,
      },
    ];

    return (
      <div className="category-page min-h-screen bg-neutral-50">
        <CategoryHero category={categoryInfo} breadcrumbs={breadcrumbs} />

        <CategoryContent
          category={categoryInfo}
          subcategories={subcategories}
          products={allProducts}
          filters={filters}
          locale={locale}
          translations={{}}
        />
      </div>
    );
  } catch (error) {
    console.error('Error loading category page:', error);
    notFound();
  }
}
    <div className="min-h-screen bg-neutral-50">
      {/* Breadcrumbs */}
      <div className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href={`/${locale}`} className="text-neutral-700 hover:text-primary-500">
              Home
            </Link>
            <ChevronRight className="h-4 w-4 text-neutral-400" />
            <Link href={`/${locale}/products`} className="text-neutral-700 hover:text-primary-500">
              Products
            </Link>
            <ChevronRight className="h-4 w-4 text-neutral-400" />
            <span className="font-medium text-neutral-900">{categoryInfo.name}</span>
          </nav>
        </div>
      </div>

      {/* Category Hero */}
      <section className="bg-linear-to-br from-primary-700 via-primary-600 to-primary-500 py-12 text-white lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="mb-4 text-4xl font-bold lg:text-5xl">{categoryInfo.name}</h1>
            {categoryInfo.description && (
              <p className="text-xl text-primary-100">{categoryInfo.description}</p>
            )}
            {productCount > 0 && (
              <p className="mt-4 text-lg text-primary-200">{productCount} products available</p>
            )}
          </div>
        </div>
      </section>

      {/* Subcategories Grid */}
      {subcategories.length > 0 && (
        <section className="py-12 lg:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-8 text-2xl font-bold text-neutral-900 lg:text-3xl">Browse by Type</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {subcategories.map((subcat) => (
                <Link
                  key={subcat.id}
                  href={`/${locale}/products/${category}/${subcat.slug}`}
                  className="group rounded-xl border-2 border-neutral-200 bg-white p-6 transition-all duration-300 hover:border-primary-500 hover:shadow-xl"
                >
                  {subcat.image?.sourceUrl && (
                    <div className="relative mb-4 h-48 w-full overflow-hidden rounded-lg bg-neutral-100">
                      <Image
                        src={subcat.image.sourceUrl}
                        alt={subcat.name || 'Category image'}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <h3 className="mb-2 text-xl font-bold text-neutral-900 transition-colors group-hover:text-primary-600">
                    {subcat.name}
                  </h3>
                  {subcat.description && (
                    <p className="mb-4 line-clamp-2 text-sm text-neutral-700">
                      {subcat.description}
                    </p>
                  )}
                  {subcat.count !== null && (
                    <p className="mb-4 text-sm text-neutral-700">{subcat.count} products</p>
                  )}
                  <span className="inline-flex items-center font-semibold text-primary-500 transition-all group-hover:gap-2">
                    View Products
                    <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      {products.length > 0 && (
        <section className="bg-white py-12 lg:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-neutral-900 lg:text-3xl">
                {subcategories.length > 0 ? 'Featured Products' : 'All Products'}
              </h2>
              {productCount > products.length && subcategories.length === 0 && (
                <Link
                  href={`/${locale}/products/${category}/all`}
                  className="inline-flex items-center gap-2 font-semibold text-primary-500 hover:text-primary-600"
                >
                  View All
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => {
                // Type guard for products with image property
                const hasImage = 'image' in product && product.image?.sourceUrl;

                return (
                  <Link
                    key={product.id}
                    href={`/${locale}/products/${product.slug}`}
                    className="group overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50 transition-all duration-300 hover:border-primary-500 hover:shadow-lg"
                  >
                    {hasImage && (
                      <div className="relative h-48 w-full bg-white">
                        <Image
                          src={product.image!.sourceUrl!}
                          alt={product.name || 'Product image'}
                          fill
                          className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="mb-1 line-clamp-2 font-bold text-neutral-900 transition-colors group-hover:text-primary-600">
                        {product.name}
                      </h3>
                      {'shortDescription' in product && product.shortDescription && (
                        <p
                          className="line-clamp-2 text-sm text-neutral-700"
                          dangerouslySetInnerHTML={{
                            __html: product.shortDescription,
                          }}
                        />
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="bg-neutral-100 py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-2xl font-bold text-neutral-900 lg:text-3xl">
            Need Help Finding the Right Product?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-neutral-700">
            Our technical team can help you select the perfect sensor for your application.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-500 px-8 py-4 text-lg font-bold text-white transition-all duration-300 hover:bg-primary-600 hover:shadow-xl"
            >
              Contact Sales
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href={`/${locale}/request-quote`}
              className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-neutral-300 bg-white px-8 py-4 text-lg font-bold text-neutral-900 transition-all duration-300 hover:border-primary-500 hover:bg-neutral-50"
            >
              Request Quote
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
