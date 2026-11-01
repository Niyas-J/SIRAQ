'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Frame, Sparkles, Check, ArrowRight, Eye, ShoppingBag, Layers, Box } from 'lucide-react';
import { FRAMES_COLLECTION, HAMPERS_COLLECTION, FrameProduct, HamperProduct } from '@/lib/servicesData';

export default function FramesAndHampersSection() {
  const [activeTab, setActiveTab] = useState<'all' | 'frames' | 'hampers'>('all');
  const [previewImage, setPreviewImage] = useState<{ src: string; title: string } | null>(null);

  const handleOrderFrame = (item: FrameProduct) => {
    const text = encodeURIComponent(
      `Hi SIRAQ, I would like to customize a photo frame: "${item.name}". Please share the size options and pricing.`
    );
    window.open(`https://wa.me/918217469646?text=${text}`, '_blank');
  };

  const handleOrderHamper = (item: HamperProduct) => {
    const text = encodeURIComponent(
      `Hi SIRAQ, I want to order the gift hamper: "${item.name}" for ${item.occasion}. Please provide customization details and delivery options.`
    );
    window.open(`https://wa.me/918217469646?text=${text}`, '_blank');
  };

  return (
    <section id="frames-hampers" className="container mx-auto px-6 py-20 border-t border-white/10 relative">
      <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-accent/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Section Header */}
      <div className="mb-12 text-center max-w-3xl mx-auto">
        <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-accent/20 to-neon/20 text-accent border border-accent/30 text-xs font-semibold uppercase tracking-wider mb-3">
          <Gift className="w-3.5 h-3.5 text-accent" /> Premium Gifting & Memories
        </span>
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
          Customized Frames & Bespoke Hampers
        </h2>
        <p className="mt-4 text-slateSoft text-sm sm:text-base leading-relaxed">
          Preserve cherished moments with optical-grade floating acrylic frames, warm ambient LED night portraits, and meticulously crafted luxury gift hampers.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex justify-center gap-3 mb-14">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
            activeTab === 'all'
              ? 'bg-gradient-to-r from-accent to-neon text-charcoal shadow-glow'
              : 'bg-white/5 border border-white/10 text-slateSoft hover:text-white hover:bg-white/10'
          }`}
        >
          All Creations
        </button>
        <button
          onClick={() => setActiveTab('frames')}
          className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'frames'
              ? 'bg-gradient-to-r from-accent to-neon text-charcoal shadow-glow'
              : 'bg-white/5 border border-white/10 text-slateSoft hover:text-white hover:bg-white/10'
          }`}
        >
          <Frame className="w-3.5 h-3.5" /> Customized Photo Frames
        </button>
        <button
          onClick={() => setActiveTab('hampers')}
          className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'hampers'
              ? 'bg-gradient-to-r from-accent to-neon text-charcoal shadow-glow'
              : 'bg-white/5 border border-white/10 text-slateSoft hover:text-white hover:bg-white/10'
          }`}
        >
          <Gift className="w-3.5 h-3.5" /> Curated Gift Hampers
        </button>
      </div>

      {/* PHOTO FRAMES SECTION */}
      {(activeTab === 'all' || activeTab === 'frames') && (
        <div className="mb-20 max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8 pb-3 border-b border-white/10">
            <div>
              <h3 className="text-2xl font-display font-bold text-white flex items-center gap-2.5">
                <Frame className="w-6 h-6 text-neon" /> Customized Photo Frames
              </h3>
              <p className="text-xs text-slateSoft mt-0.5">Direct UV printing on acrylic, optical float mountings, and LED night displays</p>
            </div>
            <span className="hidden sm:inline-block text-xs text-accent font-semibold">Starting from ₹349</span>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {FRAMES_COLLECTION.map((frame) => (
              <div
                key={frame.id}
                className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.05] via-white/[0.02] to-transparent overflow-hidden backdrop-blur-xl shadow-glass hover:border-neon/40 transition duration-300 group flex flex-col justify-between"
              >
                <div>
                  {/* Photo Preview Container */}
                  <div
                    className="relative h-60 w-full overflow-hidden bg-slate-900 cursor-pointer"
                    onClick={() => setPreviewImage({ src: frame.image, title: frame.name })}
                  >
                    <Image
                      src={frame.image}
                      alt={frame.name}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-transparent opacity-80"></div>
                    <div className="absolute top-4 right-4">
                      {frame.badge && (
                        <span className="bg-neon text-charcoal text-[11px] font-bold px-3 py-1 rounded-full shadow-md">
                          {frame.badge}
                        </span>
                      )}
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                      <div>
                        <span className="text-[11px] text-neon font-semibold uppercase tracking-wider block">Bespoke Framing</span>
                        <h4 className="text-xl font-bold text-white">{frame.name}</h4>
                      </div>
                      <span className="text-lg font-bold text-accent">₹{frame.priceStart}<span className="text-xs font-normal text-slateSoft"> starting</span></span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6">
                    <p className="text-xs text-slate-300 mb-4">{frame.tagline}</p>

                    <div className="space-y-2 mb-5 text-xs text-slate-400">
                      <div className="flex items-center gap-2">
                        <Layers className="w-3.5 h-3.5 text-accent shrink-0" />
                        <span className="text-slate-200"><strong>Material:</strong> {frame.materials}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Box className="w-3.5 h-3.5 text-neon shrink-0" />
                        <span className="text-slate-200"><strong>Popular Sizes:</strong> {frame.popularSizes.join(' • ')}</span>
                      </div>
                    </div>

                    <div className="space-y-1.5 mb-6">
                      {frame.features.map((feat, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <button
                    onClick={() => handleOrderFrame(frame)}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-accent to-neon text-charcoal font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-glow hover:brightness-110 transition"
                  >
                    Customize Frame on WhatsApp <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* GIFT HAMPERS SECTION */}
      {(activeTab === 'all' || activeTab === 'hampers') && (
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8 pb-3 border-b border-white/10">
            <div>
              <h3 className="text-2xl font-display font-bold text-white flex items-center gap-2.5">
                <Gift className="w-6 h-6 text-accent" /> Curated Gift Hampers
              </h3>
              <p className="text-xs text-slateSoft mt-0.5">Artisanal personalized presentation boxes for corporate, celebrations, and weddings</p>
            </div>
            <span className="hidden sm:inline-block text-xs text-accent font-semibold">Starting from ₹799</span>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {HAMPERS_COLLECTION.map((hamper) => (
              <div
                key={hamper.id}
                className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.05] via-white/[0.02] to-transparent overflow-hidden backdrop-blur-xl shadow-glass hover:border-accent/40 transition duration-300 group flex flex-col justify-between"
              >
                <div>
                  {/* Photo Preview Container */}
                  <div
                    className="relative h-64 w-full overflow-hidden bg-slate-900 cursor-pointer"
                    onClick={() => setPreviewImage({ src: hamper.image, title: hamper.name })}
                  >
                    <Image
                      src={hamper.image}
                      alt={hamper.name}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-transparent opacity-80"></div>
                    <div className="absolute top-4 right-4">
                      {hamper.badge && (
                        <span className="bg-gradient-to-r from-accent to-neon text-charcoal text-[11px] font-bold px-3 py-1 rounded-full shadow-md">
                          {hamper.badge}
                        </span>
                      )}
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <span className="text-[10px] text-accent font-bold uppercase tracking-wider block">{hamper.occasion}</span>
                      <h4 className="text-lg font-bold text-white leading-tight mt-0.5">{hamper.name}</h4>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6">
                    <div className="flex items-baseline justify-between mb-4">
                      <span className="text-xs text-slateSoft">Starting Price:</span>
                      <span className="text-2xl font-bold text-accent">₹{hamper.priceStart}</span>
                    </div>

                    <div className="space-y-3 mb-6">
                      <p className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">What&apos;s Included Inside:</p>
                      <ul className="space-y-1.5 text-xs text-slate-300">
                        {hamper.includedItems.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-accent font-bold text-xs">✦</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-[11px] text-slate-300 mb-6">
                      <p className="text-slateSoft font-medium mb-1">Packaging Presentation:</p>
                      <p>{hamper.packaging}</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <button
                    onClick={() => handleOrderHamper(hamper)}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-accent to-neon text-charcoal font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-glow hover:brightness-110 transition"
                  >
                    Order Hamper Box <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      <AnimatePresence>
        {previewImage && (
          <div
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
            onClick={() => setPreviewImage(null)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              className="relative max-w-3xl w-full rounded-3xl overflow-hidden border border-white/20 shadow-2xl bg-[#0e1017] text-white"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-96 sm:h-[480px] w-full">
                <Image src={previewImage.src} alt={previewImage.title} fill className="object-cover" />
              </div>
              <div className="p-5 flex items-center justify-between bg-charcoal/95 border-t border-white/10">
                <h4 className="font-bold text-lg text-white">{previewImage.title}</h4>
                <button
                  onClick={() => setPreviewImage(null)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
