import { Metadata } from 'next';
import { Link } from '@/lib/navigation';
import dynamic from 'next/dynamic';
import {
  Building2Icon,
  UsersIcon,
  TargetIcon,
  AwardIcon,
  MapPinIcon,
  PhoneIcon,
  MailIcon,
  CheckCircleIcon,
  GlobeIcon,
  TrendingUpIcon,
  ShieldCheckIcon,
} from '@/lib/icons';
import PageContainer from '@/components/layout/PageContainer';
import PageHeader from '@/components/layout/PageHeader';
import { GlobalPresenceDynamic as GlobalPresence } from '@/components/company/GlobalPresenceDynamic';
import { generatePageMetadata } from '@/lib/metadata';
import { getTranslations } from 'next-intl/server';
import { locales } from '@/i18n';

// Generate static params for all locales - ensures each locale is built separately
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

/**
 * AI-optimized metadata for company page
 * Enhanced for search visibility and brand discovery
 */
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('companyPages.about.metadata');

  return generatePageMetadata({
    title: t('title'),
    description: t('description'),
    path: 'company',
    keywords: [
      'building automation manufacturer',
      'HVAC sensor company',
      'building automation products',
      'BAPI company history',
      'building controls manufacturer',
      'sensor manufacturer',
      'BACnet manufacturer',
      'NIST traceable sensors',
    ],
    type: 'website',
  });
}

// ISR with 1-hour revalidation for about page (rarely updated)
export const revalidate = 3600;

