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
import thMessages from '../../../messages/th.json';
import plMessages from '../../../messages/pl.json';
import hiMessages from '../../../messages/hi.json';

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
  th: thMessages,
  pl: plMessages,
  hi: hiMessages,
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
    // Handle nested keys like "sections.products.title"
    const keyParts = key.split('.');
    let text: any = namespaceMessages;
    
    for (const part of keyParts) {
      if (text && typeof text === 'object' && part in text) {
        text = text[part];
      } else {
        // Key not found, return the full key as fallback
        text = key;
        break;
      }
    }
    
    // Ensure text is a string
    if (typeof text !== 'string') {
      text = key;
    }
    
    // Simple variable substitution
    if (values && typeof text === 'string') {
      Object.entries(values).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, String(v));
      });
    }
    
    return text;
  };
}
