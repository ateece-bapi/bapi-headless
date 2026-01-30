import { Metadata } from 'next';
import { Wrench, FileText, Download, Search } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Installation Guides | BAPI Resources',
  description: 'Comprehensive installation guides and documentation for BAPI products.',
};

export default function InstallationPage() {
  const guides = [
    {
      title: 'Temperature Sensor Installation',
      description: 'Complete installation guide for wall-mount and duct-mount temperature sensors',
      file: 'temp-sensor-install.pdf',
    },
    {
      title: 'Wireless Sensor Setup',
      description: 'Wireless sensor configuration and network setup instructions',
      file: 'wireless-setup.pdf',
    },
    {
      title: 'Air Quality Sensor Installation',
      description: 'CO₂, VOC, and particulate sensor installation procedures',
      file: 'air-quality-install.pdf',
    },
    {
      title: 'Pressure Sensor Mounting',
      description: 'Installation guidelines for pressure transducers and differential pressure sensors',
      file: 'pressure-sensor-install.pdf',
    },
  ];

  return (
    <main className="min-h-screen bg-white">
      <section className="bg-gradient-to-r from-primary-700 via-primary-500 to-primary-700 text-white py-16">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Wrench className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Installation Guides
            </h1>
            <p className="text-xl max-w-content mx-auto text-primary-50">
              Step-by-step installation instructions for all BAPI products
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search installation guides..."
                  className="w-full pl-12 pr-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {guides.map((guide) => (
              <div
                key={guide.file}
                className="bg-white border-2 border-neutral-200 rounded-xl p-6 hover:border-primary-500 transition-all"
              >
                <FileText className="w-10 h-10 text-primary-500 mb-4" />
                <h3 className="text-xl font-bold text-neutral-900 mb-2">
                  {guide.title}
                </h3>
                <p className="text-neutral-600 mb-4">{guide.description}</p>
                <button className="inline-flex items-center gap-2 text-primary-500 hover:text-primary-600 font-semibold">
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-neutral-50 py-12">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">
            Need Installation Support?
          </h2>
          <p className="text-neutral-600 mb-6">
            Our technical team is here to help with any installation questions
          </p>
          <a
            href="/support"
            className="inline-block bg-primary-500 hover:bg-primary-600 text-white font-bold px-8 py-3 rounded-xl transition-colors"
          >
            Contact Support
          </a>
        </div>
      </section>
    </main>
  );
}
