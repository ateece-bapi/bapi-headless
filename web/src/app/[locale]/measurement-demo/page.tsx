import { Metadata } from 'next';
import MeasurementDemo from '@/components/examples/MeasurementDemo';

export const metadata: Metadata = {
  title: 'Measurement Unit Conversion Demo | BAPI',
  description: 'Demonstration of region-aware measurement unit conversion for product specifications.',
};

export default function MeasurementDemoPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 py-12">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold text-neutral-900">
            Measurement Unit Localization
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-neutral-600">
            Automatic conversion of temperature, dimensions, and weight based on user region and locale
          </p>
        </div>
        
        <MeasurementDemo />

        <div className="mt-8 rounded-xl bg-white p-6 shadow-lg">
          <h2 className="mb-4 text-xl font-bold text-neutral-900">Implementation Notes</h2>
          <ul className="list-disc space-y-2 pl-6 text-neutral-700">
            <li>
              <strong>US region (en-US):</strong> Uses Fahrenheit, inches, pounds, feet
            </li>
            <li>
              <strong>EU region (de, fr, es, etc.):</strong> Uses Celsius, centimeters, kilograms, meters
            </li>
            <li>
              <strong>Asia region (ja, zh, vi, etc.):</strong> Uses Celsius, centimeters, kilograms, meters
            </li>
            <li>
              <strong>MENA region (ar):</strong> Uses Celsius, centimeters, kilograms, meters
            </li>
            <li>
              All conversions respect locale-specific number formatting (decimal comma vs period)
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}
