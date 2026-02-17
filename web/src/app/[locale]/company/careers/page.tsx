import { Metadata } from 'next';
import { getPageBySlug } from '@/lib/wordpress';
import Link from 'next/link';
import {
  Briefcase,
  Heart,
  Users,
  TrendingUp,
  Shield,
  Gift,
  Plane,
  GraduationCap,
  Dumbbell,
  DollarSign,
  FileText,
  Mail,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Careers | BAPI',
  description: 'Join the BAPI team and help us shape the future of building automation technology.',
};

// Cache for 1 hour (3600 seconds)
export const revalidate = 3600;

const benefits = [
  {
    icon: Shield,
    title: 'Health Insurance',
    description: 'Comprehensive health, dental, and vision coverage for you and your family.',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: DollarSign,
    title: 'Competitive Compensation',
    description: 'Industry-leading salaries with regular performance reviews and merit increases.',
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    icon: Plane,
    title: 'Paid Holidays',
    description: 'Generous paid time off including holidays, vacation days, and personal time.',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: TrendingUp,
    title: '401(k) Match',
    description: 'Company match on retirement contributions to help secure your future.',
    gradient: 'from-amber-500 to-orange-500',
  },
  {
    icon: Heart,
    title: 'Life Insurance',
    description: 'Company-paid life insurance coverage with options for additional coverage.',
    gradient: 'from-red-500 to-rose-500',
  },
  {
    icon: GraduationCap,
    title: 'Professional Development',
    description: 'Continuous learning opportunities, training programs, and career advancement.',
    gradient: 'from-indigo-500 to-violet-500',
  },
];

const cultureValues = [
  {
    title: 'BAPI Offers',
    items: [
      'Competitive Compensation',
      'Health Insurance',
      'Vision & Dental',
      'Health Savings Account',
      '401(k) with company match',
    ],
  },
  {
    title: 'Time Off',
    items: [
      'Paid company holidays',
      'Short and Long-Term Disability through AFLAC',
      'Life Insurance',
    ],
  },
  {
    title: 'Work Environment',
    items: [
      'A board seat awaits open facility',
      'Positive, inclusive culture',
      'Work-life balance with family oriented employee benefits',
    ],
  },
];

export default async function CareersPage() {
  const page = await getPageBySlug('careers');

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30">
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
            <span className="font-medium text-white">Careers</span>
          </nav>

          {/* Header */}
          <div className="max-w-4xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
              <Briefcase className="h-4 w-4" />
              Join Our Team
            </div>

            <h1 className="mb-6 text-5xl font-bold tracking-tight text-white md:text-6xl lg:text-7xl">
              Build Your Career at BAPI
            </h1>

            <p className="mb-8 text-xl leading-relaxed text-primary-50 md:text-2xl">
              BAPI supports a culture of work-life balance with family oriented employee benefits
              such as company picnics & holiday parties, aesthetic wellness initiatives, exercise
              programs and much more. We are an Equal Opportunity Employer (EOP) and we are
              committed to creating an inclusive work environment for all employees.
            </p>

            <div className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-6 py-3 backdrop-blur-sm">
              <Sparkles className="h-5 w-5 text-yellow-300" />
              <span className="font-medium text-white">We&apos;re excited to meet you!</span>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="relative mx-auto -mt-16 max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mb-20 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={benefit.title}
                className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-8 shadow-xl transition-all duration-500 hover:border-transparent hover:shadow-2xl"
                style={{ animationDelay: `${index * 75}ms` }}
              >
                {/* Gradient background on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${benefit.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-5`}
                />

                {/* Icon */}
                <div className="relative mb-6">
                  <div
                    className={`inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${benefit.gradient} shadow-lg transition-transform duration-300 group-hover:scale-110`}
                  >
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                </div>

                {/* Content */}
                <div className="relative">
                  <h3 className="mb-3 text-2xl font-bold text-gray-900">{benefit.title}</h3>

                  <p className="leading-relaxed text-gray-600">{benefit.description}</p>
                </div>

                {/* Decorative corner */}
                <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-gradient-to-br from-gray-50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </div>
            );
          })}
        </div>

        {/* Culture & Benefits Details */}
        <div className="mb-20 rounded-2xl bg-gradient-to-br from-gray-50 to-white p-10 shadow-lg lg:p-16">
          <div className="mb-12 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-2 text-sm font-medium text-primary-700">
              <Gift className="h-4 w-4" />
              What We Offer
            </div>
            <h2 className="mb-4 text-4xl font-bold text-gray-900">More Than Just a Job</h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              BAPI supports a culture of work-life balance with family oriented employee benefits.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {cultureValues.map((category, categoryIndex) => (
              <div
                key={category.title}
                className="rounded-xl bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-md"
                style={{ animationDelay: `${categoryIndex * 100}ms` }}
              >
                <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-900">
                  <div className="h-2 w-2 rounded-full bg-gradient-to-r from-primary-500 to-primary-600" />
                  {category.title}
                </h3>
                <ul className="space-y-3">
                  {category.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary-500" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* How to Apply Section */}
        <div className="mb-20 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 p-10 lg:p-16">
          <div className="mx-auto max-w-3xl">
            <div className="mb-10 text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
                <FileText className="h-4 w-4" />
                Application Process
              </div>
              <h2 className="mb-4 text-4xl font-bold text-gray-900">How to Apply</h2>
              <p className="text-lg text-gray-700">
                We ONLY accept and consider complete electronic applications submitted directly
                through the <strong>www.bapihvac.com/careers</strong> webpage.
              </p>
            </div>

            <div className="mb-8 rounded-xl bg-white p-8 shadow-md">
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 font-bold text-white">
                    1
                  </div>
                  <div>
                    <h3 className="mb-2 font-bold text-gray-900">Complete Application</h3>
                    <p className="text-gray-600">
                      Most positions will require a <strong>Resume</strong> and a separate{' '}
                      <strong>Cover Letter</strong>
                      to be considered a &quot;complete&quot; electronic application.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 font-bold text-white">
                    2
                  </div>
                  <div>
                    <h3 className="mb-2 font-bold text-gray-900">Direct Submission</h3>
                    <p className="text-gray-600">
                      Cover Letters must be uploaded directly as attachments via online application
                      system.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-500 font-bold text-white">
                    3
                  </div>
                  <div>
                    <h3 className="mb-2 font-bold text-gray-900">Equal Opportunity</h3>
                    <p className="text-gray-600">
                      BAPI is an Equal Opportunity Employer (EOP). If you are unable to apply online
                      or require alternative methods of application or screening, please identify
                      cultural origin, disability or veteran status.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-blue-600 p-6 text-center text-white">
              <p className="mb-4">
                <strong>For questions or help with online applications:</strong>
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <a
                  href="mailto:careers@bapihvac.com"
                  className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-blue-600 transition-all duration-300 hover:shadow-lg"
                >
                  <Mail className="h-5 w-5" />
                  careers@bapihvac.com
                </a>
                <span className="text-blue-100">or call</span>
                <a
                  href="tel:+16087534400"
                  className="font-bold transition-colors hover:text-blue-100"
                >
                  (800) 753-4400
                </a>
              </div>
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
                Ready to Join Our Mission?
              </h2>
              <p className="max-w-2xl text-lg text-primary-50">
                Explore current openings and take the first step toward an exciting career at BAPI.
                We can&apos;t wait to hear from you!
              </p>
            </div>

            <Link
              href="/company/contact-us"
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-xl bg-white px-8 py-4 font-semibold text-primary-600 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              Get in Touch
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
