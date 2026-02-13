/**
 * Checkout Page
 *
 * Multi-step checkout wizard:
 * 1. Shipping Information
 * 2. Payment Method
 * 3. Review & Place Order
 */

import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import CheckoutPageClient from '@/components/checkout/CheckoutPageClient';

interface CheckoutPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: CheckoutPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'checkoutPage.meta' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const { locale } = await params;
  return <CheckoutPageClient locale={locale} />;
}
