import Link from 'next/link';
import {
  Building2,
  Factory,
  Radio,
  RefreshCw,
  Wrench,
  Zap,
  Target,
  CheckCircle,
} from 'lucide-react';
import { applicationCategories } from '@/lib/navigation/applicationCategories';

/**
 * Map category slugs to their Lucide icons
 */
const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'building-automation': Building2,
  'industrial-process': Factory,
  'wireless-remote': Radio,
  'retrofit-replacement': RefreshCw,
  'installation-support': Wrench,
};

/**
 * Applications Hub Page
 *
 * Main landing page for application-based navigation.
 * Shows all top-level application categories for customer discovery.
 */
export default function ApplicationsPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <section className="border-b border-neutral-200 bg-gradient-to-br from-primary-50 via-white to-primary-50/30">
        <div className="mx-auto max-w-content px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="text-center">
            <h1 className="mb-6 text-4xl font-bold text-neutral-900 sm:text-5xl lg:text-6xl">
              Find Sensors by Application
            </h1>
            <p className="mx-auto max-w-3xl text-xl leading-relaxed text-neutral-600">
              Discover the right sensors for your specific use case. Browse by application area to
              find products designed for your industry and environment.
            </p>
          </div>
        </div>
      </section>

      {/* Application Categories Grid */}
      <section className="mx-auto max-w-content px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Object.entries(applicationCategories).map(([slug, category]) => {
            const IconComponent = categoryIcons[slug] || Building2;

            return (
              <Link
                key={slug}
                href={`/applications/${slug}`}
                className="group relative rounded-2xl border border-neutral-200 bg-white p-6 transition-all duration-300 hover:border-primary-400 hover:shadow-xl"
              >
                {/* Icon */}
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg shadow-primary-500/20 transition-transform duration-300 group-hover:scale-110">
                  <IconComponent className="h-7 w-7 text-white" />
                </div>

                <h2 className="mb-3 text-xl font-bold text-neutral-900 transition-colors group-hover:text-primary-600">
                  {category.name}
                </h2>

                <p className="mb-5 text-sm leading-relaxed text-neutral-600">
                  {category.description}
                </p>

                {/* Subcategory Count */}
                <div className="flex items-center justify-between border-t border-neutral-100 pt-4 text-sm">
                  <span className="font-medium text-neutral-500">
                    {Object.keys(category.subcategories).length} subcategories
                  </span>
                  <div className="flex items-center font-medium text-primary-600 transition-all group-hover:gap-2">
                    <span>Explore</span>
                    <svg
                      className="h-4 w-4 transition-transform group-hover:translate-x-1"
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
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Why Application-Based Navigation */}
      <section className="border-y border-neutral-200 bg-white">
        <div className="mx-auto max-w-content px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-neutral-900 lg:text-4xl">
              Why Shop by Application?
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-neutral-600">
              Find the perfect sensor faster by browsing products organized for your specific needs
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:gap-12">
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg shadow-primary-500/20">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-neutral-900">Faster Discovery</h3>
              <p className="leading-relaxed text-neutral-600">
                Find the right sensor for your specific use case without browsing through sensor
                types.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg shadow-primary-500/20">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-neutral-900">Better Decisions</h3>
              <p className="leading-relaxed text-neutral-600">
                See products in context with application-specific guidance and recommendations.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg shadow-primary-500/20">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-neutral-900">Right Solution</h3>
              <p className="leading-relaxed text-neutral-600">
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
  description:
    'Find the right sensors for your specific application. Browse building automation, industrial, wireless, and retrofit solutions.',
};
