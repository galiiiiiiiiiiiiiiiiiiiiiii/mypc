// 1) Slide-in for product grids (.anim-row)
//    -> fire instantly if already on screen (normal on navigation)
//    -> still observe if di bawah layar / konten panjang
function slideInRowOnLoadOrView() {
  const rows = document.querySelectorAll(".anim-row");
  if (!rows.length) return;

  const inView = (el) => {
    const r = el.getBoundingClientRect();
    return r.top < window.innerHeight && r.bottom > 0;
  };

  // Apply langsung untuk yang sudah terlihat (kejadian saat masuk halaman produk)
  rows.forEach((el) => {
    if (inView(el)) el.classList.add("slide-in-left");
  });

  // Observe sisanya (kalau ada yang di bawah lipatan)
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("slide-in-left");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    rows.forEach((el) => {
      if (!el.classList.contains("slide-in-left")) io.observe(el);
    });
  } else {
    // Fallback browser lama
    rows.forEach((el) => el.classList.add("slide-in-left"));
  }
}

document.addEventListener("DOMContentLoaded", slideInRowOnLoadOrView);

// 2) Reveal/stagger untuk "Parts Update" (biarkan seperti ini)
(function initRevealOnScroll() {
  const scopes = document.querySelectorAll("[data-reveal-scope]");
  scopes.forEach((scope) => {
    const selector = scope.getAttribute("data-reveal-target") || ".card";
    const targets = scope.querySelectorAll(selector);
    targets.forEach((el, idx) => {
      el.classList.add("reveal");
      el.style.transitionDelay = `${idx * 80}ms`;
    });
  });

  const allReveals = document.querySelectorAll(".reveal");
  if (!allReveals.length) return;

  if (!("IntersectionObserver" in window)) {
    allReveals.forEach((el) => el.classList.add("show"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
        } else {
          // kalau keluar viewport → ilang lagi
          entry.target.classList.remove("show");
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
  );

  allReveals.forEach((el) => io.observe(el));
})();
