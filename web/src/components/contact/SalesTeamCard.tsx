'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Mail, Phone, Play, X, MapPin, Briefcase } from 'lucide-react';

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
      <div className="group overflow-hidden rounded-xl border-2 border-neutral-200 bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-primary-500 hover:shadow-2xl">
        {/* Photo */}
        <div className="group/video relative aspect-[3/4] overflow-hidden bg-neutral-100">
          <Image
            src={imageSrc}
            alt={name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            onError={() => {
              // Fallback to placeholder if image doesn't exist
              setImageSrc('/images/team/placeholder.svg');
            }}
          />

          {/* Video Badge - Always Visible */}
          {video && (
            <div className="absolute right-3 top-3 z-30 flex animate-pulse items-center gap-1.5 rounded-full bg-gradient-to-r from-accent-500 to-accent-600 px-3 py-1.5 text-xs font-bold text-neutral-900 shadow-lg">
              <Play className="h-3.5 w-3.5" fill="currentColor" />
              Watch Video
            </div>
          )}

          {/* Video Play Button Overlay - Shown on Hover */}
          {video && (
            <div
              onClick={openVideo}
              className="absolute inset-0 z-20 flex cursor-pointer flex-col items-center justify-center bg-gradient-to-t from-black/70 via-black/50 to-transparent transition-opacity duration-500 [opacity:0] group-hover/video:[opacity:1]"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  openVideo();
                }
              }}
              aria-label={`Play introduction video for ${name}`}
            >
              <div className="mb-3 flex h-20 w-20 transform items-center justify-center rounded-full bg-white/95 shadow-xl transition-transform duration-300 group-hover/video:scale-110">
                <Play className="ml-1 h-10 w-10 text-primary-600" fill="currentColor" />
              </div>
              <span className="text-base font-bold tracking-wide text-white">
                Watch Introduction
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-5">
          {/* Name - Larger, bolder */}
          <h3 className="mb-3 text-xl font-extrabold leading-tight text-neutral-900 transition-colors duration-300 group-hover:text-primary-600">
            {name}
          </h3>

          {/* Divider */}
          <div className="mb-3 h-px origin-left scale-x-0 transform bg-gradient-to-r from-primary-500 via-accent-500 to-primary-500 transition-transform duration-500 group-hover:scale-x-100"></div>

          {/* Title with Icon */}
          <div className="mb-2 flex items-start gap-2">
            <Briefcase className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary-500" />
            <p className="flex-1 text-sm font-semibold leading-tight text-neutral-700">{title}</p>
          </div>

          {/* Region Badge */}
          <div className="mb-4 flex items-center gap-2">
            <MapPin className="h-4 w-4 flex-shrink-0 text-accent-500" />
            <span className="inline-block rounded-full border border-primary-200 bg-gradient-to-r from-primary-50 to-accent-50 px-3 py-1 text-xs font-bold text-primary-700">
              {region}
            </span>
          </div>

          {/* Contact Buttons */}
          <div className="flex gap-2">
            <a
              href={`mailto:${email}`}
              className="flex flex-1 transform items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-primary-600 to-primary-700 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:scale-105 hover:from-primary-700 hover:to-primary-800 hover:shadow-xl"
              title={`Email ${name}`}
            >
              <Mail className="h-4 w-4" />
              Email
            </a>
            <a
              href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
              className="flex h-11 w-12 transform items-center justify-center rounded-lg border-2 border-accent-600 bg-accent-500 text-neutral-900 shadow-md transition-all duration-300 hover:scale-105 hover:bg-accent-600 hover:shadow-xl"
              title={`Call ${name}`}
            >
              <Phone className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {video && showVideoModal && (
        <div
          className="z-modal animate-in fade-in fixed inset-0 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm duration-300"
          onClick={closeVideo}
        >
          <div
            className="animate-in zoom-in-95 relative aspect-video w-full max-w-4xl overflow-hidden rounded-2xl bg-black shadow-2xl duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeVideo}
              className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-white/20"
              aria-label="Close video"
            >
              <X className="h-6 w-6" />
            </button>
            <iframe
              src={`${video}${video.includes('?') ? '&' : '?'}autoplay=1`}
              className="h-full w-full"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </>
  );
}
