(() => {
  "use strict";

  const planetary = document.querySelector("#home .hero-v33-planetary");
  if (!planetary) return;

  const orbitSvg = planetary.querySelector(".hero-v33-orbit-svg");
  const orbitLines = Array.from(planetary.querySelectorAll(".hero-v33-orbit-svg .orbit-line")).slice(0, 2);
  // The third HTML satellite uses rotator-v33-three and is included in this three-item collection.
  const satellites = Array.from(planetary.querySelectorAll(".hero-v33-rotator")).slice(0, 3);
  if (!orbitSvg || orbitLines.length !== 2 || satellites.length !== 3) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const viewBox = {
    x: orbitSvg.viewBox.baseVal.x,
    y: orbitSvg.viewBox.baseVal.y,
    width: orbitSvg.viewBox.baseVal.width,
    height: orbitSvg.viewBox.baseVal.height
  };

  const orbitGeometry = orbitLines.map((line) => {
    const transform = line.transform.baseVal.consolidate()?.matrix;
    return {
      cx: line.cx.baseVal.value,
      cy: line.cy.baseVal.value,
      rx: line.rx.baseVal.value,
      ry: line.ry.baseVal.value,
      matrix: transform
        ? { a: transform.a, b: transform.b, c: transform.c, d: transform.d, e: transform.e, f: transform.f }
        : { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 }
    };
  });

  const configurations = [
    { lineIndex: 0, duration: 36000, phase: 0.08, direction: 1, className: "orbit-glow-blue" },
    { lineIndex: 1, duration: 46000, phase: 0.43, direction: -1, className: "orbit-glow-pink" },
    { lineIndex: 0, duration: 42000, phase: 0.64, direction: 1, className: "orbit-glow-violet" }
  ];

  satellites.forEach((satellite, index) => {
    satellite.classList.add("is-path-driven", configurations[index].className);
    satellite.dataset.orbitIndex = String(index + 1);
  });

  let orbitBox = null;
  let animationFrame = 0;
  let geometryFrame = 0;
  let visible = false;
  let lastFrameAt = 0;
  let motionTime = 0;

  const refreshGeometry = () => {
    const planetaryRect = planetary.getBoundingClientRect();
    const svgRect = orbitSvg.getBoundingClientRect();
    if (!planetaryRect.width || !planetaryRect.height || !svgRect.width || !svgRect.height) return false;

    orbitBox = {
      left: svgRect.left - planetaryRect.left,
      top: svgRect.top - planetaryRect.top,
      width: svgRect.width,
      height: svgRect.height
    };
    return true;
  };

  const pointOnOrbit = (geometry, progress) => {
    const angle = Math.PI * 2 * progress;
    const localX = geometry.cx + geometry.rx * Math.cos(angle);
    const localY = geometry.cy + geometry.ry * Math.sin(angle);
    const matrix = geometry.matrix;
    const svgX = matrix.a * localX + matrix.c * localY + matrix.e;
    const svgY = matrix.b * localX + matrix.d * localY + matrix.f;

    return {
      x: orbitBox.left + ((svgX - viewBox.x) / viewBox.width) * orbitBox.width,
      y: orbitBox.top + ((svgY - viewBox.y) / viewBox.height) * orbitBox.height
    };
  };

  const placeSatellites = (elapsed = motionTime, staticPlacement = false) => {
    if (!orbitBox) return;

    configurations.forEach((configuration, index) => {
      const geometry = orbitGeometry[configuration.lineIndex];
      let progress = staticPlacement
        ? configuration.phase
        : ((elapsed / configuration.duration) + configuration.phase) % 1;

      if (configuration.direction < 0) progress = 1 - progress;
      const coordinates = pointOnOrbit(geometry, progress);
      satellites[index].style.setProperty("--orbit-x", `${coordinates.x.toFixed(2)}px`);
      satellites[index].style.setProperty("--orbit-y", `${coordinates.y.toFixed(2)}px`);
    });
  };

  const render = (timestamp) => {
    animationFrame = 0;
    if (!visible || document.hidden || reducedMotion.matches) {
      lastFrameAt = 0;
      return;
    }

    if (!lastFrameAt) lastFrameAt = timestamp;
    const delta = Math.min(timestamp - lastFrameAt, 50);
    lastFrameAt = timestamp;
    motionTime += delta;
    placeSatellites(motionTime);
    animationFrame = requestAnimationFrame(render);
  };

  const start = () => {
    if (!visible || document.hidden || reducedMotion.matches || animationFrame) return;
    lastFrameAt = 0;
    animationFrame = requestAnimationFrame(render);
  };

  const stop = () => {
    if (animationFrame) cancelAnimationFrame(animationFrame);
    animationFrame = 0;
    lastFrameAt = 0;
  };

  const settleGeometry = () => {
    if (!refreshGeometry()) return;
    placeSatellites(motionTime, reducedMotion.matches);
  };

  const scheduleGeometryRefresh = () => {
    if (geometryFrame) return;
    geometryFrame = requestAnimationFrame(() => {
      geometryFrame = 0;
      settleGeometry();
    });
  };

  const observer = new IntersectionObserver((entries) => {
    visible = Boolean(entries[0]?.isIntersecting);
    if (visible) {
      scheduleGeometryRefresh();
      start();
    } else {
      stop();
    }
  }, { rootMargin: "100px 0px" });

  const handleMotionPreference = () => {
    if (reducedMotion.matches) {
      stop();
      scheduleGeometryRefresh();
      return;
    }
    start();
  };

  const handleVisibility = () => {
    if (document.hidden) stop();
    else {
      scheduleGeometryRefresh();
      start();
    }
  };

  const handlePageShow = () => {
    scheduleGeometryRefresh();
    start();
  };

  const resizeObserver = typeof ResizeObserver === "function"
    ? new ResizeObserver(scheduleGeometryRefresh)
    : null;

  observer.observe(planetary);
  resizeObserver?.observe(planetary);
  resizeObserver?.observe(orbitSvg);
  reducedMotion.addEventListener?.("change", handleMotionPreference);
  document.addEventListener("visibilitychange", handleVisibility);
  window.addEventListener("resize", scheduleGeometryRefresh, { passive: true });
  window.addEventListener("orientationchange", scheduleGeometryRefresh, { passive: true });
  window.addEventListener("pageshow", handlePageShow, { passive: true });
  window.addEventListener("pagehide", stop, { passive: true });

  requestAnimationFrame(() => {
    settleGeometry();
    start();
  });
})();
