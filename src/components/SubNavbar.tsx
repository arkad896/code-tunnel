"use client";

import React, { useState, useEffect } from "react";

export default function SubNavbar() {
  const [scrolled, setScrolled] = useState(false);

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
        <a href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center font-serif font-bold text-black transition-transform group-hover:rotate-6">CT</div>
          <span className="font-serif text-2xl font-bold tracking-tight text-white">Code Tunnel</span>
        </a>
        <div className="hidden md:flex gap-10">
          {navLinks.map(l => (
            <a key={l.name} href={l.href} className="text-xs font-black uppercase tracking-[0.2em] text-white/50 hover:text-white transition-colors duration-300">
              {l.name}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
