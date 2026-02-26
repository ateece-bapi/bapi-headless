import { Metadata } from 'next';
import Link from 'next/link';
import { Building2, Users, Target, Award, MapPin, Phone, Mail } from 'lucide-react';
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
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-700 via-primary-500 to-primary-700 py-16 text-white">
        <PageContainer size="narrow">
          <div className="text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
              <Building2 className="h-4 w-4" />
              {t('hero.badge')}
            </div>
            <h1 className="mb-4 text-balance text-4xl font-bold sm:text-5xl">{t('hero.title')}</h1>
            <p className="mx-auto mb-2 max-w-3xl text-balance text-xl text-primary-50">
              {t('hero.subtitle')}
            </p>
            <p className="mx-auto max-w-3xl text-balance text-lg text-primary-100">
              {t('hero.description')}
            </p>
          </div>
        </PageContainer>
      </section>

      {/* Company Overview */}
      <section className="py-16">
        <PageContainer size="narrow">
          <div className="prose prose-lg max-w-none">
            <h2 className="mb-6 text-center text-3xl font-bold text-neutral-900">
              {t('overview.title')}
            </h2>
            <p className="mb-6 text-lg leading-relaxed text-neutral-700">
              {t('overview.paragraph1')}
            </p>
            <p className="text-lg leading-relaxed text-neutral-700">{t('overview.paragraph2')}</p>
          </div>
          <div className="mt-10 h-px bg-gradient-to-r from-transparent via-neutral-200 to-transparent" />
        </PageContainer>
      </section>

      {/* Key Stats */}
      <section className="bg-neutral-50 py-12">
        <PageContainer size="narrow">
          <div className="grid grid-cols-2 gap-6">
            <div className="group cursor-default text-center">
              <div className="duration-normal mb-1 text-4xl font-bold text-primary-500 transition-transform group-hover:scale-110">
                {t('stats.years.value')}
              </div>
              <div className="duration-normal text-sm font-semibold tracking-wide text-neutral-500 transition-colors group-hover:text-neutral-900">
                {t('stats.years.label')}
              </div>
            </div>
            <div className="group cursor-default text-center">
              <div className="duration-normal mb-1 text-4xl font-bold text-primary-500 transition-transform group-hover:scale-110">
                {t('stats.products.value')}
              </div>
              <div className="duration-normal text-sm font-semibold tracking-wide text-neutral-500 transition-colors group-hover:text-neutral-900">
                {t('stats.products.label')}
              </div>
            </div>
            <div className="group cursor-default text-center">
              <div className="duration-normal mb-1 text-4xl font-bold text-primary-500 transition-transform group-hover:scale-110">
                {t('stats.madeInUsa.value')}
              </div>
              <div className="duration-normal text-sm font-semibold tracking-wide text-neutral-500 transition-colors group-hover:text-neutral-900">
                {t('stats.madeInUsa.label')}
              </div>
            </div>
            <div className="group cursor-default text-center">
              <div className="duration-normal mb-1 text-4xl font-bold text-primary-500 transition-transform group-hover:scale-110">
                {t('stats.distribution.value')}
              </div>
              <div className="duration-normal text-sm font-semibold tracking-wide text-neutral-500 transition-colors group-hover:text-neutral-900">
                {t('stats.distribution.label')}
              </div>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* Core Values */}
      <section className="py-16">
        <PageContainer size="narrow">
          <h2 className="mb-4 text-balance text-center text-3xl font-bold text-neutral-900">
            {t('coreValues.title')}
          </h2>
          <p className="mb-8 text-center text-lg text-neutral-600">{t('coreValues.subtitle')}</p>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="duration-normal rounded-xl border border-neutral-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
              <Target className="duration-normal mb-4 h-12 w-12 text-accent-500 transition-transform hover:scale-110" />
              <h3 className="mb-3 text-xl font-bold text-neutral-900">
                {t('coreValues.qualityFirst.title')}
              </h3>
              <p className="leading-relaxed text-neutral-600">
                {t('coreValues.qualityFirst.description')}
              </p>
            </div>

            <div className="duration-normal rounded-xl border border-neutral-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
              <Users className="duration-normal mb-4 h-12 w-12 text-accent-500 transition-transform hover:scale-110" />
              <h3 className="mb-3 text-xl font-bold text-neutral-900">
                {t('coreValues.customerFocus.title')}
              </h3>
              <p className="leading-relaxed text-neutral-600">
                {t('coreValues.customerFocus.description')}
              </p>
            </div>

            <div className="duration-normal rounded-xl border border-neutral-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg md:col-span-2">
              <Award className="duration-normal mb-4 h-12 w-12 text-accent-500 transition-transform hover:scale-110" />
              <h3 className="mb-3 text-xl font-bold text-neutral-900">
                {t('coreValues.innovation.title')}
              </h3>
              <p className="leading-relaxed text-neutral-600">
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
        <PageContainer size="narrow">
          <h2 className="mb-8 text-center text-3xl font-bold text-neutral-900">
            {t('location.title')}
          </h2>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Location */}
            <div className="duration-normal rounded-xl border border-neutral-200 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
              <MapPin className="duration-normal mb-4 h-10 w-10 text-primary-500 transition-transform hover:scale-110" />
              <h3 className="mb-4 text-xl font-bold text-neutral-900">
                {t('location.locationCard.title')}
              </h3>
              <div className="space-y-2 leading-relaxed text-neutral-600">
                <p className="font-semibold">{t('location.locationCard.companyName')}</p>
                <p>{t('location.locationCard.street')}</p>
                <p>{t('location.locationCard.city')}</p>
                <p>{t('location.locationCard.country')}</p>
              </div>
            </div>

            {/* Contact */}
            <div className="duration-normal rounded-xl border border-neutral-200 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
              <Phone className="duration-normal mb-4 h-10 w-10 text-primary-500 transition-transform hover:scale-110" />
              <h3 className="mb-4 text-xl font-bold text-neutral-900">
                {t('location.contactCard.title')}
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="mb-1 text-sm text-neutral-600">
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
                  <p className="mb-1 text-sm text-neutral-600">
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
                  <p className="mb-1 text-sm text-neutral-600">
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
              <p className="mt-1 text-sm text-neutral-600">{t('quickLinks.whyBapi.description')}</p>
            </Link>
            <Link
              href="/company/news"
              className="duration-normal rounded-xl border border-neutral-200 bg-white p-4 text-center transition-all hover:border-primary-500 hover:shadow-md"
            >
              <h4 className="font-bold text-neutral-900">{t('quickLinks.news.title')}</h4>
              <p className="mt-1 text-sm text-neutral-600">{t('quickLinks.news.description')}</p>
            </Link>
            <Link
              href="/company/careers"
              className="duration-normal rounded-xl border border-neutral-200 bg-white p-4 text-center transition-all hover:border-primary-500 hover:shadow-md"
            >
              <h4 className="font-bold text-neutral-900">{t('quickLinks.careers.title')}</h4>
              <p className="mt-1 text-sm text-neutral-600">{t('quickLinks.careers.description')}</p>
            </Link>
          </div>
        </PageContainer>
      </section>
    </main>
  );
}
