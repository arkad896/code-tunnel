import type { Metadata } from "next";
import ContactPageClient from "./ContactPageClient";

export const metadata: Metadata = {
  title: "Contact Code Tunnel — Custom Web Development Agency in Kolkata",
  description: "Get in touch with Code Tunnel, Kolkata's premier custom web development agency. Discuss your project, get a free quote, and start building your digital presence today.",
  keywords: ["contact web development agency Kolkata", "hire web developers India", "custom website quote"],
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
      <div className="min-h-screen bg-[#0a0a0a]">
        <ContactPageClient />
      </div>
    </>
  );
}
