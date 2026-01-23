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
      <div className="group bg-white rounded-xl overflow-hidden shadow-md border-2 border-neutral-200 hover:shadow-2xl hover:border-primary-500 transition-all duration-300 hover:-translate-y-1">
        {/* Photo */}
        <div className="relative aspect-[3/4] bg-neutral-100 overflow-hidden group/video">
          <Image
            src={imageSrc}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            onError={() => {
              // Fallback to placeholder if image doesn't exist
              setImageSrc('/images/team/placeholder.svg');
            }}
          />
          
          {/* Video Badge - Always Visible */}
          {video && (
            <div className="absolute top-3 right-3 bg-gradient-to-r from-accent-500 to-accent-600 text-neutral-900 px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-bold shadow-lg z-30 animate-pulse">
              <Play className="w-3.5 h-3.5" fill="currentColor" />
              Watch Video
            </div>
          )}
          
          {/* Video Play Button Overlay - Shown on Hover */}
          {video && (
            <div
              onClick={openVideo}
              className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-gradient-to-t from-black/70 via-black/50 to-transparent [opacity:0] group-hover/video:[opacity:1] transition-opacity duration-500 cursor-pointer"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  openVideo();
                }
              }}
              aria-label={`Play introduction video for ${name}`}
            >
              <div className="w-20 h-20 rounded-full bg-white/95 flex items-center justify-center mb-3 shadow-xl transform group-hover/video:scale-110 transition-transform duration-300">
                <Play className="w-10 h-10 text-primary-600 ml-1" fill="currentColor" />
              </div>
              <span className="text-white font-bold text-base tracking-wide">Watch Introduction</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-5">
          {/* Name - Larger, bolder */}
          <h3 className="text-xl font-extrabold text-neutral-900 mb-3 leading-tight group-hover:text-primary-600 transition-colors duration-300">
            {name}
          </h3>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-primary-500 via-accent-500 to-primary-500 mb-3 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>

          {/* Title with Icon */}
          <div className="flex items-start gap-2 mb-2">
            <Briefcase className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-neutral-700 font-semibold leading-tight flex-1">{title}</p>
          </div>

          {/* Region Badge */}
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-4 h-4 text-accent-500 flex-shrink-0" />
            <span className="inline-block bg-gradient-to-r from-primary-50 to-accent-50 text-primary-700 px-3 py-1 rounded-full text-xs font-bold border border-primary-200">
              {region}
            </span>
          </div>

          {/* Contact Buttons */}
          <div className="flex gap-2">
            <a
              href={`mailto:${email}`}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-4 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 shadow-md hover:shadow-xl transform hover:scale-105"
              title={`Email ${name}`}
            >
              <Mail className="w-4 h-4" />
              Email
            </a>
            <a
              href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
              className="w-12 h-11 flex items-center justify-center bg-accent-500 hover:bg-accent-600 text-neutral-900 rounded-lg transition-all duration-300 shadow-md hover:shadow-xl border-2 border-accent-600 transform hover:scale-105"
              title={`Call ${name}`}
            >
              <Phone className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {video && showVideoModal && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 animate-in fade-in duration-300"
          onClick={closeVideo}
        >
          <div
            className="relative w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeVideo}
              className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-2 rounded-full transition-all duration-300 hover:scale-110"
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
