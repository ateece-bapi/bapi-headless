import { NavLink, MegaMenuItem } from './types';
import { 
  Building2,
  Factory,
  Wrench,
  LifeBuoy,
  Phone,
  BookOpen,
} from 'lucide-react';

export const NAV_LINKS: NavLink[] = [];

export const MEGA_MENU_ITEMS: MegaMenuItem[] = [
  {
    label: 'Products',
    href: '/products',
    megaMenu: {
      columns: [
        {
          title: 'Temperature',
          icon: '/images/icons/Temperature_Icon.webp',
          links: [
            { 
              label: 'Room & Wall Sensors', 
              href: '/products',
              description: 'High-accuracy temperature sensing for HVAC control'
            },
            { 
              label: 'Duct Sensors', 
              href: '/products',
              description: 'Duct-mounted temperature transmitters'
            },
            { 
              label: 'Immersion & Well', 
              href: '/products',
              description: 'Liquid temperature measurement solutions'
            },
            { 
              label: 'Outdoor Sensors', 
              href: '/products',
              description: 'Weather-resistant temperature sensing'
            },
          ],
        },
        {
          title: 'Humidity & Air Quality',
          icon: '/images/icons/AirQuality_Icon.webp',
          links: [
            { 
              label: 'RH Sensors', 
              href: '/products',
              description: 'Relative humidity measurement'
            },
            { 
              label: 'CO₂ Sensors', 
              href: '/products',
              description: 'Carbon dioxide monitoring for IAQ'
            },
            { 
              label: 'VOC Sensors', 
              href: '/products',
              description: 'Volatile organic compound detection'
            },
            { 
              label: 'Particulate Matter', 
              href: '/products',
              description: 'PM2.5 and PM10 monitoring'
            },
          ],
        },
        {
          title: 'Pressure & Controllers',
          icon: '/images/icons/Pressure_Icon.webp',
          links: [
            { 
              label: 'Differential Pressure', 
              href: '/products',
              description: 'Room pressurization and filter monitoring'
            },
            { 
              label: 'Static Pressure', 
              href: '/products',
              description: 'Duct static pressure transmitters'
            },
            { 
              label: 'Zone Controllers', 
              href: '/products',
              description: 'VAV and FCU control solutions'
            },
            { 
              label: 'I/O Modules', 
              href: '/products',
              description: 'Expandable input/output modules'
            },
          ],
        },
      ],
      featured: {
        title: 'WAM™ Wireless Asset Monitoring',
        description: '24/7 remote monitoring with instant alerts. Protect your valuable assets from power outages and equipment failures. No wiring required - get up and running in minutes.',
        cta: 'Learn More',
        href: '/wam',
        badge: 'Premium Solution',
      },
    },
  },
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
              href: '/applications/building-automation',
              description: 'Offices, classrooms, healthcare spaces'
            },
            { 
              label: 'HVAC Duct & Air Handler', 
              href: '/applications/building-automation',
              description: 'Supply, return, mixed air sensing'
            },
            { 
              label: 'Outdoor & Weather Stations', 
              href: '/applications/building-automation',
              description: 'Building weather monitoring'
            },
            { 
              label: 'Critical Spaces', 
              href: '/applications/building-automation',
              description: 'Data centers, server rooms, labs',
              badge: 'Popular'
            },
            { 
              label: 'Indoor Air Quality', 
              href: '/applications/building-automation',
              description: 'CO₂, VOC monitoring'
            },
          ],
        },
        {
          title: 'Industrial & Wireless',
          icon: '/images/icons/Wireless_Icon.webp',
          links: [
            { 
              label: 'Manufacturing Process', 
              href: '/applications',
              description: 'Industrial temperature & pressure'
            },
            { 
              label: 'Industrial Refrigeration', 
              href: '/applications',
              description: 'Cold storage monitoring'
            },
            { 
              label: 'Wireless Monitoring', 
              href: '/wam',
              description: 'Battery-powered remote sensors',
              badge: 'Premium'
            },
            { 
              label: 'Wireless Pressure', 
              href: '/wam',
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
              href: '/applications',
              description: 'Modernize legacy systems'
            },
            { 
              label: 'Pneumatic Replacement', 
              href: '/applications',
              description: 'Convert to electronic sensors'
            },
            { 
              label: 'Installation Support', 
              href: '/contact',
              description: 'Talk to our technical team'
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
    label: 'Support',
    href: '/contact',
    megaMenu: {
      columns: [
        {
          title: 'Get Help',
          icon: LifeBuoy,
          links: [
            { 
              label: 'Contact Support', 
              href: '/contact',
              description: 'Phone, email, and sales team',
              badge: 'Popular'
            },
            { 
              label: 'Technical Support', 
              href: '/contact',
              description: 'Product troubleshooting and configuration'
            },
            { 
              label: 'Request a Quote', 
              href: '/request-quote',
              description: 'Custom pricing for your project'
            },
          ],
        },
        {
          title: 'Documentation',
          icon: BookOpen,
          links: [
            { 
              label: 'Application Notes', 
              href: '/application-notes',
              description: 'Technical guides and best practices'
            },
            { 
              label: 'All Resources', 
              href: '/resources',
              description: 'Installation guides and specs'
            },
            { 
              label: 'Product Search', 
              href: '/products',
              description: 'Find the right sensor'
            },
          ],
        },
        {
          title: 'Tools & Resources',
          icon: Wrench,
          links: [
            { 
              label: 'Product Catalog', 
              href: '/products',
              description: 'Browse all products',
            },
            { 
              label: 'Applications Guide', 
              href: '/applications',
              description: 'Find sensors by use case'
            },
            { 
              label: 'Contact Sales Team', 
              href: '/contact',
              description: 'Talk to a product expert'
            },
          ],
        },
      ],
      featured: {
        title: 'Need Technical Help?',
        description: 'Our support team is ready to help with product selection, installation, and troubleshooting. Average response time: 2 hours.',
        cta: 'Contact Support',
        href: '/contact',
      },
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
        {
          title: 'Resources',
          icon: BookOpen,
          links: [
            { 
              label: 'Application Notes', 
              href: '/application-notes',
              description: 'Technical documentation'
            },
            { 
              label: 'All Resources', 
              href: '/resources',
              description: 'Guides and white papers'
            },
            { 
              label: 'Product Solutions', 
              href: '/solutions/building-automation',
              description: 'Industry-specific solutions'
            },
          ],
        },
        {
          title: 'Get in Touch',
          icon: Phone,
          links: [
            { 
              label: 'Contact & Sales Team', 
              href: '/contact',
              description: 'Phone, email, and global team',
              badge: 'Popular'
            },
            { 
              label: 'Request a Quote', 
              href: '/request-quote',
              description: 'Custom pricing for your project'
            },
          ],
        },
      ],
      featured: {
        title: 'Talk to Our Experts',
        description: 'Our sales and technical team is ready to help with product selection, installation guidance, and custom solutions for your project.',
        cta: 'Contact Us',
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