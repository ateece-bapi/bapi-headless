import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getContactRepBio } from '@/lib/wordpress';
import { ALL_TEAM_MEMBERS } from '@/lib/constants/team';
import {
  PhoneIcon,
  MailIcon,
  MapPinIcon,
  ArrowLeftIcon,
  BuildingIcon,
} from '@/lib/icons';

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

/** Pre-build a static page for every known team member at deploy time. */
export async function generateStaticParams() {
  return ALL_TEAM_MEMBERS.map((member) => ({ slug: member.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const member = ALL_TEAM_MEMBERS.find((m) => m.slug === slug);
  if (!member) return {};

  const bio = await getContactRepBio(slug);
  const description =
    bio?.bioParagraphs[0]?.slice(0, 155) ??
    `Contact ${member.name}, ${member.title} at BAPI Sensors.`;

  return {
    title: `Contact ${member.name} — BAPI`,
    description,
  };
}

export default async function ContactRepPage({ params }: Props) {
  const { locale, slug } = await params;
  const member = ALL_TEAM_MEMBERS.find((m) => m.slug === slug);

  if (!member) {
    notFound();
  }

  // Fetch bio from WordPress at build time (SSG + ISR)
  const bio = await getContactRepBio(slug);

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Breadcrumb */}
      <div className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-3 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-neutral-500">
            <Link href={`/${locale}`} className="hover:text-primary-600">
              Home
            </Link>
            <span>/</span>
            <Link href={`/${locale}/contact`} className="hover:text-primary-600">
              Contact
            </Link>
            <span>/</span>
            <span className="text-neutral-900">{member.name}</span>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          href={`/${locale}/contact`}
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Sales Team
        </Link>

        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
          {/* Top colour bar */}
          <div className="h-2 bg-gradient-to-r from-primary-600 to-primary-500" />

          <div className="p-6 sm:p-8 lg:p-10">
            {/* Hero row: photo + key info */}
            <div className="flex flex-col gap-8 sm:flex-row sm:items-start">
              {/* Photo */}
              <div className="mx-auto w-48 flex-shrink-0 sm:mx-0 sm:w-56">
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-neutral-100 shadow-md">
                  <Image
                    src={member.photo}
                    alt={member.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 192px, 224px"
                    priority
                  />
                </div>
              </div>

              {/* Info */}
              <div className="flex-1">
                <h1 className="mb-1 text-3xl font-extrabold text-primary-700">{member.name}</h1>
                <p className="mb-4 text-base font-semibold text-neutral-700">{member.title}</p>

                <div className="mb-6 flex items-center gap-2">
                  <MapPinIcon className="h-4 w-4 flex-shrink-0 text-accent-500" />
                  <span className="rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-xs font-bold text-primary-700">
                    {member.region}
                  </span>
                </div>

                {/* Contact details */}
                <div className="mb-6 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50">
                      <PhoneIcon className="h-4 w-4 text-primary-600" />
                    </div>
                    <a
                      href={`tel:${member.phone.replace(/[^0-9+]/g, '')}`}
                      className="text-sm font-medium text-primary-600 hover:text-primary-700"
                    >
                      {member.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50">
                      <MailIcon className="h-4 w-4 text-primary-600" />
                    </div>
                    <a
                      href={`mailto:${member.email}`}
                      className="text-sm font-medium text-primary-600 hover:text-primary-700"
                    >
                      {member.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50">
                      <BuildingIcon className="h-4 w-4 text-primary-600" />
                    </div>
                    <span className="text-sm text-neutral-700">BAPI — Building Automation Products</span>
                  </div>
                </div>

                {/* CTA buttons */}
                <div className="flex flex-wrap gap-3">
                  <a
                    href={`mailto:${member.email}`}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-700"
                  >
                    <MailIcon className="h-4 w-4" />
                    Send Email
                  </a>
                  <a
                    href={`tel:${member.phone.replace(/[^0-9+]/g, '')}`}
                    className="inline-flex items-center gap-2 rounded-lg border-2 border-accent-500 bg-accent-500 px-5 py-2.5 text-sm font-semibold text-neutral-900 shadow-sm transition-colors hover:bg-accent-600"
                  >
                    <PhoneIcon className="h-4 w-4" />
                    Call Now
                  </a>
                </div>
              </div>
            </div>

            {/* Bio section — pulled from WordPress at build time */}
            {bio && bio.bioParagraphs.length > 0 && (
              <div className="mt-10 border-t border-neutral-100 pt-8">
                {/* Section heading with BAPI accent bar */}
                <div className="mb-6 flex items-center gap-3">
                  <div className="h-7 w-1 rounded-full bg-accent-500" />
                  <h2 className="text-xl font-bold text-neutral-900">About {member.name}</h2>
                </div>

                <div className="space-y-4">
                  {bio.bioParagraphs.map((paragraph, i) =>
                    i === 0 ? (
                      /* Lead paragraph — slightly larger, primary colour, left-border accent */
                      <p
                        key={i}
                        className="border-l-4 border-primary-200 pl-4 text-[1.05rem] font-medium leading-relaxed text-primary-800"
                      >
                        {paragraph}
                      </p>
                    ) : (
                      <p key={i} className="text-base leading-relaxed text-neutral-600">
                        {paragraph}
                      </p>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
