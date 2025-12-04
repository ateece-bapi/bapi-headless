import React from 'react';

interface ContactInfoProps {
  phone?: string;
  email?: string;
  helpUrl?: string;
}

export default function ContactInfo({ phone = "+1-608-735-4800", email = "info@bapihvac.com", helpUrl = "/contact" }: ContactInfoProps) {
  return (
    <div className="my-8 p-6 bg-primary-50 border-l-4 border-primary-600 rounded flex flex-col md:flex-row items-center gap-4 shadow-sm">
      <div className="flex-1 text-center md:text-left">
        <div className="text-lg font-semibold text-primary-700 mb-1">Need Help? Contact Us!</div>
        <div className="text-neutral-700">
          <span className="block md:inline">Call: <a href={`tel:${phone}`} className="underline text-primary-700">{phone}</a></span>
          <span className="hidden md:inline mx-2">|</span>
          <span className="block md:inline">Email: <a href={`mailto:${email}`} className="underline text-primary-700">{email}</a></span>
        </div>
      </div>
      <a href={helpUrl} className="bg-primary-600 text-white px-5 py-2 rounded font-medium hover:bg-primary-700 transition text-center">Contact Form</a>
    </div>
  );
}
