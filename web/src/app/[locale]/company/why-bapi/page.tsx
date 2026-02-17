import { Metadata } from 'next';
import { getPageBySlug } from '@/lib/wordpress';
import Link from 'next/link';
import { Star, Award, Shield, Clock, Users, Zap, CheckCircle2, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Why BAPI | BAPI',
  description:
    'Discover what sets BAPI apart in the building automation industry and why engineers trust our precision sensor solutions.',
};

// Cache for 1 hour (3600 seconds)
export const revalidate = 3600;

const differentiators = [
  {
    icon: Shield,
    title: '5-Year Warranty',
    description:
      'Our products are designed and manufactured to last. We back up that claim by offering a 5-year warranty across all our products.',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Award,
    title: 'BAPI-Backed Guarantee',
    description:
      'Most sensor manufacturers will replace their defective products, but only BAPI has the confidence to provide a product warranty.',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: Clock,
    title: 'Lifetime Limited Warranty',
    description:
      'A lifetime limited warranty is also available on many of our single point, room and non-room sensor models.',
    gradient: 'from-amber-500 to-orange-500',
  },
  {
    icon: Zap,
    title: '100% Testing',
    description:
      'Each and every BAPI product is tested at multiple stages in the manufacturing process to ensure precision and reliability.',
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    icon: Users,
    title: 'Customer Focus',
    description:
      'At BAPI, we strive to be leaders in our industry by providing innovative, high quality products and services designed with you in mind.',
    gradient: 'from-red-500 to-rose-500',
  },
  {
    icon: Star,
    title: 'Another Original',
    description:
      'Products displaying the "Another Original" stamp are unique to BAPI and inspired by our customers, employees and vendors.',
    gradient: 'from-indigo-500 to-violet-500',
  },
];

const keyFeatures = [
  '100% Compatibility Guarantee',
  'CE Certified & RoHS Compliant',
  'NIST Traceable Precision Instruments',
  'Computer Aided Production Stations',
  'Over 30 Years of Experience',
  'Global Distribution Network',
];

export default async function WhyBapiPage() {
  const page = await getPageBySlug('why-bapi');

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 to-primary-800">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="absolute right-0 top-0 h-[600px] w-[600px] -translate-y-1/3 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-96 w-96 translate-y-1/3 rounded-full bg-primary-400/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          {/* Breadcrumb */}
          <nav className="mb-8 flex items-center gap-2 text-sm text-primary-100">
            <Link href="/" className="transition-colors hover:text-white">
              Home
            </Link>
            <span>/</span>
            <Link href="/company" className="transition-colors hover:text-white">
              Company
            </Link>
            <span>/</span>
            <span className="font-medium text-white">Why BAPI</span>
          </nav>

          {/* Header */}
          <div className="max-w-4xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
              <Star className="h-4 w-4" />
              What Sets Us Apart
            </div>

            <h1 className="mb-6 text-5xl font-bold tracking-tight text-white md:text-6xl lg:text-7xl">
              Why BAPI?
            </h1>

            <p className="mb-8 text-xl leading-relaxed text-primary-50 md:text-2xl">
              BAPI has been changing the way you think about sensors since 1993. We believe sensors
              are not simple commodities—they are integral to building automation systems and
              critical to saving energy.
            </p>

            {/* Key Stats */}
            <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
              <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
                <div className="mb-1 text-3xl font-bold text-white">30+</div>
                <div className="text-sm text-primary-100">Years of Excellence</div>
              </div>
              <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
                <div className="mb-1 text-3xl font-bold text-white">5 Year</div>
                <div className="text-sm text-primary-100">Warranty Standard</div>
              </div>
              <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
                <div className="mb-1 text-3xl font-bold text-white">100%</div>
                <div className="text-sm text-primary-100">Product Testing</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Differentiators Grid */}
      <section className="relative mx-auto -mt-16 max-w-7xl px-4 pb-20 sm:px-6 lg:px-8 lg:pb-28">
        <div className="mb-20 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {differentiators.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-8 shadow-xl transition-all duration-500 hover:border-transparent hover:shadow-2xl"
                style={{ animationDelay: `${index * 75}ms` }}
              >
                {/* Gradient background on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-5`}
                />

                {/* Icon */}
                <div className="relative mb-6">
                  <div
                    className={`inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${item.gradient} shadow-lg transition-transform duration-300 group-hover:scale-110`}
                  >
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                </div>

                {/* Content */}
                <div className="relative">
                  <h3 className="mb-3 text-2xl font-bold text-gray-900">{item.title}</h3>

                  <p className="leading-relaxed text-gray-600">{item.description}</p>
                </div>

                {/* Decorative corner */}
                <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-gradient-to-br from-gray-50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </div>
            );
          })}
        </div>

        {/* Key Features Section */}
        <div className="mb-20 rounded-2xl bg-gradient-to-br from-gray-50 to-white p-10 shadow-lg lg:p-16">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-2 text-sm font-medium text-primary-700">
                <CheckCircle2 className="h-4 w-4" />
                Quality Standards
              </div>

              <h2 className="mb-4 text-4xl font-bold text-gray-900">The Extra Steps We Take</h2>

              <p className="mb-6 text-lg leading-relaxed text-gray-600">
                In addition to our exceptional people, BAPI uses only the highest quality sensing
                elements and meticulous manufacturing, testing and quality assurance procedures.
              </p>
            </div>

            <div className="grid gap-4">
              {keyFeatures.map((feature, index) => (
                <div
                  key={feature}
                  className="flex items-center gap-3 rounded-lg bg-white p-4 shadow-sm transition-shadow duration-300 hover:shadow-md"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-primary-600">
                    <CheckCircle2 className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-medium text-gray-900">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 to-primary-700 p-10 shadow-2xl lg:p-16">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
          <div className="absolute right-0 top-0 h-96 w-96 -translate-y-1/2 translate-x-1/2 rounded-full bg-white/10 blur-3xl" />

          <div className="relative flex flex-col items-center justify-between gap-8 lg:flex-row">
            <div className="text-center lg:text-left">
              <h2 className="mb-3 text-3xl font-bold text-white lg:text-4xl">
                Ready to Experience the BAPI Difference?
              </h2>
              <p className="max-w-2xl text-lg text-primary-50">
                Let&apos;s discuss how our precision sensor solutions can benefit your next project. Our
                team is ready to help you find the perfect solution.
              </p>
            </div>

            <Link
              href="/company/contact-us"
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-xl bg-white px-8 py-4 font-semibold text-primary-600 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              Contact Us
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
