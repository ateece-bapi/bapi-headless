import { Metadata } from 'next';
import Link from 'next/link';
import { Building2, Users, Target, Award, MapPin, Phone, Mail } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Company | BAPI',
  description: 'Learn about BAPI - Building Automation Products Inc. Leading manufacturer of building automation sensors and controls since 1984.',
};

export default function CompanyPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-700 via-primary-500 to-primary-700 text-white py-16">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Building2 className="w-16 h-16 mx-auto mb-4 transition-transform duration-normal hover:scale-110" />
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Building Automation Products Inc.
            </h1>
            <p className="text-xl max-w-3xl mx-auto text-primary-50">
              Trusted manufacturer of building automation sensors and controls since 1984
            </p>
          </div>
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-16">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-neutral-700 leading-relaxed mb-6">
              For over 40 years, BAPI (Building Automation Products Inc.) has been at the forefront of 
              building automation technology. Based in Gays Mills, Wisconsin, we design and manufacture 
              precision sensors and controls that help optimize building performance and energy efficiency.
            </p>
            <p className="text-lg text-neutral-700 leading-relaxed">
              Our products are trusted by engineers, contractors, and facility managers worldwide. From 
              temperature sensors to air quality monitors, BAPI delivers reliable solutions for HVAC 
              control, energy management, and building automation systems.
            </p>
          </div>
        </div>
      </section>

      {/* Key Stats */}
      <section className="py-12 bg-neutral-50">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center group cursor-default">
              <div className="text-4xl font-bold text-primary-500 mb-2 transition-transform duration-normal group-hover:scale-110">40+</div>
              <div className="text-neutral-600 transition-colors duration-normal group-hover:text-neutral-900">Years in Business</div>
            </div>
            <div className="text-center group cursor-default">
              <div className="text-4xl font-bold text-primary-500 mb-2 transition-transform duration-normal group-hover:scale-110">600+</div>
              <div className="text-neutral-600 transition-colors duration-normal group-hover:text-neutral-900">Product Models</div>
            </div>
            <div className="text-center group cursor-default">
              <div className="text-4xl font-bold text-primary-500 mb-2 transition-transform duration-normal group-hover:scale-110">100%</div>
              <div className="text-neutral-600 transition-colors duration-normal group-hover:text-neutral-900">Made in USA</div>
            </div>
            <div className="text-center group cursor-default">
              <div className="text-4xl font-bold text-primary-500 mb-2 transition-transform duration-normal group-hover:scale-110">Global</div>
              <div className="text-neutral-600 transition-colors duration-normal group-hover:text-neutral-900">Distribution</div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-neutral-900 mb-8 text-center">
            What We Stand For
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-neutral-50 p-6 rounded-xl transition-all duration-normal hover:shadow-lg hover:-translate-y-1">
              <Target className="w-12 h-12 text-accent-500 mb-4 transition-transform duration-normal hover:scale-110" />
              <h3 className="text-xl font-bold text-neutral-900 mb-3">Quality First</h3>
              <p className="text-neutral-600 leading-relaxed">
                Every product is designed and manufactured to the highest standards. We stand behind 
                our work with industry-leading warranties and support.
              </p>
            </div>

            <div className="bg-neutral-50 p-6 rounded-xl transition-all duration-normal hover:shadow-lg hover:-translate-y-1">
              <Users className="w-12 h-12 text-accent-500 mb-4 transition-transform duration-normal hover:scale-110" />
              <h3 className="text-xl font-bold text-neutral-900 mb-3">Customer Focus</h3>
              <p className="text-neutral-600 leading-relaxed">
                Our technical support team works directly with engineers and contractors to ensure 
                successful installations and optimal performance.
              </p>
            </div>

            <div className="bg-neutral-50 p-6 rounded-xl transition-all duration-normal hover:shadow-lg hover:-translate-y-1">
              <Award className="w-12 h-12 text-accent-500 mb-4 transition-transform duration-normal hover:scale-110" />
              <h3 className="text-xl font-bold text-neutral-900 mb-3">Innovation</h3>
              <p className="text-neutral-600 leading-relaxed">
                We continuously improve our products with the latest technology, from wireless sensors 
                to cloud-based monitoring solutions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Location & Contact */}
      <section className="py-16 bg-neutral-50">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-neutral-900 mb-8 text-center">
            Visit or Contact Us
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Location */}
            <div className="bg-white p-8 rounded-xl shadow-lg transition-all duration-normal hover:shadow-xl hover:-translate-y-1">
              <MapPin className="w-10 h-10 text-primary-500 mb-4 transition-transform duration-normal hover:scale-110" />
              <h3 className="text-xl font-bold text-neutral-900 mb-4">Our Location</h3>
              <div className="text-neutral-600 space-y-2 leading-relaxed">
                <p className="font-semibold">Building Automation Products Inc.</p>
                <p>750 North Royal Avenue</p>
                <p>Gays Mills, WI 54631</p>
                <p>USA</p>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-white p-8 rounded-xl shadow-lg transition-all duration-normal hover:shadow-xl hover:-translate-y-1">
              <Phone className="w-10 h-10 text-primary-500 mb-4 transition-transform duration-normal hover:scale-110" />
              <h3 className="text-xl font-bold text-neutral-900 mb-4">Get in Touch</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-neutral-600 mb-1">Phone</p>
                  <a 
                    href="tel:+17158561203" 
                    className="text-lg font-bold text-primary-500 hover:text-primary-600 transition-colors duration-normal"
                  >
                    (715) 856-1203
                  </a>
                </div>
                <div>
                  <p className="text-sm text-neutral-600 mb-1">Email</p>
                  <a 
                    href="mailto:sales@bapihvac.com" 
                    className="text-lg font-bold text-primary-500 hover:text-primary-600 transition-colors duration-normal"
                  >
                    sales@bapihvac.com
                  </a>
                </div>
                <div>
                  <p className="text-sm text-neutral-600 mb-1">Hours</p>
                  <p className="text-neutral-900">Monday - Friday</p>
                  <p className="text-neutral-900">8:00 AM - 5:00 PM CST</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/contact"
              className="inline-block bg-accent-500 hover:bg-accent-600 text-neutral-900 font-bold px-8 py-3 rounded-xl transition-all duration-normal hover:scale-105 hover:shadow-lg focus-visible:ring-4 focus-visible:ring-accent-500/50"
            >
              Contact Our Team
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-12">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold text-neutral-900 mb-6 text-center">
            Learn More About BAPI
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/company/why-bapi"
              className="text-center p-4 border-2 border-neutral-200 rounded-xl hover:border-primary-500 transition-all duration-normal"
            >
              <h4 className="font-bold text-neutral-900">Why Choose BAPI</h4>
              <p className="text-sm text-neutral-600 mt-1">Quality, reliability, and support</p>
            </Link>
            <Link
              href="/company/news"
              className="text-center p-4 border-2 border-neutral-200 rounded-xl hover:border-primary-500 transition-all duration-normal"
            >
              <h4 className="font-bold text-neutral-900">News & Updates</h4>
              <p className="text-sm text-neutral-600 mt-1">Latest company announcements</p>
            </Link>
            <Link
              href="/company/careers"
              className="text-center p-4 border-2 border-neutral-200 rounded-xl hover:border-primary-500 transition-all duration-normal"
            >
              <h4 className="font-bold text-neutral-900">Careers</h4>
              <p className="text-sm text-neutral-600 mt-1">Join our team</p>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
