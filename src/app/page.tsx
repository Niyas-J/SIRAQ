'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Shield,
  GraduationCap,
  Gift,
  Frame,
  Printer,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Upload,
  CreditCard,
  FileText,
  Clock,
  Layers,
  Phone,
  Mail,
  Instagram,
} from 'lucide-react';
import LogoIntroOverlay from './components/LogoIntroOverlay';
import CscServicesSection from './components/CscServicesSection';
import RealtimeSchemesSection from './components/RealtimeSchemesSection';
import FramesAndHampersSection from './components/FramesAndHampersSection';

const FAQ_ITEMS = [
  {
    q: 'How does SIRAQ Smart Print self-service printing work?',
    a: 'Simply scan the QR code at our shop counter or open siraq.vercel.app/print on your phone. Upload your document (PDF, JPG, PNG), select Black & White (₹5/page) or Full Colour (₹10/page), review the page breakdown, and complete UPI payment. The moment payment is verified, your document prints directly on our Canon PIXMA G3010 without waiting in line.',
  },
  {
    q: 'What is the processing time and cost for CSC citizen services?',
    a: 'We provide authorized facilitation: Aadhaar Card updates & lamination are ₹100; PAN Card application & corrections are ₹200 (7–14 days processing); Voter ID services are ₹100 (New, Corrections, Transfer); and Government Revenue Certificates (Caste, Income, Residence) are ₹150 (7–14 days, subject to government revenue approval). Utility bill payments and FASTag are charged according to the selected service.',
  },
  {
    q: 'How can I apply for SSP and NSP scholarships through SIRAQ?',
    a: 'Our student desk assists with complete registration for SSP (Karnataka State Scholarship Portal) and NSP (National Scholarship Portal). We verify your Kutumba ID, caste/income RD numbers, marks cards, and perform e-attestation and bank seeding checks. If you are applying for other scholarships, you can submit your details in our "Other Scholarship Assistance" form for specialized help.',
  },
  {
    q: 'Can I order customized Acrylic Photo Frames and bespoke gift hampers?',
    a: 'Yes! We craft optical-grade floating acrylic frames, warm LED night portraits, and curated gift hampers for weddings, birthdays, and corporate celebrations. You can customize them directly with photos and songs on WhatsApp (+91 8217469646) and receive a preview mockup before UV printing.',
  },
  {
    q: 'What document formats and file sizes are supported for printing?',
    a: 'SIRAQ Smart Print accepts PDF documents, as well as high-resolution JPG, JPEG, and PNG image files up to 25MB. For multi-page PDFs, you can select custom page ranges and print either single-sided or double-sided copies.',
  },
];

