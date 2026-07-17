(() => {
  "use strict";

  document.documentElement.dataset.release = "2026.07.17.39";

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
