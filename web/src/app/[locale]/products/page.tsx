import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { ArrowRightIcon, SparklesIcon, AwardIcon } from '@/lib/icons';
import { ProductCategoryGrid } from '@/components/products/ProductCategoryGrid';

// Mock data for product categories - BRAND STANDARD ORDER
// Per BAPI Brand Guide: Temperature, Humidity, Pressure, Air Quality, Wireless, Accessories, Test Instruments
// Product counts verified via GraphQL: March 13, 2026
const productCategories = [
  {
    nameKey: 'temperatureSensors',
    slug: 'temperature-sensors',
    count: 113, // GraphQL verified
    image: '/products/temp_sensors.webp',
    icon: '/images/icons/Temperature_Icon.webp',
  },
  {
    nameKey: 'humiditySensors',
    slug: 'humidity-sensors',
    count: 33, // GraphQL verified ✅
    image: '/products/humidity_sensors.webp',
    icon: '/images/icons/Humidity_Icon.webp',
  },
  {
    nameKey: 'pressureSensors',
    slug: 'pressure-sensors',
    count: 29, // GraphQL verified
    image: '/products/pressure_sensors.webp',
    icon: '/images/icons/Pressure_Icon.webp',
  },
  {
    nameKey: 'airQualitySensors',
    slug: 'air-quality-sensors',
    count: 30, // GraphQL verified
    image: '/products/air_quality_sensors.webp',
    icon: '/images/icons/AirQuality_Icon.webp',
  },
  {
    nameKey: 'wirelessSensors',
    slug: 'wireless-sensors',
    count: 24, // Note: Maps to 'bluetooth-wireless' in WordPress (24 products)
    image: '/products/wireless_sensors.webp',
    icon: '/images/icons/Wireless_Icon.webp',
  },
  {
    nameKey: 'accessories',
    slug: 'accessories',
    count: 74, // GraphQL verified
    image: '/products/accessories_products.webp',
    icon: '/images/icons/Accessories_Icon.webp',
  },
  {
    nameKey: 'testInstruments',
    slug: 'test-instruments',
    count: 3, // GraphQL verified
    image: '/products/test_products.webp',
    icon: '/images/icons/Test_Instruments_Icon.webp',
  },
  {
    nameKey: 'etaLine',
    slug: 'eta-line',
    count: 70, // GraphQL verified ✅
    image: '/products/eta_modules_products.webp',
    icon: '/images/icons/Sensors_Icon.webp',
  },
];

export default async function MainProductPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations();

  return (
    <div className="bg-linear-to-br min-h-screen from-slate-50 via-white to-primary-50/30"
    >
      {/* Hero Section - Server Rendered for Fast LCP */}
      <section className="bg-linear-to-br relative overflow-hidden from-primary-700 via-primary-600 to-primary-500">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="h-150 w-150 absolute right-0 top-0 -translate-y-1/3 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-96 w-96 translate-y-1/3 rounded-full bg-primary-400/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          {/* Breadcrumb */}
          <nav
            className="mb-8 flex items-center gap-2 text-sm text-primary-100"
            aria-label="Products page navigation"
          >
            <Link href={`/${locale}`} className="transition-colors hover:text-white">
              {t('productsPage.breadcrumb.home')}
            </Link>
            <span>/</span>
            <span className="font-medium text-white">{t('productsPage.breadcrumb.products')}</span>
          </nav>

          {/* Header */}
          <div className="max-w-4xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white">
              <SparklesIcon className="h-4 w-4" />
              {t('productsPage.hero.badge')}
            </div>

            <h1 className="mb-6 text-5xl font-bold tracking-tight text-white md:text-6xl lg:text-7xl">
              {t('productsPage.hero.title')}
            </h1>

            <p className="mb-8 text-xl leading-relaxed text-primary-50 md:text-2xl">
              {t('productsPage.hero.description')}
            </p>

            {/* Key Stats - Removed backdrop-blur for faster rendering */}
            <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
              <div className="rounded-xl bg-white/10 p-4">
                <div className="mb-1 text-3xl font-bold text-white">
                  {t('productsPage.hero.stats.productsCount')}
                </div>
                <div className="text-sm text-primary-100">
                  {t('productsPage.hero.stats.productsLabel')}
                </div>
              </div>
              <div className="rounded-xl bg-white/10 p-4">
                <div className="mb-1 text-3xl font-bold text-white">
                  {t('productsPage.hero.stats.warrantyDuration')}
                </div>
                <div className="text-sm text-primary-100">
                  {t('productsPage.hero.stats.warrantyLabel')}
                </div>
              </div>
              <div className="rounded-xl bg-white/10 p-4">
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

      {/* Category Grid - Client Component for Animations */}
      <section className="relative mx-auto -mt-16 max-w-7xl px-4 pb-20 sm:px-6 lg:px-8 lg:pb-28">
        <ProductCategoryGrid categories={productCategories} />

        {/* Featured Section */}
        <div className="bg-linear-to-br mb-20 rounded-2xl from-primary-50 to-primary-100/50 p-10 lg:p-16">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary-100 px-4 py-2 text-sm font-medium text-primary-700">
                <AwardIcon className="h-4 w-4" />
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
                <ArrowRightIcon className="h-5 w-5" />
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
              <ArrowRightIcon className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
