// Main JavaScript Application File

document.addEventListener('DOMContentLoaded', () => {
    initFAQAccordion();
    initCountdownTimer();
    initMetaPixelEvents();
    initSmoothScroll();
});

/**
 * FAQ Accordion Toggle
 */
function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const header = item.querySelector('.faq-header');
        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all other active items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });

            // Toggle current item
            if (isActive) {
                item.classList.remove('active');
            } else {
                item.classList.add('active');
            }
        });
    });
}

/**
 * High-Urgency Countdown Timer (15 Minutes Scarcity Timer)
 */
function initCountdownTimer() {
    const timerElements = document.querySelectorAll('.countdown-timer');
    if (!timerElements.length) return;

    let timeInSeconds = 14 * 60 + 59; // 14m 59s

    // Check if saved state exists in localStorage
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
            // Reset to 15 mins for fresh view
            timeInSeconds = 14 * 60 + 59;
        }
    };

    updateTimer();
    setInterval(updateTimer, 1000);
}

/**
 * Meta Pixel Integration & Event Dispatcher
 */
function initMetaPixelEvents() {
    const ctaButtons = document.querySelectorAll('.cta-btn');

    ctaButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const buttonText = btn.textContent.trim();
            
            // Trigger Meta Pixel Event if fbq is defined
            if (typeof fbq === 'function') {
                fbq('track', 'InitiateCheckout', {
                    content_name: 'Google Sheet Habit Tracker',
                    content_category: 'Digital Template',
                    value: 9.00,
                    currency: 'USD'
                });
                console.log('[Meta Pixel] Fired InitiateCheckout event');
            } else {
                console.log('[Meta Pixel Placeholder] InitiateCheckout event triggered for: ' + buttonText);
            }
        });
    });
}

/**
 * Smooth Scroll to Pricing
 */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId && targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
}
