(() => {
  "use strict";

  const VERSION = "104";
  const projectSection = document.querySelector("#projects");
  if (!projectSection) return;
  if (
    projectSection.dataset.projectVisualsV54Ready === "true" &&
    projectSection.dataset.projectVisualVersion === VERSION
  ) return;

  projectSection.dataset.projectVisualsV54Ready = "true";
  projectSection.dataset.projectVisualVersion = VERSION;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const telemetry = ({ kind, label, value, state, icon }) => `
    <div class="project-v104-telemetry project-v104-telemetry-${kind}">
      <div class="project-v104-telemetry-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24">${icon}</svg>
      </div>
      <div class="project-v104-telemetry-copy">
        <div class="project-v104-telemetry-label">${label}</div>
        <div class="project-v104-telemetry-reading">
          <div class="project-v104-telemetry-value">${value}</div>
          <div class="project-v104-telemetry-state">${state}</div>
        </div>
      </div>
    </div>
  `;

  const footer = ({ label, category, telemetryMarkup }) => `
    <div class="project-v104-footer">
      <div class="project-v104-meta">
        <div class="project-v104-meta-label">${label}</div>
        <div class="project-v104-meta-code">${category}</div>
      </div>
      ${telemetryMarkup}
    </div>
  `;

  const healthTelemetry = telemetry({
    kind: "health",
    label: "HEART RATE",
    value: "72 BPM",
    state: "NORMAL",
    icon: '<path d="M12 20.2S3.5 15.1 3.5 8.9C3.5 5.6 7.7 4.1 12 8c4.3-3.9 8.5-2.4 8.5.9 0 6.2-8.5 11.3-8.5 11.3Z"/><path d="M5.7 12h3l1.5-3.1 2.2 6.2 1.7-3.1h4.2"/>'
  });

  const fraudTelemetry = telemetry({
    kind: "fraud",
    label: "RISK SCORE",
    value: "0.84",
    state: "ALERT",
    icon: '<path d="M12 2.8 20 6v5.4c0 5-3.1 8.4-8 10.8-4.9-2.4-8-5.8-8-10.8V6l8-3.2Z"/><path d="M12 7.4v5.7M12 16.6h.01"/>'
  });

  const trafficTelemetry = telemetry({
    kind: "traffic",
    label: "FLOW INDEX",
    value: "78%",
    state: "CLEAR",
    icon: '<path d="M3 7h8c3.5 0 5.7-1.4 8.5-4M3 17h8c3.5 0 5.7 1.4 8.5 4M16.5 1l3 2-3 2M16.5 19l3 2-3 2"/>'
  });

  const healthMarkup = `
    <div class="project-v104-stage">
      <svg class="project-v54-svg project-v54-health project-v103-health" viewBox="0 0 360 120" role="img" aria-label="Animated health signal monitor">
        <defs>
          <linearGradient id="project-v54-health-gradient" x1="0" x2="1">
            <stop offset="0" stop-color="#34d399" />
            <stop offset="0.48" stop-color="#6ee7b7" />
            <stop offset="1" stop-color="#67e8f9" />
          </linearGradient>
          <linearGradient id="project-v54-health-scan-gradient" x1="0" x2="1">
            <stop offset="0" stop-color="rgba(110,231,183,0)" />
            <stop offset="0.55" stop-color="rgba(110,231,183,0.18)" />
            <stop offset="1" stop-color="rgba(103,232,249,0)" />
          </linearGradient>
          <filter id="project-v54-health-glow-filter" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <g class="project-v54-grid">
          <path d="M0 24H360M0 48H360M0 72H360M0 96H360M45 0V120M90 0V120M135 0V120M180 0V120M225 0V120M270 0V120M315 0V120" />
        </g>
        <rect class="project-v54-health-scan" x="0" y="0" width="34" height="120" />
        <path class="project-v54-health-glow" d="M8 69H40L53 61L67 78L85 42L99 22L111 79L127 69H161L175 63L189 74L208 51L222 69H352" />
        <path class="project-v54-health-base" d="M8 69H40L53 61L67 78L85 42L99 22L111 79L127 69H161L175 63L189 74L208 51L222 69H352" />
        <path class="project-v54-health-line" d="M8 69H40L53 61L67 78L85 42L99 22L111 79L127 69H161L175 63L189 74L208 51L222 69H352" />
        <circle class="project-v54-health-ring" cx="99" cy="22" r="6" />
        <circle class="project-v54-health-dot" r="3.4">
          <animateMotion dur="4.8s" calcMode="linear" repeatCount="indefinite" path="M8 69H40L53 61L67 78L85 42L99 22L111 79L127 69H161L175 63L189 74L208 51L222 69H352" />
        </circle>
      </svg>
    </div>
    ${footer({ label: "LIVE VITAL TRACE", category: "HEALTH / 01", telemetryMarkup: healthTelemetry })}
  `;

  const fraudMarkup = `
    <div class="project-v104-stage">
      <svg class="project-v54-svg project-v54-fraud project-v103-fraud" viewBox="0 0 360 120" role="img" aria-label="Animated financial risk intelligence scanner">
        <defs>
          <linearGradient id="project-v103-fraud-core-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#93c5fd" stop-opacity=".38" />
            <stop offset=".52" stop-color="#8b5cf6" stop-opacity=".2" />
            <stop offset="1" stop-color="#f0a8bf" stop-opacity=".3" />
          </linearGradient>
          <linearGradient id="project-v103-fraud-scan-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#93c5fd" stop-opacity=".26" />
            <stop offset=".62" stop-color="#a78bfa" stop-opacity=".08" />
            <stop offset="1" stop-color="#f0a8bf" stop-opacity="0" />
          </linearGradient>
          <filter id="project-v54-fraud-glow-filter" x="-180%" y="-180%" width="460%" height="460%">
            <feGaussianBlur stdDeviation="2.7" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <g class="project-v54-grid">
          <path d="M0 24H360M0 48H360M0 72H360M0 96H360M45 0V120M90 0V120M135 0V120M180 0V120M225 0V120M270 0V120M315 0V120" />
        </g>
        <g class="project-v103-fraud-orbits">
          <circle cx="180" cy="59" r="50" />
          <circle cx="180" cy="59" r="34" />
          <circle cx="180" cy="59" r="20" />
        </g>
        <g class="project-v103-fraud-links">
          <path id="project-v103-fraud-route-a" d="M28 83Q86 18 180 59T334 69" />
          <path id="project-v103-fraud-route-b" class="is-alert" d="M28 83Q102 109 180 59T250 24" />
          <path id="project-v103-fraud-route-c" d="M92 27Q135 40 180 59T334 69" />
        </g>
        <g class="project-v103-fraud-scan">
          <path d="M180 59V9A50 50 0 0 1 225 38Z" />
          <line x1="180" y1="59" x2="180" y2="9" />
        </g>
        <circle class="project-v103-fraud-core-halo" cx="180" cy="59" r="24" />
        <circle class="project-v103-fraud-core" cx="180" cy="59" r="18" />
        <path class="project-v103-fraud-shield" d="M180 44l11.5 4.7v8.6c0 7.3-4.6 12.3-11.5 16-6.9-3.7-11.5-8.7-11.5-16v-8.6L180 44Z" />
        <path class="project-v103-fraud-shield-mark" d="M180 51v8.5M180 64.5h.01" />
        <circle class="project-v103-fraud-node" cx="28" cy="83" r="4.8" />
        <circle class="project-v103-fraud-node" cx="92" cy="27" r="5.4" />
        <circle class="project-v103-fraud-node" cx="124" cy="96" r="4.6" />
        <circle class="project-v103-fraud-node is-alert" cx="250" cy="24" r="6.5" />
        <circle class="project-v103-fraud-node" cx="334" cy="69" r="5.4" />
        <circle class="project-v103-fraud-alert-halo" cx="250" cy="24" r="8" />
        <circle class="project-v103-fraud-packet" r="2.9">
          <animateMotion dur="6.8s" calcMode="linear" repeatCount="indefinite"><mpath href="#project-v103-fraud-route-a" /></animateMotion>
        </circle>
        <circle class="project-v103-fraud-packet is-alert" r="3.1">
          <animateMotion dur="5.6s" calcMode="linear" begin="-2.1s" repeatCount="indefinite"><mpath href="#project-v103-fraud-route-b" /></animateMotion>
        </circle>
        <circle class="project-v103-fraud-packet" r="2.5">
          <animateMotion dur="7.4s" calcMode="linear" begin="-3.6s" repeatCount="indefinite"><mpath href="#project-v103-fraud-route-c" /></animateMotion>
        </circle>
      </svg>
    </div>
    ${footer({ label: "RISK INTELLIGENCE", category: "SECURITY / 02", telemetryMarkup: fraudTelemetry })}
  `;

  const vehicle = ({ tone, path, duration, begin = "0s", secondary = false }) => `
    <g class="project-v103-vehicle is-${tone}${secondary ? " is-secondary" : ""}">
      <rect class="project-v103-vehicle-body" x="-9" y="-4" width="18" height="8" rx="2.7" />
      <path class="project-v103-vehicle-roof" d="M-5-4 -2.4-7.1H3.7L6.3-4Z" />
      <path class="project-v103-vehicle-window" d="M-2.1-6.4H3.2L5.1-4.2H-4Z" />
      <circle class="project-v103-vehicle-wheel" cx="-5.2" cy="4.6" r="1.5" />
      <circle class="project-v103-vehicle-wheel" cx="5.2" cy="4.6" r="1.5" />
      <circle class="project-v103-vehicle-light" cx="8.2" cy="-.4" r=".8" />
      <animateMotion dur="${duration}" calcMode="linear" begin="${begin}" repeatCount="indefinite" rotate="auto">
        <mpath href="#${path}" />
      </animateMotion>
    </g>
  `;

  const trafficRouteA = "M-54 85C48 18 121 20 184 59S292 112 414 22";
  const trafficRouteB = "M-54 105C57 38 125 39 185 78S292 131 414 42";

  const trafficMarkup = `
    <div class="project-v104-stage">
      <svg class="project-v54-svg project-v54-traffic project-v103-traffic" viewBox="0 0 360 120" role="img" aria-label="Animated smart traffic flow forecast">
        <defs>
          <filter id="project-v54-traffic-glow-filter" x="-170%" y="-170%" width="440%" height="440%">
            <feGaussianBlur stdDeviation="2.1" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <g class="project-v54-grid">
          <path d="M0 24H360M0 48H360M0 72H360M0 96H360M45 0V120M90 0V120M135 0V120M180 0V120M225 0V120M270 0V120M315 0V120" />
        </g>
        <path class="project-v103-city-line" d="M18 20L70 53L109 18L164 43L216 14L270 41L340 15" />
        <path class="project-v54-traffic-road-shadow" d="${trafficRouteA}" />
        <path class="project-v54-traffic-road-shadow" d="${trafficRouteB}" />
        <path class="project-v54-traffic-road is-cyan" d="${trafficRouteA}" />
        <path class="project-v54-traffic-road is-pink" d="${trafficRouteB}" />
        <path id="project-v103-traffic-route-a" class="project-v103-motion-path" d="${trafficRouteA}" />
        <path id="project-v103-traffic-route-b" class="project-v103-motion-path" d="${trafficRouteB}" />
        <circle class="project-v54-traffic-zone" cx="124" cy="37" r="9" />
        <circle class="project-v54-traffic-zone" cx="280" cy="80" r="8" style="animation-delay:-1.2s" />
        ${vehicle({ tone: "cyan", path: "project-v103-traffic-route-a", duration: "15.8s" })}
        ${vehicle({ tone: "cyan", path: "project-v103-traffic-route-a", duration: "15.8s", begin: "-7.9s", secondary: true })}
        ${vehicle({ tone: "pink", path: "project-v103-traffic-route-b", duration: "17.6s", begin: "-5.8s" })}
      </svg>
    </div>
    ${footer({ label: "CONTINUOUS FLOW", category: "SMART CITY / 03", telemetryMarkup: trafficTelemetry })}
  `;

  const scenes = [
    [".project-visual-health", healthMarkup],
    [".project-visual-fraud", fraudMarkup],
    [".project-visual-traffic", trafficMarkup]
  ];

  const visuals = scenes.map(([selector, markup]) => {
    const visual = projectSection.querySelector(selector);
    if (!visual) return null;
    visual.classList.remove("project-v103-visual");
    visual.classList.add("project-visual-v54", "project-v104-visual");
    visual.innerHTML = markup;
    return visual;
  }).filter(Boolean);

  if (!visuals.length) return;

  const svgNodes = visuals.map((visual) => visual.querySelector("svg")).filter(Boolean);
  let sectionVisible = true;

  const setSmilState = (running) => {
    svgNodes.forEach((svg) => {
      try {
        if (running && typeof svg.unpauseAnimations === "function") svg.unpauseAnimations();
        if (!running && typeof svg.pauseAnimations === "function") svg.pauseAnimations();
      } catch {
        /* CSS motion remains available when SVG SMIL controls are unavailable. */
      }
    });
  };

  const syncMotion = () => {
    setSmilState(sectionVisible && !document.hidden && !reducedMotion.matches);
  };

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      sectionVisible = Boolean(entries[0]?.isIntersecting);
      syncMotion();
    }, {
      root: null,
      rootMargin: "180px 0px",
      threshold: 0.02
    });
    observer.observe(projectSection);
  }

  document.addEventListener("visibilitychange", syncMotion);
  window.addEventListener("pageshow", syncMotion);

  const handleMotionPreference = () => syncMotion();
  if (typeof reducedMotion.addEventListener === "function") {
    reducedMotion.addEventListener("change", handleMotionPreference);
  } else if (typeof reducedMotion.addListener === "function") {
    reducedMotion.addListener(handleMotionPreference);
  }

  window.requestAnimationFrame(syncMotion);
})();
