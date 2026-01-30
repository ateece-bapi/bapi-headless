import { Metadata } from 'next';
import { FileText } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy | BAPI',
  description: 'BAPI privacy policy - how we collect, use, and protect your personal information.',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="bg-gradient-to-r from-primary-700 via-primary-500 to-primary-700 text-white py-16">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <FileText className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Privacy Policy
            </h1>
            <p className="text-xl max-w-content mx-auto text-primary-50">
              Last updated: January 30, 2026
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 prose prose-lg max-w-none">
          <p className="text-lg text-neutral-700">
            Building Automation Products Inc. (&quot;BAPI,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) respects your privacy 
            and is committed to protecting your personal information. This Privacy Policy explains how we 
            collect, use, disclose, and safeguard your information when you visit our website or use our services.
          </p>

          <h2 className="text-2xl font-bold text-neutral-900 mt-8 mb-4">Information We Collect</h2>
          <p className="text-neutral-700">
            We collect information that you provide directly to us, including name, email address, phone number, 
            company information, and any other information you choose to provide when contacting us or requesting quotes.
          </p>

          <h2 className="text-2xl font-bold text-neutral-900 mt-8 mb-4">How We Use Your Information</h2>
          <ul className="list-disc pl-6 text-neutral-700 space-y-2">
            <li>Respond to your inquiries and provide customer support</li>
            <li>Process quotes and orders</li>
            <li>Send you technical documentation and product updates</li>
            <li>Improve our website and services</li>
            <li>Comply with legal obligations</li>
          </ul>

          <h2 className="text-2xl font-bold text-neutral-900 mt-8 mb-4">Information Sharing</h2>
          <p className="text-neutral-700">
            We do not sell, trade, or rent your personal information to third parties. We may share your 
            information with service providers who assist us in operating our website and conducting our business.
          </p>

          <h2 className="text-2xl font-bold text-neutral-900 mt-8 mb-4">Contact Us</h2>
          <p className="text-neutral-700">
            If you have questions about this Privacy Policy, please contact us at:
          </p>
          <p className="text-neutral-700">
            Email: sales@bapihvac.com<br />
            Phone: (715) 856-1203<br />
            Address: 750 North Royal Avenue, Gays Mills, WI 54631
          </p>
        </div>
      </section>
    </main>
  );
}
