'use client';

import { useEffect } from 'react';

/**
 * Client component to dynamically set the lang attribute on the html element
 * Required for locale-aware pages in Next.js App Router
 */
export function HtmlLangAttribute({ locale }: { locale: string }) {
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale;
    }
  }, [locale]);

  return null;
}
