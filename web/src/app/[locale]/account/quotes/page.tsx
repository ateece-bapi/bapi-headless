import { getServerAuth } from '@/lib/auth/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, FileText, Clock, CheckCircle, XCircle, Plus, AlertCircle } from 'lucide-react';
import { getMockUserData, isMockDataEnabled } from '@/lib/mock-user-data';

export default async function QuotesPage() {
  const { user } = await getServerAuth();

  if (!user) {
    redirect('/sign-in');
  }

  // Get mock data if enabled
  const mockEnabled = isMockDataEnabled();
  const profile = mockEnabled ? getMockUserData(user.id) : null;
  
  // Use mock quotes or empty array
  const quotes = profile?.savedQuotes.map(q => ({
    id: q.quoteId,
    quoteId: q.quoteId,
    date: q.date,
    expiresAt: q.expiresAt,
    status: 'pending' as const,
    total: q.total,
    itemCount: q.items,
  })) || [];

  return (
    <main className="min-h-screen bg-neutral-50">
      {/* Mock Data Banner */}
      {mockEnabled && profile && (
        <div className="w-full bg-yellow-50 border-b border-yellow-200">
          <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-3">
            <div className="flex items-center gap-2 text-sm text-yellow-800">
              <AlertCircle className="w-4 h-4" />
              <span><strong>Development Mode:</strong> Showing mock quote data</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Header */}
      <section className="w-full bg-linear-to-r from-primary-600 to-primary-700 text-white">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-12">
          <Link
            href="/account"
            className="inline-flex items-center gap-2 text-white/90 hover:text-white font-semibold transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
            Back to Dashboard
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold">Quote Requests</h1>
              <p className="text-white/90 mt-2">
                Track and manage your custom quote requests
              </p>
            </div>
            <Link
              href="/request-quote"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-primary-700 hover:bg-neutral-50 font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" strokeWidth={2.5} />
              New Quote Request
            </Link>
          </div>
        </div>
      </section>

      {/* Quotes Content */}
      <section className="w-full py-12">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          {quotes.length === 0 ? (
            /* Empty State */
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-12 text-center">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center">
                  <FileText className="w-10 h-10 text-primary-600" strokeWidth={2} />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-3">
                No Quote Requests Yet
              </h2>
              <p className="text-neutral-600 mb-8 max-w-md mx-auto">
                Request a custom quote for bulk orders, special configurations, or technical consultations.
              </p>
              <Link
                href="/request-quote"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors shadow-md hover:shadow-lg"
              >
                <Plus className="w-5 h-5" strokeWidth={2.5} />
                Submit Quote Request
              </Link>

              {/* Info Cards */}
              <div className="mt-12 grid md:grid-cols-3 gap-6 text-left">
                <div className="p-6 bg-neutral-50 rounded-lg border border-neutral-200">
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mb-4">
                    <FileText className="w-6 h-6 text-primary-600" strokeWidth={2} />
                  </div>
                  <h3 className="font-bold text-neutral-900 mb-2">Custom Solutions</h3>
                  <p className="text-sm text-neutral-600">
                    Get tailored pricing for your specific application requirements
                  </p>
                </div>
                <div className="p-6 bg-neutral-50 rounded-lg border border-neutral-200">
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mb-4">
                    <Clock className="w-6 h-6 text-primary-600" strokeWidth={2} />
                  </div>
                  <h3 className="font-bold text-neutral-900 mb-2">Fast Response</h3>
                  <p className="text-sm text-neutral-600">
                    Our team typically responds within 24 business hours
                  </p>
                </div>
                <div className="p-6 bg-neutral-50 rounded-lg border border-neutral-200">
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mb-4">
                    <CheckCircle className="w-6 h-6 text-primary-600" strokeWidth={2} />
                  </div>
                  <h3 className="font-bold text-neutral-900 mb-2">Expert Support</h3>
                  <p className="text-sm text-neutral-600">
                    Work directly with our technical specialists
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
                  className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-bold text-neutral-900">
                          Quote #{quote.id}
                        </h3>
                        {getStatusBadge(quote.status)}
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm mb-4">
                        <div>
                          <span className="text-neutral-500">Created:</span>{' '}
                          <span className="font-medium text-neutral-700">
                            {new Date(quote.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                        <div>
                          <span className="text-neutral-500">Expires:</span>{' '}
                          <span className="font-medium text-neutral-700">
                            {new Date(quote.expiresAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                        <div>
                          <span className="text-neutral-500">Items:</span>{' '}
                          <span className="font-medium text-neutral-700">
                            {quote.itemCount} {quote.itemCount === 1 ? 'item' : 'items'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row lg:flex-col gap-2">
                      <Link
                        href={`/account/quotes/${quote.id}`}
                        className="inline-flex items-center justify-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm rounded-lg transition-colors"
                      >
                        View Details
                      </Link>
                      {quote.status === 'pending' && (
                        <button
                          type="button"
                          className="inline-flex items-center justify-center px-4 py-2 border border-neutral-300 text-neutral-700 hover:bg-neutral-50 font-semibold text-sm rounded-lg transition-colors"
                        >
                          Cancel Request
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
    </main>
  );
}

// Helper function for status badges
function getStatusBadge(status: QuoteStatus) {
  const styles = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    reviewing: 'bg-blue-100 text-blue-800 border-blue-200',
    quoted: 'bg-green-100 text-green-800 border-green-200',
    declined: 'bg-red-100 text-red-800 border-red-200',
  };

  const icons = {
    pending: <Clock className="w-3.5 h-3.5" strokeWidth={2.5} />,
    reviewing: <FileText className="w-3.5 h-3.5" strokeWidth={2.5} />,
    quoted: <CheckCircle className="w-3.5 h-3.5" strokeWidth={2.5} />,
    declined: <XCircle className="w-3.5 h-3.5" strokeWidth={2.5} />,
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${styles[status]}`}
    >
      {icons[status]}
      {status.charAt(0).toUpperCase() + status.slice(1)}
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
