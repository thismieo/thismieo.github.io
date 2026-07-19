(() => {
  "use strict";

  const heroCopy = document.querySelector("#home .hero-v33-copy");
  if (heroCopy && !heroCopy.querySelector(".hero-v34-name")) {
    const name = document.createElement("p");
    name.className = "hero-v34-name";
    name.textContent = "Mohammed Muayad";
    const eyebrow = heroCopy.querySelector(".hero-v33-eyebrow");
    heroCopy.insertBefore(name, eyebrow || heroCopy.firstChild);
  }

  const output = document.querySelector("#hero-v33-terminal-text");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

  if (output) {
    const phrases = [
      'current_focus = "Python Foundations"',
      'method = ["learn", "practice", "build"]',
      'next_layer = "Data Analysis"',
      'direction = "AI Engineering"'
    ];

    const HOLD_DURATION = 3400;
    const FADE_DURATION = 240;
    let phraseIndex = 0;
    let timer = 0;
    let pausedByVisibility = false;

    output.dataset.terminalMode = "line-swap";
    output.textContent = phrases[0];
    output.style.opacity = "1";
    output.style.transform = "translate3d(0, 0, 0)";

    if (!reducedMotion.matches) {
      output.style.transition = `opacity ${FADE_DURATION}ms ease, transform ${FADE_DURATION}ms ease`;
      output.style.willChange = "opacity, transform";

      const clearTimer = () => {
        window.clearTimeout(timer);
        timer = 0;
      };

      const scheduleNext = () => {
        clearTimer();
        timer = window.setTimeout(swapLine, HOLD_DURATION);
      };

      const swapLine = () => {
        if (document.hidden) {
          pausedByVisibility = true;
          return;
        }

        output.style.opacity = "0";
        output.style.transform = "translate3d(0, 2px, 0)";

        timer = window.setTimeout(() => {
          phraseIndex = (phraseIndex + 1) % phrases.length;
          output.textContent = phrases[phraseIndex];
          output.style.opacity = "1";
          output.style.transform = "translate3d(0, 0, 0)";
          scheduleNext();
        }, FADE_DURATION);
      };

      scheduleNext();

      document.addEventListener("visibilitychange", () => {
        clearTimer();

        if (document.hidden) {
          pausedByVisibility = true;
          return;
        }

        output.style.opacity = "1";
        output.style.transform = "translate3d(0, 0, 0)";

        if (pausedByVisibility) {
          pausedByVisibility = false;
          scheduleNext();
        }
      });
    }
  }

  const desktopPortrait = document.querySelector("[data-desktop-portrait-trigger]");
  const mobilePortraitTrigger = document.querySelector("#portrait-trigger");

  if (desktopPortrait && mobilePortraitTrigger) {
    const openPortrait = () => mobilePortraitTrigger.click();

    desktopPortrait.addEventListener("click", openPortrait);
    desktopPortrait.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      openPortrait();
    });
  }

  const capsuleDestinations = [
    { target: "#journey", label: "Go to the Learning Journey section" },
    { target: "#stack", label: "Go to the current Technology Ecosystem section" },
    { target: "#about", label: "Go to the About section and learning rhythm" },
    { target: "#neural", label: "Go to the Neural Systems section" }
  ];

  document.querySelectorAll(".hero-v33-capsules article").forEach((capsule, index) => {
    const destination = capsuleDestinations[index];
    if (!destination) return;

    capsule.setAttribute("role", "link");
    capsule.setAttribute("tabindex", "0");
    capsule.setAttribute("aria-label", destination.label);
    capsule.dataset.target = destination.target;

    const navigate = () => {
      const section = document.querySelector(destination.target);
      if (!section) return;
      window.history.pushState(null, "", destination.target);
      section.scrollIntoView({
        behavior: reducedMotion.matches ? "auto" : "smooth",
        block: "start"
      });
    };

    capsule.addEventListener("click", navigate);
    capsule.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      navigate();
    });
  });

  if (!finePointer.matches || reducedMotion.matches) return;

  const planetary = document.querySelector(".hero-v33-planetary");
  const planet = planetary?.querySelector(".hero-v33-planet");
  const orbitMap = planetary?.querySelector(".hero-v33-orbit-svg");

  planetary?.addEventListener("pointermove", (event) => {
    const rect = planetary.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    if (planet) planet.style.transform = `translate(-50%, -50%) translate(${x * 10}px, ${y * 8}px)`;
    if (orbitMap) orbitMap.style.transform = `translate(${x * 5}px, ${y * 4}px)`;
  }, { passive: true });

  planetary?.addEventListener("pointerleave", () => {
    if (planet) planet.style.transform = "translate(-50%, -50%) translate(0, 0)";
    if (orbitMap) orbitMap.style.transform = "translate(0, 0)";
  });

  document.querySelectorAll(".hero-v33-capsules article").forEach((capsule) => {
    capsule.addEventListener("pointermove", (event) => {
      const rect = capsule.getBoundingClientRect();
      capsule.style.setProperty("--capsule-x", `${event.clientX - rect.left}px`);
      capsule.style.setProperty("--capsule-y", `${event.clientY - rect.top}px`);
    }, { passive: true });
  });
})();
