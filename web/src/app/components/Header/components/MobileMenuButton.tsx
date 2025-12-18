import React from 'react';

interface MobileMenuButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

export const MobileMenuButton: React.FC<MobileMenuButtonProps> = ({ isOpen, onClick }) => (
  <button
    className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full hover:bg-neutral-100 transition-colors focus:outline-none focus:ring-2 focus:ring-[#0054b6] focus:ring-offset-2 active:scale-95"
    onClick={onClick}
    aria-expanded={isOpen}
    aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
    aria-controls="mobile-menu"
    type="button"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6 text-gray-700 transition-transform duration-200"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      {isOpen ? (
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
      )}
    </svg>
  </button>
);