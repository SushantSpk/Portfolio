/* ============================================================
   Sushant Sapkota — Portfolio · app.js
   ============================================================ */
(function () {
  "use strict";

  const root = document.documentElement;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Theme ---- */
  const themeToggle = document.getElementById("themeToggle");
  const stored = localStorage.getItem("ss-theme");
  if (stored === "light" || stored === "dark") root.setAttribute("data-theme", stored);

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      root.setAttribute("data-theme", next);
      localStorage.setItem("ss-theme", next);
    });
  }

  /* ---- Nav: scrolled state ---- */
  const nav = document.getElementById("nav");
  function onScroll() {
    if (window.scrollY > 24) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---- Mobile menu ---- */
  const burger = document.getElementById("burger");
  const mobileMenu = document.getElementById("mobileMenu");
  if (burger && mobileMenu) {
    burger.addEventListener("click", function () {
      const open = nav.classList.toggle("menu-open");
      burger.setAttribute("aria-expanded", String(open));
      mobileMenu.setAttribute("aria-hidden", String(!open));
    });
    mobileMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("menu-open");
        burger.setAttribute("aria-expanded", "false");
        mobileMenu.setAttribute("aria-hidden", "true");
      });
    });
    document.addEventListener("click", function (e) {
      if (!nav.contains(e.target) && nav.classList.contains("menu-open")) {
        nav.classList.remove("menu-open");
        burger.setAttribute("aria-expanded", "false");
        mobileMenu.setAttribute("aria-hidden", "true");
      }
    });
  }

  /* ---- Active nav link on scroll ---- */
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
          Object.keys(linkFor).forEach(function (k) { linkFor[k].classList.remove("active"); });
          linkFor[id].classList.add("active");
        }
      });
    }, { threshold: 0.45, rootMargin: "-10% 0px -40% 0px" });
    sections.forEach(function (id) {
      const el = document.getElementById(id);
      if (el) spy.observe(el);
    });
  }

  /* ---- Scroll reveal ---- */
  const reveals = document.querySelectorAll(".reveal");
  function revealAll() { reveals.forEach(function (el) { el.classList.add("in"); }); }

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

    requestAnimationFrame(function () {
      const vh = window.innerHeight;
      reveals.forEach(function (el) {
        if (el.getBoundingClientRect().top < vh * 0.92) el.classList.add("in");
      });
    });

    setTimeout(revealAll, 2800);
  }

  /* ---- Cursor glow ---- */
  const glow = document.getElementById("cursorGlow");
  if (glow && !reduce && window.matchMedia("(pointer: fine)").matches) {
    let gx = window.innerWidth / 2, gy = window.innerHeight / 2;
    let cx = gx, cy = gy, shown = false;
    window.addEventListener("mousemove", function (e) {
      gx = e.clientX; gy = e.clientY;
      if (!shown) { glow.style.opacity = "1"; shown = true; }
    });
    (function animGlow() {
      cx += (gx - cx) * 0.11;
      cy += (gy - cy) * 0.11;
      glow.style.transform = "translate(" + cx.toFixed(1) + "px," + cy.toFixed(1) + "px) translate(-50%,-50%)";
      requestAnimationFrame(animGlow);
    })();
  }

  /* ---- Hero: floating panel parallax (mouse) ---- */
  const visual = document.getElementById("heroVisual");
  if (visual && !reduce && window.matchMedia("(pointer: fine)").matches) {
    const panels = visual.querySelectorAll(".float");
    let tx = 0, ty = 0, mx = 0, my = 0;

    visual.addEventListener("mousemove", function (e) {
      const r = visual.getBoundingClientRect();
      mx = (e.clientX - (r.left + r.width / 2)) / r.width;
      my = (e.clientY - (r.top + r.height / 2)) / r.height;
    });
    visual.addEventListener("mouseleave", function () { mx = 0; my = 0; });

    (function panelLoop() {
      tx += (mx - tx) * 0.075;
      ty += (my - ty) * 0.075;
      panels.forEach(function (p) {
        const depth = parseFloat(p.getAttribute("data-depth")) || 1;
        const px = -tx * depth * 22;
        const py = -ty * depth * 22;
        const rx = ty * depth * 3.5;
        const ry = -tx * depth * 3.5;
        const isId = p.classList.contains("fp-id");
        const base = isId ? "translate(-50%,-50%) " : "";
        p.style.transform = base +
          "translate3d(" + px.toFixed(2) + "px," + py.toFixed(2) + "px,0)" +
          " rotateX(" + rx.toFixed(2) + "deg)" +
          " rotateY(" + ry.toFixed(2) + "deg)";
      });
      requestAnimationFrame(panelLoop);
    })();
  }

  /* ---- Hero: scroll parallax on visual ---- */
  if (visual && !reduce) {
    let raf = null;
    window.addEventListener("scroll", function () {
      if (raf) return;
      raf = requestAnimationFrame(function () {
        const y = window.scrollY;
        if (y < window.innerHeight) {
          visual.style.transform = "translateY(" + (y * 0.055).toFixed(1) + "px)";
        }
        raf = null;
      });
    }, { passive: true });
  }

  /* ---- Hero card: pointer tilt ---- */
  const heroCard = document.getElementById("heroCard");
  if (heroCard && !reduce && window.matchMedia("(pointer: fine)").matches) {
    heroCard.style.cursor = "default";
    heroCard.addEventListener("pointermove", function (e) {
      const r = heroCard.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      heroCard.style.transform =
        "translate(-50%,-50%) perspective(900px) rotateY(" + (px * 7).toFixed(2) + "deg) rotateX(" + (-py * 7).toFixed(2) + "deg)";
    });
    heroCard.addEventListener("pointerleave", function () {
      heroCard.style.transform = "translate(-50%,-50%)";
    });
  }

  /* ---- Contact form: Formspree submission ---- */
  const form = document.getElementById("contactForm");
  const sentMsg = document.getElementById("sentMsg");
  const formError = document.getElementById("formError");

  function setFormError(message) {
    if (!formError) return;
    formError.textContent = message;
    formError.classList.toggle("show", Boolean(message));
  }

  if (form) {
    const submitButton = form.querySelector('button[type="submit"]');
    const normalButtonHtml = submitButton ? submitButton.innerHTML : "";

    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }

      setFormError("");
      if (sentMsg) sentMsg.classList.remove("show");
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "Sending...";
      }

      try {
        /*
          Replace YOUR_FORM_ID in Portfolio.html's form action with your
          actual Formspree form ID. Formspree works on static sites and does
          not require private API keys or secrets in frontend code.
        */
        const response = await fetch(form.action, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" }
        });

        if (!response.ok) {
          let message = "Message could not be sent right now. Please try again or email me directly.";
          try {
            const data = await response.json();
            if (data && Array.isArray(data.errors) && data.errors.length) {
              message = data.errors.map(function (error) { return error.message; }).join(" ");
            }
          } catch (jsonError) {
            /* Keep the friendly fallback message if Formspree returns non-JSON. */
          }
          throw new Error(message);
        }

        form.reset();
        form.classList.add("is-sent");
        if (sentMsg) {
          sentMsg.classList.add("show");
          sentMsg.focus({ preventScroll: true });
        }
      } catch (error) {
        const friendlyError = "Message could not be sent right now. Please try again or email me directly.";
        const message = error.message === "Failed to fetch" ? friendlyError : error.message;
        setFormError(message || friendlyError);
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.innerHTML = normalButtonHtml;
        }
      }
    });
  }

})();
