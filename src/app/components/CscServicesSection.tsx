'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Clock, FileCheck, ArrowRight, CheckCircle2, ChevronRight, HelpCircle } from 'lucide-react';
import { CSC_SERVICES, CSCService } from '@/lib/servicesData';

export default function CscServicesSection() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedService, setSelectedService] = useState<CSCService | null>(null);

  const categories = [
    { id: 'all', label: 'All CSC Services' },
    { id: 'Aadhaar', label: '🪪 Aadhaar' },
    { id: 'Passport', label: '🛂 Passport' },
    { id: 'PAN', label: '💳 PAN Card' },
    { id: 'Identity', label: '🗳️ Voter & DL' },
    { id: 'Certificates', label: '📜 Revenue Certs' },
    { id: 'Utility', label: '⚡ Utility & Bills' },
  ];

  const filteredServices = activeCategory === 'all'
    ? CSC_SERVICES
    : CSC_SERVICES.filter((s) => s.category === activeCategory);

  const handleApplyWhatsApp = (service: CSCService) => {
    const text = encodeURIComponent(
      `Hi SIRAQ, I want to book CSC Service: ${service.title}. Please let me know the requirements and slot booking process.`
    );
    window.open(`https://wa.me/918217469646?text=${text}`, '_blank');
  };

  return (
    <section id="csc-services" className="container mx-auto px-6 py-20 border-t border-white/10 relative">
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Section Header */}
      <div className="mb-12 text-center max-w-3xl mx-auto">
        <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold uppercase tracking-wider mb-3">
          <Shield className="w-3.5 h-3.5" /> Official Digital Citizen Center
        </span>
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
          CSC & Citizen Digital Services
        </h2>
        <p className="mt-4 text-slateSoft text-sm sm:text-base leading-relaxed">
          Authorized assistance for Aadhaar updates, fresh & Tatkal passports, instant 10-minute PAN cards, voter IDs, and government revenue certificates.
        </p>
      </div>

      {/* Apple-Style Category Pills */}
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
              activeCategory === cat.id
                ? 'bg-gradient-to-r from-accent to-neon text-charcoal font-bold shadow-glow scale-105'
                : 'bg-white/5 border border-white/10 text-slateSoft hover:text-white hover:bg-white/10'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Services Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {filteredServices.map((service) => (
          <div
            key={service.id}
            className="group relative rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.06] via-white/[0.02] to-transparent p-7 backdrop-blur-xl shadow-glass transition duration-300 hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-[0_20px_40px_rgba(21,244,238,0.1)] flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl group-hover:scale-110 transition shadow-sm">
                  {service.icon}
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold uppercase tracking-wider">
                  {service.badge}
                </span>
              </div>

              <h3 className="text-xl font-bold font-display text-white mb-2 group-hover:text-neon transition">
                {service.title}
              </h3>
              <p className="text-xs text-slateSoft leading-relaxed mb-5">
                {service.description}
              </p>

              {/* Quick Specs */}
              <div className="space-y-2 mb-5 text-xs text-slate-300 border-t border-b border-white/10 py-3">
                <div className="flex items-center justify-between">
                  <span className="text-slateSoft flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-accent" /> Speed:
                  </span>
                  <span className="font-semibold text-white">{service.turnaroundTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slateSoft flex items-center gap-1.5">
                    <FileCheck className="w-3.5 h-3.5 text-neon" /> Pricing:
                  </span>
                  <span className="font-semibold text-accent">{service.feeEstimate}</span>
                </div>
              </div>

              {/* Key Features Pill list */}
              <div className="space-y-1.5 mb-6">
                {service.features.map((feat, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={() => setSelectedService(service)}
                className="flex-1 py-2.5 px-3 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold transition text-center"
              >
                Docs Required
              </button>
              <button
                onClick={() => handleApplyWhatsApp(service)}
                className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-accent to-neon hover:brightness-110 text-charcoal text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
              >
                Book Slot <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Documents Modal */}
      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md bg-[#0e1017] border border-white/20 rounded-3xl p-6 text-white shadow-2xl relative"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{selectedService.icon}</span>
                  <div>
                    <h4 className="font-bold text-base">{selectedService.title}</h4>
                    <p className="text-[11px] text-slateSoft">Checklist of required items</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedService(null)}
                  className="p-1.5 rounded-full hover:bg-white/10 text-slateSoft hover:text-white transition"
                >
                  ✕
                </button>
              </div>

              <div className="py-5 space-y-3">
                <p className="text-xs text-slateSoft font-medium">Please keep the following documents ready:</p>
                <div className="space-y-2">
                  {selectedService.documents.map((doc, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-start gap-2.5 text-xs text-slate-200">
                      <span className="w-5 h-5 rounded-full bg-accent/20 text-accent font-bold flex items-center justify-center shrink-0 text-[10px]">
                        {idx + 1}
                      </span>
                      <span>{doc}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center gap-3">
                <button
                  onClick={() => setSelectedService(null)}
                  className="px-4 py-2.5 rounded-xl border border-white/15 bg-white/5 text-xs font-semibold text-slate-300 hover:text-white"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleApplyWhatsApp(selectedService);
                    setSelectedService(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-accent to-neon text-charcoal font-bold text-xs flex items-center justify-center gap-1.5 shadow-glow"
                >
                  Apply on WhatsApp <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
