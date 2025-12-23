import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

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
    default: "BAPI | Precision Sensor Solutions for Building Automation",
    template: "%s | BAPI"
  },
  description: "Engineered sensor solutions for mission-critical facilities. NIST-traceable accuracy, BACnet-certified controllers, trusted by engineers worldwide for healthcare, data centers, and critical infrastructure.",
  openGraph: {
    title: "BAPI | Precision Sensor Solutions for Building Automation",
    description: "Engineered sensor solutions for mission-critical facilities. NIST-traceable accuracy, BACnet-certified controllers, trusted by engineers worldwide.",
    type: "website",
    url: "https://bapi-headless.vercel.app/",
    siteName: "BAPI",
    images: [
      {
        url: "https://bapi-headless.vercel.app/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "BAPI - Building Automation Products"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    site: "@bapi",
    title: "BAPI | Precision Sensor Solutions for Building Automation",
    description: "Engineered sensor solutions for mission-critical facilities. NIST-traceable accuracy, BACnet-certified controllers, trusted by engineers worldwide.",
    images: ["https://bapi-headless.vercel.app/og-default.jpg"]
  },
  metadataBase: new URL("https://bapi-headless.vercel.app/"),
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
        <Footer />
      </body>
    </html>
  );
}
