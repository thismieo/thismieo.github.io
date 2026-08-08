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
    ".knowledge-card",
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

  /* These are the exact surfaces owned by the historical pointer-down engine
     in script.js. Blocking pointerdown only here leaves every other native
     control and the horizontal selector rail completely untouched. */
  const legacyPointerSelector = [
    ".facts > div",
    ".timeline-item",
    ".project-card",
    ".workshop-entry",
    ".workshop-card",
    ".current-track-card",
    ".contact-card",
    ".workshop-entry-action",
    ".workshop-back",
    ".workshop-closing .button",
    ".contact-card-action",
    ".contact-link-action",
    ".section-stepper",
  ].join(", ");

  const tactileOnlySelector = directControlSelector;

  const resolveSurface = (target) => {
    if (!(target instanceof Element)) return null;

    /* Featured Practice / Learning Archive deliberately animate the whole card
       only when their arrow/action button is activated. */
    const practiceAction = target.closest("[data-practice-group]");
    if (practiceAction) return practiceAction.closest("[data-practice-card]");

    const directControl = target.closest(directControlSelector);
    if (directControl) return directControl;

    const card = target.closest(cardSelector);
    if (!card) return null;

    /* A nested interactive control owns its own feedback. Never pulse the
       surrounding card as a side effect of clicking a child button/link. */
    const nestedInteractive = target.closest("button, a, input, select, textarea");
    if (nestedInteractive && card.contains(nestedInteractive)) return null;

    return card;
  };

  const isTactileOnly = (surface) => surface.matches(tactileOnlySelector);

  const ensureLayer = (surface) => {
    const tactileOnly = isTactileOnly(surface);
    surface.classList.add("press-fx-surface");
    surface.classList.toggle("press-fx-tactile-only", tactileOnly);

    if (tactileOnly) return null;

    surface.classList.add("press-fx-layered");
    if (window.getComputedStyle(surface).position === "static") {
      surface.classList.add("press-fx-positioned");
    }

    let layer = [...surface.children].find((child) => child.classList?.contains("press-fx-layer"));
    if (layer) return layer;

    layer = document.createElement("span");
    layer.className = "press-fx-layer";
    layer.setAttribute("aria-hidden", "true");

    const sheen = document.createElement("span");
    sheen.className = "press-fx-sheen";
    layer.appendChild(sheen);
    surface.appendChild(layer);
    return layer;
  };

  const pulse = (surface) => {
    if (!surface || !surface.isConnected) return;
    ensureLayer(surface);

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

  /* The historical pointer engine lives in older production files. Stop only
     its pointer-down phase on the surfaces it actually owns. We never prevent
     default behavior, so click activation, focus, scrolling and accessibility
     remain native. */
  document.addEventListener("pointerdown", (event) => {
    const surface = resolveSurface(event.target);
    if (!surface || !surface.matches(legacyPointerSelector)) return;
    event.stopPropagation();
  }, { capture: true, passive: true });

  /* Click is the single confirmation signal for mouse, touch, pen and keyboard.
     Capture phase lets Featured/Archive still reach us even though their own
     handler later stops bubbling. */
  document.addEventListener("click", (event) => {
    if (event.defaultPrevented) return;
    if (event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const surface = resolveSurface(event.target);
    if (!surface) return;
    pulse(surface);
  }, { capture: true });

  window.addEventListener("pagehide", () => {
    document.querySelectorAll(".is-press-fx").forEach((surface) => surface.classList.remove("is-press-fx"));
  });
})();
