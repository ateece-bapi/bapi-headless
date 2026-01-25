import React from 'react';
import clsx from 'clsx';
import { HeroProps } from './types';
import { HERO_CONFIG } from './config';
import { HeroContent, HeroActions } from './components';

export const Hero: React.FC<HeroProps> = ({ className }) => {
  return (
    <section 
      className={clsx(
        'relative w-full bg-white overflow-hidden py-24 sm:py-32 lg:py-40',
        className
      )}
    >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,84,182,0.03)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,200,67,0.03)_0%,transparent_50%)]" />
      
      {/* Floating decorative elements - subtle animation */}
      <div className="absolute top-20 right-10 w-32 h-32 bg-primary-500 rounded-full opacity-5 blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
      <div className="absolute bottom-40 left-10 w-40 h-40 bg-accent-500 rounded-full opacity-5 blur-3xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />
      
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
            
            <img
              src="/images/products/families/BAPI_Full_Family_11K_Wide_2025_noWAM_US.webp"
              alt="BAPI 2025 Complete Product Family - Temperature, Humidity, Pressure, Air Quality Sensors"
              className="relative w-full h-auto rounded-xl shadow-lg"
              loading="eager"
            />
            
            {/* Product family caption */}
            <div className="mt-6 text-center">
              <p className="text-sm lg:text-base font-semibold text-neutral-700">
                Complete sensor solutions for building automation systems
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