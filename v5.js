(() => {
  const mobileQuery = window.matchMedia("(max-width: 860px)");
  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const saveData = Boolean(connection?.saveData);
  const lowCoreDevice = Number.isFinite(navigator.hardwareConcurrency) && navigator.hardwareConcurrency <= 4;
  const lowMemoryDevice = Number.isFinite(navigator.deviceMemory) && navigator.deviceMemory <= 4;
  const liteMode = mobileQuery.matches || saveData || lowCoreDevice || lowMemoryDevice;

  const v8Stylesheet = document.createElement("link");
  v8Stylesheet.rel = "stylesheet";
  v8Stylesheet.href = "v8.css?v=10";
  v8Stylesheet.dataset.portfolioV8 = "true";
  document.head.appendChild(v8Stylesheet);

  const v11Stylesheet = document.createElement("link");
  v11Stylesheet.rel = "stylesheet";
  v11Stylesheet.href = "v11.css?v=1";
  v11Stylesheet.dataset.portfolioV11 = "true";
  document.head.appendChild(v11Stylesheet);

  const shouldStartAtHome = () => !window.location.hash || window.location.hash === "#home";
  if ("scrollRestoration" in window.history) window.history.scrollRestoration = "manual";

  const resetToHome = () => {
    if (!shouldStartAtHome()) return;
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };

  resetToHome();
  window.addEventListener("DOMContentLoaded", resetToHome, { once: true });
  window.addEventListener("load", () => {
    resetToHome();
    window.requestAnimationFrame(resetToHome);
    window.setTimeout(resetToHome, 120);
  }, { once: true });
  window.addEventListener("pageshow", () => {
    resetToHome();
    window.requestAnimationFrame(resetToHome);
    window.setTimeout(resetToHome, 120);
  });

  const portraitThumb = "https://avatars.githubusercontent.com/u/302812532?v=4&s=256";
  const portraitFull = "https://avatars.githubusercontent.com/u/302812532?v=4&s=2048";
  const brandMark = document.querySelector(".brand-mark.brand-portrait");
  const injectedPortrait = brandMark?.querySelector("img");

  if (liteMode) {
    document.documentElement.classList.add("v6-lite");
    document.querySelector("#neural-bg")?.remove();
  }

  injectedPortrait?.remove();

  const portraitPreloader = new Image();
  portraitPreloader.decoding = "async";
  portraitPreloader.fetchPriority = "high";
  portraitPreloader.src = portraitFull;
  const portraitReady = typeof portraitPreloader.decode === "function"
    ? portraitPreloader.decode().catch(() => undefined)
    : Promise.resolve();

  const icons = {
    github: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.88c-2.78.6-3.37-1.18-3.37-1.18-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.35 1.09 2.92.83.09-.65.35-1.09.64-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.55 9.55 0 0 1 12 6.82a9.5 9.5 0 0 1 2.5.34c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.77c0 .27.18.58.69.48A10 10 0 0 0 12 2Z"/></svg>`,
    email: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.75 5.5h16.5A1.75 1.75 0 0 1 22 7.25v9.5a1.75 1.75 0 0 1-1.75 1.75H3.75A1.75 1.75 0 0 1 2 16.75v-9.5A1.75 1.75 0 0 1 3.75 5.5Zm.1 2 8.15 5.34 8.15-5.34H3.85Zm16.15 9v-6.68l-7.45 4.88a1 1 0 0 1-1.1 0L4 9.82v6.68h16Z"/></svg>`,
    kaggle: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.7 3.2h2.55v7.61l6.15-7.61h3.03l-6.03 7.2 6.48 10.4h-2.92l-5.3-8.53-1.41 1.68v6.85H6.7V3.2Z"/></svg>`,
    instagram: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.2 2.5h9.6a4.7 4.7 0 0 1 4.7 4.7v9.6a4.7 4.7 0 0 1-4.7 4.7H7.2a4.7 4.7 0 0 1-4.7-4.7V7.2a4.7 4.7 0 0 1 4.7-4.7Zm0 2A2.7 2.7 0 0 0 4.5 7.2v9.6a2.7 2.7 0 0 0 2.7 2.7h9.6a2.7 2.7 0 0 0 2.7-2.7V7.2a2.7 2.7 0 0 0-2.7-2.7H7.2Zm10.15 1.5a1.15 1.15 0 1 1 0 2.3 1.15 1.15 0 0 1 0-2.3ZM12 7.2a4.8 4.8 0 1 1 0 9.6 4.8 4.8 0 0 1 0-9.6Zm0 2a2.8 2.8 0 1 0 0 5.6 2.8 2.8 0 0 0 0-5.6Z"/></svg>`
  };

  const setupPortraitViewer = () => {
    document.querySelector(".hero-portrait-backdrop")?.remove();
    document.querySelector(".portrait-modal")?.remove();
    if (!brandMark) return;

    brandMark.innerHTML = `<img src="${portraitThumb}" alt="Mohammed Muayad" width="256" height="256" decoding="async" fetchpriority="high" />`;
    brandMark.setAttribute("role", "button");
    brandMark.setAttribute("tabindex", "0");
    brandMark.setAttribute("aria-haspopup", "dialog");
    brandMark.setAttribute("aria-label", "Open Mohammed Muayad portrait");
    brandMark.setAttribute("title", "View portrait");

    const modal = document.createElement("div");
    modal.className = "portrait-modal portrait-modal-v6";
    modal.hidden = true;
    modal.setAttribute("aria-hidden", "true");
    modal.innerHTML = `
      <div class="portrait-modal-backdrop" aria-hidden="true"></div>
      <figure class="portrait-dialog portrait-dialog-v6" role="dialog" aria-modal="true" aria-label="Portrait of Mohammed Muayad">
        <button class="portrait-close" type="button" aria-label="Close portrait viewer"><span></span><span></span></button>
        <img class="portrait-full-image" src="${portraitFull}" alt="Portrait of Mohammed Muayad" width="2048" height="2048" decoding="async" fetchpriority="high" />
      </figure>
    `;
    document.body.appendChild(modal);

    const fullImage = modal.querySelector(".portrait-full-image");
    const closeButton = modal.querySelector(".portrait-close");
    let lastFocusedElement = null;
    let closeTimer = 0;

    const showModal = () => {
      modal.hidden = false;
      modal.setAttribute("aria-hidden", "false");
      document.body.classList.add("portrait-viewer-open");
      window.requestAnimationFrame(() => {
        modal.classList.add("is-open");
        closeButton?.focus({ preventScroll: true });
      });
    };

    const openViewer = async () => {
      window.clearTimeout(closeTimer);
      lastFocusedElement = document.activeElement;
      await Promise.race([
        portraitReady,
        new Promise((resolve) => window.setTimeout(resolve, 1200))
      ]);
      if (fullImage && portraitPreloader.complete) fullImage.src = portraitPreloader.src;
      showModal();
    };

    const closeViewer = () => {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      document.body.classList.remove("portrait-viewer-open");
      closeTimer = window.setTimeout(() => {
        modal.hidden = true;
        lastFocusedElement?.focus?.({ preventScroll: true });
      }, reducedMotionQuery.matches ? 0 : 180);
    };

    const activatePortrait = (event) => {
      event.preventDefault();
      event.stopPropagation();
      openViewer();
    };

    brandMark.addEventListener("click", activatePortrait);
    brandMark.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      activatePortrait(event);
    });
    modal.addEventListener("click", closeViewer);
    closeButton?.addEventListener("click", (event) => {
      event.stopPropagation();
      closeViewer();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && modal.classList.contains("is-open")) closeViewer();
    });
  };

  const enhanceContactLinks = () => {
    [...document.querySelectorAll(".contact-links a")].forEach((link) => {
      const href = link.getAttribute("href") || "";
      const label = link.querySelector("span")?.textContent?.trim() || "Contact";
      const value = (link.querySelector("b")?.textContent || "").replace(/[↗→]+/g, "").trim();
      let type = "email";
      if (href.includes("github.com")) type = "github";
      else if (href.includes("kaggle.com")) type = "kaggle";
      else if (href.includes("instagram.com")) type = "instagram";
      link.classList.add("contact-icon-link");
      link.innerHTML = `<span class="contact-platform-icon">${icons[type]}</span><span class="contact-platform-copy"><small>${label}</small><strong>${value}</strong></span>`;
    });
  };

  const addThankYouSection = () => {
    if (document.querySelector("#thank-you")) return;
    const footer = document.querySelector(".site-footer");
    if (!footer) return;
    const section = document.createElement("section");
    section.id = "thank-you";
    section.className = "section thank-you-section";
    section.innerHTML = `<div class="container"><div class="thank-you-card"><p class="section-index">09 / THANK YOU</p><h2>Thank you for visiting.</h2><p>This portfolio documents a real learning journey—one concept, one project, and one commit at a time. I appreciate your time and hope you return to see what is built next.</p><a href="#home" class="thank-you-home" aria-label="Return to the top of the page"><span>Return to the beginning</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5 5.5 11.5l1.4 1.4 4.1-4.1V20h2V8.8l4.1 4.1 1.4-1.4L12 5Z"/></svg></a></div></div>`;
    footer.before(section);
  };

  const setupSectionMotion = () => {
    const selectors = [
      ".section-heading", ".metrics-grid article", ".about-grid > *", ".roadmap-step",
      ".stack-core", ".stack-card", ".network-visual", ".neural-info-card",
      ".focus-card", ".project-card", ".contact-card", ".contact-links a", ".thank-you-card"
    ];

    if (!mobileQuery.matches) selectors.push(".goals-copy", ".goal-list > div");

    const elements = [...document.querySelectorAll(selectors.join(","))];
    if (!elements.length) return;
    elements.forEach((element, index) => {
      element.classList.add("v6-reveal");
      element.style.setProperty("--v6-delay", `${Math.min((index % 4) * 70, 210)}ms`);
    });
    document.documentElement.classList.add("v6-motion-ready");
    if (reducedMotionQuery.matches || !("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("v6-visible"));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("v6-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -7%" });
    elements.forEach((element) => observer.observe(element));
  };

  const pauseOffscreenAnimations = () => {
    const sections = ["#home", "#neural", "#projects"].map((selector) => document.querySelector(selector)).filter(Boolean);
    if (!("IntersectionObserver" in window)) {
      sections.forEach((section) => section.classList.add("v6-active"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.target.classList.toggle("v6-active", entry.isIntersecting)),
      { threshold: 0.04, rootMargin: "15% 0px 15%" }
    );
    sections.forEach((section) => observer.observe(section));
  };

  const finalize = () => {
    setupPortraitViewer();
    enhanceContactLinks();
    addThankYouSection();
    setupSectionMotion();
    pauseOffscreenAnimations();
    document.documentElement.classList.add("v6-ready", "v8-ready", "v11-ready");
  };

  if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", finalize, { once: true });
  } else {
    window.setTimeout(finalize, 0);
  }
})();