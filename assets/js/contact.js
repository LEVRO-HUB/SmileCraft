/* ============================================================
   SMILE CRAFT DENTAL — contact.js
   Contact Us Page JavaScript
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

/* ── 3. SCROLL REVEAL ── */
(function () {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    }),
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  els.forEach((el) => io.observe(el));
})();

/* ── 4. HERO PILL ENTRANCE ── */
(function () {
  const pills = document.querySelectorAll('.contact-pill');
  pills.forEach((pill, i) => {
    pill.style.opacity   = '0';
    pill.style.transform = 'translateY(10px)';
    pill.style.transition = `opacity .4s ease ${i * 110 + 350}ms, transform .4s ease ${i * 110 + 350}ms`;
    requestAnimationFrame(() => setTimeout(() => {
      pill.style.opacity = '1'; pill.style.transform = 'translateY(0)';
    }, 50));
  });
})();

/* ── 5. QUICK CONTACT BUTTONS — stagger entrance ── */
(function () {
  const btns = document.querySelectorAll('.quick-contact-btn');
  btns.forEach((btn, i) => {
    btn.style.opacity   = '0';
    btn.style.transform = 'translateX(20px)';
    btn.style.transition = `opacity .45s ease ${i * 120 + 200}ms, transform .45s ease ${i * 120 + 200}ms`;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          btn.style.opacity = '1'; btn.style.transform = 'translateX(0)';
          io.unobserve(btn);
        }
      });
    }, { threshold: 0.3 });
    io.observe(btn);
  });
})();

/* ── 6. BRANCH CARD map zoom on hover ── */
(function () {
  document.querySelectorAll('.branch-card').forEach((card) => {
    const iframe = card.querySelector('iframe');
    if (!iframe) return;
    card.addEventListener('mouseenter', () => { iframe.style.transform = 'scale(1.04)'; iframe.style.transition = 'transform .4s ease'; });
    card.addEventListener('mouseleave', () => { iframe.style.transform = 'scale(1)'; });
  });
})();

/* ── 7. FAQ STRIP — stagger on scroll ── */
(function () {
  const items = document.querySelectorAll('.faq-strip-item');
  if (!items.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        const idx = Array.from(items).indexOf(e.target);
        setTimeout(() => e.target.classList.add('visible'), idx * 80);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  items.forEach((el) => io.observe(el));
})();

/* ── 8. CONTACT DETAIL items stagger ── */
(function () {
  const items = document.querySelectorAll('.contact-detail-item');
  if (!items.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        const idx = Array.from(items).indexOf(e.target);
        setTimeout(() => { e.target.style.opacity = '1'; e.target.style.transform = 'translateX(0)'; }, idx * 80);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });
  items.forEach((el) => {
    el.style.opacity = '0'; el.style.transform = 'translateX(-14px)';
    el.style.transition = 'opacity .45s ease, transform .45s ease';
    io.observe(el);
  });
})();

/* ── 9. REAL-TIME FORM VALIDATION ── */
const validators = {
  cpName    : { test: (v) => v.trim().length >= 2,                              msg: 'Please enter your full name.',            errId: 'err-name'    },
  cpEmail   : { test: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),       msg: 'Please enter a valid email address.',      errId: 'err-email'   },
  cpSubject : { test: (v) => v !== '',                                           msg: 'Please select a subject.',                errId: 'err-subject' },
  cpMessage : { test: (v) => v.trim().length >= 10,                             msg: 'Please write at least 10 characters.',    errId: 'err-message' },
};

Object.entries(validators).forEach(([id, { test, msg, errId }]) => {
  const el = document.getElementById(id);
  if (!el) return;
  const validate = () => {
    if (!el.value && el.tagName !== 'SELECT') return;
    if (test(el.value)) {
      clearErr(errId); el.classList.remove('input-error'); el.classList.add('input-success');
    } else {
      showErr(errId, msg); el.classList.add('input-error'); el.classList.remove('input-success');
    }
  };
  el.addEventListener('blur', validate);
  el.addEventListener('input', () => { if (el.classList.contains('input-error')) validate(); });
});

/* ── 10. FORM SUBMISSION ── */
(function () {
  const form      = document.getElementById('contactForm');
  const success   = document.getElementById('contactSuccess');
  const formTop   = document.querySelector('.contact-form-top');
  const submitBtn = document.getElementById('contactSubmitBtn');

  if (!form || !success) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let valid = true;
    Object.entries(validators).forEach(([id, { test, msg, errId }]) => {
      const el = document.getElementById(id);
      if (!el) return;
      if (!test(el.value)) {
        showErr(errId, msg); el.classList.add('input-error'); el.classList.remove('input-success'); valid = false;
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

    setTimeout(() => {
      form.classList.add('is-hidden');
      if (formTop) formTop.classList.add('is-hidden');
      success.classList.add('is-shown');
      success.scrollIntoView({ behavior: 'smooth', block: 'start' });
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
    }, 1600);
  });
})();

/* ── 11. INPUT FOCUS GLOW ── */
(function () {
  document.querySelectorAll('.form-input').forEach((input) => {
    const wrap = input.closest('.input-wrap');
    if (!wrap) return;
    input.addEventListener('focus',  () => wrap.classList.add('focused'));
    input.addEventListener('blur',   () => wrap.classList.remove('focused'));
  });
  const style = document.createElement('style');
  style.textContent = `.input-wrap.focused .input-icon { color: var(--mint-dark) !important; }`;
  document.head.appendChild(style);
})();

/* ── 12. SHAKE + STEP DONE STYLES injected ── */
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
function showErr(errId, msg) {
  const el = document.getElementById(errId); if (el) el.textContent = msg;
}
function clearErr(errId) {
  const el = document.getElementById(errId); if (el) el.textContent = '';
}

/* ── 14. CONTACT DETAIL hover ripple ── */
(function () {
  document.querySelectorAll('.contact-detail-item').forEach((item) => {
    item.addEventListener('mouseenter', () => {
      const icon = item.querySelector('.contact-detail-icon');
      if (icon) { icon.style.transform = 'scale(1.15) rotate(-5deg)'; icon.style.transition = 'transform .3s ease'; }
    });
    item.addEventListener('mouseleave', () => {
      const icon = item.querySelector('.contact-detail-icon');
      if (icon) { icon.style.transform = ''; }
    });
  });
})();

/* ── 15. BRANCH CARDS — stagger entrance ── */
(function () {
  const cards = document.querySelectorAll('.branch-card');
  if (!cards.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        const idx = Array.from(cards).indexOf(e.target);
        setTimeout(() => { e.target.style.opacity = '1'; e.target.style.transform = 'translateY(0)'; }, idx * 120);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  cards.forEach((card) => {
    card.style.opacity = '0'; card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity .55s ease, transform .55s ease';
    io.observe(card);
  });
})();