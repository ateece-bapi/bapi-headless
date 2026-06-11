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
  const t = await getTranslations({ locale, namespace: 'airQualityLandingPage' });

  return generatePageMetadata(
    {
      title: t('metadata.title'),
      description: t('metadata.description'),
      path: 'air-quality',
      keywords: t('metadata.keywords')
        .split(/[,،、،]/)
        .map((k) => k.trim())
        .filter(Boolean),
    },
    locale
  );
}

export default async function AirQualityPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'airQualityLandingPage' });
  const tCommon = await getTranslations({ locale, namespace: 'common' });

  // CO2 Sensors
  const co2Products = [
    {
      name: t('co2.quantum.name'),
      slug: 'co2-24-7-bapi-stat-quantum-carbon-dioxide-sensor-constant-occupancy',
      features: [t('co2.quantum.feature1'), t('co2.quantum.feature2'), t('co2.quantum.feature3')],
      image: '/images/air/co2/Quantum-CO2-Main.webp',
    },
    {
      name: t('co2.quantumPrime.name'),
      slug: 'co2-24-7-bapi-stat-quantum-prime-co2-temp-and-humidity-sensor-constant-occupancy',
      features: [
        t('co2.quantumPrime.feature1'),
        t('co2.quantumPrime.feature2'),
        t('co2.quantumPrime.feature3'),
      ],
      image: '/images/air/co2/Quantum-Prime-CO2-Main.webp',
    },
    {
      name: t('co2.duct.name'),
      slug: 'co2-24-7-duct-and-rough-service-carbon-dioxide-sensor-constant-occupancy',
      features: [t('co2.duct.feature1'), t('co2.duct.feature2'), t('co2.duct.feature3')],
      image: '/images/air/co2/CO2-Duct.webp',
    },
  ];

  // VOC Sensors
  const vocProducts = [
    {
      name: t('voc.quantum.name'),
      slug: 'voc-bapi-stat-quantum-voc-sensor',
      features: [t('voc.quantum.feature1'), t('voc.quantum.feature2'), t('voc.quantum.feature3')],
      image: '/images/air/voc/Quantum-VOC-Main.webp',
    },
    {
      name: t('voc.quantumPrime.name'),
      slug: 'voc-bapi-stat-quantum-prime-voc-temp-and-humidity-sensor',
      features: [
        t('voc.quantumPrime.feature1'),
        t('voc.quantumPrime.feature2'),
        t('voc.quantumPrime.feature3'),
      ],
      image: '/images/air/voc/Quantum-Prime-VOC-Main-25.webp',
    },
    {
      name: t('voc.duct.name'),
      slug: 'voc-duct-or-rough-service-voc-sensor',
      features: [t('voc.duct.feature1'), t('voc.duct.feature2'), t('voc.duct.feature3')],
      image: '/images/air/voc/VOC-Duct.webp',
    },
  ];

  // Particulate Sensors
  const particulateProducts = [
    {
      name: t('particulate.quantum.name'),
      slug: 'particulate-sensor-bapi-stat-quantum-enclosure',
      features: [
        t('particulate.quantum.feature1'),
        t('particulate.quantum.feature2'),
        t('particulate.quantum.feature3'),
      ],
      image: '/images/air/particulate/Particulate_Quantum.webp',
    },
    {
      name: t('particulate.duct.name'),
      slug: 'particulate-sensor-duct',
      features: [
        t('particulate.duct.feature1'),
        t('particulate.duct.feature2'),
        t('particulate.duct.feature3'),
      ],
      image: '/images/air/particulate/Particulate_Duct.webp',
    },
  ];

  // CO & NO2 Sensors
  const coNo2Products = [
    {
      name: t('coNo2.coQuantum.name'),
      slug: 'carbon-monoxide-room',
      features: [
        t('coNo2.coQuantum.feature1'),
        t('coNo2.coQuantum.feature2'),
        t('coNo2.coQuantum.feature3'),
      ],
      image: '/images/air/no2/CO_Quantum.webp',
    },
    {
      name: t('coNo2.coDuct.name'),
      slug: 'co-duct-and-rough-service-carbon-monoxide-sensor',
      features: [
        t('coNo2.coDuct.feature1'),
        t('coNo2.coDuct.feature2'),
        t('coNo2.coDuct.feature3'),
      ],
      image: '/images/air/no2/CO-Duct.webp',
    },
    {
      name: t('coNo2.no2Duct.name'),
      slug: 'no2-duct-and-rough-service-nitrogen-dioxide-sensor',
      features: [
        t('coNo2.no2Duct.feature1'),
        t('coNo2.no2Duct.feature2'),
        t('coNo2.no2Duct.feature3'),
      ],
      image: '/images/air/no2/NO2-programmable.webp',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-600 to-primary-500 pt-8 pb-4 text-white md:pt-10 md:pb-6 lg:pt-12 lg:pb-8 xl:pt-8 xl:pb-4 2xl:pt-6 2xl:pb-3">
        <div className="absolute inset-0 bg-[url('/images/patterns/grid.svg')] opacity-10" />

        <div className="relative z-10 mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav
            className="mb-4 flex items-center gap-2 text-sm text-primary-100 md:mb-6"
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
            <span className="font-medium text-white">{t('breadcrumb.current')}</span>
          </nav>

          <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-8 xl:gap-6">
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
                  href="#co2-sensors"
                  className="bg-bapi-accent-gradient inline-flex items-center justify-center gap-2 rounded-full px-10 py-4 text-lg font-bold text-neutral-900 transition-all duration-300 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-accent-500/50"
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
              <div className="relative h-[450px] lg:h-[500px] xl:h-[480px]">
                <Image
                  src="/images/air/hero/2022AirQuality_PLAIN.webp"
                  alt={t('hero.imageAlt')}
                  fill
                  className="object-contain"
                  sizes="(max-width: 1023px) 100vw, (max-width: 1600px) 50vw, 800px"
                  priority
                  quality={85}
                  style={{ maxWidth: '600px' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CO2 Sensors Section */}
      <section id="co2-sensors" className="bg-neutral-50 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-primary-600 lg:text-4xl">
              {t('co2.sectionTitle')}
            </h2>
            <p className="mx-auto max-w-4xl text-lg text-neutral-600">
              {t('co2.sectionSubtitle')}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {co2Products.map((product) => (
              <div
                key={product.slug}
                className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-lg transition-all hover:shadow-xl"
              >
                {/* Product Image */}
                <div className="relative h-64 bg-neutral-50 p-16">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain"
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  />
                </div>

                {/* Yellow Accent Bar */}
                <div className="h-1 w-full bg-accent-500" aria-hidden="true" />

                {/* Content */}
                <div className="flex flex-1 flex-col px-10 pb-12 pt-10">
                  <h3 className="mb-8 text-xl font-bold text-primary-600">{product.name}</h3>
                  <ul className="mb-12 flex-1 space-y-4 text-base text-neutral-700">
                    {product.features.map((feature, index) => (
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
                    href={`/product/${product.slug}`}
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

      {/* VOC Sensors Section */}
      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-primary-600 lg:text-4xl">
              {t('voc.sectionTitle')}
            </h2>
            <p className="mx-auto max-w-4xl text-lg text-neutral-600">
              {t('voc.sectionSubtitle')}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {vocProducts.map((product) => (
              <div
                key={product.slug}
                className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-lg transition-all hover:shadow-xl"
              >
                {/* Product Image */}
                <div className="relative h-64 bg-neutral-50 p-16">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain"
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  />
                </div>

                {/* Yellow Accent Bar */}
                <div className="h-1 w-full bg-accent-500" aria-hidden="true" />

                {/* Content */}
                <div className="flex flex-1 flex-col px-10 pb-12 pt-10">
                  <h3 className="mb-8 text-xl font-bold text-primary-600">{product.name}</h3>
                  <ul className="mb-12 flex-1 space-y-4 text-base text-neutral-700">
                    {product.features.map((feature, index) => (
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
                    href={`/product/${product.slug}`}
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

      {/* Particulate Sensors Section */}
      <section className="bg-neutral-50 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-primary-600 lg:text-4xl">
              {t('particulate.sectionTitle')}
            </h2>
            <p className="mx-auto max-w-4xl text-lg text-neutral-600">
              {t('particulate.sectionSubtitle')}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {particulateProducts.map((product) => (
              <div
                key={product.slug}
                className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-lg transition-all hover:shadow-xl"
              >
                {/* Product Image */}
                <div className="relative h-64 bg-neutral-50 p-16">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain"
                    sizes="(min-width: 768px) 50vw, 100vw"
                  />
                </div>

                {/* Yellow Accent Bar */}
                <div className="h-1 w-full bg-accent-500" aria-hidden="true" />

                {/* Content */}
                <div className="flex flex-1 flex-col px-10 pb-12 pt-10">
                  <h3 className="mb-8 text-xl font-bold text-primary-600">{product.name}</h3>
                  <ul className="mb-12 flex-1 space-y-4 text-base text-neutral-700">
                    {product.features.map((feature, index) => (
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
                    href={`/product/${product.slug}`}
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

      {/* CO & NO2 Sensors Section */}
      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-primary-600 lg:text-4xl">
              {t('coNo2.sectionTitle')}
            </h2>
            <p className="mx-auto max-w-4xl text-lg text-neutral-600">
              {t('coNo2.sectionSubtitle')}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {coNo2Products.map((product) => (
              <div
                key={product.slug}
                className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-lg transition-all hover:shadow-xl"
              >
                {/* Product Image */}
                <div className="relative h-64 bg-neutral-50 p-16">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain"
                    sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                  />
                </div>

                {/* Yellow Accent Bar */}
                <div className="h-1 w-full bg-accent-500" aria-hidden="true" />

                {/* Content */}
                <div className="flex flex-1 flex-col px-10 pb-12 pt-10">
                  <h3 className="mb-8 text-xl font-bold text-primary-600">{product.name}</h3>
                  <ul className="mb-12 flex-1 space-y-4 text-base text-neutral-700">
                    {product.features.map((feature, index) => (
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
                    href={`/product/${product.slug}`}
                    className="inline-flex w-full items-center justify-center rounded-xl bg-primary-600 px-8 py-4 text-center font-semibold text-white transition-colors hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-500/50"
                  >
                    {tCommon('learnMore')}
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* View All Link */}
          <div className="mt-12 text-center">
            <Link
              href="/products/air-quality-sensors"
              className="inline-flex items-center gap-2 text-lg font-semibold text-primary-600 hover:text-primary-700"
            >
              {t('viewAll')}
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
