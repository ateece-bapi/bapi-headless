import { ClerkProvider } from '@clerk/nextjs';

/**
 * Order confirmation layout - requires authentication
 */
export default function OrderConfirmationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClerkProvider>{children}</ClerkProvider>;
}
