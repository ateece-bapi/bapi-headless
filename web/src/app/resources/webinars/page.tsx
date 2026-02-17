import { Metadata } from 'next';
import { Monitor, Calendar, AlertCircle, Users } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Webinars | BAPI Resources',
  description: 'Live and recorded webinars on building automation topics from BAPI experts.',
};

export default function WebinarsPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="bg-gradient-to-r from-primary-700 via-primary-500 to-primary-700 py-16 text-white">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Monitor className="mx-auto mb-4 h-16 w-16" />
            <h1 className="mb-4 text-4xl font-bold sm:text-5xl">Webinars</h1>
            <p className="mx-auto max-w-content text-xl text-primary-50">
              Educational webinars from BAPI experts
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-lg bg-accent-500 px-4 py-2 font-semibold text-neutral-900">
              <Calendar className="h-5 w-5" />
              Coming in Phase 2
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
          <div className="mb-12 rounded-xl border-2 border-primary-200 bg-primary-50 p-8">
            <div className="flex items-start gap-4">
              <AlertCircle className="mt-1 h-6 w-6 flex-shrink-0 text-primary-500" />
              <div>
                <h2 className="mb-2 text-xl font-bold text-neutral-900">
                  Webinar Program Launching Soon
                </h2>
                <p className="mb-4 text-neutral-700">
                  We&apos;re developing a comprehensive webinar program covering building automation best
                  practices, new technologies, and product deep-dives. This feature will be
                  available in Phase 2.
                </p>
                <p className="text-neutral-600">
                  Check back soon for upcoming webinar schedules and recordings.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <h2 className="mb-8 text-2xl font-bold text-neutral-900">Planned Webinar Topics</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="rounded-xl bg-neutral-50 p-6">
                <Monitor className="mx-auto mb-3 h-10 w-10 text-primary-500" />
                <h3 className="mb-2 font-bold text-neutral-900">Product Training</h3>
                <p className="text-sm text-neutral-600">In-depth product overviews</p>
              </div>
              <div className="rounded-xl bg-neutral-50 p-6">
                <Users className="mx-auto mb-3 h-10 w-10 text-primary-500" />
                <h3 className="mb-2 font-bold text-neutral-900">Best Practices</h3>
                <p className="text-sm text-neutral-600">Industry standards and tips</p>
              </div>
              <div className="rounded-xl bg-neutral-50 p-6">
                <Calendar className="mx-auto mb-3 h-10 w-10 text-primary-500" />
                <h3 className="mb-2 font-bold text-neutral-900">Live Q&A Sessions</h3>
                <p className="text-sm text-neutral-600">Interactive expert discussions</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-neutral-50 py-12">
        <div className="mx-auto max-w-content px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-2xl font-bold text-neutral-900">Stay Updated</h2>
          <p className="mb-6 text-neutral-600">
            Contact us to receive notifications about upcoming webinars
          </p>
          <a
            href="mailto:sales@bapihvac.com"
            className="inline-block rounded-xl bg-primary-500 px-8 py-3 font-bold text-white transition-colors hover:bg-primary-600"
          >
            Get Notified
          </a>
        </div>
      </section>
    </main>
  );
}
