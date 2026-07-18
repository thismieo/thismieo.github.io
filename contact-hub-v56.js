(() => {
  "use strict";

  document.documentElement.dataset.release = "2026.07.18.56";

  const section = document.querySelector("#contact");
  const links = section?.querySelector(".contact-links");
  if (!section || !links || section.dataset.contactHubV56Ready === "true") return;

  section.dataset.contactHubV56Ready = "true";

  const icons = {
    outlook: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M2.5 5.4 10 3v18l-7.5-1.5V5.4Zm9 1.1h8.95c.85 0 1.55.7 1.55 1.55v7.9c0 .85-.7 1.55-1.55 1.55H11.5v-2.65l4.68 3.05 4.32-2.8V9.02l-4.32 2.8-4.68-3.05V6.5Zm4.68 3.46 3.9-2.06h-7.8l3.9 2.06ZM5.2 9.05c-1.43 0-2.33 1.13-2.33 2.95s.9 2.95 2.33 2.95S7.53 13.82 7.53 12s-.9-2.95-2.33-2.95Zm0 1.48c.55 0 .9.5.9 1.47s-.35 1.47-.9 1.47-.9-.5-.9-1.47.35-1.47.9-1.47Z"/>
      </svg>`,
    github: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.88c-2.78.6-3.37-1.18-3.37-1.18-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.35 1.09 2.92.83.09-.65.35-1.09.64-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.55 9.55 0 0 1 12 6.82a9.5 9.5 0 0 1 2.5.34c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.77c0 .27.18.58.69.48A10 10 0 0 0 12 2Z"/>
      </svg>`,
    kaggle: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6.7 3.2h2.55v7.61l6.15-7.61h3.03l-6.03 7.2 6.48 10.4h-2.92l-5.3-8.53-1.41 1.68v6.85H6.7V3.2Z"/>
      </svg>`,
    instagram: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7.2 2.5h9.6a4.7 4.7 0 0 1 4.7 4.7v9.6a4.7 4.7 0 0 1-4.7 4.7H7.2a4.7 4.7 0 0 1-4.7-4.7V7.2a4.7 4.7 0 0 1 4.7-4.7Zm0 2A2.7 2.7 0 0 0 4.5 7.2v9.6a2.7 2.7 0 0 0 2.7 2.7h9.6a2.7 2.7 0 0 0 2.7-2.7V7.2a2.7 2.7 0 0 0-2.7-2.7H7.2Zm10.15 1.5a1.15 1.15 0 1 1 0 2.3 1.15 1.15 0 0 1 0-2.3ZM12 7.2a4.8 4.8 0 1 1 0 9.6 4.8 4.8 0 0 1 0-9.6Zm0 2a2.8 2.8 0 1 0 0 5.6 2.8 2.8 0 0 0 0-5.6Z"/>
      </svg>`,
    gmail: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3.5 5.25h17A1.5 1.5 0 0 1 22 6.75v10.5a1.5 1.5 0 0 1-1.5 1.5h-17A1.5 1.5 0 0 1 2 17.25V6.75a1.5 1.5 0 0 1 1.5-1.5Zm.5 3.1v8.4h2.35V10.1L12 14.25l5.65-4.15v6.65H20v-8.4l-8 5.75-8-5.75Zm.34-1.1L12 12.78l7.66-5.53H4.34Z"/>
      </svg>`,
    x: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.475l-5.073-6.632L5.48 21.75H2.17l7.56-8.64L1.502 2.25h6.64l4.584 6.064 5.518-6.064Zm-1.161 17.52h1.833L7.147 4.126H5.18L17.083 19.77Z"/>
      </svg>`
  };

  const arrowIcon = `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 17.6 16.6 8H10V6h10v10h-2V9.4L8.4 19 7 17.6Z"/>
    </svg>`;

  const channels = [
    {
      platform: "outlook",
      label: "Outlook",
      value: "thismieo@outlook.com",
      meta: "Direct email",
      href: "mailto:thismieo@outlook.com"
    },
    {
      platform: "github",
      label: "GitHub",
      value: "@thismieo",
      meta: "Official profile",
      href: "https://github.com/thismieo",
      external: true
    },
    {
      platform: "kaggle",
      label: "Kaggle",
      value: "@thismieo",
      meta: "Data profile",
      href: "https://www.kaggle.com/thismieo",
      external: true
    },
    {
      platform: "instagram",
      label: "Instagram",
      value: "@thismieo",
      meta: "Official profile",
      href: "https://www.instagram.com/thismieo/",
      external: true
    },
    {
      platform: "gmail",
      label: "Gmail",
      value: "thismieo@gmail.com",
      meta: "Primary email",
      href: "mailto:thismieo@gmail.com"
    },
    {
      platform: "x",
      label: "X",
      value: "@thismieo",
      meta: "Official profile",
      href: "https://x.com/thismieo",
      external: true
    }
  ];

  const buildChannel = (channel) => {
    const anchor = document.createElement("a");
    anchor.className = "contact-channel-v56";
    anchor.dataset.platform = channel.platform;
    anchor.href = channel.href;
    anchor.setAttribute("aria-label", `${channel.label}: ${channel.value}`);

    if (channel.external) {
      anchor.target = "_blank";
      anchor.rel = "noreferrer";
    }

    anchor.innerHTML = `
      <span class="contact-channel-icon-v56">${icons[channel.platform]}</span>
      <span class="contact-channel-copy-v56">
        <small>${channel.label}</small>
        <strong>${channel.value}</strong>
        <span class="contact-channel-meta-v56"><i aria-hidden="true"></i>${channel.meta}</span>
      </span>
      <span class="contact-channel-arrow-v56">${arrowIcon}</span>`;

    return anchor;
  };

  links.classList.add("contact-links-v56");
  links.setAttribute("aria-label", "Official profiles and email channels");
  links.replaceChildren(...channels.map(buildChannel));

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let sectionVisible = true;

  const syncMotion = () => {
    section.classList.toggle(
      "is-contact-v56-live",
      sectionVisible && !document.hidden && !reducedMotion.matches
    );
  };

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      sectionVisible = Boolean(entries[0]?.isIntersecting);
      syncMotion();
    }, {
      root: null,
      rootMargin: "160px 0px",
      threshold: 0.04
    });
    observer.observe(section);
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
