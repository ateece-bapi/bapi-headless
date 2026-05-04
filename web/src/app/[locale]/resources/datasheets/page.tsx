import { Metadata } from 'next';
import { FileTextIcon } from '@/lib/icons';
import { getTranslations } from 'next-intl/server';
import { generatePageMetadata } from '@/lib/metadata';
import DocumentLibraryClient from '@/components/resources/DocumentLibraryClient';
import { cookies } from 'next/headers';
import { extractCustomerGroupFromTitle } from '@/lib/utils/filterProductsByCustomerGroup';
import { GET_CURRENT_USER_QUERY, type GetCurrentUserResponse } from '@/lib/auth/queries';
import logger from '@/lib/logger';

// WordPress REST API types
interface WPMediaItem {
  id: number;
  title: { rendered: string };
  source_url: string;
  media_details?: {
    filesize?: number;
  };
  date: string;
}

type Props = {
  params: Promise<{ locale: string }>;
};

/**
 * Get user's customer groups from auth token
 * Defaults to ['end-user'] for guests (matches WordPress behavior)
 */
async function getUserCustomerGroups(): Promise<string[]> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return ['end-user']; // Guest users default to end-user group
    }

    const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL || '';

    // Query current user with GraphQL
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: GET_CURRENT_USER_QUERY,
      }),
    });

    const { data, errors }: { data: GetCurrentUserResponse; errors?: unknown[] } =
      await response.json();

    if (errors || !data?.viewer) {
      return ['end-user']; // Invalid token - treat as guest
    }

    const { viewer } = data;

    // Extract customer groups from ACF fields (customerInformation.customerGroup1/2/3)
    const customerInfo = viewer.customerInformation;
    const rawCustomerGroups = [
      ...(customerInfo?.customerGroup1 || []),
      ...(customerInfo?.customerGroup2 || []),
      ...(customerInfo?.customerGroup3 || []),
    ]
      .filter((group): group is string => typeof group === 'string')
      .map((group) => group.trim())
      .filter((group) => group.length > 0 && group.toUpperCase() !== 'NO ACCESS');

    // Normalize to lowercase
    const slugifiedGroups = rawCustomerGroups.map(g => g.toLowerCase());

    // Default to 'end-user' if no valid groups
    return slugifiedGroups.length > 0 ? slugifiedGroups : ['end-user'];
  } catch (error) {
    logger.error('Failed to get user customer groups', error);
    return ['end-user']; // Fallback to guest
  }
}

/**
 * Check if user can view a document based on customer group rules
 * Matches product filtering logic - OEM documents (ALC, ACS, etc.) require matching customer group
 */
function canUserViewDocument(documentTitle: string, userCustomerGroups: string[]): boolean {
  const documentGroup = extractCustomerGroupFromTitle(documentTitle);
  
  // Public document (no customer group prefix) - visible to all
  if (!documentGroup) {
    return true;
  }
  
  // Document has OEM prefix - check if user has matching group
  return userCustomerGroups.includes(documentGroup);
}

/**
 * Document type classifier
 * Categorizes documents based on title keywords
 */
function classifyDocumentType(title: string | null): string {
  if (!title) return 'Other';
  const text = title.toLowerCase();
  
  if (text.includes('instruction') || text.includes('_ins_')) return 'Instructions';
  // Check for pricing: must contain 'price' but not 'noprice'
  if (text.includes('with pricing') || (text.includes('price') && !text.includes('noprice'))) return 'Datasheet (Pricing)';
  if (text.includes('noprice') || text.includes('for submittal')) return 'Datasheet (Submittal)';
  if (text.includes('datasheet')) return 'Datasheet';
  if (text.includes('catalog')) return 'Catalog';
  if (text.includes('guide') || text.includes('selection')) return 'Selection Guide';
  if (text.includes('drawing') || text.includes('dimension')) return 'Technical Drawing';
  if (text.includes('manual') || text.includes('operation')) return 'Operation Manual';
  if (text.includes('specification') || text.includes('spec')) return 'Specification';
  if (text.includes('application note')) return 'Application Note';
  if (text.includes('warranty') || text.includes('compliance') || text.includes('certificate')) return 'Compliance';
  
  return 'Other';
}

