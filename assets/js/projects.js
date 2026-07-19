(() => {
  "use strict";

  const projectSection = document.querySelector("#projects");
  if (!projectSection) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const scenes = [...projectSection.querySelectorAll("[data-project-scene]")];

  const grid = `
    <g class="scene-grid" aria-hidden="true">
      <path d="M0 24H360M0 48H360M0 72H360M0 96H360M45 0V120M90 0V120M135 0V120M180 0V120M225 0V120M270 0V120M315 0V120" />
    </g>
  `;

  const healthScene = `
    <svg class="scene-health" viewBox="0 0 360 120" role="img" aria-label="Animated heart signal monitor">
      <defs>
        <linearGradient id="health-line-gradient" x1="0" x2="1">
          <stop offset="0" stop-color="#78e6b1" />
          <stop offset="0.55" stop-color="#4debd1" />
          <stop offset="1" stop-color="#9b7ff0" />
        </linearGradient>
        <linearGradient id="health-scan-gradient" x1="0" x2="1">
          <stop offset="0" stop-color="#4debd1" stop-opacity="0" />
          <stop offset="0.55" stop-color="#4debd1" stop-opacity=".16" />
          <stop offset="1" stop-color="#9b7ff0" stop-opacity="0" />
        </linearGradient>
        <filter id="health-glow-filter" x="-150%" y="-150%" width="400%" height="400%">
          <feGaussianBlur stdDeviation="2.2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      ${grid}
      <rect class="health-scan" x="-40" y="0" width="38" height="120" />
      <path class="health-base" d="M8 70H42L56 62L69 79L86 43L100 22L113 80L129 70H163L177 64L191 75L210 52L224 70H352" />
      <path class="health-glow" d="M8 70H42L56 62L69 79L86 43L100 22L113 80L129 70H163L177 64L191 75L210 52L224 70H352" />
      <path class="health-line" d="M8 70H42L56 62L69 79L86 43L100 22L113 80L129 70H163L177 64L191 75L210 52L224 70H352" />
      <circle class="health-ring" cx="100" cy="22" r="4" />
      <circle class="health-dot" r="3.4">
        <animateMotion dur="5.2s" calcMode="linear" repeatCount="indefinite" path="M8 70H42L56 62L69 79L86 43L100 22L113 80L129 70H163L177 64L191 75L210 52L224 70H352" />
      </circle>
    </svg>
  `;

  const fraudScene = `
    <svg class="scene-fraud" viewBox="0 0 360 120" role="img" aria-label="Animated financial risk intelligence scanner">
      <defs>
        <linearGradient id="fraud-core-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#93c5fd" stop-opacity=".38" />
          <stop offset=".52" stop-color="#9b7ff0" stop-opacity=".2" />
          <stop offset="1" stop-color="#f6739a" stop-opacity=".3" />
        </linearGradient>
        <linearGradient id="fraud-scan-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#4debd1" stop-opacity=".24" />
          <stop offset=".62" stop-color="#9b7ff0" stop-opacity=".07" />
          <stop offset="1" stop-color="#f6739a" stop-opacity="0" />
        </linearGradient>
        <filter id="fraud-glow-filter" x="-180%" y="-180%" width="460%" height="460%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      ${grid}
      <g class="fraud-orbits">
        <circle cx="180" cy="59" r="50" />
        <circle cx="180" cy="59" r="34" />
        <circle cx="180" cy="59" r="20" />
      </g>
      <g class="fraud-links">
        <path id="fraud-route-a" d="M28 83Q86 18 180 59T334 69" />
        <path id="fraud-route-b" class="is-alert" d="M28 83Q102 109 180 59T250 24" />
        <path id="fraud-route-c" d="M92 27Q135 40 180 59T334 69" />
      </g>
      <g class="fraud-scan">
        <path d="M180 59V9A50 50 0 0 1 225 38Z" />
        <line x1="180" y1="59" x2="180" y2="9" />
      </g>
      <circle class="fraud-core-halo" cx="180" cy="59" r="24" />
      <circle class="fraud-core" cx="180" cy="59" r="18" />
      <path class="fraud-shield" d="M180 44l11.5 4.7v8.6c0 7.3-4.6 12.3-11.5 16-6.9-3.7-11.5-8.7-11.5-16v-8.6L180 44Z" />
      <path class="fraud-shield-mark" d="M180 51v8.5M180 64.5h.01" />
      <circle class="fraud-node" cx="28" cy="83" r="4.8" />
      <circle class="fraud-node" cx="92" cy="27" r="5.4" />
      <circle class="fraud-node" cx="124" cy="96" r="4.6" />
      <circle class="fraud-node is-alert" cx="250" cy="24" r="6.5" />
      <circle class="fraud-node" cx="334" cy="69" r="5.4" />
      <circle class="fraud-alert-halo" cx="250" cy="24" r="8" />
      <circle class="fraud-packet" r="2.8">
        <animateMotion dur="6.8s" calcMode="linear" repeatCount="indefinite"><mpath href="#fraud-route-a" /></animateMotion>
      </circle>
      <circle class="fraud-packet is-alert" r="3">
        <animateMotion dur="5.7s" calcMode="linear" begin="-2.1s" repeatCount="indefinite"><mpath href="#fraud-route-b" /></animateMotion>
      </circle>
      <circle class="fraud-packet" r="2.5">
        <animateMotion dur="7.5s" calcMode="linear" begin="-3.6s" repeatCount="indefinite"><mpath href="#fraud-route-c" /></animateMotion>
      </circle>
    </svg>
  `;

  const vehicle = ({ tone, path, duration, begin }) => `
    <g class="vehicle is-${tone}" opacity="0">
      <rect class="vehicle-body" x="-9" y="-4" width="18" height="8" rx="2.7" />
      <path class="vehicle-roof" d="M-5-4 -2.4-7.1H3.7L6.3-4Z" />
      <path class="vehicle-window" d="M-2.1-6.4H3.2L5.1-4.2H-4Z" />
      <circle class="vehicle-wheel" cx="-5.2" cy="4.6" r="1.5" />
      <circle class="vehicle-wheel" cx="5.2" cy="4.6" r="1.5" />
      <circle class="vehicle-light" cx="8.2" cy="-.4" r=".8" />
      <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.08;.92;1" dur="${duration}" begin="${begin}" repeatCount="indefinite" />
      <animateMotion dur="${duration}" begin="${begin}" calcMode="linear" repeatCount="indefinite" rotate="auto">
        <mpath href="#${path}" />
      </animateMotion>
    </g>
  `;

  const routeA = "M-66 90C42 19 118 20 182 58S292 112 430 18";
  const routeB = "M-66 110C54 39 124 40 184 78S292 132 430 38";

  const trafficScene = `
    <svg class="scene-traffic" viewBox="0 0 360 120" role="img" aria-label="Animated smart traffic flow forecast">
      <defs>
        <clipPath id="traffic-clip">
          <rect x="0" y="0" width="360" height="120" rx="0" />
        </clipPath>
        <filter id="traffic-glow-filter" x="-170%" y="-170%" width="440%" height="440%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      ${grid}
      <g clip-path="url(#traffic-clip)">
        <path class="city-line" d="M18 20L70 53L109 18L164 43L216 14L270 41L340 15" />
        <path class="road-shadow" d="${routeA}" />
        <path class="road-shadow" d="${routeB}" />
        <path class="road is-cyan" d="${routeA}" />
        <path class="road is-pink" d="${routeB}" />
        <path id="traffic-route-a" d="${routeA}" fill="none" stroke="none" />
        <path id="traffic-route-b" d="${routeB}" fill="none" stroke="none" />
        <circle class="traffic-zone" cx="124" cy="37" r="7" />
        <circle class="traffic-zone" cx="280" cy="80" r="7" style="animation-delay:-1.2s" />
        ${vehicle({ tone: "cyan", path: "traffic-route-a", duration: "15.8s", begin: "0s" })}
        ${vehicle({ tone: "cyan", path: "traffic-route-a", duration: "15.8s", begin: "-7.9s" })}
        ${vehicle({ tone: "pink", path: "traffic-route-b", duration: "17.6s", begin: "-5.8s" })}
      </g>
    </svg>
  `;

  const markup = {
    health: healthScene,
    fraud: fraudScene,
    traffic: trafficScene
  };

  scenes.forEach((scene) => {
    const key = scene.dataset.projectScene;
    scene.innerHTML = markup[key] || "";
  });

  const svgNodes = scenes.map((scene) => scene.querySelector("svg")).filter(Boolean);
  let sectionVisible = true;

  const setSmilState = (running) => {
    svgNodes.forEach((svg) => {
      try {
        if (running && typeof svg.unpauseAnimations === "function") svg.unpauseAnimations();
        if (!running && typeof svg.pauseAnimations === "function") svg.pauseAnimations();
      } catch {
        // CSS animation remains available when SMIL controls are unavailable.
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
      rootMargin: "180px 0px",
      threshold: 0.02
    });

    observer.observe(projectSection);
  }

  document.addEventListener("visibilitychange", syncMotion);
  if (typeof reducedMotion.addEventListener === "function") {
    reducedMotion.addEventListener("change", syncMotion);
  } else if (typeof reducedMotion.addListener === "function") {
    reducedMotion.addListener(syncMotion);
  }

  window.requestAnimationFrame(syncMotion);
})();
