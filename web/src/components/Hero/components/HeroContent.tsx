import React from 'react';
import clsx from 'clsx';
import TaglineRotator from '@/components/ui/TaglineRotator';

interface HeroContentProps {
  title: string;
  description: string;
  taglines: string[];
  className?: string;
}

const HeroContent: React.FC<HeroContentProps> = ({ title, description, taglines, className }) => (
  <div className={clsx('mx-auto mb-6 max-w-3xl text-center xl:max-w-3xl 2xl:mb-10 2xl:max-w-6xl', className)}>
    <h1 className="mb-6 text-4xl font-extrabold leading-[1.1] tracking-tight text-gray-900 sm:text-5xl lg:text-5xl xl:text-4xl 2xl:text-6xl">
      {title}
    </h1>

    {/* Dynamic Tagline Rotator - lighter styling for better hierarchy */}
    <div className="mb-8 inline-block 2xl:mb-12">
      <div className="mx-auto mb-4 max-w-4xl px-4 pb-2 text-lg font-bold text-neutral-600 sm:text-2xl lg:text-2xl xl:text-xl 2xl:text-4xl">
        <TaglineRotator taglines={taglines} />
      </div>
      <div className="mx-auto h-2 w-4/5 rounded-full bg-linear-to-r from-transparent via-accent-500 to-transparent shadow-lg shadow-accent-500/50" />
    </div>

    <p className="mx-auto mb-4 max-w-2xl text-base font-normal leading-relaxed text-gray-600 sm:text-lg xl:text-base 2xl:text-xl">
      {description}
    </p>
  </div>
);

export default HeroContent;
