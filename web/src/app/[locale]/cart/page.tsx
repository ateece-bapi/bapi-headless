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
import CartPageClient from '@/components/cart/CartPage/CartPageClient';

export const metadata: Metadata = {
  title: 'Shopping Cart | BAPI',
  description: 'Review your cart and proceed to checkout',
};

export default function CartPage() {
  return <CartPageClient />;
}
