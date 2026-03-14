(function () {
  "use strict";

  const isTouchDevice = !window.matchMedia("(hover: hover) and (pointer: fine)")
    .matches;
  const isDesktop = !window.matchMedia("(max-width: 768px)").matches;

  // ============================================================
  // DOM INJECTION HELPERS
  // ============================================================
  function inject(html, where) {
    const t = document.createElement("div");
    t.innerHTML = html.trim();
    const el = t.firstChild;
    if (where === "prepend")
      document.body.insertBefore(el, document.body.firstChild);
    else document.body.appendChild(el);
    return el;
  }

  // Preloader
  const preloader = inject(
    `
    <div class="preloader" id="preloader">
      <p class="preloader__name">Ivanna Voitseshko</p>
      <div class="preloader__bar"><div class="preloader__bar-fill"></div></div>
    </div>`,
    "prepend",
  );

  // Scroll progress bar
  const progressBar = inject(
    '<div class="scroll-progress" id="scroll-progress"></div>',
    "prepend",
  );

  // Lightbox
  const lightbox = inject(
    `
    <div class="lightbox" id="lightbox" role="dialog" aria-modal="true">
      <button class="lightbox__close" id="lightbox-close" aria-label="Close">&#x2715;</button>
      <img class="lightbox__img" id="lightbox-img" src="" alt="">
    </div>`,
    "append",
  );

  // Toast
  const toast = inject(
    '<div class="toast" id="toast" role="alert"></div>',
    "append",
  );

  // Theme toggle in header nav
  const headerHat = document.getElementById("header-hat");
  let themeToggleEl = null;
  if (headerHat) {
    const li = document.createElement("li");
    li.innerHTML =
      '<button class="theme-toggle button" id="theme-toggle" aria-label="Toggle dark/light mode">☀️</button>';
    headerHat.insertBefore(li, headerHat.firstChild);
    themeToggleEl = document.getElementById("theme-toggle");
  }

  // ============================================================
  // PRELOADER
  // ============================================================
  window.addEventListener("load", function () {
    setTimeout(function () {
      preloader.classList.add("hidden");
    }, 1500);
  });


  // ============================================================
  // STICKY HEADER (show/hide on scroll)
  // ============================================================
  (function () {
    const header = document.querySelector(".header");
    if (!header) return;
    let lastY = 0;

    window.addEventListener(
      "scroll",
      function () {
        const y = window.scrollY;
        if (y > 60) {
          header.classList.add("scrolled");
          if (y > lastY + 4) header.classList.add("hide");
          else if (y < lastY - 4) header.classList.remove("hide");
        } else {
          header.classList.remove("scrolled", "hide");
        }
        lastY = y;
      },
      { passive: true },
    );
  })();

  // ============================================================
  // SCROLL PROGRESS BAR
  // ============================================================
  window.addEventListener(
    "scroll",
    function () {
      const dh = document.documentElement.scrollHeight - window.innerHeight;
      progressBar.style.width =
        (dh > 0 ? (window.scrollY / dh) * 100 : 0) + "%";
    },
    { passive: true },
  );

  // ============================================================
  // SCROLL ANIMATIONS (Intersection Observer)
  // ============================================================
  (function () {
    if (!("IntersectionObserver" in window)) return;

    const selectors =
      "h1, h2, h3, p, .about-section__list li, .about-section__key-text, .about-section__socials-list";
    const els = document.querySelectorAll(selectors);

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -32px 0px" },
    );

    els.forEach(function (el, i) {
      const rect = el.getBoundingClientRect();
      if (rect.top > window.innerHeight * 0.95) {
        el.classList.add("will-animate");
        if (i % 4 === 1) el.dataset.delay = "1";
        else if (i % 4 === 2) el.dataset.delay = "2";
        else if (i % 4 === 3) el.dataset.delay = "3";
        observer.observe(el);
      }
    });
  })();

  // ============================================================
  // PARALLAX BACKGROUND (home page, desktop)
  // ============================================================
  if (isDesktop) {
    const hero = document.querySelector(".main-section__container");
    if (hero) {
      window.addEventListener(
        "scroll",
        function () {
          hero.style.backgroundPositionY =
            "calc(50% + " + window.scrollY * 0.22 + "px)";
        },
        { passive: true },
      );
    }
  }

  // ============================================================
  // MAGNETIC BUTTON
  // ============================================================
  if (!isTouchDevice) {
    document.querySelectorAll(".main-section__button").forEach(function (btn) {
      const wrap = btn.closest("a") || btn.parentElement;
      wrap.addEventListener("mousemove", function (e) {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - (r.left + r.width / 2);
        const y = e.clientY - (r.top + r.height / 2);
        btn.style.transform =
          "translate(" + x * 0.28 + "px," + y * 0.28 + "px)";
      });
      wrap.addEventListener("mouseleave", function () {
        btn.style.transform = "";
      });
    });
  }


  // ============================================================
  // SCROLL TO TOP — fix for sticky header + .hide transform
  // ============================================================
  document.querySelectorAll('a[href="#header"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      var header = document.querySelector('.header');
      if (header) header.classList.remove('hide');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  // ============================================================
  // LIGHTBOX (works pages)
  // ============================================================
  (function () {
    const img = document.getElementById("lightbox-img");
    const close = document.getElementById("lightbox-close");
    if (!img || !close) return;

    const targets = document.querySelectorAll(
      ".works-video-section img, .logos-section img, .banner-section img, " +
        ".illustration-section img, .mobileapp-section img, .website-section img",
    );
    if (!targets.length) return;

    function openLightbox(src, alt) {
      img.src = src;
      img.alt = alt;
      lightbox.classList.add("active");
      document.body.style.overflow = "hidden";
    }

    function closeLightbox() {
      lightbox.classList.remove("active");
      document.body.style.overflow = "";
    }

    targets.forEach(function (el) {
      el.style.cursor = "zoom-in";
      el.addEventListener("click", function () {
        openLightbox(el.src, el.alt);
      });
    });

    close.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeLightbox();
    });
  })();

  // ============================================================
  // DARK / LIGHT MODE
  // ============================================================
  (function () {
    if (!themeToggleEl) return;
    const saved = localStorage.getItem("theme") || "dark";

    function applyTheme(t) {
      document.documentElement.dataset.theme = t;
      themeToggleEl.textContent = t === "dark" ? "☀️" : "🌙";
    }

    applyTheme(saved);

    themeToggleEl.addEventListener("click", function () {
      const next =
        document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      applyTheme(next);
      localStorage.setItem("theme", next);
    });
  })();

  // ============================================================
  // COPY EMAIL + TOAST
  // ============================================================
  (function () {
    const emailLink = document.querySelector('a[href^="mailto:"]');
    if (!emailLink) return;

    function showToast(msg) {
      toast.textContent = msg;
      toast.classList.add("show");
      setTimeout(function () {
        toast.classList.remove("show");
      }, 2500);
    }

    emailLink.addEventListener("click", function (e) {
      const address = emailLink.href.replace("mailto:", "");
      if (navigator.clipboard) {
        e.preventDefault();
        navigator.clipboard.writeText(address).then(function () {
          showToast("Email copied!");
        });
      }
    });
  })();
})();
