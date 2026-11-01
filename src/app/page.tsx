'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Sparkles, Play, Shield, GraduationCap, Gift, Frame } from 'lucide-react';
import LogoIntroOverlay from './components/LogoIntroOverlay';
import CscServicesSection from './components/CscServicesSection';
import RealtimeSchemesSection from './components/RealtimeSchemesSection';
import FramesAndHampersSection from './components/FramesAndHampersSection';

export default function HomePage() {
  const [showLogoIntro, setShowLogoIntro] = useState<boolean>(false);

  useEffect(() => {
    // Show cinematic logo intro once per session, or allow manual replay
    const hasSeenIntro = sessionStorage.getItem('siraq_seen_logo_intro');
    if (!hasSeenIntro) {
      setShowLogoIntro(true);
      sessionStorage.setItem('siraq_seen_logo_intro', 'true');
    }

    // Load external scripts for Lenis, GSAP, and main.js
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
      await loadScript('https://cdn.jsdelivr.net/gh/studio-freight/lenis@1.0.29/bundled/lenis.min.js');
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js');
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js');
      await loadScript('/js/main.js');
    };

    initScripts();
  }, []);

  return (
    <>
      {/* Cinematic Logo Video Intro Overlay */}
      <LogoIntroOverlay
        isOpen={showLogoIntro}
        onClose={() => setShowLogoIntro(false)}
      />

      {/* Navigation Bar */}
      <nav id="main-nav" className="fixed top-0 left-0 right-0 z-[100] transition-all duration-300">
        <div className="container mx-auto px-6 py-4">
          <div className="glass rounded-full px-5 py-2.5 flex items-center justify-between">
            <a href="#hero" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-full p-1 bg-white/10 border border-white/15 flex items-center justify-center overflow-hidden transition group-hover:scale-105">
                <Image
                  src="/images/siraq-logo.png"
                  alt="SIRAQ Logo"
                  width={28}
                  height={28}
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-display font-bold text-white group-hover:text-accent transition">
                SIRAQ
              </span>
            </a>

            <div className="hidden lg:flex items-center gap-5 text-sm font-medium text-slateSoft">
              <a href="#hero" className="nav-link hover:text-white transition">Home</a>
              <a href="#services" className="nav-link hover:text-white transition">Services</a>
              <a href="#csc-services" className="nav-link hover:text-white transition flex items-center gap-1 text-emerald-400">
                <Shield className="w-3.5 h-3.5" /> CSC Center
              </a>
              <a href="#scholarships-schemes" className="nav-link hover:text-white transition flex items-center gap-1 text-amber-400">
                <GraduationCap className="w-3.5 h-3.5" /> Scholarships & Aid
              </a>
              <a href="#frames-hampers" className="nav-link hover:text-white transition flex items-center gap-1 text-neon">
                <Gift className="w-3.5 h-3.5" /> Frames & Hampers
              </a>
              <a href="#showcase" className="nav-link hover:text-white transition">Showcase</a>
              <a href="#faq" className="nav-link hover:text-white transition">FAQ</a>
              <a href="#contact" className="nav-link hover:text-white transition">Contact</a>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowLogoIntro(true)}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white text-xs font-semibold transition"
                title="Play Logo Intro Animation"
              >
                <Play className="w-3 h-3 text-accent fill-accent" /> Logo Video
              </button>
              <a
                href="#order"
                className="px-4 py-1.5 rounded-full bg-gradient-to-r from-accent to-neon text-charcoal text-xs font-bold shadow-glow hover:brightness-110 transition"
              >
                Get Started
              </a>
              <button id="mobile-menu-btn" className="lg:hidden text-white p-1 focus:outline-none" aria-label="Toggle menu">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Drawer Menu */}
          <div id="mobile-menu" className="hidden lg:hidden mt-4 glass rounded-3xl p-6">
            <div className="flex flex-col gap-4 text-sm font-medium text-slateSoft">
              <a href="#hero" className="mobile-nav-link hover:text-white transition">Home</a>
              <a href="#services" className="mobile-nav-link hover:text-white transition">ID Cards & Posters</a>
              <a href="#csc-services" className="mobile-nav-link text-emerald-400 font-semibold hover:text-emerald-300 transition">
                🪪 CSC Citizen Services (Aadhaar / Passport / PAN)
              </a>
              <a href="#scholarships-schemes" className="mobile-nav-link text-amber-400 font-semibold hover:text-amber-300 transition">
                🎓 Realtime Scholarships & Govt Schemes
              </a>
              <a href="#frames-hampers" className="mobile-nav-link text-neon font-semibold hover:text-cyan-300 transition">
                🎁 Customized Frames & Gift Hampers
              </a>
              <a href="#showcase" className="mobile-nav-link hover:text-white transition">Our Works</a>
              <a href="#faq" className="mobile-nav-link hover:text-white transition">FAQ</a>
              <a href="#order" className="mobile-nav-link text-accent font-bold hover:text-white transition">Place Order on WhatsApp</a>
              <button onClick={() => setShowLogoIntro(true)} className="mobile-nav-link text-left text-xs text-slate-400 hover:text-white transition flex items-center gap-1.5 pt-2 border-t border-white/10">
                <Play className="w-3 h-3 text-accent fill-accent" /> Replay SIRAQ Logo Video
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Film Grain */}
      <div className="film-grain"></div>

      {/* Floating WhatsApp Button */}
      <a
        href="#"
        id="whatsapp-fab"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-[0_10px_40px_rgba(37,211,102,0.5)]"
        aria-label="Contact us on WhatsApp"
      >
        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
      </a>

      {/* Ambient Radial Auroras */}
      <div className="pointer-events-none fixed inset-0 z-[1]">
        <div className="absolute top-[-10%] left-[10%] h-72 w-72 rounded-full bg-accent/20 blur-3xl"></div>
        <div className="absolute top-[40%] right-[5%] h-80 w-80 rounded-full bg-emerald-500/15 blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[15%] h-72 w-72 rounded-full bg-neon/20 blur-3xl"></div>
      </div>

      <main className="relative z-10">
        {/* HERO SECTION WITH ANIMATED LOGO SHOWCASE */}
        <section id="hero" className="container mx-auto flex min-h-screen items-center justify-center px-6 pt-28 pb-20">
          <div className="w-full max-w-5xl mx-auto text-center">
            {/* Interactive Animated Logo Badge */}
            <div
              onClick={() => setShowLogoIntro(true)}
              className="mx-auto mb-8 inline-flex items-center gap-3.5 p-2.5 pr-6 rounded-full bg-gradient-to-r from-white/[0.08] to-white/[0.02] border border-white/15 backdrop-blur-2xl shadow-glass animate-float-gentle group cursor-pointer hover:border-amber-400/40 transition"
              title="Click to replay the Logo Intro Video"
            >
              <div className="w-11 h-11 rounded-full p-1 bg-white/10 border border-white/20 flex items-center justify-center logo-shine shrink-0">
                <Image
                  src="/images/siraq-logo.png"
                  alt="SIRAQ Logo"
                  width={38}
                  height={38}
                  className="object-contain"
                  priority
                />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-accent">
                  <span>SIRAQ Studio & Citizen Desk</span>
                  <Sparkles className="w-3 h-3 text-neon animate-star-twinkle" />
                </div>
                <p className="text-xs text-slate-300 font-medium">Design • CSC Services • Scholarships • Hampers</p>
              </div>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20 group-hover:bg-amber-400 group-hover:text-black transition">
                <Play className="w-2.5 h-2.5 fill-current" /> Play Intro
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-display text-4xl leading-tight sm:text-6xl lg:text-7xl xl:text-8xl font-bold">
              <span className="block bg-gradient-to-r from-white via-white to-slateSoft bg-clip-text text-transparent">
                Premium Custom Designs.
              </span>
              <span className="block mt-2 bg-gradient-to-r from-accent via-neon to-accent bg-clip-text text-transparent animate-gradient">
                Complete Citizen Services.
              </span>
            </h1>

            <p className="mt-8 max-w-3xl mx-auto text-base sm:text-lg text-slateSoft leading-relaxed">
              From verified PVC ID cards, customized photo frames, and bespoke gift hampers to official Aadhaar updates, passport assistance, and real-time government scholarships.
            </p>

            {/* Apple Style CTAs */}
            <div className="mt-10 flex flex-wrap gap-3.5 justify-center items-center">
              <a
                href="#services"
                className="inline-block rounded-full bg-gradient-to-r from-accent to-neon px-8 py-4 text-xs sm:text-sm font-semibold uppercase tracking-wider text-charcoal shadow-glow transition hover:-translate-y-1 hover:shadow-[0_25px_50px_rgba(249,178,52,0.4)] hover:scale-105"
              >
                ID Cards & Printing
              </a>
              <a
                href="#csc-services"
                className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 px-7 py-4 text-xs sm:text-sm font-bold uppercase tracking-wider transition hover:-translate-y-1 hover:scale-105"
              >
                <Shield className="w-4 h-4 text-emerald-400" /> CSC Citizen Desk
              </a>
              <a
                href="#scholarships-schemes"
                className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 px-7 py-4 text-xs sm:text-sm font-bold uppercase tracking-wider transition hover:-translate-y-1 hover:scale-105"
              >
                <GraduationCap className="w-4 h-4 text-amber-400" /> Scholarships Hub
              </a>
              <a
                href="#frames-hampers"
                className="inline-flex items-center gap-2 rounded-full border border-neon/40 bg-neon/10 hover:bg-neon/20 text-cyan-300 px-7 py-4 text-xs sm:text-sm font-bold uppercase tracking-wider transition hover:-translate-y-1 hover:scale-105"
              >
                <Gift className="w-4 h-4 text-neon" /> Frames & Hampers
              </a>
            </div>

            <div className="mt-10 flex flex-wrap justify-center items-center gap-4 text-xs text-slateSoft/90">
              <span className="flex items-center gap-2">
                <span className="text-accent">✓</span> 1200+ Orders Delivered
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="flex items-center gap-2">
                <span className="text-neon">✓</span> Authorized CSC Facilitation
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="flex items-center gap-2">
                <span className="text-accent">✓</span> Realtime Schemes Tracking
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span> High-Quality Bespoke Gifting
              </span>
            </div>
          </div>
        </section>

        {/* SECTION 1: CORE SERVICES (ID CARDS & POSTER PLANS) */}
        <section id="services" className="container mx-auto px-6 py-20">
          <div className="mb-12 text-center">
            <p className="text-xs uppercase tracking-[0.4em] text-slateSoft">Crafted With Care</p>
            <h2 className="font-display mt-2 text-3xl lg:text-4xl text-white font-bold">ID Cards & Creative Designs</h2>
            <p className="mt-4 text-slateSoft">Transparent pricing, premium quality standard across all quantities</p>
          </div>

          <div className="mb-16">
            <h3 className="text-2xl font-display font-semibold text-center mb-8 text-white">PVC ID Card Printing</h3>
            <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
              <div className="glass rounded-3xl p-8 shadow-glass hover:shadow-glow-accent transition">
                <div className="mb-4 text-4xl">🪪</div>
                <h4 className="text-xl font-semibold mb-4 text-white">Normal ID Card</h4>
                <p className="text-sm text-slateSoft mb-4">Professional employee IDs, student cards, and institutional access badges with crisp durable finish.</p>
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center border-b border-white/10 pb-2">
                    <span className="text-sm text-slateSoft">100+ cards</span>
                    <span className="text-lg font-bold text-accent">₹70<span className="text-xs font-normal">/card</span></span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/10 pb-2">
                    <span className="text-sm text-slateSoft">500+ cards</span>
                    <span className="text-lg font-bold text-accent">₹65<span className="text-xs font-normal">/card</span></span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slateSoft">1000+ cards</span>
                    <span className="text-lg font-bold text-accent">₹60<span className="text-xs font-normal">/card</span></span>
                  </div>
                </div>
              </div>

              <div className="glass rounded-3xl p-8 shadow-glass hover:shadow-glow-accent transition border-2 border-accent/20">
                <div className="mb-4 text-4xl">⭐</div>
                <h4 className="text-xl font-semibold mb-4 text-white">Premium ID Card</h4>
                <p className="text-sm text-slateSoft mb-4">High-definition cards with scannable QR verification, holographic security overlays, and waterproof coating.</p>
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center border-b border-white/10 pb-2">
                    <span className="text-sm text-slateSoft">100+ cards</span>
                    <span className="text-lg font-bold text-neon">₹120<span className="text-xs font-normal">/card</span></span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/10 pb-2">
                    <span className="text-sm text-slateSoft">500+ cards</span>
                    <span className="text-lg font-bold text-neon">₹110<span className="text-xs font-normal">/card</span></span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slateSoft">1000+ cards</span>
                    <span className="text-lg font-bold text-neon">₹100<span className="text-xs font-normal">/card</span></span>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-xs text-center text-slateSoft/80 mt-6">💡 Institutional bulk discounts available. Contact us directly on WhatsApp for customized school and college ID card runs.</p>
          </div>

          <div className="mb-8">
            <h3 className="text-2xl font-display font-semibold text-center mb-4 text-white">Poster Design – Monthly Plans</h3>
            <p className="text-center text-sm text-slateSoft mb-8">All plans provide the SAME premium quality</p>

            <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
              <div className="glass rounded-3xl p-8 shadow-glass hover:shadow-glow transition relative">
                <div className="absolute top-4 right-4">
                  <span className="bg-gradient-to-r from-accent to-neon text-charcoal text-xs font-bold px-3 py-1 rounded-full">Best Value</span>
                </div>
                <div className="mb-4 text-4xl">🎨</div>
                <h4 className="text-xl font-semibold mb-2 text-white">Starter Plan</h4>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-accent">₹499</span>
                  <span className="text-sm text-slateSoft"> /month</span>
                </div>
                <p className="text-lg font-semibold mb-4 text-white">Up to 25 posters</p>
                <p className="text-sm text-slateSoft mb-6">Perfect for small businesses and startups needing regular marketing materials.</p>
                <a href="#order" className="block w-full text-center rounded-full bg-accent px-6 py-3 text-sm font-semibold uppercase tracking-wider text-charcoal transition hover:bg-accent/90">
                  Get Started
                </a>
              </div>

              <div className="glass rounded-3xl p-8 shadow-glass hover:shadow-glow transition relative border-2 border-accent/30">
                <div className="absolute top-4 right-4">
                  <span className="bg-neon text-charcoal text-xs font-bold px-3 py-1 rounded-full">Most Chosen</span>
                </div>
                <div className="mb-4 text-4xl">🚀</div>
                <h4 className="text-xl font-semibold mb-2 text-white">Growth Plan</h4>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-neon">₹699</span>
                  <span className="text-sm text-slateSoft"> /month</span>
                </div>
                <p className="text-lg font-semibold mb-4 text-white">Up to 40 posters</p>
                <p className="text-sm text-slateSoft mb-6">Ideal for growing businesses with consistent design needs and marketing campaigns.</p>
                <a href="#order" className="block w-full text-center rounded-full bg-neon px-6 py-3 text-sm font-semibold uppercase tracking-wider text-charcoal transition hover:bg-neon/90">
                  Get Started
                </a>
              </div>

              <div className="glass rounded-3xl p-8 shadow-glass hover:shadow-glow transition relative">
                <div className="absolute top-4 right-4">
                  <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">Business</span>
                </div>
                <div className="mb-4 text-4xl">💼</div>
                <h4 className="text-xl font-semibold mb-2 text-white">Business Plan</h4>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-accent">₹1,199</span>
                  <span className="text-sm text-slateSoft"> /month</span>
                </div>
                <p className="text-lg font-semibold mb-4 text-white">Up to 100 posters</p>
                <p className="text-sm text-slateSoft mb-6">For established businesses and agencies requiring high-volume professional designs.</p>
                <a href="#order" className="block w-full text-center rounded-full bg-accent px-6 py-3 text-sm font-semibold uppercase tracking-wider text-charcoal transition hover:bg-accent/90">
                  Get Started
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: CSC & DIGITAL CITIZEN SERVICES */}
        <CscServicesSection />

        {/* SECTION 3: REAL-TIME SCHOLARSHIPS & GOVT SCHEMES */}
        <RealtimeSchemesSection />

        {/* SECTION 4: CUSTOMIZED FRAMES & BESPOKE GIFT HAMPERS */}
        <FramesAndHampersSection />

        {/* SECTION 5: SHOWCASE / PORTFOLIO */}
        <section id="showcase" className="container mx-auto px-6 py-20">
          <div className="mb-12 text-center">
            <p className="text-xs uppercase tracking-[0.4em] text-slateSoft">Portfolio</p>
            <h2 className="font-display mt-2 text-3xl lg:text-4xl text-white font-bold">Our Works</h2>
            <p className="mt-4 text-slateSoft">Real projects delivered with excellence</p>
          </div>

          <div className="mb-8 flex flex-wrap justify-center gap-3" id="category-filters">
            <button className="category-filter active rounded-full border border-white/20 bg-white/10 px-6 py-2 text-sm font-medium uppercase tracking-wider text-white transition hover:border-accent/50 hover:bg-accent/10" data-category="all">
              All Works
            </button>
            <button className="category-filter rounded-full border border-white/20 bg-transparent px-6 py-2 text-sm font-medium uppercase tracking-wider text-slateSoft transition hover:border-accent/50 hover:bg-accent/10 hover:text-white" data-category="id-cards">
              ID Cards
            </button>
            <button className="category-filter rounded-full border border-white/20 bg-transparent px-6 py-2 text-sm font-medium uppercase tracking-wider text-slateSoft transition hover:border-accent/50 hover:bg-accent/10 hover:text-white" data-category="wedding-cards">
              Wedding Cards
            </button>
            <button className="category-filter rounded-full border border-white/20 bg-transparent px-6 py-2 text-sm font-medium uppercase tracking-wider text-slateSoft transition hover:border-accent/50 hover:bg-accent/10 hover:text-white" data-category="posters">
              Posters
            </button>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" id="showcase-grid"></div>
        </section>

        {/* SECTION 6: HOW IT WORKS */}
        <section id="how-it-works" className="container mx-auto px-6 py-20">
          <div className="mb-16 text-center">
            <p className="text-xs uppercase tracking-[0.4em] text-slateSoft">Process</p>
            <h2 className="font-display mt-2 text-3xl lg:text-4xl text-white font-bold">How It Works</h2>
            <p className="mt-4 text-slateSoft">Simple, fast, and professional</p>
          </div>

          <div className="relative grid gap-8 md:grid-cols-3">
            <div className="absolute top-16 left-0 right-0 hidden h-0.5 bg-gradient-to-r from-accent via-neon to-accent opacity-20 md:block" style={{ width: 'calc(100% - 8rem)', left: '4rem' }}></div>

            <div className="glass relative rounded-3xl p-8 text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent/50 text-2xl font-bold text-charcoal shadow-glow-accent">
                1
              </div>
              <div className="mb-4 text-4xl">🎯</div>
              <h3 className="mb-3 text-xl font-semibold text-white">Choose Service</h3>
              <p className="text-sm text-slateSoft">Select from ID cards, CSC Aadhaar/Passport desk, government scholarships, customized frames, or hampers</p>
            </div>

            <div className="glass relative rounded-3xl p-8 text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-neon to-neon/50 text-2xl font-bold text-charcoal shadow-glow">
                2
              </div>
              <div className="mb-4 text-4xl">📝</div>
              <h3 className="mb-3 text-xl font-semibold text-white">Submit Details</h3>
              <p className="text-sm text-slateSoft">Fill out the online request form or chat with us directly on WhatsApp with your requirements and reference files</p>
            </div>

            <div className="glass relative rounded-3xl p-8 text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-accent to-neon text-2xl font-bold text-charcoal shadow-glow">
                3
              </div>
              <div className="mb-4 text-4xl">✨</div>
              <h3 className="mb-3 text-xl font-semibold text-white">Approval & Delivery</h3>
              <p className="text-sm text-slateSoft">We verify documents, share proofs for your signoff, submit official portal filings, and deliver physical products securely</p>
            </div>
          </div>
        </section>

        {/* SECTION 7: FAQ */}
        <section id="faq" className="container mx-auto px-6 py-20">
          <div className="mb-16 text-center">
            <p className="text-xs uppercase tracking-[0.4em] text-slateSoft">Questions</p>
            <h2 className="font-display mt-2 text-3xl lg:text-4xl text-white font-bold">Frequently Asked Questions</h2>
            <p className="mt-4 text-slateSoft">Everything you need to know</p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            <div className="glass rounded-2xl overflow-hidden faq-item">
              <button className="faq-question w-full text-left p-6 flex justify-between items-center hover:bg-white/5 transition">
                <span className="font-semibold text-white pr-4">How does SIRAQ help with Government Scholarships & Schemes?</span>
                <svg className="faq-icon w-5 h-5 text-accent transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              <div className="faq-answer hidden px-6 pb-6">
                <p className="text-sm text-slateSoft leading-relaxed">SIRAQ acts as your digital facilitation desk. We check your realtime eligibility (community, income, academic marks), scan and format all mandatory documents to exact portal sizes, and complete the official online application without rejection risks.</p>
              </div>
            </div>

            <div className="glass rounded-2xl overflow-hidden faq-item">
              <button className="faq-question w-full text-left p-6 flex justify-between items-center hover:bg-white/5 transition">
                <span className="font-semibold text-white pr-4">Can I order customized Acrylic Frames and Hampers with personal photos?</span>
                <svg className="faq-icon w-5 h-5 text-accent transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              <div className="faq-answer hidden px-6 pb-6">
                <p className="text-sm text-slateSoft leading-relaxed">Yes! You can send your photos and songs (for Spotify plaques) directly on WhatsApp. We provide a digital preview mockup for your approval before printing on optical-grade acrylic or assembling your bespoke gift hamper chest.</p>
              </div>
            </div>

            <div className="glass rounded-2xl overflow-hidden faq-item">
              <button className="faq-question w-full text-left p-6 flex justify-between items-center hover:bg-white/5 transition">
                <span className="font-semibold text-white pr-4">How fast can I get a new PAN Card or Passport Appointment?</span>
                <svg className="faq-icon w-5 h-5 text-accent transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              <div className="faq-answer hidden px-6 pb-6">
                <p className="text-sm text-slateSoft leading-relaxed">Instant e-PAN is generated within 10–15 minutes with Aadhaar OTP verification. Physical PVC PAN cards arrive at your address within 5–7 business days. Passport appointments are booked instantly at your nearest PSK or Post Office PSK.</p>
              </div>
            </div>

            <div className="glass rounded-2xl overflow-hidden faq-item">
              <button className="faq-question w-full text-left p-6 flex justify-between items-center hover:bg-white/5 transition">
                <span className="font-semibold text-white pr-4">What is the cost of a single poster design?</span>
                <svg className="faq-icon w-5 h-5 text-accent transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              <div className="faq-answer hidden px-6 pb-6">
                <p className="text-sm text-slateSoft leading-relaxed">Single poster designs usually start from ₹30 depending on design complexity and delivery time. For regular marketing requirements, our monthly plans offer exceptional value with priority turnaround.</p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 8: ORDER / INQUIRY ON WHATSAPP */}
        <section className="container mx-auto px-6 pb-20" id="order">
          <div className="glass rounded-[32px] p-8 shadow-glass lg:p-12">
            <div className="mb-8 text-center">
              <p className="text-xs uppercase tracking-[0.4em] text-slateSoft">Get Started</p>
              <h2 className="font-display mt-2 text-3xl lg:text-4xl text-white font-bold">Place Your Order or Inquire</h2>
              <p className="mt-4 text-slateSoft">Select any service and continue smoothly on WhatsApp</p>
            </div>

            <form className="mx-auto max-w-2xl" id="order-form">
              <div className="space-y-5">
                <label className="block text-sm">
                  <span className="mb-2 inline-block font-medium text-white">Service Type <span className="text-accent">*</span></span>
                  <select name="service" id="service-select" required className="glass w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-accent/50 text-white bg-space">
                    <option value="">Select a service category...</option>
                    <option value="id-cards">🪪 PVC ID Cards (Normal & Premium)</option>
                    <option value="csc-services">🛂 CSC Citizen Desk (Aadhaar / Passport / PAN / DL)</option>
                    <option value="govt-scholarships">🎓 Scholarships & Govt Schemes Application</option>
                    <option value="photo-frames">🖼️ Customized Photo Frames (Acrylic, LED, Spotify)</option>
                    <option value="gift-hampers">🎁 Bespoke Gift Hampers (Executive, Wedding, Surprise)</option>
                    <option value="wedding-cards">💌 Wedding & Event Invitations</option>
                    <option value="posters">🎨 Poster Design & Branding Monthly Plans</option>
                  </select>
                </label>

                <label className="block text-sm">
                  <span className="mb-2 inline-block font-medium text-white">Your Name <span className="text-accent">*</span></span>
                  <input type="text" name="name" placeholder="John Doe" required className="glass w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-accent/50 text-white" />
                </label>

                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="block text-sm">
                    <span className="mb-2 inline-block font-medium text-white">Email Address <span className="text-accent">*</span></span>
                    <input type="email" name="email" placeholder="john@example.com" required className="glass w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-accent/50 text-white" />
                  </label>

                  <label className="block text-sm">
                    <span className="mb-2 inline-block font-medium text-white">Phone Number <span className="text-accent">*</span></span>
                    <input type="tel" name="phone" placeholder="+91 98765 43210" required className="glass w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-accent/50 text-white" />
                  </label>
                </div>

                <label className="block text-sm">
                  <span className="mb-2 inline-block font-medium text-white">Project / Service Details <span className="text-accent">*</span></span>
                  <textarea name="message" rows={4} placeholder="Describe your requirement (e.g. 200 ID cards, Fresh Passport booking, Post-Matric scholarship, Floating acrylic frame size 12x18, or Executive hamper)..." required className="glass w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-accent/50 text-white"></textarea>
                </label>

                <p className="text-xs text-slateSoft/80 text-center">📱 You will be redirected to WhatsApp with your details pre-filled</p>

                <button type="submit" className="mt-4 w-full rounded-full bg-gradient-to-r from-accent to-neon px-6 py-4 text-sm font-semibold uppercase tracking-wider text-charcoal shadow-glow transition hover:-translate-y-1 hover:brightness-105">
                  Continue on WhatsApp
                </button>
              </div>
            </form>

            <div id="success-message" className="mx-auto mt-8 hidden max-w-2xl rounded-2xl border border-neon/30 bg-neon/10 p-6 text-center">
              <div className="mb-2 text-4xl">✅</div>
              <h3 className="mb-2 text-xl font-semibold text-neon">Redirecting to WhatsApp...</h3>
              <p className="text-sm text-slateSoft">Please continue your order on WhatsApp. We&apos;ll respond promptly.</p>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer id="contact" className="border-t border-white/10 bg-space/70 py-12">
          <div className="container mx-auto px-6">
            <div className="mb-8 text-center max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 mb-3">
                <Image src="/images/siraq-logo.png" alt="SIRAQ Logo" width={32} height={32} className="object-contain" />
                <span className="text-xl font-bold font-display text-white">SIRAQ</span>
              </div>
              <p className="text-xs text-slateSoft">
                Design Studio & Authorized Digital Citizen Services. Serving individuals, institutions, and businesses with Apple-grade excellence.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-6 text-sm text-slateSoft border-t border-white/10 pt-8">
              <div>
                <p className="text-base font-semibold text-white">SIRAQ Studio</p>
                <p className="text-xs">Creative Print & CSC Facilitation • Est. 2026</p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:gap-6 text-xs">
                <a href="mailto:siraqstudio@gmail.com" className="transition hover:text-white">siraqstudio@gmail.com</a>
                <a href="tel:+918217469646" className="transition hover:text-white">+91 82174 69646</a>
              </div>
              <div className="flex gap-4 text-white text-xs">
                <a href="https://www.instagram.com/siraq.studio" target="_blank" className="transition hover:text-accent" rel="noreferrer">Instagram</a>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-4 text-xs text-slateSoft">
              <button onClick={() => (window as any).openModal?.('about')} className="transition hover:text-white cursor-pointer">About Us</button>
              <span>•</span>
              <button onClick={() => (window as any).openModal?.('privacy')} className="transition hover:text-white cursor-pointer">Privacy Policy</button>
              <span>•</span>
              <button onClick={() => (window as any).openModal?.('terms')} className="transition hover:text-white cursor-pointer">Terms & Conditions</button>
              <span>•</span>
              <span>© 2026 SIRAQ Studio. All rights reserved.</span>
            </div>
          </div>
        </footer>
      </main>

      {/* Modals */}
      <div id="about-modal" className="modal-overlay">
        <div className="glass rounded-3xl max-w-2xl w-full p-8 relative mx-4 max-h-[90vh] overflow-y-auto border border-white/20">
          <button onClick={() => (window as any).closeModal?.('about')} className="absolute top-6 right-6 text-slateSoft hover:text-white text-xl">✕</button>
          <div className="mb-6 flex items-center gap-3">
            <Image src="/images/siraq-logo.png" alt="SIRAQ Logo" width={40} height={40} className="object-contain" />
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-slateSoft">Our Story</p>
              <h2 className="font-display text-2xl font-bold text-white">About SIRAQ Studio</h2>
            </div>
          </div>
          <div>
            <p className="text-sm leading-relaxed text-white mb-4">
              SIRAQ Studio is a premier creative print center and certified digital citizen facilitation desk. We specialize in high-definition PVC ID cards, customized optical-grade acrylic frames, artisanal gift hampers, and seamless assistance for Aadhaar, passports, and government scholarships.
            </p>
            <p className="text-xs leading-relaxed text-slateSoft mb-4">
              With over 1200+ successfully completed orders, we combine state-of-the-art print technology with direct government portal connectivity, delivering peace of mind, speed, and uncompromising quality.
            </p>
            <div className="grid gap-4 sm:grid-cols-3 mt-6">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
                <div className="mb-1 text-xl font-semibold text-accent">1200+</div>
                <p className="text-xs text-slateSoft">Orders Completed</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
                <div className="mb-1 text-xl font-semibold text-neon">CSC Verified</div>
                <p className="text-xs text-slateSoft">Citizen Services</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
                <div className="mb-1 text-xl font-semibold text-accent">Realtime</div>
                <p className="text-xs text-slateSoft">Schemes Tracking</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="privacy-modal" className="modal-overlay">
        <div className="glass rounded-3xl max-w-2xl w-full p-8 relative mx-4 max-h-[90vh] overflow-y-auto border border-white/20">
          <button onClick={() => (window as any).closeModal?.('privacy')} className="absolute top-6 right-6 text-slateSoft hover:text-white text-xl">✕</button>
          <div className="mb-6">
            <p className="text-xs uppercase tracking-[0.4em] text-slateSoft">Legal</p>
            <h2 className="font-display mt-2 text-2xl font-bold text-white">Privacy Policy</h2>
          </div>
          <div className="space-y-4 text-xs text-slateSoft leading-relaxed">
            <p>We collect name, contact details, and project specifications provided during service requests. Your documents and information are used exclusively for processing your order or government portal submission. We never sell, share, or compromise your personal data.</p>
          </div>
        </div>
      </div>

      <div id="terms-modal" className="modal-overlay">
        <div className="glass rounded-3xl max-w-2xl w-full p-8 relative mx-4 max-h-[90vh] overflow-y-auto border border-white/20">
          <button onClick={() => (window as any).closeModal?.('terms')} className="absolute top-6 right-6 text-slateSoft hover:text-white text-xl">✕</button>
          <div className="mb-6">
            <p className="text-xs uppercase tracking-[0.4em] text-slateSoft">Legal</p>
            <h2 className="font-display mt-2 text-2xl font-bold text-white">Terms & Conditions</h2>
          </div>
          <div className="space-y-4 text-xs text-slateSoft leading-relaxed">
            <p><strong>Advance confirmation is required</strong> before print production or government slot booking commences. Pricing is transparent and confirmed prior to execution.</p>
          </div>
        </div>
      </div>
    </>
  );
}
