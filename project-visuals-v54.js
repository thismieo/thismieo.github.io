(() => {
  "use strict";

  document.documentElement.dataset.release = "2026.07.18.54";

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
      <g transform="translate(282 12)">
        <rect class="project-v54-chip" width="65" height="31" rx="8" />
        <path class="project-v54-heart-icon" d="M13 10C8 5 2 9 4 15c2 5 9 9 9 9s7-4 9-9c2-6-4-10-9-5Z" transform="translate(4 -1) scale(.62)" />
        <text class="project-v54-label" x="28" y="12">HEART RATE</text>
        <text class="project-v54-value" x="28" y="23">72 BPM</text>
      </g>
      <text class="project-v54-label" x="235" y="103">SIGNAL QUALITY</text>
      <text class="project-v54-value" x="307" y="103">98%</text>
    </svg>
    <div class="visual-badge project-v54-badge"><span>LIVE VITAL TRACE</span><b>HEALTH / 01</b></div>
  `;

  const fraudMarkup = `
    <svg class="project-v54-svg project-v54-fraud" viewBox="0 0 360 120" role="img" aria-label="Animated financial anomaly network">
      <defs>
        <linearGradient id="project-v54-radar-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="rgba(147,197,253,0.26)" />
          <stop offset="1" stop-color="rgba(147,197,253,0)" />
        </linearGradient>
        <filter id="project-v54-fraud-glow-filter" x="-140%" y="-140%" width="380%" height="380%">
          <feGaussianBlur stdDeviation="2.7" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <g class="project-v54-grid">
        <path d="M0 24H360M0 48H360M0 72H360M0 96H360M45 0V120M90 0V120M135 0V120M180 0V120M225 0V120M270 0V120M315 0V120" />
      </g>
      <circle class="project-v54-radar-ring" cx="176" cy="60" r="50" />
      <circle class="project-v54-radar-ring" cx="176" cy="60" r="33" />
      <circle class="project-v54-radar-ring" cx="176" cy="60" r="17" />
      <path class="project-v54-radar-sweep" d="M176 60V10A50 50 0 0 1 226 60Z" />
      <g>
        <path id="project-v54-fraud-route-a" class="project-v54-fraud-link" d="M30 91L88 31L176 60L242 25L330 68" />
        <path id="project-v54-fraud-route-b" class="project-v54-fraud-link is-alert" d="M30 91L176 60L330 68" />
        <path id="project-v54-fraud-route-c" class="project-v54-fraud-link" d="M88 31L242 25" />
        <path id="project-v54-fraud-route-d" class="project-v54-fraud-link" d="M88 31L129 94L176 60" />
      </g>
      <circle class="project-v54-fraud-halo" cx="176" cy="60" r="8" />
      <circle class="project-v54-fraud-node" cx="30" cy="91" r="5.4" />
      <circle class="project-v54-fraud-node" cx="88" cy="31" r="5.7" />
      <circle class="project-v54-fraud-node" cx="129" cy="94" r="5" />
      <circle class="project-v54-fraud-node is-alert" cx="176" cy="60" r="8" />
      <circle class="project-v54-fraud-node" cx="242" cy="25" r="5.8" />
      <circle class="project-v54-fraud-node" cx="330" cy="68" r="6" />
      <circle class="project-v54-packet" r="2.8">
        <animateMotion dur="3.8s" repeatCount="indefinite"><mpath href="#project-v54-fraud-route-a" /></animateMotion>
      </circle>
      <circle class="project-v54-packet is-alert" r="3">
        <animateMotion dur="2.9s" begin="-1.1s" repeatCount="indefinite"><mpath href="#project-v54-fraud-route-b" /></animateMotion>
      </circle>
      <circle class="project-v54-packet" r="2.5">
        <animateMotion dur="4.6s" begin="-2.2s" repeatCount="indefinite"><mpath href="#project-v54-fraud-route-c" /></animateMotion>
      </circle>
      <g transform="translate(274 12)">
        <rect class="project-v54-chip" width="73" height="31" rx="8" />
        <text class="project-v54-label" x="10" y="12">RISK SCORE</text>
        <text class="project-v54-value" x="10" y="24">0.84 ALERT</text>
      </g>
      <text class="project-v54-label" x="232" y="104">TRANSACTIONS</text>
      <text class="project-v54-value" x="310" y="104">2.4K</text>
    </svg>
    <div class="visual-badge project-v54-badge"><span>ANOMALY RADAR</span><b>SECURITY / 02</b></div>
  `;

  const trafficMarkup = `
    <svg class="project-v54-svg project-v54-traffic" viewBox="0 0 360 120" role="img" aria-label="Animated smart traffic flow forecast">
      <defs>
        <filter id="project-v54-traffic-glow-filter" x="-140%" y="-140%" width="380%" height="380%">
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
      <path id="project-v54-traffic-route-a" class="project-v54-traffic-road is-cyan" d="M-12 88C63 26 124 25 184 62S282 111 374 27" />
      <path id="project-v54-traffic-route-b" class="project-v54-traffic-road is-pink" d="M-12 108C70 47 126 43 185 80S282 128 374 47" />
      <circle class="project-v54-traffic-zone" cx="126" cy="38" r="9" />
      <circle class="project-v54-traffic-zone" cx="280" cy="82" r="8" style="animation-delay:-.65s" />
      <circle class="project-v54-car" r="3.2">
        <animateMotion dur="4.3s" repeatCount="indefinite"><mpath href="#project-v54-traffic-route-a" /></animateMotion>
      </circle>
      <circle class="project-v54-car" r="2.8">
        <animateMotion dur="5.1s" begin="-2.4s" repeatCount="indefinite"><mpath href="#project-v54-traffic-route-a" /></animateMotion>
      </circle>
      <circle class="project-v54-car is-pink" r="3.1">
        <animateMotion dur="4.8s" begin="-1.2s" repeatCount="indefinite"><mpath href="#project-v54-traffic-route-b" /></animateMotion>
      </circle>
      <g transform="translate(280 12)">
        <rect class="project-v54-chip" width="67" height="31" rx="8" />
        <text class="project-v54-label" x="10" y="12">FLOW INDEX</text>
        <text class="project-v54-value" x="10" y="24">78% CLEAR</text>
      </g>
      <g transform="translate(231 91)">
        <rect class="project-v54-flow-bar" x="0" y="7" width="7" height="13" rx="2" />
        <rect class="project-v54-flow-bar" x="11" y="3" width="7" height="17" rx="2" />
        <rect class="project-v54-flow-bar" x="22" y="9" width="7" height="11" rx="2" />
        <rect class="project-v54-flow-bar" x="33" y="0" width="7" height="20" rx="2" />
      </g>
    </svg>
    <div class="visual-badge project-v54-badge"><span>LIVE FLOW MODEL</span><b>SMART CITY / 03</b></div>
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
