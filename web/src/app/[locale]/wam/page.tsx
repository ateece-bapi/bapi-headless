import { Link } from '@/lib/navigation';
import Image from 'next/image';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { generatePageMetadata } from '@/lib/metadata';
import {
  BellIcon,
  ThermometerIcon,
  LineChartIcon,
  TrendingUpIcon,
  ShieldIcon,
  FileTextIcon,
  DropletIcon,
  ZapIcon,
  DollarSignIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  SmartphoneIcon,
  AlertTriangleIcon,
  ChevronRightIcon,
  HumidityPercentageIcon,
  SpeedIcon,
  DoorOpenIcon,
  WaterDamageIcon,
  LightbulbIcon,
} from '@/lib/icons';
import { ProcessSteps } from '@/components/landing/ProcessSteps';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'wamLandingPage' });

  return generatePageMetadata(
    {
      title: t('metadata.title'),
      description: t('metadata.description'),
      path: 'wam',
      keywords: t('metadata.keywords')
        .split(',')
        .map((k) => k.trim())
        .filter(Boolean),
    },
    locale
  );
}

export default async function WAMPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'wamLandingPage' });

  // Industries list for demo form
  const industries = [
    t('industries.restaurants.title'),
    t('industries.greenhouses.title'),
    t('industries.meatProcessing.title'),
    t('industries.hospitalsPharmacies.title'),
    t('industries.groceryStores.title'),
    t('industries.convenienceStores.title'),
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
            <span className="font-medium text-white">{t('breadcrumb.wam')}</span>
          </nav>

          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-12 2xl:gap-16">
            {/* Left Column - Content */}
            <div>
              {/* WAM Logo */}
              <div className="mb-6 xl:mb-5">
                <Image
                  src="/images/wam/dashboards/wam-logo.webp"
                  alt="WAM Logo"
                  width={120}
                  height={60}
                  className="h-auto w-32"
                  priority
                />
              </div>

              <h1 className="mb-5 text-4xl font-bold leading-tight text-accent-500 lg:text-5xl xl:mb-4 xl:text-6xl">
                {t('hero.title')}
              </h1>
              <p className="mb-6 text-lg leading-relaxed text-white lg:text-xl xl:mb-5">
                {t('hero.description')}
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <a
                  href="#demo"
                  className="bg-bapi-accent-gradient inline-flex items-center justify-center gap-2 rounded-full px-10 py-4 text-lg font-bold transition-all duration-300 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-accent-500/50"
                  style={{ color: '#08304B' }}
                >
                  {t('hero.cta')}
                  <ArrowRightIcon className="h-5 w-5" />
                </a>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white/30 bg-white/10 px-10 py-4 text-lg font-bold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20 focus:outline-none focus:ring-4 focus:ring-white/30"
                >
                  {t('hero.secondaryCta')}
                </a>
              </div>
            </div>

            {/* Right Column - Hero Image */}
            <div className="relative">
              <div className="overflow-hidden rounded-2xl bg-white p-8 shadow-lg">
                <Image
                  src="/images/wam/dashboards/wam-hero-sensors-gateway.webp"
                  alt="WAM wireless sensors with gateway - temperature and humidity monitoring system"
                  width={640}
                  height={411}
                  className="h-auto w-full"
                  sizes="(max-width: 1023px) 100vw, (max-width: 1600px) 50vw, 800px"
                  priority
                  quality={85}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is WAM Section */}
      <section className="bg-neutral-50 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-6 text-4xl font-bold text-primary-600 lg:text-5xl">
              {t('features.title')}
            </h2>
            <p className="mx-auto max-w-3xl text-lg leading-relaxed text-neutral-600 lg:text-xl">
              {t('features.description')}
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid gap-8 md:grid-cols-3">
            {/* Multi-Sensor Monitoring */}
            <div className="rounded-2xl bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-100">
                <ThermometerIcon className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-neutral-900">
                {t('features.multiSensor.title')}
              </h3>
              <p className="text-neutral-600">
                {t('features.multiSensor.description')}
              </p>
            </div>

            {/* Real-Time Alerts */}
            <div className="rounded-2xl bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-100">
                <BellIcon className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-neutral-900">
                {t('features.realTimeAlerts.title')}
              </h3>
              <p className="text-neutral-600">
                {t('features.realTimeAlerts.description')}
              </p>
            </div>

            {/* Data Analytics & Compliance */}
            <div className="rounded-2xl bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-100">
                <TrendingUpIcon className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-neutral-900">
                {t('features.dataAnalytics.title')}
              </h3>
              <p className="text-neutral-600">
                {t('features.dataAnalytics.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Avoid Costly Losses Section */}
      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Left Column - Image */}
            <div className="order-2 lg:order-1">
              <div className="overflow-hidden rounded-2xl shadow-xl">
                <Image
                  src="/images/wam/dashboards/wam-real-time-visibility.webp"
                  alt="Store employee using tablet to monitor refrigeration"
                  width={692}
                  height={577}
                  className="h-auto w-full"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>

            {/* Right Column - Content */}
            <div className="order-1 lg:order-2">
              <h2 className="mb-6 text-4xl font-bold text-primary-600 lg:text-5xl">
                {t('costlyLosses.title')}
              </h2>
              <p className="mb-8 text-lg leading-relaxed text-neutral-600">
                {t('costlyLosses.description')}
              </p>

              {/* Benefits List */}
              <div className="space-y-6">
                {/* Prevent Spoilage */}
                <div className="flex gap-4">
                  <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-accent-500">
                    <ShieldIcon className="h-7 w-7 text-neutral-900" />
                  </div>
                  <div>
                    <h3 className="mb-2 text-xl font-bold text-neutral-900">
                      {t('costlyLosses.preventSpoilage.title')}
                    </h3>
                    <p className="text-neutral-600">
                      {t('costlyLosses.preventSpoilage.description')}
                    </p>
                  </div>
                </div>

                {/* Maintain Compliance */}
                <div className="flex gap-4">
                  <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-accent-500">
                    <FileTextIcon className="h-7 w-7 text-neutral-900" />
                  </div>
                  <div>
                    <h3 className="mb-2 text-xl font-bold text-neutral-900">
                      {t('costlyLosses.maintainCompliance.title')}
                    </h3>
                    <p className="text-neutral-600">
                      {t('costlyLosses.maintainCompliance.description')}
                    </p>
                  </div>
                </div>

                {/* Detect Water Damage */}
                <div className="flex gap-4">
                  <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-accent-500">
                    <DropletIcon className="h-7 w-7 text-neutral-900" />
                  </div>
                  <div>
                    <h3 className="mb-2 text-xl font-bold text-neutral-900">
                      {t('costlyLosses.detectWaterDamage.title')}
                    </h3>
                    <p className="text-neutral-600">
                      {t('costlyLosses.detectWaterDamage.description')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="scroll-mt-20 bg-neutral-50 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary-600 lg:text-base">
              {t('howItWorks.badge')}
            </p>
            <h2 className="mb-6 text-4xl font-bold text-neutral-900 lg:text-5xl">
              {t('howItWorks.title')}
            </h2>
            <p className="mx-auto max-w-3xl text-lg leading-relaxed text-neutral-600 lg:text-xl">
              {t('howItWorks.subtitle')}
            </p>
          </div>

          {/* How It Works Infographic */}
          <div className="mb-16">
            <div className="relative mx-auto max-w-5xl overflow-hidden rounded-2xl bg-white shadow-xl">
              <Image
                src="/images/wam/dashboards/WAM_Graphic.webp"
                alt="WAM System How It Works - Sensors send readings to gateway, gateway sends to cloud, view on any device"
                width={1400}
                height={900}
                className="h-auto w-full"
                sizes="(max-width: 1024px) 100vw, 1024px"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Alert Banner */}
      <section className="bg-accent-500 py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-4 text-neutral-900">
            <AlertTriangleIcon className="h-6 w-6 flex-shrink-0" />
            <p className="text-center text-lg font-semibold">{t('alertBanner.text')}</p>
          </div>
        </div>
      </section>

      {/* Why WAM Section */}
      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <p className="mb-3 text-base font-semibold uppercase tracking-wide text-primary-600 lg:text-lg">
              {t('benefits.badge')}
            </p>
            <h2 className="mb-6 text-4xl font-bold text-neutral-900 lg:text-5xl">
              {t('benefits.title')}
            </h2>
            <p className="mx-auto max-w-3xl text-lg leading-relaxed text-neutral-600 lg:text-xl">
              {t('benefits.subtitle')}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-10">
            {[
              {
                icon: DollarSignIcon,
                title: t('benefits.costSavings.title'),
                description: t('benefits.costSavings.description'),
              },
              {
                icon: ZapIcon,
                title: t('benefits.proactivePrevention.title'),
                description: t('benefits.proactivePrevention.description'),
              },
              {
                icon: SmartphoneIcon,
                title: t('benefits.monitorAnywhere.title'),
                description: t('benefits.monitorAnywhere.description'),
              },
              {
                icon: LineChartIcon,
                title: t('benefits.historicalTrends.title'),
                description: t('benefits.historicalTrends.description'),
              },
              {
                icon: ShieldIcon,
                title: t('benefits.operationalEfficiency.title'),
                description: t('benefits.operationalEfficiency.description'),
              },
              {
                icon: TrendingUpIcon,
                title: t('benefits.scalable.title'),
                description: t('benefits.scalable.description'),
              },
            ].map((benefit) => (
              <div
                key={benefit.title}
                className="group flex h-full flex-col rounded-xl border border-neutral-100 bg-neutral-50 p-6 transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.02] hover:border-primary-200 hover:bg-white hover:shadow-2xl"
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 shadow-md transition-transform duration-300 ease-out group-hover:scale-110 group-hover:rotate-3">
                  <benefit.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-neutral-900">{benefit.title}</h3>
                <p className="text-base leading-relaxed text-neutral-700">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-6 text-4xl font-bold text-neutral-900 lg:text-5xl">
              {t('industries.title')}
            </h2>
            <p className="mx-auto max-w-3xl text-lg leading-relaxed text-neutral-600 lg:text-xl">
              {t('industries.subtitle')}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Restaurants */}
            <div className="group overflow-hidden rounded-2xl border-2 border-neutral-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-primary-500 hover:shadow-2xl">
              <div className="relative h-56 overflow-hidden">
                <Image
                  src="/images/wam/dashboards/restaurants-wam.webp"
                  alt="Restaurant monitoring"
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                />
              </div>
              <div className="p-6">
                <h3 className="mb-3 text-xl font-bold text-primary-600">
                  {t('industries.restaurants.title')}
                </h3>
                <p className="mb-4 text-neutral-600">
                  {t('industries.restaurants.description')}
                </p>
                <ul className="space-y-2 text-sm text-neutral-700">
                  {(t.raw('industries.restaurants.benefits') as string[]).map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="mt-1 text-primary-600">•</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Greenhouses */}
            <div className="group overflow-hidden rounded-2xl border-2 border-neutral-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-primary-500 hover:shadow-2xl">
              <div className="relative h-56 overflow-hidden">
                <Image
                  src="/images/wam/dashboards/greenhouses-wam.webp"
                  alt="Greenhouse monitoring"
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                />
              </div>
              <div className="p-6">
                <h3 className="mb-3 text-xl font-bold text-primary-600">
                  {t('industries.greenhouses.title')}
                </h3>
                <p className="mb-4 text-neutral-600">
                  {t('industries.greenhouses.description')}
                </p>
                <ul className="space-y-2 text-sm text-neutral-700">
                  {(t.raw('industries.greenhouses.benefits') as string[]).map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="mt-1 text-primary-600">•</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Meat Processing */}
            <div className="group overflow-hidden rounded-2xl border-2 border-neutral-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-primary-500 hover:shadow-2xl">
              <div className="relative h-56 overflow-hidden">
                <Image
                  src="/images/wam/dashboards/wam_meat_processing.webp"
                  alt="Meat processing monitoring"
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                />
              </div>
              <div className="p-6">
                <h3 className="mb-3 text-xl font-bold text-primary-600">
                  {t('industries.meatProcessing.title')}
                </h3>
                <p className="mb-4 text-neutral-600">
                  {t('industries.meatProcessing.description')}
                </p>
                <ul className="space-y-2 text-sm text-neutral-700">
                  {(t.raw('industries.meatProcessing.benefits') as string[]).map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="mt-1 text-primary-600">•</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Hospitals and Pharmacies */}
            <div className="group overflow-hidden rounded-2xl border-2 border-neutral-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-primary-500 hover:shadow-2xl">
              <div className="relative h-56 overflow-hidden">
                <Image
                  src="/images/wam/dashboards/hospitals-pharmacies-wam.webp"
                  alt="Hospital and pharmacy monitoring"
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                />
              </div>
              <div className="p-6">
                <h3 className="mb-3 text-xl font-bold text-primary-600">
                  {t('industries.hospitalsPharmacies.title')}
                </h3>
                <p className="mb-4 text-neutral-600">
                  {t('industries.hospitalsPharmacies.description')}
                </p>
                <ul className="space-y-2 text-sm text-neutral-700">
                  {(t.raw('industries.hospitalsPharmacies.benefits') as string[]).map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="mt-1 text-primary-600">•</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Grocery Stores */}
            <div className="group overflow-hidden rounded-2xl border-2 border-neutral-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-primary-500 hover:shadow-2xl">
              <div className="relative h-56 overflow-hidden">
                <Image
                  src="/images/wam/dashboards/grocery-stores-wam.webp"
                  alt="Grocery store monitoring"
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                />
              </div>
              <div className="p-6">
                <h3 className="mb-3 text-xl font-bold text-primary-600">
                  {t('industries.groceryStores.title')}
                </h3>
                <p className="mb-4 text-neutral-600">
                  {t('industries.groceryStores.description')}
                </p>
                <ul className="space-y-2 text-sm text-neutral-700">
                  {(t.raw('industries.groceryStores.benefits') as string[]).map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="mt-1 text-primary-600">•</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Convenience Stores */}
            <div className="group overflow-hidden rounded-2xl border-2 border-neutral-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-primary-500 hover:shadow-2xl">
              <div className="relative h-56 overflow-hidden">
                <Image
                  src="/images/wam/dashboards/convenience-stores-wam.webp"
                  alt="Convenience store monitoring"
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                />
              </div>
              <div className="p-6">
                <h3 className="mb-3 text-xl font-bold text-primary-600">
                  {t('industries.convenienceStores.title')}
                </h3>
                <p className="mb-4 text-neutral-600">
                  {t('industries.convenienceStores.description')}
                </p>
                <ul className="space-y-2 text-sm text-neutral-700">
                  {(t.raw('industries.convenienceStores.benefits') as string[]).map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="mt-1 text-primary-600">•</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comprehensive Sensor Coverage Section */}
      <section className="bg-neutral-50 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-6 text-4xl font-bold text-primary-600 lg:text-5xl">
              {t('sensorCoverage.title')}
            </h2>
            <p className="mx-auto max-w-3xl text-lg leading-relaxed text-neutral-600 lg:text-xl">
              {t('sensorCoverage.subtitle')}
            </p>
          </div>

          {/* Sensor Grid */}
          <div className="mb-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Temperature */}
            <div className="flex items-start gap-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md">
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl bg-primary-100">
                <ThermometerIcon className="h-8 w-8 text-primary-600" />
              </div>
              <div>
                <h3 className="mb-2 text-xl font-bold text-neutral-900">
                  {t('sensorCoverage.temperature.title')}
                </h3>
                <p className="text-sm leading-relaxed text-neutral-600">
                  {t('sensorCoverage.temperature.description')}
                </p>
              </div>
            </div>

            {/* Humidity */}
            <div className="flex items-start gap-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md">
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl bg-primary-100">
                <HumidityPercentageIcon className="h-8 w-8 text-primary-600" />
              </div>
              <div>
                <h3 className="mb-2 text-xl font-bold text-neutral-900">
                  {t('sensorCoverage.humidity.title')}
                </h3>
                <p className="text-sm leading-relaxed text-neutral-600">
                  {t('sensorCoverage.humidity.description')}
                </p>
              </div>
            </div>

            {/* Barometric Pressure */}
            <div className="flex items-start gap-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md">
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl bg-primary-100">
                <SpeedIcon className="h-8 w-8 text-primary-600" />
              </div>
              <div>
                <h3 className="mb-2 text-xl font-bold text-neutral-900">
                  {t('sensorCoverage.barometricPressure.title')}
                </h3>
                <p className="text-sm leading-relaxed text-neutral-600">
                  {t('sensorCoverage.barometricPressure.description')}
                </p>
              </div>
            </div>

            {/* Door Contact */}
            <div className="flex items-start gap-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md">
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl bg-primary-100">
                <DoorOpenIcon className="h-8 w-8 text-primary-600" />
              </div>
              <div>
                <h3 className="mb-2 text-xl font-bold text-neutral-900">
                  {t('sensorCoverage.doorContact.title')}
                </h3>
                <p className="text-sm leading-relaxed text-neutral-600">
                  {t('sensorCoverage.doorContact.description')}
                </p>
              </div>
            </div>

            {/* Water Leak */}
            <div className="flex items-start gap-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md">
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl bg-primary-100">
                <WaterDamageIcon className="h-8 w-8 text-primary-600" />
              </div>
              <div>
                <h3 className="mb-2 text-xl font-bold text-neutral-900">
                  {t('sensorCoverage.waterLeak.title')}
                </h3>
                <p className="text-sm leading-relaxed text-neutral-600">
                  {t('sensorCoverage.waterLeak.description')}
                </p>
              </div>
            </div>

            {/* Light Level */}
            <div className="flex items-start gap-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md">
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl bg-primary-100">
                <LightbulbIcon className="h-8 w-8 text-primary-600" />
              </div>
              <div>
                <h3 className="mb-2 text-xl font-bold text-neutral-900">
                  {t('sensorCoverage.lightLevel.title')}
                </h3>
                <p className="text-sm leading-relaxed text-neutral-600">
                  {t('sensorCoverage.lightLevel.description')}
                </p>
              </div>
            </div>
          </div>

          {/* Sensor Icons Row */}
          <div className="mb-8 flex items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 bg-accent-500" style={{ borderColor: '#08304B' }}>
              <ThermometerIcon className="h-8 w-8" style={{ color: '#08304B', fontVariationSettings: "'FILL' 1, 'wght' 500" }} />
            </div>
            <div className="-ml-4 flex h-16 w-16 items-center justify-center rounded-full border-4 bg-accent-500" style={{ borderColor: '#08304B' }}>
              <HumidityPercentageIcon className="h-8 w-8" style={{ color: '#08304B', fontVariationSettings: "'FILL' 1, 'wght' 500" }} />
            </div>
            <div className="-ml-4 flex h-16 w-16 items-center justify-center rounded-full border-4 bg-accent-500" style={{ borderColor: '#08304B' }}>
              <SpeedIcon className="h-8 w-8" style={{ color: '#08304B', fontVariationSettings: "'FILL' 1, 'wght' 500" }} />
            </div>
            <div className="-ml-4 flex h-16 w-16 items-center justify-center rounded-full border-4 bg-accent-500" style={{ borderColor: '#08304B' }}>
              <DoorOpenIcon className="h-8 w-8" style={{ color: '#08304B', fontVariationSettings: "'FILL' 1, 'wght' 500" }} />
            </div>
            <div className="-ml-4 flex h-16 w-16 items-center justify-center rounded-full border-4 bg-accent-500" style={{ borderColor: '#08304B' }}>
              <WaterDamageIcon className="h-8 w-8" style={{ color: '#08304B', fontVariationSettings: "'FILL' 1, 'wght' 500" }} />
            </div>
            <div className="-ml-4 flex h-16 w-16 items-center justify-center rounded-full border-4 bg-accent-500" style={{ borderColor: '#08304B' }}>
              <LightbulbIcon className="h-8 w-8" style={{ color: '#08304B', fontVariationSettings: "'FILL' 1, 'wght' 500" }} />
            </div>
          </div>

          <p className="mb-8 text-center text-lg leading-relaxed text-neutral-700">
            {t('sensorCoverage.seamlessIntegration')}
          </p>

          <div className="text-center">
            <Link
              href="/products/wireless-sensors/bluetooth-wireless"
              className="bg-bapi-accent-gradient inline-flex items-center gap-3 rounded-full px-12 py-5 text-2xl font-bold transition-all duration-300 hover:shadow-xl"
              style={{ color: '#08304B' }}
            >
              {t('sensorCoverage.browseSensors')}
              <ChevronRightIcon className="h-8 w-8" />
            </Link>
          </div>
        </div>
      </section>

      {/* Demo Request Section */}
      <section id="demo" className="scroll-mt-20 bg-gradient-to-br from-primary-50 to-primary-100 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-white p-8 shadow-2xl lg:p-12">
            <div className="grid gap-12 lg:grid-cols-2">
              {/* Left - Content */}
              <div>
                <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary-600">
                  {t('demo.badge')}
                </p>
                <h2 className="mb-6 text-4xl font-bold text-neutral-900 lg:text-5xl">
                  {t('demo.title')}
                </h2>
                <p className="mb-8 text-lg leading-relaxed text-neutral-600">
                  {t('demo.subtitle')}
                </p>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircleIcon className="mt-0.5 h-6 w-6 flex-shrink-0 text-primary-500" />
                    <div>
                      <h4 className="font-bold text-neutral-900">
                        {t('demo.benefits.consultation.title')}
                      </h4>
                      <p className="text-sm text-neutral-700">
                        {t('demo.benefits.consultation.description')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircleIcon className="mt-0.5 h-6 w-6 flex-shrink-0 text-primary-500" />
                    <div>
                      <h4 className="font-bold text-neutral-900">
                        {t('demo.benefits.pricing.title')}
                      </h4>
                      <p className="text-sm text-neutral-700">
                        {t('demo.benefits.pricing.description')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircleIcon className="mt-0.5 h-6 w-6 flex-shrink-0 text-primary-500" />
                    <div>
                      <h4 className="font-bold text-neutral-900">
                        {t('demo.benefits.implementation.title')}
                      </h4>
                      <p className="text-sm text-neutral-700">
                        {t('demo.benefits.implementation.description')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right - Form */}
              <div>
                <form className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="firstName"
                        className="mb-2 block text-sm font-semibold text-neutral-700"
                      >
                        {t('demo.form.firstName')} {t('demo.form.required')}
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        required
                        className="w-full rounded-lg border border-neutral-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="lastName"
                        className="mb-2 block text-sm font-semibold text-neutral-700"
                      >
                        {t('demo.form.lastName')} {t('demo.form.required')}
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        required
                        className="w-full rounded-lg border border-neutral-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-semibold text-neutral-700"
                    >
                      {t('demo.form.email')} {t('demo.form.required')}
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="w-full rounded-lg border border-neutral-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="mb-2 block text-sm font-semibold text-neutral-700"
                    >
                      {t('demo.form.phone')} {t('demo.form.required')}
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      className="w-full rounded-lg border border-neutral-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="company"
                      className="mb-2 block text-sm font-semibold text-neutral-700"
                    >
                      {t('demo.form.company')}
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      className="w-full rounded-lg border border-neutral-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="industry"
                      className="mb-2 block text-sm font-semibold text-neutral-700"
                    >
                      {t('demo.form.industry')}
                    </label>
                    <select
                      id="industry"
                      name="industry"
                      className="w-full rounded-lg border border-neutral-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">{t('demo.form.selectIndustry')}</option>
                      {industries.map((industry) => (
                        <option key={industry} value={industry}>
                          {industry}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="mb-2 block text-sm font-semibold text-neutral-700"
                    >
                      {t('demo.form.message')}
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      className="w-full rounded-lg border border-neutral-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-primary-500"
                      placeholder={t('demo.form.messagePlaceholder')}
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-bapi-accent-gradient w-full rounded-full px-12 py-5 text-2xl font-bold transition-all duration-300 hover:shadow-xl"
                    style={{ color: '#08304B' }}
                  >
                    {t('demo.form.submit')}
                  </button>

                  <p className="text-center text-xs text-neutral-700">{t('demo.form.privacy')}</p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="bg-primary-600 py-12 text-white">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-2xl font-bold lg:text-3xl">{t('finalCta.title')}</h2>
          <p className="mb-6 text-primary-100">{t('finalCta.subtitle')}</p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/support/contact"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-10 py-4 text-lg font-bold text-primary-600 transition-all duration-300 hover:bg-primary-50 hover:shadow-lg"
            >
              {t('finalCta.contactSupport')}
            </Link>
            <Link
              href="/products/wireless-sensors/bluetooth-wireless"
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white bg-primary-500 px-10 py-4 text-lg font-bold text-white transition-all duration-300 hover:bg-primary-700 hover:shadow-lg"
            >
              {t('finalCta.browseProducts')}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
