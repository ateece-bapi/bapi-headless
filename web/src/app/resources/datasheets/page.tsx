import { Metadata } from 'next';
import { FileText, Download, Search, Filter } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Product Datasheets | BAPI',
  description: 'Download detailed technical datasheets for all BAPI building automation products.',
};

export default function DatasheetsPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-700 via-primary-500 to-primary-700 text-white py-16">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <FileText className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Product Datasheets
            </h1>
            <p className="text-xl max-w-content mx-auto text-primary-50">
              Detailed technical specifications for all BAPI products
            </p>
          </div>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="py-8 bg-neutral-50 sticky top-0 z-10 border-b-2 border-neutral-200">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="search"
                  placeholder="Search datasheets by model number or product name..."
                  className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select className="px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 min-w-[150px]">
                <option value="">All Categories</option>
                <option value="temperature">Temperature</option>
                <option value="humidity">Humidity</option>
                <option value="pressure">Pressure</option>
                <option value="air-quality">Air Quality</option>
                <option value="wireless">Wireless</option>
                <option value="controllers">Controllers</option>
              </select>
              <button className="px-4 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition-colors">
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Datasheets Grid */}
      <section className="py-16">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Sample Datasheet Cards */}
            {sampleDatasheets.map((item, index) => (
              <div key={index} className="bg-white border-2 border-neutral-200 rounded-xl p-6 hover:border-primary-500 hover:shadow-lg transition-all">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-20 bg-neutral-100 rounded flex items-center justify-center flex-shrink-0">
                    <FileText className="w-8 h-8 text-primary-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-neutral-500 mb-1">{item.model}</div>
                    <h3 className="font-bold text-neutral-900 mb-1 line-clamp-2">{item.name}</h3>
                    <div className="flex flex-wrap gap-1">
                      {item.categories.map((cat, idx) => (
                        <span key={idx} className="text-xs bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded">
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-neutral-600 mb-4 line-clamp-2">
                  {item.description}
                </p>
                <div className="flex items-center justify-between text-xs text-neutral-500 mb-4">
                  <span>{item.pages} pages</span>
                  <span>{item.size}</span>
                </div>
                <button className="w-full flex items-center justify-center gap-2 bg-accent-500 hover:bg-accent-600 text-neutral-900 font-bold px-4 py-2 rounded-lg transition-colors">
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-12 flex justify-center gap-2">
            <button className="px-4 py-2 border-2 border-neutral-300 rounded-lg hover:border-primary-500 transition-colors">
              Previous
            </button>
            <button className="px-4 py-2 bg-primary-500 text-white rounded-lg">1</button>
            <button className="px-4 py-2 border-2 border-neutral-300 rounded-lg hover:border-primary-500 transition-colors">2</button>
            <button className="px-4 py-2 border-2 border-neutral-300 rounded-lg hover:border-primary-500 transition-colors">3</button>
            <button className="px-4 py-2 border-2 border-neutral-300 rounded-lg hover:border-primary-500 transition-colors">...</button>
            <button className="px-4 py-2 border-2 border-neutral-300 rounded-lg hover:border-primary-500 transition-colors">15</button>
            <button className="px-4 py-2 border-2 border-neutral-300 rounded-lg hover:border-primary-500 transition-colors">
              Next
            </button>
          </div>
        </div>
      </section>

      {/* Bulk Download */}
      <section className="py-12 bg-neutral-50">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-neutral-900 mb-3">
            Need Multiple Datasheets?
          </h2>
          <p className="text-neutral-600 mb-6">
            Download our complete datasheet package with all product specifications
          </p>
          <button className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-bold px-8 py-3 rounded-xl transition-colors">
            <Download className="w-5 h-5" />
            Download All Datasheets (ZIP)
          </button>
          <p className="text-sm text-neutral-500 mt-3">
            Complete package • 125 MB • Updated January 2026
          </p>
        </div>
      </section>
    </main>
  );
}

const sampleDatasheets = [
  {
    model: 'BA/10K-2-O',
    name: 'Outdoor Temperature Sensor',
    description: '10K Type 2 thermistor for outdoor applications with weatherproof housing',
    categories: ['Temperature', 'Outdoor'],
    pages: 4,
    size: '1.2 MB',
  },
  {
    model: 'BA/RH-AS-R2',
    name: 'Humidity & Temperature Sensor',
    description: 'Room-mount humidity and temperature sensor with 2% RH accuracy',
    categories: ['Humidity', 'Temperature'],
    pages: 6,
    size: '1.8 MB',
  },
  {
    model: 'BA/W-R',
    name: 'Wireless Room Sensor',
    description: '900MHz wireless temperature sensor with 10-year battery life',
    categories: ['Wireless', 'Temperature'],
    pages: 8,
    size: '2.1 MB',
  },
  {
    model: 'BA/CO2-P',
    name: 'CO₂ Sensor',
    description: 'NDIR CO₂ sensor for demand control ventilation applications',
    categories: ['Air Quality', 'CO₂'],
    pages: 6,
    size: '1.5 MB',
  },
  {
    model: 'BA/DP-P',
    name: 'Differential Pressure Sensor',
    description: 'Pressure transducer for filter monitoring and building pressurization',
    categories: ['Pressure'],
    pages: 5,
    size: '1.3 MB',
  },
  {
    model: 'BA/1KT',
    name: '1000Ω RTD Temperature Sensor',
    description: 'Platinum RTD sensor with Class A accuracy',
    categories: ['Temperature', 'RTD'],
    pages: 4,
    size: '1.1 MB',
  },
];
