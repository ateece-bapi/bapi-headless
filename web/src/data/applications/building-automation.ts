import type { ApplicationLandingPageData } from '@/types/applications';

/**
 * Building Automation Application Landing Page Data
 *
 * Target Audience: Facility managers, MEP engineers, building contractors
 * Pain Points: Energy costs, comfort complaints, maintenance complexity
 * Goals: Reduce operating costs, improve occupant comfort, simplify operations
 */
export const buildingAutomationData: ApplicationLandingPageData = {
  slug: 'building-automation',
  name: 'Building Automation',

  hero: {
    image: '/images/installations/Server_Room_HotAisle.webp',
    imageAlt: 'BAPI sensors in commercial building server room monitoring critical infrastructure',
    title: 'Building Automation Sensors',
    tagline:
      'Optimize comfort, efficiency, and indoor air quality in commercial buildings with precision sensor technology',
    stats: [
      {
        value: '30%',
        label: 'Energy Savings',
        icon: 'TrendingDown',
      },
      {
        value: '99.5%',
        label: 'Uptime Reliability',
        icon: 'Shield',
      },
      {
        value: '40+',
        label: 'Years Experience',
        icon: 'Award',
      },
    ],
  },

  introduction:
    "Commercial building owners and facility managers face constant pressure to reduce operating costs while maintaining optimal comfort and indoor air quality. BAPI's building automation sensors provide the accurate, reliable data your BAS needs to make intelligent decisions.",

  challenges: [
    {
      title: 'Rising Energy Costs',
      description:
        'HVAC systems consume 40% of commercial building energy. Without accurate temperature and humidity sensing, systems overcool, overheat, and waste energy.',
    },
    {
      title: 'Occupant Comfort Complaints',
      description:
        'Hot spots, cold spots, and poor air quality lead to tenant dissatisfaction, reduced productivity, and increased turnover.',
    },
    {
      title: 'Indoor Air Quality Concerns',
      description:
        'Post-pandemic, building occupants demand healthier indoor environments. CO₂ and VOC levels must be monitored and controlled.',
    },
    {
      title: 'Maintenance Complexity',
      description:
        'Failed sensors cause false alarms, system shutdowns, and emergency service calls. Unreliable sensors waste staff time.',
    },
  ],

  solutions: [
    {
      title: 'Precision Temperature Control',
      description:
        'BAPI sensors deliver ±1% accuracy across the operating range, enabling tighter deadbands, reduced compressor cycling, and 15-30% energy savings.',
    },
    {
      title: 'Comprehensive Space Monitoring',
      description:
        'Monitor temperature, humidity, CO₂, VOC, and differential pressure in a single device. Reduce installation costs and wiring complexity.',
    },
    {
      title: 'Field-Proven Reliability',
      description:
        '5-year warranty backed by 40+ years of manufacturing experience. BAPI sensors outlast the competition with lower total cost of ownership.',
    },
    {
      title: 'Seamless BAS Integration',
      description:
        'BACnet MS/TP, Modbus RTU, and analog outputs integrate with all major building automation systems. Pre-configured for plug-and-play installation.',
    },
  ],

  productCategories: [
    {
      name: 'Room & Wall Sensors',
      description:
        'Temperature, humidity, and CO₂ sensors for offices, conference rooms, classrooms, and common areas. Surface-mount or flush-mount options.',
      link: '/products?filter=room-sensors',
    },
    {
      name: 'Duct & Air Handler Sensors',
      description:
        'Probe-style sensors for supply air, return air, and mixed air monitoring. Averaging elements for large ducts.',
      link: '/products?filter=duct-sensors',
    },
    {
      name: 'Outdoor & Weather Sensors',
      description:
        'Weather-resistant sensors for outdoor air temperature, humidity, and enthalpy control. Solar radiation shields included.',
      link: '/products?filter=outdoor-sensors',
    },
    {
      name: 'Zone Controllers',
      description:
        'VAV controllers, fan coil controllers, and I/O modules for complete zone control. BACnet and Modbus protocols.',
      link: '/products?filter=controllers',
    },
  ],

  benefits: [
    {
      title: 'Lower Energy Bills',
      description:
        'Accurate sensors enable tighter setpoints and optimal equipment sequencing, reducing HVAC energy consumption by 15-30%.',
    },
    {
      title: 'Improved Tenant Comfort',
      description:
        'Eliminate hot and cold spots with precise zone-level monitoring. Maintain consistent comfort across all spaces.',
    },
    {
      title: 'Healthier Indoor Air',
      description:
        'Demand-controlled ventilation based on CO₂ levels ensures adequate fresh air without over-ventilating.',
    },
    {
      title: 'Reduced Maintenance',
      description:
        'Field-proven reliability means fewer sensor failures, less troubleshooting time, and lower maintenance costs.',
    },
    {
      title: 'Code Compliance',
      description:
        'Meet ASHRAE 62.1, ASHRAE 90.1, and LEED requirements with certified sensors and documentation.',
    },
    {
      title: 'Fast ROI',
      description:
        'Energy savings typically pay for sensor upgrades within 12-24 months. Long-term reliability extends ROI.',
    },
  ],

  examples: [
    {
      title: 'Office Building Retrofit',
      description:
        'Replaced 200+ failing pneumatic sensors with BAPI room sensors and duct sensors.',
      image: '/images/installations/Server_Room_HotAisle.webp',
      imageAlt: 'Office building HVAC retrofit with BAPI sensors',
      result:
        '28% reduction in HVAC energy costs, 95% decrease in comfort complaints, payback in 18 months.',
    },
    {
      title: 'University Campus IAQ Upgrade',
      description:
        'Installed CO₂ sensors in 150 classrooms and lecture halls for demand-controlled ventilation.',
      result:
        'Achieved LEED certification, improved student focus and test scores, 22% energy savings.',
    },
    {
      title: 'Hospital Critical Space Monitoring',
      description:
        'Deployed differential pressure sensors in operating rooms, isolation rooms, and clean rooms.',
      result:
        'Maintained Joint Commission compliance, zero pressure failures, 24/7 monitoring peace of mind.',
    },
  ],

  ctas: {
    primary: {
      text: 'Find Building Automation Products',
      link: '/products?filter=building-automation',
      variant: 'primary',
    },
    secondary: {
      text: 'Request Engineering Consultation',
      link: '/contact',
      variant: 'secondary',
    },
  },

  seo: {
    title: 'Building Automation Sensors | HVAC Controls & BAS Integration | BAPI',
    description:
      'Precision temperature, humidity, CO₂, and pressure sensors for commercial buildings. BACnet and Modbus integration. 5-year warranty. Reduce energy costs 15-30%.',
    keywords: [
      'building automation sensors',
      'BAS sensors',
      'HVAC sensors',
      'commercial building sensors',
      'BACnet sensors',
      'room temperature sensors',
      'duct sensors',
      'CO2 sensors',
      'demand controlled ventilation',
      'building energy management',
    ],
    ogImage: '/images/installations/Server_Room_HotAisle.webp',
  },
};
