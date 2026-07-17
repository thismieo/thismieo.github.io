(() => {
  "use strict";

  document.documentElement.dataset.release = "2026.07.18.44";

  const ticker = document.querySelector(".system-ticker");
  if (!ticker || ticker.dataset.tickerV44Ready === "true") return;

  ticker.dataset.tickerV44Ready = "true";
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

  const updateTimes = () => {
    const now = new Date();
    track.querySelectorAll(".ticker-v44-time[data-time-zone]").forEach((timeNode) => {
      const timeZone = timeNode.dataset.timeZone;
      try {
        timeNode.textContent = getFormatter(timeZone).format(now);
        timeNode.dateTime = now.toISOString();
      } catch (error) {
        timeNode.textContent = "TIME UNAVAILABLE";
      }
    });
  };

  const syncLoop = (restart = false) => {
    const groupWidth = primaryGroup.getBoundingClientRect().width;
    if (!Number.isFinite(groupWidth) || groupWidth <= 0) return;

    const roundedWidth = Math.ceil(groupWidth);
    const duration = Math.max(58, Math.min(96, roundedWidth / 27));
    track.style.setProperty("--ticker-v44-shift", `${-roundedWidth}px`);
    track.style.setProperty("--ticker-v44-duration", `${duration.toFixed(2)}s`);

    if (reducedMotion.matches) {
      track.classList.remove("is-ready");
      return;
    }

    if (restart || !track.classList.contains("is-ready")) {
      track.classList.remove("is-ready");
      void track.offsetWidth;
      track.classList.add("is-ready");
    }
  };

  updateTimes();
  window.requestAnimationFrame(() => syncLoop(true));

  if (document.fonts?.ready) {
    document.fonts.ready.then(() => syncLoop(true)).catch(() => {});
  }

  window.setInterval(updateTimes, 1000);

  let resizeTimer = 0;
  window.addEventListener("resize", () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => syncLoop(true), 180);
  }, { passive: true });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) return;
    updateTimes();
    syncLoop(false);
  });

  const handleMotionPreference = () => syncLoop(true);
  if (typeof reducedMotion.addEventListener === "function") {
    reducedMotion.addEventListener("change", handleMotionPreference);
  } else if (typeof reducedMotion.addListener === "function") {
    reducedMotion.addListener(handleMotionPreference);
  }
})();
