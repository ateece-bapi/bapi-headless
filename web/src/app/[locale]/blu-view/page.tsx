import type { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/lib/navigation';
import { generatePageMetadata } from '@/lib/metadata';
import { MaterialSymbol } from '@/components/icons/MaterialSymbol';
import {
  ChevronRightIcon,
  DownloadIcon,
  GaugeIcon,
  SettingsIcon,
  ShoppingCartIcon,
  WifiIcon,
  WrenchIcon,
} from '@/lib/icons';

type Props = {
  params: Promise<{ locale: string }>;
};

const GOOGLE_PLAY_URL = 'https://play.google.com/store/apps/details?id=com.bapi.bluview';
const APP_STORE_URL = 'https://apps.apple.com/us/app/blu-view/id6478835493';

/** Build localized metadata for the Blu-View landing page. */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'bluViewLandingPage' });

  return generatePageMetadata(
    {
      title: t('metadata.title'),
      description: t('metadata.description'),
      path: 'blu-view',
      keywords: t('metadata.keywords')
        .split(',')
        .map((keyword) => keyword.trim())
        .filter(Boolean),
    },
    locale
  );
}

/** Render the Blu-View app landing page. */
export default async function BluViewPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'bluViewLandingPage' });

  const features: { icon: React.ReactNode; title: string; description: string; href: string }[] = [
    {
      icon: <WifiIcon className="h-8 w-8 text-white" aria-hidden="true" />,
      title: t('features.bluTest.title'),
      description: t('features.bluTest.description'),
      href: '/blu-test',
    },
    {
      icon: <MaterialSymbol icon="sensors" className="h-8 w-8 text-white" />,
      title: t('features.wam.title'),
      description: t('features.wam.description'),
      href: '/wam',
    },
    {
      icon: <MaterialSymbol icon="document_scanner" className="h-8 w-8 text-white" />,
      title: t('features.scanner.title'),
      description: t('features.scanner.description'),
      href: '/wireless-site-verification',
    },
    {
      icon: <ShoppingCartIcon className="h-8 w-8 text-white" aria-hidden="true" />,
      title: t('features.website.title'),
      description: t('features.website.description'),
      href: '/products',
    },
    {
      icon: <WrenchIcon className="h-8 w-8 text-white" aria-hidden="true" />,
      title: t('features.tools.title'),
      description: t('features.tools.description'),
      href: '#download-blu-view',
    },
    {
      icon: <SettingsIcon className="h-8 w-8 text-white" aria-hidden="true" />,
      title: t('features.settings.title'),
      description: t('features.settings.description'),
      href: '#download-blu-view',
    },
  ];

  const bluTestFeatures: { icon: React.ReactNode; title: string; description: string }[] = [
    {
      icon: <MaterialSymbol icon="monitoring" className="h-5 w-5 text-neutral-900" />,
      title: t('bluTest.realTime.title'),
      description: t('bluTest.realTime.description'),
    },
    {
      icon: <DownloadIcon className="h-5 w-5 text-neutral-900" aria-hidden="true" />,
      title: t('bluTest.logs.title'),
      description: t('bluTest.logs.description'),
    },
    {
      icon: <GaugeIcon className="h-5 w-5 text-neutral-900" aria-hidden="true" />,
      title: t('bluTest.management.title'),
      description: t('bluTest.management.description'),
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <section className="border-b-4 border-accent-500 bg-bapi-primary-gradient py-12 text-white lg:py-14">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14 lg:px-8">
          <div>
            <div className="mb-8 flex items-center gap-5">
              <Image
                src="/images/blu-view/blu-view.png"
                alt=""
                width={132}
                height={91}
                className="h-auto w-24 sm:w-28"
                aria-hidden="true"
                priority
              />
              <h1 className="text-5xl font-bold leading-none sm:text-6xl">{t('hero.title')}</h1>
            </div>

            <p className="mb-8 max-w-xl text-3xl font-bold leading-tight text-accent-500">
              {t('hero.tagline')}
            </p>
            <p className="max-w-xl text-base leading-7 text-white lg:text-lg">
              {t('hero.description')}
            </p>

            <div id="download-blu-view" className="mt-8 flex flex-wrap items-center gap-5 scroll-mt-24">
              <a
                href={GOOGLE_PLAY_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t('hero.googlePlay')}
                className="rounded-md focus:outline-none focus:ring-4 focus:ring-white/50"
              >
                <Image
                  src="/images/blu-test/GetItOnGooglePlay_Badge_Web_color_English 2.png"
                  alt={t('hero.googlePlay')}
                  width={180}
                  height={54}
                  className="h-12 w-auto"
                />
              </a>
              <a
                href={APP_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t('hero.appStore')}
                className="rounded-md focus:outline-none focus:ring-4 focus:ring-white/50"
              >
                <Image
                  src="/images/blu-test/Download_on_the_App_Store_Badge_US-UK_RGB_blk_092917 2.png"
                  alt={t('hero.appStore')}
                  width={180}
                  height={54}
                  className="h-12 w-auto"
                />
              </a>
            </div>
          </div>

          <Image
            src="/images/blu-view/phone-hvac-workbench-homescreen 1.png"
            alt={t('hero.imageAlt')}
            width={656}
            height={584}
            className="h-auto w-full"
            sizes="(max-width: 1023px) 100vw, 52vw"
            priority
          />
        </div>
      </section>

      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-10">
            {features.map((feature) => (
                <article
                  key={feature.title}
                  className="flex min-h-64 flex-col rounded-lg bg-neutral-50 p-6 shadow-lg"
                >
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-md bg-primary-700">
                    {feature.icon}
                  </div>
                  <h2 className="mb-3 text-xl font-bold text-primary-700">{feature.title}</h2>
                  <p className="mb-5 flex-1 text-sm leading-6 text-neutral-600">
                    {feature.description}
                  </p>
                  <Link
                    href={feature.href}
                    className="inline-flex w-fit items-center gap-3 font-bold text-primary-700 hover:text-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {t('features.learnMore')}
                    <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                  </Link>
                </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-neutral-50 py-16 lg:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Image
              src="/images/blu-test/hero/Blu_Test_Web_Digital 2.png"
              alt={t('bluTest.logoAlt')}
              width={320}
              height={160}
              className="mx-auto h-auto w-64 sm:w-80"
            />
            <div className="mx-auto my-6 h-1 max-w-4xl bg-accent-500" aria-hidden="true" />
            <p className="mx-auto max-w-4xl text-base font-semibold leading-6 text-neutral-700">
              {t('bluTest.introduction')}
            </p>
          </div>

          <div className="mt-12 grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
            <div className="space-y-8">
              {bluTestFeatures.map((feature) => (
                  <div key={feature.title} className="flex gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-accent-500">
                      {feature.icon}
                    </div>
                    <div>
                      <h2 className="mb-2 text-base font-bold text-neutral-800">{feature.title}</h2>
                      <p className="text-sm leading-6 text-neutral-700">{feature.description}</p>
                    </div>
                  </div>
              ))}
            </div>

            <Image
              src="/images/blu-view/Blu-Test_Family_withRemote_US 1.png"
              alt={t('bluTest.imageAlt')}
              width={640}
              height={480}
              className="h-auto w-full"
              sizes="(max-width: 1023px) 100vw, 52vw"
            />
          </div>
        </div>
      </section>

      {/* ── Feature Photo Cards ── */}
      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            <article className="overflow-hidden rounded-2xl bg-neutral-100">
              <div className="relative h-64 w-full">
                <Image
                  src="/images/blu-view/all-on-one-display.png"
                  alt={t('photoCards.allOnOneDisplay.title')}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-6">
                <h3 className="mb-3 text-lg font-bold text-primary-700">
                  {t('photoCards.allOnOneDisplay.title')}
                </h3>
                <p className="text-sm leading-relaxed text-neutral-600">
                  {t('photoCards.allOnOneDisplay.description')}
                </p>
              </div>
            </article>

            <article className="overflow-hidden rounded-2xl bg-neutral-100">
              <div className="relative h-64 w-full">
                <Image
                  src="/images/blu-view/forget-cords-meters.png"
                  alt={t('photoCards.forgetCords.title')}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-6">
                <h3 className="mb-3 text-lg font-bold text-primary-700">
                  {t('photoCards.forgetCords.title')}
                </h3>
                <p className="text-sm leading-relaxed text-neutral-600">
                  {t('photoCards.forgetCords.description')}
                </p>
              </div>
            </article>

            <article className="overflow-hidden rounded-2xl bg-neutral-100">
              <div className="relative h-64 w-full">
                <Image
                  src="/images/blu-view/calibration-notifications.png"
                  alt={t('photoCards.calibrationNotifications.title')}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-6">
                <h3 className="mb-3 text-lg font-bold text-primary-700">
                  {t('photoCards.calibrationNotifications.title')}
                </h3>
                <p className="text-sm leading-relaxed text-neutral-600">
                  {t('photoCards.calibrationNotifications.description')}
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* ── Testing and Validation Simplified ── */}
      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-2xl bg-neutral-100">
            <div className="grid items-center lg:grid-cols-2">
              <div className="p-10 lg:p-14">
                <h2 className="mb-6 text-2xl font-bold leading-tight text-primary-700 lg:text-3xl">
                  {t('testing.headline')}
                </h2>
                <p className="mb-8 text-sm leading-relaxed text-neutral-600 lg:text-base">
                  {t('testing.description')}
                </p>
                <Link
                  href="/blu-test"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary-700 px-6 py-3 font-bold text-white transition-colors hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-500/50"
                >
                  {t('testing.cta')}
                  <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                </Link>
              </div>
              <div className="relative h-72 lg:h-full lg:min-h-[400px]">
                <Image
                  src="/images/blu-view/testing-validation-simplified.png"
                  alt={t('testing.imageAlt')}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1023px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WAM Section ── */}
      <section className="bg-white">

        {/* Gray area: logo + divider + description + hero image */}
        <div className="bg-neutral-50 pb-12 pt-10">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
            <Image
              src="/images/blu-view/wam-logo.png"
              alt={t('wam.logoAlt')}
              width={180}
              height={72}
              className="mb-6 h-auto w-36 object-contain sm:w-44"
            />
            <div className="mb-8 h-0.5 w-full bg-accent-500" aria-hidden="true" />
            <p className="mb-10 max-w-2xl text-sm leading-relaxed text-neutral-900 lg:text-base">
              {t('wam.description')}
            </p>
            <div className="w-full overflow-hidden rounded-2xl">
              <Image
                src="/images/blu-view/dashboard-hero-frame.png"
                alt={t('wam.heroAlt')}
                width={1020}
                height={480}
                className="h-auto w-full object-cover"
                sizes="(max-width: 1023px) 100vw, 1020px"
              />
            </div>
          </div>
        </div>

        {/* White area: feature cards + proactive card */}
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16 lg:py-20">

          {/* How It Works + Key Features */}
          <div className="mb-8 grid gap-6 md:grid-cols-2">
            <article className="overflow-hidden rounded-2xl bg-neutral-100">
              <div className="relative h-48 w-full">
                <Image
                  src="/images/blu-view/AdobeStock_334846979 (1) 1.png"
                  alt={t('wam.howItWorks.imageAlt')}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="p-6">
                <h3 className="mb-3 text-lg font-bold text-primary-700">
                  {t('wam.howItWorks.title')}
                </h3>
                <p className="text-sm leading-relaxed text-neutral-600">
                  {t('wam.howItWorks.description')}
                </p>
              </div>
            </article>

            <article className="overflow-hidden rounded-2xl bg-neutral-100">
              <div className="relative h-48 w-full">
                <Image
                  src="/images/blu-view/AdobeStock_62010512 (1) 1.png"
                  alt={t('wam.keyFeatures.imageAlt')}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="p-6">
                <h3 className="mb-3 text-lg font-bold text-primary-700">
                  {t('wam.keyFeatures.title')}
                </h3>
                <ul className="space-y-2 text-sm text-neutral-600">
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-primary-600">•</span>
                    {t('wam.keyFeatures.feature1')}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-primary-600">•</span>
                    {t('wam.keyFeatures.feature2')}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-primary-600">•</span>
                    {t('wam.keyFeatures.feature3')}
                  </li>
                </ul>
              </div>
            </article>
          </div>

          {/* Proactive monitoring CTA card */}
          <div className="overflow-hidden rounded-2xl bg-neutral-100">
            <div className="grid items-center lg:grid-cols-2">
              <div className="p-10 lg:p-14">
                <h2 className="mb-6 text-2xl font-bold leading-tight text-primary-700 lg:text-3xl">
                  {t('wam.proactive.headline')}
                </h2>
                <p className="mb-8 text-sm leading-relaxed text-neutral-600 lg:text-base">
                  {t('wam.proactive.description')}
                </p>
                <Link
                  href="/wam"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary-700 px-6 py-3 font-bold text-white transition-colors hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-500/50"
                >
                  {t('wam.proactive.cta')}
                  <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                </Link>
              </div>
              <div className="relative h-72 lg:h-full lg:min-h-[400px]">
                <Image
                  src="/images/blu-view/grocery-store-phone 1.png"
                  alt={t('wam.proactive.imageAlt')}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1023px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── BLE Scanner Section ── */}
      <section className="bg-neutral-50 py-16 lg:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">

            {/* Left: content */}
            <div>
              <div className="mb-8 flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-primary-700">
                  <MaterialSymbol icon="document_scanner" className="text-3xl text-white" />
                </div>
                <h2 className="text-4xl font-bold text-primary-700">
                  {t('bleScanner.title')}
                </h2>
              </div>

              <div className="mb-10 space-y-7">
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent-500">
                    <MaterialSymbol icon="document_scanner" className="text-xl text-neutral-900" />
                  </div>
                  <div>
                    <h3 className="mb-1 font-bold text-neutral-900">{t('bleScanner.scan.title')}</h3>
                    <p className="text-sm leading-relaxed text-neutral-600">{t('bleScanner.scan.description')}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent-500">
                    <MaterialSymbol icon="wifi" className="text-xl text-neutral-900" />
                  </div>
                  <div>
                    <h3 className="mb-1 font-bold text-neutral-900">{t('bleScanner.signal.title')}</h3>
                    <p className="text-sm leading-relaxed text-neutral-600">{t('bleScanner.signal.description')}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent-500">
                    <MaterialSymbol icon="checklist" className="text-xl text-neutral-900" />
                  </div>
                  <div>
                    <h3 className="mb-1 font-bold text-neutral-900">{t('bleScanner.verify.title')}</h3>
                    <p className="text-sm leading-relaxed text-neutral-600">{t('bleScanner.verify.description')}</p>
                  </div>
                </div>
              </div>

              <Link
                href="/support"
                className="inline-flex items-center gap-2 rounded-lg bg-primary-700 px-6 py-3 font-bold text-white transition-colors hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-500/50"
              >
                {t('bleScanner.cta')}
                <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
              </Link>
            </div>

            {/* Right: floor plan image with animated sensor pulses */}
            <div className="relative">
              <Image
                src="/images/blu-view/floor-plan-sensors.png"
                alt={t('bleScanner.imageAlt')}
                width={600}
                height={590}
                className="h-auto w-full"
                sizes="(max-width: 1023px) 100vw, 50vw"
              />
              {/* Animated pulse rings overlaid on the 4 static sensor dots */}
              <span className="pointer-events-none absolute left-[35%] top-[27%] -translate-x-1/2 -translate-y-1/2">
                <span className="absolute inline-flex h-10 w-10 animate-ping rounded-full bg-accent-400 opacity-50" />
              </span>
              <span className="pointer-events-none absolute left-[17%] top-[42%] -translate-x-1/2 -translate-y-1/2">
                <span className="absolute inline-flex h-10 w-10 animate-ping rounded-full bg-accent-400 opacity-50 [animation-delay:0.3s]" />
              </span>
              <span className="pointer-events-none absolute left-[26%] top-[58%] -translate-x-1/2 -translate-y-1/2">
                <span className="absolute inline-flex h-10 w-10 animate-ping rounded-full bg-accent-400 opacity-50 [animation-delay:0.6s]" />
              </span>
              <span className="pointer-events-none absolute left-[32%] top-[74%] -translate-x-1/2 -translate-y-1/2">
                <span className="absolute inline-flex h-10 w-10 animate-ping rounded-full bg-accent-400 opacity-50 [animation-delay:0.9s]" />
              </span>
            </div>

          </div>
        </div>
      </section>
      {/* ── BAPI Website / Tools / Settings Cards ── */}
      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-3">

            {/* BAPI Website */}
            <article className="overflow-hidden rounded-2xl bg-neutral-100">
              <div className="relative h-64 w-full">
                <Image
                  src="/images/blu-view/website.png"
                  alt={t('appCards.website.imageAlt')}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-700">
                    <ShoppingCartIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  <h2 className="text-xl font-bold text-primary-700">{t('appCards.website.title')}</h2>
                </div>
                <p className="text-sm leading-relaxed text-neutral-700">{t('appCards.website.description')}</p>
              </div>
            </article>

            {/* Tools */}
            <article className="overflow-hidden rounded-2xl bg-neutral-100">
              <div className="relative h-64 w-full">
                <Image
                  src="/images/blu-view/tools.png"
                  alt={t('appCards.tools.imageAlt')}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-700">
                    <WrenchIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  <h2 className="text-xl font-bold text-primary-700">{t('appCards.tools.title')}</h2>
                </div>
                <p className="mb-3 text-sm leading-relaxed text-neutral-700">{t('appCards.tools.description')}</p>
                <ul className="space-y-1 text-sm text-neutral-700">
                  {(['calc1','calc2','calc3','calc4','calc5'] as const).map((key) => (
                    <li key={key} className="flex items-start gap-2">
                      <span className="mt-0.5 text-neutral-400">•</span>
                      {t(`appCards.tools.${key}`)}
                    </li>
                  ))}
                </ul>
              </div>
            </article>

            {/* Settings */}
            <article className="overflow-hidden rounded-2xl bg-neutral-100">
              <div className="relative h-64 w-full">
                <Image
                  src="/images/blu-view/settings.png"
                  alt={t('appCards.settings.imageAlt')}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-700">
                    <SettingsIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  <h2 className="text-xl font-bold text-primary-700">{t('appCards.settings.title')}</h2>
                </div>
                <p className="mb-4 text-sm leading-relaxed text-neutral-700">{t('appCards.settings.description1')}</p>
                <p className="text-sm leading-relaxed text-neutral-700">{t('appCards.settings.description2')}</p>
              </div>
            </article>

          </div>
        </div>
      </section>

      {/* ── App Showcase ── */}
      <section className="bg-white py-12 lg:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Image
            src="/images/blu-view/blu-view-phone-tablet 4.png"
            alt={t('showcase.imageAlt')}
            width={1200}
            height={900}
            className="h-auto w-full"
            sizes="(max-width: 1023px) 100vw, 1020px"
          />
          <Image
            src="/images/blu-view/Blu-Test 8 inch temperature and humidity.png"
            alt={t('showcase.probeAlt')}
            width={1200}
            height={300}
            className="relative -mt-[32%] h-auto w-full"
            sizes="(max-width: 1023px) 100vw, 1020px"
          />
        </div>
      </section>

      {/* ── Download CTA ── */}
      <section className="bg-bapi-primary-gradient py-20 lg:py-24 text-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="mb-4 text-3xl font-bold lg:text-4xl">
            {t('cta.headline')}
          </h2>
          <p className="mb-10 text-base text-white/80 lg:text-lg">
            {t('cta.description')}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="rounded-lg bg-accent-500 px-10 py-4 font-bold text-neutral-900 transition-colors hover:bg-accent-400 focus:outline-none focus:ring-4 focus:ring-accent-300/50"
            >
              {t('cta.contactUs')}
            </Link>
            <Link
              href="#download-blu-view"
              className="rounded-lg border-2 border-white px-10 py-4 font-bold text-white transition-colors hover:bg-white/10 focus:outline-none focus:ring-4 focus:ring-white/30"
            >
              {t('cta.downloadApp')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}