import Link from 'next/link';
import { 
  Building2, 
  Factory, 
  Radio, 
  RefreshCw, 
  Wrench,
  Zap,
  Target,
  CheckCircle
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
      <section className="bg-gradient-to-br from-primary-50 via-white to-primary-50/30 border-b border-neutral-200">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-900 mb-6">
              Find Sensors by Application
            </h1>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
              Discover the right sensors for your specific use case. Browse by application area to find products
              designed for your industry and environment.
            </p>
          </div>
        </div>
      </section>

      {/* Application Categories Grid */}
      <section className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(applicationCategories).map(([slug, category]) => {
            const IconComponent = categoryIcons[slug] || Building2;
            
            return (
              <Link
                key={slug}
                href={`/applications/${slug}`}
                className="group relative bg-white border border-neutral-200 rounded-2xl p-6 hover:border-primary-400 hover:shadow-xl transition-all duration-300"
              >
                {/* Icon */}
                <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl mb-5 flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:scale-110 transition-transform duration-300">
                  <IconComponent className="w-7 h-7 text-white" />
                </div>

                <h2 className="text-xl font-bold text-neutral-900 mb-3 group-hover:text-primary-600 transition-colors">
                  {category.name}
                </h2>

                <p className="text-neutral-600 text-sm leading-relaxed mb-5">
                  {category.description}
                </p>

                {/* Subcategory Count */}
                <div className="flex items-center justify-between text-sm pt-4 border-t border-neutral-100">
                  <span className="text-neutral-500 font-medium">
                    {Object.keys(category.subcategories).length} subcategories
                  </span>
                  <div className="flex items-center text-primary-600 font-medium group-hover:gap-2 transition-all">
                    <span>Explore</span>
                    <svg
                      className="w-4 h-4 group-hover:translate-x-1 transition-transform"
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
      <section className="bg-white border-y border-neutral-200">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-4">
              Why Shop by Application?
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Find the perfect sensor faster by browsing products organized for your specific needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg shadow-primary-500/20">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-3">
                Faster Discovery
              </h3>
              <p className="text-neutral-600 leading-relaxed">
                Find the right sensor for your specific use case without browsing through sensor types.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg shadow-primary-500/20">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-3">
                Better Decisions
              </h3>
              <p className="text-neutral-600 leading-relaxed">
                See products in context with application-specific guidance and recommendations.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg shadow-primary-500/20">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-3">
                Right Solution
              </h3>
              <p className="text-neutral-600 leading-relaxed">
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
