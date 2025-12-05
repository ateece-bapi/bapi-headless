import React from 'react';

export default function ContactInfo() {
  return (
    <section className="my-8 p-4 bg-blue-50 rounded text-blue-900">
      <h2 className="text-lg font-semibold mb-2">Need Help? Contact Us!</h2>
      <p>Call: +1 608-735-4800 | Email: info@bapihvac.com</p>
      <a href="/contact" className="mt-2 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Contact Form</a>
    </section>
  );
}
