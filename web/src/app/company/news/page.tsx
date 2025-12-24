import { Metadata } from 'next';
import { getPosts } from '@/lib/wordpress';
import Link from 'next/link';
import { Newspaper, Calendar, ArrowRight, TrendingUp } from 'lucide-react';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'News | BAPI',
  description: 'Stay updated with the latest news, announcements, and updates from BAPI.',
};

// Cache for 15 minutes (900 seconds) - news updates more frequently
export const revalidate = 900;

export default async function NewsPage() {
  const posts = await getPosts({ perPage: 20 });

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 to-primary-800">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/10 rounded-full blur-3xl -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-400/20 rounded-full blur-3xl translate-y-1/3" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-primary-100 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/company" className="hover:text-white transition-colors">Company</Link>
            <span>/</span>
            <span className="text-white font-medium">News</span>
          </nav>

          {/* Header */}
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white font-medium text-sm mb-6">
              <Newspaper className="w-4 h-4" />
              Latest Updates
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight">
              News & Updates
            </h1>
            
            <p className="text-xl text-primary-50 leading-relaxed">
              Stay informed with the latest news, product announcements, and industry insights from BAPI.
            </p>
          </div>
        </div>
      </section>

      {/* News Grid */}
      <section className="relative -mt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 lg:pb-28">
        {posts.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <Newspaper className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No News Articles Yet</h2>
            <p className="text-lg text-gray-600">Check back soon for the latest updates from BAPI.</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => (
              <article
                key={post.id}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-transparent flex flex-col"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Featured Image */}
                {post.featuredImage && (
                  <div className="relative h-56 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                    <img
                      src={post.featuredImage}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                )}
                
                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  {/* Date Badge */}
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                    <Calendar className="w-4 h-4 text-primary-500" />
                    <time dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </time>
                  </div>

                  {/* Title */}
                  <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors duration-300">
                    <Link href={`/news/${post.slug}`} className="hover:underline">
                      {post.title}
                    </Link>
                  </h2>

                  {/* Excerpt */}
                  <p className="text-gray-600 line-clamp-3 mb-4 flex-1 leading-relaxed">
                    {post.excerpt}
                  </p>

                  {/* Read More Link */}
                  <Link
                    href={`/news/${post.slug}`}
                    className="inline-flex items-center gap-2 text-primary-600 font-semibold hover:gap-3 transition-all duration-300 group/link"
                  >
                    <span>Read more</span>
                    <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform duration-300" />
                  </Link>
                </div>

                {/* Decorative corner element */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary-50 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </article>
            ))}
          </div>
        )}

        {/* Additional CTA - if there are posts */}
        {posts.length > 0 && (
          <div className="mt-16 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl p-10 lg:p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white font-medium text-sm mb-4">
                  <TrendingUp className="w-4 h-4" />
                  Stay Connected
                </div>
                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-3">
                  Never Miss an Update
                </h2>
                <p className="text-primary-50 text-lg max-w-2xl">
                  Want to stay informed about our latest innovations, industry insights, and company news? 
                  Get in touch with us today.
                </p>
              </div>
              
              <Link
                href="/company/contact-us"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-600 font-semibold rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 whitespace-nowrap"
              >
                Contact Us
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
