import { Metadata } from 'next';
import Link from 'next/link';
import { Wind, Droplet, Gauge, AlertCircle, TrendingUp, CheckCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Air Quality Sensors | BAPI',
  description: 'BAPI air quality sensors for CO₂, VOC, and particulate matter monitoring in commercial buildings.',
};

export default function AirQualityPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-700 via-primary-500 to-primary-700 text-white py-16">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Wind className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Air Quality Sensors
            </h1>
            <p className="text-xl max-w-content mx-auto text-primary-50">
              Monitor CO₂, VOC, and particulate matter for healthier indoor environments
            </p>
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="py-16">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link
              href="/products?category=co2"
              className="bg-neutral-50 p-8 rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all"
            >
              <Gauge className="w-12 h-12 text-primary-500 mb-4" />
              <h3 className="text-2xl font-bold text-neutral-900 mb-3">CO₂ Sensors</h3>
              <p className="text-neutral-600 mb-4">
                NDIR technology for accurate carbon dioxide measurement in demand control ventilation applications.
              </p>
              <div className="text-primary-500 font-semibold flex items-center gap-2">
                View Products
                <span>→</span>
              </div>
            </Link>

            <Link
              href="/products?category=voc"
              className="bg-neutral-50 p-8 rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all"
            >
              <AlertCircle className="w-12 h-12 text-primary-500 mb-4" />
              <h3 className="text-2xl font-bold text-neutral-900 mb-3">VOC Sensors</h3>
              <p className="text-neutral-600 mb-4">
                Volatile organic compound sensors for monitoring indoor air quality and controlling ventilation.
              </p>
              <div className="text-primary-500 font-semibold flex items-center gap-2">
                View Products
                <span>→</span>
              </div>
            </Link>

            <Link
              href="/products?category=particulate"
              className="bg-neutral-50 p-8 rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all"
            >
              <Wind className="w-12 h-12 text-primary-500 mb-4" />
              <h3 className="text-2xl font-bold text-neutral-900 mb-3">PM Sensors</h3>
              <p className="text-neutral-600 mb-4">
                Particulate matter sensors for PM2.5 and PM10 monitoring in cleanrooms and sensitive environments.
              </p>
              <div className="text-primary-500 font-semibold flex items-center gap-2">
                View Products
                <span>→</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-neutral-50">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-neutral-900 mb-12 text-center">
            Why Monitor Indoor Air Quality?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl border-2 border-neutral-200">
              <CheckCircle className="w-10 h-10 text-green-600 mb-4" />
              <h3 className="text-xl font-bold text-neutral-900 mb-3">Health & Comfort</h3>
              <p className="text-neutral-600">
                Poor indoor air quality can cause headaches, fatigue, and reduced productivity. 
                Monitoring ensures occupant comfort and well-being.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border-2 border-neutral-200">
              <TrendingUp className="w-10 h-10 text-green-600 mb-4" />
              <h3 className="text-xl font-bold text-neutral-900 mb-3">Energy Savings</h3>
              <p className="text-neutral-600">
                Demand control ventilation based on actual occupancy and air quality can reduce 
                HVAC energy consumption by 20-30%.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border-2 border-neutral-200">
              <CheckCircle className="w-10 h-10 text-green-600 mb-4" />
              <h3 className="text-xl font-bold text-neutral-900 mb-3">Building Codes</h3>
              <p className="text-neutral-600">
                Many building codes now require CO₂ monitoring for demand control ventilation 
                in commercial spaces with variable occupancy.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border-2 border-neutral-200">
              <TrendingUp className="w-10 h-10 text-green-600 mb-4" />
              <h3 className="text-xl font-bold text-neutral-900 mb-3">Green Certifications</h3>
              <p className="text-neutral-600">
                LEED and WELL certifications reward buildings with advanced air quality 
                monitoring and control systems.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Applications */}
      <section className="py-16">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-neutral-900 mb-12 text-center">
            Common Applications
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-neutral-50 rounded-xl">
              <h4 className="font-bold text-neutral-900 mb-2">Schools & Universities</h4>
              <p className="text-sm text-neutral-600">
                Improve student performance with better air quality
              </p>
            </div>

            <div className="text-center p-6 bg-neutral-50 rounded-xl">
              <h4 className="font-bold text-neutral-900 mb-2">Office Buildings</h4>
              <p className="text-sm text-neutral-600">
                Boost productivity and reduce sick days
              </p>
            </div>

            <div className="text-center p-6 bg-neutral-50 rounded-xl">
              <h4 className="font-bold text-neutral-900 mb-2">Healthcare Facilities</h4>
              <p className="text-sm text-neutral-600">
                Maintain critical air quality standards
              </p>
            </div>

            <div className="text-center p-6 bg-neutral-50 rounded-xl">
              <h4 className="font-bold text-neutral-900 mb-2">Retail & Hospitality</h4>
              <p className="text-sm text-neutral-600">
                Create comfortable environments for customers
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-700 via-primary-500 to-primary-700 text-white">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Improve Your Indoor Air Quality?
          </h2>
          <p className="text-xl mb-8 text-primary-50">
            Our technical team can help you select the right sensors
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/request-quote"
              className="bg-accent-500 hover:bg-accent-600 text-neutral-900 font-bold px-8 py-3 rounded-xl transition-colors"
            >
              Request a Quote
            </Link>
            <Link
              href="/contact"
              className="bg-white hover:bg-neutral-100 text-primary-500 font-bold px-8 py-3 rounded-xl transition-colors"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
