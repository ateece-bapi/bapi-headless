import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "../components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "BAPI | Building Automation Products",
    template: "%s | BAPI"
  },
  description: "Shop building automation sensors and control modules. Reliable, accurate, and trusted by professionals.",
  openGraph: {
    title: "BAPI | Building Automation Products",
    description: "Shop building automation sensors and control modules. Reliable, accurate, and trusted by professionals.",
    type: "website",
    url: "https://yourdomain.com/",
    siteName: "BAPI",
    images: [
      {
        url: "https://yourdomain.com/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "BAPI - Building Automation Products"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    site: "@bapi",
    title: "BAPI | Building Automation Products",
    description: "Shop building automation sensors and control modules. Reliable, accurate, and trusted by professionals.",
    images: ["https://yourdomain.com/og-default.jpg"]
  },
  metadataBase: new URL("https://yourdomain.com/"),
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/en",
      "es-ES": "/es"
    }
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        {children}
      </body>
    </html>
  );
}
