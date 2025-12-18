import React from 'react';
import TaglineRotator from '../../TaglineRotator';

interface HeroContentProps {
  title: string;
  subtitle: string;
  description: string;
}

export const HeroContent: React.FC<HeroContentProps> = ({ title, subtitle, description }) => (
  <div className="text-center max-w-5xl mx-auto mb-14">
    <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-extrabold text-gray-900 mb-8 leading-none tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-700">
      {title}
    </h1>
    
    {/* Tagline Rotator replaces static subtitle */}
    <div className="inline-block mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
      <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-[#0054b6] via-[#1479bc] to-[#0054b6] bg-clip-text text-transparent mb-3">
        <TaglineRotator />
      </div>
      <div className="h-1.5 w-full bg-gradient-to-r from-transparent via-[#ffc843] to-transparent rounded-full shadow-lg shadow-[#ffc843]/50" />
    </div>
    
    <p className="text-xl sm:text-2xl lg:text-3xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-light animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
      {description}
    </p>
  </div>
);