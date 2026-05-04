import type { Metadata } from "next";
import SubNavbar from "@/components/SubNavbar";
import SubFooter from "@/components/SubFooter";
import AboutPageClient from "./AboutPageClient";

export const metadata: Metadata = {
  title: "About Code Tunnel — Frontend Architecture & Custom Web Agency in Kolkata",
  description: "Code Tunnel is a Kolkata-based custom web agency specializing in frontend architecture, UX/UI design, and scalable Next.js development. Serving clients across India. No templates, strictly bespoke.",
  keywords: ["web development agency Kolkata", "custom web design India", "Next.js developers Kolkata", "frontend architecture agency"],
  alternates: {
    canonical: "https://codetunnel.co.in/about",
  },
};

import { Schema } from "@/components/Schema";

export default function AboutPage() {
  const serviceData = {
    "name": "Code Tunnel",
    "url": "https://codetunnel.co.in",
    "logo": "https://codetunnel.co.in/logo.png",
    "description": "Custom web development agency based in Kolkata, India.",
    "foundingDate": "2024",
    "numberOfEmployees": "5-10",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Kolkata",
      "addressRegion": "West Bengal",
      "addressCountry": "IN"
    },
    "sameAs": [
      "https://instagram.com/codetunnel",
      "https://linkedin.com/company/codetunnel"
    ]
  };

  return (
    <>
      <SubNavbar />
      <Schema type="Service" data={serviceData} />
      <AboutPageClient />
      <SubFooter />
    </>
  );
}
