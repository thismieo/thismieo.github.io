(() => {
  "use strict";

  const header = document.querySelector("#site-header");
  const navWrap = document.querySelector("#site-header .nav-wrap");
  const menuButton = document.querySelector(".menu-toggle");

  if (!header || !navWrap) return;

  /* V18 fully replaces the V17 identity dock and scroll visibility behavior. */
  document.querySelector('link[data-v17-navigation]')?.remove();
  navWrap.querySelector(".nav-identity")?.remove();
  header.classList.remove("header-hidden");

  if (!document.querySelector('link[data-v18-cyber-rail]')) {
    const stylesheet = document.createElement("link");
    stylesheet.rel = "stylesheet";
    stylesheet.href = "v18.css?v=1";
    stylesheet.dataset.v18CyberRail = "true";
    document.head.append(stylesheet);
  }

  let rail = navWrap.querySelector(".cyber-rail");
  if (!rail) {
    rail = document.createElement("div");
    rail.className = "cyber-rail";
    rail.innerHTML = `
      <a class="cyber-rail-title" href="#home" aria-label="Return to the portfolio home">
        <span>AI ENGINEERING</span>
        <strong>JOURNEY</strong>
      </a>
      <div class="cyber-stream" aria-hidden="true">
        <div class="cyber-track">
          <span>Python Foundations</span>
          <span>Algorithms</span>
          <span>Building in Public</span>
          <span>Machine Learning</span>
          <span>Deep Learning</span>
          <span>Generative AI</span>
          <span>Python Foundations</span>
          <span>Algorithms</span>
          <span>Building in Public</span>
          <span>Machine Learning</span>
          <span>Deep Learning</span>
          <span>Generative AI</span>
        </div>
      </div>
      <span class="cyber-status" aria-label="Learning journey active">
        <i aria-hidden="true"></i>
        <span>ACTIVE</span>
      </span>
    `;

    navWrap.insertBefore(rail, menuButton || navWrap.firstChild);
  }

  rail.querySelector(".cyber-rail-title")?.addEventListener("click", () => {
    if (menuButton?.getAttribute("aria-expanded") === "true") menuButton.click();
  });
})();