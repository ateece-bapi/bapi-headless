"use client";
import React, { useEffect, useState } from "react";

const TAGLINES = [
  "Changing the way you think about sensors.",
  "Changing the way you think about sensors since 1993.",
  "...It’s in the details",
  "Another BAPI Original",
  "Seamless wireless integration for your existing BAS",
  "People. Building. Sensors.",
  "BAPI-Backed"
];

const ROTATE_INTERVAL = 3500;

const TaglineRotator: React.FC = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % TAGLINES.length);
    }, ROTATE_INTERVAL);
    return () => clearInterval(timer);
  }, []);

  return (
    <p className="text-lg md:text-xl text-blue-700 font-semibold mb-2 min-h-[2.5rem] transition-all duration-500">
      {TAGLINES[index]}
    </p>
  );
};

export default TaglineRotator;
