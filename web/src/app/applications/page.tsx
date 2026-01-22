import Link from 'next/link';
import { applicationCategories } from '@/lib/navigation/applicationCategories';

/**
 * Applications Hub Page
 * 
 * Main landing page for application-based navigation.
 * Shows all top-level application categories for customer discovery.
 */
export default function ApplicationsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-white border-b border-neutral-200">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-4">
            Find Sensors by Application
          </h1>
          <p className="text-lg text-neutral-600 max-w-3xl">
            Discover the right sensors for your specific use case. Browse by application area to find products
            designed for your industry and environment.
          </p>
        </div>
      </section>

      {/* Application Categories Grid */}
      <section className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.entries(applicationCategories).map(([slug, category]) => (
            <Link
              key={slug}
              href={`/applications/${slug}`}
              className="group relative bg-white border-2 border-neutral-200 rounded-xl p-8 hover:border-primary-500 hover:shadow-lg transition-all duration-base"
            >
              {/* Icon Placeholder - we'll add actual icons later */}
              <div className="w-16 h-16 bg-primary-100 rounded-lg mb-4 flex items-center justify-center text-primary-600">
                <span className="text-2xl font-bold">
                  {category.icon?.charAt(0) || '🏢'}
                </span>
              </div>

              <h2 className="text-2xl font-bold text-neutral-900 mb-3 group-hover:text-primary-600 transition-colors">
                {category.name}
              </h2>

              <p className="text-neutral-600 mb-6">
                {category.description}
              </p>

              {/* Subcategory Count */}
              <div className="flex items-center text-sm text-neutral-500">
                <span className="font-medium">
                  {Object.keys(category.subcategories).length} subcategories
                </span>
                <svg
                  className="w-5 h-5 ml-2 text-primary-500 group-hover:translate-x-1 transition-transform"
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

      {/* Why Application-Based Navigation */}
      <section className="bg-neutral-50 border-t border-neutral-200">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <h2 className="text-3xl font-bold text-neutral-900 mb-8 text-center">
            Why Shop by Application?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl">
                ⚡
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-2">
                Faster Discovery
              </h3>
              <p className="text-neutral-600">
                Find the right sensor for your specific use case without browsing through sensor types.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-primary-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl">
                🎯
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-2">
                Better Decisions
              </h3>
              <p className="text-neutral-600">
                See products in context with application-specific guidance and recommendations.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-primary-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl">
                ✅
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-2">
                Right Solution
              </h3>
              <p className="text-neutral-600">
                Products are pre-filtered for your environment, mounting, and industry requirements.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export const metadata = {
  title: 'Shop by Application | BAPI Sensors',
  description: 'Find the right sensors for your specific application. Browse building automation, industrial, wireless, and retrofit solutions.',
};
