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
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white">
        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute right-0 top-0 h-96 w-96 -translate-y-1/2 translate-x-1/2 transform rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-0 left-0 h-96 w-96 -translate-x-1/2 translate-y-1/2 transform rounded-full bg-accent-400 blur-3xl" />
        </div>
        <div className="container relative mx-auto px-4 py-20 md:py-24">
          <div className="mb-6 flex items-center gap-3">
            <BookOpenIcon className="h-10 w-10" />
            <span className="rounded-full bg-white/20 px-3 py-1 text-sm font-semibold uppercase tracking-wider">
              {t('hero.badge')}
            </span>
          </div>
          <h1 className="mb-6 max-w-4xl text-5xl font-bold leading-tight md:text-6xl lg:text-7xl">
            {t('hero.title')}
          </h1>
          <p className="mb-2 max-w-3xl text-xl leading-relaxed text-primary-100 md:text-2xl">
            {t('hero.subtitle')}
          </p>

          {/* Stats */}
          <div className="mt-12 grid max-w-2xl grid-cols-2 gap-6 md:grid-cols-3">
            <div className="rounded-lg border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
              <div className="mb-1 text-3xl font-bold">{applicationNotes.length}</div>
              <div className="text-sm text-primary-100">{t('hero.stats.articlesLabel')}</div>
            </div>
            <div className="rounded-lg border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
              <div className="mb-1 text-3xl font-bold">15+</div>
              <div className="text-sm text-primary-100">{t('hero.stats.expertiseLabel')}</div>
            </div>
            <div className="col-span-2 rounded-lg border border-white/20 bg-white/10 p-4 backdrop-blur-sm md:col-span-1">
              <div className="mb-1 text-3xl font-bold">100%</div>
              <div className="text-sm text-primary-100">{t('hero.stats.accessLabel')}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Value Proposition */}
      <div className="border-b border-neutral-200 bg-white">
        <div className="container mx-auto px-4 py-12">
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
        </div>
      </div>

      {/* Application Notes List */}
      <div className="container mx-auto px-4 py-12">
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
      </div>
    </div>
  );
}
