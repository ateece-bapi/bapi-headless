import { NavLink, MegaMenuItem } from './types';
import { 
  Thermometer, 
  Droplets, 
  Gauge, 
  Settings,
  Building2,
  Wind,
  Factory,
  FileText,
  GraduationCap,
  Wrench,
  Network,
  Target,
  Presentation,
  LifeBuoy,
  Phone,
  MessageCircle,
  BookOpen
} from 'lucide-react';

export const NAV_LINKS: NavLink[] = [];

export const MEGA_MENU_ITEMS: MegaMenuItem[] = [
  {
    label: 'Applications',
    href: '/applications',
    megaMenu: {
      columns: [
        {
          title: 'Building Automation',
          icon: Building2,
          links: [
            { 
              label: 'Room & Space Monitoring', 
              href: '/applications/building-automation/room-monitoring',
              description: 'Offices, classrooms, healthcare spaces'
            },
            { 
              label: 'HVAC Duct & Air Handler', 
              href: '/applications/building-automation/hvac-duct',
              description: 'Supply, return, mixed air sensing'
            },
            { 
              label: 'Outdoor & Weather Stations', 
              href: '/applications/building-automation/outdoor-weather',
              description: 'Building weather monitoring'
            },
            { 
              label: 'Critical Spaces', 
              href: '/applications/building-automation/critical-spaces',
              description: 'Data centers, server rooms, labs',
              badge: 'Popular'
            },
            { 
              label: 'Indoor Air Quality', 
              href: '/applications/building-automation/indoor-air-quality',
              description: 'CO₂, VOC monitoring'
            },
          ],
        },
        {
          title: 'Industrial & Wireless',
          icon: Factory,
          links: [
            { 
              label: 'Manufacturing Process', 
              href: '/applications/industrial-process/manufacturing',
              description: 'Industrial temperature & pressure'
            },
            { 
              label: 'Industrial Refrigeration', 
              href: '/applications/industrial-process/refrigeration',
              description: 'Cold storage monitoring'
            },
            { 
              label: 'Wireless Temp & Humidity', 
              href: '/applications/wireless-remote/wireless-temp-humidity',
              description: 'Battery-powered sensors',
              badge: 'New'
            },
            { 
              label: 'Wireless Pressure', 
              href: '/applications/wireless-remote/wireless-pressure',
              description: 'Filter differential pressure'
            },
          ],
        },
        {
          title: 'Retrofit & Support',
          icon: Wrench,
          links: [
            { 
              label: 'BACnet Upgrades', 
              href: '/applications/retrofit-replacement/bacnet-upgrades',
              description: 'Modernize legacy systems'
            },
            { 
              label: 'Pneumatic Replacement', 
              href: '/applications/retrofit-replacement/pneumatic-to-electronic',
              description: 'Convert to electronic sensors'
            },
            { 
              label: 'Mounting Hardware', 
              href: '/applications/installation-support/mounting-hardware',
              description: 'Installation accessories'
            },
            { 
              label: 'Test Equipment', 
              href: '/applications/installation-support/test-equipment',
              description: 'Commissioning tools'
            },
          ],
        },
      ],
      featured: {
        title: 'Find Sensors by Application',
        description: 'Browse products organized by your specific use case. Discover sensors optimized for your industry, environment, and mounting requirements.',
        cta: 'Explore Applications',
        href: '/applications',
      },
    },
  },
  {
    label: 'Products',
    href: '/products',
    megaMenu: {
      columns: [
        {
          title: 'Temperature',
          icon: Thermometer,
          links: [
            { 
              label: 'Room & Wall Sensors', 
              href: '/products/temperature/room-wall',
              description: 'High-accuracy temperature sensing for HVAC control'
            },
            { 
              label: 'Duct Sensors', 
              href: '/products/temperature/duct',
              description: 'Duct-mounted temperature transmitters'
            },
            { 
              label: 'Immersion & Well', 
              href: '/products/temperature/immersion',
              description: 'Liquid temperature measurement solutions'
            },
            { 
              label: 'Outdoor Sensors', 
              href: '/products/temperature/outdoor',
              description: 'Weather-resistant temperature sensing'
            },
          ],
        },
        {
          title: 'Humidity & Air Quality',
          icon: Droplets,
          links: [
            { 
              label: 'RH Sensors', 
              href: '/products/humidity/rh-sensors',
              description: 'Relative humidity measurement'
            },
            { 
              label: 'CO₂ Sensors', 
              href: '/products/air-quality/co2',
              description: 'Carbon dioxide monitoring for IAQ'
            },
            { 
              label: 'VOC Sensors', 
              href: '/products/air-quality/voc',
              description: 'Volatile organic compound detection'
            },
            { 
              label: 'Particulate Matter', 
              href: '/products/air-quality/particulate',
              description: 'PM2.5 and PM10 monitoring'
            },
          ],
        },
        {
          title: 'Pressure & Flow',
          icon: Gauge,
          links: [
            { 
              label: 'Differential Pressure', 
              href: '/products/pressure/differential',
              description: 'Room pressurization and filter monitoring'
            },
            { 
              label: 'Static Pressure', 
              href: '/products/pressure/static',
              description: 'Duct static pressure transmitters'
            },
            { 
              label: 'Airflow Stations', 
              href: '/products/flow/airflow',
              description: 'Air velocity and volume measurement'
            },
          ],
        },
        {
          title: 'Controllers & I/O',
          icon: Settings,
          links: [
            { 
              label: 'Zone Controllers', 
              href: '/products/controllers/zone',
              description: 'VAV and FCU control solutions'
            },
            { 
              label: 'I/O Modules', 
              href: '/products/controllers/io',
              description: 'Expandable input/output modules'
            },
            { 
              label: 'Wireless Solutions', 
              href: '/products/wireless',
              description: 'Battery-powered and energy harvesting',
              badge: 'New'
            },
          ],
        },
      ],
      featured: {
        title: 'BA/10K Series Temperature Sensors',
        description: 'Our most popular sensors. ±0.2°C accuracy, BACnet MS/TP, and 5-year warranty. Trusted in healthcare, data centers, and critical facilities worldwide.',
        cta: 'View BA Series',
        href: '/products/featured/ba-series',
      },
    },
  },
  {
    label: 'Support',
    href: '/support',
    megaMenu: {
      columns: [
        {
          title: 'Get Help',
          icon: LifeBuoy,
          links: [
            { 
              label: 'Technical Support', 
              href: '/support/technical',
              description: 'Product troubleshooting and configuration'
            },
            { 
              label: 'Contact Us', 
              href: '/support/contact',
              description: 'Phone, email, and live chat support'
            },
            { 
              label: 'RMA & Returns', 
              href: '/support/rma',
              description: 'Return merchandise authorization'
            },
            { 
              label: 'Warranty Information', 
              href: '/support/warranty',
              description: 'Product warranty details'
            },
          ],
        },
        {
          title: 'Documentation',
          icon: BookOpen,
          links: [
            { 
              label: 'Installation Guides', 
              href: '/resources/installation',
              description: 'Step-by-step instructions'
            },
            { 
              label: 'Technical Data Sheets', 
              href: '/resources/datasheets',
              description: 'Product specifications'
            },
            { 
              label: 'Application Notes', 
              href: '/resources/application-notes',
              description: 'Technical guides and best practices'
            },
            { 
              label: 'Video Tutorials', 
              href: '/resources/videos',
              description: 'Product demos and how-tos'
            },
          ],
        },
        {
          title: 'Tools & Resources',
          icon: Wrench,
          links: [
            { 
              label: 'Product Selector', 
              href: '/resources/selector',
              description: 'Find the right sensor',
              badge: 'Popular'
            },
            { 
              label: 'Cross Reference', 
              href: '/resources/cross-reference',
              description: 'Competitive part lookup'
            },
            { 
              label: 'CAD Drawings', 
              href: '/resources/cad',
              description: 'AutoCAD and Revit files'
            },
            { 
              label: 'FAQs', 
              href: '/support/faq',
              description: 'Frequently asked questions'
            },
          ],
        },
      ],
      featured: {
        title: 'Need Technical Help?',
        description: 'Our support team is ready to help with product selection, installation, and troubleshooting. Average response time: 2 hours.',
        cta: 'Contact Support',
        href: '/support/contact',
      },
    },
  },
  {
    label: 'Resources',
    href: '/resources',
    megaMenu: {
      columns: [
        {
          title: 'Solutions & Case Studies',
          icon: Target,
          links: [
            { 
              label: 'Healthcare Solutions', 
              href: '/solutions/healthcare',
              description: 'ASHRAE 170 compliance'
            },
            { 
              label: 'Data Center Solutions', 
              href: '/solutions/data-centers',
              description: 'Critical environment monitoring'
            },
            { 
              label: 'Case Studies', 
              href: '/resources/case-studies',
              description: 'Real-world success stories'
            },
            { 
              label: 'White Papers', 
              href: '/resources/whitepapers',
              description: 'Technical insights'
            },
          ],
        },
        {
          title: 'Learning & Training',
          icon: GraduationCap,
          links: [
            { 
              label: 'Webinars', 
              href: '/resources/webinars',
              description: 'Live and on-demand training'
            },
            { 
              label: 'Video Library', 
              href: '/resources/videos',
              description: 'Product demos and tutorials'
            },
            { 
              label: 'BACnet Integration', 
              href: '/solutions/bacnet',
              description: 'BACnet device setup guides'
            },
          ],
        },
        {
          title: 'About BAPI',
          icon: Building2,
          links: [
            { 
              label: 'Why BAPI', 
              href: '/company/why-bapi',
              description: 'What sets us apart'
            },
            { 
              label: 'Mission & Values', 
              href: '/company/mission-values',
              description: 'Our commitment to quality'
            },
            { 
              label: 'News & Updates', 
              href: '/company/news',
              description: 'Latest announcements'
            },
            { 
              label: 'Careers', 
              href: '/company/careers',
              description: 'Join our team'
            },
          ],
        },
      ],
      featured: {
        title: 'Healthcare Compliance Package',
        description: 'Complete pressure monitoring solution for operating rooms and isolation rooms. ASHRAE 170 certified.',
        cta: 'Learn More',
        href: '/solutions/healthcare-package',
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