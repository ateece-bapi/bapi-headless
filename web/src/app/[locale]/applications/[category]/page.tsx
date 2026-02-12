import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  applicationCategories,
  getApplicationCategorySlugs,
} from '@/lib/navigation/applicationCategories';

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
      <section className="border-b border-neutral-200 bg-gradient-to-br from-primary-50 via-white to-primary-50/30">
        <div className="mx-auto max-w-content px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          {/* Breadcrumbs */}
          <nav className="mb-8 flex items-center text-sm text-neutral-600">
            <Link href="/" className="transition-colors hover:text-primary-600">
              Home
            </Link>
            <ChevronRight className="mx-2 h-4 w-4 text-neutral-400" />
            <Link href="/applications" className="transition-colors hover:text-primary-600">
              Applications
            </Link>
            <ChevronRight className="mx-2 h-4 w-4 text-neutral-400" />
            <span className="font-medium text-neutral-900">{category.name}</span>
          </nav>

          <h1 className="mb-6 text-4xl font-bold text-neutral-900 sm:text-5xl lg:text-6xl">
            {category.name}
          </h1>
          <p className="max-w-3xl text-xl leading-relaxed text-neutral-600">
            {category.description}
          </p>
        </div>
      </section>

      {/* Subcategories Grid */}
      <section className="mx-auto max-w-content px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <h2 className="mb-10 text-3xl font-bold text-neutral-900 lg:text-4xl">
          Choose Your Application
        </h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {Object.entries(category.subcategories).map(([slug, subcategory]) => (
            <Link
              key={slug}
              href={`/applications/${categorySlug}/${slug}`}
              className="group rounded-2xl border border-neutral-200 bg-white p-6 transition-all duration-300 hover:border-primary-400 hover:shadow-xl"
            >
              <h3 className="mb-3 text-xl font-bold text-neutral-900 transition-colors group-hover:text-primary-600">
                {subcategory.name}
              </h3>

              <p className="mb-5 text-sm leading-relaxed text-neutral-600">
                {subcategory.description}
              </p>

              {/* Featured Products Preview */}
              {subcategory.featuredProducts && subcategory.featuredProducts.length > 0 && (
                <div className="mb-5 flex flex-wrap items-center gap-2 border-t border-neutral-100 pt-4">
                  <span className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                    Featured:
                  </span>
                  {subcategory.featuredProducts.slice(0, 3).map((product, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center rounded-lg bg-primary-50 px-2.5 py-1 text-xs font-medium text-primary-700"
                    >
                      {product}
                    </span>
                  ))}
                </div>
              )}

              {/* View Products CTA */}
              <div className="flex items-center justify-between border-t border-neutral-100 pt-4 text-sm">
                <span className="font-medium text-primary-600 transition-all group-hover:gap-2">
                  View Products
                </span>
                <ChevronRight className="h-4 w-4 text-primary-600 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Back to Applications */}
      <section className="mx-auto max-w-content px-4 pb-16 sm:px-6 lg:px-8">
        <Link
          href="/applications"
          className="group inline-flex items-center gap-2 font-medium text-primary-600 transition-colors hover:text-primary-700"
        >
          <ChevronLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
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
