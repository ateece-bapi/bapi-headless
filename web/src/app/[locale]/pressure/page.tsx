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
  const t = await getTranslations({ locale, namespace: 'pressureLandingPage' });

  return generatePageMetadata(
    {
      title: t('metadata.title'),
      description: t('metadata.description'),
      path: 'pressure',
      keywords: t('metadata.keywords')
        .split(/[,،،、，]/)
        .map((k) => k.trim())
        .filter(Boolean),
    },
    locale
  );
}

export default async function PressurePage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'pressureLandingPage' });
  const tCommon = await getTranslations({ locale, namespace: 'common' });

  // Pressure Sensors - 6 products matching legacy page
  const pressureSensors = [
    {
      name: t('sensors.zpmBapiBox.name'),
      slug: 'zpm-standard-accuracy-%c2%b11-pressure-sensor-in-a-bapi-box-ip66-or-nema-4-rated-field-selected-range-and-output',
      features: [
        t('sensors.zpmBapiBox.feature1'),
        t('sensors.zpmBapiBox.feature2'),
        t('sensors.zpmBapiBox.feature3'),
      ],
      image: '/images/pressure/sensors/ZPM_BB(1).png',
    },
    {
      name: t('sensors.zpmDifferential.name'),
      slug: 'zone-pressure-multi-sensor-zpm-differential-pressure-sensor-field-selected-range-and-output',
      features: [
        t('sensors.zpmDifferential.feature1'),
        t('sensors.zpmDifferential.feature2'),
        t('sensors.zpmDifferential.feature3'),
      ],
      image: '/images/pressure/sensors/zpm-pressure-shadow.png',
    },
    {
      name: t('sensors.ezDifferential.name'),
      slug: 'ez-differential-pressure-sensor-field-selected-range-and-output',
      features: [
        t('sensors.ezDifferential.feature1'),
        t('sensors.ezDifferential.feature2'),
        t('sensors.ezDifferential.feature3'),
      ],
      image: '/images/pressure/sensors/EZ-Main-Image-Blue.png',
    },
    {
      name: t('sensors.frpDifferential.name'),
      slug: 'fixed-range-pressure-frp-differential-pressure-sensor',
      features: [
        t('sensors.frpDifferential.feature1'),
        t('sensors.frpDifferential.feature2'),
        t('sensors.frpDifferential.feature3'),
      ],
      image: '/images/pressure/sensors/FRP-Main-2022-1.png',
    },
    {
      name: t('sensors.outsidePickup.name'),
      slug: 'alc-outside-pressure-pickup-port',
      features: [
        t('sensors.outsidePickup.feature1'),
        t('sensors.outsidePickup.feature2'),
        t('sensors.outsidePickup.feature3'),
      ],
      image: '/images/pressure/sensors/Pressure_Pickup_OA_white.png',
    },
    {
      name: t('sensors.roomPickup.name'),
      slug: 'room-pressure-pickup-ports',
      features: [
        t('sensors.roomPickup.feature1'),
        t('sensors.roomPickup.feature2'),
        t('sensors.roomPickup.feature3'),
      ],
      image: '/images/pressure/sensors/Room-Ports-1.png',
    },
  ];

  // Pressure Switches - 2 products matching legacy page
  const pressureSwitches = [
    {
      name: t('switches.ductSwitch.name'),
      slug: 'adjustable-pressure-switch',
      features: [
        t('switches.ductSwitch.feature1'),
        t('switches.ductSwitch.feature2'),
        t('switches.ductSwitch.feature3'),
      ],
      image: '/images/pressure/switches/Beck_Pressure_Switch.png',
    },
    {
      name: t('switches.differentialSwitch.name'),
      slug: 'alc-differential-pressure-switch-2',
      features: [
        t('switches.differentialSwitch.feature1'),
        t('switches.differentialSwitch.feature2'),
        t('switches.differentialSwitch.feature3'),
      ],
      image: '/images/pressure/switches/pressure-switches.png',
    },
  ];

  return (
    <main className="min-h-screen bg-white">
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
            <span className="font-medium text-white">{t('breadcrumb.pressure')}</span>
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
                  href="#pressure-sensors"
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
                  src="/images/pressure/hero/Pressure_Family_2025_US_Plain.png"
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

      {/* Pressure Sensors Section */}
      <section id="pressure-sensors" className="bg-neutral-50 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-primary-600 lg:text-4xl">
              {t('sensors.sectionTitle')}
            </h2>
            <p className="mx-auto max-w-4xl text-lg text-neutral-600">
              {t('sensors.sectionSubtitle')}
            </p>
          </div>

          {/* 3 Column Grid for 6 Sensors */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {pressureSensors.map((sensor) => (
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

      {/* Pressure Switches Section */}
      <section id="pressure-switches" className="bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-primary-600 lg:text-4xl">
              {t('switches.sectionTitle')}
            </h2>
            <p className="mx-auto max-w-4xl text-lg text-neutral-600">
              {t('switches.sectionSubtitle')}
            </p>
          </div>

          {/* 2 Column Grid for 2 Switches */}
          <div className="grid gap-8 md:grid-cols-2">
            {pressureSwitches.map((pressureSwitch) => (
              <div
                key={pressureSwitch.slug}
                className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-lg transition-all hover:shadow-xl"
              >
                {/* Product Image */}
                <div className="relative h-64 bg-neutral-50 p-16">
                  <Image
                    src={pressureSwitch.image}
                    alt={pressureSwitch.name}
                    fill
                    className="object-contain"
                    sizes="(min-width: 768px) 50vw, 100vw"
                  />
                </div>

                {/* Yellow Accent Bar */}
                <div className="h-1 w-full bg-accent-500" aria-hidden="true" />

                {/* Content */}
                <div className="flex flex-1 flex-col px-10 pb-12 pt-10">
                  <h3 className="mb-8 text-xl font-bold text-primary-600">{pressureSwitch.name}</h3>
                  <ul className="mb-12 flex-1 space-y-4 text-base text-neutral-700">
                    {pressureSwitch.features.map((feature, index) => (
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
                    href={`/product/${pressureSwitch.slug}`}
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
              href="/products/pressure-sensors"
              className="inline-flex items-center gap-2 text-lg font-semibold text-primary-600 transition-colors hover:text-primary-700"
            >
              {t('viewAll')}
              <ChevronRightIcon className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
