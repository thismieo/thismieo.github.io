(() => {
  "use strict";

  document.documentElement.dataset.release = "2026.07.18.48";

  const header = document.querySelector("#site-header");
  const navWrap = document.querySelector("#site-header .nav-wrap");
  const menuButton = document.querySelector(".menu-toggle");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (!header || !navWrap) return;

  /* Stable mobile override hook; the query key guarantees the newest visual layer. */
  let mobileStylesheet = document.querySelector('link[data-mobile-v47]');
  if (!mobileStylesheet) {
    mobileStylesheet = document.createElement("link");
    mobileStylesheet.rel = "stylesheet";
    mobileStylesheet.dataset.mobileV47 = "true";
    document.head.append(mobileStylesheet);
  }
  mobileStylesheet.href = "mobile-v47.css?v=20260718.48";

  const portraitImage = document.querySelector("#home .hero-v33-portrait img");
  if (portraitImage) {
    portraitImage.sizes = "(max-width: 350px) 176px, (max-width: 620px) 190px, (max-width: 860px) 210px, (min-width: 1181px) 204px, 148px";
    portraitImage.decoding = "async";
    portraitImage.fetchPriority = "high";
  }

  const planetary = document.querySelector("#home .hero-v33-planetary");
  let orbitObserver = null;

  if (planetary) {
    planetary.classList.add("is-orbit-live");

    if ("IntersectionObserver" in window) {
      orbitObserver = new IntersectionObserver((entries) => {
        const entry = entries[0];
        planetary.classList.toggle("is-orbit-live", Boolean(entry?.isIntersecting));
      }, {
        root: null,
        rootMargin: "140px 0px",
        threshold: 0.03
      });
      orbitObserver.observe(planetary);
    }
  }

  document.querySelector('link[data-v17-navigation]')?.remove();
  document.querySelector('link[data-v18-cyber-rail]')?.remove();
  navWrap.querySelector(".nav-identity")?.remove();
  header.classList.remove("header-hidden");

  const entries = [
    { text: "Python Foundations" },
    { text: "AI Engineering" },
    { text: "Building in Public" },
    { text: "Data Analysis Next" },
    { text: "Projects in Progress" },
    { city: "Baghdad", timeZone: "Asia/Baghdad" }
  ];

  const formatBaghdadTime = (() => {
    try {
      return new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Baghdad",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
      });
    } catch {
      return null;
    }
  })();

  const createItem = (entry) => {
    const item = document.createElement("span");
    item.className = "cyber-item-v46";

    if (!entry.timeZone) {
      item.textContent = entry.text;
      return item;
    }

    const city = document.createElement("span");
    city.className = "cyber-city-v46";
    city.textContent = entry.city;

    const time = document.createElement("time");
    time.className = "cyber-time-v46";
    time.dataset.timeZone = entry.timeZone;
    time.textContent = "--:-- --";

    item.append(city, time);
    return item;
  };

  const createGroup = (duplicate = false) => {
    const group = document.createElement("div");
    group.className = "cyber-group-v46";
    if (duplicate) group.setAttribute("aria-hidden", "true");
    entries.forEach((entry) => group.append(createItem(entry)));
    return group;
  };

  let rail = navWrap.querySelector(".cyber-rail");
  if (!rail) {
    rail = document.createElement("div");
    rail.className = "cyber-rail";
    navWrap.insertBefore(rail, menuButton || navWrap.firstChild);
  }

  rail.replaceChildren();

  const title = document.createElement("a");
  title.className = "cyber-rail-title";
  title.href = "#home";
  title.setAttribute("aria-label", "Return to the portfolio home");
  title.innerHTML = "<span>AI ENGINEERING</span><strong>JOURNEY</strong>";

  const stream = document.createElement("div");
  stream.className = "cyber-stream";
  stream.setAttribute("role", "region");
  stream.setAttribute("aria-label", "Current learning status");

  const track = document.createElement("div");
  track.className = "cyber-track-v46";
  const primaryGroup = createGroup(false);
  const duplicateGroup = createGroup(true);
  track.append(primaryGroup, duplicateGroup);
  stream.append(track);

  const status = document.createElement("span");
  status.className = "cyber-status";
  status.setAttribute("aria-label", "Learning journey active");
  status.innerHTML = '<i aria-hidden="true"></i><span>ACTIVE</span>';

  rail.append(title, stream, status);

  const updateTime = () => {
    const now = new Date();
    track.querySelectorAll(".cyber-time-v46").forEach((node) => {
      node.textContent = formatBaghdadTime ? formatBaghdadTime.format(now) : "UTC+3";
      node.dateTime = now.toISOString();
    });
  };

  let lastGroupWidth = 0;
  let lastViewportWidth = Math.round(window.visualViewport?.width || document.documentElement.clientWidth || window.innerWidth);

  const restartTrack = () => {
    track.classList.remove("is-ready");
    void track.offsetWidth;
    track.classList.add("is-ready");
  };

  const syncLoop = ({ force = false, restart = false } = {}) => {
    const width = primaryGroup.getBoundingClientRect().width;
    if (!Number.isFinite(width) || width <= 0) return;

    const roundedWidth = Math.ceil(width);
    const widthChanged = Math.abs(roundedWidth - lastGroupWidth) > 1;

    if (force || widthChanged) {
      lastGroupWidth = roundedWidth;
      const duration = Math.max(34, Math.min(64, roundedWidth / 23));
      track.style.setProperty("--cyber-v46-shift", `${-roundedWidth}px`);
      track.style.setProperty("--cyber-v46-duration", `${duration.toFixed(2)}s`);
    }

    if (reducedMotion.matches) {
      track.classList.remove("is-ready");
      return;
    }

    if (!track.classList.contains("is-ready")) {
      track.classList.add("is-ready");
    } else if (restart && (force || widthChanged)) {
      restartTrack();
    }
  };

  updateTime();
  window.requestAnimationFrame(() => syncLoop({ force: true }));

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => syncLoop({ force: true, restart: true })).catch(() => {});
  }

  let resizeTimer = 0;
  const queueWidthSync = (force = false) => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      const nextWidth = Math.round(window.visualViewport?.width || document.documentElement.clientWidth || window.innerWidth);
      const viewportChanged = Math.abs(nextWidth - lastViewportWidth) > 2;
      if (!force && !viewportChanged) return;
      lastViewportWidth = nextWidth;
      syncLoop({ force: true, restart: true });
    }, 180);
  };

  window.addEventListener("resize", () => queueWidthSync(false), { passive: true });
  window.visualViewport?.addEventListener("resize", () => queueWidthSync(false), { passive: true });
  window.addEventListener("orientationchange", () => queueWidthSync(true), { passive: true });

  const clockTimer = window.setInterval(() => {
    if (!document.hidden) updateTime();
  }, 30000);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) return;
    updateTime();
    syncLoop();
  });

  window.addEventListener("pagehide", () => {
    window.clearInterval(clockTimer);
    orbitObserver?.disconnect();
  }, { once: true });

  const handleMotionPreference = () => syncLoop({ force: true, restart: true });
  if (typeof reducedMotion.addEventListener === "function") {
    reducedMotion.addEventListener("change", handleMotionPreference);
  } else if (typeof reducedMotion.addListener === "function") {
    reducedMotion.addListener(handleMotionPreference);
  }

  title.addEventListener("click", () => {
    if (menuButton?.getAttribute("aria-expanded") === "true") menuButton.click();
  });
})();