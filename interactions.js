(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const timers = new WeakMap();

  const cardSelector = [
    ".facts > div",
    ".timeline-item",
    ".project-card",
    ".workshop-entry",
    ".current-track-card",
    ".practice-milestone",
    ".knowledge-card",
    ".workshop-card",
    ".contact-card",
  ].join(", ");

  const directControlSelector = [
    ".hero-cta",
    ".workshop-entry-action",
    ".workshop-back",
    ".workshop-closing .button",
    ".contact-card-action",
    ".section-stepper",
    ".practice-selector-card",
    ".practice-collection-close",
    ".practice-copy-button",
  ].join(", ");

  const resolveSurface = (target) => {
    if (!(target instanceof Element)) return null;

    const practiceAction = target.closest("[data-practice-group]");
    if (practiceAction) return practiceAction.closest("[data-practice-card]");

    // Contact actions keep their Copy/Visit behavior while the parent card
    // owns the shared sheen, so mobile feedback remains visually consistent.
    const contactAction = target.closest(".contact-card-action");
    if (contactAction) return contactAction.closest(".contact-card");

    const directControl = target.closest(directControlSelector);
    if (directControl) return directControl;

    const card = target.closest(cardSelector);
    if (!card) return null;

    const nestedInteractive = target.closest("button, a, input, select, textarea");
    if (nestedInteractive && card.contains(nestedInteractive)) return null;
    return card;
  };

  const isTactileOnly = (surface) => surface.matches(directControlSelector);

  const insertFeedbackLayer = (surface, layer) => {
    // Keep the authored first and last children intact. Some card layouts use
    // structural selectors such as :last-child, so the visual feedback layer
    // must never become the first or last semantic child of those components.
    const anchor = surface.children.length > 1 ? surface.children[1] : null;
    if (anchor) surface.insertBefore(layer, anchor);
    else surface.appendChild(layer);
  };

  const prepareSurface = (surface) => {
    const tactileOnly = isTactileOnly(surface);
    surface.classList.add("press-fx-surface");
    surface.classList.toggle("press-fx-tactile-only", tactileOnly);
    if (tactileOnly) return;

    surface.classList.add("press-fx-layered");
    if (window.getComputedStyle(surface).position === "static") surface.classList.add("press-fx-positioned");
    if ([...surface.children].some((child) => child.classList?.contains("press-fx-layer"))) return;

    const layer = document.createElement("span");
    layer.className = "press-fx-layer";
    layer.setAttribute("aria-hidden", "true");

    const sheen = document.createElement("span");
    sheen.className = "press-fx-sheen";
    layer.appendChild(sheen);
    insertFeedbackLayer(surface, layer);
  };

  // The script is deferred, so the static portfolio/workshop card tree is ready here.
  // Prebuilding the inert feedback layers keeps the first real phone tap from
  // combining DOM insertion, layout, compositor setup and animation in one frame.
  document.querySelectorAll(cardSelector).forEach(prepareSurface);

  const pulse = (surface) => {
    if (!surface?.isConnected) return;
    prepareSurface(surface);

    const previousTimer = timers.get(surface);
    if (previousTimer) window.clearTimeout(previousTimer);

    surface.classList.remove("is-press-fx");
    void surface.offsetWidth;
    surface.classList.add("is-press-fx");

    const timer = window.setTimeout(() => {
      surface.classList.remove("is-press-fx");
      timers.delete(surface);
    }, reduceMotion ? 80 : 560);
    timers.set(surface, timer);
  };

  document.addEventListener("click", (event) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const surface = resolveSurface(event.target);
    if (surface) pulse(surface);
  }, { capture: true });

  const clearActiveFeedback = () => {
    document.querySelectorAll(".is-press-fx").forEach((surface) => surface.classList.remove("is-press-fx"));
  };

  window.addEventListener("pagehide", clearActiveFeedback);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) clearActiveFeedback();
  });
})();
