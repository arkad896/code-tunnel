import type { Metadata } from "next";
import SubNavbar from "@/components/SubNavbar";
import SubFooter from "@/components/SubFooter";

export const metadata: Metadata = {
  title: "About Code Tunnel — Custom Web Development Agency in Kolkata",
  description: "Code Tunnel is a Kolkata-based web development agency. Custom-built websites, no templates, developer-direct communication. Serving businesses across India.",
  alternates: {
    canonical: "https://codetunnel.in/about",
  },
};

export default function AboutPage() {
  const professionalServiceSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "Code Tunnel",
    "url": "https://codetunnel.in",
    "logo": "https://codetunnel.in/logo.png",
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
      <main className="min-h-screen bg-[#0a0a0a] text-white py-32 px-6 md:px-12">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(professionalServiceSchema) }}
        />

        <div className="max-w-4xl mx-auto pt-20">
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-12 tracking-tight">
            Built in Kolkata. Focused on Results.
          </h1>

          <div className="space-y-8 text-lg text-white/70 leading-relaxed max-w-3xl mb-16">
            <p>
              Code Tunnel is an independent web development agency based in Kolkata, West Bengal. 
              We build modern digital experiences for brands looking to establish a definitive edge. From startups in Bangalore to growing businesses in Mumbai, we deliver web software across India.
            </p>
            <p>
              We strictly do not use generic templates or shortcuts. We believe every brand deserves an online identity engineered specifically for them. We provide absolute transparency with developer-direct communication — cutting out standard corporate friction.
            </p>
            <p>
              Our infrastructure leverages standard technologies to generate high-speed visual delivery. Relying on continuous improvement loops, our software maintains production resilience.
            </p>
          </div>

          <h2 className="text-3xl font-serif font-semibold mt-16 mb-8 border-b border-white/10 pb-4">
            Why Businesses Choose Code Tunnel
          </h2>

          <div className="space-y-8 max-w-3xl mb-16">
            <div>
              <h3 className="text-2xl font-serif font-medium text-white mb-3">
                No Templates
              </h3>
              <p className="text-white/60 leading-relaxed">
                Every site is designed and built from scratch for your brand. Stand out with a fully optimized identity.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-serif font-medium text-white mb-3">
                Direct Communication
              </h3>
              <p className="text-white/60 leading-relaxed">
                You talk to the developer. No account managers, no middlemen. Faster iteration and better understanding.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-serif font-medium text-white mb-3">
                Business-First Thinking
              </h3>
              <p className="text-white/60 leading-relaxed">
                We build for conversions, speed, and search visibility — not just aesthetics. Real digital equity that serves bottom-line goals.
              </p>
            </div>
          </div>

          <h2 className="text-3xl font-serif font-semibold mt-16 mb-6 border-b border-white/10 pb-4">
            Our Stack
          </h2>
          <p className="text-white/60 text-lg leading-relaxed max-w-3xl mb-12">
            We use hardened, industry-standard modern web primitives. Our implementations rely heavily on <strong className="text-white">React</strong>, <strong className="text-white">Next.js</strong>, <strong className="text-white">Node.js</strong>, and <strong className="text-white">TypeScript</strong> deployed over global architectures like Vercel.
          </p>

          <div className="flex flex-col md:flex-row items-center gap-6 mt-16 border-t border-white/10 pt-12">
            <a
              href="/services"
              className="text-white hover:text-white/80 font-bold tracking-wider text-sm border-b border-white/30 pb-1"
            >
              See our web development services
            </a>
            <span className="hidden md:block text-white/30">|</span>
            <a
              href="/contact"
              className="text-white hover:text-white/80 font-bold tracking-wider text-sm border-b border-white/30 pb-1"
            >
              Start a project with us
            </a>
          </div>
        </div>
      </main>
      <SubFooter />
    </>
  );
}
