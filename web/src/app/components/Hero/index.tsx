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
        'w-full bg-gradient-to-b from-white via-neutral-50/50 to-neutral-100/30 border-b py-24 sm:py-32 lg:py-40',
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <HeroContent
          title={HERO_CONFIG.title}
          subtitle={HERO_CONFIG.subtitle}
          description={HERO_CONFIG.description}
        />
        <HeroActions actions={HERO_CONFIG.actions} />
      </div>
    </section>
  );
};

export default Hero;