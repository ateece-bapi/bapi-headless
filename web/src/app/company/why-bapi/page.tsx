import { Metadata } from 'next';
import { getPageBySlug } from '@/lib/wordpress';
import { cleanWordPressContent } from '@/lib/utils/wordpress-content';

export const metadata: Metadata = {
  title: 'Why BAPI | BAPI',
  description: 'Discover what sets BAPI apart in the building automation industry and why engineers trust our precision sensor solutions.',
};

// Cache for 1 hour (3600 seconds)
export const revalidate = 3600;

export default async function WhyBapiPage() {
  const page = await getPageBySlug('why-bapi');

  if (!page) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Why BAPI</h1>
        <p className="text-lg text-gray-600">Content not found.</p>
      </div>
    );
  }

  const cleanContent = cleanWordPressContent(page.content);

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <article className="prose prose-lg max-w-none">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            {page.title}
          </h1>
          <div
            className="text-gray-700"
            dangerouslySetInnerHTML={{ __html: cleanContent }}
          />
        </article>
      </div>
    </main>
  );
}
