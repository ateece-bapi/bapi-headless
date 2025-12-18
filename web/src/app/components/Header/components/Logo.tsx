import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { HEADER_CONFIG } from '../config';

export const Logo: React.FC = () => (
  <Link
    href="/"
    className="flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-[#0054b6] focus:ring-offset-2 rounded transition-transform hover:scale-105 active:scale-100"
    aria-label="BAPI Home - Sensors for HVAC/R"
  >
    <Image
      src={HEADER_CONFIG.logo.src}
      alt={HEADER_CONFIG.logo.alt}
      width={HEADER_CONFIG.logo.width}
      height={HEADER_CONFIG.logo.height}
      priority
      className="h-16 sm:h-20 lg:h-24 xl:h-28 w-auto"
    />
  </Link>
);