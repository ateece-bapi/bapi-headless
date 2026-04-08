'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

interface Region {
  code: string;
  name: string;
  flag: string;
}

const regions: Region[] = [
  { code: 'US', name: 'United States', flag: '/flags/us.svg' },
  { code: 'UK', name: 'United Kingdom', flag: '/flags/gb.svg' },
  { code: 'EU', name: 'Europe', flag: '/flags/eu.svg' },
  { code: 'PL', name: 'Poland', flag: '/flags/pl.svg' },
  { code: 'MENA', name: 'Middle East', flag: '/flags/ae.svg' },
];

export default function RegionSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<Region>(regions[0]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="mb-2 text-sm font-medium uppercase tracking-wide text-neutral-700">
        Region
      </div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-6 py-3 text-neutral-900 transition-colors hover:border-primary-500 hover:bg-primary-50"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Image src="/icons/globe.svg" alt="" width={24} height={24} className="h-6 w-6" />
        <Image
          src={selectedRegion.flag}
          alt={`${selectedRegion.name} flag`}
          width={24}
          height={18}
          className="h-[18px] w-6 rounded-sm object-cover"
        />
        <span className="font-medium">{selectedRegion.name}</span>
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-2 w-64 rounded-lg border border-neutral-200 bg-white shadow-lg">
          <ul className="py-2">
            {regions.map((region) => (
              <li key={region.code}>
                <button
                  onClick={() => {
                    setSelectedRegion(region);
                    setIsOpen(false);
                  }}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-neutral-50"
                >
                  <Image
                    src={region.flag}
                    alt={`${region.name} flag`}
                    width={24}
                    height={18}
                    className="h-[18px] w-6 rounded-sm object-cover"
                  />
                  <span className="font-medium text-neutral-900">{region.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
