import { Metadata } from 'next';
import { Target, Heart, Users, Lightbulb } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Mission & Values | BAPI',
  description:
    'Learn about BAPI mission, vision, and core values guiding our commitment to building automation excellence.',
};

export default function MissionValuesPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="bg-gradient-to-r from-primary-700 via-primary-500 to-primary-700 py-16 text-white">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Target className="mx-auto mb-4 h-16 w-16" />
            <h1 className="mb-4 text-4xl font-bold sm:text-5xl">Mission & Values</h1>
            <p className="mx-auto max-w-content text-xl text-primary-50">
              Our commitment to excellence in building automation
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <h2 className="mb-6 text-center text-3xl font-bold text-neutral-900">Our Mission</h2>
            <p className="mx-auto max-w-content text-center text-xl text-neutral-700">
              To provide innovative, reliable building automation products that help our customers
              create more efficient, comfortable, and sustainable buildings.
            </p>
          </div>

          <h2 className="mb-8 text-center text-3xl font-bold text-neutral-900">Core Values</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="rounded-xl bg-neutral-50 p-8">
              <Target className="mb-4 h-12 w-12 text-accent-500" />
              <h3 className="mb-3 text-xl font-bold text-neutral-900">Quality First</h3>
              <p className="text-neutral-600">
                We never compromise on quality. Every product meets rigorous standards before it
                reaches our customers.
              </p>
            </div>

            <div className="rounded-xl bg-neutral-50 p-8">
              <Users className="mb-4 h-12 w-12 text-accent-500" />
              <h3 className="mb-3 text-xl font-bold text-neutral-900">Customer Focus</h3>
              <p className="text-neutral-600">
                Our customers&apos; success is our success. We listen, respond, and support every
                project.
              </p>
            </div>

            <div className="rounded-xl bg-neutral-50 p-8">
              <Lightbulb className="mb-4 h-12 w-12 text-accent-500" />
              <h3 className="mb-3 text-xl font-bold text-neutral-900">Innovation</h3>
              <p className="text-neutral-600">
                We continuously improve our products with the latest technology and customer
                feedback.
              </p>
            </div>

            <div className="rounded-xl bg-neutral-50 p-8">
              <Heart className="mb-4 h-12 w-12 text-accent-500" />
              <h3 className="mb-3 text-xl font-bold text-neutral-900">Integrity</h3>
              <p className="text-neutral-600">
                We operate with honesty, transparency, and respect in all our relationships.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
