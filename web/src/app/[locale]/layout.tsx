import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

/**
 * Locale layout - wraps all localized pages with Header/Footer
 * This prevents duplicate headers in root layout
 */
export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  return (
    <>
      {/* Skip to main content link for keyboard users */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-skip-link focus:px-6 focus:py-3 focus:bg-primary-600 focus:text-white focus:rounded-lg focus:shadow-lg focus:font-semibold focus:ring-4 focus:ring-primary-300"
      >
        Skip to main content
      </a>
      
      <Header />
      <main id="main-content">
        {children}
      </main>
      <Footer />
    </>
  );
}
