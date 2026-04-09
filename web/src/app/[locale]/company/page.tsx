import { Metadata } from 'next';
import { Link } from '@/lib/navigation';
import { Building2Icon, UsersIcon, TargetIcon, AwardIcon, MapPinIcon, PhoneIcon, MailIcon } from '@/lib/icons';
import PageContainer from '@/components/layout/PageContainer';
import { GlobalPresence } from '@/components/company/GlobalPresence';
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
      'made in USA sensors',
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
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-linear-to-r from-primary-700 via-primary-500 to-primary-700 py-12 text-white lg:py-16">
        <PageContainer size="prose">
          <div className="text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
              <Building2Icon className="h-4 w-4" />
              {t('hero.badge')}
            </div>
            <h1 className="mb-6 text-balance text-5xl font-bold leading-tight sm:text-6xl">
              {t('hero.title')}
            </h1>
            <p className="mx-auto mb-4 text-balance text-xl font-medium text-primary-50 sm:text-2xl">
              {t('hero.subtitle')}
            </p>
            <p className="mx-auto text-balance text-lg leading-relaxed text-primary-100">
              {t('hero.description')}
            </p>
          </div>
        </PageContainer>
      </section>

      {/* Company Overview */}
      <section className="py-20">
        <PageContainer size="prose">
          <div className="mx-auto">
            <h2 className="mb-8 text-center text-4xl font-bold text-neutral-900">
              {t('overview.title')}
            </h2>
            <div className="space-y-6 text-lg leading-relaxed text-neutral-700">
              <p className="text-balance">{t('overview.paragraph1')}</p>
              <p className="text-balance">{t('overview.paragraph2')}</p>
            </div>
          </div>
          <div className="mt-12 h-px bg-linear-to-r from-transparent via-neutral-300 to-transparent" />
        </PageContainer>
      </section>

      {/* Key Stats */}
      <section className="bg-linear-to-b from-neutral-50 to-white py-16">
        <PageContainer size="narrow">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {(['years', 'products', 'madeInUsa', 'distribution'] as const).map((statKey) => (
              <div
                key={statKey}
                className="group cursor-default rounded-xl bg-white p-6 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
              >
                <div className="mb-2 text-5xl font-bold text-primary-500 transition-transform group-hover:scale-105">
                  {t(`stats.${statKey}.value`)}
                </div>
                <div className="text-sm font-semibold tracking-wide text-neutral-600">
                  {t(`stats.${statKey}.label`)}
                </div>
              </div>
            ))}
          </div>
        </PageContainer>
      </section>

      {/* Core Values */}
      <section className="py-20">
        <PageContainer size="prose">
          <h2 className="mb-4 text-balance text-center text-4xl font-bold text-neutral-900">
            {t('coreValues.title')}
          </h2>
          <p className="mb-12 text-balance text-center text-lg text-neutral-600">
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
