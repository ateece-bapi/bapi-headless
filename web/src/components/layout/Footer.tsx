
import React from "react";

const navigation = [
  { name: "Products", href: "/products" },
  { name: "Solutions", href: "/solutions" },
  { name: "Support", href: "/support" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

const social = [
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/company/bapi-building-automation-products-inc-/",
    icon: (
      <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
        <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm15.5 10.28h-3v-4.5c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.17-1.73 2.39v4.58h-3v-9h2.89v1.23h.04c.4-.75 1.37-1.54 2.82-1.54 3.01 0 3.57 1.98 3.57 4.56v4.75z" />
      </svg>
    ),
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/@BAPIInc",
    icon: (
      <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
        <path d="M23.498 6.186a2.994 2.994 0 0 0-2.112-2.12C19.425 3.5 12 3.5 12 3.5s-7.425 0-9.386.566A2.994 2.994 0 0 0 .502 6.186C0 8.147 0 12 0 12s0 3.853.502 5.814a2.994 2.994 0 0 0 2.112 2.12C4.575 20.5 12 20.5 12 20.5s7.425 0 9.386-.566a2.994 2.994 0 0 0 2.112-2.12C24 15.853 24 12 24 12s0-3.853-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
];


const Footer: React.FC = () => (
  <footer
    className="w-full border-t mt-16 shadow-inner"
    style={{
      background: 'var(--color-primary-950)',
      color: 'var(--color-primary-100)',
      borderColor: 'var(--color-primary-800)',
    }}
  >
    <div
      className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-4 gap-12 border-b"
      style={{ borderColor: 'var(--color-primary-800)' }}
    >
      {/* Brand & Mission */}
      <div className="flex flex-col gap-4">
        <img src="/bapi-logo.svg" alt="BAPI Logo" className="h-12 w-auto mb-2 drop-shadow-lg" />
        <p className="text-base font-medium leading-relaxed" style={{ color: 'var(--color-primary-100)' }}>
          <span style={{ color: 'var(--color-accent-500)', fontWeight: 700 }}>Precision Sensor Solutions</span> for Building Automation.<br />
          <span style={{ color: 'var(--color-primary-200)' }}>Trusted by engineers worldwide for mission-critical facilities.</span>
        </p>
      </div>
      {/* Quick Links */}
      <nav aria-label="Footer Navigation" className="flex flex-col gap-2">
        <span className="font-semibold mb-2 tracking-wide uppercase" style={{ color: 'var(--color-accent-500)' }}>Quick Links</span>
        {navigation.map((item) => (
          <a
            key={item.name}
            href={item.href}
            className="text-sm font-medium py-0.5 transition-colors hover:underline hover:text-yellow-400"
            style={{ color: 'var(--color-primary-100)' }}
          >
            {item.name}
          </a>
        ))}
      </nav>
      {/* Contact */}
      <div className="flex flex-col gap-2">
        <span className="font-semibold mb-2 tracking-wide uppercase" style={{ color: 'var(--color-accent-500)' }}>Contact</span>
        <span className="text-sm" style={{ color: 'var(--color-primary-100)' }}>750 N Royal Ave, Gays Mills, WI 54631</span>
        <a href="tel:6087354800" className="text-sm font-medium transition-colors hover:underline hover:text-yellow-400" style={{ color: 'var(--color-primary-100)' }}>(608) 735-4800</a>
        <a href="mailto:sales@bapihvac.com" className="text-sm font-medium transition-colors hover:underline hover:text-yellow-400" style={{ color: 'var(--color-primary-100)' }}>sales@bapihvac.com</a>
      </div>
      {/* Social & Copyright */}
      <div className="flex flex-col gap-4 items-start md:items-end justify-between h-full">
        <div className="flex gap-4 mb-2">
          {social.map((item) => (
            <a
              key={item.name}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={item.name}
              className="rounded-full p-2 transition-colors shadow-md border hover:bg-yellow-400 hover:text-black"
              style={{
                background: 'var(--color-primary-900)',
                color: 'var(--color-accent-500)',
                borderColor: 'var(--color-primary-800)',
              }}
            >
              {item.icon}
            </a>
          ))}
        </div>
        <span className="text-xs font-medium tracking-wide" style={{ color: 'var(--color-primary-200)' }}>© {new Date().getFullYear()} BAPI. All rights reserved.</span>
      </div>
    </div>
    <div
      className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between text-xs"
      style={{ color: 'var(--color-primary-200)' }}
    >
      <span>BAPI® is a registered trademark of Building Automation Products, Inc.</span>
      <a
        href="#top"
        className="ml-2 font-semibold transition-colors hover:text-white hover:underline"
        style={{ color: 'var(--color-accent-500)' }}
      >
        Back to Top ↑
      </a>
    </div>
  </footer>
);

export default Footer;
