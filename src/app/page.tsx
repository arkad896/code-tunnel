"use client";

import React, { useState, useRef, useLayoutEffect, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Palette, LayoutDashboard, Megaphone, Search, Zap, Wrench, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * @file page.tsx
 * @description Final production-ready integrated GSAP ScrollTrigger experience for Code Tunnel.
 * Bridges a light Hero section to a deep dark Work/Services section with cinematic transitions.
 */

// ─── Shared Components ───────────────────────────────────────────────────────

function MagneticWrapper({ children, strength = 0.2, className = "" }: { children: React.ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const isHovering = useRef(false);

  const handleMove = useCallback((e: MouseEvent) => {
    if (!isHovering.current || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setPos({ x: (e.clientX - (r.left + r.width / 2)) * strength, y: (e.clientY - (r.top + r.height / 2)) * strength });
  }, [strength]);

  const handleEnter = useCallback(() => { isHovering.current = true; }, []);
  const handleLeave = useCallback(() => { isHovering.current = false; setPos({ x: 0, y: 0 }); }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.addEventListener("mousemove", handleMove);
    el.addEventListener("mouseenter", handleEnter);
    el.addEventListener("mouseleave", handleLeave);
    return () => { el.removeEventListener("mousemove", handleMove); el.removeEventListener("mouseenter", handleEnter); el.removeEventListener("mouseleave", handleLeave); };
  }, [handleMove, handleEnter, handleLeave]);

  return (
    <motion.div ref={ref} className={className} animate={{ x: pos.x, y: pos.y }} transition={{ type: "spring", stiffness: 150, damping: 15 }}>
      {children}
    </motion.div>
  );
}

function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[200] focus:px-6 focus:py-3 focus:bg-zinc-900 focus:text-white focus:rounded-xl"
    >
      Skip to main content
    </a>
  );
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      setIsDark(window.scrollY > window.innerHeight * 0.85);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  const navLinks = [
    { name: "Work", href: "/#work" },
    { name: "Services", href: "/services" },
    { name: "Pricing", href: "/#pricing" },
    { name: "About", href: "/about" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" }
  ];

  return (
    <>
      <nav className={`fixed top-6 left-6 right-6 z-[100] transition-all duration-700 ${
        scrolled 
          ? "bg-white/5 backdrop-blur-2xl border border-white/10 py-4 px-8 rounded-2xl shadow-2xl" 
          : "py-6 px-4 rounded-none"
      }`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <a href="/" className="flex items-center group">
            <img 
              src="/logo.png" 
              alt="Code Tunnel" 
              className="h-12 w-auto transition-all duration-500 group-hover:scale-105" 
              style={{ 
                filter: isDark ? 'invert(1) hue-rotate(180deg)' : 'none' 
              }}
            />
          </a>
          <div className="hidden md:flex gap-10">
            {navLinks.map(l => (
              <a key={l.name} href={l.href} className={`text-xs font-black uppercase tracking-[0.2em] transition-colors duration-500 ${isDark ? 'text-white/50 hover:text-white' : 'text-zinc-900/50 hover:text-zinc-900'}`}>{l.name}</a>
            ))}
          </div>
          <button 
            onClick={() => setIsOpen(true)}
            className={`md:hidden p-2 rounded-lg transition-colors ${isDark ? 'text-white' : 'text-zinc-900'}`}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[200] md:hidden">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            {/* Drawer Panel */}
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute top-0 left-0 bottom-0 w-[80%] max-w-sm bg-zinc-950 border-r border-white/10 p-8 flex flex-col shadow-2xl"
            >
              <div className="flex items-center justify-between mb-16">
                <img src="/logo.png" alt="Code Tunnel" className="h-10 w-auto invert brightness-0" />
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

              <div className="mt-auto">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-4">Socials</p>
                <div className="flex gap-6">
                  <a href="#" className="text-white/40 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors">Instagram</a>
                  <a href="#" className="text-white/40 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors">LinkedIn</a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Section Components ──────────────────────────────────────────────────────

function FloatingPaths({ position }: { position: number }) {
  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
      380 - i * 5 * position
    } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
      152 - i * 5 * position
    } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
      684 - i * 5 * position
    } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    color: `rgba(30, 27, 22, ${0.03 + i * 0.01})`, // Using charcoal color from our palette
    width: 0.4 + i * 0.02,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg className="w-full h-full text-zinc-900" viewBox="0 0 696 316" fill="none">
        <title>Background Paths</title>
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            strokeOpacity={0.12 + path.id * 0.015}
            initial={{ pathLength: 0.3, opacity: 0.2 }}
            animate={{
              pathLength: 1,
              opacity: [0.2, 0.5, 0.2],
              pathOffset: [0, 1, 0],
            }}
            transition={{
              duration: 25 + Math.random() * 10,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </svg>
    </div>
  );
}

function Hero() {
  const title = "Web Development Agency in Kolkata.";
  const words = title.split(" ");

  return (
    <section className="hero-section relative min-h-screen flex items-center justify-center overflow-hidden bg-transparent">
      {/* Animated Background Paths */}
      <div className="hero-bg absolute inset-0 -z-10 will-change-[transform,opacity]">
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />
      </div>

      <div className="hero-content relative z-10 max-w-7xl mx-auto px-6 pt-[110px] w-full text-center">
        <p className="hero-eyebrow mb-12 text-xs font-black uppercase tracking-[0.5em] text-[#8b6f4f] opacity-0 translate-y-10">Digital Craft Studio</p>
        
        <h1 className="hero-title font-serif text-6xl md:text-[8rem] font-bold leading-[0.9] tracking-tighter text-[#201b16]">
          {words.map((word, wordIndex) => (
            <span key={wordIndex} className="inline-block mr-4 last:mr-0">
              {word.split("").map((letter, letterIndex) => (
                <span
                  key={`${wordIndex}-${letterIndex}`}
                  className="inline-block opacity-0 translate-y-10 hero-letter"
                >
                  {letter}
                </span>
              ))}
            </span>
          ))}
        </h1>
        
        <p className="hero-subtext mt-8 text-lg text-zinc-900/60 max-w-2xl mx-auto opacity-0 translate-y-10">
          Code Tunnel is a custom <strong>web development agency in Kolkata</strong>, delivering premium digital infrastructure across India. We engineer optimized Next.js frameworks and professional SEO strategies tailored to accelerate growing business outcomes.
        </p>

        <div className="hero-cta mt-[25px] opacity-0 translate-y-10">
          <MagneticWrapper strength={0.12}>
            <div className="inline-block group relative bg-gradient-to-b from-black/5 to-white/5 p-px rounded-2xl backdrop-blur-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
              <a 
                href="#work" 
                className="inline-flex items-center gap-5 px-14 py-7 bg-white/90 hover:bg-white text-zinc-900 rounded-[1.1rem] font-black text-xs uppercase tracking-widest transition-all duration-300 group-hover:-translate-y-0.5 border border-black/5"
              >
                <span className="opacity-90 group-hover:opacity-100 transition-opacity">
                  Launch Your Website
                </span>
                <span className="ml-1 opacity-70 group-hover:opacity-100 group-hover:translate-x-1.5 transition-all duration-300">
                  →
                </span>
              </a>
            </div>
          </MagneticWrapper>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-900/30 animate-pulse">Scroll</span>
      </div>
    </section>
  );
}

// ─── Device Mockup Frames ────────────────────────────────────────────────────
// Architecture: Recessed screen via flow-based inner wrapper (no absolute inset-0).
// The border IS the bezel. The inner div fills naturally via flex, keeping content
// inside the hardware chrome at all times.

function MacBookFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative will-change-transform">
      {/* Outer shell — the aluminum body */}
      <div className="rounded-2xl bg-zinc-800 p-[14px] shadow-cinematic">
        {/* Screen bezel — recessed via rounded clip */}
        <div className="relative rounded-xl overflow-hidden bg-zinc-950">
          {/* Notch camera housing */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-5 bg-zinc-800 rounded-b-2xl z-10">
            <div className="absolute top-[6px] left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-zinc-600/60" />
          </div>
          {/* Screen content — aspect-video enforces 16:9, content flows naturally */}
          <div className="aspect-video overflow-hidden">
            {children}
          </div>
        </div>
      </div>
      {/* Keyboard base */}
      <div className="mx-auto w-full h-[10px] bg-gradient-to-b from-zinc-700 via-zinc-600 to-zinc-700 rounded-b-xl mt-[-2px]" />
      <div className="mx-auto w-[35%] h-[4px] bg-gradient-to-b from-zinc-500 to-zinc-600 rounded-b-lg mt-[2px]" />
    </div>
  );
}

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative will-change-transform mx-auto max-w-[300px]">
      {/* Outer shell — titanium/steel body */}
      <div className="rounded-[2.8rem] bg-zinc-800 p-[12px] shadow-cinematic">
        {/* Screen bezel — recessed via rounded clip */}
        <div className="relative rounded-[2.2rem] overflow-hidden bg-zinc-950">
          {/* Dynamic Island */}
          <div className="absolute top-[10px] left-1/2 -translate-x-1/2 w-[90px] h-[26px] bg-black rounded-full z-10" />
          {/* Screen content — 9:19.5 aspect enforces phone proportions */}
          <div className="aspect-[9/19.5] overflow-hidden">
            {children}
          </div>
        </div>
      </div>
      {/* Side buttons (decorative) */}
      <div className="absolute right-[-3px] top-24 w-[3px] h-10 bg-zinc-600 rounded-r-sm" />
      <div className="absolute left-[-3px] top-28 w-[3px] h-14 bg-zinc-600 rounded-l-sm" />
    </div>
  );
}

