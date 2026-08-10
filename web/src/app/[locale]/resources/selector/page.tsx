import { Link } from '@/lib/navigation';
import { CheckCircleIcon, ArrowRightIcon } from '@/lib/icons';
import { getTranslations } from 'next-intl/server';
import { generatePageMetadata } from '@/lib/metadata';
import PageContainer from '@/components/layout/PageContainer';
import PageHeader from '@/components/layout/PageHeader';

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
    <div className="min-h-screen bg-white">
      <PageHeader
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Resources', href: '/resources' },
          { label: t('hero.title') },
        ]}
        title={t('hero.title')}
        description={t('hero.subtitle')}
      />

      {/* Selector Tool */}
      <section className="py-16">
        <PageContainer size="content">
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
              <p className="text-neutral-700">{t('steps.question')}</p>
            </div>

            <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
              <button className="rounded-xl border-2 border-neutral-300 p-6 text-left transition-all hover:border-primary-500 hover:bg-primary-50">
                <CheckCircleIcon className="mb-3 h-8 w-8 text-primary-500" />
                <h3 className="mb-2 font-bold text-neutral-900">{t('options.temperature')}</h3>
                <p className="text-sm text-neutral-700">{t('options.temperatureDesc')}</p>
              </button>

              <button className="rounded-xl border-2 border-neutral-300 p-6 text-left transition-all hover:border-primary-500 hover:bg-primary-50">
                <CheckCircleIcon className="mb-3 h-8 w-8 text-primary-500" />
                <h3 className="mb-2 font-bold text-neutral-900">{t('options.tempHumidity')}</h3>
                <p className="text-sm text-neutral-700">{t('options.tempHumidityDesc')}</p>
              </button>

              <button className="rounded-xl border-2 border-neutral-300 p-6 text-left transition-all hover:border-primary-500 hover:bg-primary-50">
                <CheckCircleIcon className="mb-3 h-8 w-8 text-primary-500" />
                <h3 className="mb-2 font-bold text-neutral-900">{t('options.airQuality')}</h3>
                <p className="text-sm text-neutral-700">{t('options.airQualityDesc')}</p>
              </button>

              <button className="rounded-xl border-2 border-neutral-300 p-6 text-left transition-all hover:border-primary-500 hover:bg-primary-50">
                <CheckCircleIcon className="mb-3 h-8 w-8 text-primary-500" />
                <h3 className="mb-2 font-bold text-neutral-900">{t('options.pressure')}</h3>
                <p className="text-sm text-neutral-700">{t('options.pressureDesc')}</p>
              </button>
            </div>

            <div className="flex justify-between">
              <button className="rounded-xl border-2 border-neutral-300 px-6 py-3 font-semibold transition-colors hover:border-primary-500">
                {t('buttons.back')}
              </button>
              <button className="flex items-center gap-2 rounded-xl bg-accent-500 px-6 py-3 font-bold text-neutral-900 transition-colors hover:bg-accent-600">
                {t('buttons.continue')}
                <ArrowRightIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* Quick Links */}
      <section className="bg-neutral-50 py-12">
        <PageContainer size="site">
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
        </PageContainer>
      </section>
    </div>
  );
}
