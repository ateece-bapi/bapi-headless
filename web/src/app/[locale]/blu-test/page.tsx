import Image from 'next/image';
import { Link } from '@/lib/navigation';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { generatePageMetadata } from '@/lib/metadata';
import {
  BarChart3Icon,
  ChevronRightIcon,
  DownloadIcon,
  GaugeIcon,
  HumidityPercentageIcon,
  SettingsIcon,
  SmartphoneIcon,
  ThermometerIcon,
  VerifiedIcon,
  WindIcon,
} from '@/lib/icons';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'bluTestLandingPage' });

  return generatePageMetadata(
    {
      title: t('metadata.title'),
      description: t('metadata.description'),
      path: 'blu-test',
      keywords: t('metadata.keywords')
        .split(',')
        .map((k) => k.trim())
        .filter(Boolean),
    },
    locale
  );
}

export default async function BluTestPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'bluTestLandingPage' });
  const tCommon = await getTranslations({ locale, namespace: 'common' });


  // Test & Measurement Products - The Blü-Test Suite
  const testProbes = [
    {
      name: t('testProbes.tempProbe95.name'),
      slug: 'temperature-probe-95',
      description: t('testProbes.tempProbe95.description'),
      image: '/images/blu-test/probes/9.5_temp_probe.png',
    },
    {
      name: t('testProbes.tempProbe6.name'),
      slug: 'temperature-probe-6',
      description: t('testProbes.tempProbe6.description'),
      image: '/images/blu-test/probes/6_temp_probe.png',
    },
    {
      name: t('testProbes.piercingProbe.name'),
      slug: 'piercing-probe-4',
      description: t('testProbes.piercingProbe.description'),
      image: '/images/blu-test/probes/4_piercing_probe.png',
    },
    {
      name: t('testProbes.remoteTemp.name'),
      slug: 'remote-temperature-probe',
      description: t('testProbes.remoteTemp.description'),
      image: '/images/blu-test/probes/Remote_temp_probe.png',
    },
    {
      name: t('testProbes.tempHumid.name'),
      slug: 'temperature-humidity-probe-8',
      description: t('testProbes.tempHumid.description'),
      image: '/images/blu-test/probes/8_temp_humid_probe.png',
    },
    {
      name: t('testProbes.lowPress.name'),
      slug: 'low-range-pressure-probe',
      description: t('testProbes.lowPress.description'),
      image: '/images/blu-test/probes/Low-range_press_probe.png',
    },
    {
      name: t('testProbes.standardPress.name'),
      slug: 'standard-range-pressure-probe',
      description: t('testProbes.standardPress.description'),
      image: '/images/blu-test/probes/Standard-range_press_probe.png',
    },
  ];

  // Why Accurate Reference Devices Matter - 6 features with Material Symbols
  const accuracyFeatures = [
    {
      icon: <ThermometerIcon className="h-10 w-10 text-primary-600" />,
      title: t('accuracy.temperature.title'),
      description: t('accuracy.temperature.description'),
    },
    {
      icon: <HumidityPercentageIcon className="h-10 w-10 text-primary-600" />,
      title: t('accuracy.humidity.title'),
      description: t('accuracy.humidity.description'),
    },
    {
      icon: <GaugeIcon className="h-10 w-10 text-primary-600" />,
      title: t('accuracy.pressure.title'),
      description: t('accuracy.pressure.description'),
    },
    {
      icon: <WindIcon className="h-10 w-10 text-primary-600" />,
      title: t('accuracy.airflow.title'),
      description: t('accuracy.airflow.description'),
    },
    {
      icon: <VerifiedIcon className="h-10 w-10 text-primary-600" />,
      title: t('accuracy.calibration.title'),
      description: t('accuracy.calibration.description'),
    },
    {
      icon: <SmartphoneIcon className="h-10 w-10 text-primary-600" />,
      title: t('accuracy.appIntegration.title'),
      description: t('accuracy.appIntegration.description'),
    },
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Banner - Clean blue background, text only */}
      <section className="bg-primary-700 py-10 md:py-14">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold leading-tight text-white lg:text-6xl xl:text-7xl">
            {t('hero.titleLine1')}
            <br />
            <span className="text-accent-500">{t('hero.titleLine2')}</span>
          </h1>
        </div>
      </section>

      {/* Brand Intro - Blü-Test logo, description, CTAs, probe + app phone */}
      <section className="bg-white py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Left Column */}
            <div className="flex flex-col">
              {/* Blü-Test Brand Logo */}
              <div className="mb-6">
                <Image
                  src="/images/blu-test/hero/Blu_Test_Web_Digital 2.png"
                  alt="BAPI Blü-Test — Test Instrument Suite"
                  width={320}
                  height={160}
                  className="object-contain object-left"
                />
              </div>

              <p className="mb-8 text-lg leading-relaxed text-neutral-600">
                {t('hero.description')}
              </p>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                  href="#blu-test-suite"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-600 px-8 py-3 font-bold text-white transition-all duration-300 hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-500/50"
                >
                  {t('hero.cta')}
                  <ChevronRightIcon className="h-5 w-5" />
                </Link>
                <Link
                  href="#blu-view-app"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-primary-600 px-8 py-3 font-bold text-primary-600 transition-all duration-300 hover:bg-primary-50 focus:outline-none focus:ring-4 focus:ring-primary-500/50"
                >
                  {t('hero.secondaryCta')}
                </Link>
              </div>

              {/* Probe image anchored to bottom-left */}
              <div className="relative mt-8 h-[160px] lg:h-[200px]">
                <Image
                  src="/images/blu-test/hero/Blu-Test 8 inch temperature and humidity.png"
                  alt="Blü-Test 8 inch Temperature and Humidity Probe"
                  fill
                  className="object-contain object-left-bottom"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>

            {/* Right Column - App Phone */}
            <div className="flex items-center justify-center">
              <div className="relative h-[560px] w-[300px] lg:h-[640px] lg:w-[340px]">
                <Image
                  src="/images/blu-test/hero/mobile_app.png"
                  alt="Blu-View App showing live probe data"
                  fill
                  className="object-contain"
                  sizes="340px"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features - 3 cards left, probe lineup right */}
      <section className="bg-neutral-50 py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Left - Feature Cards */}
            <div className="flex flex-col gap-6">
              {[
                {
                  icon: <ThermometerIcon className="h-6 w-6 text-white" />,
                  title: t('keyFeatures.precision.title'),
                  description: t('keyFeatures.precision.description'),
                },
                {
                  icon: <DownloadIcon className="h-6 w-6 text-white" />,
                  title: t('keyFeatures.dataLogging.title'),
                  description: t('keyFeatures.dataLogging.description'),
                },
                {
                  icon: <SmartphoneIcon className="h-6 w-6 text-white" />,
                  title: t('keyFeatures.integration.title'),
                  description: t('keyFeatures.integration.description'),
                },
              ].map((feature, i) => (
                <div key={i} className="flex gap-5 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-primary-600">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="mb-2 text-lg font-bold text-neutral-900">{feature.title}</h3>
                    <p className="text-sm leading-relaxed text-neutral-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Right - Probe Group Lineup */}
            <div className="flex items-center justify-center">
              <div className="relative h-[420px] w-full max-w-[480px]">
                <Image
                  src="/images/blu-test/Blu-Test_2021_US 1.png"
                  alt="Blü-Test probe lineup"
                  fill
                  className="object-contain"
                  sizes="(max-width: 1024px) 100vw, 480px"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Accurate Reference Devices Matter */}
      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-primary-600 lg:text-5xl">
              {t('accuracy.title')}
            </h2>
            <p className="mx-auto max-w-3xl text-lg text-neutral-600">
              {t('accuracy.subtitle')}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {accuracyFeatures.map((feature, index) => (
              <div
                key={index}
                className="rounded-2xl bg-neutral-100 p-6 transition-all duration-300 hover:shadow-md"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="mb-3 text-lg font-bold text-neutral-900">{feature.title}</h3>
                <p className="text-sm text-neutral-600">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Baseline of Truth Banner */}
          <div className="mt-10 flex items-center justify-between gap-8 rounded-2xl bg-primary-700 p-8">
            <div className="flex items-start gap-4">
              <VerifiedIcon className="mt-1 h-6 w-6 flex-shrink-0 text-primary-200" />
              <div>
                <h3 className="mb-2 text-xl font-bold text-white">{t('accuracy.baseline.title')}</h3>
                <p className="text-primary-100">{t('accuracy.baseline.description')}</p>
              </div>
            </div>
            <div className="flex-shrink-0">
              <BarChart3Icon className="h-20 w-20 text-accent-400" />
            </div>
          </div>
        </div>
      </section>

      {/* Blu-View App Section */}
      <section id="blu-view-app" className="bg-neutral-50 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left - Features */}
            <div>
              {/* Icon + Title inline */}
              <div className="mb-6 flex items-center gap-4">
                <div className="relative h-16 w-16 flex-shrink-0">
                  <Image
                    src="/images/blu-test/BluView_icon.png"
                    alt="Blü-View App"
                    fill
                    className="object-contain"
                    sizes="64px"
                  />
                </div>
                <h2 className="text-4xl font-bold text-primary-700 lg:text-5xl">
                  {t('bluView.title')}
                </h2>
              </div>

              <p className="mb-8 text-lg text-neutral-600">{t('bluView.subtitle')}</p>

              {/* Feature List - yellow square icons */}
              <ul className="mb-8 space-y-6">
                <li className="flex items-start gap-4">
                  <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-accent-500">
                    <DownloadIcon className="h-5 w-5 text-neutral-900" />
                  </span>
                  <div>
                    <h4 className="mb-1 font-bold text-neutral-900">{t('bluView.feature1.title')}</h4>
                    <p className="text-sm text-neutral-600">{t('bluView.feature1.description')}</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-accent-500">
                    <DownloadIcon className="h-5 w-5 text-neutral-900" />
                  </span>
                  <div>
                    <h4 className="mb-1 font-bold text-neutral-900">{t('bluView.feature2.title')}</h4>
                    <p className="text-sm text-neutral-600">{t('bluView.feature2.description')}</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-accent-500">
                    <SettingsIcon className="h-5 w-5 text-neutral-900" />
                  </span>
                  <div>
                    <h4 className="mb-1 font-bold text-neutral-900">{t('bluView.feature3.title')}</h4>
                    <p className="text-sm text-neutral-600">{t('bluView.feature3.description')}</p>
                  </div>
                </li>
              </ul>

              {/* Buttons */}
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent-500 px-8 py-3 font-bold text-neutral-900 transition-all duration-300 hover:bg-accent-400 focus:outline-none focus:ring-4 focus:ring-accent-500/50"
                >
                  <DownloadIcon className="h-5 w-5" />
                  {t('bluView.downloadApp')}
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-600 px-8 py-3 font-bold text-white transition-all duration-300 hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-500/50"
                >
                  {t('bluView.learnMore')}
                  <ChevronRightIcon className="h-5 w-5" />
                </Link>
              </div>
            </div>

            {/* Right - Phone Mockup */}
            <div className="flex justify-center">
              <div className="relative h-[600px] w-[300px]">
                <Image
                  src="/images/blu-test/hero/Blu-View_PhoneView.png"
                  alt="Blu-View App Interface"
                  fill
                  className="object-contain drop-shadow-2xl"
                  sizes="300px"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Blü-Test Suite - Product Grid */}
      <section id="blu-test-suite" className="scroll-mt-24 bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-6 text-4xl font-bold text-primary-600 lg:text-5xl">
              {t('testProbes.title')}
            </h2>
            <p className="mx-auto max-w-3xl text-lg leading-relaxed text-neutral-600">
              {t('testProbes.subtitle')}
            </p>
          </div>

          {/* Product Grid */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {testProbes.map((probe, index) => (
              <div
                key={index}
                className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-lg transition-all hover:shadow-xl"
              >
                {/* Product Image */}
                <div className="relative h-48 bg-neutral-50 p-8">
                  <Image
                    src={probe.image}
                    alt={probe.name}
                    fill
                    className="object-contain p-4"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  />
                </div>

                {/* Yellow Accent Bar */}
                <div className="h-1 w-full bg-accent-500" aria-hidden="true" />

                {/* Content */}
                <div className="flex flex-1 flex-col px-6 pb-8 pt-6">
                  <h3 className="mb-3 text-base font-bold text-neutral-900">{probe.name}</h3>
                  <p className="mb-6 flex-1 text-sm leading-relaxed text-neutral-600">{probe.description}</p>
                  <Link
                    href={`/products/${probe.slug}`}
                    className="inline-flex w-full items-center justify-center rounded-xl bg-primary-600 px-6 py-3 text-center font-semibold text-white transition-colors hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-500/50"
                  >
                    {tCommon('learnMore')}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Specifications */}
      <section className="bg-neutral-50 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="mb-3 text-4xl font-bold text-neutral-900 lg:text-5xl">
              {t('specifications.title')}
            </h2>
            <p className="text-lg text-neutral-600">{t('specifications.subtitle')}</p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
            {/* General */}
            <div className="border-b border-neutral-200 px-6 py-4">
              <h3 className="font-bold text-neutral-900">{t('specifications.table.general')}</h3>
            </div>
            <div className="divide-y divide-neutral-100 border-b border-neutral-200">
              <div className="grid grid-cols-2 divide-x divide-neutral-100">
                <div className="px-6 py-3">
                  <div className="text-sm text-neutral-500">{t('specifications.general.power.label')}</div>
                  <div className="text-neutral-900">{t('specifications.general.power.value')}</div>
                </div>
                <div className="px-6 py-3">
                  <div className="text-sm text-neutral-500">{t('specifications.general.charging.label')}</div>
                  <div className="text-neutral-900">{t('specifications.general.charging.value')}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 divide-x divide-neutral-100">
                <div className="px-6 py-3">
                  <div className="text-sm text-neutral-500">{t('specifications.general.communication.label')}</div>
                  <div className="text-neutral-900">{t('specifications.general.communication.value')}</div>
                </div>
                <div className="px-6 py-3">
                  <div className="text-sm text-neutral-500">{t('specifications.general.dataLogging.label')}</div>
                  <div className="text-neutral-900">{t('specifications.general.dataLogging.value')}</div>
                </div>
              </div>
            </div>

            {/* Measurement Range */}
            <div className="border-b border-neutral-200 px-6 py-4">
              <h3 className="font-bold text-neutral-900">{t('specifications.table.measurement')}</h3>
            </div>
            <div className="divide-y divide-neutral-100 border-b border-neutral-200">
              {[
                { label: t('specifications.measurement.temperature.label'), value: t('specifications.measurement.temperature.value') },
                { label: t('specifications.measurement.rh.label'), value: t('specifications.measurement.rh.value') },
                { label: t('specifications.measurement.diffLow.label'), value: t('specifications.measurement.diffLow.value') },
                { label: t('specifications.measurement.diffStd.label'), value: t('specifications.measurement.diffStd.value') },
              ].map((row, i) => (
                <div key={i} className="grid grid-cols-2 divide-x divide-neutral-100">
                  <div className="px-6 py-3 text-sm text-neutral-500">{row.label}</div>
                  <div className="px-6 py-3 text-neutral-900">{row.value}</div>
                </div>
              ))}
            </div>

            {/* Accuracy */}
            <div className="border-b border-neutral-200 px-6 py-4">
              <h3 className="font-bold text-neutral-900">{t('specifications.table.accuracy')}</h3>
            </div>
            <div className="divide-y divide-neutral-100 border-b border-neutral-200">
              {[
                { label: t('specifications.accuracy.tempOnly.label'), value: t('specifications.accuracy.tempOnly.value') },
                { label: t('specifications.accuracy.tempHumid.label'), value: t('specifications.accuracy.tempHumid.value') },
                { label: t('specifications.accuracy.diffLow.label'), value: t('specifications.accuracy.diffLow.value') },
                { label: t('specifications.accuracy.diffStd.label'), value: t('specifications.accuracy.diffStd.value') },
              ].map((row, i) => (
                <div key={i} className="grid grid-cols-2 divide-x divide-neutral-100">
                  <div className="px-6 py-3 text-sm text-neutral-500">{row.label}</div>
                  <div className="px-6 py-3 text-neutral-900">{row.value}</div>
                </div>
              ))}
            </div>

            {/* Environmental & Certifications */}
            <div className="border-b border-neutral-200 px-6 py-4">
              <h3 className="font-bold text-neutral-900">{t('specifications.table.environmental')}</h3>
            </div>
            <div className="divide-y divide-neutral-100">
              {[
                { label: t('specifications.environmental.operatingRange.label'), value: t('specifications.environmental.operatingRange.value') },
                { label: t('specifications.environmental.burstPressure.label'), value: t('specifications.environmental.burstPressure.value') },
                { label: t('specifications.environmental.agencyApprovals.label'), value: t('specifications.environmental.agencyApprovals.value') },
              ].map((row, i) => (
                <div key={i} className="grid grid-cols-2 divide-x divide-neutral-100">
                  <div className="px-6 py-3 text-sm text-neutral-500">{row.label}</div>
                  <div className="px-6 py-3 text-neutral-900">{row.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-primary-700 via-primary-600 to-primary-500 py-16 text-white lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="mb-6 text-4xl font-bold lg:text-5xl">{t('cta.title')}</h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-primary-50 lg:text-xl">
              {t('cta.subtitle')}
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/contact"
                className="bg-bapi-accent-gradient inline-flex items-center justify-center gap-2 rounded-full px-10 py-4 text-lg font-bold transition-all duration-300 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-accent-500/50"
                style={{ color: '#08304B' }}
              >
                {t('cta.contactSales')}
              </Link>
              <Link
                href="#blu-test-suite"
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white/30 bg-white/10 px-10 py-4 text-lg font-bold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20 focus:outline-none focus:ring-4 focus:ring-white/30"
              >
                {t('cta.viewProducts')}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
