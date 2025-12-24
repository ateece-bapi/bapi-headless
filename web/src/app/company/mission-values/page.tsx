import { Metadata } from 'next';
import { getPageBySlug } from '@/lib/wordpress';

export const metadata: Metadata = {
  title: 'Mission & Values | BAPI',
  description: 'Learn about BAPI\'s mission, vision, and core values that drive our commitment to precision sensor solutions.',
};
// Cache for 1 hour (3600 seconds)
export const revalidate = 3600;
export default async function MissionValuesPage() {
  const page = await getPageBySlug('mission-values');

  if (!page) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Mission & Values</h1>
        <p className="text-lg text-gray-600">Content not found.</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <article className="prose prose-lg max-w-none">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            {page.title}
          </h1>
          <div
            className="text-gray-700"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        </article>
      </div>
    </main>
  );
}
