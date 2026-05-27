import Image from 'next/image';
import { Link } from '@/lib/navigation';
import { Metadata } from 'next';
import {
  ZapIcon,
  WifiIcon,
  BatteryIcon,
  TrendingUpIcon,
  ChevronRightIcon,
  CheckCircleIcon,
} from '@/lib/icons';
import { FeatureGrid } from '@/components/landing/FeatureGrid';
import { ProcessSteps } from '@/components/landing/ProcessSteps';

export const metadata: Metadata = {
  title: 'Wireless HVAC Sensors | BAPI',
  description:
    'Cost-effective, reliable wireless temperature and humidity monitoring for commercial buildings. Seamlessly integrate with your existing BMS without running new wires.',
};

export default function WirelessPage() {
  // Feature grid data - "Why Choose Wireless?"
  const features = [
    {
      icon: <ZapIcon className="h-12 w-12" />,
      title: 'No Wiring Required',
      description:
        'Eliminate expensive wire runs and reduce installation time by up to 70%.',
    },
    {
      icon: <WifiIcon className="h-12 w-12" />,
      title: 'Long Range Signal',
      description:
        'Up to 400ft range through walls and floors in typical commercial buildings.',
    },
    {
      icon: <BatteryIcon className="h-12 w-12" />,
      title: '10-Year Battery Life',
      description:
        'User-replaceable batteries last up to 10 years with optimized transmit intervals.',
    },
    {
      icon: <TrendingUpIcon className="h-12 w-12" />,
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
      image: '/images/wireless/Image (Outside Air Sensor).png',
    },
    {
      name: 'BAPI-Stat Quantum',
      slug: 'bapi-stat-quantum-wireless',
      features: [
        'Temperature or Temp/Humidity',
        'Optional temperature setpoint',
        'Occupant override button',
      ],
      image: '/images/wireless/Image (BAPI-Stat Quantum).png',
    },
    {
      name: 'Duct Sensor',
      slug: 'wireless-duct-sensor',
      features: [
        'Temperature or Temp/Humidity',
        'IP66-rated BAPI-Box enclosure',
        'Stainless steel probes 4 to 18"',
      ],
      image: '/images/wireless/Image (Duct Sensor).png',
    },
    {
      name: 'BAPI-Stat Quantum Slim',
      slug: 'bapi-stat-quantum-slim',
      features: [
        'Temperature or Temp/Humidity',
        'Internal or remote sensor',
        'Perfect for freezers & coolers',
      ],
      image: '/images/wireless/Image (BAPI-Stat Quantum Slim).png',
    },
    {
      name: 'Immersion Temperature',
      slug: 'wireless-immersion-temperature',
      features: [
        'Rugged IP66-rated enclosure',
        'Stainless steel probes (2-8")',
        'Ideal for pipe and tank monitoring',
      ],
      image: '/images/wireless/Image (Immersion Temperature).png',
    },
    {
      name: 'Thermobuffer Sensor',
      slug: 'wireless-thermobuffer',
      features: [
        'Ideal for freezers and coolers',
        '2 or 4 attached chamber',
        'Tracks contents temp vs air temp',
      ],
      image: '/images/wireless/Image (Thermobuffer Sensor).png',
    },
  ];

  // Analog output modules (3 cards)
  const analogModules = [
    {
      id: 'resistance-output',
      name: 'Resistance Output Module',
      slug: 'wireless-output-modules-bluetooth-wireless',
      description:
        'Converts temperature data into resistance for BAS inputs. Factory calibrated to output 10K-2, 10K 3, 10K 3(11K) or 20K thermistor curves.',
      image: '/images/wireless/modules/resistance.png',
    },
    {
      id: 'voltage-output',
      name: 'Voltage Output Module',
      slug: 'wireless-output-modules-bluetooth-wireless',
      description:
        'Converts temp/humidity data into linear 0-5V or 0-10V signals. Eight factory set temperature ranges and two humidity ranges available.',
      image: '/images/wireless/modules/voltage.png',
    },
    {
      id: 'setpoint-output',
      name: 'Setpoint Output Module',
      slug: 'wireless-output-modules-bluetooth-wireless',
      description:
        'Converts setpoint data into resistance or voltage for BAS. Five factory ranges with optional override function for occupancy control.',
      image: '/images/wireless/modules/setpoint.png',
    },
  ];

  // Digital output modules (2 cards)
  const digitalModules = [
    {
      id: 'bacnet-ip',
      name: 'BACnet IP Module',
      slug: 'wireless-output-modules-bluetooth-wireless',
      description:
        'Converts wireless sensor data for integration into the BMS ethernet communication network. Quick and easy web-based configuration. Surface, 2.75 snaptrack or 35mm DIN rail mountable.',
      image: '/images/wireless/modules/bacnet-ip.png',
    },
    {
      id: 'bacnet-modbus',
      name: 'BACnet MS/TP or Modbus RTU Module',
      slug: 'wireless-output-modules-bluetooth-wireless',
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

            {/* Right Column - Hero Images */}
            <div className="relative">
              <div className="relative overflow-hidden rounded-3xl bg-primary-600/40 p-8 shadow-2xl backdrop-blur-sm">
                <div className="flex items-center justify-center gap-6">
                  {/* Wireless Receiver with Signal Lines */}
                  <div className="relative flex-shrink-0">
                    {/* Wireless Signal Lines (Yellow) - Right side */}
                    <div className="absolute -right-6 top-1/2 z-10 -translate-y-1/2">
                      <div className="flex flex-col gap-1.5">
                        <div className="h-0.5 w-8 rounded-full bg-accent-500"></div>
                        <div className="h-0.5 w-10 rounded-full bg-accent-500"></div>
                        <div className="h-0.5 w-8 rounded-full bg-accent-500"></div>
                      </div>
                    </div>
                    
                    <div className="relative h-64 w-64">
                      <Image
                        src="/images/wireless/Image (Wireless Receiver)@3x.png"
                        alt="BAPI Wireless Receiver"
                        fill
                        className="object-contain"
                        sizes="256px"
                        priority
                      />
                    </div>
                    
                    {/* Receiver Label */}
                    <div className="mt-3 text-center">
                      <div className="inline-block rounded-full bg-white/90 px-4 py-1.5 text-sm font-semibold text-primary-700 shadow-md backdrop-blur-sm">
                        Wireless Receiver
                      </div>
                    </div>
                  </div>

                  {/* Sensor Units Row */}
                  <div className="flex items-end gap-4">
                    {/* White Sensor */}
                    <div className="flex flex-col items-center">
                      <div className="relative h-52 w-36">
                        <Image
                          src="/images/wireless/Quantum_Wireless_Main-1 1.png"
                          alt="BAPI Quantum Wireless Sensor"
                          fill
                          className="object-contain"
                          sizes="144px"
                        />
                      </div>
                      <div className="mt-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-primary-700 shadow-md backdrop-blur-sm">
                        Sensor
                      </div>
                    </div>

                    {/* Black Sensor */}
                    <div className="flex flex-col items-center">
                      <div className="relative h-52 w-36">
                        <Image
                          src="/images/wireless/Quantum_Wireless_Main-1 1.png"
                          alt="BAPI Quantum Wireless Sensor"
                          fill
                          className="object-contain brightness-[0.4] saturate-0"
                          sizes="144px"
                        />
                      </div>
                      <div className="mt-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-primary-700 shadow-md backdrop-blur-sm">
                        Sensor
                      </div>
                    </div>

                    {/* Slim Sensor */}
                    <div className="flex flex-col items-center">
                      <div className="relative h-52 w-36">
                        <Image
                          src="/images/wireless/Quantum-Slim-temp 1.png"
                          alt="BAPI Quantum Slim Sensor"
                          fill
                          className="object-contain"
                          sizes="144px"
                        />
                      </div>
                      <div className="mt-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-primary-700 shadow-md backdrop-blur-sm">
                        Sensor
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Wireless */}
      <section className="bg-neutral-50 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-primary-600 lg:text-4xl">
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
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-primary-600 lg:text-4xl">
              How It Works
            </h2>
            <p className="mx-auto max-w-3xl text-lg text-neutral-600">
              Our wireless system provides complete flexibility with multiple integration options
              to match your building automation setup.
            </p>
          </div>

          {/* Integration Diagram */}
          <div className="mb-16">
            <div className="relative mx-auto max-w-5xl overflow-hidden rounded-2xl border-2 border-primary-200 bg-white shadow-xl">
              <Image
                src="/images/wireless/Image (Wireless Integration Diagram).png"
                alt="BAPI Wireless Solution Integration Diagram"
                width={1248}
                height={896}
                className="h-auto w-full"
                sizes="(min-width: 1024px) 1024px, 100vw"
              />
            </div>
          </div>

          <ProcessSteps steps={processSteps} columns={3} showConnector={false} />
        </div>
      </section>

      {/* Wireless Sensors */}
      <section id="wireless-sensors" className="bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-primary-600 lg:text-4xl">
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
                className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-lg transition-all hover:shadow-xl"
              >
                {/* Product Image */}
                <div className="relative h-64 bg-neutral-50 p-16">
                  <Image
                    src={sensor.image}
                    alt={sensor.name}
                    fill
                    className="object-contain"
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  />
                </div>

                {/* Yellow Accent Bar */}
                <div className="h-1 w-full bg-accent-500" aria-hidden="true" />

                {/* Content */}
                <div className="flex flex-1 flex-col px-10 pb-12 pt-10">
                  <h3 className="mb-8 text-xl font-bold text-primary-600">{sensor.name}</h3>
                  <ul className="mb-12 flex-1 space-y-4 text-base text-neutral-700">
                    {sensor.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircleIcon
                          className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary-600"
                          aria-hidden="true"
                        />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/product/${sensor.slug}`}
                    className="inline-flex w-full items-center justify-center rounded-xl bg-primary-600 px-8 py-4 text-center font-semibold text-white transition-colors hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-500/50"
                    aria-label={`Learn more about ${sensor.name}`}
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
      <section className="bg-primary-50 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          {/* Centered Title */}
          <h2 className="mb-12 text-center text-3xl font-bold text-primary-700 lg:text-4xl">
            Wireless Receiver
          </h2>

          {/* Two Column Layout */}
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Image - Left Side */}
            <div className="relative">
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-white p-8 shadow-lg">
                <Image
                  src="/images/wireless/Image (Wireless Receiver).png"
                  alt="BAPI Wireless Receiver"
                  fill
                  className="object-contain"
                  sizes="(min-width: 1024px) 50vw, 100vw"
                />
              </div>
            </div>

            {/* Content - Right Side */}
            <div>
              <p className="mb-6 text-lg leading-relaxed text-neutral-700">
                The Wireless Receiver collects data from one or more wireless sensors and
                distributes it to output modules for seamless BMS integration. With
                field-selectable settings, you can customize performance to maximize battery life
                while ensuring your BMS gets the data it needs.
              </p>

              {/* Features List */}
              <div className="mb-6">
                <h3 className="mb-4 font-bold text-neutral-900">Field Selectable Settings:</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircleIcon
                      className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary-600"
                      aria-hidden="true"
                    />
                    <span className="text-neutral-700">Sample Rate/Interval</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircleIcon
                      className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary-600"
                      aria-hidden="true"
                    />
                    <span className="text-neutral-700">Transmit Rate/Interval</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircleIcon
                      className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary-600"
                      aria-hidden="true"
                    />
                    <span className="text-neutral-700">Delta Temperature</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircleIcon
                      className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary-600"
                      aria-hidden="true"
                    />
                    <span className="text-neutral-700">Delta Humidity</span>
                  </li>
                </ul>
              </div>

              {/* Callout Box */}
              <div className="rounded-lg border border-neutral-300 bg-white p-4 shadow-sm">
                <p className="text-center font-medium text-neutral-900">
                  Supports up to 127 different output modules
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Analog Output Modules */}
      <section className="bg-gradient-to-b from-white to-neutral-50 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          {/* Header Section - Two Column Layout */}
          <div className="mb-20 grid gap-12 lg:grid-cols-2 lg:gap-20">
            {/* Left Column - Text */}
            <div className="flex flex-col justify-center">
              <h2 className="mb-8 text-4xl font-bold text-primary-600 lg:text-5xl">
                Analog Output Modules
              </h2>
              <div className="space-y-6 text-base leading-relaxed text-neutral-700 lg:text-lg">
                <p>
                  The Wireless Receiver receives the signal from one or more wireless sensors
                  and supplies the data to{' '}
                  <strong className="text-primary-600">Analog Output Modules</strong> through
                  an RS485 four-wire bus. The modules convert the signal to an analog voltage or
                  resistance for the controller. The receiver can accommodate up to 127 different
                  modules.
                </p>
                <p>
                  The modules are easily trained to a single sensor variable with a pushbutton
                  and LCD. All modules are surface, 2.75" snaptrack, or 35mm DIN rail mountable.
                  They are powered by the receiver, or optionally may be powered separately when
                  the Pluggable Terminal Block Kit is used for remote connections.
                </p>
              </div>
            </div>

            {/* Right Column - Image */}
            <div className="flex items-center justify-center lg:justify-end">
              <div className="relative w-full">
                <div className="absolute -inset-4 rounded-2xl bg-gradient-to-br from-primary-100 to-accent-100 opacity-20 blur-2xl"></div>
                <div className="relative overflow-hidden rounded-xl bg-white p-6 shadow-xl">
                  <Image
                    src="/images/wireless/1-wireless-receiver-dom-modules.png"
                    alt="Wireless Receiver and Analog Output Modules"
                    width={700}
                    height={350}
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="h-auto w-full"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Product Cards - 3 Column Grid */}
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {analogModules.map((module) => (
              <div
                key={module.id}
                className="group overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:shadow-2xl"
              >
                {/* Product Image */}
                <div className="relative h-64 bg-neutral-50 p-16">
                  <Image
                    src={module.image}
                    alt={module.name}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-contain"
                  />
                </div>

                {/* Yellow Accent Bar */}
                <div className="h-1 w-full bg-accent-500" aria-hidden="true" />

                {/* Content */}
                <div className="flex flex-col px-8 pb-10 pt-8">
                  <h3 className="mb-4 text-xl font-bold text-primary-600 lg:text-2xl">
                    {module.name}
                  </h3>
                  <p className="mb-8 leading-relaxed text-neutral-700">{module.description}</p>
                  <Link
                    href={`/products/wireless-sensors/${module.slug}`}
                    className="block w-full rounded-lg bg-primary-600 px-6 py-3.5 text-center font-semibold text-white shadow-md transition-all duration-300 hover:bg-primary-700 hover:shadow-lg"
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
      <section className="bg-gradient-to-b from-white to-neutral-50 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          {/* Header Section - Two Column Layout */}
          <div className="mb-20 grid gap-12 lg:grid-cols-2 lg:gap-20">
            {/* Left Column - Text */}
            <div className="flex flex-col justify-center">
              <h2 className="mb-8 text-4xl font-bold text-primary-600 lg:text-5xl">
                Digital Output Modules
              </h2>
              <div className="space-y-6 text-base leading-relaxed text-neutral-700 lg:text-lg">
                <p>
                  The Wireless Receiver receives the signal from one or more wireless sensors
                  and supplies the data to{' '}
                  <strong className="text-primary-600">Digital Output Modules</strong>. The
                  modules convert the data to a digital signal for integration with the ethernet
                  communication network or the RS-485 field communication network. The receiver
                  can accommodate up to 28 wireless sensors for digital output.
                </p>
              </div>
            </div>

            {/* Right Column - Image */}
            <div className="flex items-center justify-center lg:justify-end">
              <div className="relative w-full">
                <div className="absolute -inset-4 rounded-2xl bg-gradient-to-br from-primary-100 to-accent-100 opacity-20 blur-2xl"></div>
                <div className="relative overflow-hidden rounded-xl bg-white p-6 shadow-xl">
                  <Image
                    src="/images/wireless/wireless-receiver-with-output-modules.png"
                    alt="Wireless Receiver with Digital Output Modules"
                    width={700}
                    height={350}
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="h-auto w-full"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Product Cards - 2 Column Grid */}
          <div className="grid gap-10 md:grid-cols-2">
            {digitalModules.map((module) => (
              <div
                key={module.id}
                className="group overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:shadow-2xl"
              >
                {/* Product Image */}
                <div className="relative h-64 bg-neutral-50 p-16">
                  <Image
                    src={module.image}
                    alt={module.name}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-contain"
                  />
                </div>

                {/* Yellow Accent Bar */}
                <div className="h-1 w-full bg-accent-500" aria-hidden="true" />

                {/* Content */}
                <div className="flex flex-col px-8 pb-10 pt-8">
                  <h3 className="mb-4 text-xl font-bold text-primary-600 lg:text-2xl">
                    {module.name}
                  </h3>
                  <p className="mb-8 leading-relaxed text-neutral-700">{module.description}</p>
                  <Link
                    href={`/products/wireless-sensors/${module.slug}`}
                    className="block w-full rounded-lg bg-primary-600 px-6 py-3.5 text-center font-semibold text-white shadow-md transition-all duration-300 hover:bg-primary-700 hover:shadow-lg"
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
      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left Column - Content */}
            <div>
              <h2 className="mb-6 text-3xl font-bold text-primary-600 lg:text-4xl">
                Worried about signal strength?
              </h2>
              <p className="mb-8 text-lg leading-relaxed text-neutral-700">
                Get peace of mind before you place an order. BAPI's easy-to-use app lets you
                verify sensor distances in your application using just your smart device and our
                Wireless BAPI-Stat Quantum Slim Sensor.
              </p>
              <Link
                href="/wireless-site-verification"
                className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-8 py-4 font-semibold text-white transition-colors hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-500/50"
              >
                Learn More
              </Link>
            </div>

            {/* Right Column - Image */}
            <div className="relative">
              <Image
                src="/images/wireless/Image (BAPI Wireless App).png"
                alt="BAPI Wireless App on smartphone"
                width={800}
                height={600}
                className="h-auto w-full rounded-lg"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-primary-600 py-20 text-white lg:py-28">
        <div className="mx-auto max-w-4xl px-6 text-center sm:px-8 lg:px-12">
          <h2 className="mb-6 text-3xl font-bold lg:text-4xl">Contact Us</h2>
          <p className="mb-8 text-lg leading-relaxed text-primary-50">
            Have questions about our wireless solutions? Our team is here to help you find the
            perfect monitoring system for your application.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-lg bg-accent-500 px-8 py-4 font-semibold text-neutral-900 transition-colors hover:bg-accent-600 focus:outline-none focus:ring-4 focus:ring-accent-500/50"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </main>
  );
}
