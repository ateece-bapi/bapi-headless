import { Metadata } from 'next';
import { Video, Play, Calendar, AlertCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Video Library | BAPI Resources',
  description: 'Product demonstrations, installation guides, and technical videos from BAPI.',
};

export default function VideosPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="bg-gradient-to-r from-primary-700 via-primary-500 to-primary-700 text-white py-16">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Video className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Video Library
            </h1>
            <p className="text-xl max-w-content mx-auto text-primary-50">
              Product demos, tutorials, and technical guides
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
                  Video Library Launching Soon
                </h2>
                <p className="text-neutral-700 mb-4">
                  We're preparing a comprehensive video library with product demonstrations, 
                  installation guides, and technical tutorials. This feature will be available 
                  in Phase 2.
                </p>
                <p className="text-neutral-600">
                  In the meantime, contact our technical support team for product assistance.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-bold text-neutral-900 mb-8">
              Planned Video Categories
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-neutral-50 p-6 rounded-xl">
                <Play className="w-10 h-10 text-primary-500 mx-auto mb-3" />
                <h3 className="font-bold text-neutral-900 mb-2">Product Demos</h3>
                <p className="text-sm text-neutral-600">Features and capabilities</p>
              </div>
              <div className="bg-neutral-50 p-6 rounded-xl">
                <Video className="w-10 h-10 text-primary-500 mx-auto mb-3" />
                <h3 className="font-bold text-neutral-900 mb-2">Installation Guides</h3>
                <p className="text-sm text-neutral-600">Step-by-step tutorials</p>
              </div>
              <div className="bg-neutral-50 p-6 rounded-xl">
                <Play className="w-10 h-10 text-primary-500 mx-auto mb-3" />
                <h3 className="font-bold text-neutral-900 mb-2">Technical Training</h3>
                <p className="text-sm text-neutral-600">Advanced topics</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-neutral-50 py-12">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">
            Need Support Now?
          </h2>
          <p className="text-neutral-600 mb-6">
            Contact our technical team for immediate assistance
          </p>
          <a
            href="/support"
            className="inline-block bg-primary-500 hover:bg-primary-600 text-white font-bold px-8 py-3 rounded-xl transition-colors"
          >
            Contact Support
          </a>
        </div>
      </section>
    </main>
  );
}
