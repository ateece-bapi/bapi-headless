import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { HEADER_CONFIG } from '../config';

const Logo: React.FC = () => (
  <Link
    href="/"
    className="flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-lg transition-all duration-200 hover:opacity-90"
    aria-label="BAPI Home - Sensors for HVAC/R"
  >
    <Image
      src={HEADER_CONFIG.logo.src}
      alt={HEADER_CONFIG.logo.alt}
      width={HEADER_CONFIG.logo.width}
      height={HEADER_CONFIG.logo.height}
      priority
      className="h-20 sm:h-24 lg:h-28 xl:h-32 w-auto"
    />
  </Link>
);

export default Logo;