import { Metadata } from 'next';
import { ApplicationNoteList } from '@/components/application-notes/ApplicationNoteList';
import { GetApplicationNotesQuery, GetApplicationNotesDocument } from '@/lib/graphql/generated';
import { getGraphQLClient } from '@/lib/graphql/client';
import { BookOpen, Lightbulb } from 'lucide-react';
import logger from '@/lib/logger';

interface ApplicationNote {
  id: string;
  databaseId: number;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  date: string;
  modified: string;
  featuredImage: {
    node: {
      sourceUrl: string;
      altText: string;
    };
  } | null;
}

async function fetchApplicationNotes(): Promise<ApplicationNote[]> {
  try {
    const client = getGraphQLClient(['application-notes']);
    const data = await client.request<GetApplicationNotesQuery>(GetApplicationNotesDocument, {
      first: 100,
    });

    return (data.applicationNotes?.nodes || []) as ApplicationNote[];
  } catch (error) {
    logger.error('Error fetching application notes', error);
    return [];
  }
}

export const metadata: Metadata = {
  title: 'Technical Application Notes | BAPI',
  description:
    'Explore our comprehensive library of technical application notes covering sensor installation, best practices, troubleshooting guides, and industry insights for HVAC applications.',
  openGraph: {
    title: 'Technical Application Notes | BAPI',
    description:
      'Comprehensive technical guidance for HVAC sensor applications, installation best practices, and troubleshooting solutions.',
    type: 'website',
  },
};

export default async function ApplicationNotesPage() {
  const applicationNotes = await fetchApplicationNotes();

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
            <BookOpen className="h-10 w-10" />
            <span className="rounded-full bg-white/20 px-3 py-1 text-sm font-semibold uppercase tracking-wider">
              Technical Guidance
            </span>
          </div>
          <h1 className="mb-6 max-w-4xl text-5xl font-bold leading-tight md:text-6xl lg:text-7xl">
            Application Notes
          </h1>
          <p className="mb-2 max-w-3xl text-xl leading-relaxed text-primary-100 md:text-2xl">
            In-depth technical articles covering sensor installation, best practices, and industry
            insights to help you get the most out of your BAPI sensors.
          </p>

          {/* Stats */}
          <div className="mt-12 grid max-w-2xl grid-cols-2 gap-6 md:grid-cols-3">
            <div className="rounded-lg border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
              <div className="mb-1 text-3xl font-bold">{applicationNotes.length}</div>
              <div className="text-sm text-primary-100">Technical Articles</div>
            </div>
            <div className="rounded-lg border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
              <div className="mb-1 text-3xl font-bold">15+</div>
              <div className="text-sm text-primary-100">Years of Expertise</div>
            </div>
            <div className="col-span-2 rounded-lg border border-white/20 bg-white/10 p-4 backdrop-blur-sm md:col-span-1">
              <div className="mb-1 text-3xl font-bold">100%</div>
              <div className="text-sm text-primary-100">Free Access</div>
            </div>
          </div>
        </div>
      </div>

      {/* Value Proposition */}
      <div className="border-b border-neutral-200 bg-white">
        <div className="container mx-auto px-4 py-12">
          <div className="flex max-w-4xl items-start gap-4">
            <div className="flex-shrink-0 rounded-lg bg-primary-50 p-3">
              <Lightbulb className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h2 className="mb-2 text-xl font-semibold text-neutral-900">
                Expert Guidance from Industry Leaders
              </h2>
              <p className="text-neutral-600">
                Our application notes are written by BAPI&apos;s engineering team with decades of
                combined experience. Each article provides practical, field-tested solutions to
                common challenges in sensor installation, calibration, and maintenance.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Application Notes List */}
      <div className="container mx-auto px-4 py-12">
        {applicationNotes.length === 0 ? (
          <div className="rounded-lg border border-neutral-200 bg-white py-20 text-center">
            <BookOpen className="mx-auto mb-4 h-16 w-16 text-neutral-300" />
            <h3 className="mb-2 text-xl font-semibold text-neutral-900">
              No application notes available
            </h3>
            <p className="text-neutral-600">Check back soon for technical articles and guides.</p>
          </div>
        ) : (
          <ApplicationNoteList applicationNotes={applicationNotes} />
        )}
      </div>
    </div>
  );
}
