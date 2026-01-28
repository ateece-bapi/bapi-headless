import { Metadata } from 'next';
import { getPageBySlug } from '@/lib/wordpress';
import Link from 'next/link';
import { Target, Eye, Award, Users, Lightbulb, Shield, Heart, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Mission & Values | BAPI',
  description: 'Learn about BAPI\'s mission, vision, and core values that drive our commitment to precision sensor solutions.',
};

// Cache for 1 hour (3600 seconds)
export const revalidate = 3600;

const coreValues = [
  {
    icon: Users,
    title: 'Quality',
    description: 'We value our employees by encouraging open dialogue, a sense of community and work-life balance for a healthy culture.',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Award,
    title: 'Innovation',
    description: 'We value processes and services that are metric driven to continually exceed our customers\' expectations.',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: Lightbulb,
    title: 'Collaborative Partnership',
    description: 'We value new and improved solutions that are creative and unique, we continue to find ways to provide distinct advantages.',
    gradient: 'from-amber-500 to-orange-500',
  },
  {
    icon: Shield,
    title: 'Integrity & Ethics',
    description: 'We value our collaborative partnerships that lead to superior solutions and facilitate healthy, productive, and comfortable environments.',
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    icon: Heart,
    title: 'Employees',
    description: 'We value being deliberate, thoughtful and intentional with behaviors that match our every word.',
    gradient: 'from-red-500 to-rose-500',
  },
];

export default async function MissionValuesPage() {
  const page = await getPageBySlug('mission-and-values');

  if (!page) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Mission & Values</h1>
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
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-400/20 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-primary-100 mb-8">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/company" className="hover:text-white transition-colors">Company</Link>
            <span>/</span>
            <span className="text-white font-medium">Mission & Values</span>
          </nav>

          {/* Header */}
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white font-medium text-sm mb-6">
              <Target className="w-4 h-4" />
              Our Purpose
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight">
              Mission & Values
            </h1>
            
            <p className="text-xl md:text-2xl text-primary-50 leading-relaxed">
              For over 30 years, our mission and values have guided every decision we make, 
              every product we design, and every customer relationship we build.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision Cards */}
      <section className="relative -mt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 lg:pb-28">
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {/* Mission Card */}
          <div className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 p-10 border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-50 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300">
                <Target className="w-8 h-8 text-white" />
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Mission</h2>
              
              <p className="text-lg text-gray-700 leading-relaxed">
                At BAPI, we design, manufacture and deliver high quality sensor solutions, 
                as well as provide high quality services for our business partners to effectively 
                save their customers money and energy, therefore reducing dependency on natural resources.
              </p>
            </div>
          </div>

          {/* Vision Card */}
          <div className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 p-10 border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-50 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300">
                <Eye className="w-8 h-8 text-white" />
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Vision</h2>
              
              <p className="text-lg text-gray-700 leading-relaxed">
                To grow as a global, innovative leader by providing unique, customer driven solutions 
                while inspiring our employees to be their best, delivering quality products and services 
                that exceed our customers' expectations.
              </p>
            </div>
          </div>
        </div>

        {/* Core Values Section */}
        <div className="mb-16 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Our Core Values
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            These principles guide everything we do and shape the way we serve our customers and support our team.
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {coreValues.map((value, index) => {
            const Icon = value.icon;
            return (
              <div
                key={value.title}
                className="group bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 p-8 border border-gray-100 hover:border-transparent relative overflow-hidden"
                style={{ animationDelay: `${index * 75}ms` }}
              >
                {/* Gradient background on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${value.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                
                {/* Icon */}
                <div className="relative mb-6">
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${value.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                </div>

                {/* Content */}
                <div className="relative">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {value.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </div>

                {/* Decorative corner */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-gray-50 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-20 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl p-10 lg:p-16 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
          
          <div className="relative flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-3">
                Join Our Mission
              </h2>
              <p className="text-primary-50 text-lg max-w-2xl">
                We're always looking for talented individuals who share our values 
                and passion for innovation. Explore opportunities to join the BAPI team.
              </p>
            </div>
            
            <Link
              href="/company/careers"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-600 font-semibold rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 whitespace-nowrap"
            >
              View Careers
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
