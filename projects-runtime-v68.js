(() => {
  "use strict";

  document.documentElement.dataset.release = "2026.07.18.68";

  const planet = document.querySelector("#home .hero-v33-planet");
  const section = document.querySelector("#projects");
  const grid = section && section.querySelector(".projects-grid");
  const cards = grid ? Array.from(grid.children).filter((node) => node.classList.contains("project-card")) : [];

  if (planet) planet.classList.add("is-v62-core-live");
  if (!section || !grid || cards.length !== 3) return;

  section.classList.add("is-project-stack-v65");
  section.classList.remove("is-project-tabs-v61");

  const oldSwitcher = section.querySelector(".project-switcher-v61");
  if (oldSwitcher) oldSwitcher.remove();

  cards.forEach((card) => {
    card.classList.remove("is-project-v61-active");
    card.removeAttribute("aria-hidden");
    card.removeAttribute("aria-labelledby");
    if (card.getAttribute("role") === "tabpanel") card.removeAttribute("role");
    card.inert = false;
  });
})();