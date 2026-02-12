'use client';

import React, { useState, useEffect } from 'react';

interface TaglineRotatorProps {
  taglines: string[];
}

const TaglineRotator: React.FC<TaglineRotatorProps> = ({ taglines }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Guard: No rotation needed for empty array or single tagline
    if (taglines.length <= 1) {
      return;
    }

    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % taglines.length);
        setIsVisible(true);
      }, 500);
    }, 4000);

    return () => clearInterval(interval);
  }, [taglines.length]);

  // Guard: Render safe fallback for empty array
  if (taglines.length === 0) {
    return null;
  }

  return (
    <div className="flex h-[6rem] items-center justify-center sm:h-[5rem] lg:h-[6rem]">
      <p
        className={`max-w-4xl text-center text-3xl font-extrabold transition-opacity duration-500 sm:text-4xl lg:text-5xl ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          fontSmooth: 'always',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        }}
      >
        {taglines[currentIndex]}
      </p>
    </div>
  );
};

export default TaglineRotator;
