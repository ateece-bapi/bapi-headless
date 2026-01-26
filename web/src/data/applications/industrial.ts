import type { ApplicationLandingPageData } from '@/types/applications';

/**
 * Industrial Process Control Application Landing Page Data
 * 
 * Target Audience: Plant managers, process engineers, maintenance supervisors
 * Pain Points: Process variability, equipment failures, safety compliance
 * Goals: Improve process reliability, reduce downtime, meet safety standards
 */
export const industrialData: ApplicationLandingPageData = {
  slug: 'industrial',
  name: 'Industrial & Manufacturing',
  
  hero: {
    image: '/images/installations/Pressure_OutsidePickup_1.webp',
    imageAlt: 'BAPI industrial pressure and temperature sensors in manufacturing facility',
    title: 'Industrial Process Monitoring',
    tagline: 'Rugged sensors for manufacturing, industrial refrigeration, and harsh environment process control',
    stats: [
      {
        value: '-40 to 185°F',
        label: 'Extended Range',
        icon: 'Thermometer'
      },
      {
        value: 'IP65',
        label: 'Industrial Rating',
        icon: 'ShieldCheck'
      },
      {
        value: '10+ Years',
        label: 'Typical Lifespan',
        icon: 'Clock'
      }
    ]
  },
  
  introduction: 'Industrial environments demand sensors that can withstand temperature extremes, vibration, moisture, and contaminants. BAPI\'s industrial-grade sensors deliver reliable performance in the harshest conditions.',
  
  challenges: [
    {
      title: 'Harsh Environmental Conditions',
      description: 'Extreme temperatures, humidity, vibration, dust, and chemical exposure cause premature sensor failures in industrial settings.',
    },
    {
      title: 'Process Variability',
      description: 'Inaccurate sensors lead to process drift, quality issues, and increased scrap rates. Tight process control requires precision sensing.',
    },
    {
      title: 'Unplanned Downtime',
      description: 'Sensor failures trigger false alarms and equipment shutdowns. Every hour of downtime costs thousands in lost production.',
    },
    {
      title: 'Safety & Compliance',
      description: 'OSHA, EPA, and industry standards require documented monitoring of process temperatures, pressures, and conditions.',
    }
  ],
  
  solutions: [
    {
      title: 'Industrial-Grade Construction',
      description: 'IP65-rated enclosures, conformal coated electronics, and stainless steel probes withstand harsh environments for years.',
    },
    {
      title: 'Extended Temperature Range',
      description: 'Sensors rated from -40°F to 185°F handle refrigeration, heat treatment, and industrial process applications.',
    },
    {
      title: 'Field-Proven Reliability',
      description: 'Designed and tested for industrial abuse. Lower failure rates mean less downtime and lower maintenance costs.',
    },
    {
      title: 'PLC Integration',
      description: '4-20mA, 0-10V, Modbus RTU outputs integrate with Allen-Bradley, Siemens, and other industrial controllers.',
    }
  ],
  
  productCategories: [
    {
      name: 'Industrial Temperature',
      description: 'Immersion, strap-on, and probe-style sensors for pipes, tanks, vessels, and process equipment. RTD and thermistor options.',
      link: '/products?filter=industrial-temperature',
    },
    {
      name: 'Pressure Transmitters',
      description: 'Static, differential, and gauge pressure sensors for HVAC, compressed air, and process applications. 4-20mA output.',
      link: '/products?filter=pressure',
    },
    {
      name: 'Industrial Refrigeration',
      description: 'Sensors for cold storage, blast freezers, and industrial chillers. Low-temperature rated to -40°F.',
      link: '/products?filter=refrigeration',
    },
    {
      name: 'Humidity Sensors',
      description: 'Desiccant storage, environmental chambers, and manufacturing process RH monitoring.',
      link: '/products?filter=humidity',
    }
  ],
  
  benefits: [
    {
      title: 'Reduce Downtime',
      description: 'Reliable sensors mean fewer false alarms, fewer emergency shutdowns, and less unplanned maintenance.',
    },
    {
      title: 'Improve Process Control',
      description: 'Precision sensors enable tighter tolerances, reduced scrap rates, and consistent product quality.',
    },
    {
      title: 'Lower Maintenance Costs',
      description: 'Industrial-grade construction extends sensor life 2-3x vs. commercial sensors. Fewer replacements, less labor.',
    },
    {
      title: 'Safety Compliance',
      description: 'Meet OSHA, EPA, and industry-specific requirements with documented environmental monitoring.',
    },
    {
      title: 'Energy Efficiency',
      description: 'Optimize refrigeration, compressed air, and HVAC systems with accurate sensors. Reduce energy waste.',
    },
    {
      title: 'Faster Troubleshooting',
      description: 'Accurate data helps maintenance teams pinpoint problems quickly. Reduce mean time to repair (MTTR).',
    }
  ],
  
  examples: [
    {
      title: 'Cold Storage Warehouse',
      description: 'Installed 50+ low-temperature sensors across blast freezers and cold storage rooms.',
      image: '/images/installations/Pressure_OutsidePickup_1.webp',
      imageAlt: 'Industrial cold storage with BAPI temperature monitoring',
      result: 'Prevented 3 product losses worth $100K+. Real-time alerts stopped temperature excursions before damage.'
    },
    {
      title: 'Manufacturing Plant HVAC',
      description: 'Replaced failing sensors on 20 rooftop units and process air handlers.',
      result: '35% reduction in HVAC energy costs. Eliminated false alarms. Improved production floor comfort.'
    },
    {
      title: 'Compressed Air Monitoring',
      description: 'Added pressure sensors to detect air leaks and optimize compressor sequencing.',
      result: '18% reduction in compressor runtime. $25K annual energy savings. ROI in 8 months.'
    }
  ],
  
  ctas: {
    primary: {
      text: 'Browse Industrial Products',
      link: '/products?filter=industrial',
      variant: 'primary'
    },
    secondary: {
      text: 'Talk to Industrial Specialist',
      link: '/contact',
      variant: 'secondary'
    }
  },
  
  seo: {
    title: 'Industrial Sensors | Manufacturing Process Monitoring | BAPI',
    description: 'Rugged temperature, pressure, humidity sensors for industrial and manufacturing. IP65 rated. -40°F to 185°F range. PLC integration.',
    keywords: [
      'industrial sensors',
      'manufacturing sensors',
      'process control sensors',
      'industrial temperature sensors',
      'pressure transmitters',
      'industrial refrigeration',
      'cold storage monitoring',
      'PLC sensors',
      'Modbus sensors',
      '4-20mA sensors'
    ],
    ogImage: '/images/installations/Pressure_OutsidePickup_1.webp'
  }
};
