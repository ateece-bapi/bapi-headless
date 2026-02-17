import { Metadata } from 'next';
import Link from 'next/link';
import { FileText, Building2, Award, TrendingUp } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Case Studies | BAPI Resources',
  description:
    'Real-world success stories and case studies featuring BAPI building automation solutions.',
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
      <section className="bg-gradient-to-r from-primary-700 via-primary-500 to-primary-700 py-16 text-white">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <FileText className="mx-auto mb-4 h-16 w-16" />
            <h1 className="mb-4 text-4xl font-bold sm:text-5xl">Case Studies</h1>
            <p className="mx-auto max-w-content text-xl text-primary-50">
              Real-world success stories with BAPI solutions
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8">
            {caseStudies.map((study) => (
              <article
                key={study.title}
                className="rounded-xl border-2 border-neutral-200 bg-white p-8 transition-all hover:border-primary-500"
              >
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0 rounded-xl bg-primary-50 p-4">
                    <study.icon className="h-10 w-10 text-primary-500" />
                  </div>
                  <div className="flex-1">
                    <div className="mb-2">
                      <span className="inline-block rounded-lg bg-accent-500 px-3 py-1 text-sm font-semibold text-neutral-900">
                        {study.industry}
                      </span>
                    </div>
                    <h2 className="mb-4 text-2xl font-bold text-neutral-900">{study.title}</h2>
                    <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
                      <div>
                        <h3 className="mb-2 font-bold text-neutral-900">Challenge</h3>
                        <p className="text-sm text-neutral-600">{study.challenge}</p>
                      </div>
                      <div>
                        <h3 className="mb-2 font-bold text-neutral-900">Solution</h3>
                        <p className="text-sm text-neutral-600">{study.solution}</p>
                      </div>
                      <div>
                        <h3 className="mb-2 font-bold text-neutral-900">Results</h3>
                        <p className="text-sm text-neutral-600">{study.results}</p>
                      </div>
                    </div>
                    <button className="font-semibold text-primary-500 hover:text-primary-600">
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
        <div className="mx-auto max-w-content px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-2xl font-bold text-neutral-900">Ready to Start Your Project?</h2>
          <p className="mb-6 text-neutral-600">
            Let us help you design a solution for your building
          </p>
          <Link
            href="/request-quote"
            className="inline-block rounded-xl bg-accent-500 px-8 py-3 font-bold text-neutral-900 transition-colors hover:bg-accent-600"
          >
            Request a Quote
          </Link>
        </div>
      </section>
    </main>
  );
}
