'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Mail, Phone, Play, X } from 'lucide-react';

interface SalesTeamCardProps {
  name: string;
  title: string;
  region: string;
  email: string;
  phone: string;
  photo: string;
  video?: string; // Optional YouTube embed URL
}

/**
 * Sales team member card with photo fallback handling and video modal
 * 
 * Client Component to handle image error states when photos are missing.
 * Falls back to placeholder.svg if the team member photo doesn't exist yet.
 * Supports optional introduction videos via YouTube embed.
 */
export default function SalesTeamCard({
  name,
  title,
  region,
  email,
  phone,
  photo,
  video,
}: SalesTeamCardProps) {
  const [imageSrc, setImageSrc] = useState(photo);
  const [showVideoModal, setShowVideoModal] = useState(false);

  const openVideo = () => {
    if (video) {
      setShowVideoModal(true);
    }
  };

  const closeVideo = () => {
    setShowVideoModal(false);
  };

  return (
    <>
      <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-neutral-200 hover:shadow-md transition-all duration-200 hover:border-primary-300">
        {/* Photo */}
        <div className="relative aspect-[3/4] bg-neutral-100 overflow-hidden group/video">
          <Image
            src={imageSrc}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            onError={() => {
              // Fallback to placeholder if image doesn't exist
              setImageSrc('/images/team/placeholder.svg');
            }}
          />
          
          {/* Video Badge - Always Visible */}
          {video && (
            <div className="absolute top-2 right-2 bg-primary-600 text-white px-2 py-1 rounded-md flex items-center gap-1 text-xs font-medium shadow-lg z-30">
              <Play className="w-3 h-3" fill="currentColor" />
              Video
            </div>
          )}
          
          {/* Video Play Button Overlay - Shown on Hover */}
          {video && (
            <div
              onClick={openVideo}
              className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/50 [opacity:0] group-hover/video:[opacity:1] transition-opacity duration-500 cursor-pointer"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  openVideo();
                }
              }}
              aria-label={`Play introduction video for ${name}`}
            >
              <div className="w-16 h-16 rounded-full bg-white/95 flex items-center justify-center mb-2">
                <Play className="w-8 h-8 text-primary-600 ml-1" fill="currentColor" />
              </div>
              <span className="text-white font-semibold text-sm">Watch Introduction</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="text-base font-bold text-neutral-900 mb-0.5 leading-tight">{name}</h3>
          <p className="text-xs text-primary-600 font-medium mb-0.5">{title}</p>
          <p className="text-xs text-neutral-500 mb-4">{region}</p>

          {/* Contact Buttons */}
          <div className="flex gap-2">
            <a
              href={`mailto:${email}`}
              className="flex-1 flex items-center justify-center gap-1.5 bg-primary-600 hover:bg-primary-700 text-white px-3 py-2 rounded-md font-medium text-xs transition-colors"
              title={`Email ${name}`}
            >
              <Mail className="w-3.5 h-3.5" />
              Email
            </a>
            <a
              href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
              className="w-10 h-9 flex items-center justify-center bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-md transition-colors border border-neutral-300"
              title={`Call ${name}`}
            >
              <Phone className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {video && showVideoModal && (
        <div
          className="fixed inset-0 bg-black/85 flex items-center justify-center z-[9999] p-4"
          onClick={closeVideo}
        >
          <div
            className="relative w-full max-w-3xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeVideo}
              className="absolute top-2 right-3 z-10 text-white hover:text-neutral-300 transition-colors"
              aria-label="Close video"
            >
              <X className="w-6 h-6" />
            </button>
            <iframe
              src={`${video}${video.includes('?') ? '&' : '?'}autoplay=1`}
              className="w-full h-full"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </>
  );
}
