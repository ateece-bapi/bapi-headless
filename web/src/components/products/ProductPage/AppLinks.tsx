import React from 'react';

interface AppLinksProps {
  iosUrl?: string;
  androidUrl?: string;
}

export default function AppLinks({ iosUrl, androidUrl }: AppLinksProps) {
  if (!iosUrl && !androidUrl) return null;
  return (
    <div className="flex gap-4 my-6">
      {iosUrl && (
        <a href={iosUrl} target="_blank" rel="noopener noreferrer">
          <img
            src="/app-store-badge.svg"
            alt="Download on the App Store"
            className="h-12"
          />
        </a>
      )}
      {androidUrl && (
        <a href={androidUrl} target="_blank" rel="noopener noreferrer">
          <img
            src="/google-play-badge.svg"
            alt="Get it on Google Play"
            className="h-12"
          />
        </a>
      )}
    </div>
  );
}
