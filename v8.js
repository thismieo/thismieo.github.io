(() => {
  const shouldStartAtHome = () => !window.location.hash || window.location.hash === "#home";

  if ("scrollRestoration" in window.history) {
    window.history.scrollRestoration = "manual";
  }

  const resetToHome = () => {
    if (!shouldStartAtHome()) return;
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };

  // Mobile browsers can restore the previous scroll position after the page
  // has already painted. Repeating the reset across the initial lifecycle keeps
  // a clean visit anchored at Home without affecting intentional section links.
  resetToHome();
  window.addEventListener("DOMContentLoaded", resetToHome, { once: true });
  window.addEventListener("load", () => {
    resetToHome();
    window.requestAnimationFrame(resetToHome);
    window.setTimeout(resetToHome, 120);
  }, { once: true });
  window.addEventListener("pageshow", () => {
    resetToHome();
    window.requestAnimationFrame(resetToHome);
    window.setTimeout(resetToHome, 120);
  });
})();
