import React from 'react';
import clsx from 'clsx';
import { HeroProps } from './types';
import { HERO_CONFIG } from './config';
import { HeroContent } from './components/HeroContent';
import { HeroActions } from './components/HeroActions';

export const Hero: React.FC<HeroProps> = ({ className }) => {
  return (
    <section 
      className={clsx(
        'relative w-full bg-gradient-to-b from-white via-neutral-50/50 to-neutral-100/30 border-b overflow-hidden py-24 sm:py-32 lg:py-40',
        className
      )}
    >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,84,182,0.03)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,200,67,0.03)_0%,transparent_50%)]" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <HeroContent
          title={HERO_CONFIG.title}
          subtitle={HERO_CONFIG.subtitle}
          description={HERO_CONFIG.description}
        />
        <HeroActions actions={HERO_CONFIG.actions} />
      </div>
      
      {/* Bottom fade effect */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-neutral-100/50 to-transparent pointer-events-none" />
    </section>
  );
};

export default Hero;