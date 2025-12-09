import React from "react";

export default function Header() {
  return (
    <header className="border-b border-neutral-200 bg-white sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Logo */}
          <a href="/" className="font-bold text-xl text-blue-700">BAPI</a>
        </div>
        {/* Navigation (add links as needed) */}
        <nav className="flex gap-6">
          <a href="/products" className="text-neutral-700 hover:text-blue-700">Products</a>
          <a href="/contact" className="text-neutral-700 hover:text-blue-700">Contact</a>
        </nav>
      </div>
    </header>
  );
}
