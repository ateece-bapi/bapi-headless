import { Metadata } from 'next';
import { Target, Heart, Users, Lightbulb } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Mission & Values | BAPI',
  description: 'Learn about BAPI mission, vision, and core values guiding our commitment to building automation excellence.',
};

export default function MissionValuesPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="bg-gradient-to-r from-primary-700 via-primary-500 to-primary-700 text-white py-16">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Target className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Mission & Values
            </h1>
            <p className="text-xl max-w-content mx-auto text-primary-50">
              Our commitment to excellence in building automation
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-neutral-900 mb-6 text-center">Our Mission</h2>
            <p className="text-xl text-neutral-700 text-center max-w-content mx-auto">
              To provide innovative, reliable building automation products that help our customers 
              create more efficient, comfortable, and sustainable buildings.
            </p>
          </div>

          <h2 className="text-3xl font-bold text-neutral-900 mb-8 text-center">Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-neutral-50 p-8 rounded-xl">
              <Target className="w-12 h-12 text-accent-500 mb-4" />
              <h3 className="text-xl font-bold text-neutral-900 mb-3">Quality First</h3>
              <p className="text-neutral-600">
                We never compromise on quality. Every product meets rigorous standards before it reaches our customers.
              </p>
            </div>

            <div className="bg-neutral-50 p-8 rounded-xl">
              <Users className="w-12 h-12 text-accent-500 mb-4" />
              <h3 className="text-xl font-bold text-neutral-900 mb-3">Customer Focus</h3>
              <p className="text-neutral-600">
                Our customers' success is our success. We listen, respond, and support every project.
              </p>
            </div>

            <div className="bg-neutral-50 p-8 rounded-xl">
              <Lightbulb className="w-12 h-12 text-accent-500 mb-4" />
              <h3 className="text-xl font-bold text-neutral-900 mb-3">Innovation</h3>
              <p className="text-neutral-600">
                We continuously improve our products with the latest technology and customer feedback.
              </p>
            </div>

            <div className="bg-neutral-50 p-8 rounded-xl">
              <Heart className="w-12 h-12 text-accent-500 mb-4" />
              <h3 className="text-xl font-bold text-neutral-900 mb-3">Integrity</h3>
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
