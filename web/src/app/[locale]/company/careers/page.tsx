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
  Sparkles
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
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/10 rounded-full blur-3xl -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-400/20 rounded-full blur-3xl translate-y-1/3" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-primary-100 mb-8">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/company" className="hover:text-white transition-colors">Company</Link>
            <span>/</span>
            <span className="text-white font-medium">Careers</span>
          </nav>

          {/* Header */}
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white font-medium text-sm mb-6">
              <Briefcase className="w-4 h-4" />
              Join Our Team
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight">
              Build Your Career at BAPI
            </h1>
            
            <p className="text-xl md:text-2xl text-primary-50 leading-relaxed mb-8">
              BAPI supports a culture of work-life balance with family oriented employee benefits 
              such as company picnics & holiday parties, aesthetic wellness initiatives, exercise 
              programs and much more. We are an Equal Opportunity Employer (EOP) and we are 
              committed to creating an inclusive work environment for all employees.
            </p>

            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
              <Sparkles className="w-5 h-5 text-yellow-300" />
              <span className="text-white font-medium">We're excited to meet you!</span>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="relative -mt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={benefit.title}
                className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 p-8 border border-gray-100 hover:border-transparent relative overflow-hidden"
                style={{ animationDelay: `${index * 75}ms` }}
              >
                {/* Gradient background on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${benefit.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                
                {/* Icon */}
                <div className="relative mb-6">
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${benefit.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                </div>

                {/* Content */}
                <div className="relative">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {benefit.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>

                {/* Decorative corner */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-gray-50 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            );
          })}
        </div>

        {/* Culture & Benefits Details */}
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-10 lg:p-16 shadow-lg mb-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-full text-primary-700 font-medium text-sm mb-4">
              <Gift className="w-4 h-4" />
              What We Offer
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              More Than Just a Job
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              BAPI supports a culture of work-life balance with family oriented employee benefits.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {cultureValues.map((category, categoryIndex) => (
              <div
                key={category.title}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
                style={{ animationDelay: `${categoryIndex * 100}ms` }}
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-primary-500 to-primary-600" />
                  {category.title}
                </h3>
                <ul className="space-y-3">
                  {category.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* How to Apply Section */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-10 lg:p-16 mb-20">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full text-blue-700 font-medium text-sm mb-4">
                <FileText className="w-4 h-4" />
                Application Process
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                How to Apply
              </h2>
              <p className="text-lg text-gray-700">
                We ONLY accept and consider complete electronic applications submitted directly 
                through the <strong>www.bapihvac.com/careers</strong> webpage.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-md mb-8">
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Complete Application</h3>
                    <p className="text-gray-600">
                      Most positions will require a <strong>Resume</strong> and a separate <strong>Cover Letter</strong> 
                      to be considered a "complete" electronic application.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Direct Submission</h3>
                    <p className="text-gray-600">
                      Cover Letters must be uploaded directly as attachments via online application system.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Equal Opportunity</h3>
                    <p className="text-gray-600">
                      BAPI is an Equal Opportunity Employer (EOP). If you are unable to apply online 
                      or require alternative methods of application or screening, please identify 
                      cultural origin, disability or veteran status.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-600 text-white rounded-xl p-6 text-center">
              <p className="mb-4">
                <strong>For questions or help with online applications:</strong>
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a 
                  href="mailto:careers@bapihvac.com"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:shadow-lg transition-all duration-300"
                >
                  <Mail className="w-5 h-5" />
                  careers@bapihvac.com
                </a>
                <span className="text-blue-100">or call</span>
                <a 
                  href="tel:+16087534400"
                  className="font-bold hover:text-blue-100 transition-colors"
                >
                  (800) 753-4400
                </a>
              </div>
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
                Ready to Join Our Mission?
              </h2>
              <p className="text-primary-50 text-lg max-w-2xl">
                Explore current openings and take the first step toward an exciting career at BAPI. 
                We can't wait to hear from you!
              </p>
            </div>
            
            <Link
              href="/company/contact-us"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-600 font-semibold rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 whitespace-nowrap"
            >
              Get in Touch
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
