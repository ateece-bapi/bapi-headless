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
  Presentation
} from 'lucide-react';

export const NAV_LINKS: NavLink[] = [
  { href: '/support', label: 'Support' },
];

export const MEGA_MENU_ITEMS: MegaMenuItem[] = [
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
    label: 'Solutions',
    href: '/solutions',
    megaMenu: {
      columns: [
        {
          title: 'By Industry',
          icon: Building2,
          links: [
            { 
              label: 'Healthcare & Life Sciences', 
              href: '/solutions/healthcare',
              description: 'ASHRAE 170 compliant solutions'
            },
            { 
              label: 'Data Centers', 
              href: '/solutions/data-centers',
              description: 'Hot/cold aisle monitoring'
            },
            { 
              label: 'Commercial Buildings', 
              href: '/solutions/commercial',
              description: 'LEED certification support'
            },
            { 
              label: 'Manufacturing', 
              href: '/solutions/manufacturing',
              description: 'Cleanroom and process control'
            },
          ],
        },
        {
          title: 'By Application',
          icon: Wind,
          links: [
            { 
              label: 'Room Pressurization', 
              href: '/solutions/pressurization',
              description: 'Critical space pressure control'
            },
            { 
              label: 'Energy Management', 
              href: '/solutions/energy',
              description: 'Demand-controlled ventilation'
            },
            { 
              label: 'Indoor Air Quality', 
              href: '/solutions/iaq',
              description: 'CO₂ and VOC monitoring'
            },
            { 
              label: 'BACnet Integration', 
              href: '/solutions/bacnet',
              description: 'Native BACnet devices',
              badge: 'Popular'
            },
          ],
        },
        {
          title: 'System Integration',
          icon: Network,
          links: [
            { 
              label: 'BMS Integration', 
              href: '/solutions/bms',
              description: 'BACnet, Modbus, LonWorks'
            },
            { 
              label: 'Cloud Connectivity', 
              href: '/solutions/cloud',
              description: 'IoT and cloud platforms'
            },
            { 
              label: 'Custom Configuration', 
              href: '/solutions/custom',
              description: 'Factory calibration services'
            },
          ],
        },
      ],
      featured: {
        title: 'Healthcare Compliance Package',
        description: 'Complete pressure monitoring solution for operating rooms, isolation rooms, and pharmacies. ASHRAE 170 certified.',
        cta: 'Learn More',
        href: '/solutions/healthcare-package',
      },
    },
  },
  {
    label: 'Resources',
    href: '/resources',
    megaMenu: {
      columns: [
        {
          title: 'Documentation',
          icon: FileText,
          links: [
            { 
              label: 'Technical Data Sheets', 
              href: '/resources/datasheets',
              description: 'Product specifications and drawings'
            },
            { 
              label: 'Installation Guides', 
              href: '/resources/installation',
              description: 'Step-by-step installation instructions'
            },
            { 
              label: 'Application Notes', 
              href: '/resources/application-notes',
              description: 'Technical application guides'
            },
            { 
              label: 'CAD Drawings', 
              href: '/resources/cad',
              description: 'AutoCAD and Revit files'
            },
          ],
        },
        {
          title: 'Learning',
          icon: GraduationCap,
          links: [
            { 
              label: 'Video Library', 
              href: '/resources/videos',
              description: 'Product demos and tutorials'
            },
            { 
              label: 'Webinars', 
              href: '/resources/webinars',
              description: 'Live and on-demand training'
            },
            { 
              label: 'White Papers', 
              href: '/resources/whitepapers',
              description: 'Technical research and insights'
            },
            { 
              label: 'Case Studies', 
              href: '/resources/case-studies',
              description: 'Real-world success stories'
            },
          ],
        },
        {
          title: 'Tools',
          icon: Wrench,
          links: [
            { 
              label: 'Product Selector', 
              href: '/resources/selector',
              description: 'Find the right sensor for your application'
            },
            { 
              label: 'Cross Reference', 
              href: '/resources/cross-reference',
              description: 'Competitive part number lookup'
            },
            { 
              label: 'BACnet Device Lookup', 
              href: '/resources/bacnet-lookup',
              description: 'Search BACnet BTL database'
            },
          ],
        },
      ],
    },
  },
  {
    label: 'Company',
    href: '/company',
    megaMenu: {
      columns: [
        {
          title: 'About BAPI',
          icon: Building2,
          links: [
            { 
              label: 'Mission & Values', 
              href: '/company/mission-values',
              description: 'Our commitment to precision and innovation'
            },
            { 
              label: 'Why BAPI', 
              href: '/company/why-bapi',
              description: 'What sets us apart in the industry'
            },
          ],
        },
        {
          title: 'Connect',
          icon: Network,
          links: [
            { 
              label: 'News', 
              href: '/company/news',
              description: 'Latest updates and announcements'
            },
            { 
              label: 'Careers', 
              href: '/company/careers',
              description: 'Join our team'
            },
            { 
              label: 'Contact Us', 
              href: '/company/contact-us',
              description: 'Get in touch with our team'
            },
          ],
        },
      ],
    },
  },
  {
    label: 'Support',
    href: '/support',
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
    blue: '#0054b6',
    yellow: '#ffc843',
  },
} as const;