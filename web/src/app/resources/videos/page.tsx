import { Metadata } from 'next';
import Link from 'next/link';
import { Video, Play, Calendar, AlertCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Video Library | BAPI Resources',
  description: 'Product demonstrations, installation guides, and technical videos from BAPI.',
};

export default function VideosPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="bg-gradient-to-r from-primary-700 via-primary-500 to-primary-700 py-16 text-white">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Video className="mx-auto mb-4 h-16 w-16" />
            <h1 className="mb-4 text-4xl font-bold sm:text-5xl">Video Library</h1>
            <p className="mx-auto max-w-content text-xl text-primary-50">
              Product demos, tutorials, and technical guides
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
                  Video Library Launching Soon
                </h2>
                <p className="mb-4 text-neutral-700">
                  We&apos;re preparing a comprehensive video library with product demonstrations,
                  installation guides, and technical tutorials. This feature will be available in
                  Phase 2.
                </p>
                <p className="text-neutral-600">
                  In the meantime, contact our technical support team for product assistance.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <h2 className="mb-8 text-2xl font-bold text-neutral-900">Planned Video Categories</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="rounded-xl bg-neutral-50 p-6">
                <Play className="mx-auto mb-3 h-10 w-10 text-primary-500" />
                <h3 className="mb-2 font-bold text-neutral-900">Product Demos</h3>
                <p className="text-sm text-neutral-600">Features and capabilities</p>
              </div>
              <div className="rounded-xl bg-neutral-50 p-6">
                <Video className="mx-auto mb-3 h-10 w-10 text-primary-500" />
                <h3 className="mb-2 font-bold text-neutral-900">Installation Guides</h3>
                <p className="text-sm text-neutral-600">Step-by-step tutorials</p>
              </div>
              <div className="rounded-xl bg-neutral-50 p-6">
                <Play className="mx-auto mb-3 h-10 w-10 text-primary-500" />
                <h3 className="mb-2 font-bold text-neutral-900">Technical Training</h3>
                <p className="text-sm text-neutral-600">Advanced topics</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-neutral-50 py-12">
        <div className="mx-auto max-w-content px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-2xl font-bold text-neutral-900">Need Support Now?</h2>
          <p className="mb-6 text-neutral-600">
            Contact our technical team for immediate assistance
          </p>
          <Link
            href="/support"
            className="inline-block rounded-xl bg-primary-500 px-8 py-3 font-bold text-white transition-colors hover:bg-primary-600"
          >
            Contact Support
          </Link>
        </div>
      </section>
    </main>
  );
}
