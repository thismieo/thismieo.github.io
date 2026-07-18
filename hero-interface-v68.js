(() => {
  "use strict";

  document.documentElement.dataset.release = "2026.07.18.69";

  const home = document.querySelector("#home");
  const copy = home?.querySelector(".hero-v33-copy");
  const heading = copy?.querySelector("h1");
  const summary = copy?.querySelector(".hero-v33-summary");
  const actions = copy?.querySelector(".hero-v33-actions");

  if (!home || !copy || !heading || !summary || !actions) return;
  if (home.dataset.heroV68Ready === "true") return;

  home.dataset.heroV68Ready = "true";
  home.classList.add("is-hero-v68", "is-tech-icons-v69");

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
    Python: '<rect x="3.5" y="5" width="17" height="14" rx="3"/><path d="m9 9-3 3 3 3M15 9l3 3-3 3"/>',
    Data: '<ellipse cx="12" cy="6" rx="7.5" ry="3"/><path d="M4.5 6v6c0 1.65 3.36 3 7.5 3s7.5-1.35 7.5-3V6M4.5 12v6c0 1.65 3.36 3 7.5 3s7.5-1.35 7.5-3v-6"/>',
    "Machine Learning": '<circle cx="6" cy="7" r="2.2"/><circle cx="18" cy="6" r="2.2"/><circle cx="12" cy="18" r="2.2"/><path d="m8 7 7.8-.7M7.3 8.8l3.5 7.2M16.7 7.8l-3.5 8.1"/>',
    "AI Systems": '<circle cx="12" cy="12" r="3.1"/><circle cx="12" cy="12" r="8"/><path d="M12 1.8v3M12 19.2v3M1.8 12h3M19.2 12h3M4.8 4.8l2.1 2.1M17.1 17.1l2.1 2.1M19.2 4.8l-2.1 2.1M6.9 17.1l-2.1 2.1"/>'
  };

  const existingStrip = copy.querySelector(".hero-v68-tech-strip");
  if (existingStrip) existingStrip.remove();

  const strip = document.createElement("div");
  strip.className = "hero-v68-tech-strip hero-v69-tech-strip";
  strip.setAttribute("aria-label", "Current technical learning path");
  strip.setAttribute("role", "list");

  ["Python", "Data", "Machine Learning", "AI Systems"].forEach((label, index) => {
    const item = document.createElement("span");
    item.className = "hero-v69-tech-item";
    item.setAttribute("role", "listitem");
    item.style.setProperty("--hero-v68-order", String(index));
    item.style.setProperty("--hero-v69-order", String(index));

    const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    icon.setAttribute("viewBox", "0 0 24 24");
    icon.setAttribute("aria-hidden", "true");
    icon.setAttribute("focusable", "false");
    icon.classList.add("hero-v69-tech-icon");
    icon.innerHTML = iconPaths[label];

    const text = document.createElement("b");
    text.textContent = label;

    item.append(icon, text);
    strip.append(item);
  });

  actions.before(strip);
})();