'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ArrowRight, Sparkles, Award } from 'lucide-react';

// Mock data for product categories - BRAND STANDARD ORDER
// Per BAPI Brand Guide: Temperature, Humidity, Pressure, Air Quality, Wireless, Accessories, Test Instruments
const productCategories = [
  {
    nameKey: 'temperatureSensors',
    slug: 'temperature-sensors',
    count: 119,
    image: '/products/temp_sensors.webp',
    icon: '/images/icons/Temperature_Icon.webp',
  },
  {
    nameKey: 'humiditySensors',
    slug: 'humidity-sensors',
    count: 33,
    image: '/products/humidity_sensors.webp',
    icon: '/images/icons/Humidity_Icon.webp',
  },
  {
    nameKey: 'pressureSensors',
    slug: 'pressure-sensors',
    count: 39,
    image: '/products/pressure_sensors.webp',
    icon: '/images/icons/Pressure_Icon.webp',
  },
  {
    nameKey: 'airQualitySensors',
    slug: 'air-quality-sensors',
    count: 32,
    image: '/products/air_quality_sensors.webp',
    icon: '/images/icons/AirQuality_Icon.webp',
  },
  {
    nameKey: 'wirelessSensors',
    slug: 'wireless-sensors',
    count: 24,
    image: '/products/wireless_sensors.webp',
    icon: '/images/icons/Wireless_Icon.webp',
  },
  {
    nameKey: 'accessories',
    slug: 'accessories',
    count: 45,
    image: '/products/accessories_products.webp',
    icon: '/images/icons/Accessories_Icon.webp',
  },
  {
    nameKey: 'testInstruments',
    slug: 'test-instruments',
    count: 8,
    image: '/products/test_products.webp',
    icon: '/images/icons/Test_Instruments_Icon.webp',
  },
  {
    nameKey: 'etaLine',
    slug: 'eta-line',
    count: 70,
    image: '/products/eta_modules_products.webp',
    icon: '/images/icons/Sensors_Icon.webp',
  },
];

