import type { ApplicationLandingPageData } from '@/types/applications';

/**
 * Wireless Asset Monitoring Application Landing Page Data
 * 
 * Target Audience: Facility managers, operations managers, remote site supervisors
 * Pain Points: Remote monitoring needs, installation complexity, retrofit challenges
 * Goals: 24/7 remote visibility, instant alerts, no wiring required
 */
export const wirelessMonitoringData: ApplicationLandingPageData = {
  slug: 'wireless-monitoring',
  name: 'Wireless Asset Monitoring',
  
  hero: {
    image: '/images/wam/dashboards/WAM_Graphic.webp',
    imageAlt: 'BAPI WAM wireless monitoring dashboard showing real-time sensor data',
    title: 'WAM™ Wireless Monitoring',
    tagline: '24/7 remote monitoring with instant alerts. Protect assets from temperature failures and equipment malfunctions - no wiring required.',
    stats: [
      {
        value: '5 Minutes',
        label: 'Setup Time',
        icon: 'Clock'
      },
      {
        value: '5 Years',
        label: 'Battery Life',
        icon: 'Battery'
      },
      {
        value: '24/7',
        label: 'Cloud Monitoring',
        icon: 'Cloud'
      }
    ]
  },
  
  introduction: 'Temperature failures in coolers, freezers, and critical equipment cost businesses thousands per incident. BAPI\'s WAM wireless monitoring provides 24/7 cloud-based oversight with instant SMS/email alerts - no complicated wiring or installation.',
  
  challenges: [
    {
      title: 'Expensive Temperature Losses',
      description: 'Walk-in coolers and freezers fail overnight, spoiling thousands of dollars in inventory. No warning until it\'s too late.',
    },
    {
      title: 'Remote Site Blind Spots',
      description: 'Multiple locations spread across regions. No visibility into conditions until someone physically checks on-site.',
    },
    {
      title: 'Installation Complexity',
      description: 'Traditional wired sensors require electricians, conduit, wire pulls, and network configuration. Costs add up quickly.',
    },
    {
      title: 'Retrofit Challenges',
      description: 'Existing buildings make wiring difficult or impossible. Drilling holes and fishing wires disrupts operations.',
    }
  ],
  
  solutions: [
    {
      title: 'Install in 5 Minutes',
      description: 'Peel-and-stick sensors mount to any surface. No wiring, no electrician, no network configuration. Connects to cloud automatically.',
    },
    {
      title: 'Instant SMS/Email Alerts',
      description: 'Temperature or door open alerts sent to unlimited recipients via SMS, email, and mobile app. Respond before losses occur.',
    },
    {
      title: '5-Year Battery Life',
      description: 'Long-life batteries eliminate maintenance. Sensors transmit every 15 minutes and last 5+ years. Low-battery alerts included.',
      features: [
        'Lithium battery lasts 5+ years',
        'Transmits every 15 minutes',
        'Low-battery email alerts',
        'No maintenance required',
      ],
    },
    {
      title: 'Cloud Dashboard',
      description: 'View all locations on one dashboard. Historical trends, compliance reports, and customizable alerts from any device.',
      features: [
        'All locations on one screen',
        'Historical trend graphs',
        'Compliance report exports',
        'Access from any device',
      ],
    },
  ],
  
  productCategories: [
    {
      name: 'Temperature Sensors',
      description: 'Wireless sensors for coolers, freezers, server rooms, and equipment monitoring. -40°F to 185°F range.',
      link: '/wireless',
    },
    {
      name: 'Door Sensors',
      description: 'Monitor walk-in cooler/freezer doors. Alerts when doors left open. Prevent energy waste and temperature loss.',
      link: '/wireless',
    },
    {
      name: 'Humidity Sensors',
      description: 'Track humidity levels in storage areas, warehouses, and critical spaces. Prevent mold and moisture damage.',
      link: '/wireless',
    },
    {
      name: 'WAM Cloud Platform',
      description: 'Subscription includes unlimited sensors, users, locations, and alerts. $15/month per sensor.',
      link: '/wireless',
    }
  ],
  
  benefits: [
    {
      title: 'Prevent Costly Losses',
      description: 'Instant alerts stop spoilage before it happens. One prevented loss pays for years of monitoring service.',
    },
    {
      title: 'No Installation Hassles',
      description: 'Peel-and-stick installation. No electrician, no wiring, no IT configuration. Anyone can install in minutes.',
    },
    {
      title: 'Monitor Anywhere, Anytime',
      description: 'Cloud dashboard accessible from phone, tablet, or computer. Check temperatures from home, office, or on vacation.',
    },
    {
      title: 'Compliance Documentation',
      description: 'Automated temperature logs satisfy FDA, USDA, and health department requirements. Export reports for audits.',
    },
    {
      title: 'Scalable Solution',
      description: 'Start with one location, expand to hundreds. Add sensors anytime. One dashboard for all sites.',
    },
    {
      title: 'Peace of Mind',
      description: 'Sleep better knowing you\'ll be alerted instantly if something goes wrong. Protect your business 24/7.',
    }
  ],
  
  examples: [
    {
      title: 'Grocery Store Chain',
      description: 'Deployed WAM sensors in 25 stores (100+ coolers/freezers). Centralized monitoring from corporate office.',
      image: '/images/applications/retail/coolers/Cooler_Front_4.webp',
      imageAlt: 'Grocery store with WAM wireless temperature monitoring',
      result: 'Prevented 8 temperature failures worth $30K in inventory. ROI in 3 months. Passed health inspections.'
    },
    {
      title: 'Restaurant Franchise',
      description: 'Wireless monitoring across 40 restaurant locations for walk-in coolers, freezers, and reach-in units.',
      result: 'Eliminated surprise equipment failures. Reduced food waste 35%. Compliance documentation for franchisees.'
    },
    {
      title: 'Pharmaceutical Storage',
      description: 'Temperature monitoring for vaccine refrigerators and medication storage in clinic.',
      result: 'FDA-compliant temperature logs. Prevented vaccine loss during power outage. Real-time alerts saved $15K inventory.'
    }
  ],
  
  ctas: {
    primary: {
      text: 'Explore WAM Solutions',
      link: '/wireless',
      variant: 'primary'
    },
    secondary: {
      text: 'Request Free Demo',
      link: '/contact',
      variant: 'secondary'
    }
  },
  
  seo: {
    title: 'Wireless Temperature Monitoring | Cloud-Based Asset Monitoring | BAPI WAM',
    description: 'WAM wireless sensors for coolers, freezers, server rooms. 24/7 cloud monitoring. SMS/email alerts. 5-minute setup. No wiring required.',
    keywords: [
      'wireless temperature monitoring',
      'cloud temperature monitoring',
      'freezer monitoring system',
      'walk-in cooler monitoring',
      'remote temperature sensors',
      'wireless asset monitoring',
      'WAM sensors',
      'restaurant temperature monitoring',
      'pharmacy temperature monitoring',
      'no-wiring temperature sensors'
    ],
    ogImage: '/images/wam/dashboards/WAM_Graphic.webp'
  }
};
