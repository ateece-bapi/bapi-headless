'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Wind, 
  Sprout, 
  UtensilsCrossed, 
  Truck, 
  HeartPulse, 
  ShoppingCart, 
  Beef, 
  Snowflake 
} from 'lucide-react';

type BrowseMode = 'industry' | 'sensor-type';

interface IndustryCard {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  href: string;
}

const industries: IndustryCard[] = [
  { id: 'hvac', name: 'HVAC/R', icon: Wind, href: '/industries/hvac-r' },
  { id: 'agriculture', name: 'Agriculture', icon: Sprout, href: '/industries/agriculture' },
  { id: 'food-service', name: 'Food Service', icon: UtensilsCrossed, href: '/industries/food-service' },
  { id: 'transportation', name: 'Transportation', icon: Truck, href: '/industries/transportation' },
  { id: 'healthcare', name: 'Healthcare', icon: HeartPulse, href: '/industries/healthcare' },
  { id: 'grocery', name: 'Grocery', icon: ShoppingCart, href: '/industries/grocery' },
  { id: 'meat-processing', name: 'Meat Processing', icon: Beef, href: '/industries/meat-processing' },
  { id: 'cold-chain', name: 'Cold Chain', icon: Snowflake, href: '/industries/cold-chain' },
];

export default function IndustryBrowse() {
  const [browseMode, setBrowseMode] = useState<BrowseMode>('industry');

  return (
    <section className="w-full bg-neutral-50 py-12 lg:py-16 xl:py-20">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Heading */}
        <div className="text-center mb-8 lg:mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-neutral-900">
            Innovative sensor solutions for the global market
          </h2>
          
          {/* Browse Mode Toggle */}
          <div className="flex items-center justify-center gap-3">
            <span className="text-base lg:text-lg font-semibold text-neutral-700">
              Browse by:
            </span>
            <div className="inline-flex rounded-full bg-white shadow-sm border border-neutral-200 p-1">
              <button
                onClick={() => setBrowseMode('industry')}
                className={`px-6 py-2 rounded-full font-semibold text-sm lg:text-base transition-all duration-300 ${
                  browseMode === 'industry'
                    ? 'bg-accent-500 text-neutral-900 shadow-sm'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Industry
              </button>
              <button
                onClick={() => setBrowseMode('sensor-type')}
                className={`px-6 py-2 rounded-full font-semibold text-sm lg:text-base transition-all duration-300 ${
                  browseMode === 'sensor-type'
                    ? 'bg-accent-500 text-neutral-900 shadow-sm'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Sensor Type
              </button>
            </div>
          </div>
        </div>

        {/* Industry Cards Grid */}
        {browseMode === 'industry' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {industries.map((industry) => {
              const IconComponent = industry.icon;
              return (
                <Link
                  key={industry.id}
                  href={industry.href}
                  className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-8 lg:p-10 border border-neutral-200 hover:border-primary-500 flex flex-col items-start justify-end min-h-45 lg:min-h-50 relative overflow-hidden"
                >
                  {/* Icon - Top Right */}
                  <div className="absolute top-6 right-6 w-16 h-16 lg:w-20 lg:h-20 bg-primary-50 rounded-2xl flex items-center justify-center group-hover:bg-primary-100 transition-colors">
                    <IconComponent 
                      className="w-8 h-8 lg:w-10 lg:h-10 text-primary-500" 
                      strokeWidth={2}
                    />
                  </div>
                  
                  {/* Title - Bottom Left */}
                  <h3 className="font-bold text-lg lg:text-xl text-primary-600 group-hover:text-primary-700 transition-colors">
                    {industry.name}
                  </h3>
                </Link>
              );
            })}
          </div>
        )}

        {/* Sensor Type Cards Grid (Placeholder for now) */}
        {browseMode === 'sensor-type' && (
          <div className="text-center py-12">
            <p className="text-neutral-600 text-lg">
              Sensor Type browsing coming soon...
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
