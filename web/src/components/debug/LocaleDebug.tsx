'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useEffect } from 'react';

/**
 * DEBUG COMPONENT - Shows locale and translation status in browser console
 * TEMPORARY - Remove after fixing translation issue
 */
export function LocaleDebug() {
  const locale = useLocale();
  const t = useTranslations('nav');

  useEffect(() => {
    console.log('=== CLIENT-SIDE LocaleDebug ===');
    console.log('Current locale:', locale);
    console.log('nav.products translation:', t('products'));
    console.log('nav.support translation:', t('support'));
    console.log('nav.company translation:', t('company'));
    console.log('================================');
  }, [locale, t]);

  // Render nothing (just for logging)
  return null;
}
