import { Metadata } from 'next';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Phone, Mail, Clock, MapPin, MessageSquare } from 'lucide-react';
import { generatePageMetadata } from '@/lib/metadata';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contactSupportPage' });

  return generatePageMetadata(
    {
      title: t('metadata.title'),
      description: t('metadata.description'),
      path: 'support/contact',
    },
    locale
  );
}

export default async function ContactSupportPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contactSupportPage' });

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-700 via-primary-500 to-primary-700 py-16 text-white">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <MessageSquare className="mx-auto mb-4 h-16 w-16" />
            <h1 className="mb-4 text-4xl font-bold sm:text-5xl">{t('hero.title')}</h1>
            <p className="mx-auto max-w-content text-xl text-primary-50">{t('hero.subtitle')}</p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16">
        <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Phone Support */}
            <div className="rounded-xl border-2 border-neutral-200 bg-white p-8 transition-all hover:border-primary-500 hover:shadow-lg">
              <Phone className="mb-4 h-12 w-12 text-primary-500" />
              <h2 className="mb-3 text-2xl font-bold text-neutral-900">{t('phone.title')}</h2>
              <p className="mb-4 text-neutral-600">{t('phone.description')}</p>
              <div className="mb-4 flex items-center gap-2 text-neutral-600">
                <Clock className="h-5 w-5" />
                <span>{t('phone.hours')}</span>
              </div>
              <a
                href="tel:+17158561203"
                className="text-2xl font-bold text-primary-500 hover:text-primary-600"
              >
                (715) 856-1203
              </a>
            </div>

            {/* Email Support */}
            <div className="rounded-xl border-2 border-neutral-200 bg-white p-8 transition-all hover:border-primary-500 hover:shadow-lg">
              <Mail className="mb-4 h-12 w-12 text-primary-500" />
              <h2 className="mb-3 text-2xl font-bold text-neutral-900">{t('email.title')}</h2>
              <p className="mb-4 text-neutral-600">{t('email.description')}</p>
              <a
                href="mailto:sales@bapihvac.com"
                className="text-xl font-bold text-primary-500 hover:text-primary-600"
              >
                sales@bapihvac.com
              </a>
            </div>
          </div>

          {/* Location */}
          <div className="mt-8 rounded-xl border-2 border-neutral-200 bg-neutral-50 p-8">
            <MapPin className="mb-4 h-12 w-12 text-primary-500" />
            <h2 className="mb-3 text-2xl font-bold text-neutral-900">{t('location.title')}</h2>
            <address className="not-italic text-neutral-600">
              <p className="font-semibold">Building Automation Products, Inc.</p>
              <p>750 North Royal Avenue</p>
              <p>Gays Mills, WI 54631</p>
              <p className="mt-2">United States</p>
            </address>
          </div>
        </div>
      </section>

      {/* Additional Resources */}
      <section className="bg-neutral-50 py-12">
        <div className="mx-auto max-w-content px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-2xl font-bold text-neutral-900">{t('resources.heading')}</h2>
          <p className="mb-6 text-neutral-600">{t('resources.description')}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href={`/${locale}/support`}
              className="inline-block rounded-xl bg-primary-500 px-6 py-3 font-bold text-white transition-colors hover:bg-primary-600"
            >
              {t('resources.supportCenter')}
            </Link>
            <Link
              href={`/${locale}/support/returns`}
              className="inline-block rounded-xl border-2 border-primary-500 bg-white px-6 py-3 font-bold text-primary-500 transition-colors hover:bg-primary-50"
            >
              {t('resources.rmaRequest')}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
