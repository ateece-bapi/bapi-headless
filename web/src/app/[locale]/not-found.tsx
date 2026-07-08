import { Link } from '@/lib/navigation';

/**
 * Locale-scoped 404 page — rendered when notFound() is called from any route
 * under [locale] (product pages, category pages, application pages, etc.).
 *
 * Inherits locale from the parent [locale]/layout.tsx via NextIntlClientProvider,
 * so Link uses locale-aware hrefs automatically.
 */
export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6 py-24">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary-50">
          <svg
            className="h-8 w-8 text-primary-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary-600">
          404
        </p>
        <h1 className="mb-3 text-2xl font-bold text-neutral-900">Page not found</h1>

        <p className="mb-8 text-base text-neutral-600">
          The page you&apos;re looking for doesn&apos;t exist or has been moved. Check the URL or
          browse our products.
        </p>

        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="rounded-lg bg-primary-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-500/50"
          >
            Go to homepage
          </Link>
          <Link
            href="/products"
            className="rounded-lg border border-neutral-300 bg-white px-6 py-3 font-semibold text-neutral-900 transition-colors hover:border-primary-500 hover:bg-primary-50 focus:outline-none focus:ring-4 focus:ring-primary-500/50"
          >
            Browse products
          </Link>
        </div>
      </div>
    </div>
  );
}
