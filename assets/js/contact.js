/* ============================================================
   SMILE CRAFT DENTAL — contact.js  (v2 — Fixed)
   ============================================================ */

'use strict';

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

/* ── 3. SCROLL REVEAL ──────────────────────────────────────
   FIX #13: rootMargin bottom offset accounts for mobile
   floating nav bar (88px safe zone).
──────────────────────────────────────────────────────────── */
(function () {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    }),
    { threshold: 0.10, rootMargin: '0px 0px -72px 0px' }
  );
  els.forEach((el) => io.observe(el));
})();

/* ── 4. HERO PILL ENTRANCE ── */
(function () {
  const pills = document.querySelectorAll('.contact-pill');
  if (!pills.length) return;

  pills.forEach((pill, i) => {
    pill.style.opacity    = '0';
    pill.style.transform  = 'translateY(10px)';
    pill.style.transition = `opacity .4s ease ${i * 110 + 350}ms, transform .4s ease ${i * 110 + 350}ms`;
  });

  // Fire after a short paint delay
  requestAnimationFrame(() => setTimeout(() => {
    pills.forEach((pill) => { pill.style.opacity = '1'; pill.style.transform = 'translateY(0)'; });
  }, 100));
})();

/* ── 5. QUICK CONTACT BUTTONS — stagger entrance ──────────
   FIX #8: Was creating one IntersectionObserver PER button
   inside a forEach loop. Now uses a single shared IO.
──────────────────────────────────────────────────────────── */
(function () {
  const btns = document.querySelectorAll('.quick-contact-btn');
  if (!btns.length) return;

  btns.forEach((btn, i) => {
    btn.style.opacity    = '0';
    btn.style.transform  = 'translateX(20px)';
    btn.style.transition = `opacity .45s ease ${i * 120}ms, transform .45s ease ${i * 120}ms`;
  });

  // Single IO for all buttons
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.style.opacity   = '1';
        e.target.style.transform = 'translateX(0)';
        io.unobserve(e.target);
      }
    }),
    { threshold: 0.3 }
  );

  btns.forEach((btn) => io.observe(btn));
})();

/* ── 6. BRANCH CARD MAP ZOOM ON HOVER ── */
(function () {
  document.querySelectorAll('.branch-card').forEach((card) => {
    const iframe = card.querySelector('iframe');
    if (!iframe) return;
    iframe.style.transition = 'transform .4s ease'; // set once, not on every event
    card.addEventListener('mouseenter', () => { iframe.style.transform = 'scale(1.04)'; });
    card.addEventListener('mouseleave', () => { iframe.style.transform = 'scale(1)'; });
  });
})();

/* ── 7. FAQ STRIP — stagger on scroll ── */
(function () {
  const items = document.querySelectorAll('.faq-strip-item');
  if (!items.length) return;

  items.forEach((el, i) => { el.style.transitionDelay = `${i * 80}ms`; });

  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    }),
    { threshold: 0.15, rootMargin: '0px 0px -72px 0px' }
  );
  items.forEach((el) => io.observe(el));
})();

/* ── 8. CONTACT DETAIL ITEMS STAGGER ── */
(function () {
  const items = document.querySelectorAll('.contact-detail-item');
  if (!items.length) return;

  items.forEach((el, i) => {
    el.style.opacity         = '0';
    el.style.transform       = 'translateX(-14px)';
    el.style.transition      = `opacity .45s ease ${i * 80}ms, transform .45s ease ${i * 80}ms`;
  });

  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.style.opacity   = '1';
        e.target.style.transform = 'translateX(0)';
        io.unobserve(e.target);
      }
    }),
    { threshold: 0.2, rootMargin: '0px 0px -72px 0px' }
  );
  items.forEach((el) => io.observe(el));
})();

/* ── 9. REAL-TIME FORM VALIDATION ── */
const _contactValidators = {
  cpName    : { test: (v) => v.trim().length >= 2,                              msg: 'Please enter your full name.',         errId: 'err-name'    },
  cpEmail   : { test: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),       msg: 'Please enter a valid email address.',  errId: 'err-email'   },
  cpSubject : { test: (v) => v !== '',                                           msg: 'Please select a subject.',             errId: 'err-subject' },
  cpMessage : { test: (v) => v.trim().length >= 10,                             msg: 'Please write at least 10 characters.', errId: 'err-message' },
};

Object.entries(_contactValidators).forEach(([id, { test, msg, errId }]) => {
  const el = document.getElementById(id);
  if (!el) return;
  const validate = () => {
    if (!el.value) return;
    if (test(el.value)) {
      _clearErr(errId); el.classList.remove('input-error'); el.classList.add('input-success');
    } else {
      _showErr(errId, msg); el.classList.add('input-error'); el.classList.remove('input-success');
    }
  };
  el.addEventListener('blur', validate);
  el.addEventListener('input', () => { if (el.classList.contains('input-error')) validate(); });
});

