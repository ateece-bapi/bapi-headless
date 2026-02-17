import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Activity, Server, Building, Factory, CheckCircle, ArrowRight } from 'lucide-react';

// Solution data
const solutions = {
  healthcare: {
    title: 'Healthcare Facilities',
    subtitle: 'Mission-Critical Environmental Control',
    icon: Activity,
    hero: {
      tagline: 'Patient Safety Depends on Precision',
      description:
        'Healthcare environments demand unwavering reliability. BAPI sensors deliver NIST-traceable accuracy for critical care areas, operating rooms, and pharmaceutical storage.',
    },
    challenges: [
      {
        title: 'Operating Room Pressurization',
        description:
          'Maintain positive/negative pressure differentials to prevent infection spread',
        solution: 'Differential pressure sensors with ±0.5% accuracy and audible alarms',
      },
      {
        title: 'Pharmaceutical Storage Compliance',
        description: 'USP 797/800 requirements for compounding and storage',
        solution: 'Wireless temperature sensors with data logging and alert capabilities',
      },
      {
        title: 'Patient Comfort & Recovery',
        description: 'Optimal temperature and humidity for healing environments',
        solution: 'Room sensors with precise ±0.2°C accuracy for patient rooms',
      },
      {
        title: 'Laboratory & Pharmacy Monitoring',
        description: '24/7 monitoring of sensitive materials and compounds',
        solution: 'Battery-powered wireless sensors with cloud integration',
      },
    ],
    outcomes: {
      stat: '99.9%',
      label: 'Uptime in Critical Care',
      details: 'Proven reliability in ICUs, ORs, and pharmaceutical compounding areas',
    },
    features: [
      'NIST-traceable calibration certificates',
      'USP 797/800 compliance support',
      'FDA 21 CFR Part 11 compatible data logging',
      'Audible and visual alarm integration',
      'Wireless options for retrofit applications',
      'BACnet and Modbus integration',
    ],
    cta: {
      primary: 'Request Healthcare Consultation',
      secondary: 'Download Healthcare Solutions Guide',
    },
  },
  'data-centers': {
    title: 'Data Centers',
    subtitle: 'Optimize Cooling & Reduce PUE',
    icon: Server,
    hero: {
      tagline: 'Every Degree Matters for Efficiency',
      description:
        'Data center cooling represents 40% of total energy costs. BAPI sensors provide the precision monitoring needed to optimize HVAC systems and reduce Power Usage Effectiveness (PUE).',
    },
    challenges: [
      {
        title: 'Hot/Cold Aisle Temperature Monitoring',
        description: 'Track temperature gradients to optimize airflow and cooling',
        solution: 'Multi-point temperature sensors with rack-level monitoring',
      },
      {
        title: 'Humidity Control for Static Prevention',
        description: 'Maintain 40-60% RH to prevent electrostatic discharge damage',
        solution: 'High-accuracy humidity sensors with ±2% RH precision',
      },
      {
        title: 'Airflow Verification',
        description: 'Ensure proper CFM delivery from CRAC/CRAH units',
        solution: 'Airflow stations with velocity and temperature measurement',
      },
      {
        title: 'PUE Improvement Through Precise Control',
        description: 'Reduce cooling energy waste with accurate sensor data',
        solution: 'Integrated sensor networks with BMS/DCIM integration',
      },
    ],
    outcomes: {
      stat: '15%',
      label: 'Average Cooling Cost Reduction',
      details: 'Typical energy savings achieved through optimized temperature setpoints',
    },
    features: [
      'Hot-swappable sensors for zero downtime',
      'Real-time PUE calculation support',
      'Integration with DCIM platforms',
      'Wireless options for rapid deployment',
      'High-density monitoring for blade servers',
      'ASHRAE TC 9.9 compliant designs',
    ],
    cta: {
      primary: 'Schedule Data Center Assessment',
      secondary: 'View Data Center Products',
    },
  },
  'commercial-real-estate': {
    title: 'Commercial Real Estate',
    subtitle: 'Tenant Comfort & Energy Efficiency',
    icon: Building,
    hero: {
      tagline: 'Optimize Occupant Experience & ROI',
      description:
        'Commercial buildings face dual pressures: maximizing tenant satisfaction while minimizing operating costs. BAPI sensors enable both through precise environmental control.',
    },
    challenges: [
      {
        title: 'Multi-Tenant Comfort Control',
        description: 'Individual zone control for diverse tenant needs',
        solution: 'Wireless sensors for flexible tenant spaces without rewiring',
      },
      {
        title: 'LEED & Energy Star Certification',
        description: 'Meet green building standards and attract premium tenants',
        solution: 'Certified sensors with data logging for verification',
      },
      {
        title: 'Indoor Air Quality (IAQ)',
        description: 'CO2 and VOC monitoring for healthy workspaces',
        solution: 'Multi-gas sensors with demand-controlled ventilation',
      },
      {
        title: 'Predictive Maintenance Integration',
        description: 'Reduce emergency calls and extend equipment life',
        solution: 'Smart sensors with trend analysis and alert capabilities',
      },
    ],
    outcomes: {
      stat: 'LEED Platinum',
      label: 'Certification Support',
      details: 'Sensors meet requirements for LEED v4.1 and Energy Star Portfolio Manager',
    },
    features: [
      'Aesthetic wall sensors for occupied spaces',
      'Wireless retrofit solutions',
      'BACnet/Modbus for BMS integration',
      'Mobile-friendly dashboards',
      'Energy reporting and analytics',
      'WELL Building Standard compatibility',
    ],
    cta: {
      primary: 'Discuss Your Building Project',
      secondary: 'Explore Commercial Products',
    },
  },
  'manufacturing-industrial': {
    title: 'Manufacturing & Industrial',
    subtitle: 'Process Control & Compliance',
    icon: Factory,
    hero: {
      tagline: 'Precision for Production Environments',
      description:
        'Manufacturing processes demand stable environmental conditions. BAPI sensors provide the accuracy and reliability needed for quality control and regulatory compliance.',
    },
    challenges: [
      {
        title: 'Clean Room Compliance',
        description: 'ISO 14644 and FDA requirements for controlled environments',
        solution: 'Calibrated sensors with validation certificates',
      },
      {
        title: 'Process Temperature Control',
        description: 'Tight tolerances for consistent product quality',
        solution: 'Industrial-grade sensors with ±0.1°C accuracy',
      },
      {
        title: 'Energy-Intensive System Optimization',
        description: 'Reduce costs while maintaining process stability',
        solution: 'Real-time monitoring with trend analysis',
      },
      {
        title: 'SCADA/BMS Integration',
        description: 'Seamless data flow to existing control systems',
        solution: 'Modbus, BACnet, and analog output options',
      },
    ],
    outcomes: {
      stat: 'ISO 14644',
      label: 'Cleanroom Compliance',
      details:
        'Certified sensors for pharmaceutical, semiconductor, and medical device manufacturing',
    },
    features: [
      'Industrial enclosures (IP65/NEMA 4X)',
      'Wide temperature range (-40°C to +85°C)',
      'Chemical-resistant materials',
      'Explosion-proof options available',
      'Multi-protocol communication',
      'Extended warranty for harsh environments',
    ],
    cta: {
      primary: 'Request Industrial Consultation',
      secondary: 'View Industrial Products',
    },
  },
};

