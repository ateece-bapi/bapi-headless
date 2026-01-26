import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { CheckCircle, ChevronRight, Package, Users } from 'lucide-react';
import type { ApplicationLandingPageData } from '@/types/applications';

/**
 * Reusable application landing page component
 * 
 * Renders solution-focused landing pages for different application verticals.
 * Uses data-driven approach with TypeScript interfaces for type safety.
 * 
 * @param data - Complete application page data
 * 
 * @example
 * ```tsx
 * import { getApplicationBySlug } from '@/data/applications';
 * import ApplicationLandingPage from '@/components/applications/ApplicationLandingPage';
 * 
 * const data = getApplicationBySlug('building-automation');
 * if (!data) return <NotFound />;
 * 
 * return <ApplicationLandingPage data={data} />;
 * ```
 */
export default function ApplicationLandingPage({
  data,
}: {
  data: ApplicationLandingPageData;
}) {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <HeroSection hero={data.hero} />

      {/* Challenges Section */}
      <ChallengesSection challenges={data.challenges} />

      {/* Solutions Section */}
      <SolutionsSection solutions={data.solutions} />

      {/* Product Categories Section */}
      <ProductCategoriesSection categories={data.productCategories} />

      {/* Benefits Section */}
      <BenefitsSection benefits={data.benefits} />

      {/* Real-World Examples Section */}
      <ExamplesSection examples={data.examples} />

      {/* CTA Section */}
      <CTASection ctas={data.ctas} />
    </div>
  );
}

/**
 * Hero section with image, title, tagline, and statistics
 */
