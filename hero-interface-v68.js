(() => {
  "use strict";

  document.documentElement.dataset.release = "2026.07.19.80";

  const home = document.querySelector("#home");
  const copy = home?.querySelector(".hero-v33-copy");
  const heading = copy?.querySelector("h1");
  const summary = copy?.querySelector(".hero-v33-summary");
  const actions = copy?.querySelector(".hero-v33-actions");

  if (!home || !copy || !heading || !summary || !actions) return;
  if (home.dataset.heroV68Ready === "true") return;

  home.dataset.heroV68Ready = "true";
  home.classList.add("is-hero-v68", "is-tech-icons-v73");

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
      label: "Python",
      href: "https://docs.python.org/3/tutorial/",
      paths: '<path d="M7.1 4.6h7.2a3 3 0 0 1 3 3v2.55H9.75a3 3 0 0 0-3 3v1.2H5.1a2.5 2.5 0 0 1-2.5-2.5V7.1a2.5 2.5 0 0 1 2.5-2.5h2Z"/><path d="M16.9 19.4H9.7a3 3 0 0 1-3-3v-2.55h7.55a3 3 0 0 0 3-3v-1.2h1.65a2.5 2.5 0 0 1 2.5 2.5v4.75a2.5 2.5 0 0 1-2.5 2.5h-2Z"/><circle cx="7.1" cy="7.25" r=".72"/><circle cx="16.9" cy="16.75" r=".72"/>'
    },
    {
      label: "Data",
      href: "https://developers.google.com/machine-learning/crash-course/overfitting/data-characteristics?hl=ar",
      paths: '<ellipse cx="12" cy="5.6" rx="7.35" ry="2.65"/><path d="M4.65 5.6v6.25c0 1.47 3.3 2.65 7.35 2.65s7.35-1.18 7.35-2.65V5.6M4.65 11.85v6.25c0 1.47 3.3 2.65 7.35 2.65s7.35-1.18 7.35-2.65v-6.25"/>'
    },
    {
      label: "Machine Learning",
      href: "https://developers.google.com/machine-learning/",
      paths: '<circle cx="5.7" cy="7" r="2.05"/><circle cx="18.3" cy="6" r="2.05"/><circle cx="12" cy="18.1" r="2.05"/><path d="m7.72 6.84 8.53-.67M6.84 8.84l3.93 7.38M17.12 7.88l-3.9 8.34"/>'
    },
    {
      label: "AI Systems",
      href: "https://learn.microsoft.com/ar-sa/training/paths/ai-concepts/",
      paths: '<rect x="6.25" y="6.25" width="11.5" height="11.5" rx="2.75"/><circle cx="12" cy="12" r="2.25"/><path d="M9 2.65v3.6M15 2.65v3.6M9 17.75v3.6M15 17.75v3.6M2.65 9h3.6M2.65 15h3.6M17.75 9h3.6M17.75 15h3.6"/>'
    }
  ];

  const existingStrip = copy.querySelector(".hero-v68-tech-strip");
  if (existingStrip) existingStrip.remove();

  const strip = document.createElement("div");
  strip.className = "hero-v68-tech-strip hero-v73-tech-strip";
  strip.dataset.techIcons = "v80";
  strip.dataset.presentation = "official-learning-links";
  strip.dataset.wave = "continuous";
  strip.dataset.mobileBalance = "v76";
  strip.setAttribute("aria-label", "Official learning resources for the current technical path");
  strip.setAttribute("role", "list");

  techResources.forEach(({ label, href, paths }, index) => {
    const item = document.createElement("a");
    item.className = "hero-v73-tech-item";
    item.href = href;
    item.target = "_blank";
    item.rel = "noopener noreferrer";
    item.setAttribute("role", "listitem");
    item.setAttribute("aria-label", `Open the official ${label} learning resource in a new tab`);
    item.title = `Official ${label} learning resource`;
    item.style.setProperty("--hero-v73-order", String(index));

    const showTapGlow = () => {
      item.classList.remove("is-activating");
      void item.offsetWidth;
      item.classList.add("is-activating");
      window.setTimeout(() => item.classList.remove("is-activating"), 420);
    };

    item.addEventListener("pointerdown", showTapGlow, { passive: true });

    item.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      showTapGlow();

      const openedWindow = window.open("", "_blank");
      if (openedWindow) {
        openedWindow.opener = null;
        openedWindow.location.href = href;
      } else {
        window.location.assign(href);
      }
    }, true);

    const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    icon.setAttribute("viewBox", "0 0 24 24");
    icon.setAttribute("aria-hidden", "true");
    icon.setAttribute("focusable", "false");
    icon.classList.add("hero-v73-tech-icon");
    icon.innerHTML = paths;

    const text = document.createElement("b");
    text.textContent = label;

    item.append(icon, text);
    strip.append(item);
  });

  actions.before(strip);
})();