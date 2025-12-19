"use client";

import React from 'react';
import BackToTop from '../BackToTop';
import clsx from 'clsx';
import { HeaderProps } from './types';
import { HEADER_CONFIG } from './config';
import { useScrollDetection } from './hooks/useScrollDetection';
import { useMobileMenu } from './hooks/useMobileMenu';
import { RegionSelector } from './components/RegionSelector';
import { SignInButton } from './components/SignInButton';
import { CartButton } from './components/CartButton';
import { Logo } from './components/Logo';
import { SearchButton } from './components/SearchButton';
import { MobileMenuButton } from './components/MobileMenuButton';
import { MobileMenu } from './components/MobileMenu';
import { MegaMenu } from './components/MegaMenu';

export const Header: React.FC<HeaderProps> = ({ className }) => {
  const scrolled = useScrollDetection(HEADER_CONFIG.scrollThreshold);
  const mobileMenu = useMobileMenu();

  return (
    <header
      className={clsx(
        'w-full bg-white border-b border-neutral-200 sticky top-0 z-50 transition-shadow duration-300',
        scrolled ? 'shadow-md' : 'shadow-sm',
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 lg:py-4">
        {/* Top Row: Region, Sign In, Cart */}
        <div className="flex items-center justify-end gap-3 mb-4 lg:mb-6">
          <RegionSelector />
          <SignInButton />
          <CartButton />
        </div>

        {/* Bottom Row: Logo, Navigation, Search */}
        <div className="flex items-center justify-between gap-4 lg:gap-8">
          <Logo />

          {/* Desktop Mega Menu Navigation */}
          <MegaMenu className="hidden lg:flex" />

          <div className="flex items-center gap-1 lg:gap-2">
            <SearchButton />
            <MobileMenuButton isOpen={mobileMenu.isOpen} onClick={mobileMenu.toggle} />
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <MobileMenu isOpen={mobileMenu.isOpen} onClose={mobileMenu.close} />
      </div>
      {/* BAPI blue-to-yellow gradient divider under header */}
      <div className="w-full h-1 bg-gradient-to-r from-accent-400/90 via-primary-600/90 via-60% to-accent-400/90 shadow-[0_2px_8px_0_rgba(20,121,188,0.10)]" />
      <BackToTop />
    </header>
  );
};

export default Header;