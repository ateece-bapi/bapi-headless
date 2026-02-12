import type { ApplicationLandingPageData } from '@/types/applications';

/**
 * Data Centers Application Landing Page Data
 *
 * Target Audience: IT managers, data center operators, colocation facility managers
 * Pain Points: Downtime costs, hot spots, power density, compliance
 * Goals: 99.99% uptime, prevent equipment failures, optimize cooling
 */
export const dataCentersData: ApplicationLandingPageData = {
  slug: 'data-centers',
  name: 'Data Centers & Critical Infrastructure',

  hero: {
    image: '/images/installations/Server_Room_HotAisle.webp',
    imageAlt: 'BAPI sensors monitoring data center server room hot aisle containment',
    title: 'Data Center Monitoring Solutions',
    tagline:
      'Mission-critical temperature and environmental monitoring for server rooms, colocation facilities, and edge computing infrastructure',
    stats: [
      {
        value: '99.99%',
        label: 'Uptime Target',
        icon: 'Activity',
      },
      {
        value: '<0.5°C',
        label: 'Precision Accuracy',
        icon: 'Crosshair',
      },
      {
        value: '$9K/min',
        label: 'Avg Downtime Cost',
        icon: 'AlertTriangle',
      },
    ],
  },

  introduction:
    "Data center downtime costs average $9,000 per minute. Environmental failures account for 25% of unplanned outages. BAPI's precision sensors provide the early warning and accuracy you need to protect your mission-critical infrastructure.",

  challenges: [
    {
      title: 'Catastrophic Downtime Risk',
      description:
        'Server failures due to overheating or humidity issues can cost millions in revenue loss, data corruption, and SLA penalties.',
    },
    {
      title: 'Hot Spots & Thermal Runaway',
      description:
        'Uneven cooling distribution creates hot spots that accelerate hardware failure and reduce equipment lifespan.',
    },
    {
      title: 'Rising Power Density',
      description:
        'Modern servers generate more heat per rack (15-25 kW). Cooling systems struggle to keep up, driving up energy costs.',
    },
    {
      title: 'Compliance & Audits',
      description:
        'SSAE-18, ISO 27001, and PCI-DSS require documented environmental monitoring. Failed audits risk certifications.',
    },
  ],

  solutions: [
    {
      title: 'Rack-Level Precision',
      description:
        'Monitor temperature and humidity at the rack inlet, middle, and exhaust with ±0.5°C accuracy. Identify hot spots before they cause failures.',
    },
    {
      title: 'Real-Time Alerting',
      description:
        'Instant notifications when temperatures exceed thresholds. Integrate with BMS, DCIM, and monitoring dashboards for 24/7 oversight.',
    },
    {
      title: 'Scalable Architecture',
      description:
        'BACnet MS/TP and Modbus networks support hundreds of sensors on a single network. Easy to expand as your facility grows.',
    },
    {
      title: 'Proven Reliability',
      description:
        'Military-grade components, conformal coating, and rigorous testing ensure sensors work when you need them most. 5-year warranty.',
    },
  ],

  productCategories: [
    {
      name: 'Rack Temperature Sensors',
      description:
        'Precision sensors for inlet, middle, and exhaust monitoring. BACnet and Modbus options. DCIM integration ready.',
      link: '/products?filter=data-center-temperature',
    },
    {
      name: 'Humidity Sensors',
      description:
        'Prevent static discharge and condensation with accurate RH monitoring. Alerts when humidity drifts out of spec.',
      link: '/products?filter=humidity-sensors',
    },
    {
      name: 'Differential Pressure',
      description:
        'Monitor pressure in hot aisle containment, raised floors, and CRAC units. Ensure proper airflow and containment.',
      link: '/products?filter=pressure-sensors',
    },
    {
      name: 'Water Leak Detection',
      description:
        'Rope-style leak detectors for under-floor piping, CRAC units, and chilled water systems. Prevent flooding disasters.',
      link: '/products?filter=leak-detection',
    },
  ],

  benefits: [
    {
      title: 'Prevent Costly Outages',
      description:
        'Early warning of temperature excursions prevents equipment failures and downtime. One prevented outage pays for entire sensor system.',
    },
    {
      title: 'Optimize Cooling Efficiency',
      description:
        'Data-driven cooling adjustments reduce PUE (Power Usage Effectiveness) and cut cooling costs by 20-35%.',
    },
    {
      title: 'Extend Hardware Life',
      description:
        'Maintaining optimal temperature ranges (18-27°C) extends server and storage lifespans by 2-3 years.',
    },
    {
      title: 'Faster Troubleshooting',
      description:
        'Granular sensor data pinpoints cooling problems quickly. Reduce mean time to repair (MTTR) by 50%.',
    },
    {
      title: 'Audit Compliance',
      description:
        'Automated logging and reporting satisfy SSAE-18, ISO 27001, and PCI-DSS environmental requirements.',
    },
    {
      title: 'Capacity Planning',
      description:
        'Historical trends reveal cooling capacity limits. Plan expansions and upgrades based on real data, not guesswork.',
    },
  ],

  examples: [
    {
      title: 'Colocation Facility Hot Spot Elimination',
      description: 'Deployed 150+ rack-level temperature sensors across 5 data halls.',
      image: '/images/installations/Server_Room_HotAisle.webp',
      imageAlt: 'Colocation data center with BAPI rack temperature monitoring',
      result:
        'Identified and corrected 12 hot spots, prevented 3 potential server failures, improved PUE from 1.8 to 1.4.',
    },
    {
      title: 'Enterprise Server Room Upgrade',
      description:
        'Replaced aging thermostats with precision BACnet sensors in mission-critical server room.',
      result:
        'Achieved 99.995% uptime for 3 years running. Reduced cooling energy 28%. Zero environmental incidents.',
    },
    {
      title: 'Edge Computing Site Monitoring',
      description:
        'Standardized sensor deployment across 50 remote edge computing sites for centralized monitoring.',
      result:
        'Remote visibility into all sites, automated alerting, 60% faster response to environmental issues.',
    },
  ],

  ctas: {
    primary: {
      text: 'Explore Data Center Products',
      link: '/products?filter=data-center',
      variant: 'primary',
    },
    secondary: {
      text: 'Speak with Data Center Specialist',
      link: '/contact',
      variant: 'secondary',
    },
  },

  seo: {
    title: 'Data Center Temperature Monitoring | Server Room Environmental Sensors | BAPI',
    description:
      'Precision temperature, humidity, and pressure sensors for data centers. BACnet/Modbus integration. Prevent downtime. 99.99% uptime. 5-year warranty.',
    keywords: [
      'data center temperature monitoring',
      'server room sensors',
      'rack temperature sensors',
      'data center environmental monitoring',
      'DCIM sensors',
      'BACnet data center',
      'colocation monitoring',
      'edge computing sensors',
      'hot aisle containment',
      'server room humidity',
    ],
    ogImage: '/images/installations/Server_Room_HotAisle.webp',
  },
};
