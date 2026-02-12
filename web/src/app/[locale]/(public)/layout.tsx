/**
 * Public layout (no authentication required)
 *
 * This layout is used for public pages (homepage, products) that don't require
 * authentication. By removing ClerkProvider, these pages can be statically
 * generated and cached by CDN, dramatically improving performance.
 *
 * Note: This is a route group layout that nests INSIDE the root layout.
 * Header/Footer/html/body are already in root layout - we just pass through children.
 */

/**
 * Force static generation for public pages
 * This enables CDN caching and dramatically improves performance
 */
export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Just pass through children - root layout handles everything else
  return <>{children}</>;
}
