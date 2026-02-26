import { Metadata } from 'next';
import Link from 'next/link';
import { Wrench, FileText, Download, Search } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { generatePageMetadata } from '@/lib/metadata';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'installationPage' });

  return generatePageMetadata(
    {
      title: t('metadata.title'),
      description: t('metadata.description'),
      path: 'resources/installation',
      keywords: t('metadata.keywords').split(', '),
    },
    locale
  );
}

export default async function InstallationPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'installationPage' });
  const guides = [
    {
      title: 'Temperature Sensor Installation',
      description: 'Complete installation guide for wall-mount and duct-mount temperature sensors',
      file: 'temp-sensor-install.pdf',
    },
    {
      title: 'Wireless Sensor Setup',
      description: 'Wireless sensor configuration and network setup instructions',
      file: 'wireless-setup.pdf',
    },
    {
      title: 'Air Quality Sensor Installation',
      description: 'CO₂, VOC, and particulate sensor installation procedures',
      file: 'air-quality-install.pdf',
    },
    {
      title: 'Pressure Sensor Mounting',
      description:
        'Installation guidelines for pressure transducers and differential pressure sensors',
      file: 'pressure-sensor-install.pdf',
    },
  ];

  return (
    <main className="min-h-screen bg-white">
      <section className="bg-gradient-to-r from-primary-700 via-primary-500 to-primary-700 py-16 text-white">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Wrench className="mx-auto mb-4 h-16 w-16" />
            <h1 className="mb-4 text-4xl font-bold sm:text-5xl">{t('hero.title')}</h1>
            <p className="mx-auto max-w-content text-xl text-primary-50">{t('hero.subtitle')}</p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="mx-auto max-w-md">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  placeholder={t('search.placeholder')}
                  className="w-full rounded-xl border-2 border-neutral-200 py-3 pl-12 pr-4 focus:border-primary-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {guides.map((guide) => (
              <div
                key={guide.file}
                className="rounded-xl border-2 border-neutral-200 bg-white p-6 transition-all hover:border-primary-500"
              >
                <FileText className="mb-4 h-10 w-10 text-primary-500" />
                <h3 className="mb-2 text-xl font-bold text-neutral-900">{guide.title}</h3>
                <p className="mb-4 text-neutral-600">{guide.description}</p>
                <button className="inline-flex items-center gap-2 font-semibold text-primary-500 hover:text-primary-600">
                  <Download className="h-4 w-4" />
                  {t('downloadButton')}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-neutral-50 py-12">
        <div className="mx-auto max-w-content px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-2xl font-bold text-neutral-900">{t('support.heading')}</h2>
          <p className="mb-6 text-neutral-600">{t('support.description')}</p>
          <Link
            href="/support"
            className="inline-block rounded-xl bg-primary-500 px-8 py-3 font-bold text-white transition-colors hover:bg-primary-600"
          >
            {t('support.ctaButton')}
          </Link>
        </div>
      </section>
    </main>
  );
}
