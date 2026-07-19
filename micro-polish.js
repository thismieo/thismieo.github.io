(() => {
  "use strict";

  document.documentElement.dataset.release = "2026.07.19.84";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const bindPressLifecycle = (element) => {
    if (!element || element.dataset.microPressReady === "true") return;
    element.dataset.microPressReady = "true";

    const beginPress = (event) => {
      element.classList.add("is-pressing");
      if (event.pointerId !== undefined && element.setPointerCapture) {
        try {
          element.setPointerCapture(event.pointerId);
        } catch {
          // Native interaction remains functional when pointer capture is unavailable.
        }
      }
    };

    const endPress = () => element.classList.remove("is-pressing");

    element.addEventListener("pointerdown", beginPress);
    element.addEventListener("pointerup", endPress);
    element.addEventListener("pointercancel", endPress);
    element.addEventListener("lostpointercapture", endPress);
    element.addEventListener("dragstart", endPress);
    element.addEventListener("blur", endPress);
  };

  document.querySelectorAll("#home .hero-v33-actions .button, #home .hero-v33-links a")
    .forEach(bindPressLifecycle);

  const rail = document.querySelector("#home .hero-tech-rail");
  if (rail && !rail.closest(".hero-tech-panel")) {
    const panel = document.createElement("div");
    panel.className = "hero-tech-panel";

    const kicker = document.createElement("p");
    kicker.className = "hero-tech-kicker";
    kicker.id = "hero-tech-kicker";
    kicker.textContent = "Current Learning Path";

    rail.setAttribute("aria-labelledby", kicker.id);
    rail.replaceWith(panel);
    panel.append(kicker, rail);
  }

  const currentOutput = document.querySelector("#hero-v33-terminal-text");
  if (currentOutput) {
    // Replacing the node cleanly detaches the older typewriter timer without global state.
    const output = currentOutput.cloneNode(false);
    output.textContent = "";
    output.setAttribute("aria-live", "polite");
    output.setAttribute("aria-atomic", "true");
    output.dataset.terminalV84Ready = "true";
    currentOutput.replaceWith(output);

    const phrases = [
      'current_focus = "Python Foundations"',
      "practice_mode = True",
      'next_layer = "Data Analysis"',
      "projects_built += 1",
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
          schedule(1380);
          return;
        }

        if (deleting && characterIndex <= 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          schedule(300);
          return;
        }

        schedule(deleting ? 20 : 40);
      };

      schedule(260);

      document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
          window.clearTimeout(timer);
          pausedByVisibility = true;
          return;
        }

        if (pausedByVisibility) {
          pausedByVisibility = false;
          schedule(180);
        }
      });
    }
  }

  window.addEventListener("blur", () => {
    document.querySelectorAll("#home .is-pressing")
      .forEach((element) => element.classList.remove("is-pressing"));
  });
})();
