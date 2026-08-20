import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import PageContainer from '@/components/layout/PageContainer';
import PageHeader from '@/components/layout/PageHeader';
import { ArrowLeftIcon } from '@/lib/icons';
import { Link } from '@/lib/navigation';
import { getServiceBulletinPlainText } from '@/lib/serviceBulletins';
import { getServiceBulletinBySlug } from '@/lib/serviceBulletins.server';

interface ServiceBulletinDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export async function generateMetadata({
  params,
}: ServiceBulletinDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const bulletin = await getServiceBulletinBySlug(slug);

  if (!bulletin) {
    return { title: 'Service Bulletin Not Found' };
  }

  return {
    title: `${bulletin.title} | Service Bulletins`,
    description:
      getServiceBulletinPlainText(bulletin.excerpt) || 'Technical service information from BAPI.',
  };
}

export default async function ServiceBulletinDetailPage({
  params,
}: ServiceBulletinDetailPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const bulletin = await getServiceBulletinBySlug(slug);

  if (!bulletin) {
    notFound();
  }

  const categories = bulletin.serviceBulletinCategories?.nodes ?? [];

  return (
    <div className="min-h-screen bg-white">
      <PageHeader
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Resources', href: '/resources' },
          { label: 'Service Bulletins', href: '/service-bulletin' },
          { label: bulletin.title },
        ]}
        title={bulletin.title}
        description={getServiceBulletinPlainText(bulletin.excerpt)}
      >
        <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-primary-50">
          <time dateTime={bulletin.date}>{formatDate(bulletin.date)}</time>
          {categories.map((category) => (
            <span key={category.id} className="border border-white/30 bg-white/10 px-2 py-1">
              {category.name}
            </span>
          ))}
        </div>
      </PageHeader>

      <PageContainer size="content" className="py-12">
        <Link
          href="/service-bulletin"
          className="mb-8 inline-flex items-center gap-2 font-semibold text-primary-600 hover:text-primary-700"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Service Bulletins
        </Link>

        {bulletin.content ? (
          <article
            className="prose prose-lg prose-neutral max-w-none prose-headings:text-neutral-900 prose-a:text-primary-600 prose-img:h-auto prose-img:max-w-full"
            dangerouslySetInnerHTML={{ __html: bulletin.content }}
          />
        ) : (
          <p className="text-lg text-neutral-700">
            {getServiceBulletinPlainText(bulletin.excerpt) || 'No bulletin details are available.'}
          </p>
        )}
      </PageContainer>
    </div>
  );
}
