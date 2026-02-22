/* ============================================================
   SMILE CRAFT — PREMIUM MOBILE NAV JS
   Add this block to your index.js (or service-detail.js)
   inside the DOMContentLoaded listener.
   ============================================================ */

(function () {

  const hamburger  = document.getElementById('hamburger');
  const backdrop   = document.getElementById('pmnBackdrop');
  const drawer     = document.getElementById('pmnDrawer');
  const closeBtn   = document.getElementById('pmnClose');

  if (!hamburger || !drawer) return;

  function openDrawer() {
    hamburger.classList.add('is-open');
    hamburger.setAttribute('aria-expanded', 'true');
    backdrop.classList.add('is-open');
    drawer.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    hamburger.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
    backdrop.classList.remove('is-open');
    drawer.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', function () {
    drawer.classList.contains('is-open') ? closeDrawer() : openDrawer();
  });

  closeBtn && closeBtn.addEventListener('click', closeDrawer);
  backdrop && backdrop.addEventListener('click', closeDrawer);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeDrawer();
  });

  /* Close on nav link click */
  drawer.querySelectorAll('.pmn-nav-link, .pmn-branch-card').forEach(function (el) {
    el.addEventListener('click', function () {
      /* small delay so the page has time to start navigating */
      setTimeout(closeDrawer, 180);
    });
  });

  /* Swipe-left to close */
  let touchStartX = 0;
  drawer.addEventListener('touchstart', function (e) {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });
  drawer.addEventListener('touchend', function (e) {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (dx > 60) closeDrawer(); /* swipe right → close */
  }, { passive: true });

})();