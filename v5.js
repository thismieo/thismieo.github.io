(() => {
  const mobileQuery = window.matchMedia("(max-width: 860px)");
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const saveData = Boolean(connection?.saveData);
  const lowPowerDevice = Number.isFinite(navigator.hardwareConcurrency) && navigator.hardwareConcurrency <= 4;
  const liteMode = mobileQuery.matches || saveData || lowPowerDevice;

  if (liteMode) {
    document.documentElement.classList.add("mobile-lite");

    // The neural canvas is the heaviest visual element. Removing it before
    // neural-network.js executes prevents its animation loop from starting.
    document.querySelector("#neural-bg")?.remove();
  }

  const brandMark = document.querySelector(".brand-mark.brand-portrait");
  const originalPortrait = brandMark?.querySelector("img");
  const portraitSource = originalPortrait?.currentSrc || originalPortrait?.src || "";

  // Portfolio V4 reads this image to generate a large hero portrait. Temporarily
  // removing it preserves the compact header portrait without creating that layer.
  originalPortrait?.remove();

  const buildPortraitViewer = () => {
    document.querySelector(".hero-portrait-backdrop")?.remove();

    if (!brandMark || !portraitSource) return;

    brandMark.innerHTML = "";
    brandMark.setAttribute("role", "button");
    brandMark.setAttribute("tabindex", "0");
    brandMark.setAttribute("aria-haspopup", "dialog");
    brandMark.setAttribute("aria-label", "Open Mohammed Muayad portrait");
    brandMark.setAttribute("title", "View portrait");

    const portraitImage = document.createElement("img");
    portraitImage.src = portraitSource;
    portraitImage.alt = "Mohammed Muayad";
    portraitImage.decoding = "async";
    portraitImage.loading = "eager";
    brandMark.appendChild(portraitImage);

    const modal = document.createElement("div");
    modal.className = "portrait-modal";
    modal.hidden = true;
    modal.setAttribute("aria-hidden", "true");
    modal.innerHTML = `
      <div class="portrait-modal-backdrop" data-portrait-close></div>
      <section class="portrait-dialog" role="dialog" aria-modal="true" aria-labelledby="portrait-title" aria-describedby="portrait-description">
        <button class="portrait-close" type="button" data-portrait-close aria-label="Close portrait viewer">
          <span></span><span></span>
        </button>
        <div class="portrait-frame">
          <div class="portrait-scan" aria-hidden="true"></div>
          <img src="${portraitSource}" alt="Portrait of Mohammed Muayad" decoding="async" />
          <div class="portrait-corners" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
        </div>
        <div class="portrait-details">
          <span class="portrait-kicker">PERSONAL IDENTITY / 2026</span>
          <h2 id="portrait-title">Mohammed Muayad</h2>
          <p id="portrait-description">AI Engineering Student · Baghdad, Iraq</p>
          <div class="portrait-status"><i></i><span>Learning in public</span></div>
        </div>
      </section>
    `;
    document.body.appendChild(modal);

    let lastFocusedElement = null;
    let closeTimer = 0;
    const closeButton = modal.querySelector(".portrait-close");

    const openViewer = () => {
      window.clearTimeout(closeTimer);
      lastFocusedElement = document.activeElement;
      modal.hidden = false;
      modal.setAttribute("aria-hidden", "false");
      document.body.classList.add("portrait-viewer-open");
      window.requestAnimationFrame(() => {
        modal.classList.add("is-open");
        closeButton?.focus({ preventScroll: true });
      });
    };

    const closeViewer = () => {
      modal.classList.remove("is-open");
      document.body.classList.remove("portrait-viewer-open");
      modal.setAttribute("aria-hidden", "true");
      closeTimer = window.setTimeout(() => {
        modal.hidden = true;
        lastFocusedElement?.focus?.({ preventScroll: true });
      }, 220);
    };

    brandMark.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      openViewer();
    });

    brandMark.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      openViewer();
    });

    modal.querySelectorAll("[data-portrait-close]").forEach((element) => {
      element.addEventListener("click", closeViewer);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && modal.classList.contains("is-open")) {
        closeViewer();
      }
    });
  };

  if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", buildPortraitViewer, { once: true });
  } else {
    window.setTimeout(buildPortraitViewer, 0);
  }
})();
