import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import ApplicationLandingPage, {
  generateApplicationMetadata,
} from '@/components/applications/ApplicationLandingPage';
import { getApplicationBySlug, getAllApplicationSlugs } from '@/data/applications';

/**
 * Application landing page route
 *
 * Renders solution-focused pages for different application verticals.
 * Uses static generation for optimal performance.
 *
 * @example URLs:
 * - /applications/landing/building-automation
 * - /applications/landing/data-centers
 * - /applications/landing/healthcare
 * - /applications/landing/industrial
 * - /applications/landing/wireless-monitoring
 */

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * Generate static params for all application pages
 */
export async function generateStaticParams() {
  const slugs = getAllApplicationSlugs();
  return slugs.map((slug) => ({ slug }));
}

/**
 * Generate metadata for SEO
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = getApplicationBySlug(slug);

  if (!data) {
    return {
      title: 'Application Not Found | BAPI',
    };
  }

  return generateApplicationMetadata(data);
}

/**
 * Application landing page component
 */
export default async function ApplicationPage({ params }: PageProps) {
  const { slug } = await params;
  const data = getApplicationBySlug(slug);

  // Show 404 if application not found
  if (!data) {
    notFound();
  }

  return <ApplicationLandingPage data={data} />;
}
