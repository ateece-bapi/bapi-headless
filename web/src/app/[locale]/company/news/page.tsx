import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getPosts } from '@/lib/wordpress';
import Link from 'next/link';
import { Newspaper, Calendar, ArrowRight, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import { locales } from '@/i18n';

// Generate static params for all locales - ensures each locale is built separately
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('companyPages.news.metadata');

  return {
    title: t('title'),
    description: t('description'),
  };
}

// ISR with 15-minute revalidation for news content (frequently updated)
export const revalidate = 900;

export default async function NewsPage() {
  const t = await getTranslations('companyPages.news');
  const posts = await getPosts({ perPage: 20 });

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 to-primary-800">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="absolute right-0 top-0 h-[600px] w-[600px] -translate-y-1/3 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-96 w-96 translate-y-1/3 rounded-full bg-primary-400/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-sm text-primary-100">
            <Link href="/" className="transition-colors hover:text-white">
              {t('breadcrumb.home')}
            </Link>
            <span>/</span>
            <Link href="/company" className="transition-colors hover:text-white">
              {t('breadcrumb.company')}
            </Link>
            <span>/</span>
            <span className="font-medium text-white">{t('breadcrumb.news')}</span>
          </nav>

          {/* Header */}
          <div className="max-w-4xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
              <Newspaper className="h-4 w-4" />
              {t('hero.badge')}
            </div>

            <h1 className="mb-6 text-5xl font-bold tracking-tight text-white md:text-6xl lg:text-7xl">
              {t('hero.title')}
            </h1>

            <p className="text-xl leading-relaxed text-primary-50 md:text-2xl">
              {t('hero.description')}
            </p>
          </div>
        </div>
      </section>

      {/* News Grid */}
      <section className="relative mx-auto -mt-8 max-w-7xl px-4 pb-20 sm:px-6 lg:px-8 lg:pb-28">
        {posts.length === 0 ? (
          <div className="rounded-2xl bg-white p-12 text-center shadow-xl">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <Newspaper className="h-8 w-8 text-gray-400" />
            </div>
            <h2 className="mb-2 text-2xl font-bold text-gray-900">{t('empty.title')}</h2>
            <p className="text-lg text-gray-600">{t('empty.description')}</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => (
              <article
                key={post.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg transition-all duration-500 hover:border-transparent hover:shadow-2xl"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Featured Image */}
                {post.featuredImage && (
                  <div className="relative h-56 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                    <img
                      src={post.featuredImage}
                      alt={post.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  </div>
                )}

                {/* Content */}
                <div className="flex flex-1 flex-col p-6">
                  {/* Date Badge */}
                  <div className="mb-3 flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4 text-primary-500" />
                    <time dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </time>
                  </div>

                  {/* Title */}
                  <h2 className="mb-3 line-clamp-2 text-xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-primary-600">
                    <Link href={`/news/${post.slug}`} className="hover:underline">
                      {post.title}
                    </Link>
                  </h2>

                  {/* Excerpt */}
                  <p className="mb-4 line-clamp-3 flex-1 leading-relaxed text-gray-600">
                    {post.excerpt}
                  </p>

                  {/* Read More Link */}
                  <Link
                    href={`/news/${post.slug}`}
                    className="group/link inline-flex items-center gap-2 font-semibold text-primary-600 transition-all duration-300 hover:gap-3"
                  >
                    <span>{t('readMore')}</span>
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-1" />
                  </Link>
                </div>

                {/* Decorative corner element */}
                <div className="absolute right-0 top-0 h-20 w-20 rounded-bl-full bg-gradient-to-br from-primary-50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </article>
            ))}
          </div>
        )}

        {/* Additional CTA - if there are posts */}
        {posts.length > 0 && (
          <div className="relative mt-16 overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 to-primary-700 p-10 shadow-2xl lg:p-12">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
            <div className="absolute right-0 top-0 h-96 w-96 -translate-y-1/2 translate-x-1/2 rounded-full bg-white/10 blur-3xl" />

            <div className="relative flex flex-col items-center justify-between gap-8 text-center lg:flex-row lg:text-left">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
                  <TrendingUp className="h-4 w-4" />
                  {t('cta.badge')}
                </div>
                <h2 className="mb-3 text-3xl font-bold text-white lg:text-4xl">{t('cta.title')}</h2>
                <p className="max-w-2xl text-lg text-primary-50">{t('cta.description')}</p>
              </div>

              <Link
                href="/company/contact-us"
                className="inline-flex items-center gap-2 whitespace-nowrap rounded-xl bg-white px-8 py-4 font-semibold text-primary-600 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                {t('cta.button')}
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
