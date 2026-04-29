import type { Metadata } from "next";
import SubNavbar from "@/components/SubNavbar";
import SubFooter from "@/components/SubFooter";

export const metadata: Metadata = {
  title: "Web Development Blog — Code Tunnel Kolkata",
  description: "Insights on web development, React, Next.js, SEO, and digital strategy from the Code Tunnel team in Kolkata.",
  alternates: {
    canonical: "https://codetunnel.in/blog",
  },
};

export default function BlogPage() {
  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Code Tunnel Web Development Blog",
    "description": "Expert digital insights on web design, Next.js tech scaling, and search presence from Code Tunnel Kolkata.",
    "publisher": {
      "@type": "ProfessionalService",
      "name": "Code Tunnel"
    }
  };

  const posts = [
    {
      title: "Why Your Kolkata Business Needs a Custom Website in 2026",
      excerpt: "A template website might look decent, but it won't rank, won't convert, and won't represent your brand the way a custom-built site will. Here's why Kolkata businesses are switching.",
      keyword: "custom website Kolkata",
    },
    {
      title: "React vs WordPress: Which is Right for Your Business?",
      excerpt: "WordPress powers 40% of the internet, but React is taking over for performance-critical sites. We break down which one suits your business and budget.",
      keyword: "React vs WordPress India",
    },
    {
      title: "5 SEO Mistakes Small Business Websites Make (And How to Fix Them)",
      excerpt: "Most small business websites are invisible to Google — not because of bad luck, but because of five fixable mistakes. Here's what they are and how to solve them.",
      keyword: "SEO mistakes small business website",
    }
  ];

  return (
    <>
      <SubNavbar />
      <main className="min-h-screen bg-[#0a0a0a] text-white py-32 px-6 md:px-12">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
        />

        <div className="max-w-5xl mx-auto pt-20">
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 tracking-tight">
            From the Code Tunnel Blog
          </h1>
          <p className="text-xl text-white/60 mb-16 max-w-2xl leading-relaxed">
            In-depth analysis on modern engineering protocols, user experience design heuristics, and digital brand acceleration strategies.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {posts.map((p, i) => (
              <article 
                key={i} 
                className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 flex flex-col justify-between hover:border-white/20 transition-all duration-300"
              >
                <div>
                  <span className="inline-flex items-center px-3 py-1 text-xs bg-white/10 rounded-full font-bold text-white/80 mb-6">
                    {p.keyword}
                  </span>
                  <h2 className="text-2xl font-serif font-bold text-white mb-4 leading-snug">
                    {p.title}
                  </h2>
                  <p className="text-white/50 text-sm leading-relaxed mb-6">
                    {p.excerpt}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-white text-black px-2.5 py-1 rounded-sm">
                    Coming Soon
                  </span>
                  <a 
                    href="/contact" 
                    className="text-xs font-bold text-white hover:text-white/80 border-b border-white/20 pb-0.5"
                  >
                    Get a website that ranks
                  </a>
                </div>
              </article>
            ))}
          </div>

          <div className="text-center py-12 border-t border-white/5">
            <p className="text-white/40 text-sm mb-6">Need a custom technical roadmap for your next big build?</p>
            <a
              href="/contact"
              className="inline-flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/10 text-white rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-white/10 transition-all"
            >
              Connect With Our Developers
            </a>
          </div>
        </div>
      </main>
      <SubFooter />
    </>
  );
}
