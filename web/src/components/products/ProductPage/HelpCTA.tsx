'use client';

import React from 'react';
import { MessageCircle, Phone, Mail } from 'lucide-react';

interface HelpCTAProps {
  className?: string;
}

/**
 * Help and support call-to-action component
 *
 * Provides prominent contact options for customers who need assistance.
 * Improves conversion by reducing purchase anxiety.
 */
export default function HelpCTA({ className = '' }: HelpCTAProps) {
  return (
    <div
      className={`rounded-xl border border-primary-200 bg-gradient-to-r from-primary-50 to-primary-100 p-6 ${className}`}
    >
      <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
        <div className="flex-1 text-center md:text-left">
          <h3 className="mb-2 text-xl font-bold text-neutral-900">
            Need Help Choosing the Right Product?
          </h3>
          <p className="mb-4 text-neutral-700">
            Our technical experts are here to help you select the perfect sensor for your HVAC
            application. Get personalized recommendations and answers to all your questions.
          </p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row md:justify-start">
            <a
              href="tel:+16507354800"
              className="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-6 py-3 font-semibold text-white shadow transition hover:bg-primary-600 focus:outline-none focus:ring-4 focus:ring-primary-500/50"
            >
              <Phone className="h-5 w-5" />
              Call +1 (650) 735-4800
            </a>
            <a
              href="mailto:info@bapihvac.com"
              className="inline-flex items-center gap-2 rounded-lg border-2 border-primary-500 bg-white px-6 py-3 font-semibold text-primary-600 shadow-sm transition hover:bg-primary-50 focus:outline-none focus:ring-4 focus:ring-primary-500/50"
            >
              <Mail className="h-5 w-5" />
              Email Support
            </a>
          </div>
        </div>
        <div className="flex-shrink-0">
          <div className="rounded-full bg-white p-6 shadow-lg">
            <MessageCircle className="h-12 w-12 text-primary-600" strokeWidth={1.5} />
          </div>
        </div>
      </div>
    </div>
  );
}
