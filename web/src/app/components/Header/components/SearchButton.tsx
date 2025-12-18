import React from 'react';

interface SearchButtonProps {
  onClick?: () => void;
}

export const SearchButton: React.FC<SearchButtonProps> = ({ onClick }) => (
  <button
    className="flex items-center justify-center w-10 h-10 hover:bg-neutral-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#0054b6] focus:ring-offset-2 active:scale-95"
    aria-label="Search"
    type="button"
    onClick={onClick}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6 text-gray-900"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  </button>
);