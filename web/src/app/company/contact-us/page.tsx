import { Metadata } from 'next';
import { getPageBySlug } from '@/lib/wordpress';
import Link from 'next/link';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  Headphones,
  Globe,
  Users,
  Package,
  ArrowRight,
  Send
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Us | BAPI',
  description: 'Get in touch with BAPI for support, sales inquiries, or technical assistance.',
};

// Cache for 1 hour (3600 seconds)
export const revalidate = 3600;

const contactMethods = [
  {
    icon: Phone,
    title: 'Phone',
    details: '+1 (800) 735-4800',
    href: 'tel:+18007354800',
    description: 'Monday - Friday, 8:00 AM - 5:00 PM CST',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Mail,
    title: 'Email',
    details: 'sales@bapihvac.com',
    href: 'mailto:sales@bapihvac.com',
    description: 'We typically respond within 24 hours',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: MapPin,
    title: 'Visit Us',
    details: '750 N Royal Ave, Gays Mills, WI 54631',
    href: 'https://maps.google.com/?q=750+N+Royal+Ave+Gays+Mills+WI+54631',
    description: 'USA',
    gradient: 'from-emerald-500 to-teal-500',
  },
];

const departments = [
  {
    icon: Users,
    title: 'Sales',
    email: 'sales@bapihvac.com',
    description: 'Product inquiries, quotes, and general sales questions',
  },
  {
    icon: Globe,
    title: 'International Sales',
    email: 'sales@bapihvac.com',
    description: 'Global distribution and international partnerships',
  },
  {
    icon: Package,
    title: 'Distribution',
    email: 'sales@bapihvac.com',
    description: 'Distributor inquiries and partnership opportunities',
  },
  {
    icon: Headphones,
    title: 'Technical Support',
    email: 'bapitechsupport@bapisensors.com',
    description: 'Product support, troubleshooting, and technical assistance',
  },
];

const internationalOffice = {
  title: 'RETURN MERCHANDISE (RMA)',
  subtitle: 'United Kingdom/Column Area/Europe',
  phone: '+44 (0) 1252 548410',
  address: 'BAPI Distribution Centre, North 1c\nAldershot GU12 4RG\nUnited Kingdom/Column_area/europe_rma',
};

export default async function ContactUsPage() {
  const page = await getPageBySlug('contact');

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 to-primary-800">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/10 rounded-full blur-3xl -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-400/20 rounded-full blur-3xl translate-y-1/3" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-primary-100 mb-8">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/company" className="hover:text-white transition-colors">Company</Link>
            <span>/</span>
            <span className="text-white font-medium">Contact Us</span>
          </nav>

          {/* Header */}
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white font-medium text-sm mb-6">
              <Mail className="w-4 h-4" />
              Get in Touch
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
              Contact BAPI
            </h1>
            
            <p className="text-xl text-primary-50 leading-relaxed">
              Whether you need technical support, have sales inquiries, or want to learn more 
              about our products, we're here to help. Reach out to us today!
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="relative -mt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {contactMethods.map((method, index) => {
            const Icon = method.icon;
            return (
              <a
                key={method.title}
                href={method.href}
                target={method.href.startsWith('http') ? '_blank' : undefined}
                rel={method.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 p-8 border border-gray-100 hover:border-transparent relative overflow-hidden"
                style={{ animationDelay: `${index * 75}ms` }}
              >
                {/* Gradient background on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${method.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                
                {/* Icon */}
                <div className="relative mb-6">
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${method.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                </div>

                {/* Content */}
                <div className="relative">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    {method.title}
                  </h3>
                  <p className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                    {method.details}
                  </p>
                  <p className="text-sm text-gray-600">
                    {method.description}
                  </p>
                </div>

                {/* Arrow */}
                <ArrowRight className="absolute bottom-6 right-6 w-5 h-5 text-gray-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all duration-300" />
              </a>
            );
          })}
        </div>

        {/* Departments Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-full text-primary-700 font-medium text-sm mb-4">
              <Users className="w-4 h-4" />
              Departments
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How Can We Help?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose the department that best fits your needs and we'll connect you with the right team.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {departments.map((dept, index) => {
              const Icon = dept.icon;
              return (
                <div
                  key={dept.title}
                  className="group bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {dept.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">
                        {dept.description}
                      </p>
                      <a
                        href={`mailto:${dept.email}`}
                        className="inline-flex items-center gap-2 text-primary-600 font-medium hover:gap-3 transition-all duration-300"
                      >
                        <Mail className="w-4 h-4" />
                        {dept.email}
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* International Office */}
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-10 lg:p-16 shadow-lg mb-20">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full text-blue-700 font-medium text-sm mb-4">
                <Globe className="w-4 h-4" />
                International
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {internationalOffice.title}
              </h2>
              <p className="text-lg text-gray-600">
                {internationalOffice.subtitle}
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-md">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                      Phone
                    </div>
                    <a
                      href={`tel:${internationalOffice.phone.replace(/[^+0-9]/g, '')}`}
                      className="text-lg font-bold text-gray-900 hover:text-primary-600 transition-colors"
                    >
                      {internationalOffice.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                      Address
                    </div>
                    <p className="text-gray-900 whitespace-pre-line">
                      {internationalOffice.address}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-blue-50 rounded-lg p-6 border border-blue-100">
              <p className="text-gray-700 text-center">
                <strong>To submit a request:</strong> Click HERE or go to Contact Information 
                online, click RMA
              </p>
            </div>
          </div>
        </div>

        {/* Business Hours */}
        <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl p-10 lg:p-16 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm mb-6">
              <Clock className="w-8 h-8 text-white" />
            </div>
            
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Business Hours
            </h2>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 mb-6">
              <div className="grid md:grid-cols-2 gap-6 text-white">
                <div>
                  <div className="text-sm font-semibold text-primary-100 uppercase tracking-wide mb-2">
                    Monday - Friday
                  </div>
                  <div className="text-2xl font-bold">8:00 AM - 5:00 PM</div>
                  <div className="text-primary-100 text-sm mt-1">Central Standard Time</div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-primary-100 uppercase tracking-wide mb-2">
                    Weekend
                  </div>
                  <div className="text-2xl font-bold">Closed</div>
                  <div className="text-primary-100 text-sm mt-1">Saturday & Sunday</div>
                </div>
              </div>
            </div>

            <p className="text-primary-50 text-lg">
              Have a question outside of business hours? Send us an email and we'll get back to you 
              as soon as possible.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
