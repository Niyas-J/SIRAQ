// ============================================
// WHATSAPP CONFIGURATION
// ============================================
// IMPORTANT: This is the single source of truth for WhatsApp contact details.
// Update this object to change the number or message across the entire site.
const WHATSAPP_CONFIG = {
    number: '+918217469646', // Format: country code + number (no spaces or dashes)
    displayNumber: '+91 82174 69646', // Format for display purposes
    defaultMessage: "Hi SIRAQ, I'm interested in placing an order.",
    responseTime: '24 hours'
};

// Helper function to generate WhatsApp link
function getWhatsAppLink(customMessage = null) {
    const message = encodeURIComponent(customMessage || WHATSAPP_CONFIG.defaultMessage);
    const number = WHATSAPP_CONFIG.number.replace(/[^0-9]/g, ''); // Remove any non-numeric characters
    return `https://wa.me/${number}?text=${message}`;
}

// ============================================
// GSAP SETUP & SMOOTH SCROLLING
// ============================================
gsap.registerPlugin(ScrollTrigger);

// Initialize Lenis Smooth Scroll with optimized settings
const lenis = new Lenis({
    duration: 0.8,
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

// Sync GSAP ScrollTrigger with Lenis
lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

// ============================================
// NAVIGATION FUNCTIONALITY
// ============================================
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', function () {
        mobileMenu.classList.toggle('hidden');
    });

    // Close mobile menu when clicking a link
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function () {
            mobileMenu.classList.add('hidden');
        });
    });
}

// Hide nav on scroll down, show on scroll up
let lastScroll = 0;
const nav = document.getElementById('main-nav');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll <= 0) {
        nav.style.transform = 'translateY(0)';
        return;
    }

    if (currentScroll > lastScroll && currentScroll > 100) {
        // Scrolling down
        nav.style.transform = 'translateY(-100%)';
    } else {
        // Scrolling up
        nav.style.transform = 'translateY(0)';
    }

    lastScroll = currentScroll;
});

// ============================================
// PRELOADER ANIMATION
// ============================================
window.addEventListener("load", () => {
    const tl = gsap.timeline();

    tl.to(".loader-text span", {
        y: 0,
        opacity: 1,
        stagger: 0.08,
        duration: 0.7,
        ease: "power3.out"
    })
        .to(".loader-bar", {
            width: "100%",
            duration: 1.2,
            ease: "power2.inOut"
        })
        .to("#preloader", {
            y: "-100%",
            duration: 1,
            delay: 0.3,
            ease: "expo.inOut"
        })
        .from("#hero p, #hero h1, #hero a", {
            y: 40,
            opacity: 0,
            stagger: 0.08,
            duration: 0.9,
            ease: "power3.out"
        }, "-=0.6");
});

// ============================================
// FAQ ACCORDION FUNCTIONALITY
// ============================================
const faqQuestions = document.querySelectorAll('.faq-question');

faqQuestions.forEach(question => {
    question.addEventListener('click', function () {
        const faqItem = this.parentElement;
        const answer = faqItem.querySelector('.faq-answer');
        const icon = this.querySelector('.faq-icon');

        // Toggle current FAQ
        const isActive = answer.classList.contains('active');

        // Close all FAQs
        document.querySelectorAll('.faq-answer').forEach(a => a.classList.remove('active'));
        document.querySelectorAll('.faq-icon').forEach(i => i.classList.remove('rotated'));

        // Open clicked FAQ if it wasn't active
        if (!isActive) {
            answer.classList.add('active');
            icon.classList.add('rotated');
        }
    });
});

// ============================================
// SHOWCASE DATA & RENDERING
// ============================================
const showcaseItems = [
    { title: "Corporate ID Cards", img: "images/work-id-card.png", category: "id-cards" },
    { title: "Professional ID Badge", img: "images/hero-id-card.png", category: "id-cards" },
    { title: "Luxury Wedding Invitation", img: "images/work-wedding-card.png", category: "wedding-cards" },
    { title: "Premium Wedding Cards", img: "images/hero-wedding-card.png", category: "wedding-cards" },
    { title: "Modern Event Poster", img: "images/poster-showcase-1.jpg", category: "posters" },
    { title: "Creative Marketing Poster", img: "images/poster-showcase-2.jpg", category: "posters" },
    { title: "Professional Brand Poster", img: "images/poster-showcase-3.jpg", category: "posters" }
];

