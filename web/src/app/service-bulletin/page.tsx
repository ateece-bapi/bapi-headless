import { Metadata } from 'next';
import { AlertTriangle, FileText, Clock, Search } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Service Bulletins | BAPI',
  description: 'View important service bulletins and technical updates for BAPI building automation products.',
};

export default function ServiceBulletinPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-700 via-primary-500 to-primary-700 text-white py-16">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <AlertTriangle className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Service Bulletins
            </h1>
            <p className="text-xl max-w-content mx-auto text-primary-50">
              Important technical updates and service information for BAPI products
            </p>
          </div>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="py-8 bg-neutral-50">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 w-full md:max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="search"
                  placeholder="Search bulletins..."
                  className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500">
                <option value="">All Categories</option>
                <option value="sensors">Sensors</option>
                <option value="controllers">Controllers</option>
                <option value="wireless">Wireless Products</option>
                <option value="software">Software</option>
              </select>
              <select className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500">
                <option value="">All Years</option>
                <option value="2026">2026</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Bulletins List */}
      <section className="py-16">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {/* Sample Bulletin */}
            <div className="bg-white border-2 border-neutral-200 rounded-xl p-6 hover:border-primary-500 transition-all duration-normal">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full">
                      IMPORTANT
                    </span>
                    <span className="text-sm text-neutral-500">SB-2026-001</span>
                    <span className="text-sm text-neutral-500">January 15, 2026</span>
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900 mb-2">
                    Firmware Update for Wireless Sensors
                  </h3>
                  <p className="text-neutral-600 mb-4">
                    Important firmware update available for all BA/W series wireless sensors. 
                    This update improves battery life and communication reliability.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs bg-neutral-100 text-neutral-600 px-2 py-1 rounded">
                      Wireless Products
                    </span>
                    <span className="text-xs bg-neutral-100 text-neutral-600 px-2 py-1 rounded">
                      Firmware
                    </span>
                  </div>
                </div>
                <button className="text-primary-500 hover:text-primary-600 font-semibold text-sm whitespace-nowrap">
                  View Details →
                </button>
              </div>
            </div>

            {/* Add more sample bulletins */}
            <div className="bg-white border-2 border-neutral-200 rounded-xl p-6 hover:border-primary-500 transition-all duration-normal">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">
                      INFO
                    </span>
                    <span className="text-sm text-neutral-500">SB-2025-012</span>
                    <span className="text-sm text-neutral-500">December 20, 2025</span>
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900 mb-2">
                    Temperature Sensor Calibration Guidelines
                  </h3>
                  <p className="text-neutral-600 mb-4">
                    Updated calibration procedures for BA/10K series temperature sensors. 
                    Includes new testing protocols and accuracy specifications.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs bg-neutral-100 text-neutral-600 px-2 py-1 rounded">
                      Temperature Sensors
                    </span>
                    <span className="text-xs bg-neutral-100 text-neutral-600 px-2 py-1 rounded">
                      Calibration
                    </span>
                  </div>
                </div>
                <button className="text-primary-500 hover:text-primary-600 font-semibold text-sm whitespace-nowrap">
                  View Details →
                </button>
              </div>
            </div>

            <div className="bg-white border-2 border-neutral-200 rounded-xl p-6 hover:border-primary-500 transition-all duration-normal">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full">
                      UPDATE
                    </span>
                    <span className="text-sm text-neutral-500">SB-2025-011</span>
                    <span className="text-sm text-neutral-500">November 5, 2025</span>
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900 mb-2">
                    WAM Cloud Platform Enhancements
                  </h3>
                  <p className="text-neutral-600 mb-4">
                    New features and improvements to the WAM cloud monitoring platform, 
                    including enhanced reporting and mobile app updates.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs bg-neutral-100 text-neutral-600 px-2 py-1 rounded">
                      Software
                    </span>
                    <span className="text-xs bg-neutral-100 text-neutral-600 px-2 py-1 rounded">
                      WAM
                    </span>
                  </div>
                </div>
                <button className="text-primary-500 hover:text-primary-600 font-semibold text-sm whitespace-nowrap">
                  View Details →
                </button>
              </div>
            </div>
          </div>

          {/* Pagination */}
          <div className="mt-8 flex justify-center gap-2">
            <button className="px-4 py-2 border-2 border-neutral-300 rounded-lg hover:border-primary-500 transition-colors">
              Previous
            </button>
            <button className="px-4 py-2 bg-primary-500 text-white rounded-lg">
              1
            </button>
            <button className="px-4 py-2 border-2 border-neutral-300 rounded-lg hover:border-primary-500 transition-colors">
              2
            </button>
            <button className="px-4 py-2 border-2 border-neutral-300 rounded-lg hover:border-primary-500 transition-colors">
              3
            </button>
            <button className="px-4 py-2 border-2 border-neutral-300 rounded-lg hover:border-primary-500 transition-colors">
              Next
            </button>
          </div>
        </div>
      </section>

      {/* Subscribe Section */}
      <section className="py-12 bg-neutral-50">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-neutral-900 mb-3">
            Get Service Bulletin Notifications
          </h2>
          <p className="text-neutral-600 mb-6">
            Stay informed about important updates for your BAPI products
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
            <button className="bg-accent-500 hover:bg-accent-600 text-neutral-900 font-bold px-6 py-3 rounded-lg transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
