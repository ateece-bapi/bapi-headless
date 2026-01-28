import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import OrderConfirmationClient from '@/components/order-confirmation/OrderConfirmationClient';

/**
 * Order Confirmation Page
 * 
 * Dynamic route for displaying order confirmation after successful checkout
 * Route: /order-confirmation/[orderId]
 */

interface OrderConfirmationPageProps {
  params: Promise<{
    orderId: string;
  }>;
}

export async function generateMetadata({
  params,
}: OrderConfirmationPageProps): Promise<Metadata> {
  const { orderId } = await params;
  
  return {
    title: `Order Confirmation #${orderId} | BAPI`,
    description: 'Your order has been successfully placed. Thank you for your purchase!',
    robots: 'noindex, nofollow', // Don't index order confirmation pages
  };
}

export default async function OrderConfirmationPage({
  params,
}: OrderConfirmationPageProps) {
  const { orderId } = await params;

  // Validate orderId is numeric
  if (!/^\d+$/.test(orderId)) {
    notFound();
  }

  return <OrderConfirmationClient orderId={orderId} />;
}
