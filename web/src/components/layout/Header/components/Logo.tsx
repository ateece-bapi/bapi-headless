import React from 'react';
import { Link } from '@/lib/navigation';
import Image from 'next/image';
import { HEADER_CONFIG } from '../config';

const Logo: React.FC = () => (
  <Link
    href="/"
    className="flex-shrink-0 rounded-lg transition-all duration-200 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
    aria-label="BAPI Home - Sensor Solutions Since 1993"
  >
    <Image
      src={HEADER_CONFIG.logo.src}
      alt={HEADER_CONFIG.logo.alt}
      width={HEADER_CONFIG.logo.width}
      height={HEADER_CONFIG.logo.height}
      priority
      className="h-16 w-auto sm:h-20 md:h-24 lg:h-28 xl:h-32"
    />
  </Link>
);

export default Logo;