// ─── Detailed Screen UIs ─────────────────────────────────────────────────────
// Rich structural mockup screens replacing flat gradient placeholders.

function DashboardScreen() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-blue-600 to-indigo-950 p-5 flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-white/15" />
          <div className="w-16 h-2 rounded-full bg-white/25" />
        </div>
        <div className="w-7 h-7 rounded-full bg-white/10" />
      </div>
      {/* Metric cards row */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="col-span-2 rounded-xl bg-white/8 p-3">
          <div className="w-12 h-1.5 rounded-full bg-white/20 mb-2" />
          <div className="w-20 h-3 rounded-full bg-white/30" />
        </div>
        <div className="rounded-xl bg-gradient-to-br from-amber-500/30 to-orange-500/30 p-3">
          <div className="w-8 h-1.5 rounded-full bg-white/20 mb-2" />
          <div className="w-12 h-3 rounded-full bg-white/30" />
        </div>
      </div>
      {/* Chart area */}
      <div className="flex-1 rounded-xl bg-white/5 flex items-end gap-[3px] p-3">
        {[40, 65, 45, 80, 55, 70, 60, 85, 75, 90, 65, 80].map((h, i) => (
          <div key={i} className="flex-1 rounded-sm bg-gradient-to-t from-blue-400/50 to-blue-300/30" style={{ height: `${h}%` }} />
        ))}
      </div>
      {/* Bottom nav */}
      <div className="flex justify-around mt-3">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className={`w-5 h-5 rounded-full ${i === 1 ? 'bg-white/30' : 'bg-white/10'}`} />
        ))}
      </div>
    </div>
  );
}

