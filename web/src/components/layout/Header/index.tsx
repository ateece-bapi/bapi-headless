"use client";

import React from 'react';
import clsx from 'clsx';
import { HeaderProps } from './types';
import { HEADER_CONFIG } from './config';
import { useScrollDetection } from './hooks/useScrollDetection';
import { useMobileMenu } from './hooks/useMobileMenu';
import { SearchInput } from '@/components/search';
import { useCartStore } from '@/store/cart';
import {
  RegionSelector,
  LanguageSelector,
  SignInButton,
  CartButton,
  Logo,
  MobileMenuButton,
  MobileMenu,
  MegaMenu
} from './components';

export const Header: React.FC<HeaderProps> = ({ className }) => {
  const scrolled = useScrollDetection(HEADER_CONFIG.scrollThreshold);
  const mobileMenu = useMobileMenu();
  const totalItems = useCartStore((state) => state.totalItems);

  return (
    <header
      className={clsx(
        'w-full bg-white border-b border-neutral-200 sticky top-0 z-50 transition-shadow duration-300',
        scrolled ? 'shadow-md' : 'shadow-sm',
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 lg:py-4">
        {/* Top Row: Region, Language, Sign In, Cart - Hidden on mobile, visible on desktop */}
        <div className="hidden lg:flex items-end justify-end gap-3 mb-4 lg:mb-6 p-2 rounded-full bg-linear-to-r from-neutral-50/50 via-white to-neutral-50/50">
          <RegionSelector />
          <div className="h-6 w-px bg-neutral-300 mb-2" />
          <LanguageSelector />
          <div className="h-6 w-px bg-neutral-300 mb-2" />
          <SignInButton />
          <CartButton itemCount={totalItems} />
        </div>

        {/* Bottom Row: Logo, Navigation, Search */}
        <div className="flex items-center justify-between gap-2 lg:gap-8">
          <Logo />

          {/* Desktop Mega Menu Navigation */}
          <MegaMenu className="hidden lg:flex" />

          {/* Search - Desktop */}
          <div className="hidden lg:block flex-1 max-w-md">
            <SearchInput />
          </div>

          <div className="flex items-center gap-2 lg:gap-2">
            {/* Mobile-only Sign In and Cart */}
            <div className="flex items-center gap-2 lg:hidden">
              <SignInButton />
              <CartButton itemCount={totalItems} />
            </div>
            <MobileMenuButton isOpen={mobileMenu.isOpen} onClick={mobileMenu.toggle} />
          </div>
        </div>

        {/* Search - Mobile */}
        <div className="lg:hidden mt-3">
          <SearchInput />
        </div>

        {/* Mobile Navigation Menu */}
        <MobileMenu isOpen={mobileMenu.isOpen} onClose={mobileMenu.close} />
      </div>
      {/* BAPI blue-to-yellow gradient divider under header with animation */}
      <div 
        className={clsx(
          'w-full h-1 bg-linear-to-r from-accent-400/90 via-primary-600/90 via-60% to-accent-400/90 transition-all duration-300',
          scrolled 
            ? 'shadow-[0_4px_12px_0_rgba(20,121,188,0.15)]' 
            : 'shadow-[0_2px_8px_0_rgba(20,121,188,0.10)]'
        )} 
      />
    </header>
  );
};

export default Header;