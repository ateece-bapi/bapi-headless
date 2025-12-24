import { Metadata } from 'next';
import { getPosts } from '@/lib/wordpress';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'News | BAPI',
  description: 'Stay updated with the latest news, announcements, and updates from BAPI.',
};
// Cache for 15 minutes (900 seconds) - news updates more frequently
export const revalidate = 900;
export default async function NewsPage() {
  const posts = await getPosts({ perPage: 20 });

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8">News & Updates</h1>
        
        {posts.length === 0 ? (
          <p className="text-lg text-gray-600">No news articles found.</p>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                {post.featuredImage && (
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    <Link href={`/news/${post.slug}`} className="hover:text-primary-600">
                      {post.title}
                    </Link>
                  </h2>
                  <p className="text-sm text-gray-500 mb-4">
                    {new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                  <p className="text-gray-700 line-clamp-3">{post.excerpt}</p>
                  <Link
                    href={`/news/${post.slug}`}
                    className="inline-block mt-4 text-primary-600 font-medium hover:text-primary-700"
                  >
                    Read more →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
