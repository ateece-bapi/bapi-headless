import Link from 'next/link';
import { Search, CheckCircle, ArrowRight } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { generatePageMetadata } from '@/lib/metadata';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'selectorPage' });

  return generatePageMetadata(
    {
      title: t('metadata.title'),
      description: t('metadata.description'),
      path: 'resources/selector',
    },
    locale
  );
}

export default async function ProductSelectorPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'selectorPage' });
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-700 via-primary-500 to-primary-700 py-16 text-white">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Search className="mx-auto mb-4 h-16 w-16" />
            <h1 className="mb-4 text-4xl font-bold sm:text-5xl">{t('hero.title')}</h1>
            <p className="mx-auto max-w-content text-xl text-primary-50">{t('hero.subtitle')}</p>
          </div>
        </div>
      </section>

      {/* Selector Tool */}
      <section className="py-16">
        <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
          <div className="rounded-xl border-2 border-neutral-200 bg-white p-8">
            <div className="mb-8">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-neutral-900">{t('steps.step1')}</h2>
                <div className="flex gap-2">
                  <div className="h-2 w-16 rounded bg-primary-500"></div>
                  <div className="h-2 w-16 rounded bg-neutral-200"></div>
                  <div className="h-2 w-16 rounded bg-neutral-200"></div>
                  <div className="h-2 w-16 rounded bg-neutral-200"></div>
                </div>
              </div>
              <p className="text-neutral-600">{t('steps.question')}</p>
            </div>

            <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
              <button className="rounded-xl border-2 border-neutral-300 p-6 text-left transition-all hover:border-primary-500 hover:bg-primary-50">
                <CheckCircle className="mb-3 h-8 w-8 text-primary-500" />
                <h3 className="mb-2 font-bold text-neutral-900">{t('options.temperature')}</h3>
                <p className="text-sm text-neutral-600">{t('options.temperatureDesc')}</p>
              </button>

              <button className="rounded-xl border-2 border-neutral-300 p-6 text-left transition-all hover:border-primary-500 hover:bg-primary-50">
                <CheckCircle className="mb-3 h-8 w-8 text-primary-500" />
                <h3 className="mb-2 font-bold text-neutral-900">{t('options.tempHumidity')}</h3>
                <p className="text-sm text-neutral-600">{t('options.tempHumidityDesc')}</p>
              </button>

              <button className="rounded-xl border-2 border-neutral-300 p-6 text-left transition-all hover:border-primary-500 hover:bg-primary-50">
                <CheckCircle className="mb-3 h-8 w-8 text-primary-500" />
                <h3 className="mb-2 font-bold text-neutral-900">{t('options.airQuality')}</h3>
                <p className="text-sm text-neutral-600">{t('options.airQualityDesc')}</p>
              </button>

              <button className="rounded-xl border-2 border-neutral-300 p-6 text-left transition-all hover:border-primary-500 hover:bg-primary-50">
                <CheckCircle className="mb-3 h-8 w-8 text-primary-500" />
                <h3 className="mb-2 font-bold text-neutral-900">{t('options.pressure')}</h3>
                <p className="text-sm text-neutral-600">{t('options.pressureDesc')}</p>
              </button>
            </div>

            <div className="flex justify-between">
              <button className="rounded-xl border-2 border-neutral-300 px-6 py-3 font-semibold transition-colors hover:border-primary-500">
                {t('buttons.back')}
              </button>
              <button className="flex items-center gap-2 rounded-xl bg-accent-500 px-6 py-3 font-bold text-neutral-900 transition-colors hover:bg-accent-600">
                {t('buttons.continue')}
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="bg-neutral-50 py-12">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <h2 className="mb-6 text-center text-2xl font-bold text-neutral-900">
            {t('browse.heading')}
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <Link
              href="/products?category=temperature"
              className="rounded-xl border border-neutral-200 bg-white p-4 text-center transition-all hover:border-primary-500"
            >
              <h3 className="font-bold text-neutral-900">{t('browse.temperature')}</h3>
            </Link>
            <Link
              href="/products?category=humidity"
              className="rounded-xl border border-neutral-200 bg-white p-4 text-center transition-all hover:border-primary-500"
            >
              <h3 className="font-bold text-neutral-900">{t('browse.humidity')}</h3>
            </Link>
            <Link
              href="/products?category=wireless"
              className="rounded-xl border border-neutral-200 bg-white p-4 text-center transition-all hover:border-primary-500"
            >
              <h3 className="font-bold text-neutral-900">{t('browse.wireless')}</h3>
            </Link>
            <Link
              href="/products?category=air-quality"
              className="rounded-xl border border-neutral-200 bg-white p-4 text-center transition-all hover:border-primary-500"
            >
              <h3 className="font-bold text-neutral-900">{t('browse.airQuality')}</h3>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
