import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import OrderModal from "./components/OrderModal";
import type { ProductType } from "./types/order";
import { getSiteConfig, generateWhatsAppOrderLink } from "./utils/firebaseUtils";
import Header from "./components/Header";

const services = [
  { title: "Wedding Card", desc: "Elegant wedding invitations with custom designs.", icon: "💌", type: "wedding-card" as ProductType },
  { title: "ID Card", desc: "Professional ID cards with security features.", icon: "💼", type: "id-card" as ProductType },
  { title: "Event Invitations", desc: "Custom event cards for any occasion.", icon: "🎉", type: "invitation" as ProductType },
  { title: "Posters", desc: "Eye-catching posters for promotions & events.", icon: "🖼️", type: "poster" as ProductType },
  { title: "Custom Prints", desc: "Flyers, brochures & marketing materials.", icon: "🎨", type: "custom-print" as ProductType },
  { title: "Graphic Design", desc: "Professional logo & brand identity design.", icon: "✨", type: "graphic-work" as ProductType },
  { title: "Large Format Prints", desc: "Banners, signage & storefront displays.", icon: "📐", type: "poster" as ProductType },
  { title: "Packaging & Labels", desc: "Custom packaging solutions & product labels.", icon: "📦", type: "custom-print" as ProductType },
];

const showcaseItems = [
  {
    title: "Aurora Luxe Cards",
    img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Holographic Merch Tags",
    img: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Modular Identity Suite",
    img: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Luxury Event Collateral",
    img: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Retail Supply Kits",
    img: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Custom Packaging Concept",
    img: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80",
  },
];

const highlights = [
  { title: "Bright Designs", desc: "Futuristic visuals curated for impact.", icon: "⚡", color: "text-neon" },
  { title: "Premium Materials", desc: "Specialty stock, foils & finishes.", icon: "🎯", color: "text-accent" },
  { title: "Fast Delivery", desc: "48-hour rush & global shipping.", icon: "🚀", color: "text-neon" },
  { title: "Custom Works", desc: "Built for brands, events, and stories.", icon: "🧬", color: "text-accent" },
];

const SiraqPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);
  const [whatsappNumber, setWhatsappNumber] = useState('+918217469646');
  const [logoConfig, setLogoConfig] = useState({
    logoUrl: '',
    logoUploadedBy: '',
    logoUploadedAt: null
  });

  const handleProductClick = (productType: ProductType) => {
    setSelectedProduct(productType);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  // Load site configuration
  useEffect(() => {
    const loadConfig = async () => {
      const config = await getSiteConfig();
      setWhatsappNumber(config.whatsapp);
      setLogoConfig({
        logoUrl: config.logoUrl || '',
        logoUploadedBy: config.logoUploadedBy || '',
        logoUploadedAt: config.logoUploadedAt || null
      });
    };
    
    loadConfig();
  }, []);

  // Handle WhatsApp order
  const handleWhatsAppOrder = (productName: string, price: number) => {
    const whatsappLink = generateWhatsAppOrderLink(productName, price, whatsappNumber);
    window.open(whatsappLink, '_blank');
  };

  const formatDate = (date: any) => {
    if (!date) return 'Unknown';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  useEffect(() => {
    // Initialize AOS with error handling
    try {
      AOS.init({ 
        duration: 800, 
        once: true,
        offset: 50,
        easing: 'ease-in-out'
      });
    } catch (error) {
      console.error('AOS initialization error:', error);
    }

    // Initialize GSAP with error handling
    try {
      gsap.registerPlugin(ScrollTrigger);

      const sections = gsap.utils.toArray<HTMLElement>("section");
      const animations = sections.map((section, idx) =>
        gsap.from(section, {
          opacity: 0,
          y: 40,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
          },
          delay: idx * 0.05,
        })
      );

      const heroBg = document.querySelector(".hero-bg");
      const heroAnimation = heroBg
        ? gsap.to(heroBg, {
            backgroundPosition: "50% 0%",
            duration: 20,
            repeat: -1,
            yoyo: true,
            ease: "none",
          })
        : null;

      return () => {
        animations.forEach((anim) => anim.kill());
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        heroAnimation?.kill();
      };
    } catch (error) {
      console.error('GSAP initialization error:', error);
    }
  }, []);

  return (
    <div className="hero-bg min-h-screen overflow-x-hidden bg-gradient-to-br from-[#05070d] via-[#0a0c18] to-[#05070d] text-white">
      {/* Order Modal */}
      <OrderModal 
        isOpen={isModalOpen}
        onClose={closeModal}
        selectedProduct={selectedProduct}
      />
      
      <div className="pointer-events-none fixed inset-0 z-[1]">
        <div className="absolute left-[10%] top-[-10%] h-64 w-64 rounded-full bg-[#F9B234]/20 blur-3xl" />
        <div className="absolute bottom-[-10%] right-[5%] h-72 w-72 rounded-full bg-[#15F4EE]/20 blur-3xl" />
      </div>

      <main className="relative z-10 font-sans">
        <Header />
        
        {/* Hero */}
        <section className="container mx-auto flex min-h-screen flex-wrap items-center px-6 py-20 lg:flex-nowrap lg:gap-16">
          <div className="w-full space-y-6 text-center lg:w-1/2 lg:text-left" data-aos="fade-up">
            <p className="font-medium uppercase tracking-[0.4em] text-[#9CA5C2]">Siraq Studio</p>
            <h1 className="font-display text-4xl leading-tight sm:text-5xl">
              SIRAQ — <span className="text-[#F9B234]">Creative Prints</span> & <span className="text-[#15F4EE]">Supplies</span>
            </h1>
            <p className="text-lg text-[#9CA5C2]">
              Modern design. Quality products. Brighter ideas. We blend premium materials with futuristic visuals to keep your brand unforgettable.
            </p>
            <div className="flex flex-wrap justify-center gap-4 lg:justify-start">
              <button
                onClick={() => handleProductClick('wedding-card')}
                className="rounded-full bg-[#F9B234] px-6 py-3 text-sm font-semibold uppercase tracking-wider text-[#06070C] shadow-[0_20px_45px_rgba(21,244,238,0.25)] transition hover:-translate-y-1"
              >
                Order Now
              </button>
              <a
                href="#products"
                className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold uppercase tracking-wider text-white transition hover:-translate-y-1"
              >
                View Products
              </a>
            </div>
          </div>
          <div className="relative mt-10 w-full lg:mt-0 lg:w-1/2" data-aos="zoom-in">
            <div className="glass rounded-[30px] border border-transparent bg-[rgba(16,19,35,0.65)] bg-clip-padding p-6 shadow-[0_25px_60px_rgba(4,6,16,0.55)]">
              <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl">
                <img
                  src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80"
                  alt="Creative print setup"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="mt-6 flex items-center justify-between text-sm text-[#9CA5C2]">
                <p>Siraq Premium Deck</p>
                <p className="text-white">Ultra HD Print • 2025</p>
              </div>
            </div>
          </div>
        </section>

        {/* Services */}
        <section id="products" className="container mx-auto px-6 py-20">
          <div className="mb-12 text-center" data-aos="fade-up">
            <p className="text-xs uppercase tracking-[0.4em] text-[#9CA5C2]">Supply & Services</p>
            <h2 className="font-display text-3xl">Bright prints, bold ideas.</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {services.map((service, idx) => (
              <article
                key={service.title}
                className="glass rounded-3xl border border-white/5 bg-white/5 p-6 shadow-[0_25px_60px_rgba(4,6,16,0.55)] transition hover:-translate-y-2 hover:border-[#F9B234]/50 hover:shadow-[0_25px_60px_rgba(249,178,52,0.35)]"
                data-aos="fade-up"
                data-aos-delay={idx * 80}
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-3xl">{service.icon}</span>
                  <button
                    onClick={() => handleWhatsAppOrder(service.title, 
                      service.type === 'wedding-card' ? 20 :
                      service.type === 'id-card' ? 150 :
                      service.type === 'poster' ? 150 :
                      service.type === 'invitation' ? 15 :
                      service.type === 'custom-print' ? 100 :
                      service.type === 'graphic-work' ? 500 :
                      service.type === 'large-format-print' ? 300 : 200
                    )}
                    className="rounded-full bg-[#15F4EE]/20 px-3 py-1 text-xs uppercase tracking-wider text-[#15F4EE] hover:bg-[#15F4EE]/30"
                  >
                    Order via WhatsApp
                  </button>
                </div>
                <h3 className="text-lg font-semibold text-white">{service.title}</h3>
                <p className="mt-2 text-sm text-[#9CA5C2]">{service.desc}</p>
                <button
                  onClick={() => handleProductClick(service.type)}
                  className="mt-4 w-full rounded-full border border-white/20 px-4 py-2 text-sm font-semibold uppercase tracking-wider text-white transition hover:-translate-y-1"
                >
                  Order Now
                </button>
              </article>
            ))}
          </div>
        </section>

        {/* Logo Showcase */}
        <section id="logo-showcase" className="container mx-auto px-6 py-20">
          <div className="mb-12 text-center" data-aos="fade-up">
            <p className="text-xs uppercase tracking-[0.4em] text-[#9CA5C2]">Our Brand</p>
            <h2 className="font-display text-3xl">Our Logo — Siraq Studio</h2>
          </div>
          
          <div className="glass rounded-[32px] border border-white/10 bg-white/5 p-10 shadow-[0_25px_60px_rgba(4,6,16,0.55)] max-w-4xl mx-auto" data-aos="fade-up">
            {logoConfig.logoUrl ? (
              <div className="text-center">
                <div className="flex justify-center mb-8">
                  <img 
                    src={logoConfig.logoUrl} 
                    alt="Siraq Studio logo" 
                    className="max-w-full max-h-96 object-contain"
                  />
                </div>
                <div className="text-sm text-[#9CA5C2] mt-6">
                  <p>Uploaded by: {logoConfig.logoUploadedBy || 'Unknown'}</p>
                  <p>Uploaded on: {formatDate(logoConfig.logoUploadedAt)}</p>
                </div>
                <a 
                  href={logoConfig.logoUrl} 
                  download="siraq-studio-logo"
                  className="inline-block mt-6 rounded-full border border-white/20 px-6 py-2 text-sm font-semibold uppercase tracking-wider text-white transition hover:-translate-y-1"
                >
                  Download Logo
                </a>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="mx-auto w-32 h-32 bg-gray-800 rounded-full flex items-center justify-center mb-6">
                  <span className="text-5xl">🎨</span>
                </div>
                <h3 className="font-display text-xl mb-2">No logo uploaded yet</h3>
                <p className="text-[#9CA5C2]">Using default branding</p>
              </div>
            )}
          </div>
        </section>

        {/* Portfolio Showcase */}
        <section id="showcase" className="container mx-auto px-6 py-20">
          <div className="mb-12 flex flex-wrap items-center justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-[#9CA5C2]">Portfolio</p>
              <h2 className="font-display text-3xl">Showcase & Works</h2>
            </div>
            <p className="max-w-xl text-sm text-[#9CA5C2]">
              From vibrant product launches to bespoke ceremonial works, SIRAQ crafts experiences that live both in print and prestige.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {showcaseItems.map((item, idx) => (
              <figure
                key={item.title}
                className="group relative overflow-hidden rounded-[30px] shadow-[0_25px_60px_rgba(4,6,16,0.55)]"
                data-aos="zoom-in-up"
                data-aos-delay={idx * 70}
              >
                <img
                  src={item.img}
                  alt={item.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                />
                <figcaption className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 via-black/20 to-transparent p-6">
                  <p className="text-lg font-semibold text-white">{item.title}</p>
                  <button className="mt-2 w-fit rounded-full bg-white/15 px-4 py-1 text-xs uppercase tracking-wider text-white">
                    View detail
                  </button>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* Highlights */}
        <section className="container mx-auto px-6 pb-20">
          <div className="glass rounded-[32px] border border-white/10 bg-white/5 p-10 shadow-[0_25px_60px_rgba(4,6,16,0.55)]" data-aos="fade-up">
            <div className="mb-8 text-center">
              <p className="text-xs uppercase tracking-[0.4em] text-[#9CA5C2]">Why choose Siraq</p>
              <h2 className="font-display text-3xl">Premium by default.</h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {highlights.map((highlight) => (
                <div key={highlight.title} className="rounded-3xl border border-white/5 bg-white/5 p-6 transition hover:-translate-y-2">
                  <span className={`text-3xl ${highlight.color}`}>{highlight.icon}</span>
                  <h3 className="mt-4 text-lg font-semibold">{highlight.title}</h3>
                  <p className="mt-2 text-sm text-[#9CA5C2]">{highlight.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Form */}
        <section className="container mx-auto px-6 pb-20" id="order">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div data-aos="fade-right">
              <p className="text-xs uppercase tracking-[0.4em] text-[#9CA5C2]">Start a project</p>
              <h2 className="font-display text-3xl">Upload / Order form</h2>
              <p className="mt-4 max-w-md text-sm text-[#9CA5C2]">
                Share your files, reference links, or event details. We’ll prepare proofs, timelines, and supply options in under 24 hours.
              </p>
            </div>
            <form className="glass rounded-[28px] border border-white/10 bg-white/5 p-8 shadow-[0_25px_60px_rgba(4,6,16,0.55)]" data-aos="fade-left">
              <div className="space-y-4">
                <label className="text-sm">
                  <span className="mb-2 inline-block">Name</span>
                  <input
                    type="text"
                    name="name"
                    placeholder="Your full name"
                    className="glass w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-[#F9B234]/50"
                    required
                  />
                </label>
                <label className="text-sm">
                  <span className="mb-2 inline-block">Phone</span>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+1 555 000 1234"
                    className="glass w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-[#F9B234]/50"
                    required
                  />
                </label>
                <label className="text-sm">
                  <span className="mb-2 inline-block">Message</span>
                  <textarea
                    name="message"
                    rows={4}
                    placeholder="Tell us about your project..."
                    className="glass w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-[#F9B234]/50"
                  ></textarea>
                </label>
                <label className="block text-sm">
                  <span className="mb-2 inline-block">Reference files</span>
                  <input
                    type="file"
                    className="glass w-full rounded-2xl border border-dashed border-white/20 bg-white/5 px-4 py-6 text-sm text-[#9CA5C2]"
                  />
                </label>
                <button
                  type="submit"
                  className="mt-4 w-full rounded-full bg-gradient-to-r from-[#F9B234] to-[#15F4EE] px-6 py-3 text-sm font-semibold uppercase tracking-wider text-[#06070C] shadow-[0_20px_45px_rgba(21,244,238,0.35)] transition hover:-translate-y-1"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/10 bg-[#0F111A]/70 py-10">
          <div className="container mx-auto flex flex-wrap items-center justify-between gap-6 px-6 text-sm text-[#9CA5C2]">
            <div>
              <p className="text-base font-semibold text-white">SIRAQ Studio</p>
              <p>Creative prints & supply lab • Est. 2018</p>
            </div>
            <div className="flex gap-6">
              <a href="mailto:hello@siraq.studio" className="transition hover:text-white">
                hello@siraq.studio
              </a>
              <a href="tel:+15550001234" className="transition hover:text-white">
                +1 555 000 1234
              </a>
            </div>
            <div className="flex gap-4 text-white">
              <a href="#" className="transition hover:text-[#F9B234]">
                Instagram
              </a>
              <a href="#" className="transition hover:text-[#F9B234]">
                Dribbble
              </a>
              <a href="#" className="transition hover:text-[#F9B234]">
                Behance
              </a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default SiraqPage;