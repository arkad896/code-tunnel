import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Suspense } from "react";
import ChatWidget from "@/components/ChatWidget";
import NavigationProgress from "@/components/NavigationProgress";

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://codetunnel.co.in"),
  title: "Code Tunnel — Custom Web Development Agency in Kolkata",
  description: "Code Tunnel builds modern, high-performance websites and web apps for businesses across India. Based in Kolkata. React, Node.js, SEO-ready.",
  alternates: {
    canonical: "https://codetunnel.co.in",
  },
  openGraph: {
    type: "website",
    url: "https://codetunnel.co.in",
    title: "Code Tunnel — Custom Web Development Agency in Kolkata",
    description: "Code Tunnel builds modern, high-performance websites and web apps for businesses across India. Based in Kolkata. React, Node.js, SEO-ready.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Code Tunnel",
      },
    ],
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
      </head>
      <body className="min-h-full flex flex-col">
        <Suspense fallback={null}>
          <NavigationProgress />
        </Suspense>
        <Suspense fallback={null}>
          {children}
        </Suspense>
        <Suspense fallback={null}>
          <ChatWidget />
        </Suspense>
      </body>
    </html>
  );
}