"use client";
import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      const scrolled = window.pageYOffset || document.documentElement.scrollTop;
      const shouldShow = scrolled > 300;
      
      if (shouldShow !== visible) {
        setVisible(shouldShow);
      }
    };

    // Check immediately on mount
    checkScroll();
    
    // Add scroll listener with passive option for better performance
    window.addEventListener("scroll", checkScroll, { passive: true });
    
    return () => {
      window.removeEventListener("scroll", checkScroll);
    };
  }, [visible]);

  const handleClick = () => {
    window.scrollTo({ 
      top: 0, 
      behavior: "smooth" 
    });
  };

  return (
    <button
      aria-label="Back to top"
      onClick={handleClick}
      style={{ 
        transform: visible ? 'translateY(0)' : 'translateY(100px)',
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none'
      }}
      className="fixed bottom-6 right-6 z-[1080] w-12 h-12 md:w-14 md:h-14 rounded-full bg-primary-600 text-white shadow-xl transition-all duration-300 hover:bg-primary-700 hover:scale-110 hover:shadow-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 flex items-center justify-center"
    >
      <ArrowUp className="w-6 h-6 md:w-7 md:h-7" strokeWidth={2.5} />
    </button>
  );
}
