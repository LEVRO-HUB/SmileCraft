/* ============================================================
   SMILE CRAFT DENTAL — book.js
   Book Appointment Page JavaScript
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
    (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } }),
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  els.forEach((el) => io.observe(el));
})();

/* ── 4. SET MIN DATE on date input to today ── */
(function () {
  const dateInput = document.getElementById('bkDate');
  if (!dateInput) return;
  const today = new Date();
  // Skip Sundays — find next valid day
  let d = new Date(today);
  if (d.getDay() === 0) d.setDate(d.getDate() + 1); // If today is Sunday, start from Monday
  const pad = (n) => String(n).padStart(2, '0');
  dateInput.min = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

  // Disable Sundays in date picker via JS validation
  dateInput.addEventListener('change', () => {
    const selected = new Date(dateInput.value + 'T00:00:00');
    if (selected.getDay() === 0) {
      showFieldError('err-date', 'We are closed on Sundays. Please select another day.');
      dateInput.classList.add('input-error');
    } else {
      clearFieldError('err-date');
      dateInput.classList.remove('input-error');
      dateInput.classList.add('input-success');
    }
  });
})();

/* ── 5. REAL-TIME INPUT VALIDATION ── */
(function () {
  const rules = {
    bkFullName : { el: document.getElementById('bkFullName'),  errId: 'err-name',    test: (v) => v.trim().length >= 2,                              msg: 'Please enter your full name (min 2 characters).' },
    bkEmail    : { el: document.getElementById('bkEmail'),     errId: 'err-email',   test: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),       msg: 'Please enter a valid email address.' },
    bkPhone    : { el: document.getElementById('bkPhone'),     errId: 'err-phone',   test: (v) => /^[\d\s\+\-\(\)]{7,15}$/.test(v.trim()),           msg: 'Please enter a valid phone number.' },
    bkBranch   : { el: document.getElementById('bkBranch'),    errId: 'err-branch',  test: (v) => v !== '',                                           msg: 'Please select a branch.' },
    bkDate     : { el: document.getElementById('bkDate'),      errId: 'err-date',    test: (v) => v !== '' && new Date(v + 'T00:00:00').getDay() !== 0, msg: 'Please select a valid date (not Sunday).' },
    bkService  : { el: document.getElementById('bkService'),   errId: 'err-service', test: (v) => v !== '',                                           msg: 'Please select a service.' },
  };

  Object.values(rules).forEach(({ el, errId, test, msg }) => {
    if (!el) return;
    const validate = () => {
      if (!el.value) return; // Don't show error until user touches
      if (test(el.value)) {
        clearFieldError(errId);
        el.classList.remove('input-error');
        el.classList.add('input-success');
      } else {
        showFieldError(errId, msg);
        el.classList.add('input-error');
        el.classList.remove('input-success');
      }
    };
    el.addEventListener('blur', validate);
    el.addEventListener('input', () => {
      if (el.classList.contains('input-error')) validate();
    });
  });

  window._bookRules = rules; // expose for submit handler
})();

/* ── 6. MAP BRANCH SWITCHER ── */
(function () {
  const tabs    = document.querySelectorAll('.map-tab');
  const iframe  = document.getElementById('mapIframe');
  const address = document.getElementById('mapAddress');
  const branchSelect = document.getElementById('bkBranch');

  const branches = {
    'anna-nagar': {
      url: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.2!2d80.2142!3d13.0878!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a526f5f8c6e0001%3A0x1!2sAnna+Nagar+Chennai!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin',
      addr: 'South Austin Merry Road 38, Anna Nagar, Chennai – 600 040',
    },
    'velachery': {
      url: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.9!2d80.2209!3d12.9788!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a525d2a9c83a5c5%3A0x1!2sVelachery+Chennai!5e0!3m2!1sen!2sin!4v1700000000001!5m2!1sen!2sin',
      addr: 'Road 3 Banking Place Millennium, Velachery, Chennai – 600 042',
    },
  };

  function switchBranch(key) {
    if (!branches[key] || !iframe || !address) return;
    iframe.src = branches[key].url;
    // Update address text (keep icon)
    address.innerHTML = `<span class="material-icons">location_on</span> ${branches[key].addr}`;
    tabs.forEach((t) => t.classList.toggle('map-tab--active', t.dataset.branch === key));
  }

  tabs.forEach((tab) => tab.addEventListener('click', () => switchBranch(tab.dataset.branch)));

  // Sync map when branch form field changes
  if (branchSelect) {
    branchSelect.addEventListener('change', () => {
      if (branches[branchSelect.value]) switchBranch(branchSelect.value);
    });
  }
})();

