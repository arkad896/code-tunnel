"use client";

import { motion } from "framer-motion";

export default function ServicesPageClient() {
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true, margin: "-100px" },
    transition: { staggerChildren: 0.1 }
  };

  const staggerItem = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const services = [
    {
      title: "Landing Pages",
      price: "₹24,999",
      desc: "High-converting landing page designed around your offer. Mobile-first, fast-loading, built to convert visitors into leads.",
      features: ["5-7 Working Days", "Foundational SEO", "Performance Optimization", "Ad Campaign Ready"]
    },
    {
      title: "Business Websites",
      price: "₹49,999",
      desc: "Multi-page websites with CMS integration, SEO foundation, and performance optimization. Built in React and Next.js.",
      features: ["3-4 Weeks Timeline", "Full SEO & Schema", "CMS Integration", "Premium Brand Design"]
    },
    {
      title: "Custom Web Apps",
      price: "Custom",
      desc: "Bespoke web apps with backend logic, database integration, and scalable architecture. Utilizing modern technology.",
      features: ["Advanced Logic", "Database Systems", "API Integrations", "Long-term Scalability"]
    }
  ];

  return (
    <main className="min-h-screen bg-[#070707] text-white py-32 px-6 md:px-12 selection:bg-white selection:text-black">
      <div className="max-w-6xl mx-auto pt-20">
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-xs font-black uppercase tracking-[0.4em] text-[#8b6f4f] mb-4">
            OUR CAPABILITIES & PRICING
          </p>
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 tracking-tight max-w-4xl mx-auto">
            Web Development Services Built for Real Business
          </h1>
          <p className="text-xl text-white/60 mb-16 leading-relaxed max-w-2xl mx-auto">
            Code Tunnel provides high-performance, custom-built web assets engineered to drive growth and operational efficiency.
          </p>
        </motion.div>

        {/* Pricing Bento Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32"
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true, margin: "-100px" }}
        >
          {services.map((s, i) => (
            <motion.div 
              key={i} 
              variants={staggerItem}
              className={`bg-white/[0.02] border rounded-3xl p-10 flex flex-col justify-between hover:bg-white/[0.04] transition-all duration-500 relative overflow-hidden group ${
                i === 1 ? 'border-[#8b6f4f] md:scale-105 shadow-2xl shadow-[#8b6f4f]/5' : 'border-white/10 hover:border-white/20'
              }`}
            >
              {i === 1 && (
                <div className="absolute top-0 right-0 p-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-[#8b6f4f] text-white px-3 py-1 rounded-full">
                    Recommended
                  </span>
                </div>
              )}
              
              <div>
                <h3 className="text-2xl font-serif font-bold mb-4">{s.title}</h3>
                <div className="mb-6">
                  <span className="text-3xl font-bold">{s.price}</span>
                  {s.price !== "Custom" && <span className="text-white/40 text-xs ml-2 uppercase tracking-tighter">Start</span>}
                </div>
                <p className="text-white/50 text-sm leading-relaxed mb-8">
                  {s.desc}
                </p>
              </div>

              <div className="space-y-4">
                <div className="h-px bg-white/10 w-full mb-6" />
                <ul className="space-y-3 mb-10">
                  {s.features.map((f, fi) => (
                    <li key={fi} className="flex items-center gap-3 text-xs text-white/70">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#8b6f4f]" />
                      {f}
                    </li>
                  ))}
                </ul>
                <a 
                  href="/contact"
                  className={`w-full py-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-center transition-all ${
                    i === 1 ? 'bg-[#8b6f4f] text-white hover:bg-[#a68d6d]' : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'
                  }`}
                >
                  Initiate Project
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* FAQ Section */}
        <div className="mb-32">
          <motion.div 
            className="text-center mb-16"
            {...fadeInUp}
          >
            <h2 className="text-3xl font-serif font-bold mb-4">Common Inquiries</h2>
            <p className="text-white/40 text-xs uppercase tracking-[0.3em]">
              Frequently Asked Questions
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
          >
            {[
              {
                q: "How long does a website project take?",
                a: "A landing page typically takes 5–7 working days. A full website takes 3–4 weeks depending on scope and content availability."
              },
              {
                q: "Do you work with clients outside Kolkata?",
                a: "Yes. Code Tunnel works with clients across India. All communication via WhatsApp, email, and video calls."
              },
              {
                q: "What do I need to provide to get started?",
                a: "Your brand assets (logo, colors), a rough idea of what you need, and your budget. We handle everything else."
              },
              {
                q: "Can you redesign my existing website?",
                a: "Yes. We offer full redesign and migration services for existing websites."
              },
              {
                q: "Do you offer maintenance after launch?",
                a: "Yes. We offer monthly maintenance packages for updates, performance monitoring, and content changes."
              }
            ].map((faq, idx) => (
              <motion.article
                key={idx}
                variants={staggerItem}
                className="bg-white/[0.01] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all"
              >
                <h3 className="text-base font-bold text-white mb-2">{faq.q}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{faq.a}</p>
              </motion.article>
            ))}
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div 
          className="text-center bg-gradient-to-b from-white/5 to-transparent border border-white/10 rounded-[2rem] py-16 px-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-serif font-semibold mb-6">
            Ready to Build Something?
          </h2>
          <p className="text-white/60 mb-8 max-w-xl mx-auto text-sm leading-relaxed">
            Bring your digital vision to life with custom web app development. 
            Connect with our team to explore options for your bespoke online system.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-3 px-10 py-5 bg-white text-[#0a0a0a] rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-white/90 transition-all shadow-xl"
          >
            Start a Project with Us
          </a>
        </motion.div>
      </div>
    </main>
  );
}
