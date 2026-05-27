import Image from 'next/image';
import { Link } from '@/lib/navigation';
import { Metadata } from 'next';
import {
  WifiOffIcon,
  SignalCellularAltIcon,
  BatteryFullIcon,
  LayersIcon,
} from '@/lib/icons';
import { FeatureGrid } from '@/components/landing/FeatureGrid';
import { ProcessSteps } from '@/components/landing/ProcessSteps';
import { ProductHighlight } from '@/components/landing/ProductHighlight';
import { CTABanner } from '@/components/landing/CTABanner';

export const metadata: Metadata = {
  title: 'Wireless HVAC Sensors | BAPI',
  description:
    'Cost-effective, reliable wireless temperature and humidity monitoring for commercial buildings. Seamlessly integrate with your existing BMS without running new wires.',
};

export default function WirelessPage() {
  // Feature grid data - "Why Choose Wireless?"
  const features = [
    {
      icon: <WifiOffIcon className="h-12 w-12" />,
      title: 'No Wiring Required',
      description:
        'Eliminate expensive wire runs and reduce installation time by up to 70%.',
    },
    {
      icon: <SignalCellularAltIcon className="h-12 w-12" />,
      title: 'Long Range Signal',
      description:
        'Up to 400ft range through walls and floors in typical commercial buildings.',
    },
    {
      icon: <BatteryFullIcon className="h-12 w-12" />,
      title: '10-Year Battery Life',
      description:
        'User-replaceable batteries last up to 10 years with optimized transmit intervals.',
    },
    {
      icon: <LayersIcon className="h-12 w-12" />,
      title: 'Easy Scalability',
      description:
        'Add up to 127 sensors per receiver. Expand your system as your needs grow.',
    },
  ];

  // Process steps data - "How It Works"
  const processSteps = [
    {
      number: 1,
      title: 'Wireless Sensors',
      description:
        'Choose from temperature, humidity, or combination sensors for any application from outside air to duct to room monitoring.',
    },
    {
      number: 2,
      title: 'Wireless Receiver',
      description:
        'The receiver collects data from up to 127 sensors and distributes it to output modules for BMS integration.',
    },
    {
      number: 3,
      title: 'Output Modules',
      description:
        'Convert sensor data to analog signals (0-10V, resistance) or digital protocols (BACnet IP, BACnet MS/TP, Modbus RTU).',
    },
  ];

  // Wireless sensors data (matching Matt's 6-card layout)
  const wirelessSensors = [
    {
      name: 'Outside Air Sensor',
      slug: 'wireless-outside-air-sensor',
      features: [
        'Temperature or Temp/Humidity',
        'Barometric pressure sensing',
        'Optional light level sensing',
      ],
      image: '/images/wireless/sensors/outside-air.png',
    },
    {
      name: 'BAPI-Stat Quantum',
      slug: 'bapi-stat-quantum-wireless',
      features: [
        'Temperature or Temp/Humidity',
        'Optional temperature setpoint',
        'Occupant override button',
      ],
      image: '/images/wireless/sensors/quantum.png',
    },
    {
      name: 'Duct Sensor',
      slug: 'wireless-duct-sensor',
      features: [
        'Temperature or Temp/Humidity',
        'IP66-rated BAPI-Box enclosure',
        'Stainless steel probes 4 to 18"',
      ],
      image: '/images/wireless/sensors/duct.png',
    },
    {
      name: 'BAPI-Stat Quantum Slim',
      slug: 'bapi-stat-quantum-slim',
      features: [
        'Temperature or Temp/Humidity',
        'Internal or remote sensor',
        'Perfect for freezers & coolers',
      ],
      image: '/images/wireless/sensors/quantum-slim.png',
    },
    {
      name: 'Immersion Temperature',
      slug: 'wireless-immersion-temperature',
      features: [
        'Rugged IP66-rated enclosure',
        'Stainless steel probes (2-8")',
        'Ideal for pipe and tank monitoring',
      ],
      image: '/images/wireless/sensors/immersion.png',
    },
    {
      name: 'Thermobuffer Sensor',
      slug: 'wireless-thermobuffer',
      features: [
        'Ideal for freezers and coolers',
        '2 or 4 attached chamber',
        'Tracks contents temp vs air temp',
      ],
      image: '/images/wireless/sensors/thermobuffer.png',
    },
  ];

  // Analog output modules (3 cards)
  const analogModules = [
    {
      name: 'Resistance Output Module',
      slug: 'wireless-resistance-output',
      description:
        'Converts temperature data into resistance for BAS inputs. Factory calibrated to output 10K-2, 10K 3, 10K 3(11K) or 20K thermistor curves.',
      image: '/images/wireless/modules/resistance.png',
    },
    {
      name: 'Voltage Output Module',
      slug: 'wireless-voltage-output',
      description:
        'Converts temp/humidity data into linear 0-5V or 0-10V signals. Eight factory set temperature ranges and two humidity ranges available.',
      image: '/images/wireless/modules/voltage.png',
    },
    {
      name: 'Setpoint Output Module',
      slug: 'wireless-setpoint-output',
      description:
        'Converts setpoint data into resistance or voltage for BAS. Five factory ranges with optional override function for occupancy control.',
      image: '/images/wireless/modules/setpoint.png',
    },
  ];

  // Digital output modules (2 cards)
  const digitalModules = [
    {
      name: 'BACnet IP Module',
      slug: 'wireless-bacnet-ip',
      description:
        'Converts wireless sensor data for integration into the BMS ethernet communication network. Quick and easy web-based configuration. Surface, 2.75 snaptrack or 35mm DIN rail mountable.',
      image: '/images/wireless/modules/bacnet-ip.png',
    },
    {
      name: 'BACnet MS/TP or Modbus RTU Module',
      slug: 'wireless-bacnet-modbus',
      description:
        'Field-selectable protocol lets you choose BACnet MS/TP or Modbus RTU without needing multiple devices. Perfect for RS-485 field network integration. USB-C configuration.',
      image: '/images/wireless/modules/bacnet-modbus.png',
    },
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-600 to-primary-500 py-16 text-white lg:py-20">
        <div className="absolute inset-0 bg-[url('/images/patterns/grid.svg')] opacity-10" />

        <div className="relative z-10 mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left Column - Content */}
            <div>
              <h1 className="mb-6 text-4xl font-bold leading-tight lg:text-5xl">
                Wireless HVAC Sensors
              </h1>
              <p className="mb-8 text-lg leading-relaxed text-primary-50 lg:text-xl">
                Cost-effective, reliable wireless temperature and humidity monitoring for
                commercial buildings. Seamlessly integrate with your existing BMS without running
                new wires.
              </p>
              <Link
                href="#wireless-sensors"
                className="inline-flex items-center gap-2 rounded-lg bg-accent-500 px-8 py-4 font-bold text-neutral-900 transition-all hover:bg-accent-600 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-accent-500/50"
              >
                Get Started
              </Link>
            </div>

            {/* Right Column - Hero Image */}
            <div className="relative">
              <div className="relative aspect-video overflow-hidden rounded-2xl bg-white/10 p-4 shadow-2xl backdrop-blur-sm">
                <div className="relative aspect-video">
                  <Image
                    src="/images/wireless/wireless-hvac-banner-web-scaled.png"
                    alt="BAPI Wireless HVAC Sensors"
                    fill
                    className="object-contain"
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Wireless */}
      <section className="bg-neutral-50 py-16 lg:py-20">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-neutral-900 lg:text-4xl">
              Why Choose Wireless?
            </h2>
            <p className="mx-auto max-w-3xl text-lg text-neutral-600">
              Reduce installation costs, increase flexibility, and simplify retrofits with our
              proven wireless technology.
            </p>
          </div>
          <FeatureGrid features={features} columns={4} />
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-neutral-900 lg:text-4xl">
              How It Works
            </h2>
            <p className="mx-auto max-w-3xl text-lg text-neutral-600">
              Our wireless system provides complete flexibility with multiple integration options
              to match your building automation setup.
            </p>
          </div>
          <ProcessSteps steps={processSteps} columns={3} showConnector />
        </div>
      </section>

      {/* Wireless Sensors */}
      <section id="wireless-sensors" className="bg-neutral-50 py-16 lg:py-20">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-neutral-900 lg:text-4xl">
              Wireless Sensors
            </h2>
            <p className="mx-auto max-w-4xl text-lg text-neutral-600">
              The same high-quality, 100% tested sensors BAPI has made for 30 years, now with
              wireless integration. Choose the perfect sensor for your application.
            </p>
          </div>

          {/* 3x2 Grid */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {wirelessSensors.map((sensor) => (
              <div
                key={sensor.slug}
                className="group overflow-hidden rounded-lg border border-neutral-200 bg-white transition-all hover:border-primary-500 hover:shadow-xl"
              >
                {/* Product Image */}
                <div className="relative aspect-square bg-neutral-50 p-8">
                  <Image
                    src={sensor.image}
                    alt={sensor.name}
                    fill
                    className="object-contain transition-transform group-hover:scale-105"
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  />
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="mb-4 text-lg font-bold text-neutral-900">{sensor.name}</h3>
                  <ul className="mb-6 space-y-2 text-sm text-neutral-600">
                    {sensor.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="mt-1 text-primary-600">•</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/products/${sensor.slug}`}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary-600 px-6 py-3 font-bold text-white transition-all hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-500/50"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Wireless Receiver */}
      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <ProductHighlight
            title="Wireless Receiver"
            description="The Wireless Receiver collects data from one or more wireless sensors and distributes it to output modules for seamless BMS integration. With field-selectable settings, you can customize performance to maximize battery life while ensuring your BMS gets the data it needs."
            imageSrc="/images/wireless/wireless-receiver.png"
            imageAlt="BAPI Wireless Receiver"
            features={[
              'Sample Rate/Interval',
              'Transmit Rate/Interval',
              'Delta Temperature',
              'Delta Humidity',
              'Supports up to 127 different output modules',
            ]}
            imagePosition="right"
          />
        </div>
      </section>

      {/* Analog Output Modules */}
      <section className="bg-neutral-50 py-16 lg:py-20">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-neutral-900 lg:text-4xl">
              Analog Output Modules
            </h2>
            <p className="mx-auto max-w-3xl text-lg text-neutral-600">
              Convert wireless sensor data into analog signals compatible with traditional BAS
              controller inputs.
            </p>
          </div>

          {/* 3-column grid */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {analogModules.map((module) => (
              <div
                key={module.slug}
                className="group overflow-hidden rounded-lg border border-neutral-200 bg-white transition-all hover:border-primary-500 hover:shadow-xl"
              >
                <div className="relative aspect-square bg-neutral-50 p-8">
                  <Image
                    src={module.image}
                    alt={module.name}
                    fill
                    className="object-contain transition-transform group-hover:scale-105"
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  />
                </div>
                <div className="p-6">
                  <h3 className="mb-3 text-lg font-bold text-neutral-900">{module.name}</h3>
                  <p className="mb-6 text-sm leading-relaxed text-neutral-600">
                    {module.description}
                  </p>
                  <Link
                    href={`/products/${module.slug}`}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary-600 px-6 py-3 font-bold text-white transition-all hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-500/50"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Digital Output Modules */}
      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-neutral-900 lg:text-4xl">
              Digital Output Modules
            </h2>
            <p className="mx-auto max-w-3xl text-lg text-neutral-600">
              Integrate wireless sensors directly into your BMS network with standard building
              automation protocols.
            </p>
          </div>

          {/* 2-column grid */}
          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
            {digitalModules.map((module) => (
              <div
                key={module.slug}
                className="group overflow-hidden rounded-lg border border-neutral-200 bg-white transition-all hover:border-primary-500 hover:shadow-xl"
              >
                <div className="relative aspect-square bg-neutral-50 p-8">
                  <Image
                    src={module.image}
                    alt={module.name}
                    fill
                    className="object-contain transition-transform group-hover:scale-105"
                    sizes="(min-width: 768px) 50vw, 100vw"
                  />
                </div>
                <div className="p-6">
                  <h3 className="mb-3 text-lg font-bold text-neutral-900">{module.name}</h3>
                  <p className="mb-6 text-sm leading-relaxed text-neutral-600">
                    {module.description}
                  </p>
                  <Link
                    href={`/products/${module.slug}`}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary-600 px-6 py-3 font-bold text-white transition-all hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-500/50"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Signal Strength CTA */}
      <CTABanner
        title="Worried about signal strength?"
        description="Get peace of mind before you place an order. BAPI's easy-to-use app lets you verify sensor distances in your application using just your smart device and our Wireless BAPI-Stat Quantum Slim Sensor."
        buttonText="Learn More"
        buttonHref="/wireless-site-verification"
        variant="blue"
      />

      {/* Contact CTA */}
      <CTABanner
        title="Contact Us"
        description="Use WAM to prevent costly losses and maintain compliance. Schedule a demo today."
        buttonText="Contact Us"
        buttonHref="/contact"
        variant="blue"
      />
    </main>
  );
}
