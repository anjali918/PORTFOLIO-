/**
 * Portfolio — Anjali Bista
 * Warm Editorial · Refined Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initNavigation();
    initTypingAnimation();
    initScrollReveal();
    initSkillBars();
    initProjectFilter();
    initSmoothScroll();
    initFormValidation();
    initCursorGlow();
    injectDynamicStyles();
    initBackToTop();
});

/* ==========================================================================
   PRELOADER
========================================================================== */
function initPreloader() {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;

    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('hide');
            document.body.classList.remove('loading');
            animateHeroEntrance();
        }, 700);
    });
}

/* ==========================================================================
   HERO ENTRANCE ANIMATION
========================================================================== */
function animateHeroEntrance() {
    const items = [
        { el: document.querySelector('.hero__subtitle'),   delay: 0 },
        { el: document.querySelector('.hero__title'),      delay: 100 },
        { el: document.querySelector('.hero__typing'),     delay: 200 },
        { el: document.querySelector('.hero__description'),delay: 300 },
        { el: document.querySelector('.hero__info'),       delay: 380 },
        { el: document.querySelector('.hero__buttons'),    delay: 460 },
        { el: document.querySelector('.hero__social'),     delay: 540 },
        { el: document.querySelector('.hero__image'),      delay: 180 },
    ];

    items.forEach(({ el, delay }) => {
        if (!el) return;
        el.style.opacity = '0';
        el.style.transform = 'translateY(22px)';
        el.style.transition = 'opacity 0.75s ease, transform 0.75s ease';
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, delay + 100);
    });
}

/* ==========================================================================
   NAVIGATION
========================================================================== */
function initNavigation() {
    const header    = document.getElementById('header');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu   = document.getElementById('nav-menu');
    const navClose  = document.getElementById('nav-close');
    const navLinks  = document.querySelectorAll('.nav__link');
    const sections  = document.querySelectorAll('section[id]');

    // ── Sticky header ──
    const stickyObserver = new IntersectionObserver(
        ([entry]) => header?.classList.toggle('sticky', !entry.isIntersecting),
        { rootMargin: '-72px 0px 0px 0px', threshold: 0 }
    );
    const sentinel = document.querySelector('.hero');
    if (sentinel) stickyObserver.observe(sentinel);

    // ── Mobile menu ──
    navToggle?.addEventListener('click', () => {
        navMenu?.classList.add('open');
        navToggle.setAttribute('aria-expanded', 'true');
    });

    const closeMenu = () => {
        navMenu?.classList.remove('open');
        navToggle?.setAttribute('aria-expanded', 'false');
    };

    navClose?.addEventListener('click', closeMenu);

    // Close on outside click
    document.addEventListener('click', (e) => {
        if (
            navMenu?.classList.contains('open') &&
            !navMenu.contains(e.target) &&
            !navToggle.contains(e.target)
        ) closeMenu();
    });

    navLinks.forEach(link => link.addEventListener('click', closeMenu));

    // ── Active link on scroll ──
    const linkObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.classList.toggle(
                        'active',
                        link.getAttribute('href') === `#${entry.target.id}`
                    );
                });
            }
        });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

    sections.forEach(s => linkObserver.observe(s));
}

/* ==========================================================================
   TYPING ANIMATION
========================================================================== */
function initTypingAnimation() {
    const typedText = document.querySelector('.typed-text');
    if (!typedText) return;

    const phrases = [
        'MERN Stack Developer',
        'Web Developer',
        'Creative Problem Solver',
    ];

    let phraseIndex = 0;
    let charIndex   = 0;
    let isDeleting  = false;

    function tick() {
        const current = phrases[phraseIndex];
        const displayed = current.substring(0, charIndex + (isDeleting ? 0 : 0));

        if (isDeleting) {
            typedText.textContent = current.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typedText.textContent = current.substring(0, charIndex + 1);
            charIndex++;
        }

        let delay = isDeleting ? 45 : 95;

        if (!isDeleting && charIndex === current.length) {
            isDeleting = true;
            delay = 2200;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            delay = 420;
        }

        setTimeout(tick, delay);
    }

    setTimeout(tick, 1400);
}

