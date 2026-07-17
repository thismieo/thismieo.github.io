(() => {
  "use strict";

  const header = document.querySelector("#site-header");
  const navigation = document.querySelector("#primary-navigation");
  const menuButton = document.querySelector(".menu-toggle");
  const mobileQuery = window.matchMedia("(max-width: 860px)");

  if (!header || !navigation || !menuButton) return;

  const menuIsOpen = () => menuButton.getAttribute("aria-expanded") === "true";

  const closeMenu = (restoreFocus = false) => {
    if (!menuIsOpen()) return;
    menuButton.click();
    if (restoreFocus) menuButton.focus({ preventScroll: true });
  };

  document.addEventListener("pointerdown", (event) => {
    if (!mobileQuery.matches || !menuIsOpen()) return;
    if (!header.contains(event.target)) closeMenu(false);
  }, { passive: true });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && mobileQuery.matches && menuIsOpen()) {
      event.preventDefault();
      closeMenu(true);
    }
  });

  window.addEventListener("pageshow", () => closeMenu(false));
  window.addEventListener("orientationchange", () => closeMenu(false), { passive: true });
})();
