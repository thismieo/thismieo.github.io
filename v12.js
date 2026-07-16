(() => {
  "use strict";

  const qs = (selector, scope = document) => scope.querySelector(selector);
  const qsa = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  const mobileQuery = window.matchMedia("(max-width: 860px)");
  const finePointerQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const lowCoreDevice = Number.isFinite(navigator.hardwareConcurrency) && navigator.hardwareConcurrency <= 4;
  const lowMemoryDevice = Number.isFinite(navigator.deviceMemory) && navigator.deviceMemory <= 4;
  const liteMode = mobileQuery.matches || Boolean(connection?.saveData) || lowCoreDevice || lowMemoryDevice;

  const header = qs("#site-header");
  const menuButton = qs(".menu-toggle");
  const navigation = qs("#primary-navigation");
  const navLinks = qsa(".main-nav a");
  const sections = qsa("main section[id]");
  const yearElement = qs("#current-year");
  const progressBar = qs(".scroll-progress");
  const cursorAura = qs(".cursor-aura");
  const typedSignal = qs("#typed-signal");
  const heroStage = qs(".core-stage");

  document.documentElement.classList.add("v12-ready", liteMode ? "v12-lite" : "v12-full");
  if (liteMode) qs("#neural-bg")?.remove();

  /* Start new visits at Home without repeatedly fighting user scrolling. */
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  const startAtHome = !location.hash || location.hash === "#home";
  if (startAtHome) requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0, behavior: "auto" }));

  const closeMenu = () => {
    if (!menuButton || !navigation) return;
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation");
    navigation.classList.remove("open");
    document.body.classList.remove("menu-open");
  };

  menuButton?.addEventListener("click", () => {
    const open = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!open));
    menuButton.setAttribute("aria-label", open ? "Open navigation" : "Close navigation");
    navigation?.classList.toggle("open", !open);
    document.body.classList.toggle("menu-open", !open);
  });

  navLinks.forEach((link) => link.addEventListener("click", closeMenu));
  window.addEventListener("resize", () => {
    if (window.innerWidth > 860) closeMenu();
  }, { passive: true });

  let scrollFrame = 0;
  const updateScrollUI = () => {
    scrollFrame = 0;
    header?.classList.toggle("scrolled", window.scrollY > 18);
    if (!progressBar) return;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
    progressBar.style.transform = `scaleX(${progress})`;
  };

  const requestScrollUI = () => {
    if (scrollFrame) return;
    scrollFrame = requestAnimationFrame(updateScrollUI);
  };

  window.addEventListener("scroll", requestScrollUI, { passive: true });
  window.addEventListener("resize", requestScrollUI, { passive: true });
  updateScrollUI();

  if (yearElement) yearElement.textContent = String(new Date().getFullYear());

  /* One reveal system for the complete page. */
  const revealElements = qsa(".reveal");
  revealElements.forEach((element, index) => {
    element.style.setProperty("--reveal-delay", `${Math.min((index % 4) * 65, 195)}ms`);
  });

  if (reducedMotionQuery.matches || !("IntersectionObserver" in window)) {
    revealElements.forEach((element) => element.classList.add("visible"));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -6%" });
    revealElements.forEach((element) => revealObserver.observe(element));
  }

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      const current = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!current) return;
      const activeId = current.target.id;
      navLinks.forEach((link) => {
        const targetId = link.getAttribute("href")?.slice(1);
        link.classList.toggle("active", targetId === activeId);
      });
    }, { threshold: [0.2, 0.4, 0.6], rootMargin: "-14% 0px -56%" });
    sections.forEach((section) => sectionObserver.observe(section));

    const animatedSections = ["#home", "#neural", "#projects"]
      .map((selector) => qs(selector))
      .filter(Boolean);
    const activityObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.target.classList.toggle("v6-active", entry.isIntersecting));
    }, { threshold: 0.04, rootMargin: "15% 0px 15%" });
    animatedSections.forEach((section) => activityObserver.observe(section));
  } else {
    ["#home", "#neural", "#projects"].forEach((selector) => qs(selector)?.classList.add("v6-active"));
  }

  /* Typed status — visual only, without noisy live-region announcements. */
  if (typedSignal && !reducedMotionQuery.matches) {
    const phrases = [
      "Python foundations active",
      "Algorithms loading",
      "Machine learning next",
      "Building one commit at a time",
      "Neural systems in the roadmap"
    ];
    let phraseIndex = 0;
    let characterIndex = 0;
    let deleting = false;
    let typeTimer = 0;

    const typeNext = () => {
      const phrase = phrases[phraseIndex];
      characterIndex += deleting ? -1 : 1;
      typedSignal.textContent = phrase.slice(0, characterIndex);
      if (!deleting && characterIndex >= phrase.length) {
        deleting = true;
        typeTimer = window.setTimeout(typeNext, 1500);
        return;
      }
      if (deleting && characterIndex <= 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typeTimer = window.setTimeout(typeNext, 340);
        return;
      }
      typeTimer = window.setTimeout(typeNext, deleting ? 34 : 62);
    };

    typedSignal.textContent = "";
    typeNext();
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) window.clearTimeout(typeTimer);
      else typeNext();
    });
  }

  /* Fine-pointer effects never run on touch devices. */
  if (finePointerQuery.matches && !reducedMotionQuery.matches) {
    window.addEventListener("pointermove", (event) => {
      if (!cursorAura) return;
      cursorAura.classList.add("active");
      cursorAura.style.left = `${event.clientX}px`;
      cursorAura.style.top = `${event.clientY}px`;
    }, { passive: true });
    document.addEventListener("mouseleave", () => cursorAura?.classList.remove("active"));

    qsa(".metrics-grid article, .glass-card, .roadmap-step, .stack-card, .focus-card, .project-card, .contact-card")
      .forEach((card) => {
        card.addEventListener("pointermove", (event) => {
          const rect = card.getBoundingClientRect();
          card.style.setProperty("--mouse-x", `${event.clientX - rect.left}px`);
          card.style.setProperty("--mouse-y", `${event.clientY - rect.top}px`);
        }, { passive: true });
      });

    const heroVisual = heroStage?.closest(".hero-visual");
    heroVisual?.addEventListener("pointermove", (event) => {
      const rect = heroVisual.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      heroStage.style.transform = `rotateX(${y * -5}deg) rotateY(${x * 7}deg) translateZ(0)`;
    }, { passive: true });
    heroVisual?.addEventListener("pointerleave", () => {
      heroStage.style.transform = "rotateX(0deg) rotateY(0deg) translateZ(0)";
    });
  }

  /* Accessible, on-demand portrait viewer. */
  const portraitTrigger = qs("#portrait-trigger");
  const portraitModal = qs("#portrait-modal");
  const portraitImage = qs("#portrait-full-image");
  const portraitClose = qs("#portrait-close");
  const portraitFull = portraitImage?.dataset.src || "";
  const inertTargets = [header, qs("main"), qs(".site-footer")].filter(Boolean);
  let lastFocusedElement = null;

  const setPageInert = (value) => inertTargets.forEach((target) => {
    target.inert = value;
    target.toggleAttribute("aria-hidden", value);
  });

  const closePortrait = () => {
    if (!portraitModal || portraitModal.hidden) return;
    portraitModal.classList.remove("is-open");
    portraitModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("portrait-viewer-open");
    setPageInert(false);
    const delay = reducedMotionQuery.matches ? 0 : 130;
    window.setTimeout(() => {
      portraitModal.hidden = true;
      lastFocusedElement?.focus?.({ preventScroll: true });
    }, delay);
  };

  const openPortrait = async () => {
    if (!portraitModal || !portraitImage || !portraitFull) return;
    lastFocusedElement = document.activeElement;
    if (!portraitImage.src) {
      portraitImage.src = portraitFull;
      try {
        await Promise.race([
          typeof portraitImage.decode === "function" ? portraitImage.decode() : Promise.resolve(),
          new Promise((resolve) => window.setTimeout(resolve, 1000))
        ]);
      } catch {
        /* The browser can still display the image after a decode rejection. */
      }
    }
    portraitModal.hidden = false;
    portraitModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("portrait-viewer-open");
    setPageInert(true);
    requestAnimationFrame(() => {
      portraitModal.classList.add("is-open");
      portraitClose?.focus({ preventScroll: true });
    });
  };

  portraitTrigger?.addEventListener("click", openPortrait);
  portraitClose?.addEventListener("click", (event) => {
    event.stopPropagation();
    closePortrait();
  });
  portraitModal?.addEventListener("click", closePortrait);
  qs(".portrait-dialog-v6", portraitModal || document)?.addEventListener("click", (event) => {
    if (event.target === portraitImage) closePortrait();
    else event.stopPropagation();
  });
  document.addEventListener("keydown", (event) => {
    if (!portraitModal || portraitModal.hidden) return;
    if (event.key === "Escape") closePortrait();
    if (event.key === "Tab") {
      event.preventDefault();
      portraitClose?.focus({ preventScroll: true });
    }
  });

  /* Desktop neural background; mobile and constrained devices remain lightweight. */
  const canvas = qs("#neural-bg");
  if (canvas && !liteMode && !reducedMotionQuery.matches) {
    const context = canvas.getContext("2d", { alpha: true });
    if (context) {
      const palette = [
        [103, 232, 249],
        [96, 165, 250],
        [167, 139, 250],
        [240, 168, 191]
      ];
      let width = 0;
      let height = 0;
      let ratio = 1;
      let nodes = [];
      let frame = 0;

      class Node {
        constructor() { this.reset(true); }
        reset(initial = false) {
          this.x = Math.random() * width;
          this.y = initial ? Math.random() * height : height + 20;
          this.radius = Math.random() * 1.5 + 0.7;
          this.vx = (Math.random() - 0.5) * 0.16;
          this.vy = -(Math.random() * 0.12 + 0.035);
          this.phase = Math.random() * Math.PI * 2;
          this.color = palette[Math.floor(Math.random() * palette.length)];
        }
        update(time) {
          this.phase += 0.008;
          this.x += this.vx + Math.sin(this.phase) * 0.03;
          this.y += this.vy;
          if (this.y < -24 || this.x < -30 || this.x > width + 30) this.reset(false);
          this.pulse = 0.68 + Math.sin(time * 0.0017 + this.phase) * 0.22;
        }
        draw() {
          const [r, g, b] = this.color;
          context.beginPath();
          context.arc(this.x, this.y, this.radius * (0.9 + this.pulse * 0.22), 0, Math.PI * 2);
          context.fillStyle = `rgba(${r}, ${g}, ${b}, ${0.35 + this.pulse * 0.28})`;
          context.shadowBlur = 10;
          context.shadowColor = `rgba(${r}, ${g}, ${b}, 0.6)`;
          context.fill();
          context.shadowBlur = 0;
        }
      }

      const resizeCanvas = () => {
        ratio = Math.min(window.devicePixelRatio || 1, 2);
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = Math.floor(width * ratio);
        canvas.height = Math.floor(height * ratio);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        context.setTransform(ratio, 0, 0, ratio, 0, 0);
        const target = Math.max(34, Math.min(68, Math.round((width * height) / 27000)));
        nodes = nodes.slice(0, target);
        while (nodes.length < target) nodes.push(new Node());
      };

      const drawConnections = () => {
        const maxDistance = 132;
        const maxDistanceSquared = maxDistance * maxDistance;
        for (let i = 0; i < nodes.length; i += 1) {
          for (let j = i + 1; j < nodes.length; j += 1) {
            const first = nodes[i];
            const second = nodes[j];
            const dx = first.x - second.x;
            const dy = first.y - second.y;
            const distanceSquared = dx * dx + dy * dy;
            if (distanceSquared >= maxDistanceSquared) continue;
            const opacity = (1 - Math.sqrt(distanceSquared) / maxDistance) * 0.12;
            context.beginPath();
            context.moveTo(first.x, first.y);
            context.lineTo(second.x, second.y);
            context.strokeStyle = `rgba(103, 232, 249, ${opacity})`;
            context.lineWidth = 0.7;
            context.stroke();
          }
        }
      };

      const animate = (time) => {
        context.clearRect(0, 0, width, height);
        nodes.forEach((node) => node.update(time));
        drawConnections();
        nodes.forEach((node) => node.draw());
        frame = requestAnimationFrame(animate);
      };

      window.addEventListener("resize", resizeCanvas, { passive: true });
      document.addEventListener("visibilitychange", () => {
        if (document.hidden) cancelAnimationFrame(frame);
        else frame = requestAnimationFrame(animate);
      });
      resizeCanvas();
      frame = requestAnimationFrame(animate);
    }
  }
})();