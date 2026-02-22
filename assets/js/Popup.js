/* ============================================================
   popup.js — Book Appointment auto-popup
   Shows after POPUP_DELAY ms (if not closed this session)
   ============================================================ */
(function () {
  'use strict';

  const POPUP_DELAY    = 8000;   // 8 seconds
  const SESSION_KEY    = 'pd_popup_closed';
  const overlay        = document.getElementById('bookPopup');
  const closeBtn       = document.getElementById('bkClose');
  const form           = document.getElementById('bkForm');
  const successEl      = document.getElementById('bkSuccess');

  if (!overlay) return;

  /* ── Open / Close helpers ── */
  function openPopup() {
    overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closePopup() {
    overlay.classList.remove('is-open');
    document.body.style.overflow = '';
    sessionStorage.setItem(SESSION_KEY, '1');
  }

  /* ── Auto-trigger ── */
  if (!sessionStorage.getItem(SESSION_KEY)) {
    setTimeout(openPopup, POPUP_DELAY);
  }

  /* ── Close on button ── */
  if (closeBtn) {
    closeBtn.addEventListener('click', closePopup);
  }

  /* ── Close on backdrop click ── */
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closePopup();
  });

  /* ── Close on Escape ── */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('is-open')) {
      closePopup();
    }
  });

  /* ── Form submit ── */
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const name  = document.getElementById('bkPopupName');
      const phone = document.getElementById('bkPopupPhone');
      const loc   = document.getElementById('bkPopupLocation');

      /* Basic validation */
      let valid = true;

      [name, phone, loc].forEach(function (el) {
        if (!el) return;
        if (!el.value.trim()) {
          el.style.boxShadow = '0 0 0 3px rgba(239,68,68,.45)';
          valid = false;
        } else {
          el.style.boxShadow = '';
        }
      });

      if (!valid) return;

      /* Show success */
      form.classList.add('is-hidden');

      if (successEl) {
        successEl.classList.add('is-shown');
      }

      /* Auto-close after 3.5 s */
      setTimeout(function () {
        closePopup();
        /* Reset for next session open */
        setTimeout(function () {
          form.classList.remove('is-hidden');
          if (successEl) successEl.classList.remove('is-shown');
          form.reset();
          [name, phone, loc].forEach(function(el){ if(el) el.style.boxShadow = ''; });
        }, 500);
      }, 3500);
    });
  }

  /* ── Expose manual open for "Book Appointment" links if needed ── */
  window.openBookPopup = openPopup;

})();