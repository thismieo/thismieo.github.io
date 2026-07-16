(() => {
  "use strict";

  const header = document.querySelector("#site-header");
  const menuButton = document.querySelector(".menu-toggle");
  const navLinks = [...document.querySelectorAll(".main-nav a")];

  if (!header) return;

  let previousY = Math.max(0, window.scrollY);
  let frame = 0;

  const menuIsOpen = () => menuButton?.getAttribute("aria-expanded") === "true";

  const showHeader = () => header.classList.remove("header-hidden");
  const hideHeader = () => header.classList.add("header-hidden");

  const updateHeader = () => {
    frame = 0;

    const currentY = Math.max(0, window.scrollY);
    const difference = currentY - previousY;
    const nearTop = currentY < 72;

    if (nearTop || menuIsOpen()) {
      showHeader();
    } else if (difference > 7 && currentY > 128) {
      hideHeader();
    } else if (difference < -7) {
      showHeader();
    }

    previousY = currentY;
  };

  const requestHeaderUpdate = () => {
    if (frame) return;
    frame = requestAnimationFrame(updateHeader);
  };

  window.addEventListener("scroll", requestHeaderUpdate, { passive: true });
  window.addEventListener("resize", requestHeaderUpdate, { passive: true });
  window.addEventListener("pageshow", () => {
    previousY = Math.max(0, window.scrollY);
    showHeader();
  });

  menuButton?.addEventListener("click", () => requestAnimationFrame(showHeader));
  navLinks.forEach((link) => link.addEventListener("click", showHeader));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") showHeader();
  });

  updateHeader();
})();
