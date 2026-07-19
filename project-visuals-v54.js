(() => {
  "use strict";

  document.documentElement.dataset.release = "2026.07.19.101";

  const projectSection = document.querySelector("#projects");
  if (!projectSection || projectSection.dataset.projectVisualsV54Ready === "true") return;

  projectSection.dataset.projectVisualsV54Ready = "true";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const healthMarkup = `
    <svg class="project-v54-svg project-v54-health" viewBox="0 0 360 120" role="img" aria-label="Animated health signal monitor">
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
        <animateMotion dur="4.1s" repeatCount="indefinite" path="M10 69H42L55 61L69 78L87 42L101 22L113 79L129 69H163L177 63L191 74L210 51L224 69H350" />
      </circle>
      <g class="project-v54-readout project-v54-readout-health" transform="translate(252 8)">
        <rect class="project-v54-chip" width="96" height="44" rx="10" />
        <circle class="project-v101-readout-glow" cx="48" cy="12" r="10" />
        <path class="project-v101-readout-icon project-v101-heart-icon" d="M48 6C44.7 2.9 39.9 5.5 41.2 9.5c1.5 3.9 6.8 7 6.8 7s5.3-3.1 6.8-7C56.1 5.5 51.3 2.9 48 6Z" />
        <text class="project-v54-label project-v101-readout-label" x="48" y="29">HEART RATE</text>
        <text class="project-v54-value project-v101-readout-value" x="48" y="40">72 BPM · NORMAL</text>
      </g>
      <text class="project-v54-label" x="235" y="103">SIGNAL QUALITY</text>
      <text class="project-v54-value" x="307" y="103">98%</text>
    </svg>
    <div class="visual-badge project-v54-badge"><span>LIVE VITAL TRACE</span><b>HEALTH / 01</b></div>
  `;

  const fraudMarkup = `
    <svg class="project-v54-svg project-v54-fraud project-v101-fraud" viewBox="0 0 360 120" role="img" aria-label="Animated financial risk intelligence scanner">
      <defs>
        <linearGradient id="project-v101-fraud-core-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#93c5fd" stop-opacity=".34" />
          <stop offset=".56" stop-color="#8b5cf6" stop-opacity=".18" />
          <stop offset="1" stop-color="#f0a8bf" stop-opacity=".24" />
        </linearGradient>
        <linearGradient id="project-v101-fraud-scan-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#93c5fd" stop-opacity=".24" />
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

      <g class="project-v101-fraud-orbits">
        <circle cx="170" cy="60" r="47" />
        <circle cx="170" cy="60" r="31" />
        <circle cx="170" cy="60" r="18" />
      </g>

      <g class="project-v101-fraud-links">
        <path id="project-v101-fraud-route-a" d="M39 83L94 29L170 60L232 27L318 70" />
        <path id="project-v101-fraud-route-b" class="is-alert" d="M39 83L116 94L170 60L232 27" />
        <path id="project-v101-fraud-route-c" d="M94 29L170 60L318 70" />
      </g>

      <g class="project-v101-fraud-scan">
        <path d="M170 60V13A47 47 0 0 1 213 41Z" />
        <line x1="170" y1="60" x2="170" y2="13" />
      </g>

      <circle class="project-v101-fraud-core-halo" cx="170" cy="60" r="19" />
      <circle class="project-v101-fraud-core" cx="170" cy="60" r="15" />
      <path class="project-v101-fraud-shield" d="M170 47l10 4v7.5c0 6.4-4.1 10.8-10 14-5.9-3.2-10-7.6-10-14V51l10-4Z" />
      <path class="project-v101-fraud-shield-mark" d="M170 53.5v7.4M170 65.1h.01" />

      <circle class="project-v101-fraud-node" cx="39" cy="83" r="4.6" />
      <circle class="project-v101-fraud-node" cx="94" cy="29" r="5.2" />
      <circle class="project-v101-fraud-node" cx="116" cy="94" r="4.4" />
      <circle class="project-v101-fraud-node is-alert" cx="232" cy="27" r="6.2" />
      <circle class="project-v101-fraud-node" cx="318" cy="70" r="5.2" />
      <circle class="project-v101-fraud-alert-halo" cx="232" cy="27" r="8" />

      <circle class="project-v101-fraud-packet" r="2.7">
        <animateMotion dur="5.8s" calcMode="linear" repeatCount="indefinite"><mpath href="#project-v101-fraud-route-a" /></animateMotion>
      </circle>
      <circle class="project-v101-fraud-packet is-alert" r="3">
        <animateMotion dur="4.7s" calcMode="linear" begin="-1.7s" repeatCount="indefinite"><mpath href="#project-v101-fraud-route-b" /></animateMotion>
      </circle>
      <circle class="project-v101-fraud-packet" r="2.5">
        <animateMotion dur="6.6s" calcMode="linear" begin="-3.2s" repeatCount="indefinite"><mpath href="#project-v101-fraud-route-c" /></animateMotion>
      </circle>

      <g class="project-v54-readout project-v54-readout-fraud" transform="translate(266 8)">
        <rect class="project-v54-chip" width="84" height="44" rx="10" />
        <circle class="project-v101-readout-glow" cx="42" cy="12" r="10" />
        <path class="project-v101-readout-icon project-v101-shield-icon" d="M42 4.4l7 3v5.2c0 4.8-2.9 8.1-7 10.5-4.1-2.4-7-5.7-7-10.5V7.4l7-3Z" />
        <path class="project-v101-readout-icon-mark" d="M42 8.4v5.3M42 17h.01" />
        <text class="project-v54-label project-v101-readout-label" x="42" y="29">RISK SCORE</text>
        <text class="project-v54-value project-v101-readout-value is-alert" x="42" y="40">0.84 · ALERT</text>
      </g>
      <text class="project-v54-label" x="230" y="104">TRANSACTIONS</text>
      <text class="project-v54-value" x="309" y="104">2.4K</text>
    </svg>
    <div class="visual-badge project-v54-badge"><span>RISK INTELLIGENCE</span><b>SECURITY / 02</b></div>
  `;

  const trafficMarkup = `
    <svg class="project-v54-svg project-v54-traffic project-v101-traffic" viewBox="0 0 360 120" role="img" aria-label="Animated smart traffic flow forecast">
      <defs>
        <filter id="project-v54-traffic-glow-filter" x="-160%" y="-160%" width="420%" height="420%">
          <feGaussianBlur stdDeviation="2.2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <g class="project-v54-grid">
        <path d="M0 24H360M0 48H360M0 72H360M0 96H360M45 0V120M90 0V120M135 0V120M180 0V120M225 0V120M270 0V120M315 0V120" />
      </g>
      <path d="M20 20L72 55L110 19L165 45L215 15L270 43L338 16" fill="none" stroke="rgba(167,139,250,.09)" />
      <path d="M10 102L70 72L126 102L184 76L247 108L346 80" fill="none" stroke="rgba(103,232,249,.07)" />
      <path class="project-v54-traffic-road-shadow" d="M-12 88C63 26 124 25 184 62S282 111 374 27" />
      <path class="project-v54-traffic-road-shadow" d="M-12 108C70 47 126 43 185 80S282 128 374 47" />
      <path class="project-v54-traffic-road is-cyan" d="M-12 88C63 26 124 25 184 62S282 111 374 27" />
      <path class="project-v54-traffic-road is-pink" d="M-12 108C70 47 126 43 185 80S282 128 374 47" />

      <path id="project-v101-traffic-loop-a" class="project-v101-motion-path" d="M-28 88C58 22 124 23 184 62S286 114 390 24L420 148H-70Z" />
      <path id="project-v101-traffic-loop-b" class="project-v101-motion-path" d="M-28 108C66 42 128 42 185 80S286 132 390 44L420 150H-70Z" />

      <circle class="project-v54-traffic-zone" cx="126" cy="38" r="9" />
      <circle class="project-v54-traffic-zone" cx="280" cy="82" r="8" style="animation-delay:-.65s" />

      <g class="project-v101-vehicle is-cyan">
        <rect class="project-v101-vehicle-body" x="-7" y="-3.5" width="14" height="7" rx="2.3" />
        <path class="project-v101-vehicle-roof" d="M -3.8 -3.5 L -1.7 -6 H 3.3 L 5.6 -3.5 Z" />
        <circle class="project-v101-vehicle-wheel" cx="-4.1" cy="4" r="1.35" />
        <circle class="project-v101-vehicle-wheel" cx="4.1" cy="4" r="1.35" />
        <animateMotion dur="11.2s" calcMode="linear" repeatCount="indefinite" rotate="auto"><mpath href="#project-v101-traffic-loop-a" /></animateMotion>
      </g>
      <g class="project-v101-vehicle is-cyan is-secondary">
        <rect class="project-v101-vehicle-body" x="-6" y="-3" width="12" height="6" rx="2" />
        <path class="project-v101-vehicle-roof" d="M -3.2 -3 L -1.3 -5.1 H 2.9 L 4.8 -3 Z" />
        <circle class="project-v101-vehicle-wheel" cx="-3.5" cy="3.4" r="1.15" />
        <circle class="project-v101-vehicle-wheel" cx="3.5" cy="3.4" r="1.15" />
        <animateMotion dur="11.2s" calcMode="linear" begin="-5.6s" repeatCount="indefinite" rotate="auto"><mpath href="#project-v101-traffic-loop-a" /></animateMotion>
      </g>
      <g class="project-v101-vehicle is-pink">
        <rect class="project-v101-vehicle-body" x="-7" y="-3.5" width="14" height="7" rx="2.3" />
        <path class="project-v101-vehicle-roof" d="M -3.8 -3.5 L -1.7 -6 H 3.3 L 5.6 -3.5 Z" />
        <circle class="project-v101-vehicle-wheel" cx="-4.1" cy="4" r="1.35" />
        <circle class="project-v101-vehicle-wheel" cx="4.1" cy="4" r="1.35" />
        <animateMotion dur="12.6s" calcMode="linear" begin="-2.1s" repeatCount="indefinite" rotate="auto"><mpath href="#project-v101-traffic-loop-b" /></animateMotion>
      </g>
      <g class="project-v101-vehicle is-pink is-secondary">
        <rect class="project-v101-vehicle-body" x="-6" y="-3" width="12" height="6" rx="2" />
        <path class="project-v101-vehicle-roof" d="M -3.2 -3 L -1.3 -5.1 H 2.9 L 4.8 -3 Z" />
        <circle class="project-v101-vehicle-wheel" cx="-3.5" cy="3.4" r="1.15" />
        <circle class="project-v101-vehicle-wheel" cx="3.5" cy="3.4" r="1.15" />
        <animateMotion dur="12.6s" calcMode="linear" begin="-8.4s" repeatCount="indefinite" rotate="auto"><mpath href="#project-v101-traffic-loop-b" /></animateMotion>
      </g>

      <g class="project-v54-readout project-v54-readout-traffic" transform="translate(268 8)">
        <rect class="project-v54-chip" width="82" height="44" rx="10" />
        <circle class="project-v101-readout-glow" cx="41" cy="12" r="10" />
        <path class="project-v101-readout-icon project-v101-flow-icon" d="M33 8h8c3.2 0 5.2-1.4 8-4M33 16h8c3.2 0 5.2 1.4 8 4M46 2l3 2-3 2M46 18l3 2-3 2" />
        <text class="project-v54-label project-v101-readout-label" x="41" y="29">FLOW INDEX</text>
        <text class="project-v54-value project-v101-readout-value is-clear" x="41" y="40">78% · CLEAR</text>
      </g>
      <g transform="translate(231 91)">
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

  const setSmilState = (running) => {
    svgNodes.forEach((svg) => {
      try {
        if (running && typeof svg.unpauseAnimations === "function") svg.unpauseAnimations();
        if (!running && typeof svg.pauseAnimations === "function") svg.pauseAnimations();
      } catch {
        /* CSS animations remain available when SVG SMIL controls are unsupported. */
      }
    });
  };

  const shouldRun = () => !reducedMotion.matches && !document.hidden && projectSection.classList.contains("v6-active");
  const syncMotion = () => setSmilState(shouldRun());

  window.requestAnimationFrame(syncMotion);

  if ("MutationObserver" in window) {
    const activityObserver = new MutationObserver(syncMotion);
    activityObserver.observe(projectSection, { attributes: true, attributeFilter: ["class"] });
  }

  document.addEventListener("visibilitychange", syncMotion);

  const handleMotionPreference = () => syncMotion();
  if (typeof reducedMotion.addEventListener === "function") {
    reducedMotion.addEventListener("change", handleMotionPreference);
  } else if (typeof reducedMotion.addListener === "function") {
    reducedMotion.addListener(handleMotionPreference);
  }
})();