function MindfulnessScreen() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-teal-900 p-5 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mt-6 mb-6">
        <div className="w-9 h-9 rounded-full bg-white/15" />
        <div className="w-6 h-6 rounded-full bg-white/10" />
      </div>
      {/* Greeting */}
      <div className="mb-6">
        <div className="w-28 h-2.5 rounded-full bg-white/30 mb-2" />
        <div className="w-20 h-1.5 rounded-full bg-white/15" />
      </div>
      {/* Central meditation card */}
      <div className="flex-1 rounded-3xl bg-white/10 backdrop-blur-sm flex flex-col items-center justify-center gap-4 border border-white/10">
        <div className="w-20 h-20 rounded-full border-2 border-white/25 flex items-center justify-center">
          <div className="w-0 h-0 border-l-[12px] border-l-white/40 border-y-[8px] border-y-transparent ml-1" />
        </div>
        <div className="w-20 h-1.5 rounded-full bg-white/20 mt-2" />
        <div className="w-14 h-1 rounded-full bg-white/10" />
      </div>
      {/* Bottom nav */}
      <div className="flex justify-around mt-5 mb-2">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className={`w-5 h-5 rounded-full ${i === 1 ? 'bg-white/35' : 'bg-white/10'}`} />
        ))}
      </div>
    </div>
  );
}

function RealEstateScreen() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-stone-600 to-stone-950 p-5 flex flex-col">
      {/* Nav chrome */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-200/30 to-amber-100/20" />
          <div className="w-14 h-2 rounded-full bg-white/25" />
        </div>
        <div className="flex gap-2">
          {[1, 2, 3].map(i => <div key={i} className="w-10 h-1.5 rounded-full bg-white/15" />)}
        </div>
      </div>
      {/* Featured image placeholder */}
      <div className="flex-1 rounded-2xl bg-gradient-to-br from-stone-500/30 to-stone-700/30 mb-4 flex items-center justify-center border border-white/5">
        <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center">
          <svg className="w-8 h-8 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
        </div>
      </div>
      {/* Property details */}
      <div className="space-y-2">
        <div className="w-3/4 h-2.5 rounded-full bg-white/25" />
        <div className="w-1/2 h-2 rounded-full bg-white/15" />
        <div className="flex gap-3 mt-3">
          <div className="px-3 py-1.5 rounded-full bg-white/10 w-14 h-5" />
          <div className="px-3 py-1.5 rounded-full bg-white/10 w-14 h-5" />
        </div>
      </div>
    </div>
  );
}

function AudioScreen() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-rose-500 to-purple-950 p-5 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mt-6 mb-8">
        <div className="w-8 h-8 rounded-full bg-white/15" />
        <div className="w-20 h-2 rounded-full bg-white/20" />
        <div className="w-6 h-6 rounded-lg bg-white/10" />
      </div>
      {/* Album art */}
      <div className="mx-auto w-3/4 aspect-square rounded-3xl bg-gradient-to-br from-white/15 to-white/5 border border-white/10 mb-6 flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-2 border-white/20 flex items-center justify-center">
          <div className="w-4 h-4 rounded-full bg-white/30" />
        </div>
      </div>
      {/* Track info */}
      <div className="text-center space-y-2 mb-4">
        <div className="w-28 h-2.5 rounded-full bg-white/30 mx-auto" />
        <div className="w-20 h-1.5 rounded-full bg-white/15 mx-auto" />
      </div>
      {/* Progress bar */}
      <div className="w-full h-1 rounded-full bg-white/10 mb-4">
        <div className="w-2/5 h-full rounded-full bg-white/40" />
      </div>
      {/* Controls */}
      <div className="flex justify-center items-center gap-6 mb-4">
        <div className="w-6 h-6 rounded-full bg-white/10" />
        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
          <div className="w-0 h-0 border-l-[10px] border-l-white/50 border-y-[7px] border-y-transparent ml-1" />
        </div>
        <div className="w-6 h-6 rounded-full bg-white/10" />
      </div>
    </div>
  );
}

