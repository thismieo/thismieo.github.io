(() => {
  "use strict";

  const PROJECT_VISUAL_VERSION = "103";
  document.documentElement.dataset.release = "2026.07.19.103";

  const activeStylesheet = document.querySelector("link[data-core-contact-v63]");
  if (activeStylesheet) activeStylesheet.href = "core-contact-v63.css?v=20260718.68";

  let readoutStylesheet = document.querySelector("link[data-project-readouts-v66]");
  if (!readoutStylesheet) {
    readoutStylesheet = document.createElement("link");
    readoutStylesheet.rel = "stylesheet";
    readoutStylesheet.dataset.projectReadoutsV66 = "true";
    document.head.append(readoutStylesheet);
  }
  readoutStylesheet.href = "project-readouts-v66.css?v=20260719.103";

  const projects = document.querySelector("#projects");
  projects?.classList.add("is-project-stack-v65", "is-project-readouts-v66");

  /* The legacy index cache key may briefly return an older project runtime.
     Load V103 only when needed, then remove the temporary script node. */
  if (projects && projects.dataset.projectVisualVersion !== PROJECT_VISUAL_VERSION) {
    delete projects.dataset.projectVisualsV54Ready;

    document.querySelectorAll("script[data-project-visual-refresh]").forEach((script) => script.remove());

    const refreshScript = document.createElement("script");
    refreshScript.src = "project-visuals-v54.js?v=20260719.103";
    refreshScript.defer = true;
    refreshScript.dataset.projectVisualRefresh = PROJECT_VISUAL_VERSION;
    refreshScript.addEventListener("load", () => refreshScript.remove(), { once: true });
    document.body.append(refreshScript);
  }

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