export default async function CompanyPage() {
  const t = await getTranslations('companyPages.about');
  const differenceT = await getTranslations('companyPages.whyBapi');
  const homeT = await getTranslations('home');
  return (
    <div className="min-h-screen bg-white">
      <PageHeader
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: t('hero.title') }]}
        title={t('hero.title')}
        description={t('hero.subtitle')}
        eyebrow={
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
            <Building2Icon className="h-4 w-4" />
            {t('hero.badge')}
          </div>
        }
      >
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-primary-100">
          {t('hero.description')}
        </p>
      </PageHeader>

      {/* Company Overview */}
      <section className="py-14 md:py-16">
        <PageContainer size="prose">
          <div className="mx-auto">
            <div className="mx-auto mb-4 h-1 w-16 bg-accent-500" />
            <h2 className="mb-8 text-center text-4xl font-bold text-neutral-900">
              {t('overview.title')}
            </h2>
            <div className="space-y-6 text-lg leading-relaxed text-neutral-700">
              <p className="text-balance">{t('overview.paragraph1')}</p>
              <p className="text-balance">{t('overview.paragraph2')}</p>
              {t.has('overview.paragraph3') && (
                <p className="text-balance">
                  {t.rich('overview.paragraph3', {
                    distributorLink: (chunks) => (
                      <Link
                        href="/where-to-buy"
                        className="font-semibold text-primary-600 underline"
                      >
                        {chunks}
                      </Link>
                    ),
                  })}
                </p>
              )}
            </div>
          </div>
        </PageContainer>
      </section>

      {/* Key Stats */}
      <section className="bg-neutral-50 py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-linear-to-br relative overflow-hidden rounded-2xl from-primary-700 via-primary-600 to-primary-500 p-8 shadow-xl">
            <div className="bg-grid-pattern absolute inset-0" />

            <div className="relative grid grid-cols-2 gap-6 md:grid-cols-3 lg:gap-8">
              <div className="group text-center">
                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 transition-all duration-300 group-hover:scale-110 group-hover:bg-white/30">
                  <TrendingUpIcon className="h-7 w-7 text-white" />
                </div>
                <div className="mb-2 text-4xl font-bold text-white transition-transform duration-300 group-hover:scale-105 lg:text-5xl">
                  {homeT('stats.yearsValue')}
                </div>
                <div className="text-sm font-medium text-white/90">
                  {homeT('stats.yearsLabel')}
                </div>
              </div>

              <div className="group text-center">
                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 transition-all duration-300 group-hover:scale-110 group-hover:bg-white/30">
                  <GlobeIcon className="h-7 w-7 text-white" />
                </div>
                <div className="mb-2 text-4xl font-bold text-white transition-transform duration-300 group-hover:scale-105 lg:text-5xl">
                  {homeT('stats.globalValue')}
                </div>
                <div className="text-sm font-medium text-white/90">
                  {homeT('stats.globalLabel')}
                </div>
              </div>

              <div className="group text-center">
                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 transition-all duration-300 group-hover:scale-110 group-hover:bg-white/30">
                  <ShieldCheckIcon className="h-7 w-7 text-white" />
                </div>
                <div className="mb-2 text-4xl font-bold text-white transition-transform duration-300 group-hover:scale-105 lg:text-5xl">
                  {homeT('stats.isoValue')}
                </div>
                <div className="text-sm font-medium text-white/90">
                  {homeT('stats.isoLabel')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BAPI Difference */}
      <section className="bg-neutral-50 py-14 md:py-16">
        <PageContainer size="prose">
          <div className="mb-10 text-center">
            <p className="mb-3 text-sm font-bold tracking-wide text-primary-600 uppercase">
              {differenceT('qualitySection.badge')}
            </p>
            <h2 className="mb-4 text-4xl font-bold text-neutral-900">
              {differenceT('qualitySection.title')}
            </h2>
            <p className="mx-auto max-w-3xl text-lg leading-relaxed text-neutral-700">
              {differenceT('qualitySection.description')}
            </p>
          </div>

          <div className="grid grid-cols-1 border-y border-neutral-300 md:grid-cols-2">
            {(
              [
                'differentiators.testing.title',
                'qualitySection.features.nist',
                'qualitySection.features.production',
                'qualitySection.features.compatibility',
              ] as const
            ).map((messageKey) => (
              <div
                key={messageKey}
                className="flex items-center gap-4 border-b border-neutral-300 px-4 py-5 last:border-b-0 md:odd:border-r md:[&:nth-last-child(-n+2)]:border-b-0"
              >
                <CheckCircleIcon className="h-7 w-7 shrink-0 text-primary-600" />
                <h3 className="text-lg font-bold text-neutral-900">
                  {differenceT(messageKey)}
                </h3>
              </div>
            ))}
          </div>
        </PageContainer>
      </section>

      {/* Core Values */}
      <section className="py-14 md:py-16">
        <PageContainer size="prose">
          <div className="mx-auto mb-4 h-1 w-16 bg-accent-500" />
          <h2 className="mb-4 text-balance text-center text-4xl font-bold text-neutral-900">
            {t('coreValues.title')}
          </h2>
          <p className="mb-10 text-balance text-center text-lg text-neutral-600">
            {t('coreValues.subtitle')}
          </p>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="duration-normal group rounded-2xl border-2 border-neutral-200 bg-white p-8 shadow-sm transition-all hover:-translate-y-2 hover:border-primary-300 hover:shadow-xl">
              <TargetIcon className="mb-5 h-14 w-14 text-accent-500 transition-transform duration-300 group-hover:scale-110" />
              <h3 className="mb-4 text-2xl font-bold text-neutral-900">
                {t('coreValues.qualityFirst.title')}
              </h3>
              <p className="leading-relaxed text-neutral-700">
                {t('coreValues.qualityFirst.description')}
              </p>
            </div>

            <div className="duration-normal group rounded-2xl border-2 border-neutral-200 bg-white p-8 shadow-sm transition-all hover:-translate-y-2 hover:border-primary-300 hover:shadow-xl">
              <UsersIcon className="mb-5 h-14 w-14 text-accent-500 transition-transform duration-300 group-hover:scale-110" />
              <h3 className="mb-4 text-2xl font-bold text-neutral-900">
                {t('coreValues.customerFocus.title')}
              </h3>
              <p className="leading-relaxed text-neutral-700">
                {t('coreValues.customerFocus.description')}
              </p>
            </div>

            <div className="duration-normal group rounded-2xl border-2 border-neutral-200 bg-white p-8 shadow-sm transition-all hover:-translate-y-2 hover:border-primary-300 hover:shadow-xl md:col-span-2">
              <AwardIcon className="mb-5 h-14 w-14 text-accent-500 transition-transform duration-300 group-hover:scale-110" />
              <h3 className="mb-4 text-2xl font-bold text-neutral-900">
                {t('coreValues.innovation.title')}
              </h3>
              <p className="leading-relaxed text-neutral-700">
                {t('coreValues.innovation.description')}
              </p>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* Global Presence */}
      <GlobalPresence />

      {/* Location & Contact */}
      <section className="bg-neutral-50 py-16">
        <PageContainer size="prose">
          <h2 className="mb-8 text-center text-3xl font-bold text-neutral-900">
            {t('location.title')}
          </h2>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Location */}
            <div className="duration-normal rounded-xl border border-neutral-200 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
              <MapPinIcon className="duration-normal mb-4 h-10 w-10 text-primary-500 transition-transform hover:scale-110" />
              <h3 className="mb-4 text-xl font-bold text-neutral-900">
                {t('location.locationCard.title')}
              </h3>
              <div className="space-y-2 leading-relaxed text-neutral-700">
                <p className="font-semibold">{t('location.locationCard.companyName')}</p>
                <p>{t('location.locationCard.street')}</p>
                <p>{t('location.locationCard.city')}</p>
                <p>{t('location.locationCard.country')}</p>
              </div>
            </div>

            {/* Contact */}
            <div className="duration-normal rounded-xl border border-neutral-200 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
              <PhoneIcon className="duration-normal mb-4 h-10 w-10 text-primary-500 transition-transform hover:scale-110" />
              <h3 className="mb-4 text-xl font-bold text-neutral-900">
                {t('location.contactCard.title')}
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="mb-1 text-sm text-neutral-700">
                    {t('location.contactCard.phoneLabel')}
                  </p>
                  <a
                    href="tel:+17158561203"
                    className="duration-normal text-lg font-bold text-primary-500 transition-colors hover:text-primary-600"
                  >
                    {t('location.contactCard.phone')}
                  </a>
                </div>
                <div>
                  <p className="mb-1 text-sm text-neutral-700">
                    {t('location.contactCard.emailLabel')}
                  </p>
                  <a
                    href="mailto:sales@bapihvac.com"
                    className="duration-normal text-lg font-bold text-primary-500 transition-colors hover:text-primary-600"
                  >
                    {t('location.contactCard.email')}
                  </a>
                </div>
                <div>
                  <p className="mb-1 text-sm text-neutral-700">
                    {t('location.contactCard.hoursLabel')}
                  </p>
                  <p className="text-neutral-900">{t('location.contactCard.hoursDays')}</p>
                  <p className="text-neutral-900">{t('location.contactCard.hoursTime')}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/contact"
              className="duration-normal inline-block rounded-xl bg-accent-500 px-8 py-3 font-bold text-neutral-900 transition-all hover:scale-105 hover:bg-accent-600 hover:shadow-lg focus-visible:ring-4 focus-visible:ring-accent-500/50"
            >
              {t('location.cta')}
            </Link>
          </div>
        </PageContainer>
      </section>

      {/* Quick Links */}
      <section className="py-12">
        <PageContainer size="narrow">
          <h3 className="mb-6 text-center text-2xl font-bold text-neutral-900">
            {t('quickLinks.title')}
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Link
              href="/company/why-bapi"
              className="duration-normal rounded-xl border border-neutral-200 bg-white p-4 text-center transition-all hover:border-primary-500 hover:shadow-md"
            >
              <h4 className="font-bold text-neutral-900">{t('quickLinks.whyBapi.title')}</h4>
              <p className="mt-1 text-sm text-neutral-700">{t('quickLinks.whyBapi.description')}</p>
            </Link>
            <Link
              href="/company/news"
              className="duration-normal rounded-xl border border-neutral-200 bg-white p-4 text-center transition-all hover:border-primary-500 hover:shadow-md"
            >
              <h4 className="font-bold text-neutral-900">{t('quickLinks.news.title')}</h4>
              <p className="mt-1 text-sm text-neutral-700">{t('quickLinks.news.description')}</p>
            </Link>
            <Link
              href="/company/careers"
              className="duration-normal rounded-xl border border-neutral-200 bg-white p-4 text-center transition-all hover:border-primary-500 hover:shadow-md"
            >
              <h4 className="font-bold text-neutral-900">{t('quickLinks.careers.title')}</h4>
              <p className="mt-1 text-sm text-neutral-700">{t('quickLinks.careers.description')}</p>
            </Link>
          </div>
        </PageContainer>
      </section>
    </div>
  );
}
