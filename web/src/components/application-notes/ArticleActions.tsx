'use client';

import { Share2, Printer } from 'lucide-react';
import logger from '@/lib/logger';

interface ArticleActionsProps {
  title: string;
}

export function ArticleActions({ title }: ArticleActionsProps) {
  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          url: window.location.href,
        });
      } catch (error) {
        // User cancelled share or share failed
        logger.debug('Share cancelled or failed');
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      } catch (error) {
        logger.error('Failed to copy link', error);
      }
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handlePrint}
        className="rounded-lg p-2 text-neutral-600 transition-colors hover:bg-primary-50 hover:text-primary-600"
        aria-label="Print article"
        title="Print"
      >
        <Printer className="h-4 w-4" />
      </button>
      <button
        onClick={handleShare}
        className="rounded-lg p-2 text-neutral-600 transition-colors hover:bg-primary-50 hover:text-primary-600"
        aria-label="Share article"
        title="Share"
      >
        <Share2 className="h-4 w-4" />
      </button>
    </div>
  );
}
