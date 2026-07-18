(() => {
  "use strict";

  document.documentElement.dataset.release = "2026.07.18.66";

  const activeStylesheet = document.querySelector("link[data-core-contact-v63]");
  if (activeStylesheet) activeStylesheet.href = "core-contact-v63.css?v=20260718.66";

  let readoutStylesheet = document.querySelector("link[data-project-readouts-v66]");
  if (!readoutStylesheet) {
    readoutStylesheet = document.createElement("link");
    readoutStylesheet.rel = "stylesheet";
    readoutStylesheet.dataset.projectReadoutsV66 = "true";
    document.head.append(readoutStylesheet);
  }
  readoutStylesheet.href = "project-readouts-v66.css?v=20260718.66";

  const projects = document.querySelector("#projects");
  projects?.classList.add("is-project-stack-v65", "is-project-readouts-v66");

  /* Keep every top-right SVG readout inside its 360-unit viewBox. V65 scaled
     phone scenes to 108%, so Safari cropped the far-right text. */
  const readoutSpecs = [
    [".project-v54-health", "78", "translate(274 12)"],
    [".project-v54-fraud", "84", "translate(266 12)"],
    [".project-v54-traffic", "82", "translate(268 12)"]
  ];

  const applyProjectReadoutSafeArea = () => {
    if (!projects) return true;

    let fixed = 0;
    readoutSpecs.forEach(([sceneSelector, width, transform]) => {
      const chip = projects.querySelector(`${sceneSelector} .project-v54-chip`);
      const group = chip?.parentElement;
      if (!chip || !group) return;

      chip.setAttribute("width", width);
      group.setAttribute("transform", transform);
      fixed += 1;
    });

    return fixed === readoutSpecs.length;
  };

  if (!applyProjectReadoutSafeArea() && projects) {
    const readoutObserver = new MutationObserver(() => {
      if (!applyProjectReadoutSafeArea()) return;
      readoutObserver.disconnect();
    });

    readoutObserver.observe(projects, { childList: true, subtree: true });
    window.setTimeout(() => readoutObserver.disconnect(), 5000);
  }

  /* Remove the personal portrait and its now-unused viewer. The globe, copy,
     terminal, buttons and planetary motion remain untouched. */
  document.querySelectorAll(
    "#home .hero-v33-portrait, #home .hero-mobile-legacy .hero-portrait"
  ).forEach((portrait) => portrait.remove());
  document.querySelector("#portrait-modal")?.remove();

  const contact = document.querySelector("#contact");
  const links = contact?.querySelector(".contact-links");
  if (!contact || !links || contact.dataset.contactV63Ready === "true") return;

  contact.dataset.contactV63Ready = "true";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let sectionVisible = true;
  let observer = null;

  const prepareFiveChannels = () => {
    links.querySelector('[data-platform="x"]')?.remove();

    const channels = [...links.querySelectorAll(".contact-channel-v56")];
    if (!channels.length) return false;

    contact.classList.add("contact-v63-five");
    links.classList.add("contact-links-v63-five");
    links.setAttribute("aria-label", "Official profiles and email channels");

    channels.forEach((channel, index) => {
      channel.style.setProperty("--contact-v63-order", String(index));
    });

    return channels.length === 5;
  };

  const syncMotion = () => {
    contact.classList.toggle(
      "is-contact-v63-live",
      sectionVisible && !document.hidden && !reducedMotion.matches
    );
  };

  const ready = prepareFiveChannels();

  if (!ready) {
    observer = new MutationObserver(() => {
      if (!prepareFiveChannels()) return;
      observer?.disconnect();
      observer = null;
      syncMotion();
    });

    observer.observe(links, { childList: true, subtree: true });
    window.setTimeout(() => {
      observer?.disconnect();
      observer = null;
    }, 5000);
  }

  if ("IntersectionObserver" in window) {
    const visibilityObserver = new IntersectionObserver((entries) => {
      sectionVisible = Boolean(entries[0]?.isIntersecting);
      syncMotion();
    }, {
      root: null,
      rootMargin: "140px 0px",
      threshold: 0.04
    });

    visibilityObserver.observe(contact);
  }

  document.addEventListener("visibilitychange", syncMotion);

  const handleMotionPreference = () => syncMotion();
  if (typeof reducedMotion.addEventListener === "function") {
    reducedMotion.addEventListener("change", handleMotionPreference);
  } else if (typeof reducedMotion.addListener === "function") {
    reducedMotion.addListener(handleMotionPreference);
  }

  window.requestAnimationFrame(syncMotion);
})();
