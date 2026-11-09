'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Frame, Sparkles, Check, ArrowRight, Eye, ShoppingBag, Layers, Box } from 'lucide-react';
import { ProductItem } from '@/lib/types';
import { FRAMES_COLLECTION, HAMPERS_COLLECTION } from '@/lib/servicesData';

export default function FramesAndHampersSection() {
  const [activeTab, setActiveTab] = useState<'all' | 'frames' | 'hampers'>('all');
  const [previewImage, setPreviewImage] = useState<{ src: string; title: string } | null>(null);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Dynamic fetch from database / API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        if (data.success && data.data && data.data.length > 0) {
          setProducts(data.data);
        } else {
          // Fallback to static seed
          const fallbackList: ProductItem[] = [
            ...FRAMES_COLLECTION.map((f, i) => ({
              id: f.id,
              name: f.name,
              category: 'Customized Photo Frames' as const,
              tagline: f.tagline,
              description: `Materials: ${f.materials}. Perfect for living rooms, bedrooms, and memorable gifts.`,
              price: f.priceStart,
              discountPrice: Math.round(f.priceStart * 1.25),
              badge: f.badge,
              image: f.image,
              materials: f.materials,
              popularSizes: f.popularSizes,
              features: f.features,
              isAvailable: true,
              isFeatured: true,
              orderRank: i + 1,
            })),
            ...HAMPERS_COLLECTION.map((h, i) => ({
              id: h.id,
              name: h.name,
              category: 'Gift Hampers' as const,
              tagline: h.occasion,
              description: `Includes: ${h.includedItems.join(', ')}.`,
              price: h.priceStart,
              discountPrice: Math.round(h.priceStart * 1.2),
              badge: h.badge,
              image: h.image,
              includedItems: h.includedItems,
              features: h.features,
              isAvailable: true,
              isFeatured: true,
              orderRank: 10 + i,
            })),
          ];
          setProducts(fallbackList);
        }
      } catch (err) {
        console.warn('Could not fetch dynamic products, using fallback:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleOrderProduct = (item: ProductItem) => {
    const text = encodeURIComponent(
      `Hi SIRAQ, I would like to order "${item.name}" (Price: ₹${item.price}). Please share the customization options and delivery details.`
    );
    window.open(`https://wa.me/918217469646?text=${text}`, '_blank');
  };

  const framesList = products.filter(
    (p) => p.category === 'Customized Photo Frames' || p.category === 'Personalized Gifts'
  );
  const hampersList = products.filter(
    (p) => p.category === 'Gift Hampers' || p.category === 'Birthday Gifts' || p.category === 'Anniversary Gifts' || p.category === 'Wedding Gifts'
  );

  return (
    <section id="frames-hampers" className="container mx-auto px-6 py-24 border-t border-[#E5E5E7] relative bg-white">
      {/* Section Header */}
      <div className="mb-14 text-center max-w-3xl mx-auto">
        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFD43B]/20 text-[#855B00] border border-[#FFD43B]/40 text-xs font-bold uppercase tracking-wider mb-3">
          <Gift className="w-3.5 h-3.5 text-[#B45309]" /> Premium Gifting & Memories
        </span>
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#1D1D1F]">
          Customized Frames & Bespoke Hampers
        </h2>
        <p className="mt-4 text-[#6E6E73] text-sm sm:text-base leading-relaxed">
          Preserve cherished moments with optical-grade floating acrylic frames, warm ambient LED night portraits, and meticulously crafted luxury gift hampers.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex justify-center gap-3 mb-14">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
            activeTab === 'all'
              ? 'bg-[#FFD43B] text-black shadow-sm scale-105'
              : 'bg-[#FAFAFC] border border-[#E5E5E7] text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-white'
          }`}
        >
          All Creations
        </button>
        <button
          onClick={() => setActiveTab('frames')}
          className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'frames'
              ? 'bg-[#FFD43B] text-black shadow-sm scale-105'
              : 'bg-[#FAFAFC] border border-[#E5E5E7] text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-white'
          }`}
        >
          <Frame className="w-3.5 h-3.5" /> Customized Photo Frames
        </button>
        <button
          onClick={() => setActiveTab('hampers')}
          className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'hampers'
              ? 'bg-[#FFD43B] text-black shadow-sm scale-105'
              : 'bg-[#FAFAFC] border border-[#E5E5E7] text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-white'
          }`}
        >
          <Gift className="w-3.5 h-3.5" /> Curated Gift Hampers
        </button>
      </div>

      {/* PHOTO FRAMES SECTION */}
      {(activeTab === 'all' || activeTab === 'frames') && (
        <div className="mb-20 max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8 pb-3 border-b border-[#F2F2F7]">
            <div>
              <h3 className="text-2xl font-display font-bold text-[#1D1D1F] flex items-center gap-2.5">
                <Frame className="w-6 h-6 text-[#0284C7]" /> Customized Photo Frames
              </h3>
              <p className="text-xs text-[#6E6E73] mt-0.5">
                Direct UV printing on acrylic, optical float mountings, and LED night displays
              </p>
            </div>
            <span className="hidden sm:inline-block text-xs font-bold px-3 py-1 rounded-full bg-[#FFF9DB] text-[#855B00] border border-[#FDE68A]">
              Starting from ₹349
            </span>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {(framesList.length > 0 ? framesList : products).map((frame) => (
              <div
                key={frame.id}
                className="rounded-3xl border border-[#E5E5E7] bg-white overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] hover:border-[#D1D5DB] transition duration-300 group flex flex-col justify-between"
              >
                <div>
                  <div
                    className="relative h-60 w-full overflow-hidden bg-[#FAFAFC] cursor-pointer"
                    onClick={() => setPreviewImage({ src: frame.image || '/images/frames-showcase.jpg', title: frame.name })}
                  >
                    <Image
                      src={frame.image || '/images/frames-showcase.jpg'}
                      alt={frame.name}
                      fill
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />
                    {frame.badge && (
                      <span className="absolute top-4 left-4 rounded-full bg-[#FFD43B] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-black shadow-sm">
                        {frame.badge}
                      </span>
                    )}
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="px-3.5 py-1.5 rounded-full bg-white/95 text-black text-xs font-bold flex items-center gap-1.5 shadow-md">
                        <Eye className="w-3.5 h-3.5" /> Preview Frame
                      </span>
                    </div>
                  </div>

                  <div className="p-7">
                    <h4 className="text-xl font-bold font-display text-[#1D1D1F] mb-1 group-hover:text-[#0284C7] transition">
                      {frame.name}
                    </h4>
                    <p className="text-xs text-[#6E6E73] mb-4">{frame.tagline}</p>

                    <div className="space-y-1.5 mb-5">
                      {frame.features?.slice(0, 3).map((feat, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-[#424245]">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-[#FAFAFC] border-t border-[#F2F2F7] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#86868B] block">Price Starting At</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold font-display text-[#1D1D1F]">₹{frame.price}</span>
                      {frame.discountPrice && (
                        <span className="text-xs text-[#86868B] line-through">₹{frame.discountPrice}</span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleOrderProduct(frame)}
                    className="px-5 py-2.5 rounded-full bg-[#FFD43B] hover:bg-[#F5C724] text-black text-xs font-bold transition flex items-center gap-2 shadow-sm"
                  >
                    <span>Customize</span>
                    <ArrowRight className="w-3.5 h-3.5" />
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
          <div className="flex items-center justify-between mb-8 pb-3 border-b border-[#F2F2F7]">
            <div>
              <h3 className="text-2xl font-display font-bold text-[#1D1D1F] flex items-center gap-2.5">
                <Gift className="w-6 h-6 text-[#FFD43B]" /> Curated Luxury Gift Hampers
              </h3>
              <p className="text-xs text-[#6E6E73] mt-0.5">
                Artisanal wedding gift boxes, corporate kits, and personalized celebration chests
              </p>
            </div>
            <span className="hidden sm:inline-block text-xs font-bold px-3 py-1 rounded-full bg-[#FFF9DB] text-[#855B00] border border-[#FDE68A]">
              Starting from ₹799
            </span>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {(hampersList.length > 0 ? hampersList : products).map((hamper) => (
              <div
                key={hamper.id}
                className="rounded-3xl border border-[#E5E5E7] bg-white overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] hover:border-[#D1D5DB] transition duration-300 group flex flex-col justify-between"
              >
                <div>
                  <div
                    className="relative h-56 w-full overflow-hidden bg-[#FAFAFC] cursor-pointer"
                    onClick={() => setPreviewImage({ src: hamper.image || '/images/hampers-showcase.jpg', title: hamper.name })}
                  >
                    <Image
                      src={hamper.image || '/images/hampers-showcase.jpg'}
                      alt={hamper.name}
                      fill
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />
                    {hamper.badge && (
                      <span className="absolute top-4 left-4 rounded-full bg-[#FFD43B] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-black shadow-sm">
                        {hamper.badge}
                      </span>
                    )}
                  </div>

                  <div className="p-6">
                    <span className="text-[10px] uppercase font-bold text-[#0284C7] block mb-1">
                      {hamper.tagline || hamper.category}
                    </span>
                    <h4 className="text-lg font-bold font-display text-[#1D1D1F] mb-3 group-hover:text-[#0284C7] transition">
                      {hamper.name}
                    </h4>

                    {hamper.includedItems && (
                      <div className="space-y-1 mb-4">
                        <span className="text-[11px] font-bold text-[#86868B] uppercase tracking-wider">Includes:</span>
                        {hamper.includedItems.slice(0, 3).map((item, i) => (
                          <div key={i} className="text-xs text-[#6E6E73] truncate flex items-center gap-1.5">
                            <span className="w-1 h-1 rounded-full bg-[#FFD43B]"></span>
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-5 bg-[#FAFAFC] border-t border-[#F2F2F7] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#86868B] block">Starting From</span>
                    <span className="text-xl font-bold font-display text-[#1D1D1F]">₹{hamper.price}</span>
                  </div>

                  <button
                    onClick={() => handleOrderProduct(hamper)}
                    className="px-4 py-2 rounded-full bg-[#FFD43B] hover:bg-[#F5C724] text-black text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Order</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      <AnimatePresence>
        {previewImage && (
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
            onClick={() => setPreviewImage(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-2xl w-full bg-white rounded-3xl overflow-hidden p-3 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-96 w-full rounded-2xl overflow-hidden">
                <Image src={previewImage.src} alt={previewImage.title} fill className="object-cover" />
              </div>
              <div className="p-4 flex items-center justify-between">
                <span className="font-bold text-sm text-[#1D1D1F]">{previewImage.title}</span>
                <button
                  onClick={() => setPreviewImage(null)}
                  className="px-4 py-1.5 rounded-full bg-[#F2F2F7] hover:bg-[#E5E5E7] text-xs font-bold"
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
