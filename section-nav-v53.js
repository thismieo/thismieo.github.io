(() => {
  "use strict";

  document.documentElement.dataset.release = "2026.07.18.53";
  if (document.documentElement.dataset.sectionNavV53Ready === "true") return;

  const sections = [...document.querySelectorAll("main section[id]")].filter((section) => {
    const style = window.getComputedStyle(section);
    return style.display !== "none" && style.visibility !== "hidden";
  });

  if (sections.length < 2) return;
  document.documentElement.dataset.sectionNavV53Ready = "true";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const labelMap = {
    home: "Home",
    about: "About",
    journey: "Journey",
    stack: "Stack",
    neural: "Neural",
    projects: "Projects",
    goals: "Goals",
    contact: "Contact"
  };

  const labelFor = (section) => {
    const mapped = labelMap[section.id];
    if (mapped) return mapped;
    const heading = section.querySelector("h2, h1");
    if (heading?.textContent?.trim()) return heading.textContent.trim().replace(/\s+/g, " ");
    return section.id
      .split(/[-_]/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
  };

  const labels = sections.map(labelFor);
  const padIndex = (index) => String(index + 1).padStart(2, "0");
  const icon = (direction) => direction === "up"
    ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 14 6-6 6 6"/></svg>'
    : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 10 6 6 6-6"/></svg>';

  const navigator = document.createElement("nav");
  navigator.className = "section-nav-v53";
  navigator.setAttribute("aria-label", "Section navigation");

  const shell = document.createElement("div");
  shell.className = "section-nav-v53-shell";

  const previousButton = document.createElement("button");
  previousButton.className = "section-nav-v53-button section-nav-v53-previous";
  previousButton.type = "button";
  previousButton.innerHTML = icon("up");

  const currentButton = document.createElement("button");
  currentButton.className = "section-nav-v53-current";
  currentButton.type = "button";
  currentButton.setAttribute("aria-haspopup", "true");
  currentButton.setAttribute("aria-expanded", "false");
  currentButton.setAttribute("aria-controls", "section-nav-v53-menu");

  const currentIndexNode = document.createElement("span");
  currentIndexNode.className = "section-nav-v53-index";

  const currentCopy = document.createElement("span");
  currentCopy.className = "section-nav-v53-copy";
  const currentCaption = document.createElement("small");
  currentCaption.textContent = "Current";
  const currentLabel = document.createElement("strong");
  currentCopy.append(currentCaption, currentLabel);
  currentButton.append(currentIndexNode, currentCopy);

  const nextButton = document.createElement("button");
  nextButton.className = "section-nav-v53-button section-nav-v53-next";
  nextButton.type = "button";
  nextButton.innerHTML = icon("down");

  const menu = document.createElement("div");
  menu.className = "section-nav-v53-menu";
  menu.id = "section-nav-v53-menu";
  menu.setAttribute("aria-label", "Choose a portfolio section");

  const optionButtons = sections.map((section, index) => {
    const option = document.createElement("button");
    option.className = "section-nav-v53-option";
    option.type = "button";
    option.dataset.sectionIndex = String(index);
    option.innerHTML = `<span>${padIndex(index)}</span><span>${labels[index]}</span>`;
    option.setAttribute("aria-label", `Go to ${labels[index]} section`);
    menu.append(option);
    return option;
  });

  shell.append(previousButton, currentButton, nextButton);
  navigator.append(shell, menu);
  document.body.append(navigator);

  let activeIndex = 0;
  let hasRendered = false;
  let scrollFrame = 0;
  let changeTimer = 0;

  const closeMenu = ({ restoreFocus = false } = {}) => {
    if (!navigator.classList.contains("is-open")) return;
    navigator.classList.remove("is-open");
    currentButton.setAttribute("aria-expanded", "false");
    if (restoreFocus) currentButton.focus({ preventScroll: true });
  };

  const openMenu = () => {
    navigator.classList.add("is-open");
    currentButton.setAttribute("aria-expanded", "true");
    optionButtons[activeIndex]?.focus({ preventScroll: true });
  };

  const flashChange = () => {
    window.clearTimeout(changeTimer);
    navigator.classList.remove("is-changing");
    void navigator.offsetWidth;
    navigator.classList.add("is-changing");
    changeTimer = window.setTimeout(() => navigator.classList.remove("is-changing"), 560);
  };

  const updateControls = (nextIndex) => {
    const changed = hasRendered && nextIndex !== activeIndex;
    activeIndex = nextIndex;
    hasRendered = true;

    const currentSection = sections[activeIndex];
    const currentName = labels[activeIndex];
    const previousName = labels[activeIndex - 1];
    const nextName = labels[activeIndex + 1];

    currentIndexNode.textContent = padIndex(activeIndex);
    currentLabel.textContent = currentName;
    currentButton.setAttribute("aria-label", `Current section: ${currentName}. Open section menu`);

    previousButton.disabled = activeIndex === 0;
    previousButton.setAttribute("aria-label", previousName ? `Go to previous section: ${previousName}` : "No previous section");
    previousButton.title = previousName ? `Previous · ${previousName}` : "First section";

    nextButton.disabled = activeIndex === sections.length - 1;
    nextButton.setAttribute("aria-label", nextName ? `Go to next section: ${nextName}` : "No next section");
    nextButton.title = nextName ? `Next · ${nextName}` : "Final section";

    optionButtons.forEach((button, index) => {
      if (index === activeIndex) button.setAttribute("aria-current", "true");
      else button.removeAttribute("aria-current");
    });

    const hero = sections[0];
    const heroThreshold = Math.max(180, hero.offsetHeight * 0.64);
    const shouldShow = activeIndex > 0 || window.scrollY > heroThreshold;
    navigator.classList.toggle("is-visible", shouldShow);

    if (!shouldShow) closeMenu();
    if (changed) flashChange();

    navigator.dataset.currentSection = currentSection.id;
  };

  const detectActiveSection = () => {
    scrollFrame = 0;
    const viewportHeight = Math.max(1, document.documentElement.clientHeight || window.innerHeight || 1);
    const anchor = Math.min(viewportHeight - 72, Math.max(92, viewportHeight * 0.42));

    let matchedIndex = -1;
    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    sections.forEach((section, index) => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= anchor && rect.bottom > anchor) matchedIndex = index;

      const centerDistance = Math.abs((rect.top + rect.bottom) / 2 - anchor);
      if (centerDistance < closestDistance) {
        closestDistance = centerDistance;
        closestIndex = index;
      }
    });

    updateControls(matchedIndex >= 0 ? matchedIndex : closestIndex);
  };

  const queueDetection = () => {
    if (scrollFrame) return;
    scrollFrame = window.requestAnimationFrame(detectActiveSection);
  };

  const goToSection = (index) => {
    if (!Number.isInteger(index) || index < 0 || index >= sections.length) return;
    const target = sections[index];
    closeMenu();

    try {
      window.history.replaceState(null, "", `#${target.id}`);
    } catch {
      /* Smooth navigation still works if history state is restricted. */
    }

    target.scrollIntoView({
      behavior: reducedMotion.matches ? "auto" : "smooth",
      block: "start"
    });

    updateControls(index);
    window.setTimeout(queueDetection, reducedMotion.matches ? 0 : 420);
  };

  previousButton.addEventListener("click", () => goToSection(activeIndex - 1));
  nextButton.addEventListener("click", () => goToSection(activeIndex + 1));

  currentButton.addEventListener("click", () => {
    if (navigator.classList.contains("is-open")) closeMenu();
    else openMenu();
  });

  optionButtons.forEach((button) => {
    button.addEventListener("click", () => goToSection(Number(button.dataset.sectionIndex)));
  });

  document.addEventListener("pointerdown", (event) => {
    if (!navigator.classList.contains("is-open")) return;
    if (!navigator.contains(event.target)) closeMenu();
  }, { passive: true });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && navigator.classList.contains("is-open")) {
      event.preventDefault();
      closeMenu({ restoreFocus: true });
      return;
    }

    if (!navigator.classList.contains("is-open")) return;
    const focusedIndex = optionButtons.indexOf(document.activeElement);
    if (focusedIndex < 0) return;

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const direction = event.key === "ArrowDown" ? 1 : -1;
      const nextFocus = (focusedIndex + direction + optionButtons.length) % optionButtons.length;
      optionButtons[nextFocus].focus({ preventScroll: true });
    }

    if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      optionButtons[event.key === "Home" ? 0 : optionButtons.length - 1].focus({ preventScroll: true });
    }
  });

  window.addEventListener("scroll", queueDetection, { passive: true });
  window.addEventListener("resize", queueDetection, { passive: true });
  window.visualViewport?.addEventListener("resize", queueDetection, { passive: true });
  window.addEventListener("orientationchange", () => window.setTimeout(queueDetection, 120), { passive: true });
  window.addEventListener("pageshow", queueDetection);
  window.addEventListener("hashchange", queueDetection);

  const bodyStateObserver = new MutationObserver(() => {
    if (document.body.classList.contains("menu-open") || document.body.classList.contains("portrait-viewer-open")) {
      closeMenu();
    }
  });
  bodyStateObserver.observe(document.body, { attributes: true, attributeFilter: ["class"] });

  detectActiveSection();
})();
