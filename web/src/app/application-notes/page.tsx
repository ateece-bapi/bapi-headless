import { Metadata } from 'next';
import { ApplicationNoteList } from '@/components/application-notes/ApplicationNoteList';
import { GetApplicationNotesQuery, GetApplicationNotesDocument } from '@/lib/graphql/generated';
import { getGraphQLClient } from '@/lib/graphql/client';
import { BookOpen, Lightbulb } from 'lucide-react';

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
    const data = await client.request<GetApplicationNotesQuery>(
      GetApplicationNotesDocument,
      {
        first: 100,
      }
    );

    return (data.applicationNotes?.nodes || []) as ApplicationNote[];
  } catch (error) {
    console.error('Error fetching application notes:', error);
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
      <div className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-400 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="relative container mx-auto px-4 py-20 md:py-24">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="w-10 h-10" />
            <span className="text-sm font-semibold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full">
              Technical Guidance
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 max-w-4xl leading-tight">
            Application Notes
          </h1>
          <p className="text-xl md:text-2xl text-primary-100 max-w-3xl leading-relaxed mb-2">
            In-depth technical articles covering sensor installation, best practices, and industry
            insights to help you get the most out of your BAPI sensors.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-12 max-w-2xl">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="text-3xl font-bold mb-1">{applicationNotes.length}</div>
              <div className="text-sm text-primary-100">Technical Articles</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="text-3xl font-bold mb-1">15+</div>
              <div className="text-sm text-primary-100">Years of Expertise</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 col-span-2 md:col-span-1">
              <div className="text-3xl font-bold mb-1">100%</div>
              <div className="text-sm text-primary-100">Free Access</div>
            </div>
          </div>
        </div>
      </div>

      {/* Value Proposition */}
      <div className="bg-white border-b border-neutral-200">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-start gap-4 max-w-4xl">
            <div className="p-3 bg-primary-50 rounded-lg flex-shrink-0">
              <Lightbulb className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-neutral-900 mb-2">
                Expert Guidance from Industry Leaders
              </h2>
              <p className="text-neutral-600">
                Our application notes are written by BAPI's engineering team with decades of
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
          <div className="text-center py-20 bg-white rounded-lg border border-neutral-200">
            <BookOpen className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">
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
