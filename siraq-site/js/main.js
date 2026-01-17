// Register GSAP Plugins
gsap.registerPlugin(ScrollTrigger);

// Initialize Lenis Smooth Scroll
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Preloader Animation
window.addEventListener("load", () => {
    const tl = gsap.timeline();

    tl.to(".loader-text span", {
        y: 0,
        opacity: 1,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out"
    })
        .to(".loader-bar", {
            width: "100%",
            duration: 1,
            ease: "power2.inOut"
        })
        .to("#preloader", {
            y: "-100%",
            duration: 1.2,
            delay: 0.5,
            ease: "expo.inOut"
        })
        .from("#hero p, #hero h1, #hero a", {
            y: 50,
            opacity: 0,
            stagger: 0.1,
            duration: 1,
            ease: "power3.out"
        }, "-=0.8");
});

// Render Dynamic Content
const services = [
    { title: "Premium Print Supply", desc: "Business cards, posters, branded stationery.", icon: "🎨" },
    { title: "Custom IDs & Badges", desc: "High-security cards with metallic finishes.", icon: "💼" },
    { title: "Event Invitations", desc: "Foil stamping, textured stock & custom folds.", icon: "💌" },
    { title: "Large Format Prints", desc: "Banners, signage & storefront displays.", icon: "🖼️" },
    { title: "Packaging & Labels", desc: "Luxury boxes, tamper tags, die-cut labels.", icon: "📦" },
    { title: "Creative Studio Works", desc: "Logo refresh, visual systems & brand decks.", icon: "✨" },
    { title: "Digital + Print Kits", desc: "Pitch decks, brochures, social-ready files.", icon: "🧠" },
    { title: "Rapid Fulfillment", desc: "48-hr rush service & tracked logistics.", icon: "⚡" },
];

const productsGrid = document.getElementById("products-grid");
if (productsGrid) {
    productsGrid.innerHTML = services
        .map(
            (service, idx) => `
    <article
      class="glass group rounded-3xl p-6 shadow-glass transition hover:-translate-y-2 hover:border-white/30 product-card"
    >
      <div class="mb-4 flex items-center justify-between">
        <span class="text-3xl">${service.icon}</span>
        <span class="rounded-full bg-white/5 px-3 py-1 text-xs uppercase tracking-wider text-slateSoft">Premium</span>
      </div>
      <h3 class="text-lg font-semibold text-white">${service.title}</h3>
      <p class="mt-2 text-sm text-slateSoft">${service.desc}</p>
    </article>
  `
        )
        .join("");

    // GSAP Replacement for AOS on Product Cards
    ScrollTrigger.batch(".product-card", {
        start: "top 85%",
        onEnter: batch => gsap.from(batch, {
            opacity: 0,
            y: 50,
            stagger: 0.1,
            duration: 0.8,
            ease: "power2.out"
        })
    });
}

const showcaseItems = [
    {
        title: "Aurora Luxe Cards",
        img: "images/aurora-luxe.jpg",
    },
    {
        title: "Holographic Merch Tags",
        img: "images/holographic-tags.jpg",
    },
    {
        title: "Modular Identity Suite",
        img: "images/modular-identity.jpg",
    },
    {
        title: "Luxury Event Collateral",
        img: "images/luxury-event.jpg",
    },
    {
        title: "Retail Supply Kits",
        img: "images/retail-supply.jpg",
    },
    {
        title: "Custom Packaging Concept",
        img: "images/custom-packaging.jpg",
    },
];

const showcaseGrid = document.getElementById("showcase-grid");
if (showcaseGrid) {
    showcaseGrid.innerHTML = showcaseItems
        .map(
            (item, idx) => `
    <figure
      class="group relative overflow-hidden rounded-[30px] shadow-glass showcase-card"
    >
      <img
        src="${item.img}"
        alt="${item.title}"
        loading="lazy"
        class="h-full w-full object-cover transition duration-500 group-hover:scale-110"
      />
      <figcaption
        class="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 via-black/20 to-transparent p-6"
      >
        <p class="text-lg font-semibold text-white">${item.title}</p>
        <button class="mt-2 w-fit rounded-full bg-white/15 px-4 py-1 text-xs uppercase tracking-wider text-white magnetic">
          View detail
        </button>
      </figcaption>
    </figure>
  `
        )
        .join("");

    // GSAP Replacement for AOS on Showcase Cards
    ScrollTrigger.batch(".showcase-card", {
        start: "top 85%",
        onEnter: batch => gsap.from(batch, {
            opacity: 0,
            y: 50,
            rotation: 2,
            stagger: 0.15,
            duration: 1,
            ease: "back.out(1.2)"
        })
    });
}

const highlights = [
    { title: "Bright Designs", desc: "Futuristic visuals curated for impact.", icon: "⚡", color: "text-neon" },
    { title: "Premium Materials", desc: "Specialty stock, foils & finishes.", icon: "🎯", color: "text-accent" },
    { title: "Fast Delivery", desc: "48-hour rush & global shipping.", icon: "🚀", color: "text-neon" },
    { title: "Custom Works", desc: "Built for brands, events, and stories.", icon: "🧬", color: "text-accent" },
];

