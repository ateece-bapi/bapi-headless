import { Metadata } from 'next';
import Image from 'next/image';
import { getPageBySlug } from '@/lib/wordpress';
import PageHeader from '@/components/layout/PageHeader';
import { Link } from '@/lib/navigation';
import {
  TargetIcon,
  EyeIcon,
  UsersIcon,
  SettingsIcon,
  LightbulbIcon,
  HandshakeIcon,
  ShieldIcon,
  ArrowRightIcon,
  StarIcon,
} from '@/lib/icons';
import { getTranslations } from 'next-intl/server';
import { locales } from '@/i18n';

// Generate static params for all locales - ensures each locale is built separately
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('companyPages.missionValues.metadata');
  return {
    title: t('title'),
    description: t('description'),
  };
}

// ISR with 1-hour revalidation for mission/values page (rarely updated)
export const revalidate = 3600;

export default async function MissionValuesPage() {
  const page = await getPageBySlug('mission-and-values');
  const t = await getTranslations('companyPages.missionValues');
  const breadcrumbs = [
    { label: t('breadcrumb.home'), href: '/' },
    { label: t('breadcrumb.company'), href: '/company' },
    { label: t('breadcrumb.missionValues') },
  ];

  if (!page) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="mb-4 text-4xl font-bold text-gray-900">{t('hero.title')}</h1>
        <p className="text-lg text-gray-600">Content not found.</p>
      </div>
    );
  }

  return (
    <div className="bg-linear-to-br min-h-screen from-slate-50 via-white to-primary-50/30">
      <PageHeader
        breadcrumbs={breadcrumbs}
        title={t('hero.title')}
        description={t('hero.description')}
        spacing="default"
        eyebrow={
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
            <StarIcon className="h-4 w-4" />
            {t('hero.badge')}
          </div>
        }
      />

      {/* Mission & Vision Cards - overlaps hero bottom edge, matching Figma */}
      <section className="relative z-10 mx-auto -mt-8 max-w-7xl px-4 pb-20 sm:px-6 lg:-mt-12 lg:px-8 lg:pb-28">
        <div className="mb-20 grid gap-8 md:grid-cols-2">
          {/* Mission Card */}
          <div className="group relative overflow-hidden rounded-2xl border border-gray-100 border-t-4 border-t-accent-500 bg-white p-10 shadow-xl transition-all duration-500 hover:shadow-2xl">
            <div className="bg-linear-to-br absolute right-0 top-0 h-64 w-64 -translate-y-1/2 translate-x-1/2 rounded-full from-primary-50 to-transparent" />

            <div className="relative">
              <div className="bg-linear-to-br mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl from-primary-600 to-primary-700 shadow-lg transition-transform duration-300 group-hover:scale-110">
                <TargetIcon className="h-8 w-8 text-white" />
              </div>

              <h2 className="mb-4 text-3xl font-bold text-gray-900">{t('mission.title')}</h2>

              <p className="text-lg leading-relaxed text-gray-700">{t('mission.description')}</p>
            </div>
          </div>

          {/* Vision Card */}
          <div className="group relative overflow-hidden rounded-2xl border border-gray-100 border-t-4 border-t-accent-500 bg-white p-10 shadow-xl transition-all duration-500 hover:shadow-2xl">
            <div className="bg-linear-to-br absolute right-0 top-0 h-64 w-64 -translate-y-1/2 translate-x-1/2 rounded-full from-primary-50 to-transparent" />

            <div className="relative">
              <div className="bg-linear-to-br mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl from-primary-600 to-primary-400 shadow-lg transition-transform duration-300 group-hover:scale-110">
                <EyeIcon className="h-8 w-8 text-white" />
              </div>

              <h2 className="mb-4 text-3xl font-bold text-gray-900">{t('vision.title')}</h2>

              <p className="text-lg leading-relaxed text-gray-700">{t('vision.description')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* People. Building. Sensors. */}
      {t.has('introduction') && (
        <section className="bg-gray-50 py-20">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-5 lg:items-center lg:px-8">
            {/* Single flattened collage exported from Figma (801x404) — pixel-perfect match */}
            <div className="relative aspect-[801/404] overflow-hidden rounded-2xl lg:col-span-3">
              <Image
                src="/images/mission/Frame_1692.png"
                alt="BAPI team members across departments"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
            </div>

            <div className="lg:col-span-2">
              {t.has('peopleBuildingSensors.title') && (
                <h2 className="mb-4 text-3xl font-bold text-primary-600 lg:text-4xl">
                  {t('peopleBuildingSensors.title')}
                </h2>
              )}
              <p className="text-lg leading-relaxed text-gray-700">{t('introduction')}</p>
            </div>
          </div>
        </section>
      )}

      {/* Core Values Section */}
      <section className="relative mx-auto max-w-7xl px-4 pt-20 pb-20 sm:px-6 lg:px-8 lg:pb-28">
        {/* Values Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[
            { key: 'employees', icon: UsersIcon, gradient: 'from-primary-500 to-primary-700' },
            { key: 'quality', icon: SettingsIcon, gradient: 'from-primary-600 to-primary-700' },
            { key: 'innovation', icon: LightbulbIcon, gradient: 'from-primary-600 to-primary-400' },
            { key: 'partnership', icon: HandshakeIcon, gradient: 'from-primary-700 to-primary-500' },
            { key: 'integrity', icon: ShieldIcon, gradient: 'from-primary-600 to-primary-700' },
          ].map((value, index) => {
            const Icon = value.icon;
            return (
              <div
                key={value.key}
                className="group relative overflow-hidden rounded-2xl border border-gray-100 border-t-4 border-t-accent-500 bg-white p-8 shadow-sm transition-all duration-500 hover:shadow-2xl"
                style={{ animationDelay: `${index * 75}ms` }}
              >
                {/* Gradient background on hover */}
                <div
                  className={`bg-linear-to-br absolute inset-0 ${value.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-5`}
                />

                {/* Icon */}
                <div className="relative mb-6">
                  <div
                    className={`bg-linear-to-br inline-flex h-14 w-14 items-center justify-center rounded-xl ${value.gradient} shadow-lg transition-transform duration-300 group-hover:scale-110`}
                  >
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                </div>

                {/* Content */}
                <div className="relative">
                  <h3 className="mb-3 text-2xl font-bold text-gray-900">
                    {t(`coreValuesSection.${value.key}.title`)}
                  </h3>

                  <p className="leading-relaxed text-gray-600">
                    {t(`coreValuesSection.${value.key}.description`)}
                  </p>
                </div>

                {/* Decorative corner */}
                <div className="bg-linear-to-br absolute right-0 top-0 h-24 w-24 rounded-bl-full from-gray-50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="bg-bapi-primary-gradient relative mt-20 overflow-hidden rounded-2xl border-t-4 border-accent-500 p-10 shadow-2xl lg:p-16">
          <div className="absolute inset-0 bg-[url('/images/patterns/grid.svg')] opacity-10" />

          <div className="relative flex flex-col items-center justify-between gap-8 lg:flex-row">
            <div className="text-center lg:text-left">
              <h2 className="mb-3 text-3xl font-bold text-white lg:text-4xl">{t('cta.title')}</h2>
              <p className="max-w-2xl text-lg text-primary-50">{t('cta.description')}</p>
            </div>

            <Link
              href="/company/careers"
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-xl bg-white px-8 py-4 font-semibold text-primary-600 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              {t('cta.button')}
              <ArrowRightIcon className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
