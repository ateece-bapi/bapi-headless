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
      <section className="w-full bg-white py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-gray-900">
              Engineered Solutions for Critical Environments
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Precision measurement and control solutions designed for the most demanding building automation applications
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
              <div key={solution.title} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-8 border border-neutral-100 hover:border-[#0054b6] group">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#0054b6] to-[#1479bc] rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                    <IconComponent className="w-7 h-7 text-white" strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-gray-900 mb-2">{solution.title}</h3>
                  </div>
                </div>
                <p className="text-neutral-600 mb-4 text-sm leading-relaxed">{solution.desc}</p>
                <ul className="space-y-2 mb-6">
                  {solution.features.map((feature) => (
                    <li key={feature} className="text-sm text-gray-700 flex items-center">
                      <Check className="w-4 h-4 text-[#0054b6] mr-2 flex-shrink-0" strokeWidth={2.5} />
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="flex gap-3">
                  <Link href="/solutions" className="text-[#0054b6] hover:text-[#003d85] font-semibold text-sm hover:underline transition-colors">
                    View Solutions →
                  </Link>
                  <Link href="/contact" className="text-gray-600 hover:text-gray-900 font-semibold text-sm hover:underline transition-colors">
                    Get Specs
                  </Link>
                </div>
              </div>
            )})}
          </div>
        </div>
      </section>

      {/* Industry Applications - Light Blue Gradient */}
      <section className="w-full bg-gradient-to-br from-blue-50 via-white to-blue-50/30 py-16 sm:py-20 lg:py-24 border-y border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-gray-900">
              Industry-Specific Applications
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Proven solutions deployed in mission-critical facilities worldwide
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
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
              <div key={app.industry} className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-blue-100 hover:border-[#0054b6]">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#0054b6] to-[#1479bc] rounded-xl flex items-center justify-center flex-shrink-0">
                    <IconComponent className="w-9 h-9 text-white" strokeWidth={2} />
                  </div>
                  <h3 className="font-bold text-2xl text-gray-900">{app.industry}</h3>
                </div>
                
                <div className="mb-6">
                  <h4 className="font-semibold text-sm text-gray-700 mb-3 uppercase tracking-wide">Critical Requirements:</h4>
                  <ul className="space-y-2">
                    {app.challenges.map((challenge) => (
                      <li key={challenge} className="text-sm text-gray-600 flex items-start">
                        <span className="text-[#0054b6] mr-2 mt-0.5">•</span>
                        <span>{challenge}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-gradient-to-r from-blue-50 to-transparent p-4 rounded-lg mb-6">
                  <p className="text-sm font-semibold text-[#0054b6]">
                    <span className="text-gray-700">Proven Results: </span>{app.outcomes}
                  </p>
                </div>
                
                <div className="flex gap-4">
                  <Link href={`/solutions/${app.industry.toLowerCase().replace(/\s+/g, '-')}`} className="text-[#0054b6] hover:text-[#003d85] font-semibold text-sm hover:underline transition-colors">
                    View Case Studies →
                  </Link>
                  <Link href="/contact" className="text-gray-600 hover:text-gray-900 font-semibold text-sm hover:underline transition-colors">
                    Request Consultation
                  </Link>
                </div>
              </div>
            )})}
          </div>
        </div>
      </section>

      {/* Technical Differentiators - White */}
      <section className="w-full bg-white py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-gray-900">
              Engineering Excellence Since 1993
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
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
              <div key={diff.title} className="bg-gradient-to-br from-white to-neutral-50 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-8 border border-neutral-100 hover:border-[#0054b6]">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#ffc843] to-[#ffb700] rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <IconComponent className="w-8 h-8 text-gray-900" strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-gray-900 mb-2">{diff.title}</h3>
                    <p className="text-sm text-gray-600">{diff.desc}</p>
                  </div>
                </div>
                <ul className="space-y-2 mt-6 ml-20">
                  {diff.specs.map((spec) => (
                    <li key={spec} className="text-sm text-gray-700 flex items-start">
                      <Check className="w-4 h-4 text-[#0054b6] mr-2 mt-0.5 flex-shrink-0" strokeWidth={2.5} />
                      <span>{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )})}
          </div>
          
          {/* Compliance & Certifications */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-50/30 rounded-2xl p-8 border border-blue-100">
            <h3 className="font-bold text-xl text-gray-900 mb-6 text-center">Standards & Certifications</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: 'BACnet B-ASC', desc: 'Certified Device' },
                { label: 'ISO 9001:2015', desc: 'Quality Management' },
                { label: 'ASHRAE 170', desc: 'Healthcare Compliant' },
                { label: 'UL Listed', desc: 'Product Safety' },
                { label: 'CE Marked', desc: 'European Conformity' },
                { label: 'RoHS Compliant', desc: 'Environmental' },
                { label: 'LEED Compatible', desc: 'Green Building' },
                { label: 'Made in USA', desc: 'Minnesota Facility' }
              ].map((cert) => (
                <div key={cert.label} className="text-center">
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-blue-100 mb-2">
                    <p className="font-bold text-sm text-[#0054b6]">{cert.label}</p>
                  </div>
                  <p className="text-xs text-gray-600">{cert.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Integration Partners & Ecosystem - Light Yellow/Neutral Gradient */}
      <section className="w-full bg-gradient-to-br from-amber-50/30 via-white to-neutral-50 py-16 sm:py-20 lg:py-24 border-y border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-gray-900">
              Trusted Integration Partners
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              BAPI sensors integrate seamlessly with the world's leading building automation platforms
            </p>
          </div>
          
          {/* Partner Logos Grid */}
          <div className="mb-12">
            <div className="flex flex-wrap justify-center gap-6 items-center">
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
                <div key={partner} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 flex items-center justify-center min-w-[160px] min-h-[90px] border border-neutral-200 hover:border-[#0054b6] group">
                  <span className="text-base font-bold text-neutral-400 group-hover:text-[#0054b6] transition-colors text-center">
                    {partner}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Distributor Network */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-neutral-200">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="font-bold text-2xl text-gray-900 mb-4">Global Distributor Network</h3>
                <p className="text-gray-600 mb-6">
                  Work with your preferred distributor or let us connect you with an authorized BAPI partner in your region.
                </p>
                <ul className="space-y-3 mb-6">
                  {[
                    'Same-day shipping on stock items',
                    'Local technical support and training',
                    'Volume pricing programs available',
                    'Custom sensor configuration services'
                  ].map((benefit) => (
                    <li key={benefit} className="flex items-center text-sm text-gray-700">
                      <Check className="w-4 h-4 text-[#0054b6] mr-2 flex-shrink-0" strokeWidth={2.5} />
                      {benefit}
                    </li>
                  ))}
                </ul>
                <Link href="/distributors" className="inline-block bg-[#0054b6] hover:bg-[#003d85] text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                  Find a Distributor
                </Link>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-8">
                <h4 className="font-bold text-lg text-gray-900 mb-4">Become a Partner</h4>
                <p className="text-sm text-gray-700 mb-4">
                  Join our network of authorized distributors and system integrators.
                </p>
                <ul className="space-y-2 text-sm text-gray-600 mb-6">
                  <li>• Technical training and certification</li>
                  <li>• Marketing and sales support</li>
                  <li>• Competitive pricing tiers</li>
                  <li>• Priority access to new products</li>
                </ul>
                <Link href="/partner-program" className="text-[#0054b6] hover:text-[#003d85] font-semibold hover:underline transition-colors">
                  Learn About Partnership →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Resources & Support - White */}
      <section className="w-full bg-white py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-gray-900">
              Engineering Resources
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Technical documentation, tools, and support to accelerate your project
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
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
              <div key={resource.title} className="bg-gradient-to-br from-white to-neutral-50 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-neutral-100 hover:border-[#0054b6]">
                <div className="w-14 h-14 bg-gradient-to-br from-[#0054b6] to-[#1479bc] rounded-lg flex items-center justify-center mb-4">
                  <IconComponent className="w-7 h-7 text-white" strokeWidth={2} />
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">{resource.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{resource.desc}</p>
                <ul className="space-y-2">
                  {resource.links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className="text-sm text-[#0054b6] hover:text-[#003d85] hover:underline transition-colors">
                        {link.label} →
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )})}
          </div>
          
          {/* Featured Resource Banner */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white">
            <div className="max-w-4xl mx-auto text-center">
              <h3 className="font-bold text-2xl mb-4">Download: Building Automation Sensor Selection Guide</h3>
              <p className="text-blue-100 mb-6">
                A comprehensive 40-page guide covering sensor selection, application best practices, and integration strategies for modern building automation systems.
              </p>
              <Link href="/resources/sensor-guide" className="inline-block bg-white text-[#0054b6] px-8 py-3 rounded-lg font-bold hover:bg-blue-50 transition-colors">
                Download Free Guide (PDF)
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Banner - Blue Gradient */}
      <section className="w-full bg-gradient-to-br from-[#0054b6] via-[#1479bc] to-[#0054b6] py-16 sm:py-20 lg:py-24 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,200,67,0.1)_0%,transparent_50%)]" />
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Start Your Next Project with BAPI
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Our application engineers are ready to help you select the right solution
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-3">
                <Phone className="w-6 h-6 text-white" strokeWidth={2} />
              </div>
              <h3 className="font-bold text-lg text-white mb-2">Talk to an Engineer</h3>
              <p className="text-blue-100 text-sm mb-4">Get expert guidance on sensor selection and system design</p>
              <Link href="/contact" className="text-white hover:text-[#ffc843] font-semibold text-sm hover:underline transition-colors">
                Schedule Consultation →
              </Link>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-3">
                <ClipboardList className="w-6 h-6 text-white" strokeWidth={2} />
              </div>
              <h3 className="font-bold text-lg text-white mb-2">Request a Quote</h3>
              <p className="text-blue-100 text-sm mb-4">Submit your project specs for customized pricing and delivery</p>
              <Link href="/quote" className="text-white hover:text-[#ffc843] font-semibold text-sm hover:underline transition-colors">
                Get Quote →
              </Link>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-3">
                <Package className="w-6 h-6 text-white" strokeWidth={2} />
              </div>
              <h3 className="font-bold text-lg text-white mb-2">Order Through Distributor</h3>
              <p className="text-blue-100 text-sm mb-4">Work with your preferred distribution partner</p>
              <Link href="/distributors" className="text-white hover:text-[#ffc843] font-semibold text-sm hover:underline transition-colors">
                Find Distributor →
              </Link>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/contact" className="inline-flex items-center justify-center px-8 py-4 bg-white hover:bg-blue-50 text-[#0054b6] rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              Contact Application Engineering
            </Link>
            <Link href="/resources" className="inline-flex items-center justify-center px-8 py-4 bg-[#ffc843] hover:bg-[#ffb700] text-gray-900 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              Download Technical Resources
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}