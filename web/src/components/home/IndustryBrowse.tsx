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
  Snowflake,
  Thermometer,
  Gauge,
  Droplets,
  Radio,
  Waves,
  Settings,
  Cable,
  Zap,
} from 'lucide-react';

type BrowseMode = 'industry' | 'sensor-type';

interface Card {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  href: string;
}

const industries: Card[] = [
  { id: 'hvac', name: 'HVAC/R', icon: Wind, href: '/industries/hvac-r' },
  { id: 'agriculture', name: 'Agriculture', icon: Sprout, href: '/industries/agriculture' },
  {
    id: 'food-service',
    name: 'Food Service',
    icon: UtensilsCrossed,
    href: '/industries/food-service',
  },
  { id: 'transportation', name: 'Transportation', icon: Truck, href: '/industries/transportation' },
  { id: 'healthcare', name: 'Healthcare', icon: HeartPulse, href: '/industries/healthcare' },
  { id: 'grocery', name: 'Grocery', icon: ShoppingCart, href: '/industries/grocery' },
  {
    id: 'meat-processing',
    name: 'Meat Processing',
    icon: Beef,
    href: '/industries/meat-processing',
  },
  { id: 'cold-chain', name: 'Cold Chain', icon: Snowflake, href: '/industries/cold-chain' },
];

const sensorTypes: Card[] = [
  { id: 'temperature', name: 'Temperature', icon: Thermometer, href: '/products/temperature' },
  { id: 'humidity', name: 'Humidity', icon: Droplets, href: '/products/humidity' },
  { id: 'pressure', name: 'Pressure', icon: Gauge, href: '/products/pressure' },
  { id: 'air-quality', name: 'Air Quality', icon: Wind, href: '/products/air-quality' },
  { id: 'wireless', name: 'Wireless', icon: Radio, href: '/products/wireless' },
  { id: 'current', name: 'Current Sensors', icon: Zap, href: '/products/current-sensors' },
  { id: 'controllers', name: 'Controllers', icon: Settings, href: '/products/controllers' },
  { id: 'accessories', name: 'Accessories', icon: Cable, href: '/products/accessories' },
];

export default function IndustryBrowse() {
  const [browseMode, setBrowseMode] = useState<BrowseMode>('industry');

  return (
    <section className="w-full bg-neutral-50 py-12 lg:py-16 xl:py-20">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Heading */}
        <div className="mb-8 text-center lg:mb-12">
          <h2 className="mb-6 text-3xl font-bold text-neutral-900 sm:text-4xl lg:text-5xl">
            Innovative sensor solutions for the global market
          </h2>

          {/* Browse Mode Toggle */}
          <div className="flex items-center justify-center gap-3">
            <span className="text-base font-semibold text-neutral-700 lg:text-lg">Browse by:</span>
            <div className="inline-flex rounded-full border border-neutral-200 bg-white p-1 shadow-sm">
              <button
                onClick={() => setBrowseMode('industry')}
                className={`rounded-full px-6 py-2 text-sm font-semibold transition-all duration-300 lg:text-base ${
                  browseMode === 'industry'
                    ? 'bg-accent-500 text-neutral-900 shadow-sm'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Industry
              </button>
              <button
                onClick={() => setBrowseMode('sensor-type')}
                className={`rounded-full px-6 py-2 text-sm font-semibold transition-all duration-300 lg:text-base ${
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {industries.map((industry) => {
              const IconComponent = industry.icon;
              return (
                <Link
                  key={industry.id}
                  href={industry.href}
                  className="min-h-45 lg:min-h-50 group relative flex flex-col items-start justify-end overflow-hidden rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm transition-all duration-300 hover:border-primary-500 hover:shadow-lg lg:p-10"
                >
                  {/* Icon - Top Right */}
                  <div className="absolute right-6 top-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50 transition-colors group-hover:bg-primary-100 lg:h-20 lg:w-20">
                    <IconComponent
                      className="h-8 w-8 text-primary-500 lg:h-10 lg:w-10"
                      strokeWidth={2}
                    />
                  </div>

                  {/* Title - Bottom Left */}
                  <h3 className="text-lg font-bold text-primary-600 transition-colors group-hover:text-primary-700 lg:text-xl">
                    {industry.name}
                  </h3>
                </Link>
              );
            })}
          </div>
        )}

        {/* Sensor Type Cards Grid (Placeholder for now) */}
        {browseMode === 'sensor-type' && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {sensorTypes.map((sensor) => {
              const IconComponent = sensor.icon;
              return (
                <Link
                  key={sensor.id}
                  href={sensor.href}
                  className="min-h-45 lg:min-h-50 group relative flex flex-col items-start justify-end overflow-hidden rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm transition-all duration-300 hover:border-primary-500 hover:shadow-lg lg:p-10"
                >
                  {/* Icon - Top Right */}
                  <div className="absolute right-6 top-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50 transition-colors group-hover:bg-primary-100 lg:h-20 lg:w-20">
                    <IconComponent
                      className="h-8 w-8 text-primary-500 lg:h-10 lg:w-10"
                      strokeWidth={2}
                    />
                  </div>

                  {/* Title - Bottom Left */}
                  <h3 className="text-lg font-bold text-primary-600 transition-colors group-hover:text-primary-700 lg:text-xl">
                    {sensor.name}
                  </h3>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
