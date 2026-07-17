(() => {
  "use strict";

  const header = document.querySelector("#site-header");
  const navigation = document.querySelector("#primary-navigation");
  const menuButton = document.querySelector(".menu-toggle");
  const mobileQuery = window.matchMedia("(max-width: 860px)");

  if (!header || !navigation || !menuButton) return;

  const menuHasOpenState = () => (
    menuButton.getAttribute("aria-expanded") === "true"
    || navigation.classList.contains("open")
    || document.body.classList.contains("menu-open")
  );

  const closeMenu = (restoreFocus = false) => {
    const wasOpen = menuHasOpenState();

    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation");
    navigation.classList.remove("open");
    document.body.classList.remove("menu-open");

    if (restoreFocus && wasOpen) menuButton.focus({ preventScroll: true });
  };

  document.addEventListener("click", (event) => {
    if (!mobileQuery.matches || !menuHasOpenState()) return;
    if (header.contains(event.target)) return;

    event.preventDefault();
    event.stopPropagation();
    closeMenu(false);
  }, true);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && mobileQuery.matches && menuHasOpenState()) {
      event.preventDefault();
      closeMenu(true);
    }
  });

  window.addEventListener("pageshow", () => closeMenu(false));
  window.addEventListener("orientationchange", () => closeMenu(false), { passive: true });
})();
