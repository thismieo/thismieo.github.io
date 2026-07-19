(() => {
  "use strict";

  const SVG_NS = "http://www.w3.org/2000/svg";
  const planetary = document.querySelector("#home .hero-v33-planetary");
  const orbitSvg = planetary?.querySelector(".hero-v33-orbit-svg");
  const orbitLines = orbitSvg
    ? Array.from(orbitSvg.querySelectorAll(".orbit-line")).slice(0, 2)
    : [];

  if (!planetary || !orbitSvg || orbitLines.length !== 2) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const createSvgElement = (name, attributes = {}) => {
    const element = document.createElementNS(SVG_NS, name);
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, String(value));
    });
    return element;
  };

  const transformedPoint = (geometry, progress) => {
    const angle = Math.PI * 2 * progress;
    const localX = geometry.cx + geometry.rx * Math.cos(angle);
    const localY = geometry.cy + geometry.ry * Math.sin(angle);
    const matrix = geometry.matrix;

    return {
      x: matrix.a * localX + matrix.c * localY + matrix.e,
      y: matrix.b * localX + matrix.d * localY + matrix.f
    };
  };

  const readGeometry = (line) => {
    const consolidated = line.transform.baseVal.consolidate();
    const matrix = consolidated?.matrix;

    return {
      cx: line.cx.baseVal.value,
      cy: line.cy.baseVal.value,
      rx: line.rx.baseVal.value,
      ry: line.ry.baseVal.value,
      matrix: matrix
        ? { a: matrix.a, b: matrix.b, c: matrix.c, d: matrix.d, e: matrix.e, f: matrix.f }
        : { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 }
    };
  };

  const buildMotionPath = (line, phase, reverse = false) => {
    const geometry = readGeometry(line);
    const points = [];
    const sampleCount = 240;

    for (let index = 0; index <= sampleCount; index += 1) {
      const step = index / sampleCount;
      const progress = reverse
        ? (phase - step + 2) % 1
        : (phase + step) % 1;
      points.push(transformedPoint(geometry, progress));
    }

    const path = points
      .map((point, index) => `${index === 0 ? "M" : "L"}${point.x.toFixed(2)} ${point.y.toFixed(2)}`)
      .join(" ");

    return {
      path: `${path} Z`,
      start: points[0]
    };
  };

  const addGradient = (defs, id, colors) => {
    const gradient = createSvgElement("radialGradient", {
      id,
      cx: "34%",
      cy: "28%",
      r: "72%"
    });

    [
      ["0%", "#ffffff", "1"],
      ["18%", colors.core, "1"],
      ["52%", colors.mid, "0.98"],
      ["100%", colors.deep, "0.9"]
    ].forEach(([offset, color, opacity]) => {
      gradient.appendChild(createSvgElement("stop", {
        offset,
        "stop-color": color,
        "stop-opacity": opacity
      }));
    });

    defs.appendChild(gradient);
  };

  const addPulseAnimation = (circle, attributeName, values, duration, begin = "0s") => {
    circle.appendChild(createSvgElement("animate", {
      attributeName,
      values,
      dur: duration,
      begin,
      repeatCount: "indefinite",
      calcMode: "spline",
      keyTimes: "0;0.5;1",
      keySplines: ".42 0 .58 1;.42 0 .58 1"
    }));
  };

  const addSatellite = ({
    line,
    className,
    gradientId,
    colors,
    phase,
    reverse,
    duration,
    pulseDuration,
    pulseOffset
  }) => {
    const motionPath = buildMotionPath(line, phase, reverse);
    const group = createSvgElement("g", {
      class: `hero-v97-satellite ${className}`,
      "aria-hidden": "true"
    });

    const aura = createSvgElement("circle", {
      class: "hero-v97-satellite-aura",
      r: "10",
      fill: colors.mid,
      opacity: "0.1"
    });
    addPulseAnimation(aura, "r", "8;14;8", pulseDuration, pulseOffset);
    addPulseAnimation(aura, "opacity", "0.08;0.23;0.08", pulseDuration, pulseOffset);

    const halo = createSvgElement("circle", {
      class: "hero-v97-satellite-halo",
      r: "6.4",
      fill: colors.mid,
      opacity: "0.16"
    });
    addPulseAnimation(halo, "r", "5.4;8.2;5.4", pulseDuration, pulseOffset);
    addPulseAnimation(halo, "opacity", "0.12;0.3;0.12", pulseDuration, pulseOffset);

    const core = createSvgElement("circle", {
      class: "hero-v97-satellite-core",
      r: "4.3",
      fill: `url(#${gradientId})`,
      opacity: "0.92"
    });
    addPulseAnimation(core, "r", "4;4.8;4", pulseDuration, pulseOffset);
    addPulseAnimation(core, "opacity", "0.82;1;0.82", pulseDuration, pulseOffset);

    const shine = createSvgElement("circle", {
      class: "hero-v97-satellite-shine",
      cx: "-1.35",
      cy: "-1.25",
      r: "1.05",
      fill: "#ffffff",
      opacity: "0.9"
    });

    group.append(aura, halo, core, shine);

    if (reducedMotion.matches) {
      group.setAttribute("transform", `translate(${motionPath.start.x.toFixed(2)} ${motionPath.start.y.toFixed(2)})`);
    } else {
      group.appendChild(createSvgElement("animateMotion", {
        path: motionPath.path,
        dur: duration,
        begin: "0s",
        repeatCount: "indefinite",
        rotate: "0",
        calcMode: "linear"
      }));
    }

    orbitSvg.appendChild(group);
  };

  const buildNativeOrbitSystem = () => {
    planetary.querySelectorAll(":scope > .hero-v33-rotator").forEach((element) => element.remove());
    orbitSvg.querySelectorAll(".hero-v97-satellite, .hero-v97-gradient").forEach((element) => element.remove());

    orbitSvg.setAttribute("preserveAspectRatio", "xMidYMid meet");
    planetary.dataset.orbitEngine = "native-svg-v97";

    const defs = orbitSvg.querySelector("defs") || orbitSvg.insertBefore(createSvgElement("defs"), orbitSvg.firstChild);
    const palettes = [
      {
        id: "hero-v97-blue-gradient",
        className: "hero-v97-satellite-blue",
        colors: { core: "#d9fbff", mid: "#67e8f9", deep: "#2563eb" }
      },
      {
        id: "hero-v97-pink-gradient",
        className: "hero-v97-satellite-pink",
        colors: { core: "#ffe0f0", mid: "#f472b6", deep: "#a855f7" }
      },
      {
        id: "hero-v97-violet-gradient",
        className: "hero-v97-satellite-violet",
        colors: { core: "#ede9fe", mid: "#a78bfa", deep: "#22d3ee" }
      }
    ];

    palettes.forEach((palette) => {
      const previous = defs.querySelector(`#${palette.id}`);
      previous?.remove();
      addGradient(defs, palette.id, palette.colors);
      defs.lastElementChild?.classList.add("hero-v97-gradient");
    });

    addSatellite({
      line: orbitLines[0],
      className: palettes[0].className,
      gradientId: palettes[0].id,
      colors: palettes[0].colors,
      phase: 0.08,
      reverse: false,
      duration: "36s",
      pulseDuration: "4.2s",
      pulseOffset: "0s"
    });

    addSatellite({
      line: orbitLines[1],
      className: palettes[1].className,
      gradientId: palettes[1].id,
      colors: palettes[1].colors,
      phase: 0.43,
      reverse: true,
      duration: "46s",
      pulseDuration: "4.6s",
      pulseOffset: "-1.3s"
    });

    addSatellite({
      line: orbitLines[0],
      className: palettes[2].className,
      gradientId: palettes[2].id,
      colors: palettes[2].colors,
      phase: 0.64,
      reverse: false,
      duration: "42s",
      pulseDuration: "5s",
      pulseOffset: "-2.5s"
    });

    orbitSvg.unpauseAnimations?.();
  };

  buildNativeOrbitSystem();
  reducedMotion.addEventListener?.("change", buildNativeOrbitSystem);

  const resumeSvgMotion = () => {
    if (!document.hidden && !reducedMotion.matches) {
      orbitSvg.unpauseAnimations?.();
    }
  };

  window.addEventListener("pageshow", resumeSvgMotion, { passive: true });
  document.addEventListener("visibilitychange", resumeSvgMotion);
})();