export default function MainProductPage() {
  const t = useTranslations();
  const params = useParams();
  const locale = (params?.locale as string) || 'en';
  // For page fade
  const [pageVisible, setPageVisible] = useState(false);
  // For card animation
  const [showCards, setShowCards] = useState(false);

  useEffect(() => {
    // Valid: Setting state on mount for page transition animation
    // eslint-disable-next-line react-hooks/exhaustive-deps
    setPageVisible(true);
    // Staggered card animation
    const timeout = setTimeout(() => setShowCards(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <main
      className={`bg-linear-to-br min-h-screen from-slate-50 via-white to-primary-50/30 transition-opacity duration-500 ${pageVisible ? 'opacity-100' : 'opacity-0'}`}
      data-testid="products-page-fade"
    >
      {/* Hero Section */}
      <section className="bg-linear-to-br relative overflow-hidden from-primary-700 via-primary-600 to-primary-500">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="h-150 w-150 absolute right-0 top-0 -translate-y-1/3 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-96 w-96 translate-y-1/3 rounded-full bg-primary-400/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          {/* Breadcrumb */}
          <nav
            className="mb-8 flex items-center gap-2 text-sm text-primary-100"
            aria-label="Breadcrumb"
          >
            <Link href={`/${locale}`} className="transition-colors hover:text-white">
              {t('productsPage.breadcrumb.home')}
            </Link>
            <span>/</span>
            <span className="font-medium text-white">{t('productsPage.breadcrumb.products')}</span>
          </nav>

          {/* Header */}
          <div className="max-w-4xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
              <Sparkles className="h-4 w-4" />
              {t('productsPage.hero.badge')}
            </div>

            <h1 className="mb-6 text-5xl font-bold tracking-tight text-white md:text-6xl lg:text-7xl">
              {t('productsPage.hero.title')}
            </h1>

            <p className="mb-8 text-xl leading-relaxed text-primary-50 md:text-2xl">
              {t('productsPage.hero.description')}
            </p>

            {/* Key Stats */}
            <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
              <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
                <div className="mb-1 text-3xl font-bold text-white">
                  {t('productsPage.hero.stats.productsCount')}
                </div>
                <div className="text-sm text-primary-100">
                  {t('productsPage.hero.stats.productsLabel')}
                </div>
              </div>
              <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
                <div className="mb-1 text-3xl font-bold text-white">
                  {t('productsPage.hero.stats.warrantyDuration')}
                </div>
                <div className="text-sm text-primary-100">
                  {t('productsPage.hero.stats.warrantyLabel')}
                </div>
              </div>
              <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
                <div className="mb-1 text-3xl font-bold text-white">
                  {t('productsPage.hero.stats.accuracyValue')}
                </div>
                <div className="text-sm text-primary-100">
                  {t('productsPage.hero.stats.accuracyLabel')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Grid */}
      <section className="relative mx-auto -mt-16 max-w-7xl px-4 pb-20 sm:px-6 lg:px-8 lg:pb-28">
        <div className="mb-20 grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {productCategories.map((cat, i) => {
            return (
              <Link
                key={cat.slug}
                href={`/${locale}/categories/${cat.slug}`}
                className={`group relative block overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl transition-all duration-500 hover:border-primary-200 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 ${showCards ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'} `}
                style={{
                  transitionDelay: showCards ? `${i * 75}ms` : '0ms',
                }}
                tabIndex={0}
                aria-label={`View ${t(`productsPage.categories.${cat.nameKey}.name`)} category (${cat.count} products)`}
              >
                {/* Product Image */}
                <div className="bg-linear-to-br relative flex aspect-square w-full items-center justify-center overflow-hidden from-gray-50 to-white p-10">
                  <Image
                    src={cat.image}
                    alt={`${t(`productsPage.categories.${cat.nameKey}.name`)} product category`}
                    fill
                    className="object-contain p-8 drop-shadow-lg transition-transform duration-500 group-hover:scale-110"
                    sizes="(min-width: 1280px) 300px, (min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                    quality={85}
                    priority={i === 0}
                    loading={i === 0 ? 'eager' : 'lazy'}
                  />
                  {/* Icon Badge - BAPI Brand Icons */}
                  <div className="bg-linear-to-br absolute right-4 top-4 flex h-16 w-16 items-center justify-center rounded-2xl from-[#1479BC] to-[#0054b6] shadow-lg">
                    <Image
                      src={cat.icon}
                      alt={`${t(`productsPage.categories.${cat.nameKey}.name`)} icon`}
                      width={40}
                      height={40}
                      className="object-contain"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="relative p-7">
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <h2 className="relative text-xl font-bold leading-tight text-gray-900 transition-colors duration-300">
                      {t(`productsPage.categories.${cat.nameKey}.name`)}
                      {/* BAPI Yellow underline on hover */}
                      <span className="absolute -bottom-1 left-0 h-1 w-0 rounded bg-accent-500 transition-all duration-300 ease-in-out group-hover:w-full" />
                    </h2>
                    <span className="shrink-0 rounded-md bg-primary-50 px-3 py-1.5 text-sm font-semibold text-primary-700">
                      {cat.count}
                    </span>
                  </div>

                  <p className="mb-6 line-clamp-2 text-sm leading-relaxed text-gray-600">
                    {t(`productsPage.categories.${cat.nameKey}.description`)}
                  </p>

                  {/* View Link */}
                  <div className="inline-flex items-center gap-2 border-b-2 border-transparent pb-0.5 text-sm font-semibold text-primary-600 transition-all duration-300 group-hover:gap-3 group-hover:border-primary-600">
                    <span>{t('productsPage.categories.viewProducts')}</span>
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Featured Section */}
        <div className="bg-linear-to-br mb-20 rounded-2xl from-primary-50 to-primary-100/50 p-10 lg:p-16">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary-100 px-4 py-2 text-sm font-medium text-primary-700">
                <Award className="h-4 w-4" />
                {t('productsPage.featured.badge')}
              </div>

              <h2 className="mb-4 text-4xl font-bold text-gray-900">
                {t('productsPage.featured.title')}
              </h2>

              <p className="mb-6 text-lg leading-relaxed text-gray-700">
                {t('productsPage.featured.description')}
              </p>

              <Link
                href={`/${locale}/products/featured/ba-series`}
                className="bg-linear-to-r inline-flex items-center gap-2 rounded-xl from-primary-600 to-primary-700 px-6 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                {t('productsPage.featured.viewButton')}
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>

            <div className="grid gap-4">
              {[
                {
                  label: t('productsPage.featured.features.accuracy.label'),
                  value: t('productsPage.featured.features.accuracy.value'),
                },
                {
                  label: t('productsPage.featured.features.bacnet.label'),
                  value: t('productsPage.featured.features.bacnet.value'),
                },
                {
                  label: t('productsPage.featured.features.warranty.label'),
                  value: t('productsPage.featured.features.warranty.value'),
                },
                {
                  label: t('productsPage.featured.features.madeInUSA.label'),
                  value: t('productsPage.featured.features.madeInUSA.value'),
                },
              ].map((item, index) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-lg bg-white p-4 shadow-sm transition-shadow duration-300 hover:shadow-md"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <span className="font-semibold text-gray-900">{item.label}</span>
                  <span className="font-medium text-primary-600">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-linear-to-br relative overflow-hidden rounded-2xl from-primary-600 to-primary-700 p-10 shadow-2xl lg:p-16">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
          <div className="absolute right-0 top-0 h-96 w-96 -translate-y-1/2 translate-x-1/2 rounded-full bg-white/10 blur-3xl" />

          <div className="relative flex flex-col items-center justify-between gap-8 text-center lg:flex-row lg:text-left">
            <div>
              <h2 className="mb-3 text-3xl font-bold text-white lg:text-4xl">
                {t('productsPage.cta.title')}
              </h2>
              <p className="max-w-2xl text-lg text-primary-50">
                {t('productsPage.cta.description')}
              </p>
            </div>

            <Link
              href={`/${locale}/company/contact-us`}
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-xl bg-white px-8 py-4 font-semibold text-primary-600 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              {t('productsPage.cta.button')}
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
