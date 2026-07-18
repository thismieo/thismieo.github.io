(() => {
  "use strict";

  document.documentElement.dataset.release = "2026.07.19.70";

  const home = document.querySelector("#home");
  const copy = home?.querySelector(".hero-v33-copy");
  const heading = copy?.querySelector("h1");
  const summary = copy?.querySelector(".hero-v33-summary");
  const actions = copy?.querySelector(".hero-v33-actions");

  if (!home || !copy || !heading || !summary || !actions) return;
  if (home.dataset.heroV68Ready === "true") return;

  home.dataset.heroV68Ready = "true";
  home.classList.add("is-hero-v68", "is-tech-icons-v70");

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
    Python: '<rect x="3.5" y="4.5" width="17" height="15" rx="3.2"/><path d="m8.5 9-2.5 3 2.5 3M15.5 9l2.5 3-2.5 3M10.6 16h2.8"/>',
    Data: '<ellipse cx="12" cy="5.8" rx="7.4" ry="2.8"/><path d="M4.6 5.8v6.1c0 1.55 3.3 2.8 7.4 2.8s7.4-1.25 7.4-2.8V5.8M4.6 11.9V18c0 1.55 3.3 2.8 7.4 2.8s7.4-1.25 7.4-2.8v-6.1"/>',
    "Machine Learning": '<circle cx="6" cy="7" r="2.15"/><circle cx="18" cy="6" r="2.15"/><circle cx="12" cy="18" r="2.15"/><path d="m8.1 6.9 7.7-.7M7.2 8.8l3.6 7.2M16.8 7.8l-3.6 8.2"/>',
    "AI Systems": '<rect x="6.5" y="6.5" width="11" height="11" rx="2.7"/><circle cx="12" cy="12" r="2.35"/><path d="M9 2.5v4M15 2.5v4M9 17.5v4M15 17.5v4M2.5 9h4M2.5 15h4M17.5 9h4M17.5 15h4"/>'
  };

  const existingStrip = copy.querySelector(".hero-v68-tech-strip");
  if (existingStrip) existingStrip.remove();

  const strip = document.createElement("div");
  strip.className = "hero-v68-tech-strip hero-v70-tech-strip";
  strip.setAttribute("aria-label", "Current technical learning path");
  strip.setAttribute("role", "list");

  ["Python", "Data", "Machine Learning", "AI Systems"].forEach((label, index) => {
    const item = document.createElement("span");
    item.className = "hero-v70-tech-item";
    item.setAttribute("role", "listitem");
    item.style.setProperty("--hero-v68-order", String(index));
    item.style.setProperty("--hero-v70-order", String(index));

    const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    icon.setAttribute("viewBox", "0 0 24 24");
    icon.setAttribute("aria-hidden", "true");
    icon.setAttribute("focusable", "false");
    icon.classList.add("hero-v70-tech-icon");
    icon.innerHTML = iconPaths[label];

    const text = document.createElement("b");
    text.textContent = label;

    item.append(icon, text);
    strip.append(item);
  });

  actions.before(strip);
})();