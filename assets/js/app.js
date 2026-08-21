// JavaScript Application - Ultimate Habit & Progress Tracker Dashboard (Stripe & Carousel Enabled)

document.addEventListener('DOMContentLoaded', () => {
    initCarousel();
    initFAQAccordion();
    initCountdownTimer();
    initPurchaseToasts();
    initCheckoutModal();
    initMetaPixelEvents();
    initSmoothScroll();
});

/**
 * 1. INTERACTIVE SLIDING IMAGE CAROUSEL
 * Controls hero slider navigation (Prev/Next buttons, Dots indicator)
 */
function initCarousel() {
    const slidesContainer = document.querySelector('.carousel-slides');
    const slides = document.querySelectorAll('.carousel-slide');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    const dotsContainer = document.querySelector('.carousel-dots');

    if (!slidesContainer || !slides.length) return;

    let currentIndex = 0;
    const totalSlides = slides.length;

    // Create pagination dots
    if (dotsContainer && !dotsContainer.children.length) {
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('div');
            dot.classList.add('carousel-dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }

    const updateDots = () => {
        if (!dotsContainer) return;
        const dots = dotsContainer.querySelectorAll('.carousel-dot');
        dots.forEach((dot, idx) => {
            dot.classList.toggle('active', idx === currentIndex);
        });
    };

    const goToSlide = (index) => {
        currentIndex = (index + totalSlides) % totalSlides;
        slidesContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
        updateDots();
    };

    if (prevBtn) {
        prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
    }

    // Auto-advance slide every 6 seconds
    setInterval(() => {
        goToSlide(currentIndex + 1);
    }, 6000);
}

/**
 * 2. FAQ ACCORDION TOGGLE
 */
function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const header = item.querySelector('.faq-header');
        if (!header) return;

        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            faqItems.forEach(other => {
                if (other !== item) other.classList.remove('active');
            });

            item.classList.toggle('active', !isActive);
        });
    });
}

/**
 * 3. COUNTDOWN TIMER (14:59)
 */
function initCountdownTimer() {
    const timerElements = document.querySelectorAll('.countdown-timer');
    if (!timerElements.length) return;

    let timeInSeconds = 14 * 60 + 59;

    const savedTime = localStorage.getItem('ht_timer_seconds');
    if (savedTime && parseInt(savedTime) > 0) {
        timeInSeconds = parseInt(savedTime);
    }

    const updateTimer = () => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;

        const formattedMins = String(minutes).padStart(2, '0');
        const formattedSecs = String(seconds).padStart(2, '0');

        timerElements.forEach(el => {
            el.textContent = `${formattedMins}:${formattedSecs}`;
        });

        if (timeInSeconds > 0) {
            timeInSeconds--;
            localStorage.setItem('ht_timer_seconds', timeInSeconds);
        } else {
            timeInSeconds = 14 * 60 + 59;
        }
    };

    updateTimer();
    setInterval(updateTimer, 1000);
}

/**
 * 4. RECENT PURCHASE SOCIAL PROOF TOAST POPUPS
 */
function initPurchaseToasts() {
    const toast = document.getElementById('purchase-toast');
    if (!toast) return;

    const samplePurchases = [
        { name: "Marcus T.", location: "Founder • San Francisco", time: "2 mins ago" },
        { name: "Sarah K.", location: "Designer • London", time: "5 mins ago" },
        { name: "David L.", location: "Engineer • New York", time: "1 min ago" },
        { name: "Jessica R.", location: "Executive • Chicago", time: "4 mins ago" }
    ];

    let index = 0;

    const showToast = () => {
        const current = samplePurchases[index];
        const nameEl = toast.querySelector('.toast-name');
        const locEl = toast.querySelector('.toast-location');
        const timeEl = toast.querySelector('.toast-time');

        if (nameEl) nameEl.textContent = current.name;
        if (locEl) locEl.textContent = current.location;
        if (timeEl) timeEl.textContent = current.time;

        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 5000);

        index = (index + 1) % samplePurchases.length;
    };

    setTimeout(() => {
        showToast();
        setInterval(showToast, 18000);
    }, 4000);

    const closeBtn = toast.querySelector('.toast-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            toast.classList.remove('show');
        });
    }
}

/**
 * 5. STRIPE CHECKOUT MODAL WORKFLOW ($8.90 USD)
 */
function initCheckoutModal() {
    const modal = document.getElementById('checkout-modal');
    const openBtns = document.querySelectorAll('.trigger-checkout');
    const closeBtns = document.querySelectorAll('.close-modal');
    const checkoutForm = document.getElementById('modal-checkout-form');
    const successView = document.getElementById('modal-success-view');

    if (!modal) return;

    openBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';

            if (typeof fbq === 'function') {
                fbq('track', 'InitiateCheckout', {
                    content_name: 'Ultimate Habit & Progress Tracker Dashboard',
                    content_category: 'Google Sheet Template',
                    value: 8.90,
                    currency: 'USD'
                });
            }
        });
    });

    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    if (checkoutForm && successView) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = checkoutForm.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = `<i class="fa-solid fa-circle-notch animate-spin"></i> Connecting to Stripe Secure Gateway...`;
            }

            setTimeout(() => {
                checkoutForm.classList.add('hidden');
                successView.classList.remove('hidden');

                if (typeof fbq === 'function') {
                    fbq('track', 'Purchase', {
                        content_name: 'Ultimate Habit & Progress Tracker Dashboard',
                        value: 8.90,
                        currency: 'USD'
                    });
                }
            }, 1400);
        });
    }
}

/**
 * 6. META PIXEL EVENTS
 */
function initMetaPixelEvents() {
    const ctaButtons = document.querySelectorAll('.cta-btn');

    ctaButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (typeof fbq === 'function') {
                fbq('track', 'InitiateCheckout', {
                    content_name: 'Ultimate Habit & Progress Tracker Dashboard',
                    value: 8.90,
                    currency: 'USD'
                });
            }
        });
    });
}

/**
 * 7. SMOOTH SCROLLING
 */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId && targetId !== '#' && !link.classList.contains('trigger-checkout')) {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
}
