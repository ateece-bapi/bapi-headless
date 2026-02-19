import { Metadata } from 'next';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import {
  LifeBuoy,
  FileText,
  Wrench,
  MessageSquare,
  BookOpen,
  AlertCircle,
  Package,
  Mail,
  Phone,
} from 'lucide-react';
import PageContainer from '@/components/layout/PageContainer';
import { generatePageMetadata } from '@/lib/metadata';

/**
 * AI-optimized metadata for support center
 * Enhanced for technical resource discovery
 */
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'supportPage' });

  return generatePageMetadata({
    title: t('hero.title'),
    description: t('metadata.description'),
    path: 'support',
    keywords: t('metadata.keywords').split(',').map((k: string) => k.trim()),
    type: 'website',
  }, locale);
}

export default async function SupportPage() {
  const t = await getTranslations('supportPage');
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-700 via-primary-500 to-primary-700 py-16 text-white">
        <PageContainer size="content">
          <div className="text-center">
            <LifeBuoy className="duration-normal mx-auto mb-4 h-16 w-16 transition-transform hover:rotate-12 hover:scale-110" />
            <h1 className="mb-4 text-4xl font-bold sm:text-5xl">{t('hero.title')}</h1>
            <p className="mx-auto max-w-3xl text-xl text-primary-50">
              {t('hero.subtitle')}
            </p>
          </div>
        </PageContainer>
      </section>

      {/* Quick Actions */}
      <section className="bg-neutral-50 py-12">
        <PageContainer size="content">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/contact"
              className="duration-normal group rounded-xl border-2 border-neutral-200 bg-white p-6 transition-all hover:-translate-y-1 hover:border-primary-500 hover:shadow-lg"
            >
              <MessageSquare className="duration-normal mb-3 h-10 w-10 text-primary-500 transition-transform group-hover:scale-110" />
              <h3 className="mb-2 text-xl font-bold text-neutral-900">{t('quickActions.contactSupport.title')}</h3>
              <p className="leading-relaxed text-neutral-600">
                {t('quickActions.contactSupport.description')}
              </p>
            </Link>

            <Link
              href="/application-notes"
              className="duration-normal group rounded-xl border-2 border-neutral-200 bg-white p-6 transition-all hover:-translate-y-1 hover:border-primary-500 hover:shadow-lg"
            >
              <FileText className="duration-normal mb-3 h-10 w-10 text-primary-500 transition-transform group-hover:scale-110" />
              <h3 className="mb-2 text-xl font-bold text-neutral-900">{t('quickActions.applicationNotes.title')}</h3>
              <p className="leading-relaxed text-neutral-600">
                {t('quickActions.applicationNotes.description')}
              </p>
            </Link>

            <Link
              href="/rma-request"
              className="duration-normal group rounded-xl border-2 border-neutral-200 bg-white p-6 transition-all hover:-translate-y-1 hover:border-primary-500 hover:shadow-lg"
            >
              <Package className="duration-normal mb-3 h-10 w-10 text-primary-500 transition-transform group-hover:scale-110" />
              <h3 className="mb-2 text-xl font-bold text-neutral-900">{t('quickActions.rmaRequest.title')}</h3>
              <p className="leading-relaxed text-neutral-600">{t('quickActions.rmaRequest.description')}</p>
            </Link>
          </div>
        </PageContainer>
      </section>

      {/* Support Resources */}
      <section className="py-16">
        <PageContainer size="content">
          <h2 className="mb-8 text-center text-3xl font-bold text-neutral-900">
            {t('resources.title')}
          </h2>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Technical Documentation */}
            <div className="duration-normal rounded-xl bg-neutral-50 p-6 transition-all hover:-translate-y-1 hover:shadow-lg">
              <BookOpen className="duration-normal mb-4 h-10 w-10 text-accent-500 transition-transform hover:scale-110" />
              <h3 className="mb-3 text-xl font-bold text-neutral-900">{t('resources.technicalDocs.title')}</h3>
              <ul className="space-y-2 text-neutral-600">
                <li>
                  <Link
                    href="/application-notes"
                    className="duration-normal text-primary-500 transition-colors hover:text-primary-600"
                  >
                    {t('resources.technicalDocs.links.applicationNotes')}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/installations"
                    className="duration-normal text-primary-500 transition-colors hover:text-primary-600"
                  >
                    {t('resources.technicalDocs.links.installationGuides')}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/resources/datasheets"
                    className="duration-normal text-primary-500 transition-colors hover:text-primary-600"
                  >
                    {t('resources.technicalDocs.links.productDatasheets')}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/sensor-specs"
                    className="duration-normal text-primary-500 transition-colors hover:text-primary-600"
                  >
                    {t('resources.technicalDocs.links.sensorSpecs')}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Tools & Utilities */}
            <div className="duration-normal rounded-xl bg-neutral-50 p-6 transition-all hover:-translate-y-1 hover:shadow-lg">
              <Wrench className="duration-normal mb-4 h-10 w-10 text-accent-500 transition-transform hover:scale-110" />
              <h3 className="mb-3 text-xl font-bold text-neutral-900">{t('resources.toolsUtilities.title')}</h3>
              <ul className="space-y-2 text-neutral-600">
                <li>
                  <Link
                    href="/resources/selector"
                    className="duration-normal text-primary-500 transition-colors hover:text-primary-600"
                  >
                    {t('resources.toolsUtilities.links.productSelector')}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/resources/cross-reference"
                    className="duration-normal text-primary-500 transition-colors hover:text-primary-600"
                  >
                    {t('resources.toolsUtilities.links.crossReference')}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/wireless-site-verification"
                    className="duration-normal text-primary-500 transition-colors hover:text-primary-600"
                  >
                    {t('resources.toolsUtilities.links.wirelessVerification')}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/catalogpricebook"
                    className="duration-normal text-primary-500 transition-colors hover:text-primary-600"
                  >
                    {t('resources.toolsUtilities.links.catalogPriceBook')}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Service & Returns */}
            <div className="duration-normal rounded-xl bg-neutral-50 p-6 transition-all hover:-translate-y-1 hover:shadow-lg">
              <AlertCircle className="duration-normal mb-4 h-10 w-10 text-accent-500 transition-transform hover:scale-110" />
              <h3 className="mb-3 text-xl font-bold text-neutral-900">{t('resources.serviceReturns.title')}</h3>
              <ul className="space-y-2 text-neutral-600">
                <li>
                  <Link
                    href="/rma-request"
                    className="duration-normal text-primary-500 transition-colors hover:text-primary-600"
                  >
                    {t('resources.serviceReturns.links.rmaRequest')}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/service-bulletin"
                    className="duration-normal text-primary-500 transition-colors hover:text-primary-600"
                  >
                    {t('resources.serviceReturns.links.serviceBulletins')}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="duration-normal text-primary-500 transition-colors hover:text-primary-600"
                  >
                    {t('resources.serviceReturns.links.contactSupport')}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* Contact Section */}
      <section className="bg-neutral-50 py-16">
        <PageContainer size="content">
          <div className="mb-8 text-center">
            <h2 className="mb-4 text-3xl font-bold text-neutral-900">{t('contact.title')}</h2>
            <p className="text-lg text-neutral-600">{t('contact.subtitle')}</p>
          </div>

          <div className="duration-normal rounded-xl bg-white p-8 shadow-lg transition-all hover:shadow-xl">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="group">
                <Phone className="duration-normal mb-3 h-8 w-8 text-primary-500 transition-transform group-hover:scale-110" />
                <h3 className="mb-2 text-xl font-bold text-neutral-900">{t('contact.phone.title')}</h3>
                <p className="mb-2 text-neutral-600">{t('contact.phone.hours')}</p>
                <a
                  href="tel:+17158561203"
                  className="duration-normal text-2xl font-bold text-primary-500 transition-colors hover:text-primary-600"
                >
                  {t('contact.phone.number')}
                </a>
              </div>

              <div className="group">
                <Mail className="duration-normal mb-3 h-8 w-8 text-primary-500 transition-transform group-hover:scale-110" />
                <h3 className="mb-2 text-xl font-bold text-neutral-900">{t('contact.email.title')}</h3>
                <p className="mb-2 text-neutral-600">{t('contact.email.description')}</p>
                <a
                  href="mailto:sales@bapihvac.com"
                  className="duration-normal text-lg font-semibold text-primary-500 transition-colors hover:text-primary-600"
                >
                  {t('contact.email.address')}
                </a>
              </div>
            </div>

            <div className="mt-8 border-t border-neutral-200 pt-8 text-center">
              <Link
                href="/contact"
                className="duration-normal inline-block rounded-xl bg-accent-500 px-8 py-3 font-bold text-neutral-900 transition-all hover:scale-105 hover:bg-accent-600 hover:shadow-lg focus-visible:ring-4 focus-visible:ring-accent-500/50"
              >
                {t('contact.cta')}
              </Link>
            </div>
          </div>
        </PageContainer>
      </section>
    </main>
  );
}
