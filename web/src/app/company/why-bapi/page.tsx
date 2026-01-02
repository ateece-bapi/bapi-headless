import { Metadata } from 'next';
import { getPageBySlug } from '@/lib/wordpress';
import Link from 'next/link';
import { Star, Award, Shield, Clock, Users, Zap, CheckCircle2, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Why BAPI | BAPI',
  description: 'Discover what sets BAPI apart in the building automation industry and why engineers trust our precision sensor solutions.',
};

// Cache for 1 hour (3600 seconds)
export const revalidate = 3600;

const differentiators = [
  {
    icon: Shield,
    title: '5-Year Warranty',
    description: 'Our products are designed and manufactured to last. We back up that claim by offering a 5-year warranty across all our products.',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Award,
    title: 'BAPI-Backed Guarantee',
    description: 'Most sensor manufacturers will replace their defective products, but only BAPI has the confidence to provide a product warranty.',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: Clock,
    title: 'Lifetime Limited Warranty',
    description: 'A lifetime limited warranty is also available on many of our single point, room and non-room sensor models.',
    gradient: 'from-amber-500 to-orange-500',
  },
  {
    icon: Zap,
    title: '100% Testing',
    description: 'Each and every BAPI product is tested at multiple stages in the manufacturing process to ensure precision and reliability.',
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    icon: Users,
    title: 'Customer Focus',
    description: 'At BAPI, we strive to be leaders in our industry by providing innovative, high quality products and services designed with you in mind.',
    gradient: 'from-red-500 to-rose-500',
  },
  {
    icon: Star,
    title: 'Another Original',
    description: 'Products displaying the "Another Original" stamp are unique to BAPI and inspired by our customers, employees and vendors.',
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
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/10 rounded-full blur-3xl -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-400/20 rounded-full blur-3xl translate-y-1/3" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-primary-100 mb-8">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/company" className="hover:text-white transition-colors">Company</Link>
            <span>/</span>
            <span className="text-white font-medium">Why BAPI</span>
          </nav>

          {/* Header */}
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white font-medium text-sm mb-6">
              <Star className="w-4 h-4" />
              What Sets Us Apart
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight">
              Why BAPI?
            </h1>
            
            <p className="text-xl md:text-2xl text-primary-50 leading-relaxed mb-8">
              BAPI has been changing the way you think about sensors since 1993. We believe sensors 
              are not simple commodities—they are integral to building automation systems and critical 
              to saving energy.
            </p>

            {/* Key Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-3xl font-bold text-white mb-1">30+</div>
                <div className="text-primary-100 text-sm">Years of Excellence</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-3xl font-bold text-white mb-1">5 Year</div>
                <div className="text-primary-100 text-sm">Warranty Standard</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-3xl font-bold text-white mb-1">100%</div>
                <div className="text-primary-100 text-sm">Product Testing</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Differentiators Grid */}
      <section className="relative -mt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 lg:pb-28">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {differentiators.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 p-8 border border-gray-100 hover:border-transparent relative overflow-hidden"
                style={{ animationDelay: `${index * 75}ms` }}
              >
                {/* Gradient background on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                
                {/* Icon */}
                <div className="relative mb-6">
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${item.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                </div>

                {/* Content */}
                <div className="relative">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {item.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Decorative corner */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-gray-50 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            );
          })}
        </div>

        {/* Key Features Section */}
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-10 lg:p-16 shadow-lg mb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-full text-primary-700 font-medium text-sm mb-4">
                <CheckCircle2 className="w-4 h-4" />
                Quality Standards
              </div>
              
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                The Extra Steps We Take
              </h2>
              
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                In addition to our exceptional people, BAPI uses only the highest quality sensing 
                elements and meticulous manufacturing, testing and quality assurance procedures.
              </p>
            </div>

            <div className="grid gap-4">
              {keyFeatures.map((feature, index) => (
                <div
                  key={feature}
                  className="flex items-center gap-3 bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-300"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-gray-900 font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl p-10 lg:p-16 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-3">
                Ready to Experience the BAPI Difference?
              </h2>
              <p className="text-primary-50 text-lg max-w-2xl">
                Let's discuss how our precision sensor solutions can benefit your next project. 
                Our team is ready to help you find the perfect solution.
              </p>
            </div>
            
            <Link
              href="/company/contact-us"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-600 font-semibold rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 whitespace-nowrap"
            >
              Contact Us
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </main>

  );
}
