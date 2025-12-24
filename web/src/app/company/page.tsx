import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Company | BAPI',
  description: 'Learn about BAPI, our mission, values, and commitment to precision sensor solutions for building automation.',
};

const companyLinks = [
  {
    title: 'Mission & Values',
    href: '/company/mission-values',
    description: 'Discover our commitment to precision, innovation, and customer success.',
    icon: '🎯',
  },
  {
    title: 'Why BAPI',
    href: '/company/why-bapi',
    description: 'Learn what sets us apart in the building automation industry.',
    icon: '⭐',
  },
  {
    title: 'News',
    href: '/company/news',
    description: 'Stay updated with the latest announcements and company updates.',
    icon: '📰',
  },
  {
    title: 'Careers',
    href: '/company/careers',
    description: 'Join our team and help shape the future of building automation.',
    icon: '💼',
  },
  {
    title: 'Contact Us',
    href: '/company/contact-us',
    description: 'Get in touch with our team for support or inquiries.',
    icon: '📧',
  },
];

export default function CompanyPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            About BAPI
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            For over 30 years, BAPI has been the trusted name in precision sensor solutions 
            for building automation and HVAC control.
          </p>
        </div>

        {/* Company Links Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {companyLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-8 border border-gray-200 hover:border-primary-500"
            >
              <div className="text-5xl mb-4">{link.icon}</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                {link.title}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {link.description}
              </p>
              <span className="inline-block mt-4 text-primary-600 font-medium group-hover:translate-x-2 transition-transform">
                Learn more →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
