import { Metadata } from 'next';
import Link from 'next/link';
import { Building2, Users, Target, Award, MapPin, Phone, Mail } from 'lucide-react';
import PageContainer from '@/components/layout/PageContainer';

export const metadata: Metadata = {
  title: 'Company | BAPI',
  description:
    'Learn about BAPI - Building Automation Products Inc. Leading manufacturer of building automation sensors and controls since 1984.',
};

export default function CompanyPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-700 via-primary-500 to-primary-700 py-16 text-white">
        <PageContainer size="narrow">
          <div className="text-center">
            <Building2 className="duration-normal mx-auto mb-4 h-16 w-16 transition-transform hover:scale-110" />
            <h1 className="mb-4 text-balance text-4xl font-bold sm:text-5xl">
              Building Automation Products Inc.
            </h1>
            <p className="mx-auto max-w-3xl text-balance text-xl text-primary-50">
              Trusted manufacturer of building automation sensors and controls since 1984
            </p>
          </div>
        </PageContainer>
      </section>

      {/* Company Overview */}
      <section className="py-16">
        <PageContainer size="narrow">
          <div className="prose prose-lg max-w-none text-center md:text-left">
            <p className="mb-6 text-lg leading-relaxed text-neutral-700">
              For over 40 years, BAPI (Building Automation Products Inc.) has been at the forefront
              of building automation technology. Based in Gays Mills, Wisconsin, we design and
              manufacture precision sensors and controls that help optimize building performance and
              energy efficiency.
            </p>
            <p className="text-lg leading-relaxed text-neutral-700">
              Our products are trusted by engineers, contractors, and facility managers worldwide.
              From temperature sensors to air quality monitors, BAPI delivers reliable solutions for
              HVAC control, energy management, and building automation systems.
            </p>
          </div>
          <div className="mt-10 h-px bg-gradient-to-r from-transparent via-neutral-200 to-transparent" />
        </PageContainer>
      </section>

      {/* Key Stats */}
      <section className="bg-neutral-50 py-12">
        <PageContainer size="narrow">
          <div className="grid grid-cols-2 gap-6">
            <div className="group cursor-default text-center">
              <div className="duration-normal mb-1 text-4xl font-bold text-primary-500 transition-transform group-hover:scale-110">
                40+
              </div>
              <div className="duration-normal text-sm font-semibold tracking-wide text-neutral-500 transition-colors group-hover:text-neutral-900">
                Years in Business
              </div>
            </div>
            <div className="group cursor-default text-center">
              <div className="duration-normal mb-1 text-4xl font-bold text-primary-500 transition-transform group-hover:scale-110">
                600+
              </div>
              <div className="duration-normal text-sm font-semibold tracking-wide text-neutral-500 transition-colors group-hover:text-neutral-900">
                Product Models
              </div>
            </div>
            <div className="group cursor-default text-center">
              <div className="duration-normal mb-1 text-4xl font-bold text-primary-500 transition-transform group-hover:scale-110">
                100%
              </div>
              <div className="duration-normal text-sm font-semibold tracking-wide text-neutral-500 transition-colors group-hover:text-neutral-900">
                Made in USA
              </div>
            </div>
            <div className="group cursor-default text-center">
              <div className="duration-normal mb-1 text-4xl font-bold text-primary-500 transition-transform group-hover:scale-110">
                Global
              </div>
              <div className="duration-normal text-sm font-semibold tracking-wide text-neutral-500 transition-colors group-hover:text-neutral-900">
                Distribution
              </div>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* Core Values */}
      <section className="py-16">
        <PageContainer size="narrow">
          <h2 className="mb-8 text-balance text-center text-3xl font-bold text-neutral-900">
            What We Stand For
          </h2>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="duration-normal rounded-xl border border-neutral-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
              <Target className="duration-normal mb-4 h-12 w-12 text-accent-500 transition-transform hover:scale-110" />
              <h3 className="mb-3 text-xl font-bold text-neutral-900">Quality First</h3>
              <p className="leading-relaxed text-neutral-600">
                Every product is designed and manufactured to the highest standards. We stand behind
                our work with industry-leading warranties and support.
              </p>
            </div>

            <div className="duration-normal rounded-xl border border-neutral-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
              <Users className="duration-normal mb-4 h-12 w-12 text-accent-500 transition-transform hover:scale-110" />
              <h3 className="mb-3 text-xl font-bold text-neutral-900">Customer Focus</h3>
              <p className="leading-relaxed text-neutral-600">
                Our technical support team works directly with engineers and contractors to ensure
                successful installations and optimal performance.
              </p>
            </div>

            <div className="duration-normal rounded-xl border border-neutral-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg md:col-span-2">
              <Award className="duration-normal mb-4 h-12 w-12 text-accent-500 transition-transform hover:scale-110" />
              <h3 className="mb-3 text-xl font-bold text-neutral-900">Innovation</h3>
              <p className="leading-relaxed text-neutral-600">
                We continuously improve our products with the latest technology, from wireless
                sensors to cloud-based monitoring solutions.
              </p>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* Location & Contact */}
      <section className="bg-neutral-50 py-16">
        <PageContainer size="narrow">
          <h2 className="mb-8 text-center text-3xl font-bold text-neutral-900">
            Visit or Contact Us
          </h2>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Location */}
            <div className="duration-normal rounded-xl border border-neutral-200 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
              <MapPin className="duration-normal mb-4 h-10 w-10 text-primary-500 transition-transform hover:scale-110" />
              <h3 className="mb-4 text-xl font-bold text-neutral-900">Our Location</h3>
              <div className="space-y-2 leading-relaxed text-neutral-600">
                <p className="font-semibold">Building Automation Products Inc.</p>
                <p>750 North Royal Avenue</p>
                <p>Gays Mills, WI 54631</p>
                <p>USA</p>
              </div>
            </div>

            {/* Contact */}
            <div className="duration-normal rounded-xl border border-neutral-200 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
              <Phone className="duration-normal mb-4 h-10 w-10 text-primary-500 transition-transform hover:scale-110" />
              <h3 className="mb-4 text-xl font-bold text-neutral-900">Get in Touch</h3>
              <div className="space-y-4">
                <div>
                  <p className="mb-1 text-sm text-neutral-600">Phone</p>
                  <a
                    href="tel:+17158561203"
                    className="duration-normal text-lg font-bold text-primary-500 transition-colors hover:text-primary-600"
                  >
                    (715) 856-1203
                  </a>
                </div>
                <div>
                  <p className="mb-1 text-sm text-neutral-600">Email</p>
                  <a
                    href="mailto:sales@bapihvac.com"
                    className="duration-normal text-lg font-bold text-primary-500 transition-colors hover:text-primary-600"
                  >
                    sales@bapihvac.com
                  </a>
                </div>
                <div>
                  <p className="mb-1 text-sm text-neutral-600">Hours</p>
                  <p className="text-neutral-900">Monday - Friday</p>
                  <p className="text-neutral-900">8:00 AM - 5:00 PM CST</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/contact"
              className="duration-normal inline-block rounded-xl bg-accent-500 px-8 py-3 font-bold text-neutral-900 transition-all hover:scale-105 hover:bg-accent-600 hover:shadow-lg focus-visible:ring-4 focus-visible:ring-accent-500/50"
            >
              Contact Our Team
            </Link>
          </div>
        </PageContainer>
      </section>

      {/* Quick Links */}
      <section className="py-12">
        <PageContainer size="narrow">
          <h3 className="mb-6 text-center text-2xl font-bold text-neutral-900">
            Learn More About BAPI
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Link
              href="/company/why-bapi"
              className="duration-normal rounded-xl border border-neutral-200 bg-white p-4 text-center transition-all hover:border-primary-500 hover:shadow-md"
            >
              <h4 className="font-bold text-neutral-900">Why Choose BAPI</h4>
              <p className="mt-1 text-sm text-neutral-600">Quality, reliability, and support</p>
            </Link>
            <Link
              href="/company/news"
              className="duration-normal rounded-xl border border-neutral-200 bg-white p-4 text-center transition-all hover:border-primary-500 hover:shadow-md"
            >
              <h4 className="font-bold text-neutral-900">News & Updates</h4>
              <p className="mt-1 text-sm text-neutral-600">Latest company announcements</p>
            </Link>
            <Link
              href="/company/careers"
              className="duration-normal rounded-xl border border-neutral-200 bg-white p-4 text-center transition-all hover:border-primary-500 hover:shadow-md"
            >
              <h4 className="font-bold text-neutral-900">Careers</h4>
              <p className="mt-1 text-sm text-neutral-600">Join our team</p>
            </Link>
          </div>
        </PageContainer>
      </section>
    </main>
  );
}
