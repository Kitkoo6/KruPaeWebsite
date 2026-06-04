/* ============================================================
   Rattiya · Power Branding™ — motion & interactivity
   Lenis smooth scroll · GSAP ScrollTrigger reveals ·
   hero text reveal + parallax · counters · custom cursor
   All enhancement-only: if a CDN fails, content stays visible.
   ============================================================ */
(function () {
  document.documentElement.classList.add("js");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasGSAP = typeof window.gsap !== "undefined";

  /* ---------- Lenis smooth scroll ---------- */
  let lenis = null;
  if (typeof window.Lenis !== "undefined" && !reduce) {
    lenis = new Lenis({ duration: 1.15, smoothWheel: true, lerp: 0.09 });
    function raf(t) { lenis.raf(t); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    if (hasGSAP && window.ScrollTrigger) {
      lenis.on("scroll", ScrollTrigger.update);
    }
  }

  /* ---------- Anchor navigation ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(target, { offset: -70, duration: 1.3 });
      else target.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
    });
  });

  /* ---------- Nav scrolled state ---------- */
  const nav = document.getElementById("nav");
  const onScroll = () => {
    if (window.scrollY > 40) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Custom cursor ---------- */
  const dot = document.querySelector(".cursor-dot");
  const ring = document.querySelector(".cursor-ring");
  if (dot && ring && window.matchMedia("(hover: hover)").matches) {
    let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
    window.addEventListener("mousemove", (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
    });
    const follow = () => {
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
      requestAnimationFrame(follow);
    };
    follow();
    document.querySelectorAll("a, button, .logo-tile, .svc-card, .case-card").forEach((el) => {
      el.addEventListener("mouseenter", () => ring.classList.add("is-active"));
      el.addEventListener("mouseleave", () => ring.classList.remove("is-active"));
    });
  }

  if (!hasGSAP) {
    // No GSAP: ensure everything is visible
    document.querySelectorAll(".reveal").forEach((el) => (el.style.opacity = 1));
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  /* ---------- Hero entrance ---------- */
  const heroTl = gsap.timeline({ defaults: { ease: "power4.out" } });
  heroTl
    .from(".hero-mask span", { yPercent: 115, duration: 1.1, stagger: 0.11 }, 0.15)
    .from(".hero-eyebrow", { opacity: 0, y: 18, duration: 0.8 }, 0.1)
    .from(".hero-sub", { opacity: 0, y: 24, duration: 0.9 }, 0.7)
    .from(".hero-cta > *", { opacity: 0, y: 22, duration: 0.8, stagger: 0.12 }, 0.85)
    .from(".hero-stats > *", { opacity: 0, y: 20, duration: 0.8, stagger: 0.1 }, 1.0)
    .from(".portrait-frame", { opacity: 0, scale: 0.92, y: 30, duration: 1.3, ease: "power3.out" }, 0.35)
    .from(".portrait-ring", { opacity: 0, scale: 1.15, duration: 1.4, stagger: 0.15 }, 0.6)
    .from(".hero-float", { opacity: 0, scale: 0.6, duration: 1, stagger: 0.15 }, 0.9);

  /* ---------- Hero parallax (scroll) ---------- */
  if (!reduce) {
    gsap.to(".hero-portrait-img", {
      yPercent: 14, ease: "none",
      scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: true },
    });
    gsap.to(".hero-watermark", {
      yPercent: -22, ease: "none",
      scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: true },
    });
    gsap.to(".portrait-ring", {
      rotate: 18, ease: "none",
      scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: 1 },
    });
  }

  /* ---------- Hero mouse parallax ---------- */
  if (!reduce && window.matchMedia("(hover: hover)").matches) {
    const hero = document.getElementById("hero");
    hero.addEventListener("mousemove", (e) => {
      const rx = (e.clientX / innerWidth - 0.5);
      const ry = (e.clientY / innerHeight - 0.5);
      gsap.to(".hero-portrait-img", { x: rx * 22, y: ry * 22, duration: 0.9, ease: "power2.out" });
      gsap.to(".hero-float", { x: rx * 38, y: ry * 38, duration: 1.1, ease: "power2.out" });
    });
  }

  /* ---------- Generic reveals ---------- */
  gsap.utils.toArray(".reveal").forEach((el) => {
    const dx = parseFloat(el.dataset.x || 0);
    const dy = el.dataset.y !== undefined ? parseFloat(el.dataset.y) : 44;
    gsap.to(el, {
      opacity: 1, x: 0, y: 0, duration: 1,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 86%" },
    });
    gsap.set(el, { x: dx, y: dy });
  });

  /* ---------- Staggered groups ---------- */
  gsap.utils.toArray("[data-reveal-group]").forEach((group) => {
    const items = group.children;
    gsap.set(items, { opacity: 0, y: 46 });
    gsap.to(items, {
      opacity: 1, y: 0, duration: 0.95, ease: "power3.out", stagger: 0.13,
      scrollTrigger: { trigger: group, start: "top 82%" },
    });
  });

  /* ---------- Section heading lines ---------- */
  gsap.utils.toArray(".line-reveal span").forEach((s) => {
    gsap.from(s, {
      yPercent: 110, duration: 1.05, ease: "power4.out",
      scrollTrigger: { trigger: s.closest(".line-reveal"), start: "top 85%" },
    });
  });

  /* ---------- Number counters ---------- */
  gsap.utils.toArray("[data-count]").forEach((el) => {
    const end = parseFloat(el.dataset.count);
    const dec = (el.dataset.dec ? parseInt(el.dataset.dec) : 0);
    const obj = { v: 0 };
    ScrollTrigger.create({
      trigger: el, start: "top 88%", once: true,
      onEnter: () => {
        gsap.to(obj, {
          v: end, duration: 2, ease: "power2.out",
          onUpdate: () => { el.textContent = obj.v.toFixed(dec).replace(/\B(?=(\d{3})+(?!\d))/g, ","); },
        });
      },
    });
  });

  /* ---------- gold rule draw ---------- */
  gsap.utils.toArray(".rule-draw").forEach((el) => {
    gsap.from(el, {
      scaleX: 0, transformOrigin: "left", duration: 1.2, ease: "power3.inOut",
      scrollTrigger: { trigger: el, start: "top 90%" },
    });
  });

  ScrollTrigger.refresh();

  /* ---------- Mobile hamburger menu ---------- */
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const mobileNav = document.getElementById("mobileNav");
  if (mobileMenuBtn && mobileNav) {
    const openMenu = () => {
      mobileNav.classList.add("open");
      mobileMenuBtn.classList.add("open");
      mobileMenuBtn.setAttribute("aria-label", "ปิดเมนู");
      document.body.style.overflow = "hidden";
    };
    const closeMenu = () => {
      mobileNav.classList.remove("open");
      mobileMenuBtn.classList.remove("open");
      mobileMenuBtn.setAttribute("aria-label", "เปิดเมนู");
      document.body.style.overflow = "";
    };
    mobileMenuBtn.addEventListener("click", () => {
      mobileNav.classList.contains("open") ? closeMenu() : openMenu();
    });
    mobileNav.querySelectorAll("a").forEach(a => a.addEventListener("click", closeMenu));
    document.addEventListener("keydown", e => { if (e.key === "Escape") closeMenu(); });
  }
})();