export default function HomePage() {
  const [showLogoIntro, setShowLogoIntro] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    // Show cinematic logo intro only once per session
    const hasSeenIntro = sessionStorage.getItem('siraq_seen_logo_intro');
    if (!hasSeenIntro) {
      setShowLogoIntro(true);
      sessionStorage.setItem('siraq_seen_logo_intro', 'true');
    }
  }, []);

  const toggleFaq = (idx: number) => {
    setOpenFaq((prev) => (prev === idx ? null : idx));
  };

  return (
    <div className="bg-[#FFFFFF] min-h-screen text-[#25352B] selection:bg-[#F5D76E] selection:text-[#25352B]">
      {/* One-time Session Logo Intro Overlay */}
      <LogoIntroOverlay
        isOpen={showLogoIntro}
        onClose={() => setShowLogoIntro(false)}
      />

      {/* Navigation Bar (Apple-style Soft Sage / Mint Frosted Glass) */}
      <nav id="main-nav" className="sticky top-0 left-0 right-0 z-50 bg-[#FFFFFF]/90 backdrop-blur-md border-b border-[#DDF1DF] transition-all duration-300">
        <div className="container mx-auto px-6 py-3.5">
          <div className="flex items-center justify-between">
            {/* Logo Brand */}
            <a href="#hero" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-full p-1.5 bg-[#DDF1DF] border border-[#A8CFAE] flex items-center justify-center overflow-hidden transition group-hover:scale-105 shadow-sm">
                <Image
                  src="/images/siraq-logo.png"
                  alt="SIRAQ Logo"
                  width={24}
                  height={24}
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-display font-bold tracking-tight text-[#25352B] group-hover:text-[#477D55] transition">
                SIRAQ
              </span>
            </a>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-6 text-xs font-semibold text-[#25352B]/75">
              <a href="#hero" className="hover:text-[#477D55] transition">Home</a>
              <Link href="/print" className="hover:text-[#477D55] transition flex items-center gap-1 text-[#477D55] font-bold">
                <Printer className="w-3.5 h-3.5 text-[#477D55]" /> Smart Print
              </Link>
              <a href="#csc-services" className="hover:text-[#477D55] transition flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-[#477D55]" /> CSC Services
              </a>
              <a href="#scholarships-schemes" className="hover:text-[#477D55] transition flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5 text-[#477D55]" /> Scholarships
              </a>
              <a href="#frames-hampers" className="hover:text-[#477D55] transition flex items-center gap-1">
                <Gift className="w-3.5 h-3.5 text-[#477D55]" /> Frames & Hampers
              </a>
              <a href="#services" className="hover:text-[#477D55] transition">ID Cards</a>
              <a href="#faq" className="hover:text-[#477D55] transition">FAQ</a>
              <a href="#order" className="hover:text-[#477D55] transition">Contact</a>
            </div>

            {/* Header Right Action: Smart Print Primary CTA */}
            <div className="flex items-center gap-2.5">
              <Link
                href="/print"
                className="px-4 py-2 rounded-full bg-[#F5D76E] hover:bg-[#eed063] text-[#25352B] text-xs font-bold shadow-sm transition flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Self-Service Print</span>
              </Link>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden text-[#25352B] p-1.5 rounded-xl border border-[#DDF1DF] bg-[#F5F9F5] focus:outline-none"
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
            <div className="lg:hidden mt-3 bg-white border border-[#DDF1DF] rounded-3xl p-5 shadow-lg space-y-3 text-xs font-semibold text-[#25352B]/80">
              <a href="#hero" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-[#477D55]">Home</a>
              <Link href="/print" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-[#477D55] font-bold flex items-center gap-1.5">
                <Printer className="w-3.5 h-3.5 text-[#477D55]" /> SIRAQ Smart Print (Self-Service)
              </Link>
              <a href="#csc-services" onClick={() => setMobileMenuOpen(false)} className="block py-1">
                🪪 CSC Citizen Services (Aadhaar / PAN / Voter)
              </a>
              <a href="#scholarships-schemes" onClick={() => setMobileMenuOpen(false)} className="block py-1">
                🎓 Scholarships (SSP & NSP + Other Assistance)
              </a>
              <a href="#frames-hampers" onClick={() => setMobileMenuOpen(false)} className="block py-1">
                🎁 Customized Frames & Gift Hampers
              </a>
              <a href="#services" onClick={() => setMobileMenuOpen(false)} className="block py-1">ID Cards & Posters</a>
              <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="block py-1">FAQ</a>
              <a href="#order" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-[#477D55] font-bold">
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
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_30px_rgba(37,211,102,0.35)] transition duration-300 hover:scale-110"
        aria-label="Contact us on WhatsApp"
      >
        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
      </a>

      <main className="relative">
        {/* HERO SECTION (Apple-Inspired Sage Green Minimalism) */}
        <section id="hero" className="container mx-auto px-6 pt-20 pb-20 text-center">
          <div className="max-w-4xl mx-auto">
            {/* Elegant Minimal Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#DDF1DF] bg-[#F5F9F5] mb-8 shadow-sm">
              <div className="w-5 h-5 rounded-full bg-[#DDF1DF] flex items-center justify-center p-1">
                <Image src="/images/siraq-logo.png" alt="SIRAQ" width={14} height={14} />
              </div>
              <span className="text-xs font-bold text-[#25352B]">
                SIRAQ Studio & Citizen Desk
              </span>
              <span className="text-[10px] text-[#477D55] font-bold bg-[#DDF1DF] px-2 py-0.5 rounded-full">
                Est. 2026
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#25352B] leading-[1.1]">
              Premium Custom Designs.
              <span className="block text-[#477D55] mt-2">
                Complete Citizen Services.
              </span>
            </h1>

            <p className="mt-6 text-base sm:text-lg text-[#25352B]/75 max-w-2xl mx-auto leading-relaxed">
              From verified PVC ID cards, customized photo frames, and luxury hampers to official Aadhaar updates, PAN cards, and QR self-service printing.
            </p>

            {/* Apple Minimalist CTAs */}
            <div className="mt-10 flex flex-wrap gap-3.5 justify-center items-center">
              <Link
                href="/print"
                className="px-8 py-3.5 rounded-full bg-[#F5D76E] hover:bg-[#eed063] text-[#25352B] text-xs sm:text-sm font-bold shadow-sm transition flex items-center gap-2 scale-105"
              >
                <Printer className="w-4 h-4" />
                <span>SIRAQ Smart Print (Self-Service)</span>
              </Link>
              <a
                href="#csc-services"
                className="px-7 py-3.5 rounded-full border border-[#DDF1DF] bg-[#F5F9F5] hover:bg-[#DDF1DF] text-[#25352B] text-xs sm:text-sm font-bold transition flex items-center gap-2 shadow-sm"
              >
                <Shield className="w-4 h-4 text-[#477D55]" />
                <span>CSC Citizen Services</span>
              </a>
              <a
                href="#frames-hampers"
                className="px-7 py-3.5 rounded-full border border-[#DDF1DF] bg-[#F5F9F5] hover:bg-[#DDF1DF] text-[#25352B] text-xs sm:text-sm font-bold transition flex items-center gap-2 shadow-sm"
              >
                <Gift className="w-4 h-4 text-[#477D55]" />
                <span>Frames & Hampers</span>
              </a>
            </div>

            {/* Proof Pills */}
            <div className="mt-12 flex flex-wrap justify-center items-center gap-5 text-xs font-semibold text-[#25352B]/65">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#477D55]" /> 1200+ Orders Delivered
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#477D55]" /> Authorized CSC Facilitation
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#477D55]" /> Canon PIXMA G3010 Shop Hub
              </span>
            </div>
          </div>
        </section>

        {/* SECTION: SIRAQ SMART PRINT SHOWCASE */}
        <section className="container mx-auto px-6 py-16">
          <div className="max-w-5xl mx-auto rounded-3xl border border-[#DDF1DF] bg-[#F5F9F5] p-8 sm:p-12 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DDF1DF] text-[#477D55] text-xs font-bold uppercase tracking-wider mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-[#477D55]" /> QR Self-Service Printing
                </span>
                <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#25352B]">
                  SIRAQ SMART PRINT
                </h2>
                <p className="text-xs font-bold text-[#477D55] tracking-widest mt-1 mb-4 uppercase">
                  SCAN • UPLOAD • PAY • PRINT
                </p>
                <p className="text-xs sm:text-sm text-[#25352B]/80 leading-relaxed mb-6">
                  Print your documents directly from your phone in under 60 seconds without installing any application. Simply scan the counter QR, choose Black & White (₹5/page) or Full Colour (₹10/page), complete UPI payment, and collect your fresh prints from our Canon PIXMA G3010.
                </p>

                <div className="space-y-2 mb-6 text-xs text-[#25352B]/85">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#477D55]" />
                    <span>Supports PDF, JPG, JPEG, and PNG files up to 25MB</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#477D55]" />
                    <span>Instant verified UPI / Razorpay payment gateway</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#477D55]" />
                    <span>A4 & A5, Single-sided or Duplex printing</span>
                  </div>
                </div>

                <Link
                  href="/print"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#F5D76E] hover:bg-[#eed063] text-[#25352B] text-xs sm:text-sm font-bold shadow-sm transition"
                >
                  <span>Open Self-Service Print Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Graphic Mockup Card */}
              <div className="bg-white border border-[#DDF1DF] rounded-3xl p-6 sm:p-8 text-center shadow-[0_4px_24px_rgba(71,125,85,0.06)]">
                <div className="w-16 h-16 rounded-2xl bg-[#DDF1DF] border border-[#A8CFAE] flex items-center justify-center mx-auto mb-4 text-[#477D55]">
                  <Printer className="w-8 h-8 text-[#477D55]" />
                </div>
                <h3 className="text-lg font-bold text-[#25352B]">Canon PIXMA G3010 Ready</h3>
                <p className="text-xs text-[#25352B]/75 mt-1 mb-5">
                  High-yield ink tank printer tuned for crisp text and vibrant color photo output.
                </p>

                <div className="grid grid-cols-2 gap-3 text-left">
                  <div className="p-3.5 rounded-2xl bg-[#F5F9F5] border border-[#DDF1DF]">
                    <span className="text-[10px] uppercase font-bold text-[#477D55] block">Black & White</span>
                    <span className="text-xl font-bold font-display text-[#25352B]">₹5.00</span>
                    <span className="text-[10px] text-[#25352B]/65 block mt-0.5">per A4 page</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-[#F5F9F5] border border-[#DDF1DF]">
                    <span className="text-[10px] uppercase font-bold text-[#477D55] block">Full Colour</span>
                    <span className="text-xl font-bold font-display text-[#25352B]">₹10.00</span>
                    <span className="text-[10px] text-[#25352B]/65 block mt-0.5">per A4 page</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: CORE SERVICES (PVC ID CARDS & POSTERS) */}
        <section id="services" className="container mx-auto px-6 py-20 border-t border-[#DDF1DF]">
          <div className="mb-14 text-center max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DDF1DF] text-[#477D55] text-xs font-bold uppercase tracking-wider mb-3">
              Crafted With Care
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#25352B]">
              PVC ID Cards & Creative Designs
            </h2>
            <p className="mt-4 text-[#477D55]/85 text-sm sm:text-base leading-relaxed">
              Transparent pricing, institutional bulk discounts, and scannable QR verification standards.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto mb-16">
            {/* Normal ID Card */}
            <div className="bg-[#F5F9F5] border border-[#DDF1DF] rounded-3xl p-8 shadow-[0_4px_20px_rgba(71,125,85,0.03)] hover:shadow-md transition">
              <div className="mb-4 text-4xl">🪪</div>
              <h3 className="text-xl font-bold font-display text-[#25352B] mb-2">Standard PVC ID Card</h3>
              <p className="text-xs text-[#25352B]/75 mb-6">
                Professional employee IDs, student cards, and institutional access badges with crisp durable finish.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center border-b border-[#DDF1DF] pb-2 text-xs">
                  <span className="text-[#25352B]/75">100+ cards</span>
                  <span className="text-base font-bold text-[#25352B]">₹70<span className="text-[10px] text-[#25352B]/60">/card</span></span>
                </div>
                <div className="flex justify-between items-center border-b border-[#DDF1DF] pb-2 text-xs">
                  <span className="text-[#25352B]/75">500+ cards</span>
                  <span className="text-base font-bold text-[#25352B]">₹65<span className="text-[10px] text-[#25352B]/60">/card</span></span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#25352B]/75">1000+ cards</span>
                  <span className="text-base font-bold text-[#25352B]">₹60<span className="text-[10px] text-[#25352B]/60">/card</span></span>
                </div>
              </div>
              <a
                href="#order"
                className="block w-full text-center rounded-full bg-white hover:bg-[#DDF1DF] border border-[#A8CFAE] py-2.5 text-xs font-bold text-[#25352B] transition"
              >
                Inquire on WhatsApp
              </a>
            </div>

            {/* Premium QR ID Card */}
            <div className="bg-white border-2 border-[#A8CFAE] rounded-3xl p-8 shadow-[0_4px_20px_rgba(71,125,85,0.08)] relative">
              <span className="absolute top-4 right-4 bg-[#F5D76E] text-[#25352B] text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm border border-[#eed063]">
                QR Verified
              </span>
              <div className="mb-4 text-4xl">⭐</div>
              <h3 className="text-xl font-bold font-display text-[#25352B] mb-2">Premium Security ID Card</h3>
              <p className="text-xs text-[#25352B]/75 mb-6">
                High-definition cards with scannable QR verification, security overlays, and waterproof coating.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center border-b border-[#DDF1DF] pb-2 text-xs">
                  <span className="text-[#25352B]/75">100+ cards</span>
                  <span className="text-base font-bold text-[#477D55]">₹120<span className="text-[10px] text-[#25352B]/60">/card</span></span>
                </div>
                <div className="flex justify-between items-center border-b border-[#DDF1DF] pb-2 text-xs">
                  <span className="text-[#25352B]/75">500+ cards</span>
                  <span className="text-base font-bold text-[#477D55]">₹110<span className="text-[10px] text-[#25352B]/60">/card</span></span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#25352B]/75">1000+ cards</span>
                  <span className="text-base font-bold text-[#477D55]">₹100<span className="text-[10px] text-[#25352B]/60">/card</span></span>
                </div>
              </div>
              <a
                href="#order"
                className="block w-full text-center rounded-full bg-[#F5D76E] hover:bg-[#eed063] py-2.5 text-xs font-bold text-[#25352B] shadow-sm transition"
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

        {/* SECTION: FAQ (Interactive Smooth Accordion) */}
        <section id="faq" className="container mx-auto px-6 py-20 border-t border-[#DDF1DF]">
          <div className="mb-14 text-center max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DDF1DF] text-[#477D55] border border-[#A8CFAE] text-xs font-bold uppercase tracking-wider mb-3">
              Help Center
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#25352B]">
              Frequently Asked Questions
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#25352B]/75">
              Click any question to view clear answers and guidelines.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-3.5">
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-[#DDF1DF] bg-[#F5F9F5] overflow-hidden transition-all duration-200 hover:border-[#A8CFAE]"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <span className="font-bold text-sm sm:text-base text-[#25352B]">
                      {item.q}
                    </span>
                    <span
                      className={`w-7 h-7 rounded-full bg-white border border-[#DDF1DF] flex items-center justify-center shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-180 bg-[#DDF1DF]' : ''
                      }`}
                    >
                      <ChevronDown className="w-4 h-4 text-[#477D55]" />
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                      >
                        <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-[#25352B]/85 leading-relaxed border-t border-[#DDF1DF]/60">
                          {item.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION: ORDER INQUIRY */}
        <section className="container mx-auto px-6 py-20 border-t border-[#DDF1DF]" id="order">
          <div className="max-w-2xl mx-auto bg-[#F5F9F5] border border-[#DDF1DF] rounded-3xl p-8 sm:p-10 shadow-sm text-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DDF1DF] text-[#477D55] border border-[#A8CFAE] text-xs font-bold uppercase tracking-wider mb-3">
              Direct Contact
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#25352B]">
              Have a Custom Request?
            </h3>
            <p className="text-xs sm:text-sm text-[#25352B]/75 mt-2 mb-8">
              Speak directly with our shop counter team on WhatsApp for bespoke frames, bulk student ID runs, and CSC appointments.
            </p>

            <a
              href="https://wa.me/918217469646?text=Hi%20SIRAQ,%20I%20have%20a%20custom%20service%20inquiry."
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#F5D76E] hover:bg-[#eed063] text-[#25352B] font-bold text-sm shadow-sm transition"
            >
              <span>Chat with SIRAQ on WhatsApp</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </section>

        {/* FOOTER (Clean Apple Aesthetic, NO Public Admin Link) */}
        <footer id="contact" className="border-t border-[#DDF1DF] bg-[#F5F9F5] py-12">
          <div className="container mx-auto px-6 max-w-5xl">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-8 border-b border-[#DDF1DF]">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#DDF1DF] border border-[#A8CFAE] flex items-center justify-center p-1 shadow-sm">
                  <Image src="/images/siraq-logo.png" alt="SIRAQ Logo" width={20} height={20} />
                </div>
                <span className="font-display font-bold text-lg text-[#25352B]">SIRAQ Studio</span>
              </div>

              <div className="flex items-center gap-6 text-xs text-[#25352B]/75 font-semibold">
                <a href="mailto:siraqstudio@gmail.com" className="hover:text-[#477D55] transition">siraqstudio@gmail.com</a>
                <a href="tel:+918217469646" className="hover:text-[#477D55] transition">+91 82174 69646</a>
                <a href="https://www.instagram.com/siraq.studio" target="_blank" rel="noreferrer" className="hover:text-[#477D55] transition">Instagram</a>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#25352B]/60">
              <p>© 2026 SIRAQ Studio & Citizen Desk. All rights reserved.</p>
              <div className="flex items-center gap-3">
                <span>Apple-Inspired Minimalism</span>
                <span>•</span>
                <span>Sage Green #A8CFAE</span>
                <span>•</span>
                <span>Pure White #FFFFFF</span>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
