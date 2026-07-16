(() => {
  "use strict";

  const header = document.querySelector("#site-header");
  const navWrap = document.querySelector("#site-header .nav-wrap");
  const menuButton = document.querySelector(".menu-toggle");
  const navLinks = [...document.querySelectorAll(".main-nav a")];

  if (!header || !navWrap) return;

  if (!document.querySelector('link[data-v17-navigation]')) {
    const stylesheet = document.createElement("link");
    stylesheet.rel = "stylesheet";
    stylesheet.href = "v17.css?v=1";
    stylesheet.dataset.v17Navigation = "true";
    document.head.append(stylesheet);
  }

  let identity = navWrap.querySelector(".nav-identity");
  if (!identity) {
    identity = document.createElement("a");
    identity.className = "nav-identity";
    identity.href = "#home";
    identity.setAttribute("aria-label", "Mohammed Muayad portfolio home");
    identity.innerHTML = `
      <span class="nav-monogram" aria-hidden="true">MM</span>
      <span class="nav-identity-copy">
        <strong>PORTFOLIO</strong>
        <small>2026 / AI JOURNEY</small>
      </span>
    `;
    navWrap.insertBefore(identity, menuButton || navWrap.firstChild);
  }

  let previousY = Math.max(0, window.scrollY);
  let direction = 0;
  let distance = 0;
  let frame = 0;

  const menuIsOpen = () => menuButton?.getAttribute("aria-expanded") === "true";
  const showHeader = () => header.classList.remove("header-hidden");
  const hideHeader = () => header.classList.add("header-hidden");
  const resetMotion = () => {
    direction = 0;
    distance = 0;
  };

  const updateHeader = () => {
    frame = 0;

    const currentY = Math.max(0, window.scrollY);
    const delta = currentY - previousY;
    const nearTop = currentY < 84;

    if (nearTop || menuIsOpen()) {
      showHeader();
      resetMotion();
      previousY = currentY;
      return;
    }

    if (Math.abs(delta) >= 1) {
      const nextDirection = delta > 0 ? 1 : -1;

      if (nextDirection !== direction) {
        direction = nextDirection;
        distance = 0;
      }

      distance += Math.abs(delta);

      if (direction > 0 && currentY > 160 && distance >= 44) {
        hideHeader();
        distance = 0;
      } else if (direction < 0 && distance >= 20) {
        showHeader();
        distance = 0;
      }
    }

    previousY = currentY;
  };

  const requestHeaderUpdate = () => {
    if (frame) return;
    frame = requestAnimationFrame(updateHeader);
  };

  window.addEventListener("scroll", requestHeaderUpdate, { passive: true });
  window.addEventListener("resize", () => {
    previousY = Math.max(0, window.scrollY);
    resetMotion();
    showHeader();
  }, { passive: true });
  window.addEventListener("pageshow", () => {
    previousY = Math.max(0, window.scrollY);
    resetMotion();
    showHeader();
  });

  menuButton?.addEventListener("click", () => requestAnimationFrame(showHeader));
  navLinks.forEach((link) => link.addEventListener("click", showHeader));
  identity.addEventListener("click", () => {
    showHeader();
    if (menuIsOpen()) menuButton?.click();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") showHeader();
  });

  updateHeader();
})();
