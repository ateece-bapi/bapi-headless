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
                  href="/products/bluetooth-wireless"
                  className="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-8 py-4 text-lg font-bold text-neutral-900 transition-all duration-300 hover:scale-105 hover:bg-accent-600 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-accent-500/50 focus:ring-offset-2 focus:ring-offset-primary-700"
                >
                  Browse Wireless Products
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

      {/* Seamless Wireless Integration */}
      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 border-t-4 border-accent-500 pt-8">
              <h2 className="mb-8 text-3xl font-bold uppercase tracking-wide text-primary-600 lg:text-4xl">
                Seamless Wireless Integration Into Your BMS
              </h2>
              
              <div className="space-y-6 text-lg leading-relaxed text-neutral-700">
                <p>
                  BAPI's Wireless System offers a cost-effective and reliable way to enhance your hard-wired HVAC system. The suite of room and non-room sensors transmit their data to a Wireless Receiver up to 100 feet away. The user-adjustable receiver then converts the data into either a voltage or resistive value for the controller of a BAS.
                </p>
                
                <p>
                  BAPI's Wireless System provides both flexibility and reliability. Each sensor/transmitter features a customizable transmission rate and transmission power, which allows users to optimize battery life and signal reliability at each unique installation. The Wireless Receiver supports up to 28 sensors and 127 Analog Output Modules. The Receiver and Analog Output Modules can be surface, snaptrack or DIN rail mounted.
                </p>
              </div>

              <div className="mt-8 text-center">
                <Link
                  href="/products/bluetooth-wireless"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary-500 px-8 py-4 text-lg font-bold text-white transition-all duration-300 hover:bg-primary-600 hover:shadow-xl"
                >
                  Browse All Wireless Products
                  <ArrowRightIcon className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Wireless Receiver */}
      <section className="bg-gradient-to-b from-white to-neutral-50 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          {/* Header */}
          <div className="mb-16 text-center">
            <h2 className="mb-8 text-4xl font-bold text-primary-600 lg:text-5xl">
              Wireless Receiver
            </h2>
            <p className="mx-auto max-w-5xl text-lg leading-relaxed text-neutral-700 lg:text-xl">
              The Wireless Receiver from BAPI receives the data from one or more wireless sensors. The data is then transferred to the Digital & Analog Output Modules and converted to BACnet IP, BACnet MS/TP, Modbus RTU, or an analog voltage or resistance. The receiver supports analog up to 28 sensors and up to 127 different Analog Output Modules, and supports digital up to 28 sensors. The receiver includes several user-adjustable settings to maximize battery life while ensuring the BMS gets the information it needs.
            </p>
          </div>

          {/* Product Showcase - Three Column Grid */}
          <div className="mb-20 grid gap-12 lg:grid-cols-3">
            {/* Column 1: Receiver Unit Image */}
            <div className="flex flex-col justify-center lg:col-span-1">
              <div className="relative w-full">
                <div className="absolute -inset-4 rounded-2xl bg-gradient-to-br from-primary-100 to-accent-100 opacity-20 blur-2xl"></div>
                <div className="relative overflow-hidden rounded-xl bg-white p-8 shadow-xl">
                  <div className="relative aspect-square">
                    <Image
                      src="/images/wireless/wireless-receiver.png"
                      alt="BAPI Wireless Receiver"
                      fill
                      sizes="(min-width: 1024px) 33vw, 100vw"
                      className="object-contain"
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Column 2: Field Selectable Settings */}
            <div className="flex flex-col justify-center lg:col-span-1">
              <div className="h-full rounded-xl border-2 border-primary-200 bg-gradient-to-br from-white to-primary-50/30 p-8 shadow-lg">
                <h3 className="mb-6 text-2xl font-bold text-primary-600">
                  Field Selectable Settings
                </h3>
                <ul className="space-y-4">
                  {[
                    'Sample Rate/Interval',
                    'Transmit Rate/Interval',
                    'Delta Temperature',
                    'Delta Humidity',
                  ].map((setting) => (
                    <li key={setting} className="flex items-start gap-3">
                      <CheckCircleIcon className="mt-1 h-5 w-5 flex-shrink-0 text-primary-500" />
                      <span className="text-lg text-neutral-700">{setting}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 rounded-lg bg-white/60 p-4">
                  <p className="text-sm italic text-neutral-600">
                    User-adjustable settings optimize battery life while ensuring the BMS receives timely data.
                  </p>
                </div>
              </div>
            </div>

            {/* Column 3: Settings Diagram */}
            <div className="flex flex-col justify-center lg:col-span-1">
              <div className="relative w-full">
                <div className="absolute -inset-4 rounded-2xl bg-gradient-to-br from-accent-100 to-primary-100 opacity-20 blur-2xl"></div>
                <div className="relative overflow-hidden rounded-xl bg-white p-6 shadow-xl">
                  <div className="relative aspect-[4/5]">
                    <Image
                      src="/images/wireless/wireless-receiver-settings.png"
                      alt="Wireless Receiver Field Selectable Settings Diagram"
                      fill
                      sizes="(min-width: 1024px) 33vw, 100vw"
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* How Does It Work - Full Width */}
          <div className="relative">
            <div className="mb-6 text-center">
              <h3 className="text-3xl font-bold text-primary-600">
                How Does It Work?
              </h3>
            </div>
            <div className="overflow-hidden rounded-2xl border-2 border-neutral-200 bg-white shadow-2xl">
              <div className="relative aspect-[16/5]">
                <Image
                  src="/images/wireless/wireless-receiver-graphic-2-e1757514218714.png"
                  alt="Wireless Receiver System Architecture - How Does It Work?"
                  fill
                  sizes="100vw"
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA - Browse Wireless Products */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-container px-4 text-center sm:px-6 lg:px-8">
          <Link
            href="/products/bluetooth-wireless"
            className="inline-flex items-center gap-2 rounded-xl bg-primary-500 px-8 py-4 text-lg font-bold text-white transition-all duration-300 hover:bg-primary-600 hover:shadow-xl"
          >
            Browse Our Wireless Products
            <ArrowRightIcon className="h-5 w-5" />
          </Link>
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
                  The Wireless Receiver receives the signal from one or more wireless sensors and supplies the data to <strong className="text-primary-600">Analog Output Modules</strong> through an RS485 four-wire bus. The modules convert the signal to an analog voltage or resistance for the controller. The receiver can accommodate up to 127 different modules.
                </p>
                <p>
                  The modules are easily trained to a single sensor variable with a pushbutton and LCD. All modules are surface, 2.75" snaptrack, or 35mm DIN rail mountable. They are powered by the receiver, or optionally may be powered separately when the Pluggable Terminal Block Kit is used for remote connections.
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
            {/* Resistance Output Module */}
            <div className="group relative overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
              <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-accent-400 via-accent-500 to-accent-600"></div>
              <div className="p-8">
                <div className="relative mb-6 h-52 overflow-hidden rounded-lg bg-gradient-to-br from-neutral-50 to-neutral-100">
                  <Image
                    src="/images/wireless/Wireless_BLE_ROM_Module-3.png"
                    alt="Resistance Output Module"
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <h3 className="mb-4 text-xl font-bold text-primary-600 transition-colors group-hover:text-primary-700 lg:text-2xl">
                  Resistance Output Module
                </h3>
                <p className="mb-8 leading-relaxed text-neutral-700">
                  The Resistance Output Module (ROM) converts the temperature data from the BAPI Receiver into a resistance for the BAS controller inputs. The unit is factory calibrated to output a 10K-2, 10K-3, 10K-3(UK), or 20K thermistor curve.
                </p>
                <Link 
                  href="/product/resistance-output-module-rom-for-wireless-system"
                  className="block w-full rounded-lg bg-primary-500 px-6 py-3.5 text-center font-semibold text-white shadow-md transition-all duration-300 hover:bg-primary-600 hover:shadow-lg"
                >
                  Learn More
                </Link>
              </div>
            </div>

            {/* Voltage Output Module */}
            <div className="group relative overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
              <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-accent-400 via-accent-500 to-accent-600"></div>
              <div className="p-8">
                <div className="relative mb-6 h-52 overflow-hidden rounded-lg bg-gradient-to-br from-neutral-50 to-neutral-100">
                  <Image
                    src="/images/wireless/Wireless_BLE_ROM_Module-3.png"
                    alt="Voltage Output Module"
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <h3 className="mb-4 text-xl font-bold text-primary-600 transition-colors group-hover:text-primary-700 lg:text-2xl">
                  Voltage Output Module
                </h3>
                <p className="mb-8 leading-relaxed text-neutral-700">
                  The Voltage Output Module (VOM) converts the temperature or humidity data from the BAPI Receiver into a linear 0 to 5 or 0 to 10 volt signal for the controller. There are eight factory set temperature ranges (°F and °C) and two humidity ranges of 0 to 100% or 35 to 70%RH.
                </p>
                <Link 
                  href="/product/voltage-output-module-vom-for-wireless-system"
                  className="block w-full rounded-lg bg-primary-500 px-6 py-3.5 text-center font-semibold text-white shadow-md transition-all duration-300 hover:bg-primary-600 hover:shadow-lg"
                >
                  Learn More
                </Link>
              </div>
            </div>

            {/* Setpoint Output Module */}
            <div className="group relative overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
              <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-accent-400 via-accent-500 to-accent-600"></div>
              <div className="p-8">
                <div className="relative mb-6 h-52 overflow-hidden rounded-lg bg-gradient-to-br from-neutral-50 to-neutral-100">
                  <Image
                    src="/images/wireless/Wireless_BLE_ROM_Module-3.png"
                    alt="Setpoint Output Module"
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <h3 className="mb-4 text-xl font-bold text-primary-600 transition-colors group-hover:text-primary-700 lg:text-2xl">
                  Setpoint Output Module
                </h3>
                <p className="mb-8 leading-relaxed text-neutral-700">
                  The Setpoint Output Module (SOM) converts the setpoint data from the BAPI receiver into a resistance or a voltage for the BAS controller. There are five factory set voltage and resistive ranges, each with an optional override function.
                </p>
                <Link 
                  href="/product/setpoint-output-module-som-for-wireless-system"
                  className="block w-full rounded-lg bg-primary-500 px-6 py-3.5 text-center font-semibold text-white shadow-md transition-all duration-300 hover:bg-primary-600 hover:shadow-lg"
                >
                  Learn More
                </Link>
              </div>
            </div>
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
                  The Wireless Receiver receives the signal from one or more wireless sensors and supplies the data to <strong className="text-primary-600">Digital Output Modules</strong>. The modules convert the data to a digital signal for integration with the ethernet communication network or the RS-485 field communication network. The receiver can accommodate up to 28 wireless sensors for digital output.
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
            {/* BACnet IP Module */}
            <div className="group relative overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
              <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-accent-400 via-accent-500 to-accent-600"></div>
              <div className="p-8">
                <div className="relative mb-6 h-52 overflow-hidden rounded-lg bg-gradient-to-br from-neutral-50 to-neutral-100">
                  <Image
                    src="/images/wireless/Wireless_BLE_BACnet_IP_Module-1.png"
                    alt="BACnet IP Module"
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <h3 className="mb-4 text-xl font-bold text-primary-600 transition-colors group-hover:text-primary-700 lg:text-2xl">
                  BACnet IP Module
                </h3>
                <p className="mb-8 leading-relaxed text-neutral-700">
                  The BACnet IP Module converts the data from wireless sensors for integration into the BMS ethernet communication network. Because BACnet IP is a standard protocol, the module is perfect for retrofitting older systems or adding new ones.
                </p>
                <p className="mb-8 leading-relaxed text-neutral-700">
                  Configuration is quick and easy through a web-based interface, allowing both setup and adjustment without physically accessing the device once it's installed.
                </p>
                <p className="mb-8 leading-relaxed text-neutral-700">
                  The receiver and BACnet IP module are surface, 2.75" snaptrack or 35mmDIN rail mountable.
                </p>
                <Link 
                  href="/product/bacnet-ip-module"
                  className="block w-full rounded-lg bg-primary-500 px-6 py-3.5 text-center font-semibold text-white shadow-md transition-all duration-300 hover:bg-primary-600 hover:shadow-lg"
                >
                  Learn More
                </Link>
              </div>
            </div>

            {/* BACnet MS/TP or Modbus RTU Module */}
            <div className="group relative overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
              <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-accent-400 via-accent-500 to-accent-600"></div>
              <div className="p-8">
                <div className="relative mb-6 h-52 overflow-hidden rounded-lg bg-gradient-to-br from-neutral-50 to-neutral-100">
                  <Image
                    src="/images/wireless/wireless-receiver-bacnet-ip-1.png"
                    alt="BACnet MS/TP or Modbus RTU Module"
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <h3 className="mb-4 text-xl font-bold text-primary-600 transition-colors group-hover:text-primary-700 lg:text-2xl">
                  BACnet MS/TP or Modbus RTU Module
                </h3>
                <p className="mb-8 leading-relaxed text-neutral-700">
                  The BACnet MS/TP or Modbus RTU output module converts the data from wireless sensors for integration into the RS-485 field communication network. The field-selectable BACnet MS/TP or Modbus RTU output lets customers choose the best protocol for their system without the need for multiple devices. This makes the module perfect for retrofitting older systems or adding new ones.
                </p>
                <p className="mb-8 leading-relaxed text-neutral-700">
                  Configuration is quick and easy with the USB-C port and a computer running the downloadable application. The receiver and module are surface, 2.75" snaptrack or 35mm DIN rail mountable.
                </p>
                <Link 
                  href="/product/wireless-digital-output-module"
                  className="block w-full rounded-lg bg-primary-500 px-6 py-3.5 text-center font-semibold text-white shadow-md transition-all duration-300 hover:bg-primary-600 hover:shadow-lg"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BAPI Wireless Solution Integration */}
      <section className="bg-gradient-to-br from-primary-50/30 via-white to-neutral-50 py-16 lg:py-24">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-neutral-900 lg:text-4xl">
              System Integration
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-neutral-700">
              Complete wireless solution for building automation systems
            </p>
          </div>

          {/* Integration Features */}
          <div className="mx-auto mb-12 grid max-w-4xl gap-6 sm:grid-cols-3">
            <div className="flex items-start gap-3 rounded-lg bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
              <CheckCircleIcon className="mt-1 h-6 w-6 flex-shrink-0 text-primary-500" />
              <div>
                <h3 className="mb-1 font-bold text-neutral-900">Multi-Protocol Support</h3>
                <p className="text-sm text-neutral-700">
                  BACnet IP, Modbus RTU, and analog outputs for seamless integration
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
              <CheckCircleIcon className="mt-1 h-6 w-6 flex-shrink-0 text-primary-500" />
              <div>
                <h3 className="mb-1 font-bold text-neutral-900">Scalable Architecture</h3>
                <p className="text-sm text-neutral-700">
                  From single-zone to enterprise-wide deployments with centralized management
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
              <CheckCircleIcon className="mt-1 h-6 w-6 flex-shrink-0 text-primary-500" />
              <div>
                <h3 className="mb-1 font-bold text-neutral-900">Field-Proven Reliability</h3>
                <p className="text-sm text-neutral-700">
                  900 MHz LoRa technology with superior range and penetration
                </p>
              </div>
            </div>
          </div>

          {/* Integration Diagram */}
          <div className="mx-auto max-w-5xl">
            <div className="relative">
              {/* Gradient glow effect */}
              <div className="absolute -inset-4 rounded-2xl bg-gradient-to-br from-primary-500/20 via-accent-500/10 to-primary-500/20 opacity-75 blur-2xl" />
              
              <div className="relative overflow-hidden rounded-xl border-2 border-primary-200 bg-white p-8 shadow-xl">
                <div className="relative aspect-[4/3]">
                  <Image
                    src="/images/wireless/wireless-integration-graphic.png"
                    alt="BAPI Wireless Solution Integration Architecture"
                    fill
                    sizes="(min-width: 1024px) 1000px, 100vw"
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA - Browse Wireless Products */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-container px-4 text-center sm:px-6 lg:px-8">
          <Link
            href="/products/bluetooth-wireless"
            className="inline-flex items-center gap-2 rounded-xl bg-primary-500 px-8 py-4 text-lg font-bold text-white transition-all duration-300 hover:bg-primary-600 hover:shadow-xl"
          >
            Browse Our Wireless Products
            <ArrowRightIcon className="h-5 w-5" />
          </Link>
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
                  src="/images/wireless/technician-checking-laptop.png"
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

      {/* WAM Cross-Reference */}
      <section className="bg-gradient-to-br from-neutral-50 via-white to-primary-50/20 py-16 lg:py-20">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="relative">
              {/* Gradient glow effect */}
              <div className="absolute -inset-4 rounded-2xl bg-gradient-to-br from-primary-500/20 via-accent-500/10 to-primary-500/20 opacity-60 blur-2xl" />
              
              <div className="relative overflow-hidden rounded-2xl border-2 border-primary-200 bg-white p-8 shadow-xl lg:p-12">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
                  {/* Icon */}
                  <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg lg:h-20 lg:w-20">
                    <WifiIcon className="h-8 w-8 text-white lg:h-10 lg:w-10" />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="mb-3 text-2xl font-bold text-neutral-900 lg:text-3xl">
                      Looking for Wireless Asset Monitoring (WAM)?
                    </h3>
                    <p className="mb-6 text-lg leading-relaxed text-neutral-700">
                      WAM is our retail/food service temperature monitoring solution with cloud
                      dashboards and mobile app—a separate product line from our building automation
                      wireless products.
                    </p>
                    <Link
                      href="/wam"
                      className="inline-flex items-center gap-2 rounded-xl bg-primary-500 px-6 py-3 text-base font-bold text-white transition-all duration-300 hover:bg-primary-600 hover:shadow-xl"
                    >
                      Learn About WAM
                      <ArrowRightIcon className="h-5 w-5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
