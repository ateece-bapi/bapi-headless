import { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { ApplicationNoteList } from '@/components/application-notes/ApplicationNoteList';
import { 
  GetApplicationNotesQuery, 
  GetApplicationNotesDocument,
  GetApplicationNoteCategoriesQuery,
  GetApplicationNoteCategoriesDocument,
} from '@/lib/graphql/generated';
import { getGraphQLClient } from '@/lib/graphql/client';
import { BookOpenIcon, LightbulbIcon } from '@/lib/icons';
import logger from '@/lib/logger';
import type { ApplicationNote, ApplicationNoteCategory, CategoryWithNotes } from '@/types/applicationNote';
import PageHeader from '@/components/layout/PageHeader';
import PageContainer from '@/components/layout/PageContainer';

async function fetchApplicationNotes(): Promise<ApplicationNote[]> {
  try {
    const client = getGraphQLClient(['application-notes']);
    const data = await client.request<GetApplicationNotesQuery>(GetApplicationNotesDocument, {
      first: 100,
    });

    // Filter and map GraphQL response to ensure required fields are present
    const nodes = data.applicationNotes?.nodes || [];
    return nodes
      .filter(note => Boolean(note?.id && note?.title && note?.slug && note?.date))
      .map(note => note as ApplicationNote);
  } catch (error) {
    logger.error('Error fetching application notes', error);
    return [];
  }
}

async function fetchApplicationNoteCategories(): Promise<ApplicationNoteCategory[]> {
  try {
    const client = getGraphQLClient(['application-notes']);
    const data = await client.request<GetApplicationNoteCategoriesQuery>(
      GetApplicationNoteCategoriesDocument
    );

    // Filter categories with missing required fields
    const nodes = data.applicationNoteCategories?.nodes || [];
    return nodes
      .filter(cat => Boolean(cat?.id && cat?.name && cat?.slug))
      .map(cat => cat as ApplicationNoteCategory);
  } catch (error) {
    logger.error('Error fetching application note categories', error);
    return [];
  }
}

function groupNotesByCategory(
  notes: ApplicationNote[],
  categories: ApplicationNoteCategory[]
): CategoryWithNotes[] {
  return categories
    .map(category => ({
      id: category.id,
      name: category.name ?? '',
      slug: category.slug ?? category.id,
      description: category.description,
      count: category.count ?? 0,
      notes: notes.filter(note =>
        note.applicationNoteCategories?.nodes?.some(cat => cat.id === category.id) ?? false
      ),
    }))
    .filter(category => category.notes.length > 0)
    .sort((a, b) => a.name.localeCompare(b.name));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'applicationNotesPage.metadata' });
  
  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      type: 'website',
    },
  };
}

export default async function ApplicationNotesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'applicationNotesPage' });
  const [applicationNotes, categories] = await Promise.all([
    fetchApplicationNotes(),
    fetchApplicationNoteCategories(),
  ]);

  const categorizedNotes = groupNotesByCategory(applicationNotes, categories);

  return (
    <div className="min-h-screen bg-neutral-50">
      <PageHeader
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Resources', href: '/resources' },
          { label: t('hero.title') },
        ]}
        title={t('hero.title')}
        description={t('hero.subtitle')}
        eyebrow={
          <div className="flex items-center gap-3">
            <BookOpenIcon className="h-6 w-6" />
            <span className="text-sm font-semibold uppercase">
              {t('hero.badge')}
            </span>
          </div>
        }
      >
        <div className="mt-8 grid max-w-2xl grid-cols-2 gap-4 sm:grid-cols-3">
            <div className="border border-white/20 bg-white/10 p-4">
              <div className="mb-1 text-2xl font-bold">{applicationNotes.length}</div>
              <div className="text-sm text-primary-100">{t('hero.stats.articlesLabel')}</div>
            </div>
            <div className="border border-white/20 bg-white/10 p-4">
              <div className="mb-1 text-2xl font-bold">15+</div>
              <div className="text-sm text-primary-100">{t('hero.stats.expertiseLabel')}</div>
            </div>
            <div className="col-span-2 border border-white/20 bg-white/10 p-4 sm:col-span-1">
              <div className="mb-1 text-2xl font-bold">100%</div>
              <div className="text-sm text-primary-100">{t('hero.stats.accessLabel')}</div>
            </div>
        </div>
      </PageHeader>

      {/* Value Proposition */}
      <div className="border-b border-neutral-200 bg-white">
        <PageContainer size="site" className="py-10">
          <div className="flex max-w-4xl items-start gap-4">
            <div className="flex-shrink-0 rounded-lg bg-primary-50 p-3">
              <LightbulbIcon className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h2 className="mb-2 text-xl font-semibold text-neutral-900">
                {t('valueProposition.heading')}
              </h2>
              <p className="text-neutral-700">
                {t('valueProposition.description')}
              </p>
            </div>
          </div>
        </PageContainer>
      </div>

      {/* Application Notes List */}
      <PageContainer size="site" className="py-12">
        {applicationNotes.length === 0 ? (
          <div className="rounded-lg border border-neutral-200 bg-white py-20 text-center">
            <BookOpenIcon className="mx-auto mb-4 h-16 w-16 text-neutral-300" />
            <h3 className="mb-2 text-xl font-semibold text-neutral-900">
              No application notes available
            </h3>
            <p className="text-neutral-700">Check back soon for technical articles and guides.</p>
          </div>
        ) : (
          <ApplicationNoteList 
            applicationNotes={applicationNotes} 
            categories={categorizedNotes}
            showCategoryAccordion={true}
          />
        )}
      </PageContainer>
    </div>
  );
}
