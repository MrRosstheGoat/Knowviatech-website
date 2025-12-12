/**
 * KNOWVIA TECHNOLOGIES - JavaScript
 * Handles animations, navigation, and form validation with EmailJS
 */

// EmailJS Configuration
// Your EmailJS credentials are configured below
const EMAILJS_CONFIG = {
    publicKey: 'eMkHOv0OPSiu_NxWs',
    serviceId: 'service_9o7rmza',
    templateId: 'template_xnfuaqn'
};

document.addEventListener('DOMContentLoaded', () => {
    // Initialize EmailJS
    if (typeof emailjs !== 'undefined') {
        emailjs.init(EMAILJS_CONFIG.publicKey);
    }

    // Initialize all modules
    initNavigation();
    initSmoothScrolling();
    initScrollAnimations();
    initTypingEffect();
    initContactForm();
    initHeaderScroll();
});

/**
 * Navigation Module
 * Handles mobile menu toggle and active link states
 */
function initNavigation() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    const navLinkItems = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close mobile menu when clicking a link
        navLinkItems.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuBtn.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // Update active link on scroll
    const sections = document.querySelectorAll('section[id]');

    const updateActiveLink = () => {
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinkItems.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    window.addEventListener('scroll', updateActiveLink);
    updateActiveLink();
}

/**
 * Smooth Scrolling Module
 * Enables smooth scrolling for anchor links
 */
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const headerOffset = 70;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Scroll Animations Module
 * Uses IntersectionObserver for fade-in animations
 */
function initScrollAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const fadeInObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeElements.forEach(element => {
        fadeInObserver.observe(element);
    });
}

/**
 * Typing Effect Module
 * Creates a typewriter effect for the hero subtitle
 */
function initTypingEffect() {
    const typingText = document.getElementById('typingText');
    const text = "Innovating Intelligence. Automating Tomorrow.";
    let charIndex = 0;
    let isDeleting = false;
    const typingSpeed = 80;
    const deletingSpeed = 40;
    const pauseTime = 3000;

    if (!typingText) return;

    function type() {
        if (!isDeleting) {
            // Typing
            typingText.textContent = text.substring(0, charIndex);
            charIndex++;

            if (charIndex > text.length) {
                // Pause at the end
                setTimeout(() => {
                    isDeleting = true;
                    type();
                }, pauseTime);
                return;
            }

            setTimeout(type, typingSpeed);
        } else {
            // Deleting
            typingText.textContent = text.substring(0, charIndex);
            charIndex--;

            if (charIndex < 0) {
                isDeleting = false;
                charIndex = 0;
                setTimeout(type, 500);
                return;
            }

            setTimeout(type, deletingSpeed);
        }
    }

    // Start typing after a short delay
    setTimeout(type, 1000);
}

/**
 * Contact Form Module
 * Handles form validation and EmailJS submission
 */
function initContactForm() {
    const form = document.getElementById('contactForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const messageError = document.getElementById('messageError');
    const formSuccess = document.getElementById('formSuccess');

    if (!form) return;

    // Validation functions
    const validators = {
        name: (value) => {
            if (!value.trim()) return 'Name is required';
            if (value.trim().length < 2) return 'Name must be at least 2 characters';
            return '';
        },
        email: (value) => {
            if (!value.trim()) return 'Email is required';
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) return 'Please enter a valid email';
            return '';
        },
        message: (value) => {
            if (!value.trim()) return 'Message is required';
            if (value.trim().length < 10) return 'Message must be at least 10 characters';
            return '';
        }
    };

    // Show/hide error
    const showError = (errorElement, message) => {
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.toggle('visible', !!message);
        }
    };

    // Validate field on blur
    const validateField = (input, errorElement, validatorKey) => {
        input.addEventListener('blur', () => {
            const error = validators[validatorKey](input.value);
            showError(errorElement, error);
        });

        // Clear error on focus
        input.addEventListener('focus', () => {
            showError(errorElement, '');
        });
    };

    validateField(nameInput, nameError, 'name');
    validateField(emailInput, emailError, 'email');
    validateField(messageInput, messageError, 'message');

    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Validate all fields
        const nameErrorMsg = validators.name(nameInput.value);
        const emailErrorMsg = validators.email(emailInput.value);
        const messageErrorMsg = validators.message(messageInput.value);

        showError(nameError, nameErrorMsg);
        showError(emailError, emailErrorMsg);
        showError(messageError, messageErrorMsg);

        // Check if form is valid
        if (!nameErrorMsg && !emailErrorMsg && !messageErrorMsg) {
            const submitBtn = form.querySelector('.submit-btn');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>Sending...</span>';

            try {
                // Check if EmailJS is configured
                if (EMAILJS_CONFIG.publicKey === 'YOUR_PUBLIC_KEY') {
                    // EmailJS not configured - show demo success
                    console.log('EmailJS not configured. Form data:', {
                        name: nameInput.value,
                        email: emailInput.value,
                        message: messageInput.value
                    });

                    // Simulate sending delay
                    await new Promise(resolve => setTimeout(resolve, 1500));

                    // Show success message
                    formSuccess.classList.add('visible');
                    form.reset();

                    console.warn('⚠️ EmailJS is not configured. To receive emails, follow the setup instructions in script.js');
                } else {
                    // Send email via EmailJS
                    const templateParams = {
                        from_name: nameInput.value,
                        reply_to: emailInput.value,
                        message: messageInput.value,
                        to_email: 'chitategareth@gmail.com'
                    };

                    await emailjs.send(
                        EMAILJS_CONFIG.serviceId,
                        EMAILJS_CONFIG.templateId,
                        templateParams
                    );

                    // Show success message
                    formSuccess.classList.add('visible');
                    form.reset();
                }
            } catch (error) {
                console.error('Failed to send email:', error);
                alert('Failed to send message. Please try again or email us directly at chitategareth@gmail.com');
            } finally {
                // Reset button
                submitBtn.disabled = false;
                submitBtn.innerHTML = `
                    <span>Send Message</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="22" y1="2" x2="11" y2="13"/>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                    </svg>
                `;

                // Hide success message after 5 seconds
                setTimeout(() => {
                    formSuccess.classList.remove('visible');
                }, 5000);
            }
        }
    });
}

/**
 * Header Scroll Module
 * Adds scrolled class to header on scroll
 */
function initHeaderScroll() {
    const header = document.getElementById('header');

    if (!header) return;

    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
}

/**
 * Glitch Effect (Optional Enhancement)
 * Can be enabled for more dramatic effects
 */
function createGlitchEffect(element) {
    if (!element) return;

    const glitch = () => {
        const randomX = (Math.random() - 0.5) * 4;
        const randomY = (Math.random() - 0.5) * 4;

        element.style.transform = `translate(${randomX}px, ${randomY}px)`;
        element.style.textShadow = `
            ${randomX}px ${randomY}px 0 rgba(255, 0, 0, 0.5),
            ${-randomX}px ${-randomY}px 0 rgba(0, 255, 255, 0.5)
        `;

        setTimeout(() => {
            element.style.transform = 'translate(0, 0)';
            element.style.textShadow = 'none';
        }, 100);
    };

    setInterval(glitch, 3000);
}

// Utility: Throttle function for performance
function throttle(func, limit) {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Utility: Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}
