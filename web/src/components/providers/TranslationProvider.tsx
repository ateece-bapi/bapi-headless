'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { LanguageCode } from '@/types/region';
import { useLanguageCode } from '@/store/regionStore';

// Import all translations statically
import enMessages from '../../../messages/en.json';
import arMessages from '../../../messages/ar.json';
import deMessages from '../../../messages/de.json';
import frMessages from '../../../messages/fr.json';
import esMessages from '../../../messages/es.json';
import jaMessages from '../../../messages/ja.json';
import zhMessages from '../../../messages/zh.json';
import viMessages from '../../../messages/vi.json';

type Messages = Record<string, any>;
type TranslationContextType = {
  messages: Messages;
  locale: LanguageCode;
};

const allMessages: Record<LanguageCode, Messages> = {
  en: enMessages,
  ar: arMessages,
  de: deMessages,
  fr: frMessages,
  es: esMessages,
  ja: jaMessages,
  zh: zhMessages,
  vi: viMessages,
};

const TranslationContext = createContext<TranslationContextType | null>(null);

export function TranslationProvider({ children }: { children: ReactNode }) {
  const locale = useLanguageCode();
  const messages = allMessages[locale] || allMessages.en;

  return (
    <TranslationContext.Provider value={{ messages, locale }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslations(namespace?: string) {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslations must be used within TranslationProvider');
  }

  const { messages } = context;
  const namespaceMessages = namespace ? messages[namespace] || {} : messages;

  return (key: string, values?: Record<string, string | number>) => {
    let text = namespaceMessages[key] || key;
    
    // Simple variable substitution
    if (values) {
      Object.entries(values).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, String(v));
      });
    }
    
    return text;
  };
}
