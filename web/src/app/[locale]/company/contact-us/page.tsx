import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getPageBySlug } from '@/lib/wordpress';
import { GlobalPresence } from '@/components/company/GlobalPresence';
import Link from 'next/link';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Headphones,
  Globe,
  Users,
  Package,
  ArrowRight,
  Send,
} from 'lucide-react';
import { locales } from '@/i18n';

// Generate static params for all locales - ensures each locale is built separately
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('companyPages.contact.metadata');

  return {
    title: t('title'),
    description: t('description'),
  };
}

// ISR with 1-hour revalidation for contact page (rarely updated)
export const revalidate = 3600;

export default async function ContactUsPage() {
  const t = await getTranslations('companyPages.contact');
  const page = await getPageBySlug('contact');

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-50 via-white to-primary-50/30">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-br from-primary-600 to-primary-800">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="absolute right-0 top-0 h-[600px] w-[600px] -translate-y-1/3 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-96 w-96 translate-y-1/3 rounded-full bg-primary-400/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          {/* Breadcrumb */}
          <nav className="mb-8 flex items-center gap-2 text-sm text-primary-100">
            <Link href="/" className="transition-colors hover:text-white">
              {t('breadcrumb.home')}
            </Link>
            <span>/</span>
            <Link href="/company" className="transition-colors hover:text-white">
              {t('breadcrumb.company')}
            </Link>
            <span>/</span>
            <span className="font-medium text-white">{t('breadcrumb.contact')}</span>
          </nav>

          {/* Header */}
          <div className="max-w-4xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
              <Mail className="h-4 w-4" />
              {t('hero.badge')}
            </div>

            <h1 className="mb-6 text-5xl font-bold tracking-tight text-white md:text-6xl lg:text-7xl">
              {t('hero.title')}
            </h1>

            <p className="text-xl leading-relaxed text-primary-50 md:text-2xl">
              {t('hero.description')}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="relative mx-auto -mt-16 max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mb-20 grid gap-8 md:grid-cols-3">
          {[
            { key: 'phone', icon: Phone, gradient: 'from-primary-600 to-primary-700' },
            { key: 'email', icon: Mail, gradient: 'from-primary-500 to-primary-600' },
            { key: 'visit', icon: MapPin, gradient: 'from-primary-600 to-primary-700' },
          ].map((method, index) => {
            const Icon = method.icon;
            const href =
              method.key === 'phone'
                ? 'tel:+18007354800'
                : method.key === 'email'
                  ? 'mailto:sales@bapihvac.com'
                  : 'https://maps.google.com/?q=750+N+Royal+Ave+Gays+Mills+WI+54631';
            return (
              <a
                key={method.key}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-8 shadow-xl transition-all duration-500 hover:border-transparent hover:shadow-2xl"
                style={{ animationDelay: `${index * 75}ms` }}
              >
                {/* Gradient background on hover */}
                <div
                  className={`absolute inset-0 bg-linear-to-br ${method.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-5`}
                />

                {/* Icon */}
                <div className="relative mb-6">
                  <div
                    className={`inline-flex h-14 w-14 items-center justify-center rounded-xl bg-linear-to-br ${method.gradient} shadow-lg transition-transform duration-300 group-hover:scale-110`}
                  >
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                </div>

                {/* Content */}
                <div className="relative">
                  <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">
                    {t(`contactMethods.${method.key}.title`)}
                  </h3>
                  <p className="mb-2 text-xl font-bold text-gray-900 transition-colors group-hover:text-primary-600">
                    {t(`contactMethods.${method.key}.details`)}
                  </p>
                  <p className="text-sm text-gray-600">{t(`contactMethods.${method.key}.description`)}</p>
                </div>

                {/* Arrow */}
                <ArrowRight className="absolute bottom-6 right-6 h-5 w-5 text-gray-400 transition-all duration-300 group-hover:translate-x-1 group-hover:text-primary-500" />
              </a>
            );
          })}
        </div>

        {/* Departments Section */}
        <div className="mb-20">
          <div className="mb-12 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-2 text-sm font-medium text-primary-700">
              <Users className="h-4 w-4" />
              {t('departmentsSection.badge')}
            </div>
            <h2 className="mb-4 text-4xl font-bold text-gray-900">{t('departmentsSection.title')}</h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              {t('departmentsSection.description')}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {[
              { key: 'sales', icon: Users },
              { key: 'international', icon: Globe },
              { key: 'distribution', icon: Package },
              { key: 'technical', icon: Headphones },
            ].map((dept, index) => {
              const Icon = dept.icon;
              return (
                <div
                  key={dept.key}
                  className="group rounded-xl border border-gray-100 bg-white p-6 shadow-md transition-all duration-300 hover:shadow-xl"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-linear-to-br from-primary-500 to-primary-600 transition-transform duration-300 group-hover:scale-110">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="mb-2 text-xl font-bold text-gray-900">
                        {t(`departmentsSection.${dept.key}.title`)}
                      </h3>
                      <p className="mb-3 text-sm text-gray-600">
                        {t(`departmentsSection.${dept.key}.description`)}
                      </p>
                      <a
                        href={`mailto:${t(`departmentsSection.${dept.key}.email`)}`}
                        className="inline-flex items-center gap-2 font-medium text-primary-600 transition-all duration-300 hover:gap-3"
                      >
                        <Mail className="h-4 w-4" />
                        {t(`departmentsSection.${dept.key}.email`)}
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Global Presence Map */}
      <GlobalPresence />

      <section className="relative mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        {/* International Office */}
        <div className="mb-20 rounded-2xl bg-linear-to-br from-gray-50 to-white p-10 shadow-lg lg:p-16">
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-2 text-sm font-medium text-primary-700">
                <Globe className="h-4 w-4" />
                {t('internationalOffice.badge')}
              </div>
              <h2 className="mb-2 text-3xl font-bold text-gray-900">{t('internationalOffice.title')}</h2>
              <p className="text-lg text-gray-600">{t('internationalOffice.subtitle')}</p>
            </div>

            <div className="rounded-xl bg-white p-8 shadow-md">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-primary-600 to-primary-700">
                    <Phone className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="mb-1 text-sm font-semibold uppercase tracking-wide text-gray-500">
                      {t('internationalOffice.phoneLabel')}
                    </div>
                    <a
                      href={`tel:${t('internationalOffice.phone').replace(/[^+0-9]/g, '')}`}
                      className="text-lg font-bold text-gray-900 transition-colors hover:text-primary-600"
                    >
                      {t('internationalOffice.phone')}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-primary-600 to-primary-700">
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="mb-1 text-sm font-semibold uppercase tracking-wide text-gray-500">
                      {t('internationalOffice.addressLabel')}
                    </div>
                    <p className="whitespace-pre-line text-gray-900">
                      {t('internationalOffice.addressLine1')}
                      {'\n'}
                      {t('internationalOffice.addressLine2')}
                      {'\n'}
                      {t('internationalOffice.addressLine3')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-lg border border-primary-100 bg-primary-50 p-6">
              <p className="text-center text-gray-700">
                <strong>{t('internationalOffice.rmaInstructions.strong')}</strong>{' '}
                {t('internationalOffice.rmaInstructions.text')}
              </p>
            </div>
          </div>
        </div>

        {/* Business Hours */}
        <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-primary-600 to-primary-700 p-10 shadow-2xl lg:p-16">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
          <div className="absolute right-0 top-0 h-96 w-96 -translate-y-1/2 translate-x-1/2 rounded-full bg-white/10 blur-3xl" />

          <div className="relative mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
              <Clock className="h-8 w-8 text-white" />
            </div>

            <h2 className="mb-4 text-3xl font-bold text-white lg:text-4xl">{t('cta.title')}</h2>

            <div className="mb-6 rounded-xl bg-white/10 p-8 backdrop-blur-sm">
              <div className="grid gap-6 text-white md:grid-cols-2">
                <div>
                  <div className="mb-2 text-sm font-semibold uppercase tracking-wide text-primary-100">
                    {t('cta.weekday.label')}
                  </div>
                  <div className="text-2xl font-bold">{t('cta.weekday.hours')}</div>
                  <div className="mt-1 text-sm text-primary-100">{t('cta.weekday.timezone')}</div>
                </div>
                <div>
                  <div className="mb-2 text-sm font-semibold uppercase tracking-wide text-primary-100">
                    {t('cta.weekend.label')}
                  </div>
                  <div className="text-2xl font-bold">{t('cta.weekend.status')}</div>
                  <div className="mt-1 text-sm text-primary-100">{t('cta.weekend.days')}</div>
                </div>
              </div>
            </div>

            <p className="text-lg text-primary-50">{t('cta.description')}</p>
          </div>
        </div>
      </section>
    </main>
  );
}
