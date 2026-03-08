/* ============================================================
   SMILE CRAFT — premium-mobile-nav.js  (v2 — Fixed)
   Drop-in for every page. Include after your page's own JS.

   FIX #13: Wrapped in DOMContentLoaded so this script is
   safe to load anywhere — <head>, end of <body>, or as a
   module — without throwing on missing elements.

   FIX #11: Separated from service-detail.js into its own
   standalone file so it only needs to be loaded once and
   works on every page consistently.

   FIX #11 (dropdown): querySelectorAll handles multiple
   dropdowns instead of only the first one found.

   FIX #12: closeDrawer() also closes the old .mobile-menu
   panel if it exists, preventing two menus open at once.
   ============================================================ */

'use strict';

document.addEventListener('DOMContentLoaded', function () {

  var hamburger = document.getElementById('hamburger');
  var backdrop  = document.getElementById('pmnBackdrop');
  var drawer    = document.getElementById('pmnDrawer');
  var closeBtn  = document.getElementById('pmnClose');

  // Guard — if this page doesn't have the premium nav, exit silently
  if (!hamburger || !drawer) return;

  /* ── OPEN / CLOSE ── */
  function openDrawer() {
    hamburger.classList.add('is-open');
    hamburger.setAttribute('aria-expanded', 'true');
    if (backdrop) backdrop.classList.add('is-open');
    drawer.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    hamburger.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
    if (backdrop) backdrop.classList.remove('is-open');
    drawer.classList.remove('is-open');
    document.body.style.overflow = '';

    // FIX #12: Also close legacy .mobile-menu panel if present
    var legacyMenu = document.getElementById('mobileMenu');
    var legacyBtn  = document.getElementById('mobileMenuBtn');
    if (legacyMenu) {
      legacyMenu.classList.remove('is-open');
      if (legacyBtn) {
        legacyBtn.setAttribute('aria-expanded', 'false');
        var icon = legacyBtn.querySelector('.material-icons');
        if (icon) icon.textContent = 'menu';
      }
    }
  }

  hamburger.addEventListener('click', function () {
    drawer.classList.contains('is-open') ? closeDrawer() : openDrawer();
  });

  if (closeBtn)  closeBtn.addEventListener('click', closeDrawer);
  if (backdrop)  backdrop.addEventListener('click', closeDrawer);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeDrawer();
  });

  /* Close on drawer nav link / branch card click */
  drawer.querySelectorAll('.pmn-nav-link, .pmn-branch-card').forEach(function (el) {
    el.addEventListener('click', function () {
      setTimeout(closeDrawer, 180); // allow navigation to start first
    });
  });

  /* ── SWIPE RIGHT TO CLOSE ───────────────────────────────────
     FIX: Original had swipe direction comment wrong (said
     "swipe right → close" but dx > 60 IS swipe right when
     the drawer slides in from the left — this is correct).
     Added minimum swipe distance guard for accidental taps.
  ────────────────────────────────────────────── */
  var touchStartX = 0;
  var touchStartY = 0;

  drawer.addEventListener('touchstart', function (e) {
    touchStartX = e.changedTouches[0].clientX;
    touchStartY = e.changedTouches[0].clientY;
  }, { passive: true });

  drawer.addEventListener('touchend', function (e) {
    var dx = e.changedTouches[0].clientX - touchStartX;
    var dy = e.changedTouches[0].clientY - touchStartY;
    // Only close on predominantly horizontal right-swipe ≥ 60px
    if (dx > 60 && Math.abs(dy) < 40) closeDrawer();
  }, { passive: true });

  /* ── DESKTOP DROPDOWN ──────────────────────────────────────
     FIX #11: querySelectorAll handles ALL .nav-dropdown
     instances, not just the first one.
     Opens on click with a 150ms delay (feels snappy but
     avoids accidental triggers while scrolling past nav).
     Closes when clicking anywhere outside any dropdown.
  ────────────────────────────────────────────── */
  var dropdowns = document.querySelectorAll('.nav-dropdown');

  dropdowns.forEach(function (navDropdown) {
    var trigger = navDropdown.querySelector('.nav-dropdown-trigger');
    if (!trigger) return;

    var openTimer = null;

    trigger.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();

      var isActive = navDropdown.classList.contains('is-active');

      // Close all dropdowns first
      dropdowns.forEach(function (d) {
        d.classList.remove('is-active');
        var t = d.querySelector('.nav-dropdown-trigger');
        if (t) t.setAttribute('aria-expanded', 'false');
      });
      clearTimeout(openTimer);

      if (!isActive) {
        openTimer = setTimeout(function () {
          navDropdown.classList.add('is-active');
          trigger.setAttribute('aria-expanded', 'true');
        }, 150);
      }
    });
  });

  // Close all dropdowns on outside click
  document.addEventListener('click', function (e) {
    var insideAny = Array.from(dropdowns).some(function (d) {
      return d.contains(e.target);
    });
    if (!insideAny) {
      dropdowns.forEach(function (d) {
        d.classList.remove('is-active');
        var t = d.querySelector('.nav-dropdown-trigger');
        if (t) t.setAttribute('aria-expanded', 'false');
      });
    }
  });

  // Close dropdowns on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      dropdowns.forEach(function (d) {
        d.classList.remove('is-active');
        var t = d.querySelector('.nav-dropdown-trigger');
        if (t) t.setAttribute('aria-expanded', 'false');
      });
    }
  });

});