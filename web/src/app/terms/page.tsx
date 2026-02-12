import { Metadata } from 'next';
import { FileText } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms & Conditions | BAPI',
  description: 'BAPI terms and conditions of use for our website and services.',
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="bg-gradient-to-r from-primary-700 via-primary-500 to-primary-700 py-16 text-white">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <FileText className="mx-auto mb-4 h-16 w-16" />
            <h1 className="mb-4 text-4xl font-bold sm:text-5xl">Terms & Conditions</h1>
            <p className="mx-auto max-w-content text-xl text-primary-50">
              Last updated: January 30, 2026
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="prose prose-lg mx-auto max-w-content max-w-none px-4 sm:px-6 lg:px-8">
          <p className="text-lg text-neutral-700">
            Please read these terms and conditions carefully before using our website or purchasing
            products from Building Automation Products Inc. (&quot;BAPI&quot;).
          </p>

          <h2 className="mb-4 mt-8 text-2xl font-bold text-neutral-900">Use of Website</h2>
          <p className="text-neutral-700">
            By accessing this website, you agree to be bound by these terms and conditions. If you
            disagree with any part of these terms, you may not access the website.
          </p>

          <h2 className="mb-4 mt-8 text-2xl font-bold text-neutral-900">Product Information</h2>
          <p className="text-neutral-700">
            BAPI strives to provide accurate product information and specifications. However, we do
            not warrant that product descriptions or other content is accurate, complete, reliable,
            current, or error-free.
          </p>

          <h2 className="mb-4 mt-8 text-2xl font-bold text-neutral-900">Pricing</h2>
          <p className="text-neutral-700">
            All prices are subject to change without notice. Pricing shown on this website is for
            reference only. Contact us for current pricing and quotes.
          </p>

          <h2 className="mb-4 mt-8 text-2xl font-bold text-neutral-900">Warranty</h2>
          <p className="text-neutral-700">
            BAPI products are covered by our standard warranty. Full warranty details are provided
            with each product and are available upon request.
          </p>

          <h2 className="mb-4 mt-8 text-2xl font-bold text-neutral-900">Limitation of Liability</h2>
          <p className="text-neutral-700">
            To the maximum extent permitted by law, BAPI shall not be liable for any indirect,
            incidental, special, consequential, or punitive damages resulting from your use of or
            inability to use the website or products.
          </p>

          <h2 className="mb-4 mt-8 text-2xl font-bold text-neutral-900">Contact Information</h2>
          <p className="text-neutral-700">Questions about these Terms should be sent to us at:</p>
          <p className="text-neutral-700">
            Email: sales@bapihvac.com
            <br />
            Phone: (715) 856-1203
            <br />
            Address: 750 North Royal Avenue, Gays Mills, WI 54631
          </p>
        </div>
      </section>
    </main>
  );
}
