import Link from 'next/link';
import Image from 'next/image';
import Hero from '@/components/Hero';
import { GlobalPresence } from '@/components/company/GlobalPresence';
import { getPosts } from '@/lib/wordpress';
import { locales } from '@/i18n';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import {
  ArrowRight,
  Globe,
  TrendingUp,
  Package,
  ShieldCheck,
  Newspaper,
  Calendar,
} from 'lucide-react';

/**
 * Homepage - Main landing page for BAPI Headless E-Commerce
 *
 * Performance & Best Practices:
 * - All inline styles removed (Feb 2026 refactor)
 * - CSS classes defined in globals.css for reusability
 * - GPU-accelerated transforms via .will-change-transform-safe
 * - Background images loaded via CSS classes, not inline styles
 * - SVG patterns as CSS classes for better CSP compliance
 * - Full static generation with ISR (revalidate: 3600)
 *
 * Architecture:
 * - Server Component (async data fetching)
 * - Static params generation for all locales
 * - Tailwind utility-first approach
 * - BAPI brand color system (60% Gray/White, 30% Blue, 10% Yellow)
 */

/**
 * Generate static pages for all supported locales
 * This enables full static generation and CDN caching
 */
export function generateStaticParams() {
  return locales.map((locale) => ({
    locale,
  }));
}

/**
 * Revalidate every 1 hour
 * Pages will be regenerated in the background with fresh data
 */
