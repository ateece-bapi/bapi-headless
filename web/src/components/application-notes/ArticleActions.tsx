'use client';

import { Share2, Printer } from 'lucide-react';

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
        console.log('Share cancelled or failed');
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      } catch (error) {
        console.error('Failed to copy link');
      }
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handlePrint}
        className="p-2 text-neutral-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
        aria-label="Print article"
        title="Print"
      >
        <Printer className="w-4 h-4" />
      </button>
      <button
        onClick={handleShare}
        className="p-2 text-neutral-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
        aria-label="Share article"
        title="Share"
      >
        <Share2 className="w-4 h-4" />
      </button>
    </div>
  );
}
