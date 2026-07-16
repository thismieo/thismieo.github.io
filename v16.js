(() => {
  "use strict";

  const header = document.querySelector("#site-header");
  const menuButton = document.querySelector(".menu-toggle");
  const navLinks = [...document.querySelectorAll(".main-nav a")];

  if (!header) return;

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

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") showHeader();
  });

  updateHeader();
})();
