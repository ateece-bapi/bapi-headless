'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

type ProductCard = 'leak-detector' | 'pressure' | 'temperature';

const productOrder: ProductCard[] = ['leak-detector', 'pressure', 'temperature'];

export function InteractiveServerRoom() {
  const [activeCard, setActiveCard] = useState<ProductCard>('leak-detector');
  const [hoveredCard, setHoveredCard] = useState<ProductCard | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  // Keyboard navigation (scoped to this component)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle keyboard navigation if focus is within this component
      if (!containerRef.current?.contains(document.activeElement)) {
        return;
      }

      const currentIndex = productOrder.indexOf(activeCard);
      
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        const nextIndex = (currentIndex + 1) % productOrder.length;
        setActiveCard(productOrder[nextIndex]);
        buttonRefs.current[productOrder[nextIndex]]?.focus();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        const prevIndex = (currentIndex - 1 + productOrder.length) % productOrder.length;
        setActiveCard(productOrder[prevIndex]);
        buttonRefs.current[productOrder[prevIndex]]?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeCard]);

  // Navigate to next/previous product
  const navigateProduct = (direction: 'next' | 'prev') => {
    const currentIndex = productOrder.indexOf(activeCard);
    const newIndex = direction === 'next'
      ? (currentIndex + 1) % productOrder.length
      : (currentIndex - 1 + productOrder.length) % productOrder.length;
    setActiveCard(productOrder[newIndex]);
    
    // Scroll to card on mobile
    if (window.innerWidth < 1024) {
      cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  const productCards = {
    'leak-detector': {
      title: 'Water Leak & Refrigerant Leak Detector',
      description:
        'The Water Leak Detector with Rope Sensor detects water along its entire length and is perfect for monitoring leaks around the base of liquid cooled racks or in the underfloor area of server rooms with raised floors.\n\nThe Refrigerant Leak Detector Protects staff by detecting leaks from the CRAC units in the server room or AHUs inside the building.',
      image: '/images/datacenter/Server_Room_2026_7-scaled.webp',
      productImages: [
        {
          label: 'Refrigerant Leak Detector',
          image: '/images/datacenter/refrigerant-leak-detector.webp',
        },
        {
          label: 'Water Leak Detector with Rope Sensor',
          image: '/images/datacenter/1-WaterLeak_Rope_Reverse 1.webp',
        },
      ],
      features: [],
    },
    pressure: {
      title: 'Server Rack, Room, Plenum & Duct Pressure',
      description:
        'The small EZ Pressure Sensor fits inside or outside the rack for verifying pressure drop and air flow across the rack. The rugged ZPM BAPI-Box Pressure Sensor features an IP66 enclosure with pressure status LEDs for "line of sight" troubleshooting. Both units are field selectable and available with pickup ports for room, wall and ceiling.',
      image: '/images/datacenter/Server_Room_2026_5-scaled.webp',
      productImages: undefined,
      features: [],
    },
    temperature: {
      title: 'Aisle Temperature & Humidity',
      description:
        'The Pendant Sensor hangs from the ceiling for accurate and unobtrusive hot and cold aisle monitoring.\n\nThe BAPI-Stat "Quantum Prime" room sensor features temperature and humidity setpoint adjustment, occupancy override and wipedown cleaning.',
      image: '/images/datacenter/Server_Room_2026_4-scaled.webp',
      productImages: undefined,
      features: [],
    },
  };

  return (
    <div ref={containerRef} className="space-y-8">
      {/* Skip Link for Accessibility */}
      <a
        href="#product-details"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:rounded-lg focus:bg-primary-600 focus:px-4 focus:py-2 focus:text-white focus:outline-none focus:ring-2 focus:ring-accent-500"
      >
        Skip to product details
      </a>

      {/* Desktop: Side-by-side layout | Mobile: Stacked */}
      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:gap-10">
        {/* Left Column - Diagram (sticky on desktop) */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="relative">
            {/* Main Image */}
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border-2 border-primary-200 bg-white shadow-xl">
              <Image
                src="/images/datacenter/Server_Room_2026_1_edit-01-scaled.webp"
                alt="Interactive Server Room Diagram"
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 600px"
              />

              {/* Clickable Hotspots with Pulse Animation */}
              
              {/* Top Left Position - Pressure (Ceiling/Plenum) OR Yellow Decorative */}
              {activeCard === 'pressure' ? (
                <button
                  type="button"
                  onClick={() => {
                    setActiveCard('pressure');
                    if (window.innerWidth < 1024) {
                      cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                  onMouseEnter={() => setHoveredCard('pressure')}
                  onMouseLeave={() => setHoveredCard(null)}
                  onFocus={() => setHoveredCard('pressure')}
                  onBlur={() => setHoveredCard(null)}
                  className="group absolute left-[2%] top-[14%] flex h-12 w-12 items-center justify-center rounded-full border-4 border-accent-500 bg-primary-600 shadow-xl ring-4 ring-accent-500/50 transition-all duration-300 hover:scale-125 focus:scale-125 focus:outline-none"
                  aria-label="View Server Rack, Room, Plenum & Duct Pressure"
                  aria-pressed={true}
                  tabIndex={0}
                >
                  <span className="sr-only">Plenum Pressure</span>
                  {hoveredCard === 'pressure' && (
                    <span className="pointer-events-none absolute -top-12 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-lg bg-neutral-900 px-3 py-1.5 text-sm font-medium text-white shadow-lg">
                      Pressure
                      <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-neutral-900" />
                    </span>
                  )}
                </button>
              ) : (
                <div className="absolute left-[2%] top-[14%] h-10 w-10 rounded-full bg-accent-500 shadow-md" aria-hidden="true" />
              )}

              {/* Left Bottom Position - Leak Detector OR Yellow Decorative */}
              {activeCard === 'leak-detector' ? (
                <button
                  type="button"
                  ref={(el) => { buttonRefs.current['leak-detector'] = el; }}
                  onClick={() => {
                    setActiveCard('leak-detector');
                    if (window.innerWidth < 1024) {
                      cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                  onMouseEnter={() => setHoveredCard('leak-detector')}
                  onMouseLeave={() => setHoveredCard(null)}
                  onFocus={() => setHoveredCard('leak-detector')}
                  onBlur={() => setHoveredCard(null)}
                  className="group absolute left-[10%] top-[72%] flex h-12 w-12 items-center justify-center rounded-full border-4 border-accent-500 bg-primary-600 shadow-xl ring-4 ring-accent-500/50 transition-all duration-300 hover:scale-125 focus:scale-125 focus:outline-none"
                  aria-label="View Water Leak & Refrigerant Leak Detector"
                  aria-pressed={true}
                  tabIndex={0}
                >
                  <span className="sr-only">Water Leak & Refrigerant Leak Detector</span>
                  {hoveredCard === 'leak-detector' && (
                    <span className="pointer-events-none absolute -top-12 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-lg bg-neutral-900 px-3 py-1.5 text-sm font-medium text-white shadow-lg">
                      Leak Detection
                      <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-neutral-900" />
                    </span>
                  )}
                </button>
              ) : (
                <div className="absolute left-[10%] top-[72%] h-10 w-10 rounded-full bg-accent-500 shadow-md" aria-hidden="true" />
              )}

              {/* Center Bottom Position - Pressure (Front of Racks) OR Yellow Decorative */}
              {activeCard === 'pressure' ? (
                <button
                  type="button"
                  ref={(el) => { buttonRefs.current['pressure'] = el; }}
                  onClick={() => {
                    setActiveCard('pressure');
                    if (window.innerWidth < 1024) {
                      cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                  onMouseEnter={() => setHoveredCard('pressure')}
                  onMouseLeave={() => setHoveredCard(null)}
                  onFocus={() => setHoveredCard('pressure')}
                  onBlur={() => setHoveredCard(null)}
                  className="group absolute left-[42%] top-[68%] flex h-12 w-12 items-center justify-center rounded-full border-4 border-accent-500 bg-primary-600 shadow-xl ring-4 ring-accent-500/50 transition-all duration-300 hover:scale-125 focus:scale-125 focus:outline-none"
                  aria-label="View Server Rack, Room, Plenum & Duct Pressure"
                  aria-pressed={true}
                  tabIndex={0}
                >
                  <span className="sr-only">Server Rack Pressure</span>
                  {hoveredCard === 'pressure' && (
                    <span className="pointer-events-none absolute -top-12 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-lg bg-neutral-900 px-3 py-1.5 text-sm font-medium text-white shadow-lg">
                      Pressure
                      <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-neutral-900" />
                    </span>
                  )}
                </button>
              ) : (
                <div className="absolute left-[42%] top-[68%] h-10 w-10 rounded-full bg-accent-500 shadow-md" aria-hidden="true" />
              )}

              {/* Decorative Yellow Circles (non-interactive) */}
              <div className="absolute left-[33%] top-[16%] h-10 w-10 rounded-full bg-accent-500 shadow-md" aria-hidden="true" />
              <div className="absolute left-[11%] top-[40%] h-10 w-10 rounded-full bg-accent-500 shadow-md" aria-hidden="true" />
              <div className="absolute left-[54%] top-[72%] h-10 w-10 rounded-full bg-accent-500 shadow-md" aria-hidden="true" />
              <div className="absolute right-[18%] top-[72%] h-10 w-10 rounded-full bg-accent-500 shadow-md" aria-hidden="true" />
            </div>

            {/* Instruction Text */}
            <p className="mt-4 text-center text-sm text-neutral-600">
              Click circles or use arrow keys to explore solutions
            </p>

            {/* Navigation Buttons */}
            <div className="mt-6 flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => navigateProduct('prev')}
                className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2"
                aria-label="Previous product"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>
              <span className="text-sm font-medium text-neutral-600">
                {productOrder.indexOf(activeCard) + 1} / {productOrder.length}
              </span>
              <button
                type="button"
                onClick={() => navigateProduct('next')}
                className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2"
                aria-label="Next product"
              >
                Next
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Product Card (with smooth transitions) */}
        <div ref={cardRef} id="product-details" className="min-h-[400px]">
          {/* ARIA Live Region for Screen Readers */}
          <div className="sr-only" aria-live="polite" aria-atomic="true">
            Now showing: {productCards[activeCard].title}
          </div>

          {/* Blue Background Wrapper with Fade Transition */}
          <div 
            className="rounded-3xl bg-primary-600 p-4 shadow-2xl transition-all duration-500 ease-in-out lg:p-6"
            key={activeCard}
          >
            {/* White Content Card */}
            <div className="overflow-hidden rounded-2xl bg-white shadow-xl transition-opacity duration-500 ease-in-out">
              <div className="p-6 lg:p-8">
                {/* Title and Description */}
                <div className="mb-6">
                  <h3 className="mb-2 text-xl font-bold text-primary-600 lg:text-2xl">
                    {productCards[activeCard].title}
                  </h3>
                  <div className="mb-4 h-1 w-32 bg-accent-500 transition-all duration-500 lg:mb-6" />
                  
                  <div className="space-y-3 text-sm leading-relaxed text-neutral-900 lg:space-y-4 lg:text-base">
                    {productCards[activeCard].description.split('\n\n').map((paragraph, index) => (
                      <p key={index} className="transition-all duration-500 ease-out">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Images Section */}
                <div className="grid gap-4 lg:grid-cols-[1fr_1.5fr] lg:gap-6">
                  {/* Left: Product Callout Images (if available) */}
                  {productCards[activeCard].productImages && (
                    <div className="flex flex-col gap-4 transition-all duration-500 ease-out">
                      {productCards[activeCard].productImages.map((product, index) => (
                        <div key={index} className="flex flex-col gap-2">
                          <h4 className="text-center text-xs font-semibold text-neutral-900 lg:text-sm">
                            {product.label}
                          </h4>
                          <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-white transition-transform hover:scale-105">
                            <Image
                              src={product.image}
                              alt={product.label}
                              fill
                              className="object-contain p-2 lg:p-3"
                              sizes="(min-width: 1024px) 30vw, 100vw"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Right: Server Room Detail Image */}
                  <div 
                    className={`relative overflow-hidden rounded-xl bg-white transition-all duration-500 ease-out ${
                      productCards[activeCard].productImages 
                        ? 'min-h-[280px] lg:min-h-[350px]' 
                        : 'min-h-[250px] lg:min-h-[320px]'
                    }`}
                  >
                    <Image
                      src={productCards[activeCard].image}
                      alt={productCards[activeCard].title}
                      fill
                      className="object-contain"
                      sizes="(min-width: 1024px) 60vw, 100vw"
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
