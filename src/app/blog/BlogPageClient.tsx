"use client";

import { motion } from "framer-motion";

interface BlogPageClientProps {
  blogSchema: Record<string, unknown>;
  posts: Array<{ title: string; excerpt: string; keyword: string }>;
}

export default function BlogPageClient({ blogSchema, posts }: BlogPageClientProps) {
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  };

  const staggerItem = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white py-32 px-6 md:px-12 selection:bg-white selection:text-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />

      <div className="max-w-5xl mx-auto pt-20">
        <motion.div {...fadeInUp}>
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 tracking-tight">
            From the Code Tunnel Blog
          </h1>
          <p className="text-xl text-white/60 mb-16 max-w-2xl leading-relaxed">
            In-depth analysis on modern engineering protocols, user experience design heuristics, and digital brand acceleration strategies.
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {posts.map((p, i) => (
            <motion.article
              key={i}
              variants={staggerItem}
              className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 flex flex-col justify-between hover:border-white/20 transition-all duration-300"
              aria-labelledby={`blog-post-${i}-title`}
            >
              <div>
                <span className="inline-flex items-center px-3 py-1 text-xs bg-white/10 rounded-full font-bold text-white/80 mb-6">
                  {p.keyword}
                </span>
                <h2 id={`blog-post-${i}-title`} className="text-2xl font-serif font-bold text-white mb-4 leading-snug">
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
            </motion.article>
          ))}
        </motion.div>

        <motion.div 
          className="text-center py-12 border-t border-white/5"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-white/40 text-sm mb-6">Need a custom technical roadmap for your next big build?</p>
          <a
            href="/contact"
            className="inline-flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/10 text-white rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-white/10 transition-all"
          >
            Connect With Our Developers
          </a>
        </motion.div>
      </div>
    </main>
  );
}
