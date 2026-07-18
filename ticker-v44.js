(() => {
  "use strict";

  document.documentElement.dataset.release = "2026.07.18.52";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* Replace the legacy progress node so the old controller can no longer move it. */
  const legacyProgress = document.querySelector(".scroll-progress");
  if (legacyProgress && legacyProgress.dataset.progressV52Ready !== "true") {
    const progressBar = legacyProgress.cloneNode(false);
    progressBar.dataset.progressV52Ready = "true";
    progressBar.setAttribute("aria-hidden", "true");
    legacyProgress.replaceWith(progressBar);

    const scrollingElement = document.scrollingElement || document.documentElement;
    let progressFrame = 0;
    let stableViewportHeight = Math.max(1, document.documentElement.clientHeight || window.innerHeight || 1);

    const readViewportHeight = () => Math.max(
      1,
      document.documentElement.clientHeight || 0,
      Math.round(window.visualViewport?.height || 0),
      window.innerHeight || 0
    );

    const updateProgress = () => {
      progressFrame = 0;
      stableViewportHeight = Math.max(stableViewportHeight, readViewportHeight());
      const scrollTop = Math.max(0, scrollingElement.scrollTop || window.scrollY || 0);
      const scrollable = Math.max(0, scrollingElement.scrollHeight - stableViewportHeight);
      const progress = scrollTop <= 1 || scrollable <= 0
        ? 0
        : Math.min(1, Math.max(0, scrollTop / scrollable));
      progressBar.style.transform = `translate3d(0, 0, 0) scaleX(${progress.toFixed(5)})`;
    };

    const queueProgress = () => {
      if (progressFrame) return;
      progressFrame = window.requestAnimationFrame(updateProgress);
    };

    const resetProgressViewport = () => {
      stableViewportHeight = readViewportHeight();
      window.setTimeout(queueProgress, 120);
    };

    window.addEventListener("scroll", queueProgress, { passive: true });
    window.addEventListener("resize", queueProgress, { passive: true });
    window.visualViewport?.addEventListener("resize", queueProgress, { passive: true });
    window.addEventListener("orientationchange", resetProgressViewport, { passive: true });
    window.addEventListener("pageshow", queueProgress);
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) queueProgress();
    });
    updateProgress();
  }

  const ticker = document.querySelector(".system-ticker");
  if (!ticker || ticker.dataset.tickerV52Ready === "true") return;

  ticker.dataset.tickerV52Ready = "true";
  ticker.removeAttribute("aria-hidden");
  ticker.setAttribute("role", "region");
  ticker.setAttribute("aria-label", "Live Baghdad weather, date, world times, and learning status");

  const BAGHDAD_TIME_ZONE = "Asia/Baghdad";
  const WEATHER_URL = "https://api.open-meteo.com/v1/forecast?latitude=33.3152&longitude=44.3661&current=temperature_2m,weather_code,is_day&temperature_unit=celsius&timezone=Asia%2FBaghdad";
  const WEATHER_CACHE_KEY = "thismieo:baghdad-weather:v52";
  const WEATHER_REFRESH_MS = 15 * 60 * 1000;
  const WEATHER_CACHE_MAX_AGE_MS = 6 * 60 * 60 * 1000;

  const entries = [
    { city: "Baghdad", timeZone: BAGHDAD_TIME_ZONE },
    { kind: "weather" },
    { kind: "date" },
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
  const dateFormatter = new Intl.DateTimeFormat("en-US", {
    timeZone: BAGHDAD_TIME_ZONE,
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric"
  });

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

  const weatherKind = (code) => {
    if (code === 0) return "clear";
    if ([1, 2].includes(code)) return "partly";
    if (code === 3) return "cloud";
    if ([45, 48].includes(code)) return "fog";
    if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return "rain";
    if ((code >= 71 && code <= 77) || [85, 86].includes(code)) return "snow";
    if (code >= 95) return "storm";
    return "cloud";
  };

  const weatherLabel = (kind, isDay) => {
    const labels = {
      clear: isDay ? "Clear sky" : "Clear night",
      partly: "Partly cloudy",
      cloud: "Cloudy",
      fog: "Fog",
      rain: "Rain",
      snow: "Snow",
      storm: "Thunderstorm"
    };
    return labels[kind] || "Current weather";
  };

  const weatherSvg = (kind, isDay) => {
    const cloud = '<path d="M6.8 17.5h10.1a3.6 3.6 0 0 0 .4-7.2 5.5 5.5 0 0 0-10.6 1.5 2.9 2.9 0 0 0 .1 5.7Z"/>';
    const sun = '<circle cx="8" cy="8" r="3"/><path d="M8 2v1.5M8 12.5V14M2 8h1.5M12.5 8H14M3.8 3.8l1 1M11.2 11.2l1 1M12.2 3.8l-1 1M4.8 11.2l-1 1"/>';
    const moon = '<path d="M10.7 3.2a6.2 6.2 0 1 0 7.1 8.6 5.3 5.3 0 0 1-7.1-8.6Z"/><path d="M18.2 4.3v2.4M17 5.5h2.4"/>';

    if (kind === "clear") return `<svg viewBox="0 0 24 24" aria-hidden="true">${isDay ? '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M18.7 5.3l-1.4 1.4M6.7 17.3l-1.4 1.4"/>' : moon}</svg>`;
    if (kind === "partly") return `<svg viewBox="0 0 24 24" aria-hidden="true">${isDay ? sun : moon}${cloud}</svg>`;
    if (kind === "rain") return `<svg viewBox="0 0 24 24" aria-hidden="true">${cloud}<path d="m9 19.5-1 2M13 19.5l-1 2M17 19.5l-1 2"/></svg>`;
    if (kind === "snow") return `<svg viewBox="0 0 24 24" aria-hidden="true">${cloud}<path d="M9 19.5v2M8 20.5h2M14 19.5v2M13 20.5h2"/></svg>`;
    if (kind === "storm") return `<svg viewBox="0 0 24 24" aria-hidden="true">${cloud}<path d="m13 18-2 3h2l-1 2 4-4h-2l1-1"/></svg>`;
    if (kind === "fog") return `<svg viewBox="0 0 24 24" aria-hidden="true">${cloud}<path d="M5 20h14M7 22h10"/></svg>`;
    return `<svg viewBox="0 0 24 24" aria-hidden="true">${cloud}</svg>`;
  };

  const makeItem = (entry) => {
    const item = document.createElement("span");
    item.className = "ticker-v44-item";

    if (entry.kind === "weather") {
      item.classList.add("ticker-v52-weather");
      item.innerHTML = [
        '<span class="ticker-v44-city">Baghdad Weather</span>',
        '<span class="ticker-v52-weather-icon is-day" aria-hidden="true"></span>',
        '<strong class="ticker-v52-temperature">--°C</strong>'
      ].join("");
      return item;
    }

    if (entry.kind === "date") {
      item.classList.add("ticker-v52-date-item");
      const date = document.createElement("time");
      date.className = "ticker-v52-date";
      date.textContent = "---, -- --- ----";
      item.append(date);
      return item;
    }

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
  let lastWeatherFetch = 0;
  let weatherController = null;
  let syncLoop = () => {};

  const updateTimesAndDate = () => {
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

    track.querySelectorAll(".ticker-v52-date").forEach((dateNode) => {
      dateNode.textContent = dateFormatter.format(now);
      dateNode.dateTime = now.toISOString();
    });
  };

  const renderWeather = (weather) => {
    const temperature = Math.round(Number(weather.temperature));
    const code = Number(weather.code);
    const isDay = Number(weather.isDay) === 1;
    if (!Number.isFinite(temperature) || !Number.isFinite(code)) return;

    const kind = weatherKind(code);
    const label = weatherLabel(kind, isDay);

    track.querySelectorAll(".ticker-v52-weather").forEach((item) => {
      const icon = item.querySelector(".ticker-v52-weather-icon");
      const temperatureNode = item.querySelector(".ticker-v52-temperature");
      if (icon) {
        icon.className = `ticker-v52-weather-icon ${isDay ? "is-day" : "is-night"}`;
        icon.innerHTML = weatherSvg(kind, isDay);
      }
      if (temperatureNode) temperatureNode.textContent = `${temperature}°C`;
      item.setAttribute("aria-label", `Baghdad weather: ${label}, ${temperature} degrees Celsius`);
      item.title = `${label} · ${temperature}°C`;
    });
  };

  const readWeatherCache = () => {
    try {
      const cached = JSON.parse(window.localStorage.getItem(WEATHER_CACHE_KEY) || "null");
      if (!cached || Date.now() - Number(cached.savedAt) > WEATHER_CACHE_MAX_AGE_MS) return null;
      return cached;
    } catch {
      return null;
    }
  };

  const writeWeatherCache = (weather) => {
    try {
      window.localStorage.setItem(WEATHER_CACHE_KEY, JSON.stringify(weather));
    } catch {
      /* Weather still renders when storage is unavailable. */
    }
  };

  const updateWeather = async ({ force = false } = {}) => {
    if (document.hidden) return;
    const now = Date.now();
    if (!force && now - lastWeatherFetch < WEATHER_REFRESH_MS) return;
    lastWeatherFetch = now;

    weatherController?.abort();
    weatherController = new AbortController();
    const timeout = window.setTimeout(() => weatherController?.abort(), 7000);

    try {
      const response = await fetch(WEATHER_URL, {
        signal: weatherController.signal,
        cache: "no-store",
        headers: { Accept: "application/json" }
      });
      if (!response.ok) throw new Error(`Weather request failed: ${response.status}`);
      const payload = await response.json();
      const current = payload?.current;
      const weather = {
        temperature: Number(current?.temperature_2m),
        code: Number(current?.weather_code),
        isDay: Number(current?.is_day),
        savedAt: Date.now()
      };
      if (!Number.isFinite(weather.temperature) || !Number.isFinite(weather.code)) {
        throw new Error("Weather payload is incomplete");
      }
      renderWeather(weather);
      writeWeatherCache(weather);
      window.requestAnimationFrame(() => syncLoop({ force: true, restart: true }));
    } catch (error) {
      if (error?.name !== "AbortError") {
        const cached = readWeatherCache();
        if (cached) renderWeather(cached);
      }
    } finally {
      window.clearTimeout(timeout);
    }
  };

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entriesList) => {
      tickerVisible = entriesList.some((entry) => entry.isIntersecting);
      if (tickerVisible) {
        updateTimesAndDate();
        updateWeather();
      }
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

  syncLoop = ({ force = false, restart = false } = {}) => {
    const groupWidth = primaryGroup.getBoundingClientRect().width;
    if (!Number.isFinite(groupWidth) || groupWidth <= 0) return;

    const roundedWidth = Math.ceil(groupWidth);
    const widthChanged = Math.abs(roundedWidth - lastGroupWidth) > 1;

    if (force || widthChanged) {
      lastGroupWidth = roundedWidth;
      activeDuration = Math.max(64, Math.min(112, roundedWidth / 27));
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

  const cachedWeather = readWeatherCache();
  if (cachedWeather) renderWeather(cachedWeather);
  updateTimesAndDate();
  updateWeather({ force: true });
  window.requestAnimationFrame(() => syncLoop({ force: true }));

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => syncLoop({ force: true, restart: true })).catch(() => {});
  }

  window.setInterval(updateTimesAndDate, 1000);
  window.setInterval(() => updateWeather(), WEATHER_REFRESH_MS);

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
    updateTimesAndDate();
    updateWeather();
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
