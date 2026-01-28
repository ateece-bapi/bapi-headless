import { Metadata } from 'next';
import Link from 'next/link';
import { Building2, Target, Star, Newspaper, Briefcase, Mail, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Company | BAPI',
  description: 'Learn about BAPI, our mission, values, and commitment to precision sensor solutions for building automation.',
};

const companyLinks = [
  {
    title: 'Mission & Values',
    href: '/company/mission-values',
    description: 'Discover our commitment to precision, innovation, and customer success.',
    icon: Target,
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    title: 'Why BAPI',
    href: '/company/why-bapi',
    description: 'Learn what sets us apart in the building automation industry.',
    icon: Star,
    gradient: 'from-amber-500 to-orange-500',
  },
  {
    title: 'News',
    href: '/company/news',
    description: 'Stay updated with the latest announcements and company updates.',
    icon: Newspaper,
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    title: 'Careers',
    href: '/company/careers',
    description: 'Join our team and help shape the future of building automation.',
    icon: Briefcase,
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    title: 'Contact Us',
    href: '/company/contact-us',
    description: 'Get in touch with our team for support or inquiries.',
    icon: Mail,
    gradient: 'from-red-500 to-rose-500',
  },
];

export default function CompanyPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-100/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-600 mb-8">
            <Link href="/" className="hover:text-primary-600 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">Company</span>
          </nav>

          {/* Header */}
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-full text-primary-700 font-medium text-sm mb-6">
              <Building2 className="w-4 h-4" />
              About BAPI
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 tracking-tight">
              Precision sensors for
              <span className="block text-primary-600">building automation</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">
              For over 30 years, BAPI has been the trusted name in precision sensor solutions 
              for building automation and HVAC control. We deliver quality products that exceed 
              our customers' expectations.
            </p>
          </div>
        </div>
      </section>

      {/* Company Links Grid */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 lg:pb-28">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {companyLinks.map((link, index) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="group relative bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 p-8 border border-gray-100 hover:border-transparent overflow-hidden"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Gradient background on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${link.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                
                {/* Icon with gradient background */}
                <div className="relative mb-6">
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${link.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                </div>

                {/* Content */}
                <div className="relative">
                  <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors duration-300">
                    {link.title}
                  </h2>
                  
                  <p className="text-gray-600 leading-relaxed mb-4">
                    {link.description}
                  </p>

                  {/* CTA */}
                  <div className="flex items-center gap-2 text-primary-600 font-semibold group-hover:gap-3 transition-all duration-300">
                    <span>Explore</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>

                {/* Decorative corner element */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gray-50 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </Link>
            );
          })}
        </div>

        {/* Bottom CTA Section */}
        <div className="mt-16 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl p-8 lg:p-12 shadow-xl">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left">
              <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                Ready to work with BAPI?
              </h2>
              <p className="text-primary-100 text-lg">
                Let's discuss how our sensor solutions can benefit your project.
              </p>
            </div>
            
            <Link
              href="/company/contact-us"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-600 font-semibold rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 whitespace-nowrap"
            >
              Contact Our Team
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

