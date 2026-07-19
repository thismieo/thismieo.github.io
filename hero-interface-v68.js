(() => {
  "use strict";

  // Stable semantic classes keep legacy hero chip styling isolated from this component.
  document.documentElement.dataset.release = "2026.07.19.83";

  const home = document.querySelector("#home");
  const copy = home?.querySelector(".hero-v33-copy");
  const heading = copy?.querySelector("h1");
  const summary = copy?.querySelector(".hero-v33-summary");
  const actions = copy?.querySelector(".hero-v33-actions");

  if (!home || !copy || !heading || !summary || !actions) return;
  if (home.dataset.heroV68Ready === "true") return;

  home.dataset.heroV68Ready = "true";
  home.classList.add("is-hero-v68", "has-tech-rail");

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
      title: "Python",
      subtitle: "Foundations",
      href: "https://docs.python.org/3/tutorial/",
      paths: '<path d="M8.1 4.7h5.1a3.1 3.1 0 0 1 3.1 3.1v2.35H10a3 3 0 0 0-3 3v1.15H5.2a2.5 2.5 0 0 1-2.5-2.5V7.2a2.5 2.5 0 0 1 2.5-2.5h2.9Z"/><path d="M15.9 19.3h-5.1a3.1 3.1 0 0 1-3.1-3.1v-2.35H14a3 3 0 0 0 3-3V9.7h1.8a2.5 2.5 0 0 1 2.5 2.5v4.6a2.5 2.5 0 0 1-2.5 2.5h-2.9Z"/><circle cx="7.1" cy="7.35" r=".7"/><circle cx="16.9" cy="16.65" r=".7"/>'
    },
    {
      title: "Data",
      subtitle: "Foundations",
      href: "https://developers.google.com/machine-learning/crash-course/overfitting/data-characteristics?hl=ar",
      paths: '<ellipse cx="12" cy="5.8" rx="7.15" ry="2.55"/><path d="M4.85 5.8v6.1c0 1.42 3.2 2.55 7.15 2.55s7.15-1.13 7.15-2.55V5.8"/><path d="M4.85 11.9V18c0 1.42 3.2 2.55 7.15 2.55s7.15-1.13 7.15-2.55v-6.1"/><path d="M8.1 8.1c1.05.28 2.38.44 3.9.44s2.85-.16 3.9-.44"/>'
    },
    {
      title: "Machine",
      subtitle: "Learning",
      href: "https://developers.google.com/machine-learning/",
      paths: '<circle cx="5.9" cy="7.1" r="2"/><circle cx="18.1" cy="6.2" r="2"/><circle cx="12" cy="18" r="2"/><path d="m7.9 6.95 8.2-.6M7.05 8.9l3.8 7.25M16.95 8.05l-3.8 8.1"/><circle cx="12" cy="11.55" r="1.25"/><path d="m7.7 8.3 3.2 2.55M16.35 7.75l-3.2 2.7M12 12.8V16"/>'
    },
    {
      title: "AI",
      subtitle: "Systems",
      href: "https://learn.microsoft.com/ar-sa/training/paths/ai-concepts/",
      paths: '<rect x="6.35" y="6.35" width="11.3" height="11.3" rx="2.55"/><path d="M9 3v3.35M15 3v3.35M9 17.65V21M15 17.65V21M3 9h3.35M3 15h3.35M17.65 9H21M17.65 15H21"/><path d="M9.25 12h5.5M12 9.25v5.5"/><circle cx="12" cy="12" r="3.1"/>'
    }
  ];

  const existingRail = copy.querySelector(".hero-tech-rail");
  if (existingRail) existingRail.remove();

  const rail = document.createElement("div");
  rail.className = "hero-tech-rail";
  rail.dataset.techIcons = "v83";
  rail.dataset.presentation = "compact-terminal-rail";
  rail.dataset.wave = "continuous";
  rail.setAttribute("aria-label", "Official learning resources for the current technical path");
  rail.setAttribute("role", "list");

  techResources.forEach(({ title, subtitle, href, paths }) => {
    const item = document.createElement("a");
    item.className = "hero-tech-item";
    item.href = href;
    item.target = "_blank";
    item.rel = "noopener noreferrer";
    item.setAttribute("role", "listitem");
    item.setAttribute("aria-label", `Open the official ${title} ${subtitle} resource in a new tab`);
    item.title = `${title} ${subtitle}`;

    const beginPress = (event) => {
      item.classList.add("is-pressing");
      if (event.pointerId !== undefined && item.setPointerCapture) {
        try {
          item.setPointerCapture(event.pointerId);
        } catch {
          // Pointer capture is an enhancement; native link behavior remains intact.
        }
      }
    };

    const endPress = () => {
      item.classList.remove("is-pressing");
    };

    item.addEventListener("pointerdown", beginPress);
    item.addEventListener("pointerup", endPress);
    item.addEventListener("pointercancel", endPress);
    item.addEventListener("lostpointercapture", endPress);
    item.addEventListener("dragstart", endPress);
    item.addEventListener("blur", endPress);

    const iconShell = document.createElement("span");
    iconShell.className = "hero-tech-icon-shell";
    iconShell.setAttribute("aria-hidden", "true");

    const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    icon.setAttribute("viewBox", "0 0 24 24");
    icon.setAttribute("aria-hidden", "true");
    icon.setAttribute("focusable", "false");
    icon.classList.add("hero-tech-icon");
    icon.innerHTML = paths;
    iconShell.append(icon);

    const textWrap = document.createElement("span");
    textWrap.className = "hero-tech-copy";

    const mainText = document.createElement("strong");
    mainText.textContent = title;

    const subText = document.createElement("small");
    subText.textContent = subtitle;

    textWrap.append(mainText, subText);
    item.append(iconShell, textWrap);
    rail.append(item);
  });

  window.addEventListener("blur", () => {
    rail.querySelectorAll(".is-pressing").forEach((item) => item.classList.remove("is-pressing"));
  });

  actions.before(rail);
})();