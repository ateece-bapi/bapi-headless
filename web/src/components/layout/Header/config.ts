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
              description: 'High-accuracy temperature sensing'
            },
            { 
              label: 'Duct Sensors', 
              href: '/products',
              description: 'Duct-mounted transmitters'
            },
            { 
              label: 'Immersion & Well', 
              href: '/products',
              description: 'Liquid temperature measurement'
            },
            { 
              label: 'Outdoor Sensors', 
              href: '/products',
              description: 'Weather-resistant sensing'
            },
          ],
        },
        {
          title: 'Humidity',
          icon: '/images/icons/Humidity_Icon.webp',
          links: [
            { 
              label: 'Room Humidity', 
              href: '/products',
              description: 'Wall-mount RH sensors'
            },
            { 
              label: 'Duct Humidity', 
              href: '/products',
              description: 'Supply & return air RH'
            },
            { 
              label: 'Outdoor Humidity', 
              href: '/products',
              description: 'Weather-resistant RH'
            },
            { 
              label: 'Combo Sensors', 
              href: '/products',
              description: 'Temperature + humidity'
            },
          ],
        },
        {
          title: 'Pressure',
          icon: '/images/icons/Pressure_Icon.webp',
          links: [
            { 
              label: 'Differential Pressure', 
              href: '/products',
              description: 'Room & filter monitoring'
            },
            { 
              label: 'Static Pressure', 
              href: '/products',
              description: 'Duct static transmitters'
            },
            { 
              label: 'Barometric', 
              href: '/products',
              description: 'Atmospheric pressure'
            },
          ],
        },
        {
          title: 'Air Quality',
          icon: '/images/icons/AirQuality_Icon.webp',
          links: [
            { 
              label: 'CO₂ Sensors', 
              href: '/products',
              description: 'Carbon dioxide monitoring'
            },
            { 
              label: 'VOC Sensors', 
              href: '/products',
              description: 'Volatile organic compounds'
            },
            { 
              label: 'Particulate Matter', 
              href: '/products',
              description: 'PM2.5 and PM10'
            },
          ],
        },
        {
          title: 'Wireless',
          icon: '/images/icons/Wireless_Icon.webp',
          links: [
            { 
              label: 'WAM Temperature', 
              href: '/wireless',
              description: 'Wireless temp sensors',
              badge: 'Popular'
            },
            { 
              label: 'WAM Humidity', 
              href: '/wireless',
              description: 'Wireless RH sensors'
            },
            { 
              label: 'WAM Door Sensors', 
              href: '/wireless',
              description: 'Open/close monitoring'
            },
            { 
              label: 'Cloud Platform', 
              href: '/wam',
              description: '24/7 remote monitoring',
              badge: 'Premium'
            },
          ],
        },
        {
          title: 'Accessories',
          icon: '/images/icons/Accessories_Icon.webp',
          links: [
            { 
              label: 'Mounting Hardware', 
              href: '/accessories',
              description: 'Plates, boxes, brackets'
            },
            { 
              label: 'Enclosures', 
              href: '/accessories',
              description: 'BAPI-Box & covers'
            },
            { 
              label: 'Cables & Connectors', 
              href: '/accessories',
              description: 'Wiring accessories'
            },
          ],
        },
        {
          title: 'Test Instruments',
          icon: '/images/icons/Test_Instruments_Icon.webp',
          links: [
            { 
              label: 'Blu-Test Temperature', 
              href: '/test-instruments',
              description: 'NIST-traceable reference',
              badge: 'New'
            },
            { 
              label: 'Blu-Test Humidity', 
              href: '/test-instruments',
              description: 'Temp + RH reference'
            },
            { 
              label: 'Blu-Test Pressure', 
              href: '/test-instruments',
              description: 'Digital manometer'
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
    label: 'Resources',
    href: '/resources',
    megaMenu: {
      columns: [
        {
          title: 'Technical Documentation',
          icon: BookOpen,
          links: [
            { 
              label: 'Application Notes', 
              href: '/application-notes',
              description: 'Installation guides & best practices',
              badge: 'Popular'
            },
            { 
              label: 'Service Bulletins', 
              href: '/service-bulletin/',
              description: 'Product updates & technical fixes'
            },
            { 
              label: 'Product Datasheets', 
              href: '/resources/datasheets',
              description: 'Specifications & performance data'
            },
            { 
              label: 'BAPI Sensors Overview', 
              href: '/sensor-specs/',
              description: 'Quick reference selection guide'
            },
          ],
        },
        {
          title: 'Tools & Guides',
          icon: Wrench,
          links: [
            { 
              label: 'Product Catalog', 
              href: '/catalogpricebook/',
              description: 'Download complete catalog PDF',
              badge: 'Download'
            },
            { 
              label: 'Wireless Site Verification', 
              href: '/wireless-site-verification/',
              description: 'Verify signal coverage'
            },
            { 
              label: 'Product Selector', 
              href: '/resources/selector',
              description: 'Find the right sensor'
            },
          ],
        },
        {
          title: 'Learning Center',
          icon: GraduationCap,
          links: [
            { 
              label: 'Installation Videos', 
              href: '/resources/videos',
              description: 'Step-by-step tutorials',
              badge: 'Phase 2'
            },
            { 
              label: 'Case Studies', 
              href: '/resources/case-studies',
              description: 'Real-world applications'
            },
            { 
              label: 'Webinars', 
              href: '/resources/webinars',
              description: 'Training & certification',
              badge: 'Phase 2'
            },
          ],
        },
      ],
      featured: {
        title: 'Engineering Resources',
        description: 'Access technical documentation, application guides, and tools to specify and install BAPI sensors correctly.',
        cta: 'Browse All Resources',
        href: '/resources',
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
              label: 'Contact Support', 
              href: '/contact',
              description: 'Technical assistance',
              badge: 'Popular'
            },
            { 
              label: 'RMA Request', 
              href: '/rma-request/',
              description: 'Return authorization'
            },
            { 
              label: 'Where to Buy', 
              href: '/where-to-buy/',
              description: 'Find distributors',
              badge: 'Popular'
            },
          ],
        },
        {
          title: 'For Existing Customers',
          icon: Users,
          links: [
            { 
              label: 'My Account', 
              href: '/account',
              description: 'Orders & quotes'
            },
            { 
              label: 'Order Status', 
              href: '/account/orders',
              description: 'Track shipments'
            },
            { 
              label: 'Request a Quote', 
              href: '/request-quote',
              description: 'Custom pricing'
            },
          ],
        },
      ],
      featured: {
        title: 'Need Technical Help?',
        description: 'Our team is ready to assist with product selection, installation, and troubleshooting.',
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
              label: 'Where to Buy', 
              href: '/where-to-buy/',
              description: 'Find authorized distributors'
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