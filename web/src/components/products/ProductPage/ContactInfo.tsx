import React from 'react';

export default function ContactInfo() {
  return (
    <section className="my-8 rounded bg-blue-50 p-4 text-blue-900">
      <h2 className="mb-2 text-lg font-semibold">Need Help? Contact Us!</h2>
      <p>Call: +1 608-735-4800 | Email: info@bapihvac.com</p>
      <a
        href="/contact"
        className="mt-2 inline-block rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
      >
        Contact Form
      </a>
    </section>
  );
}
