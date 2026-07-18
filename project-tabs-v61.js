(() => {
  "use strict";

  document.documentElement.dataset.release = "2026.07.18.61";

  const section = document.querySelector("#projects");
  const grid = section?.querySelector(".projects-grid");
  const cards = grid ? [...grid.querySelectorAll(":scope > .project-card")] : [];

  if (!section || !grid || cards.length !== 3 || section.dataset.projectTabsV61Ready === "true") return;
  section.dataset.projectTabsV61Ready = "true";

  const mobileQuery = window.matchMedia("(max-width: 720px)");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const projects = [
    {
      kind: "health",
      label: "Health",
      icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 4.7a5.5 5.5 0 0 0-7.8 0L12 5.8l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.5a5.5 5.5 0 0 0 0-7.8Z"/><path d="M6.5 12h3l1.4-3 2.1 6 1.4-3H18"/></svg>'
    },
    {
      kind: "fraud",
      label: "Fraud",
      icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="2.5"/><circle cx="12" cy="12" r="6.5"/><path d="M12 2v3M22 12h-3M12 22v-3M2 12h3"/><path d="m16.5 7.5 3-3"/></svg>'
    },
    {
      kind: "traffic",
      label: "Traffic",
      icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 17c4-7 7-7 11-2s6 4 7-2"/><path d="M3 12c4-7 7-7 11-2s6 4 7-2"/><circle cx="6" cy="11" r="1"/><circle cx="17" cy="15" r="1"/></svg>'
    }
  ];

  const switcher = document.createElement("div");
  switcher.className = "project-switcher-v61";
  switcher.setAttribute("role", "tablist");
  switcher.setAttribute("aria-label", "Choose a project");

  const buttons = projects.map((project, index) => {
    const card = cards[index];
    const cardId = card.id || `project-panel-v61-${index + 1}`;
    const buttonId = `project-tab-v61-${index + 1}`;

    card.id = cardId;
    card.setAttribute("role", "tabpanel");
    card.setAttribute("aria-labelledby", buttonId);

    const button = document.createElement("button");
    button.type = "button";
    button.id = buttonId;
    button.className = "project-tab-v61";
    button.dataset.projectKind = project.kind;
    button.setAttribute("role", "tab");
    button.setAttribute("aria-controls", cardId);
    button.setAttribute("aria-label", `Show ${project.label} project`);
    button.innerHTML = `
      <span class="project-tab-v61-index">0${index + 1}</span>
      <span class="project-tab-v61-icon">${project.icon}</span>
      <span class="project-tab-v61-label">${project.label}</span>
    `;

    switcher.append(button);
    return button;
  });

  grid.before(switcher);

  let activeIndex = 0;

  const setSvgMotion = (card, shouldRun) => {
    const svg = card.querySelector(".project-v54-svg");
    if (!svg) return;

    try {
      if (shouldRun && !reducedMotion.matches && typeof svg.unpauseAnimations === "function") {
        svg.unpauseAnimations();
      } else if (typeof svg.pauseAnimations === "function") {
        svg.pauseAnimations();
      }
    } catch {
      /* The visual remains usable if a browser restricts SVG animation controls. */
    }
  };

  const syncMotion = () => {
    const mobile = mobileQuery.matches;
    cards.forEach((card, index) => setSvgMotion(card, !mobile || index === activeIndex));
  };

  const render = ({ focus = false } = {}) => {
    const mobile = mobileQuery.matches;
    section.classList.toggle("is-project-tabs-v61", mobile);

    cards.forEach((card, index) => {
      const active = index === activeIndex;
      card.classList.toggle("is-project-v61-active", mobile && active);

      if (mobile) {
        card.setAttribute("aria-hidden", active ? "false" : "true");
        card.inert = !active;
      } else {
        card.removeAttribute("aria-hidden");
        card.inert = false;
      }
    });

    buttons.forEach((button, index) => {
      const active = index === activeIndex;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-selected", active ? "true" : "false");
      button.tabIndex = active ? 0 : -1;
    });

    syncMotion();
    if (focus) buttons[activeIndex]?.focus({ preventScroll: true });
  };

  const selectProject = (index, options = {}) => {
    if (!Number.isInteger(index) || index < 0 || index >= cards.length) return;
    activeIndex = index;
    render(options);
  };

  buttons.forEach((button, index) => {
    button.addEventListener("click", () => selectProject(index));
    button.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();

      if (event.key === "Home") selectProject(0, { focus: true });
      else if (event.key === "End") selectProject(cards.length - 1, { focus: true });
      else {
        const direction = event.key === "ArrowRight" ? 1 : -1;
        selectProject((index + direction + cards.length) % cards.length, { focus: true });
      }
    });
  });

  const handleViewportChange = () => render();
  if (typeof mobileQuery.addEventListener === "function") mobileQuery.addEventListener("change", handleViewportChange);
  else mobileQuery.addListener(handleViewportChange);

  const sectionObserver = new MutationObserver(() => window.requestAnimationFrame(syncMotion));
  sectionObserver.observe(section, { attributes: true, attributeFilter: ["class"] });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) cards.forEach((card) => setSvgMotion(card, false));
    else syncMotion();
  });

  render();
})();