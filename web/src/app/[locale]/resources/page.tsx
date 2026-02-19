import { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import { ResourceList } from '@/components/resources/ResourceList';
import logger from '@/lib/logger';
import { generatePageMetadata } from '@/lib/metadata';
import { getTranslations } from 'next-intl/server';

interface MediaItemNode {
  id: string;
  databaseId: number;
  title: string;
  description: string | null;
  mediaItemUrl: string;
  fileSize: number | null;
  date: string;
  sourceUrl: string;
}

interface GetResourcesResponse {
  mediaItems: {
    nodes: MediaItemNode[];
  };
}

async function fetchResources(): Promise<MediaItemNode[]> {
  const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL;

  if (!GRAPHQL_ENDPOINT) {
    logger.warn('NEXT_PUBLIC_WORDPRESS_GRAPHQL not set, returning empty resources');
    return [];
  }

  const query = `
    query GetResources {
      mediaItems(
        first: 1000
        where: { 
          mimeType: APPLICATION_PDF
          orderby: { field: DATE, order: DESC }
        }
      ) {
        nodes {
          id
          databaseId
          title
          description
          mediaItemUrl
          fileSize
          date
          sourceUrl
        }
      }
    }
  `;

  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
    next: { revalidate: 3600 }, // Revalidate every hour
  });

  if (!response.ok) {
    logger.error('GraphQL fetch failed', { statusText: response.statusText });
    return [];
  }

  const data: { data: GetResourcesResponse } = await response.json();
  return data.data.mediaItems.nodes;
}

/**
 * AI-optimized metadata for technical resources
 * Enhanced for technical documentation discovery
 */
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ locale: string }> 
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'resourcesPage' });

  return generatePageMetadata({
    title: t('hero.title') + ' - Installation Guides, Datasheets & Documentation',
    description: t('metadata.description'),
    path: 'resources',
    keywords: t('metadata.keywords').split(',').map((k: string) => k.trim()),
    type: 'website',
  }, locale);
}

export default async function ResourcesPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;
  const resources = await fetchResources();
  const t = await getTranslations({ locale, namespace: 'resourcesPage' });

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <div className="bg-linear-to-br relative overflow-hidden from-primary-600 to-primary-700 py-20 text-white">
        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute right-0 top-0 h-96 w-96 -translate-y-1/2 translate-x-1/2 transform rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-0 left-0 h-96 w-96 -translate-x-1/2 translate-y-1/2 transform rounded-full bg-accent-400 blur-3xl" />
        </div>
        <div className="container relative mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="mb-6 text-5xl font-bold leading-tight md:text-6xl lg:text-7xl">
              {t('hero.title')}
            </h1>
            <p className="mb-8 text-xl leading-relaxed text-primary-50 md:text-2xl">
              {t('hero.subtitle')}
            </p>
            <div className="mt-6 flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-accent-400" />
                <span>{t('stats.documents')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-accent-400" />
                <span>{t('stats.guides')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-accent-400" />
                <span>{t('stats.datasheets')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-accent-400" />
                <span>{t('stats.catalogs')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Resource List */}
      <div className="container mx-auto px-4 py-12">
        {/* Application Notes CTA Card */}
        <Link
          href="/application-notes"
          className="bg-linear-to-br duration-250 group mb-8 block rounded-lg border-2 border-primary-200 from-primary-50 to-blue-50 p-6 transition-all hover:border-primary-300 hover:shadow-lg"
        >
          <div className="flex items-center gap-4">
            <div className="bg-linear-to-br duration-250 flex h-16 w-16 shrink-0 items-center justify-center rounded-lg from-primary-600 to-primary-700 transition-transform group-hover:scale-110">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="mb-1 text-xl font-semibold text-neutral-900 transition-colors group-hover:text-primary-700">
                {t('appNotesCta.title')}
              </h3>
              <p className="text-neutral-600">
                {t('appNotesCta.description')}
              </p>
            </div>
          </div>
        </Link>

        <ResourceList resources={resources} />
      </div>
    </div>
  );
}
