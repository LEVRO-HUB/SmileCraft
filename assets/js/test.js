/* ============================================================
   PUREDENTAL — testimonials.js
   Page-specific JS for Testimonials page.
   Shared interactions (mobile menu, etc.) in script.js
   ============================================================ */

(function () {
  "use strict";

  /* ----------------------------------------------------------
     SCROLL REVEAL HELPER  — defined first so it's available
     to both the initial card loop and load-more below.
  ---------------------------------------------------------- */
  function triggerReveal(el) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );
    observer.observe(el);
  }

  /* ----------------------------------------------------------
     REVEAL INITIAL 6 CARDS
     Root cause of the bug: script.js ran initScrollReveal()
     BEFORE this file loaded, so those cards were never observed.
     Fix: call triggerReveal(el) on every card right here.
  ---------------------------------------------------------- */
  document.querySelectorAll(".test-card").forEach(function (el, idx) {
    el.classList.add("reveal");
    el.classList.add("reveal-delay-" + Math.min(idx + 1, 4));
    triggerReveal(el); // <-- the missing call that caused blank cards
  });

  /* ----------------------------------------------------------
     LOAD MORE — builds and appends extra review cards
  ---------------------------------------------------------- */
  var EXTRA_REVIEWS = [
    {
      name:      "Jessica Park",
      treatment: "Teeth Whitening",
      avatar:    "initials",
      initials:  "JP",
      quote:     "Absolutely love my results! The team was professional, quick, and made me feel comfortable throughout. I'll definitely be recommending PureDental to all my friends.",
    },
    {
      name:      "Tom Richards",
      treatment: "Root Canal Patient",
      avatar:    "icon",
      quote:     "I was terrified of the procedure, but the team made it completely stress-free. Zero pain, super efficient, and a great follow-up experience. Couldn't ask for more.",
    },
    {
      name:      "Aisha Patel",
      treatment: "Orthodontic Treatment",
      avatar:    "initials",
      initials:  "AP",
      quote:     "My clear aligners were fitted perfectly and the progress tracking was amazing. I can already see a huge difference after just 4 months. The whole team is fantastic.",
    },
  ];

  var loadMoreBtn = document.getElementById("loadMoreBtn");
  var reviewsGrid = document.getElementById("reviewsGrid");

  if (loadMoreBtn && reviewsGrid) {
    loadMoreBtn.addEventListener("click", function () {
      loadMoreBtn.disabled    = true;
      loadMoreBtn.textContent = "Loading\u2026";

      setTimeout(function () {
        EXTRA_REVIEWS.forEach(function (review, idx) {
          var card = buildReviewCard(review);

          // Animate in with stagger — no reveal class needed since
          // user just clicked the button and cards are in viewport
          card.style.opacity    = "0";
          card.style.transform  = "translateY(20px)";
          card.style.transition = "opacity 0.4s ease " + (idx * 0.12) + "s, transform 0.4s ease " + (idx * 0.12) + "s";
          reviewsGrid.appendChild(card);

          requestAnimationFrame(function () {
            requestAnimationFrame(function () {
              card.style.opacity   = "1";
              card.style.transform = "translateY(0)";
            });
          });
        });

        loadMoreBtn.textContent = "No More Stories";
        loadMoreBtn.disabled    = true;
      }, 600);
    });
  }

  /* ----------------------------------------------------------
     BUILD REVIEW CARD
  ---------------------------------------------------------- */
  function buildReviewCard(review) {
    var card = document.createElement("div");
    card.className = "test-card";

    // Stars
    var stars = document.createElement("div");
    stars.className = "test-card-stars";
    for (var i = 0; i < 5; i++) {
      var s = document.createElement("span");
      s.className   = "material-icons star";
      s.textContent = "star";
      stars.appendChild(s);
    }

    // Quote
    var quote = document.createElement("blockquote");
    quote.className   = "test-card-quote";
    quote.textContent = "\u201C" + review.quote + "\u201D";

    // Footer
    var footer = document.createElement("div");
    footer.className = "test-card-footer";

    // Avatar
    var avatar;
    if (review.avatar === "initials") {
      avatar = document.createElement("div");
      avatar.className   = "test-card-avatar test-card-avatar--initials";
      avatar.textContent = review.initials;
    } else {
      avatar = document.createElement("div");
      avatar.className = "test-card-avatar test-card-avatar--icon";
      var icon = document.createElement("span");
      icon.className   = "material-icons";
      icon.textContent = "account_circle";
      avatar.appendChild(icon);
    }

    var info = document.createElement("div");

    var name = document.createElement("h4");
    name.className   = "test-card-name";
    name.textContent = review.name;

    var treatment = document.createElement("p");
    treatment.className   = "test-card-treatment";
    treatment.textContent = review.treatment;

    info.appendChild(name);
    info.appendChild(treatment);
    footer.appendChild(avatar);
    footer.appendChild(info);

    card.appendChild(stars);
    card.appendChild(quote);
    card.appendChild(footer);

    return card;
  }

  /* ----------------------------------------------------------
     LEAVE A REVIEW — inline modal
  ---------------------------------------------------------- */
  var leaveReviewBtn = document.getElementById("leaveReviewBtn");
  if (leaveReviewBtn) {
    leaveReviewBtn.addEventListener("click", openReviewModal);
  }

  function openReviewModal() {
    if (document.getElementById("reviewModal")) return;

    var backdrop = document.createElement("div");
    backdrop.id = "reviewModal";
    Object.assign(backdrop.style, {
      position:       "fixed",
      inset:          "0",
      background:     "rgba(0,0,0,0.5)",
      zIndex:         "1000",
      display:        "flex",
      alignItems:     "center",
      justifyContent: "center",
      padding:        "1.5rem",
      backdropFilter: "blur(4px)",
      opacity:        "0",
      transition:     "opacity 0.3s ease",
    });

    var modal = document.createElement("div");
    Object.assign(modal.style, {
      background:   "#fff",
      borderRadius: "1rem",
      padding:      "2.5rem",
      maxWidth:     "32rem",
      width:        "100%",
      boxShadow:    "0 24px 80px rgba(0,0,0,0.2)",
      transform:    "translateY(20px)",
      transition:   "transform 0.3s ease",
      fontFamily:   "Inter, sans-serif",
    });

    modal.innerHTML = [
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem;">',
        '<h3 style="font-size:1.25rem;font-weight:800;color:#0f172a;">Share Your Experience</h3>',
        '<button id="closeReviewModal" style="background:none;border:none;cursor:pointer;padding:0.25rem;color:#94a3b8;font-size:1.5rem;line-height:1;" aria-label="Close">&#x2715;</button>',
      "</div>",
      '<div style="display:flex;flex-direction:column;gap:1rem;">',
        "<div>",
          '<label style="display:block;font-size:0.875rem;font-weight:600;color:#334155;margin-bottom:0.4rem;">Your Name</label>',
          '<input id="rv-name" type="text" placeholder="Jane Doe" style="width:100%;padding:0.75rem 1rem;border:1px solid #e2e8f0;border-radius:0.5rem;font-family:inherit;font-size:0.9375rem;outline:none;box-sizing:border-box;" />',
        "</div>",
        "<div>",
          '<label style="display:block;font-size:0.875rem;font-weight:600;color:#334155;margin-bottom:0.4rem;">Treatment Received</label>',
          '<input id="rv-treatment" type="text" placeholder="e.g. Teeth Whitening" style="width:100%;padding:0.75rem 1rem;border:1px solid #e2e8f0;border-radius:0.5rem;font-family:inherit;font-size:0.9375rem;outline:none;box-sizing:border-box;" />',
        "</div>",
        "<div>",
          '<label style="display:block;font-size:0.875rem;font-weight:600;color:#334155;margin-bottom:0.4rem;">Your Review</label>',
          '<textarea id="rv-message" rows="4" placeholder="Tell us about your experience\u2026" style="width:100%;padding:0.75rem 1rem;border:1px solid #e2e8f0;border-radius:0.5rem;font-family:inherit;font-size:0.9375rem;outline:none;resize:none;box-sizing:border-box;"></textarea>',
        "</div>",
        '<button id="submitReviewBtn" style="width:100%;padding:0.875rem;background:#137fec;color:#fff;font-family:inherit;font-size:1rem;font-weight:700;border:none;border-radius:0.625rem;cursor:pointer;">Submit Review</button>',
      "</div>",
    ].join("");

    backdrop.appendChild(modal);
    document.body.appendChild(backdrop);
    document.body.style.overflow = "hidden";

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        backdrop.style.opacity = "1";
        modal.style.transform  = "translateY(0)";
      });
    });

    function closeModal() {
      backdrop.style.opacity       = "0";
      modal.style.transform        = "translateY(20px)";
      document.body.style.overflow = "";
      setTimeout(function () { backdrop.remove(); }, 300);
    }

    document.getElementById("closeReviewModal").addEventListener("click", closeModal);
    backdrop.addEventListener("click", function (e) {
      if (e.target === backdrop) closeModal();
    });

    document.getElementById("submitReviewBtn").addEventListener("click", function () {
      var name      = document.getElementById("rv-name").value.trim();
      var treatment = document.getElementById("rv-treatment").value.trim();
      var message   = document.getElementById("rv-message").value.trim();

      if (!name || !treatment || !message) {
        showTestToast("Please fill in all fields.", "error");
        return;
      }
      closeModal();
      showTestToast("Thank you! Your review has been submitted.", "success");
    });
  }

  /* ----------------------------------------------------------
     TOAST
  ---------------------------------------------------------- */
  function showTestToast(message, type) {
    var existing = document.getElementById("test-toast");
    if (existing) existing.remove();

    var toast = document.createElement("div");
    toast.id = "test-toast";
    toast.setAttribute("role", "alert");
    toast.textContent = message;

    Object.assign(toast.style, {
      position:     "fixed",
      bottom:       "2rem",
      right:        "2rem",
      padding:      "1rem 1.5rem",
      borderRadius: "0.75rem",
      fontFamily:   "Inter, sans-serif",
      fontSize:     "0.9375rem",
      fontWeight:   "600",
      color:        "#fff",
      background:   type === "success" ? "#137fec" : "#ef4444",
      boxShadow:    "0 8px 30px rgba(0,0,0,0.15)",
      zIndex:       "9999",
      opacity:      "0",
      transform:    "translateY(12px)",
      transition:   "all 0.3s ease",
      maxWidth:     "22rem",
    });

    document.body.appendChild(toast);

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        toast.style.opacity   = "1";
        toast.style.transform = "translateY(0)";
      });
    });

    setTimeout(function () {
      toast.style.opacity   = "0";
      toast.style.transform = "translateY(12px)";
      setTimeout(function () { toast.remove(); }, 350);
    }, 4000);
  }

})();