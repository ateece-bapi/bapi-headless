import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getPosts, getPostCategories } from '@/lib/wordpress';
import { Link } from '@/lib/navigation';
import { NewspaperIcon, ArrowRightIcon, TrendingUpIcon, RssIcon } from '@/lib/icons';
import { locales } from '@/i18n';
import Breadcrumbs from '@/components/products/ProductPage/Breadcrumbs';
import NewsFilters from '@/components/news/NewsFilters';
import NewsListClient from '@/components/news/NewsListClient';

// Generate static params for all locales - ensures each locale is built separately
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations('companyPages.news.metadata');
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bapi.com';

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      types: {
        'application/rss+xml': `${siteUrl}/company/news/rss.xml`,
      },
    },
    openGraph: {
      title: `${t('title')} | BAPI`,
      description: t('description'),
      type: 'website',
      url: `${siteUrl}/${locale}/company/news`,
      siteName: 'BAPI',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${t('title')} | BAPI`,
      description: t('description'),
      creator: '@BAPIProducts',
      site: '@BAPIProducts',
    },
  };
}

// ISR with 15-minute revalidation for news content (frequently updated)
export const revalidate = 900;

export default async function NewsPage({ params }: { params: Promise<{ locale: string }> }) {
  // Await params (Next.js 15+ requirement)
  const { locale } = await params;
  
  const t = await getTranslations('companyPages.news');
  const { posts, pageInfo } = await getPosts({ perPage: 12 }); // Initial load: 12 posts
  const categories = await getPostCategories();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bapi.com';

  // Breadcrumb structured data
  const breadcrumbStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${siteUrl}/${locale}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Company',
        item: `${siteUrl}/${locale}/company`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'News & Updates',
        item: `${siteUrl}/${locale}/company/news`,
      },
    ],
  };

  // Extract translations for client component
  const translations = {
    readMore: t('readMore'),
    emptyTitle: t('empty.title'),
    emptyDescription: t('empty.description'),
    noResults: t('noResults'),
    adjustFilters: t('adjustFilters'),
  };

  const breadcrumbItems = [
    { label: t('breadcrumb.home'), href: '/' },
    { label: t('breadcrumb.company'), href: '/company' },
    { label: t('breadcrumb.news') },
  ];

  return (
    <div className="bg-linear-to-br min-h-screen from-slate-50 via-white to-primary-50/30">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />

      {/* Hero Section */}
      <section className="bg-linear-to-br relative overflow-hidden from-primary-600 to-primary-800 border-b-4 border-accent-500">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-[url('/images/patterns/grid.svg')] opacity-10" />
        <div className="absolute right-0 top-0 h-[600px] w-[600px] -translate-y-1/3 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-96 w-96 translate-y-1/3 rounded-full bg-primary-400/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Breadcrumbs items={breadcrumbItems} variant="gradient" />
          </div>

          {/* Header */}
          <div className="max-w-4xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
              <NewspaperIcon className="h-4 w-4" />
              {t('hero.badge')}
            </div>

            <h1 className="mb-6 text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
              {t('hero.title')}
            </h1>

            <p className="text-lg leading-relaxed text-primary-50 md:text-xl">
              {t('hero.description')}
            </p>
          </div>
        </div>
      </section>

      {/* News Grid */}
      <section className="relative mx-auto max-w-7xl px-4 pb-20 pt-12 sm:px-6 lg:px-8 lg:pb-28 lg:pt-16">
        {/* Filters */}
        <NewsFilters categories={categories} />

        {/* RSS Subscribe Link */}
        <div className="mb-6 flex justify-end">
          <a
            href="/company/news/rss.xml"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-md transition-all hover:bg-neutral-50 hover:shadow-lg"
          >
            <RssIcon className="h-4 w-4 text-orange-500" />
            Subscribe to RSS
          </a>
        </div>

        {/* News Grid with Client-side Filtering */}
        <NewsListClient 
          initialPosts={posts} 
          initialPageInfo={pageInfo}
          translations={translations}
          locale={locale} 
        />

        {/* Additional CTA - if there are posts */}
        {posts.length > 0 && (
          <div className="bg-linear-to-br relative mt-16 overflow-hidden rounded-2xl from-primary-600 to-primary-700 p-10 shadow-2xl lg:p-12">
            <div className="absolute inset-0 bg-[url('/images/patterns/grid.svg')] opacity-10" />
            <div className="absolute right-0 top-0 h-96 w-96 -translate-y-1/2 translate-x-1/2 rounded-full bg-white/10 blur-3xl" />

            <div className="relative flex flex-col items-center justify-between gap-8 text-center lg:flex-row lg:text-left">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
                  <TrendingUpIcon className="h-4 w-4" />
                  {t('cta.badge')}
                </div>
                <h2 className="mb-3 text-3xl font-bold text-white lg:text-4xl">{t('cta.title')}</h2>
                <p className="max-w-2xl text-lg text-primary-50">{t('cta.description')}</p>
              </div>

              <Link
                href="/contact"
                className="inline-flex items-center gap-2 whitespace-nowrap rounded-xl bg-white px-8 py-4 font-semibold text-primary-600 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                {t('cta.button')}
                <ArrowRightIcon className="h-5 w-5" />
              </Link>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
