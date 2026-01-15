/**
 * Checkout Page
 * 
 * Multi-step checkout wizard:
 * 1. Shipping Information
 * 2. Payment Method
 * 3. Review & Place Order
 */

import { Metadata } from 'next';
import CheckoutPageClient from '@/components/checkout/CheckoutPageClient';

export const metadata: Metadata = {
  title: 'Checkout | BAPI',
  description: 'Complete your order',
};

export default function CheckoutPage() {
  return <CheckoutPageClient />;
}
