import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import {
  Radio,
  Wifi,
  Bell,
  LineChart,
  Shield,
  Zap,
  DollarSign,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Cloud,
  Smartphone,
  AlertTriangle,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'WAM™ Wireless Asset Monitoring | BAPI',
  description:
    'Protect your valuable assets with real-time monitoring from BAPI. WAM™ provides 24/7 asset monitoring with instant alerts to avoid costly equipment failures.',
  keywords:
    'wireless asset monitoring, temperature monitoring, humidity monitoring, equipment monitoring, preventive maintenance, cold chain monitoring',
};

export default function WAMPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-linear-to-br from-primary-700 via-primary-600 to-primary-500 text-white">
        <div className="mx-auto max-w-container px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left Column - Content */}
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm">
                <Radio className="h-4 w-4" />
                <span className="text-sm font-semibold">WAM™ Wireless Asset Monitoring</span>
              </div>

              <h1 className="mb-6 text-4xl font-bold leading-tight lg:text-5xl xl:text-6xl">
                Protect your valuable assets with real-time monitoring
              </h1>

              <p className="mb-8 text-xl leading-relaxed text-primary-50">
                24/7 monitoring with instant alerts to avoid costly equipment failures. Monitor
                temperature, humidity, and more from anywhere with BAPI&apos;s proven wireless solutions.
              </p>

              <div className="flex flex-col gap-4 sm:flex-row">
                <a
                  href="#demo"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent-500 px-8 py-4 text-lg font-bold text-neutral-900 transition-all duration-300 hover:bg-accent-600 hover:shadow-xl"
                >
                  Request Demo
                  <ArrowRight className="h-5 w-5" />
                </a>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white/30 bg-white/10 px-8 py-4 text-lg font-bold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20"
                >
                  How It Works
                </a>
              </div>

              {/* Trust Badges */}
              <div className="mt-12 flex flex-wrap gap-6 text-sm text-primary-100">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  <span>Made in USA</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  <span>ISO 9001 Certified</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  <span>30+ Years Experience</span>
                </div>
              </div>
            </div>

            {/* Right Column - Visual */}
            <div className="relative">
              <div className="rounded-2xl border border-white/20 bg-white/10 p-8 backdrop-blur-lg">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: Wifi, label: 'Real-time Data', value: '24/7' },
                    { icon: Bell, label: 'Instant Alerts', value: 'SMS/Email' },
                    { icon: Cloud, label: 'Cloud Dashboard', value: 'Anywhere' },
                    { icon: Shield, label: 'Prevent Losses', value: 'Proactive' },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm"
                    >
                      <stat.icon className="mb-2 h-8 w-8 text-accent-500" />
                      <div className="mb-1 text-2xl font-bold">{stat.value}</div>
                      <div className="text-sm text-primary-100">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is WAM Section */}
      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-neutral-900 lg:text-4xl">What is WAM?</h2>
            <p className="mx-auto max-w-3xl text-xl text-neutral-600">
              WAM™ (Wireless Asset Monitoring) is BAPI&apos;s complete solution for protecting
              temperature-sensitive equipment and inventory from costly failures.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: Radio,
                title: 'Wireless Sensors',
                description:
                  'Battery-powered sensors transmit real-time temperature, humidity, and pressure data without complex wiring.',
              },
              {
                icon: Cloud,
                title: 'Cloud Dashboard',
                description:
                  'Web-based monitoring accessible from any device. View trends, set thresholds, and receive instant alerts.',
              },
              {
                icon: Bell,
                title: 'Smart Alerts',
                description:
                  'Customizable notifications via SMS, email, or phone call when conditions exceed safe operating ranges.',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl bg-neutral-50 p-8 transition-shadow duration-300 hover:shadow-lg"
              >
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br from-primary-500 to-primary-600">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-neutral-900">{feature.title}</h3>
                <p className="leading-relaxed text-neutral-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="bg-neutral-50 py-16 lg:py-24">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-neutral-900 lg:text-4xl">How It Works</h2>
            <p className="mx-auto max-w-3xl text-xl text-neutral-600">
              Simple setup, powerful protection. WAM™ connects your assets to the cloud in four easy
              steps.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                step: '1',
                icon: Radio,
                title: 'Install Sensors',
                description: 'Mount wireless sensors near critical equipment. No wiring needed.',
              },
              {
                step: '2',
                icon: Wifi,
                title: 'Connect Gateway',
                description: 'Gateway receives sensor data and sends to secure cloud.',
              },
              {
                step: '3',
                icon: Cloud,
                title: 'Access Dashboard',
                description: 'View real-time data and historical trends from any device.',
              },
              {
                step: '4',
                icon: Bell,
                title: 'Receive Alerts',
                description: 'Get instant notifications when conditions exceed thresholds.',
              },
            ].map((step) => (
              <div key={step.step} className="relative">
                <div className="rounded-xl bg-white p-6 shadow-md transition-shadow duration-300 hover:shadow-xl">
                  <div className="absolute -left-4 -top-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent-500 text-xl font-bold text-neutral-900 shadow-lg">
                    {step.step}
                  </div>
                  <div className="mb-4 mt-2 flex h-14 w-14 items-center justify-center rounded-full bg-linear-to-br from-primary-500 to-primary-600">
                    <step.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-neutral-900">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-neutral-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Alert Banner */}
      <section className="bg-accent-500 py-6">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-4 text-neutral-900">
            <AlertTriangle className="h-6 w-6 flex-shrink-0" />
            <p className="text-center text-lg font-semibold">
              Avoid costly losses from power outages or equipment failure with 24/7 asset monitoring
              from BAPI.
            </p>
          </div>
        </div>
      </section>

      {/* Why WAM Section */}
      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-neutral-900 lg:text-4xl">
              Why Choose WAM?
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-neutral-600">
              Trusted by enterprises, healthcare facilities, and data centers worldwide for
              mission-critical monitoring.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: DollarSign,
                title: 'Prevent Costly Failures',
                description:
                  'Avoid equipment damage, inventory loss, and downtime. One prevented failure pays for the entire system.',
              },
              {
                icon: Zap,
                title: 'Fast Installation',
                description:
                  'Battery-powered sensors install in minutes. No electrician, no downtime, no disruption.',
              },
              {
                icon: Smartphone,
                title: 'Monitor Anywhere',
                description:
                  'Check conditions from your phone, tablet, or computer. 24/7 access to live data and alerts.',
              },
              {
                icon: LineChart,
                title: 'Historical Trends',
                description:
                  'Analyze patterns, prove compliance, and optimize operations with detailed reporting.',
              },
              {
                icon: Shield,
                title: 'Enterprise Security',
                description:
                  'Bank-level encryption, secure cloud infrastructure, and data redundancy protect your information.',
              },
              {
                icon: TrendingUp,
                title: 'Scalable Solution',
                description:
                  'Start with one sensor or deploy hundreds. Grows with your business needs.',
              },
            ].map((benefit) => (
              <div
                key={benefit.title}
                className="group rounded-xl border border-transparent bg-neutral-50 p-6 transition-all duration-300 hover:border-primary-200 hover:bg-white hover:shadow-xl"
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-linear-to-br from-primary-500 to-primary-600 transition-transform duration-300 group-hover:scale-110">
                  <benefit.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-neutral-900">{benefit.title}</h3>
                <p className="text-sm leading-relaxed text-neutral-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section className="bg-neutral-50 py-16 lg:py-24">
        <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-neutral-900 lg:text-4xl">
              Industries We Serve
            </h2>
            <p className="text-xl text-neutral-600">
              WAM™ protects critical assets across diverse industries
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              'Healthcare & Pharmaceuticals',
              'Food Service & Restaurants',
              'Cold Storage & Distribution',
              'Data Centers & IT',
              'Manufacturing & Industrial',
              'Grocery & Retail',
              'Research Labs',
              'Transportation & Logistics',
            ].map((industry) => (
              <div
                key={industry}
                className="rounded-lg border border-neutral-200 bg-white p-4 text-center transition-all duration-300 hover:border-primary-500 hover:shadow-md"
              >
                <p className="font-medium text-neutral-700">{industry}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Wireless Products Section */}
      <section id="products" className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-neutral-900 lg:text-4xl">
              Wireless Products
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-neutral-600">
              Complete range of wireless sensors for temperature, humidity, pressure, and more
            </p>
          </div>

          <div className="mb-12 grid gap-8 md:grid-cols-3">
            {[
              {
                title: 'Temperature Sensors',
                description:
                  'Wireless temperature monitoring for refrigeration, freezers, and critical spaces',
                link: '/products/wireless/temperature',
              },
              {
                title: 'Humidity Sensors',
                description:
                  'Monitor relative humidity in warehouses, data centers, and clean rooms',
                link: '/products/wireless/humidity',
              },
              {
                title: 'Pressure Sensors',
                description:
                  'Differential pressure monitoring for filter status and room pressurization',
                link: '/products/wireless/pressure',
              },
            ].map((product) => (
              <Link
                key={product.title}
                href={product.link}
                className="group rounded-xl border border-transparent bg-neutral-50 p-6 transition-all duration-300 hover:border-primary-500 hover:bg-white hover:shadow-xl"
              >
                <h3 className="mb-3 text-xl font-bold text-neutral-900 transition-colors group-hover:text-primary-500">
                  {product.title}
                </h3>
                <p className="mb-4 text-neutral-600">{product.description}</p>
                <div className="flex items-center gap-2 font-semibold text-primary-500">
                  Learn More
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/products/wireless"
              className="inline-flex items-center gap-2 rounded-xl bg-primary-500 px-8 py-4 text-lg font-bold text-white transition-all duration-300 hover:bg-primary-600 hover:shadow-xl"
            >
              View All Wireless Products
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Real-World Installations Gallery */}
      <section className="bg-linear-to-br from-neutral-50 to-white py-16 lg:py-24">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-neutral-900 lg:text-4xl">
              Real-World Installations
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-neutral-600">
              See WAM™ in action protecting food safety and valuable assets across convenience
              stores, grocery stores, and food service operations
            </p>
          </div>

          {/* Walk-In Coolers */}
          <div className="mb-16">
            <div className="mb-8">
              <h3 className="mb-2 text-center text-2xl font-bold text-neutral-900 sm:text-3xl">
                Walk-In Coolers
              </h3>
              <div className="mx-auto h-1 w-20 rounded-full bg-linear-to-r from-primary-600 to-primary-400" />
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  src: '/images/applications/retail/coolers/Cooler_Front_4.webp',
                  alt: 'Walk-in cooler door monitoring',
                  title: 'Cooler Door Monitoring',
                },
                {
                  src: '/images/applications/retail/coolers/Cooler_Back_1.webp',
                  alt: 'Interior cooler sensor placement',
                  title: 'Interior Temperature Monitoring',
                },
                {
                  src: '/images/applications/retail/coolers/Cooler_Buffer_1.webp',
                  alt: 'Cooler buffer zone sensor',
                  title: 'Buffer Zone Monitoring',
                },
                {
                  src: '/images/applications/retail/coolers/Cooler_Room_Buffer_1.webp',
                  alt: 'Multi-zone cooler monitoring',
                  title: 'Multi-Zone Monitoring',
                },
                {
                  src: '/images/applications/retail/coolers/Cooler_Case_1.webp',
                  alt: 'Cooler case temperature monitoring',
                  title: 'Display Case Monitoring',
                },
                {
                  src: '/images/applications/retail/coolers/Cooler_Slim_2.webp',
                  alt: 'Slim profile cooler sensor',
                  title: 'Slim Profile Installation',
                },
                {
                  src: '/images/applications/retail/coolers/Cooler_Slim_3.webp',
                  alt: 'Compact cooler sensor installation',
                  title: 'Compact Installation',
                },
              ].map((image, idx) => (
                <div
                  key={idx}
                  className="group relative overflow-hidden rounded-xl bg-white shadow-md transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-neutral-900/60 via-neutral-900/0 to-neutral-900/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  </div>
                  <div className="p-4">
                    <h4 className="text-sm font-bold text-neutral-900 transition-colors duration-300 group-hover:text-primary-600">
                      {image.title}
                    </h4>
                  </div>
                  <div className="absolute left-0 right-0 top-0 h-1 origin-left scale-x-0 transform bg-linear-to-r from-primary-400 via-primary-600 to-primary-400 transition-transform duration-500 group-hover:scale-x-100" />
                </div>
              ))}
            </div>
          </div>

          {/* Walk-In Freezers */}
          <div className="mb-16">
            <div className="mb-8">
              <h3 className="mb-2 text-center text-2xl font-bold text-neutral-900 sm:text-3xl">
                Walk-In Freezers
              </h3>
              <div className="mx-auto h-1 w-20 rounded-full bg-linear-to-r from-primary-600 to-primary-400" />
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  src: '/images/applications/retail/freezers/Freezer_Door_1.webp',
                  alt: 'Freezer door temperature sensor',
                  title: 'Freezer Door Monitoring',
                },
                {
                  src: '/images/applications/retail/freezers/Freezer_Buffer_1.webp',
                  alt: 'Freezer buffer zone monitoring',
                  title: 'Buffer Zone Temperature',
                },
                {
                  src: '/images/applications/retail/freezers/FrozenFoods_1.webp',
                  alt: 'Frozen food storage monitoring',
                  title: 'Frozen Food Storage',
                },
                {
                  src: '/images/applications/retail/freezers/Freezer_Case_7.webp',
                  alt: 'Freezer case temperature control',
                  title: 'Freezer Case Monitoring',
                },
                {
                  src: '/images/applications/retail/freezers/Freezer_Slim_2.webp',
                  alt: 'Slim sensor in freezer',
                  title: 'Compact Sensor Installation',
                },
                {
                  src: '/images/applications/retail/freezers/Freezer_Door_2.webp',
                  alt: 'Multiple freezer door sensors',
                  title: 'Multi-Door Monitoring',
                },
                {
                  src: '/images/applications/retail/freezers/Freezer_Buffer_3.webp',
                  alt: 'Large freezer buffer monitoring',
                  title: 'Large Freezer Rooms',
                },
                {
                  src: '/images/applications/retail/freezers/Freezer_Slim_4.webp',
                  alt: 'Freezer slim sensor placement',
                  title: 'Space-Saving Sensors',
                },
                {
                  src: '/images/applications/retail/freezers/Freezer_Buffer_2.webp',
                  alt: 'Freezer buffer area sensor',
                  title: 'Additional Buffer Zone',
                },
                {
                  src: '/images/applications/retail/freezers/Freezer_Door_3.webp',
                  alt: 'Freezer door sensor configuration',
                  title: 'Door Sensor Configuration',
                },
                {
                  src: '/images/applications/retail/freezers/Freezer_Slim_3.webp',
                  alt: 'Slim profile freezer sensor',
                  title: 'Low-Profile Installation',
                },
                {
                  src: '/images/applications/retail/freezers/Freezer_Slim_5.webp',
                  alt: 'Freezer slim sensor variant',
                  title: 'Flexible Sensor Placement',
                },
                {
                  src: '/images/applications/retail/freezers/Freezer_Buffer_2_Edited.webp',
                  alt: 'Freezer buffer monitoring system',
                  title: 'Complete Buffer System',
                },
              ].map((image, idx) => (
                <div
                  key={idx}
                  className="group relative overflow-hidden rounded-xl bg-white shadow-md transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-neutral-900/60 via-neutral-900/0 to-neutral-900/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  </div>
                  <div className="p-4">
                    <h4 className="text-sm font-bold text-neutral-900 transition-colors duration-300 group-hover:text-primary-600">
                      {image.title}
                    </h4>
                  </div>
                  <div className="absolute left-0 right-0 top-0 h-1 origin-left scale-x-0 transform bg-linear-to-r from-primary-400 via-primary-600 to-primary-400 transition-transform duration-500 group-hover:scale-x-100" />
                </div>
              ))}
            </div>
          </div>

          {/* Deli Cases & Prepared Foods */}
          <div className="mb-16">
            <div className="mb-8">
              <h3 className="mb-2 text-center text-2xl font-bold text-neutral-900 sm:text-3xl">
                Deli Cases & Prepared Foods
              </h3>
              <div className="mx-auto h-1 w-20 rounded-full bg-linear-to-r from-primary-600 to-primary-400" />
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  src: '/images/applications/retail/deli-cases/Deli_Cases_All_1.webp',
                  alt: 'Multiple deli case monitoring',
                  title: 'Multi-Case Deli Monitoring',
                },
                {
                  src: '/images/applications/retail/deli-cases/Deli_Cases_All_4.webp',
                  alt: 'Deli case temperature array',
                  title: 'Comprehensive Temperature Control',
                },
                {
                  src: '/images/applications/retail/deli-cases/Deli_Case_1.webp',
                  alt: 'Single deli case sensor',
                  title: 'Individual Case Monitoring',
                },
                {
                  src: '/images/applications/retail/deli-cases/Deli_Cases_All_2.webp',
                  alt: 'Deli display case monitoring',
                  title: 'Display Case Array',
                },
                {
                  src: '/images/applications/retail/deli-cases/Deli_Cases_All_3.webp',
                  alt: 'Prepared foods temperature control',
                  title: 'Prepared Foods Safety',
                },
              ].map((image, idx) => (
                <div
                  key={idx}
                  className="group relative overflow-hidden rounded-xl bg-white shadow-md transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-neutral-900/60 via-neutral-900/0 to-neutral-900/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  </div>
                  <div className="p-4">
                    <h4 className="text-sm font-bold text-neutral-900 transition-colors duration-300 group-hover:text-primary-600">
                      {image.title}
                    </h4>
                  </div>
                  <div className="absolute left-0 right-0 top-0 h-1 origin-left scale-x-0 transform bg-linear-to-r from-primary-400 via-primary-600 to-primary-400 transition-transform duration-500 group-hover:scale-x-100" />
                </div>
              ))}
            </div>
          </div>

          {/* Convenience Stores */}
          <div className="mb-12">
            <div className="mb-8">
              <h3 className="mb-2 text-center text-2xl font-bold text-neutral-900 sm:text-3xl">
                Convenience Stores & Mini-Marts
              </h3>
              <div className="mx-auto h-1 w-20 rounded-full bg-linear-to-r from-primary-600 to-primary-400" />
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  src: '/images/applications/retail/convenience/Mini-Mart_Overhead_4.webp',
                  alt: 'Convenience store overhead sensors',
                  title: 'Store-Wide Climate Control',
                },
                {
                  src: '/images/applications/retail/convenience/DoorSwitch_1.webp',
                  alt: 'Door switch on refrigerator',
                  title: 'Door Open/Close Alerts',
                },
                {
                  src: '/images/applications/retail/convenience/Island 1.webp',
                  alt: 'Island cooler monitoring',
                  title: 'Island Cooler Monitoring',
                },
                {
                  src: '/images/applications/retail/convenience/Mini-Mart_Overhead_1.webp',
                  alt: 'Mini-mart sensor deployment',
                  title: 'Multi-Zone Store Monitoring',
                },
                {
                  src: '/images/applications/retail/convenience/Mini-Mart_Overhead_2.webp',
                  alt: 'Convenience store overhead view',
                  title: 'Comprehensive Coverage',
                },
                {
                  src: '/images/applications/retail/convenience/Mini-Mart_Overhead_3.webp',
                  alt: 'Mini-mart temperature zones',
                  title: 'Zone-Based Monitoring',
                },
                {
                  src: '/images/applications/retail/convenience/DoorSwitch_1_Blue.webp',
                  alt: 'Blue door sensor installation',
                  title: 'Door Alert System',
                },
                {
                  src: '/images/applications/retail/convenience/DoorSwitch_2.webp',
                  alt: 'Door switch variant installation',
                  title: 'Alternate Door Sensor',
                },
                {
                  src: '/images/applications/retail/convenience/DoorSwitch_3.webp',
                  alt: 'Door monitoring configuration',
                  title: 'Advanced Door Control',
                },
              ].map((image, idx) => (
                <div
                  key={idx}
                  className="group relative overflow-hidden rounded-xl bg-white shadow-md transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-neutral-900/60 via-neutral-900/0 to-neutral-900/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  </div>
                  <div className="p-4">
                    <h4 className="text-sm font-bold text-neutral-900 transition-colors duration-300 group-hover:text-primary-600">
                      {image.title}
                    </h4>
                  </div>
                  <div className="absolute left-0 right-0 top-0 h-1 origin-left scale-x-0 transform bg-linear-to-r from-primary-400 via-primary-600 to-primary-400 transition-transform duration-500 group-hover:scale-x-100" />
                </div>
              ))}
            </div>
          </div>

          {/* CTA to Installations Page */}
          <div className="mt-12 text-center">
            <Link
              href="/installations#wam"
              className="inline-flex items-center gap-2 rounded-xl bg-primary-500 px-8 py-4 text-lg font-bold text-white transition-all duration-300 hover:bg-primary-600 hover:shadow-xl"
            >
              View All Installation Examples
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* WAM Dashboard & Software */}
      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-neutral-900 lg:text-4xl">
              Powerful Cloud Dashboard
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-neutral-600">
              Monitor temperatures, view trends, and receive alerts from anywhere with our intuitive
              web-based dashboard
            </p>
          </div>

          <div className="mb-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                src: '/images/wam/dashboards/WAM_Graphic.webp',
                alt: 'WAM dashboard interface',
                title: 'Real-Time Monitoring Dashboard',
                description: 'View all sensor data at a glance with customizable views',
              },
              {
                src: '/images/wam/dashboards/Trays_1.webp',
                alt: 'Food serving tray temperature monitoring',
                title: 'Multi-Asset Monitoring',
                description: 'Track multiple locations and equipment simultaneously',
              },
              {
                src: '/images/wam/dashboards/Serving_Tray_Trend.webp',
                alt: 'Temperature trend graph',
                title: 'Historical Trending',
                description: 'Analyze patterns and prove compliance with detailed reports',
              },
              {
                src: '/images/wam/dashboards/WAM_Graphic2.webp',
                alt: 'WAM system overview dashboard',
                title: 'System Overview',
                description: 'Monitor entire facility status from a single screen',
              },
              {
                src: '/images/wam/dashboards/WAM_Graphic3.webp',
                alt: 'WAM alert management interface',
                title: 'Alert Management',
                description: 'Configure and manage temperature alerts and notifications',
              },
              {
                src: '/images/wam/dashboards/Trays_2.webp',
                alt: 'Multiple serving tray monitoring',
                title: 'Zone Comparison',
                description: 'Compare temperatures across different zones or assets',
              },
              {
                src: '/images/wam/dashboards/Serving_Tray_Trend2.webp',
                alt: 'Extended temperature trend analysis',
                title: 'Long-Term Trends',
                description: 'Track performance over days, weeks, or months',
              },
            ].map((dashboard, idx) => (
              <div
                key={idx}
                className="group overflow-hidden rounded-xl bg-neutral-50 transition-all duration-500 hover:shadow-2xl"
              >
                <div className="relative aspect-video overflow-hidden bg-neutral-100">
                  <Image
                    src={dashboard.src}
                    alt={dashboard.alt}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="mb-2 text-lg font-bold text-neutral-900 transition-colors group-hover:text-primary-600">
                    {dashboard.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-neutral-600">
                    {dashboard.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Dashboard Features Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: LineChart,
                title: 'Temperature Trends',
                description: 'Visualize temperature patterns over time',
              },
              {
                icon: Bell,
                title: 'Custom Alerts',
                description: 'Set thresholds for instant notifications',
              },
              {
                icon: Smartphone,
                title: 'Mobile Access',
                description: 'Monitor from any device, anywhere',
              },
              {
                icon: TrendingUp,
                title: 'Compliance Reports',
                description: 'Export data for audits and compliance',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="rounded-lg bg-neutral-50 p-6 text-center transition-all duration-300 hover:bg-white hover:shadow-lg"
              >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br from-primary-500 to-primary-600">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h4 className="mb-2 font-bold text-neutral-900">{feature.title}</h4>
                <p className="text-sm text-neutral-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Request Section */}
      <section
        id="demo"
        className="bg-linear-to-br from-primary-50 to-primary-100 py-16 lg:py-24"
      >
        <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-white p-8 shadow-2xl lg:p-12">
            <div className="grid gap-12 lg:grid-cols-2">
              {/* Left - Content */}
              <div>
                <h2 className="mb-4 text-3xl font-bold text-neutral-900 lg:text-4xl">
                  Ready to Get Started?
                </h2>
                <p className="mb-6 text-lg text-neutral-600">
                  Let us show you how WAM™ can protect your assets and prevent costly failures. Fill
                  out the form and we&apos;ll contact you to schedule a personalized demo.
                </p>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 h-6 w-6 flex-shrink-0 text-primary-500" />
                    <div>
                      <h4 className="font-bold text-neutral-900">Free Consultation</h4>
                      <p className="text-sm text-neutral-600">
                        Talk to our monitoring experts about your specific needs
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 h-6 w-6 flex-shrink-0 text-primary-500" />
                    <div>
                      <h4 className="font-bold text-neutral-900">Custom Pricing</h4>
                      <p className="text-sm text-neutral-600">
                        Flexible plans based on your monitoring requirements
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 h-6 w-6 flex-shrink-0 text-primary-500" />
                    <div>
                      <h4 className="font-bold text-neutral-900">Fast Implementation</h4>
                      <p className="text-sm text-neutral-600">
                        Be up and running in days, not weeks
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right - Form */}
              <div>
                <form className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="firstName"
                        className="mb-2 block text-sm font-semibold text-neutral-700"
                      >
                        First Name *
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        required
                        className="w-full rounded-lg border border-neutral-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="lastName"
                        className="mb-2 block text-sm font-semibold text-neutral-700"
                      >
                        Last Name *
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        required
                        className="w-full rounded-lg border border-neutral-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-semibold text-neutral-700"
                    >
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="w-full rounded-lg border border-neutral-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="mb-2 block text-sm font-semibold text-neutral-700"
                    >
                      Phone *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      className="w-full rounded-lg border border-neutral-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="company"
                      className="mb-2 block text-sm font-semibold text-neutral-700"
                    >
                      Company
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      className="w-full rounded-lg border border-neutral-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="industry"
                      className="mb-2 block text-sm font-semibold text-neutral-700"
                    >
                      Industry
                    </label>
                    <select
                      id="industry"
                      name="industry"
                      className="w-full rounded-lg border border-neutral-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">Select Industry</option>
                      <option value="healthcare">Healthcare & Pharmaceuticals</option>
                      <option value="food-service">Food Service & Restaurants</option>
                      <option value="cold-storage">Cold Storage & Distribution</option>
                      <option value="data-center">Data Centers & IT</option>
                      <option value="manufacturing">Manufacturing & Industrial</option>
                      <option value="grocery">Grocery & Retail</option>
                      <option value="research">Research Labs</option>
                      <option value="transportation">Transportation & Logistics</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="mb-2 block text-sm font-semibold text-neutral-700"
                    >
                      What would you like to monitor?
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      className="w-full rounded-lg border border-neutral-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-primary-500"
                      placeholder="Tell us about your monitoring needs..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-xl bg-accent-500 px-8 py-4 text-lg font-bold text-neutral-900 transition-all duration-300 hover:bg-accent-600 hover:shadow-xl"
                  >
                    Request Demo
                  </button>

                  <p className="text-center text-xs text-neutral-500">
                    By submitting this form, you agree to our privacy policy and terms of service.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="bg-primary-600 py-12 text-white">
        <div className="mx-auto max-w-content px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-2xl font-bold lg:text-3xl">
            Have questions about wireless monitoring?
          </h2>
          <p className="mb-6 text-primary-100">
            Talk to one of our technical experts. We&apos;re here to help you find the right solution.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/support/contact"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-3 font-bold text-primary-600 transition-all duration-300 hover:bg-primary-50"
            >
              Contact Support
            </Link>
            <Link
              href="/products/wireless"
              className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white bg-primary-500 px-8 py-3 font-bold text-white transition-all duration-300 hover:bg-primary-700"
            >
              Browse Wireless Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
