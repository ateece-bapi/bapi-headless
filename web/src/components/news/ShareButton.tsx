'use client';

import { useState } from 'react';
import { Share2Icon, LinkedinIcon, MailIcon, ExternalLinkIcon, CheckIcon } from '@/lib/icons';

interface ShareButtonProps {
  title: string;
  excerpt: string;
  url: string;
}

export default function ShareButton({ title, excerpt, url }: ShareButtonProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareLinks = {
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}&via=BAPIProducts`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${excerpt}\n\nRead more: ${url}`)}`,
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: excerpt,
          url,
        });
        setShowDropdown(false);
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('Share failed:', error);
        }
      }
    }
  };

  return (
    <div className="relative">
      {/* Primary LinkedIn Share Button */}
      <div className="flex items-center gap-3">
        <a
          href={shareLinks.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg bg-[#0077B5] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[#006399] hover:shadow-lg"
          aria-label="Share on LinkedIn"
        >
          <LinkedinIcon className="h-5 w-5" />
          Share on LinkedIn
        </a>

        {/* More Options Button */}
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="inline-flex items-center gap-2 rounded-lg border-2 border-neutral-200 bg-white px-4 py-3 text-sm font-medium text-neutral-700 transition-all hover:border-neutral-300 hover:bg-neutral-50"
          aria-label="More share options"
        >
          <Share2Icon className="h-4 w-4" />
          More
        </button>
      </div>

      {/* Dropdown Menu */}
      {showDropdown && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowDropdown(false)}
          />

          {/* Menu */}
          <div className="absolute right-0 top-full z-20 mt-2 w-64 rounded-xl border border-neutral-200 bg-white shadow-xl">
            <div className="p-2">
              {/* Twitter */}
              <a
                href={shareLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100"
                onClick={() => setShowDropdown(false)}
              >
                <Share2Icon className="h-5 w-5 text-[#1DA1F2]" />
                Share on Twitter
              </a>

              {/* Facebook */}
              <a
                href={shareLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100"
                onClick={() => setShowDropdown(false)}
              >
                <Share2Icon className="h-5 w-5 text-[#1877F2]" />
                Share on Facebook
              </a>

              {/* Email */}
              <a
                href={shareLinks.email}
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100"
                onClick={() => setShowDropdown(false)}
              >
                <MailIcon className="h-5 w-5 text-neutral-500" />
                Share via Email
              </a>

              {/* Copy Link */}
              <button
                onClick={handleCopyLink}
                className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100"
              >
                {copied ? (
                  <>
                    <CheckIcon className="h-5 w-5 text-green-500" />
                    Link Copied!
                  </>
                ) : (
                  <>
                    <ExternalLinkIcon className="h-5 w-5 text-neutral-500" />
                    Copy Link
                  </>
                )}
              </button>

              {/* Native Share (if available) */}
              {typeof navigator !== 'undefined' && 'share' in navigator && (
                <>
                  <div className="my-2 border-t border-neutral-200" />
                  <button
                    onClick={handleNativeShare}
                    className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100"
                  >
                    <Share2Icon className="h-5 w-5 text-neutral-500" />
                    More Options...
                  </button>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
