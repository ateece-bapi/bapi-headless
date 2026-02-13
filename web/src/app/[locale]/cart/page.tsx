/**
 * Shopping Cart Page
 *
 * Full-page cart experience with:
 * - Item management (update quantity, remove items)
 * - Coupon code application
 * - Cart totals (subtotal, tax, shipping, discounts)
 * - Proceed to checkout
 * - Continue shopping link
 * - Empty cart state
 */

import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import CartPageClient from '@/components/cart/CartPage/CartPageClient';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  return {
    title: `${t('cartPage.meta.title')} | BAPI`,
    description: t('cartPage.meta.description'),
  };
}

export default function CartPage() {
  return <CartPageClient />;
}
