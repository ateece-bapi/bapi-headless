import Image from 'next/image';
import { Link } from '@/lib/navigation';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { generatePageMetadata } from '@/lib/metadata';
import {
  ZapIcon,
  WifiIcon,
  BatteryIcon,
  TrendingUpIcon,
  ChevronRightIcon,
  CheckCircleIcon,
} from '@/lib/icons';
import { FeatureGrid } from '@/components/landing/FeatureGrid';
import { ProcessSteps } from '@/components/landing/ProcessSteps';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'wirelessLandingPage' });

  return generatePageMetadata(
    {
      title: t('metadata.title'),
      description: t('metadata.description'),
      path: 'wireless',
      keywords: t('metadata.keywords')
        .split(',')
        .map((k) => k.trim())
        .filter(Boolean),
    },
    locale
  );
}

export default async function WirelessPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'wirelessLandingPage' });
  const tCommon = await getTranslations({ locale, namespace: 'common' });

  // Feature grid data - all 6 features from translations
  const features = [
    {
      icon: <ZapIcon className="h-12 w-12" />,
      title: t('features.noWiring.title'),
      description: t('features.noWiring.description'),
    },
    {
      icon: <WifiIcon className="h-12 w-12" />,
      title: t('features.longRange.title'),
      description: t('features.longRange.description'),
    },
    {
      icon: <BatteryIcon className="h-12 w-12" />,
      title: t('features.reliable.title'),
      description: t('features.reliable.description'),
    },
    {
      icon: <TrendingUpIcon className="h-12 w-12" />,
      title: t('features.scalable.title'),
      description: t('features.scalable.description'),
    },
  ];

  // Process steps data
  const processSteps = [
    {
      number: 1,
      title: t('specifications.wireless.title'),
      description: t('specifications.wireless.description'),
    },
    {
      number: 2,
      title: t('specifications.receiver.title'),
      description: t('specifications.receiver.description'),
    },
    {
      number: 3,
      title: t('specifications.outputs.title'),
      description: t('specifications.outputs.description'),
    },
  ];

  // Wireless sensors - 6 product cards with translations
  const wirelessSensors = [
    {
      name: t('products.outsideAir.name'),
      slug: 'wireless-outside-air-sensor',
      features: [
        t('products.outsideAir.feature1'),
        t('products.outsideAir.feature2'),
        t('products.outsideAir.feature3'),
      ],
      image: '/images/wireless/Image (Outside Air Sensor).webp',
    },
    {
      name: t('products.quantum.name'),
      slug: 'bapi-stat-quantum-wireless',
      features: [
        t('products.quantum.feature1'),
        t('products.quantum.feature2'),
        t('products.quantum.feature3'),
      ],
      image: '/images/wireless/Image (BAPI-Stat Quantum).webp',
    },
    {
      name: t('products.duct.name'),
      slug: 'wireless-duct-sensor',
      features: [
        t('products.duct.feature1'),
        t('products.duct.feature2'),
        t('products.duct.feature3'),
      ],
      image: '/images/wireless/Image (Duct Sensor).webp',
    },
    {
      name: t('products.quantumSlim.name'),
      slug: 'bapi-stat-quantum-slim',
      features: [
        t('products.quantumSlim.feature1'),
        t('products.quantumSlim.feature2'),
        t('products.quantumSlim.feature3'),
      ],
      image: '/images/wireless/Image (BAPI-Stat Quantum Slim).webp',
    },
    {
      name: t('products.immersion.name'),
      slug: 'wireless-immersion-temperature',
      features: [
        t('products.immersion.feature1'),
        t('products.immersion.feature2'),
        t('products.immersion.feature3'),
      ],
      image: '/images/wireless/Image (Immersion Temperature).webp',
    },
    {
      name: t('products.thermobuffer.name'),
      slug: 'wireless-thermobuffer',
      features: [
        t('products.thermobuffer.feature1'),
        t('products.thermobuffer.feature2'),
        t('products.thermobuffer.feature3'),
      ],
      image: '/images/wireless/Image (Thermobuffer Sensor).webp',
    },
  ];

  // Analog output modules
  const analogModules = [
    {
      id: 'resistance-output',
      name: t('analogModules.resistance.name'),
      slug: 'wireless-output-modules-bluetooth-wireless',
      description: t('analogModules.resistance.description'),
      image: '/images/wireless/modules/resistance.webp',
    },
    {
      id: 'voltage-output',
      name: t('analogModules.voltage.name'),
      slug: 'wireless-output-modules-bluetooth-wireless',
      description: t('analogModules.voltage.description'),
      image: '/images/wireless/modules/voltage.webp',
    },
    {
      id: 'setpoint-output',
      name: t('analogModules.setpoint.name'),
      slug: 'wireless-output-modules-bluetooth-wireless',
      description: t('analogModules.setpoint.description'),
      image: '/images/wireless/modules/setpoint.webp',
    },
  ];

  // Digital output modules
  const digitalModules = [
    {
      id: 'bacnet-ip',
      name: t('digitalModules.bacnetIP.name'),
      slug: 'wireless-output-modules-bluetooth-wireless',
      description: t('digitalModules.bacnetIP.description'),
      image: '/images/wireless/modules/bacnet-ip.webp',
    },
    {
      id: 'bacnet-modbus',
      name: t('digitalModules.bacnetModbus.name'),
      slug: 'wireless-output-modules-bluetooth-wireless',
      description: t('digitalModules.bacnetModbus.description'),
      image: '/images/wireless/modules/bacnet-modbus.webp',
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
            <span className="font-medium text-white">{t('breadcrumb.wireless')}</span>
          </nav>

          <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-8 xl:gap-6">
            {/* Left Column - Content */}
            <div>
              <div className="mb-6 inline-block rounded-full bg-primary-400/30 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm">
                {t('hero.badge')}
              </div>
              <h1 className="mb-5 text-4xl font-bold leading-tight text-white drop-shadow-lg lg:text-5xl xl:mb-4">
                {t('hero.title')}
              </h1>
              <p className="mb-6 text-lg leading-relaxed text-primary-50 drop-shadow-md lg:text-xl xl:mb-5">
                {t('hero.description')}
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                  href="#wireless-sensors"
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
                  src="/images/wireless/hero/BAPI_BLE_Wireless_HVAC_2025.webp"
                  alt="BAPI Wireless HVAC Sensors"
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

      {/* Why Choose Wireless */}
      <section className="bg-neutral-50 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-primary-600 lg:text-4xl">
              {t('features.title')}
            </h2>
            <p className="mx-auto max-w-3xl text-lg text-neutral-600">
              {t('features.subtitle')}
            </p>
          </div>
          <FeatureGrid features={features} columns={4} />
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-primary-600 lg:text-4xl">
              {t('specifications.title')}
            </h2>
            <p className="mx-auto max-w-3xl text-lg text-neutral-600">
              {t('specifications.subtitle')}
            </p>
          </div>

          {/* Integration Diagram */}
          <div className="mb-16">
            <div className="relative mx-auto max-w-5xl overflow-hidden rounded-2xl border-2 border-primary-200 bg-white shadow-xl">
              <Image
                src="/images/wireless/Image (Wireless Integration Diagram).webp"
                alt="BAPI Wireless Solution Integration"
                width={1248}
                height={896}
                className="h-auto w-full"
                sizes="(min-width: 1024px) 1024px, 100vw"
              />
            </div>
          </div>

          <ProcessSteps steps={processSteps} columns={3} showConnector={false} />
        </div>
      </section>

      {/* Wireless Sensors */}
      <section id="wireless-sensors" className="bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-primary-600 lg:text-4xl">
              {t('categories.title')}
            </h2>
            <p className="mx-auto max-w-4xl text-lg text-neutral-600">
              {t('categories.subtitle')}
            </p>
          </div>

          {/* 3x2 Grid */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {wirelessSensors.map((sensor) => (
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
                    {tCommon('viewProduct', { product: sensor.name })}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Wireless Receiver */}
      <section className="bg-primary-50 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          {/* Centered Title */}
          <h2 className="mb-12 text-center text-3xl font-bold text-primary-700 lg:text-4xl">
            {t('specifications.receiver.title')}
          </h2>

          {/* Two Column Layout */}
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Image - Left Side */}
            <div className="relative">
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-white p-8 shadow-lg">
                <Image
                  src="/images/wireless/Image (Wireless Receiver).webp"
                  alt="BAPI Wireless Receiver"
                  fill
                  className="object-contain"
                  sizes="(min-width: 1024px) 50vw, 100vw"
                />
              </div>
            </div>

            {/* Content - Right Side */}
            <div>
              <p className="mb-6 text-lg leading-relaxed text-neutral-700">
                {t('specifications.receiver.description')}
              </p>

              {/* Features List */}
              <div className="mb-6">
                <h3 className="mb-4 font-bold text-neutral-900">{t('specifications.receiver.settingsTitle')}</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircleIcon
                      className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary-600"
                      aria-hidden="true"
                    />
                    <span className="text-neutral-700">{t('specifications.receiver.sampleRate')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircleIcon
                      className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary-600"
                      aria-hidden="true"
                    />
                    <span className="text-neutral-700">{t('specifications.receiver.transmitRate')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircleIcon
                      className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary-600"
                      aria-hidden="true"
                    />
                    <span className="text-neutral-700">{t('specifications.receiver.deltaTemperature')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircleIcon
                      className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary-600"
                      aria-hidden="true"
                    />
                    <span className="text-neutral-700">{t('specifications.receiver.deltaHumidity')}</span>
                  </li>
                </ul>
              </div>

              {/* Callout Box */}
              <div className="rounded-lg border border-neutral-300 bg-white p-4 shadow-sm">
                <p className="text-center font-medium text-neutral-900">
                  {t('specifications.receiver.callout')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Analog Output Modules */}
      <section className="bg-gradient-to-b from-white to-neutral-50 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          {/* Header Section - Two Column Layout */}
          <div className="mb-20 grid gap-12 lg:grid-cols-2 lg:gap-20">
            {/* Left Column - Text */}
            <div className="flex flex-col justify-center">
              <h2 className="mb-8 text-4xl font-bold text-primary-600 lg:text-5xl">
                {t('analogModules.title')}
              </h2>
              <div className="space-y-6 text-base leading-relaxed text-neutral-700 lg:text-lg">
                <p>{t('analogModules.paragraph1')}</p>
                <p>{t('analogModules.paragraph2')}</p>
              </div>
            </div>

            {/* Right Column - Image */}
            <div className="flex items-center justify-center lg:justify-end">
              <div className="relative w-full">
                <div className="absolute -inset-4 rounded-2xl bg-gradient-to-br from-primary-100 to-accent-100 opacity-20 blur-2xl"></div>
                <div className="relative overflow-hidden rounded-xl bg-white p-6 shadow-xl">
                  <Image
                    src="/images/wireless/1-wireless-receiver-dom-modules.webp"
                    alt="Wireless Receiver and Analog Output Modules"
                    width={700}
                    height={350}
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="h-auto w-full"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Product Cards - 3 Column Grid */}
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {analogModules.map((module) => (
              <div
                key={module.id}
                className="group overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:shadow-2xl"
              >
                {/* Product Image */}
                <div className="relative h-64 bg-neutral-50 p-16">
                  <Image
                    src={module.image}
                    alt={module.name}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-contain"
                  />
                </div>

                {/* Yellow Accent Bar */}
                <div className="h-1 w-full bg-accent-500" aria-hidden="true" />

                {/* Content */}
                <div className="flex flex-col px-8 pb-10 pt-8">
                  <h3 className="mb-4 text-xl font-bold text-primary-600 lg:text-2xl">
                    {module.name}
                  </h3>
                  <p className="mb-8 leading-relaxed text-neutral-700">{module.description}</p>
                  <Link
                    href={`/products/wireless-sensors/${module.slug}`}
                    className="block w-full rounded-lg bg-primary-600 px-6 py-3.5 text-center font-semibold text-white shadow-md transition-all duration-300 hover:bg-primary-700 hover:shadow-lg"
                  >
                    {tCommon('viewProduct', { product: module.name })}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Digital Output Modules */}
      <section className="bg-gradient-to-b from-white to-neutral-50 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          {/* Header Section - Two Column Layout */}
          <div className="mb-20 grid gap-12 lg:grid-cols-2 lg:gap-20">
            {/* Left Column - Text */}
            <div className="flex flex-col justify-center">
              <h2 className="mb-8 text-4xl font-bold text-primary-600 lg:text-5xl">
                {t('digitalModules.title')}
              </h2>
              <div className="space-y-6 text-base leading-relaxed text-neutral-700 lg:text-lg">
                <p>{t('digitalModules.paragraph1')}</p>
              </div>
            </div>

            {/* Right Column - Image */}
            <div className="flex items-center justify-center lg:justify-end">
              <div className="relative w-full">
                <div className="absolute -inset-4 rounded-2xl bg-gradient-to-br from-primary-100 to-accent-100 opacity-20 blur-2xl"></div>
                <div className="relative overflow-hidden rounded-xl bg-white p-6 shadow-xl">
                  <Image
                    src="/images/wireless/wireless-receiver-with-output-modules.webp"
                    alt="Wireless Receiver with Digital Output Modules"
                    width={700}
                    height={350}
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="h-auto w-full"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Product Cards - 2 Column Grid */}
          <div className="grid gap-10 md:grid-cols-2">
            {digitalModules.map((module) => (
              <div
                key={module.id}
                className="group overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:shadow-2xl"
              >
                {/* Product Image */}
                <div className="relative h-64 bg-neutral-50 p-16">
                  <Image
                    src={module.image}
                    alt={module.name}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-contain"
                  />
                </div>

                {/* Yellow Accent Bar */}
                <div className="h-1 w-full bg-accent-500" aria-hidden="true" />

                {/* Content */}
                <div className="flex flex-col px-8 pb-10 pt-8">
                  <h3 className="mb-4 text-xl font-bold text-primary-600 lg:text-2xl">
                    {module.name}
                  </h3>
                  <p className="mb-8 leading-relaxed text-neutral-700">{module.description}</p>
                  <Link
                    href={`/products/wireless-sensors/${module.slug}`}
                    className="block w-full rounded-lg bg-primary-600 px-6 py-3.5 text-center font-semibold text-white shadow-md transition-all duration-300 hover:bg-primary-700 hover:shadow-lg"
                  >
                    {tCommon('viewProduct', { product: module.name })}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Support Resources */}
      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left Column - Content */}
            <div>
              <h2 className="mb-6 text-3xl font-bold text-primary-600 lg:text-4xl">
                {t('support.title')}
              </h2>
              <p className="mb-8 text-lg leading-relaxed text-neutral-700">
                {t('support.siteVerification.description')}
              </p>
              <Link
                href="/support/resources"
                className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-8 py-4 font-semibold text-white transition-colors hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-500/50"
              >
                {t('support.siteVerification.title')}
              </Link>
            </div>

            {/* Right Column - Image */}
            <div className="relative">
              <Image
                src="/images/wireless/Image (BAPI Wireless App).webp"
                alt="BAPI Wireless App"
                width={800}
                height={600}
                className="h-auto w-full rounded-lg"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary-700 via-primary-600 to-primary-700 py-16 text-white">
        <div className="mx-auto max-w-4xl px-6 text-center sm:px-8">
          <h2 className="mb-4 text-3xl font-bold lg:text-4xl">{t('cta.title')}</h2>
          <p className="mb-8 text-lg text-primary-50">{t('cta.description')}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/products/bluetooth-wireless"
              className="inline-flex items-center gap-2 rounded-lg bg-accent-500 px-8 py-4 font-bold text-neutral-900 transition-all hover:bg-accent-600 hover:shadow-2xl"
            >
              {t('cta.primaryButton')}
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-lg border-2 border-white bg-white/10 px-8 py-4 font-bold text-white backdrop-blur-sm transition-all hover:bg-white/20"
            >
              {t('cta.secondaryButton')}
            </Link>
          </div>
          <p className="mt-6 text-sm text-primary-100">
            {t('cta.phoneLabel')}: <a href="tel:+16087354800" className="font-bold text-white hover:text-accent-500">{t('cta.phone')}</a>
          </p>
        </div>
      </section>
    </main>
  );
}
