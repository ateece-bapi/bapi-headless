import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getPostBySlug } from '@/lib/wordpress';
import Image from 'next/image';
import { CalendarIcon, UserIcon, ClockIcon, TagIcon, ArrowLeftIcon } from '@/lib/icons';
import { Link } from '@/lib/navigation';
import Breadcrumbs from '@/components/products/ProductPage/Breadcrumbs';
import { calculateReadTime, formatReadTime, getCategoryColor } from '@/lib/utils/readTime';
import { sanitizeWordPressContent } from '@/lib/sanitize';
import ShareButton from '@/components/news/ShareButton';

interface NewsPostPageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export async function generateMetadata({ params }: NewsPostPageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bapi.com';
  const articleUrl = `${siteUrl}/${locale}/company/news/${slug}`;
  const ogImage = post.featuredImage || `${siteUrl}/og-default.png`;

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: articleUrl,
    },
    openGraph: {
      title: `${post.title} | BAPI`,
      description: post.excerpt,
      type: 'article',
      url: articleUrl,
      publishedTime: post.date,
      modifiedTime: post.modified,
      authors: post.author ? [post.author.name] : ['BAPI'],
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      siteName: 'BAPI',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${post.title} | BAPI`,
      description: post.excerpt,
      images: [ogImage],
      creator: '@BAPIProducts',
      site: '@BAPIProducts',
    },
  };
}

// ISR with 1-hour revalidation for individual posts
export const revalidate = 3600;

export default async function NewsPostPage({ params }: NewsPostPageProps) {
  const { slug, locale } = await params;
  const t = await getTranslations('companyPages.news');
  
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const readTime = calculateReadTime(post.content);
  const articleUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://bapi.com'}/${locale}/company/news/${slug}`;

  // Structured Data for SEO (JSON-LD)
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: post.title,
    description: post.excerpt,
    image: post.featuredImage || `${process.env.NEXT_PUBLIC_SITE_URL || 'https://bapi.com'}/og-default.png`,
    datePublished: post.date,
    dateModified: post.modified,
    author: {
      '@type': 'Organization',
      name: post.author?.name || 'BAPI',
      url: process.env.NEXT_PUBLIC_SITE_URL || 'https://bapi.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'BAPI',
      logo: {
        '@type': 'ImageObject',
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://bapi.com'}/images/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
  };

  const breadcrumbItems = [
    { label: t('breadcrumb.home'), href: '/' },
    { label: t('breadcrumb.company'), href: '/company' },
    { label: t('breadcrumb.news'), href: '/company/news' },
    { label: post.title },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50/30">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b-4 border-accent-500 bg-gradient-to-br from-primary-600 to-primary-800">
        <div className="absolute inset-0 bg-[url('/images/patterns/grid.svg')] opacity-10" />
        
        <div className="relative mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Breadcrumbs items={breadcrumbItems} variant="gradient" />
          </div>

          {/* Back Link */}
          <Link
            href="/company/news"
            className="mb-6 inline-flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/20"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to News
          </Link>

          {/* Categories */}
          {post.categories && post.categories.length > 0 && (
            <div className="mb-5 flex flex-wrap gap-2">
              {post.categories.map((category) => (
                <span
                  key={category.slug}
                  className="inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm"
                >
                  {category.name}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="mb-5 text-3xl font-bold leading-tight tracking-tight text-white md:text-4xl lg:text-5xl">
            {post.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-primary-100">
            {/* Date */}
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            </div>

            {/* Author */}
            {post.author && (
              <>
                <span className="text-primary-300">•</span>
                <div className="flex items-center gap-2">
                  <UserIcon className="h-4 w-4" />
                  <span>{post.author.name}</span>
                </div>
              </>
            )}

            {/* Read Time */}
            <span className="text-primary-300">•</span>
            <div className="flex items-center gap-2">
              <ClockIcon className="h-4 w-4" />
              <span>{formatReadTime(readTime)}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <article className="relative mx-auto max-w-4xl px-4 pb-20 pt-12 sm:px-6 lg:px-8 lg:pt-16">
        <div className="overflow-hidden rounded-2xl bg-white shadow-xl">
          {/* Featured Image */}
          {post.featuredImage && (
            <>
              <div className="relative h-96 overflow-hidden bg-neutral-50">
                <Image
                  src={post.featuredImage}
                  alt={post.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 1024px"
                  className="object-contain"
                  priority
                />
              </div>
              {/* BAPI Yellow Accent Bar */}
              <div className="h-1 w-full bg-accent-500" />
            </>
          )}

          {/* Content */}
          <div className="px-8 pb-12 pt-10 lg:px-16 lg:pb-20 lg:pt-14">
            {/* WordPress Content */}
            <div
              className="prose prose-xl max-w-none prose-headings:scroll-mt-20 prose-headings:font-bold prose-headings:tracking-tight prose-h1:mb-8 prose-h1:text-4xl prose-h1:text-neutral-900 prose-h2:mb-6 prose-h2:mt-12 prose-h2:border-l-4 prose-h2:border-accent-500 prose-h2:pl-6 prose-h2:text-3xl prose-h2:leading-snug prose-h2:text-neutral-900 prose-h3:mb-5 prose-h3:mt-10 prose-h3:text-2xl prose-h3:text-primary-700 prose-h4:mb-4 prose-h4:mt-8 prose-h4:text-xl prose-h4:text-neutral-800 prose-p:mb-8 prose-p:text-lg prose-p:leading-loose prose-p:text-neutral-700 prose-p:first-of-type:text-xl prose-p:first-of-type:leading-relaxed prose-a:font-semibold prose-a:text-primary-600 prose-a:underline prose-a:decoration-primary-300 prose-a:decoration-2 prose-a:underline-offset-4 prose-a:transition-all hover:prose-a:text-primary-700 hover:prose-a:decoration-primary-500 prose-strong:font-bold prose-strong:text-neutral-900 prose-em:text-neutral-800 prose-blockquote:border-l-4 prose-blockquote:border-accent-500 prose-blockquote:bg-accent-50/50 prose-blockquote:py-4 prose-blockquote:pl-6 prose-blockquote:pr-4 prose-blockquote:text-lg prose-blockquote:italic prose-blockquote:text-neutral-700 prose-code:rounded prose-code:bg-neutral-100 prose-code:px-2 prose-code:py-1 prose-code:text-sm prose-code:font-semibold prose-code:text-primary-700 prose-code:before:content-[''] prose-code:after:content-[''] prose-pre:rounded-xl prose-pre:border prose-pre:border-neutral-200 prose-pre:bg-neutral-900 prose-ol:my-8 prose-ol:space-y-3 prose-ul:my-8 prose-ul:space-y-3 prose-li:text-lg prose-li:leading-relaxed prose-li:text-neutral-700 prose-li:marker:text-accent-500 prose-img:my-10 prose-img:rounded-2xl prose-img:shadow-2xl prose-img:ring-1 prose-img:ring-neutral-200 prose-hr:my-12 prose-hr:border-neutral-200"
              dangerouslySetInnerHTML={{ __html: sanitizeWordPressContent(post.content) }}
            />

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-12 border-t-2 border-accent-500/30 pt-8">
                <h3 className="mb-5 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-neutral-600">
                  <div className="h-1 w-8 bg-accent-500" />
                  Tags
                </h3>
                <div className="flex flex-wrap gap-3">
                  {post.tags.map((tag) => (
                    <span
                      key={tag.slug}
                      className="group inline-flex items-center gap-2 rounded-lg border-2 border-accent-500/20 bg-accent-50 px-4 py-2 text-sm font-medium text-neutral-700 transition-all hover:border-accent-500 hover:bg-accent-100 hover:shadow-md"
                    >
                      <TagIcon className="h-4 w-4 text-accent-600 transition-transform group-hover:scale-110" />
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Share Section */}
            <div className="mt-10 overflow-visible rounded-xl bg-gradient-to-br from-primary-50 to-accent-50 p-6 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="mb-1 flex items-center gap-2 text-base font-bold text-neutral-900">
                    <div className="h-1 w-6 bg-accent-500" />
                    Share this article
                  </h3>
                  <p className="text-sm text-neutral-600">Help us spread the word on LinkedIn</p>
                </div>
                <div className="relative flex items-center gap-3">
                  <ShareButton
                    title={post.title}
                    excerpt={post.excerpt}
                    url={`${process.env.NEXT_PUBLIC_SITE_URL || 'https://bapi.com'}/en/company/news/${slug}`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back to News CTA */}
        <div className="mt-12 rounded-xl border-2 border-primary-200 bg-white p-8 text-center shadow-lg">
          <div className="mx-auto mb-4 h-1 w-16 bg-accent-500" />
          <h3 className="mb-2 text-xl font-bold text-neutral-900">Want to read more?</h3>
          <p className="mb-6 text-neutral-600">Explore our latest news and updates</p>
          <Link
            href="/company/news"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 px-8 py-3.5 font-bold text-white shadow-lg transition-all hover:from-primary-600 hover:to-primary-700 hover:shadow-xl"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            View All News & Updates
          </Link>
        </div>
      </article>
    </div>
  );
}
