import React from 'react';
import clsx from 'clsx';
import { HeroProps } from './types';
import { HERO_CONFIG } from './config';
import { HeroContent, HeroActions } from './components';

const heroImage = {
  url: '/images/bapi-facility-solar-optimized.webp',
  alt: 'BAPI headquarters facility with solar panels',
};

export const Hero: React.FC<HeroProps> = ({ className }) => {
  return (
    <section 
      className={clsx(
        'relative w-full bg-white overflow-hidden py-24 sm:py-32 lg:py-40',
        className
      )}
    >
      {/* Static Background Image - No client-side JavaScript */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${heroImage.url})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
          role="img"
          aria-label={heroImage.alt}
        />
        {/* Professional overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-white/75 to-white/70" />
      </div>

      {/* Subtle accent gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(20,121,188,0.08)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,200,67,0.08)_0%,transparent_50%)]" />
      
      {/* Removed decorative floating elements for performance */}
      
      <div className="relative max-w-container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <HeroContent
          title={HERO_CONFIG.title}
          subtitle={HERO_CONFIG.subtitle}
          description={HERO_CONFIG.description}
        />
        <HeroActions actions={HERO_CONFIG.actions} />
        
        {/* 2025 Product Family Showcase */}
        <div className="mt-16 lg:mt-20 relative">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-neutral-50 to-neutral-100 p-6 lg:p-8 shadow-2xl border-2 border-neutral-200">
            {/* Subtle decorative corner accents */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-primary-500/10 to-transparent rounded-br-full"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-accent-500/10 to-transparent rounded-tl-full"></div>
            
            {/* Optimized hero image - loads immediately in initial HTML */}
            <div className="hero-image-container">
              <img
                src="/images/products/families/BAPI_Full_Family_Hero_Desktop.webp"
                srcSet="/images/products/families/BAPI_Full_Family_Hero_Mobile.webp 768w, /images/products/families/BAPI_Full_Family_Hero_Desktop.webp 1920w"
                sizes="(max-width: 768px) 768px, 1920px"
                alt="BAPI 2025 Complete Product Family - Temperature, Humidity, Pressure, Air Quality Sensors"
                width="1920"
                height="1235"
                loading="eager"
                fetchPriority="high"
                decoding="sync"
                className="hero-image"
              />
            </div>
            
            {/* Product family caption */}
            <div className="mt-6 text-center max-w-3xl mx-auto">
              <p className="text-base font-bold text-neutral-900 tracking-wide">
                Complete sensor solutions for building automation systems
              </p>
              <p className="text-sm text-neutral-600 mt-2 font-medium">
                Trusted by engineers worldwide for precision monitoring and control
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Subtle wave divider - elegant transition */}
      <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none">
        <svg 
          className="relative block w-full h-20 sm:h-24 lg:h-28" 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none"
        >
          {/* Single smooth blue wave - subtle and professional */}
          <path 
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V120H0Z" 
            fill="#1479BC"
            opacity="0.12"
          />
        </svg>
      </div>
    </section>
  );
};

export default Hero;