/* ── 10. CONTACT FORM SUBMISSION ───────────────────────────
   FIX #10: Form now submits to Google Sheets via the same
   Apps Script URL used in book.js. Source tagged 'contact-page'.
──────────────────────────────────────────────────────────── */
(function () {
  // ★ Keep in sync with book.js / index.js
  const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbycgnGu6yry59NWWGaSKcOKpnilW6VcFO2OVWYIaFQIV8zR6o1Mzeab6L-viV0thVMp/exec';

  const form      = document.getElementById('contactForm');
  const success   = document.getElementById('contactSuccess');
  const formTop   = document.querySelector('.contact-form-top');
  const submitBtn = document.getElementById('contactSubmitBtn');

  if (!form || !success) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validate
    let valid = true;
    Object.entries(_contactValidators).forEach(([id, { test, msg, errId }]) => {
      const el = document.getElementById(id);
      if (!el) return;
      if (!test(el.value)) {
        _showErr(errId, msg);
        el.classList.add('input-error');
        el.classList.remove('input-success');
        valid = false;
      }
    });

    if (!valid) {
      const firstErr = form.querySelector('.input-error');
      if (firstErr) firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
      submitBtn.classList.add('shake');
      setTimeout(() => submitBtn.classList.remove('shake'), 600);
      return;
    }

    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    // Collect data
    const data = {
      ref:     'SC-MSG-' + Math.floor(100000 + Math.random() * 900000),
      source:  'contact-page',
      fullName: (document.getElementById('cpName')    || {}).value || '',
      email:    (document.getElementById('cpEmail')   || {}).value || '',
      phone:    (document.getElementById('cpPhone')   || {}).value || '',
      service:  (document.getElementById('cpSubject') || {}).value || '',
      notes:    (document.getElementById('cpMessage') || {}).value || '',
      // fill unused booking fields with blanks
      branch: '', date: '', timeSlot: '', insurance: '', age: '',
      emi: false, whatsapp: false,
    };

    try {
      await fetch(APPS_SCRIPT_URL, {
        method:  'POST',
        mode:    'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body:    JSON.stringify(data),
      });
    } catch (err) {
      console.warn('Contact form Sheets error (non-critical):', err);
    }

    // Show success
    form.classList.add('is-hidden');
    if (formTop) formTop.classList.add('is-hidden');
    success.classList.add('is-shown');
    success.scrollIntoView({ behavior: 'smooth', block: 'start' });

    submitBtn.classList.remove('loading');
    submitBtn.disabled = false;
  });
})();

/* ── 11. INPUT FOCUS GLOW ── */
(function () {
  document.querySelectorAll('.form-input').forEach((input) => {
    const wrap = input.closest('.input-wrap');
    if (!wrap) return;
    input.addEventListener('focus', () => wrap.classList.add('focused'));
    input.addEventListener('blur',  () => wrap.classList.remove('focused'));
  });
  const style = document.createElement('style');
  style.textContent = `.input-wrap.focused .input-icon { color: var(--primary) !important; }`;
  document.head.appendChild(style);
})();

/* ── 12. SHAKE STYLE ── */
(function () {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%,100% { transform: translateX(0); }
      20%      { transform: translateX(-6px); }
      40%      { transform: translateX(6px); }
      60%      { transform: translateX(-4px); }
      80%      { transform: translateX(4px); }
    }
    .shake { animation: shake 0.5s ease; }
  `;
  document.head.appendChild(style);
})();

/* ── 13. HELPER FUNCTIONS ── */
function _showErr(errId, msg) {
  const el = document.getElementById(errId); if (el) el.textContent = msg;
}
function _clearErr(errId) {
  const el = document.getElementById(errId); if (el) el.textContent = '';
}

/* ── 14. CONTACT DETAIL HOVER RIPPLE ── */
(function () {
  document.querySelectorAll('.contact-detail-item').forEach((item) => {
    const icon = item.querySelector('.contact-detail-icon');
    if (!icon) return;
    icon.style.transition = 'transform .3s ease';
    item.addEventListener('mouseenter', () => { icon.style.transform = 'scale(1.15) rotate(-5deg)'; });
    item.addEventListener('mouseleave', () => { icon.style.transform = ''; });
  });
})();

/* ── 15. BRANCH CARDS — stagger entrance ───────────────────
   FIX #9: Removed opacity:0 from branch cards in this block
   since section 6 (iframe hover) already touches those same
   elements. Using CSS .reveal class instead for entrance —
   just assign stagger delays here.
──────────────────────────────────────────────────────────── */
(function () {
  const cards = document.querySelectorAll('.branch-card');
  if (!cards.length) return;

  // If branch cards have .reveal class, the shared IO handles them.
  // We just add stagger delays here.
  cards.forEach((card, i) => {
    card.style.transitionDelay = `${i * 120}ms`;
  });

  // For cards WITHOUT .reveal, do a lightweight entrance
  const needsObserver = Array.from(cards).filter((c) => !c.classList.contains('reveal'));
  if (!needsObserver.length) return;

  needsObserver.forEach((card) => {
    card.style.opacity    = '0';
    card.style.transform  = 'translateY(20px)';
    card.style.transition = `opacity .55s ease, transform .55s ease`;
  });

  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.style.opacity   = '1';
        e.target.style.transform = 'translateY(0)';
        io.unobserve(e.target);
      }
    }),
    { threshold: 0.15, rootMargin: '0px 0px -72px 0px' }
  );

  needsObserver.forEach((card) => io.observe(card));
})();