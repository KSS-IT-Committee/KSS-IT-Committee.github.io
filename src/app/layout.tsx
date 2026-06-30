/**
 * @fileoverview Root layout component for the entire application.
 * @module app/layout
 *
 * Provides the base HTML structure and global providers for all pages:
 * - Google Fonts (Geist Sans and Geist Mono)
 * - Google Analytics 4 (via @next/third-parties)
 * - NoScript fallback for JavaScript-disabled browsers
 * - Konami Code Easter egg
 * - Global CSS styles
 */
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { GoogleAnalytics } from "@next/third-parties/google";

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

// Google Analytics 4 measurement ID for this app's GA property.
// Issue a GA4 property and paste its measurement ID here (format: G-XXXXXXXXXX).
// Left empty until then, which disables the tag. It must NOT be a NEXT_PUBLIC_
// env var — those inline into the client bundle at build time.
// eslint-disable-next-line @typescript-eslint/naming-convention
const GA_MEASUREMENT_ID = "";

/** Page metadata for SEO and browser tab */
export const metadata: Metadata = {
  title: "IT Committee Home page!",
  description: "Home page for IT Committee",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
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
    <html lang="ja">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <NoScript />
        <KonamiEaster
          imageSrc="/images/koisshi.png"
          imageAlt="koisshi"
          width={100}
          height={100}
        />
        {children}
      </body>
      {/* Google tag (gtag.js) via @next/third-parties — the official Next.js
          integration. Skipped on PR preview deployments: IS_PR_PREVIEW is
          injected at runtime by the deploy infra and read here server-side, so
          it must NOT be NEXT_PUBLIC_ (those inline at build time). */}
      {GA_MEASUREMENT_ID && process.env.IS_PR_PREVIEW !== "true" && (
        <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />
      )}
    </html>
  );
}
