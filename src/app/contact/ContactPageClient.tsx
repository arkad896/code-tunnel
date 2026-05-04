"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function ContactPageClient() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white p-6 selection:bg-white selection:text-black">
      <motion.div
        className="max-w-2xl text-center"
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <header className="mb-12">
          <p className="text-xs font-black uppercase tracking-[0.4em] text-[#8b6f4f] mb-6">Contact Us</p>
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">Work With Code Tunnel</h1>
          <p className="text-white/60 mb-8 max-w-lg mx-auto leading-relaxed">
            Get in touch with Code Tunnel to discuss your web project. Based in Kolkata, serving clients across India and globally.
          </p>
        </header>
        <div className="flex flex-col items-center gap-4">
          <a
            href="mailto:hello@codetunnel.co.in"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-white/90 transition-all shadow-xl"
          >
            Email hello@codetunnel.co.in
          </a>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-white/40 hover:text-white pb-0.5 border-b border-white/10 hover:border-white transition-all mt-4"
          >
            ← Back to Home
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
