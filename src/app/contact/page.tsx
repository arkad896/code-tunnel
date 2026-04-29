import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Work With Us — Code Tunnel",
  description: "Get in touch with Code Tunnel to discuss your web project. Based in Kolkata, serving clients across India.",
  alternates: {
    canonical: "https://codetunnel.in/contact",
  },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white p-6">
      <div className="max-w-2xl text-center">
        <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">Work With Us</h1>
        <p className="text-white/60 mb-8">Get in touch with Code Tunnel to discuss your web project. Based in Kolkata, serving clients across India.</p>
        <a href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-lg font-bold">
          ← Back to Home
        </a>
      </div>
    </main>
  );
}
