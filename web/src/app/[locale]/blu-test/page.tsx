import Image from 'next/image';
import { Link } from '@/lib/navigation';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { generatePageMetadata } from '@/lib/metadata';
import {
  BarChart3Icon,
  CheckCircleIcon,
  ChevronRightIcon,
  GaugeIcon,
  HardDriveIcon,
  HumidityPercentageIcon,
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
      features: [
        t('testProbes.tempProbe95.feature1'),
        t('testProbes.tempProbe95.feature2'),
        t('testProbes.tempProbe95.feature3'),
      ],
      image: '/images/blu-test/probes/9.5_temp_probe.png',
    },
    {
      name: t('testProbes.tempProbe6.name'),
      slug: 'temperature-probe-6',
      features: [
        t('testProbes.tempProbe6.feature1'),
        t('testProbes.tempProbe6.feature2'),
        t('testProbes.tempProbe6.feature3'),
      ],
      image: '/images/blu-test/probes/6_temp_probe.png',
    },
    {
      name: t('testProbes.piercingProbe.name'),
      slug: 'piercing-probe-4',
      features: [
        t('testProbes.piercingProbe.feature1'),
        t('testProbes.piercingProbe.feature2'),
        t('testProbes.piercingProbe.feature3'),
      ],
      image: '/images/blu-test/probes/4_piercing_probe.png',
    },
    {
      name: t('testProbes.remoteTemp.name'),
      slug: 'remote-temperature-probe',
      features: [
        t('testProbes.remoteTemp.feature1'),
        t('testProbes.remoteTemp.feature2'),
        t('testProbes.remoteTemp.feature3'),
      ],
      image: '/images/blu-test/probes/Remote_temp_probe.png',
    },
    {
      name: t('testProbes.tempHumid.name'),
      slug: 'temperature-humidity-probe-8',
      features: [
        t('testProbes.tempHumid.feature1'),
        t('testProbes.tempHumid.feature2'),
        t('testProbes.tempHumid.feature3'),
      ],
      image: '/images/blu-test/probes/8_temp_humid_probe.png',
    },
    {
      name: t('testProbes.standardPress.name'),
      slug: 'standard-range-pressure-probe',
      features: [
        t('testProbes.standardPress.feature1'),
        t('testProbes.standardPress.feature2'),
        t('testProbes.standardPress.feature3'),
      ],
      image: '/images/blu-test/probes/Standard-range_press_probe.png',
    },
    {
      name: t('testProbes.lowPress.name'),
      slug: 'low-range-pressure-probe',
      features: [
        t('testProbes.lowPress.feature1'),
        t('testProbes.lowPress.feature2'),
        t('testProbes.lowPress.feature3'),
      ],
      image: '/images/blu-test/probes/Low-range_press_probe.png',
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
      {/* Hero Section - Blue gradient with image */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-600 to-primary-500 py-12 text-white md:py-14 lg:py-16 xl:py-10 2xl:py-8">
        <div className="absolute inset-0 bg-[url('/images/patterns/grid.svg')] opacity-10" />

        <div className="relative z-10 mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav
            className="mb-6 flex items-center gap-2 text-sm text-primary-100 md:mb-8"
            aria-label="Breadcrumb"
          >
            <Link href="/" className="transition-colors hover:text-white">
              Home
            </Link>
            <ChevronRightIcon className="h-4 w-4" />
            <Link href="/products" className="transition-colors hover:text-white">
              Products
            </Link>
            <ChevronRightIcon className="h-4 w-4" />
            <span className="font-medium text-white">Blu-Test</span>
          </nav>

          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-12 2xl:gap-16">
            {/* Left Column - Content */}
            <div>
              <h1 className="mb-5 text-4xl font-bold leading-tight text-accent-500 lg:text-5xl xl:mb-4 xl:text-6xl">
                {t('hero.title')}
              </h1>
              <p className="mb-6 text-lg leading-relaxed text-white lg:text-xl xl:mb-5">
                {t('hero.description')}
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                  href="#blu-test-suite"
                  className="bg-bapi-accent-gradient inline-flex items-center justify-center gap-2 rounded-full px-10 py-4 text-lg font-bold transition-all duration-300 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-accent-500/50"
                  style={{ color: '#08304B' }}
                >
                  {t('hero.cta')}
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white/30 bg-white/10 px-10 py-4 text-lg font-bold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20 focus:outline-none focus:ring-4 focus:ring-white/30"
                >
                  {t('hero.secondaryCta')}
                </Link>
              </div>
            </div>

            {/* Right Column - Hero Image (no white box) */}
            <div className="relative">
              <div className="relative h-[400px] lg:h-[500px]">
                <Image
                  src="/images/blu-test/hero/2021BluTestAngle_PLAIN (1).png"
                  alt="Blu-Test Probe"
                  fill
                  className="object-contain"
                  sizes="(max-width: 1023px) 600px, 700px"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features - 2 Column Layout with Product Image */}
      <section className="bg-neutral-100 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Left Column - Feature Cards */}
            <div className="space-y-6">
              {/* Precision Measurement */}
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary-600">
                  <ThermometerIcon className="h-7 w-7 text-white" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-neutral-900">
                  {t('keyFeatures.precision.title')}
                </h3>
                <p className="text-neutral-600">{t('keyFeatures.precision.description')}</p>
              </div>

              {/* Onboard Data Logging */}
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary-600">
                  <HardDriveIcon className="h-7 w-7 text-white" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-neutral-900">
                  {t('keyFeatures.dataLogging.title')}
                </h3>
                <p className="text-neutral-600">{t('keyFeatures.dataLogging.description')}</p>
              </div>

              {/* Smart Device Integration */}
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary-600">
                  <SmartphoneIcon className="h-7 w-7 text-white" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-neutral-900">
                  {t('keyFeatures.integration.title')}
                </h3>
                <p className="text-neutral-600">{t('keyFeatures.integration.description')}</p>
              </div>
            </div>

            {/* Right Column - Product Image */}
            <div className="relative">
              <div className="relative h-[400px] lg:h-[550px]">
                <Image
                  src="/images/blu-test/hero/2021BluTestAngle_PLAIN (1).png"
                  alt="Blu-Test Probes Collection"
                  fill
                  className="object-contain"
                  sizes="(max-width: 1023px) 600px, 700px"
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

      {/* The Bluetooth of Truth */}
      <section className="bg-gradient-to-br from-primary-700 to-primary-600 py-16 text-white lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left - Content */}
            <div>
              <h2 className="mb-6 text-4xl font-bold lg:text-5xl">{t('bluetooth.title')}</h2>
              <p className="mb-6 text-lg leading-relaxed text-primary-50">
                {t('bluetooth.description')}
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircleIcon className="mt-1 h-6 w-6 flex-shrink-0 text-accent-400" />
                  <span className="text-primary-50">{t('bluetooth.feature1')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircleIcon className="mt-1 h-6 w-6 flex-shrink-0 text-accent-400" />
                  <span className="text-primary-50">{t('bluetooth.feature2')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircleIcon className="mt-1 h-6 w-6 flex-shrink-0 text-accent-400" />
                  <span className="text-primary-50">{t('bluetooth.feature3')}</span>
                </li>
              </ul>
            </div>

            {/* Right - Chart/Graph Placeholder */}
            <div className="rounded-2xl bg-white/10 p-8 backdrop-blur-sm">
              <div className="flex h-[300px] items-center justify-center">
                <BarChart3Icon className="h-32 w-32 text-primary-200" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blu-View App Section */}
      <section className="bg-gradient-to-br from-neutral-50 to-white py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left - Features */}
            <div>
              <div className="mb-6">
                <span className="rounded-full bg-primary-100 px-4 py-2 text-sm font-semibold text-primary-600">
                  {t('bluView.badge')}
                </span>
              </div>
              <h2 className="mb-6 text-4xl font-bold text-primary-600 lg:text-5xl">
                {t('bluView.title')}
              </h2>
              <p className="mb-8 text-lg text-neutral-600">{t('bluView.subtitle')}</p>

              {/* Feature List */}
              <ul className="mb-8 space-y-4">
                <li className="flex items-start gap-3">
                  <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-accent-500 text-sm font-bold text-neutral-900">
                    ✓
                  </span>
                  <div>
                    <h4 className="font-bold text-neutral-900">{t('bluView.feature1.title')}</h4>
                    <p className="text-sm text-neutral-600">{t('bluView.feature1.description')}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-accent-500 text-sm font-bold text-neutral-900">
                    ✓
                  </span>
                  <div>
                    <h4 className="font-bold text-neutral-900">{t('bluView.feature2.title')}</h4>
                    <p className="text-sm text-neutral-600">{t('bluView.feature2.description')}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-accent-500 text-sm font-bold text-neutral-900">
                    ✓
                  </span>
                  <div>
                    <h4 className="font-bold text-neutral-900">{t('bluView.feature3.title')}</h4>
                    <p className="text-sm text-neutral-600">{t('bluView.feature3.description')}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-accent-500 text-sm font-bold text-neutral-900">
                    ✓
                  </span>
                  <div>
                    <h4 className="font-bold text-neutral-900">{t('bluView.feature4.title')}</h4>
                    <p className="text-sm text-neutral-600">{t('bluView.feature4.description')}</p>
                  </div>
                </li>
              </ul>

              {/* Download Buttons */}
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                  href="https://apps.apple.com/us/app/blu-view"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-accent-500 px-8 py-3 font-bold text-neutral-900 transition-all duration-300 hover:bg-accent-400 focus:outline-none focus:ring-4 focus:ring-accent-500/50"
                >
                  {t('bluView.downloadIOS')}
                </Link>
                <Link
                  href="https://play.google.com/store/apps/details?id=com.bapi.bluview"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-primary-600 px-8 py-3 font-bold text-white transition-all duration-300 hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-500/50"
                >
                  {t('bluView.downloadAndroid')}
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
                className="group overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg"
              >
                {/* Product Image */}
                <div className="relative aspect-square overflow-hidden bg-neutral-50">
                  <Image
                    src={probe.image}
                    alt={probe.name}
                    fill
                    className="object-contain p-6 transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  />
                </div>

                {/* Product Details */}
                <div className="p-6">
                  <h3 className="mb-4 text-lg font-bold text-neutral-900">{probe.name}</h3>

                  {/* Features List */}
                  <ul className="mb-6 space-y-2">
                    {probe.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-2 text-sm text-neutral-700">
                        <CheckCircleIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Learn More Link */}
                  <Link
                    href={`/products/${probe.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 transition-colors hover:text-primary-700"
                  >
                    {tCommon('learnMore')}
                    <ChevronRightIcon className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Specifications */}
      <section className="bg-gradient-to-br from-neutral-50 to-white py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-primary-600 lg:text-5xl">
              {t('specifications.title')}
            </h2>
          </div>

          {/* Specifications Table */}
          <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
            <table className="w-full">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-neutral-900">
                    {t('specifications.table.header1')}
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-neutral-900">
                    {t('specifications.table.header2')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                <tr>
                  <td className="px-6 py-4 font-medium text-neutral-900">
                    {t('specifications.table.general')}
                  </td>
                  <td className="px-6 py-4 text-neutral-700"></td>
                </tr>
                <tr className="bg-neutral-50/50">
                  <td className="px-6 py-3 pl-12 text-neutral-700">
                    {t('specifications.general.range.label')}
                  </td>
                  <td className="px-6 py-3 text-neutral-900">
                    {t('specifications.general.range.value')}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-3 pl-12 text-neutral-700">
                    {t('specifications.general.accuracy.label')}
                  </td>
                  <td className="px-6 py-3 text-neutral-900">
                    {t('specifications.general.accuracy.value')}
                  </td>
                </tr>
                <tr className="bg-neutral-50/50">
                  <td className="px-6 py-3 pl-12 text-neutral-700">
                    {t('specifications.general.resolution.label')}
                  </td>
                  <td className="px-6 py-3 text-neutral-900">
                    {t('specifications.general.resolution.value')}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium text-neutral-900">
                    {t('specifications.table.measurement')}
                  </td>
                  <td className="px-6 py-4 text-neutral-700"></td>
                </tr>
                <tr className="bg-neutral-50/50">
                  <td className="px-6 py-3 pl-12 text-neutral-700">
                    {t('specifications.measurement.range.label')}
                  </td>
                  <td className="px-6 py-3 text-neutral-900">
                    {t('specifications.measurement.range.value')}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-3 pl-12 text-neutral-700">
                    {t('specifications.measurement.accuracy.label')}
                  </td>
                  <td className="px-6 py-3 text-neutral-900">
                    {t('specifications.measurement.accuracy.value')}
                  </td>
                </tr>
                <tr className="bg-neutral-50/50">
                  <td className="px-6 py-3 pl-12 text-neutral-700">
                    {t('specifications.measurement.response.label')}
                  </td>
                  <td className="px-6 py-3 text-neutral-900">
                    {t('specifications.measurement.response.value')}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium text-neutral-900">
                    {t('specifications.table.environmental')}
                  </td>
                  <td className="px-6 py-4 text-neutral-700"></td>
                </tr>
                <tr className="bg-neutral-50/50">
                  <td className="px-6 py-3 pl-12 text-neutral-700">
                    {t('specifications.environmental.certifications.label')}
                  </td>
                  <td className="px-6 py-3 text-neutral-900">
                    {t('specifications.environmental.certifications.value')}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-3 pl-12 text-neutral-700">
                    {t('specifications.environmental.warranty.label')}
                  </td>
                  <td className="px-6 py-3 text-neutral-900">
                    {t('specifications.environmental.warranty.value')}
                  </td>
                </tr>
              </tbody>
            </table>
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
