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
      keywords: t('metadata.keywords').split(', '),
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
      description: t('specifications.wireless.range'),
    },
    {
      number: 2,
      title: t('categories.receiversModules.title'),
      description: t('categories.receiversModules.description'),
    },
    {
      number: 3,
      title: t('specifications.outputs.title'),
      description: t('specifications.outputs.analog'),
    },
  ];

  // Wireless product categories with translated content
  const productCategories = [
    {
      title: t('categories.roomSensors.title'),
      description: t('categories.roomSensors.description'),
      href: '/products/room-temperature-sensors',
      image: '/images/wireless/Image (BAPI-Stat Quantum).png',
    },
    {
      title: t('categories.nonRoomSensors.title'),
      description: t('categories.nonRoomSensors.description'),
      href: '/products/non-room-temperature-sensors',
      image: '/images/wireless/Image (Outside Air Sensor).png',
    },
    {
      title: t('categories.receiversModules.title'),
      description: t('categories.receiversModules.description'),
      href: '/products/bluetooth-wireless',
      image: '/images/wireless/Image (Wireless Receiver).png',
    },
    {
      title: t('categories.accessories.title'),
      description: t('categories.accessories.description'),
      href: '/products/accessories',
      image: '/images/wireless/Image (Duct Sensor).png',
    },
  ];

  // Analog output modules
  const analogModules = [
    {
      id: 'resistance-output',
      name: t('specifications.outputs.title'),
      slug: 'wireless-output-modules-bluetooth-wireless',
      description: t('specifications.outputs.analog'),
      image: '/images/wireless/modules/resistance.png',
    },
    {
      id: 'voltage-output',
      name: t('specifications.outputs.title'),
      slug: 'wireless-output-modules-bluetooth-wireless',
      description: t('specifications.outputs.analog'),
      image: '/images/wireless/modules/voltage.png',
    },
    {
      id: 'setpoint-output',
      name: t('specifications.outputs.title'),
      slug: 'wireless-output-modules-bluetooth-wireless',
      description: t('specifications.outputs.digital'),
      image: '/images/wireless/modules/setpoint.png',
    },
  ];

  // Digital output modules
  const digitalModules = [
    {
      id: 'bacnet-ip',
      name: t('specifications.outputs.bacnet'),
      slug: 'wireless-output-modules-bluetooth-wireless',
      description: t('specifications.outputs.digital'),
      image: '/images/wireless/modules/bacnet-ip.png',
    },
    {
      id: 'bacnet-modbus',
      name: t('specifications.outputs.modbus'),
      slug: 'wireless-output-modules-bluetooth-wireless',
      description: t('specifications.outputs.digital'),
      image: '/images/wireless/modules/bacnet-modbus.png',
    },
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-600 to-primary-500 py-16 text-white lg:py-20">
        <div className="absolute inset-0 bg-[url('/images/patterns/grid.svg')] opacity-10" />

        <div className="relative z-10 mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav
            className="mb-8 flex items-center gap-2 text-sm text-primary-100"
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

          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left Column - Content */}
            <div>
              <div className="mb-4 inline-block rounded-full bg-primary-400/30 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm">
                {t('hero.badge')}
              </div>
              <h1 className="mb-6 text-4xl font-bold leading-tight lg:text-5xl">
                {t('hero.title')}
              </h1>
              <p className="mb-2 text-lg font-semibold text-primary-100 lg:text-xl">
                {t('hero.subtitle')}
              </p>
              <p className="mb-8 text-lg leading-relaxed text-primary-50">
                {t('hero.description')}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="#wireless-sensors"
                  className="inline-flex items-center gap-2 rounded-lg bg-accent-500 px-8 py-4 font-bold text-neutral-900 transition-all hover:bg-accent-600 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-accent-500/50"
                >
                  {t('hero.cta')}
                </Link>
                <Link
                  href="/company/contact-us"
                  className="inline-flex items-center gap-2 rounded-lg border-2 border-white bg-white/10 px-8 py-4 font-bold text-white backdrop-blur-sm transition-all hover:bg-white/20 focus:outline-none focus:ring-4 focus:ring-white/50"
                >
                  {t('hero.secondaryCta')}
                </Link>
              </div>
            </div>

            {/* Right Column - Hero Images */}
            <div className="relative">
              <div className="relative overflow-hidden rounded-3xl bg-primary-600/40 p-8 shadow-2xl backdrop-blur-sm">
                <div className="flex items-center justify-center gap-6">
                  {/* Wireless Receiver with Signal Lines */}
                  <div className="relative flex-shrink-0">
                    {/* Wireless Signal Lines (Yellow) - Right side */}
                    <div className="absolute -right-6 top-1/2 z-10 -translate-y-1/2">
                      <div className="flex flex-col gap-1.5">
                        <div className="h-0.5 w-8 rounded-full bg-accent-500"></div>
                        <div className="h-0.5 w-10 rounded-full bg-accent-500"></div>
                        <div className="h-0.5 w-8 rounded-full bg-accent-500"></div>
                      </div>
                    </div>
                    
                    <div className="relative h-64 w-64">
                      <Image
                        src="/images/wireless/Image (Wireless Receiver)@3x.png"
                        alt="BAPI Wireless Receiver"
                        fill
                        className="object-contain"
                        sizes="256px"
                        priority
                      />
                    </div>
                    
                    {/* Receiver Label */}
                    <div className="mt-3 text-center">
                      <div className="inline-block rounded-full bg-white/90 px-4 py-1.5 text-sm font-semibold text-primary-700 shadow-md backdrop-blur-sm">
                        {t('categories.receiversModules.title')}
                      </div>
                    </div>
                  </div>

                  {/* Sensor Units Row */}
                  <div className="flex items-end gap-4">
                    {/* White Sensor */}
                    <div className="flex flex-col items-center">
                      <div className="relative h-52 w-36">
                        <Image
                          src="/images/wireless/Quantum_Wireless_Main-1 1.png"
                          alt="BAPI Quantum Wireless Sensor"
                          fill
                          className="object-contain"
                          sizes="144px"
                        />
                      </div>
                      <div className="mt-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-primary-700 shadow-md backdrop-blur-sm">
                        {t('categories.roomSensors.title')}
                      </div>
                    </div>

                    {/* Black Sensor */}
                    <div className="flex flex-col items-center">
                      <div className="relative h-52 w-36">
                        <Image
                          src="/images/wireless/Quantum_Wireless_Main-1 1.png"
                          alt="BAPI Quantum Wireless Sensor"
                          fill
                          className="object-contain brightness-[0.4] saturate-0"
                          sizes="144px"
                        />
                      </div>
                      <div className="mt-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-primary-700 shadow-md backdrop-blur-sm">
                        {t('categories.roomSensors.title')}
                      </div>
                    </div>

                    {/* Slim Sensor */}
                    <div className="flex flex-col items-center">
                      <div className="relative h-52 w-36">
                        <Image
                          src="/images/wireless/Quantum-Slim-temp 1.png"
                          alt="BAPI Quantum Slim Sensor"
                          fill
                          className="object-contain"
                          sizes="144px"
                        />
                      </div>
                      <div className="mt-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-primary-700 shadow-md backdrop-blur-sm">
                        {t('categories.roomSensors.title')}
                      </div>
                    </div>
                  </div>
                </div>
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
              {t('benefits.title')}
            </h2>
            <p className="mx-auto max-w-3xl text-lg text-neutral-600">
              {t('benefits.subtitle')}
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
              {t('features.easyIntegration.description')}
            </p>
          </div>

          {/* Integration Diagram */}
          <div className="mb-16">
            <div className="relative mx-auto max-w-5xl overflow-hidden rounded-2xl border-2 border-primary-200 bg-white shadow-xl">
              <Image
                src="/images/wireless/Image (Wireless Integration Diagram).png"
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
              {t('wam.subtitle')}
            </p>
          </div>

          {/* 2x2 Grid */}
          <div className="grid gap-8 md:grid-cols-2">
            {productCategories.map((category, index) => (
              <div
                key={index}
                className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-lg transition-all hover:shadow-xl"
              >
                {/* Product Image */}
                <div className="relative h-64 bg-neutral-50 p-16">
                  <Image
                    src={category.image}
                    alt={category.title}
                    fill
                    className="object-contain"
                    sizes="(min-width: 768px) 50vw, 100vw"
                  />
                </div>

                {/* Yellow Accent Bar */}
                <div className="h-1 w-full bg-accent-500" aria-hidden="true" />

                {/* Content */}
                <div className="flex flex-1 flex-col px-10 pb-12 pt-10">
                  <h3 className="mb-4 text-xl font-bold text-primary-600">{category.title}</h3>
                  <p className="mb-8 flex-1 text-base text-neutral-700">{category.description}</p>
                  <Link
                    href={category.href}
                    className="inline-flex w-full items-center justify-center rounded-xl bg-primary-600 px-8 py-4 text-center font-semibold text-white transition-colors hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-500/50"
                    aria-label={`${tCommon('learnMore')} ${category.title}`}
                  >
                    {t('categories.roomSensors.cta')}
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
            {t('categories.receiversModules.title')}
          </h2>

          {/* Two Column Layout */}
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Image - Left Side */}
            <div className="relative">
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-white p-8 shadow-lg">
                <Image
                  src="/images/wireless/Image (Wireless Receiver).png"
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
                {t('categories.receiversModules.description')}
              </p>

              {/* Features List */}
              <div className="mb-6">
                <h3 className="mb-4 font-bold text-neutral-900">{t('features.title')}:</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircleIcon
                      className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary-600"
                      aria-hidden="true"
                    />
                    <span className="text-neutral-700">{t('features.cloudConnected.description')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircleIcon
                      className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary-600"
                      aria-hidden="true"
                    />
                    <span className="text-neutral-700">{t('features.easyIntegration.description')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircleIcon
                      className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary-600"
                      aria-hidden="true"
                    />
                    <span className="text-neutral-700">{t('features.scalable.description')}</span>
                  </li>
                </ul>
              </div>

              {/* Callout Box */}
              <div className="rounded-lg border border-neutral-300 bg-white p-4 shadow-sm">
                <p className="text-center font-medium text-neutral-900">
                  {t('features.scalable.description')}
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
                {t('specifications.outputs.title')}
              </h2>
              <div className="space-y-6 text-base leading-relaxed text-neutral-700 lg:text-lg">
                <p>{t('specifications.outputs.analog')}</p>
                <p>{t('specifications.outputs.digital')}</p>
              </div>
            </div>

            {/* Right Column - Image */}
            <div className="flex items-center justify-center lg:justify-end">
              <div className="relative w-full">
                <div className="absolute -inset-4 rounded-2xl bg-gradient-to-br from-primary-100 to-accent-100 opacity-20 blur-2xl"></div>
                <div className="relative overflow-hidden rounded-xl bg-white p-6 shadow-xl">
                  <Image
                    src="/images/wireless/1-wireless-receiver-dom-modules.png"
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
                    {tCommon('learnMore')}
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
                {t('specifications.outputs.title')}
              </h2>
              <div className="space-y-6 text-base leading-relaxed text-neutral-700 lg:text-lg">
                <p>{t('specifications.outputs.digital')}</p>
              </div>
            </div>

            {/* Right Column - Image */}
            <div className="flex items-center justify-center lg:justify-end">
              <div className="relative w-full">
                <div className="absolute -inset-4 rounded-2xl bg-gradient-to-br from-primary-100 to-accent-100 opacity-20 blur-2xl"></div>
                <div className="relative overflow-hidden rounded-xl bg-white p-6 shadow-xl">
                  <Image
                    src="/images/wireless/wireless-receiver-with-output-modules.png"
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
                    {tCommon('learnMore')}
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
                src="/images/wireless/Image (BAPI Wireless App).png"
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
              href="/company/contact-us"
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
