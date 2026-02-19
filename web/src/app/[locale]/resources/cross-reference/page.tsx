import { Metadata } from 'next';
import Link from 'next/link';
import { RefreshCw, Search } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { generatePageMetadata } from '@/lib/metadata';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'crossReferencePage' });

  return generatePageMetadata(
    {
      title: t('metadata.title'),
      description: t('metadata.description'),
      path: 'resources/cross-reference',
      keywords: t('metadata.keywords').split(', '),
    },
    locale,
  );
}

export default async function CrossReferencePage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'crossReferencePage' });
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-700 via-primary-500 to-primary-700 py-16 text-white">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <RefreshCw className="mx-auto mb-4 h-16 w-16" />
            <h1 className="mb-4 text-4xl font-bold sm:text-5xl">{t('hero.title')}</h1>
            <p className="mx-auto max-w-content text-xl text-primary-50">{t('hero.subtitle')}</p>
          </div>
        </div>
      </section>

      {/* Search Tool */}
      <section className="py-16">
        <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
          <div className="rounded-xl border-2 border-neutral-200 bg-white p-8">
            <h2 className="mb-6 text-2xl font-bold text-neutral-900">{t('searchTool.heading')}</h2>

            <div className="space-y-6">
              <div>
                <label
                  htmlFor="manufacturer"
                  className="mb-2 block text-sm font-semibold text-neutral-700"
                >
                  {t('searchTool.manufacturerLabel')}
                </label>
                <select
                  id="manufacturer"
                  className="w-full rounded-lg border border-neutral-300 px-4 py-3 focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">{t('searchTool.manufacturerPlaceholder')}</option>
                  <option value="honeywell">{t('searchTool.manufacturers.honeywell')}</option>
                  <option value="johnson">{t('searchTool.manufacturers.johnson')}</option>
                  <option value="siemens">{t('searchTool.manufacturers.siemens')}</option>
                  <option value="schneider">{t('searchTool.manufacturers.schneider')}</option>
                  <option value="belimo">{t('searchTool.manufacturers.belimo')}</option>
                  <option value="other">{t('searchTool.manufacturers.other')}</option>
                </select>
              </div>

              <div>
                <label htmlFor="model" className="mb-2 block text-sm font-semibold text-neutral-700">
                  {t('searchTool.modelLabel')}
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    id="model"
                    placeholder={t('searchTool.modelPlaceholder')}
                    className="w-full rounded-lg border border-neutral-300 py-3 pl-10 pr-4 focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent-500 px-6 py-3 font-bold text-neutral-900 transition-colors hover:bg-accent-600">
                <Search className="h-5 w-5" />
                {t('searchTool.searchButton')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Cross References */}
      <section className="bg-neutral-50 py-16">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-2xl font-bold text-neutral-900">{t('popularSection.heading')}</h2>

          <div className="space-y-4">
            <div className="rounded-xl border-2 border-neutral-200 bg-white p-6">
              <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-3">
                <div>
                  <div className="mb-1 text-xs text-neutral-500">{t('popularSection.competitorLabel')}</div>
                  <div className="font-bold text-neutral-900">Honeywell C7400A2100</div>
                  <div className="text-sm text-neutral-600">Room Temperature Sensor</div>
                </div>
                <div className="flex justify-center">
                  <RefreshCw className="h-6 w-6 text-primary-500" />
                </div>
                <div>
                  <div className="mb-1 text-xs text-neutral-500">{t('popularSection.bapiLabel')}</div>
                  <div className="font-bold text-primary-500">BA/10K-2-R</div>
                  <div className="text-sm text-neutral-600">10K Type 2 Room Sensor</div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border-2 border-neutral-200 bg-white p-6">
              <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-3">
                <div>
                  <div className="mb-1 text-xs text-neutral-500">{t('popularSection.competitorLabel')}</div>
                  <div className="font-bold text-neutral-900">Johnson Controls TE-6000</div>
                  <div className="text-sm text-neutral-600">Temperature & Humidity Sensor</div>
                </div>
                <div className="flex justify-center">
                  <RefreshCw className="h-6 w-6 text-primary-500" />
                </div>
                <div>
                  <div className="mb-1 text-xs text-neutral-500">{t('popularSection.bapiLabel')}</div>
                  <div className="font-bold text-primary-500">BA/RH-AS-R2</div>
                  <div className="text-sm text-neutral-600">RH & Temp Room Sensor</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Need Help Section */}
      <section className="py-12">
        <div className="mx-auto max-w-content px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-3 text-2xl font-bold text-neutral-900">{t('helpSection.heading')}</h2>
          <p className="mb-6 text-neutral-600">{t('helpSection.description')}</p>
          <Link
            href="/contact"
            className="inline-block rounded-xl bg-accent-500 px-8 py-3 font-bold text-neutral-900 transition-colors hover:bg-accent-600"
          >
            {t('helpSection.ctaButton')}
          </Link>
        </div>
      </section>
    </main>
  );
}