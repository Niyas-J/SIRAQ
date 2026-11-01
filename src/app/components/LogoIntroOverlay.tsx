'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';

interface LogoIntroOverlayProps {
  onComplete?: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function LogoIntroOverlay({ onComplete, isOpen, onClose }: LogoIntroOverlayProps) {
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    if (!isOpen) return;

    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onClose();
            if (onComplete) onComplete();
          }, 350);
          return 100;
        }
        return prev + 2;
      });
    }, 32);

    return () => clearInterval(interval);
  }, [isOpen, onClose, onComplete]);

  // Allow ESC to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
        if (onComplete) onComplete();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onComplete]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#05070d] text-white overflow-hidden select-none"
        >
          {/* Skip Intro Button */}
          <button
            onClick={() => {
              onClose();
              if (onComplete) onComplete();
            }}
            className="absolute top-6 right-6 z-30 inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-white/20 bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white text-xs font-medium backdrop-blur-md transition tracking-wider uppercase"
          >
            Skip Intro <X className="w-3.5 h-3.5" />
          </button>

          {/* Cinematic Background Light Aura */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            {/* Outer expanding pulse ring */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: [0.8, 1.4, 1.8], opacity: [0, 0.35, 0] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: 'easeOut' }}
              className="absolute w-[450px] h-[450px] md:w-[600px] md:h-[600px] rounded-full border border-amber-400/30"
            />
            {/* Emerald secondary pulse ring */}
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: [0.6, 1.2, 1.6], opacity: [0, 0.3, 0] }}
              transition={{ duration: 3.2, repeat: Infinity, delay: 0.8, ease: 'easeOut' }}
              className="absolute w-[350px] h-[350px] md:w-[500px] md:h-[500px] rounded-full border border-emerald-400/25"
            />
            {/* Core Radial Glows */}
            <div className="absolute w-[380px] h-[380px] rounded-full bg-gradient-to-tr from-amber-500/20 via-emerald-500/15 to-transparent blur-3xl pointer-events-none" />
            <div className="absolute w-[260px] h-[260px] rounded-full bg-emerald-600/15 blur-2xl pointer-events-none" />
          </div>

          {/* Central Logo Video Reveal Presentation */}
          <div className="relative z-10 flex flex-col items-center text-center px-6">
            {/* Glowing Logo Plaque with Apple Shimmer */}
            <motion.div
              initial={{ scale: 0.7, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              className="relative p-6 md:p-8 rounded-[40px] bg-gradient-to-b from-white/10 via-white/[0.04] to-transparent border border-white/20 shadow-[0_25px_60px_rgba(0,0,0,0.8)] backdrop-blur-2xl logo-shine"
            >
              {/* Star Twinkle Highlights */}
              <div className="absolute -top-2 -right-2 text-amber-400 animate-star-twinkle">
                <Sparkles className="w-6 h-6" />
              </div>

              {/* Logo Visual Presentation */}
              <div className="relative w-44 h-44 sm:w-56 sm:h-56 md:w-64 md:h-64 flex items-center justify-center p-3 rounded-3xl bg-white/[0.03]">
                <Image
                  src="/images/siraq-logo.png"
                  alt="SIRAQ Logo"
                  width={260}
                  height={260}
                  priority
                  className="object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.5)]"
                />
              </div>
            </motion.div>

            {/* Kinetic Title & Subtitle */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="mt-8 space-y-2 max-w-md"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/15 text-[11px] uppercase tracking-[0.3em] font-semibold text-amber-400">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                Official SIRAQ Experience
              </div>

              <h1 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-white">
                <span className="bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  SIRAQ
                </span>{' '}
                <span className="text-sm font-light text-slate-400 block sm:inline">
                  • Studio & Citizen Services
                </span>
              </h1>

              <p className="text-xs sm:text-sm text-slate-400 font-normal leading-relaxed">
                Premium ID Cards, CSC Citizen Desk, Realtime Scholarships & Bespoke Hampers
              </p>
            </motion.div>

            {/* Minimalist Apple Progress Line */}
            <div className="mt-8 w-60 sm:w-72 space-y-2">
              <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden p-[1px]">
                <motion.div
                  className="h-full bg-gradient-to-r from-amber-400 via-emerald-400 to-teal-300 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                <span>Initializing Services</span>
                <span>{progress}%</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
