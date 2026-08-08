(() => {
  "use strict";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const timers = new WeakMap();
  const iosMatch = navigator.userAgent.match(/(?:iPhone|iPad|iPod).*OS\s(\d+)[_\.]/i);
  const legacyWebKit = Boolean(iosMatch && Number(iosMatch[1]) <= 16);
  document.documentElement.classList.toggle("press-fx-legacy-webkit", legacyWebKit);
  const cardSelector = [".facts > div", ".timeline-item", ".project-card", ".workshop-entry", ".current-track-card", ".practice-milestone", ".practice-selector-card", ".knowledge-card", ".workshop-card", ".contact-card"].join(", ");
  const directControlSelector = [".hero-cta", ".workshop-entry-action", ".workshop-back", ".workshop-closing .button", ".contact-card-action", ".section-stepper", ".practice-collection-close", ".practice-copy-button"].join(", ");
  const resolveSurface = (target) => {
    if (!(target instanceof Element)) return null;
    const practiceAction = target.closest("[data-practice-group]");
    if (practiceAction) return practiceAction.closest("[data-practice-card]");
    const contactAction = target.closest(".contact-card-action");
    if (contactAction) return contactAction.closest(".contact-card");
    const workshopEntryAction = target.closest(".workshop-entry-action");
    if (workshopEntryAction) return workshopEntryAction.closest(".workshop-entry");
    const directControl = target.closest(directControlSelector);
    if (directControl) return directControl;
    const card = target.closest(cardSelector);
    if (!card) return null;
    const nestedInteractive = target.closest("button, a, input, select, textarea");
    if (nestedInteractive && card.contains(nestedInteractive)) return null;
    return card;
  };
  const isTactileOnly = (surface) => surface.matches(directControlSelector);
  const insertFeedbackLayer = (surface, layer) => { const anchor = surface.children.length > 1 ? surface.children[1] : null; if (anchor) surface.insertBefore(layer, anchor); else surface.appendChild(layer); };
  const findLayer = (surface) => [...surface.children].find((child) => child.classList?.contains("press-fx-layer"));
  const prepareSurface = (surface) => {
    const tactileOnly = isTactileOnly(surface);
    surface.classList.add("press-fx-surface");
    surface.classList.toggle("press-fx-tactile-only", tactileOnly);
    if (tactileOnly) return;
    surface.classList.add("press-fx-layered");
    if (window.getComputedStyle(surface).position === "static") surface.classList.add("press-fx-positioned");
    if (findLayer(surface)) return;
    const layer = document.createElement("span"); layer.className = "press-fx-layer"; layer.setAttribute("aria-hidden", "true");
    const sheen = document.createElement("span"); sheen.className = "press-fx-sheen"; layer.appendChild(sheen); insertFeedbackLayer(surface, layer);
  };
  const releaseLegacyLayer = (surface) => { if (!legacyWebKit || !surface?.isConnected || surface.classList.contains("is-press-fx")) return; findLayer(surface)?.remove(); };
  if (!legacyWebKit) document.querySelectorAll(cardSelector).forEach(prepareSurface);
  if (legacyWebKit) {
    const warmTouchedSurface = (event) => { const surface = resolveSurface(event.target); if (surface && !isTactileOnly(surface)) prepareSurface(surface); };
    if ("PointerEvent" in window) document.addEventListener("pointerdown", warmTouchedSurface, { capture:true, passive:true });
    else document.addEventListener("touchstart", warmTouchedSurface, { capture:true, passive:true });
  }
  const pulse = (surface) => {
    if (!surface?.isConnected) return; prepareSurface(surface);
    const previousTimer = timers.get(surface); if (previousTimer) window.clearTimeout(previousTimer);
    surface.classList.remove("is-press-fx"); void surface.offsetWidth; surface.classList.add("is-press-fx");
    const timer = window.setTimeout(() => { surface.classList.remove("is-press-fx"); timers.delete(surface); if (legacyWebKit) requestAnimationFrame(() => releaseLegacyLayer(surface)); }, reduceMotion ? 80 : 560);
    timers.set(surface, timer);
  };
  document.addEventListener("click", (event) => { if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return; const surface = resolveSurface(event.target); if (surface) pulse(surface); }, { capture:true });
  const clearActiveFeedback = () => { document.querySelectorAll(".is-press-fx").forEach((surface) => surface.classList.remove("is-press-fx")); if (legacyWebKit) document.querySelectorAll(".press-fx-layer").forEach((layer) => layer.remove()); };
  window.addEventListener("pagehide", clearActiveFeedback);
  document.addEventListener("visibilitychange", () => { if (document.hidden) clearActiveFeedback(); });
})();
