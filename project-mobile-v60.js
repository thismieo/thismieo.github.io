(() => {
  "use strict";

  document.documentElement.dataset.release = "2026.07.18.60";

  const applyHealthReadoutFix = () => {
    const healthSvg = document.querySelector("#projects .project-v54-svg.project-v54-health");
    if (!healthSvg || healthSvg.dataset.projectV60HealthReady === "true") return false;

    const heartIcon = healthSvg.querySelector(".project-v54-heart-icon");
    const readout = heartIcon?.closest("g");
    const chip = readout?.querySelector(".project-v54-chip");

    if (!heartIcon || !readout || !chip) return false;

    healthSvg.dataset.projectV60HealthReady = "true";
    readout.classList.add("project-v60-health-readout");

    /* Move the wider readout left so its right edge remains inside the 360px viewBox. */
    readout.setAttribute("transform", "translate(274 12)");
    chip.setAttribute("width", "73");

    /* Give the heart icon slightly more presence without taking text space. */
    heartIcon.setAttribute("transform", "translate(3 -2) scale(.69)");

    return true;
  };

  if (applyHealthReadoutFix()) return;

  /* V54 normally renders first because both scripts are deferred and ordered.
     This observer is a narrow fallback for delayed or restored-page rendering. */
  const projects = document.querySelector("#projects");
  if (!projects) return;

  const observer = new MutationObserver(() => {
    if (!applyHealthReadoutFix()) return;
    observer.disconnect();
  });

  observer.observe(projects, { childList: true, subtree: true });
  window.setTimeout(() => observer.disconnect(), 4000);
})();
