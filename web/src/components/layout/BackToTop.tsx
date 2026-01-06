"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowUp } from "lucide-react";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const checkScroll = () => {
      const scrolled = window.scrollY;
      const shouldShow = scrolled > 300;
      
      setVisible(shouldShow);
    };

    // Check immediately on mount
    checkScroll();
    
    // Add scroll listener
    window.addEventListener("scroll", checkScroll, { passive: true });
    
    return () => {
      window.removeEventListener("scroll", checkScroll);
    };
  }, []);

  const handleClick = () => {
    window.scrollTo({ 
      top: 0, 
      behavior: "smooth" 
    });
  };

  if (!mounted) return null;

  return createPortal(
    <button
      aria-label="Back to top"
      onClick={handleClick}
      style={{ 
        zIndex: 1080,
        display: visible ? 'flex' : 'none',
        position: 'fixed',
        bottom: '24px',
        right: '24px'
      }}
      className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-primary-600 text-white shadow-xl hover:bg-primary-700 hover:scale-110 hover:shadow-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 flex items-center justify-center transition-all duration-300 ease-out"
    >
      <ArrowUp className="w-6 h-6 md:w-7 md:h-7" strokeWidth={2.5} />
    </button>,
    document.body
  );
}
