import { ClerkProvider } from '@clerk/nextjs';

/**
 * Checkout layout - requires authentication
 */
export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClerkProvider>{children}</ClerkProvider>;
}
