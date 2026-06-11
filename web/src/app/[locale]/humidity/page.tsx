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
  const t = await getTranslations({ locale, namespace: 'humidityLandingPage' });

  return generatePageMetadata(
    {
      title: t('metadata.title'),
      description: t('metadata.description'),
      path: 'humidity',
      keywords: t('metadata.keywords')
        .split(/[,，、،]/)
        .map((k) => k.trim())
        .filter(Boolean),
    },
    locale
  );
}

export default async function HumidityPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'humidityLandingPage' });
  const tCommon = await getTranslations({ locale, namespace: 'common' });

  // Humidity Sensors - 6 products matching legacy page
  const humiditySensors = [
    {
      name: t('sensors.bapiStatQuantum.name'),
      slug: 'bapi-stat-quantum-temperature-and-humidity-sensor-with-display',
      features: [
        t('sensors.bapiStatQuantum.feature1'),
        t('sensors.bapiStatQuantum.feature2'),
        t('sensors.bapiStatQuantum.feature3'),
      ],
      image: '/images/humidity/Quantum-Humid-SO-Main.png',
    },
    {
      name: t('sensors.quantumPrime.name'),
      slug: 'bapi-stat-quantum-prime-wipedown-room-temperature-and-humidity-sensor',
      features: [
        t('sensors.quantumPrime.feature1'),
        t('sensors.quantumPrime.feature2'),
        t('sensors.quantumPrime.feature3'),
      ],
      image: '/images/humidity/quantum-prime-humidity-banner.png',
    },
    {
      name: t('sensors.outsideAir.name'),
      slug: 'outside-air-humidity-sensor-with-temperature-transmitter-40-to-140f-range',
      features: [
        t('sensors.outsideAir.feature1'),
        t('sensors.outsideAir.feature2'),
        t('sensors.outsideAir.feature3'),
      ],
      image: '/images/humidity/Main-Image-300pix9.png',
    },
    {
      name: t('sensors.ductCrossover.name'),
      slug: 'duct-humidity-rh-sensor-with-temperature-transmitter',
      features: [
        t('sensors.ductCrossover.feature1'),
        t('sensors.ductCrossover.feature2'),
        t('sensors.ductCrossover.feature3'),
      ],
      image: '/images/humidity/Duct-Humidity-BBX-2020.png',
    },
    {
      name: t('sensors.bapiStat4.name'),
      slug: 'modbus-bapi-stat-4mb-temperature-and-humidity-sensor',
      features: [
        t('sensors.bapiStat4.feature1'),
        t('sensors.bapiStat4.feature2'),
        t('sensors.bapiStat4.feature3'),
      ],
      image: '/images/humidity/BS4-Humidity-BW.png',
    },
    {
      name: t('sensors.deltaStyle.name'),
      slug: 'alc-delta-style-room-humidity-or-temperature-humidity-sensor',
      features: [
        t('sensors.deltaStyle.feature1'),
        t('sensors.deltaStyle.feature2'),
        t('sensors.deltaStyle.feature3'),
      ],
      image: '/images/humidity/Delta_Humidity_Display.png',
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
            <span className="font-medium text-white">{t('breadcrumb.humidity')}</span>
          </nav>

          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-10 xl:gap-8 2xl:gap-10">
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
                  href="#humidity-sensors"
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
              <div className="relative aspect-[418/287]">
                <Image
                  src="/images/humidity/humidity_sensors.png"
                  alt={t('hero.imageAlt')}
                  fill
                  className="object-contain"
                  sizes="(max-width: 1023px) 100vw, (max-width: 1600px) 50vw, 800px"
                  priority
                  quality={85}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Humidity Sensors Section */}
      <section id="humidity-sensors" className="bg-neutral-50 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-primary-600 lg:text-4xl">
              {t('sensors.sectionTitle')}
            </h2>
            <p className="mx-auto max-w-4xl text-lg text-neutral-600">
              {t('sensors.sectionSubtitle')}
            </p>
          </div>

          {/* 2 Column Grid for 6 Products */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {humiditySensors.map((sensor) => (
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

          {/* View All Link */}
          <div className="mt-12 text-center">
            <Link
              href="/products/humidity-sensors"
              className="inline-flex items-center gap-2 text-lg font-semibold text-primary-600 transition-colors hover:text-primary-700"
            >
              {t('sensors.viewAll')}
              <ChevronRightIcon className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
