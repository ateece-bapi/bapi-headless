import { Metadata } from 'next';
import Image from 'next/image';
import PageHeader from '@/components/layout/PageHeader';
import {
  BriefcaseIcon,
  HeartIcon,
  TrendingUpIcon,
  ShieldIcon,
  PlaneIcon,
  GraduationCapIcon,
  DollarSignIcon,
  MailIcon,
  ExternalLinkIcon,
  SparklesIcon,
} from '@/lib/icons';
import { getTranslations } from 'next-intl/server';
import { locales } from '@/i18n';

const CAREERS_PORTAL_URL =
  'https://recruiting.paylocity.com/recruiting/jobs/All/4a238b5c-6067-4d66-a2a9-c9e0cf5b58c9/Building-Automation-Products-Inc';

// Photo collage shown beneath the hero, ordered/positioned to match the approved Figma layout
const galleryImages = [
  {
    src: '/images/careers/Production_WaveSoldering_1 2.png',
    alt: 'BAPI production technician working with wave soldering equipment',
    className: 'sm:col-start-1 sm:row-start-1 sm:row-span-2',
  },
  {
    src: '/images/careers/Cross_Functional_1 4.png',
    alt: 'Cross-functional BAPI team collaborating in a conference room',
    className: 'sm:col-start-2 sm:col-span-2 sm:row-start-1',
  },
  {
    src: '/images/careers/Techs_2 4.png',
    alt: 'BAPI technicians reviewing equipment together',
    className: 'sm:col-start-4 sm:row-start-1',
  },
  {
    src: '/images/careers/IT_Dept_1 3.png',
    alt: 'BAPI IT department staff collaborating',
    className: 'sm:col-start-5 sm:row-start-1',
  },
  {
    src: '/images/careers/Engineering_2 3.png',
    alt: 'BAPI engineering team reviewing data on monitors',
    className: 'sm:col-start-2 sm:row-start-2',
  },
  {
    src: '/images/careers/Customer_Service_2 2.png',
    alt: 'BAPI customer service representatives assisting customers',
    className: 'sm:col-start-3 sm:row-start-2',
  },
  {
    src: '/images/careers/Mechanical_Engineering_1 3.png',
    alt: 'BAPI mechanical engineers inspecting a circuit board assembly',
    className: 'sm:col-start-4 sm:col-span-2 sm:row-start-2',
  },
];

// Generate static params for all locales - ensures each locale is built separately
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// ISR with 1-hour revalidation for careers page (moderately updated)
export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('companyPages.careers.metadata');
  return {
    title: t('title'),
    description: t('description'),
  };
}

const benefitCards = [
  { key: 'healthInsurance', icon: ShieldIcon },
  { key: 'compensation', icon: DollarSignIcon },
  { key: 'paidHolidays', icon: PlaneIcon },
  { key: 'retirement', icon: TrendingUpIcon },
  { key: 'lifeInsurance', icon: HeartIcon },
  { key: 'development', icon: GraduationCapIcon },
];

export default async function CareersPage() {
  const t = await getTranslations('companyPages.careers');
  const breadcrumbs = [
    { label: t('breadcrumb.home'), href: '/' },
    { label: t('breadcrumb.company'), href: '/company' },
    { label: t('breadcrumb.careers') },
  ];

  return (
    <div className="bg-linear-to-br min-h-screen from-slate-50 via-white to-primary-50/30">
      <PageHeader
        breadcrumbs={breadcrumbs}
        title={t('hero.title')}
        description={t('hero.description')}
        spacing="large"
        eyebrow={
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
              <BriefcaseIcon className="h-4 w-4" />
              {t('hero.badge')}
          </div>
        }
      >
        <div className="mt-8 inline-flex items-center gap-2 rounded-lg bg-white/10 px-6 py-3 backdrop-blur-sm">
              <SparklesIcon className="h-5 w-5 text-yellow-300" />
              <span className="font-medium text-white">{t('hero.tagline')}</span>
        </div>
      </PageHeader>

      {/* Photo Collage */}
      <div className="relative z-10 mx-auto -mt-16 max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-2 overflow-hidden rounded-2xl border-4 border-primary-500 bg-white shadow-2xl sm:h-[420px] sm:grid-cols-5 sm:grid-rows-2">
          {galleryImages.map((image) => (
            <div
              key={image.src}
              className={`relative aspect-square sm:aspect-auto ${image.className}`}
            >
              <Image
                src={encodeURI(image.src)}
                alt={image.alt}
                fill
                sizes="(min-width: 640px) 20vw, 50vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      <section className="relative mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6 lg:px-8">
        {/* How to Apply */}
        <div className="mb-20 rounded-2xl bg-primary-50/70 p-6 sm:p-10 lg:p-12">
          <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 text-center shadow-lg lg:p-12">
            <h2 className="mb-6 text-4xl font-bold text-gray-900">{t('howToApply.title')}</h2>
            <p className="mb-6 leading-relaxed text-gray-700">{t('howToApply.intro')}</p>
            <p className="mb-6 leading-relaxed text-gray-700">
              <strong>{t('howToApply.noteLabel')}</strong> {t('howToApply.note')}
            </p>
            <p className="mb-8 leading-relaxed text-gray-700">{t('howToApply.citizenship')}</p>

            <a
              href={CAREERS_PORTAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mb-8 inline-flex items-center gap-2 rounded-lg bg-primary-600 px-8 py-4 font-semibold text-white transition-colors duration-300 hover:bg-primary-700"
            >
              {t('howToApply.viewOpenings')}
              <ExternalLinkIcon className="h-5 w-5" />
            </a>

            <p className="text-sm leading-relaxed text-gray-500">{t('howToApply.eoeStatement')}</p>
          </div>
        </div>

        {/* More Than Just a Job */}
        <div className="mb-20">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900">{t('cultureSection.title')}</h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              {t('cultureSection.description')}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {benefitCards.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={benefit.key}
                  className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-md"
                >
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary-600">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-gray-900">
                    {t(`benefits.${benefit.key}.title`)}
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-600">
                    {t(`benefits.${benefit.key}.description`)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="rounded-2xl bg-primary-600 p-8 text-center text-white lg:p-12">
          <p className="mb-4 text-lg font-semibold">{t('applicationProcess.contactTitle')}</p>
          <a
            href="mailto:careers@bapihvac.com"
            className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-primary-600 transition-all duration-300 hover:shadow-lg"
          >
            <MailIcon className="h-5 w-5" />
            {t('applicationProcess.email')}
          </a>
        </div>
      </section>
    </div>
  );
}
