import Image from 'next/image';
import { Link } from '@/lib/navigation';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { generatePageMetadata } from '@/lib/metadata';
import { ChevronRightIcon, CheckCircleIcon } from '@/lib/icons';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'accessoriesLandingPage' });

  return generatePageMetadata(
    {
      title: t('metadata.title'),
      description: t('metadata.description'),
      path: 'accessories',
      keywords: t('metadata.keywords')
        .split(',')
        .map((k) => k.trim())
        .filter(Boolean),
    },
    locale
  );
}

export default async function AccessoriesPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'accessoriesLandingPage' });
  const tCommon = await getTranslations({ locale, namespace: 'common' });

  // Specialty Sensors - 3 products
  const specialtySensors = [
    {
      name: t('specialtySensors.waterLeakDetectors.name'),
      slug: 'water-leak-detectors',
      features: [
        t('specialtySensors.waterLeakDetectors.feature1'),
        t('specialtySensors.waterLeakDetectors.feature2'),
        t('specialtySensors.waterLeakDetectors.feature3'),
      ],
      image: '/images/accessories/specialty/1-water-leak-sensors.png',
    },
    {
      name: t('specialtySensors.doorMonitor.name'),
      slug: 'door-monitor-alarm',
      features: [
        t('specialtySensors.doorMonitor.feature1'),
        t('specialtySensors.doorMonitor.feature2'),
        t('specialtySensors.doorMonitor.feature3'),
      ],
      image: '/images/accessories/specialty/DMA_LEDs.png',
    },
    {
      name: t('specialtySensors.outdoorLight.name'),
      slug: 'outdoor-light-level-sensor',
      features: [
        t('specialtySensors.outdoorLight.feature1'),
        t('specialtySensors.outdoorLight.feature2'),
        t('specialtySensors.outdoorLight.feature3'),
      ],
      image: '/images/accessories/specialty/Light-Level-Sensor.png',
    },
  ];

  // Accessories - 6 products
  const accessories = [
    {
      name: t('accessories.vc350.name'),
      slug: 'vc350-ez-voltage',
      features: [
        t('accessories.vc350.feature1'),
        t('accessories.vc350.feature2'),
        t('accessories.vc350.feature3'),
      ],
      image: '/images/accessories/accessories/VC_350A_EZ-Blue.png',
    },
    {
      name: t('accessories.powerDistribution.name'),
      slug: 'power-distribution-module',
      features: [
        t('accessories.powerDistribution.feature1'),
        t('accessories.powerDistribution.feature2'),
        t('accessories.powerDistribution.feature3'),
      ],
      image: '/images/accessories/accessories/PDM.png',
    },
    {
      name: t('accessories.bapiGuard.name'),
      slug: 'bapi-guard',
      features: [
        t('accessories.bapiGuard.feature1'),
        t('accessories.bapiGuard.feature2'),
        t('accessories.bapiGuard.feature3'),
      ],
      image: '/images/accessories/accessories/BAPI-Guard-1.png',
    },
    {
      name: t('accessories.flexibleProbe.name'),
      slug: 'flexible-probe-bracket',
      features: [
        t('accessories.flexibleProbe.feature1'),
        t('accessories.flexibleProbe.feature2'),
        t('accessories.flexibleProbe.feature3'),
      ],
      image: '/images/accessories/accessories/FPB_Front.png',
    },
    {
      name: t('accessories.weatherShade.name'),
      slug: 'weather-shade',
      features: [
        t('accessories.weatherShade.feature1'),
        t('accessories.weatherShade.feature2'),
        t('accessories.weatherShade.feature3'),
      ],
      image: '/images/accessories/accessories/Weather_Shade-2.png',
    },
    {
      name: t('accessories.vc2000.name'),
      slug: 'vc2000-voltage-converter',
      features: [
        t('accessories.vc2000.feature1'),
        t('accessories.vc2000.feature2'),
        t('accessories.vc2000.feature3'),
      ],
      image: '/images/accessories/accessories/VC2000-Main.png',
    },
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-600 to-primary-500 py-12 text-white md:py-14 lg:py-16 xl:py-10 2xl:py-8">
        <div className="absolute inset-0 bg-[url('/images/patterns/grid.svg')] opacity-10" />

        <div className="relative z-10 mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav
            className="mb-6 flex items-center gap-2 text-sm text-primary-100 md:mb-8"
            aria-label="Breadcrumb"
          >
            <Link href="/" className="transition-colors hover:text-white">
              {t('breadcrumb.home')}
            </Link>
            <ChevronRightIcon className="h-4 w-4" />
            <Link href="/products" className="transition-colors hover:text-white">
              {t('breadcrumb.products')}
            </Link>
            <ChevronRightIcon className="h-4 w-4" />
            <span className="font-medium text-white">{t('breadcrumb.accessories')}</span>
          </nav>

          <div className="grid items-center gap-12 lg:grid-cols-[55%_45%] lg:gap-16 xl:gap-12 2xl:gap-16">
            {/* Left Column - Content */}
            <div>
              <h1 className="mb-5 text-4xl font-bold leading-tight text-white drop-shadow-lg lg:text-5xl xl:mb-4">
                {t('hero.title')}
              </h1>
              <p className="mb-6 text-lg leading-relaxed text-primary-50 drop-shadow-md lg:text-xl xl:mb-5">
                {t('hero.description')}
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                  href="#specialty-sensors"
                  className="bg-bapi-accent-gradient inline-flex items-center justify-center gap-2 rounded-full px-10 py-4 text-lg font-bold transition-all duration-300 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-accent-500/50"
                  style={{ color: '#08304B' }}
                >
                  {t('hero.cta')}
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white/30 bg-white/10 px-10 py-4 text-lg font-bold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20 focus:outline-none focus:ring-4 focus:ring-white/30"
                >
                  {tCommon('contactUs')}
                </Link>
              </div>
            </div>

            {/* Right Column - Hero Image */}
            <div className="relative">
              <div className="overflow-hidden rounded-2xl bg-white p-8 shadow-lg xl:mx-auto xl:max-w-[640px]">
                <Image
                  src="/images/products/families/Accessories_Family_2025_US.webp"
                  alt={t('hero.imageAlt')}
                  width={2400}
                  height={1543}
                  className="h-auto w-full"
                  sizes="(max-width: 1023px) 100vw, (max-width: 1279px) 45vw, 640px"
                  priority
                  quality={85}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Specialty Sensors */}
      <section id="specialty-sensors" className="bg-neutral-50 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-primary-600 lg:text-4xl">
              {t('specialtySensors.title')}
            </h2>
            <p className="mx-auto max-w-4xl text-lg text-neutral-600">
              {t('specialtySensors.subtitle')}
            </p>
          </div>

          {/* 3 Column Grid */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {specialtySensors.map((sensor) => (
              <div
                key={sensor.slug}
                className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-lg transition-all hover:shadow-xl"
              >
                {/* Product Image */}
                <div className="relative h-64 bg-neutral-50 p-16">
                  <Image
                    src={sensor.image}
                    alt={sensor.name}
                    fill
                    className="object-contain"
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  />
                </div>

                {/* Yellow Accent Bar */}
                <div className="h-1 w-full bg-accent-500" aria-hidden="true" />

                {/* Content */}
                <div className="flex flex-1 flex-col px-10 pb-12 pt-10">
                  <h3 className="mb-8 text-xl font-bold text-primary-600">{sensor.name}</h3>
                  <ul className="mb-12 flex-1 space-y-4 text-base text-neutral-700">
                    {sensor.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircleIcon
                          className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary-600"
                          aria-hidden="true"
                        />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/product/${sensor.slug}`}
                    className="inline-flex w-full items-center justify-center rounded-xl bg-primary-600 px-8 py-4 text-center font-semibold text-white transition-colors hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-500/50"
                  >
                    {tCommon('learnMore')}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Accessories Section */}
      <section id="accessories" className="bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-primary-600 lg:text-4xl">
              {t('accessories.title')}
            </h2>
            <p className="mx-auto max-w-4xl text-lg text-neutral-600">
              {t('accessories.subtitle')}
            </p>
          </div>

          {/* 3x2 Grid */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {accessories.map((accessory) => (
              <div
                key={accessory.slug}
                className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-lg transition-all hover:shadow-xl"
              >
                {/* Product Image */}
                <div className="relative h-64 bg-neutral-50 p-16">
                  <Image
                    src={accessory.image}
                    alt={accessory.name}
                    fill
                    className="object-contain"
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  />
                </div>

                {/* Yellow Accent Bar */}
                <div className="h-1 w-full bg-accent-500" aria-hidden="true" />

                {/* Content */}
                <div className="flex flex-1 flex-col px-10 pb-12 pt-10">
                  <h3 className="mb-8 text-xl font-bold text-primary-600">{accessory.name}</h3>
                  <ul className="mb-12 flex-1 space-y-4 text-base text-neutral-700">
                    {accessory.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircleIcon
                          className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary-600"
                          aria-hidden="true"
                        />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/product/${accessory.slug}`}
                    className="inline-flex w-full items-center justify-center rounded-xl bg-primary-600 px-8 py-4 text-center font-semibold text-white transition-colors hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-500/50"
                  >
                    {tCommon('learnMore')}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
