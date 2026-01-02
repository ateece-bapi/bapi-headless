import { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import { ResourceList } from '@/components/resources/ResourceList';

const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL || '';

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
    console.error('GraphQL fetch failed:', response.statusText);
    return [];
  }

  const data: { data: GetResourcesResponse } = await response.json();
  return data.data.mediaItems.nodes;
}

export const metadata: Metadata = {
  title: 'Technical Resources | BAPI',
  description:
    'Download installation guides, datasheets, application notes, and technical documentation for BAPI building automation sensors and controls.',
  keywords: [
    'BAPI documentation',
    'installation guides',
    'datasheets',
    'technical specifications',
    'application notes',
    'building automation resources',
  ].join(', '),
};

export default async function ResourcesPage() {
  const resources = await fetchResources();

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <div className="bg-linear-to-br from-primary-600 to-primary-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              Technical Resources
            </h1>
            <p className="text-xl text-primary-50">
              Access comprehensive documentation, installation guides, and technical specifications
              for BAPI building automation products.
            </p>
            <div className="mt-6 flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-accent-400 rounded-full" />
                <span>1,100+ Documents</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-accent-400 rounded-full" />
                <span>Installation Guides</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-accent-400 rounded-full" />
                <span>Product Datasheets</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-accent-400 rounded-full" />
                <span>Technical Catalogs</span>
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
          className="block mb-8 p-6 bg-linear-to-br from-accent-50 to-accent-100 border-2 border-accent-200 rounded-lg hover:border-accent-300 hover:shadow-lg transition-all duration-250 group"
        >
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-16 h-16 bg-linear-to-br from-accent-500 to-accent-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-250">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-neutral-900 mb-1 group-hover:text-accent-700 transition-colors">
                Looking for Technical Guides?
              </h3>
              <p className="text-neutral-600">
                Browse our collection of Application Notes for in-depth technical guidance, best practices, and implementation examples →
              </p>
            </div>
          </div>
        </Link>

        <ResourceList resources={resources} />
      </div>
    </div>
  );
}
