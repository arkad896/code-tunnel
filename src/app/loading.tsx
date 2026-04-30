"use client";

import React from "react";
import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[500] bg-[#070707] flex flex-col items-center justify-center">
      {/* Central Logo / Icon */}
      <div className="relative mb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="relative z-10"
        >
          <img src="/logo.png" alt="Loading..." className="h-16 w-auto invert brightness-0" />
        </motion.div>
        
        {/* Pulsing ring */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: [0, 0.2, 0], scale: [0.5, 1.5, 2] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeOut",
          }}
          className="absolute inset-0 bg-[#8b6f4f] rounded-full blur-2xl"
        />
      </div>

      {/* Progress Line */}
      <div className="w-48 h-[1px] bg-white/10 relative overflow-hidden rounded-full">
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-[#8b6f4f] to-transparent"
        />
      </div>
      
      <p className="mt-6 text-[10px] font-black uppercase tracking-[0.5em] text-white/20 animate-pulse">
        Initializing Tunnel
      </p>
    </div>
  );
}
