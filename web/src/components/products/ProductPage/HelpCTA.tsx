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
    <div className={`bg-gradient-to-r from-primary-50 to-primary-100 border border-primary-200 rounded-xl p-6 ${className}`}>
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-xl font-bold text-neutral-900 mb-2">
            Need Help Choosing the Right Product?
          </h3>
          <p className="text-neutral-700 mb-4">
            Our technical experts are here to help you select the perfect sensor for your HVAC application.
            Get personalized recommendations and answers to all your questions.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
            <a
              href="tel:+16507354800"
              className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-semibold px-6 py-3 rounded-lg shadow transition focus:outline-none focus:ring-4 focus:ring-primary-500/50"
            >
              <Phone className="w-5 h-5" />
              Call +1 (650) 735-4800
            </a>
            <a
              href="mailto:info@bapihvac.com"
              className="inline-flex items-center gap-2 bg-white border-2 border-primary-500 text-primary-600 hover:bg-primary-50 font-semibold px-6 py-3 rounded-lg shadow-sm transition focus:outline-none focus:ring-4 focus:ring-primary-500/50"
            >
              <Mail className="w-5 h-5" />
              Email Support
            </a>
          </div>
        </div>
        <div className="flex-shrink-0">
          <div className="bg-white rounded-full p-6 shadow-lg">
            <MessageCircle className="w-12 h-12 text-primary-600" strokeWidth={1.5} />
          </div>
        </div>
      </div>
    </div>
  );
}
