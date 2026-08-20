import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import PageContainer from '@/components/layout/PageContainer';
import PageHeader from '@/components/layout/PageHeader';
import { ServiceBulletinDirectory } from '@/components/service-bulletins/ServiceBulletinDirectory';
import { getServiceBulletins } from '@/lib/serviceBulletins';

export const metadata: Metadata = {
  title: 'Service Bulletins',
  description:
    'View important service bulletins and technical updates for BAPI building automation products.',
};

interface ServiceBulletinPageProps {
  params: Promise<{ locale: string }>;
}

export default async function ServiceBulletinPage({ params }: ServiceBulletinPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const bulletins = await getServiceBulletins();

  return (
    <div className="min-h-screen bg-white">
      <PageHeader
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Resources', href: '/resources' },
          { label: 'Service Bulletins' },
        ]}
        title="Service Bulletins"
        description="Important technical updates and service information for BAPI products"
      />

      <PageContainer size="site">
        <ServiceBulletinDirectory bulletins={bulletins} />
      </PageContainer>
    </div>
  );
}
