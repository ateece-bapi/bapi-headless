'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Phone, Mail, Globe, MapPin, Search } from 'lucide-react';

export default function WhereToBuyPage() {
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Distributor data
  interface Distributor {
    id: string;
    name: string;
    tier: 'platinum' | 'gold' | 'associate';
    logo: string;
    region: 'usa' | 'europe' | 'international';
    location: string;
    website: string;
    phone?: string;
    email?: string;
    specialties?: string[];
    description?: string;
  }

  const distributors: Distributor[] = [
    // USA Distributors - Platinum Tier
    {
      id: 'kele',
      name: 'Kele',
      tier: 'platinum',
      logo: '/images/distributors/kele.png',
      region: 'usa',
      location: 'National',
      website: 'https://www.kele.com',
      phone: '1-800-557-5222',
      specialties: ['Building Automation', 'HVAC Controls'],
      description: 'Leading distributor of building automation and control solutions',
    },
    // Gold Tier
    {
      id: 'zigt',
      name: 'Zot Supply',
      tier: 'gold',
      logo: '/images/distributors/zot.png',
      region: 'usa',
      location: 'National',
      website: 'https://zotsupply.com/',
      phone: '1-855-442-4650',
      specialties: ['Test Equipment', 'Calibration'],
    },
    {
      id: 'building-controls-solutions',
      name: 'Building Controls & Solutions',
      tier: 'gold',
      logo: '/images/distributors/building-controls-solutions.png',
      region: 'usa',
      location: 'National',
      website: 'https://www.building-controls.com/',
      phone: '1-224-595-0000',
      specialties: ['Building Controls', 'Automation'],
    },
    {
      id: 'cochrane',
      name: 'Cochrane Supply & Engineering',
      tier: 'gold',
      logo: '/images/distributors/cochrine-supply.png',
      region: 'usa',
      location: 'Michigan, Ohio, Kentucky, Indiana',
      website: 'https://www.cochranesupply.com',
      phone: '1-855-422-4656',
      specialties: ['Building Controls', 'Engineering'],
    },
    // Associate Tier
    {
      id: 'stromquist',
      name: 'Stromquist & Company',
      tier: 'associate',
      logo: '/images/distributors/stromquist-logo.png',
      region: 'usa',
      location: 'Georgia, Florida',
      website: 'https://www.stromquist.com',
      phone: '1-800-285-3471',
      specialties: ['Compressed Air', 'Sensing'],
    },
    {
      id: 'broudy',
      name: 'Broudy Precision',
      tier: 'associate',
      logo: '/images/distributors/broudy.png',
      region: 'usa',
      location: 'Pennsylvania, New Jersey, North Carolina, South Carolina, Virginia',
      website: 'https://www.broudyprecision.com/',
      phone: '1-800-635-7200',
      specialties: ['Precision Controls'],
    },
    {
      id: 'bcci',
      name: 'Building Controls Construction Inc.',
      tier: 'associate',
      logo: '/images/distributors/bcci.png',
      region: 'usa',
      location: 'National',
      website: 'http://www.controlsconnection.com/',
      phone: '1-770-296-9803',
      specialties: ['Building Controls', 'Construction'],
    },
    {
      id: 'neuco',
      name: 'Neuco',
      tier: 'associate',
      logo: '/images/distributors/neuco.jpg',
      region: 'usa',
      location: 'National',
      website: 'https://www.neuco.com',
      phone: '1-800-353-7394',
      specialties: ['Building Controls'],
    },
    {
      id: 'midwest-supply',
      name: 'Midwest Supply',
      tier: 'associate',
      logo: '/images/distributors/midwest-supply.webp',
      region: 'usa',
      location: 'National',
      website: 'https://midwestsupplyus.com/',
      phone: '1-224-638-0718',
      specialties: ['HVAC Supplies'],
    },
    {
      id: 'controls-central',
      name: 'Controls Central',
      tier: 'associate',
      logo: '/images/distributors/controls-central.png',
      region: 'usa',
      location: 'National',
      website: 'https://controlscentral.com/',
      phone: '1-877-482-2736',
      specialties: ['HVAC Controls'],
    },
    {
      id: 'combustion-depot',
      name: 'Combustion Depot',
      tier: 'associate',
      logo: '/images/distributors/combustion-depot.png',
      region: 'usa',
      location: 'National',
      website: 'https://www.combustiondepot.com',
      phone: '1-800-494-4890',
      specialties: ['Combustion Controls'],
    },
    {
      id: 'galco',
      name: 'Galco Industrial Electronics',
      tier: 'associate',
      logo: '/images/distributors/galco.png',
      region: 'usa',
      location: 'National',
      website: 'https://www.galco.com',
      phone: '1-800-337-4016',
      specialties: ['Industrial Electronics'],
    },
    {
      id: 'industrial-stores',
      name: 'Industrial Stores',
      tier: 'associate',
      logo: '/images/distributors/industrial-stores.png',
      region: 'usa',
      location: 'National',
      website: 'https://www.industrialstores.com',
      phone: '1-866-494-4890',
      specialties: ['Industrial Supplies'],
    },
    {
      id: 'dbm-controls',
      name: 'DBM Controls',
      tier: 'associate',
      logo: '/images/distributors/dbm-controls.png',
      region: 'usa',
      location: 'New York',
      website: 'https://dbmbuffalo.com/',
      phone: '1-607-722-1102',
      specialties: ['Building Controls'],
    },
    {
      id: 'radwell',
      name: 'Radwell International',
      tier: 'associate',
      logo: '/images/distributors/radwell.png',
      region: 'usa',
      location: 'National',
      website: 'https://www.radwell.com',
      phone: '1-800-884-5500',
      specialties: ['Industrial Automation'],
    },
    {
      id: 'micontrols',
      name: 'MIControls',
      tier: 'associate',
      logo: '/images/distributors/micontrols.png',
      region: 'usa',
      location: 'Pacific Northwest',
      website: 'https://www.micontrols.com',
      phone: '1-800-577-0626',
      specialties: ['Building Automation'],
    },
    {
      id: 'temperature-control-systems',
      name: 'Temperature Control Systems',
      tier: 'associate',
      logo: '/images/distributors/temperature-control-systems-logo-1.png',
      region: 'usa',
      location: 'National',
      website: 'https://www.tcsystems.com',
      phone: '1-800-456-9278',
      specialties: ['Temperature Controls'],
    },
    {
      id: 'thermometer-central',
      name: 'Thermometer Central',
      tier: 'associate',
      logo: '/images/distributors/thermometer-central-logo.png',
      region: 'usa',
      location: 'National',
      website: 'https://www.thermometercentral.com',
      phone: '1-800-458-4886',
      specialties: ['Temperature Measurement'],
    },
    {
      id: 'wholesale-controls',
      name: 'Wholesale Controls International',
      tier: 'associate',
      logo: '/images/distributors/wholesale-controls-international-logo.png',
      region: 'usa',
      location: 'National',
      website: 'https://www.wholesalecontrols.com',
      phone: '1-800-096-2426',
      specialties: ['Building Controls'],
    },
    {
      id: 'alps-controls',
      name: 'ALPS Controls',
      tier: 'associate',
      logo: '/images/distributors/alps-controls.png',
      region: 'usa',
      location: 'National',
      website: 'https://www.alpscontrols.com',
      phone: '1-847-464-1720',
      specialties: ['Building Controls'],
    },
    {
      id: 'rsd',
      name: 'RSD (Refrigeration Supplies Distributor)',
      tier: 'associate',
      logo: '/images/distributors/rsd.png',
      region: 'usa',
      location: 'Western United States',
      website: 'https://www.rsd.net/refrigeration-supplies',
      phone: '1-800-773-5359',
      specialties: ['Refrigeration Supplies'],
    },
    // Europe Distributors
    {
      id: 'buschek',
      name: 'Buschek Lufttechnik GmbH',
      tier: 'associate',
      logo: '/images/distributors/buschek-lufttechnik.jpg',
      region: 'europe',
      location: 'Germany',
      website: 'https://www.buschek.de',
      phone: '+49 893181167',
      specialties: ['HVAC', 'Building Automation'],
    },
    {
      id: 'comhas',
      name: 'Comhas Srl',
      tier: 'associate',
      logo: '/images/distributors/Comhas.jpg',
      region: 'europe',
      location: 'Italy',
      website: 'https://www.comhas.it',
      phone: '+39 02 66594921',
      specialties: ['Building Automation'],
    },
    {
      id: 'delta-controls-poland',
      name: 'Delta Controls Sp.z.o.o.',
      tier: 'associate',
      logo: '/images/distributors/hvac4u-pl.png',
      region: 'europe',
      location: 'Poland',
      website: 'https://www.deltacontrols.pl',
      phone: '+48 12 626 02 20',
      specialties: ['Building Controls'],
    },
    {
      id: 'electroproject',
      name: 'Electroproject',
      tier: 'associate',
      logo: '/images/distributors/electroproject.png',
      region: 'europe',
      location: 'Netherlands, Belgium',
      website: 'https://www.electroproject.nl',
      phone: '+31(0)88-4549250',
      specialties: ['Building Automation'],
    },
    {
      id: 'elit',
      name: 'ELIT AS',
      tier: 'associate',
      logo: '/images/distributors/elit.png',
      region: 'europe',
      location: 'Norway, Sweden, Denmark',
      website: 'https://www.elit.no',
      phone: '+47 63 93 88 80',
      specialties: ['Building Controls'],
    },
    {
      id: 'heat-combustion',
      name: 'Heat & Combustion',
      tier: 'associate',
      logo: '/images/distributors/HeatandCombustion.webp',
      region: 'europe',
      location: 'United Kingdom',
      website: 'https://www.heatandcombustion.co.uk',
      phone: '029 2045 3345',
      specialties: ['Combustion Controls'],
    },
    {
      id: 'iwo-group',
      name: 'Iwo Group Ltd.',
      tier: 'associate',
      logo: '/images/distributors/iwo.png',
      region: 'europe',
      location: 'Czech Republic',
      website: 'https://www.iwogroup.cz',
      phone: '+420 602 568 254',
      specialties: ['Building Automation'],
    },
    {
      id: 'jn-automation',
      name: 'JN Automation',
      tier: 'associate',
      logo: '/images/distributors/jn-automation.jpg',
      region: 'europe',
      location: 'Germany',
      website: 'https://www.jn-automation.de',
      phone: '+49 2484-805563',
      specialties: ['Building Automation'],
    },
    {
      id: 'k-tehnologijas',
      name: 'K-Tehnologijas Ltd.',
      tier: 'associate',
      logo: '/images/distributors/k-tech.png',
      region: 'europe',
      location: 'Latvia',
      website: 'https://www.k-t.lv',
      phone: '+371 2 8686213',
      specialties: ['Building Controls'],
    },
    {
      id: 'merazet',
      name: 'Merazet S.A.',
      tier: 'associate',
      logo: '/images/distributors/merazet.png',
      region: 'europe',
      location: 'Poland',
      website: 'https://www.merazet.pl',
      phone: '+48 61 8494 000',
      specialties: ['Building Automation'],
    },
    {
      id: 'mru',
      name: 'MRU d.o.o.',
      tier: 'associate',
      logo: '/images/distributors/mru1.svg',
      region: 'europe',
      location: 'Slovenia, Croatia',
      website: 'https://www.mru.si',
      phone: '+386 590 22472',
      specialties: ['Building Controls'],
    },
    {
      id: 'msr-bayern',
      name: 'msr bayern GmbH',
      tier: 'associate',
      logo: '/images/distributors/msr-bayern.png',
      region: 'europe',
      location: 'Germany, Austria',
      website: 'https://www.msr-bayern.de',
      phone: '+49 (0)89 / 370 03 37 - 0',
      specialties: ['Measurement', 'Control Technology'],
    },
    {
      id: 'vedotec',
      name: 'Vedotec BV',
      tier: 'associate',
      logo: '/images/distributors/vedotec.jpg',
      region: 'europe',
      location: 'Netherlands, Belgium',
      website: 'https://www.vedotec.nl',
      phone: '+31 (0)88 833 84 00',
      specialties: ['Building Automation'],
    },
  ];

  // Filter distributors by region and search
  const filteredDistributors = distributors.filter((dist) => {
    const matchesRegion = selectedRegion === 'all' || dist.region === selectedRegion;
    const matchesSearch =
      searchQuery === '' ||
      dist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dist.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRegion && matchesSearch;
  });

  const regionCounts = {
    all: distributors.length,
    usa: distributors.filter((d) => d.region === 'usa').length,
    europe: distributors.filter((d) => d.region === 'europe').length,
    international: distributors.filter((d) => d.region === 'international').length,
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-700 via-primary-600 to-primary-500 text-white py-16 lg:py-20">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Where to Buy BAPI Products
            </h1>
            <p className="text-xl text-primary-50 mb-6">
              Connect with our trusted network of authorized distributors worldwide. 
              Get expert support, local inventory, and fast delivery for your building automation projects.
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-accent-500 rounded-full"></div>
                <span>50+ Authorized Distributors</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-accent-500 rounded-full"></div>
                <span>Global Coverage</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-accent-500 rounded-full"></div>
                <span>Same-Day Shipping Available</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search & Filter Section */}
      <section className="bg-white border-b border-neutral-200 sticky top-16 z-30 shadow-sm">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            {/* Search Bar */}
            <div className="w-full lg:w-96">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search by name or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                />
              </div>
            </div>

            {/* Region Filters */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedRegion('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedRegion === 'all'
                    ? 'bg-primary-500 text-white shadow-md'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                All Regions ({regionCounts.all})
              </button>
              <button
                onClick={() => setSelectedRegion('usa')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedRegion === 'usa'
                    ? 'bg-primary-500 text-white shadow-md'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                USA ({regionCounts.usa})
              </button>
              <button
                onClick={() => setSelectedRegion('europe')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedRegion === 'europe'
                    ? 'bg-primary-500 text-white shadow-md'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                Europe ({regionCounts.europe})
              </button>
              <button
                onClick={() => setSelectedRegion('international')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedRegion === 'international'
                    ? 'bg-primary-500 text-white shadow-md'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                International ({regionCounts.international})
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Distributors Grid */}
      <section className="py-12 lg:py-16">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
          {filteredDistributors.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-neutral-600">
                No distributors found matching your criteria.
              </p>
              <button
                onClick={() => {
                  setSelectedRegion('all');
                  setSearchQuery('');
                }}
                className="mt-4 text-primary-500 hover:text-primary-600 font-medium"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <p className="text-neutral-600">
                  Showing <span className="font-semibold text-neutral-900">{filteredDistributors.length}</span> authorized distributor{filteredDistributors.length !== 1 ? 's' : ''}
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDistributors.map((distributor) => (
                  <div
                    key={distributor.id}
                    className="group bg-white rounded-xl overflow-hidden shadow-md border-2 border-neutral-200 hover:shadow-2xl hover:border-primary-500 transition-all duration-300 hover:-translate-y-1"
                  >
                    {/* Tier Badge */}
                    <div className="relative">
                      {distributor.tier === 'platinum' && (
                        <div className="absolute top-3 right-3 bg-gradient-to-r from-accent-500 to-accent-600 text-neutral-900 px-3 py-1.5 rounded-full text-xs font-bold uppercase shadow-lg z-10">
                          Platinum Dealer
                        </div>
                      )}
                      {distributor.tier === 'gold' && (
                        <div className="absolute top-3 right-3 bg-gradient-to-r from-accent-400 to-accent-500 text-neutral-900 px-3 py-1.5 rounded-full text-xs font-bold uppercase shadow-lg z-10">
                          Gold Dealer
                        </div>
                      )}
                      
                      {/* Logo Section */}
                      <div className={`p-8 border-b border-neutral-200 flex items-center justify-center h-48 ${
                        distributor.logo.endsWith('.svg') ? 'bg-white' : 'bg-neutral-50'
                      }`}>
                        <div className="relative w-full h-full">
                          {distributor.logo.endsWith('.svg') ? (
                            // Use img tag for SVG files
                            <img
                              src={distributor.logo}
                              alt={`${distributor.name} logo`}
                              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            // Use Next.js Image for other formats
                            <Image
                              src={distributor.logo}
                              alt={`${distributor.name} logo`}
                              fill
                              className="object-contain group-hover:scale-105 transition-transform duration-500"
                            />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-5">
                      <h3 className="text-xl font-extrabold text-neutral-900 mb-3 leading-tight group-hover:text-primary-600 transition-colors duration-300">
                        {distributor.name}
                      </h3>

                      {/* Divider */}
                      <div className="h-px bg-gradient-to-r from-primary-500 via-accent-500 to-primary-500 mb-3 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>

                      <div className="flex items-center gap-2 text-neutral-700 mb-4">
                        <MapPin className="w-4 h-4 text-primary-500" />
                        <span className="text-sm font-medium">{distributor.location}</span>
                      </div>

                      {distributor.description && (
                        <p className="text-sm text-neutral-600 mb-4 line-clamp-2">
                          {distributor.description}
                        </p>
                      )}

                      {distributor.specialties && distributor.specialties.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {distributor.specialties.map((specialty) => (
                            <span
                              key={specialty}
                              className="text-xs px-3 py-1 bg-gradient-to-r from-primary-50 to-accent-50 text-primary-700 rounded-full font-bold border border-primary-200"
                            >
                              {specialty}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="space-y-2">
                        <a
                          href={distributor.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold rounded-lg transition-all duration-300 shadow-md hover:shadow-xl transform hover:scale-105"
                        >
                          <Globe className="w-4 h-4" />
                          Visit Website
                        </a>

                        <div className="grid grid-cols-2 gap-2">
                          {distributor.phone && (
                            <a
                              href={`tel:${distributor.phone}`}
                              className="flex items-center justify-center gap-2 px-3 py-2 bg-accent-500 hover:bg-accent-600 text-neutral-900 font-semibold rounded-lg transition-all duration-300 shadow-md hover:shadow-xl border-2 border-accent-600 transform hover:scale-105 text-sm"
                            >
                              <Phone className="w-4 h-4" />
                              Call
                            </a>
                          )}
                          {distributor.email && (
                            <a
                              href={`mailto:${distributor.email}`}
                              className="flex items-center justify-center gap-2 px-3 py-2 bg-white hover:bg-neutral-50 text-neutral-700 hover:text-primary-600 font-semibold rounded-lg transition-all duration-300 shadow-md hover:shadow-xl border-2 border-neutral-300 hover:border-primary-500 transform hover:scale-105 text-sm"
                            >
                              <Mail className="w-4 h-4" />
                              Email
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary-700 to-primary-600 text-white py-12 lg:py-16">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Interested in Becoming a Distributor?
          </h2>
          <p className="text-xl text-primary-50 mb-8 max-w-2xl mx-auto">
            Join our global network of authorized distributors and bring BAPI's innovative building automation solutions to your customers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="px-8 py-4 bg-accent-500 hover:bg-accent-600 text-neutral-900 font-bold rounded-xl transition-colors shadow-lg hover:shadow-xl"
            >
              Apply for Distribution
            </a>
            <a
              href="/contact"
              className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold rounded-xl transition-colors border-2 border-white/30"
            >
              Contact Sales Team
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
