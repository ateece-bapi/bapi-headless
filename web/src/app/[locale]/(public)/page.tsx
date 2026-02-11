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
  Calendar
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

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  // Await params and set request locale for next-intl
  const { locale } = await params;
  setRequestLocale(locale);
  
  // Get translations
  const t = await getTranslations('home');
  
  // Fetch latest 3 news posts
  const posts = await getPosts({ perPage: 3 });
  return (
    <main className="min-h-screen">
      {/* Hero Section - Simplified with ONE primary CTA */}
      <Hero />

      {/* Quick Stats Bar */}
      <section className="bg-neutral-50 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-gradient-to-br from-primary-600/90 via-primary-500/85 to-primary-600/90 rounded-2xl p-8 shadow-xl overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute inset-0 bg-grid-pattern"></div>
            
            <div className="relative grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {/* 30+ Years */}
              <div className="group text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl mb-4 group-hover:scale-110 group-hover:bg-white/30 transition-all duration-300">
                  <TrendingUp className="w-7 h-7 text-white" strokeWidth={2.5} />
                </div>
                <div className="text-4xl lg:text-5xl font-bold text-white mb-2 group-hover:scale-105 transition-transform duration-300">
                  {t('stats.yearsValue')}
                </div>
                <div className="text-sm font-medium text-white/90">{t('stats.yearsLabel')}</div>
              </div>

              {/* 608 Products */}
              <div className="group text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl mb-4 group-hover:scale-110 group-hover:bg-white/30 transition-all duration-300">
                  <Package className="w-7 h-7 text-white" strokeWidth={2.5} />
                </div>
                <div className="text-4xl lg:text-5xl font-bold text-white mb-2 group-hover:scale-105 transition-transform duration-300">
                  {t('stats.productsValue')}
                </div>
                <div className="text-sm font-medium text-white/90">{t('stats.productsLabel')}</div>
              </div>

              {/* Global Reach */}
              <div className="group text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl mb-4 group-hover:scale-110 group-hover:bg-white/30 transition-all duration-300">
                  <Globe className="w-7 h-7 text-white" strokeWidth={2.5} />
                </div>
                <div className="text-4xl lg:text-5xl font-bold text-white mb-2 group-hover:scale-105 transition-transform duration-300">
                  {t('stats.globalValue')}
                </div>
                <div className="text-sm font-medium text-white/90">{t('stats.globalLabel')}</div>
              </div>

              {/* ISO 9001 */}
              <div className="group text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl mb-4 group-hover:scale-110 group-hover:bg-white/30 transition-all duration-300">
                  <ShieldCheck className="w-7 h-7 text-white" strokeWidth={2.5} />
                </div>
                <div className="text-4xl lg:text-5xl font-bold text-white mb-2 group-hover:scale-105 transition-transform duration-300">
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-4">
              {t('categories.title')}
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              {t('categories.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                name: t('categories.temperature.name'),
                icon: '/images/icons/Temperature_Icon.webp',
                href: '/products',
                count: 119,
                description: t('categories.temperature.description')
              },
              {
                name: t('categories.humidity.name'),
                icon: '/images/icons/Humidity_Icon.webp',
                href: '/products',
                count: 33,
                description: t('categories.humidity.description')
              },
              {
                name: t('categories.pressure.name'),
                icon: '/images/icons/Pressure_Icon.webp',
                href: '/products',
                count: 39,
                description: t('categories.pressure.description')
              },
              {
                name: t('categories.airQuality.name'),
                icon: '/images/icons/AirQuality_Icon.webp',
                href: '/products',
                count: 32,
                description: t('categories.airQuality.description')
              },
              {
                name: t('categories.wireless.name'),
                icon: '/images/icons/Wireless_Icon.webp',
                href: '/products',
                count: 24,
                description: t('categories.wireless.description')
              },
              {
                name: t('categories.accessories.name'),
                icon: '/images/icons/Accessories_Icon.webp',
                href: '/products',
                count: 45,
                description: t('categories.accessories.description')
              },
              {
                name: t('categories.testInstruments.name'),
                icon: '/images/icons/Test_Instruments_Icon.webp',
                href: '/products',
                count: 8,
                description: t('categories.testInstruments.description')
              },
              {
                name: t('categories.etaLine.name'),
                icon: '/images/icons/Sensors_Icon.webp',
                href: '/products',
                count: 70,
                description: t('categories.etaLine.description')
              }
            ].map((category) => {
              return (
                <Link
                  key={category.name}
                  href={category.href}
                  className="group relative bg-white rounded-2xl border-2 border-neutral-200 overflow-hidden hover:border-primary-500 hover:shadow-2xl transition-all duration-300 ease-in-out will-change-transform-safe focus:outline-none focus:ring-4 focus:ring-primary-500/50 focus:border-primary-500"
                >
                  {/* Hover gradient overlay */}
                  <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-br from-primary-500/5 to-accent-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out z-10" />
                  
                  {/* Icon container with enhanced styling - matches popular products */}
                  <div className="relative bg-gradient-to-br from-primary-200 via-accent-100 to-primary-100 h-48 flex items-center justify-center p-8 border-b-2 border-neutral-100">
                    <Image
                      src={category.icon}
                      alt={`${category.name} icon`}
                      width={128}
                      height={128}
                      className="w-full h-full object-contain drop-shadow-xl group-hover:scale-110 transition-transform duration-300 ease-in-out will-change-transform-safe"
                    />
                  </div>
                  
                  <div className="p-6">
                    {/* Category count badge with BAPI accent color */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-accent-500 text-neutral-900 rounded-full text-xs font-bold uppercase tracking-wide mb-3">
                      <span className="w-1.5 h-1.5 bg-neutral-900 rounded-full" />
                      {category.count} Products
                    </div>
                    
                    {/* Category name */}
                    <h3 className="text-lg font-bold text-neutral-900 mb-2 group-hover:text-primary-600 transition-colors">
                      {category.name}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-sm text-neutral-600 mb-4 leading-relaxed">
                      {category.description}
                    </p>
                    
                    {/* View Products CTA */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-primary-600 inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                        View Products
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Browse All Products
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why BAPI - Based on original website */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-accent-50 py-12 lg:py-16 overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-500/5 rounded-full blur-3xl"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header with facility image */}
          <div className="mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-primary-500 mb-6 text-center">
              WHY BAPI?
            </h2>
            <div className="max-w-4xl mx-auto mb-8">
              <p className="text-base text-neutral-700 leading-relaxed">
                BAPI has been changing the way you think about sensors since 1993. We believe sensors are not just simple commodities. They are integral to a building automation controls system and critical to the mission of saving energy. Our commitment to innovation and quality has helped transform BAPI into a leading global manufacturer of sensor solutions with a tremendous focus on quality, reliability and value.
              </p>
            </div>
            {/* Facility Image */}
            <div className="relative w-full h-80 lg:h-[450px] rounded-2xl overflow-hidden shadow-xl border-2 border-neutral-200">
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {/* Warranty */}
            <div className="group text-center bg-white rounded-2xl p-6 border-2 border-neutral-200 hover:border-primary-500 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 focus-within:ring-4 focus-within:ring-primary-500/50">
              <div className="w-32 h-32 mx-auto mb-6 relative bg-gradient-to-br from-primary-50 via-white to-accent-50 rounded-2xl p-4 shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300 border border-primary-200">
                <Image
                  src="/images/icons/5-year-warranty-icon.webp"
                  alt="5 Year Lifetime Limited Warranty"
                  fill
                  className="object-contain p-2"
                  loading="lazy"
                />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-4">Warranty</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Our products are designed and manufactured to last. We back up that claim by offering a 5-year warranty across all of our products.
              </p>
              <p className="text-sm text-neutral-600 leading-relaxed mt-3">
                A lifetime limited warranty is also available on many of our single point, room and duct room temperature sensors.*
              </p>
            </div>

            {/* BAPI-Backed */}
            <div className="group text-center bg-white rounded-2xl p-6 border-2 border-neutral-200 hover:border-primary-500 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 focus-within:ring-4 focus-within:ring-primary-500/50">
              <div className="w-32 h-32 mx-auto mb-6 relative bg-gradient-to-br from-primary-50 via-white to-accent-50 rounded-2xl p-4 shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300 border border-primary-200">
                <Image
                  src="/images/icons/bapi-backed-logo.webp"
                  alt="BAPI Backed"
                  fill
                  className="object-contain p-2"
                  loading="lazy"
                />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-4">BAPI-Backed</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Most sensor manufacturers will replace their defective products, but only BAPI has the confidence to go beyond the industry standard.
              </p>
              <p className="text-sm text-neutral-600 leading-relaxed mt-3">
                &apos;BAPI-Backed&apos; means we stand behind everything we sell, so be confident in the quality of our products that if one fails within the warranty period, we will not only repair or replace it, but we&apos;ll provide a product expert to offset your incurred cost.*
              </p>
            </div>

            {/* BAPI Original */}
            <div className="group text-center bg-white rounded-2xl p-6 border-2 border-neutral-200 hover:border-primary-500 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 focus-within:ring-4 focus-within:ring-primary-500/50">
              <div className="w-32 h-32 mx-auto mb-6 relative bg-gradient-to-br from-primary-50 via-white to-accent-50 rounded-2xl p-4 shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300 border border-primary-200">
                <Image
                  src="/images/icons/certified-original-stamp.webp"
                  alt="BAPI Certified Original"
                  fill
                  className="object-contain p-2"
                  loading="lazy"
                />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-4">BAPI Original</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                At BAPI, we strive to be leaders in our industry by providing innovative, high quality products and services designed with you in mind.
              </p>
              <p className="text-sm text-neutral-600 leading-relaxed mt-3">
                Products displaying the &quot;Another Original&quot; stamp are unique to BAPI and the inspiration for these designs come from our valuable customers, talented employees and respected vendors. Those three ingredients combined create industry-leading, original solutions created to solve common HVACR problems.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Global Presence Map */}
      <GlobalPresence />

      {/* Latest News Section */}
      <section className="bg-white py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-full text-primary-600 font-semibold text-sm mb-4">
                <Newspaper className="w-4 h-4" />
                Latest News
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900">
                Stay Informed
              </h2>
              <p className="text-lg text-neutral-600 mt-2">
                Latest updates, product announcements, and industry insights
              </p>
            </div>
            <Link
              href="/company/news"
              className="hidden md:inline-flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              View All News
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {posts.length === 0 ? (
            <div className="bg-neutral-50 rounded-2xl p-12 text-center border-2 border-dashed border-neutral-300">
              <Newspaper className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
              <p className="text-lg text-neutral-600">No news articles available yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="group relative bg-white border-2 border-neutral-200 rounded-2xl overflow-hidden hover:border-primary-500 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 focus-within:ring-4 focus-within:ring-primary-500/50"
                >
                  {/* Featured Image */}
                  {post.featuredImage && (
                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-neutral-100 to-neutral-200">
                      <Image
                        src={post.featuredImage}
                        alt={post.title || 'News article'}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                      {/* Overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-6">
                    {/* Date Badge */}
                    <div className="flex items-center gap-2 text-sm text-neutral-600 mb-3">
                      <Calendar className="w-4 h-4 text-primary-500" />
                      <time dateTime={post.date || ''}>
                        {post.date ? new Date(post.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        }) : 'Date unavailable'}
                      </time>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-neutral-900 mb-3 group-hover:text-primary-600 transition-colors line-clamp-2">
                      {post.title}
                    </h3>

                    {/* Excerpt */}
                    {post.excerpt && (
                      <div
                        className="text-sm text-neutral-600 mb-4 line-clamp-3"
                        dangerouslySetInnerHTML={{ __html: post.excerpt }}
                      />
                    )}

                    {/* Read More Link */}
                    <Link
                      href={`/company/news/${post.slug}`}
                      className="inline-flex items-center gap-1 text-sm font-bold text-primary-600 hover:text-primary-700 transition-colors group-hover:gap-2"
                      aria-label={`Read more about ${post.title}`}
                    >
                      Read More
                      <ArrowRight className="w-4 h-4" />
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
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              View All News
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA - Single Focus on Product Discovery */}
      <section className="bg-gradient-to-br from-primary-700 via-primary-600 to-primary-500 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 drop-shadow-md">
            Ready to Find Your Solution?
          </h2>
          <p className="text-lg text-primary-100 mb-8 max-w-2xl mx-auto drop-shadow-sm">
            Explore our complete catalog or connect with our sales team for expert guidance
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="btn-bapi-accent inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-lg"
            >
              Explore Products
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-neutral-50 text-primary-500 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-white hover:border-accent-500"
            >
              Talk to Sales
            </Link>
          </div>

          <div className="mt-8 pt-8 border-t border-primary-400/50 text-primary-100">
            <p className="text-sm drop-shadow-sm">
              <strong>Made in USA</strong> • Same-Day Shipping • ISO 9001:2015 Certified • 30+ Years of Excellence
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

