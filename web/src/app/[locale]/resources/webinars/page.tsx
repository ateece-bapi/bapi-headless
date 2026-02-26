import { Monitor, Calendar, AlertCircle, Users } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { generatePageMetadata } from '@/lib/metadata';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'webinarsPage' });

  return generatePageMetadata(
    {
      title: t('metadata.title'),
      description: t('metadata.description'),
      path: 'resources/webinars',
    },
    locale
  );
}

export default async function WebinarsPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'webinarsPage' });
  return (
    <main className="min-h-screen bg-white">
      <section className="bg-gradient-to-r from-primary-700 via-primary-500 to-primary-700 py-16 text-white">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Monitor className="mx-auto mb-4 h-16 w-16" />
            <h1 className="mb-4 text-4xl font-bold sm:text-5xl">{t('hero.title')}</h1>
            <p className="mx-auto max-w-content text-xl text-primary-50">{t('hero.subtitle')}</p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-lg bg-accent-500 px-4 py-2 font-semibold text-neutral-900">
              <Calendar className="h-5 w-5" />
              {t('comingSoon.badge')}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
          <div className="mb-12 rounded-xl border-2 border-primary-200 bg-primary-50 p-8">
            <div className="flex items-start gap-4">
              <AlertCircle className="mt-1 h-6 w-6 flex-shrink-0 text-primary-500" />
              <div>
                <h2 className="mb-2 text-xl font-bold text-neutral-900">
                  {t('comingSoon.heading')}
                </h2>
                <p className="mb-4 text-neutral-700">{t('comingSoon.description')}</p>
                <p className="text-neutral-600">{t('comingSoon.note')}</p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <h2 className="mb-8 text-2xl font-bold text-neutral-900">{t('topics.heading')}</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="rounded-xl bg-neutral-50 p-6">
                <Monitor className="mx-auto mb-3 h-10 w-10 text-primary-500" />
                <h3 className="mb-2 font-bold text-neutral-900">{t('topics.training')}</h3>
                <p className="text-sm text-neutral-600">{t('topics.trainingDesc')}</p>
              </div>
              <div className="rounded-xl bg-neutral-50 p-6">
                <Users className="mx-auto mb-3 h-10 w-10 text-primary-500" />
                <h3 className="mb-2 font-bold text-neutral-900">{t('topics.bestPractices')}</h3>
                <p className="text-sm text-neutral-600">{t('topics.bestPracticesDesc')}</p>
              </div>
              <div className="rounded-xl bg-neutral-50 p-6">
                <Calendar className="mx-auto mb-3 h-10 w-10 text-primary-500" />
                <h3 className="mb-2 font-bold text-neutral-900">{t('topics.liveQA')}</h3>
                <p className="text-sm text-neutral-600">{t('topics.liveQADesc')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-neutral-50 py-12">
        <div className="mx-auto max-w-content px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-2xl font-bold text-neutral-900">{t('stayUpdated.heading')}</h2>
          <p className="mb-6 text-neutral-600">{t('stayUpdated.description')}</p>
          <a
            href="mailto:sales@bapihvac.com"
            className="inline-block rounded-xl bg-primary-500 px-8 py-3 font-bold text-white transition-colors hover:bg-primary-600"
          >
            {t('stayUpdated.button')}
          </a>
        </div>
      </section>
    </main>
  );
}
