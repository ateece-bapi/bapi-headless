import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  robots: 'noindex, nofollow',
};

/**
 * Blu-View Banner Ad #3
 *
 * Unlisted page for the Blu-View app banner ad system.
 * The app fetches this URL, locates the banner image, and parses
 * the image filename to determine the destination link URL.
 *
 * To swap campaigns: replace the image file and rename it to the destination
 * page slug (e.g. "wireless.webp" → bapisensors.com/wireless).
 * TODO: Replace wireless.jpg with the actual campaign image when assigned.
 */
export default function BluViewAdThree() {
  return (
    <main>
      <Image
        src="/images/blu-view-ads/wireless.jpg"
        alt="Blu-View Banner Ad"
        width={1200}
        height={400}
        priority
      />
    </main>
  );
}
