import { Metadata } from 'next';
import Link from 'next/link';
import { Wind, Droplet, Gauge, AlertCircle, TrendingUp, CheckCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Air Quality Sensors | BAPI',
  description:
    'BAPI air quality sensors for CO₂, VOC, and particulate matter monitoring in commercial buildings.',
};

export default function AirQualityPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-700 via-primary-500 to-primary-700 py-16 text-white">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Wind className="mx-auto mb-4 h-16 w-16" />
            <h1 className="mb-4 text-4xl font-bold sm:text-5xl">Air Quality Sensors</h1>
            <p className="mx-auto max-w-content text-xl text-primary-50">
              Monitor CO₂, VOC, and particulate matter for healthier indoor environments
            </p>
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="py-16">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <Link
              href="/products?category=co2"
              className="rounded-xl bg-neutral-50 p-8 transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <Gauge className="mb-4 h-12 w-12 text-primary-500" />
              <h3 className="mb-3 text-2xl font-bold text-neutral-900">CO₂ Sensors</h3>
              <p className="mb-4 text-neutral-600">
                NDIR technology for accurate carbon dioxide measurement in demand control
                ventilation applications.
              </p>
              <div className="flex items-center gap-2 font-semibold text-primary-500">
                View Products
                <span>→</span>
              </div>
            </Link>

            <Link
              href="/products?category=voc"
              className="rounded-xl bg-neutral-50 p-8 transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <AlertCircle className="mb-4 h-12 w-12 text-primary-500" />
              <h3 className="mb-3 text-2xl font-bold text-neutral-900">VOC Sensors</h3>
              <p className="mb-4 text-neutral-600">
                Volatile organic compound sensors for monitoring indoor air quality and controlling
                ventilation.
              </p>
              <div className="flex items-center gap-2 font-semibold text-primary-500">
                View Products
                <span>→</span>
              </div>
            </Link>

            <Link
              href="/products?category=particulate"
              className="rounded-xl bg-neutral-50 p-8 transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <Wind className="mb-4 h-12 w-12 text-primary-500" />
              <h3 className="mb-3 text-2xl font-bold text-neutral-900">PM Sensors</h3>
              <p className="mb-4 text-neutral-600">
                Particulate matter sensors for PM2.5 and PM10 monitoring in cleanrooms and sensitive
                environments.
              </p>
              <div className="flex items-center gap-2 font-semibold text-primary-500">
                View Products
                <span>→</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-neutral-50 py-16">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <h2 className="mb-12 text-center text-3xl font-bold text-neutral-900">
            Why Monitor Indoor Air Quality?
          </h2>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="rounded-xl border-2 border-neutral-200 bg-white p-6">
              <CheckCircle className="mb-4 h-10 w-10 text-green-600" />
              <h3 className="mb-3 text-xl font-bold text-neutral-900">Health & Comfort</h3>
              <p className="text-neutral-600">
                Poor indoor air quality can cause headaches, fatigue, and reduced productivity.
                Monitoring ensures occupant comfort and well-being.
              </p>
            </div>

            <div className="rounded-xl border-2 border-neutral-200 bg-white p-6">
              <TrendingUp className="mb-4 h-10 w-10 text-green-600" />
              <h3 className="mb-3 text-xl font-bold text-neutral-900">Energy Savings</h3>
              <p className="text-neutral-600">
                Demand control ventilation based on actual occupancy and air quality can reduce HVAC
                energy consumption by 20-30%.
              </p>
            </div>

            <div className="rounded-xl border-2 border-neutral-200 bg-white p-6">
              <CheckCircle className="mb-4 h-10 w-10 text-green-600" />
              <h3 className="mb-3 text-xl font-bold text-neutral-900">Building Codes</h3>
              <p className="text-neutral-600">
                Many building codes now require CO₂ monitoring for demand control ventilation in
                commercial spaces with variable occupancy.
              </p>
            </div>

            <div className="rounded-xl border-2 border-neutral-200 bg-white p-6">
              <TrendingUp className="mb-4 h-10 w-10 text-green-600" />
              <h3 className="mb-3 text-xl font-bold text-neutral-900">Green Certifications</h3>
              <p className="text-neutral-600">
                LEED and WELL certifications reward buildings with advanced air quality monitoring
                and control systems.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Applications */}
      <section className="py-16">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <h2 className="mb-12 text-center text-3xl font-bold text-neutral-900">
            Common Applications
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl bg-neutral-50 p-6 text-center">
              <h4 className="mb-2 font-bold text-neutral-900">Schools & Universities</h4>
              <p className="text-sm text-neutral-600">
                Improve student performance with better air quality
              </p>
            </div>

            <div className="rounded-xl bg-neutral-50 p-6 text-center">
              <h4 className="mb-2 font-bold text-neutral-900">Office Buildings</h4>
              <p className="text-sm text-neutral-600">Boost productivity and reduce sick days</p>
            </div>

            <div className="rounded-xl bg-neutral-50 p-6 text-center">
              <h4 className="mb-2 font-bold text-neutral-900">Healthcare Facilities</h4>
              <p className="text-sm text-neutral-600">Maintain critical air quality standards</p>
            </div>

            <div className="rounded-xl bg-neutral-50 p-6 text-center">
              <h4 className="mb-2 font-bold text-neutral-900">Retail & Hospitality</h4>
              <p className="text-sm text-neutral-600">
                Create comfortable environments for customers
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary-700 via-primary-500 to-primary-700 py-16 text-white">
        <div className="mx-auto max-w-content px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-3xl font-bold">Ready to Improve Your Indoor Air Quality?</h2>
          <p className="mb-8 text-xl text-primary-50">
            Our technical team can help you select the right sensors
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/request-quote"
              className="rounded-xl bg-accent-500 px-8 py-3 font-bold text-neutral-900 transition-colors hover:bg-accent-600"
            >
              Request a Quote
            </Link>
            <Link
              href="/contact"
              className="rounded-xl bg-white px-8 py-3 font-bold text-primary-500 transition-colors hover:bg-neutral-100"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
