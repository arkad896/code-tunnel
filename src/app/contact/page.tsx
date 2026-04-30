import type { Metadata } from "next";
import ContactPageClient from "./ContactPageClient";

export const metadata: Metadata = {
  title: "Work With Us — Code Tunnel",
  description: "Get in touch with Code Tunnel to discuss your web project. Based in Kolkata, serving clients across India.",
  alternates: {
    canonical: "https://codetunnel.co.in/contact",
  },
};

export default function ContactPage() {
  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "mainEntity": {
      "@type": "Organization",
      "name": "Code Tunnel",
      "url": "https://codetunnel.co.in",
      "contactPoint": {
        "@type": "ContactPoint",
        "email": "hello@codetunnel.co.in",
        "contactType": "customer service",
        "areaServed": "IN",
        "availableLanguage": ["English", "Hindi", "Bengali"]
      }
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />
      <ContactPageClient />
    </>
  );
}
