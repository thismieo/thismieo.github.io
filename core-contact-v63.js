(() => {
  "use strict";

  const PROJECT_VISUAL_VERSION = "104";
  document.documentElement.dataset.release = "2026.07.19.105";

  const activeStylesheet = document.querySelector("link[data-core-contact-v63]");
  if (activeStylesheet) activeStylesheet.href = "core-contact-v63.css?v=20260718.68";

  const readoutStylesheet = document.querySelector("link[data-project-readouts-v66]");
  if (readoutStylesheet) {
    readoutStylesheet.href = "project-readouts-v66.css?v=20260719.103";
  }

  let footerStylesheet = document.querySelector("link[data-project-footer-v104]");
  if (!footerStylesheet) {
    footerStylesheet = document.createElement("link");
    footerStylesheet.rel = "stylesheet";
    footerStylesheet.dataset.projectFooterV104 = "true";
    document.head.append(footerStylesheet);
  }
  footerStylesheet.href = "scripts/project-footer-v104.css?v=20260719.104";

  let mobileFooterStyles = document.querySelector("style[data-project-footer-mobile-v105]");
  if (!mobileFooterStyles) {
    mobileFooterStyles = document.createElement("style");
    mobileFooterStyles.dataset.projectFooterMobileV105 = "true";
    document.head.append(mobileFooterStyles);
  }

  mobileFooterStyles.textContent = `
    @media (max-width: 720px) {
      #projects.is-project-grid-v62 .project-v104-visual,
      #projects.is-project-tabs-v61.is-project-grid-v62 .project-v104-visual,
      #projects .project-v104-visual {
        height: 184px !important;
        min-height: 184px !important;
        grid-template-rows: minmax(0, 100px) minmax(0, 84px) !important;
      }

      #projects .project-v104-footer {
        grid-template-columns: minmax(0, 0.94fr) minmax(0, 1.06fr) !important;
        grid-template-rows: minmax(0, 1fr) !important;
        align-items: center !important;
        align-content: center !important;
        gap: 4px !important;
        min-height: 84px !important;
        padding: 7px 5px 8px !important;
      }

      #projects .project-v104-footer::before {
        inset-inline: 5px !important;
      }

      #projects .project-v104-meta {
        align-items: flex-start !important;
        justify-content: center !important;
        gap: 4px !important;
        min-width: 0 !important;
        padding: 3px 2px 3px 7px !important;
        border-bottom: 0 !important;
        text-align: left !important;
      }

      #projects .project-v104-meta::before {
        display: block !important;
        left: 0 !important;
        top: 3px !important;
        bottom: 3px !important;
        width: 1.5px !important;
      }

      #projects .project-v104-meta-label,
      #projects .project-v104-meta-code {
        max-width: 100% !important;
        text-align: left !important;
      }

      #projects .project-v104-meta-label {
        font-size: 0.4rem !important;
        line-height: 1.05 !important;
        letter-spacing: 0.065em !important;
      }

      #projects .project-v104-meta-code {
        font-size: 0.56rem !important;
        line-height: 1.05 !important;
        letter-spacing: 0.018em !important;
      }

      #projects .project-v104-telemetry {
        min-width: 0 !important;
        min-height: 48px !important;
        justify-content: flex-start !important;
        align-items: center !important;
        gap: 4px !important;
        padding: 3px 0 3px 5px !important;
        border-left: 1px solid rgba(151, 193, 226, 0.15) !important;
      }

      #projects .project-v104-telemetry-icon {
        flex: 0 0 20px !important;
        width: 20px !important;
        height: 20px !important;
      }

      #projects .project-v104-telemetry-icon svg {
        width: 19px !important;
        height: 19px !important;
        stroke-width: 1.55 !important;
      }

      #projects .project-v104-telemetry-copy {
        flex: 1 1 auto !important;
        min-width: 0 !important;
        align-items: flex-start !important;
        gap: 3px !important;
      }

      #projects .project-v104-telemetry-label {
        max-width: 100% !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        font-size: 0.38rem !important;
        line-height: 1 !important;
        letter-spacing: 0.055em !important;
      }

      #projects .project-v104-telemetry-reading {
        max-width: 100% !important;
        gap: 3px !important;
      }

      #projects .project-v104-telemetry-value {
        font-size: 0.58rem !important;
        line-height: 1 !important;
        letter-spacing: 0 !important;
      }

      #projects .project-v104-telemetry-state {
        font-size: 0.3rem !important;
        line-height: 1 !important;
        letter-spacing: 0.045em !important;
      }
    }

    @media (max-width: 390px) {
      #projects.is-project-grid-v62 .project-v104-visual,
      #projects.is-project-tabs-v61.is-project-grid-v62 .project-v104-visual,
      #projects .project-v104-visual {
        height: 180px !important;
        min-height: 180px !important;
        grid-template-rows: minmax(0, 98px) minmax(0, 82px) !important;
      }

      #projects .project-v104-footer {
        min-height: 82px !important;
        gap: 3px !important;
        padding: 6px 4px 7px !important;
      }

      #projects .project-v104-meta {
        padding-left: 6px !important;
      }

      #projects .project-v104-meta-label {
        font-size: 0.37rem !important;
      }

      #projects .project-v104-meta-code {
        font-size: 0.52rem !important;
      }

      #projects .project-v104-telemetry {
        gap: 3px !important;
        padding-left: 4px !important;
      }

      #projects .project-v104-telemetry-icon {
        flex-basis: 18px !important;
        width: 18px !important;
        height: 18px !important;
      }

      #projects .project-v104-telemetry-icon svg {
        width: 17px !important;
        height: 17px !important;
      }

      #projects .project-v104-telemetry-label {
        font-size: 0.35rem !important;
      }

      #projects .project-v104-telemetry-value {
        font-size: 0.54rem !important;
      }

      #projects .project-v104-telemetry-state {
        font-size: 0.28rem !important;
      }
    }
  `;

  const projects = document.querySelector("#projects");
  projects?.classList.add("is-project-stack-v65", "is-project-readouts-v66");

  if (projects && projects.dataset.projectVisualVersion !== PROJECT_VISUAL_VERSION) {
    delete projects.dataset.projectVisualsV54Ready;
    document.querySelectorAll("script[data-project-visual-refresh]").forEach((script) => script.remove());

    const refreshScript = document.createElement("script");
    refreshScript.src = "project-visuals-v54.js?v=20260719.104";
    refreshScript.defer = true;
    refreshScript.dataset.projectVisualRefresh = PROJECT_VISUAL_VERSION;
    refreshScript.addEventListener("load", () => refreshScript.remove(), { once: true });
    document.body.append(refreshScript);
  }

  const contact = document.querySelector("#contact");
  const links = contact?.querySelector(".contact-links");
  if (!contact || !links || contact.dataset.contactV63Ready === "true") return;

  contact.dataset.contactV63Ready = "true";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let sectionVisible = true;
  let observer = null;

  const prepareFiveChannels = () => {
    links.querySelector('[data-platform="x"]')?.remove();

    const channels = [...links.querySelectorAll(".contact-channel-v56")];
    if (!channels.length) return false;

    contact.classList.add("contact-v63-five");
    links.classList.add("contact-links-v63-five");
    links.setAttribute("aria-label", "Official profiles and email channels");

    channels.forEach((channel, index) => {
      channel.style.setProperty("--contact-v63-order", String(index));
    });

    return channels.length === 5;
  };

  const syncMotion = () => {
    contact.classList.toggle(
      "is-contact-v63-live",
      sectionVisible && !document.hidden && !reducedMotion.matches
    );
  };

  const ready = prepareFiveChannels();

  if (!ready) {
    observer = new MutationObserver(() => {
      if (!prepareFiveChannels()) return;
      observer?.disconnect();
      observer = null;
      syncMotion();
    });

    observer.observe(links, { childList: true, subtree: true });
    window.setTimeout(() => {
      observer?.disconnect();
      observer = null;
    }, 5000);
  }

  if ("IntersectionObserver" in window) {
    const visibilityObserver = new IntersectionObserver((entries) => {
      sectionVisible = Boolean(entries[0]?.isIntersecting);
      syncMotion();
    }, {
      root: null,
      rootMargin: "140px 0px",
      threshold: 0.04
    });

    visibilityObserver.observe(contact);
  }

  document.addEventListener("visibilitychange", syncMotion);

  const handleMotionPreference = () => syncMotion();
  if (typeof reducedMotion.addEventListener === "function") {
    reducedMotion.addEventListener("change", handleMotionPreference);
  } else if (typeof reducedMotion.addListener === "function") {
    reducedMotion.addListener(handleMotionPreference);
  }

  window.requestAnimationFrame(syncMotion);
})();
