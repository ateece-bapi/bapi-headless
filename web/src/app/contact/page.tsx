'use client';

import { useState, useEffect } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  Globe,
  Building2,
  Wrench,
  Users,
  Award,
  HeadphonesIcon,
} from 'lucide-react';
import SalesTeamCard from '@/components/contact/SalesTeamCard';

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

// Organized by geographic regions
const northAmericaTeam: SalesRep[] = [
  {
    name: 'Matt Holder',
    title: 'Business Development & Regional Sales',
    region: 'North America',
    email: 'mholder@bapihvac.com',
    phone: '(800) 553-3027',
    photo: '/images/team/matt-holder.png',
  },
  {
    name: 'Steve Lindquist',
    title: 'Key Account Specialist',
    region: 'North America',
    email: 'slindquist@bapihvac.com',
    phone: '(800) 553-3027',
    photo: '/images/team/steve-lindquist.png',
  },
  {
    name: 'Todd Vanden Heuvel',
    title: 'Key Account Specialist',
    region: 'North America',
    email: 'tvandenheuvel@bapihvac.com',
    phone: '(800) 553-3027',
    photo: '/images/team/todd-vanden-heuvel.png',
  },
  {
    name: 'Mitchell Ogorman',
    title: 'Key Account Specialist',
    region: 'North America',
    email: 'mogorman@bapihvac.com',
    phone: '(800) 553-3027',
    photo: '/images/team/mitchell-ogorman.png',
  },
  {
    name: 'Jennifer Sanford',
    title: 'Key Account Specialist',
    region: 'North America',
    email: 'jsanford@bapihvac.com',
    phone: '(800) 553-3027',
    photo: '/images/team/jennifer-sanford.png',
  },
  {
    name: 'Jon Greenwald',
    title: 'Distribution & Emerging Leader',
    region: 'North America',
    email: 'jgreenwald@bapihvac.com',
    phone: '(800) 553-3027',
    photo: '/images/team/jon-greenwald.png',
    video: 'https://www.youtube.com/embed/iBeUe3OGrk4',
  },
  {
    name: 'Brian Thaldorf',
    title: 'Distribution Account Specialist',
    region: 'North America',
    email: 'bthaldorf@bapihvac.com',
    phone: '(800) 553-3027',
    photo: '/images/team/brian-thaldorf.png',
  },
  {
    name: 'Jacob Melgosa',
    title: 'Wireless Asset Monitoring Sales',
    region: 'North America',
    email: 'jmelgosa@bapihvac.com',
    phone: '(800) 553-3027',
    photo: '/images/team/Jacob-Melgosa.webp',
    video: 'https://www.youtube.com/embed/riEBii0LG3s',
  },
];

const ukTeam: SalesRep[] = [
  {
    name: 'Mike Moss',
    title: 'Regional Sales',
    region: 'United Kingdom',
    email: 'mmoss@bapihvac.com',
    phone: '(800) 553-3027',
    photo: '/images/team/mike-moss.png',
  },
];

const europeTeam: SalesRep[] = [
  {
    name: 'Jan Zurawski',
    title: 'Regional Sales, Development & Applications',
    region: 'Europe',
    email: 'jzurawski@bapihvac.com',
    phone: '(800) 553-3027',
    photo: '/images/team/jan-zurawski.png',
    video: 'https://www.youtube.com/embed/O5jwFOFAO0A',
  },
];

const middleEastTeam: SalesRep[] = [
  {
    name: 'Murtaza Kalabhai',
    title: 'Business Development',
    region: 'Middle East',
    email: 'mkalabhai@bapihvac.com',
    phone: '(800) 553-3027',
    photo: '/images/team/murtaza-kalabhai.png',
  },
];

const indiaTeam: SalesRep[] = [
  {
    name: 'Sharad',
    title: 'Regional Sales',
    region: 'India',
    email: 'sharad@bapihvac.com',
    phone: '(800) 553-3027',
    photo: '/images/team/placeholder.svg',
  },
  {
    name: 'Shyam',
    title: 'Regional Sales',
    region: 'India',
    email: 'shyam@bapihvac.com',
    phone: '(800) 553-3027',
    photo: '/images/team/placeholder.svg',
  },
];

