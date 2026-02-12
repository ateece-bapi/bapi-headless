'use client';

import { useTranslations, useLocale } from 'next-intl';

export function TranslationTest() {
  const locale = useLocale();
  const t = useTranslations('megaMenu');

  return (
    <div className="fixed bottom-4 right-4 z-50 rounded-lg bg-yellow-200 p-4 text-sm shadow-lg">
      <div>
        <strong>Current Locale:</strong> {locale}
      </div>
      <div>
        <strong>Products Label:</strong> {t('products.label')}
      </div>
      <div>
        <strong>Resources Label:</strong> {t('resources.label')}
      </div>
    </div>
  );
}
