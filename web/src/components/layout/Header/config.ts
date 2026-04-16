import { NavLink, MegaMenuItem } from './types';
import {
  Building2Icon,
  WrenchIcon,
  LifeBuoyIcon,
  PhoneIcon,
  BookOpenIcon,
  UsersIcon,
} from '@/lib/icons';

export const NAV_LINKS: NavLink[] = [];

/**
 * Generate mega menu items with translations
 * @param t - Translation function from useTranslations('megaMenu')
 * Updated: March 16, 2026 - Updated with proper subcategory links after WordPress restructure
 * 
 * TEMPERATURE: Application-based subcategories (10 total, showing top 6 in mega-menu)
 * HUMIDITY: Existing subcategories (Phase 2: will be application-based)
 * PRESSURE: Existing subcategories (well-structured, no changes needed)
 * AIR QUALITY: Generic category (Phase 2: will add subcategories)
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getMegaMenuItems = (t: any): MegaMenuItem[] => [
  {
    label: t('products.label'),
    href: '/products',
    megaMenu: {
      columns: [
        {
          title: t('products.temperature.title'),
          slug: 'temperature-sensors',
          icon: '/images/icons/Temperature_Icon.webp',
          links: [
            {
              label: t('products.temperature.roomWallSensors'),
              href: '/products/temperature-sensors/temp-room-temp',
              description: t('products.temperature.roomWallSensorsDesc'),
            },
            {
              label: t('products.temperature.ductSensors'),
              href: '/products/temperature-sensors/temp-duct',
              description: t('products.temperature.ductSensorsDesc'),
            },
            {
              label: t('products.temperature.immersionWell'),
              href: '/products/temperature-sensors/temp-immersion',
              description: t('products.temperature.immersionWellDesc'),
            },
            {
              label: t('products.temperature.outdoorSensors'),
              href: '/products/temperature-sensors/temp-outside-air',
              description: t('products.temperature.outdoorSensorsDesc'),
            },
            {
              label: t('products.temperature.averaging'),
              href: '/products/temperature-sensors/temp-averaging',
              description: t('products.temperature.averagingDesc'),
            },
            {
              label: t('products.temperature.remoteProbes'),
              href: '/products/temperature-sensors/temp-remote-probes-and-sensors',
              description: t('products.temperature.remoteProbesDesc'),
            },
          ],
        },
        {
          title: t('products.humidity.title'),
          slug: 'humidity-sensors',
          icon: '/images/icons/Humidity_Icon.webp',
          links: [
            {
              label: t('products.humidity.roomHumidity'),
              href: '/products/humidity-sensors/humidity-room',
              description: t('products.humidity.roomHumidityDesc'),
            },
            {
              label: t('products.humidity.ductHumidity'),
              href: '/products/humidity-sensors/humidity-non-room',
              description: t('products.humidity.ductHumidityDesc'),
            },
            {
              label: t('products.humidity.outdoorHumidity'),
              href: '/products/humidity-sensors/humidity-non-room',
              description: t('products.humidity.outdoorHumidityDesc'),
            },
            {
              label: t('products.humidity.comboSensors'),
              href: '/products/humidity-sensors/humidity-room',
              description: t('products.humidity.comboSensorsDesc'),
            },
          ],
        },
        {
          title: t('products.pressure.title'),
          slug: 'pressure-sensors',
          icon: '/images/icons/Pressure_Icon.webp',
          links: [
            {
              label: t('products.pressure.differential'),
              href: '/products/pressure-sensors/pressure-differential-transmitters',
              description: t('products.pressure.differentialDesc'),
            },
            {
              label: t('products.pressure.static'),
              href: '/products/pressure-sensors/pressure-pickup-ports-and-probes',
              description: t('products.pressure.staticDesc'),
            },
            {
              label: t('products.pressure.differentialSwitch'),
              href: '/products/pressure-sensors/pressure-differential-switch',
              description: t('products.pressure.differentialSwitchDesc'),
            },
          ],
        },
        {
          title: t('products.airQuality.title'),
          slug: 'air-quality-sensors',
          icon: '/images/icons/AirQuality_Icon.webp',
          links: [
            {
              label: t('products.airQuality.co2'),
              href: '/products/air-quality-sensors/carbon-dioxide',
              description: t('products.airQuality.co2Desc'),
            },
            {
              label: t('products.airQuality.voc'),
              href: '/products/air-quality-sensors/voc',
              description: t('products.airQuality.vocDesc'),
            },
            {
              label: t('products.airQuality.particulate'),
              href: '/products/air-quality-sensors/particulate',
              description: t('products.airQuality.particulateDesc'),
            },
          ],
        },
        {
          title: t('products.wireless.title'),
          slug: 'bluetooth-wireless',
          icon: '/images/icons/Wireless_Icon.webp',
          links: [
            {
              label: t('products.wireless.bluetoothSensors'),
              href: '/products/bluetooth-wireless',
              description: t('products.wireless.bluetoothSensorsDesc'),
              badge: t('badges.popular'),
            },
            {
              label: t('products.wireless.gatewaysReceivers'),
              href: '/products/bluetooth-wireless',
              description: t('products.wireless.gatewaysReceiversDesc'),
            },
            {
              label: t('products.wireless.outputModules'),
              href: '/products/bluetooth-wireless',
              description: t('products.wireless.outputModulesDesc'),
            },
            {
              label: t('products.wireless.wirelessAccessories'),
              href: '/products/bluetooth-wireless',
              description: t('products.wireless.wirelessAccessoriesDesc'),
            },
          ],
        },
        {
          title: t('products.accessories.title'),
          slug: 'accessories',
          icon: '/images/icons/Accessories_Icon.webp',
          links: [
            {
              label: t('products.accessories.mounting'),
              href: '/accessories',
              description: t('products.accessories.mountingDesc'),
            },
            {
              label: t('products.accessories.enclosures'),
              href: '/accessories',
              description: t('products.accessories.enclosuresDesc'),
            },
            {
              label: t('products.accessories.cables'),
              href: '/accessories',
              description: t('products.accessories.cablesDesc'),
            },
          ],
        },
        {
          title: t('products.testInstruments.title'),
          slug: 'test-instruments',
          icon: '/images/icons/Test_Instruments_Icon.webp',
          links: [
            {
              label: t('products.testInstruments.bluTestTemperature'),
              href: '/test-instruments',
              description: t('products.testInstruments.bluTestTemperatureDesc'),
              badge: t('badges.new'),
            },
            {
              label: t('products.testInstruments.bluTestHumidity'),
              href: '/test-instruments',
              description: t('products.testInstruments.bluTestHumidityDesc'),
            },
            {
              label: t('products.testInstruments.bluTestPressure'),
              href: '/test-instruments',
              description: t('products.testInstruments.bluTestPressureDesc'),
            },
          ],
        },
      ],
      featured: {
        title: t('products.featured.title'),
        description: t('products.featured.description'),
        cta: t('products.featured.cta'),
        href: '/wam',
        badge: t('badges.premiumSolution'),
        logo: 'https://bapiheadlessstaging.kinsta.cloud/wp-content/uploads/wam-logo.png',
      },
    },
  },
  // PHASE 2: Applications section deferred to Phase 2 (April 10, 2026 deadline)
  // Awaiting content creation from marketing team
  // {
  //   label: 'Applications',
  //   href: '/applications',
  //   megaMenu: {
  //     columns: [
  //       {
  //         title: 'By Industry',
  //         icon: Building2,
  //         links: [
  //           {
  //             label: 'Building Automation',
  //             href: '/applications/landing/building-automation',
  //             description: '30% energy savings for commercial buildings',
  //             badge: 'Popular'
  //           },
  //           {
  //             label: 'Data Centers',
  //             href: '/applications/landing/data-centers',
  //             description: '99.99% uptime for critical infrastructure'
  //           },
  //           {
  //             label: 'Healthcare Facilities',
  //             href: '/applications/landing/healthcare',
  //             description: 'Joint Commission compliance solutions'
  //           },
  //           {
  //             label: 'Industrial & Manufacturing',
  //             href: '/applications/landing/industrial',
  //             description: 'Harsh environment monitoring solutions'
  //           },
  //           {
  //             label: 'Wireless Monitoring',
  //             href: '/applications/landing/wireless-monitoring',
  //             description: '5-minute setup, 5-year battery life',
  //             badge: 'Premium'
  //           },
  //         ],
  //       },
  //       {
  //         title: 'By Use Case',
  //         icon: '/images/icons/Temperature_Icon.webp',
  //         links: [
  //           {
  //             label: 'Room & Space Monitoring',
  //             href: '/applications/building-automation',
  //             description: 'Offices, classrooms, healthcare spaces'
  //           },
  //           {
  //             label: 'HVAC Duct & Air Handler',
  //             href: '/applications/building-automation',
  //             description: 'Supply, return, mixed air sensing'
  //           },
  //           {
  //             label: 'Indoor Air Quality',
  //             href: '/applications/building-automation',
  //             description: 'CO₂, VOC monitoring'
  //           },
  //           {
  //             label: 'Industrial Refrigeration',
  //             href: '/applications',
  //             description: 'Cold storage monitoring'
  //           },
  //         ],
  //       },
  //       {
  //         title: 'Resources',
  //         icon: Wrench,
  //         links: [
  //           {
  //             label: 'Real-World Installations',
  //             href: '/installations',
  //             description: 'See BAPI sensors in action',
  //             badge: 'New'
  //           },
  //           {
  //             label: 'Browse All Applications',
  //             href: '/applications',
  //             description: 'Complete application directory'
  //           },
  //           {
  //             label: 'Installation Support',
  //             href: '/contact',
  //             description: 'Talk to our technical team'
  //           },
  //         ],
  //       },
  //     ],
  //     featured: {
  //       title: 'Find Solutions by Application',
  //       description: 'Explore how BAPI sensors solve real-world challenges in your industry. See measurable results from organizations like yours.',
  //       cta: 'Explore Applications',
  //       href: '/applications',
  //     },
  //   },
  // },
  {
    label: t('resources.label'),
    href: '/resources',
    megaMenu: {
      columns: [
        {
          title: t('resources.technicalDocumentation.title'),
          slug: 'technical-documentation',
          icon: BookOpenIcon,
          links: [
            {
              label: t('resources.technicalDocumentation.applicationNotes'),
              href: '/application-notes',
              description: t('resources.technicalDocumentation.applicationNotesDesc'),
              badge: t('badges.popular'),
            },
            {
              label: t('resources.technicalDocumentation.serviceBulletins'),
              href: '/service-bulletin/',
              description: t('resources.technicalDocumentation.serviceBulletinsDesc'),
            },
            {
              label: t('resources.technicalDocumentation.datasheets'),
              href: '/resources/datasheets',
              description: t('resources.technicalDocumentation.datasheetsDesc'),
            },
            {
              label: t('resources.technicalDocumentation.sensorsOverview'),
              href: '/sensor-specs/',
              description: t('resources.technicalDocumentation.sensorsOverviewDesc'),
            },
          ],
        },
        {
          title: t('resources.toolsGuides.title'),
          slug: 'tools-guides',
          icon: WrenchIcon,
          links: [
            {
              label: t('resources.toolsGuides.catalog'),
              href: '/catalogpricebook/',
              description: t('resources.toolsGuides.catalogDesc'),
              badge: t('badges.download'),
            },
            {
              label: t('resources.toolsGuides.siteVerification'),
              href: '/wireless-site-verification/',
              description: t('resources.toolsGuides.siteVerificationDesc'),
            },
            {
              label: t('resources.toolsGuides.productSelector'),
              href: '/resources/selector',
              description: t('resources.toolsGuides.productSelectorDesc'),
            },
          ],
        },
      ],
      featured: {
        title: t('resources.featured.title'),
        description: t('resources.featured.description'),
        cta: t('resources.featured.cta'),
        href: '/resources',
        logo: '/images/brand/BAS_BMS_Software.webp',
      },
    },
  },
  {
    label: t('support.label'),
    href: '/support',
    megaMenu: {
      columns: [
        {
          title: t('support.getHelp.title'),
          slug: 'get-help',
          icon: LifeBuoyIcon,
          links: [
            {
              label: t('support.getHelp.contactSupport'),
              href: '/contact',
              description: t('support.getHelp.contactSupportDesc'),
              badge: t('badges.popular'),
            },
            {
              label: t('support.getHelp.rmaRequest'),
              href: '/rma-request/',
              description: t('support.getHelp.rmaRequestDesc'),
            },
            {
              label: t('support.getHelp.whereToBuy'),
              href: '/where-to-buy/',
              description: t('support.getHelp.whereToBuyDesc'),
              badge: t('badges.popular'),
            },
          ],
        },
        {
          title: t('support.existingCustomers.title'),
          slug: 'existing-customers',
          icon: UsersIcon,
          links: [
            {
              label: t('support.existingCustomers.myAccount'),
              href: '/account',
              description: t('support.existingCustomers.myAccountDesc'),
            },
            {
              label: t('support.existingCustomers.orderStatus'),
              href: '/account/orders',
              description: t('support.existingCustomers.orderStatusDesc'),
            },
            {
              label: t('support.existingCustomers.requestQuote'),
              href: '/request-quote',
              description: t('support.existingCustomers.requestQuoteDesc'),
            },
          ],
        },
      ],
      featured: {
        title: t('support.featured.title'),
        description: t('support.featured.description'),
        cta: t('support.featured.cta'),
        href: '/contact',
        logo: '/bapi_logo_details_Web_Digital.png',
      },
    },
  },
  {
    label: t('company.label'),
    href: '/company',
    megaMenu: {
      columns: [
        {
          title: t('company.aboutBapi.title'),
          slug: 'about-bapi',
          icon: Building2Icon,
          links: [
            {
              label: t('company.aboutBapi.whyBapi'),
              href: '/company/why-bapi',
              description: t('company.aboutBapi.whyBapiDesc'),
            },
            {
              label: t('company.aboutBapi.missionValues'),
              href: '/company/mission-values',
              description: t('company.aboutBapi.missionValuesDesc'),
            },
            {
              label: t('company.aboutBapi.news'),
              href: '/company/news',
              description: t('company.aboutBapi.newsDesc'),
            },
            {
              label: t('company.aboutBapi.tradeShows'),
              href: '/company/trade-shows',
              description: t('company.aboutBapi.tradeShowsDesc'),
            },
            {
              label: t('company.aboutBapi.careers'),
              href: '/company/careers',
              description: t('company.aboutBapi.careersDesc'),
            },
          ],
        },
        {
          title: t('company.getInTouch.title'),
          slug: 'get-in-touch',
          icon: PhoneIcon,
          links: [
            {
              label: t('company.getInTouch.contactSales'),
              href: '/contact',
              description: t('company.getInTouch.contactSalesDesc'),
              badge: t('badges.popular'),
            },
            {
              label: t('company.getInTouch.whereToBuy'),
              href: '/where-to-buy/',
              description: t('company.getInTouch.whereToBuyDesc'),
            },
            {
              label: t('company.getInTouch.requestQuote'),
              href: '/request-quote',
              description: t('company.getInTouch.requestQuoteDesc'),
            },
          ],
        },
      ],
      featured: {
        title: t('company.featured.title'),
        description: t('company.featured.description'),
        cta: t('company.featured.cta'),
        href: '/contact',
        logo: '/images/brand/People_Building_Sensors1.webp',
      },
    },
  },
];

export const HEADER_CONFIG = {
  logo: {
    src: '/BAPI_Logo_with_white_border.jpg',
    alt: 'BAPI - Sensors for HVAC/R',
    width: 350,
    height: 117,
  },
  scrollThreshold: 10,
  colors: {
    blue: 'var(--color-primary-600)',
    yellow: 'var(--color-accent-500)',
  },
} as const;
