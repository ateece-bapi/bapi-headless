import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { DownloadIcon, FileTextIcon, MailIcon } from '@/lib/icons';
import PageHeader from '@/components/layout/PageHeader';

const CATALOG_URL =
  'https://bapiheadlessstaging.kinsta.cloud/wp-content/uploads/BAPI_Catalog_2026_Full_Web.pdf';
const CATALOG_COVER_URL =
  'https://bapiheadlessstaging.kinsta.cloud/wp-content/uploads/BAPI_Catalog_2026_Full_Web-pdf.jpg';

export const metadata: Metadata = {
  title: '2026 Product Catalog',
  description:
    'View and download the 2026 BAPI product catalog for building automation sensors and controls.',
};

/** Displays the current BAPI product catalog and related sales resources. */
export default function CatalogPricebookPage() {
  return (
    <div className="min-h-screen bg-white">
      <PageHeader
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Product Catalog' }]}
        title="2026 Product Catalog"
        description="Explore BAPI sensors, controls, accessories, specifications, and ordering information."
        spacing="compact"
      />

      <section className="py-10 sm:py-12 lg:py-14">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 md:grid-cols-[minmax(18rem,26rem)_minmax(0,1fr)] md:items-center lg:gap-16 lg:px-8">
          <div className="order-2 mx-auto w-full max-w-sm md:order-1 md:max-w-none">
            <a
              href={CATALOG_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="Open the 2026 BAPI product catalog PDF"
              className="group block border border-neutral-200 bg-neutral-100 p-3 shadow-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-500"
            >
              <Image
                src={CATALOG_COVER_URL}
                alt="Cover of the 2026 BAPI full product catalog"
                width={1088}
                height={1408}
                priority
                quality={85}
                sizes="(min-width: 768px) 416px, calc(100vw - 56px)"
                className="h-auto w-full transition-opacity group-hover:opacity-90"
              />
            </a>
            <p className="mt-3 text-center text-sm text-neutral-600">
              Select the cover to open the full catalog.
            </p>
          </div>

          <div className="order-1 mx-auto w-full max-w-xl md:order-2">
            <p className="mb-3 text-sm font-bold uppercase tracking-wide text-primary-600">
              Latest edition
            </p>
            <h2 className="text-3xl font-bold text-neutral-900">BAPI Product Catalog 2026</h2>
            <p className="mt-4 text-lg leading-relaxed text-neutral-700">
              Browse BAPI&apos;s complete product lineup, including temperature, humidity, air
              quality, pressure, wireless, and accessory solutions.
            </p>

            <dl className="my-8 divide-y divide-neutral-200 border-y border-neutral-200">
              <div className="flex justify-between gap-6 py-4">
                <dt className="text-neutral-700">Edition</dt>
                <dd className="font-semibold text-neutral-900">2026</dd>
              </div>
              <div className="flex justify-between gap-6 py-4">
                <dt className="text-neutral-700">Format</dt>
                <dd className="font-semibold text-neutral-900">PDF, 30.6 MB</dd>
              </div>
            </dl>

            <div className="space-y-3">
              <a
                href={CATALOG_URL}
                download
                className="flex w-full items-center justify-center gap-2 bg-accent-500 px-6 py-3 font-bold text-neutral-900 transition-colors hover:bg-accent-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
              >
                <DownloadIcon className="h-5 w-5" aria-hidden="true" />
                Download 2026 Catalog
              </a>
              <a
                href={CATALOG_URL}
                target="_blank"
                rel="noreferrer"
                className="flex w-full items-center justify-center gap-2 border-2 border-primary-500 px-6 py-3 font-bold text-primary-600 transition-colors hover:bg-primary-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
              >
                <FileTextIcon className="h-5 w-5" aria-hidden="true" />
                Open Catalog in New Tab
              </a>
            </div>

            <div className="mt-8 border-l-4 border-accent-500 bg-neutral-50 p-5">
              <h3 className="font-bold text-neutral-900">Need pricing or a printed catalog?</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-700">
                Pricing is available from your BAPI sales representative. Contact our team for a
                quote or to request a printed copy.
              </p>
              <Link
                href="/contact"
                className="mt-4 inline-flex items-center gap-2 font-bold text-primary-600 hover:text-primary-700"
              >
                <MailIcon className="h-5 w-5" aria-hidden="true" />
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-neutral-200 bg-neutral-50 py-12">
        <div className="mx-auto max-w-content px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-neutral-900">Looking for product documents?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-neutral-700">
            Search installation instructions, technical drawings, and operation manuals in the
            documentation library.
          </p>
          <Link
            href="/resources/datasheets"
            className="mt-6 inline-flex items-center gap-2 bg-primary-500 px-6 py-3 font-bold text-white transition-colors hover:bg-primary-600"
          >
            Browse Product Documents
          </Link>
        </div>
      </section>
    </div>
  );
}