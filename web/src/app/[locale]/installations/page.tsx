import Image from 'next/image';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Real-World Installations | BAPI - Building Automation Products',
  description:
    'Explore real-world installations of BAPI sensors across data centers, industrial facilities, retail environments, and WAM wireless food safety monitoring. Proven building automation solutions.',
};

const installations = {
  'data-centers': {
    title: 'Data Centers',
    description:
      'Mission-critical monitoring for server rooms, hot/cold aisles, and containment systems',
    images: [
      {
        src: '/images/applications/data-centers/Server_Room_HotAisle_2.webp',
        alt: 'Temperature monitoring in server room hot aisle',
        title: 'Server Room Hot Aisle Monitoring',
        caption: 'Precision temperature control in high-density server environments',
      },
      {
        src: '/images/applications/data-centers/Pendant_Hanging_in_ContainedAisle.webp',
        alt: 'Pendant sensor in contained aisle',
        title: 'Containment Aisle Sensor',
        caption: 'Optimized airflow monitoring for contained hot/cold aisles',
      },
    ],
  },
  industrial: {
    title: 'Industrial Facilities',
    description:
      'Environmental monitoring for parking garages, manufacturing, and refrigeration systems',
    images: [
      {
        src: '/images/applications/industrial/CarbonMonoxide_Parking_Garage_2.webp',
        alt: 'Carbon monoxide sensor in parking garage',
        title: 'Parking Garage CO Monitoring',
        caption: 'Life safety monitoring for carbon monoxide detection',
      },
      {
        src: '/images/applications/industrial/Nitrogen_Dioxide_Parking_Garage_1.webp',
        alt: 'Nitrogen dioxide sensor in parking garage',
        title: 'NO₂ Detection System',
        caption: 'Advanced air quality monitoring for enclosed parking',
      },
      {
        src: '/images/applications/industrial/Particulate_Duct_at_AHU_Intake.webp',
        alt: 'Particulate sensor at AHU intake duct',
        title: 'AHU Intake Particulate Monitoring',
        caption: 'Air quality control at air handling unit intake points',
      },
      {
        src: '/images/applications/industrial/Refrigerant_Leak_1.webp',
        alt: 'Refrigerant leak detection sensor',
        title: 'Refrigerant Leak Detection',
        caption: 'Critical refrigerant monitoring for safety and compliance',
      },
    ],
  },
  retail: {
    title: 'Retail & Food Service',
    description:
      'Temperature and humidity control for convenience stores, grocery, and food service',
    images: [
      {
        src: '/images/applications/retail/Mini-Mart_Overhead_1.webp',
        alt: 'Overhead sensors in convenience store',
        title: 'Convenience Store Monitoring',
        caption: 'Multi-zone climate control for retail environments',
      },
      {
        src: '/images/applications/retail/Deli_Cases_All_1.webp',
        alt: 'Temperature monitoring for deli display cases',
        title: 'Deli Case Temperature Control',
        caption: 'Food safety monitoring for refrigerated display cases',
      },
    ],
  },
  wam: {
    title: 'WAM - Wireless Asset Monitoring',
    description:
      'Food safety monitoring for walk-in coolers, freezers, and refrigerated display cases',
    subcategories: [
      {
        name: 'Walk-In Coolers',
        images: [
          {
            src: '/images/applications/retail/coolers/Cooler_Front_4.webp',
            alt: 'WAM sensor on walk-in cooler door',
            title: 'Walk-In Cooler Door Monitoring',
            caption: 'Wireless temperature monitoring for cold storage rooms',
          },
          {
            src: '/images/applications/retail/coolers/Cooler_Back_1.webp',
            alt: 'WAM sensor installation inside cooler',
            title: 'Interior Cooler Monitoring',
            caption: 'Real-time temperature tracking with cloud dashboard',
          },
          {
            src: '/images/applications/retail/coolers/Cooler_Case_1.webp',
            alt: 'Refrigerated case with WAM sensor',
            title: 'Display Case Temperature Control',
            caption: 'Food safety compliance for refrigerated displays',
          },
        ],
      },
      {
        name: 'Walk-In Freezers',
        images: [
          {
            src: '/images/applications/retail/freezers/Freezer_Door_1.webp',
            alt: 'WAM sensor on freezer door',
            title: 'Freezer Door Monitoring',
            caption: 'Sub-zero temperature monitoring with alerts',
          },
          {
            src: '/images/applications/retail/freezers/Freezer_Buffer_1.webp',
            alt: 'Freezer buffer zone sensor',
            title: 'Buffer Zone Temperature Control',
            caption: 'Multi-zone monitoring for large freezer rooms',
          },
          {
            src: '/images/applications/retail/freezers/FrozenFoods_1.webp',
            alt: 'Frozen food storage monitoring',
            title: 'Frozen Food Storage',
            caption: 'Continuous monitoring for frozen food safety',
          },
        ],
      },
      {
        name: 'Deli & Prepared Foods',
        images: [
          {
            src: '/images/applications/retail/deli-cases/Deli_Cases_All_1.webp',
            alt: 'Multiple deli cases with WAM sensors',
            title: 'Multi-Case Deli Monitoring',
            caption: 'Comprehensive monitoring for deli departments',
          },
          {
            src: '/images/applications/retail/deli-cases/Deli_Cases_All_4.webp',
            alt: 'Deli case temperature monitoring array',
            title: 'Deli Case Array Monitoring',
            caption: 'Food safety compliance for prepared foods',
          },
        ],
      },
      {
        name: 'Convenience Stores',
        images: [
          {
            src: '/images/applications/retail/convenience/Mini-Mart_Overhead_4.webp',
            alt: 'Convenience store overhead sensors',
            title: 'Store-Wide Climate Control',
            caption: 'Multi-zone monitoring for convenience stores',
          },
          {
            src: '/images/applications/retail/convenience/DoorSwitch_1.webp',
            alt: 'Door switch sensor on refrigerator',
            title: 'Door Switch Monitoring',
            caption: 'Alert when cooler/freezer doors left open',
          },
          {
            src: '/images/applications/retail/convenience/Island 1.webp',
            alt: 'Island refrigerator monitoring',
            title: 'Island Cooler Monitoring',
            caption: 'Temperature control for beverage coolers',
          },
        ],
      },
    ],
  },
};

