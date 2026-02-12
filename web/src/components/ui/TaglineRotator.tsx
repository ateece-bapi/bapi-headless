"use client";

import React, { useState, useEffect } from "react";

interface TaglineRotatorProps {
  taglines: string[];
}

const TaglineRotator: React.FC<TaglineRotatorProps> = ({ taglines }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % taglines.length);
        setIsVisible(true);
      }, 500);
    }, 4000);

    return () => clearInterval(interval);
  }, [taglines.length]);

  return (
    <div className="h-[6rem] sm:h-[5rem] lg:h-[6rem] flex items-center justify-center">
      <p
        className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold transition-opacity duration-500 text-center max-w-4xl ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        style={{
          fontSmooth: "always",
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
        }}
      >
        {taglines[currentIndex]}
      </p>
    </div>
  );
};

export default TaglineRotator;
