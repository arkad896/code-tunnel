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
  return <ContactPageClient />;
}
