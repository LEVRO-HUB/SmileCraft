/* ============================================================
   SMILE CRAFT DENTAL — about.js
   About Us Page JavaScript
   ============================================================ */

'use strict';

/* ── 1. HEADER SCROLL SHADOW ── */
(function () {
  const header = document.getElementById('site-header');
  if (!header) return;
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ── 2. MOBILE MENU TOGGLE ── */
(function () {
  const btn  = document.getElementById('mobileMenuBtn');
  const menu = document.getElementById('mobileMenu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', String(isOpen));
    btn.querySelector('.material-icons').textContent = isOpen ? 'close' : 'menu';
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!btn.contains(e.target) && !menu.contains(e.target)) {
      menu.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
      btn.querySelector('.material-icons').textContent = 'menu';
    }
  });
})();

/* ── 3. SCROLL REVEAL ── */
(function () {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  els.forEach((el) => io.observe(el));
})();

/* ── 4. ANIMATED STAT COUNTERS ── */
(function () {
  const statEls = document.querySelectorAll('.stat-num[data-target]');
  if (!statEls.length) return;

  const formatNum = (val, target) => {
    if (target >= 1000) {
      return val >= 1000 ? (val / 1000).toFixed(val % 1000 === 0 ? 0 : 1) + 'K' : Math.floor(val).toLocaleString('en-IN');
    }
    if (Number.isInteger(target)) return Math.floor(val);
    return val.toFixed(1);
  };

  const animateStat = (el) => {
    const target   = parseFloat(el.dataset.target);
    const suffix   = el.dataset.suffix || '';
    const duration = 2000;
    const start    = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = target * ease;

      if (target >= 25000) {
        el.textContent = Math.floor(current).toLocaleString('en-IN') + suffix;
      } else {
        el.textContent = formatNum(current, target) + suffix;
      }

      if (progress < 1) requestAnimationFrame(step);
      else {
        el.textContent = target >= 25000
          ? target.toLocaleString('en-IN') + suffix
          : formatNum(target, target) + suffix;
      }
    };

    requestAnimationFrame(step);
  };

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateStat(entry.target);
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  statEls.forEach((el) => io.observe(el));
})();

/* ── 5. TIMELINE ITEM STAGGER ── */
(function () {
  const items = document.querySelectorAll('.timeline-item');
  if (!items.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // small extra delay per item for stagger
          const idx = Array.from(items).indexOf(entry.target);
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, idx * 80);
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  items.forEach((el) => io.observe(el));
})();

/* ── 6. VALUE CARD HOVER TILT ── */
(function () {
  const cards = document.querySelectorAll('.value-card');
  if (!cards.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const x      = (e.clientX - rect.left) / rect.width  - 0.5;
      const y      = (e.clientY - rect.top)  / rect.height - 0.5;
      const tiltX  = y * -8;
      const tiltY  = x *  8;
      card.style.transform = `translateY(-6px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s ease';
      setTimeout(() => { card.style.transition = ''; }, 500);
    });
  });
})();

/* ── 7. TRUST ITEM STAGGER ON SCROLL ── */
(function () {
  const items = document.querySelectorAll('.trust-item');
  if (!items.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const idx = Array.from(items).indexOf(entry.target);
          setTimeout(() => {
            entry.target.style.opacity  = '1';
            entry.target.style.transform = 'translateX(0)';
          }, idx * 80);
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  items.forEach((el) => {
    el.style.opacity   = '0';
    el.style.transform = 'translateX(-16px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    io.observe(el);
  });
})();

/* ── 8. STAT CARD ENTRANCE PULSE ── */
(function () {
  const cards = document.querySelectorAll('.stat-card');
  if (!cards.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('stat-pulse');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );

  // Add keyframe via JS-injected style
  const style = document.createElement('style');
  style.textContent = `
    @keyframes statPulse {
      0%   { transform: scale(1); }
      50%  { transform: scale(1.04); }
      100% { transform: scale(1); }
    }
    .stat-pulse { animation: statPulse 0.5s ease-out; }
  `;
  document.head.appendChild(style);

  cards.forEach((el) => io.observe(el));
})();

/* ── 9. SMOOTH SCROLL for anchor links ── */
(function () {
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();

/* ── 10. HERO TRUST PILLS ENTRANCE ── */
(function () {
  const pills = document.querySelectorAll('.trust-pill');
  if (!pills.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          pills.forEach((pill, i) => {
            setTimeout(() => {
              pill.style.opacity   = '1';
              pill.style.transform = 'translateY(0)';
            }, i * 120);
          });
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  pills.forEach((p) => {
    p.style.opacity   = '0';
    p.style.transform = 'translateY(12px)';
    p.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
  });

  const container = document.querySelector('.hero-trust-pills');
  if (container) io.observe(container);
})();

/* ── 11. FOUNDER CARD QUOTE HIGHLIGHT ── */
(function () {
  const quote = document.querySelector('.founder-quote');
  if (!quote) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          quote.style.borderLeftColor = 'var(--mint)';
          quote.style.borderLeftWidth = '4px';
          quote.style.transition = 'border 0.5s ease';
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );

  io.observe(quote);
})();

/* ── 12. COLLAGE FLOAT CARD PARALLAX ── */
(function () {
  const floatCard = document.querySelector('.collage-float');
  if (!floatCard || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const scrollY = window.scrollY;
      const offset  = scrollY * 0.06;
      floatCard.style.transform = `translateY(${-offset}px)`;
      ticking = false;
    });
  }, { passive: true });
})();