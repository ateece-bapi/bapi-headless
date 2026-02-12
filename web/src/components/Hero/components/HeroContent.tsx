import React from 'react';
import TaglineRotator from '@/components/ui/TaglineRotator';

interface HeroContentProps {
  title: string;
  description: string;
  taglines: string[];
}

const HeroContent: React.FC<HeroContentProps> = ({ title, description, taglines }) => (
  <div className="mx-auto mb-14 max-w-6xl text-center">
    <h1 className="mb-10 text-4xl font-extrabold leading-[1.1] tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
      {title}
    </h1>

    {/* Dynamic Tagline Rotator - lighter styling for better hierarchy */}
    <div className="mb-12 inline-block">
      <div className="mx-auto mb-6 max-w-4xl px-4 pb-2 text-2xl font-bold text-neutral-600 sm:text-3xl lg:text-4xl">
        <TaglineRotator taglines={taglines} />
      </div>
      <div className="mx-auto h-2 w-4/5 rounded-full bg-gradient-to-r from-transparent via-accent-500 to-transparent shadow-lg shadow-accent-500/50" />
    </div>

    <p className="mx-auto mb-4 max-w-3xl text-xl font-normal leading-relaxed text-gray-600 sm:text-2xl">
      {description}
    </p>
  </div>
);

export default HeroContent;