// ─── Section: Work ──────────────────────────────────────────────────────────

function Work() {
  const workSectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const slideContentRefs = useRef<(HTMLDivElement | null)[]>([]);

  const projects = [
    { title: "Lumina", cat: "Fintech Ecosystem", device: "macbook" as const },
    { title: "Kensho", cat: "Mindfulness App", device: "phone" as const },
    { title: "Meridian", cat: "Digital Real Estate", device: "macbook" as const },
    { title: "Sonora", cat: "Audio Immersive", device: "phone" as const },
  ];

  const screenMap: Record<string, React.ReactNode> = {
    Lumina: <DashboardScreen />,
    Kensho: <MindfulnessScreen />,
    Meridian: <RealEstateScreen />,
    Sonora: <AudioScreen />,
  };

  useLayoutEffect(() => {
    if (!workSectionRef.current || !trackRef.current) return;

    trackRef.current.style.willChange = "transform";

    const ctx = gsap.context(() => {
      // Header reveal
      gsap.to(".work-eyebrow, .work-title", {
        opacity: 1,
        y: 0,
        stagger: 0.1,
        scrollTrigger: {
          trigger: workSectionRef.current,
          start: "top 80%",
        }
      });

      // Main horizontal scroll
      const totalSlides = projects.length;
      gsap.to(trackRef.current, {
        x: () => -(window.innerWidth * (totalSlides - 1)),
        ease: "none",
        scrollTrigger: {
          trigger: workSectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          pin: false,
          onUpdate: (self) => {
            if (progressRef.current) {
              progressRef.current.style.transform = `scaleX(${self.progress})`;
            }
          },
        },
      });

      // Per-slide content reveals
      slideContentRefs.current.forEach((contentEl, i) => {
        if (!contentEl) return;
        gsap.fromTo(contentEl,
          { x: 40, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: workSectionRef.current,
              start: () => `top+=${window.innerHeight * i} top`,
              end: () => `top+=${window.innerHeight * i + window.innerHeight * 0.5} top`,
              scrub: 1.5,
            },
          }
        );
      });
    }, workSectionRef);

    return () => {
      if (trackRef.current) trackRef.current.style.willChange = "auto";
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={workSectionRef}
      id="work"
      className="relative z-10"
      style={{ height: `${projects.length * 100}vh` }}
    >
      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Header overlay */}
        <div className="absolute top-0 left-0 z-20 px-6 md:px-12 pt-32">
          <p className="work-eyebrow text-xs font-black uppercase tracking-[0.5em] text-white/30 mb-6 opacity-0 translate-y-4">Selected Artifacts</p>
          <h2 className="work-title font-serif text-6xl md:text-[8rem] font-bold text-white leading-[0.9] tracking-tighter opacity-0 translate-y-4">The Work.</h2>
        </div>

        {/* Horizontal track */}
        <div
          ref={trackRef}
          className="flex h-full"
          style={{ width: `${projects.length * 100}vw` }}
        >
          {projects.map((p, i) => (
            <div
              key={p.title}
              className="relative flex items-center w-screen h-screen flex-shrink-0 px-6 md:px-12 lg:px-20"
            >
              {/* Background number */}
              <span className="absolute left-8 bottom-0 font-serif text-[20vw] text-white opacity-[0.04] select-none pointer-events-none leading-none">
                {String(i + 1).padStart(2, "0")}
              </span>

              {/* Left half — project info */}
              <div
                ref={(el) => { slideContentRefs.current[i] = el; }}
                className="flex-1 relative z-10 pr-8 lg:pr-16"
              >
                <h3 className="font-serif text-5xl md:text-6xl font-bold text-white mb-3">{p.title}</h3>
                <p className="text-white/40 text-sm font-bold uppercase tracking-widest mb-6">{p.cat}</p>
                <div className="w-16 h-px bg-white/20 my-6" />
                <a href="/services" className="text-white/60 hover:text-white transition-colors text-sm tracking-wider inline-flex items-center gap-2">
                  View Our Services <span>→</span>
                </a>
                <p className="text-white/30 text-xs mt-12">
                  {String(i + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
                </p>
              </div>

              {/* Right half — device mockup */}
              <div className="flex-1 relative flex items-center justify-center overflow-hidden">
                {/* Radial glow behind mockup */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.05)_0%,_transparent_70%)]" />
                <div className="relative max-h-[70vh] w-full flex items-center justify-center">
                  {p.device === "macbook" ? (
                    <MacBookFrame>{screenMap[p.title]}</MacBookFrame>
                  ) : (
                    <PhoneFrame>{screenMap[p.title]}</PhoneFrame>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-8 left-6 right-6 md:left-12 md:right-12 z-20">
          <div className="h-px w-full bg-white/10">
            <div
              ref={progressRef}
              className="h-full bg-white/40 origin-left"
              style={{ transform: "scaleX(0)" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Section: Services ──────────────────────────────────────────────────────

const TiltCard = React.forwardRef<
  { onReady: () => void },
  { children: React.ReactNode }
>(({ children }, ref) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const canHoverRef = useRef(false);
  const prefersReducedMotionRef = useRef(false);
  const isInteractiveRef = useRef(false);
  const [isInteractive, setIsInteractive] = useState(false);
  const willChangeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useImperativeHandle(ref, () => ({
    onReady: () => {
      setIsInteractive(true);
      isInteractiveRef.current = true;
    },
  }));

  useEffect(() => {
    canHoverRef.current = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    prefersReducedMotionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    return () => {
      if (willChangeTimeoutRef.current) clearTimeout(willChangeTimeoutRef.current);
    };
  }, []);

  const handlePointerEnter = useCallback(() => {
    if (!cardRef.current || !isInteractiveRef.current || !canHoverRef.current) return;
    rectRef.current = cardRef.current.getBoundingClientRect();
    if (willChangeTimeoutRef.current) clearTimeout(willChangeTimeoutRef.current);
    cardRef.current.style.willChange = "transform, opacity";
    cardRef.current.classList.remove("tilt-reset-transition");
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isInteractiveRef.current || !canHoverRef.current || !cardRef.current || !rectRef.current) return;
    if (prefersReducedMotionRef.current) return;

    const el = cardRef.current;
    const rect = rectRef.current;
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;

    el.style.setProperty("--rotate-x", `${(py - 0.5) * -24}deg`);
    el.style.setProperty("--rotate-y", `${(px - 0.5) * 24}deg`);
    el.style.setProperty("--mouse-x", `${px * 100}%`);
    el.style.setProperty("--mouse-y", `${py * 100}%`);
    el.style.setProperty("--tilt-scale", "1.02");
  }, []);

  const handlePointerLeave = useCallback(() => {
    if (!cardRef.current) return;
    const el = cardRef.current;

    el.classList.add("tilt-reset-transition");
    el.style.setProperty("--rotate-x", "0deg");
    el.style.setProperty("--rotate-y", "0deg");
    el.style.setProperty("--tilt-scale", "1");

    willChangeTimeoutRef.current = setTimeout(() => {
      if (cardRef.current) cardRef.current.style.willChange = "auto";
    }, 600);
  }, []);

  return (
    <div
      ref={cardRef}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative group focus-visible:ring-2 focus-visible:ring-white/30 rounded-3xl z-10 hover:z-50 isolate"
      style={{
        transform: "rotateX(var(--rotate-x)) rotateY(var(--rotate-y)) scale(var(--tilt-scale))",
        transformStyle: "preserve-3d",
        transformBox: "fill-box",
        borderRadius: "1.5rem",
        "--rotate-x": "0deg",
        "--rotate-y": "0deg",
        "--tilt-scale": "1",
        "--mouse-x": "50%",
        "--mouse-y": "50%",
      } as React.CSSProperties}
    >
      {/* Content wrapper with isolation for Safari 3d bug */}
      <div className="relative overflow-hidden rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-3xl h-full w-full transition-opacity duration-200 group-hover:opacity-95">
        {children}
      </div>

      {/* Spotlight layer - sibling to content, avoiding overflow clipping issues with 3D */}
      <div
        className="pointer-events-none absolute inset-0 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mix-blend-screen motion-reduce:hidden rounded-3xl overflow-hidden"
        style={{
          background: "radial-gradient(circle at var(--mouse-x) var(--mouse-y), rgba(255,255,255,0.08) 0%, transparent 40%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
});

TiltCard.displayName = "TiltCard";

function Services() {
  const cardRefs = useRef<({ onReady: () => void } | null)[]>([]);

  const services = [
    { title: "Brand Strategy", desc: "Forging clear, compelling narratives that define market authority.", accent: "01" },
    { title: "Interface Design", desc: "Meticulous visual systems that balance aesthetic beauty with functional depth.", accent: "02" },
    { title: "Technical Architecture", desc: "Hardened, high-performance engineering tailored for scale and speed.", accent: "03" },
    { title: "Motion Direction", desc: "Cinematic interactions that breathe life into static digital surfaces.", accent: "04" },
  ];

  return (
    <section id="services" className="relative py-40 px-6 md:px-12 z-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-32 gap-12">
          <div className="max-w-2xl">
            <p className="text-xs font-black uppercase tracking-[0.5em] text-white/30 mb-6">Capabilities</p>
            <h2 className="font-serif text-6xl md:text-8xl font-bold text-white leading-none">Our Craft.</h2>
          </div>
          <p className="text-white/50 text-xl max-w-md leading-relaxed">We combine boutique design sensibilities with robust engineering to deliver digital excellence.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 isolate" style={{ perspective: '2000px' }}>
          {services.map((s, i) => (
            <TiltCard 
              key={s.title} 
              ref={(el) => { cardRefs.current[i] = el; }}
            >
              <motion.div 
                className="p-12 h-full flex flex-col"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                onAnimationComplete={() => cardRefs.current[i]?.onReady()}
              >
                <span className="text-white/20 font-serif text-5xl mb-12 block group-hover:text-white/40 transition-colors">{s.accent}</span>
                <h3 className="font-serif text-3xl font-bold text-white mb-6">{s.title}</h3>
                <p className="text-white/50 text-lg leading-relaxed flex-1">{s.desc}</p>
                <div className="mt-8">
                  <a href="/contact" className="text-white/40 hover:text-white transition-colors text-xs font-black uppercase tracking-[0.2em]">Start a Project →</a>
                </div>
              </motion.div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Section: Pricing ───────────────────────────────────────────────────────

const ShineBorder = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return (
    <div className={cn("relative rounded-3xl p-[1px]", className)}>
      <div className="absolute inset-0 rounded-3xl overflow-hidden">
        <div
          className="absolute -inset-full animate-spin"
          style={{
            animationDuration: '8s',
            background: 'conic-gradient(from 0deg, transparent 0deg, transparent 350deg, rgba(255,255,255,0.15) 356deg, rgba(255,255,255,0.06) 359deg, transparent 360deg)',
          }}
        />
      </div>
      <div className="relative rounded-3xl h-full">
        {children}
      </div>
    </div>
  );
};

function Pricing() {
  const packages = [
    {
      accent: "01",
      title: "Portfolio / Personal Site",
      price: "₹17,000",
      popular: false,
      features: [
        "Up to 5 pages (Home, About, Work, Services, Contact)",
        "Custom design — no templates",
        "Mobile responsive",
        "Contact form",
        "Basic on-page SEO",
        "Google Analytics setup",
        "Free domain for 1 year",
        "Business email setup (1 account)",
        "Backend included (Supabase free tier)",
        "1 round of revisions",
        "Delivery: 2-3 weeks",
      ],
    },
    {
      accent: "02",
      title: "Business / Corporate Site",
      price: "₹35,000",
      popular: false,
      features: [
        "Up to 10 pages",
        "Custom design + brand alignment",
        "Mobile responsive",
        "Contact form + WhatsApp integration",
        "Blog setup",
        "Google Maps integration",
        "Basic on-page SEO + sitemap",
        "Google Analytics + Search Console",
        "Free domain for 1 year",
        "Business email setup (3 accounts)",
        "Backend included (Supabase free tier)",
        "2 rounds of revisions",
        "Delivery: 3-4 weeks",
      ],
    },
    {
      accent: "03",
      title: "E-commerce Store",
      price: "₹60,000",
      popular: true,
      features: [
        "Up to 50 products",
        "Custom design",
        "Razorpay payment integration",
        "Product catalog + filters",
        "Cart + checkout flow",
        "Order management",
        "Mobile responsive",
        "Basic SEO",
        "Free domain for 1 year",
        "Business email setup (5 accounts)",
        "Backend included (Supabase free tier)",
        "2 rounds of revisions",
        "Delivery: 5-6 weeks",
      ],
    },
    {
      accent: "04",
      title: "Web Application",
      price: "₹80,000",
      popular: false,
      features: [
        "Custom functionality scoped per project",
        "User authentication + roles",
        "Database design",
        "Admin dashboard",
        "API integrations",
        "Mobile responsive",
        "Free domain for 1 year",
        "Business email setup (5 accounts)",
        "Backend included (Supabase free tier)",
        "2 rounds of revisions",
        "Delivery: 6-8 weeks",
      ],
    },
  ];

  const addons = [
    { icon: Palette, title: "Brand Strategy & Identity", price: "₹15,000", period: "one-time" },
    { icon: LayoutDashboard, title: "UI/UX Design", price: "₹20,000", period: "one-time" },
    { icon: Megaphone, title: "Digital Marketing Setup", price: "₹12,000", period: "/mo" },
    { icon: Search, title: "SEO Optimization", price: "₹10,000", period: "/mo" },
    { icon: Zap, title: "Performance Optimization", price: "₹8,000", period: "one-time" },
    { icon: Wrench, title: "Website Maintenance", price: "₹5,000", period: "/mo" },
  ];

  return (
    <section id="pricing" className="relative py-40 px-6 md:px-12 z-10">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-32"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-xs font-black uppercase tracking-[0.5em] text-white/30 mb-6">Pricing</p>
          <h2 className="font-serif text-6xl md:text-8xl font-bold text-white leading-none mb-6">Transparent Pricing.</h2>
          <p className="text-white/50 text-xl max-w-lg mx-auto">No hidden charges. No surprises. Just honest work.</p>
        </motion.div>

        {/* Package Cards — 2x2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-32">
          {packages.map((pkg, i) => {
            const cardContent = (
              <motion.div
                key={pkg.title}
                className={`relative overflow-hidden rounded-3xl bg-white/[0.03] backdrop-blur-3xl border ${
                  pkg.popular ? "border-transparent" : "border-white/10"
                } p-10 md:p-12 h-full flex flex-col`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
              >
                {/* Popular Badge */}
                {pkg.popular && (
                  <div className="absolute top-6 right-6 px-3 py-1.5 bg-white/10 border border-white/20 rounded-full text-[10px] font-black uppercase tracking-widest text-white/80">
                    Most Popular
                  </div>
                )}

                {/* Accent Number + Title */}
                <span className="text-white/20 font-serif text-5xl mb-6 block">{pkg.accent}</span>
                <h3 className="font-serif text-2xl md:text-3xl font-bold text-white mb-4">{pkg.title}</h3>

                {/* Price */}
                <div className="mb-8">
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2">Starting from</p>
                  <p className="font-serif text-4xl md:text-5xl font-bold text-white">{pkg.price}</p>
                </div>

                {/* Feature List */}
                <ul className="space-y-3 flex-1 mb-10">
                  {pkg.features.map((f, fi) => (
                    <li key={fi} className="flex items-start gap-3">
                      <Check className="w-4 h-4 text-white/60 mt-0.5 flex-shrink-0" />
                      <span className="text-white/50 text-sm leading-relaxed">{f}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <a
                  href="#contact"
                  className={`inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                    pkg.popular
                      ? "bg-white text-black hover:scale-105"
                      : "bg-white/10 text-white border border-white/10 hover:bg-white/20"
                  }`}
                >
                  Get Started <span>→</span>
                </a>
              </motion.div>
            );

            return pkg.popular ? (
              <ShineBorder key={pkg.title} className="h-full">
                {cardContent}
              </ShineBorder>
            ) : (
              cardContent
            );
          })}
        </div>

        {/* Add-on Services */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h3 className="font-serif text-4xl md:text-5xl font-bold text-white mb-16 text-center">Add-on Services</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {addons.map((addon, i) => (
              <motion.div
                key={addon.title}
                className="rounded-2xl bg-white/[0.03] border border-white/10 p-8 flex flex-col items-start gap-4 hover:border-white/20 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                  <addon.icon className="w-5 h-5 text-white/50" />
                </div>
                <h4 className="text-white font-bold text-lg">{addon.title}</h4>
                <p className="text-white/70 font-serif text-2xl font-bold">
                  {addon.price}
                  <span className="text-white/30 text-sm font-sans ml-1">{addon.period}</span>
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Footer Note */}
        <motion.p
          className="text-center text-white/30 text-xs mt-20 max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          All prices are starting points. Final quote depends on scope and features. Domain renewal after year 1 is client&apos;s responsibility. No hidden charges.
        </motion.p>
      </div>
    </section>
  );
}

// ─── Section: Contact ───────────────────────────────────────────────────────

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", msg: "" });
  const [sent, setSent] = useState(false);

  return (
    <section id="contact" className="relative py-40 px-6 md:px-12 z-10">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-24">
          <p className="text-xs font-black uppercase tracking-[0.5em] text-white/30 mb-6">Next Chapter</p>
          <h2 className="font-serif text-6xl md:text-8xl font-bold text-white mb-8">Initiate.</h2>
          <p className="text-white/50 text-xl">Let&apos;s architect your next digital breakthrough.</p>
        </div>

        {!sent ? (
          <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/30">Your Name</label>
                <input 
                  type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-white/30 transition-colors"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/30">Email Address</label>
                <input 
                  type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-white/30 transition-colors"
                />
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/30">Project Details</label>
              <textarea 
                rows={5} required value={form.msg} onChange={e => setForm({...form, msg: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-white/30 transition-colors resize-none"
              />
            </div>
            <div className="flex justify-center pt-8">
              <MagneticWrapper strength={0.1}>
                <button type="submit" className="px-16 py-6 bg-white text-black rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform">
                  Send Message
                </button>
              </MagneticWrapper>
            </div>
          </form>
        ) : (
          <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-8">
              <svg className="w-10 h-10 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
            </div>
            <h3 className="font-serif text-4xl font-bold text-white mb-4">Message Sent</h3>
            <p className="text-white/40">We will respond within one digital day.</p>
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Main Experience Controller ──────────────────────────────────────────────
// ARCHITECTURE: Opacity-based cross-fade instead of backgroundColor animation.
// The wrapper has bg-[#121212] (dark). A fixed cream layer fades OUT via opacity.
// opacity is GPU-composited (transform + opacity are the only two) → zero repaint
// → zero "black line" artifact at the section boundary.

export default function Home() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const creamLayerRef = useRef<HTMLDivElement>(null);
  const bridgeRef = useRef<HTMLDivElement>(null);
  const infiniteRef = useRef<HTMLDivElement>(null);
  const possibleRef = useRef<HTMLSpanElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Initial Hero Reveal
      const tl = gsap.timeline();
      tl.to(".hero-eyebrow", { opacity: 1, y: 0, duration: 1, ease: "power4.out" })
        .to(".hero-letter", { 
          opacity: 1, 
          y: 0, 
          stagger: 0.03, 
          duration: 0.8, 
          ease: "back.out(1.7)" 
        }, "-=0.6")
        .to(".hero-subtext", { opacity: 1, y: 0, duration: 1, ease: "power4.out" }, "-=0.6")
        .to(".hero-cta", { opacity: 1, y: 0, duration: 1, ease: "power4.out" }, "-=0.8");

      // 2. GPU-COMPOSITED CROSS-FADE: Cream layer opacity → 0 reveals dark container
      // This replaces the old backgroundColor tween which triggered full-viewport repaints
      gsap.to(creamLayerRef.current, {
        opacity: 0,
        scrollTrigger: {
          trigger: ".hero-section",
          start: "bottom bottom",
          end: "+=100%",
          scrub: true,
          invalidateOnRefresh: true,
        }
      });

      // 3. Hero Parallax — bg image dissolves as it shifts
      gsap.to(".hero-bg", {
        y: 200,
        scale: 1.25,
        opacity: 0,
        scrollTrigger: {
          trigger: ".hero-section",
          start: "top top",
          end: "bottom top",
          scrub: true,
        }
      });

      // 4. Hero Content — rises and fades faster than bg for depth
      gsap.to(".hero-content", {
        y: -150,
        opacity: 0,
        scrollTrigger: {
          trigger: ".hero-section",
          start: "top top",
          end: "bottom 60%",
          scrub: true,
        }
      });

      // Work section now owns its own GSAP context internally.

      // 5. Cinematic Bridge Scroll Parallax
      const bridgeTl = gsap.timeline({
        scrollTrigger: {
          trigger: bridgeRef.current,
          start: "top 80%",
          end: "bottom 20%",
          scrub: 1.5,
        }
      });

      // Entry phase
      bridgeTl.fromTo(infiniteRef.current, 
        { y: 40, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.4 }, 
        0
      ).fromTo(possibleRef.current, 
        { y: 60, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.4 }, 
        0.1
      ).fromTo(lineRef.current, 
        { scaleY: 0, opacity: 0 }, 
        { scaleY: 1, opacity: 1, duration: 0.3 }, 
        0
      );

      // Exit phase
      bridgeTl.to(infiniteRef.current, 
        { y: -30, opacity: 0, duration: 0.4 }, 
        0.6
      ).to(possibleRef.current, 
        { y: -50, opacity: 0, duration: 0.4 }, 
        0.6
      ).to(lineRef.current, 
        { scaleY: 0, opacity: 0, duration: 0.4 }, 
        0.6
      );

    }, wrapperRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrapperRef} className="relative bg-[#121212] selection:bg-white selection:text-black">
      <SkipLink />
      
      {/* GPU Cross-Fade Layer: cream surface fades out to reveal the #121212 wrapper */}
      <div 
        ref={creamLayerRef} 
        className="fixed inset-0 z-0 bg-[#F7F4EF] will-change-opacity pointer-events-none" 
      />

      <SEO jsonLd={homepageJsonLd} />
      <Navbar />
      <main id="main-content" className="relative z-10">
        <Hero />
        <Work />
        
        {/* Cinematic Bridge Section */}
        <section ref={bridgeRef} className="relative py-60 px-6 overflow-hidden z-10">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="font-serif text-5xl md:text-[10rem] font-bold text-white leading-none tracking-tighter mb-16">
              <div ref={infiniteRef} className="will-change-transform will-change-opacity">Infinite.</div>
              <span ref={possibleRef} className="italic text-white/30 block will-change-transform will-change-opacity">Possible.</span>
            </h2>
            <div className="flex justify-center">
               <div ref={lineRef} className="w-1 h-32 bg-gradient-to-b from-white to-transparent opacity-20 origin-top will-change-transform will-change-opacity" />
            </div>
          </div>
        </section>

        <Services />
        <Pricing />
        
        {/* Minimal About Bridge */}
        <section id="about" className="relative py-40 px-6 z-10 text-center">
           <div className="max-w-3xl mx-auto">
             <p className="text-xs font-black uppercase tracking-[0.5em] text-[#8b6f4f] mb-8">Who We Are</p>
             <p className="font-serif text-3xl md:text-5xl text-white leading-tight mb-10">
               We build modern, high-performing, and conversion-driven web experiences for businesses that mean business.
             </p>
             <a 
               href="/about" 
               className="inline-block text-xs font-black uppercase tracking-[0.3em] text-white/40 hover:text-white border-b border-white/20 hover:border-white pb-1 transition-all"
             >
               View Our Credentials &rarr;
             </a>
           </div>
        </section>

        <Contact />

        {/* SEO Content Boost Section */}
        <section className="relative py-20 px-6 border-t border-white/5 bg-[#070707] text-white/40 text-xs">
          <div className="max-w-4xl mx-auto space-y-6 text-center md:text-left">
            <h2 className="text-white/60 font-serif text-lg font-bold">
              Web Development Agency in Kolkata
            </h2>
            <p className="leading-relaxed">
              Code Tunnel is a custom <a href="/services" className="text-white/60 hover:text-white underline">web development services</a> agency based in Kolkata, West Bengal. We design and build websites, landing pages, and web applications for startups and businesses across India. Our work is built on React and Next.js — fast, modern, and optimized for search from day one.
            </p>
            <p className="leading-relaxed">
              Whether you need a landing page to launch a product, a full business website, or a <a href="/services" className="text-white/60 hover:text-white underline">custom web application</a> — Code Tunnel delivers clean, conversion-focused digital solutions with no templates and no shortcuts. Ready to scale? <a href="/contact" className="text-white/60 hover:text-white underline">Get in touch</a> with our development team today.
            </p>
          </div>
        </section>
      </main>

      <footer className="relative py-20 px-8 z-10 border-t border-white/5 bg-transparent">
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
    </div>
  );
}