function HeroSection({ hero }: { hero: ApplicationLandingPageData['hero'] }) {
  return (
    <section className="relative bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 text-white overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 opacity-20">
        <Image
          src={hero.image}
          alt={hero.imageAlt}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-neutral-900/90 via-neutral-900/70 to-neutral-900/90" />

      {/* Content */}
      <div className="relative max-w-container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-20 lg:py-32">
        <div className="max-w-4xl">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-balance">
            {hero.title}
          </h1>
          <p className="text-xl sm:text-2xl text-neutral-200 mb-12 text-balance">
            {hero.tagline}
          </p>

          {/* Statistics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8">
            {hero.stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
              >
                <div className="text-3xl lg:text-4xl font-bold text-accent-400 mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-neutral-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Challenges section - Customer pain points
 */
function ChallengesSection({
  challenges,
}: {
  challenges: ApplicationLandingPageData['challenges'];
}) {
  return (
    <section className="py-20 lg:py-24 bg-neutral-50">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-4">
            Common Challenges
          </h2>
          <p className="text-lg text-neutral-600">
            We understand the unique challenges you face in your facility
          </p>
        </div>

        {/* Challenges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {challenges.map((challenge, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-normal border border-neutral-200"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-error-100 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-error-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-neutral-900 mb-2">
                    {challenge.title}
                  </h3>
                  <p className="text-neutral-600">
                    {challenge.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Solutions section - How BAPI solves the challenges
 */
function SolutionsSection({
  solutions,
}: {
  solutions: ApplicationLandingPageData['solutions'];
}) {
  return (
    <section className="py-20 lg:py-24 bg-white">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-4">
            How BAPI Solves These Challenges
          </h2>
          <p className="text-lg text-neutral-600">
            Proven solutions backed by 40+ years of engineering expertise
          </p>
        </div>

        {/* Solutions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {solutions.map((solution, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-primary-50 to-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-normal border border-primary-200 hover:-translate-y-1"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary-500 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-neutral-900 mb-2">
                    {solution.title}
                  </h3>
                  <p className="text-neutral-700 mb-4">
                    {solution.description}
                  </p>
                  {solution.features && solution.features.length > 0 && (
                    <ul className="space-y-2">
                      {solution.features.map((feature, fIndex) => (
                        <li
                          key={fIndex}
                          className="flex items-start gap-2 text-sm text-neutral-600"
                        >
                          <ChevronRight className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Product Categories section
 */
function ProductCategoriesSection({
  categories,
}: {
  categories: ApplicationLandingPageData['productCategories'];
}) {
  return (
    <section className="py-20 lg:py-24 bg-neutral-50">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-4">
            Recommended Products
          </h2>
          <p className="text-lg text-neutral-600">
            Purpose-built sensors and controllers for your application
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <Link
              key={index}
              href={category.link}
              className="group bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-normal border border-neutral-200 hover:-translate-y-1 hover:border-primary-300"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-primary-100 group-hover:bg-primary-500 transition-colors duration-normal flex items-center justify-center mb-4">
                  <Package className="w-8 h-8 text-primary-500 group-hover:text-white transition-colors duration-normal" />
                </div>
                <h3 className="text-lg font-bold text-neutral-900 mb-2 group-hover:text-primary-600 transition-colors duration-normal">
                  {category.name}
                </h3>
                <p className="text-sm text-neutral-600 mb-4">
                  {category.description}
                </p>
                <div className="mt-auto flex items-center gap-2 text-sm font-semibold text-primary-500 group-hover:text-primary-600 transition-colors duration-normal">
                  <span>Explore Products</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Benefits section
 */
function BenefitsSection({
  benefits,
}: {
  benefits: ApplicationLandingPageData['benefits'];
}) {
  return (
    <section className="py-20 lg:py-24 bg-white">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-4">
            Benefits You'll See
          </h2>
          <p className="text-lg text-neutral-600">
            Real business outcomes that impact your bottom line
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-accent-50 to-white rounded-xl p-6 shadow-lg border border-accent-200"
            >
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-accent-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-bold text-neutral-900 mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-neutral-600">
                    {benefit.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Real-world examples section (mini case studies)
 */
function ExamplesSection({
  examples,
}: {
  examples: ApplicationLandingPageData['examples'];
}) {
  return (
    <section className="py-20 lg:py-24 bg-neutral-50">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-4">
            Real-World Success Stories
          </h2>
          <p className="text-lg text-neutral-600">
            See how organizations like yours achieved measurable results
          </p>
        </div>

        {/* Examples Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {examples.map((example, index) => (
            <div
              key={index}
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-normal border border-neutral-200"
            >
              {/* Image (if provided) */}
              {example.image && (
                <div className="relative h-48 bg-neutral-200">
                  <Image
                    src={example.image}
                    alt={example.imageAlt || example.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-neutral-900 mb-3">
                  {example.title}
                </h3>

                <p className="text-neutral-600 mb-4">{example.description}</p>

                {/* Result */}
                <div className="flex items-start gap-2 text-sm bg-success-50 border border-success-200 rounded-lg p-3">
                  <CheckCircle className="w-4 h-4 text-success-500 flex-shrink-0 mt-0.5" />
                  <span className="text-neutral-700 font-semibold">
                    {example.result}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Call-to-action section
 */
function CTASection({ ctas }: { ctas: ApplicationLandingPageData['ctas'] }) {
  return (
    <section className="py-20 lg:py-24 bg-gradient-to-br from-primary-700 via-primary-500 to-primary-700 text-white">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-balance">
          Ready to Solve Your Challenges?
        </h2>
        <p className="text-xl text-primary-100 mb-10 max-w-2xl mx-auto text-balance">
          Let our experts help you find the right solution for your facility
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href={ctas.primary.link}
            className="px-8 py-4 bg-accent-500 hover:bg-accent-600 text-neutral-900 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-normal hover:-translate-y-1 text-lg"
          >
            {ctas.primary.text}
          </Link>
          <Link
            href={ctas.secondary.link}
            className="px-8 py-4 bg-white hover:bg-neutral-50 text-primary-600 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-normal hover:-translate-y-1 text-lg"
          >
            {ctas.secondary.text}
          </Link>
        </div>
      </div>
    </section>
  );
}

/**
 * Generate metadata for SEO
 */
export function generateApplicationMetadata(
  data: ApplicationLandingPageData
): Metadata {
  const ogImage = data.seo.ogImage || data.hero.image;
  
  return {
    title: data.seo.title,
    description: data.seo.description,
    keywords: data.seo.keywords,
    openGraph: {
      title: data.seo.title,
      description: data.seo.description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: data.hero.title,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: data.seo.title,
      description: data.seo.description,
      images: [ogImage],
    },
  };
}
