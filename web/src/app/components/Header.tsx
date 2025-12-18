"use client";

import React, { useState } from "react";
import Link from 'next/link';
import Image from 'next/image';
import clsx from 'clsx';

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/solutions', label: 'Solutions' },
    { href: '/resources', label: 'Resources' },
    { href: '/company', label: 'Company' },
    { href: '/support', label: 'Support' },
  ];

  return (
    <header className="w-full bg-white border-b border-neutral-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        {/* Top Row: Region, Sign In, Cart */}
        <div className="flex items-center justify-end gap-3 mb-4">
          {/* Region Selector */}
          <div className="relative">
            <select 
              className="appearance-none px-5 py-2 pr-10 border border-neutral-300 rounded-full text-sm font-medium text-gray-700 bg-white hover:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#0054b6] focus:border-transparent transition-all cursor-pointer"
              aria-label="Select region"
            >
              <option value="">Region</option>
              <option value="us">United States</option>
              <option value="eu">Europe</option>
              <option value="asia">Asia</option>
            </select>
            <svg 
              className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          {/* User Sign In */}
          <Link 
            href="/signin" 
            className="px-6 py-2 border border-neutral-300 rounded-full text-sm font-medium text-gray-700 bg-white hover:bg-neutral-50 hover:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#0054b6] focus:ring-offset-2 transition-all"
            aria-label="Sign in to your account"
          >
            User Sign In
          </Link>

          {/* Cart Icon */}
          <Link 
            href="/cart" 
            className="flex items-center justify-center w-10 h-10 hover:bg-neutral-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#0054b6] focus:ring-offset-2"
            aria-label="View shopping cart"
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
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </Link>
        </div>

        {/* Bottom Row: Logo, Navigation, Search */}
        <div className="flex items-center justify-between gap-8">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-[#0054b6] focus:ring-offset-2 rounded"
            aria-label="BAPI Home"
          >
            <Image
              src="/BAPI_Logo_with_white_border.jpg"
              alt="BAPI - Sensors for HVAC/R"
              width={200}
              height={67}
              priority
              className="h-12 sm:h-14 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8 xl:space-x-12" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-base xl:text-lg text-gray-900 hover:text-[#0054b6] font-semibold transition-colors relative group focus:outline-none focus:text-[#0054b6]"
              >
                {link.label}
                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-[#0054b6] transition-all group-hover:w-full group-focus:w-full" aria-hidden="true" />
              </Link>
            ))}
          </nav>

          {/* Search and Mobile Menu */}
          <div className="flex items-center gap-2">
            {/* Search Icon */}
            <button 
              className="flex items-center justify-center w-10 h-10 hover:bg-neutral-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#0054b6] focus:ring-offset-2"
              aria-label="Search"
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

            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full hover:bg-neutral-100 transition-colors focus:outline-none focus:ring-2 focus:ring-[#0054b6] focus:ring-offset-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6 text-gray-700" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                strokeWidth={2}
                aria-hidden="true"
              >
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <nav 
            className="lg:hidden mt-4 pt-4 border-t border-neutral-200 animate-in slide-in-from-top-2 duration-200"
            aria-label="Mobile navigation"
          >
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block px-4 py-3 text-base font-semibold text-gray-900 hover:bg-neutral-50 hover:text-[#0054b6] rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#0054b6]"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;