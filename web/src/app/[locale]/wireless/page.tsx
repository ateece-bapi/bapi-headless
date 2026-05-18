import Image from 'next/image';
import { Link } from '@/lib/navigation';
import { Metadata } from 'next';
import {
  ArrowRightIcon,
  RadioIcon,
  WifiIcon,
  CableIcon,
  SettingsIcon,
  ChevronRightIcon,
  CheckCircleIcon,
} from '@/lib/icons';

export const metadata: Metadata = {
  title: 'Wireless Building Automation Solutions | BAPI',
  description:
    'BAPI Wireless sensors and controls for HVAC and building automation systems. BLE Gateway, BACnet/IP integration, and modular I/O expansion for seamless BAS connectivity.',
};

export default function WirelessPage() {
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
            <span className="font-medium text-white">Wireless Solutions</span>
          </nav>

          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-accent-500/20 px-4 py-2 font-semibold text-accent-500 backdrop-blur">
                <RadioIcon className="h-4 w-4" />
                <span>Building Automation</span>
              </div>

              <h1 className="mb-6 text-balance text-4xl font-bold sm:text-5xl lg:text-6xl">
                Wireless Sensors & Controls
                <span className="mt-2 block text-accent-500">for HVAC Systems</span>
              </h1>
              <p className="mb-8 max-w-2xl text-xl text-primary-50 lg:text-2xl">
                BAPI Wireless solutions deliver reliable sensor data and control signals to your
                building automation system—without running wires.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/products?category=wireless"
                  className="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-8 py-4 text-lg font-bold text-neutral-900 transition-all duration-300 hover:scale-105 hover:bg-accent-600 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-accent-500/50 focus:ring-offset-2 focus:ring-offset-primary-700"
                >
                  View All Products
                  <ArrowRightIcon className="h-5 w-5" />
                </Link>
                <Link
                  href="/request-quote"
                  className="inline-flex items-center gap-2 rounded-xl border-2 border-white/30 bg-white/10 px-8 py-4 text-lg font-bold text-white backdrop-blur transition-all duration-300 hover:scale-105 hover:border-white/50 hover:bg-white/20 focus:outline-none focus:ring-4 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-primary-700"
                >
                  Request Quote
                </Link>
              </div>

              {/* Key Stats */}
              <div className="mt-12 grid grid-cols-3 gap-6 border-t border-white/20 pt-12">
                <div className="group relative cursor-default">
                  <div className="absolute inset-0 rounded-xl border-2 border-accent-500/20 bg-accent-500/10 opacity-0 transition-all duration-300 group-hover:scale-105 group-hover:opacity-100" />
                  <div className="relative p-4 text-center">
                    <div className="mb-2 text-3xl font-bold text-accent-500 transition-transform duration-300 group-hover:scale-110 lg:text-4xl">
                      900 MHz
                    </div>
                    <div className="text-sm font-medium text-primary-100 lg:text-base">
                      LoRa Range
                    </div>
                  </div>
                </div>
                <div className="group relative cursor-default">
                  <div className="absolute inset-0 rounded-xl border-2 border-accent-500/20 bg-accent-500/10 opacity-0 transition-all duration-300 group-hover:scale-105 group-hover:opacity-100" />
                  <div className="relative p-4 text-center">
                    <div className="mb-2 text-3xl font-bold text-accent-500 transition-transform duration-300 group-hover:scale-110 lg:text-4xl">
                      BLE
                    </div>
                    <div className="text-sm font-medium text-primary-100 lg:text-base">
                      Bluetooth 5.0
                    </div>
                  </div>
                </div>
                <div className="group relative cursor-default">
                  <div className="absolute inset-0 rounded-xl border-2 border-accent-500/20 bg-accent-500/10 opacity-0 transition-all duration-300 group-hover:scale-105 group-hover:opacity-100" />
                  <div className="relative p-4 text-center">
                    <div className="mb-2 text-3xl font-bold text-accent-500 transition-transform duration-300 group-hover:scale-110 lg:text-4xl">
                      BACnet
                    </div>
                    <div className="text-sm font-medium text-primary-100 lg:text-base">
                      Native IP
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="group/image relative aspect-[16/10] overflow-hidden rounded-2xl bg-white p-2 shadow-2xl">
                <Image
                  src="/images/wireless/wireless-hvac-banner-web-scaled.png"
                  alt="BAPI Wireless building automation sensors"
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-contain transition-transform duration-700 group-hover/image:scale-105"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WIRELESS RECEIVERS Banner */}
      <section className="bg-gradient-to-br from-primary-700 via-primary-600 to-primary-500 py-8">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold uppercase tracking-wider text-white lg:text-3xl">
              WIRELESS RECEIVERS
            </h2>
            <p className="mt-2 text-base text-primary-100">
              900 MHz LoRa receivers with analog and digital outputs for direct BAS integration
            </p>
          </div>
        </div>
      </section>

      {/* Analog Output Modules */}
      <section className="bg-neutral-50 py-14 lg:py-16">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="mb-3 text-2xl font-bold text-neutral-900 lg:text-3xl">
              Analog Output Modules
            </h2>
            <p className="mx-auto max-w-3xl text-lg text-neutral-700">
              900 MHz LoRa receivers with analog voltage or current outputs for direct BAS integration
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* 16-Channel 0-10V Receiver */}
            <div className="rounded-xl border-2 border-neutral-200 bg-white p-6 transition-all duration-300 hover:-translate-y-2 hover:border-primary-500 hover:shadow-xl">
              <div className="mb-6">
                <div className="relative aspect-[3/2] overflow-hidden rounded-lg bg-neutral-50">
                  <Image
                    src="/images/wireless/Wireless_BLE_Gateway_2023.webp"
                    alt="16-Channel 0-10V Wireless Receiver"
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-contain p-4"
                  />
                </div>
              </div>
              <h3 className="mb-2 text-xl font-bold text-neutral-900">
                16-Channel 0-10V Receiver
              </h3>
              <p className="mb-4 text-sm text-neutral-700">
                Receive data from up to 16 wireless sensors with 0-10V DC analog outputs
              </p>
              <ul className="mb-6 space-y-2 text-xs text-neutral-700">
                {[
                  '16 analog 0-10V DC outputs',
                  'DIN rail or wall mount',
                  'BACnet/IP or Modbus TCP',
                  '900 MHz LoRa wireless',
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircleIcon className="mt-0.5 h-3 w-3 flex-shrink-0 text-primary-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/products/bluetooth-wireless/wireless-gateway"
                className="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-primary-600"
              >
                View Details
                <ArrowRightIcon className="h-3 w-3" />
              </Link>
            </div>

            {/* 8-Channel 4-20mA Receiver */}
            <div className="rounded-xl border-2 border-neutral-200 bg-white p-6 transition-all duration-300 hover:-translate-y-2 hover:border-primary-500 hover:shadow-xl">
              <div className="mb-6">
                <div className="relative aspect-[3/2] overflow-hidden rounded-lg bg-neutral-50">
                  <Image
                    src="/images/wireless/Wireless_BLE_Receiver_Group_DIN.webp"
                    alt="8-Channel 4-20mA Wireless Receiver"
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-contain p-4"
                  />
                </div>
              </div>
              <h3 className="mb-2 text-xl font-bold text-neutral-900">
                8-Channel 4-20mA Receiver
              </h3>
              <p className="mb-4 text-sm text-neutral-700">
                Industrial-grade current loop outputs for process control applications
              </p>
              <ul className="mb-6 space-y-2 text-xs text-neutral-700">
                {[
                  '8 analog 4-20mA outputs',
                  'Isolated current loops',
                  'BACnet/IP or Modbus RTU',
                  'DIN rail mount',
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircleIcon className="mt-0.5 h-3 w-3 flex-shrink-0 text-primary-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/products/bluetooth-wireless/wireless-gateway"
                className="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-primary-600"
              >
                View Details
                <ArrowRightIcon className="h-3 w-3" />
              </Link>
            </div>

            {/* BACnet/IP Module */}
            <div className="rounded-xl border-2 border-neutral-200 bg-white p-6 transition-all duration-300 hover:-translate-y-2 hover:border-primary-500 hover:shadow-xl">
              <div className="mb-6">
                <div className="relative aspect-[3/2] overflow-hidden rounded-lg bg-neutral-50">
                  <Image
                    src="/images/wireless/Wireless_BLE_BACnet_IP_Module-1.png"
                    alt="BACnet/IP Wireless Module"
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-contain p-4"
                  />
                </div>
              </div>
              <h3 className="mb-2 text-xl font-bold text-neutral-900">
                BACnet/IP Integration Module
              </h3>
              <p className="mb-4 text-sm text-neutral-700">
                Native BACnet/IP connectivity for plug-and-play BAS integration
              </p>
              <ul className="mb-6 space-y-2 text-xs text-neutral-700">
                {[
                  'Direct BACnet/IP protocol',
                  'Ethernet connectivity',
                  'Up to 16 sensor points',
                  'Standard BACnet objects',
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircleIcon className="mt-0.5 h-3 w-3 flex-shrink-0 text-primary-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/products/bluetooth-wireless/wireless-gateway"
                className="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-primary-600"
              >
                View Details
                <ArrowRightIcon className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Digital Output Modules */}
      <section className="bg-gradient-to-br from-neutral-50 to-white py-16 lg:py-24">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-neutral-900 lg:text-4xl">
              Digital Output Modules (DOM)
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-neutral-700">
              Modular relay output systems for wireless sensor-based control applications
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:max-w-4xl lg:mx-auto">
            {/* Receiver with DOM Modules */}
            <div className="rounded-xl border-2 border-neutral-200 bg-white p-8 transition-all duration-300 hover:-translate-y-2 hover:border-primary-500 hover:shadow-xl">
              <div className="mb-6">
                <div className="relative aspect-[3/2] overflow-hidden rounded-lg bg-neutral-50">
                  <Image
                    src="/images/wireless/wireless-receiver-with-output-modules.png"
                    alt="Wireless Receiver with Output Modules"
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-contain p-4"
                  />
                </div>
              </div>
              <h3 className="mb-3 text-2xl font-bold text-neutral-900">
                Receiver with DOM Slots
              </h3>
              <p className="mb-6 text-neutral-700">
                Base receiver with hot-swappable digital output module slots for flexible configuration
              </p>
              <ul className="mb-6 space-y-2 text-sm text-neutral-700">
                {[
                  'Up to 8 DOM module slots',
                  'Hot-swappable modules',
                  'Web-based configuration',
                  '16 wireless sensor inputs',
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircleIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/products/bluetooth-wireless/wireless-accessories"
                className="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-6 py-3 font-semibold text-white transition-all hover:bg-primary-600"
              >
                View Details
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>

            {/* Individual DOM Modules */}
            <div className="rounded-xl border-2 border-neutral-200 bg-white p-8 transition-all duration-300 hover:-translate-y-2 hover:border-primary-500 hover:shadow-xl">
              <div className="mb-6">
                <div className="relative aspect-[3/2] overflow-hidden rounded-lg bg-neutral-50">
                  <Image
                    src="/images/wireless/wireless-receiver-with-dom-module-1.png"
                    alt="Digital Output Module"
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-contain p-4"
                  />
                </div>
              </div>
              <h3 className="mb-3 text-2xl font-bold text-neutral-900">
                Individual DOM Modules
              </h3>
              <p className="mb-6 text-neutral-700">
                SPDT relay output modules for on/off control based on wireless sensor readings
              </p>
              <ul className="mb-6 space-y-2 text-sm text-neutral-700">
                {[
                  'SPDT relay (1A @ 24VAC)',
                  'Configurable setpoints',
                  'High/low alarm outputs',
                  'LED status indicators',
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircleIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/products/bluetooth-wireless/wireless-accessories"
                className="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-6 py-3 font-semibold text-white transition-all hover:bg-primary-600"
              >
                View Details
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* BAPI Wireless Solution Integration */}
      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-neutral-900 lg:text-4xl">
              System Integration
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-neutral-700">
              Complete wireless solution for building automation systems
            </p>
          </div>

          <div className="mx-auto max-w-4xl">
            <div className="overflow-hidden rounded-xl border-2 border-neutral-200 bg-white p-8 shadow-lg">
              <div className="relative aspect-[4/3]">
                <Image
                  src="/images/wireless/wireless-integration-graphic.png"
                  alt="BAPI Wireless Solution Integration Architecture"
                  fill
                  sizes="(min-width: 1024px) 900px, 100vw"
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Wireless Sensors */}
      <section className="bg-white py-14 lg:py-16">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="mb-3 text-2xl font-bold text-neutral-900 lg:text-3xl">
              Wireless Sensors
            </h2>
            <p className="mx-auto max-w-3xl text-lg text-neutral-700">
              Bluetooth Low Energy sensors with 5-year battery life for temperature, humidity,
              and environmental monitoring
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: 'Room Temperature & Humidity',
                description: 'Wall-mount sensor with LCD display for occupied spaces',
                features: ['±0.3°C / ±2% RH accuracy', 'LCD display', '5-year battery'],
                href: '/products/bluetooth-wireless/wireless-room',
              },
              {
                title: 'Duct Temperature',
                description: 'High-accuracy duct mount sensor for HVAC applications',
                features: ['±0.2°C accuracy', '316 SS probe', 'Duct mount'],
                href: '/products/bluetooth-wireless/wireless-non-room',
              },
              {
                title: 'Outside Air Temperature',
                description: 'Weatherproof sensor for outdoor environmental monitoring',
                features: ['IP67 rated', '-40°C to 80°C range', 'UV resistant'],
                href: '/products/bluetooth-wireless/wireless-non-room',
              },
              {
                title: 'Immersion Temperature',
                description: 'Probe sensor for liquid temperature monitoring',
                features: ['6" stainless probe', '±0.2°C accuracy', 'Glycol compatible'],
                href: '/products/bluetooth-wireless/wireless-non-room',
              },
              {
                title: 'CO₂ Sensor',
                description: 'Indoor air quality sensor with CO₂ and temperature',
                features: ['NDIR CO₂ (0-2000 ppm)', 'Temperature sensor', '5-year battery'],
                href: '/products/bluetooth-wireless/wireless-room',
              },
              {
                title: 'Differential Pressure',
                description: 'Filter and airflow monitoring sensor',
                features: ['0-1" W.C. range', '±3% accuracy', 'Magnet mount'],
                href: '/products/bluetooth-wireless/wireless-non-room',
              },
              {
                title: 'Averaging Temperature',
                description: 'Multi-point averaging for large spaces and ducts',
                features: ['Up to 16 sensing points', 'Flexible cable lengths', 'RTD accuracy'],
                href: '/products/bluetooth-wireless/wireless-non-room',
              },
              {
                title: 'Outdoor Humidity',
                description: 'Weatherproof temperature and humidity monitoring',
                features: ['IP67 rated', '±2% RH accuracy', 'Solar radiation shield'],
                href: '/products/bluetooth-wireless/wireless-non-room',
              },
              {
                title: 'Pressure Sensor',
                description: 'Static pressure monitoring for HVAC systems',
                features: ['0-5" W.C. range', '±2% accuracy', 'Compact design'],
                href: '/products/bluetooth-wireless/wireless-non-room',
              },
            ].map((sensor, idx) => (
              <div
                key={idx}
                className="rounded-lg border border-neutral-200 bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:border-primary-500 hover:shadow-md"
              >
                <h3 className="mb-1 text-base font-bold text-neutral-900">{sensor.title}</h3>
                <p className="mb-3 text-xs text-neutral-700">{sensor.description}</p>
                <ul className="mb-3 space-y-1 text-xs text-neutral-600">
                  {sensor.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="h-1 w-1 flex-shrink-0 rounded-full bg-primary-500" />
                      <span className="leading-tight">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={sensor.href}
                  className="text-xs font-semibold text-primary-500 transition-colors hover:text-primary-600"
                >
                  View Products →
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/products/bluetooth-wireless"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-primary-500 bg-white px-8 py-4 text-lg font-bold text-primary-500 transition-all duration-300 hover:bg-primary-500 hover:text-white hover:shadow-lg"
            >
              Browse All Wireless Sensors
              <ArrowRightIcon className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="bg-gradient-to-br from-neutral-50 to-white py-16 lg:py-20">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Left Column - Heading & Image */}
            <div>
              <h2 className="mb-4 text-3xl font-bold text-neutral-900 lg:text-4xl">
                Have Questions? Ready to Move Your Wireless Project Forward?
              </h2>
              <p className="mb-8 text-xl text-neutral-700">
                Our wireless specialists can help you design the right solution for your
                building automation needs.
              </p>

              <div className="relative aspect-[2/1] overflow-hidden rounded-xl bg-white p-2 shadow-lg">
                <Image
                  src="/images/wireless/wireless-receiver-graphic-2-e1757514218714.png"
                  alt="BAPI wireless receiver system"
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-contain"
                />
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircleIcon className="h-6 w-6 text-primary-500" />
                  <span className="text-neutral-700">Free technical consultation</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircleIcon className="h-6 w-6 text-primary-500" />
                  <span className="text-neutral-700">Signal strength site analysis available</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircleIcon className="h-6 w-6 text-primary-500" />
                  <span className="text-neutral-700">Custom system design support</span>
                </div>
              </div>
            </div>

            {/* Right Column - Form */}
            <div className="rounded-xl border-2 border-neutral-200 bg-white p-8 shadow-lg">
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm font-semibold text-neutral-900">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full rounded-lg border border-neutral-300 px-4 py-3 text-neutral-900 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-semibold text-neutral-900">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full rounded-lg border border-neutral-300 px-4 py-3 text-neutral-900 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                    placeholder="your.email@company.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="mb-2 block text-sm font-semibold text-neutral-900">
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full rounded-lg border border-neutral-300 px-4 py-3 text-neutral-900 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div>
                  <label htmlFor="company" className="mb-2 block text-sm font-semibold text-neutral-900">
                    Company
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    className="w-full rounded-lg border border-neutral-300 px-4 py-3 text-neutral-900 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                    placeholder="Your company name"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="mb-2 block text-sm font-semibold text-neutral-900">
                    Project Details / Questions *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    className="w-full rounded-lg border border-neutral-300 px-4 py-3 text-neutral-900 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                    placeholder="Tell us about your wireless project needs..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-primary-500 px-8 py-4 text-lg font-bold text-white transition-all duration-300 hover:bg-primary-600 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-primary-500/50"
                >
                  Send Message
                </button>

                <p className="text-center text-xs text-neutral-600">
                  We'll respond within 1 business day. Or call us at{' '}
                  <a href="tel:+1-952-808-9999" className="font-semibold text-primary-500 hover:underline">
                    952-808-9999
                  </a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t-4 border-accent-500 bg-gradient-to-br from-primary-700 via-primary-600 to-primary-500 py-16 text-white lg:py-24">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="mb-4 text-3xl font-bold lg:text-4xl">
              Ready to Go Wireless?
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-xl text-primary-50">
              Contact our team to discuss your wireless building automation project
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/request-quote"
                className="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-8 py-4 text-lg font-bold text-neutral-900 transition-all duration-300 hover:scale-105 hover:bg-accent-600 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-accent-500/50 focus:ring-offset-2 focus:ring-offset-primary-700"
              >
                Request a Quote
                <ArrowRightIcon className="h-5 w-5" />
              </Link>
              <Link
                href="/support"
                className="inline-flex items-center gap-2 rounded-xl border-2 border-white/30 bg-white/10 px-8 py-4 text-lg font-bold text-white backdrop-blur transition-all duration-300 hover:scale-105 hover:border-white/50 hover:bg-white/20 focus:outline-none focus:ring-4 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-primary-700"
              >
                Technical Support
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* WAM Cross-Reference */}
      <section className="border-t border-neutral-200 bg-neutral-50 py-12">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <div className="rounded-xl border-l-4 border-primary-500 bg-white p-8 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary-50">
                <WifiIcon className="h-6 w-6 text-primary-500" />
              </div>
              <div>
                <h3 className="mb-2 text-xl font-bold text-neutral-900">
                  Looking for Wireless Asset Monitoring (WAM)?
                </h3>
                <p className="mb-4 text-neutral-700">
                  WAM is our retail/food service temperature monitoring solution with cloud
                  dashboards and mobile app—a separate product line from our building automation
                  wireless products.
                </p>
                <Link
                  href="/wam"
                  className="inline-flex items-center gap-2 font-semibold text-primary-500 transition-colors hover:text-primary-600"
                >
                  Learn About WAM
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
