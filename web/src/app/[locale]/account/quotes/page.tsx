import { getServerAuth } from '@/lib/auth/server';
import { redirect } from 'next/navigation';
import { Link } from '@/lib/navigation';
import { ArrowLeftIcon, FileTextIcon, ClockIcon, CheckCircleIcon, XCircleIcon, PlusIcon, AlertCircleIcon } from '@/lib/icons';
import { getMockUserData, isMockDataEnabled } from '@/lib/mock-user-data';
import { getTranslations } from 'next-intl/server';

type QuotesPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function QuotesPage({ params }: QuotesPageProps) {
  const { locale } = await params;
  const t = await getTranslations('account.quotes');
  const { user } = await getServerAuth();

  if (!user) {
    redirect(`/${locale}/sign-in`);
  }

  // Get mock data if enabled
  const mockEnabled = isMockDataEnabled();
  const profile = mockEnabled ? getMockUserData(user.id) : null;

  // Use mock quotes or empty array
  const quotes =
    profile?.savedQuotes.map((q) => ({
      id: q.quoteId,
      quoteId: q.quoteId,
      date: q.date,
      expiresAt: q.expiresAt,
      status: 'pending' as const,
      total: q.total,
      itemCount: q.items,
    })) || [];

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Mock Data Banner */}
      {mockEnabled && profile && (
        <div className="w-full border-b border-yellow-200 bg-yellow-50">
          <div className="mx-auto max-w-container px-4 py-3 sm:px-6 lg:px-8 xl:px-12">
            <div className="flex items-center gap-2 text-sm text-yellow-800">
              <AlertCircleIcon className="h-4 w-4" />
              <span>{t('mockDataBanner')}</span>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <section className="bg-linear-to-r w-full from-primary-600 to-primary-700 text-white">
        <div className="mx-auto max-w-container px-4 py-12 sm:px-6 lg:px-8 xl:px-12">
          <Link
            href="/account"
            className="mb-6 inline-flex items-center gap-2 font-semibold text-white/90 transition-colors hover:text-white"
          >
            <ArrowLeftIcon className="h-4 w-4" strokeWidth={2.5} />
            {t('backToDashboard')}
          </Link>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold lg:text-4xl">{t('title')}</h1>
              <p className="mt-2 text-white/90">{t('subtitle')}</p>
            </div>
            <Link
              href="/request-quote"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-primary-700 shadow-lg transition-all hover:bg-neutral-50 hover:shadow-xl"
            >
              <PlusIcon className="h-5 w-5" strokeWidth={2.5} />
              {t('newQuoteRequest')}
            </Link>
          </div>
        </div>
      </section>

      {/* Quotes Content */}
      <section className="w-full py-12">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8 xl:px-12">
          {quotes.length === 0 ? (
            /* Empty State */
            <div className="rounded-xl border border-neutral-200 bg-white p-12 text-center shadow-sm">
              <div className="mb-6 flex justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-100">
                  <FileTextIcon className="h-10 w-10 text-primary-600" strokeWidth={2} />
                </div>
              </div>
              <h2 className="mb-3 text-2xl font-bold text-neutral-900">{t('empty.title')}</h2>
              <p className="mx-auto mb-8 max-w-md text-neutral-700">
                {t('empty.description')}
              </p>
              <Link
                href={`/${locale}/request-quote`}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-600 px-6 py-3 font-semibold text-white shadow-md transition-colors hover:bg-primary-700 hover:shadow-lg"
              >
                <PlusIcon className="h-5 w-5" strokeWidth={2.5} />
                {t('empty.submitQuote')}
              </Link>

              {/* Info Cards */}
              <div className="mt-12 grid gap-6 text-left md:grid-cols-3">
                <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
                    <FileTextIcon className="h-6 w-6 text-primary-600" strokeWidth={2} />
                  </div>
                  <h3 className="mb-2 font-bold text-neutral-900">{t('empty.infoCards.customSolutions.title')}</h3>
                  <p className="text-sm text-neutral-700">
                    {t('empty.infoCards.customSolutions.description')}
                  </p>
                </div>
                <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
                    <ClockIcon className="h-6 w-6 text-primary-600" strokeWidth={2} />
                  </div>
                  <h3 className="mb-2 font-bold text-neutral-900">{t('empty.infoCards.fastResponse.title')}</h3>
                  <p className="text-sm text-neutral-700">
                    {t('empty.infoCards.fastResponse.description')}
                  </p>
                </div>
                <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
                    <CheckCircleIcon className="h-6 w-6 text-primary-600" strokeWidth={2} />
                  </div>
                  <h3 className="mb-2 font-bold text-neutral-900">{t('empty.infoCards.expertSupport.title')}</h3>
                  <p className="text-sm text-neutral-700">
                    {t('empty.infoCards.expertSupport.description')}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* Quotes List */
            <div className="space-y-6">
              {quotes.map((quote) => (
                <div
                  key={quote.id}
                  className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-1">
                      <div className="mb-3 flex items-center gap-3">
                        <h3 className="text-xl font-bold text-neutral-900">
                          {t('quoteNumber', { number: quote.id })}
                        </h3>
                        {getStatusBadge(quote.status, t)}
                      </div>
                      <div className="mb-4 flex flex-wrap gap-4 text-sm">
                        <div>
                          <span className="text-neutral-700">{t('created')}</span>{' '}
                          <span className="font-medium text-neutral-700">
                            {new Date(quote.date).toLocaleDateString(locale, {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                        <div>
                          <span className="text-neutral-700">{t('expires')}</span>{' '}
                          <span className="font-medium text-neutral-700">
                            {new Date(quote.expiresAt).toLocaleDateString(locale, {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                        <div>
                          <span className="text-neutral-700">{t('items')}</span>{' '}
                          <span className="font-medium text-neutral-700">
                            {quote.itemCount === 1 ? t('itemCount.item', { count: quote.itemCount }) : t('itemCount.items', { count: quote.itemCount })}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
                      <Link
                        href={`/account/quotes/${quote.id}`}
                        className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
                      >
                        {t('actions.viewDetails')}
                      </Link>
                      {quote.status === 'pending' && (
                        <button
                          type="button"
                          className="inline-flex items-center justify-center rounded-lg border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-700 transition-colors hover:bg-neutral-50"
                        >
                          {t('actions.cancelRequest')}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

// Helper function for status badges
function getStatusBadge(status: QuoteStatus, t: (key: string) => string) {
  const styles = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    reviewing: 'bg-blue-100 text-blue-800 border-blue-200',
    quoted: 'bg-green-100 text-green-800 border-green-200',
    declined: 'bg-red-100 text-red-800 border-red-200',
  };

  const icons = {
    pending: <ClockIcon className="h-3.5 w-3.5" strokeWidth={2.5} />,
    reviewing: <FileTextIcon className="h-3.5 w-3.5" strokeWidth={2.5} />,
    quoted: <CheckCircleIcon className="h-3.5 w-3.5" strokeWidth={2.5} />,
    declined: <XCircleIcon className="h-3.5 w-3.5" strokeWidth={2.5} />,
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${styles[status]}`}
    >
      {icons[status]}
      {t(`status.${status}`)}
    </span>
  );
}

// TypeScript types
type QuoteStatus = 'pending' | 'reviewing' | 'quoted' | 'declined';

interface QuoteRequest {
  id: string;
  subject: string;
  description: string;
  status: QuoteStatus;
  submittedAt: string;
  updatedAt: string;
  quantity?: number;
}
