/* ============================================================
   SMILE CRAFT DENTAL — about.js  (v2 — Fixed)
   ============================================================ */

'use strict';

/* ── SHARED REVEAL OBSERVER ──────────────────────────────────
   Single IntersectionObserver handles ALL .reveal elements
   including .timeline-item (Fix #1 — removed duplicate IO).
   rootMargin accounts for mobile floating nav bar (Fix #13).
──────────────────────────────────────────────────────────── */
const _revealIO = (function () {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return null;

  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    }),
    {
      threshold:  0.10,
      rootMargin: '0px 0px -72px 0px', // clears floating nav on mobile
    }
  );

  els.forEach((el) => io.observe(el));
  return io;
})();

/* ── 1. HEADER SCROLL SHADOW ── */
(function () {
  const header = document.getElementById('site-header');
  if (!header) return;
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 20);
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

  document.addEventListener('click', (e) => {
    if (!btn.contains(e.target) && !menu.contains(e.target)) {
      menu.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
      btn.querySelector('.material-icons').textContent = 'menu';
    }
  });
})();

/* ── 3. ANIMATED STAT COUNTERS ── */
(function () {
  const statEls = document.querySelectorAll('.stat-num[data-target]');
  if (!statEls.length) return;

  const formatNum = (val, target) => {
    if (target >= 25000) return Math.floor(val).toLocaleString('en-IN');
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
      const ease     = 1 - Math.pow(1 - progress, 3);
      const current  = target * ease;
      el.textContent = formatNum(current, target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = formatNum(target, target) + suffix;
    };

    requestAnimationFrame(step);
  };

  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) { animateStat(e.target); io.unobserve(e.target); }
    }),
    { threshold: 0.5 }
  );

  statEls.forEach((el) => io.observe(el));
})();

/* ── 4. TIMELINE ITEM STAGGER ──────────────────────────────
   FIX #1: .timeline-item must NOT also carry .reveal class,
   OR they must not be observed by the shared IO above.
   Solution: timeline items use a dedicated class 'tl-item'
   OR we check they don't have .reveal. We stagger via delay,
   letting the shared IO add .visible, then CSS handles delay.
   Here we just add a CSS stagger delay via JS safely.
──────────────────────────────────────────────────────────── */
(function () {
  const items = document.querySelectorAll('.timeline-item');
  if (!items.length) return;

  // Assign stagger delay so CSS transition fires in sequence
  items.forEach((el, i) => {
    el.style.transitionDelay = `${i * 80}ms`;
  });

  // If timeline items don't have .reveal, observe them separately
  const nonReveal = Array.from(items).filter((el) => !el.classList.contains('reveal'));
  if (!nonReveal.length) return; // handled by shared IO above

  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    }),
    { threshold: 0.15, rootMargin: '0px 0px -72px 0px' }
  );

  nonReveal.forEach((el) => io.observe(el));
})();

/* ── 5. VALUE CARD HOVER TILT ── */
(function () {
  const cards = document.querySelectorAll('.value-card');
  if (!cards.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect  = card.getBoundingClientRect();
      const x     = (e.clientX - rect.left) / rect.width  - 0.5;
      const y     = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `translateY(-6px) rotateX(${y * -8}deg) rotateY(${x * 8}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.5s ease';
      card.style.transform  = '';
      setTimeout(() => { card.style.transition = ''; }, 500);
    });
  });
})();

/* ── 6. TRUST ITEM STAGGER ──────────────────────────────────
   FIX #2: Was setting inline opacity/transform then never
   adding .visible — conflicting with CSS .reveal system.
   Now uses a single IO, adds .visible class (CSS handles it),
   and uses CSS transition-delay for stagger instead of
   setTimeout + inline styles.
──────────────────────────────────────────────────────────── */
(function () {
  const items = document.querySelectorAll('.trust-item');
  if (!items.length) return;

  // Set stagger delay via CSS custom property / inline style
  items.forEach((el, i) => {
    el.style.transitionDelay = `${i * 80}ms`;
  });

  // Only observe if NOT already handled by shared .reveal IO
  const needsObserver = Array.from(items).filter((el) => !el.classList.contains('reveal'));
  if (!needsObserver.length) return;

  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    }),
    { threshold: 0.2, rootMargin: '0px 0px -72px 0px' }
  );

  needsObserver.forEach((el) => io.observe(el));
})();

/* ── 7. STAT CARD ENTRANCE PULSE ── */
(function () {
  const cards = document.querySelectorAll('.stat-card');
  if (!cards.length) return;

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

  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('stat-pulse'); io.unobserve(e.target); }
    }),
    { threshold: 0.4 }
  );

  cards.forEach((el) => io.observe(el));
})();

/* ── 8. SMOOTH SCROLL for anchor links ── */
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

/* ── 9. HERO TRUST PILLS ENTRANCE ──────────────────────────
   FIX #3: Was observing the CONTAINER but pills might be
   above the fold and never re-enter viewport. Now we check
   if container is already visible and fire immediately,
   otherwise observe it.
──────────────────────────────────────────────────────────── */
(function () {
  const pills     = document.querySelectorAll('.trust-pill');
  const container = document.querySelector('.hero-trust-pills');
  if (!pills.length || !container) return;

  // Initial hidden state
  pills.forEach((p) => {
    p.style.opacity    = '0';
    p.style.transform  = 'translateY(12px)';
    p.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
  });

  const fire = () => {
    pills.forEach((pill, i) => {
      setTimeout(() => {
        pill.style.opacity   = '1';
        pill.style.transform = 'translateY(0)';
      }, i * 120);
    });
  };

  // If container is already in the viewport on load, fire immediately
  const rect = container.getBoundingClientRect();
  if (rect.top < window.innerHeight && rect.bottom > 0) {
    setTimeout(fire, 300); // small delay for page paint
    return;
  }

  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) { fire(); io.unobserve(e.target); }
    }),
    { threshold: 0.3 }
  );
  io.observe(container);
})();

/* ── 10. FOUNDER CARD QUOTE HIGHLIGHT ──────────────────────
   FIX #4: Uses var(--primary) instead of var(--mint)
   to match the updated brand colour in style.css.
──────────────────────────────────────────────────────────── */
(function () {
  const quote = document.querySelector('.founder-quote');
  if (!quote) return;

  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) {
        quote.style.borderLeftColor = 'var(--primary)';
        quote.style.borderLeftWidth = '4px';
        quote.style.transition      = 'border 0.5s ease';
        io.unobserve(e.target);
      }
    }),
    { threshold: 0.6 }
  );

  io.observe(quote);
})();

/* ── 11. COLLAGE FLOAT CARD PARALLAX ──────────────────────
   FIX #5: Added cleanup — stops parallax when page is hidden
   and on resize to avoid stale offsets on orientation change.
──────────────────────────────────────────────────────────── */
(function () {
  const floatCard = document.querySelector('.collage-float');
  if (!floatCard || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let ticking = false;
  let active  = true;

  const onScroll = () => {
    if (!active || ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      floatCard.style.transform = `translateY(${-(window.scrollY * 0.06)}px)`;
      ticking = false;
    });
  };

  const onResize = () => {
    // Reset on resize to avoid stuck offset
    floatCard.style.transform = '';
  };

  document.addEventListener('visibilitychange', () => {
    active = !document.hidden;
    if (active) onScroll();
  });

  window.addEventListener('scroll', onScroll,  { passive: true });
  window.addEventListener('resize', onResize,  { passive: true });
})();