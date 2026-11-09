'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Sparkles,
  Play,
  Shield,
  GraduationCap,
  Gift,
  Frame,
  Printer,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Upload,
  Smartphone,
  CreditCard,
  FileCheck2,
} from 'lucide-react';
import LogoIntroOverlay from './components/LogoIntroOverlay';
import CscServicesSection from './components/CscServicesSection';
import RealtimeSchemesSection from './components/RealtimeSchemesSection';
import FramesAndHampersSection from './components/FramesAndHampersSection';

export default function HomePage() {
  const [showLogoIntro, setShowLogoIntro] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    // Show cinematic logo intro once per session
    const hasSeenIntro = sessionStorage.getItem('siraq_seen_logo_intro');
    if (!hasSeenIntro) {
      setShowLogoIntro(true);
      sessionStorage.setItem('siraq_seen_logo_intro', 'true');
    }

    // Load external helper scripts if present
    const loadScript = (src: string): Promise<void> => {
      return new Promise((resolve) => {
        if (document.querySelector(`script[src="${src}"]`)) {
          resolve();
          return;
        }
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => resolve();
        document.body.appendChild(script);
      });
    };

    const initScripts = async () => {
      try {
        await loadScript('/js/main.js');
      } catch (e) {
        console.warn('Script load warning:', e);
      }
    };

    initScripts();
  }, []);

  return (
    <div className="bg-white min-h-screen text-[#1D1D1F] selection:bg-[#FFD43B] selection:text-black">
      {/* Cinematic Logo Video Intro Overlay */}
      <LogoIntroOverlay
        isOpen={showLogoIntro}
        onClose={() => setShowLogoIntro(false)}
      />

      {/* Navigation Bar (Apple-style Frosted Glass, No Public Admin Button) */}
      <nav id="main-nav" className="sticky top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#E5E5E7] transition-all duration-300">
        <div className="container mx-auto px-6 py-3.5">
          <div className="flex items-center justify-between">
            {/* Logo Brand */}
            <a href="#hero" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-full p-1.5 bg-[#FFD43B] flex items-center justify-center overflow-hidden transition group-hover:scale-105 shadow-sm">
                <Image
                  src="/images/siraq-logo.png"
                  alt="SIRAQ Logo"
                  width={24}
                  height={24}
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-display font-bold tracking-tight text-[#1D1D1F] group-hover:text-[#855B00] transition">
                SIRAQ
              </span>
            </a>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-6 text-xs font-semibold text-[#6E6E73]">
              <a href="#hero" className="hover:text-[#1D1D1F] transition">Home</a>
              <Link href="/print" className="hover:text-[#1D1D1F] transition flex items-center gap-1 text-[#855B00] font-bold">
                <Printer className="w-3.5 h-3.5 text-[#FFD43B]" /> Smart Print
              </Link>
              <a href="#services" className="hover:text-[#1D1D1F] transition">ID Cards & Posters</a>
              <a href="#csc-services" className="hover:text-[#1D1D1F] transition flex items-center gap-1 text-emerald-700">
                <Shield className="w-3.5 h-3.5" /> CSC Center
              </a>
              <a href="#scholarships-schemes" className="hover:text-[#1D1D1F] transition flex items-center gap-1 text-[#0284C7]">
                <GraduationCap className="w-3.5 h-3.5" /> Scholarships & Aid
              </a>
              <a href="#frames-hampers" className="hover:text-[#1D1D1F] transition flex items-center gap-1">
                <Gift className="w-3.5 h-3.5 text-[#FFD43B]" /> Frames & Hampers
              </a>
              <a href="#faq" className="hover:text-[#1D1D1F] transition">FAQ</a>
              <a href="#contact" className="hover:text-[#1D1D1F] transition">Contact</a>
            </div>

            {/* Header Right Actions */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setShowLogoIntro(true)}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#E5E5E7] bg-[#FAFAFC] hover:bg-[#F2F2F7] text-[#6E6E73] hover:text-[#1D1D1F] text-xs font-semibold transition"
                title="Play Logo Intro Animation"
              >
                <Play className="w-2.5 h-2.5 text-[#FFD43B] fill-current" /> SIRAQ Intro
              </button>
              <Link
                href="/print"
                className="px-4 py-2 rounded-full bg-[#FFD43B] hover:bg-[#F5C724] text-black text-xs font-bold shadow-sm transition flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Self-Service Print</span>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden text-[#1D1D1F] p-1.5 rounded-xl border border-[#E5E5E7] focus:outline-none"
                aria-label="Toggle menu"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Drawer Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden mt-3 bg-white border border-[#E5E5E7] rounded-3xl p-5 shadow-lg space-y-3 text-xs font-semibold text-[#6E6E73]">
              <a href="#hero" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-[#1D1D1F]">Home</a>
              <Link href="/print" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-[#855B00] font-bold flex items-center gap-1.5">
                <Printer className="w-3.5 h-3.5 text-[#FFD43B]" /> SIRAQ Smart Print (Self-Service)
              </Link>
              <a href="#csc-services" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-emerald-700">
                🪪 CSC Citizen Services (Aadhaar / Passport / PAN)
              </a>
              <a href="#scholarships-schemes" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-[#0284C7]">
                🎓 Realtime Scholarships & Govt Schemes
              </a>
              <a href="#frames-hampers" onClick={() => setMobileMenuOpen(false)} className="block py-1">
                🎁 Customized Frames & Gift Hampers
              </a>
              <a href="#services" onClick={() => setMobileMenuOpen(false)} className="block py-1">ID Cards & Posters</a>
              <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="block py-1">FAQ</a>
              <a href="#order" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-[#1D1D1F] font-bold">
                Order on WhatsApp
              </a>
            </div>
          )}
        </div>
      </nav>

      {/* Floating WhatsApp Quick Action */}
      <a
        href="https://wa.me/918217469646?text=Hi%20SIRAQ,%20I%20would%20like%20to%20inquire%20about%20your%20services."
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_30px_rgba(37,211,102,0.4)] transition duration-300 hover:scale-110"
        aria-label="Contact us on WhatsApp"
      >
        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
      </a>

      <main className="relative">
        {/* HERO SECTION (Apple-Inspired Minimalism) */}
        <section id="hero" className="container mx-auto px-6 pt-20 pb-20 text-center">
          <div className="max-w-4xl mx-auto">
            {/* Minimal Badge */}
            <div
              onClick={() => setShowLogoIntro(true)}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#E5E5E7] bg-[#FAFAFC] hover:bg-[#FFF9DB] hover:border-[#FFD43B] transition cursor-pointer mb-8 shadow-sm group"
            >
              <div className="w-5 h-5 rounded-full bg-[#FFD43B] flex items-center justify-center p-1">
                <Image src="/images/siraq-logo.png" alt="SIRAQ" width={14} height={14} />
              </div>
              <span className="text-xs font-bold text-[#1D1D1F]">
                SIRAQ Studio & Citizen Desk
              </span>
              <span className="text-[10px] text-[#855B00] font-bold bg-[#FFD43B]/30 px-2 py-0.5 rounded-full">
                Est. 2026
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#1D1D1F] leading-[1.1]">
              Premium Custom Designs.
              <span className="block text-[#1D1D1F] mt-2">
                Complete Citizen Services.
              </span>
            </h1>

            <p className="mt-6 text-base sm:text-lg text-[#6E6E73] max-w-2xl mx-auto leading-relaxed">
              From verified PVC ID cards, customized photo frames, and luxury hampers to official Aadhaar updates, passports, and instant self-service printing.
            </p>

            {/* Apple Minimalist CTAs */}
            <div className="mt-10 flex flex-wrap gap-3.5 justify-center items-center">
              <Link
                href="/print"
                className="px-8 py-3.5 rounded-full bg-[#FFD43B] hover:bg-[#F5C724] text-black text-xs sm:text-sm font-bold shadow-sm transition flex items-center gap-2 scale-105"
              >
                <Printer className="w-4 h-4" />
                <span>SIRAQ Smart Print (Self-Service)</span>
              </Link>
              <a
                href="#csc-services"
                className="px-7 py-3.5 rounded-full border border-[#E5E5E7] bg-white hover:bg-[#FAFAFC] text-[#1D1D1F] text-xs sm:text-sm font-bold transition flex items-center gap-2 shadow-sm"
              >
                <Shield className="w-4 h-4 text-emerald-600" />
                <span>CSC Citizen Services</span>
              </a>
              <a
                href="#frames-hampers"
                className="px-7 py-3.5 rounded-full border border-[#E5E5E7] bg-white hover:bg-[#FAFAFC] text-[#1D1D1F] text-xs sm:text-sm font-bold transition flex items-center gap-2 shadow-sm"
              >
                <Gift className="w-4 h-4 text-[#855B00]" />
                <span>Frames & Hampers</span>
              </a>
            </div>

            {/* Quick Proof Pills */}
            <div className="mt-12 flex flex-wrap justify-center items-center gap-5 text-xs font-semibold text-[#86868B]">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 1200+ Orders Delivered
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Authorized CSC Facilitation
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#0284C7]" /> Canon PIXMA G3010 Shop Hub
              </span>
            </div>
          </div>
        </section>

        {/* SECTION: SIRAQ SMART PRINT SHOWCASE (Section 5) */}
        <section className="container mx-auto px-6 py-16">
          <div className="max-w-5xl mx-auto rounded-3xl border border-[#E5E5E7] bg-[#FAFAFC] p-8 sm:p-12 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFD43B]/30 text-[#855B00] text-xs font-bold uppercase tracking-wider mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-[#B45309]" /> QR Self-Service Printing
                </span>
                <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#1D1D1F]">
                  SIRAQ SMART PRINT
                </h2>
                <p className="text-xs font-bold text-[#86868B] tracking-widest mt-1 mb-4 uppercase">
                  SCAN • UPLOAD • PAY • PRINT
                </p>
                <p className="text-xs sm:text-sm text-[#6E6E73] leading-relaxed mb-6">
                  Print your documents directly from your phone in under 60 seconds without installing any application. Simply scan the counter QR, choose Black & White or Full Colour, complete UPI payment, and collect your fresh prints from our Canon PIXMA G3010.
                </p>

                <div className="space-y-2 mb-6 text-xs text-[#424245]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Supports PDF, JPG, JPEG, and PNG files up to 25MB</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Instant verified UPI / Razorpay payment gateway</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>A4 & A5, Single-sided or Duplex printing</span>
                  </div>
                </div>

                <Link
                  href="/print"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#FFD43B] hover:bg-[#F5C724] text-black text-xs sm:text-sm font-bold shadow-sm transition"
                >
                  <span>Open Self-Service Print Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Graphic Mockup Card */}
              <div className="bg-white border border-[#E5E5E7] rounded-3xl p-6 sm:p-8 text-center shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
                <div className="w-16 h-16 rounded-2xl bg-[#FFF9DB] border border-[#FDE68A] flex items-center justify-center mx-auto mb-4 text-black">
                  <Printer className="w-8 h-8 text-[#B45309]" />
                </div>
                <h3 className="text-lg font-bold text-[#1D1D1F]">Canon PIXMA G3010 Ready</h3>
                <p className="text-xs text-[#6E6E73] mt-1 mb-5">
                  High-yield ink tank printer tuned for crisp text and vibrant color photo output.
                </p>

                <div className="grid grid-cols-2 gap-3 text-left">
                  <div className="p-3.5 rounded-2xl bg-[#FAFAFC] border border-[#E5E5E7]">
                    <span className="text-[10px] uppercase font-bold text-[#86868B] block">Black & White</span>
                    <span className="text-xl font-bold font-display text-[#1D1D1F]">₹2.00</span>
                    <span className="text-[10px] text-[#6E6E73] block mt-0.5">per A4 page</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-[#FAFAFC] border border-[#E5E5E7]">
                    <span className="text-[10px] uppercase font-bold text-[#86868B] block">Full Colour</span>
                    <span className="text-xl font-bold font-display text-[#1D1D1F]">₹10.00</span>
                    <span className="text-[10px] text-[#6E6E73] block mt-0.5">per A4 page</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: CORE SERVICES (PVC ID CARDS & POSTERS) */}
        <section id="services" className="container mx-auto px-6 py-20 border-t border-[#E5E5E7]">
          <div className="mb-14 text-center max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#87CEEB]/15 text-[#0284C7] text-xs font-bold uppercase tracking-wider mb-3">
              Crafted With Care
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#1D1D1F]">
              PVC ID Cards & Creative Designs
            </h2>
            <p className="mt-4 text-[#6E6E73] text-sm sm:text-base leading-relaxed">
              Transparent pricing, institutional bulk discounts, and scannable QR verification standards.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto mb-16">
            {/* Normal ID Card */}
            <div className="bg-white border border-[#E5E5E7] rounded-3xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-md transition">
              <div className="mb-4 text-4xl">🪪</div>
              <h3 className="text-xl font-bold font-display text-[#1D1D1F] mb-2">Standard PVC ID Card</h3>
              <p className="text-xs text-[#6E6E73] mb-6">
                Professional employee IDs, student cards, and institutional access badges with crisp durable finish.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center border-b border-[#F2F2F7] pb-2 text-xs">
                  <span className="text-[#6E6E73]">100+ cards</span>
                  <span className="text-base font-bold text-[#1D1D1F]">₹70<span className="text-[10px] text-[#86868B]">/card</span></span>
                </div>
                <div className="flex justify-between items-center border-b border-[#F2F2F7] pb-2 text-xs">
                  <span className="text-[#6E6E73]">500+ cards</span>
                  <span className="text-base font-bold text-[#1D1D1F]">₹65<span className="text-[10px] text-[#86868B]">/card</span></span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#6E6E73]">1000+ cards</span>
                  <span className="text-base font-bold text-[#1D1D1F]">₹60<span className="text-[10px] text-[#86868B]">/card</span></span>
                </div>
              </div>
              <a
                href="#order"
                className="block w-full text-center rounded-full bg-[#FAFAFC] hover:bg-[#F2F2F7] border border-[#E5E5E7] py-2.5 text-xs font-bold text-[#1D1D1F] transition"
              >
                Inquire on WhatsApp
              </a>
            </div>

            {/* Premium QR ID Card */}
            <div className="bg-white border-2 border-[#FFD43B] rounded-3xl p-8 shadow-[0_4px_20px_rgba(255,212,59,0.15)] relative">
              <span className="absolute top-4 right-4 bg-[#FFD43B] text-black text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                QR Verified
              </span>
              <div className="mb-4 text-4xl">⭐</div>
              <h3 className="text-xl font-bold font-display text-[#1D1D1F] mb-2">Premium Security ID Card</h3>
              <p className="text-xs text-[#6E6E73] mb-6">
                High-definition cards with scannable QR verification, holographic security overlays, and waterproof coating.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center border-b border-[#F2F2F7] pb-2 text-xs">
                  <span className="text-[#6E6E73]">100+ cards</span>
                  <span className="text-base font-bold text-[#855B00]">₹120<span className="text-[10px] text-[#86868B]">/card</span></span>
                </div>
                <div className="flex justify-between items-center border-b border-[#F2F2F7] pb-2 text-xs">
                  <span className="text-[#6E6E73]">500+ cards</span>
                  <span className="text-base font-bold text-[#855B00]">₹110<span className="text-[10px] text-[#86868B]">/card</span></span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#6E6E73]">1000+ cards</span>
                  <span className="text-base font-bold text-[#855B00]">₹100<span className="text-[10px] text-[#86868B]">/card</span></span>
                </div>
              </div>
              <a
                href="#order"
                className="block w-full text-center rounded-full bg-[#FFD43B] hover:bg-[#F5C724] py-2.5 text-xs font-bold text-black shadow-sm transition"
              >
                Order Premium Cards
              </a>
            </div>
          </div>
        </section>

        {/* SECTION: CSC CITIZEN SERVICES (Dynamic DB-driven) */}
        <CscServicesSection />

        {/* SECTION: REALTIME SCHOLARSHIPS & GOVT SCHEMES */}
        <RealtimeSchemesSection />

        {/* SECTION: CUSTOMIZED FRAMES & BESPOKE GIFT HAMPERS (Dynamic DB-driven) */}
        <FramesAndHampersSection />

        {/* SECTION: FAQ */}
        <section id="faq" className="container mx-auto px-6 py-20 border-t border-[#E5E5E7]">
          <div className="mb-14 text-center max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#87CEEB]/15 text-[#0284C7] text-xs font-bold uppercase tracking-wider mb-3">
              Answers
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#1D1D1F]">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            <div className="bg-white border border-[#E5E5E7] rounded-2xl p-6 shadow-sm">
              <h4 className="font-bold text-sm text-[#1D1D1F] mb-2">
                How does SIRAQ Smart Print self-service printing work?
              </h4>
              <p className="text-xs text-[#6E6E73] leading-relaxed">
                Scan the QR code at our shop counter, upload your document (PDF, JPG, PNG), select options (B&W or colour, copies), and pay via UPI. Once confirmed, your document automatically prints on our Canon PIXMA G3010 without waiting.
              </p>
            </div>

            <div className="bg-white border border-[#E5E5E7] rounded-2xl p-6 shadow-sm">
              <h4 className="font-bold text-sm text-[#1D1D1F] mb-2">
                How does SIRAQ assist with CSC Services & Government Scholarships?
              </h4>
              <p className="text-xs text-[#6E6E73] leading-relaxed">
                SIRAQ operates as an authorized digital citizen facilitation center. We verify your exact eligibility, format documents to official state portal specifications, and complete submissions for Aadhaar updates, passports, PAN cards, and scholarships without rejection issues.
              </p>
            </div>

            <div className="bg-white border border-[#E5E5E7] rounded-2xl p-6 shadow-sm">
              <h4 className="font-bold text-sm text-[#1D1D1F] mb-2">
                Can I order customized Acrylic Photo Frames with my personal photos?
              </h4>
              <p className="text-xs text-[#6E6E73] leading-relaxed">
                Yes! Send your photos or special songs for Spotify acrylic plaques directly on WhatsApp. We share a high-definition preview mockup before UV printing onto optical-grade acrylic sheets.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION: ORDER INQUIRY */}
        <section className="container mx-auto px-6 py-20 border-t border-[#E5E5E7]" id="order">
          <div className="max-w-2xl mx-auto bg-white border border-[#E5E5E7] rounded-3xl p-8 sm:p-10 shadow-sm text-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFD43B]/20 text-[#855B00] text-xs font-bold uppercase tracking-wider mb-3">
              Direct Contact
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#1D1D1F]">
              Have a Custom Request?
            </h3>
            <p className="text-xs sm:text-sm text-[#6E6E73] mt-2 mb-8">
              Speak directly with our shop team on WhatsApp for bespoke frames, bulk student ID runs, and CSC appointments.
            </p>

            <a
              href="https://wa.me/918217469646?text=Hi%20SIRAQ,%20I%20have%20a%20custom%20service%20inquiry."
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#FFD43B] hover:bg-[#F5C724] text-black font-bold text-sm shadow-sm transition"
            >
              <span>Chat with SIRAQ on WhatsApp</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </section>

        {/* FOOTER (Clean Apple Aesthetic, NO Public Admin Link) */}
        <footer id="contact" className="border-t border-[#E5E5E7] bg-[#FAFAFC] py-12">
          <div className="container mx-auto px-6 max-w-5xl">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-8 border-b border-[#E5E5E7]">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#FFD43B] flex items-center justify-center p-1 shadow-sm">
                  <Image src="/images/siraq-logo.png" alt="SIRAQ Logo" width={20} height={20} />
                </div>
                <span className="font-display font-bold text-lg text-[#1D1D1F]">SIRAQ Studio</span>
              </div>

              <div className="flex items-center gap-6 text-xs text-[#6E6E73] font-semibold">
                <a href="mailto:siraqstudio@gmail.com" className="hover:text-[#1D1D1F] transition">siraqstudio@gmail.com</a>
                <a href="tel:+918217469646" className="hover:text-[#1D1D1F] transition">+91 82174 69646</a>
                <a href="https://www.instagram.com/siraq.studio" target="_blank" rel="noreferrer" className="hover:text-[#1D1D1F] transition">Instagram</a>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#86868B]">
              <p>© 2026 SIRAQ Studio & Citizen Desk. All rights reserved.</p>
              <div className="flex items-center gap-3">
                <span>Apple-Inspired Minimalism</span>
                <span>•</span>
                <span>Pure White #FFFFFF</span>
                <span>•</span>
                <span>Premium Yellow #FFD43B</span>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
