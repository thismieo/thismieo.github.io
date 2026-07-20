(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarsePointer = window.matchMedia("(hover: none), (pointer: coarse)").matches;

  const year = document.getElementById("current-year");
  if (year) year.textContent = String(new Date().getFullYear());

  /* Mobile navigation with Escape and outside-click guards. */
  const menuToggle = document.getElementById("menu-toggle");
  const navigation = document.getElementById("primary-navigation");

  const closeNavigation = () => {
    if (!menuToggle || !navigation) return;
    navigation.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    document.body.classList.remove("menu-open");
  };

  if (menuToggle && navigation) {
    menuToggle.addEventListener("click", () => {
      const open = navigation.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
      menuToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
      document.body.classList.toggle("menu-open", open);
    });

    navigation.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeNavigation));

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeNavigation();
    });

    document.addEventListener("pointerdown", (event) => {
      if (!navigation.classList.contains("is-open")) return;
      if (navigation.contains(event.target) || menuToggle.contains(event.target)) return;
      closeNavigation();
    });
  }

  /* Stable scroll progress. */
  const progressFill = document.getElementById("progress-fill");
  let progressFrame = 0;
  const updateProgress = () => {
    progressFrame = 0;
    const root = document.documentElement;
    const max = Math.max(0, root.scrollHeight - root.clientHeight);
    const progress = max > 0 ? (root.scrollTop / max) * 100 : 0;
    if (progressFill) progressFill.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  };
  document.addEventListener("scroll", () => {
    if (progressFrame) return;
    progressFrame = window.requestAnimationFrame(updateProgress);
  }, { passive: true });
  updateProgress();

  /* Reveal only once to avoid repeated layout work. */
  const revealElements = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealElements.forEach((element) => element.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

    revealElements.forEach((element) => revealObserver.observe(element));
  }

  /* Active navigation section. */
  const navLinks = [...document.querySelectorAll(".main-nav a[href^='#']")];
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if (sections.length && "IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible?.target?.id) return;
      navLinks.forEach((link) => {
        link.classList.toggle("is-active", link.getAttribute("href") === `#${visible.target.id}`);
      });
    }, { threshold: [0.18, 0.4, 0.65], rootMargin: "-12% 0px -48% 0px" });

    sections.forEach((section) => sectionObserver.observe(section));
  }

  /* Live city clocks: Intl handles daylight-saving changes safely. */
  const clockElements = [...document.querySelectorAll("[data-clock]")];
  const clockFormatters = new Map();

  const updateClocks = () => {
    const now = new Date();
    clockElements.forEach((element) => {
      const zone = element.dataset.clock;
      if (!zone) return;
      if (!clockFormatters.has(zone)) {
        clockFormatters.set(zone, new Intl.DateTimeFormat("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
          timeZone: zone
        }));
      }
      element.textContent = clockFormatters.get(zone).format(now);
    });
  };
  updateClocks();
  window.setInterval(updateClocks, 30_000);

  /* Weather is progressive enhancement: cached values remain if the API is unavailable. */
  const temperatureElements = [...document.querySelectorAll("[data-temperature]")];
  const weatherKeys = ["baghdad", "dubai", "newyork"];
  const weatherCacheKey = "portfolio-city-temperatures-v1";
  const weatherMaxAge = 20 * 60 * 1000;

  const renderTemperatures = (values) => {
    if (!values || typeof values !== "object") return;
    temperatureElements.forEach((element) => {
      const value = Number(values[element.dataset.temperature]);
      if (!Number.isFinite(value)) return;
      element.textContent = `${Math.round(value)}°`;
      element.setAttribute("aria-label", `${Math.round(value)} degrees Celsius`);
    });
  };

  const readWeatherCache = () => {
    try {
      const parsed = JSON.parse(window.localStorage.getItem(weatherCacheKey) || "null");
      if (!parsed?.values || !Number.isFinite(parsed.savedAt)) return null;
      renderTemperatures(parsed.values);
      return parsed;
    } catch {
      return null;
    }
  };

  const cachedWeather = readWeatherCache();

  const fetchTemperatures = async () => {
    if (!temperatureElements.length || typeof window.fetch !== "function") return;
    if (cachedWeather && Date.now() - cachedWeather.savedAt < weatherMaxAge) return;

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 5500);
    const endpoint = "https://api.open-meteo.com/v1/forecast?latitude=33.3152,25.2048,40.7128&longitude=44.3661,55.2708,-74.0060&current=temperature_2m&temperature_unit=celsius";

    try {
      const response = await window.fetch(endpoint, {
        signal: controller.signal,
        cache: "no-store",
        credentials: "omit",
        referrerPolicy: "no-referrer"
      });
      if (!response.ok) throw new Error(`Weather request failed: ${response.status}`);
      const payload = await response.json();
      const records = Array.isArray(payload) ? payload : [payload];
      const values = {};

      weatherKeys.forEach((key, index) => {
        const temperature = Number(records[index]?.current?.temperature_2m);
        if (Number.isFinite(temperature)) values[key] = temperature;
      });

      if (Object.keys(values).length) {
        renderTemperatures(values);
        try {
          window.localStorage.setItem(weatherCacheKey, JSON.stringify({ values, savedAt: Date.now() }));
        } catch {
          /* Private browsing or storage denial should never break the page. */
        }
      }
    } catch {
      /* Keep cached or placeholder values when offline. */
    } finally {
      window.clearTimeout(timeout);
    }
  };
  fetchTemperatures();

  /* Terminal typing loop. The caret remains attached to the visible text. */
  const statusText = document.getElementById("status-text");
  const consoleCaret = document.querySelector(".console-caret");
  const messages = [
    'focus = "Python Foundations"',
    'mode = "Learn · Practice · Build"',
    'next = "Data Analysis"'
  ];

  const renderTerminal = (value) => {
    if (!statusText) return;
    statusText.textContent = value;
    if (consoleCaret) consoleCaret.classList.toggle("is-hidden", value.length === 0);
  };

  if (statusText) {
    if (reduceMotion) {
      renderTerminal(messages[0]);
    } else {
      let messageIndex = 0;
      let characterIndex = 0;
      let deleting = false;
      let terminalTimer = 0;
      renderTerminal("");

      const tick = () => {
        const message = messages[messageIndex];
        characterIndex += deleting ? -1 : 1;
        characterIndex = Math.max(0, Math.min(message.length, characterIndex));
        renderTerminal(message.slice(0, characterIndex));

        if (!deleting && characterIndex === message.length) {
          terminalTimer = window.setTimeout(() => {
            deleting = true;
            tick();
          }, 1500);
          return;
        }

        if (deleting && characterIndex === 0) {
          deleting = false;
          messageIndex = (messageIndex + 1) % messages.length;
          terminalTimer = window.setTimeout(tick, 220);
          return;
        }

        terminalTimer = window.setTimeout(tick, deleting ? 27 : 49);
      };

      terminalTimer = window.setTimeout(tick, 350);
      window.addEventListener("pagehide", () => window.clearTimeout(terminalTimer), { once: true });
    }
  }

  /* Deterministic planetary motion.
     Orbit nodes and globe meridians are sampled in one animation loop.
     No SVG transform animation is used, so the globe grid cannot jump away
     from the planet center in Chromium or Edge. */
  const orbitNodes = Array.from(document.querySelectorAll(".orbit-planet[data-orbit-path]"));
  const globeMeridians = Array.from(document.querySelectorAll("[data-globe-meridian]"));
  const globeSheen = document.querySelector("[data-globe-sheen]");
  let planetaryFrame = 0;

  const orbitItems = orbitNodes.map((node) => {
    const path = document.getElementById(node.dataset.orbitPath || "");
    const duration = Math.max(1, Number(node.dataset.orbitDuration) || 18);
    const phase = Number(node.dataset.orbitPhase) || 0;
    return path && typeof path.getTotalLength === "function"
      ? { node, path, length: path.getTotalLength(), duration, phase }
      : null;
  }).filter(Boolean);

  const placePlanetaryMotion = (timeMs) => {
    const timeSeconds = timeMs / 1000;

    orbitItems.forEach(({ node, path, length, duration, phase }) => {
      const progress = reduceMotion
        ? phase % 1
        : ((timeSeconds / duration) + phase) % 1;
      const point = path.getPointAtLength(progress * length);
      node.setAttribute("cx", point.x.toFixed(3));
      node.setAttribute("cy", point.y.toFixed(3));
    });

    const globeTurn = reduceMotion ? 0.08 : (timeSeconds / 72) % 1;
    globeMeridians.forEach((meridian) => {
      const phase = Number(meridian.dataset.globePhase) || 0;
      const angle = (globeTurn + phase) * Math.PI * 2;
      const depth = Math.cos(angle);
      const centerX = 340 + (Math.sin(angle) * 34);
      const radiusX = 7 + (Math.abs(depth) * 61);
      const opacity = 0.34 + ((depth + 1) * 0.18);

      meridian.setAttribute("cx", centerX.toFixed(3));
      meridian.setAttribute("rx", radiusX.toFixed(3));
      meridian.style.opacity = opacity.toFixed(3);
    });

    if (globeSheen) {
      const sheenAngle = (globeTurn * Math.PI * 2) - Math.PI / 2;
      globeSheen.setAttribute("cx", (340 + Math.cos(sheenAngle) * 48).toFixed(3));
      globeSheen.setAttribute("cy", (310 + Math.sin(sheenAngle) * 18).toFixed(3));
    }

    if (!reduceMotion && (orbitItems.length || globeMeridians.length)) {
      planetaryFrame = window.requestAnimationFrame(placePlanetaryMotion);
    }
  };

  if (orbitItems.length || globeMeridians.length) {
    placePlanetaryMotion(performance.now());
    window.addEventListener("pagehide", () => window.cancelAnimationFrame(planetaryFrame), { once: true });
  }

  /* Smooth desktop light bloom; disabled for touch devices. */
  const cursor = document.getElementById("cursor-soft");
  if (cursor && !coarsePointer && !reduceMotion) {
    let targetX = -100;
    let targetY = -100;
    let currentX = -100;
    let currentY = -100;
    let cursorFrame = 0;

    const paintCursor = () => {
      currentX += (targetX - currentX) * 0.22;
      currentY += (targetY - currentY) * 0.22;
      cursor.style.left = `${currentX}px`;
      cursor.style.top = `${currentY}px`;

      if (Math.abs(targetX - currentX) > 0.15 || Math.abs(targetY - currentY) > 0.15) {
        cursorFrame = window.requestAnimationFrame(paintCursor);
      } else {
        cursorFrame = 0;
      }
    };

    document.addEventListener("pointermove", (event) => {
      targetX = event.clientX;
      targetY = event.clientY;
      if (currentX < -50 || currentY < -50) {
        currentX = targetX;
        currentY = targetY;
      }
      cursor.classList.add("is-visible");
      if (!cursorFrame) cursorFrame = window.requestAnimationFrame(paintCursor);
    }, { passive: true });

    document.addEventListener("pointerleave", () => cursor.classList.remove("is-visible"));
    document.addEventListener("pointerdown", () => cursor.classList.add("is-active"));
    document.addEventListener("pointerup", () => cursor.classList.remove("is-active"));
  }
})();
