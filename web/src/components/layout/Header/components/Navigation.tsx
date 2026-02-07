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
        const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
        
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={isActive ? 'page' : undefined}
            className={`text-base xl:text-lg font-semibold transition-colors relative group focus:outline-none py-2 ${ 
              isActive 
                ? 'text-primary-600' 
                : 'text-gray-900 hover:text-primary-600 focus:text-primary-600'
            }`}
          >
            {link.label}
            <span
              className={`absolute left-0 -bottom-0 h-0.5 bg-gradient-to-r from-primary-600 to-accent-500 transition-all duration-300 ${ 
                isActive 
                  ? 'w-full' 
                  : 'w-0 group-hover:w-full group-focus:w-full'
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