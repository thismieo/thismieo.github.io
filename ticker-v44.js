(() => {
  "use strict";

  document.documentElement.dataset.release = "2026.07.18.50";

  const ticker = document.querySelector(".system-ticker");
  if (!ticker || ticker.dataset.tickerV50Ready === "true") return;

  ticker.dataset.tickerV50Ready = "true";
  ticker.removeAttribute("aria-hidden");
  ticker.setAttribute("role", "region");
  ticker.setAttribute("aria-label", "Live world times and learning status");

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const entries = [
    { city: "Baghdad", timeZone: "Asia/Baghdad" },
    { city: "Dubai", timeZone: "Asia/Dubai" },
    { city: "New York", timeZone: "America/New_York" },
    { text: "Current Focus · Python Foundations" },
    { text: "Next Layer · Data Analysis" },
    { text: "Method · Learn · Practice · Build" },
    { text: "AI Engineering Roadmap" },
    { text: "Projects · In Progress" },
    { text: "Building in Public" },
    { text: "Consistency Over Speed" }
  ];

  const timeFormatters = new Map();

  const getFormatter = (timeZone) => {
    if (!timeFormatters.has(timeZone)) {
      timeFormatters.set(timeZone, new Intl.DateTimeFormat("en-US", {
        timeZone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
      }));
    }
    return timeFormatters.get(timeZone);
  };

  const makeItem = (entry) => {
    const item = document.createElement("span");
    item.className = "ticker-v44-item";

    if (entry.timeZone) {
      const city = document.createElement("span");
      city.className = "ticker-v44-city";
      city.textContent = entry.city;

      const time = document.createElement("time");
      time.className = "ticker-v44-time";
      time.dataset.timeZone = entry.timeZone;
      time.textContent = "--:--:-- --";

      item.append(city, time);
      return item;
    }

    item.textContent = entry.text;
    return item;
  };

  const makeGroup = (isDuplicate = false) => {
    const group = document.createElement("div");
    group.className = "ticker-v44-group";
    if (isDuplicate) group.setAttribute("aria-hidden", "true");
    entries.forEach((entry) => group.append(makeItem(entry)));
    return group;
  };

  const track = document.createElement("div");
  track.className = "ticker-v44-track";

  const primaryGroup = makeGroup(false);
  const duplicateGroup = makeGroup(true);
  track.append(primaryGroup, duplicateGroup);
  ticker.replaceChildren(track);

  let tickerVisible = true;
  const updateTimes = () => {
    if (!tickerVisible || document.hidden) return;
    const now = new Date();

    track.querySelectorAll(".ticker-v44-time[data-time-zone]").forEach((timeNode) => {
      const timeZone = timeNode.dataset.timeZone;
      try {
        timeNode.textContent = getFormatter(timeZone).format(now);
        timeNode.dateTime = now.toISOString();
      } catch {
        timeNode.textContent = "TIME UNAVAILABLE";
      }
    });
  };

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entriesList) => {
      tickerVisible = entriesList.some((entry) => entry.isIntersecting);
      if (tickerVisible) updateTimes();
    }, { rootMargin: "100px 0px" });
    observer.observe(ticker);
  }

  const timelineKey = "thismieo:ribbon-timeline-origin:v50";
  const getTimelineOrigin = () => {
    const now = Date.now();
    try {
      const stored = Number(window.localStorage.getItem(timelineKey));
      if (Number.isFinite(stored) && stored > 0 && stored <= now) return stored;
      window.localStorage.setItem(timelineKey, String(now));
    } catch {
      /* Fall back to this page session when persistent storage is unavailable. */
    }
    return now;
  };

  const timelineOrigin = getTimelineOrigin();
  const elapsedSeconds = () => Math.max(0, (Date.now() - timelineOrigin) / 1000);

  let lastGroupWidth = 0;
  let activeDuration = 72;
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
    const groupWidth = primaryGroup.getBoundingClientRect().width;
    if (!Number.isFinite(groupWidth) || groupWidth <= 0) return;

    const roundedWidth = Math.ceil(groupWidth);
    const widthChanged = Math.abs(roundedWidth - lastGroupWidth) > 1;

    if (force || widthChanged) {
      lastGroupWidth = roundedWidth;
      activeDuration = Math.max(58, Math.min(96, roundedWidth / 27));
      track.style.setProperty("--ticker-v44-shift", `${-roundedWidth}px`);
      track.style.setProperty("--ticker-v44-duration", `${activeDuration.toFixed(2)}s`);
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

  updateTimes();
  window.requestAnimationFrame(() => syncLoop({ force: true }));

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => syncLoop({ force: true, restart: true })).catch(() => {});
  }

  window.setInterval(updateTimes, 1000);

  let resizeTimer = 0;
  const queueWidthSync = (force = false) => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      const nextWidth = Math.round(window.visualViewport?.width || document.documentElement.clientWidth || window.innerWidth);
      const viewportChanged = Math.abs(nextWidth - lastViewportWidth) > 2;
      if (!force && !viewportChanged) return;
      lastViewportWidth = nextWidth;
      syncLoop({ force: true, restart: true });
    }, 200);
  };

  window.addEventListener("resize", () => queueWidthSync(false), { passive: true });
  window.visualViewport?.addEventListener("resize", () => queueWidthSync(false), { passive: true });
  window.addEventListener("orientationchange", () => queueWidthSync(true), { passive: true });

  const realignAfterReturn = () => {
    if (document.hidden) return;
    updateTimes();
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
})();