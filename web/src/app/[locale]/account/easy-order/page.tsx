import { redirect } from 'next/navigation';
import { getServerAuth } from '@/lib/auth/server';
import { canUseEasyOrderForm } from '@/lib/constants/easyOrderForm';
import EasyOrderForm from '@/components/account/EasyOrderForm';

type EasyOrderPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function EasyOrderPage({ params }: EasyOrderPageProps) {
  const { locale } = await params;
  const { user } = await getServerAuth();

  if (!user) {
    redirect(`/${locale}/sign-in`);
  }

  // Easy Order Form is currently scoped to specific B2B customer groups only.
  if (!canUseEasyOrderForm(user.customerGroups)) {
    redirect(`/${locale}/account`);
  }

  return <EasyOrderForm />;
}
