(() => {
  "use strict";

  document.documentElement.dataset.release = "2026.07.18.68";

  const home = document.querySelector("#home");
  const copy = home?.querySelector(".hero-v33-copy");
  const heading = copy?.querySelector("h1");
  const summary = copy?.querySelector(".hero-v33-summary");
  const actions = copy?.querySelector(".hero-v33-actions");

  if (!home || !copy || !heading || !summary || !actions) return;
  if (home.dataset.heroV68Ready === "true") return;

  home.dataset.heroV68Ready = "true";
  home.classList.add("is-hero-v68");

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

  const existingStrip = copy.querySelector(".hero-v68-tech-strip");
  if (!existingStrip) {
    const strip = document.createElement("div");
    strip.className = "hero-v68-tech-strip";
    strip.setAttribute("aria-label", "Current technical learning path");

    ["Python", "Data", "Machine Learning", "AI Systems"].forEach((label, index) => {
      const item = document.createElement("span");
      item.textContent = label;
      item.style.setProperty("--hero-v68-order", String(index));
      strip.append(item);
    });

    actions.before(strip);
  }
})();