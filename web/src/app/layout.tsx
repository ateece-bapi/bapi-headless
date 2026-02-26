/**
 * Root layout - Minimal pass-through
 * All actual HTML structure is in [locale]/layout.tsx for proper locale handling
 * This file exists only to satisfy Next.js requirement for a root layout
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
