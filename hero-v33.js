(() => {
  "use strict";

  document.documentElement.dataset.release = "2026.07.18.40";

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

    if (reducedMotion.matches) {
      output.textContent = phrases[0];
    } else {
      let phraseIndex = 0;
      let characterIndex = 0;
      let deleting = false;
      let timer = 0;
      let pausedByVisibility = false;

      const schedule = (delay) => {
        window.clearTimeout(timer);
        timer = window.setTimeout(step, delay);
      };

      const step = () => {
        if (document.hidden) {
          pausedByVisibility = true;
          return;
        }

        const phrase = phrases[phraseIndex];
        characterIndex += deleting ? -1 : 1;
        output.textContent = phrase.slice(0, Math.max(0, characterIndex));

        if (!deleting && characterIndex >= phrase.length) {
          deleting = true;
          schedule(1650);
          return;
        }

        if (deleting && characterIndex <= 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          schedule(360);
          return;
        }

        schedule(deleting ? 24 : 48);
      };

      output.textContent = "";
      schedule(420);

      document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
          window.clearTimeout(timer);
          pausedByVisibility = true;
          return;
        }
        if (pausedByVisibility) {
          pausedByVisibility = false;
          schedule(240);
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

  /* V40: lower the Hero closing group and make every capsule a real destination. */
  if (!document.querySelector("#hero-v40-runtime-styles")) {
    const style = document.createElement("style");
    style.id = "hero-v40-runtime-styles";
    style.textContent = `
      @media (min-width: 861px) {
        #home .hero-v33-capsules { margin-top: 18px !important; }
        .system-ticker { margin-top: 10px !important; }
        #about.section { padding-top: 64px !important; }

        #home .hero-v33-capsules article[role="link"] {
          position: relative;
          cursor: pointer;
        }

        #home .hero-v33-capsules article[role="link"]:focus-visible {
          outline: 2px solid rgba(103, 232, 249, 0.72);
          outline-offset: 4px;
          border-color: rgba(103, 232, 249, 0.38);
          transform: translateY(-4px);
        }

        #home .capsule-v40-link-mark {
          position: absolute;
          top: 10px;
          right: 12px;
          z-index: 4;
          color: rgba(221, 244, 255, 0.42);
          font-family: "Space Grotesk", sans-serif;
          font-size: 0.72rem;
          line-height: 1;
          pointer-events: none;
          transition: color 180ms ease, transform 180ms ease, text-shadow 180ms ease;
        }

        #home .hero-v33-capsules article[role="link"]:hover .capsule-v40-link-mark,
        #home .hero-v33-capsules article[role="link"]:focus-visible .capsule-v40-link-mark {
          color: #8bf4ff;
          transform: translate3d(2px, -2px, 0);
          text-shadow: 0 0 12px rgba(103, 232, 249, 0.34);
        }
      }

      @media (min-width: 861px) and (max-width: 1180px) {
        #home .hero-v33-capsules { margin-top: 12px !important; }
        .system-ticker { margin-top: 8px !important; }
        #about.section { padding-top: 58px !important; }
      }

      @media (prefers-reduced-motion: reduce) {
        #home .capsule-v40-link-mark,
        #home .hero-v33-capsules article[role="link"] { transition: none !important; }
      }
    `;
    document.head.append(style);
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

    if (!capsule.querySelector(".capsule-v40-link-mark")) {
      const mark = document.createElement("span");
      mark.className = "capsule-v40-link-mark";
      mark.setAttribute("aria-hidden", "true");
      mark.textContent = "↗";
      capsule.append(mark);
    }

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
