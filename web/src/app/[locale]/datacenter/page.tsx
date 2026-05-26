import Image from 'next/image';
import { Link } from '@/lib/navigation';
import { Metadata } from 'next';
import {
  ArrowRightIcon,
  ServerIcon,
  ThermometerIcon,
  DropletIcon,
  GaugeIcon,
  ShieldCheckIcon,
  ChevronRightIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  ZapIcon,
  TrendingUpIcon,
  ClockIcon,
} from '@/lib/icons';
import { InteractiveServerRoom } from '@/components/datacenter/InteractiveServerRoom';

export const metadata: Metadata = {
  title: 'Data Center Monitoring Solutions | BAPI',
  description:
    'Comprehensive environmental monitoring for data centers. Temperature, humidity, pressure, and leak detection sensors to protect critical infrastructure and maintain uptime.',
  keywords:
    'data center monitoring, server room monitoring, leak detection, temperature monitoring, humidity monitoring, pressure monitoring, data center sensors',
};

export default function DataCenterPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b-4 border-accent-500 bg-gradient-to-br from-primary-700 via-primary-600 to-primary-500 py-16 text-white lg:py-20">
        <div className="absolute inset-0 bg-[url('/images/patterns/grid.svg')] opacity-10" />

        <div className="relative z-10 mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav
            className="mb-8 flex items-center gap-2 text-sm text-primary-100"
            aria-label="Breadcrumb"
          >
            <Link href="/" className="transition-colors hover:text-white">
              Home
            </Link>
            <ChevronRightIcon className="h-4 w-4" />
            <Link href="/products" className="transition-colors hover:text-white">
              Products
            </Link>
            <ChevronRightIcon className="h-4 w-4" />
            <span className="font-medium text-white">Data Centers</span>
          </nav>

          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-accent-500/20 px-4 py-2 font-semibold text-accent-500 backdrop-blur">
                <ServerIcon className="h-4 w-4" />
                <span>Critical Infrastructure Protection</span>
              </div>

              <h1 className="mb-6 text-balance text-4xl font-bold sm:text-5xl lg:text-6xl">
                Data Center Monitoring
                <span className="mt-2 block text-accent-500">Protect Your Mission-Critical Assets</span>
              </h1>
              <p className="mb-8 max-w-2xl text-xl text-primary-50 lg:text-2xl">
                Bringing cost-savings and peace of mind to data centers and IT infrastructure with comprehensive environmental monitoring solutions.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="#products"
                  className="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-8 py-4 text-lg font-bold text-neutral-900 transition-all duration-300 hover:scale-105 hover:bg-accent-600 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-accent-500/50 focus:ring-offset-2 focus:ring-offset-primary-700"
                >
                  Browse Products
                  <ArrowRightIcon className="h-5 w-5" />
                </Link>
                <Link
                  href="/request-quote"
                  className="inline-flex items-center gap-2 rounded-xl border-2 border-white/30 bg-white/10 px-8 py-4 text-lg font-bold text-white backdrop-blur transition-all duration-300 hover:scale-105 hover:border-white/50 hover:bg-white/20 focus:outline-none focus:ring-4 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-primary-700"
                >
                  Request Quote
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="mt-12 flex flex-wrap gap-6 text-sm text-primary-100">
                <div className="flex items-center gap-2">
                  <CheckCircleIcon className="h-5 w-5" />
                  <span>Made in USA</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircleIcon className="h-5 w-5" />
                  <span>ISO 9001 Certified</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircleIcon className="h-5 w-5" />
                  <span>30+ Years Experience</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="group/image relative aspect-[16/10] overflow-hidden rounded-2xl bg-white p-2 shadow-2xl">
                <Image
                  src="/images/datacenter/Server_Room_2026_1-scaled.png"
                  alt="Data center server room with environmental monitoring"
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover/image:scale-105"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is Data Center Monitoring */}
      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 border-t-4 border-accent-500 pt-8">
              <h2 className="mb-8 text-3xl font-bold uppercase tracking-wide text-primary-600 lg:text-4xl">
                Comprehensive Environmental Monitoring for Data Centers
              </h2>

              <div className="space-y-6 text-lg leading-relaxed text-neutral-700">
                <p>
                  Data centers and server rooms require constant environmental monitoring to ensure optimal performance and prevent costly equipment failures. BAPI&apos;s comprehensive monitoring solutions protect your critical infrastructure from temperature extremes, humidity issues, water leaks, and refrigerant leaks.
                </p>

                <p>
                  Our sensors provide real-time data to your Building Automation System (BAS) or Building Management System (BMS), enabling proactive maintenance and rapid response to environmental threats. With BAPI&apos;s proven reliability and accuracy, you can maintain uptime and protect your valuable IT assets.
                </p>
              </div>

              <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                {[
                  {
                    icon: ThermometerIcon,
                    title: 'Temperature Control',
                    description: 'Precise temperature monitoring to prevent overheating',
                  },
                  {
                    icon: DropletIcon,
                    title: 'Leak Detection',
                    description: 'Water and refrigerant leak detection systems',
                  },
                  {
                    icon: GaugeIcon,
                    title: 'Pressure Monitoring',
                    description: 'Differential pressure for proper airflow management',
                  },
                  {
                    icon: ShieldCheckIcon,
                    title: 'BAS Integration',
                    description: 'Seamless integration with existing systems',
                  },
                ].map((feature) => (
                  <div
                    key={feature.title}
                    className="rounded-xl bg-neutral-50 p-6 transition-shadow duration-300 hover:shadow-lg"
                  >
                    <div className="bg-linear-to-br mb-4 flex h-14 w-14 items-center justify-center rounded-full from-primary-500 to-primary-600">
                      <feature.icon className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="mb-2 text-lg font-bold text-neutral-900">{feature.title}</h3>
                    <p className="text-sm leading-relaxed text-neutral-700">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Server Room with Liquid Cooling & Hot Aisle Containment */}
      <section className="bg-gradient-to-b from-white to-neutral-50 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-primary-600 lg:text-5xl">
              Server Room with Liquid Cooling &amp; Hot Aisle Containment
            </h2>
            <p className="mx-auto max-w-5xl text-lg leading-relaxed text-neutral-700 lg:text-xl">
              Modern data centers employ advanced cooling strategies and containment systems. BAPI sensors integrate seamlessly to monitor critical environmental conditions.
            </p>
          </div>

          {/* Interactive Server Room Diagram */}
          <InteractiveServerRoom />
        </div>
      </section>

      {/* Alert Banner */}
      <section className="bg-accent-500 py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-4 text-neutral-900">
            <AlertTriangleIcon className="h-6 w-6 flex-shrink-0" />
            <p className="text-center text-lg font-semibold">
              Protect your data center from environmental threats with comprehensive monitoring from BAPI.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <p className="mb-3 text-base font-semibold uppercase tracking-wide text-primary-600 lg:text-lg">
              Benefits
            </p>
            <h2 className="mb-6 text-4xl font-bold text-neutral-900 lg:text-5xl">
              Why Choose BAPI for Data Center Monitoring?
            </h2>
            <p className="mx-auto max-w-3xl text-lg leading-relaxed text-neutral-600 lg:text-xl">
              BAPI&apos;s proven sensors and monitoring solutions deliver reliability, accuracy, and peace of mind for your critical infrastructure.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-10">
            {[
              {
                icon: ZapIcon,
                title: 'Maximize Uptime',
                description:
                  'Early detection of environmental issues prevents costly downtime and equipment failures. Proactive monitoring keeps your data center running at peak performance.',
              },
              {
                icon: ShieldCheckIcon,
                title: 'Protect Critical Assets',
                description:
                  'Comprehensive monitoring of temperature, humidity, pressure, and leaks safeguards expensive servers, storage systems, and networking equipment.',
              },
              {
                icon: TrendingUpIcon,
                title: 'Energy Efficiency',
                description:
                  'Optimize cooling efficiency with accurate environmental data. Identify hot spots and airflow issues to reduce energy consumption and operating costs.',
              },
              {
                icon: ClockIcon,
                title: 'Real-Time Alerts',
                description:
                  'Immediate notification of environmental anomalies enables rapid response. Integration with your BAS/BMS ensures critical issues are never missed.',
              },
              {
                icon: CheckCircleIcon,
                title: 'Proven Reliability',
                description:
                  'Built to last with quality components and rigorous testing. BAPI sensors deliver accurate, dependable performance year after year.',
              },
              {
                icon: ServerIcon,
                title: 'Easy Integration',
                description:
                  'Multiple output options including BACnet, Modbus, and analog signals ensure compatibility with any Building Automation System.',
              },
            ].map((benefit) => (
              <div
                key={benefit.title}
                className="group flex h-full flex-col rounded-xl border border-neutral-100 bg-neutral-50 p-6 transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.02] hover:border-primary-200 hover:bg-white hover:shadow-2xl"
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 shadow-md transition-transform duration-300 ease-out group-hover:scale-110 group-hover:rotate-3">
                  <benefit.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-neutral-900">{benefit.title}</h3>
                <p className="text-base leading-relaxed text-neutral-700">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="bg-neutral-50 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary-600 lg:text-base">
              Our Products
            </p>
            <h2 className="mb-6 text-4xl font-bold text-neutral-900 lg:text-5xl">
              Data Center Monitoring Solutions
            </h2>
            <p className="mx-auto max-w-3xl text-lg leading-relaxed text-neutral-600 lg:text-xl">
              Complete range of sensors and monitoring solutions for data center environmental protection
            </p>
          </div>

          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: 'Water Leak Detector',
                description:
                  'Detect water leaks early with cable length up to 100 feet. Ideal for under raised floors.',
                image: '/images/datacenter/1-WaterLeak_Rope_Reverse 1.png',
                link: '/products',
              },
              {
                title: 'Zone Pressure Monitor',
                description:
                  'Precise differential pressure monitoring for cleanrooms and containment areas.',
                image: '/images/datacenter/ZPM_BB.png',
                link: '/products',
              },
              {
                title: 'EZ Pressure',
                description:
                  'Fits inside or outside the rack to measure air flow across the rack.',
                image: '/images/datacenter/ez-pressure-1.png',
                link: '/products',
              },
              {
                title: 'Pendant Temp & Humidity',
                description:
                  'Precise temperature and humidity monitoring for critical server room environments.',
                image: '/images/datacenter/Pendant_Sensor_BB.png',
                link: '/products',
              },
              {
                title: 'Refrigerant Leak Detector',
                description:
                  'Early detection of refrigerant leaks from HVAC and cooling systems ensures safety.',
                image: '/images/datacenter/refrigerant-leak-detector.png',
                link: '/products',
              },
              {
                title: 'Remote Sensor',
                description:
                  'Extend monitoring capability to remote locations with flexible sensor placement.',
                image: '/images/datacenter/1-Remote_Sensor_Gray_BBX_Flip 1.png',
                link: '/products',
              },
              {
                title: 'Low Profile Pressure',
                description:
                  'Low-profile pressure sensors for differential pressure monitoring in containment systems.',
                image: '/images/datacenter/low-profile-pressure-pickup.png',
                link: '/products',
              },
            ].map((product) => (
              <div key={product.title} className="group relative overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-accent-400 via-accent-500 to-accent-600"></div>
                <div className="p-8">
                  <div className="relative mb-6 h-52 overflow-hidden rounded-lg bg-gradient-to-br from-neutral-50 to-neutral-100">
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="mb-4 text-xl font-bold text-primary-600 transition-colors group-hover:text-primary-700 lg:text-2xl">
                    {product.title}
                  </h3>
                  <p className="mb-8 leading-relaxed text-neutral-700">{product.description}</p>
                  <Link 
                    href={product.link}
                    className="block w-full rounded-lg bg-primary-500 px-6 py-3.5 text-center font-semibold text-white shadow-md transition-all duration-300 hover:bg-primary-600 hover:shadow-lg"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-xl bg-primary-500 px-8 py-4 text-lg font-bold text-white transition-all duration-300 hover:bg-primary-600 hover:shadow-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-500/50"
            >
              Browse All Products
              <ArrowRightIcon className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* The BAPI Difference */}
      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-6 text-4xl font-bold text-neutral-900 lg:text-5xl">
              The BAPI Difference
            </h2>
            <p className="mx-auto max-w-3xl text-lg leading-relaxed text-neutral-600 lg:text-xl">
              When you choose BAPI, you&apos;re choosing quality, reliability, and exceptional support.
            </p>
          </div>

          {/* Quality Assurance Text */}
          <div className="mx-auto mb-16 max-w-5xl">
            <p className="mb-8 text-lg leading-relaxed text-neutral-700">
              In addition to our exceptional people, BAPI uses only the highest quality sensing elements and meticulous manufacturing, testing and quality assurance procedures. Here are a few of the extra steps that we take to make sure that our products set the standard for accuracy and reliability.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <CheckCircleIcon className="mt-1 h-6 w-6 flex-shrink-0 text-primary-500" />
                <div>
                  <h3 className="mb-2 text-lg font-bold text-neutral-900">100% Testing at Every Step</h3>
                  <p className="leading-relaxed text-neutral-700">
                    Each and every BAPI product is tested at multiple stages in the manufacturing process using custom designed fixtures and computer aided procedures.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <CheckCircleIcon className="mt-1 h-6 w-6 flex-shrink-0 text-primary-500" />
                <div>
                  <h3 className="mb-2 text-lg font-bold text-neutral-900">NIST Traceable Precision Instruments</h3>
                  <p className="leading-relaxed text-neutral-700">
                    Product testing and calibration is conducted with precision Instrumentation and state-of-the-art Environmental Chambers, all of which are traceable to National Institute of Standards and Technology (NIST) standards.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <CheckCircleIcon className="mt-1 h-6 w-6 flex-shrink-0 text-primary-500" />
                <div>
                  <h3 className="mb-2 text-lg font-bold text-neutral-900">Computer Aided Production Stations</h3>
                  <p className="leading-relaxed text-neutral-700">
                    Every production station features a large computer monitor and access to a wealth of resources on the BAPI network including product specific build documents, schematics and 3-D renderings to assure that each product is built to our engineering specs.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <CheckCircleIcon className="mt-1 h-6 w-6 flex-shrink-0 text-primary-500" />
                <div>
                  <h3 className="mb-2 text-lg font-bold text-neutral-900">CE Certified &amp; RoHS Compliant</h3>
                  <p className="leading-relaxed text-neutral-700">
                    BAPI holds itself to a higher standard with CE certification on select models of temperature, humidity and pressure sensors. We are also committed to environmentally responsible manufacturing practices and comply with the European Union&apos;s RoHS directive.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <CheckCircleIcon className="mt-1 h-6 w-6 flex-shrink-0 text-primary-500" />
                <div>
                  <h3 className="mb-2 text-lg font-bold text-neutral-900">100% Compatibility Guarantee</h3>
                  <p className="leading-relaxed text-neutral-700">
                    Because we go the extra mile, we have the confidence to provide a &quot;100% Compatibility Guarantee&quot;. This guarantee states that if the product does not perform to our specifications, then we will not only replace it, but we will also pay the LABOR to replace the product.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Three Pillars */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:gap-12">
            {/* Warranty */}
            <div className="group rounded-2xl border-2 border-neutral-200 bg-white p-6 text-center transition-all duration-300 focus-within:ring-4 focus-within:ring-primary-500/50 hover:-translate-y-1 hover:border-primary-500 hover:shadow-2xl">
              <div className="bg-linear-to-br relative mx-auto mb-6 h-32 w-32 rounded-2xl border border-primary-200 from-white to-primary-50 p-4 shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl">
                <Image
                  src="/images/icons/5-year-warranty-icon.webp"
                  alt="5 Year Lifetime Limited Warranty"
                  fill
                  className="object-contain p-2"
                  loading="lazy"
                />
              </div>
              <h3 className="mb-4 text-xl font-bold text-neutral-900">Warranty</h3>
              <p className="text-sm leading-relaxed text-neutral-700">
                Our products are designed and manufactured to last. We back that up by offering a 5-year warranty across all of our products.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-neutral-700">
                A lifetime limited warranty is also available on many of our single point, room and duct room temperature sensors.*
              </p>
            </div>

            {/* BAPI-Backed */}
            <div className="group rounded-2xl border-2 border-neutral-200 bg-white p-6 text-center transition-all duration-300 focus-within:ring-4 focus-within:ring-primary-500/50 hover:-translate-y-1 hover:border-primary-500 hover:shadow-2xl">
              <div className="bg-linear-to-br relative mx-auto mb-6 h-32 w-32 rounded-2xl border border-primary-200 from-white to-primary-50 p-4 shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl">
                <Image
                  src="/images/icons/bapi-backed-logo.webp"
                  alt="BAPI Backed"
                  fill
                  className="object-contain p-2"
                  loading="lazy"
                />
              </div>
              <h3 className="mb-4 text-xl font-bold text-neutral-900">BAPI-Backed</h3>
              <p className="text-sm leading-relaxed text-neutral-700">
                Most sensor manufacturers will replace their defective products, but only BAPI has the confidence to go beyond the industry standard.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-neutral-700">
                &apos;BAPI-Backed&apos; means we stand behind everything we sell, so be confident in the quality of our products that if one fails within the warranty period, we will not only repair or replace it, but we&apos;ll provide a product expert to offset your incurred cost.**
              </p>
            </div>

            {/* BAPI Original */}
            <div className="group rounded-2xl border-2 border-neutral-200 bg-white p-6 text-center transition-all duration-300 focus-within:ring-4 focus-within:ring-primary-500/50 hover:-translate-y-1 hover:border-primary-500 hover:shadow-2xl">
              <div className="bg-linear-to-br relative mx-auto mb-6 h-32 w-32 rounded-2xl border border-primary-200 from-white to-primary-50 p-4 shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl">
                <Image
                  src="/images/icons/certified-original-stamp.webp"
                  alt="BAPI Certified Original"
                  fill
                  className="object-contain p-2"
                  loading="lazy"
                />
              </div>
              <h3 className="mb-4 text-xl font-bold text-neutral-900">BAPI Original</h3>
              <p className="text-sm leading-relaxed text-neutral-700">
                At BAPI, we strive to be leaders in our industry by providing innovative, high quality products and services designed with you in mind.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-neutral-700">
                Products displaying the &apos;Another Original&apos; stamp are unique to BAPI and the inspiration for these designs come from our valuable customers, talented employees and respected vendors. Those three ingredients combined create industry-leading, original solutions created to solve common HVACR problems.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-primary-700 via-primary-600 to-primary-500 py-16 text-white lg:py-20">
        <div className="mx-auto max-w-container px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-6 text-3xl font-bold lg:text-4xl">
            Ready to Protect Your Data Center?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-primary-50">
            Contact our team to discuss your data center monitoring needs and get a custom quote.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/request-quote"
              className="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-8 py-4 text-lg font-bold text-neutral-900 transition-all duration-300 hover:bg-accent-600 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-accent-500/50 focus:ring-offset-2 focus:ring-offset-primary-700"
            >
              Request Quote
              <ArrowRightIcon className="h-5 w-5" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-white/30 bg-white/10 px-8 py-4 text-lg font-bold text-white backdrop-blur transition-all duration-300 hover:border-white/50 hover:bg-white/20 focus:outline-none focus:ring-4 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-primary-700"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
