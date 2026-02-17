import { Metadata } from 'next';
import { Newspaper, Calendar, TrendingUp } from 'lucide-react';

export const metadata: Metadata = {
  title: 'News & Updates | BAPI',
  description: 'Latest news, product announcements, and company updates from BAPI.',
};

export default function NewsPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="bg-gradient-to-r from-primary-700 via-primary-500 to-primary-700 py-16 text-white">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Newspaper className="mx-auto mb-4 h-16 w-16" />
            <h1 className="mb-4 text-4xl font-bold sm:text-5xl">News & Updates</h1>
            <p className="mx-auto max-w-content text-xl text-primary-50">
              Latest announcements from BAPI
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <article className="rounded-xl border-2 border-neutral-200 bg-white p-8 transition-all hover:border-primary-500">
              <div className="mb-4 flex items-start gap-4">
                <Calendar className="mt-1 h-6 w-6 flex-shrink-0 text-primary-500" />
                <div>
                  <div className="mb-2 text-sm text-neutral-500">January 15, 2026</div>
                  <h2 className="mb-3 text-2xl font-bold text-neutral-900">
                    BAPI Launches New Wireless Product Line
                  </h2>
                  <p className="mb-4 text-neutral-600">
                    We&apos;re excited to announce the expansion of our wireless sensor line with
                    improved battery life and enhanced connectivity features...
                  </p>
                  <button className="font-semibold text-primary-500 hover:text-primary-600">
                    Read More →
                  </button>
                </div>
              </div>
            </article>

            <article className="rounded-xl border-2 border-neutral-200 bg-white p-8 transition-all hover:border-primary-500">
              <div className="mb-4 flex items-start gap-4">
                <Calendar className="mt-1 h-6 w-6 flex-shrink-0 text-primary-500" />
                <div>
                  <div className="mb-2 text-sm text-neutral-500">December 10, 2025</div>
                  <h2 className="mb-3 text-2xl font-bold text-neutral-900">
                    BAPI Celebrates 40 Years in Business
                  </h2>
                  <p className="mb-4 text-neutral-600">
                    Four decades of innovation in building automation. Thank you to our customers
                    and partners...
                  </p>
                  <button className="font-semibold text-primary-500 hover:text-primary-600">
                    Read More →
                  </button>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
