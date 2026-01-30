import { Metadata } from 'next';
import { Newspaper, Calendar, TrendingUp } from 'lucide-react';

export const metadata: Metadata = {
  title: 'News & Updates | BAPI',
  description: 'Latest news, product announcements, and company updates from BAPI.',
};

export default function NewsPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="bg-gradient-to-r from-primary-700 via-primary-500 to-primary-700 text-white py-16">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Newspaper className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              News & Updates
            </h1>
            <p className="text-xl max-w-content mx-auto text-primary-50">
              Latest announcements from BAPI
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <article className="bg-white border-2 border-neutral-200 rounded-xl p-8 hover:border-primary-500 transition-all">
              <div className="flex items-start gap-4 mb-4">
                <Calendar className="w-6 h-6 text-primary-500 flex-shrink-0 mt-1" />
                <div>
                  <div className="text-sm text-neutral-500 mb-2">January 15, 2026</div>
                  <h2 className="text-2xl font-bold text-neutral-900 mb-3">
                    BAPI Launches New Wireless Product Line
                  </h2>
                  <p className="text-neutral-600 mb-4">
                    We're excited to announce the expansion of our wireless sensor line with improved 
                    battery life and enhanced connectivity features...
                  </p>
                  <button className="text-primary-500 hover:text-primary-600 font-semibold">
                    Read More →
                  </button>
                </div>
              </div>
            </article>

            <article className="bg-white border-2 border-neutral-200 rounded-xl p-8 hover:border-primary-500 transition-all">
              <div className="flex items-start gap-4 mb-4">
                <Calendar className="w-6 h-6 text-primary-500 flex-shrink-0 mt-1" />
                <div>
                  <div className="text-sm text-neutral-500 mb-2">December 10, 2025</div>
                  <h2 className="text-2xl font-bold text-neutral-900 mb-3">
                    BAPI Celebrates 40 Years in Business
                  </h2>
                  <p className="text-neutral-600 mb-4">
                    Four decades of innovation in building automation. Thank you to our customers and partners...
                  </p>
                  <button className="text-primary-500 hover:text-primary-600 font-semibold">
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
