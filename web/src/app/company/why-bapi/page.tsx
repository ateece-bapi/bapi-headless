import { Metadata } from 'next';
import { Target, Award, Users, TrendingUp } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Why Choose BAPI | Building Automation Products',
  description:
    'Learn why engineers and contractors trust BAPI for building automation sensors and controls. Quality, reliability, and expert support.',
};

export default function WhyBAPIPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-700 via-primary-500 to-primary-700 py-16 text-white">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Target className="mx-auto mb-4 h-16 w-16" />
            <h1 className="mb-4 text-4xl font-bold sm:text-5xl">Why Choose BAPI?</h1>
            <p className="mx-auto max-w-content text-xl text-primary-50">
              Quality products, expert support, and 40+ years of reliability
            </p>
          </div>
        </div>
      </section>

      {/* Reasons */}
      <section className="py-16">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="rounded-xl bg-neutral-50 p-8">
              <Award className="mb-4 h-12 w-12 text-accent-500" />
              <h3 className="mb-3 text-2xl font-bold text-neutral-900">Proven Quality</h3>
              <p className="text-neutral-600">
                Every BAPI product is designed and manufactured to the highest standards. We stand
                behind our work with industry-leading warranties and rigorous testing.
              </p>
            </div>

            <div className="rounded-xl bg-neutral-50 p-8">
              <Users className="mb-4 h-12 w-12 text-accent-500" />
              <h3 className="mb-3 text-2xl font-bold text-neutral-900">Expert Support</h3>
              <p className="text-neutral-600">
                Our technical support team works directly with engineers and contractors to ensure
                successful installations and optimal performance.
              </p>
            </div>

            <div className="rounded-xl bg-neutral-50 p-8">
              <TrendingUp className="mb-4 h-12 w-12 text-accent-500" />
              <h3 className="mb-3 text-2xl font-bold text-neutral-900">Continuous Innovation</h3>
              <p className="text-neutral-600">
                We invest in R&D to bring you the latest technology, from wireless sensors to
                cloud-based monitoring solutions.
              </p>
            </div>

            <div className="rounded-xl bg-neutral-50 p-8">
              <Target className="mb-4 h-12 w-12 text-accent-500" />
              <h3 className="mb-3 text-2xl font-bold text-neutral-900">Made in USA</h3>
              <p className="text-neutral-600">
                All BAPI products are designed and manufactured in Wisconsin, ensuring quality
                control and supporting American manufacturing.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
