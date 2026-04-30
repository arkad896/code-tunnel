import type { Metadata } from "next";
import SubNavbar from "@/components/SubNavbar";
import SubFooter from "@/components/SubFooter";
import AboutPageClient from "./AboutPageClient";

export const metadata: Metadata = {
  title: "About Code Tunnel — Frontend Architecture & Custom Web Agency",
  description: "Code Tunnel is a Kolkata-based custom web agency specializing in frontend architecture, modern UX/UI design, and scalable Next.js development. No templates, strictly bespoke.",
  alternates: {
    canonical: "https://codetunnel.co.in/about",
  },
};

export default function AboutPage() {
  const professionalServiceSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
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
      <AboutPageClient professionalServiceSchema={professionalServiceSchema} />
      <SubFooter />
    </>
  );
}
