/**
 * @fileoverview Root layout component for the entire application.
 * @module app/layout
 *
 * Provides the base HTML structure and global providers for all pages:
 * - Google Fonts (Geist Sans and Geist Mono)
 * - Vercel Analytics for usage tracking
 * - Vercel Speed Insights for performance monitoring
 * - NoScript fallback for JavaScript-disabled browsers
 * - Konami Code Easter egg
 * - Global CSS styles
 */
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { KonamiEaster } from "@/components/Konami-Easter";
import { NoScript } from "@/components/NoScript";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/** Page metadata for SEO and browser tab */
export const metadata: Metadata = {
  title: "IT Committee Home page!",
  description: "Home page for IT Committee",
};

/**
 * Root layout component that wraps all pages.
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child page content
 * @returns {JSX.Element} The HTML document structure
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Analytics />
        <NoScript />
        <SpeedInsights />
        <KonamiEaster
          imageSrc="/images/koisshi.png"
          imageAlt="koisshi"
          width={100}
          height={100}
        />
        {children}
      </body>
    </html>
  );
}
