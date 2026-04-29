"use client";

import React from "react";

export default function SubFooter() {
  return (
    <footer className="relative py-20 px-8 z-10 border-t border-white/5 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 opacity-30 text-[10px] font-black uppercase tracking-[0.5em] text-white">
        <div className="flex items-center gap-4">
          <img 
            src="/logo.png" 
            alt="Code Tunnel" 
            className="h-6 w-auto" 
            style={{ filter: 'invert(1) hue-rotate(180deg)' }}
          />
          <span>Code Tunnel &bull; 2026</span>
        </div>
        <div className="flex gap-10">
          <a href="#" className="hover:text-white transition-colors">Twitter</a>
          <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
          <a href="#" className="hover:text-white transition-colors">Dribbble</a>
        </div>
        <p>Architected in the Void</p>
      </div>
    </footer>
  );
}
