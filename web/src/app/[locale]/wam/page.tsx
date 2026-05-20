import type { Metadata } from 'next';
import { Link } from '@/lib/navigation';
import Image from 'next/image';
import {
  RadioIcon,
  WifiIcon,
  BellIcon,
  LineChartIcon,
  ShieldIcon,
  ZapIcon,
  DollarSignIcon,
  TrendingUpIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  CloudIcon,
  SmartphoneIcon,
  AlertTriangleIcon,
} from '@/lib/icons';

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
      <section className="bg-linear-to-br relative from-primary-700 via-primary-600 to-primary-500 text-white">
        <div className="mx-auto max-w-container px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left Column - Content */}
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm">
                <RadioIcon className="h-4 w-4" />
                <span className="text-sm font-semibold">WAM™ Wireless Asset Monitoring</span>
              </div>

              <h1 className="mb-6 text-4xl font-bold leading-tight lg:text-5xl xl:text-6xl">
                Protect your valuable assets with real-time monitoring
              </h1>

              <p className="mb-8 text-xl leading-relaxed text-primary-50">
                24/7 monitoring with instant alerts to avoid costly equipment failures. Monitor
                temperature, humidity, and more from anywhere with BAPI&apos;s proven wireless
                solutions.
              </p>

              <div className="flex flex-col gap-4 sm:flex-row">
                <a
                  href="#demo"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent-500 px-8 py-4 text-lg font-bold text-neutral-900 transition-all duration-300 hover:bg-accent-600 hover:shadow-xl"
                >
                  Request Demo
                  <ArrowRightIcon className="h-5 w-5" />
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

            {/* Right Column - Visual */}
            <div className="relative flex items-center justify-center">
              <div className="overflow-hidden rounded-2xl border border-white/20 bg-white/10 p-3 backdrop-blur-lg md:p-4 lg:p-1">
                <Image
                  src="/images/wam/dashboards/wam-sensors-with-gateway.png"
                  alt="WAM wireless sensors with gateway - temperature and humidity monitoring system"
                  width={522}
                  height={336}
                  className="h-auto w-full lg:scale-150"
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 522px"
                  priority
                  quality={90}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is WAM Section */}
      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary-600 lg:text-base">
              The Solution
            </p>
            <h2 className="mb-6 text-4xl font-bold text-neutral-900 lg:text-5xl">What is WAM?</h2>
            <div className="mx-auto max-w-3xl space-y-4 text-lg leading-relaxed text-neutral-600 lg:text-xl">
              <p>
                The Wireless Asset Monitoring (WAM) Remote website allows users to monitor and
                record readings from sensors and receive alerts if a problem arises. Readings from
                the sensors are sent to the cloud and can be accessed via a web browser on any
                web-enabled device.
              </p>
              <p>
                WAM helps protect your assets against incidents like equipment failure, power loss
                and more. You can set up custom alerts to warn you when there is a problem so you
                can address it quickly. WAM can also increase efficiency by eliminating the need to
                take manual readings and logs. WAM provides peace of mind for your business.
              </p>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: RadioIcon,
                title: 'Wireless Sensors',
                description:
                  'Battery-powered sensors transmit real-time temperature, humidity, and pressure data without complex wiring.',
              },
              {
                icon: CloudIcon,
                title: 'Cloud Dashboard',
                description:
                  'Web-based monitoring accessible from any device. View trends, set thresholds, and receive instant alerts.',
              },
              {
                icon: BellIcon,
                title: 'Smart Alerts',
                description:
                  'Customizable notifications via SMS, email, or phone call when conditions exceed safe operating ranges.',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl bg-neutral-50 p-8 transition-shadow duration-300 hover:shadow-lg"
              >
                <div className="bg-linear-to-br mb-6 flex h-16 w-16 items-center justify-center rounded-full from-primary-500 to-primary-600">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-neutral-900">{feature.title}</h3>
                <p className="leading-relaxed text-neutral-700">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="bg-neutral-50 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary-600 lg:text-base">
              Simple Setup
            </p>
            <h2 className="mb-6 text-4xl font-bold text-neutral-900 lg:text-5xl">How It Works</h2>
            <p className="mx-auto max-w-3xl text-lg leading-relaxed text-neutral-600 lg:text-xl">
              Simple setup, powerful protection. WAM™ connects your assets to the cloud in four easy
              steps.
            </p>
          </div>

          {/* How It Works Infographic */}
          <div className="mb-16">
            <div className="relative mx-auto max-w-5xl overflow-hidden rounded-2xl bg-white shadow-xl">
              <Image
                src="/images/wam/dashboards/WAM_Graphic.webp"
                alt="WAM System How It Works - Sensors send readings to gateway, gateway sends to cloud, view on any device"
                width={1400}
                height={900}
                className="h-auto w-full"
                sizes="(max-width: 1024px) 100vw, 1024px"
              />
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                step: '1',
                icon: RadioIcon,
                title: 'Install Sensors',
                description: 'Mount wireless sensors near critical equipment. No wiring needed.',
              },
              {
                step: '2',
                icon: WifiIcon,
                title: 'Connect Gateway',
                description: 'Gateway receives sensor data and sends to secure cloud.',
              },
              {
                step: '3',
                icon: CloudIcon,
                title: 'Access Dashboard',
                description: 'View real-time data and historical trends from any device.',
              },
              {
                step: '4',
                icon: BellIcon,
                title: 'Receive Alerts',
                description: 'Get instant notifications when conditions exceed thresholds.',
              },
            ].map((step) => (
              <div key={step.step} className="relative">
                <div className="rounded-xl bg-white p-6 shadow-md transition-shadow duration-300 hover:shadow-xl">
                  <div className="absolute -left-4 -top-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent-500 text-xl font-bold text-neutral-900 shadow-lg">
                    {step.step}
                  </div>
                  <div className="bg-linear-to-br mb-4 mt-2 flex h-14 w-14 items-center justify-center rounded-full from-primary-500 to-primary-600">
                    <step.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-neutral-900">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-neutral-700">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Alert Banner */}
      <section className="bg-accent-500 py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-4 text-neutral-900">
            <AlertTriangleIcon className="h-6 w-6 flex-shrink-0" />
            <p className="text-center text-lg font-semibold">
              Avoid costly losses from power outages or equipment failure with 24/7 asset monitoring
              from BAPI.
            </p>
          </div>
        </div>
      </section>

      {/* Why WAM Section */}
      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <p className="mb-3 text-base font-semibold uppercase tracking-wide text-primary-600 lg:text-lg">
              Benefits
            </p>
            <h2 className="mb-6 text-4xl font-bold text-neutral-900 lg:text-5xl">
              Why Choose WAM?
            </h2>
            <p className="mx-auto max-w-3xl text-lg leading-relaxed text-neutral-600 lg:text-xl">
              Traditional asset monitoring methods can be time-consuming, error-prone, and often
              fail to provide real-time insights. However, with our advanced wireless sensor
              technology, you can take control of your asset protection strategy like never before.
              Here&apos;s how our solution can transform your business:
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-10">
            {[
              {
                icon: DollarSignIcon,
                title: 'Cost Savings',
                description:
                  'Preventing losses directly impacts your bottom line. By leveraging wireless sensors for asset monitoring, you can significantly reduce the risk of damage or total loss. Minimize financial waste, insurance claims, and costly downtime while maximizing the lifespan of your assets.',
              },
              {
                icon: ZapIcon,
                title: 'Proactive Loss Prevention',
                description:
                  'Identify and mitigate potential risks before they escalate into costly losses. Our wireless sensors offer intelligent alerts and notifications, empowering you to respond quickly to any suspicious activity, unauthorized access, or abnormal behavior. Stay one step ahead of potential threats and protect your assets effectively.',
              },
              {
                icon: SmartphoneIcon,
                title: 'Monitor Anywhere',
                description:
                  'Gain instant access to critical asset data from anywhere, at any time. Our wireless sensors enable you to monitor your assets in real-time, providing you with up-to-the-minute information on their status and condition. Stay informed and make informed decisions with confidence.',
              },
              {
                icon: LineChartIcon,
                title: 'Historical Trends',
                description:
                  'Analyze patterns, prove compliance, and optimize operations with detailed reporting.',
              },
              {
                icon: ShieldIcon,
                title: 'Enhanced Operational Efficiency',
                description:
                  'Streamline your asset management processes and improve overall operational efficiency. Our wireless sensors automate data collection, reducing manual efforts and freeing up valuable time for your team. Simplify inventory management, optimize supply chain logistics, and make data-driven decisions to optimize your business operations.',
              },
              {
                icon: TrendingUpIcon,
                title: 'Scalable Solutions',
                description:
                  'We understand that every business has unique requirements. Our wireless sensor solutions are customizable to fit your specific needs, ensuring a tailored approach to asset protection. Moreover, our scalable architecture allows you to expand your asset monitoring system as your business grows, effortlessly adapting to your changing demands.',
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

      {/* Industries Section */}
      <section className="bg-neutral-50 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary-600 lg:text-base">
              Applications
            </p>
            <h2 className="mb-6 text-4xl font-bold text-neutral-900 lg:text-5xl">
              Industries We Serve
            </h2>
            <p className="mx-auto max-w-3xl text-lg leading-relaxed text-neutral-600 lg:text-xl">
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
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary-600 lg:text-base">
              Our Products
            </p>
            <h2 className="mb-6 text-4xl font-bold text-neutral-900 lg:text-5xl">
              Wireless Products
            </h2>
            <p className="mx-auto max-w-3xl text-lg leading-relaxed text-neutral-600 lg:text-xl">
              Complete range of wireless sensors for temperature, humidity, pressure, and more
            </p>
          </div>

          <div className="mb-12 grid gap-8 md:grid-cols-3">
            {[
              {
                title: 'Temperature Sensors',
                description:
                  'Wireless temperature monitoring for refrigeration, freezers, and critical spaces',
                link: '/products/wireless-sensors/bluetooth-wireless',
              },
              {
                title: 'Humidity Sensors',
                description:
                  'Monitor relative humidity in warehouses, data centers, and clean rooms',
                link: '/products/wireless-sensors/bluetooth-wireless',
              },
              {
                title: 'Pressure Sensors',
                description:
                  'Differential pressure monitoring for filter status and room pressurization',
                link: '/products/wireless-sensors/bluetooth-wireless',
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
                <p className="mb-4 text-neutral-700">{product.description}</p>
                <div className="flex items-center gap-2 font-semibold text-primary-500">
                  Learn More
                  <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/products/wireless-sensors/bluetooth-wireless"
              className="inline-flex items-center gap-2 rounded-xl bg-primary-500 px-8 py-4 text-lg font-bold text-white transition-all duration-300 hover:bg-primary-600 hover:shadow-xl"
            >
              View All Wireless Products
              <ArrowRightIcon className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Demo Request Section */}
      <section id="demo" className="bg-linear-to-br from-primary-50 to-primary-100 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-white p-8 shadow-2xl lg:p-12">
            <div className="grid gap-12 lg:grid-cols-2">
              {/* Left - Content */}
              <div>
                <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary-600">
                  Get Started
                </p>
                <h2 className="mb-6 text-4xl font-bold text-neutral-900 lg:text-5xl">
                  Ready to Get Started?
                </h2>
                <p className="mb-8 text-lg leading-relaxed text-neutral-600">
                  Let us show you how WAM™ can protect your assets and prevent costly failures. Fill
                  out the form and we&apos;ll contact you to schedule a personalized demo.
                </p>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircleIcon className="mt-0.5 h-6 w-6 flex-shrink-0 text-primary-500" />
                    <div>
                      <h4 className="font-bold text-neutral-900">Free Consultation</h4>
                      <p className="text-sm text-neutral-700">
                        Talk to our monitoring experts about your specific needs
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircleIcon className="mt-0.5 h-6 w-6 flex-shrink-0 text-primary-500" />
                    <div>
                      <h4 className="font-bold text-neutral-900">Custom Pricing</h4>
                      <p className="text-sm text-neutral-700">
                        Flexible plans based on your monitoring requirements
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircleIcon className="mt-0.5 h-6 w-6 flex-shrink-0 text-primary-500" />
                    <div>
                      <h4 className="font-bold text-neutral-900">Fast Implementation</h4>
                      <p className="text-sm text-neutral-700">
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

                  <p className="text-center text-xs text-neutral-700">
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
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-2xl font-bold lg:text-3xl">
            Have questions about wireless monitoring?
          </h2>
          <p className="mb-6 text-primary-100">
            Talk to one of our technical experts. We&apos;re here to help you find the right
            solution.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/support/contact"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-3 font-bold text-primary-600 transition-all duration-300 hover:bg-primary-50"
            >
              Contact Support
            </Link>
            <Link
              href="/products/wireless-sensors/bluetooth-wireless"
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