/* ==========================================================================
   SCROLL REVEAL — Intersection Observer
========================================================================== */
function initScrollReveal() {
    const revealEls = document.querySelectorAll(
        '.service-card, .project-card, .timeline-content, ' +
        '.about__image, .about__content, .skills__content, ' +
        '.professional-skills, .contact__info, .contact__form, ' +
        '.section__header'
    );

    const reveal = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (!entry.isIntersecting) return;
            // Stagger siblings that appear together
            const delay = [...revealEls].indexOf(entry.target) % 4 * 80;
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, delay);
            reveal.unobserve(entry.target);
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => {
        el.classList.add('will-reveal');
        reveal.observe(el);
    });
}

/* ==========================================================================
   SKILL BARS
========================================================================== */
function initSkillBars() {
    const bars = document.querySelectorAll('.skill-progress');

    bars.forEach(bar => {
        const pct = bar.dataset.percent || '0';
        bar.style.setProperty('--target-width', `${pct}%`);
        bar.style.width = '0';
    });

    // Animate when skills section enters viewport
    const skillsSection = document.querySelector('.skills');
    if (!skillsSection) return;

    let animated = false;
    const obs = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting && !animated) {
            animated = true;
            bars.forEach((bar, i) => {
                setTimeout(() => {
                    bar.style.transition = 'width 1.1s cubic-bezier(0.4, 0, 0.2, 1)';
                    bar.style.width = bar.style.getPropertyValue('--target-width');
                }, i * 130);
            });

            // Animate conic-gradient circles
            document.querySelectorAll('.progress-circle').forEach((circle, i) => {
                const pct = parseFloat(circle.dataset.percent || '0');
                const deg = (pct / 100) * 360;
                setTimeout(() => {
                    circle.style.transition = 'background 1s ease';
                    circle.style.background =
                        `conic-gradient(var(--primary-color) 0deg, var(--primary-color) ${deg}deg, var(--warm-cream) ${deg}deg)`;
                }, i * 180);
            });
        }
    }, { threshold: 0.25 });

    obs.observe(skillsSection);
}

