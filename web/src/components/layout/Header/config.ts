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
        {
          title: 'Product Families',
          icon: '/images/icons/Temperature_Icon.webp',
          links: [
            { 
              label: 'Sensors', 
              href: '/sensors',
              description: 'Temperature, Humidity & Pressure',
              badge: 'New'
            },
            { 
              label: 'Wireless Monitoring', 
              href: '/wireless',
              description: 'WAM cloud-based solutions',
              badge: 'New'
            },
            { 
              label: 'Test Instruments', 
              href: '/test-instruments',
              description: 'Blu-Test diagnostic tools',
              badge: 'New'
            },
            { 
              label: 'Air Quality', 
              href: '/air-quality',
              description: 'CO₂, VOC & IAQ sensors',
              badge: 'New'
            },
            { 
              label: 'Accessories', 
              href: '/accessories',
              description: 'Mounting hardware & cables',
              badge: 'New'
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
          title: 'By Industry',
          icon: Building2,
          links: [
            { 
              label: 'Building Automation', 
              href: '/applications/landing/building-automation',
              description: '30% energy savings for commercial buildings',
              badge: 'Popular'
            },
            { 
              label: 'Data Centers', 
              href: '/applications/landing/data-centers',
              description: '99.99% uptime for critical infrastructure'
            },
            { 
              label: 'Healthcare Facilities', 
              href: '/applications/landing/healthcare',
              description: 'Joint Commission compliance solutions'
            },
            { 
              label: 'Industrial & Manufacturing', 
              href: '/applications/landing/industrial',
              description: 'Harsh environment monitoring solutions'
            },
            { 
              label: 'Wireless Monitoring', 
              href: '/applications/landing/wireless-monitoring',
              description: '5-minute setup, 5-year battery life',
              badge: 'Premium'
            },
          ],
        },
        {
          title: 'By Use Case',
          icon: '/images/icons/Temperature_Icon.webp',
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
              label: 'Indoor Air Quality', 
              href: '/applications/building-automation',
              description: 'CO₂, VOC monitoring'
            },
            { 
              label: 'Industrial Refrigeration', 
              href: '/applications',
              description: 'Cold storage monitoring'
            },
          ],
        },
        {
          title: 'Resources',
          icon: Wrench,
          links: [
            { 
              label: 'Real-World Installations', 
              href: '/installations',
              description: 'See BAPI sensors in action',
              badge: 'New'
            },
            { 
              label: 'Browse All Applications', 
              href: '/applications',
              description: 'Complete application directory'
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
        title: 'Find Solutions by Application',
        description: 'Explore how BAPI sensors solve real-world challenges in your industry. See measurable results from organizations like yours.',
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