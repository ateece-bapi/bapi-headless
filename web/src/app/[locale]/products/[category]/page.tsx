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
      title: `${categoryData.name || 'Products'} | Building Automation Products | BAPI`,
      description:
        categoryData.description ||
        `Shop ${categoryData.count || 0} ${categoryData.name || 'products'} from BAPI. High-quality sensors for HVAC and building automation.`,
      openGraph: {
        title: categoryData.name || 'Products',
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

    // Filter out subcategories with missing required fields
    const subcategories = (categoryInfo.children?.nodes || []).filter(
      (sub): sub is typeof sub & { name: string; slug: string } =>
        !!sub.name && !!sub.slug
    );
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
        label: categoryInfo.name || 'Category',
        href: `/${locale}/products/${category}`,
      },
    ];

    return (
      <div className="category-page min-h-screen bg-neutral-50">
        <CategoryHero category={categoryInfo} breadcrumbs={breadcrumbs} />

        <CategoryContent
          categorySlugParam={category}
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
