'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  PhoneIcon,
  MailIcon,
  MapPinIcon,
  ClockIcon,
  SendIcon,
  GlobeIcon,
  Building2Icon,
  WrenchIcon,
  UsersIcon,
  AwardIcon,
  HeadphonesIcon,
} from '@/lib/icons';
import SalesTeamCard from '@/components/contact/SalesTeamCard';
import {
  northAmericaTeam,
  ukTeam,
  europeTeam,
  middleEastTeam,
  indiaTeam,
  southAmericaTeam,
  africaTeam,
  australiaTeam,
  technicalTeam,
} from '@/lib/constants/team';

export default function ContactPage() {
  const params = useParams<{ locale: string }>();
  const locale = params?.locale ?? 'en';

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
        'north-america',
        'uk',
        'europe',
        'middle-east',
        'india',
        'south-america',
        'africa',
        'australia',
        'technical',
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
      <section className="bg-gradient-to-br from-primary-700 via-primary-600 to-primary-500 py-12 text-white lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="mb-3 text-3xl font-bold lg:text-4xl">Contact Us</h1>
            <p className="mx-auto max-w-2xl text-lg text-primary-50">
              Connect with our expert sales team for building automation solutions, technical
              support, and product information.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form + Info Section */}
      <section className="bg-neutral-50 py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm lg:p-8">
                <h2 className="mb-6 text-2xl font-bold text-neutral-900">Send Us a Message</h2>
                <form className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="name"
                        className="mb-1.5 block text-sm font-medium text-neutral-700"
                      >
                        Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        className="w-full rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-500"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="company"
                        className="mb-1.5 block text-sm font-medium text-neutral-700"
                      >
                        Company
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        className="w-full rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-500"
                        placeholder="Company name"
                      />
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="email"
                        className="mb-1.5 block text-sm font-medium text-neutral-700"
                      >
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        className="w-full rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-500"
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="phone"
                        className="mb-1.5 block text-sm font-medium text-neutral-700"
                      >
                        Phone
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        className="w-full rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-500"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="mb-1.5 block text-sm font-medium text-neutral-700"
                    >
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      required
                      className="w-full rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-500"
                      placeholder="How can we help?"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="mb-1.5 block text-sm font-medium text-neutral-700"
                    >
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      required
                      className="w-full resize-none rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-500"
                      placeholder="Tell us about your project or question..."
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent-500 px-6 py-2.5 text-sm font-semibold text-neutral-900 transition-all duration-200 hover:bg-accent-600 hover:shadow-md"
                    >
                      <SendIcon className="h-4 w-4" />
                      Send Message
                    </button>
                    <p className="text-xs text-neutral-700">* Required fields</p>
                  </div>
                </form>
              </div>
            </div>

            {/* Contact Information Sidebar */}
            <div className="space-y-4">
              {/* Phone */}
              <div className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-primary-50 p-2.5">
                    <PhoneIcon className="h-5 w-5 text-primary-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="mb-1 text-sm font-semibold text-neutral-900">Phone</h3>
                    <a
                      href="tel:+16087354800"
                      className="text-sm font-medium text-primary-600 transition-colors hover:text-primary-700"
                    >
                      +1-608-735-4800
                    </a>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-primary-50 p-2.5">
                    <MailIcon className="h-5 w-5 text-primary-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="mb-1 text-sm font-semibold text-neutral-900">Email</h3>
                    <a
                      href="mailto:customerservice@bapisensors.com"
                      className="break-all text-sm font-medium text-primary-600 transition-colors hover:text-primary-700"
                    >
                      customerservice@bapisensors.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Hours */}
              <div className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-primary-50 p-2.5">
                    <ClockIcon className="h-5 w-5 text-primary-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="mb-1 text-sm font-semibold text-neutral-900">Business Hours</h3>
                    <p className="text-xs text-neutral-700">Monday - Friday</p>
                    <p className="text-sm font-medium text-neutral-900">8:00 AM - 5:00 PM CST</p>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-primary-50 p-2.5">
                    <MapPinIcon className="h-5 w-5 text-primary-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="mb-1 text-sm font-semibold text-neutral-900">Address</h3>
                    <p className="text-xs leading-relaxed text-neutral-700">
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
      <section className="bg-white py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="mb-2 text-2xl font-bold text-neutral-900 lg:text-3xl">
              Meet Our Global Sales Team
            </h2>
            <p className="mx-auto max-w-2xl text-base text-neutral-700">
              Our experienced team is ready to help you find the right building automation solutions
              for your project worldwide.
            </p>
          </div>

          {/* Statistics Bar */}
          <div className="relative mb-10 overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 via-primary-500 to-primary-600 p-8 shadow-2xl">
            {/* Decorative background elements */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>

            <div className="relative grid grid-cols-2 gap-6 lg:grid-cols-4 lg:gap-8">
              {/* Team Members */}
              <div className="group text-center">
                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-white/30">
                  <UsersIcon className="h-7 w-7 text-white" />
                </div>
                <div className="mb-2 text-4xl font-bold text-white transition-transform duration-300 group-hover:scale-105 lg:text-5xl">
                  20
                </div>
                <div className="text-sm font-medium text-white/90">Team Members</div>
              </div>

              {/* Global Regions */}
              <div className="group text-center">
                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-white/30">
                  <GlobeIcon className="h-7 w-7 text-white" />
                </div>
                <div className="mb-2 text-4xl font-bold text-white transition-transform duration-300 group-hover:scale-105 lg:text-5xl">
                  10
                </div>
                <div className="text-sm font-medium text-white/90">Global Regions</div>
              </div>

              {/* Countries Served */}
              <div className="group text-center">
                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-white/30">
                  <AwardIcon className="h-7 w-7 text-white" />
                </div>
                <div className="mb-2 text-4xl font-bold text-white transition-transform duration-300 group-hover:scale-105 lg:text-5xl">
                  50+
                </div>
                <div className="text-sm font-medium text-white/90">Countries Served</div>
              </div>

              {/* Support Available */}
              <div className="group text-center">
                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-white/30">
                  <HeadphonesIcon className="h-7 w-7 text-white" />
                </div>
                <div className="mb-2 text-4xl font-bold text-white transition-transform duration-300 group-hover:scale-105 lg:text-5xl">
                  24/7
                </div>
                <div className="text-sm font-medium text-white/90">Support Available</div>
              </div>
            </div>
          </div>

          {/* Quick Jump Navigation */}
          <div className="sticky top-20 z-40 mb-8 rounded-2xl border border-neutral-200/60 bg-gradient-to-r from-white via-neutral-50 to-white p-5 shadow-lg backdrop-blur-sm">
            <div className="flex flex-wrap justify-center gap-2">
              <a
                href="#north-america"
                className={`group flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-300 hover:scale-105 hover:shadow-md active:scale-95 ${
                  activeSection === 'north-america'
                    ? 'bg-primary-500 text-white shadow-md'
                    : 'border border-neutral-200 bg-white text-neutral-700 hover:bg-primary-50 hover:text-primary-600'
                }`}
              >
                <GlobeIcon className="h-4 w-4" />
                <span className="hidden sm:inline">North America</span>
                <span className="sm:hidden">N. America</span>
              </a>
              <a
                href="#uk"
                className={`group flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-300 hover:scale-105 hover:shadow-md active:scale-95 ${
                  activeSection === 'uk'
                    ? 'bg-primary-500 text-white shadow-md'
                    : 'border border-neutral-200 bg-white text-neutral-700 hover:bg-primary-50 hover:text-primary-600'
                }`}
              >
                <Building2Icon className="h-4 w-4" />
                UK
              </a>
              <a
                href="#europe"
                className={`group flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-300 hover:scale-105 hover:shadow-md active:scale-95 ${
                  activeSection === 'europe'
                    ? 'bg-primary-500 text-white shadow-md'
                    : 'border border-neutral-200 bg-white text-neutral-700 hover:bg-primary-50 hover:text-primary-600'
                }`}
              >
                <Building2Icon className="h-4 w-4" />
                Europe
              </a>
              <a
                href="#middle-east"
                className={`group flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-300 hover:scale-105 hover:shadow-md active:scale-95 ${
                  activeSection === 'middle-east'
                    ? 'bg-primary-500 text-white shadow-md'
                    : 'border border-neutral-200 bg-white text-neutral-700 hover:bg-primary-50 hover:text-primary-600'
                }`}
              >
                <GlobeIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Middle East</span>
                <span className="sm:hidden">M. East</span>
              </a>
              <a
                href="#india"
                className={`group flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-300 hover:scale-105 hover:shadow-md active:scale-95 ${
                  activeSection === 'india'
                    ? 'bg-primary-500 text-white shadow-md'
                    : 'border border-neutral-200 bg-white text-neutral-700 hover:bg-primary-50 hover:text-primary-600'
                }`}
              >
                <Building2Icon className="h-4 w-4" />
                India
              </a>
              <a
                href="#south-america"
                className={`group flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-300 hover:scale-105 hover:shadow-md active:scale-95 ${
                  activeSection === 'south-america'
                    ? 'bg-primary-500 text-white shadow-md'
                    : 'border border-neutral-200 bg-white text-neutral-700 hover:bg-primary-50 hover:text-primary-600'
                }`}
              >
                <GlobeIcon className="h-4 w-4" />
                <span className="hidden sm:inline">S. America</span>
                <span className="sm:hidden">S. Amer</span>
              </a>
              <a
                href="#africa"
                className={`group flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-300 hover:scale-105 hover:shadow-md active:scale-95 ${
                  activeSection === 'africa'
                    ? 'bg-primary-500 text-white shadow-md'
                    : 'border border-neutral-200 bg-white text-neutral-700 hover:bg-primary-50 hover:text-primary-600'
                }`}
              >
                <GlobeIcon className="h-4 w-4" />
                Africa
              </a>
              <a
                href="#australia"
                className={`group flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-300 hover:scale-105 hover:shadow-md active:scale-95 ${
                  activeSection === 'australia'
                    ? 'bg-primary-500 text-white shadow-md'
                    : 'border border-neutral-200 bg-white text-neutral-700 hover:bg-primary-50 hover:text-primary-600'
                }`}
              >
                <GlobeIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Asia & Pacific</span>
                <span className="sm:hidden">Asia/AU</span>
              </a>
              <a
                href="#technical"
                className={`group flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-300 hover:scale-105 hover:shadow-md active:scale-95 ${
                  activeSection === 'technical'
                    ? 'bg-primary-500 text-white shadow-md'
                    : 'border border-neutral-200 bg-white text-neutral-700 hover:bg-primary-50 hover:text-primary-600'
                }`}
              >
                <WrenchIcon className="h-4 w-4" />
                Technical
              </a>
            </div>
          </div>

          {/* North American Sales */}
          <div
            id="north-america"
            className="-mx-4 mb-8 scroll-mt-32 bg-white px-4 py-8 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
          >
            <button
              onClick={() => toggleSection('north-america')}
              className="w-full text-left lg:cursor-default"
              aria-expanded={expandedSections.has('north-america')}
            >
              <h3 className="mb-6 flex items-center justify-between border-b-2 border-primary-500 pb-3 text-2xl font-bold text-neutral-900">
                <span>
                  <span className="mr-2">🌎</span>North America{' '}
                  <span className="text-lg font-normal text-neutral-700">(10)</span>
                </span>
                <span className="text-primary-500 lg:hidden">
                  {expandedSections.has('north-america') ? '▼' : '▶'}
                </span>
              </h3>
            </button>
            <div
              className={`mx-auto grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-2 ${expandedSections.has('north-america') ? '' : 'hidden lg:grid'}`}
            >
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
                  profileHref={`/${locale}/contact/${member.slug}`}
                />
              ))}
            </div>
          </div>

          {/* UK Sales */}
          <div
            id="uk"
            className="-mx-4 mb-8 scroll-mt-32 bg-neutral-50 px-4 py-8 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
          >
            <button
              onClick={() => toggleSection('uk')}
              className="w-full text-left lg:cursor-default"
              aria-expanded={expandedSections.has('uk')}
            >
              <h3 className="mb-6 flex items-center justify-between border-b-2 border-primary-500 pb-3 text-2xl font-bold text-neutral-900">
                <span>
                  <span className="mr-2">🇬🇧</span>United Kingdom{' '}
                  <span className="text-lg font-normal text-neutral-700">(1)</span>
                </span>
                <span className="text-primary-500 lg:hidden">
                  {expandedSections.has('uk') ? '▼' : '▶'}
                </span>
              </h3>
            </button>
            <div
              className={`mx-auto grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-2 ${expandedSections.has('uk') ? '' : 'hidden lg:grid'}`}
            >
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
                  profileHref={`/${locale}/contact/${member.slug}`}
                />
              ))}
            </div>
          </div>

          {/* Europe Sales */}
          <div
            id="europe"
            className="-mx-4 mb-8 scroll-mt-32 bg-white px-4 py-8 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
          >
            <button
              onClick={() => toggleSection('europe')}
              className="w-full text-left lg:cursor-default"
              aria-expanded={expandedSections.has('europe')}
            >
              <h3 className="mb-6 flex items-center justify-between border-b-2 border-primary-500 pb-3 text-2xl font-bold text-neutral-900">
                <span>
                  <span className="mr-2">🇪🇺</span>Europe{' '}
                  <span className="text-lg font-normal text-neutral-700">(1)</span>
                </span>
                <span className="text-primary-500 lg:hidden">
                  {expandedSections.has('europe') ? '▼' : '▶'}
                </span>
              </h3>
            </button>
            <div
              className={`mx-auto grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-2 ${expandedSections.has('europe') ? '' : 'hidden lg:grid'}`}
            >
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
                  profileHref={`/${locale}/contact/${member.slug}`}
                />
              ))}
            </div>
          </div>

          {/* Middle East Sales */}
          <div
            id="middle-east"
            className="-mx-4 mb-8 scroll-mt-32 bg-neutral-50 px-4 py-8 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
          >
            <button
              onClick={() => toggleSection('middle-east')}
              className="w-full text-left lg:cursor-default"
              aria-expanded={expandedSections.has('middle-east')}
            >
              <h3 className="mb-6 flex items-center justify-between border-b-2 border-primary-500 pb-3 text-2xl font-bold text-neutral-900">
                <span>
                  <span className="mr-2">🌍</span>Middle East{' '}
                  <span className="text-lg font-normal text-neutral-700">(1)</span>
                </span>
                <span className="text-primary-500 lg:hidden">
                  {expandedSections.has('middle-east') ? '▼' : '▶'}
                </span>
              </h3>
            </button>
            <div
              className={`mx-auto grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-2 ${expandedSections.has('middle-east') ? '' : 'hidden lg:grid'}`}
            >
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
                  profileHref={`/${locale}/contact/${member.slug}`}
                />
              ))}
            </div>
          </div>

          {/* India Sales */}
          <div
            id="india"
            className="-mx-4 mb-8 scroll-mt-32 bg-white px-4 py-8 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
          >
            <button
              onClick={() => toggleSection('india')}
              className="w-full text-left lg:cursor-default"
              aria-expanded={expandedSections.has('india')}
            >
              <h3 className="mb-6 flex items-center justify-between border-b-2 border-primary-500 pb-3 text-2xl font-bold text-neutral-900">
                <span>
                  <span className="mr-2">🇮🇳</span>India{' '}
                  <span className="text-lg font-normal text-neutral-700">(2)</span>
                </span>
                <span className="text-primary-500 lg:hidden">
                  {expandedSections.has('india') ? '▼' : '▶'}
                </span>
              </h3>
            </button>
            <div
              className={`mx-auto grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-2 ${expandedSections.has('india') ? '' : 'hidden lg:grid'}`}
            >
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
                  profileHref={`/${locale}/contact/${member.slug}`}
                />
              ))}
            </div>
          </div>

          {/* South America Sales */}
          <div
            id="south-america"
            className="-mx-4 mb-8 scroll-mt-32 bg-neutral-50 px-4 py-8 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
          >
            <button
              onClick={() => toggleSection('south-america')}
              className="w-full text-left lg:cursor-default"
              aria-expanded={expandedSections.has('south-america')}
            >
              <h3 className="mb-6 flex items-center justify-between border-b-2 border-primary-500 pb-3 text-2xl font-bold text-neutral-900">
                <span>
                  <span className="mr-2">🌎</span>South America{' '}
                  <span className="text-lg font-normal text-neutral-700">(1)</span>
                </span>
                <span className="text-primary-500 lg:hidden">
                  {expandedSections.has('south-america') ? '▼' : '▶'}
                </span>
              </h3>
            </button>
            <div
              className={`mx-auto grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-2 ${expandedSections.has('south-america') ? '' : 'hidden lg:grid'}`}
            >
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
                  profileHref={`/${locale}/contact/${member.slug}`}
                />
              ))}
            </div>
          </div>

          {/* Africa Sales */}
          <div
            id="africa"
            className="-mx-4 mb-8 scroll-mt-32 bg-white px-4 py-8 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
          >
            <button
              onClick={() => toggleSection('africa')}
              className="w-full text-left lg:cursor-default"
              aria-expanded={expandedSections.has('africa')}
            >
              <h3 className="mb-6 flex items-center justify-between border-b-2 border-primary-500 pb-3 text-2xl font-bold text-neutral-900">
                <span>
                  <span className="mr-2">🌍</span>Africa{' '}
                  <span className="text-lg font-normal text-neutral-700">(1)</span>
                </span>
                <span className="text-primary-500 lg:hidden">
                  {expandedSections.has('africa') ? '▼' : '▶'}
                </span>
              </h3>
            </button>
            <div
              className={`mx-auto grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-2 ${expandedSections.has('africa') ? '' : 'hidden lg:grid'}`}
            >
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
                  profileHref={`/${locale}/contact/${member.slug}`}
                />
              ))}
            </div>
          </div>

          {/* Asia, Australia & Pacific Sales */}
          <div
            id="australia"
            className="-mx-4 mb-8 scroll-mt-32 bg-white px-4 py-8 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
          >
            <button
              onClick={() => toggleSection('australia')}
              className="w-full text-left lg:cursor-default"
              aria-expanded={expandedSections.has('australia')}
            >
              <h3 className="mb-6 flex items-center justify-between border-b-2 border-primary-500 pb-3 text-2xl font-bold text-neutral-900">
                <span>
                  <span className="mr-2">🌏</span>Asia, Australia & Pacific{' '}
                  <span className="text-lg font-normal text-neutral-700">(1)</span>
                </span>
                <span className="text-primary-500 lg:hidden">
                  {expandedSections.has('australia') ? '▼' : '▶'}
                </span>
              </h3>
            </button>
            <div
              className={`mx-auto grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-2 ${expandedSections.has('australia') ? '' : 'hidden lg:grid'}`}
            >
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
                  profileHref={`/${locale}/contact/${member.slug}`}
                />
              ))}
            </div>
          </div>

          {/* Technical Support */}
          <div
            id="technical"
            className="-mx-4 scroll-mt-32 bg-neutral-50 px-4 py-8 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
          >
            <button
              onClick={() => toggleSection('technical')}
              className="w-full text-left lg:cursor-default"
              aria-expanded={expandedSections.has('technical')}
            >
              <h3 className="mb-6 flex items-center justify-between border-b-2 border-primary-500 pb-3 text-2xl font-bold text-neutral-900">
                <span>
                  <span className="mr-2">🛠️</span>Technical Support{' '}
                  <span className="text-lg font-normal text-neutral-700">(2)</span>
                </span>
                <span className="text-primary-500 lg:hidden">
                  {expandedSections.has('technical') ? '▼' : '▶'}
                </span>
              </h3>
            </button>
            <div
              className={`mx-auto grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-2 ${expandedSections.has('technical') ? '' : 'hidden lg:grid'}`}
            >
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
                  profileHref={`/${locale}/contact/${member.slug}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="bg-neutral-50 py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h2 className="mb-2 text-2xl font-bold text-neutral-900">Visit Our Facility</h2>
            <p className="text-base text-neutral-700">
              Located in Gays Mills, Wisconsin - Made in USA since 1993
            </p>
          </div>

          {/* Google Maps Embed */}
          <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
            <div className="flex aspect-video items-center justify-center bg-neutral-100">
              <div className="p-8 text-center">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-neutral-200">
                  <MapPinIcon className="h-7 w-7 text-neutral-700" />
                </div>
                <p className="mb-1 text-sm font-medium text-neutral-700">750 North Royal Avenue</p>
                <p className="mb-4 text-sm text-neutral-700">Gays Mills, WI 54631</p>
                <a
                  href="https://maps.google.com/?q=750+North+Royal+Avenue+Gays+Mills+WI+54631"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 transition-colors hover:text-primary-700"
                >
                  Open in Google Maps
                  <svg
                    className="h-3.5 w-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                     
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
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
