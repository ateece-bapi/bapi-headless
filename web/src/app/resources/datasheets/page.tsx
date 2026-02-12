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
      <section className="bg-gradient-to-r from-primary-700 via-primary-500 to-primary-700 py-16 text-white">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <FileText className="mx-auto mb-4 h-16 w-16" />
            <h1 className="mb-4 text-4xl font-bold sm:text-5xl">Product Datasheets</h1>
            <p className="mx-auto max-w-content text-xl text-primary-50">
              Detailed technical specifications for all BAPI products
            </p>
          </div>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="sticky top-0 z-10 border-b-2 border-neutral-200 bg-neutral-50 py-8">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
                <input
                  type="search"
                  placeholder="Search datasheets by model number or product name..."
                  className="w-full rounded-lg border border-neutral-300 py-3 pl-10 pr-4 focus:border-primary-500 focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select className="min-w-[150px] rounded-lg border border-neutral-300 px-4 py-3 focus:ring-2 focus:ring-primary-500">
                <option value="">All Categories</option>
                <option value="temperature">Temperature</option>
                <option value="humidity">Humidity</option>
                <option value="pressure">Pressure</option>
                <option value="air-quality">Air Quality</option>
                <option value="wireless">Wireless</option>
                <option value="controllers">Controllers</option>
              </select>
              <button className="rounded-lg bg-primary-500 px-4 py-3 font-semibold text-white transition-colors hover:bg-primary-600">
                <Filter className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Datasheets Grid */}
      <section className="py-16">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Sample Datasheet Cards */}
            {sampleDatasheets.map((item, index) => (
              <div
                key={index}
                className="rounded-xl border-2 border-neutral-200 bg-white p-6 transition-all hover:border-primary-500 hover:shadow-lg"
              >
                <div className="mb-4 flex items-start gap-4">
                  <div className="flex h-20 w-16 flex-shrink-0 items-center justify-center rounded bg-neutral-100">
                    <FileText className="h-8 w-8 text-primary-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 text-xs text-neutral-500">{item.model}</div>
                    <h3 className="mb-1 line-clamp-2 font-bold text-neutral-900">{item.name}</h3>
                    <div className="flex flex-wrap gap-1">
                      {item.categories.map((cat, idx) => (
                        <span
                          key={idx}
                          className="rounded bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="mb-4 line-clamp-2 text-sm text-neutral-600">{item.description}</p>
                <div className="mb-4 flex items-center justify-between text-xs text-neutral-500">
                  <span>{item.pages} pages</span>
                  <span>{item.size}</span>
                </div>
                <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent-500 px-4 py-2 font-bold text-neutral-900 transition-colors hover:bg-accent-600">
                  <Download className="h-4 w-4" />
                  Download PDF
                </button>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-12 flex justify-center gap-2">
            <button className="rounded-lg border-2 border-neutral-300 px-4 py-2 transition-colors hover:border-primary-500">
              Previous
            </button>
            <button className="rounded-lg bg-primary-500 px-4 py-2 text-white">1</button>
            <button className="rounded-lg border-2 border-neutral-300 px-4 py-2 transition-colors hover:border-primary-500">
              2
            </button>
            <button className="rounded-lg border-2 border-neutral-300 px-4 py-2 transition-colors hover:border-primary-500">
              3
            </button>
            <button className="rounded-lg border-2 border-neutral-300 px-4 py-2 transition-colors hover:border-primary-500">
              ...
            </button>
            <button className="rounded-lg border-2 border-neutral-300 px-4 py-2 transition-colors hover:border-primary-500">
              15
            </button>
            <button className="rounded-lg border-2 border-neutral-300 px-4 py-2 transition-colors hover:border-primary-500">
              Next
            </button>
          </div>
        </div>
      </section>

      {/* Bulk Download */}
      <section className="bg-neutral-50 py-12">
        <div className="mx-auto max-w-content px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-3 text-2xl font-bold text-neutral-900">Need Multiple Datasheets?</h2>
          <p className="mb-6 text-neutral-600">
            Download our complete datasheet package with all product specifications
          </p>
          <button className="inline-flex items-center gap-2 rounded-xl bg-primary-500 px-8 py-3 font-bold text-white transition-colors hover:bg-primary-600">
            <Download className="h-5 w-5" />
            Download All Datasheets (ZIP)
          </button>
          <p className="mt-3 text-sm text-neutral-500">
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
