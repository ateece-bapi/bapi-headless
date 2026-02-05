import { redirect } from 'next/navigation';

/**
 * Root page redirect to default locale
 * 
 * Without middleware, we need to manually redirect root path to /en
 * This will be replaced when we restore middleware with proper cache headers.
 */
export default function RootPage() {
  redirect('/en');
}
