import type { Metadata } from 'next';
import Link from 'next/link';
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
      <section className="relative bg-gradient-to-br from-primary-700 via-primary-600 to-primary-500 text-white">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <Radio className="w-4 h-4" />
                <span className="text-sm font-semibold">WAM™ Wireless Asset Monitoring</span>
              </div>
              
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 leading-tight">
                Protect your valuable assets with real-time monitoring
              </h1>
              
              <p className="text-xl text-primary-50 mb-8 leading-relaxed">
                24/7 monitoring with instant alerts to avoid costly equipment failures. 
                Monitor temperature, humidity, and more from anywhere with BAPI's proven wireless solutions.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#demo"
                  className="inline-flex items-center justify-center gap-2 bg-accent-500 hover:bg-accent-600 text-neutral-900 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:shadow-xl"
                >
                  Request Demo
                  <ArrowRight className="w-5 h-5" />
                </a>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-2 border-white/30 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300"
                >
                  How It Works
                </a>
              </div>

              {/* Trust Badges */}
              <div className="mt-12 flex flex-wrap gap-6 text-sm text-primary-100">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>Made in USA</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>ISO 9001 Certified</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>30+ Years Experience</span>
                </div>
              </div>
            </div>

            {/* Right Column - Visual */}
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: Wifi, label: 'Real-time Data', value: '24/7' },
                    { icon: Bell, label: 'Instant Alerts', value: 'SMS/Email' },
                    { icon: Cloud, label: 'Cloud Dashboard', value: 'Anywhere' },
                    { icon: Shield, label: 'Prevent Losses', value: 'Proactive' },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10"
                    >
                      <stat.icon className="w-8 h-8 mb-2 text-accent-500" />
                      <div className="text-2xl font-bold mb-1">{stat.value}</div>
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
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-4">
              What is WAM?
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              WAM™ (Wireless Asset Monitoring) is BAPI's complete solution for protecting 
              temperature-sensitive equipment and inventory from costly failures.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
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
                className="bg-neutral-50 rounded-xl p-8 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="bg-gradient-to-br from-primary-500 to-primary-600 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-3">{feature.title}</h3>
                <p className="text-neutral-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 lg:py-24 bg-neutral-50">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Simple setup, powerful protection. WAM™ connects your assets to the cloud in four easy steps.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
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
                <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow duration-300">
                  <div className="absolute -top-4 -left-4 bg-accent-500 text-neutral-900 w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl shadow-lg">
                    {step.step}
                  </div>
                  <div className="bg-gradient-to-br from-primary-500 to-primary-600 w-14 h-14 rounded-full flex items-center justify-center mb-4 mt-2">
                    <step.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-neutral-900 mb-2">{step.title}</h3>
                  <p className="text-neutral-600 text-sm leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Alert Banner */}
      <section className="bg-accent-500 py-6">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-4 text-neutral-900">
            <AlertTriangle className="w-6 h-6 flex-shrink-0" />
            <p className="text-lg font-semibold text-center">
              Avoid costly losses from power outages or equipment failure with 24/7 asset monitoring from BAPI.
            </p>
          </div>
        </div>
      </section>

      {/* Why WAM Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-4">
              Why Choose WAM?
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Trusted by enterprises, healthcare facilities, and data centers worldwide for mission-critical monitoring.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                className="group bg-neutral-50 rounded-xl p-6 hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-primary-200"
              >
                <div className="bg-gradient-to-br from-primary-500 to-primary-600 w-14 h-14 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <benefit.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-bold text-neutral-900 mb-2">{benefit.title}</h3>
                <p className="text-neutral-600 text-sm leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section className="py-16 lg:py-24 bg-neutral-50">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-4">
              Industries We Serve
            </h2>
            <p className="text-xl text-neutral-600">
              WAM™ protects critical assets across diverse industries
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
                className="bg-white rounded-lg p-4 border border-neutral-200 hover:border-primary-500 hover:shadow-md transition-all duration-300 text-center"
              >
                <p className="text-neutral-700 font-medium">{industry}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Wireless Products Section */}
      <section id="products" className="py-16 lg:py-24 bg-white">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-4">
              Wireless Products
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Complete range of wireless sensors for temperature, humidity, pressure, and more
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[
              {
                title: 'Temperature Sensors',
                description: 'Wireless temperature monitoring for refrigeration, freezers, and critical spaces',
                link: '/products/wireless/temperature',
              },
              {
                title: 'Humidity Sensors',
                description: 'Monitor relative humidity in warehouses, data centers, and clean rooms',
                link: '/products/wireless/humidity',
              },
              {
                title: 'Pressure Sensors',
                description: 'Differential pressure monitoring for filter status and room pressurization',
                link: '/products/wireless/pressure',
              },
            ].map((product) => (
              <Link
                key={product.title}
                href={product.link}
                className="group bg-neutral-50 rounded-xl p-6 hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-primary-500"
              >
                <h3 className="text-xl font-bold text-neutral-900 mb-3 group-hover:text-primary-500 transition-colors">
                  {product.title}
                </h3>
                <p className="text-neutral-600 mb-4">{product.description}</p>
                <div className="flex items-center gap-2 text-primary-500 font-semibold">
                  Learn More
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/products/wireless"
              className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:shadow-xl"
            >
              View All Wireless Products
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Demo Request Section */}
      <section id="demo" className="py-16 lg:py-24 bg-gradient-to-br from-primary-50 to-primary-100">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-2xl p-8 lg:p-12">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Left - Content */}
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-4">
                  Ready to Get Started?
                </h2>
                <p className="text-lg text-neutral-600 mb-6">
                  Let us show you how WAM™ can protect your assets and prevent costly failures. 
                  Fill out the form and we'll contact you to schedule a personalized demo.
                </p>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-primary-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-neutral-900">Free Consultation</h4>
                      <p className="text-neutral-600 text-sm">
                        Talk to our monitoring experts about your specific needs
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-primary-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-neutral-900">Custom Pricing</h4>
                      <p className="text-neutral-600 text-sm">
                        Flexible plans based on your monitoring requirements
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-primary-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-neutral-900">Fast Implementation</h4>
                      <p className="text-neutral-600 text-sm">
                        Be up and running in days, not weeks
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right - Form */}
              <div>
                <form className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-semibold text-neutral-700 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        required
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-semibold text-neutral-700 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        required
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-neutral-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-neutral-700 mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="company" className="block text-sm font-semibold text-neutral-700 mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="industry" className="block text-sm font-semibold text-neutral-700 mb-2">
                      Industry
                    </label>
                    <select
                      id="industry"
                      name="industry"
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
                    <label htmlFor="message" className="block text-sm font-semibold text-neutral-700 mb-2">
                      What would you like to monitor?
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Tell us about your monitoring needs..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-accent-500 hover:bg-accent-600 text-neutral-900 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:shadow-xl"
                  >
                    Request Demo
                  </button>

                  <p className="text-xs text-neutral-500 text-center">
                    By submitting this form, you agree to our privacy policy and terms of service.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="bg-primary-600 text-white py-12">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl lg:text-3xl font-bold mb-4">
            Have questions about wireless monitoring?
          </h2>
          <p className="text-primary-100 mb-6">
            Talk to one of our technical experts. We're here to help you find the right solution.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/support/contact"
              className="inline-flex items-center justify-center gap-2 bg-white text-primary-600 px-8 py-3 rounded-xl font-bold hover:bg-primary-50 transition-all duration-300"
            >
              Contact Support
            </Link>
            <Link
              href="/products/wireless"
              className="inline-flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-700 text-white border-2 border-white px-8 py-3 rounded-xl font-bold transition-all duration-300"
            >
              Browse Wireless Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
