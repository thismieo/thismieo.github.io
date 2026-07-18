(() => {
  "use strict";

  document.documentElement.dataset.release = "2026.07.18.62";

  const home = document.querySelector("#home");
  const planet = home?.querySelector(".hero-v33-planet");
  const projectsSection = document.querySelector("#projects");
  const projectsGrid = projectsSection?.querySelector(".projects-grid");
  const projectCards = projectsGrid ? [...projectsGrid.querySelectorAll(":scope > .project-card")] : [];

  if (planet) planet.classList.add("is-v62-core-live");
  if (!projectsSection || !projectsGrid || projectCards.length !== 3) return;
  if (projectsSection.dataset.projectGridV62Ready === "true") return;
  projectsSection.dataset.projectGridV62Ready = "true";

  const mobileQuery = window.matchMedia("(max-width: 720px)");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const svgNodes = projectCards
    .map((card) => card.querySelector(".project-v54-svg"))
    .filter(Boolean);

  let sectionVisible = false;
  let restoreFrame = 0;

  const removeLegacySwitcher = () => {
    projectsSection.querySelector(".project-switcher-v61")?.remove();
  };

  const restoreCards = () => {
    const mobile = mobileQuery.matches;

    removeLegacySwitcher();
    projectsSection.classList.toggle("is-project-grid-v62", mobile);
    projectsSection.classList.remove("is-project-tabs-v61");

    projectCards.forEach((card) => {
      card.classList.remove("is-project-v61-active");
      card.removeAttribute("aria-hidden");
      card.removeAttribute("aria-labelledby");
      if (card.getAttribute("role") === "tabpanel") card.removeAttribute("role");
      card.inert = false;
    });
  };

  const setSvgState = (svg, shouldRun) => {
    try {
      if (shouldRun && typeof svg.unpauseAnimations === "function") svg.unpauseAnimations();
      else if (typeof svg.pauseAnimations === "function") svg.pauseAnimations();
    } catch {
      /* The static scene remains valid when SMIL controls are unavailable. */
    }
  };

  const syncMotion = () => {
    const shouldRun = sectionVisible && !document.hidden && !reducedMotion.matches;
    svgNodes.forEach((svg) => setSvgState(svg, shouldRun));
  };

  const queueRestore = () => {
    if (restoreFrame) return;
    restoreFrame = window.requestAnimationFrame(() => {
      restoreFrame = 0;
      restoreCards();
      syncMotion();
    });
  };

  restoreCards();

  const sectionObserver = new IntersectionObserver((entries) => {
    sectionVisible = entries.some((entry) => entry.isIntersecting && entry.intersectionRatio > 0.04);
    syncMotion();
  }, { threshold: [0, 0.04, 0.18] });
  sectionObserver.observe(projectsSection);

  /* V61 still exists as a compatibility layer. Register after it and restore the
     three-card layout whenever its class observer reacts to section changes. */
  const classObserver = new MutationObserver(queueRestore);
  classObserver.observe(projectsSection, { attributes: true, attributeFilter: ["class"] });

  const handleViewportChange = () => queueRestore();
  if (typeof mobileQuery.addEventListener === "function") mobileQuery.addEventListener("change", handleViewportChange);
  else mobileQuery.addListener(handleViewportChange);

  const handleReducedMotionChange = () => syncMotion();
  if (typeof reducedMotion.addEventListener === "function") reducedMotion.addEventListener("change", handleReducedMotionChange);
  else reducedMotion.addListener(handleReducedMotionChange);

  document.addEventListener("visibilitychange", syncMotion);
  window.addEventListener("pageshow", queueRestore);
})();
