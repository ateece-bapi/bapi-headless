import { Metadata } from 'next';
import { Monitor, Calendar, AlertCircle, Users } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Webinars | BAPI Resources',
  description: 'Live and recorded webinars on building automation topics from BAPI experts.',
};

export default function WebinarsPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="bg-gradient-to-r from-primary-700 via-primary-500 to-primary-700 text-white py-16">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Monitor className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Webinars
            </h1>
            <p className="text-xl max-w-content mx-auto text-primary-50">
              Educational webinars from BAPI experts
            </p>
            <div className="mt-6 inline-flex items-center gap-2 bg-accent-500 text-neutral-900 px-4 py-2 rounded-lg font-semibold">
              <Calendar className="w-5 h-5" />
              Coming in Phase 2
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary-50 border-2 border-primary-200 rounded-xl p-8 mb-12">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-primary-500 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-xl font-bold text-neutral-900 mb-2">
                  Webinar Program Launching Soon
                </h2>
                <p className="text-neutral-700 mb-4">
                  We're developing a comprehensive webinar program covering building automation 
                  best practices, new technologies, and product deep-dives. This feature will be 
                  available in Phase 2.
                </p>
                <p className="text-neutral-600">
                  Check back soon for upcoming webinar schedules and recordings.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-bold text-neutral-900 mb-8">
              Planned Webinar Topics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-neutral-50 p-6 rounded-xl">
                <Monitor className="w-10 h-10 text-primary-500 mx-auto mb-3" />
                <h3 className="font-bold text-neutral-900 mb-2">Product Training</h3>
                <p className="text-sm text-neutral-600">In-depth product overviews</p>
              </div>
              <div className="bg-neutral-50 p-6 rounded-xl">
                <Users className="w-10 h-10 text-primary-500 mx-auto mb-3" />
                <h3 className="font-bold text-neutral-900 mb-2">Best Practices</h3>
                <p className="text-sm text-neutral-600">Industry standards and tips</p>
              </div>
              <div className="bg-neutral-50 p-6 rounded-xl">
                <Calendar className="w-10 h-10 text-primary-500 mx-auto mb-3" />
                <h3 className="font-bold text-neutral-900 mb-2">Live Q&A Sessions</h3>
                <p className="text-sm text-neutral-600">Interactive expert discussions</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-neutral-50 py-12">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">
            Stay Updated
          </h2>
          <p className="text-neutral-600 mb-6">
            Contact us to receive notifications about upcoming webinars
          </p>
          <a
            href="mailto:sales@bapihvac.com"
            className="inline-block bg-primary-500 hover:bg-primary-600 text-white font-bold px-8 py-3 rounded-xl transition-colors"
          >
            Get Notified
          </a>
        </div>
      </section>
    </main>
  );
}