/* ── 7. FORM SUBMISSION ── */
(function () {
  const form    = document.getElementById('bookingForm');
  const success = document.getElementById('bookSuccess');
  const header  = document.querySelector('.book-form-header');
  const submitBtn = document.getElementById('submitBtn');
  const refEl   = document.getElementById('successRef');

  if (!form || !success) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Run all validations
    const rules  = window._bookRules || {};
    let   valid  = true;

    Object.values(rules).forEach(({ el, errId, test, msg }) => {
      if (!el) return;
      if (!test(el.value)) {
        showFieldError(errId, msg);
        el.classList.add('input-error');
        el.classList.remove('input-success');
        valid = false;
      }
    });

    if (!valid) {
      // Scroll to first error
      const firstErr = form.querySelector('.input-error');
      if (firstErr) firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Shake the button
      submitBtn.classList.add('shake');
      setTimeout(() => submitBtn.classList.remove('shake'), 600);
      return;
    }

    // Simulate async submit
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    setTimeout(() => {
      // Generate reference number
      const ref = 'SC-' + Math.floor(100000 + Math.random() * 900000);
      if (refEl) refEl.textContent = ref;

      // Update step indicator
      updateSteps(3);

      // Show success
      form.classList.add('is-hidden');
      if (header) header.classList.add('is-hidden');
      success.classList.add('is-shown');
      success.scrollIntoView({ behavior: 'smooth', block: 'start' });

      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
    }, 1800);
  });
})();

/* ── 8. STEP INDICATOR ── */
function updateSteps(activeStep) {
  const steps = document.querySelectorAll('.book-step');
  const lines = document.querySelectorAll('.book-step-line');
  steps.forEach((step, i) => {
    step.classList.toggle('book-step--active', i + 1 <= activeStep);
    step.classList.toggle('book-step--done',   i + 1 < activeStep);
  });
  lines.forEach((line, i) => {
    line.style.background = i + 1 < activeStep
      ? 'linear-gradient(90deg, var(--mint), var(--mint-dark))'
      : 'var(--border)';
  });
}

// Add done state CSS
(function () {
  const style = document.createElement('style');
  style.textContent = `
    .book-step--done .book-step-num {
      background: var(--mint-dark) !important;
      border-color: var(--mint-dark) !important;
      color: white !important;
    }
    .book-step--done .book-step-num::after {
      content: 'check';
      font-family: 'Material Icons';
      font-size: 1rem;
    }
    .book-step--done .book-step-label { color: var(--mint-dark) !important; }

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

/* ── 9. HELPER FUNCTIONS ── */
function showFieldError(errId, msg) {
  const el = document.getElementById(errId);
  if (el) el.textContent = msg;
}
function clearFieldError(errId) {
  const el = document.getElementById(errId);
  if (el) el.textContent = '';
}

/* ── 10. INPUT FOCUS GLOW on icon ── */
(function () {
  document.querySelectorAll('.form-input').forEach((input) => {
    const wrap = input.closest('.input-wrap');
    if (!wrap) return;
    input.addEventListener('focus',  () => wrap.classList.add('focused'));
    input.addEventListener('blur',   () => wrap.classList.remove('focused'));
  });

  // Inject focused style
  const style = document.createElement('style');
  style.textContent = `
    .input-wrap.focused .input-icon { color: var(--mint-dark) !important; }
  `;
  document.head.appendChild(style);
})();

/* ── 11. PHONE — auto format for Indian numbers ── */
(function () {
  const phone = document.getElementById('bkPhone');
  if (!phone) return;
  phone.addEventListener('input', () => {
    // Strip non-digit non-+ characters for display
    let v = phone.value.replace(/[^\d\+\s\-]/g, '');
    phone.value = v;
  });
})();

/* ── 12. DATE — disable past + Sundays ── */
(function () {
  const dateInput = document.getElementById('bkDate');
  if (!dateInput) return;
  // Max date: 3 months ahead
  const max = new Date();
  max.setMonth(max.getMonth() + 3);
  const pad = (n) => String(n).padStart(2, '0');
  dateInput.max = `${max.getFullYear()}-${pad(max.getMonth() + 1)}-${pad(max.getDate())}`;
})();

/* ── 13. SMOOTH scroll pills on hero ── */
(function () {
  const pills = document.querySelectorAll('.book-pill');
  pills.forEach((pill, i) => {
    pill.style.opacity = '0';
    pill.style.transform = 'translateY(10px)';
    pill.style.transition = `opacity .4s ease ${i * 100 + 400}ms, transform .4s ease ${i * 100 + 400}ms`;
    requestAnimationFrame(() => {
      setTimeout(() => {
        pill.style.opacity = '1';
        pill.style.transform = 'translateY(0)';
      }, 100);
    });
  });
})();