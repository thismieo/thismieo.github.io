(() => {
  "use strict";

  // Stable semantic classes isolate the Hero refinements and technical learning rail.
  document.documentElement.dataset.release = "2026.07.19.86";

  const loadStylesheet = (selector, dataName, href) => {
    let stylesheet = document.querySelector(selector);
    if (!stylesheet) {
      stylesheet = document.createElement("link");
      stylesheet.rel = "stylesheet";
      stylesheet.dataset[dataName] = "true";
      document.head.append(stylesheet);
    }
    stylesheet.href = href;
  };

  loadStylesheet("link[data-micro-polish]", "microPolish", "micro-polish.css?v=20260719.85");
  loadStylesheet("link[data-interaction-v86]", "interactionV86", "interaction-v86.css?v=20260719.86");

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const compactViewport = window.matchMedia("(max-width: 860px)");
  const home = document.querySelector("#home");
  const copy = home?.querySelector(".hero-v33-copy");
  const heading = copy?.querySelector("h1");
  const summary = copy?.querySelector(".hero-v33-summary");
  const actions = copy?.querySelector(".hero-v33-actions");

  if (!home || !copy || !heading || !summary || !actions) return;
  if (home.dataset.heroV68Ready === "true") return;

  home.dataset.heroV68Ready = "true";
  home.classList.add("is-hero-v68", "has-tech-rail");

  const releaseTimers = new WeakMap();

  const bindPressLifecycle = (element) => {
    if (!element || element.dataset.microPressReady === "true") return;
    element.dataset.microPressReady = "true";

    const updatePressOrigin = (event) => {
      const rect = element.getBoundingClientRect();
      const x = rect.width ? ((event.clientX - rect.left) / rect.width) * 100 : 50;
      const y = rect.height ? ((event.clientY - rect.top) / rect.height) * 100 : 50;
      element.style.setProperty("--press-x", `${Math.max(0, Math.min(100, x)).toFixed(2)}%`);
      element.style.setProperty("--press-y", `${Math.max(0, Math.min(100, y)).toFixed(2)}%`);
    };

    const clearReleaseTimer = () => {
      const timer = releaseTimers.get(element);
      if (timer) window.clearTimeout(timer);
      releaseTimers.delete(element);
    };

    const beginPress = (event) => {
      clearReleaseTimer();
      updatePressOrigin(event);
      element.classList.remove("is-releasing");
      element.classList.add("is-pressing");

      if (event.pointerId !== undefined && element.setPointerCapture) {
        try {
          element.setPointerCapture(event.pointerId);
        } catch {
          // Pointer capture is an enhancement; native link behavior remains intact.
        }
      }
    };

    const movePress = (event) => {
      if (!element.classList.contains("is-pressing")) return;
      updatePressOrigin(event);
    };

    const endPress = () => {
      if (!element.classList.contains("is-pressing")) return;
      element.classList.remove("is-pressing");
      element.classList.add("is-releasing");
      clearReleaseTimer();
      releaseTimers.set(element, window.setTimeout(() => {
        element.classList.remove("is-releasing");
        releaseTimers.delete(element);
      }, 320));
    };

    element.addEventListener("pointerdown", beginPress);
    element.addEventListener("pointermove", movePress, { passive: true });
    element.addEventListener("pointerup", endPress);
    element.addEventListener("pointercancel", endPress);
    element.addEventListener("lostpointercapture", endPress);
    element.addEventListener("pointerleave", endPress);
    element.addEventListener("dragstart", endPress);
    element.addEventListener("blur", endPress);
  };

  const firstLine = document.createElement("span");
  firstLine.className = "hero-v68-line hero-v68-line-one";

  const building = document.createElement("span");
  building.className = "hero-v68-building";
  building.textContent = "Building";

  const intelligent = document.createElement("span");
  intelligent.className = "hero-v68-intelligent";
  intelligent.textContent = "Intelligent Systems";

  firstLine.append(building, document.createTextNode(" "), intelligent);

  const secondLine = document.createElement("span");
  secondLine.className = "hero-v68-line hero-v68-line-two";
  secondLine.textContent = "for the Future.";

  heading.replaceChildren(firstLine, secondLine);

  const fullSummary = document.createElement("span");
  fullSummary.className = "hero-v68-summary-desktop";
  fullSummary.textContent = "I am building a disciplined path from Python foundations to artificial intelligence through clear study, consistent practice, documented progress, and projects that turn learning into real technical evidence.";

  const mobileSummary = document.createElement("span");
  mobileSummary.className = "hero-v68-summary-mobile";
  mobileSummary.textContent = "A disciplined path from Python foundations to AI through consistent practice and real projects.";

  summary.replaceChildren(fullSummary, mobileSummary);

  const techResources = [
    {
      title: "Python",
      subtitle: "Foundations",
      href: "https://docs.python.org/3/tutorial/",
      paths: '<path d="M8.1 4.7h5.1a3.1 3.1 0 0 1 3.1 3.1v2.35H10a3 3 0 0 0-3 3v1.15H5.2a2.5 2.5 0 0 1-2.5-2.5V7.2a2.5 2.5 0 0 1 2.5-2.5h2.9Z"/><path d="M15.9 19.3h-5.1a3.1 3.1 0 0 1-3.1-3.1v-2.35H14a3 3 0 0 0 3-3V9.7h1.8a2.5 2.5 0 0 1 2.5 2.5v4.6a2.5 2.5 0 0 1-2.5 2.5h-2.9Z"/><circle cx="7.1" cy="7.35" r=".7"/><circle cx="16.9" cy="16.65" r=".7"/>'
    },
    {
      title: "Data",
      subtitle: "Foundations",
      href: "https://developers.google.com/machine-learning/crash-course/overfitting/data-characteristics?hl=ar",
      paths: '<ellipse cx="12" cy="5.8" rx="7.15" ry="2.55"/><path d="M4.85 5.8v6.1c0 1.42 3.2 2.55 7.15 2.55s7.15-1.13 7.15-2.55V5.8"/><path d="M4.85 11.9V18c0 1.42 3.2 2.55 7.15 2.55s7.15-1.13 7.15-2.55v-6.1"/><path d="M8.1 8.1c1.05.28 2.38.44 3.9.44s2.85-.16 3.9-.44"/>'
    },
    {
      title: "Machine",
      subtitle: "Learning",
      href: "https://developers.google.com/machine-learning/",
      paths: '<circle cx="5.9" cy="7.1" r="2"/><circle cx="18.1" cy="6.2" r="2"/><circle cx="12" cy="18" r="2"/><path d="m7.9 6.95 8.2-.6M7.05 8.9l3.8 7.25M16.95 8.05l-3.8 8.1"/><circle cx="12" cy="11.55" r="1.25"/><path d="m7.7 8.3 3.2 2.55M16.35 7.75l-3.2 2.7M12 12.8V16"/>'
    },
    {
      title: "AI",
      subtitle: "Systems",
      href: "https://learn.microsoft.com/ar-sa/training/paths/ai-concepts/",
      paths: '<rect x="6.35" y="6.35" width="11.3" height="11.3" rx="2.55"/><path d="M9 3v3.35M15 3v3.35M9 17.65V21M15 17.65V21M3 9h3.35M3 15h3.35M17.65 9H21M17.65 15H21"/><path d="M9.25 12h5.5M12 9.25v5.5"/><circle cx="12" cy="12" r="3.1"/>'
    }
  ];

  const existingPanel = copy.querySelector(".hero-tech-panel");
  if (existingPanel) existingPanel.remove();
  copy.querySelector(".hero-tech-rail")?.remove();

  const panel = document.createElement("div");
  panel.className = "hero-tech-panel";

  const kicker = document.createElement("p");
  kicker.className = "hero-tech-kicker";
  kicker.id = "hero-tech-kicker";
  kicker.textContent = "CORE LEARNING STACK";

  const rail = document.createElement("div");
  rail.className = "hero-tech-rail";
  rail.dataset.techIcons = "v86";
  rail.dataset.presentation = "compact-terminal-rail";
  rail.dataset.wave = "continuous";
  rail.setAttribute("aria-labelledby", kicker.id);
  rail.setAttribute("role", "list");

  techResources.forEach(({ title, subtitle, href, paths }) => {
    const item = document.createElement("a");
    item.className = "hero-tech-item";
    item.href = href;
    item.target = "_blank";
    item.rel = "noopener noreferrer";
    item.setAttribute("role", "listitem");
    item.setAttribute("aria-label", `Open the official ${title} ${subtitle} resource in a new tab`);
    item.title = `${title} ${subtitle}`;

    const iconShell = document.createElement("span");
    iconShell.className = "hero-tech-icon-shell";
    iconShell.setAttribute("aria-hidden", "true");

    const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    icon.setAttribute("viewBox", "0 0 24 24");
    icon.setAttribute("aria-hidden", "true");
    icon.setAttribute("focusable", "false");
    icon.classList.add("hero-tech-icon");
    icon.innerHTML = paths;
    iconShell.append(icon);

    const textWrap = document.createElement("span");
    textWrap.className = "hero-tech-copy";

    const mainText = document.createElement("strong");
    mainText.textContent = title;

    const subText = document.createElement("small");
    subText.textContent = subtitle;

    textWrap.append(mainText, subText);
    item.append(iconShell, textWrap);
    rail.append(item);
    bindPressLifecycle(item);
  });

  panel.append(kicker, rail);
  actions.before(panel);

  copy.querySelectorAll(".hero-v33-actions .button, .hero-v33-links a").forEach(bindPressLifecycle);

  const currentOutput = document.querySelector("#hero-v33-terminal-text");
  if (currentOutput) {
    const output = currentOutput.cloneNode(false);
    output.textContent = "";
    output.setAttribute("aria-live", "polite");
    output.setAttribute("aria-atomic", "true");
    output.dataset.terminalV86Ready = "true";
    currentOutput.replaceWith(output);

    const terminalLine = output.closest(".terminal-v33-line");
    const phrases = [
      'current_focus = "Python Foundations"',
      "practice_mode = True",
      'next_layer = "Data Analysis"',
      "projects_built += 1",
      'direction = "AI Engineering"'
    ];

    const setTerminalPhase = (phase) => {
      terminalLine?.classList.toggle("is-holding", phase === "holding");
      terminalLine?.classList.toggle("is-writing", phase === "typing");
      terminalLine?.classList.toggle("is-deleting", phase === "deleting");
    };

    const setVisibleCharacters = (value) => {
      output.style.setProperty("--terminal-visible-chars", Math.max(0, value).toFixed(3));
    };

    if (reducedMotion.matches) {
      output.textContent = phrases[0];
      setVisibleCharacters(phrases[0].length);
      setTerminalPhase("holding");
    } else {
      let phraseIndex = 0;
      let phase = "typing";
      let phaseStart = performance.now();
      let frame = 0;
      let pausedAt = 0;

      const timings = () => compactViewport.matches
        ? { typingPerChar: 74, deletingPerChar: 42, holding: 2200, gap: 560 }
        : { typingPerChar: 58, deletingPerChar: 34, holding: 1950, gap: 460 };

      const easeInOutSine = (progress) => -(Math.cos(Math.PI * progress) - 1) / 2;

      const preparePhrase = () => {
        const phrase = phrases[phraseIndex];
        output.textContent = phrase;
        output.setAttribute("aria-label", phrase);
        setVisibleCharacters(phase === "deleting" ? phrase.length : 0);
      };

      const nextPhase = (next, now) => {
        phase = next;
        phaseStart = now;
        setTerminalPhase(next);
      };

      const tick = (now) => {
        const phrase = phrases[phraseIndex];
        const speed = timings();
        const elapsed = Math.max(0, now - phaseStart);

        if (phase === "typing") {
          const duration = Math.max(1, phrase.length * speed.typingPerChar);
          const progress = Math.min(1, elapsed / duration);
          setVisibleCharacters(phrase.length * easeInOutSine(progress));

          if (progress >= 1) {
            setVisibleCharacters(phrase.length);
            nextPhase("holding", now);
          }
        } else if (phase === "holding") {
          setVisibleCharacters(phrase.length);
          if (elapsed >= speed.holding) nextPhase("deleting", now);
        } else if (phase === "deleting") {
          const duration = Math.max(1, phrase.length * speed.deletingPerChar);
          const progress = Math.min(1, elapsed / duration);
          setVisibleCharacters(phrase.length * (1 - easeInOutSine(progress)));

          if (progress >= 1) {
            setVisibleCharacters(0);
            phraseIndex = (phraseIndex + 1) % phrases.length;
            phase = "gap";
            phaseStart = now;
            setTerminalPhase("typing");
          }
        } else if (elapsed >= speed.gap) {
          phase = "typing";
          phaseStart = now;
          preparePhrase();
          setTerminalPhase("typing");
        }

        frame = window.requestAnimationFrame(tick);
      };

      preparePhrase();
      setTerminalPhase("typing");
      frame = window.requestAnimationFrame(tick);

      document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
          pausedAt = performance.now();
          window.cancelAnimationFrame(frame);
          return;
        }

        const now = performance.now();
        if (pausedAt) phaseStart += now - pausedAt;
        pausedAt = 0;
        frame = window.requestAnimationFrame(tick);
      });
    }
  }

  window.addEventListener("blur", () => {
    home.querySelectorAll(".is-pressing").forEach((element) => {
      element.classList.remove("is-pressing");
      element.classList.add("is-releasing");
      window.setTimeout(() => element.classList.remove("is-releasing"), 320);
    });
  });
})();
