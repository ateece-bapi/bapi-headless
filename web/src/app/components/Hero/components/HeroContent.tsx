import React from 'react';
import TaglineRotator from '../../TaglineRotator';

interface HeroContentProps {
  title: string;
  subtitle: string;
  description: string;
}

export const HeroContent: React.FC<HeroContentProps> = ({ title, subtitle, description }) => (
  <div className="text-center max-w-6xl mx-auto mb-14">
    <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-extrabold text-gray-900 mb-10 leading-[1.1] tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-700">
      {title}
    </h1>
    
    {/* Tagline Rotator with improved spacing */}
    <div className="inline-block mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
      <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-[#0054b6] via-[#1479bc] to-[#0054b6] bg-clip-text text-transparent mb-6 pb-2 px-4">
        <TaglineRotator />
      </div>
      <div className="h-2 w-4/5 mx-auto bg-gradient-to-r from-transparent via-[#ffc843] to-transparent rounded-full shadow-lg shadow-[#ffc843]/50 animate-pulse" />
    </div>
    
    <p className="text-xl sm:text-2xl lg:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-normal mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
      {description}
    </p>
  </div>
);