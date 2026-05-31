/* ============================================================
   Alex Rivera — Portfolio · app.js
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Data ---------- */
  const SKILLS = [
    {
      title: "Frontend Engineering", sub: "Building the interface",
      icon: '<path d="m8 18-6-6 6-6M16 6l6 6-6 6"/>',
      rows: [["React / Next.js", 96], ["TypeScript", 93], ["Tailwind / CSS Arch.", 95], ["Web Performance", 88]]
    },
    {
      title: "Product & UI Design", sub: "Shaping the experience",
      icon: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>',
      rows: [["Figma & Prototyping", 97], ["Design Systems", 94], ["Interaction Design", 90], ["Visual / Type", 86]]
    },
    {
      title: "Motion & Craft", sub: "The finishing 10%",
      icon: '<path d="M13 2 3 14h9l-1 8 10-12h-9z"/>',
      rows: [["Framer Motion / GSAP", 89], ["Micro-interactions", 92], ["Accessibility (a11y)", 91], ["Responsive Systems", 95]]
    },
    {
      title: "Platform & Tooling", sub: "Behind the scenes",
      icon: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4l-6 6 1.4 1.4 6-6a4 4 0 0 0 5.4-5.4l-2 2-1.4-1.4 2-2z"/>',
      rows: [["Node / GraphQL APIs", 82], ["Vite / Build Tooling", 88], ["CI/CD & Testing", 80], ["Git Workflows", 93]]
    }
  ];

  const PROJECTS = [
    { n: "01", cat: "Analytics Platform", tag: "product", title: "Nimbus", desc: "A real-time analytics dashboard handling millions of events — sub-100ms interactions and a fully themeable charting layer.", tech: ["React", "TypeScript", "D3", "WebSocket"] },
    { n: "02", cat: "Sustainability App", tag: "mobile", title: "Verdant", desc: "A carbon-tracking mobile app that turns dry climate data into a habit-forming, delightfully animated daily ritual.", tech: ["React Native", "Node", "Postgres"] },
    { n: "03", cat: "Design System", tag: "design", title: "Aperture", desc: "A 120-component design system with synced tokens, automated docs and theming that ships design-to-code in hours.", tech: ["Figma", "Storybook", "Style Dictionary"] },
    { n: "04", cat: "Headless Commerce", tag: "product", title: "Solstice", desc: "A blazing-fast headless storefront with edge rendering, a custom cart engine and a conversion lift of 34%.", tech: ["Next.js", "Shopify", "Tailwind"] },
    { n: "05", cat: "Creative Tool", tag: "design", title: "Cadence", desc: "A browser-based collaborative music workspace — real-time multiplayer editing built on a custom audio engine.", tech: ["WebAudio", "Svelte", "WebRTC"] },
    { n: "06", cat: "Developer SDK", tag: "product", title: "Atlas", desc: "A GPU-accelerated mapping toolkit for developers, with a tiny API surface and 60fps vector rendering anywhere.", tech: ["TypeScript", "WebGL", "MapLibre"] }
  ];

  const TIMELINE = [
    { when: "2022 — Present", role: "Senior Product Engineer", co: "Lumen Labs · Remote", desc: "Lead the design-engineering of a B2B analytics suite; built the design system and mentor a team of five." },
    { when: "2019 — 2022", role: "Frontend Engineer", co: "Northwind · Berlin", desc: "Shipped the customer-facing web platform from zero, owning everything from architecture to motion." },
    { when: "2017 — 2019", role: "UI Designer", co: "Studio Kern · Lisbon", desc: "Designed brand & product interfaces for startups across fintech, health and creative tooling." }
  ];

  const SERVICES = [
    { ix: "S1", h: "Product Design", p: "End-to-end UX, UI & prototyping" },
    { ix: "S2", h: "Frontend Development", p: "Production React, TS & performance" },
    { ix: "S3", h: "Design Systems", p: "Scalable component libraries & tokens" },
    { ix: "S4", h: "Design Audits", p: "UX reviews, a11y & polish passes" },
    { ix: "S5", h: "Creative Direction", p: "Brand, motion & visual identity" }
  ];

  /* ---------- Render: Skills ---------- */
  const skillsGrid = document.getElementById("skillsGrid");
  if (skillsGrid) {
    skillsGrid.innerHTML = SKILLS.map((s, i) => `
      <div class="skill-card reveal" data-d="${i % 2 + 1}">
        <div class="sk-head">
          <div class="sk-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${s.icon}</svg></div>
          <div><h3>${s.title}</h3><p>${s.sub}</p></div>
        </div>
        <div class="sk-list">
          ${s.rows.map(r => `
            <div class="sk-row">
              <div class="sk-top"><span class="sk-name">${r[0]}</span><span class="sk-pct">${r[1]}%</span></div>
              <div class="sk-bar"><span class="sk-fill" data-pct="${r[1]}"></span></div>
            </div>`).join("")}
        </div>
      </div>`).join("");
  }

  /* ---------- Render: Projects ---------- */
  const projGrid = document.getElementById("projGrid");
  if (projGrid) {
    projGrid.innerHTML = PROJECTS.map((p, i) => `
      <article class="proj-card reveal" data-tag="${p.tag}" data-d="${i % 2 + 1}">
        <div class="proj-thumb">
          <span class="ph-stripe"></span>
          <span class="proj-num">${p.n}</span>
          <div class="proj-overlay">
            <a href="#" class="btn btn-primary btn-sm" onclick="return false">Live demo
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7M9 7h8v8"/></svg></a>
            <a href="#" class="btn btn-ghost btn-sm" onclick="return false">Code</a>
          </div>
        </div>
        <div class="proj-body">
          <span class="proj-cat">${p.cat}</span>
          <h3>${p.title}</h3>
          <p>${p.desc}</p>
          <div class="proj-tags">${p.tech.map(t => `<span>${t}</span>`).join("")}</div>
          <div class="proj-links">
            <a href="#" class="proj-link" onclick="return false">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6M10 14 21 3M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"/></svg>
              Live Demo
            </a>
            <a href="#" class="proj-link muted" onclick="return false">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02a9.4 9.4 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2Z"/></svg>
              GitHub
            </a>
          </div>
        </div>
      </article>`).join("");
  }

  /* ---------- Render: Timeline ---------- */
  const timeline = document.getElementById("timeline");
  if (timeline) {
    timeline.innerHTML = TIMELINE.map((t, i) => `
      <div class="tl-item">
        <div class="tl-rail"><span class="tl-node"></span>${i < TIMELINE.length - 1 ? '<span class="tl-line"></span>' : ''}</div>
        <div>
          <div class="tl-when">${t.when}</div>
          <div class="tl-role">${t.role}</div>
          <div class="tl-co">${t.co}</div>
          <div class="tl-desc">${t.desc}</div>
        </div>
      </div>`).join("");
  }

  /* ---------- Render: Services ---------- */
  const services = document.getElementById("services");
  if (services) {
    services.innerHTML = SERVICES.map(s => `
      <div class="svc">
        <span class="svc-ix">${s.ix}</span>
        <div><h4>${s.h}</h4><p>${s.p}</p></div>
        <span class="svc-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7M7 7h10v10"/></svg></span>
      </div>`).join("");
  }

  /* ---------- Reveal on scroll ---------- */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        // fill skill bars when their card reveals
        e.target.querySelectorAll && e.target.querySelectorAll(".sk-fill").forEach(f => {
          f.style.width = f.dataset.pct + "%";
        });
        revealObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.16, rootMargin: "0px 0px -8% 0px" });
  const vh = window.innerHeight || 800;
  document.querySelectorAll(".reveal").forEach(el => {
    // Above-the-fold content shows instantly (no hidden flash, reliable paint);
    // everything below animates in on scroll.
    if (el.getBoundingClientRect().top < vh * 0.92) {
      el.classList.add("snap", "in");
      el.querySelectorAll(".sk-fill").forEach(f => { f.style.width = f.dataset.pct + "%"; });
    } else {
      revealObserver.observe(el);
    }
  });

  /* ---------- Nav: scroll state + active link ---------- */
  const nav = document.getElementById("nav");
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 24);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const sections = ["about", "skills", "work", "experience", "contact"];
  const navLinkFor = {};
  document.querySelectorAll(".nav-links a").forEach(a => {
    const id = a.getAttribute("href").slice(1);
    navLinkFor[id] = a;
  });
  const spy = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        Object.values(navLinkFor).forEach(a => a.classList.remove("active"));
        const link = navLinkFor[e.target.id];
        if (link) link.classList.add("active");
      }
    });
  }, { threshold: 0.5, rootMargin: "-20% 0px -40% 0px" });
  sections.forEach(id => { const el = document.getElementById(id); if (el) spy.observe(el); });

  /* ---------- Mobile menu ---------- */
  const navToggle = document.getElementById("navToggle");
  const mobileMenu = document.getElementById("mobileMenu");
  const closeMenu = () => nav.classList.remove("open");
  if (navToggle) navToggle.addEventListener("click", () => nav.classList.toggle("open"));
  if (mobileMenu) mobileMenu.querySelectorAll("a").forEach(a => a.addEventListener("click", closeMenu));

  /* ---------- Animated counters ---------- */
  const counters = document.querySelectorAll("[data-count]");
  const countObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = +el.dataset.count;
      const dur = 1400; const start = performance.now();
      const tick = (now) => {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(eased * target);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      countObs.unobserve(el);
    });
  }, { threshold: 0.6 });
  counters.forEach(c => countObs.observe(c));

  /* ---------- Project filtering ---------- */
  const filterBar = document.getElementById("projFilters");
  if (filterBar) {
    filterBar.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;
      filterBar.querySelectorAll("button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const f = btn.dataset.filter;
      projGrid.querySelectorAll(".proj-card").forEach(card => {
        const show = f === "all" || card.dataset.tag === f;
        card.classList.toggle("is-hidden", !show);
      });
    });
  }

  /* ---------- Pointer tilt (hero card + project cards) ---------- */
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function addTilt(el, max) {
    if (prefersReduced) return;
    el.addEventListener("pointermove", (ev) => {
      const r = el.getBoundingClientRect();
      const px = (ev.clientX - r.left) / r.width - 0.5;
      const py = (ev.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(900px) rotateY(${px * max}deg) rotateX(${-py * max}deg)`;
    });
    el.addEventListener("pointerleave", () => { el.style.transform = ""; });
  }
  const heroCard = document.getElementById("heroCard");
  if (heroCard) addTilt(heroCard, 9);

  /* ---------- Contact form validation ---------- */
  const form = document.getElementById("contactForm");
  if (form) {
    const fields = {
      name: form.querySelector("#cName"),
      email: form.querySelector("#cEmail"),
      message: form.querySelector("#cMsg")
    };
    const validateField = (input) => {
      const wrap = input.closest(".field");
      let ok = input.value.trim().length > 0;
      if (input.type === "email") ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
      if (input.id === "cMsg") ok = input.value.trim().length >= 10;
      wrap.classList.toggle("invalid", !ok);
      return ok;
    };
    Object.values(fields).forEach(input => {
      input.addEventListener("input", () => {
        if (input.closest(".field").classList.contains("invalid")) validateField(input);
      });
      input.addEventListener("blur", () => validateField(input));
    });
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const results = Object.values(fields).map(validateField);
      if (results.every(Boolean)) {
        form.style.display = "none";
        document.getElementById("formSuccess").classList.add("show");
      } else {
        const firstBad = form.querySelector(".field.invalid input, .field.invalid textarea");
        if (firstBad) firstBad.focus();
      }
    });
  }

  /* ---------- Accent spotlight follows cursor on hero ---------- */
  const heroVisual = document.getElementById("heroVisual");

  /* ---------- Tweaks API (consumed by tweaks panel) ---------- */
  window.applyTweak = function (key, val) {
    const root = document.documentElement;
    if (key === "accent") root.style.setProperty("--accent-h", val);
    if (key === "font") root.setAttribute("data-font", val);
    if (key === "glow") root.style.setProperty("--glow", val);
    if (key === "grid") document.body.classList.toggle("no-grid", !val);
  };
})();
