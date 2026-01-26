import type { ApplicationLandingPageData } from '@/types/applications';

/**
 * Healthcare Facilities Application Landing Page Data
 * 
 * Target Audience: Biomedical engineers, facility managers, compliance officers
 * Pain Points: Patient safety, regulatory compliance, infection control
 * Goals: Meet Joint Commission standards, protect vulnerable patients
 */
export const healthcareData: ApplicationLandingPageData = {
  slug: 'healthcare',
  name: 'Healthcare Facilities',
  
  hero: {
    image: '/images/installations/Server_Room_HotAisle.webp',
    imageAlt: 'BAPI sensors in hospital operating room and critical care monitoring',
    title: 'Healthcare Environmental Monitoring',
    tagline: 'Patient safety-critical temperature, pressure, and air quality sensors for hospitals, clinics, labs, and pharmacies',
    stats: [
      {
        value: '100%',
        label: 'Joint Commission Ready',
        icon: 'Award'
      },
      {
        value: '24/7',
        label: 'Continuous Monitoring',
        icon: 'Activity'
      },
      {
        value: 'ISO 13485',
        label: 'Medical Device QMS',
        icon: 'Shield'
      }
    ]
  },
  
  introduction: 'Healthcare facilities require precise environmental control to protect vulnerable patients, prevent infections, and maintain regulatory compliance. BAPI sensors deliver the accuracy and reliability needed for life-critical applications.',
  
  challenges: [
    {
      title: 'Patient Safety at Risk',
      description: 'Temperature and pressure failures in operating rooms, isolation rooms, and NICUs can compromise patient outcomes and safety.',
    },
    {
      title: 'Infection Control',
      description: 'Improper room pressurization allows airborne pathogens to spread. Negative pressure isolation failures endanger immunocompromised patients.',
    },
    {
      title: 'Regulatory Compliance',
      description: 'Joint Commission, FGI Guidelines, and ASHRAE 170 require documented environmental monitoring. Failed audits risk accreditation.',
    },
    {
      title: 'Medication Storage',
      description: 'Pharmacies must maintain precise temperature control for medications and vaccines. Excursions can render drugs ineffective.',
    }
  ],
  
  solutions: [
    {
      title: 'Operating Room Precision',
      description: 'Maintain temperature within ±1°F and humidity 20-60% RH as required by ASHRAE 170. Continuous monitoring with instant alerts.',
    },
    {
      title: 'Pressure Differential Monitoring',
      description: 'Ensure proper positive/negative pressure relationships in isolation rooms, ORs, clean rooms, and protective environments.',
    },
    {
      title: 'Cleanroom Compliance',
      description: 'ISO Class 5-8 cleanroom monitoring for compounding pharmacies, sterile processing, and research labs.',
    },
    {
      title: 'Automated Documentation',
      description: 'BACnet/Modbus integration with BMS provides automatic logging for Joint Commission and state health department audits.',
    }
  ],
  
  productCategories: [
    {
      name: 'Room Pressure Sensors',
      description: 'Differential pressure sensors for isolation rooms, operating rooms, and protective environments. FDA-listed options available.',
      link: '/products?filter=pressure-sensors',
    },
    {
      name: 'Temperature & Humidity',
      description: 'Precision sensors for patient rooms, pharmacies, labs, and storage areas. NIST-traceable calibration certificates.',
      link: '/products?filter=healthcare-temperature',
    },
    {
      name: 'Air Quality Monitoring',
      description: 'CO₂ and VOC sensors for patient room ventilation and indoor air quality compliance.',
      link: '/products?filter=air-quality',
    },
    {
      name: 'Nurse Call Integration',
      description: 'Environmental alerts integrated with nurse call systems. Instant notification of temperature or pressure alarms.',
      link: '/products?filter=integration',
    }
  ],
  
  benefits: [
    {
      title: 'Protect Patient Safety',
      description: 'Continuous environmental monitoring prevents adverse events. Early warning of temperature or pressure excursions.',
    },
    {
      title: 'Pass Inspections',
      description: 'Meet Joint Commission EC.02.05.01, FGI Guidelines, and ASHRAE 170 requirements with documented compliance.',
    },
    {
      title: 'Prevent Infections',
      description: 'Maintain proper pressure relationships to contain airborne pathogens. Reduce hospital-acquired infection rates.',
    },
    {
      title: 'Medication Integrity',
      description: 'Protect temperature-sensitive medications and vaccines with precise monitoring and automated alerts.',
    },
    {
      title: 'Reduce Liability',
      description: 'Documented environmental compliance reduces malpractice risk and provides evidence in case of adverse events.',
    },
    {
      title: 'Staff Peace of Mind',
      description: '24/7 automated monitoring reduces staff burden. Alarms notify the right people instantly.',
    }
  ],
  
  examples: [
    {
      title: 'Hospital OR Pressure Monitoring',
      description: 'Installed differential pressure sensors in 12 operating rooms for continuous Joint Commission compliance.',
      result: '3 years of perfect compliance, zero pressure failures, passed Joint Commission audit with no findings.'
    },
    {
      title: 'Pharmacy Vaccine Storage',
      description: 'Temperature sensors with cloud monitoring for COVID-19 vaccine ultra-cold storage.',
      result: 'Prevented 2 vaccine excursions worth $50K. Real-time alerts saved inventory.'
    },
    {
      title: 'Isolation Room Upgrade',
      description: 'Retrofitted 20 isolation rooms with pressure sensors and BACnet integration.',
      result: 'Automated compliance logging, reduced nurse burden, met state health department requirements.'
    }
  ],
  
  ctas: {
    primary: {
      text: 'Find Healthcare Products',
      link: '/products?filter=healthcare',
      variant: 'primary'
    },
    secondary: {
      text: 'Request Compliance Consultation',
      link: '/contact',
      variant: 'secondary'
    }
  },
  
  seo: {
    title: 'Healthcare Environmental Monitoring | Hospital Pressure & Temperature Sensors | BAPI',
    description: 'Joint Commission compliant sensors for operating rooms, isolation rooms, pharmacies. Pressure, temperature, humidity monitoring. FDA-listed options.',
    keywords: [
      'hospital environmental monitoring',
      'operating room pressure sensors',
      'isolation room monitoring',
      'healthcare temperature sensors',
      'Joint Commission compliance',
      'ASHRAE 170',
      'pharmacy temperature monitoring',
      'cleanroom sensors',
      'patient safety monitoring',
      'medical device sensors'
    ],
    ogImage: '/images/installations/Server_Room_HotAisle.webp'
  }
};
