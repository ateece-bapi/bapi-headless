import { Link } from '@/lib/navigation';
import { VideoIcon, PlayIcon, CalendarIcon, AlertCircleIcon } from '@/lib/icons';
import { getTranslations } from 'next-intl/server';
import { generatePageMetadata } from '@/lib/metadata';
import PageContainer from '@/components/layout/PageContainer';
import PageHeader from '@/components/layout/PageHeader';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'videosPage' });

  return generatePageMetadata(
    {
      title: t('metadata.title'),
      description: t('metadata.description'),
      path: 'resources/videos',
    },
    locale
  );
}

export default async function VideosPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'videosPage' });
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
      >
        <div className="mt-6 inline-flex items-center gap-2 rounded-lg bg-accent-500 px-4 py-2 font-semibold text-neutral-900">
              <CalendarIcon className="h-5 w-5" />
              {t('comingSoon.badge')}
        </div>
      </PageHeader>

      <section className="py-16">
        <PageContainer size="content">
          <div className="mb-12 rounded-xl border-2 border-primary-200 bg-primary-50 p-8">
            <div className="flex items-start gap-4">
              <AlertCircleIcon className="mt-1 h-6 w-6 flex-shrink-0 text-primary-500" />
              <div>
                <h2 className="mb-2 text-xl font-bold text-neutral-900">
                  {t('comingSoon.heading')}
                </h2>
                <p className="mb-4 text-neutral-700">{t('comingSoon.description')}</p>
                <p className="text-neutral-700">{t('comingSoon.note')}</p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <h2 className="mb-8 text-2xl font-bold text-neutral-900">{t('categories.heading')}</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="rounded-xl bg-neutral-50 p-6">
                <PlayIcon className="mx-auto mb-3 h-10 w-10 text-primary-500" />
                <h3 className="mb-2 font-bold text-neutral-900">{t('categories.productDemos')}</h3>
                <p className="text-sm text-neutral-700">{t('categories.productDemosDesc')}</p>
              </div>
              <div className="rounded-xl bg-neutral-50 p-6">
                <VideoIcon className="mx-auto mb-3 h-10 w-10 text-primary-500" />
                <h3 className="mb-2 font-bold text-neutral-900">{t('categories.installation')}</h3>
                <p className="text-sm text-neutral-700">{t('categories.installationDesc')}</p>
              </div>
              <div className="rounded-xl bg-neutral-50 p-6">
                <PlayIcon className="mx-auto mb-3 h-10 w-10 text-primary-500" />
                <h3 className="mb-2 font-bold text-neutral-900">{t('categories.training')}</h3>
                <p className="text-sm text-neutral-700">{t('categories.trainingDesc')}</p>
              </div>
            </div>
          </div>
        </PageContainer>
      </section>

      <section className="bg-neutral-50 py-12">
        <div className="mx-auto max-w-content px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-2xl font-bold text-neutral-900">{t('support.heading')}</h2>
          <p className="mb-6 text-neutral-700">{t('support.description')}</p>
          <Link
            href="/support"
            className="inline-block rounded-xl bg-primary-500 px-8 py-3 font-bold text-white transition-colors hover:bg-primary-600"
          >
            {t('support.button')}
          </Link>
        </div>
      </section>
    </div>
  );
}
