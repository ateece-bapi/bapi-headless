import React from 'react';
import TaglineRotator from '@/components/ui/TaglineRotator';

interface HeroContentProps {
  title: string;
  subtitle: string;
  description: string;
}

const HeroContent: React.FC<HeroContentProps> = ({ title, subtitle, description }) => (
  <div className="text-center max-w-6xl mx-auto mb-14">
    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-10 leading-[1.1] tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-700">
      {title}
    </h1>
    
    {/* Dynamic Tagline Rotator - lighter styling for better hierarchy */}
    <div className="inline-block mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
      <div className="text-2xl sm:text-3xl lg:text-4xl max-w-4xl mx-auto font-bold text-neutral-600 mb-6 pb-2 px-4">
        <TaglineRotator />
      </div>
      <div className="h-2 w-4/5 mx-auto bg-gradient-to-r from-transparent via-accent-500 to-transparent rounded-full shadow-lg shadow-accent-500/50" />
    </div>
    
    <p className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-normal mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
      {description}
    </p>
  </div>
);

export default HeroContent;