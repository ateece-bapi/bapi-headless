import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

/**
 * Locale layout - wraps all localized pages with Header/Footer
 * This prevents duplicate headers in root layout
 */
export default function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
