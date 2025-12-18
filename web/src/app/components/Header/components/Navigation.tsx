import React from 'react';
import Link from 'next/link';
import { NavLink } from '../types';

interface NavigationProps {
  links: NavLink[];
  className?: string;
}

export const Navigation: React.FC<NavigationProps> = ({ links, className = '' }) => (
  <nav className={className} aria-label="Main navigation">
    {links.map((link) => (
      <Link
        key={link.href}
        href={link.href}
        className="text-base xl:text-lg text-gray-900 hover:text-[#0054b6] font-semibold transition-colors relative group focus:outline-none focus:text-[#0054b6] py-2"
      >
        {link.label}
        <span
          className="absolute left-0 -bottom-0 w-0 h-0.5 bg-gradient-to-r from-[#0054b6] to-[#ffc843] transition-all duration-300 group-hover:w-full group-focus:w-full"
          aria-hidden="true"
        />
      </Link>
    ))}
  </nav>
);