(() => {
  "use strict";

  const release = "2026.07.17.35";
  document.documentElement.dataset.release = release;

  if (!document.querySelector('link[data-hero-portrait-v34]')) {
    const stylesheet = document.createElement("link");
    stylesheet.rel = "stylesheet";
    stylesheet.href = "hero-portrait-v34.css?v=20260717.35";
    stylesheet.dataset.heroPortraitV34 = "true";
    document.head.append(stylesheet);
  }

  const copy = document.querySelector("#home .hero-v33-copy");
  if (copy && !copy.querySelector(".hero-v34-name")) {
    const name = document.createElement("p");
    name.className = "hero-v34-name";
    name.textContent = "Mohammed Muayad";
    copy.prepend(name);
  }
})();
