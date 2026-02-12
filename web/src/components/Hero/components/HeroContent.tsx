import React from 'react';
import TaglineRotator from '@/components/ui/TaglineRotator';

interface HeroContentProps {
  title: string;
  description: string;
  taglines: string[];
}

const HeroContent: React.FC<HeroContentProps> = ({ title, description, taglines }) => (
  <div className="text-center max-w-6xl mx-auto mb-14">
    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-10 leading-[1.1] tracking-tight">
      {title}
    </h1>
    
    {/* Dynamic Tagline Rotator - lighter styling for better hierarchy */}
    <div className="inline-block mb-12">
      <div className="text-2xl sm:text-3xl lg:text-4xl max-w-4xl mx-auto font-bold text-neutral-600 mb-6 pb-2 px-4">
        <TaglineRotator taglines={taglines} />
      </div>
      <div className="h-2 w-4/5 mx-auto bg-gradient-to-r from-transparent via-accent-500 to-transparent rounded-full shadow-lg shadow-accent-500/50" />
    </div>
    
    <p className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-normal mb-4">
      {description}
    </p>
  </div>
);

export default HeroContent;