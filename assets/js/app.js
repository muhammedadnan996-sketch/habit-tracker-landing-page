// JavaScript Application - Ultimate Habit & Progress Tracker Dashboard (Stripe & Carousel Enabled)

document.addEventListener('DOMContentLoaded', () => {
    initCarousel();
    initReviewCarousel();
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
 * 1.5 REVIEW CAROUSEL
 * Controls the review section slider
 */
function initReviewCarousel() {
    const slidesContainer = document.querySelector('.review-slides');
    const slides = document.querySelectorAll('.review-slide');
    const dotsContainer = document.querySelector('.review-dots');

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
        
        // Calculate offset based on the actual width of a single slide
        const slideWidth = slides[0].offsetWidth;
        slidesContainer.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
        updateDots();
    };

    // Auto-advance slide every 5 seconds
    setInterval(() => {
        goToSlide(currentIndex + 1);
    }, 5000);

    // Re-adjust position on window resize
    window.addEventListener('resize', () => {
        goToSlide(currentIndex);
    });
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
        { name: "Aisha M.", location: "Dubai", time: "1 min ago" },
        { name: "Chen W.", location: "Singapore", time: "3 mins ago" },
        { name: "Mateo R.", location: "Mexico City", time: "4 mins ago" },
        { name: "Fatima Z.", location: "Casablanca", time: "2 mins ago" },
        { name: "Oliver S.", location: "Sydney", time: "5 mins ago" },
        { name: "Priya K.", location: "Mumbai", time: "1 min ago" },
        { name: "Elias N.", location: "Berlin", time: "2 mins ago" },
        { name: "Chloe T.", location: "Paris", time: "4 mins ago" },
        { name: "Hiroshi T.", location: "Tokyo", time: "3 mins ago" },
        { name: "Kwame O.", location: "Accra", time: "6 mins ago" },
        { name: "Elena V.", location: "Madrid", time: "2 mins ago" },
        { name: "Youssef B.", location: "Cairo", time: "4 mins ago" },
        { name: "Isabella G.", location: "Rome", time: "1 min ago" },
        { name: "Wei C.", location: "Shanghai", time: "5 mins ago" },
        { name: "Amir H.", location: "Tehran", time: "3 mins ago" },
        { name: "Sofia P.", location: "Sao Paulo", time: "2 mins ago" },
        { name: "Ivan S.", location: "Moscow", time: "7 mins ago" },
        { name: "Aarav P.", location: "Delhi", time: "1 min ago" },
        { name: "Nia B.", location: "Atlanta", time: "4 mins ago" },
        { name: "Diego M.", location: "Bogota", time: "2 mins ago" },
        { name: "Zara A.", location: "London", time: "5 mins ago" },
        { name: "Lucas F.", location: "Lisbon", time: "3 mins ago" },
        { name: "Hassan I.", location: "Istanbul", time: "1 min ago" },
        { name: "Mei L.", location: "Hong Kong", time: "4 mins ago" },
        { name: "Santiago L.", location: "Buenos Aires", time: "2 mins ago" },
        { name: "Layla M.", location: "Amman", time: "6 mins ago" },
        { name: "Arthur C.", location: "Brussels", time: "3 mins ago" },
        { name: "Riya S.", location: "Bangalore", time: "1 min ago" },
        { name: "Tariq F.", location: "Riyadh", time: "5 mins ago" },
        { name: "Emma H.", location: "Toronto", time: "2 mins ago" },
        { name: "Jin-Woo L.", location: "Seoul", time: "4 mins ago" },
        { name: "Camila D.", location: "Santiago", time: "3 mins ago" },
        { name: "Omar K.", location: "Beirut", time: "1 min ago" },
        { name: "Nina K.", location: "Vienna", time: "6 mins ago" },
        { name: "Arjun D.", location: "Chennai", time: "2 mins ago" },
        { name: "Zoe W.", location: "Auckland", time: "4 mins ago" },
        { name: "Mohammed A.", location: "Doha", time: "3 mins ago" },
        { name: "Eva J.", location: "Stockholm", time: "1 min ago" },
        { name: "Kenji M.", location: "Kyoto", time: "5 mins ago" },
        { name: "Mariam Y.", location: "Kuwait City", time: "2 mins ago" },
        { name: "Felix M.", location: "Zurich", time: "4 mins ago" },
        { name: "Ananya R.", location: "Hyderabad", time: "3 mins ago" },
        { name: "Liam O.", location: "Dublin", time: "1 min ago" },
        { name: "Nour S.", location: "Tunis", time: "6 mins ago" },
        { name: "Valentina O.", location: "Lima", time: "2 mins ago" },
        { name: "Yuki S.", location: "Osaka", time: "4 mins ago" },
        { name: "Ali R.", location: "Karachi", time: "3 mins ago" },
        { name: "Mia L.", location: "Vancouver", time: "1 min ago" },
        { name: "Kofi A.", location: "Nairobi", time: "5 mins ago" },
        { name: "Isla B.", location: "Edinburgh", time: "2 mins ago" }
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

        // Hide after 5 seconds, then wait a random 10-30s before showing the next one
        setTimeout(() => {
            toast.classList.remove('show');
            const nextInterval = Math.floor(Math.random() * (30000 - 10000 + 1) + 10000);
            setTimeout(showToast, nextInterval);
        }, 5000);

        index = (index + 1) % samplePurchases.length;
    };

    setTimeout(() => {
        showToast();
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
