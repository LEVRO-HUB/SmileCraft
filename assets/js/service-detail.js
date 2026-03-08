/* ============================================================
   SMILE CRAFT — service-detail.js  (v2 — Fixed)
   Shared interactions for all individual service pages
   ============================================================ */

'use strict';

document.addEventListener('DOMContentLoaded', function () {

  /* ── 1. SCROLL REVEAL ──────────────────────────────────────
     FIX #6: rootMargin unified to -72px (matches all other
     pages) to clear the mobile floating nav bar.
  ────────────────────────────────────────────── */
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    const revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold:  0.10,
      rootMargin: '0px 0px -72px 0px',
    });
    reveals.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ── 2. STICKY HEADER SHADOW ───────────────────────────────
     FIX #9: Added null guard — won't throw if header missing.
  ────────────────────────────────────────────── */
  const header = document.getElementById('site-header');
  if (header) {
    window.addEventListener('scroll', function () {
      header.classList.toggle('scrolled', window.scrollY > 30);
    }, { passive: true });
  }

  /* ── 3. MOBILE MENU ── */
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu    = document.getElementById('mobileMenu');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', function () {
      const isOpen = mobileMenu.classList.toggle('is-open');
      mobileMenuBtn.setAttribute('aria-expanded', String(isOpen));
      const icon = mobileMenuBtn.querySelector('.material-icons');
      if (icon) icon.textContent = isOpen ? 'close' : 'menu';
    });

    mobileMenu.querySelectorAll('.mobile-nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileMenu.classList.remove('is-open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        const icon = mobileMenuBtn.querySelector('.material-icons');
        if (icon) icon.textContent = 'menu';
      });
    });
  }

  /* ── 4. FAQ ACCORDION ──────────────────────────────────────
     FIX #7: Removed unused `answer` variable (dead code).
  ────────────────────────────────────────────── */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function (item) {
    const btn = item.querySelector('.faq-question');
    if (!btn) return;

    btn.addEventListener('click', function () {
      const isOpen = item.classList.contains('open');
      // Close all
      faqItems.forEach(function (fi) {
        fi.classList.remove('open');
        const q = fi.querySelector('.faq-question');
        if (q) q.setAttribute('aria-expanded', 'false');
      });
      // Open clicked if it wasn't already open
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ── 5. NEWSLETTER FORM ────────────────────────────────────
     FIX #10: Uses var(--primary-dark) instead of old
     teal var(--mint-dark) token.
  ────────────────────────────────────────────── */
  const nlForm = document.getElementById('nlForm');
  if (nlForm) {
    nlForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const btn          = nlForm.querySelector('.nl-btn');
      const input        = nlForm.querySelector('.nl-input');
      if (!btn) return;
      const originalText = btn.textContent;

      btn.textContent     = 'Subscribed ✓';
      btn.style.background = 'var(--primary-dark)';
      btn.disabled        = true;

      setTimeout(function () {
        btn.textContent     = originalText;
        btn.style.background = '';
        btn.disabled        = false;
        if (input) nlForm.reset();
      }, 2500);
    });
  }

  /* ── 6. HERO STAT COUNTERS ─────────────────────────────────
     FIX #8: Replaced setInterval with requestAnimationFrame
     for smoother animation and better browser performance.
     Uses cubic ease-out for a more polished feel.
  ────────────────────────────────────────────── */
  const counters = document.querySelectorAll('.hero-stat-num[data-count]');
  if (counters.length) {
    const counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        const el       = entry.target;
        const target   = parseInt(el.dataset.count, 10);
        const suffix   = el.dataset.suffix || '';
        const duration = 1500;
        const startTs  = performance.now();

        function step(now) {
          const progress = Math.min((now - startTs) / duration, 1);
          // Ease-out cubic
          const eased  = 1 - Math.pow(1 - progress, 3);
          const current = Math.floor(eased * target);
          el.textContent = current + suffix;
          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            el.textContent = target + suffix; // ensure exact final value
          }
        }

        requestAnimationFrame(step);
        counterObserver.unobserve(el);
      });
    }, { threshold: 0.5 });

    counters.forEach(function (el) { counterObserver.observe(el); });
  }

  /* ── 7. SMOOTH SCROLL ── */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const headerH = header ? header.offsetHeight : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH - 20;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

});