import type { Metadata } from "next";
import SubNavbar from "@/components/SubNavbar";
import SubFooter from "@/components/SubFooter";
import ServicesPageClient from "./ServicesPageClient";

export const metadata: Metadata = {
  title: "Frontend Development & UX/UI Services in Kolkata — Code Tunnel",
  description: "Code Tunnel provides elite frontend development, UX/UI design, and full-stack Next.js web applications. Custom React websites for businesses. Starting ₹24,999.",
  alternates: {
    canonical: "https://codetunnel.co.in/services",
  },
};

export default function ServicesPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How long does a website project take?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A landing page typically takes 5–7 working days. A full website takes 3–4 weeks depending on scope and content availability."
        }
      },
      {
        "@type": "Question",
        "name": "Do you work with clients outside Kolkata?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Code Tunnel works with clients across India. All communication via WhatsApp, email, and video calls."
        }
      },
      {
        "@type": "Question",
        "name": "What do I need to provide to get started?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Your brand assets (logo, colors), a rough idea of what you need, and your budget. We handle everything else."
        }
      },
      {
        "@type": "Question",
        "name": "Can you redesign my existing website?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. We offer full redesign and migration services for existing websites."
        }
      },
      {
        "@type": "Question",
        "name": "Do you offer maintenance after launch?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. We offer monthly maintenance packages for updates, performance monitoring, and content changes."
        }
      }
    ]
  };

  const servicesSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": [
      {
        "@type": "Service",
        "position": 1,
        "name": "Landing Pages",
        "description": "High-converting landing page designed around your offer. Mobile-first, fast-loading, built to convert visitors into leads.",
        "offers": {
          "@type": "Offer",
          "price": "24999",
          "priceCurrency": "INR"
        },
        "provider": {
          "@type": "ProfessionalService",
          "name": "Code Tunnel"
        }
      },
      {
        "@type": "Service",
        "position": 2,
        "name": "Business Websites",
        "description": "Multi-page websites with CMS integration, SEO foundation, and performance optimization. Built in React and Next.js.",
        "offers": {
          "@type": "Offer",
          "price": "49999",
          "priceCurrency": "INR"
        },
        "provider": {
          "@type": "ProfessionalService",
          "name": "Code Tunnel"
        }
      },
      {
        "@type": "Service",
        "position": 3,
        "name": "Custom Web Applications",
        "description": "Bespoke web apps with backend logic, database integration, and scalable architecture. TypeScript and Node.js backend.",
        "offers": {
          "@type": "Offer",
          "price": "Custom",
          "priceCurrency": "INR"
        },
        "provider": {
          "@type": "ProfessionalService",
          "name": "Code Tunnel"
        }
      }
    ]
  };

  return (
    <>
      <SubNavbar />
      <ServicesPageClient faqSchema={faqSchema} servicesSchema={servicesSchema} />
      <SubFooter />
    </>
  );
}
