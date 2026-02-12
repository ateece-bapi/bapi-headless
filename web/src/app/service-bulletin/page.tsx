import { Metadata } from 'next';
import { AlertTriangle, FileText, Clock, Search } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Service Bulletins | BAPI',
  description:
    'View important service bulletins and technical updates for BAPI building automation products.',
};

export default function ServiceBulletinPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-700 via-primary-500 to-primary-700 py-16 text-white">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <AlertTriangle className="mx-auto mb-4 h-16 w-16" />
            <h1 className="mb-4 text-4xl font-bold sm:text-5xl">Service Bulletins</h1>
            <p className="mx-auto max-w-content text-xl text-primary-50">
              Important technical updates and service information for BAPI products
            </p>
          </div>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="bg-neutral-50 py-8">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="w-full flex-1 md:max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
                <input
                  type="search"
                  placeholder="Search bulletins..."
                  className="w-full rounded-lg border border-neutral-300 py-2 pl-10 pr-4 focus:border-primary-500 focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select className="rounded-lg border border-neutral-300 px-4 py-2 focus:ring-2 focus:ring-primary-500">
                <option value="">All Categories</option>
                <option value="sensors">Sensors</option>
                <option value="controllers">Controllers</option>
                <option value="wireless">Wireless Products</option>
                <option value="software">Software</option>
              </select>
              <select className="rounded-lg border border-neutral-300 px-4 py-2 focus:ring-2 focus:ring-primary-500">
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
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {/* Sample Bulletin */}
            <div className="duration-normal rounded-xl border-2 border-neutral-200 bg-white p-6 transition-all hover:border-primary-500">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-3">
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
                      IMPORTANT
                    </span>
                    <span className="text-sm text-neutral-500">SB-2026-001</span>
                    <span className="text-sm text-neutral-500">January 15, 2026</span>
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-neutral-900">
                    Firmware Update for Wireless Sensors
                  </h3>
                  <p className="mb-4 text-neutral-600">
                    Important firmware update available for all BA/W series wireless sensors. This
                    update improves battery life and communication reliability.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded bg-neutral-100 px-2 py-1 text-xs text-neutral-600">
                      Wireless Products
                    </span>
                    <span className="rounded bg-neutral-100 px-2 py-1 text-xs text-neutral-600">
                      Firmware
                    </span>
                  </div>
                </div>
                <button className="whitespace-nowrap text-sm font-semibold text-primary-500 hover:text-primary-600">
                  View Details →
                </button>
              </div>
            </div>

            {/* Add more sample bulletins */}
            <div className="duration-normal rounded-xl border-2 border-neutral-200 bg-white p-6 transition-all hover:border-primary-500">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-3">
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-800">
                      INFO
                    </span>
                    <span className="text-sm text-neutral-500">SB-2025-012</span>
                    <span className="text-sm text-neutral-500">December 20, 2025</span>
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-neutral-900">
                    Temperature Sensor Calibration Guidelines
                  </h3>
                  <p className="mb-4 text-neutral-600">
                    Updated calibration procedures for BA/10K series temperature sensors. Includes
                    new testing protocols and accuracy specifications.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded bg-neutral-100 px-2 py-1 text-xs text-neutral-600">
                      Temperature Sensors
                    </span>
                    <span className="rounded bg-neutral-100 px-2 py-1 text-xs text-neutral-600">
                      Calibration
                    </span>
                  </div>
                </div>
                <button className="whitespace-nowrap text-sm font-semibold text-primary-500 hover:text-primary-600">
                  View Details →
                </button>
              </div>
            </div>

            <div className="duration-normal rounded-xl border-2 border-neutral-200 bg-white p-6 transition-all hover:border-primary-500">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-3">
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-800">
                      UPDATE
                    </span>
                    <span className="text-sm text-neutral-500">SB-2025-011</span>
                    <span className="text-sm text-neutral-500">November 5, 2025</span>
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-neutral-900">
                    WAM Cloud Platform Enhancements
                  </h3>
                  <p className="mb-4 text-neutral-600">
                    New features and improvements to the WAM cloud monitoring platform, including
                    enhanced reporting and mobile app updates.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded bg-neutral-100 px-2 py-1 text-xs text-neutral-600">
                      Software
                    </span>
                    <span className="rounded bg-neutral-100 px-2 py-1 text-xs text-neutral-600">
                      WAM
                    </span>
                  </div>
                </div>
                <button className="whitespace-nowrap text-sm font-semibold text-primary-500 hover:text-primary-600">
                  View Details →
                </button>
              </div>
            </div>
          </div>

          {/* Pagination */}
          <div className="mt-8 flex justify-center gap-2">
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
              Next
            </button>
          </div>
        </div>
      </section>

      {/* Subscribe Section */}
      <section className="bg-neutral-50 py-12">
        <div className="mx-auto max-w-content px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-3 text-2xl font-bold text-neutral-900">
            Get Service Bulletin Notifications
          </h2>
          <p className="mb-6 text-neutral-600">
            Stay informed about important updates for your BAPI products
          </p>
          <div className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 rounded-lg border border-neutral-300 px-4 py-3 focus:ring-2 focus:ring-primary-500"
            />
            <button className="rounded-lg bg-accent-500 px-6 py-3 font-bold text-neutral-900 transition-colors hover:bg-accent-600">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
