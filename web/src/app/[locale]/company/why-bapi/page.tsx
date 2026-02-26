import { Metadata } from 'next';
import { getPageBySlug } from '@/lib/wordpress';
import Link from 'next/link';
import { Star, Award, Shield, Clock, Users, Zap, CheckCircle2, ArrowRight } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { locales } from '@/i18n';

// Generate static params for all locales - ensures each locale is built separately
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('companyPages.whyBapi.metadata');
  return {
    title: t('title'),
    description: t('description'),
  };
}

// ISR with 1-hour revalidation for why-bapi page (rarely updated)
export const revalidate = 3600;

export default async function WhyBapiPage() {
  const page = await getPageBySlug('why-bapi');
  const t = await getTranslations('companyPages.whyBapi');

  return (
    <main className="bg-linear-to-br min-h-screen from-slate-50 via-white to-primary-50/30">
      {/* Hero Section */}
      <section className="bg-linear-to-br relative overflow-hidden from-primary-600 to-primary-800">
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
            <span className="font-medium text-white">{t('breadcrumb.whyBapi')}</span>
          </nav>

          {/* Header */}
          <div className="max-w-4xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
              <Star className="h-4 w-4" />
              {t('hero.badge')}
            </div>

            <h1 className="mb-6 text-5xl font-bold tracking-tight text-white md:text-6xl lg:text-7xl">
              {t('hero.title')}
            </h1>

            <p className="mb-8 text-xl leading-relaxed text-primary-50 md:text-2xl">
              {t('hero.description')}
            </p>

            {/* Key Stats */}
            <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
              <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
                <div className="mb-1 text-3xl font-bold text-white">
                  {t('hero.stats.years.value')}
                </div>
                <div className="text-sm text-primary-100">{t('hero.stats.years.label')}</div>
              </div>
              <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
                <div className="mb-1 text-3xl font-bold text-white">
                  {t('hero.stats.warranty.value')}
                </div>
                <div className="text-sm text-primary-100">{t('hero.stats.warranty.label')}</div>
              </div>
              <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
                <div className="mb-1 text-3xl font-bold text-white">
                  {t('hero.stats.testing.value')}
                </div>
                <div className="text-sm text-primary-100">{t('hero.stats.testing.label')}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Differentiators Grid */}
      <section className="relative mx-auto -mt-16 max-w-7xl px-4 pb-20 sm:px-6 lg:px-8 lg:pb-28">
        <div className="mb-20 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[
            { key: 'warranty', icon: Shield, gradient: 'from-primary-600 to-primary-700' },
            { key: 'guarantee', icon: Award, gradient: 'from-primary-600 to-primary-400' },
            { key: 'lifetime', icon: Clock, gradient: 'from-primary-700 to-primary-500' },
            { key: 'testing', icon: Zap, gradient: 'from-primary-600 to-primary-700' },
            { key: 'customerFocus', icon: Users, gradient: 'from-primary-500 to-primary-700' },
            { key: 'original', icon: Star, gradient: 'from-primary-700 to-primary-500' },
          ].map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.key}
                className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-8 shadow-xl transition-all duration-500 hover:border-transparent hover:shadow-2xl"
                style={{ animationDelay: `${index * 75}ms` }}
              >
                {/* Gradient background on hover */}
                <div
                  className={`bg-linear-to-br absolute inset-0 ${item.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-5`}
                />

                {/* Icon */}
                <div className="relative mb-6">
                  <div
                    className={`bg-linear-to-br inline-flex h-14 w-14 items-center justify-center rounded-xl ${item.gradient} shadow-lg transition-transform duration-300 group-hover:scale-110`}
                  >
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                </div>

                {/* Content */}
                <div className="relative">
                  <h3 className="mb-3 text-2xl font-bold text-gray-900">
                    {t(`differentiators.${item.key}.title`)}
                  </h3>

                  <p className="leading-relaxed text-gray-600">
                    {t(`differentiators.${item.key}.description`)}
                  </p>
                </div>

                {/* Decorative corner */}
                <div className="bg-linear-to-br absolute right-0 top-0 h-24 w-24 rounded-bl-full from-gray-50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </div>
            );
          })}
        </div>

        {/* Key Features Section */}
        <div className="bg-linear-to-br mb-20 rounded-2xl from-gray-50 to-white p-10 shadow-lg lg:p-16">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-2 text-sm font-medium text-primary-700">
                <CheckCircle2 className="h-4 w-4" />
                {t('qualitySection.badge')}
              </div>

              <h2 className="mb-4 text-4xl font-bold text-gray-900">{t('qualitySection.title')}</h2>

              <p className="mb-6 text-lg leading-relaxed text-gray-600">
                {t('qualitySection.description')}
              </p>
            </div>

            <div className="grid gap-4">
              {[
                'compatibility',
                'certified',
                'nist',
                'production',
                'experience',
                'distribution',
              ].map((key, index) => (
                <div
                  key={key}
                  className="flex items-center gap-3 rounded-lg bg-white p-4 shadow-sm transition-shadow duration-300 hover:shadow-md"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="bg-linear-to-br flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg from-primary-500 to-primary-600">
                    <CheckCircle2 className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-medium text-gray-900">
                    {t(`qualitySection.features.${key}`)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-linear-to-br relative overflow-hidden rounded-2xl from-primary-600 to-primary-700 p-10 shadow-2xl lg:p-16">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
          <div className="absolute right-0 top-0 h-96 w-96 -translate-y-1/2 translate-x-1/2 rounded-full bg-white/10 blur-3xl" />

          <div className="relative flex flex-col items-center justify-between gap-8 lg:flex-row">
            <div className="text-center lg:text-left">
              <h2 className="mb-3 text-3xl font-bold text-white lg:text-4xl">{t('cta.title')}</h2>
              <p className="max-w-2xl text-lg text-primary-50">{t('cta.description')}</p>
            </div>

            <Link
              href="/company/contact-us"
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-xl bg-white px-8 py-4 font-semibold text-primary-600 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              {t('cta.button')}
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
