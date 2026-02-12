import { Metadata } from 'next';
import { Briefcase, MapPin, Users } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Careers at BAPI | Join Our Team',
  description: 'Explore career opportunities at BAPI. Join our team in Gays Mills, Wisconsin.',
};

export default function CareersPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="bg-gradient-to-r from-primary-700 via-primary-500 to-primary-700 py-16 text-white">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Briefcase className="mx-auto mb-4 h-16 w-16" />
            <h1 className="mb-4 text-4xl font-bold sm:text-5xl">Careers at BAPI</h1>
            <p className="mx-auto max-w-content text-xl text-primary-50">
              Join our team and help build the future of building automation
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-neutral-900">Why Work at BAPI?</h2>
            <p className="text-lg text-neutral-600">
              Join a team that values innovation, quality, and customer success
            </p>
          </div>

          <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-xl bg-neutral-50 p-6 text-center">
              <Users className="mx-auto mb-3 h-10 w-10 text-primary-500" />
              <h3 className="mb-2 font-bold text-neutral-900">Great Team</h3>
              <p className="text-sm text-neutral-600">Work with talented professionals</p>
            </div>
            <div className="rounded-xl bg-neutral-50 p-6 text-center">
              <MapPin className="mx-auto mb-3 h-10 w-10 text-primary-500" />
              <h3 className="mb-2 font-bold text-neutral-900">Wisconsin Location</h3>
              <p className="text-sm text-neutral-600">Beautiful Gays Mills, WI</p>
            </div>
            <div className="rounded-xl bg-neutral-50 p-6 text-center">
              <Briefcase className="mx-auto mb-3 h-10 w-10 text-primary-500" />
              <h3 className="mb-2 font-bold text-neutral-900">Growth Opportunities</h3>
              <p className="text-sm text-neutral-600">Advance your career</p>
            </div>
          </div>

          <div className="rounded-xl bg-neutral-50 p-8 text-center">
            <h3 className="mb-4 text-xl font-bold text-neutral-900">Current Openings</h3>
            <p className="mb-6 text-neutral-600">
              Contact us to learn about current career opportunities
            </p>
            <a
              href="mailto:sales@bapihvac.com"
              className="inline-block rounded-xl bg-accent-500 px-8 py-3 font-bold text-neutral-900 transition-colors hover:bg-accent-600"
            >
              Contact HR
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
