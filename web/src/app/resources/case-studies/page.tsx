import { Metadata } from 'next';
import { FileText, Building2, Award, TrendingUp } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Case Studies | BAPI Resources',
  description: 'Real-world success stories and case studies featuring BAPI building automation solutions.',
};

export default function CaseStudiesPage() {
  const caseStudies = [
    {
      title: 'University Campus Energy Management',
      industry: 'Education',
      challenge: 'Improve energy efficiency across 20 buildings while maintaining comfort',
      solution: 'Deployed 500+ BAPI sensors integrated with campus BMS',
      results: '22% energy savings, improved occupant comfort',
      icon: Building2,
    },
    {
      title: 'Healthcare Facility Air Quality',
      industry: 'Healthcare',
      challenge: 'Ensure optimal air quality and meet strict regulatory requirements',
      solution: 'Installed CO₂ and particulate sensors in critical areas',
      results: 'Maintained compliance, reduced complaints by 40%',
      icon: Award,
    },
    {
      title: 'Commercial Office Building Retrofit',
      industry: 'Commercial',
      challenge: 'Modernize 30-year-old HVAC system controls',
      solution: 'Upgraded to wireless BAPI sensors with cloud monitoring',
      results: 'Installation time reduced by 60%, tenant satisfaction up 35%',
      icon: TrendingUp,
    },
  ];

  return (
    <main className="min-h-screen bg-white">
      <section className="bg-gradient-to-r from-primary-700 via-primary-500 to-primary-700 text-white py-16">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <FileText className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Case Studies
            </h1>
            <p className="text-xl max-w-content mx-auto text-primary-50">
              Real-world success stories with BAPI solutions
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8">
            {caseStudies.map((study) => (
              <article
                key={study.title}
                className="bg-white border-2 border-neutral-200 rounded-xl p-8 hover:border-primary-500 transition-all"
              >
                <div className="flex items-start gap-6">
                  <div className="bg-primary-50 p-4 rounded-xl flex-shrink-0">
                    <study.icon className="w-10 h-10 text-primary-500" />
                  </div>
                  <div className="flex-1">
                    <div className="mb-2">
                      <span className="inline-block bg-accent-500 text-neutral-900 px-3 py-1 rounded-lg text-sm font-semibold">
                        {study.industry}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-neutral-900 mb-4">
                      {study.title}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      <div>
                        <h3 className="font-bold text-neutral-900 mb-2">Challenge</h3>
                        <p className="text-neutral-600 text-sm">{study.challenge}</p>
                      </div>
                      <div>
                        <h3 className="font-bold text-neutral-900 mb-2">Solution</h3>
                        <p className="text-neutral-600 text-sm">{study.solution}</p>
                      </div>
                      <div>
                        <h3 className="font-bold text-neutral-900 mb-2">Results</h3>
                        <p className="text-neutral-600 text-sm">{study.results}</p>
                      </div>
                    </div>
                    <button className="text-primary-500 hover:text-primary-600 font-semibold">
                      Read Full Case Study →
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-neutral-50 py-12">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">
            Ready to Start Your Project?
          </h2>
          <p className="text-neutral-600 mb-6">
            Let us help you design a solution for your building
          </p>
          <a
            href="/request-quote"
            className="inline-block bg-accent-500 hover:bg-accent-600 text-neutral-900 font-bold px-8 py-3 rounded-xl transition-colors"
          >
            Request a Quote
          </a>
        </div>
      </section>
    </main>
  );
}
