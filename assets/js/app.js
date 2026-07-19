(() => {
  "use strict";

  const root = document.documentElement;
  const body = document.body;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const year = document.querySelector("[data-current-year]");
  const nav = document.querySelector("[data-primary-nav]");
  const navToggle = document.querySelector("[data-nav-toggle]");
  const progress = document.querySelector("[data-scroll-progress]");
  const sections = [...document.querySelectorAll("main section[id]")];
  const navLinks = [...document.querySelectorAll('[data-primary-nav] a[href^="#"]')];
  const rail = document.querySelector("[data-section-rail]");

  if (year) year.textContent = String(new Date().getFullYear());

  const setNavState = (open) => {
    if (!nav || !navToggle) return;
    nav.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    body.classList.toggle("nav-open", open);
  };

  navToggle?.addEventListener("click", () => {
    setNavState(navToggle.getAttribute("aria-expanded") !== "true");
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => setNavState(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setNavState(false);
  });

  const syncProgress = () => {
    if (!progress) return;
    const max = root.scrollHeight - root.clientHeight;
    const ratio = max > 0 ? root.scrollTop / max : 0;
    progress.style.transform = `scaleX(${Math.min(1, Math.max(0, ratio))})`;
  };

  let progressFrame = 0;
  const requestProgress = () => {
    if (progressFrame) return;
    progressFrame = window.requestAnimationFrame(() => {
      progressFrame = 0;
      syncProgress();
    });
  };

  document.addEventListener("scroll", requestProgress, { passive: true });
  window.addEventListener("resize", requestProgress, { passive: true });
  syncProgress();

  const revealElements = [...document.querySelectorAll(".reveal")];
  if (reducedMotion.matches || !("IntersectionObserver" in window)) {
    revealElements.forEach((element) => element.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, {
      threshold: 0.12,
      rootMargin: "0px 0px -48px 0px"
    });

    revealElements.forEach((element) => revealObserver.observe(element));
  }

  const railLinks = new Map();
  if (rail) {
    sections.forEach((section) => {
      const label = section.dataset.railLabel || section.id;
      const link = document.createElement("a");
      link.href = `#${section.id}`;
      link.dataset.label = label;
      link.setAttribute("aria-label", label);
      rail.append(link);
      railLinks.set(section.id, link);
    });
  }

  const setActiveSection = (id) => {
    navLinks.forEach((link) => {
      const active = link.getAttribute("href") === `#${id}`;
      link.classList.toggle("is-active", active);
      if (active) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });

    railLinks.forEach((link, sectionId) => {
      link.classList.toggle("is-active", sectionId === id);
    });
  };

  if (sections.length && "IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

      if (visible[0]) setActiveSection(visible[0].target.id);
    }, {
      rootMargin: "-28% 0px -56% 0px",
      threshold: [0.08, 0.2, 0.45]
    });

    sections.forEach((section) => sectionObserver.observe(section));
  } else if (sections[0]) {
    setActiveSection(sections[0].id);
  }

  const statusText = document.querySelector("[data-status-text]");
  const messages = [
    'focus = "Python Foundations"',
    'mode = "Learn · Practice · Build"',
    'next = "Data Analysis"'
  ];

  let typingTimer = 0;
  let messageIndex = 0;
  let characterIndex = 0;
  let deleting = false;

  const stopTyping = () => {
    window.clearTimeout(typingTimer);
    typingTimer = 0;
  };

  const typeStatus = () => {
    if (!statusText) return;
    const message = messages[messageIndex];

    if (!deleting) {
      characterIndex += 1;
      statusText.textContent = message.slice(0, characterIndex);

      if (characterIndex >= message.length) {
        typingTimer = window.setTimeout(() => {
          deleting = true;
          typeStatus();
        }, 1750);
        return;
      }
    } else {
      characterIndex -= 1;
      statusText.textContent = message.slice(0, characterIndex);

      if (characterIndex <= 0) {
        deleting = false;
        messageIndex = (messageIndex + 1) % messages.length;
      }
    }

    typingTimer = window.setTimeout(typeStatus, deleting ? 28 : 48);
  };

  const syncTyping = () => {
    stopTyping();
    if (!statusText) return;

    if (reducedMotion.matches || document.hidden) {
      statusText.textContent = messages[0];
      return;
    }

    if (!statusText.textContent) {
      characterIndex = 0;
      deleting = false;
    }

    typeStatus();
  };

  document.addEventListener("visibilitychange", syncTyping);
  if (typeof reducedMotion.addEventListener === "function") {
    reducedMotion.addEventListener("change", syncTyping);
  } else if (typeof reducedMotion.addListener === "function") {
    reducedMotion.addListener(syncTyping);
  }

  syncTyping();
})();