const southAmericaTeam: SalesRep[] = [
  {
    name: 'John Shields',
    title: 'Business Development, Regional Sales',
    region: 'South America',
    email: 'jshields@bapihvac.com',
    phone: '(800) 553-3027',
    photo: '/images/team/john-shields.png',
  },
];

const africaTeam: SalesRep[] = [
  {
    name: 'John Shields',
    title: 'Business Development, Regional Sales',
    region: 'Africa',
    email: 'jshields@bapihvac.com',
    phone: '(800) 553-3027',
    photo: '/images/team/john-shields.png',
  },
];

const asiaTeam: SalesRep[] = [
  {
    name: 'Tim Wilder',
    title: 'Regional Sales',
    region: 'Asia',
    email: 'twilder@bapihvac.com',
    phone: '(800) 553-3027',
    photo: '/images/team/tim-wilder.png',
  },
];

const australiaTeam: SalesRep[] = [
  {
    name: 'Andy Brooks',
    title: 'Regional Sales',
    region: 'Australia & New Zealand',
    email: 'abrooks@bapihvac.com',
    phone: '(800) 553-3027',
    photo: '/images/team/andy-brooks.png',
  },
];

const technicalTeam: SalesRep[] = [
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
  // Mobile accordion state - tracks which sections are expanded
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['north-america']) // North America expanded by default
  );

  // Active section tracking for navigation
  const [activeSection, setActiveSection] = useState<string>('north-america');

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  };

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        'north-america', 'uk', 'europe', 'middle-east', 'india',
        'south-america', 'africa', 'asia', 'australia', 'technical'
      ];
      
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
              Meet Our Global Sales Team
            </h2>
            <p className="text-base text-neutral-600 max-w-2xl mx-auto">
              Our experienced team is ready to help you find the right building automation solutions for your project worldwide.
            </p>
          </div>

          {/* Statistics Bar */}
          <div className="relative bg-gradient-to-br from-primary-600 via-primary-500 to-primary-600 rounded-2xl p-8 mb-10 shadow-2xl overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>
            
            <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {/* Team Members */}
              <div className="group text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl mb-4 group-hover:scale-110 group-hover:bg-white/30 transition-all duration-300">
                  <Users className="w-7 h-7 text-white" strokeWidth={2.5} />
                </div>
                <div className="text-4xl lg:text-5xl font-bold text-white mb-2 group-hover:scale-105 transition-transform duration-300">
                  19
                </div>
                <div className="text-sm font-medium text-white/90">Team Members</div>
              </div>

              {/* Global Regions */}
              <div className="group text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl mb-4 group-hover:scale-110 group-hover:bg-white/30 transition-all duration-300">
                  <Globe className="w-7 h-7 text-white" strokeWidth={2.5} />
                </div>
                <div className="text-4xl lg:text-5xl font-bold text-white mb-2 group-hover:scale-105 transition-transform duration-300">
                  10
                </div>
                <div className="text-sm font-medium text-white/90">Global Regions</div>
              </div>

              {/* Countries Served */}
              <div className="group text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl mb-4 group-hover:scale-110 group-hover:bg-white/30 transition-all duration-300">
                  <Award className="w-7 h-7 text-white" strokeWidth={2.5} />
                </div>
                <div className="text-4xl lg:text-5xl font-bold text-white mb-2 group-hover:scale-105 transition-transform duration-300">
                  50+
                </div>
                <div className="text-sm font-medium text-white/90">Countries Served</div>
              </div>

              {/* Support Available */}
              <div className="group text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl mb-4 group-hover:scale-110 group-hover:bg-white/30 transition-all duration-300">
                  <HeadphonesIcon className="w-7 h-7 text-white" strokeWidth={2.5} />
                </div>
                <div className="text-4xl lg:text-5xl font-bold text-white mb-2 group-hover:scale-105 transition-transform duration-300">
                  24/7
                </div>
                <div className="text-sm font-medium text-white/90">Support Available</div>
              </div>
            </div>
          </div>

          {/* Quick Jump Navigation */}
          <div className="sticky top-20 z-40 bg-gradient-to-r from-white via-neutral-50 to-white backdrop-blur-sm border border-neutral-200/60 rounded-2xl shadow-lg mb-8 p-5">
            <div className="flex flex-wrap gap-2 justify-center">
              <a 
                href="#north-america" 
                className={`group flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-md active:scale-95 ${
                  activeSection === 'north-america' 
                    ? 'bg-primary-500 text-white shadow-md' 
                    : 'bg-white text-neutral-700 hover:bg-primary-50 hover:text-primary-600 border border-neutral-200'
                }`}
              >
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline">North America</span>
                <span className="sm:hidden">N. America</span>
              </a>
              <a 
                href="#uk" 
                className={`group flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-md active:scale-95 ${
                  activeSection === 'uk' 
                    ? 'bg-primary-500 text-white shadow-md' 
                    : 'bg-white text-neutral-700 hover:bg-primary-50 hover:text-primary-600 border border-neutral-200'
                }`}
              >
                <Building2 className="w-4 h-4" />
                UK
              </a>
              <a 
                href="#europe" 
                className={`group flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-md active:scale-95 ${
                  activeSection === 'europe' 
                    ? 'bg-primary-500 text-white shadow-md' 
                    : 'bg-white text-neutral-700 hover:bg-primary-50 hover:text-primary-600 border border-neutral-200'
                }`}
              >
                <Building2 className="w-4 h-4" />
                Europe
              </a>
              <a 
                href="#middle-east" 
                className={`group flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-md active:scale-95 ${
                  activeSection === 'middle-east' 
                    ? 'bg-primary-500 text-white shadow-md' 
                    : 'bg-white text-neutral-700 hover:bg-primary-50 hover:text-primary-600 border border-neutral-200'
                }`}
              >
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline">Middle East</span>
                <span className="sm:hidden">M. East</span>
              </a>
              <a 
                href="#india" 
                className={`group flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-md active:scale-95 ${
                  activeSection === 'india' 
                    ? 'bg-primary-500 text-white shadow-md' 
                    : 'bg-white text-neutral-700 hover:bg-primary-50 hover:text-primary-600 border border-neutral-200'
                }`}
              >
                <Building2 className="w-4 h-4" />
                India
              </a>
              <a 
                href="#south-america" 
                className={`group flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-md active:scale-95 ${
                  activeSection === 'south-america' 
                    ? 'bg-primary-500 text-white shadow-md' 
                    : 'bg-white text-neutral-700 hover:bg-primary-50 hover:text-primary-600 border border-neutral-200'
                }`}
              >
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline">S. America</span>
                <span className="sm:hidden">S. Amer</span>
              </a>
              <a 
                href="#africa" 
                className={`group flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-md active:scale-95 ${
                  activeSection === 'africa' 
                    ? 'bg-primary-500 text-white shadow-md' 
                    : 'bg-white text-neutral-700 hover:bg-primary-50 hover:text-primary-600 border border-neutral-200'
                }`}
              >
                <Globe className="w-4 h-4" />
                Africa
              </a>
              <a 
                href="#asia" 
                className={`group flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-md active:scale-95 ${
                  activeSection === 'asia' 
                    ? 'bg-primary-500 text-white shadow-md' 
                    : 'bg-white text-neutral-700 hover:bg-primary-50 hover:text-primary-600 border border-neutral-200'
                }`}
              >
                <Globe className="w-4 h-4" />
                Asia
              </a>
              <a 
                href="#australia" 
                className={`group flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-md active:scale-95 ${
                  activeSection === 'australia' 
                    ? 'bg-primary-500 text-white shadow-md' 
                    : 'bg-white text-neutral-700 hover:bg-primary-50 hover:text-primary-600 border border-neutral-200'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span className="hidden sm:inline">Australia & NZ</span>
                <span className="sm:hidden">AU/NZ</span>
              </a>
              <a 
                href="#technical" 
                className={`group flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-md active:scale-95 ${
                  activeSection === 'technical' 
                    ? 'bg-primary-500 text-white shadow-md' 
                    : 'bg-white text-neutral-700 hover:bg-primary-50 hover:text-primary-600 border border-neutral-200'
                }`}
              >
                <Wrench className="w-4 h-4" />
                Technical
              </a>
            </div>
          </div>

          {/* North American Sales */}
          <div id="north-america" className="bg-white py-8 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 mb-8 scroll-mt-32">
            <button
              onClick={() => toggleSection('north-america')}
              className="w-full text-left lg:cursor-default"
              aria-expanded={expandedSections.has('north-america')}
            >
              <h3 className="text-2xl font-bold text-neutral-900 mb-6 pb-3 border-b-2 border-primary-500 flex items-center justify-between">
                <span>
                  <span className="mr-2">🌎</span>North America <span className="text-neutral-500 font-normal text-lg">(8)</span>
                </span>
                <span className="lg:hidden text-primary-500">
                  {expandedSections.has('north-america') ? '▼' : '▶'}
                </span>
              </h3>
            </button>
            <div className={`grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto ${expandedSections.has('north-america') ? '' : 'hidden lg:grid'}`}>
              {northAmericaTeam.map((member) => (
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

          {/* UK Sales */}
          <div id="uk" className="bg-neutral-50 py-8 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 mb-8 scroll-mt-32">
            <button
              onClick={() => toggleSection('uk')}
              className="w-full text-left lg:cursor-default"
              aria-expanded={expandedSections.has('uk')}
            >
              <h3 className="text-2xl font-bold text-neutral-900 mb-6 pb-3 border-b-2 border-primary-500 flex items-center justify-between">
                <span>
                  <span className="mr-2">🇬🇧</span>United Kingdom <span className="text-neutral-500 font-normal text-lg">(1)</span>
                </span>
                <span className="lg:hidden text-primary-500">
                  {expandedSections.has('uk') ? '▼' : '▶'}
                </span>
              </h3>
            </button>
            <div className={`grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto ${expandedSections.has('uk') ? '' : 'hidden lg:grid'}`}>
              {ukTeam.map((member) => (
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

          {/* Europe Sales */}
          <div id="europe" className="bg-white py-8 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 mb-8 scroll-mt-32">
            <button
              onClick={() => toggleSection('europe')}
              className="w-full text-left lg:cursor-default"
              aria-expanded={expandedSections.has('europe')}
            >
              <h3 className="text-2xl font-bold text-neutral-900 mb-6 pb-3 border-b-2 border-primary-500 flex items-center justify-between">
                <span>
                  <span className="mr-2">🇪🇺</span>Europe <span className="text-neutral-500 font-normal text-lg">(1)</span>
                </span>
                <span className="lg:hidden text-primary-500">
                  {expandedSections.has('europe') ? '▼' : '▶'}
                </span>
              </h3>
            </button>
            <div className={`grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto ${expandedSections.has('europe') ? '' : 'hidden lg:grid'}`}>
              {europeTeam.map((member) => (
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

          {/* Middle East Sales */}
          <div id="middle-east" className="bg-neutral-50 py-8 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 mb-8 scroll-mt-32">
            <button
              onClick={() => toggleSection('middle-east')}
              className="w-full text-left lg:cursor-default"
              aria-expanded={expandedSections.has('middle-east')}
            >
              <h3 className="text-2xl font-bold text-neutral-900 mb-6 pb-3 border-b-2 border-primary-500 flex items-center justify-between">
                <span>
                  <span className="mr-2">🌍</span>Middle East <span className="text-neutral-500 font-normal text-lg">(1)</span>
                </span>
                <span className="lg:hidden text-primary-500">
                  {expandedSections.has('middle-east') ? '▼' : '▶'}
                </span>
              </h3>
            </button>
            <div className={`grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto ${expandedSections.has('middle-east') ? '' : 'hidden lg:grid'}`}>
              {middleEastTeam.map((member) => (
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

          {/* India Sales */}
          <div id="india" className="bg-white py-8 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 mb-8 scroll-mt-32">
            <button
              onClick={() => toggleSection('india')}
              className="w-full text-left lg:cursor-default"
              aria-expanded={expandedSections.has('india')}
            >
              <h3 className="text-2xl font-bold text-neutral-900 mb-6 pb-3 border-b-2 border-primary-500 flex items-center justify-between">
                <span>
                  <span className="mr-2">🇮🇳</span>India <span className="text-neutral-500 font-normal text-lg">(2)</span>
                </span>
                <span className="lg:hidden text-primary-500">
                  {expandedSections.has('india') ? '▼' : '▶'}
                </span>
              </h3>
            </button>
            <div className={`grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto ${expandedSections.has('india') ? '' : 'hidden lg:grid'}`}>
              {indiaTeam.map((member) => (
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

          {/* South America Sales */}
          <div id="south-america" className="bg-neutral-50 py-8 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 mb-8 scroll-mt-32">
            <button
              onClick={() => toggleSection('south-america')}
              className="w-full text-left lg:cursor-default"
              aria-expanded={expandedSections.has('south-america')}
            >
              <h3 className="text-2xl font-bold text-neutral-900 mb-6 pb-3 border-b-2 border-primary-500 flex items-center justify-between">
                <span>
                  <span className="mr-2">🌎</span>South America <span className="text-neutral-500 font-normal text-lg">(1)</span>
                </span>
                <span className="lg:hidden text-primary-500">
                  {expandedSections.has('south-america') ? '▼' : '▶'}
                </span>
              </h3>
            </button>
            <div className={`grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto ${expandedSections.has('south-america') ? '' : 'hidden lg:grid'}`}>
              {southAmericaTeam.map((member) => (
                <SalesTeamCard
                  key={`${member.email}-sa`}
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

          {/* Africa Sales */}
          <div id="africa" className="bg-white py-8 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 mb-8 scroll-mt-32">
            <button
              onClick={() => toggleSection('africa')}
              className="w-full text-left lg:cursor-default"
              aria-expanded={expandedSections.has('africa')}
            >
              <h3 className="text-2xl font-bold text-neutral-900 mb-6 pb-3 border-b-2 border-primary-500 flex items-center justify-between">
                <span>
                  <span className="mr-2">🌍</span>Africa <span className="text-neutral-500 font-normal text-lg">(1)</span>
                </span>
                <span className="lg:hidden text-primary-500">
                  {expandedSections.has('africa') ? '▼' : '▶'}
                </span>
              </h3>
            </button>
            <div className={`grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto ${expandedSections.has('africa') ? '' : 'hidden lg:grid'}`}>
              {africaTeam.map((member) => (
                <SalesTeamCard
                  key={`${member.email}-africa`}
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

          {/* Asia Sales */}
          <div id="asia" className="bg-neutral-50 py-8 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 mb-8 scroll-mt-32">
            <button
              onClick={() => toggleSection('asia')}
              className="w-full text-left lg:cursor-default"
              aria-expanded={expandedSections.has('asia')}
            >
              <h3 className="text-2xl font-bold text-neutral-900 mb-6 pb-3 border-b-2 border-primary-500 flex items-center justify-between">
                <span>
                  <span className="mr-2">🌏</span>Asia <span className="text-neutral-500 font-normal text-lg">(1)</span>
                </span>
                <span className="lg:hidden text-primary-500">
                  {expandedSections.has('asia') ? '▼' : '▶'}
                </span>
              </h3>
            </button>
            <div className={`grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto ${expandedSections.has('asia') ? '' : 'hidden lg:grid'}`}>
              {asiaTeam.map((member) => (
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

          {/* Australia & New Zealand Sales */}
          <div id="australia" className="bg-white py-8 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 mb-8 scroll-mt-32">
            <button
              onClick={() => toggleSection('australia')}
              className="w-full text-left lg:cursor-default"
              aria-expanded={expandedSections.has('australia')}
            >
              <h3 className="text-2xl font-bold text-neutral-900 mb-6 pb-3 border-b-2 border-primary-500 flex items-center justify-between">
                <span>
                  <span className="mr-2">🇦🇺</span>Australia & New Zealand <span className="text-neutral-500 font-normal text-lg">(1)</span>
                </span>
                <span className="lg:hidden text-primary-500">
                  {expandedSections.has('australia') ? '▼' : '▶'}
                </span>
              </h3>
            </button>
            <div className={`grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto ${expandedSections.has('australia') ? '' : 'hidden lg:grid'}`}>
              {australiaTeam.map((member) => (
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

          {/* Technical Support */}
          <div id="technical" className="bg-neutral-50 py-8 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 scroll-mt-32">
            <button
              onClick={() => toggleSection('technical')}
              className="w-full text-left lg:cursor-default"
              aria-expanded={expandedSections.has('technical')}
            >
              <h3 className="text-2xl font-bold text-neutral-900 mb-6 pb-3 border-b-2 border-primary-500 flex items-center justify-between">
                <span>
                  <span className="mr-2">🛠️</span>Technical Support <span className="text-neutral-500 font-normal text-lg">(2)</span>
                </span>
                <span className="lg:hidden text-primary-500">
                  {expandedSections.has('technical') ? '▼' : '▶'}
                </span>
              </h3>
            </button>
            <div className={`grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto ${expandedSections.has('technical') ? '' : 'hidden lg:grid'}`}>
              {technicalTeam.map((member) => (
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
