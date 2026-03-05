import { getServerAuth } from '@/lib/auth/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import UserProfileClient from './UserProfileClient';
import { getTranslations } from 'next-intl/server';

type SettingsPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function SettingsPage({ params }: SettingsPageProps) {
  const { locale } = await params;
  const t = await getTranslations('account.settings');
  const { user } = await getServerAuth();

  if (!user) {
    redirect(`/${locale}/sign-in`);
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <section className="w-full border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-container px-4 py-8 sm:px-6 lg:px-8 xl:px-12">
          <Link
            href={`/${locale}/account`}
            className="mb-6 inline-flex items-center gap-2 font-semibold text-primary-600 transition-colors hover:text-primary-700"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={2.5} />
            {t('backToDashboard')}
          </Link>
          <h1 className="text-3xl font-bold text-neutral-900 lg:text-4xl">{t('title')}</h1>
          <p className="mt-2 text-neutral-600">
            {t('subtitle')}
          </p>
        </div>
      </section>

      {/* Settings Content */}
      <section className="w-full py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
            {/* Clerk UserProfile Component (dynamically loaded) */}
            <UserProfileClient />
          </div>

          {/* Help Section */}
          <div className="mt-8 rounded-lg border border-primary-200 bg-primary-50 p-6">
            <h3 className="mb-2 font-bold text-primary-900">{t('help.title')}</h3>
            <p className="mb-4 text-sm text-primary-800">
              {t('help.description')}
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href={`/${locale}/support`}
                className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
              >
                {t('help.contactSupport')}
              </Link>
              <Link
                href={`/${locale}/resources`}
                className="inline-flex items-center justify-center rounded-lg border border-primary-300 px-4 py-2 text-sm font-semibold text-primary-700 transition-colors hover:bg-white"
              >
                {t('help.helpCenter')}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
