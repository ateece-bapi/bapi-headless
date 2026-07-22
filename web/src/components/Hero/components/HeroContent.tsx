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
  <div
    className={clsx(
      'mb-6 max-w-3xl',
      // Mobile to lg: centered with mx-auto
      'mx-auto text-center',
      // xl+: left-aligned, remove auto margins (1280px+)
      'xl:mx-0 xl:text-left',
      'xl:max-w-3xl',
      '2xl:mb-10 2xl:max-w-6xl',
      className
    )}
  >
    {/* FIXED: Mobile-first responsive heading - scales from text-3xl to text-6xl */}
    {title && (
      <h1
        className={clsx(
          'mb-6 whitespace-pre-line font-extrabold leading-[1.1] tracking-tight text-gray-900',
          'text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-5xl 2xl:text-6xl'
        )}
      >
        {title}
      </h1>
    )}

    {/* Dynamic Tagline Rotator - lighter styling for better hierarchy */}
    <div className="mb-8 inline-block 2xl:mb-12">
      {/* FIXED: Mobile-first tagline scaling - text-lg to text-4xl */}
      <div
        className={clsx(
          'mb-4 max-w-4xl px-4 pb-2',
          // Mobile to lg: centered with mx-auto
          'mx-auto',
          // xl+: remove auto margins for left alignment
          'xl:mx-0 xl:pl-0',
          // Use arbitrary child selector to override TaglineRotator's internal <p> styles
          '[&_p]:font-semibold [&_p]:text-primary-500',
          '[&_p]:text-base sm:[&_p]:text-lg md:[&_p]:text-xl lg:[&_p]:text-xl xl:[&_p]:text-2xl 2xl:[&_p]:text-3xl'
        )}
      >
        <TaglineRotator taglines={taglines} />
      </div>
      {/* Yellow decorative accent line */}
      <div
        className={clsx(
          'bg-linear-to-r h-2 w-4/5 rounded-full from-transparent via-accent-500 to-transparent shadow-lg shadow-accent-500/50',
          // Mobile to lg: centered with mx-auto
          'mx-auto',
          // xl+: remove auto margins for left alignment
          'xl:mx-0'
        )}
      />
    </div>

    {/* FIXED: Mobile-first body text scaling - text-sm to text-xl */}
    <p
      className={clsx(
        'mb-8 max-w-2xl font-medium leading-relaxed text-gray-800',
        // Mobile to lg: centered with mx-auto
        'mx-auto',
        // xl+: remove auto margins for left alignment
        'xl:mx-0',
        'text-sm sm:text-base md:text-lg lg:text-lg xl:text-xl 2xl:text-2xl'
      )}
    >
      {description}
    </p>
  </div>
);

export default HeroContent;
