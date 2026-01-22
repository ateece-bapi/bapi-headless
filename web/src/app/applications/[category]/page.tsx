import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-primary-50/30 border-b border-neutral-200">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          {/* Breadcrumbs */}
          <nav className="flex items-center text-sm text-neutral-600 mb-8">
            <Link href="/" className="hover:text-primary-600 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4 mx-2 text-neutral-400" />
            <Link href="/applications" className="hover:text-primary-600 transition-colors">
              Applications
            </Link>
            <ChevronRight className="w-4 h-4 mx-2 text-neutral-400" />
            <span className="text-neutral-900 font-medium">{category.name}</span>
          </nav>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-900 mb-6">
            {category.name}
          </h1>
          <p className="text-xl text-neutral-600 max-w-3xl leading-relaxed">
            {category.description}
          </p>
        </div>
      </section>

      {/* Subcategories Grid */}
      <section className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-10">
          Choose Your Application
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(category.subcategories).map(([slug, subcategory]) => (
            <Link
              key={slug}
              href={`/applications/${categorySlug}/${slug}`}
              className="group bg-white border border-neutral-200 rounded-2xl p-6 hover:border-primary-400 hover:shadow-xl transition-all duration-300"
            >
              <h3 className="text-xl font-bold text-neutral-900 mb-3 group-hover:text-primary-600 transition-colors">
                {subcategory.name}
              </h3>

              <p className="text-neutral-600 text-sm leading-relaxed mb-5">
                {subcategory.description}
              </p>

              {/* Featured Products Preview */}
              {subcategory.featuredProducts && subcategory.featuredProducts.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 mb-5 pt-4 border-t border-neutral-100">
                  <span className="text-xs font-medium text-neutral-500 uppercase tracking-wide">
                    Featured:
                  </span>
                  {subcategory.featuredProducts.slice(0, 3).map((product, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded-lg"
                    >
                      {product}
                    </span>
                  ))}
                </div>
              )}

              {/* View Products CTA */}
              <div className="flex items-center justify-between text-sm pt-4 border-t border-neutral-100">
                <span className="text-primary-600 font-medium group-hover:gap-2 transition-all">
                  View Products
                </span>
                <ChevronRight className="w-4 h-4 text-primary-600 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Back to Applications */}
      <section className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <Link
          href="/applications"
          className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium transition-colors group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Back to All Applications</span>
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
