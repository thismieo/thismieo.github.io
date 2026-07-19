(() => {
  "use strict";

  const planetary = document.querySelector("#home .hero-v33-planetary");
  if (!planetary) return;

  const orbitSvg = planetary.querySelector(".hero-v33-orbit-svg");
  const orbitLines = Array.from(planetary.querySelectorAll(".hero-v33-orbit-svg .orbit-line")).slice(0, 2);
  const satellites = Array.from(planetary.querySelectorAll(".hero-v33-rotator")).slice(0, 3);
  if (!orbitSvg || orbitLines.length !== 2 || satellites.length !== 3) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const coarsePointer = window.matchMedia("(pointer: coarse)");
  const viewBox = orbitSvg.viewBox.baseVal;

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
  let visible = false;
  let scrolling = false;
  let scrollEndTimer = 0;
  let lastFrameAt = 0;
  let motionTime = 0;

  const refreshGeometry = () => {
    const planetaryRect = planetary.getBoundingClientRect();
    const svgRect = orbitSvg.getBoundingClientRect();
    if (!planetaryRect.width || !planetaryRect.height || !svgRect.width || !svgRect.height) return;

    orbitBox = {
      left: svgRect.left - planetaryRect.left,
      top: svgRect.top - planetaryRect.top,
      width: svgRect.width,
      height: svgRect.height
    };
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
      const duration = configuration.duration * (coarsePointer.matches ? 1.2 : 1);
      let progress = staticPlacement
        ? configuration.phase
        : ((elapsed / duration) + configuration.phase) % 1;

      if (configuration.direction < 0) progress = 1 - progress;
      const coordinates = pointOnOrbit(geometry, progress);
      satellites[index].style.setProperty("--orbit-x", `${coordinates.x.toFixed(2)}px`);
      satellites[index].style.setProperty("--orbit-y", `${coordinates.y.toFixed(2)}px`);
    });
  };

  const render = (timestamp) => {
    animationFrame = 0;
    if (!visible || scrolling || document.hidden || reducedMotion.matches) {
      lastFrameAt = 0;
      return;
    }

    if (!lastFrameAt) lastFrameAt = timestamp;
    const delta = Math.min(timestamp - lastFrameAt, 50);
    const frameInterval = coarsePointer.matches ? 1000 / 24 : 1000 / 60;

    if (timestamp - lastFrameAt >= frameInterval) {
      motionTime += delta;
      placeSatellites(motionTime);
      lastFrameAt = timestamp;
    }

    animationFrame = requestAnimationFrame(render);
  };

  const start = () => {
    if (!visible || scrolling || document.hidden || reducedMotion.matches || animationFrame) return;
    lastFrameAt = 0;
    animationFrame = requestAnimationFrame(render);
  };

  const stop = () => {
    if (animationFrame) cancelAnimationFrame(animationFrame);
    animationFrame = 0;
    lastFrameAt = 0;
  };

  const observer = new IntersectionObserver((entries) => {
    visible = Boolean(entries[0]?.isIntersecting);
    if (visible) start();
    else stop();
  }, { rootMargin: "100px 0px" });

  observer.observe(planetary);

  const settleGeometry = () => {
    refreshGeometry();
    placeSatellites(motionTime, reducedMotion.matches);
  };

  const handleScroll = () => {
    if (!coarsePointer.matches) return;
    scrolling = true;
    stop();
    window.clearTimeout(scrollEndTimer);
    scrollEndTimer = window.setTimeout(() => {
      settleGeometry();
      scrolling = false;
      start();
    }, 140);
  };

  const handleMotionPreference = () => {
    if (reducedMotion.matches) {
      stop();
      settleGeometry();
      return;
    }
    start();
  };

  const handleVisibility = () => {
    if (document.hidden) stop();
    else start();
  };

  const resizeObserver = typeof ResizeObserver === "function"
    ? new ResizeObserver(() => {
        window.requestAnimationFrame(settleGeometry);
      })
    : null;

  resizeObserver?.observe(planetary);
  resizeObserver?.observe(orbitSvg);
  reducedMotion.addEventListener?.("change", handleMotionPreference);
  document.addEventListener("visibilitychange", handleVisibility);
  window.addEventListener("scroll", handleScroll, { passive: true });
  window.addEventListener("resize", settleGeometry, { passive: true });
  window.addEventListener("orientationchange", settleGeometry, { passive: true });

  window.requestAnimationFrame(() => {
    refreshGeometry();
    placeSatellites(0, reducedMotion.matches);
    start();
  });
})();
