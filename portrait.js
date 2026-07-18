(() => {
  "use strict";

  document.documentElement.dataset.release = "2026.07.18.68";

  const header = document.querySelector("#site-header");
  const navWrap = document.querySelector("#site-header .nav-wrap");
  const menuButton = document.querySelector(".menu-toggle");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (!header || !navWrap) return;

  /* Stable mobile override hook; the query key guarantees the newest visual layer. */
  let mobileStylesheet = document.querySelector("link[data-mobile-v47]");
  if (!mobileStylesheet) {
    mobileStylesheet = document.createElement("link");
    mobileStylesheet.rel = "stylesheet";
    mobileStylesheet.dataset.mobileV47 = "true";
    document.head.append(mobileStylesheet);
  }
  mobileStylesheet.href = "mobile-v47.css?v=20260718.68";

  const planetary = document.querySelector("#home .hero-v33-planetary");
  if (planetary) {
    planetary.classList.add("is-orbit-live");

    if ("IntersectionObserver" in window) {
      const orbitObserver = new IntersectionObserver((entries) => {
        planetary.classList.toggle("is-orbit-live", Boolean(entries[0]?.isIntersecting));
      }, {
        root: null,
        rootMargin: "140px 0px",
        threshold: 0.03
      });
      orbitObserver.observe(planetary);
    }
  }

  document.querySelector("link[data-v17-navigation]")?.remove();
  document.querySelector("link[data-v18-cyber-rail]")?.remove();
  navWrap.querySelector(".nav-identity")?.remove();
  header.classList.remove("header-hidden");

  /* Fresh technical and motivational statements. World times belong to the lower ribbon only. */
  const entries = [
    "Build Systems · Not Shortcuts",
    "Data Becomes Intelligence",
    "Think · Test · Refine",
    "Patterns Become Predictions",
    "Progress Compounds Quietly",
    "Code With Purpose"
  ];

  const createItem = (text) => {
    const item = document.createElement("span");
    item.className = "cyber-item-v46";
    item.textContent = text;
    return item;
  };

  const createGroup = (duplicate = false) => {
    const group = document.createElement("div");
    group.className = "cyber-group-v46";
    if (duplicate) group.setAttribute("aria-hidden", "true");
    entries.forEach((text) => group.append(createItem(text)));
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
  stream.setAttribute("aria-label", "Technical and motivational engineering statements");

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

  /* Both ribbons share one persistent clock, so navigation never visually resets them to zero. */
  const timelineKey = "thismieo:ribbon-timeline-origin:v50";
  const getTimelineOrigin = () => {
    const now = Date.now();
    try {
      const stored = Number(window.localStorage.getItem(timelineKey));
      if (Number.isFinite(stored) && stored > 0 && stored <= now) return stored;
      window.localStorage.setItem(timelineKey, String(now));
    } catch {
      /* Storage can be unavailable in private browsing; the current page still works normally. */
    }
    return now;
  };

  const timelineOrigin = getTimelineOrigin();
  const elapsedSeconds = () => Math.max(0, (Date.now() - timelineOrigin) / 1000);

  let lastGroupWidth = 0;
  let activeDuration = 44;
  let lastViewportWidth = Math.round(window.visualViewport?.width || document.documentElement.clientWidth || window.innerWidth);

  const alignTimeline = () => {
    const phase = elapsedSeconds() % activeDuration;
    track.style.animationDelay = `${-phase.toFixed(3)}s`;
  };

  const restartTrackAtCurrentTime = () => {
    track.classList.remove("is-ready");
    alignTimeline();
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
      activeDuration = Math.max(42, Math.min(74, roundedWidth / 22));
      track.style.setProperty("--cyber-v46-shift", `${-roundedWidth}px`);
      track.style.setProperty("--cyber-v46-duration", `${activeDuration.toFixed(2)}s`);
    }

    if (reducedMotion.matches) {
      track.classList.remove("is-ready");
      track.style.animationDelay = "0s";
      return;
    }

    if (!track.classList.contains("is-ready")) {
      alignTimeline();
      track.classList.add("is-ready");
    } else if (restart || widthChanged) {
      restartTrackAtCurrentTime();
    }
  };

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

  const realignAfterReturn = () => {
    if (document.hidden) return;
    syncLoop({ restart: true });
  };

  document.addEventListener("visibilitychange", realignAfterReturn);
  window.addEventListener("pageshow", realignAfterReturn);

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