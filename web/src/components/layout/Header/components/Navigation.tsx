'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Link } from '@/lib/navigation';
import { NavLink } from '../types';

interface NavigationProps {
  links: NavLink[];
  className?: string;
}

const Navigation: React.FC<NavigationProps> = ({ links, className = '' }) => {
  const pathname = usePathname();

  return (
    <nav className={className} aria-label="Main navigation">
      {links.map((link) => {
        const isActive = pathname
          ? pathname === link.href || pathname.startsWith(`${link.href}/`)
          : false;

        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={isActive ? 'page' : undefined}
            className={`group relative py-2 text-base font-semibold transition-colors focus:outline-none xl:text-lg ${
              isActive
                ? 'text-primary-600'
                : 'text-gray-900 hover:text-primary-600 focus:text-primary-600'
            }`}
          >
            {link.label}
            <span
              className={`absolute -bottom-0 left-0 h-0.5 bg-gradient-to-r from-primary-600 to-accent-500 transition-all duration-300 ${
                isActive ? 'w-full' : 'w-0 group-hover:w-full group-focus:w-full'
              }`}
              aria-hidden="true"
            />
          </Link>
        );
      })}
    </nav>
  );
};

export default Navigation;
