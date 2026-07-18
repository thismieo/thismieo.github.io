(() => {
  "use strict";

  document.documentElement.dataset.release = "2026.07.19.72";

  const home = document.querySelector("#home");
  const copy = home?.querySelector(".hero-v33-copy");
  const heading = copy?.querySelector("h1");
  const summary = copy?.querySelector(".hero-v33-summary");
  const actions = copy?.querySelector(".hero-v33-actions");

  if (!home || !copy || !heading || !summary || !actions) return;
  if (home.dataset.heroV68Ready === "true") return;

  home.dataset.heroV68Ready = "true";
  home.classList.add("is-hero-v68", "is-tech-icons-v72");

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

  const iconPaths = {
    Python: '<path d="M7.2 4.8h7.1a2.9 2.9 0 0 1 2.9 2.9v2.6H9.7a2.9 2.9 0 0 0-2.9 2.9v1.1H5.2a2.4 2.4 0 0 1-2.4-2.4V7.2a2.4 2.4 0 0 1 2.4-2.4h2Z"/><path d="M16.8 19.2H9.7a2.9 2.9 0 0 1-2.9-2.9v-2.6h7.5a2.9 2.9 0 0 0 2.9-2.9V9.7h1.6a2.4 2.4 0 0 1 2.4 2.4v4.7a2.4 2.4 0 0 1-2.4 2.4h-2Z"/><circle cx="7.2" cy="7.4" r=".8"/><circle cx="16.8" cy="16.6" r=".8"/>',
    Data: '<ellipse cx="12" cy="5.7" rx="7.2" ry="2.7"/><path d="M4.8 5.7v6.2c0 1.5 3.2 2.7 7.2 2.7s7.2-1.2 7.2-2.7V5.7M4.8 11.9V18c0 1.5 3.2 2.7 7.2 2.7s7.2-1.2 7.2-2.7v-6.1"/>',
    "Machine Learning": '<circle cx="6" cy="7" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="12" cy="18" r="2"/><path d="m8 6.9 8-.7M7.1 8.8l3.7 7.2M16.9 7.8l-3.7 8.2"/>',
    "AI Systems": '<rect x="6.4" y="6.4" width="11.2" height="11.2" rx="2.7"/><circle cx="12" cy="12" r="2.2"/><path d="M9 2.8v3.6M15 2.8v3.6M9 17.6v3.6M15 17.6v3.6M2.8 9h3.6M2.8 15h3.6M17.6 9h3.6M17.6 15h3.6"/>'
  };

  const existingStrip = copy.querySelector(".hero-v68-tech-strip");
  if (existingStrip) existingStrip.remove();

  const strip = document.createElement("div");
  strip.className = "hero-v68-tech-strip hero-v72-tech-strip";
  strip.dataset.techIcons = "v72";
  strip.dataset.presentation = "clean-social-cards";
  strip.setAttribute("aria-label", "Current technical learning path");
  strip.setAttribute("role", "list");

  Object.entries(iconPaths).forEach(([label, paths], index) => {
    const item = document.createElement("div");
    item.className = "hero-v72-tech-item";
    item.setAttribute("role", "listitem");
    item.style.setProperty("--hero-v72-order", String(index));

    const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    icon.setAttribute("viewBox", "0 0 24 24");
    icon.setAttribute("aria-hidden", "true");
    icon.setAttribute("focusable", "false");
    icon.classList.add("hero-v72-tech-icon");
    icon.innerHTML = paths;

    const text = document.createElement("b");
    text.textContent = label;

    item.append(icon, text);
    strip.append(item);
  });

  actions.before(strip);
})();