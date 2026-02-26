import { Metadata } from 'next';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Shield, CheckCircle, FileText, ArrowRight } from 'lucide-react';
import { generatePageMetadata } from '@/lib/metadata';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'warrantyPage' });

  return generatePageMetadata(
    {
      title: t('metadata.title'),
      description: t('metadata.description'),
      path: 'support/warranty',
    },
    locale
  );
}

export default async function WarrantyPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'warrantyPage' });

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-700 via-primary-500 to-primary-700 py-16 text-white">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Shield className="mx-auto mb-4 h-16 w-16" />
            <h1 className="mb-4 text-4xl font-bold sm:text-5xl">{t('hero.title')}</h1>
            <p className="mx-auto max-w-content text-xl text-primary-50">{t('hero.subtitle')}</p>
          </div>
        </div>
      </section>

      {/* Warranty Details */}
      <section className="py-16">
        <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
          <div className="mb-12 rounded-xl border-2 border-primary-200 bg-primary-50 p-8">
            <h2 className="mb-4 text-2xl font-bold text-neutral-900">{t('coverage.title')}</h2>
            <p className="mb-6 text-lg text-neutral-700">{t('coverage.description')}</p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-6 w-6 flex-shrink-0 text-primary-500" />
                <span className="font-semibold text-neutral-900">{t('coverage.years')}</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-6 w-6 flex-shrink-0 text-primary-500" />
                <span className="font-semibold text-neutral-900">{t('coverage.defects')}</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-6 w-6 flex-shrink-0 text-primary-500" />
                <span className="font-semibold text-neutral-900">{t('coverage.support')}</span>
              </div>
            </div>
          </div>

          {/* What's Covered */}
          <div className="mb-12">
            <h2 className="mb-6 text-2xl font-bold text-neutral-900">{t('covered.title')}</h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-primary-500" />
                <span className="text-neutral-700">{t('covered.manufacturing')}</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-primary-500" />
                <span className="text-neutral-700">{t('covered.materials')}</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-primary-500" />
                <span className="text-neutral-700">{t('covered.workmanship')}</span>
              </li>
            </ul>
          </div>

          {/* Important Information */}
          <div className="rounded-xl border-2 border-amber-200 bg-amber-50 p-6">
            <h3 className="mb-3 flex items-center text-lg font-bold text-amber-900">
              <FileText className="mr-2 h-5 w-5" />
              {t('important.title')}
            </h3>
            <p className="text-sm text-amber-800">{t('important.description')}</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-neutral-50 py-12">
        <div className="mx-auto max-w-content px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-2xl font-bold text-neutral-900">{t('cta.heading')}</h2>
          <p className="mb-6 text-neutral-600">{t('cta.description')}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href={`/${locale}/support/contact`}
              className="inline-block rounded-xl bg-primary-500 px-6 py-3 font-bold text-white transition-colors hover:bg-primary-600"
            >
              {t('cta.contactButton')}
            </Link>
            <Link
              href={`/${locale}/support/returns`}
              className="group/link inline-flex items-center gap-2 rounded-xl border-2 border-primary-500 bg-white px-6 py-3 font-bold text-primary-500 transition-all hover:gap-3 hover:bg-primary-50"
            >
              <span>{t('cta.rmaButton')}</span>
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover/link:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
