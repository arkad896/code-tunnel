import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Suspense } from "react";
import ChatWidget from "@/components/ChatWidget";
import { GoogleAnalytics } from '@next/third-parties/google';
import { Schema } from "@/components/Schema";

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://codetunnel.co.in"),
  title: "Code Tunnel — Custom Web Development Agency in Kolkata",
  description: "Code Tunnel is a custom website design agency based in Kolkata, delivering premium digital infrastructure across India.",
  alternates: {
    canonical: "https://codetunnel.co.in",
  },
  verification: {
    google: "YOUR_VERIFICATION_CODE",
  },
  openGraph: {
    type: "website",
    url: "https://codetunnel.co.in/",
    title: "Code Tunnel — Custom Web Development Agency in Kolkata",
    description: "Code Tunnel is a custom website design agency based in Kolkata, delivering premium digital infrastructure across India.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Code Tunnel",
      },
    ],
    locale: "en_IN",
    siteName: "Code Tunnel",
  },
  twitter: {
    card: "summary_large_image",
    site: "@codetunnel",
    creator: "@codetunnel",
    title: "Code Tunnel — Custom Web Development Agency in Kolkata",
    description: "Code Tunnel is a custom website design agency based in Kolkata, delivering premium digital infrastructure across India.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <GoogleAnalytics gaId="G-XXXXXXXXXX" />
        <Schema />
      </head>
      <body className="min-h-full flex flex-col">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-black">
          Skip to main content
        </a>
        <main id="main-content">
          {children}
        </main>
        <Suspense fallback={null}>
          <ChatWidget />
        </Suspense>
      </body>
    </html>
  );
}