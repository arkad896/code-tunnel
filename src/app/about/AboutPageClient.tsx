"use client";

import { motion } from "framer-motion";

interface AboutPageClientProps {
  professionalServiceSchema: any;
}

export default function AboutPageClient({ professionalServiceSchema }: AboutPageClientProps) {
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

  return (
    <main className="min-h-screen bg-[#070707] text-white py-32 px-6 md:px-12 selection:bg-white selection:text-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(professionalServiceSchema) }}
      />

      <div className="max-w-6xl mx-auto pt-20">
        {/* Header */}
        <motion.div 
          className="mb-24 border-b border-white/5 pb-16"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-xs font-black uppercase tracking-[0.5em] text-white/30 mb-6">
            CODE TUNNEL — CREDENTIALS · 2025
          </p>
          <h1 className="text-4xl md:text-7xl font-serif font-bold tracking-tight mb-8">
            Digital Solutions Provider
          </h1>
          <p className="text-xl md:text-2xl text-white/70 max-w-3xl leading-relaxed font-light">
            Building modern, high-performing, and conversion-driven web experiences for businesses that mean business.
          </p>
        </motion.div>

        {/* Who We Are */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-32"
          {...fadeInUp}
        >
          <div>
            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-[#8b6f4f]">
              ABOUT CODE TUNNEL
            </h2>
            <p className="text-xl font-serif font-semibold mt-2 text-white/90">
              Who We Are
            </p>
          </div>
          <div className="md:col-span-2">
            <p className="text-lg text-white/60 leading-relaxed">
              Code Tunnel is a digital solutions provider focused on building modern, high-performing, and conversion-driven web experiences for growing businesses. We combine strategic thinking with technical execution to deliver websites and digital systems that are not only visually refined but also aligned with real business goals — customer acquisition, engagement, and scalability.
            </p>
          </div>
        </motion.div>

        {/* Live Case Study Spotlight */}
        <motion.div 
          className="mb-32 bg-white/[0.02] border border-white/10 rounded-3xl p-8 md:p-12 relative overflow-hidden group hover:border-[#8b6f4f]/30 transition-all duration-500"
          {...fadeInUp}
        >
          <div className="max-w-2xl">
            <div className="mb-[30px]">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-[#8b6f4f] text-white px-3 py-1 rounded-sm">
                Live & Ranking #1
              </span>
            </div>
            <p className="text-xs font-black uppercase tracking-[0.4em] text-[#8b6f4f] mb-4">
              Featured Case Study
            </p>
            <h3 className="text-2xl md:text-4xl font-serif font-bold text-white mb-6">
              Modern Nursing Home
            </h3>
            <p className="text-white/60 text-base leading-relaxed mb-8">
              Built completely zero to 100 from strategy to deployment. Engineered for speed and maximum local search performance.
            </p>
            <div className="flex flex-wrap gap-4 items-center">
              <a 
                href="https://www.modernnursinghome.org/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs font-black uppercase tracking-[0.3em] text-white hover:text-[#8b6f4f] border-b border-white/20 hover:border-[#8b6f4f] pb-1 transition-all"
              >
                Visit Live Site &rarr;
              </a>
              <span className="text-white/30 text-xs font-light">
                (Search benchmark: &quot;modern nursing home suri&quot;)
              </span>
            </div>
          </div>
        </motion.div>

        {/* How We Work */}
        <div className="mb-32">
          <motion.div className="mb-16" {...fadeInUp}>
            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-[#8b6f4f]">
              WORKING APPROACH
            </h2>
            <p className="text-2xl md:text-4xl font-serif font-bold mt-2">
              How We Work
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-5 gap-6"
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-100px" }}
          >
            {[
              {
                num: "01",
                title: "Brand Understanding",
                desc: "Business goals, audience behaviour, and brand identity are analysed before execution begins.",
              },
              {
                num: "02",
                title: "Strategic Structuring",
                desc: "Website architecture, content flow, and user journey are planned with clarity and precision.",
              },
              {
                num: "03",
                title: "Design & Development",
                desc: "Modern, responsive, and performance-driven interfaces are crafted to reflect the brand.",
              },
              {
                num: "04",
                title: "Optimisation",
                desc: "Speed, usability, and foundational SEO best practices are implemented throughout.",
              },
              {
                num: "05",
                title: "Delivery & Scalability",
                desc: "Thorough testing, smooth deployment, and future scalability are ensured before handoff.",
              },
            ].map((step, idx) => (
              <motion.div
                key={idx}
                variants={staggerItem}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group"
              >
                <span className="text-4xl font-serif font-black text-white/10 group-hover:text-[#8b6f4f] transition-colors duration-300 block mb-6">
                  {step.num}
                </span>
                <h3 className="text-sm font-black uppercase tracking-widest text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-xs text-white/50 leading-relaxed">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Industry Exposure */}
        <div className="mb-32">
          <motion.div className="mb-12 border-b border-white/5 pb-10" {...fadeInUp}>
            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-[#8b6f4f]">
              CLIENT EXPERIENCE & EXPOSURE
            </h2>
            <p className="text-2xl md:text-4xl font-serif font-bold mt-2 mb-6">
              Industry Exposure
            </p>
            <p className="text-white/50 text-sm max-w-3xl leading-relaxed">
              Code Tunnel has been involved in a range of projects across multiple industries, contributing to structured digital solutions, system-based interfaces, and business-oriented platforms.
            </p>
            <div className="mt-4 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[10px] uppercase tracking-widest text-white/40 max-w-fit">
              <span className="text-[#8b6f4f] font-black mr-2">NOTE:</span>
              Specific project materials are not shared publicly due to confidentiality agreements.
            </div>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-100px" }}
          >
            {[
              {
                title: "Training & Process Systems",
                client: "Unilever Europe",
                desc: "Business training systems and process visualisation frameworks, including structured problem-solving models such as the Ishikawa (fishbone) approach.",
              },
              {
                title: "Product & Category Interfaces",
                client: "Global FMCG Brands",
                desc: "Product-focused digital structuring and category-based interface systems aligned with global consumer goods operations.",
              },
              {
                title: "Safety & Operational Interfaces",
                client: "Aviation & Engineering",
                desc: "Safety-focused and operational interface concepts inspired by world-class engineering environments in the aviation sector.",
              },
              {
                title: "Data, Analytics & Logistics",
                client: "Royal Mail-Level Operations",
                desc: "Data structuring, analytics workflows, and logistics-oriented systems comparable to large-scale postal and delivery operations.",
              },
              {
                title: "Communication & Initiative Systems",
                client: "International NGO Sector",
                desc: "Structured communication systems and digital initiatives aligned with internationally recognised humanitarian organisations.",
              },
              {
                title: "Brand & Web Experiences",
                client: "Emerging Brands",
                desc: "Complete web presence and immersive brand experience development for growing businesses across multiple verticals.",
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                variants={staggerItem}
                className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 hover:bg-white/5 hover:border-white/10 transition-all duration-500 flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8b6f4f] block mb-3">
                    {item.client}
                  </span>
                  <h3 className="text-xl font-serif font-bold text-white mb-4">
                    {item.title}
                  </h3>
                </div>
                <p className="text-sm text-white/50 leading-relaxed font-light mt-auto">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Get In Touch */}
        <motion.div 
          className="bg-gradient-to-b from-white/5 to-transparent border border-white/10 rounded-[2rem] p-12 md:p-20 text-center relative overflow-hidden"
          {...fadeInUp}
        >
          <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6">
            Let&apos;s Build Something Great.
          </h2>
          <p className="text-white/60 text-lg max-w-xl mx-auto leading-relaxed mb-12">
            Code Tunnel focuses on building not just websites, but complete digital experiences that help businesses establish a strong and credible online presence.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto border-t border-white/10 pt-12 text-left md:text-center text-xs uppercase font-black tracking-widest text-white/40">
            <div>
              <span className="text-white/20 block mb-2">Website</span>
              <a href="https://codetunnel.co.in" className="text-white hover:text-[#8b6f4f] transition-colors">codetunnel.co.in</a>
            </div>
            <div>
              <span className="text-white/20 block mb-2">Location</span>
              <span className="text-white">Kolkata, India</span>
            </div>
            <div>
              <span className="text-white/20 block mb-2">Focus</span>
              <span className="text-white">Web Design & Development</span>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
