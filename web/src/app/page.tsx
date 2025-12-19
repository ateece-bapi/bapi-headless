import Link from 'next/link';
import Hero from './components/Hero';
import { 
  Thermometer, 
  Gauge, 
  Wind, 
  Radio, 
  Settings, 
  Wrench,
  Building2,
  Server,
  Building,
  Factory,
  Target,
  Cable,
  HardHat,
  Package,
  FileText,
  Cog,
  GraduationCap,
  MessageSquare,
  BarChart3,
  RefreshCw,
  Phone,
  ClipboardList,
  Check
} from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Solution Categories - White */}
      <section className="w-full bg-white py-12 lg:py-16 xl:py-20">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="text-center mb-8 lg:mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 text-neutral-900">
              Engineered Solutions for Critical Environments
            </h2>
            <p className="text-base lg:text-lg xl:text-xl text-neutral-600 max-w-4xl mx-auto">
              Precision measurement and control solutions designed for the most demanding building automation applications
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                title: 'Temperature & Humidity Sensing',
                desc: 'High-accuracy sensors for HVAC control, cleanrooms, and data centers. ±0.2°C accuracy with BACnet/Modbus integration.',
                icon: Thermometer,
                features: ['±0.2°C Accuracy', 'BACnet MS/TP', 'IP65 Rated Options']
              },
              {
                title: 'Pressure Monitoring',
                desc: 'Differential and static pressure transmitters for critical room pressurization and airflow verification.',
                icon: Gauge,
                features: ['0-10" WC Range', 'Hospital Grade', 'ASHRAE 170 Compliant']
              },
              {
                title: 'Air Quality Sensors',
                desc: 'CO₂, VOC, and particulate monitoring for indoor air quality and demand-controlled ventilation.',
                icon: Wind,
                features: ['NDIR CO₂ Sensing', 'LEED Certified', 'Multi-Point Calibration']
              },
              {
                title: 'Wireless Solutions',
                desc: 'Battery-powered and energy harvesting sensors for retrofit and new construction.',
                icon: Radio,
                features: ['10-Year Battery Life', 'Mesh Networking', 'Cloud-Ready']
              },
              {
                title: 'Zone Controllers',
                desc: 'Networked controllers for VAV, FCU, and unitary equipment with flexible I/O configuration.',
                icon: Settings,
                features: ['Modular Design', 'Open Protocol', 'Web Interface']
              },
              {
                title: 'Integration Services',
                desc: 'Custom sensor configuration, system design support, and technical training for integrators.',
                icon: Wrench,
                features: ['Engineering Support', 'Custom Calibration', 'Project Consulting']
              }
            ].map((solution) => {
              const IconComponent = solution.icon;
              return (
              <div key={solution.title} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 lg:p-8 border border-neutral-200 hover:border-primary-500 group">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 lg:w-14 lg:h-14 bg-primary-500 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-primary-600 transition-colors">
                    <IconComponent className="w-6 h-6 lg:w-7 lg:h-7 text-white" strokeWidth={2} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg lg:text-xl text-neutral-900 mb-2 leading-tight">{solution.title}</h3>
                  </div>
                </div>
                <p className="text-neutral-600 mb-4 text-sm lg:text-base leading-relaxed">{solution.desc}</p>
                <ul className="space-y-2 mb-6">
                  {solution.features.map((feature) => (
                    <li key={feature} className="text-sm lg:text-base text-neutral-700 flex items-center">
                      <Check className="w-4 h-4 text-primary-500 mr-2 shrink-0" strokeWidth={2.5} />
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="flex gap-3 flex-wrap">
                  <Link href="/contact" className="inline-flex items-center justify-center px-4 py-2 bg-accent-500 hover:bg-accent-600 text-neutral-900 font-bold text-sm lg:text-base rounded-lg transition-all duration-300 shadow-sm hover:shadow-md hover:scale-105">
                    Get Specs
                  </Link>
                  <Link href="/solutions" className="inline-flex items-center justify-center px-4 py-2 text-primary-500 hover:text-primary-600 font-semibold text-sm lg:text-base transition-colors">
                    View Solutions →
                  </Link>
                </div>
              </div>
            )})}
          </div>
        </div>
      </section>

      {/* Industry Applications - Very Light Gray */}
      <section className="w-full bg-gradient-to-br from-neutral-50/20 via-white to-neutral-50/30 py-12 lg:py-16 xl:py-20 border-y border-neutral-200/20">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="text-center mb-8 lg:mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 text-neutral-900">
              Industry-Specific Applications
            </h2>
            <p className="text-base lg:text-lg xl:text-xl text-neutral-600 max-w-4xl mx-auto">
              Proven solutions deployed in mission-critical facilities worldwide
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {[
              {
                industry: 'Healthcare & Life Sciences',
                icon: Building2,
                challenges: [
                  'Operating room pressurization (ASHRAE 170)',
                  'Cleanroom ISO classification maintenance',
                  'Pharmacy and compounding room monitoring',
                  'Patient comfort and infection control'
                ],
                outcomes: '99.9% uptime in critical care environments'
              },
              {
                industry: 'Data Centers',
                icon: Server,
                challenges: [
                  'Hot/cold aisle temperature monitoring',
                  'Humidity control for static prevention',
                  'Airflow verification and optimization',
                  'PUE improvement through precise control'
                ],
                outcomes: 'Average 15% reduction in cooling costs'
              },
              {
                industry: 'Commercial Real Estate',
                icon: Building,
                challenges: [
                  'Multi-tenant comfort control',
                  'Energy management and LEED certification',
                  'Indoor air quality for occupant health',
                  'Predictive maintenance integration'
                ],
                outcomes: 'LEED Platinum certification support'
              },
              {
                industry: 'Manufacturing & Industrial',
                icon: Factory,
                challenges: [
                  'Process control environment stability',
                  'Clean manufacturing compliance',
                  'Energy-intensive system optimization',
                  'Integration with existing SCADA/BMS'
                ],
                outcomes: 'ISO 14644 cleanroom compliance'
              }
            ].map((app) => {
              const IconComponent = app.icon;
              return (
              <div key={app.industry} className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 lg:p-8 xl:p-10 border border-neutral-200 hover:border-primary-500">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 lg:w-16 lg:h-16 bg-primary-500 rounded-xl flex items-center justify-center shrink-0">
                    <IconComponent className="w-7 h-7 lg:w-9 lg:h-9 text-white" strokeWidth={2} />
                  </div>
                  <h3 className="font-bold text-xl lg:text-2xl xl:text-3xl text-neutral-900">{app.industry}</h3>
                </div>
                
                <div className="mb-6">
                  <h4 className="font-semibold text-xs lg:text-sm text-neutral-700 mb-3 uppercase tracking-wide">Critical Requirements:</h4>
                  <ul className="space-y-2">
                    {app.challenges.map((challenge) => (
                      <li key={challenge} className="text-sm lg:text-base text-neutral-600 flex items-start">
                        <span className="text-primary-500 mr-2 mt-0.5">•</span>
                        <span>{challenge}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-primary-50 p-4 rounded-lg mb-6 border border-primary-100">
                  <p className="text-sm lg:text-base font-semibold text-primary-600">
                    <span className="text-neutral-700">Proven Results: </span>{app.outcomes}
                  </p>
                </div>
                
                <div className="flex gap-3 flex-wrap">
                  <Link href="/contact" className="inline-flex items-center justify-center px-5 py-2.5 bg-accent-500 hover:bg-accent-600 text-neutral-900 font-bold text-sm lg:text-base rounded-lg transition-all duration-300 shadow-sm hover:shadow-md hover:scale-105">
                    Request Consultation
                  </Link>
                  <Link href={`/solutions/${app.industry.toLowerCase().replace(/\s+/g, '-')}`} className="inline-flex items-center justify-center px-5 py-2.5 text-primary-500 hover:text-primary-600 font-semibold text-sm lg:text-base transition-colors">
                    View Case Studies →
                  </Link>
                </div>
              </div>
            )})}
          </div>
        </div>
      </section>

      {/* Technical Differentiators - White */}
      <section className="w-full bg-white py-12 lg:py-16 xl:py-20">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="text-center mb-8 lg:mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 text-neutral-900">
              Engineering Excellence Since 1993
            </h2>
            <p className="text-base lg:text-lg xl:text-xl text-neutral-600 max-w-4xl mx-auto">
              What sets BAPI apart in building automation
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {[
              {
                icon: Target,
                title: 'Precision Instrumentation',
                desc: 'Every sensor is individually calibrated and tested to NIST-traceable standards',
                specs: [
                  '±0.2°C temperature accuracy across full range',
                  'Multi-point factory calibration included',
                  'Calibration certificates available',
                  '5-year warranty on all sensors'
                ]
              },
              {
                icon: Cable,
                title: 'Open Protocol Integration',
                desc: 'Native support for all major building automation protocols',
                specs: [
                  'BACnet B-ASC, MS/TP, and IP certified',
                  'Modbus RTU and TCP/IP',
                  'LonWorks and wireless options',
                  'RESTful API for IoT platforms'
                ]
              },
              {
                icon: HardHat,
                title: 'Application Engineering',
                desc: 'Dedicated support team with decades of HVAC and controls experience',
                specs: [
                  'Free pre-sales technical consulting',
                  'Custom sensor configuration',
                  'System design review and optimization',
                  'On-site commissioning support available'
                ]
              },
              {
                icon: Package,
                title: 'Supply Chain Reliability',
                desc: 'Manufactured in the USA with robust inventory and fast shipping',
                specs: [
                  'Same-day shipping on stock items',
                  'Made in USA (Minnesota facility)',
                  'ISO 9001:2015 certified manufacturing',
                  'Extensive distributor network'
                ]
              }
            ].map((diff) => {
              const IconComponent = diff.icon;
              return (
              <div key={diff.title} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6 lg:p-8 border border-neutral-200 hover:border-primary-500">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 lg:w-16 lg:h-16 bg-accent-500 rounded-xl flex items-center justify-center shrink-0 shadow-md">
                    <IconComponent className="w-7 h-7 lg:w-8 lg:h-8 text-neutral-900" strokeWidth={2.5} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg lg:text-xl xl:text-2xl text-neutral-900 mb-2">{diff.title}</h3>
                    <p className="text-sm lg:text-base text-neutral-600">{diff.desc}</p>
                  </div>
                </div>
                <ul className="space-y-2 mt-6 lg:ml-20">
                  {diff.specs.map((spec) => (
                    <li key={spec} className="text-sm lg:text-base text-neutral-700 flex items-start">
                      <Check className="w-4 h-4 text-primary-500 mr-2 mt-0.5 shrink-0" strokeWidth={2.5} />
                      <span>{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )})}
          </div>
          
          {/* Compliance & Certifications */}
          <div className="bg-primary-50 rounded-2xl p-6 lg:p-8 xl:p-10 border border-primary-100">
            <h3 className="font-bold text-lg lg:text-xl xl:text-2xl text-neutral-900 mb-6 lg:mb-8 text-center">Standards & Certifications</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-4 lg:gap-6">
              {[
                { label: 'BACnet B-ASC', desc: 'Certified Device', featured: true },
                { label: 'ISO 9001:2015', desc: 'Quality Management', featured: true },
                { label: 'ASHRAE 170', desc: 'Healthcare Compliant' },
                { label: 'UL Listed', desc: 'Product Safety' },
                { label: 'CE Marked', desc: 'European Conformity' },
                { label: 'RoHS Compliant', desc: 'Environmental' },
                { label: 'LEED Compatible', desc: 'Green Building' },
                { label: 'Made in USA', desc: 'Gays Mills, WI Facility' }
              ].map((cert) => (
                <div key={cert.label} className="text-center">
                  <div className={`rounded-lg p-5 lg:p-6 shadow-sm mb-2 hover:shadow-md transition-shadow ${
                    cert.featured 
                      ? 'bg-accent-50 border border-accent-200' 
                      : 'bg-white border border-primary-100'
                  }`}>
                    <p className={`font-bold text-sm lg:text-base ${
                      cert.featured ? 'text-accent-600' : 'text-primary-500'
                    }`}>{cert.label}</p>
                  </div>
                  <p className="text-xs lg:text-sm text-neutral-600">{cert.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Integration Partners & Ecosystem - Light Gradient */}
      <section className="w-full bg-gradient-to-br from-blue-50/20 via-white to-neutral-50/50 py-12 lg:py-16 xl:py-20 border-y border-primary-100/40">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="text-center mb-8 lg:mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 text-neutral-900">
              Trusted Integration Partners
            </h2>
            <p className="text-base lg:text-lg xl:text-xl text-neutral-600 max-w-4xl mx-auto">
              BAPI sensors integrate seamlessly with the world's leading building automation platforms
            </p>
          </div>
          
          {/* Partner Logos Grid */}
          <div className="mb-8 lg:mb-12">
            <div className="flex flex-wrap justify-center gap-4 lg:gap-6 items-center">
              {[
                "Siemens Building Technologies",
                "Honeywell Building Controls", 
                "Schneider Electric",
                "Johnson Controls",
                "Tridium/Niagara",
                "Automated Logic",
                "Carrier/Abound",
                "Distech Controls"
              ].map((partner) => (
                <div key={partner} className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-5 lg:p-6 flex items-center justify-center min-w-40 lg:min-w-[180px] min-h-[80px] lg:min-h-[90px] border border-neutral-200/60 hover:border-primary-400 group">
                  <span className="text-sm lg:text-base font-semibold text-neutral-500 group-hover:text-primary-600 transition-colors text-center">
                    {partner}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Distributor Network */}
          <div className="bg-white rounded-2xl shadow-md p-6 lg:p-8 xl:p-10 border border-neutral-200">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div>
                <h3 className="font-bold text-xl lg:text-2xl xl:text-3xl text-neutral-900 mb-4">Global Distributor Network</h3>
                <p className="text-base lg:text-lg text-neutral-600 mb-6">
                  Work with your preferred distributor or let us connect you with an authorized BAPI partner in your region.
                </p>
                <ul className="space-y-3 mb-6">
                  {[
                    'Same-day shipping on stock items',
                    'Local technical support and training',
                    'Volume pricing programs available',
                    'Custom sensor configuration services'
                  ].map((benefit) => (
                    <li key={benefit} className="flex items-center text-sm lg:text-base text-neutral-700">
                      <Check className="w-4 h-4 text-primary-500 mr-2 shrink-0" strokeWidth={2.5} />
                      {benefit}
                    </li>
                  ))}
                </ul>
                <Link href="/distributors" className="inline-block bg-accent-500 hover:bg-accent-600 text-neutral-900 px-6 py-3 rounded-lg font-bold transition-all duration-300 shadow-sm hover:shadow-md hover:scale-105">
                  Find a Distributor
                </Link>
              </div>
              <div className="bg-white rounded-xl p-8 border border-primary-200 shadow-sm">
                <h4 className="font-bold text-lg text-neutral-900 mb-4">Become a Partner</h4>
                <p className="text-sm text-neutral-700 mb-4">
                  Join our network of authorized distributors and system integrators.
                </p>
                <ul className="space-y-2 text-sm text-neutral-600 mb-6">
                  <li>• Technical training and certification</li>
                  <li>• Marketing and sales support</li>
                  <li>• Competitive pricing tiers</li>
                  <li>• Priority access to new products</li>
                </ul>
                <Link href="/partner-program" className="text-primary-500 hover:text-primary-600 font-semibold hover:underline transition-colors">
                  Learn About Partnership →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Resources & Support - White */}
      <section className="w-full bg-white py-12 lg:py-16 xl:py-20">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="text-center mb-8 lg:mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 text-neutral-900">
              Engineering Resources
            </h2>
            <p className="text-base lg:text-lg xl:text-xl text-neutral-600 max-w-4xl mx-auto">
              Technical documentation, tools, and support to accelerate your project
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8 mb-8 lg:mb-12">
            {[
              {
                icon: FileText,
                title: 'Technical Documentation',
                desc: 'Datasheets, installation guides, and protocol implementation documents',
                links: [
                  { label: 'Product Datasheets', href: '/resources/datasheets' },
                  { label: 'Installation Manuals', href: '/resources/manuals' },
                  { label: 'BACnet PICS', href: '/resources/bacnet' }
                ]
              },
              {
                icon: Cog,
                title: 'Design Tools',
                desc: 'Software utilities, CAD files, and configuration tools for system designers',
                links: [
                  { label: 'Sensor Selection Tool', href: '/tools/selector' },
                  { label: 'CAD/Revit Downloads', href: '/resources/cad' },
                  { label: 'Configuration Software', href: '/tools/config' }
                ]
              },
              {
                icon: GraduationCap,
                title: 'Training & Education',
                desc: 'Webinars, white papers, and certification programs for professionals',
                links: [
                  { label: 'Upcoming Webinars', href: '/training/webinars' },
                  { label: 'Technical White Papers', href: '/resources/whitepapers' },
                  { label: 'Certification Program', href: '/training/certification' }
                ]
              },
              {
                icon: MessageSquare,
                title: 'Technical Support',
                desc: 'Expert application engineers ready to assist with your project',
                links: [
                  { label: 'Contact Support Team', href: '/support' },
                  { label: 'Submit Support Ticket', href: '/support/ticket' },
                  { label: 'Knowledge Base', href: '/support/kb' }
                ]
              },
              {
                icon: BarChart3,
                title: 'Case Studies',
                desc: 'Real-world implementations and performance data from deployed systems',
                links: [
                  { label: 'Healthcare Projects', href: '/case-studies/healthcare' },
                  { label: 'Data Center Deployments', href: '/case-studies/datacenters' },
                  { label: 'Energy Savings ROI', href: '/case-studies/roi' }
                ]
              },
              {
                icon: RefreshCw,
                title: 'Product Updates',
                desc: 'Latest product releases, firmware updates, and feature announcements',
                links: [
                  { label: 'New Product Releases', href: '/news/products' },
                  { label: 'Firmware Downloads', href: '/resources/firmware' },
                  { label: 'Release Notes', href: '/resources/release-notes' }
                ]
              }
            ].map((resource) => {
              const IconComponent = resource.icon;
              return (
              <div key={resource.title} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6 lg:p-8 border border-neutral-200 hover:border-primary-500">
                <div className="w-12 h-12 lg:w-14 lg:h-14 bg-primary-500 rounded-lg flex items-center justify-center mb-4 shadow-sm">
                  <IconComponent className="w-6 h-6 lg:w-7 lg:h-7 text-white" strokeWidth={2} />
                </div>
                <h3 className="font-bold text-base lg:text-lg xl:text-xl text-neutral-900 mb-2">{resource.title}</h3>
                <p className="text-sm lg:text-base text-neutral-600 mb-4">{resource.desc}</p>
                <ul className="space-y-2">
                  {resource.links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className="text-sm lg:text-base text-primary-500 hover:text-primary-600 hover:underline transition-colors">
                        {link.label} →
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )})}
          </div>
          
          {/* Featured Resource Banner */}
          <div className="bg-primary-500 rounded-2xl p-6 lg:p-8 xl:p-10 text-white shadow-lg">
            <div className="max-w-5xl mx-auto text-center">
              <h3 className="font-bold text-xl lg:text-2xl xl:text-3xl mb-4">Download: Building Automation Sensor Selection Guide</h3>
              <p className="text-sm lg:text-base xl:text-lg text-primary-100 mb-6">
                A comprehensive 40-page guide covering sensor selection, application best practices, and integration strategies for modern building automation systems.
              </p>
              <Link href="/resources/sensor-guide" className="inline-block bg-accent-500 hover:bg-accent-600 text-neutral-900 px-6 lg:px-8 py-2.5 lg:py-3 rounded-lg font-bold transition-all duration-300 text-sm lg:text-base shadow-md hover:shadow-lg hover:scale-105">
                Download Free Guide (PDF)
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Banner - Blue Gradient */}
      <section className="w-full bg-primary-500 py-12 lg:py-16 xl:py-20 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,200,67,0.1)_0%,transparent_50%)]" />
        
        <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="text-center mb-8 lg:mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 lg:mb-6">
              Start Your Next Project with BAPI
            </h2>
            <p className="text-base lg:text-lg xl:text-xl text-primary-100 max-w-4xl mx-auto leading-relaxed">
              Our application engineers are ready to help you select the right solution
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4 lg:gap-6 mb-8 lg:mb-10">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 lg:p-6 border border-white/20">
              <div className="w-12 h-12 lg:w-14 lg:h-14 bg-white/20 rounded-lg flex items-center justify-center mb-3">
                <Phone className="w-6 h-6 lg:w-7 lg:h-7 text-white" strokeWidth={2} />
              </div>
              <h3 className="font-bold text-base lg:text-lg xl:text-xl text-white mb-2">Talk to an Engineer</h3>
              <p className="text-primary-100 text-sm lg:text-base mb-4">Get expert guidance on sensor selection and system design</p>
              <Link href="/contact" className="text-white hover:text-accent-400 font-semibold text-sm lg:text-base hover:underline transition-colors">
                Schedule Consultation →
              </Link>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 lg:p-6 border border-white/20">
              <div className="w-12 h-12 lg:w-14 lg:h-14 bg-white/20 rounded-lg flex items-center justify-center mb-3">
                <ClipboardList className="w-6 h-6 lg:w-7 lg:h-7 text-white" strokeWidth={2} />
              </div>
              <h3 className="font-bold text-base lg:text-lg xl:text-xl text-white mb-2">Request a Quote</h3>
              <p className="text-primary-100 text-sm lg:text-base mb-4">Submit your project specs for customized pricing and delivery</p>
              <Link href="/quote" className="text-white hover:text-accent-400 font-semibold text-sm lg:text-base hover:underline transition-colors">
                Get Quote →
              </Link>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 lg:p-6 border border-white/20">
              <div className="w-12 h-12 lg:w-14 lg:h-14 bg-white/20 rounded-lg flex items-center justify-center mb-3">
                <Package className="w-6 h-6 lg:w-7 lg:h-7 text-white" strokeWidth={2} />
              </div>
              <h3 className="font-bold text-base lg:text-lg xl:text-xl text-white mb-2">Order Through Distributor</h3>
              <p className="text-primary-100 text-sm lg:text-base mb-4">Work with your preferred distribution partner</p>
              <Link href="/distributors" className="text-white hover:text-accent-400 font-semibold text-sm lg:text-base hover:underline transition-colors">
                Find Distributor →
              </Link>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 justify-center">
            <Link href="/resources" className="inline-flex items-center justify-center px-6 lg:px-8 xl:px-10 py-3 lg:py-4 bg-accent-500 hover:bg-accent-600 text-neutral-900 rounded-xl font-bold text-base lg:text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              Download Technical Resources
            </Link>
            <Link href="/contact" className="inline-flex items-center justify-center px-6 lg:px-8 xl:px-10 py-3 lg:py-4 bg-white hover:bg-neutral-50 text-primary-500 rounded-xl font-bold text-base lg:text-lg shadow-lg hover:shadow-xl transition-all duration-300">
              Contact Application Engineering
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}