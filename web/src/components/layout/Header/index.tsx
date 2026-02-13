'use client';

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
  MobileRegionLanguageSelector,
  SignInButton,
  CartButton,
  Logo,
  MobileMenuButton,
  MobileMenu,
  MegaMenu,
} from './components';

export const Header: React.FC<HeaderProps> = ({ className }) => {
  const scrolled = useScrollDetection(HEADER_CONFIG.scrollThreshold);
  const mobileMenu = useMobileMenu();
  const totalItems = useCartStore((state) => state.totalItems());

  return (
    <header
      className={clsx(
        'sticky top-0 z-50 w-full border-b border-neutral-200 bg-white transition-shadow duration-300',
        scrolled ? 'shadow-md' : 'shadow-sm',
        className
      )}
    >
      <div className="mx-auto max-w-7xl px-4 py-2 sm:px-6 lg:px-8 lg:py-4">
        {/* Top Row: Region, Language, Sign In, Cart - Hidden on mobile, visible on desktop */}
        <div className="bg-linear-to-r mb-4 hidden items-end justify-end gap-3 rounded-full from-neutral-50/50 via-white to-neutral-50/50 p-2 lg:mb-6 lg:flex">
          <RegionSelector />
          <div className="mb-2 h-6 w-px bg-neutral-300" />
          <LanguageSelector />
          <div className="mb-2 h-6 w-px bg-neutral-300" />
          <SignInButton />
          <CartButton itemCount={totalItems} />
        </div>

        {/* Bottom Row: Logo, Navigation, Search */}
        <div className="flex items-center justify-between gap-2 lg:gap-8">
          <Logo />

          {/* Desktop Mega Menu Navigation */}
          <MegaMenu className="hidden lg:flex" />

          {/* Search - Desktop */}
          <div className="hidden max-w-md flex-1 lg:block">
            <SearchInput />
          </div>

          <div className="flex items-center gap-2 lg:gap-2">
            {/* Mobile-only Region/Language, Sign In and Cart */}
            <div className="flex items-center gap-2 lg:hidden">
              <MobileRegionLanguageSelector />
              <SignInButton />
              <CartButton itemCount={totalItems} />
            </div>
            <MobileMenuButton isOpen={mobileMenu.isOpen} onClick={mobileMenu.toggle} />
          </div>
        </div>

        {/* Search - Mobile */}
        <div className="mt-3 lg:hidden">
          <SearchInput />
        </div>

        {/* Mobile Navigation Menu */}
        <MobileMenu isOpen={mobileMenu.isOpen} onClose={mobileMenu.close} />
      </div>
      {/* BAPI blue-to-yellow gradient divider under header with animation */}
      <div
        className={clsx(
          'bg-linear-to-r h-1 w-full from-accent-400/90 via-primary-600/90 via-60% to-accent-400/90 transition-all duration-300',
          scrolled
            ? 'shadow-[0_4px_12px_0_rgba(20,121,188,0.15)]'
            : 'shadow-[0_2px_8px_0_rgba(20,121,188,0.10)]'
        )}
      />
    </header>
  );
};

export default Header;
