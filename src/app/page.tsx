'use client';

import { useEffect } from 'react';

export default function HomePage() {
  useEffect(() => {
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
      {/* Navigation Bar */}
      <nav id="main-nav" className="fixed top-0 left-0 right-0 z-[100] transition-all duration-300">
        <div className="container mx-auto px-6 py-4">
          <div className="glass rounded-full px-6 py-3 flex items-center justify-between">
            <a href="#hero" className="text-xl font-display font-bold text-white hover:text-accent transition">
              SIRAQ
            </a>
            <div className="hidden md:flex items-center gap-8">
              <a href="#hero" className="nav-link text-sm font-medium text-slateSoft hover:text-white transition">Home</a>
              <a href="#services" className="nav-link text-sm font-medium text-slateSoft hover:text-white transition">Services</a>
              <a href="#showcase" className="nav-link text-sm font-medium text-slateSoft hover:text-white transition">Showcase</a>
              <a href="#faq" className="nav-link text-sm font-medium text-slateSoft hover:text-white transition">FAQ</a>
              <button onClick={() => (window as any).openModal?.('about')} className="nav-link text-sm font-medium text-slateSoft hover:text-white transition">About</button>
              <button onClick={() => (window as any).openModal?.('terms')} className="nav-link text-sm font-medium text-slateSoft hover:text-white transition">Policies</button>
              <a href="#contact" className="nav-link text-sm font-medium text-slateSoft hover:text-white transition">Contact</a>
            </div>
            <button id="mobile-menu-btn" className="md:hidden text-white focus:outline-none" aria-label="Toggle menu">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
          <div id="mobile-menu" className="hidden md:hidden mt-4 glass rounded-3xl p-6">
            <div className="flex flex-col gap-4">
              <a href="#hero" className="mobile-nav-link text-sm font-medium text-slateSoft hover:text-white transition">Home</a>
              <a href="#services" className="mobile-nav-link text-sm font-medium text-slateSoft hover:text-white transition">Services</a>
              <a href="#showcase" className="mobile-nav-link text-sm font-medium text-slateSoft hover:text-white transition">Showcase</a>
              <a href="#faq" className="mobile-nav-link text-sm font-medium text-slateSoft hover:text-white transition">FAQ</a>
              <button onClick={() => (window as any).openModal?.('about')} className="mobile-nav-link text-left text-sm font-medium text-slateSoft hover:text-white transition">About</button>
              <button onClick={() => (window as any).openModal?.('terms')} className="mobile-nav-link text-left text-sm font-medium text-slateSoft hover:text-white transition">Policies</button>
              <a href="#contact" className="mobile-nav-link text-sm font-medium text-slateSoft hover:text-white transition">Contact</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Film Grain */}
      <div className="film-grain"></div>

      {/* Preloader */}
      <div id="preloader">
        <div className="loader-text">
          <span>S</span><span>I</span><span>R</span><span>A</span><span>Q</span>
        </div>
        <div className="loader-bar"></div>
      </div>

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

      <div className="pointer-events-none fixed inset-0 z-[1]">
        <div className="absolute top-[-10%] left-[10%] h-64 w-64 rounded-full bg-accent/20 blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[5%] h-72 w-72 rounded-full bg-neon/20 blur-3xl"></div>
      </div>

      <main className="relative z-10">
        {/* HERO SECTION */}
        <section id="hero" className="container mx-auto flex min-h-screen items-center justify-center px-6 py-20">
          <div className="w-full max-w-5xl mx-auto text-center">
            <div className="text-center">
              <p className="font-medium uppercase tracking-[0.4em] text-slateSoft animate-fade-in">Siraq Studio</p>
              <h1 className="font-display mt-6 text-5xl leading-tight sm:text-6xl lg:text-7xl xl:text-8xl font-bold">
                <span className="block bg-gradient-to-r from-white via-white to-slateSoft bg-clip-text text-transparent">
                  Premium Custom Designs.
                </span>
                <span className="block mt-2 bg-gradient-to-r from-accent via-neon to-accent bg-clip-text text-transparent animate-gradient">
                  Crafted with Care.
                </span>
              </h1>
              <p className="mt-8 max-w-3xl mx-auto text-lg sm:text-xl text-slateSoft leading-relaxed">
                Same premium quality across all plans. Quantity changes, quality never.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a
                  href="#services"
                  className="inline-block rounded-full bg-gradient-to-r from-accent to-neon px-10 py-5 text-sm font-semibold uppercase tracking-wider text-charcoal shadow-glow transition hover:-translate-y-1 hover:shadow-[0_25px_50px_rgba(249,178,52,0.4)] hover:scale-105"
                >
                  Get Started
                </a>
                <a
                  href="#"
                  id="hero-whatsapp-btn"
                  className="inline-flex items-center gap-3 rounded-full bg-[#25D366] px-10 py-5 text-sm font-semibold uppercase tracking-wider text-white shadow-lg transition hover:-translate-y-1 hover:shadow-[0_25px_50px_rgba(37,211,102,0.4)] hover:scale-105"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  WhatsApp Order
                </a>
              </div>
              <div className="mt-8 flex flex-wrap justify-center items-center gap-4 text-xs text-slateSoft/90">
                <span className="flex items-center gap-2">
                  <span className="text-accent">✓</span> 1200+ Orders
                </span>
                <span className="hidden sm:inline">•</span>
                <span className="flex items-center gap-2">
                  <span className="text-accent">✓</span> Premium Quality
                </span>
                <span className="hidden sm:inline">•</span>
                <span className="flex items-center gap-2">
                  <span className="text-accent">✓</span> Friendly Support
                </span>
                <span className="hidden sm:inline">•</span>
                <span className="flex items-center gap-2">
                  <span className="text-accent">✓</span> Fixed Pricing
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* SERVICES SECTION */}
        <section id="services" className="container mx-auto px-6 py-20">
          <div className="mb-12 text-center">
            <p className="text-xs uppercase tracking-[0.4em] text-slateSoft">What We Offer</p>
            <h2 className="font-display mt-2 text-3xl lg:text-4xl">Our Services & Pricing</h2>
            <p className="mt-4 text-slateSoft">Transparent pricing, premium quality</p>
          </div>

          <div className="mb-16">
            <h3 className="text-2xl font-display font-semibold text-center mb-8">ID Card Design</h3>
            <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
              <div className="glass rounded-3xl p-8 shadow-glass hover:shadow-glow-accent transition">
                <div className="mb-4 text-4xl">🪪</div>
                <h4 className="text-xl font-semibold mb-4">Normal ID Card</h4>
                <p className="text-sm text-slateSoft mb-4">Professional employee IDs, student cards, and access badges with premium finish.</p>
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
                <h4 className="text-xl font-semibold mb-4">Premium ID Card</h4>
                <p className="text-sm text-slateSoft mb-4">High-quality cards with advanced security features, holographic elements, and premium materials.</p>
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
            <p className="text-xs text-center text-slateSoft/80 mt-6">💡 Bulk discounts available. Contact us on WhatsApp for custom quantities and CEEP institution cards.</p>
          </div>

          <div className="mb-8">
            <h3 className="text-2xl font-display font-semibold text-center mb-4">Poster Design – Monthly Plans</h3>
            <p className="text-center text-sm text-slateSoft mb-8">All plans provide the SAME premium quality</p>

            <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
              <div className="glass rounded-3xl p-8 shadow-glass hover:shadow-glow transition relative">
                <div className="absolute top-4 right-4">
                  <span className="bg-gradient-to-r from-accent to-neon text-charcoal text-xs font-bold px-3 py-1 rounded-full">Best Value</span>
                </div>
                <div className="mb-4 text-4xl">🎨</div>
                <h4 className="text-xl font-semibold mb-2">Starter Plan</h4>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-accent">₹499</span>
                  <span className="text-sm text-slateSoft"> /month</span>
                </div>
                <p className="text-lg font-semibold mb-4">Up to 25 posters</p>
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
                <h4 className="text-xl font-semibold mb-2">Growth Plan</h4>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-neon">₹699</span>
                  <span className="text-sm text-slateSoft"> /month</span>
                </div>
                <p className="text-lg font-semibold mb-4">Up to 40 posters</p>
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
                <h4 className="text-xl font-semibold mb-2">Business Plan</h4>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-accent">₹1,199</span>
                  <span className="text-sm text-slateSoft"> /month</span>
                </div>
                <p className="text-lg font-semibold mb-4">Up to 100 posters</p>
                <p className="text-sm text-slateSoft mb-6">For established businesses and agencies requiring high-volume professional designs.</p>
                <a href="#order" className="block w-full text-center rounded-full bg-accent px-6 py-3 text-sm font-semibold uppercase tracking-wider text-charcoal transition hover:bg-accent/90">
                  Get Started
                </a>
              </div>
            </div>
          </div>

          <div className="glass rounded-2xl p-6 max-w-3xl mx-auto text-center mb-6">
            <p className="text-sm font-semibold text-white mb-2">✨ Quality Promise</p>
            <p className="text-sm text-slateSoft">We do not compromise on design quality. Pricing only affects quantity, not quality.</p>
          </div>

          <div className="text-center">
            <p className="text-xs text-slateSoft/80">Single poster designs usually start from ₹30 depending on design complexity and time.</p>
          </div>
        </section>

        {/* OUR WORKS SECTION */}
        <section id="showcase" className="container mx-auto px-6 py-20">
          <div className="mb-12 text-center">
            <p className="text-xs uppercase tracking-[0.4em] text-slateSoft">Portfolio</p>
            <h2 className="font-display mt-2 text-3xl lg:text-4xl">Our Works</h2>
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

        {/* HOW IT WORKS SECTION */}
        <section id="how-it-works" className="container mx-auto px-6 py-20">
          <div className="mb-16 text-center">
            <p className="text-xs uppercase tracking-[0.4em] text-slateSoft">Process</p>
            <h2 className="font-display mt-2 text-3xl lg:text-4xl">How It Works</h2>
            <p className="mt-4 text-slateSoft">Simple, fast, and professional</p>
          </div>

          <div className="relative grid gap-8 md:grid-cols-3">
            <div className="absolute top-16 left-0 right-0 hidden h-0.5 bg-gradient-to-r from-accent via-neon to-accent opacity-20 md:block" style={{ width: 'calc(100% - 8rem)', left: '4rem' }}></div>
            <div className="glass relative rounded-3xl p-8 text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent/50 text-2xl font-bold text-charcoal shadow-glow-accent">1</div>
              <div className="mb-4 text-4xl">🎯</div>
              <h3 className="mb-3 text-xl font-semibold">Choose Service</h3>
              <p className="text-sm text-slateSoft">Select from ID cards, wedding invitations, posters, or custom creative works</p>
            </div>
            <div className="glass relative rounded-3xl p-8 text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-neon to-neon/50 text-2xl font-bold text-charcoal shadow-glow">2</div>
              <div className="mb-4 text-4xl">📝</div>
              <h3 className="mb-3 text-xl font-semibold">Submit Details</h3>
              <p className="text-sm text-slateSoft">Fill out the order form with your requirements and upload any reference files</p>
            </div>
            <div className="glass relative rounded-3xl p-8 text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-accent to-neon text-2xl font-bold text-charcoal shadow-glow">3</div>
              <div className="mb-4 text-4xl">✨</div>
              <h3 className="mb-3 text-xl font-semibold">Review & Delivery</h3>
              <p className="text-sm text-slateSoft">We'll send proofs for approval, then deliver your finished products quickly</p>
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section id="faq" className="container mx-auto px-6 py-20">
          <div className="mb-16 text-center">
            <p className="text-xs uppercase tracking-[0.4em] text-slateSoft">Questions</p>
            <h2 className="font-display mt-2 text-3xl lg:text-4xl">Frequently Asked Questions</h2>
            <p className="mt-4 text-slateSoft">Everything you need to know</p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            <div className="glass rounded-2xl overflow-hidden faq-item">
              <button className="faq-question w-full text-left p-6 flex justify-between items-center hover:bg-white/5 transition">
                <span className="font-semibold text-white pr-4">What is the cost of a single poster?</span>
                <svg className="faq-icon w-5 h-5 text-accent transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              <div className="faq-answer hidden px-6 pb-6">
                <p className="text-sm text-slateSoft leading-relaxed">Single poster designs usually start from ₹30 depending on design complexity and delivery time. For better value and consistent quality, we recommend our monthly plans which offer significant savings.</p>
              </div>
            </div>

            <div className="glass rounded-2xl overflow-hidden faq-item">
              <button className="faq-question w-full text-left p-6 flex justify-between items-center hover:bg-white/5 transition">
                <span className="font-semibold text-white pr-4">Is quality different for lower-priced plans?</span>
                <svg className="faq-icon w-5 h-5 text-accent transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              <div className="faq-answer hidden px-6 pb-6">
                <p className="text-sm text-slateSoft leading-relaxed">No. All plans receive the same premium-quality design. We maintain consistent quality standards across all pricing tiers. The only difference is the quantity of designs you receive per month. Quality never changes.</p>
              </div>
            </div>

            <div className="glass rounded-2xl overflow-hidden faq-item">
              <button className="faq-question w-full text-left p-6 flex justify-between items-center hover:bg-white/5 transition">
                <span className="font-semibold text-white pr-4">Can I get discounts?</span>
                <svg className="faq-icon w-5 h-5 text-accent transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              <div className="faq-answer hidden px-6 pb-6">
                <p className="text-sm text-slateSoft leading-relaxed">Special offers are available for bulk and long-term requirements. Please contact us on WhatsApp to discuss your specific needs and we'll provide the best possible pricing for your project.</p>
              </div>
            </div>

            <div className="glass rounded-2xl overflow-hidden faq-item">
              <button className="faq-question w-full text-left p-6 flex justify-between items-center hover:bg-white/5 transition">
                <span className="font-semibold text-white pr-4">Why choose monthly plans?</span>
                <svg className="faq-icon w-5 h-5 text-accent transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              <div className="faq-answer hidden px-6 pb-6">
                <p className="text-sm text-slateSoft leading-relaxed">Monthly plans offer better value, faster delivery, and consistent designs. You save significantly compared to ordering individual posters, get priority processing, and maintain design consistency across all your marketing materials.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ORDER SECTION */}
        <section className="container mx-auto px-6 pb-20" id="order">
          <div className="glass rounded-[32px] p-8 shadow-glass lg:p-12">
            <div className="mb-8 text-center">
              <p className="text-xs uppercase tracking-[0.4em] text-slateSoft">Get Started</p>
              <h2 className="font-display mt-2 text-3xl lg:text-4xl">Place Your Order</h2>
              <p className="mt-4 text-slateSoft">Fill out the form below and we'll get back to you within 24 hours</p>
            </div>

            <form className="mx-auto max-w-2xl" id="order-form">
              <div className="space-y-5">
                <label className="block text-sm">
                  <span className="mb-2 inline-block font-medium">Service Type <span className="text-accent">*</span></span>
                  <select name="service" id="service-select" required className="glass w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-accent/50 text-white bg-space">
                    <option value="">Select a service...</option>
                    <option value="id-cards">ID Cards</option>
                    <option value="wedding-cards">Wedding Cards</option>
                    <option value="posters">Posters & Designs</option>
                  </select>
                </label>

                <label className="block text-sm">
                  <span className="mb-2 inline-block font-medium">Your Name <span className="text-accent">*</span></span>
                  <input type="text" name="name" placeholder="John Doe" required className="glass w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-accent/50 text-white" />
                </label>

                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="block text-sm">
                    <span className="mb-2 inline-block font-medium">Email <span className="text-accent">*</span></span>
                    <input type="email" name="email" placeholder="john@example.com" required className="glass w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-accent/50 text-white" />
                  </label>

                  <label className="block text-sm">
                    <span className="mb-2 inline-block font-medium">Phone <span className="text-accent">*</span></span>
                    <input type="tel" name="phone" placeholder="+91 98765 43210" required className="glass w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-accent/50 text-white" />
                  </label>
                </div>

                <label className="block text-sm">
                  <span className="mb-2 inline-block font-medium">Project Details <span className="text-accent">*</span></span>
                  <textarea name="message" rows={4} placeholder="Tell us about your project requirements, quantity, timeline, etc." required className="glass w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-accent/50 text-white"></textarea>
                </label>

                <label className="block text-sm">
                  <span className="mb-2 inline-block font-medium">Reference Files (Optional)</span>
                  <input type="file" multiple className="glass w-full rounded-2xl border border-dashed border-white/20 bg-white/5 px-4 py-6 text-sm text-slateSoft file:mr-4 file:rounded-full file:border-0 file:bg-accent file:px-4 file:py-2 file:text-xs file:font-semibold file:text-charcoal file:transition hover:file:bg-accent/90" />
                </label>

                <p className="text-xs text-slateSoft/80 text-center">📱 You'll be redirected to WhatsApp to complete your order</p>

                <button type="submit" className="mt-4 w-full rounded-full bg-gradient-to-r from-accent to-neon px-6 py-4 text-sm font-semibold uppercase tracking-wider text-charcoal shadow-glow transition hover:-translate-y-1">
                  Place Order on WhatsApp
                </button>
              </div>
            </form>

            <div id="success-message" className="mx-auto mt-8 hidden max-w-2xl rounded-2xl border border-neon/30 bg-neon/10 p-6 text-center">
              <div className="mb-2 text-4xl">✅</div>
              <h3 className="mb-2 text-xl font-semibold text-neon">Redirecting to WhatsApp...</h3>
              <p className="text-sm text-slateSoft">Please continue your order on WhatsApp. We'll respond within 24 hours.</p>
            </div>
          </div>
        </section>

        {/* FOOTER / CONTACT */}
        <footer id="contact" className="border-t border-white/10 bg-space/70 py-10">
          <div className="container mx-auto px-6">
            <div className="mb-6 text-center">
              <p className="text-sm text-slateSoft">For final pricing, custom requirements, or offers, please contact us on WhatsApp.</p>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-6 text-sm text-slateSoft">
              <div>
                <p className="text-base font-semibold text-white">SIRAQ Studio</p>
                <p>Professional print & creative services • Est. 2026</p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:gap-6">
                <a href="mailto:siraqstudio@gmail.com" className="transition hover:text-white">siraqstudio@gmail.com</a>
                <a href="tel:+918217469646" className="transition hover:text-white">+91 82174 69646</a>
              </div>
              <div className="flex gap-4 text-white">
                <a href="https://www.instagram.com/siraq.studio" target="_blank" className="transition hover:text-accent" rel="noreferrer">Instagram</a>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-4 border-t border-white/10 pt-6 text-xs text-slateSoft">
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
          <div className="mb-6">
            <p className="text-xs uppercase tracking-[0.4em] text-slateSoft">Our Story</p>
            <h2 className="font-display mt-2 text-3xl">About SIRAQ Studio</h2>
          </div>
          <div>
            <p className="text-base leading-relaxed text-white mb-4">SIRAQ Studio is a professional print and creative services provider specializing in ID cards, wedding invitations, and custom design solutions.</p>
            <p className="text-sm leading-relaxed text-slateSoft mb-4">With over 1200+ successfully completed orders, we have established ourselves as a reliable partner for businesses and individuals seeking premium quality printing services.</p>
            <div className="grid gap-4 sm:grid-cols-3 mt-6">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
                <div className="mb-1 text-xl font-semibold text-accent">1200+</div>
                <p className="text-xs text-slateSoft">Orders Completed</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
                <div className="mb-1 text-xl font-semibold text-neon">Premium</div>
                <p className="text-xs text-slateSoft">Quality Standards</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
                <div className="mb-1 text-xl font-semibold text-accent">Best</div>
                <p className="text-xs text-slateSoft">Competitive Pricing</p>
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
            <h2 className="font-display mt-2 text-3xl">Privacy Policy</h2>
          </div>
          <div className="space-y-4 text-sm text-slateSoft">
            <p>We collect name, contact details, and project specifications provided during order placement. Your information is used exclusively for processing orders and providing support. We never share or sell your data.</p>
          </div>
        </div>
      </div>

      <div id="terms-modal" className="modal-overlay">
        <div className="glass rounded-3xl max-w-2xl w-full p-8 relative mx-4 max-h-[90vh] overflow-y-auto border border-white/20">
          <button onClick={() => (window as any).closeModal?.('terms')} className="absolute top-6 right-6 text-slateSoft hover:text-white text-xl">✕</button>
          <div className="mb-6">
            <p className="text-xs uppercase tracking-[0.4em] text-slateSoft">Legal</p>
            <h2 className="font-display mt-2 text-3xl">Terms & Conditions</h2>
          </div>
          <div className="space-y-4 text-sm text-slateSoft">
            <p><strong>50% advance payment is mandatory</strong> before work commences. The remaining balance must be paid before final delivery. Pricing is fixed once confirmed.</p>
          </div>
        </div>
      </div>
    </>
  );
}
