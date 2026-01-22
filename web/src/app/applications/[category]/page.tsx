import Link from 'next/link';
import { notFound } from 'next/navigation';
import { applicationCategories, getApplicationCategorySlugs } from '@/lib/navigation/applicationCategories';

interface ApplicationCategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

/**
 * Application Category Page
 * 
 * Shows subcategories for a specific application area.
 * Example: /applications/building-automation
 */
export default async function ApplicationCategoryPage({ params }: ApplicationCategoryPageProps) {
  const { category: categorySlug } = await params;
  const category = applicationCategories[categorySlug];

  if (!category) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-white border-b border-neutral-200">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          {/* Breadcrumbs */}
          <nav className="text-sm text-neutral-600 mb-6">
            <Link href="/" className="hover:text-primary-600">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/applications" className="hover:text-primary-600">
              Applications
            </Link>
            <span className="mx-2">/</span>
            <span className="text-neutral-900 font-medium">{category.name}</span>
          </nav>

          <h1 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-4">
            {category.name}
          </h1>
          <p className="text-lg text-neutral-600 max-w-3xl">
            {category.description}
          </p>
        </div>
      </section>

      {/* Subcategories Grid */}
      <section className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <h2 className="text-3xl font-bold text-neutral-900 mb-8">
          Choose Your Application
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {Object.entries(category.subcategories).map(([slug, subcategory]) => (
            <Link
              key={slug}
              href={`/applications/${categorySlug}/${slug}`}
              className="group bg-white border-2 border-neutral-200 rounded-xl p-6 hover:border-primary-500 hover:shadow-lg transition-all duration-base"
            >
              <h3 className="text-2xl font-bold text-neutral-900 mb-3 group-hover:text-primary-600 transition-colors">
                {subcategory.name}
              </h3>

              <p className="text-neutral-600 mb-4">
                {subcategory.description}
              </p>

              {/* Featured Products Preview */}
              {subcategory.featuredProducts && subcategory.featuredProducts.length > 0 && (
                <div className="text-sm text-neutral-500 mb-4">
                  <span className="font-medium">Featured: </span>
                  {subcategory.featuredProducts.slice(0, 3).join(', ')}
                </div>
              )}

              {/* WordPress Categories Mapped (for transparency) */}
              <div className="flex items-center text-sm text-primary-600 font-medium">
                <span>View Products</span>
                <svg
                  className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Back to Applications */}
      <section className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <Link
          href="/applications"
          className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to All Applications
        </Link>
      </section>
    </div>
  );
}

/**
 * Generate static params for all application categories
 */
export function generateStaticParams() {
  return getApplicationCategorySlugs().map((slug) => ({
    category: slug,
  }));
}

/**
 * Generate metadata for SEO
 */
export async function generateMetadata({ params }: ApplicationCategoryPageProps) {
  const { category: categorySlug } = await params;
  const category = applicationCategories[categorySlug];

  if (!category) {
    return {
      title: 'Category Not Found',
    };
  }

  return {
    title: `${category.name} | BAPI Sensors`,
    description: category.description,
  };
}
