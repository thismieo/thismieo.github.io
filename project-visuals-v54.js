(() => {
  "use strict";

  const VERSION = "102";
  const projectSection = document.querySelector("#projects");
  if (!projectSection) return;
  if (
    projectSection.dataset.projectVisualsV54Ready === "true" &&
    projectSection.dataset.projectVisualVersion === VERSION
  ) return;

  projectSection.dataset.projectVisualsV54Ready = "true";
  projectSection.dataset.projectVisualVersion = VERSION;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const readout = ({ kind, x, width, label, value, state, icon }) => {
    const center = width / 2;
    return `
      <g class="project-v54-readout project-v102-readout project-v102-readout-${kind}" transform="translate(${x} 4)">
        <rect class="project-v54-chip" width="${width}" height="58" rx="12" />
        <circle class="project-v102-readout-glow" cx="${center}" cy="11" r="13" />
        <g class="project-v102-readout-icon project-v102-readout-icon-${kind}" transform="translate(${center} 11)">
          ${icon}
        </g>
        <line class="project-v102-readout-divider" x1="${center - 22}" y1="24" x2="${center + 22}" y2="24" />
        <text class="project-v54-label project-v102-readout-label" x="${center}" y="32">${label}</text>
        <text class="project-v54-value project-v102-readout-value" x="${center}" y="45">${value}</text>
        <text class="project-v102-readout-state is-${kind}" x="${center}" y="55">${state}</text>
      </g>
    `;
  };

  const healthReadout = readout({
    kind: "health",
    x: 242,
    width: 112,
    label: "HEART RATE",
    value: "72 BPM",
    state: "NORMAL",
    icon: '<path d="M0 8S-10.2 2-8.4-3.8C-6.9-8.5-1.6-8.2 0-4.2 1.6-8.2 6.9-8.5 8.4-3.8 10.2 2 0 8 0 8Z" />'
  });

  const fraudReadout = readout({
    kind: "fraud",
    x: 250,
    width: 104,
    label: "RISK SCORE",
    value: "0.84",
    state: "ALERT",
    icon: '<path d="M0-9 8-5.8v6.2c0 5.8-3.4 9.8-8 12.4-4.6-2.6-8-6.6-8-12.4v-6.2L0-9Z" /><path class="project-v102-icon-mark" d="M0-4.5V2M0 6h.01" />'
  });

  const trafficReadout = readout({
    kind: "traffic",
    x: 250,
    width: 104,
    label: "FLOW INDEX",
    value: "78%",
    state: "CLEAR",
    icon: '<path d="M-10-5h9c4.1 0 6.8-1.7 10-5M-10 5h9c4.1 0 6.8 1.7 10 5M6-12l4 2-4 2M6 8l4 2-4 2" />'
  });

  const healthMarkup = `
    <svg class="project-v54-svg project-v54-health project-v102-health" viewBox="0 0 360 120" role="img" aria-label="Animated health signal monitor">
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
      <path class="project-v54-health-glow" d="M10 69H42L55 61L69 78L87 42L101 22L113 79L129 69H163L177 63L191 74L210 51L224 69H350" />
      <path class="project-v54-health-base" d="M10 69H42L55 61L69 78L87 42L101 22L113 79L129 69H163L177 63L191 74L210 51L224 69H350" />
      <path class="project-v54-health-line" d="M10 69H42L55 61L69 78L87 42L101 22L113 79L129 69H163L177 63L191 74L210 51L224 69H350" />
      <circle class="project-v54-health-ring" cx="101" cy="22" r="6" />
      <circle class="project-v54-health-dot" r="3.4">
        <animateMotion dur="4.8s" calcMode="linear" repeatCount="indefinite" path="M10 69H42L55 61L69 78L87 42L101 22L113 79L129 69H163L177 63L191 74L210 51L224 69H350" />
      </circle>
      ${healthReadout}
      <text class="project-v54-label" x="235" y="103">SIGNAL QUALITY</text>
      <text class="project-v54-value" x="307" y="103">98%</text>
    </svg>
    <div class="visual-badge project-v54-badge"><span>LIVE VITAL TRACE</span><b>HEALTH / 01</b></div>
  `;

  const fraudMarkup = `
    <svg class="project-v54-svg project-v54-fraud project-v102-fraud" viewBox="0 0 360 120" role="img" aria-label="Animated financial risk intelligence scanner">
      <defs>
        <linearGradient id="project-v102-fraud-core-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#93c5fd" stop-opacity=".38" />
          <stop offset=".52" stop-color="#8b5cf6" stop-opacity=".2" />
          <stop offset="1" stop-color="#f0a8bf" stop-opacity=".3" />
        </linearGradient>
        <linearGradient id="project-v102-fraud-scan-gradient" x1="0" y1="0" x2="1" y2="1">
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

      <g class="project-v102-fraud-orbits">
        <circle cx="164" cy="60" r="49" />
        <circle cx="164" cy="60" r="33" />
        <circle cx="164" cy="60" r="19" />
      </g>

      <g class="project-v102-fraud-links">
        <path id="project-v102-fraud-route-a" d="M34 84Q84 18 164 60T322 70" />
        <path id="project-v102-fraud-route-b" class="is-alert" d="M34 84Q104 109 164 60T236 25" />
        <path id="project-v102-fraud-route-c" d="M88 28Q126 42 164 60T322 70" />
      </g>

      <g class="project-v102-fraud-scan">
        <path d="M164 60V11A49 49 0 0 1 208 39Z" />
        <line x1="164" y1="60" x2="164" y2="11" />
      </g>

      <circle class="project-v102-fraud-core-halo" cx="164" cy="60" r="23" />
      <circle class="project-v102-fraud-core" cx="164" cy="60" r="17" />
      <path class="project-v102-fraud-shield" d="M164 46l11 4.4v8.2c0 7-4.4 11.8-11 15.3-6.6-3.5-11-8.3-11-15.3v-8.2l11-4.4Z" />
      <path class="project-v102-fraud-shield-mark" d="M164 52.5v8.2M164 65.2h.01" />

      <circle class="project-v102-fraud-node" cx="34" cy="84" r="4.8" />
      <circle class="project-v102-fraud-node" cx="88" cy="28" r="5.4" />
      <circle class="project-v102-fraud-node" cx="116" cy="96" r="4.6" />
      <circle class="project-v102-fraud-node is-alert" cx="236" cy="25" r="6.5" />
      <circle class="project-v102-fraud-node" cx="322" cy="70" r="5.4" />
      <circle class="project-v102-fraud-alert-halo" cx="236" cy="25" r="8" />

      <circle class="project-v102-fraud-packet" r="2.9">
        <animateMotion dur="6.4s" calcMode="linear" repeatCount="indefinite"><mpath href="#project-v102-fraud-route-a" /></animateMotion>
      </circle>
      <circle class="project-v102-fraud-packet is-alert" r="3.1">
        <animateMotion dur="5.2s" calcMode="linear" begin="-2.1s" repeatCount="indefinite"><mpath href="#project-v102-fraud-route-b" /></animateMotion>
      </circle>

      ${fraudReadout}
      <text class="project-v54-label" x="226" y="104">TRANSACTIONS</text>
      <text class="project-v54-value" x="307" y="104">2.4K</text>
    </svg>
    <div class="visual-badge project-v54-badge"><span>RISK INTELLIGENCE</span><b>SECURITY / 02</b></div>
  `;

  const vehicle = ({ tone, path, duration, begin = "0s", secondary = false }) => `
    <g class="project-v102-vehicle is-${tone}${secondary ? " is-secondary" : ""}">
      <rect class="project-v102-vehicle-body" x="-9" y="-4" width="18" height="8" rx="2.7" />
      <path class="project-v102-vehicle-roof" d="M-5-4 -2.4-7.1H3.7L6.3-4Z" />
      <path class="project-v102-vehicle-window" d="M-2.1-6.4H3.2L5.1-4.2H-4Z" />
      <circle class="project-v102-vehicle-wheel" cx="-5.2" cy="4.6" r="1.5" />
      <circle class="project-v102-vehicle-wheel" cx="5.2" cy="4.6" r="1.5" />
      <circle class="project-v102-vehicle-light" cx="8.2" cy="-.4" r=".8" />
      <animateMotion dur="${duration}" calcMode="linear" begin="${begin}" repeatCount="indefinite" rotate="auto">
        <mpath href="#${path}" />
      </animateMotion>
    </g>
  `;

  const trafficMarkup = `
    <svg class="project-v54-svg project-v54-traffic project-v102-traffic" viewBox="0 0 360 120" role="img" aria-label="Animated smart traffic flow forecast">
      <defs>
        <filter id="project-v54-traffic-glow-filter" x="-170%" y="-170%" width="440%" height="440%">
          <feGaussianBlur stdDeviation="2.1" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <g class="project-v54-grid">
        <path d="M0 24H360M0 48H360M0 72H360M0 96H360M45 0V120M90 0V120M135 0V120M180 0V120M225 0V120M270 0V120M315 0V120" />
      </g>
      <path d="M20 20L72 55L110 19L165 45L215 15L270 43L338 16" fill="none" stroke="rgba(167,139,250,.08)" />
      <path d="M10 102L70 72L126 102L184 76L247 108L346 80" fill="none" stroke="rgba(103,232,249,.065)" />

      <path class="project-v54-traffic-road-shadow" d="M-18 88C62 24 124 24 184 62S286 113 378 27" />
      <path class="project-v54-traffic-road-shadow" d="M-18 108C69 45 127 43 185 80S284 130 378 47" />
      <path class="project-v54-traffic-road is-cyan" d="M-18 88C62 24 124 24 184 62S286 113 378 27" />
      <path class="project-v54-traffic-road is-pink" d="M-18 108C69 45 127 43 185 80S284 130 378 47" />

      <path id="project-v102-traffic-route-a" class="project-v102-motion-path" d="M-64 88C48 17 122 21 184 62S294 118 424 18" />
      <path id="project-v102-traffic-route-b" class="project-v102-motion-path" d="M-64 108C53 37 125 40 185 80S294 136 424 38" />

      <circle class="project-v54-traffic-zone" cx="126" cy="38" r="9" />
      <circle class="project-v54-traffic-zone" cx="280" cy="82" r="8" style="animation-delay:-1.1s" />

      ${vehicle({ tone: "cyan", path: "project-v102-traffic-route-a", duration: "14.4s" })}
      ${vehicle({ tone: "cyan", path: "project-v102-traffic-route-a", duration: "14.4s", begin: "-7.2s", secondary: true })}
      ${vehicle({ tone: "pink", path: "project-v102-traffic-route-b", duration: "16.2s", begin: "-5.4s" })}

      ${trafficReadout}
      <g class="project-v102-flow-bars" transform="translate(230 91)">
        <rect class="project-v54-flow-bar" x="0" y="7" width="7" height="13" rx="2" />
        <rect class="project-v54-flow-bar" x="11" y="3" width="7" height="17" rx="2" />
        <rect class="project-v54-flow-bar" x="22" y="9" width="7" height="11" rx="2" />
        <rect class="project-v54-flow-bar" x="33" y="0" width="7" height="20" rx="2" />
      </g>
    </svg>
    <div class="visual-badge project-v54-badge"><span>CONTINUOUS FLOW</span><b>SMART CITY / 03</b></div>
  `;

  const scenes = [
    [".project-visual-health", healthMarkup],
    [".project-visual-fraud", fraudMarkup],
    [".project-visual-traffic", trafficMarkup]
  ];

  const visuals = scenes.map(([selector, markup]) => {
    const visual = projectSection.querySelector(selector);
    if (!visual) return null;
    visual.classList.add("project-visual-v54");
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
        /* CSS animation remains available if SVG SMIL controls are unavailable. */
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