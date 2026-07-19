(() => {
  "use strict";

  const planetary = document.querySelector("#home .hero-v33-planetary");
  if (!planetary) return;

  const orbitSvg = planetary.querySelector(".hero-v33-orbit-svg");
  const orbitLines = Array.from(planetary.querySelectorAll(".hero-v33-orbit-svg .orbit-line")).slice(0, 2);
  const existingSatellites = Array.from(planetary.querySelectorAll(".hero-v33-rotator")).slice(0, 2);
  if (!orbitSvg || orbitLines.length !== 2 || existingSatellites.length !== 2) return;

  let thirdSatellite = planetary.querySelector(".rotator-v33-three");
  if (!thirdSatellite) {
    thirdSatellite = document.createElement("div");
    thirdSatellite.className = "hero-v33-rotator rotator-v33-three";
    thirdSatellite.setAttribute("aria-hidden", "true");
    thirdSatellite.innerHTML = "<i></i>";
    planetary.appendChild(thirdSatellite);
  }

  const satellites = [...existingSatellites, thirdSatellite];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const coarsePointer = window.matchMedia("(pointer: coarse)");
  const configurations = [
    { lineIndex: 0, duration: 18000, phase: 0.08, direction: 1, className: "orbit-glow-blue" },
    { lineIndex: 1, duration: 24000, phase: 0.43, direction: -1, className: "orbit-glow-pink" },
    { lineIndex: 0, duration: 21000, phase: 0.62, direction: 1, className: "orbit-glow-violet" }
  ];

  satellites.forEach((satellite, index) => {
    satellite.classList.add("is-path-driven", configurations[index].className);
    satellite.dataset.orbitIndex = String(index + 1);
  });

  let animationFrame = 0;
  let visible = false;
  let lastRenderedAt = 0;

  const pointToPlanetaryCoordinates = (line, progress) => {
    const length = line.getTotalLength();
    const point = line.getPointAtLength(length * progress);
    const matrix = line.getScreenCTM();
    if (!matrix) return null;

    const svgPoint = orbitSvg.createSVGPoint();
    svgPoint.x = point.x;
    svgPoint.y = point.y;
    const screenPoint = svgPoint.matrixTransform(matrix);
    const planetaryRect = planetary.getBoundingClientRect();

    return {
      x: screenPoint.x - planetaryRect.left,
      y: screenPoint.y - planetaryRect.top
    };
  };

  const placeSatellites = (timestamp = performance.now(), staticPlacement = false) => {
    configurations.forEach((configuration, index) => {
      const line = orbitLines[configuration.lineIndex];
      let progress = staticPlacement
        ? configuration.phase
        : ((timestamp / configuration.duration) + configuration.phase) % 1;

      if (configuration.direction < 0) progress = 1 - progress;
      const coordinates = pointToPlanetaryCoordinates(line, progress);
      if (!coordinates) return;

      satellites[index].style.setProperty("--orbit-x", `${coordinates.x.toFixed(2)}px`);
      satellites[index].style.setProperty("--orbit-y", `${coordinates.y.toFixed(2)}px`);
    });
  };

  const render = (timestamp) => {
    animationFrame = 0;
    if (!visible || document.hidden || reducedMotion.matches) return;

    const frameInterval = coarsePointer.matches ? 1000 / 30 : 1000 / 60;
    if (timestamp - lastRenderedAt >= frameInterval) {
      placeSatellites(timestamp);
      lastRenderedAt = timestamp;
    }

    animationFrame = requestAnimationFrame(render);
  };

  const start = () => {
    if (!visible || document.hidden || reducedMotion.matches || animationFrame) return;
    animationFrame = requestAnimationFrame(render);
  };

  const stop = () => {
    if (!animationFrame) return;
    cancelAnimationFrame(animationFrame);
    animationFrame = 0;
  };

  const observer = new IntersectionObserver((entries) => {
    visible = Boolean(entries[0]?.isIntersecting);
    if (visible) start();
    else stop();
  }, { rootMargin: "140px 0px" });

  observer.observe(planetary);

  const handleMotionPreference = () => {
    if (reducedMotion.matches) {
      stop();
      placeSatellites(performance.now(), true);
      return;
    }
    start();
  };

  const handleVisibility = () => {
    if (document.hidden) stop();
    else start();
  };

  let resizeTimer = 0;
  const handleResize = () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      placeSatellites(performance.now(), reducedMotion.matches);
    }, 90);
  };

  reducedMotion.addEventListener?.("change", handleMotionPreference);
  document.addEventListener("visibilitychange", handleVisibility);
  window.addEventListener("resize", handleResize, { passive: true });

  placeSatellites(performance.now(), reducedMotion.matches);
})();
