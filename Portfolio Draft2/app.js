/* ============================================================
   Sushant Sapkota — Portfolio · interactions
   ============================================================ */
(function () {
  "use strict";

  const root = document.documentElement;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Theme ---------- */
  const toggle = document.getElementById("themeToggle");
  const stored = localStorage.getItem("ss-theme");
  if (stored === "light" || stored === "dark") root.setAttribute("data-theme", stored);

  toggle.addEventListener("click", function () {
    const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    root.setAttribute("data-theme", next);
    localStorage.setItem("ss-theme", next);
  });

  /* ---------- Nav scrolled state ---------- */
  const nav = document.getElementById("nav");
  const onScroll = function () {
    if (window.scrollY > 24) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Mobile menu (simple anchor scroll list) ---------- */
  const burger = document.getElementById("burger");
  if (burger) {
    burger.addEventListener("click", function () {
      document.getElementById("about").scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  /* ---------- Scroll reveal ---------- */
  const reveals = document.querySelectorAll(".reveal");
  const revealAll = function () { reveals.forEach(function (el) { el.classList.add("in"); }); };

  if (reduce || !("IntersectionObserver" in window)) {
    revealAll();
  } else {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -6% 0px" });
    reveals.forEach(function (el) { io.observe(el); });

    // Above-the-fold items reveal immediately (don't wait for scroll/observer tick)
    requestAnimationFrame(function () {
      const vh = window.innerHeight;
      reveals.forEach(function (el) {
        if (el.getBoundingClientRect().top < vh * 0.92) el.classList.add("in");
      });
    });

    // Failsafe: nothing may ever stay hidden, even if the observer misbehaves
    setTimeout(revealAll, 2600);
  }

  /* ---------- Cursor glow ---------- */
  const glow = document.getElementById("cursorGlow");
  if (glow && !reduce && window.matchMedia("(pointer: fine)").matches) {
    let gx = window.innerWidth / 2, gy = window.innerHeight / 2, cx = gx, cy = gy, shown = false;
    window.addEventListener("mousemove", function (e) {
      gx = e.clientX; gy = e.clientY;
      if (!shown) { glow.style.opacity = "1"; shown = true; }
    });
    const animGlow = function () {
      cx += (gx - cx) * 0.12;
      cy += (gy - cy) * 0.12;
      glow.style.transform = "translate(" + cx + "px," + cy + "px) translate(-50%,-50%)";
      requestAnimationFrame(animGlow);
    };
    requestAnimationFrame(animGlow);
  }

  /* ---------- Hero floating-panel parallax ---------- */
  const visual = document.getElementById("heroVisual");
  if (visual && !reduce && window.matchMedia("(pointer: fine)").matches) {
    const panels = visual.querySelectorAll(".float");
    let tx = 0, ty = 0, mx = 0, my = 0;
    const rect = function () { return visual.getBoundingClientRect(); };

    visual.addEventListener("mousemove", function (e) {
      const r = rect();
      mx = (e.clientX - (r.left + r.width / 2)) / r.width;   // -0.5..0.5
      my = (e.clientY - (r.top + r.height / 2)) / r.height;
    });
    visual.addEventListener("mouseleave", function () { mx = 0; my = 0; });

    const loop = function () {
      tx += (mx - tx) * 0.08;
      ty += (my - ty) * 0.08;
      panels.forEach(function (p) {
        const d = parseFloat(p.getAttribute("data-depth")) || 1;
        const px = -tx * d * 26;
        const py = -ty * d * 26;
        const rotX = ty * d * 4;
        const rotY = -tx * d * 4;
        const base = p.classList.contains("fp-core") ? "translate(-50%,-50%) " : "";
        p.style.transform = base +
          "translate3d(" + px.toFixed(2) + "px," + py.toFixed(2) + "px,0) " +
          "rotateX(" + rotX.toFixed(2) + "deg) rotateY(" + rotY.toFixed(2) + "deg)";
      });
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  /* ---------- Gentle scroll parallax on hero visual ---------- */
  if (visual && !reduce) {
    let raf = null;
    const onP = function () {
      if (raf) return;
      raf = requestAnimationFrame(function () {
        const y = window.scrollY;
        if (y < window.innerHeight) {
          visual.style.setProperty("transform", "translateY(" + (y * 0.06).toFixed(1) + "px)");
        }
        raf = null;
      });
    };
    window.addEventListener("scroll", onP, { passive: true });
  }

  /* ---------- Active nav link on scroll ---------- */
  const sections = ["about", "skills", "work", "experience", "services", "contact"];
  const linkFor = {};
  document.querySelectorAll(".nav-links a").forEach(function (a) {
    const id = a.getAttribute("href").replace("#", "");
    linkFor[id] = a;
  });
  if ("IntersectionObserver" in window) {
    const spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        const id = e.target.id;
        if (e.isIntersecting && linkFor[id]) {
          Object.keys(linkFor).forEach(function (k) { linkFor[k].style.color = ""; linkFor[k].style.background = ""; });
          linkFor[id].style.color = "var(--text)";
          linkFor[id].style.background = "var(--chip-bg)";
        }
      });
    }, { threshold: 0.5 });
    sections.forEach(function (id) { const el = document.getElementById(id); if (el) spy.observe(el); });
  }

  /* ---------- Contact form ---------- */
  const form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      form.classList.add("sent");
    });
  }
})();
