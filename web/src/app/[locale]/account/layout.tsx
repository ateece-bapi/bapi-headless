import { ClerkProvider } from '@clerk/nextjs';

/**
 * Account pages layout - requires authentication
 */
export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClerkProvider>{children}</ClerkProvider>;
}