export function generateStaticParams() {
  return Object.keys(solutions).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const solution = solutions[slug as keyof typeof solutions];

  if (!solution) {
    return {
      title: 'Solution Not Found',
    };
  }

  return {
    title: `${solution.title} Solutions | BAPI`,
    description: solution.hero.description,
  };
}

export default async function SolutionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const solution = solutions[slug as keyof typeof solutions];

  if (!solution) {
    notFound();
  }

  const IconComponent = solution.icon;

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-br from-primary-600 to-primary-800 py-16 lg:py-24">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm lg:h-20 lg:w-20">
                <IconComponent className="h-8 w-8 text-white lg:h-10 lg:w-10" strokeWidth={2} />
              </div>
              <div>
                <p className="mb-1 text-sm font-semibold text-accent-400 lg:text-base">
                  Industry Solutions
                </p>
                <h1 className="text-3xl font-bold text-white lg:text-5xl">{solution.title}</h1>
              </div>
            </div>
            <p className="mb-4 text-xl font-semibold text-primary-100 lg:text-2xl">
              {solution.subtitle}
            </p>
            <p className="mb-4 text-2xl font-bold text-white lg:text-3xl">
              {solution.hero.tagline}
            </p>
            <p className="text-lg text-primary-50">{solution.hero.description}</p>
          </div>
        </div>
      </section>

      {/* Challenges & Solutions */}
      <section className="w-full bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-neutral-900 lg:text-4xl">
              Critical Challenges & BAPI Solutions
            </h2>
            <p className="mx-auto max-w-3xl text-lg text-neutral-600">
              Engineered sensor solutions for your specific requirements
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {solution.challenges.map((challenge, index) => (
              <div
                key={index}
                className="rounded-xl border border-neutral-200 bg-neutral-50 p-6 transition-all duration-300 hover:border-primary-500 lg:p-8"
              >
                <h3 className="mb-3 text-xl font-bold text-neutral-900 lg:text-2xl">
                  {challenge.title}
                </h3>
                <p className="mb-4 text-neutral-700">{challenge.description}</p>
                <div className="rounded border-l-4 border-primary-500 bg-primary-50 p-4">
                  <p className="mb-1 text-sm font-semibold text-primary-700">BAPI Solution:</p>
                  <p className="text-neutral-800">{challenge.solution}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Outcomes */}
      <section className="w-full bg-primary-600 py-16 lg:py-20">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-8 text-3xl font-bold text-white lg:text-4xl">Proven Results</h2>
            <div className="rounded-2xl border border-white/20 bg-white/10 p-8 backdrop-blur-sm lg:p-12">
              <div className="mb-4 text-6xl font-bold text-accent-400 lg:text-7xl">
                {solution.outcomes.stat}
              </div>
              <div className="mb-4 text-2xl font-bold text-white lg:text-3xl">
                {solution.outcomes.label}
              </div>
              <p className="text-lg text-primary-100">{solution.outcomes.details}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="w-full bg-neutral-50 py-16 lg:py-20">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-8 text-center text-3xl font-bold text-neutral-900 lg:text-4xl">
              Key Features & Capabilities
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {solution.features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 rounded-lg border border-neutral-200 bg-white p-4"
                >
                  <CheckCircle className="mt-0.5 h-6 w-6 shrink-0 text-primary-500" />
                  <span className="text-neutral-800">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-6 text-3xl font-bold text-neutral-900 lg:text-4xl">
              Ready to Optimize Your Facility?
            </h2>
            <p className="mb-8 text-lg text-neutral-600">
              Let&apos;s discuss how BAPI sensors can solve your specific challenges.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/company/contact-us"
                className="inline-flex items-center justify-center rounded-lg bg-accent-500 px-8 py-4 text-lg font-bold text-neutral-900 shadow-md transition-all duration-300 hover:scale-105 hover:bg-accent-600 hover:shadow-lg"
              >
                {solution.cta.primary}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center justify-center rounded-lg border-2 border-primary-500 px-8 py-4 text-lg font-bold text-primary-600 transition-all duration-300 hover:bg-primary-50"
              >
                {solution.cta.secondary}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Coming Soon: Case Studies */}
      <section className="w-full border-t border-neutral-200 bg-neutral-100 py-12">
        <div className="mx-auto max-w-container px-4 text-center sm:px-6 lg:px-8">
          <p className="text-neutral-600">
            <span className="font-semibold">Case Studies Coming Soon:</span> Real-world
            implementations, ROI data, and customer testimonials
          </p>
        </div>
      </section>
    </div>
  );
}
