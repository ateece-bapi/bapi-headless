import { Metadata } from 'next';
import { getPageBySlug } from '@/lib/wordpress';
import Link from 'next/link';
import { Target, Eye, Award, Users, Lightbulb, Shield, Heart, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Mission & Values | BAPI',
  description:
    "Learn about BAPI's mission, vision, and core values that drive our commitment to precision sensor solutions.",
};

// Cache for 1 hour (3600 seconds)
export const revalidate = 3600;

const coreValues = [
  {
    icon: Users,
    title: 'Quality',
    description:
      'We value our employees by encouraging open dialogue, a sense of community and work-life balance for a healthy culture.',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Award,
    title: 'Innovation',
    description:
      "We value processes and services that are metric driven to continually exceed our customers' expectations.",
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: Lightbulb,
    title: 'Collaborative Partnership',
    description:
      'We value new and improved solutions that are creative and unique, we continue to find ways to provide distinct advantages.',
    gradient: 'from-amber-500 to-orange-500',
  },
  {
    icon: Shield,
    title: 'Integrity & Ethics',
    description:
      'We value our collaborative partnerships that lead to superior solutions and facilitate healthy, productive, and comfortable environments.',
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    icon: Heart,
    title: 'Employees',
    description:
      'We value being deliberate, thoughtful and intentional with behaviors that match our every word.',
    gradient: 'from-red-500 to-rose-500',
  },
];

export default async function MissionValuesPage() {
  const page = await getPageBySlug('mission-and-values');

  if (!page) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="mb-4 text-4xl font-bold text-gray-900">Mission & Values</h1>
        <p className="text-lg text-gray-600">Content not found.</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 to-primary-800">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-primary-400/20 blur-3xl" />

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
            <span className="font-medium text-white">Mission & Values</span>
          </nav>

          {/* Header */}
          <div className="max-w-4xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
              <Target className="h-4 w-4" />
              Our Purpose
            </div>

            <h1 className="mb-6 text-5xl font-bold tracking-tight text-white md:text-6xl lg:text-7xl">
              Mission & Values
            </h1>

            <p className="text-xl leading-relaxed text-primary-50 md:text-2xl">
              For over 30 years, our mission and values have guided every decision we make, every
              product we design, and every customer relationship we build.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision Cards */}
      <section className="relative mx-auto -mt-16 max-w-7xl px-4 pb-20 sm:px-6 lg:px-8 lg:pb-28">
        <div className="mb-20 grid gap-8 md:grid-cols-2">
          {/* Mission Card */}
          <div className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-10 shadow-xl transition-all duration-500 hover:shadow-2xl">
            <div className="absolute right-0 top-0 h-64 w-64 -translate-y-1/2 translate-x-1/2 rounded-full bg-gradient-to-br from-blue-50 to-transparent" />

            <div className="relative">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg transition-transform duration-300 group-hover:scale-110">
                <Target className="h-8 w-8 text-white" />
              </div>

              <h2 className="mb-4 text-3xl font-bold text-gray-900">Mission</h2>

              <p className="text-lg leading-relaxed text-gray-700">
                At BAPI, we design, manufacture and deliver high quality sensor solutions, as well
                as provide high quality services for our business partners to effectively save their
                customers money and energy, therefore reducing dependency on natural resources.
              </p>
            </div>
          </div>

          {/* Vision Card */}
          <div className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-10 shadow-xl transition-all duration-500 hover:shadow-2xl">
            <div className="absolute right-0 top-0 h-64 w-64 -translate-y-1/2 translate-x-1/2 rounded-full bg-gradient-to-br from-purple-50 to-transparent" />

            <div className="relative">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg transition-transform duration-300 group-hover:scale-110">
                <Eye className="h-8 w-8 text-white" />
              </div>

              <h2 className="mb-4 text-3xl font-bold text-gray-900">Vision</h2>

              <p className="text-lg leading-relaxed text-gray-700">
                To grow as a global, innovative leader by providing unique, customer driven
                solutions while inspiring our employees to be their best, delivering quality
                products and services that exceed our customers' expectations.
              </p>
            </div>
          </div>
        </div>

        {/* Core Values Section */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold text-gray-900 lg:text-5xl">Our Core Values</h2>
          <p className="mx-auto max-w-3xl text-xl text-gray-600">
            These principles guide everything we do and shape the way we serve our customers and
            support our team.
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {coreValues.map((value, index) => {
            const Icon = value.icon;
            return (
              <div
                key={value.title}
                className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-all duration-500 hover:border-transparent hover:shadow-2xl"
                style={{ animationDelay: `${index * 75}ms` }}
              >
                {/* Gradient background on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${value.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-5`}
                />

                {/* Icon */}
                <div className="relative mb-6">
                  <div
                    className={`inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${value.gradient} shadow-lg transition-transform duration-300 group-hover:scale-110`}
                  >
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                </div>

                {/* Content */}
                <div className="relative">
                  <h3 className="mb-3 text-2xl font-bold text-gray-900">{value.title}</h3>

                  <p className="leading-relaxed text-gray-600">{value.description}</p>
                </div>

                {/* Decorative corner */}
                <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-gradient-to-br from-gray-50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="relative mt-20 overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 to-primary-700 p-10 shadow-2xl lg:p-16">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

          <div className="relative flex flex-col items-center justify-between gap-8 lg:flex-row">
            <div className="text-center lg:text-left">
              <h2 className="mb-3 text-3xl font-bold text-white lg:text-4xl">Join Our Mission</h2>
              <p className="max-w-2xl text-lg text-primary-50">
                We're always looking for talented individuals who share our values and passion for
                innovation. Explore opportunities to join the BAPI team.
              </p>
            </div>

            <Link
              href="/company/careers"
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-xl bg-white px-8 py-4 font-semibold text-primary-600 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              View Careers
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
