'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Clock, FileCheck, ArrowRight, CheckCircle2, HelpCircle } from 'lucide-react';
import { ServiceItem } from '@/lib/types';
import { CSC_SERVICES } from '@/lib/servicesData';

export default function CscServicesSection() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Dynamic fetch from database / API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch('/api/services');
        const data = await res.json();
        if (data.success && data.data && data.data.length > 0) {
          setServices(data.data);
        } else {
          // Fallback to static seed
          setServices(
            CSC_SERVICES.map((s, idx) => ({
              id: s.id,
              title: s.title,
              category: s.category as any,
              icon: s.icon,
              badge: s.badge,
              description: s.description,
              documents: s.documents,
              turnaroundTime: s.turnaroundTime,
              feeEstimate: s.feeEstimate,
              numericPrice: s.numericPrice ?? 100,
              features: s.features,
              isActive: true,
              orderRank: idx + 1,
            }))
          );
        }
      } catch (err) {
        console.warn('Could not fetch dynamic services, using initial seed:', err);
        setServices(
          CSC_SERVICES.map((s, idx) => ({
            id: s.id,
            title: s.title,
            category: s.category as any,
            icon: s.icon,
            badge: s.badge,
            description: s.description,
            documents: s.documents,
            turnaroundTime: s.turnaroundTime,
            feeEstimate: s.feeEstimate,
            numericPrice: s.numericPrice ?? 100,
            features: s.features,
            isActive: true,
            orderRank: idx + 1,
          }))
        );
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const categories = [
    { id: 'all', label: 'All Services' },
    { id: 'Aadhaar', label: '🪪 Aadhaar' },
    { id: 'PAN', label: '💳 PAN Card' },
    { id: 'Identity', label: '🗳️ Voter ID' },
    { id: 'Certificates', label: '📜 Revenue Certs' },
    { id: 'Utility', label: '⚡ FASTag & Utility' },
  ];

  const filteredServices = activeCategory === 'all'
    ? services
    : services.filter((s) => s.category === activeCategory);

  const handleApplyWhatsApp = (service: ServiceItem) => {
    const text = encodeURIComponent(
      `Hi SIRAQ, I want to book CSC Service: ${service.title} (${service.feeEstimate}). Please guide me with requirements and processing.`
    );
    window.open(`https://wa.me/918217469646?text=${text}`, '_blank');
  };

  return (
    <section id="csc-services" className="container mx-auto px-6 py-24 border-t border-[#DDF1DF] relative bg-white">
      {/* Section Header */}
      <div className="mb-14 text-center max-w-3xl mx-auto">
        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DDF1DF] text-[#477D55] border border-[#A8CFAE] text-xs font-bold uppercase tracking-wider mb-3">
          <Shield className="w-3.5 h-3.5 text-[#477D55]" /> Authorized Digital Citizen Desk
        </span>
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#25352B]">
          CSC & Citizen Digital Services
        </h2>
        <p className="mt-4 text-[#477D55]/85 text-sm sm:text-base leading-relaxed">
          Accurate government document facilitation for Aadhaar updates & lamination, PAN applications, voter IDs, official revenue certificates, and utility assistance.
        </p>
      </div>

      {/* Apple-Style Category Pills */}
      <div className="flex flex-wrap justify-center gap-2 mb-14">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-5 py-2.5 rounded-full text-xs font-semibold transition-all ${
              activeCategory === cat.id
                ? 'bg-[#F5D76E] text-[#25352B] shadow-sm font-bold scale-105'
                : 'bg-[#F5F9F5] border border-[#DDF1DF] text-[#25352B]/75 hover:text-[#25352B] hover:bg-white'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Services Grid (Apple Cards) */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {filteredServices.map((service) => (
          <div
            key={service.id}
            className="group rounded-3xl border border-[#DDF1DF] bg-[#F5F9F5] p-7 shadow-[0_4px_20px_rgba(71,125,85,0.03)] hover:shadow-[0_12px_32px_rgba(71,125,85,0.08)] hover:border-[#A8CFAE] transition duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-white border border-[#DDF1DF] flex items-center justify-center text-3xl group-hover:scale-105 transition shadow-sm">
                  {service.icon}
                </div>
                {service.badge && (
                  <span className="px-3 py-1 rounded-full bg-white border border-[#DDF1DF] text-[#477D55] text-[10px] font-bold uppercase tracking-wider shadow-sm">
                    {service.badge}
                  </span>
                )}
              </div>

              <h3 className="text-xl font-bold font-display text-[#25352B] mb-2 group-hover:text-[#477D55] transition">
                {service.title}
              </h3>
              <p className="text-xs text-[#25352B]/75 leading-relaxed mb-5">
                {service.description}
              </p>

              {/* Quick Specs */}
              <div className="space-y-2 mb-5 text-xs border-t border-b border-[#DDF1DF] py-3 text-[#25352B]">
                <div className="flex items-center justify-between">
                  <span className="text-[#25352B]/70 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#477D55]" /> Speed:
                  </span>
                  <span className="font-semibold text-[#25352B]">{service.turnaroundTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#25352B]/70 flex items-center gap-1.5">
                    <FileCheck className="w-3.5 h-3.5 text-[#477D55]" /> Required:
                  </span>
                  <span className="font-medium text-[#25352B]/80 truncate max-w-[170px]" title={service.documents?.join(', ')}>
                    {service.documents?.[0]} {service.documents?.length > 1 ? `+${service.documents.length - 1} more` : ''}
                  </span>
                </div>
              </div>

              {/* Feature Highlights */}
              <div className="space-y-1.5 mb-6">
                {service.features?.slice(0, 3).map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-[11px] text-[#25352B]/85">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#477D55] shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Price & Action Row */}
            <div className="pt-4 border-t border-[#DDF1DF] flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#477D55] block">Desk Charge</span>
                <span className="text-base font-bold font-display text-[#25352B] bg-[#F5D76E] px-2.5 py-0.5 rounded-lg border border-[#eed063]">
                  {service.feeEstimate}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedService(service)}
                  className="p-2 rounded-full border border-[#A8CFAE] bg-white hover:bg-[#DDF1DF] text-[#25352B] transition text-xs font-semibold"
                  title="View Required Documents"
                >
                  <HelpCircle className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyWhatsApp(service)}
                  className="px-4 py-2 rounded-full bg-[#F5D76E] hover:bg-[#eed063] text-[#25352B] text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                >
                  <span>Book Slot</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Required Documents Modal */}
      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-[#DDF1DF] rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative"
            >
              <div className="flex items-start justify-between mb-4 pb-3 border-b border-[#DDF1DF]">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{selectedService.icon}</span>
                  <div>
                    <h3 className="text-lg font-bold font-display text-[#25352B]">{selectedService.title}</h3>
                    <p className="text-xs text-[#477D55]">{selectedService.turnaroundTime} • {selectedService.feeEstimate}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedService(null)}
                  className="p-1 rounded-full text-[#25352B]/60 hover:text-[#25352B]"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 my-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#25352B]">
                  Required Documents to Bring:
                </h4>
                <ul className="space-y-2">
                  {selectedService.documents?.map((docItem, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-[#25352B]">
                      <div className="w-4 h-4 rounded-full bg-[#DDF1DF] text-[#477D55] flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                        ✓
                      </div>
                      <span>{docItem}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-3 pt-3 border-t border-[#DDF1DF]">
                <button
                  type="button"
                  onClick={() => setSelectedService(null)}
                  className="flex-1 py-2.5 rounded-full border border-[#A8CFAE] text-xs font-bold text-[#25352B] hover:bg-[#F5F9F5]"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleApplyWhatsApp(selectedService);
                    setSelectedService(null);
                  }}
                  className="flex-1 py-2.5 rounded-full bg-[#F5D76E] text-[#25352B] text-xs font-bold shadow-sm hover:bg-[#eed063]"
                >
                  Book on WhatsApp
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
