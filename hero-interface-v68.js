(() => {
  "use strict";

  document.documentElement.dataset.release = "2026.07.19.71";

  const home = document.querySelector("#home");
  const copy = home?.querySelector(".hero-v33-copy");
  const heading = copy?.querySelector("h1");
  const summary = copy?.querySelector(".hero-v33-summary");
  const actions = copy?.querySelector(".hero-v33-actions");

  if (!home || !copy || !heading || !summary || !actions) return;
  if (home.dataset.heroV68Ready === "true") return;

  home.dataset.heroV68Ready = "true";
  home.classList.add("is-hero-v68", "is-tech-icons-v71");

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
    Python: '<rect x="3.5" y="4.5" width="17" height="15" rx="3.2"/><path d="M6.8 8.2h10.4M8.8 11l-2.2 2 2.2 2M15.2 11l2.2 2-2.2 2M11 16.9h2"/>',
    Data: '<ellipse cx="12" cy="5.8" rx="7.3" ry="2.7"/><path d="M4.7 5.8v6.1c0 1.5 3.27 2.7 7.3 2.7s7.3-1.2 7.3-2.7V5.8M4.7 11.9V18c0 1.5 3.27 2.7 7.3 2.7s7.3-1.2 7.3-2.7v-6.1"/>',
    "Machine Learning": '<circle cx="6" cy="7" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="12" cy="18" r="2"/><path d="m8 6.9 8-.7M7.1 8.8l3.7 7.2M16.9 7.8l-3.7 8.2"/>',
    "AI Systems": '<rect x="6.4" y="6.4" width="11.2" height="11.2" rx="2.8"/><circle cx="12" cy="12" r="2.25"/><path d="M9 2.7v3.7M15 2.7v3.7M9 17.6v3.7M15 17.6v3.7M2.7 9h3.7M2.7 15h3.7M17.6 9h3.7M17.6 15h3.7"/>'
  };
  const technicalStages = Object.keys(iconPaths);

  const existingStrip = copy.querySelector(".hero-v68-tech-strip");
  if (existingStrip) existingStrip.remove();

  const strip = document.createElement("div");
  strip.className = "hero-v68-tech-strip hero-v71-tech-strip";
  strip.dataset.techIcons = "v71";
  strip.setAttribute("aria-label", "Current technical learning path");
  strip.setAttribute("role", "list");

  technicalStages.forEach((label, index) => {
    const item = document.createElement("span");
    item.className = "hero-v71-tech-item";
    item.setAttribute("role", "listitem");
    item.style.setProperty("--hero-v68-order", String(index));
    item.style.setProperty("--hero-v71-order", String(index));

    const iconFrame = document.createElement("span");
    iconFrame.className = "hero-v71-icon-frame";
    iconFrame.setAttribute("aria-hidden", "true");

    const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    icon.setAttribute("viewBox", "0 0 24 24");
    icon.setAttribute("aria-hidden", "true");
    icon.setAttribute("focusable", "false");
    icon.classList.add("hero-v71-tech-icon");
    icon.innerHTML = iconPaths[label];

    const text = document.createElement("b");
    text.textContent = label;

    iconFrame.append(icon);
    item.append(iconFrame, text);
    strip.append(item);
  });

  actions.before(strip);
})();