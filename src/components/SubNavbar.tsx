"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

export default function SubNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Work", href: "/#work" },
    { name: "Services", href: "/services" },
    { name: "Pricing", href: "/#pricing" },
    { name: "About", href: "/about" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" }
  ];

  return (
    <nav className={`fixed top-6 left-6 right-6 z-[100] transition-all duration-700 ${
      scrolled 
        ? "bg-black/40 backdrop-blur-2xl border border-white/10 py-4 px-8 rounded-2xl shadow-2xl" 
        : "py-6 px-4 rounded-none"
    }`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <a href="/" className="flex items-center group">
          <Image 
            src="/logo.png" 
            alt="Code Tunnel" width={200} height={50} 
            className="h-12 w-auto transition-transform group-hover:scale-105" 
            style={{ filter: 'invert(1) hue-rotate(180deg)' }}
          />
        </a>
        <div className="hidden md:flex gap-10">
          {navLinks.map(l => (
            <a key={l.name} href={l.href} className="text-xs font-black uppercase tracking-[0.2em] text-white/50 hover:text-white transition-colors duration-300">
              {l.name}
            </a>
          ))}
        </div>
        <button 
          onClick={() => setIsOpen(true)}
          className="md:hidden p-2 rounded-lg transition-colors text-white"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[200]">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute top-0 left-0 bottom-0 w-[80%] max-w-sm bg-zinc-950 border-r border-white/10 p-8 flex flex-col shadow-2xl"
            >
              <div className="flex items-center justify-between mb-16">
                <Image src="/logo.png" alt="Code Tunnel" width={200} height={50} className="h-10 w-auto invert brightness-0" />
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-white/50 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex flex-col gap-8">
                {navLinks.map((l, i) => (
                  <motion.a
                    key={l.name}
                    href={l.href}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => setIsOpen(false)}
                    className="text-2xl font-serif font-bold text-white/70 hover:text-white transition-colors"
                  >
                    {l.name}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </nav>
  );
}
