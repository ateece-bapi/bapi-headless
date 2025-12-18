import React from 'react';
import Link from 'next/link';
import { NavLink } from '../types';

interface MobileMenuProps {
  isOpen: boolean;
  links: NavLink[];
  onClose: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, links, onClose }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm lg:hidden z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Menu */}
      <nav
        id="mobile-menu"
        className="lg:hidden absolute left-0 right-0 top-full bg-white border-t border-neutral-200 shadow-lg animate-in slide-in-from-top-2 duration-200 z-50"
        aria-label="Mobile navigation"
      >
        <ul className="max-w-7xl mx-auto px-4 py-4 space-y-1">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="block px-4 py-3 text-base font-semibold text-gray-900 hover:bg-neutral-50 hover:text-[#0054b6] rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#0054b6] active:bg-neutral-100"
                onClick={onClose}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
};