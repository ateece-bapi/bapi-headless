import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { CheckCircle, ChevronRight, Package, Users, Home } from 'lucide-react';
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
export default function ApplicationLandingPage({ data }: { data: ApplicationLandingPageData }) {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <HeroSection hero={data.hero} appName={data.name} />

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
function HeroSection({
  hero,
  appName,
}: {
  hero: ApplicationLandingPageData['hero'];
  appName: string;
}) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-500 to-primary-700 pb-20 pt-12 text-white lg:pb-32 lg:pt-16">
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('/images/patterns/grid.svg')] opacity-10" />

      {/* Background Image */}
      <div className="absolute inset-0 opacity-20">
        <Image src={hero.image} alt={hero.imageAlt} fill className="object-cover" priority />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-700/90 via-primary-500/70 to-primary-700/90" />

      {/* Content */}
      <div className="relative mx-auto max-w-container px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Breadcrumb */}
        <nav
          className="mb-6 flex items-center gap-2 text-sm text-primary-100"
          aria-label="Breadcrumb"
        >
          <Link href="/" className="transition-colors hover:text-white">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/applications" className="transition-colors hover:text-white">
            Applications
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-white">{appName}</span>
        </nav>

        <div className="max-w-4xl">
          <h1 className="mb-6 text-balance text-4xl font-bold sm:text-5xl lg:text-6xl">
            {hero.title}
          </h1>
          <p className="mb-12 text-balance text-xl text-neutral-200 sm:text-2xl">{hero.tagline}</p>

          {/* Statistics - Interactive */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 lg:gap-8">
            {hero.stats.map((stat, index) => (
              <div key={index} className="group relative cursor-default">
                <div className="absolute inset-0 rounded-xl border-2 border-accent-500/20 bg-accent-500/10 opacity-0 transition-all duration-300 group-hover:scale-105 group-hover:opacity-100" />
                <div className="relative rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm">
                  <div className="mb-2 text-3xl font-bold text-accent-400 transition-transform duration-300 group-hover:scale-110 lg:text-4xl">
                    {stat.value}
                  </div>
                  <div className="text-sm text-neutral-300">{stat.label}</div>
                </div>
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
    <section className="bg-neutral-50 py-20 lg:py-24">
      <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-neutral-900 lg:text-4xl">
            Common Challenges
          </h2>
          <p className="text-lg text-neutral-600">
            We understand the unique challenges you face in your facility
          </p>
        </div>

        {/* Challenges Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {challenges.map((challenge, index) => (
            <div
              key={index}
              className="duration-normal rounded-xl border border-neutral-200 bg-white p-8 shadow-lg transition-shadow hover:shadow-xl"
            >
              <div className="flex items-start gap-4">
                <div className="bg-error-100 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg">
                  <svg
                    className="h-6 w-6 text-error-600"
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
                  <h3 className="mb-2 text-xl font-bold text-neutral-900">{challenge.title}</h3>
                  <p className="text-neutral-600">{challenge.description}</p>
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
function SolutionsSection({ solutions }: { solutions: ApplicationLandingPageData['solutions'] }) {
  return (
    <section className="bg-white py-20 lg:py-24">
      <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-neutral-900 lg:text-4xl">
            How BAPI Solves These Challenges
          </h2>
          <p className="text-lg text-neutral-600">
            Proven solutions backed by 40+ years of engineering expertise
          </p>
        </div>

        {/* Solutions Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {solutions.map((solution, index) => (
            <div
              key={index}
              className="duration-normal rounded-xl border border-primary-200 bg-gradient-to-br from-primary-50 to-white p-8 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary-500">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="mb-2 text-xl font-bold text-neutral-900">{solution.title}</h3>
                  <p className="mb-4 text-neutral-700">{solution.description}</p>
                  {solution.features && solution.features.length > 0 && (
                    <ul className="space-y-2">
                      {solution.features.map((feature, fIndex) => (
                        <li
                          key={fIndex}
                          className="flex items-start gap-2 text-sm text-neutral-600"
                        >
                          <ChevronRight className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary-500" />
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
    <section className="bg-neutral-50 py-20 lg:py-24">
      <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-neutral-900 lg:text-4xl">
            Recommended Products
          </h2>
          <p className="text-lg text-neutral-600">
            Purpose-built sensors and controllers for your application
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {categories.map((category, index) => (
            <Link
              key={index}
              href={category.link}
              className="duration-normal group rounded-xl border border-neutral-200 bg-white p-6 shadow-lg transition-all hover:-translate-y-1 hover:border-primary-300 hover:shadow-xl"
            >
              <div className="flex flex-col items-center text-center">
                <div className="duration-normal mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 transition-colors group-hover:bg-primary-500">
                  <Package className="duration-normal h-8 w-8 text-primary-500 transition-colors group-hover:text-white" />
                </div>
                <h3 className="duration-normal mb-2 text-lg font-bold text-neutral-900 transition-colors group-hover:text-primary-600">
                  {category.name}
                </h3>
                <p className="mb-4 text-sm text-neutral-600">{category.description}</p>
                <div className="duration-normal mt-auto flex items-center gap-2 text-sm font-semibold text-primary-500 transition-colors group-hover:text-primary-600">
                  <span>Explore Products</span>
                  <ChevronRight className="h-4 w-4" />
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
function BenefitsSection({ benefits }: { benefits: ApplicationLandingPageData['benefits'] }) {
  return (
    <section className="bg-white py-20 lg:py-24">
      <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-neutral-900 lg:text-4xl">
            Benefits You&apos;ll See
          </h2>
          <p className="text-lg text-neutral-600">
            Real business outcomes that impact your bottom line
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="rounded-xl border border-accent-200 bg-gradient-to-br from-accent-50 to-white p-6 shadow-lg"
            >
              <div className="flex items-start gap-3">
                <CheckCircle className="mt-1 h-6 w-6 flex-shrink-0 text-accent-600" />
                <div>
                  <h3 className="mb-2 text-lg font-bold text-neutral-900">{benefit.title}</h3>
                  <p className="text-sm text-neutral-600">{benefit.description}</p>
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
function ExamplesSection({ examples }: { examples: ApplicationLandingPageData['examples'] }) {
  return (
    <section className="bg-neutral-50 py-20 lg:py-24">
      <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-neutral-900 lg:text-4xl">
            Real-World Success Stories
          </h2>
          <p className="text-lg text-neutral-600">
            See how organizations like yours achieved measurable results
          </p>
        </div>

        {/* Examples Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {examples.map((example, index) => (
            <div
              key={index}
              className="duration-normal overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-lg transition-shadow hover:shadow-xl"
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
                <h3 className="mb-3 text-xl font-bold text-neutral-900">{example.title}</h3>

                <p className="mb-4 text-neutral-600">{example.description}</p>

                {/* Result */}
                <div className="border-success-200 flex items-start gap-2 rounded-lg border bg-success-50 p-3 text-sm">
                  <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-success-500" />
                  <span className="font-semibold text-neutral-700">{example.result}</span>
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
    <section className="bg-gradient-to-br from-primary-700 via-primary-500 to-primary-700 py-20 text-white lg:py-24">
      <div className="mx-auto max-w-content px-4 text-center sm:px-6 lg:px-8">
        <h2 className="mb-6 text-balance text-3xl font-bold lg:text-4xl">
          Ready to Solve Your Challenges?
        </h2>
        <p className="mx-auto mb-10 max-w-2xl text-balance text-xl text-primary-100">
          Let our experts help you find the right solution for your facility
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href={ctas.primary.link}
            className="duration-normal rounded-xl bg-accent-500 px-8 py-4 text-lg font-bold text-neutral-900 shadow-lg transition-all hover:-translate-y-1 hover:bg-accent-600 hover:shadow-xl"
          >
            {ctas.primary.text}
          </Link>
          <Link
            href={ctas.secondary.link}
            className="duration-normal rounded-xl bg-white px-8 py-4 text-lg font-bold text-primary-600 shadow-lg transition-all hover:-translate-y-1 hover:bg-neutral-50 hover:shadow-xl"
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
export function generateApplicationMetadata(data: ApplicationLandingPageData): Metadata {
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
