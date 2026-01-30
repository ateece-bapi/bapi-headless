import { Metadata } from 'next';
import { Briefcase, MapPin, Users } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Careers at BAPI | Join Our Team',
  description: 'Explore career opportunities at BAPI. Join our team in Gays Mills, Wisconsin.',
};

export default function CareersPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="bg-gradient-to-r from-primary-700 via-primary-500 to-primary-700 text-white py-16">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Briefcase className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Careers at BAPI
            </h1>
            <p className="text-xl max-w-content mx-auto text-primary-50">
              Join our team and help build the future of building automation
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">
              Why Work at BAPI?
            </h2>
            <p className="text-lg text-neutral-600">
              Join a team that values innovation, quality, and customer success
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="text-center p-6 bg-neutral-50 rounded-xl">
              <Users className="w-10 h-10 text-primary-500 mx-auto mb-3" />
              <h3 className="font-bold text-neutral-900 mb-2">Great Team</h3>
              <p className="text-sm text-neutral-600">Work with talented professionals</p>
            </div>
            <div className="text-center p-6 bg-neutral-50 rounded-xl">
              <MapPin className="w-10 h-10 text-primary-500 mx-auto mb-3" />
              <h3 className="font-bold text-neutral-900 mb-2">Wisconsin Location</h3>
              <p className="text-sm text-neutral-600">Beautiful Gays Mills, WI</p>
            </div>
            <div className="text-center p-6 bg-neutral-50 rounded-xl">
              <Briefcase className="w-10 h-10 text-primary-500 mx-auto mb-3" />
              <h3 className="font-bold text-neutral-900 mb-2">Growth Opportunities</h3>
              <p className="text-sm text-neutral-600">Advance your career</p>
            </div>
          </div>

          <div className="text-center bg-neutral-50 p-8 rounded-xl">
            <h3 className="text-xl font-bold text-neutral-900 mb-4">
              Current Openings
            </h3>
            <p className="text-neutral-600 mb-6">
              Contact us to learn about current career opportunities
            </p>
            <a
              href="mailto:sales@bapihvac.com"
              className="inline-block bg-accent-500 hover:bg-accent-600 text-neutral-900 font-bold px-8 py-3 rounded-xl transition-colors"
            >
              Contact HR
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
