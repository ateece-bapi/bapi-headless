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
  const t = await getTranslations({ locale, namespace: 'temperatureLandingPage' });

  return generatePageMetadata(
    {
      title: t('metadata.title'),
      description: t('metadata.description'),
      path: 'temperature',
      keywords: t('metadata.keywords')
        .split(',')
        .map((k) => k.trim())
        .filter(Boolean),
    },
    locale
  );
}

export default async function TemperaturePage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'temperatureLandingPage' });
  const tCommon = await getTranslations({ locale, namespace: 'common' });

  // Room Temperature Sensors - 6 products
  const roomSensors = [
    {
      name: t('roomSensors.bacnetGuardian.name'),
      slug: 'bacnet-guardian-series',
      features: [
        t('roomSensors.bacnetGuardian.feature1'),
        t('roomSensors.bacnetGuardian.feature2'),
        t('roomSensors.bacnetGuardian.feature3'),
      ],
      image: '/images/temperature/room/Quantum-Temp-Main.png',
    },
    {
      name: t('roomSensors.bacnetSlim.name'),
      slug: 'bacnet-guardian-slim',
      features: [
        t('roomSensors.bacnetSlim.feature1'),
        t('roomSensors.bacnetSlim.feature2'),
        t('roomSensors.bacnetSlim.feature3'),
      ],
      image: '/images/temperature/room/Quantum-Slim-temp.png',
    },
    {
      name: t('roomSensors.bacWall4.name'),
      slug: 'bac-wall-4',
      features: [
        t('roomSensors.bacWall4.feature1'),
        t('roomSensors.bacWall4.feature2'),
        t('roomSensors.bacWall4.feature3'),
      ],
      image: '/images/temperature/room/BAPIStat4MB.png',
    },
    {
      name: t('roomSensors.lowProfile.name'),
      slug: 'low-profile-button-series',
      features: [
        t('roomSensors.lowProfile.feature1'),
        t('roomSensors.lowProfile.feature2'),
        t('roomSensors.lowProfile.feature3'),
      ],
      image: '/images/temperature/room/button_sensors.png',
    },
    {
      name: t('roomSensors.discreteStyle.name'),
      slug: 'discrete-style-room-stat',
      features: [
        t('roomSensors.discreteStyle.feature1'),
        t('roomSensors.discreteStyle.feature2'),
        t('roomSensors.discreteStyle.feature3'),
      ],
      image: '/images/temperature/room/Decora-1.png',
    },
    {
      name: t('roomSensors.wallPlates.name'),
      slug: 'wall-plates',
      features: [
        t('roomSensors.wallPlates.feature1'),
        t('roomSensors.wallPlates.feature2'),
        t('roomSensors.wallPlates.feature3'),
      ],
      image: '/images/temperature/room/WallPlate-O2.png',
    },
  ];

  // Non-Room Temperature Sensors - 6 products
  const nonRoomSensors = [
    {
      name: t('nonRoomSensors.ductSensors.name'),
      slug: 'duct-sensors',
      features: [
        t('nonRoomSensors.ductSensors.feature1'),
        t('nonRoomSensors.ductSensors.feature2'),
        t('nonRoomSensors.ductSensors.feature3'),
      ],
      image: '/images/temperature/nonroom/Duct_Trans_BBX_2020.png',
    },
    {
      name: t('nonRoomSensors.averaging.name'),
      slug: 'averaging-sensors',
      features: [
        t('nonRoomSensors.averaging.feature1'),
        t('nonRoomSensors.averaging.feature2'),
        t('nonRoomSensors.averaging.feature3'),
      ],
      image: '/images/temperature/nonroom/Duct_Avg_BBX.png',
    },
    {
      name: t('nonRoomSensors.immersion.name'),
      slug: 'immersion-sensors',
      features: [
        t('nonRoomSensors.immersion.feature1'),
        t('nonRoomSensors.immersion.feature2'),
        t('nonRoomSensors.immersion.feature3'),
      ],
      image: '/images/temperature/nonroom/Immersion_BBX_2020.png',
    },
    {
      name: t('nonRoomSensors.remoteProbes.name'),
      slug: 'remote-probes',
      features: [
        t('nonRoomSensors.remoteProbes.feature1'),
        t('nonRoomSensors.remoteProbes.feature2'),
        t('nonRoomSensors.remoteProbes.feature3'),
      ],
      image: '/images/temperature/nonroom/Remote_Probe_Trans_BBX.png',
    },
    {
      name: t('nonRoomSensors.tempHumidity.name'),
      slug: 'temperature-humidity-sensor',
      features: [
        t('nonRoomSensors.tempHumidity.feature1'),
        t('nonRoomSensors.tempHumidity.feature2'),
        t('nonRoomSensors.tempHumidity.feature3'),
      ],
      image: '/images/temperature/nonroom/Thermobuffer_1inch_BB2_Blue.png',
    },
    {
      name: t('nonRoomSensors.outsideAir.name'),
      slug: 'outside-air-sensors',
      features: [
        t('nonRoomSensors.outsideAir.feature1'),
        t('nonRoomSensors.outsideAir.feature2'),
        t('nonRoomSensors.outsideAir.feature3'),
      ],
      image: '/images/temperature/nonroom/Outside_Air_Temp_BB_300pix.png',
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
            <span className="font-medium text-white">{t('breadcrumb.temperature')}</span>
          </nav>

          <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-8 xl:gap-6">
            {/* Left Column - Content */}
            <div>
              <h1 className="mb-5 text-4xl font-bold leading-tight text-white drop-shadow-lg lg:text-5xl xl:mb-4">
                {t('hero.title')}
              </h1>
              <p className="mb-6 max-w-2xl text-lg leading-relaxed text-primary-50 drop-shadow-md lg:text-xl xl:mb-5">
                {t('hero.description')}
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                  href="#room-sensors"
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
              <div className="relative h-[450px] lg:h-[500px] xl:h-[480px]">
                <Image
                  src="/images/temperature/hero/Temperature_Family_2025_US_Plain.png"
                  alt={t('hero.title')}
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

      {/* Room Temperature Sensors */}
      <section id="room-sensors" className="bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-primary-600 lg:text-4xl">
              {t('roomSensors.title')}
            </h2>
            <p className="mx-auto max-w-4xl text-lg text-neutral-600">
              {t('roomSensors.subtitle')}
            </p>
          </div>

          {/* 3x2 Grid */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {roomSensors.map((sensor) => (
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
                    {t('roomSensors.cta')}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Non-Room Temperature Sensors */}
      <section id="non-room-sensors" className="bg-neutral-50 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-primary-600 lg:text-4xl">
              {t('nonRoomSensors.title')}
            </h2>
            <p className="mx-auto max-w-4xl text-lg text-neutral-600">
              {t('nonRoomSensors.subtitle')}
            </p>
          </div>

          {/* 3x2 Grid */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {nonRoomSensors.map((sensor) => (
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
                    {t('nonRoomSensors.cta')}
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
