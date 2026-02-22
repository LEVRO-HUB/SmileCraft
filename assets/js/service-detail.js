/* ============================================================
   SMILE CRAFT — service-detail.js
   Shared interactions for all individual service pages
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── SCROLL REVEAL ── */
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

  reveals.forEach(el => revealObserver.observe(el));

  /* ── STICKY HEADER SHADOW ── */
  const header = document.getElementById('site-header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 30);
  }, { passive: true });

  /* ── MOBILE MENU ── */
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu    = document.getElementById('mobileMenu');

  mobileMenuBtn?.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('is-open');
    mobileMenuBtn.setAttribute('aria-expanded', isOpen);
    mobileMenuBtn.querySelector('.material-icons').textContent = isOpen ? 'close' : 'menu';
  });

  /* ── FAQ ACCORDION ── */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const btn    = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    btn?.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      // close all
      faqItems.forEach(fi => {
        fi.classList.remove('open');
        fi.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
      });
      // open clicked if it wasn't open
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ── NEWSLETTER FORM ── */
  const nlForm = document.getElementById('nlForm');
  nlForm?.addEventListener('submit', e => {
    e.preventDefault();
    const btn = nlForm.querySelector('.nl-btn');
    const originalText = btn.textContent;
    btn.textContent = 'Subscribed ✓';
    btn.style.background = 'var(--mint-dark)';
    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = '';
      nlForm.reset();
    }, 2500);
  });

  /* ── COUNTER ANIMATION for hero stats ── */
  const counters = document.querySelectorAll('.hero-stat-num[data-count]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el     = entry.target;
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || '';
        const duration = 1500;
        const step   = target / (duration / 16);
        let current  = 0;
        const timer  = setInterval(() => {
          current = Math.min(current + step, target);
          el.textContent = Math.floor(current) + suffix;
          if (current >= target) clearInterval(timer);
        }, 16);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => counterObserver.observe(el));

});