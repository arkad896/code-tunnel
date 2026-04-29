import type { Metadata } from "next";
import SubNavbar from "@/components/SubNavbar";
import SubFooter from "@/components/SubFooter";

export const metadata: Metadata = {
  title: "Web Development Services in Kolkata — Code Tunnel",
  description: "Custom landing pages, React websites, and full-stack web apps built for businesses across India. No templates. Starting ₹24,999. Based in Kolkata.",
  alternates: {
    canonical: "https://codetunnel.in/services",
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
      <main className="min-h-screen bg-[#0a0a0a] text-white py-32 px-6 md:px-12">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesSchema) }}
        />
        
        <div className="max-w-4xl mx-auto pt-20">
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 tracking-tight">
            Web Development Services Built for Real Business
          </h1>
          <p className="text-xl text-white/70 mb-16 leading-relaxed max-w-3xl">
            Code Tunnel provides high-performance, custom-built web development services in Kolkata. 
            As an experienced React developer in Kolkata, we construct optimized, modern landing pages and robust full-stack web applications for businesses scaling across India.
          </p>

          <h2 className="text-3xl font-serif font-semibold mt-16 mb-8 border-b border-white/10 pb-4">
            What We Build
          </h2>
          
          <div className="space-y-12">
            <section>
              <h3 className="text-2xl font-serif font-medium text-white mb-3">
                Landing Pages — From ₹24,999
              </h3>
              <p className="text-white/60 text-lg leading-relaxed max-w-3xl">
                High-converting landing page designed around your offer. Mobile-first, fast-loading, built to convert visitors into leads. Ideal for targeted ad campaigns and quick rollouts.
              </p>
            </section>

            <section>
              <h3 className="text-2xl font-serif font-medium text-white mb-3">
                Business Websites — From ₹49,999
              </h3>
              <p className="text-white/60 text-lg leading-relaxed max-w-3xl">
                Multi-page websites with CMS integration, SEO foundation, and performance optimization. Built in React and Next.js for flawless speed and professional authority.
              </p>
            </section>

            <section>
              <h3 className="text-2xl font-serif font-medium text-white mb-3">
                Custom Web Applications — Scoped Per Project
              </h3>
              <p className="text-white/60 text-lg leading-relaxed max-w-3xl">
                Bespoke web apps with backend logic, database integration, and scalable architecture. Utilizing TypeScript and Node.js backend to address complex business requirements.
              </p>
            </section>
          </div>

          <h2 className="text-3xl font-serif font-semibold mt-24 mb-8 border-b border-white/10 pb-4">
            Our Process
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-serif font-medium text-white mb-3">
                1. Discovery
              </h3>
              <p className="text-white/50 leading-relaxed">
                We understand your business, audience, and goals before writing a single line of code.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-serif font-medium text-white mb-3">
                2. Design & Build
              </h3>
              <p className="text-white/50 leading-relaxed">
                Custom UI, responsive layout, performance-first development from the ground up.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-serif font-medium text-white mb-3">
                3. Launch & Support
              </h3>
              <p className="text-white/50 leading-relaxed">
                Deployment, testing, and one month of post-launch support included.
              </p>
            </div>
          </div>

          <h2 className="text-3xl font-serif font-semibold mt-24 mb-8 border-b border-white/10 pb-4">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-6">
            <div>
              <p className="text-lg font-bold text-white mb-2">How long does a website project take?</p>
              <p className="text-white/60 leading-relaxed">A landing page typically takes 5–7 working days. A full website takes 3–4 weeks depending on scope and content availability.</p>
            </div>
            <div>
              <p className="text-lg font-bold text-white mb-2">Do you work with clients outside Kolkata?</p>
              <p className="text-white/60 leading-relaxed">Yes. Code Tunnel works with clients across India. All communication via WhatsApp, email, and video calls.</p>
            </div>
            <div>
              <p className="text-lg font-bold text-white mb-2">What do I need to provide to get started?</p>
              <p className="text-white/60 leading-relaxed">Your brand assets (logo, colors), a rough idea of what you need, and your budget. We handle everything else.</p>
            </div>
            <div>
              <p className="text-lg font-bold text-white mb-2">Can you redesign my existing website?</p>
              <p className="text-white/60 leading-relaxed">Yes. We offer full redesign and migration services for existing websites.</p>
            </div>
            <div>
              <p className="text-lg font-bold text-white mb-2">Do you offer maintenance after launch?</p>
              <p className="text-white/60 leading-relaxed">Yes. We offer monthly maintenance packages for updates, performance monitoring, and content changes.</p>
            </div>
          </div>

          <div className="mt-24 text-center">
            <h2 className="text-3xl font-serif font-semibold mb-6">
              Ready to Build Something?
            </h2>
            <p className="text-white/60 mb-8 max-w-xl mx-auto">
              Bring your digital vision to life with custom web app development. 
              Connect with an expert web developer in Kolkata to explore bespoke custom website design.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-3 px-10 py-5 bg-white text-[#0a0a0a] rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-white/90 transition-all shadow-xl"
            >
              Start a Project with Us
            </a>
          </div>
        </div>
      </main>
      <SubFooter />
    </>
  );
}