/* ==========================================================================
   PROJECT FILTER — no dependencies
========================================================================== */
function initProjectFilter() {
    const grid    = document.querySelector('.projects__grid');
    const buttons = document.querySelectorAll('.filter-btn');
    if (!grid || !buttons.length) return;

    const cards = [...grid.querySelectorAll('.project-card')];

    buttons.forEach(btn => {
        btn.addEventListener('click', function () {
            buttons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const filter = this.dataset.filter || 'all';

            cards.forEach(card => {
                const match = filter === 'all' || card.dataset.category === filter;

                card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

                if (match) {
                    card.style.opacity   = '1';
                    card.style.transform = 'scale(1)';
                    card.style.display   = '';
                } else {
                    card.style.opacity   = '0';
                    card.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        if (card.style.opacity === '0') card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

/* ==========================================================================
   SMOOTH SCROLL
========================================================================== */
function initSmoothScroll() {
    const headerH = () => document.querySelector('.header')?.offsetHeight || 72;

    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href || href === '#') return;
            const target = document.querySelector(href);
            if (!target) return;
            e.preventDefault();
            window.scrollTo({
                top: target.offsetTop - headerH(),
                behavior: 'smooth'
            });
        });
    });
}

/* ==========================================================================
   FORM VALIDATION
========================================================================== */
function initFormValidation() {
    const form = document.querySelector('.contact__form');
    if (!form) return;

    const inputs = form.querySelectorAll('input, textarea');

    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function validate(input) {
        const v = input.value.trim();
        let ok = true;

        if (input.hasAttribute('required') && !v) ok = false;
        if (input.type === 'email' && v && !emailRx.test(v)) ok = false;

        input.classList.toggle('field-error', !ok);
        input.classList.toggle('field-ok',    ok && v.length > 0);
        return ok;
    }

    inputs.forEach(input => {
        input.addEventListener('blur',  () => validate(input));
        input.addEventListener('input', () => {
            if (input.classList.contains('field-error')) validate(input);
        });
    });

    form.addEventListener('submit', function (e) {
        const valid = [...inputs].every(validate);
        if (!valid) { e.preventDefault(); return; }

        const btn = form.querySelector('button[type="submit"]');
        if (!btn) return;

        const original = btn.innerHTML;
        btn.innerHTML  = '<i class="bx bx-loader-alt spin-icon"></i> Sending…';
        btn.disabled   = true;

        setTimeout(() => {
            btn.innerHTML = '<i class="bx bx-check"></i> Sent!';
            setTimeout(() => {
                btn.innerHTML = original;
                btn.disabled  = false;
                form.reset();
                inputs.forEach(i => i.classList.remove('field-ok', 'field-error'));
            }, 2000);
        }, 2000);
    });
}

/* ==========================================================================
   SUBTLE CURSOR GLOW (desktop only)
========================================================================== */
function initCursorGlow() {
    if (window.matchMedia('(pointer: coarse)').matches) return; // skip touch

    const glow = document.createElement('div');
    glow.id = 'cursor-glow';
    document.body.appendChild(glow);

    let mx = -200, my = -200;
    let cx = -200, cy = -200;
    let raf;

    document.addEventListener('mousemove', e => {
        mx = e.clientX;
        my = e.clientY;
    });

    function loop() {
        cx += (mx - cx) * 0.1;
        cy += (my - cy) * 0.1;
        glow.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
        raf = requestAnimationFrame(loop);
    }
    loop();

    // Expand on interactive elements
    document.querySelectorAll('a, button, .project-card, .service-card').forEach(el => {
        el.addEventListener('mouseenter', () => glow.classList.add('expanded'));
        el.addEventListener('mouseleave', () => glow.classList.remove('expanded'));
    });
}

/* ==========================================================================
   BACK TO TOP
========================================================================== */
function initBackToTop() {
    const btn = document.querySelector('.back-to-top');
    if (!btn) return;

    btn.style.opacity   = '0';
    btn.style.transform = 'translateY(16px)';
    btn.style.transition = 'opacity 0.35s ease, transform 0.35s ease';

    window.addEventListener('scroll', () => {
        const show = window.scrollY > 400;
        btn.style.opacity   = show ? '1' : '0';
        btn.style.transform = show ? 'translateY(0)' : 'translateY(16px)';
        btn.style.pointerEvents = show ? 'auto' : 'none';
    }, { passive: true });
}

/* ==========================================================================
   DYNAMIC STYLES — injected at runtime
========================================================================== */
function injectDynamicStyles() {
    const css = `
        /* Scroll-reveal base state */
        .will-reveal {
            opacity: 0;
            transform: translateY(22px);
            transition: opacity 0.65s ease, transform 0.65s ease;
        }
        .will-reveal.visible {
            opacity: 1;
            transform: translateY(0);
        }

        /* Hero entrance base */
        .hero__subtitle,
        .hero__title,
        .hero__typing,
        .hero__description,
        .hero__info,
        .hero__buttons,
        .hero__social,
        .hero__image {
            will-change: opacity, transform;
        }

        /* Form field states */
        .contact__form input.field-error,
        .contact__form textarea.field-error {
            border-color: #C05C5C !important;
            animation: shake 0.32s ease;
        }
        .contact__form input.field-ok,
        .contact__form textarea.field-ok {
            border-color: #7BAE7F !important;
        }

        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25%       { transform: translateX(-5px); }
            75%       { transform: translateX(5px); }
        }

        /* Loader spin */
        .spin-icon {
            display: inline-block;
            animation: spinIcon 0.9s linear infinite;
        }
        @keyframes spinIcon {
            to { transform: rotate(360deg); }
        }

        /* Cursor glow */
        #cursor-glow {
            position: fixed;
            top: 0; left: 0;
            width: 260px; height: 260px;
            border-radius: 50%;
            background: radial-gradient(
                circle,
                rgba(200, 118, 58, 0.07) 0%,
                transparent 70%
            );
            pointer-events: none;
            z-index: 9998;
            transition: width 0.4s ease, height 0.4s ease, opacity 0.4s ease;
            will-change: transform;
        }
        #cursor-glow.expanded {
            width: 400px;
            height: 400px;
            background: radial-gradient(
                circle,
                rgba(200, 118, 58, 0.055) 0%,
                transparent 70%
            );
        }
    `;

    const tag = document.createElement('style');
    tag.textContent = css;
    document.head.appendChild(tag);
}

/* ==========================================================================
   CONSOLE GREETING
========================================================================== */
console.log(
    '%c✦ Anjali Bista',
    'color: #C8763A; font-family: Georgia, serif; font-size: 18px; font-style: italic;'
);
console.log(
    '%cPortfolio · Built with craft & intention.',
    'color: #9E9082; font-size: 11px; font-family: monospace;'
);