import { NavLink, MegaMenuItem } from './types';
import {
  Building2,
  Factory,
  Wrench,
  LifeBuoy,
  Phone,
  BookOpen,
  GraduationCap,
  Users,
} from 'lucide-react';

export const NAV_LINKS: NavLink[] = [];

/**
 * Generate mega menu items with translations
 * @param t - Translation function from useTranslations('megaMenu')
 */
export const getMegaMenuItems = (t: any): MegaMenuItem[] => [
  {
    label: t('products.label'),
    href: '/products',
    megaMenu: {
      columns: [
        {
          title: t('products.temperature.title'),
          icon: '/images/icons/Temperature_Icon.webp',
          links: [
            {
              label: t('products.temperature.roomWallSensors'),
              href: '/products',
              description: t('products.temperature.roomWallSensorsDesc'),
            },
            {
              label: t('products.temperature.ductSensors'),
              href: '/products',
              description: t('products.temperature.ductSensorsDesc'),
            },
            {
              label: t('products.temperature.immersionWell'),
              href: '/products',
              description: t('products.temperature.immersionWellDesc'),
            },
            {
              label: t('products.temperature.outdoorSensors'),
              href: '/products',
              description: t('products.temperature.outdoorSensorsDesc'),
            },
          ],
        },
        {
          title: t('products.humidity.title'),
          icon: '/images/icons/Humidity_Icon.webp',
          links: [
            {
              label: t('products.humidity.roomHumidity'),
              href: '/products',
              description: t('products.humidity.roomHumidityDesc'),
            },
            {
              label: t('products.humidity.ductHumidity'),
              href: '/products',
              description: t('products.humidity.ductHumidityDesc'),
            },
            {
              label: t('products.humidity.outdoorHumidity'),
              href: '/products',
              description: t('products.humidity.outdoorHumidityDesc'),
            },
            {
              label: t('products.humidity.comboSensors'),
              href: '/products',
              description: t('products.humidity.comboSensorsDesc'),
            },
          ],
        },
        {
          title: t('products.pressure.title'),
          icon: '/images/icons/Pressure_Icon.webp',
          links: [
            {
              label: t('products.pressure.differential'),
              href: '/products',
              description: t('products.pressure.differentialDesc'),
            },
            {
              label: t('products.pressure.static'),
              href: '/products',
              description: t('products.pressure.staticDesc'),
            },
            {
              label: t('products.pressure.barometric'),
              href: '/products',
              description: t('products.pressure.barometricDesc'),
            },
          ],
        },
        {
          title: t('products.airQuality.title'),
          icon: '/images/icons/AirQuality_Icon.webp',
          links: [
            {
              label: t('products.airQuality.co2'),
              href: '/products',
              description: t('products.airQuality.co2Desc'),
            },
            {
              label: t('products.airQuality.voc'),
              href: '/products',
              description: t('products.airQuality.vocDesc'),
            },
            {
              label: t('products.airQuality.particulate'),
              href: '/products',
              description: t('products.airQuality.particulateDesc'),
            },
          ],
        },
        {
          title: t('products.wireless.title'),
          icon: '/images/icons/Wireless_Icon.webp',
          links: [
            {
              label: t('products.wireless.wamTemperature'),
              href: '/wireless',
              description: t('products.wireless.wamTemperatureDesc'),
              badge: 'Popular',
            },
            {
              label: t('products.wireless.wamHumidity'),
              href: '/wireless',
              description: t('products.wireless.wamHumidityDesc'),
            },
            {
              label: t('products.wireless.wamDoorSensors'),
              href: '/wireless',
              description: t('products.wireless.wamDoorSensorsDesc'),
            },
            {
              label: t('products.wireless.cloudPlatform'),
              href: '/wam',
              description: t('products.wireless.cloudPlatformDesc'),
              badge: 'Premium',
            },
          ],
        },
        {
          title: t('products.accessories.title'),
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
          icon: '/images/icons/Test_Instruments_Icon.webp',
          links: [
            {
              label: t('products.testInstruments.bluTestTemperature'),
              href: '/test-instruments',
              description: t('products.testInstruments.bluTestTemperatureDesc'),
              badge: 'New',
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
        badge: 'Premium Solution',
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
          icon: BookOpen,
          links: [
            {
              label: t('resources.technicalDocumentation.applicationNotes'),
              href: '/application-notes',
              description: t('resources.technicalDocumentation.applicationNotesDesc'),
              badge: 'Popular',
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
          icon: Wrench,
          links: [
            {
              label: t('resources.toolsGuides.catalog'),
              href: '/catalogpricebook/',
              description: t('resources.toolsGuides.catalogDesc'),
              badge: 'Download',
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
        {
          title: t('resources.learningCenter.title'),
          icon: GraduationCap,
          links: [
            {
              label: t('resources.learningCenter.videos'),
              href: '/resources/videos',
              description: t('resources.learningCenter.videosDesc'),
              badge: 'Phase 2',
            },
            {
              label: t('resources.learningCenter.caseStudies'),
              href: '/resources/case-studies',
              description: t('resources.learningCenter.caseStudiesDesc'),
            },
            {
              label: t('resources.learningCenter.webinars'),
              href: '/resources/webinars',
              description: t('resources.learningCenter.webinarsDesc'),
              badge: 'Phase 2',
            },
          ],
        },
      ],
      featured: {
        title: t('resources.featured.title'),
        description: t('resources.featured.description'),
        cta: t('resources.featured.cta'),
        href: '/resources',
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
          icon: LifeBuoy,
          links: [
            {
              label: t('support.getHelp.contactSupport'),
              href: '/contact',
              description: t('support.getHelp.contactSupportDesc'),
              badge: 'Popular',
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
              badge: 'Popular',
            },
          ],
        },
        {
          title: t('support.existingCustomers.title'),
          icon: Users,
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
          icon: Building2,
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
              label: t('company.aboutBapi.careers'),
              href: '/company/careers',
              description: t('company.aboutBapi.careersDesc'),
            },
          ],
        },
        {
          title: t('company.getInTouch.title'),
          icon: Phone,
          links: [
            {
              label: t('company.getInTouch.contactSales'),
              href: '/contact',
              description: t('company.getInTouch.contactSalesDesc'),
              badge: 'Popular',
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
      },
    },
  },
];

export const REGIONS = [
  { value: 'us', label: 'United States' },
  { value: 'eu', label: 'Europe' },
  { value: 'asia', label: 'Asia' },
] as const;

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