const showcaseGrid = document.getElementById("showcase-grid");
if (showcaseGrid) {
    function renderShowcase(filterCategory = 'all') {
        const filteredItems = filterCategory === 'all'
            ? showcaseItems
            : showcaseItems.filter(item => item.category === filterCategory);

        showcaseGrid.innerHTML = filteredItems
            .map((item) => `
        <figure class="group relative overflow-hidden rounded-[30px] shadow-glass showcase-card aspect-[4/3]" data-category="${item.category}">
          <img
            src="${item.img}"
            alt="${item.title}"
            loading="lazy"
            class="h-full w-full object-cover transition duration-700 group-hover:scale-110"
          />
          <figcaption class="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <p class="text-lg font-semibold text-white">${item.title}</p>
            <span class="mt-2 w-fit rounded-full bg-accent/20 px-3 py-1 text-xs uppercase tracking-wider text-accent">
              ${item.category.replace('-', ' ')}
            </span>
          </figcaption>
        </figure>
      `)
            .join("");

        // Re-animate showcase cards
        gsap.from(".showcase-card", {
            y: 20,
            stagger: 0.1,
            duration: 0.5,
            ease: "power2.out"
        });
    }

    // Initial render
    renderShowcase();

    // Category filter functionality
    const filterButtons = document.querySelectorAll('.category-filter');
    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Update active state
            filterButtons.forEach(btn => {
                btn.classList.remove('active', 'bg-white/10', 'text-white', 'border-accent/50');
                btn.classList.add('bg-transparent', 'text-slateSoft', 'border-white/20');
            });
            this.classList.add('active', 'bg-white/10', 'text-white', 'border-accent/50');
            this.classList.remove('bg-transparent', 'text-slateSoft');

            // Filter showcase
            const category = this.getAttribute('data-category');
            renderShowcase(category);
        });
    });
}

// ============================================
// ORDER FORM HANDLING - WHATSAPP REDIRECT
// ============================================
const orderForm = document.getElementById('order-form');
const successMessage = document.getElementById('success-message');

if (orderForm) {
    orderForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Collect form values
        const formData = new FormData(orderForm);
        const service = formData.get('service');
        const name = formData.get('name');
        const email = formData.get('email');
        const phone = formData.get('phone');
        const message = formData.get('message');

        // Get service display name
        const serviceSelect = document.getElementById('service-select');
        const serviceText = serviceSelect.options[serviceSelect.selectedIndex].text;

        // Format WhatsApp message
        const whatsappMessage = `Hi SIRAQ 👋
I want to place an order.

*Service:* ${serviceText}
*Name:* ${name}
*Email:* ${email}
*Phone:* ${phone}

*Order Details:*
${message}`;

        // Show success message briefly
        successMessage.classList.remove('hidden');
        orderForm.style.display = 'none';

        // Redirect to WhatsApp after a brief moment
        setTimeout(() => {
            window.open(getWhatsAppLink(whatsappMessage), '_blank');

            // Reset form after redirect
            setTimeout(() => {
                orderForm.reset();
                orderForm.style.display = 'block';
                successMessage.classList.add('hidden');
            }, 1000);
        }, 500);
    });
}

// ============================================
// SECTION ANIMATIONS
// ============================================
gsap.utils.toArray("section").forEach((section, idx) => {
    if (section.querySelector('.service-card, .showcase-card')) return;

    gsap.from(section, {
        y: 20,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
            trigger: section,
            start: "top 88%",
        },
        delay: idx * 0.03,
    });
});

// Meteor effect removed for performance

// Custom cursor removed for performance

// Magnetic effect removed for performance

// 3D tilt effect removed for performance

// Text reveal animation removed for performance and accessibility

// Image parallax removed for performance

// ============================================
// SCROLL PROGRESS INDICATOR
// ============================================
const progressBar = document.createElement('div');
progressBar.classList.add('scroll-progress');
progressBar.style.width = '0%';
document.body.appendChild(progressBar);

gsap.to(progressBar, {
    width: '100%',
    ease: 'none',
    scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.3
    }
});

// ============================================
// SMOOTH ANCHOR SCROLLING
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            lenis.scrollTo(target, {
                offset: -50,
                duration: 1.5,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
            });
        }
    });
});

// Ripple effect removed for performance

// ============================================
// PERFORMANCE OPTIMIZATIONS
// ============================================
// Disable ScrollTrigger markers in production
ScrollTrigger.config({
    autoRefreshEvents: "visibilitychange,DOMContentLoaded,load"
});

// Refresh ScrollTrigger on window resize (debounced)
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        ScrollTrigger.refresh();
    }, 250);
});

// ============================================
// MODAL CONTROLS
// ============================================
function openModal(modalName) {
    const modal = document.getElementById(`${modalName}-modal`);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Animate in
        setTimeout(() => {
            modal.style.opacity = '1';
        }, 10);
    }
}

function closeModal(modalName) {
    const modal = document.getElementById(`${modalName}-modal`);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Close modal when clicking outside content
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
        e.target.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.active').forEach(modal => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
});

// ============================================
// WHATSAPP BUTTON HANDLERS
// ============================================
// Hero WhatsApp button
const heroWhatsAppBtn = document.getElementById('hero-whatsapp-btn');
if (heroWhatsAppBtn) {
    heroWhatsAppBtn.addEventListener('click', function (e) {
        e.preventDefault();
        window.open(getWhatsAppLink(), '_blank');
    });
}

// Floating WhatsApp button
const whatsAppFab = document.getElementById('whatsapp-fab');
if (whatsAppFab) {
    whatsAppFab.addEventListener('click', function (e) {
        e.preventDefault();
        window.open(getWhatsAppLink(), '_blank');
    });
}

console.log('✨ SIRAQ Business Website Loaded');
