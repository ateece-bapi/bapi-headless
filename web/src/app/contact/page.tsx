import type { Metadata } from 'next';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
} from 'lucide-react';
import SalesTeamCard from '@/components/contact/SalesTeamCard';

export const metadata: Metadata = {
  title: 'Contact Us - Sales Team | BAPI',
  description:
    'Get in touch with BAPI\'s expert sales team. Find your regional representative for building automation sensors and controls.',
  keywords:
    'BAPI contact, sales team, building automation, sensor sales, technical support, regional representatives',
};

// Sales team data - Photos go in /public/images/team/
interface SalesRep {
  name: string;
  title: string;
  region: string;
  email: string;
  phone: string;
  photo: string;
  video?: string;
}

const salesTeam: SalesRep[] = [
  {
    name: 'Matt Holder',
    title: 'Business Development & Regional Sales',
    region: 'Sales',
    email: 'mholder@bapihvac.com',
    phone: '(800) 553-3027',
    photo: '/images/team/matt-holder.png',
  },
  {
    name: 'Steve Lindquist',
    title: 'Key Account Specialist',
    region: 'Sales',
    email: 'slindquist@bapihvac.com',
    phone: '(800) 553-3027',
    photo: '/images/team/steve-lindquist.png',
  },
  {
    name: 'Todd Vanden Heuvel',
    title: 'Key Account Specialist',
    region: 'Sales',
    email: 'tvandenheuvel@bapihvac.com',
    phone: '(800) 553-3027',
    photo: '/images/team/todd-vanden-heuvel.png',
  },
  {
    name: 'Mitchell Ogorman',
    title: 'Key Account Specialist',
    region: 'Sales',
    email: 'mogorman@bapihvac.com',
    phone: '(800) 553-3027',
    photo: '/images/team/mitchell-ogorman.png',
  },
  {
    name: 'Jennifer Sanford',
    title: 'Key Account Specialist',
    region: 'Sales',
    email: 'jsanford@bapihvac.com',
    phone: '(800) 553-3027',
    photo: '/images/team/jennifer-sanford.png',
  },
  {
    name: 'Andy Brooks',
    title: 'Regional Sales',
    region: 'Eastern United States',
    email: 'abrooks@bapihvac.com',
    phone: '(800) 553-3027',
    photo: '/images/team/andy-brooks.png',
  },
  {
    name: 'Murtaza Kalabhai',
    title: 'Business Development',
    region: 'International Sales',
    email: 'mkalabhai@bapihvac.com',
    phone: '(800) 553-3027',
    photo: '/images/team/murtaza-kalabhai.png',
  },
  {
    name: 'Mike Moss',
    title: 'Regional Sales',
    region: 'Pacific Region',
    email: 'mmoss@bapihvac.com',
    phone: '(800) 553-3027',
    photo: '/images/team/mike-moss.png',
  },
  {
    name: 'John Shields',
    title: 'Business Development, Regional Sales',
    region: 'Canada',
    email: 'jshields@bapihvac.com',
    phone: '(800) 553-3027',
    photo: '/images/team/john-shields.png',
  },
  {
    name: 'Jan Zurawski',
    title: 'Regional Sales, Development & Applications',
    region: 'International Sales',
    email: 'jzurawski@bapihvac.com',
    phone: '(800) 553-3027',
    photo: '/images/team/jan-zurawski.png',
    video: 'https://www.youtube.com/embed/O5jwFOFAO0A',
  },
  {
    name: 'Jon Greenwald',
    title: 'Distribution & Emerging Leader',
    region: 'Distribution',
    email: 'jgreenwald@bapihvac.com',
    phone: '(800) 553-3027',
    photo: '/images/team/jon-greenwald.png',
    video: 'https://www.youtube.com/embed/iBeUe3OGrk4',
  },
  {
    name: 'Brian Thaldorf',
    title: 'Distribution Account Specialist',
    region: 'Distribution',
    email: 'bthaldorf@bapihvac.com',
    phone: '(800) 553-3027',
    photo: '/images/team/brian-thaldorf.png',
  },
  {
    name: 'Jacob Melgosa',
    title: 'Wireless Asset Monitoring Sales',
    region: 'WAM Sales',
    email: 'jmelgosa@bapihvac.com',
    phone: '(800) 553-3027',
    photo: '/images/team/Jacob-Melgosa.webp',
    video: 'https://www.youtube.com/embed/riEBii0LG3s',
  },
  {
    name: 'Jonathan Hillebrand',
    title: 'Senior Product Manager',
    region: 'Technical Support',
    email: 'jhillebrand@bapihvac.com',
    phone: '(800) 553-3027',
    photo: '/images/team/jonathan-hillebrand.png',
  },
  {
    name: 'Andrew Leirmo',
    title: 'Product Manager',
    region: 'Technical Support',
    email: 'aleirmo@bapihvac.com',
    phone: '(800) 553-3027',
    photo: '/images/team/andrew-leirmo.png',
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-700 via-primary-600 to-primary-500 text-white py-12 lg:py-16">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl lg:text-4xl font-bold mb-3">Contact Us</h1>
            <p className="text-lg text-primary-50 max-w-2xl mx-auto">
              Connect with our expert sales team for building automation solutions, technical support, and product information.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form + Info Section */}
      <section className="py-12 lg:py-16 bg-neutral-50">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 lg:p-8">
                <h2 className="text-2xl font-bold text-neutral-900 mb-6">Send Us a Message</h2>
                <form className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1.5">
                        Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        className="w-full px-3.5 py-2.5 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-neutral-700 mb-1.5">
                        Company
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        className="w-full px-3.5 py-2.5 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                        placeholder="Company name"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1.5">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        className="w-full px-3.5 py-2.5 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-1.5">
                        Phone
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        className="w-full px-3.5 py-2.5 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-neutral-700 mb-1.5">
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      required
                      className="w-full px-3.5 py-2.5 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      placeholder="How can we help?"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-neutral-700 mb-1.5">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      required
                      className="w-full px-3.5 py-2.5 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none"
                      placeholder="Tell us about your project or question..."
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center gap-2 bg-accent-500 hover:bg-accent-600 text-neutral-900 px-6 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 hover:shadow-md"
                    >
                      <Send className="w-4 h-4" />
                      Send Message
                    </button>
                    <p className="text-xs text-neutral-500">
                      * Required fields
                    </p>
                  </div>
                </form>
              </div>
            </div>

            {/* Contact Information Sidebar */}
            <div className="space-y-4">
              {/* Phone */}
              <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-5">
                <div className="flex items-start gap-3">
                  <div className="bg-primary-50 p-2.5 rounded-lg">
                    <Phone className="w-5 h-5 text-primary-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-neutral-900 text-sm mb-1">Phone</h3>
                    <p className="text-neutral-500 text-xs mb-1">Toll Free</p>
                    <a
                      href="tel:+18005533027"
                      className="text-primary-600 hover:text-primary-700 font-medium text-sm transition-colors"
                    >
                      (800) 553-3027
                    </a>
                    <p className="text-neutral-500 text-xs mt-2">Fax: (715) 254-0720</p>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-5">
                <div className="flex items-start gap-3">
                  <div className="bg-primary-50 p-2.5 rounded-lg">
                    <Mail className="w-5 h-5 text-primary-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-neutral-900 text-sm mb-1">Email</h3>
                    <a
                      href="mailto:info@bapihvac.com"
                      className="text-primary-600 hover:text-primary-700 font-medium text-sm transition-colors break-all"
                    >
                      info@bapihvac.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Hours */}
              <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-5">
                <div className="flex items-start gap-3">
                  <div className="bg-primary-50 p-2.5 rounded-lg">
                    <Clock className="w-5 h-5 text-primary-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-neutral-900 text-sm mb-1">Business Hours</h3>
                    <p className="text-neutral-600 text-xs">Monday - Friday</p>
                    <p className="text-neutral-900 font-medium text-sm">8:00 AM - 5:00 PM CST</p>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-5">
                <div className="flex items-start gap-3">
                  <div className="bg-primary-50 p-2.5 rounded-lg">
                    <MapPin className="w-5 h-5 text-primary-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-neutral-900 text-sm mb-1">Address</h3>
                    <p className="text-neutral-600 text-xs leading-relaxed">
                      750 North Royal Avenue
                      <br />
                      Gays Mills, WI 54631
                      <br />
                      United States
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sales Team Section */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl lg:text-3xl font-bold text-neutral-900 mb-2">
              Meet Our Sales Team
            </h2>
            <p className="text-base text-neutral-600 max-w-2xl mx-auto">
              Our experienced team is ready to help you find the right building automation solutions for your project.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {salesTeam.map((member) => (
              <SalesTeamCard
                key={member.email}
                name={member.name}
                title={member.title}
                region={member.region}
                email={member.email}
                phone={member.phone}
                photo={member.photo}
                video={member.video}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-12 lg:py-16 bg-neutral-50">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">Visit Our Facility</h2>
            <p className="text-base text-neutral-600">
              Located in Gays Mills, Wisconsin - Made in USA since 1993
            </p>
          </div>

          {/* Google Maps Embed */}
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
            <div className="aspect-video bg-neutral-100 flex items-center justify-center">
              <div className="text-center p-8">
                <div className="bg-neutral-200 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MapPin className="w-7 h-7 text-neutral-500" />
                </div>
                <p className="text-neutral-700 font-medium text-sm mb-1">
                  750 North Royal Avenue
                </p>
                <p className="text-neutral-600 text-sm mb-4">
                  Gays Mills, WI 54631
                </p>
                <a
                  href="https://maps.google.com/?q=750+North+Royal+Avenue+Gays+Mills+WI+54631"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-primary-600 hover:text-primary-700 font-medium text-sm transition-colors"
                >
                  Open in Google Maps
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