export default function RealWorldInstallationsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-700 via-primary-600 to-primary-700 py-16 text-white sm:py-20">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-content text-center">
            <h1 className="mb-6 text-balance text-4xl font-extrabold sm:text-5xl lg:text-6xl">
              Real-World Installations
            </h1>
            <p className="mx-auto max-w-3xl text-balance text-xl text-primary-50 sm:text-2xl">
              Proven building automation solutions across critical environments
            </p>
            <p className="mx-auto mt-4 max-w-2xl text-base text-primary-100">
              See BAPI sensors in action across data centers, industrial facilities, and retail
              environments
            </p>
          </div>
        </div>
      </section>

      {/* Quick Navigation */}
      <section className="sticky top-0 z-10 border-b border-neutral-200 bg-white shadow-sm">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <nav className="flex flex-wrap items-center justify-center gap-6 py-4">
            <a
              href="#data-centers"
              className="text-sm font-semibold text-neutral-700 transition-colors duration-200 hover:text-primary-600"
            >
              Data Centers
            </a>
            <span className="text-neutral-300">|</span>
            <a
              href="#industrial"
              className="text-sm font-semibold text-neutral-700 transition-colors duration-200 hover:text-primary-600"
            >
              Industrial
            </a>
            <span className="text-neutral-300">|</span>
            <a
              href="#retail"
              className="text-sm font-semibold text-neutral-700 transition-colors duration-200 hover:text-primary-600"
            >
              Retail
            </a>
            <span className="text-neutral-300">|</span>
            <a
              href="#wam"
              className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-700 transition-colors duration-200 hover:text-primary-600"
            >
              WAM
              <span className="rounded-full bg-accent-500 px-2 py-0.5 text-xs font-bold text-neutral-900">
                New
              </span>
            </a>
          </nav>
        </div>
      </section>

      {/* Installations Content */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <div className="space-y-20">
            {Object.entries(installations).map(([key, category], categoryIndex) => (
              <div key={key} className="scroll-mt-24" id={key}>
                {/* Category Header */}
                <div className="mx-auto mb-12 max-w-content text-center">
                  <h2 className="mb-4 text-3xl font-extrabold text-neutral-900 sm:text-4xl lg:text-5xl">
                    {category.title}
                  </h2>
                  <p className="mx-auto max-w-2xl text-lg text-neutral-600 sm:text-xl">
                    {category.description}
                  </p>
                </div>

                {/* Handle WAM subcategories */}
                {'subcategories' in category ? (
                  <div className="space-y-16">
                    {category.subcategories.map((subcategory, subIndex) => (
                      <div key={subIndex}>
                        {/* Subcategory Header */}
                        <div className="mb-8">
                          <h3 className="mb-2 text-center text-2xl font-bold text-neutral-900 sm:text-3xl">
                            {subcategory.name}
                          </h3>
                          <div className="mx-auto h-1 w-20 rounded-full bg-gradient-to-r from-accent-500 to-primary-500" />
                        </div>

                        {/* Subcategory Image Grid */}
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                          {subcategory.images.map((image, imageIndex) => (
                            <div
                              key={imageIndex}
                              className="group relative overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
                            >
                              {/* Image Container */}
                              <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
                                <Image
                                  src={image.src}
                                  alt={image.alt}
                                  fill
                                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/60 via-neutral-900/0 to-neutral-900/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                              </div>

                              {/* Content */}
                              <div className="p-6">
                                <h4 className="mb-2 text-xl font-bold text-neutral-900 transition-colors duration-300 group-hover:text-primary-600">
                                  {image.title}
                                </h4>
                                <p className="text-sm leading-relaxed text-neutral-600">
                                  {image.caption}
                                </p>
                              </div>

                              {/* Accent Bar */}
                              <div className="absolute left-0 right-0 top-0 h-1 origin-left scale-x-0 transform bg-gradient-to-r from-accent-500 via-primary-500 to-accent-500 transition-transform duration-500 group-hover:scale-x-100" />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* Regular Image Grid */
                  <div
                    className={`grid gap-8 ${
                      category.images.length === 2
                        ? 'mx-auto max-w-5xl md:grid-cols-2'
                        : 'md:grid-cols-2 lg:grid-cols-3'
                    }`}
                  >
                    {category.images.map((image, imageIndex) => (
                      <div
                        key={imageIndex}
                        className="group relative overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
                      >
                        {/* Image Container */}
                        <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
                          <Image
                            src={image.src}
                            alt={image.alt}
                            fill
                            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          {/* Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/60 via-neutral-900/0 to-neutral-900/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                        </div>

                        {/* Content */}
                        <div className="p-6">
                          <h3 className="mb-2 text-xl font-bold text-neutral-900 transition-colors duration-300 group-hover:text-primary-600">
                            {image.title}
                          </h3>
                          <p className="text-sm leading-relaxed text-neutral-600">
                            {image.caption}
                          </p>
                        </div>

                        {/* Accent Bar */}
                        <div className="absolute left-0 right-0 top-0 h-1 origin-left scale-x-0 transform bg-gradient-to-r from-accent-500 via-primary-500 to-accent-500 transition-transform duration-500 group-hover:scale-x-100" />
                      </div>
                    ))}
                  </div>
                )}

                {/* Category Divider (except last) */}
                {categoryIndex < Object.keys(installations).length - 1 && (
                  <div className="mt-20 flex items-center justify-center">
                    <div className="h-px w-full max-w-md bg-gradient-to-r from-transparent via-neutral-300 to-transparent" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-primary-50 to-accent-50 py-16 sm:py-20">
        <div className="mx-auto max-w-content px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-6 text-3xl font-extrabold text-neutral-900 sm:text-4xl">
            Ready to Implement BAPI Solutions?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-neutral-600">
            Our team of experts can help you design the perfect sensor solution for your facility
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-xl bg-accent-500 px-8 py-4 text-lg font-bold text-neutral-900 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-accent-600 hover:shadow-xl"
            >
              Contact Sales Team
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-xl bg-primary-500 px-8 py-4 text-lg font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-primary-600 hover:shadow-xl"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