const highlightsGrid = document.getElementById("highlights-grid");
if (highlightsGrid) {
    highlightsGrid.innerHTML = highlights
        .map(
            (highlight) => `
    <div class="rounded-3xl border border-white/5 bg-white/5 p-6 transition hover:-translate-y-2 highlight-card">
      <span class="text-3xl ${highlight.color}">${highlight.icon}</span>
      <h3 class="mt-4 text-lg font-semibold">${highlight.title}</h3>
      <p class="mt-2 text-sm text-slateSoft">${highlight.desc}</p>
    </div>
  `
        )
        .join("");

    // GSAP Replacement for AOS on Highlights
    ScrollTrigger.batch(".highlight-card", {
        start: "top 90%",
        onEnter: batch => gsap.from(batch, {
            opacity: 0,
            x: -30,
            stagger: 0.1,
            duration: 0.8,
            ease: "power2.out"
        })
    });
}

// Section Animations (Replaces inline AOS & GSAP calls)
gsap.utils.toArray("section").forEach((section, idx) => {
    // Skip if already handled by batch
    if (section.querySelector('.product-card, .showcase-card, .highlight-card')) return;

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
    });
});

// Hero Background Animation
gsap.to(".hero-bg", {
    backgroundPosition: "50% 0%",
    duration: 20,
    repeat: -1,
    yoyo: true,
    ease: "none",
});

// Marquee Animation
const marqueeTrack = document.getElementById("marquee-track");
if (marqueeTrack) {
    marqueeTrack.innerHTML += marqueeTrack.innerHTML; // Duplicate content
    gsap.to(marqueeTrack, {
        x: "-50%",
        duration: 20,
        ease: "none",
        repeat: -1
    });
}

// Meteor Effect
const meteorContainer = document.getElementById('meteors-container');
if (meteorContainer) {
    for (let i = 0; i < 20; i++) {
        const meteor = document.createElement('span');
        meteor.classList.add('meteor');
        meteorContainer.appendChild(meteor);

        const setRandomPos = () => {
            meteor.style.left = Math.floor(Math.random() * 120 - 10) + '%';
            meteor.style.top = Math.floor(Math.random() * 120 - 10) + '%';
        }
        setRandomPos();

        const tl = gsap.timeline({
            repeat: -1,
            delay: Math.random() * 5,
            repeatDelay: Math.random() * 2,
            onRepeat: setRandomPos
        });

        tl.fromTo(meteor, { opacity: 0, x: 0, y: 0 }, { opacity: 1, duration: 0.1 })
            .to(meteor, {
                x: -300,
                y: 300,
                opacity: 0,
                duration: 1.5,
                ease: "none"
            });
    }
}

// Custom Cursor Logic
const cursor = document.getElementById('cursor');
const magneticElements = document.querySelectorAll('a, button, .magnetic');

document.addEventListener('mousemove', (e) => {
    gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: "power2.out"
    });
});

// Magnetic Effect
// Refresh selector to include dynamic buttons
const initMagnetic = () => {
    const freshMagneticElements = document.querySelectorAll('a, button, .magnetic');
    freshMagneticElements.forEach((el) => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            // Scale cursor up on hover
            gsap.to(cursor, { scale: 3, duration: 0.3 });

            // Magnetic pull
            gsap.to(el, {
                x: x * 0.3,
                y: y * 0.3,
                duration: 0.3,
                ease: "power2.out"
            });
        });

        el.addEventListener('mouseleave', () => {
            gsap.to(cursor, { scale: 1, duration: 0.3 });
            gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
        });
    });
}
// Init initially and after dynamic content
initMagnetic();


// Text Reveal Animation
const splitTextElements = document.querySelectorAll("h1, h2");
splitTextElements.forEach(el => {
    // Simple split text simulation w/o plugin
    const text = el.textContent;
    el.innerHTML = "";
    text.split("").forEach(char => {
        const span = document.createElement("span");
        span.textContent = char;
        span.style.display = "inline-block";
        el.appendChild(span);
    });

    gsap.from(el.querySelectorAll("span"), {
        scrollTrigger: {
            trigger: el,
            start: "top 80%",
        },
        y: 50,
        opacity: 0,
        rotateX: -90,
        stagger: 0.02,
        duration: 1,
        ease: "back.out(1.7)"
    });
});

// Parallax and Reveal Animations
gsap.utils.toArray('img').forEach(img => {
    // Reveal Mask
    // Wrap image in a reveal container if not already (for parallax overflow)
    const wrapper = document.createElement('div');
    wrapper.classList.add('reveal-img');
    wrapper.style.overflow = "hidden";

    // Check if image is inside figure or special container, adjust if needed
    // For simplicity in this vanilla setup, we apply class to parents or the img container

    // Apply reveal class to parent container for better effect
    const container = img.closest('.aspect-\\[4\\/3\\], figure, .glass > div') || img.parentElement;
    if (container) {
        container.classList.add('reveal-img');

        ScrollTrigger.create({
            trigger: container,
            start: "top 85%",
            onEnter: () => container.classList.add('reveal-visible'),
            once: true
        });
    }

    // Parallax Effect
    gsap.to(img, {
        yPercent: 15, // Move image down slightly
        ease: "none",
        scrollTrigger: {
            trigger: img,
            start: "top bottom",
            end: "bottom top",
            scrub: true
        }
    });
});

// Scroll Progress Indicator
const progressBar = document.createElement('div');
progressBar.classList.add('fixed', 'top-0', 'left-0', 'h-1', 'bg-gradient-to-r', 'from-accent', 'to-neon', 'z-[10000]', 'pointer-events-none');
progressBar.style.width = '0%';
document.body.appendChild(progressBar);

gsap.to(progressBar, {
    width: '100%',
    ease: 'none',
    scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: true
    }
});
