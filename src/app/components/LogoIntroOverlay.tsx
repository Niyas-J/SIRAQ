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
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-white text-[#1D1D1F] overflow-hidden select-none"
        >
          {/* Skip Intro Button */}
          <button
            onClick={() => {
              onClose();
              if (onComplete) onComplete();
            }}
            className="absolute top-6 right-6 z-30 inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#E5E5E7] bg-[#FAFAFC] hover:bg-[#F2F2F7] text-[#6E6E73] hover:text-[#1D1D1F] text-xs font-semibold backdrop-blur-md transition tracking-wider uppercase"
          >
            Skip <X className="w-3.5 h-3.5" />
          </button>

          {/* Apple-style Soft Subtle Radial Rings */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: [0.8, 1.4, 1.8], opacity: [0, 0.25, 0] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: 'easeOut' }}
              className="absolute w-[450px] h-[450px] md:w-[600px] md:h-[600px] rounded-full border border-[#A8CFAE]/50"
            />
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: [0.7, 1.25, 1.6], opacity: [0, 0.25, 0] }}
              transition={{ duration: 3.2, delay: 0.7, repeat: Infinity, ease: 'easeOut' }}
              className="absolute w-[360px] h-[360px] md:w-[500px] md:h-[500px] rounded-full border border-[#B9DDF2]/60"
            />
            <div className="absolute w-[300px] h-[300px] rounded-full bg-[#DDF1DF] blur-3xl opacity-60" />
          </div>

          {/* Central Logo Container */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 flex flex-col items-center text-center px-6"
          >
            <div className="relative mb-6">
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-3xl p-3 bg-white border border-[#DDF1DF] shadow-[0_12px_36px_rgba(71,125,85,0.08)] flex items-center justify-center">
                <Image
                  src="/images/siraq-logo.png"
                  alt="SIRAQ Logo"
                  width={90}
                  height={90}
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-[#25352B]"
            >
              SIRAQ
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55, duration: 0.6 }}
              className="mt-2 text-xs sm:text-sm font-semibold tracking-wider text-[#477D55] uppercase"
            >
              Citizen Services • Custom Gifting • Smart Print
            </motion.p>

            {/* Apple Minimalist Progress Line */}
            <div className="w-48 h-1.5 bg-[#DDF1DF] rounded-full overflow-hidden mt-8">
              <motion.div
                className="h-full bg-[#F5D76E]"
                style={{ width: `${progress}%` }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