/**
 * Generate metadata for datasheets page
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'datasheetsPage' });

  return generatePageMetadata(
    {
      title: t('metadata.title'),
      description: t('metadata.description'),
      path: 'resources/datasheets',
      keywords: t('metadata.keywords').split(', '),
    },
    locale
  );
}

/**
 * Datasheets page - Display searchable library of all product documentation
 * Filters OEM documents (ALC, ACS, etc.) based on user's customer group access
 */
export default async function DatasheetsPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'datasheetsPage' });
  
  // Get user's customer groups for OEM document filtering
  const userCustomerGroups = await getUserCustomerGroups();
  
  // Fetch all PDFs from custom WordPress endpoint (bypasses REST API pagination limits)
  // Extract base URL from GraphQL endpoint
  const graphqlUrl = process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL || 'https://bapiheadlessstaging.kinsta.cloud/graphql';
  const baseUrl = graphqlUrl.replace('/graphql', '');
  
  let documents: Array<{
    id: string;
    title: string;
    filename: string;
    url: string;
    fileSize?: number;
    date: string;
    productName: undefined;
    productSku: undefined;
    categories: never[];
    documentType: string;
  }> = [];
  
  try {
    // Use custom endpoint that returns ALL 918 PDFs in one request
    const response = await fetch(
      `${baseUrl}/wp-json/bapi/v1/all-pdfs`,
      {
        next: { revalidate: 3600, tags: ['documents'] },
      }
    );
    
    if (!response.ok) {
      logger.error('Failed to fetch documents', { status: response.status });
      throw new Error(`Custom endpoint returned ${response.status}`);
    }
    
    const data = await response.json();
    const allDocuments: WPMediaItem[] = data.documents;
    
    logger.info(`Fetched ${allDocuments.length} documents from WordPress endpoint`);
  
    // Filter documents based on customer group access (same logic as products)
    const filteredDocuments = allDocuments.filter(doc => 
      canUserViewDocument(doc.title?.rendered || '', userCustomerGroups)
    );
    
    logger.debug(`Filtered to ${filteredDocuments.length} documents for user groups: ${userCustomerGroups.join(', ')}`);
  
    // Transform documents for client component
    documents = filteredDocuments.map(doc => {
      return {
        id: String(doc.id),
        title: doc.title?.rendered || 'Untitled Document',
        filename: doc.source_url?.split('/').pop() || '',
        url: doc.source_url || '',
        fileSize: doc.media_details?.filesize,
        date: doc.date,
        productName: undefined,
        productSku: undefined,
        categories: [],
        documentType: classifyDocumentType(doc.title?.rendered),
      };
    });
  } catch (error) {
    // Log error and rethrow to trigger error boundary
    // This ensures users see an error page instead of empty "0 documents"
    logger.error('Failed to load document library', error, {
      endpoint: `${baseUrl}/wp-json/bapi/v1/all-pdfs`,
      userGroups: userCustomerGroups,
    });
    throw error; // Trigger Next.js error boundary
  }
  
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-700 via-primary-500 to-primary-700 py-16 text-white">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <FileTextIcon className="mx-auto mb-4 h-16 w-16" />
            <h1 className="mb-4 text-4xl font-bold sm:text-5xl">{t('hero.title')}</h1>
            <p className="mx-auto max-w-content text-xl text-primary-50">{t('hero.subtitle')}</p>
            <div className="mt-6">
              <p className="text-sm text-primary-100">
                {t('hero.totalDocs', { count: documents.length })}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Document Library */}
      <DocumentLibraryClient documents={documents} totalCount={documents.length} />
    </div>
  );
}