export const revalidate = 3600;

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  // Await params and set request locale for next-intl
  const { locale } = await params;
  setRequestLocale(locale);

  // Get translations
  const t = await getTranslations('home');

  // Prepare hero translations
  const heroTranslations = {
    title: t('hero.title'),
    description: t('hero.description'),
    cta: t('hero.cta'),
    secondaryCta: t('hero.secondaryCta'),
    productFamilyTitle: t('hero.productFamilyTitle'),
    productFamilySubtitle: t('hero.productFamilySubtitle'),
    taglines: [
      t('taglines.0'),
      t('taglines.1'),
      t('taglines.2'),
      t('taglines.3'),
      t('taglines.4'),
      t('taglines.5'),
      t('taglines.6'),
    ],
  };

  // Fetch latest 3 news posts
  const posts = await getPosts({ perPage: 3 });
  return (
    <main className="min-h-screen">
      {/* Hero Section - Simplified with ONE primary CTA */}
      <Hero translations={heroTranslations} />

      {/* Quick Stats Bar */}
      <section className="bg-neutral-50 py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-linear-to-br relative overflow-hidden rounded-2xl from-primary-700 via-primary-600 to-primary-500 p-8 shadow-xl">
            {/* Decorative background elements */}
            <div className="bg-grid-pattern absolute inset-0"></div>

            <div className="relative grid grid-cols-2 gap-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
              {/* 30+ Years */}
              <div className="group text-center">
                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-white/30">
                  <TrendingUp className="h-7 w-7 text-white" strokeWidth={2.5} />
                </div>
                <div className="mb-2 text-4xl font-bold text-white transition-transform duration-300 group-hover:scale-105 lg:text-5xl">
                  {t('stats.yearsValue')}
                </div>
                <div className="text-sm font-medium text-white/90">{t('stats.yearsLabel')}</div>
              </div>

              {/* 608 Products */}
              <div className="group text-center">
                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-white/30">
                  <Package className="h-7 w-7 text-white" strokeWidth={2.5} />
                </div>
                <div className="mb-2 text-4xl font-bold text-white transition-transform duration-300 group-hover:scale-105 lg:text-5xl">
                  {t('stats.productsValue')}
                </div>
                <div className="text-sm font-medium text-white/90">{t('stats.productsLabel')}</div>
              </div>

              {/* Global Reach */}
              <div className="group text-center">
                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-white/30">
                  <Globe className="h-7 w-7 text-white" strokeWidth={2.5} />
                </div>
                <div className="mb-2 text-4xl font-bold text-white transition-transform duration-300 group-hover:scale-105 lg:text-5xl">
                  {t('stats.globalValue')}
                </div>
                <div className="text-sm font-medium text-white/90">{t('stats.globalLabel')}</div>
              </div>

              {/* ISO 9001 */}
              <div className="group text-center">
                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-white/30">
                  <ShieldCheck className="h-7 w-7 text-white" strokeWidth={2.5} />
                </div>
                <div className="mb-2 text-4xl font-bold text-white transition-transform duration-300 group-hover:scale-105 lg:text-5xl">
                  {t('stats.isoValue')}
                </div>
                <div className="text-sm font-medium text-white/90">{t('stats.isoLabel')}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Categories - 8 Main Product Lines */}
      <section className="bg-white py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-neutral-900 lg:text-4xl">
              {t('categories.title')}
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-neutral-600">{t('categories.subtitle')}</p>
          </div>

          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {[
              {
                name: t('categories.temperature.name'),
                icon: '/images/icons/Temperature_Icon.webp',
                href: '/products',
                count: 119,
                description: t('categories.temperature.description'),
              },
              {
                name: t('categories.humidity.name'),
                icon: '/images/icons/Humidity_Icon.webp',
                href: '/products',
                count: 33,
                description: t('categories.humidity.description'),
              },
              {
                name: t('categories.pressure.name'),
                icon: '/images/icons/Pressure_Icon.webp',
                href: '/products',
                count: 39,
                description: t('categories.pressure.description'),
              },
              {
                name: t('categories.airQuality.name'),
                icon: '/images/icons/AirQuality_Icon.webp',
                href: '/products',
                count: 32,
                description: t('categories.airQuality.description'),
              },
              {
                name: t('categories.wireless.name'),
                icon: '/images/icons/Wireless_Icon.webp',
                href: '/products',
                count: 24,
                description: t('categories.wireless.description'),
              },
              {
                name: t('categories.accessories.name'),
                icon: '/images/icons/Accessories_Icon.webp',
                href: '/products',
                count: 45,
                description: t('categories.accessories.description'),
              },
              {
                name: t('categories.testInstruments.name'),
                icon: '/images/icons/Test_Instruments_Icon.webp',
                href: '/products',
                count: 8,
                description: t('categories.testInstruments.description'),
              },
              {
                name: t('categories.etaLine.name'),
                icon: '/images/icons/Sensors_Icon.webp',
                href: '/products',
                count: 70,
                description: t('categories.etaLine.description'),
              },
            ].map((category) => {
              return (
                <Link
                  key={category.name}
                  href={category.href}
                  className="will-change-transform-safe group relative overflow-hidden rounded-2xl border-2 border-neutral-200 bg-white transition-all duration-300 ease-in-out hover:border-primary-500 hover:shadow-2xl focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/50"
                >
                  {/* Icon container - BAPI brand blue */}
                  <div className="bg-linear-to-br relative flex h-48 items-center justify-center border-b-2 border-primary-700 from-[#044976] to-[#1479bc] p-8">
                    <Image
                      src={category.icon}
                      alt={`${category.name} icon`}
                      width={128}
                      height={128}
                      className="will-change-transform-safe h-full w-full object-contain drop-shadow-xl transition-transform duration-300 ease-in-out group-hover:scale-110"
                    />
                  </div>

                  <div className="p-6">
                    {/* Category count badge with BAPI accent color */}
                    <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-accent-500 px-3 py-1 text-xs font-bold uppercase tracking-wide text-neutral-900">
                      <span className="h-1.5 w-1.5 rounded-full bg-neutral-900" />
                      {category.count} Products
                    </div>

                    {/* Category name */}
                    <h3 className="mb-2 text-lg font-bold text-neutral-900 transition-colors group-hover:text-primary-600">
                      {category.name}
                    </h3>

                    {/* Description */}
                    <p className="mb-4 text-sm leading-relaxed text-neutral-600">
                      {category.description}
                    </p>

                    {/* View Products CTA */}
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 text-sm font-bold text-primary-600 transition-all group-hover:gap-2">
                        {t('categories.viewProducts')}
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-xl bg-primary-500 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:bg-primary-600 hover:shadow-xl"
            >
              {t('categories.browseAll')}
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why BAPI - Based on original website */}
      <section className="bg-linear-to-br relative overflow-hidden from-white to-primary-50 py-12 lg:py-16">
        {/* Decorative background elements */}
        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-primary-500/5 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-accent-500/5 blur-3xl"></div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header with facility image */}
          <div className="mb-12">
            <h2 className="mb-6 text-center text-3xl font-bold text-primary-500 lg:text-4xl">
              {t('whyBapi.title')}
            </h2>
            <div className="mx-auto mb-8 max-w-4xl">
              <p className="text-base leading-relaxed text-neutral-700">
                {t('whyBapi.description')}
              </p>
            </div>
            {/* Facility Image */}
            <div className="relative h-80 w-full overflow-hidden rounded-2xl border-2 border-neutral-200 shadow-xl lg:h-[450px]">
              <Image
                src="/images/bapi-facility-solar.webp"
                alt="BAPI Manufacturing Facility with Solar Panels"
                fill
                className="object-cover object-center"
                sizes="(min-width: 1024px) 1200px, 100vw"
                priority
              />
            </div>
          </div>

          {/* Three Pillars */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:gap-12">
            {/* Warranty */}
            <div className="group rounded-2xl border-2 border-neutral-200 bg-white p-6 text-center transition-all duration-300 focus-within:ring-4 focus-within:ring-primary-500/50 hover:-translate-y-1 hover:border-primary-500 hover:shadow-2xl">
              <div className="bg-linear-to-br relative mx-auto mb-6 h-32 w-32 rounded-2xl border border-primary-200 from-white to-primary-50 p-4 shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl">
                <Image
                  src="/images/icons/5-year-warranty-icon.webp"
                  alt="5 Year Lifetime Limited Warranty"
                  fill
                  className="object-contain p-2"
                  loading="lazy"
                />
              </div>
              <h3 className="mb-4 text-xl font-bold text-neutral-900">
                {t('whyBapi.warranty.title')}
              </h3>
              <p className="text-sm leading-relaxed text-neutral-600">
                {t('whyBapi.warranty.description')}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-neutral-600">
                {t('whyBapi.warranty.footnote')}
              </p>
            </div>

            {/* BAPI-Backed */}
            <div className="group rounded-2xl border-2 border-neutral-200 bg-white p-6 text-center transition-all duration-300 focus-within:ring-4 focus-within:ring-primary-500/50 hover:-translate-y-1 hover:border-primary-500 hover:shadow-2xl">
              <div className="bg-linear-to-br relative mx-auto mb-6 h-32 w-32 rounded-2xl border border-primary-200 from-white to-primary-50 p-4 shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl">
                <Image
                  src="/images/icons/bapi-backed-logo.webp"
                  alt="BAPI Backed"
                  fill
                  className="object-contain p-2"
                  loading="lazy"
                />
              </div>
              <h3 className="mb-4 text-xl font-bold text-neutral-900">
                {t('whyBapi.bapiBackedTitle')}
              </h3>
              <p className="text-sm leading-relaxed text-neutral-600">
                {t('whyBapi.bapiBackedDescription')}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-neutral-600">
                {t('whyBapi.bapiBackedFootnote')}
              </p>
            </div>

            {/* BAPI Original */}
            <div className="group rounded-2xl border-2 border-neutral-200 bg-white p-6 text-center transition-all duration-300 focus-within:ring-4 focus-within:ring-primary-500/50 hover:-translate-y-1 hover:border-primary-500 hover:shadow-2xl">
              <div className="bg-linear-to-br relative mx-auto mb-6 h-32 w-32 rounded-2xl border border-primary-200 from-white to-primary-50 p-4 shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl">
                <Image
                  src="/images/icons/certified-original-stamp.webp"
                  alt="BAPI Certified Original"
                  fill
                  className="object-contain p-2"
                  loading="lazy"
                />
              </div>
              <h3 className="mb-4 text-xl font-bold text-neutral-900">
                {t('whyBapi.bapiOriginal.title')}
              </h3>
              <p className="text-sm leading-relaxed text-neutral-600">
                {t('whyBapi.bapiOriginal.description')}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-neutral-600">
                {t('whyBapi.bapiOriginal.footnote')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Global Presence Section */}
      <GlobalPresence
        title={t('locations.title')}
        subtitle={t('locations.subtitle')}
        locationTranslations={{
          mapLegend: {
            headquarters: t('locations.mapLegend.headquarters'),
            manufacturing: t('locations.mapLegend.manufacturing'),
            sales: t('locations.mapLegend.sales'),
            distributionPartner: t('locations.mapLegend.distributionPartner'),
          },
          facilities: {
            'headquarters-usa': {
              name: t('locations.facilities.headquartersUsa.name'),
              city: t('locations.facilities.headquartersUsa.city'),
              country: t('locations.facilities.headquartersUsa.country'),
              description: t('locations.facilities.headquartersUsa.description'),
              type: t('locations.facilities.headquartersUsa.type'),
              established: t('locations.facilities.headquartersUsa.established'),
            },
            'manufacturing-poland': {
              name: t('locations.facilities.manufacturingPoland.name'),
              city: t('locations.facilities.manufacturingPoland.city'),
              country: t('locations.facilities.manufacturingPoland.country'),
              description: t('locations.facilities.manufacturingPoland.description'),
              type: t('locations.facilities.manufacturingPoland.type'),
            },
            'manufacturing-vietnam': {
              name: t('locations.facilities.manufacturingVietnam.name'),
              city: t('locations.facilities.manufacturingVietnam.city'),
              country: t('locations.facilities.manufacturingVietnam.country'),
              description: t('locations.facilities.manufacturingVietnam.description'),
              type: t('locations.facilities.manufacturingVietnam.type'),
              status: t('locations.facilities.manufacturingVietnam.status'),
            },
            'sales-uk': {
              name: t('locations.facilities.salesUk.name'),
              city: t('locations.facilities.salesUk.city'),
              country: t('locations.facilities.salesUk.country'),
              description: t('locations.facilities.salesUk.description'),
              type: t('locations.facilities.salesUk.type'),
            },
          },
          cta: {
            text: t('locations.cta.text'),
            button: t('locations.cta.button'),
          },
        }}
      />

      {/* Latest News Section */}
      <section className="bg-white py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex items-center justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-2 text-sm font-semibold text-primary-600">
                <Newspaper className="h-4 w-4" />
                {t('news.badge')}
              </div>
              <h2 className="text-3xl font-bold text-neutral-900 lg:text-4xl">{t('news.title')}</h2>
              <p className="mt-2 text-lg text-neutral-600">{t('news.subtitle')}</p>
            </div>
            <Link
              href="/company/news"
              className="hidden items-center gap-2 rounded-xl bg-primary-500 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:bg-primary-600 hover:shadow-xl md:inline-flex"
            >
              {t('news.viewAll')}
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>

          {posts.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-neutral-300 bg-neutral-50 p-12 text-center">
              <Newspaper className="mx-auto mb-4 h-16 w-16 text-neutral-400" />
              <p className="text-lg text-neutral-600">{t('news.noArticles')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="group relative overflow-hidden rounded-2xl border-2 border-neutral-200 bg-white transition-all duration-300 focus-within:ring-4 focus-within:ring-primary-500/50 hover:-translate-y-1 hover:border-primary-500 hover:shadow-2xl"
                >
                  {/* Featured Image */}
                  {post.featuredImage && (
                    <div className="bg-linear-to-br relative h-48 overflow-hidden from-neutral-100 to-neutral-200">
                      <Image
                        src={post.featuredImage}
                        alt={post.title || 'News article'}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                      />
                      {/* Overlay gradient */}
                      <div className="bg-linear-to-t absolute inset-0 from-black/30 to-transparent" />
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-6">
                    {/* Date Badge */}
                    <div className="mb-3 flex items-center gap-2 text-sm text-neutral-600">
                      <Calendar className="h-4 w-4 text-primary-500" />
                      <time dateTime={post.date || ''}>
                        {post.date
                          ? new Date(post.date).toLocaleDateString(locale, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })
                          : t('news.dateUnavailable')}
                      </time>
                    </div>

                    {/* Title */}
                    <h3 className="mb-3 line-clamp-2 text-lg font-bold text-neutral-900 transition-colors group-hover:text-primary-600">
                      {post.title}
                    </h3>

                    {/* Excerpt */}
                    {post.excerpt && (
                      <div
                        className="mb-4 line-clamp-3 text-sm text-neutral-600"
                        dangerouslySetInnerHTML={{ __html: post.excerpt }}
                      />
                    )}

                    {/* Read More Link */}
                    <Link
                      href={`/company/news/${post.slug}`}
                      className="inline-flex items-center gap-1 text-sm font-bold text-primary-600 transition-colors hover:text-primary-700 group-hover:gap-2"
                      aria-label={t('news.readMoreAriaLabel', { title: post.title })}
                    >
                      {t('news.readMore')}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Mobile View All Button */}
          <div className="mt-8 text-center md:hidden">
            <Link
              href="/company/news"
              className="inline-flex items-center gap-2 rounded-xl bg-primary-500 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:bg-primary-600 hover:shadow-xl"
            >
              {t('news.viewAll')}
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA - Single Focus on Product Discovery */}
      <section className="bg-linear-to-br from-primary-700 via-primary-600 to-primary-500 py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-3xl font-bold text-white drop-shadow-md lg:text-4xl">
            {t('finalCta.title')}
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-primary-100 drop-shadow-sm">
            {t('finalCta.subtitle')}
          </p>

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/products"
              className="btn-bapi-accent inline-flex items-center justify-center gap-2 rounded-xl px-8 py-4 text-lg"
            >
              {t('finalCta.exploreProducts')}
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white bg-white px-8 py-4 text-lg font-bold text-primary-500 shadow-lg transition-all duration-300 hover:border-accent-500 hover:bg-neutral-50 hover:shadow-xl"
            >
              {t('finalCta.talkToSales')}
            </Link>
          </div>

          <div className="mt-8 border-t border-primary-400/50 pt-8 text-primary-100">
            <p className="text-sm drop-shadow-sm">{t('finalCta.footer')}</p>
          </div>
        </div>
      </section>
    </main>
  );
}
