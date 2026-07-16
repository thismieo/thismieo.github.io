const header = document.querySelector("#site-header");
const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#primary-navigation");
const navLinks = [...document.querySelectorAll(".main-nav a")];
const sections = [...document.querySelectorAll("main section[id]")];
const revealElements = document.querySelectorAll(".reveal");
const yearElement = document.querySelector("#current-year");

const setHeaderState = () => {
  header?.classList.toggle("scrolled", window.scrollY > 18);
};

const closeMenu = () => {
  if (!menuButton || !navigation) return;
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Open navigation");
  navigation.classList.remove("open");
  document.body.classList.remove("menu-open");
};

menuButton?.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
  navigation?.classList.toggle("open", !isOpen);
  document.body.classList.toggle("menu-open", !isOpen);
});

navLinks.forEach((link) => link.addEventListener("click", closeMenu));

window.addEventListener("resize", () => {
  if (window.innerWidth > 860) closeMenu();
});

window.addEventListener("scroll", setHeaderState, { passive: true });
setHeaderState();

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px" }
  );

  revealElements.forEach((element) => revealObserver.observe(element));

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visibleSection = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visibleSection) return;
      const activeId = visibleSection.target.id;

      navLinks.forEach((link) => {
        const targetId = link.getAttribute("href")?.replace("#", "");
        link.classList.toggle("active", targetId === activeId);
      });
    },
    { threshold: [0.25, 0.45, 0.65], rootMargin: "-15% 0px -55%" }
  );

  sections.forEach((section) => sectionObserver.observe(section));
} else {
  revealElements.forEach((element) => element.classList.add("visible"));
}

if (yearElement) {
  yearElement.textContent = String(new Date().getFullYear());
}

/* Portfolio V3 — personal portrait and future project concepts */
(() => {
  const portraitSource = "data:image/webp;base64,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";

  const brandMark = document.querySelector(".brand-mark");
  if (brandMark) {
    brandMark.classList.add("brand-portrait");
    brandMark.innerHTML = `<img src="${portraitSource}" alt="Mohammed Muayad" decoding="async" />`;
  }

  const core = document.querySelector(".core");
  if (core) {
    core.classList.add("profile-core");
    const coreTitle = core.querySelector("strong");
    if (coreTitle) {
      coreTitle.replaceWith(Object.assign(document.createElement("img"), {
        src: portraitSource,
        alt: "Portrait of Mohammed Muayad",
        decoding: "async"
      }));
    }

    const coreLabel = core.querySelector("small");
    if (coreLabel) coreLabel.textContent = "AI ENGINEERING";
  }

  const projectsIntro = document.querySelector("#projects .section-heading > p");
  if (projectsIntro) {
    projectsIntro.textContent =
      "Planned portfolio concepts that will become real repositories as my data and machine-learning skills grow.";
  }

  const projectsGrid = document.querySelector("#projects .projects-grid");
  if (projectsGrid) {
    projectsGrid.innerHTML = `
      <article class="project-card project-concept project-health visible">
        <div class="project-top"><span>HEALTH DATA ANALYSIS</span><b>01</b></div>
        <h3>Heart Disease Risk Analysis</h3>
        <p>A planned data-analysis project exploring patient indicators such as age, blood pressure, cholesterol, heart rate, and chest-pain patterns.</p>
        <div class="project-tags"><span>Python</span><span>Pandas</span><span>Healthcare Data</span></div>
        <span class="project-status status-planned">PLANNED</span>
      </article>

      <article class="project-card project-concept project-fraud visible">
        <div class="project-top"><span>FINANCIAL INTELLIGENCE</span><b>02</b></div>
        <h3>Fraud Detection System</h3>
        <p>A future machine-learning project designed to identify unusual financial transactions and distinguish normal behavior from suspicious activity.</p>
        <div class="project-tags"><span>Machine Learning</span><span>Classification</span><span>Security</span></div>
        <span class="project-status status-roadmap">ROADMAP</span>
      </article>

      <article class="project-card project-concept project-arabic visible">
        <div class="project-top"><span>ARABIC LANGUAGE AI</span><b>03</b></div>
        <h3>Arabic Sentiment Analysis</h3>
        <p>A planned NLP project that classifies Arabic text as positive, neutral, or negative while exploring the challenges of dialects and context.</p>
        <div class="project-tags"><span>NLP</span><span>Arabic</span><span>Text Classification</span></div>
        <span class="project-status status-future">FUTURE</span>
      </article>
    `;
  }

  const style = document.createElement("style");
  style.dataset.portfolioV3 = "true";
  style.textContent = `
    .brand-mark.brand-portrait {
      padding: 2px;
      overflow: hidden;
      border-radius: 50%;
      background:
        linear-gradient(#07101f, #07101f) padding-box,
        linear-gradient(135deg, #67e8f9, #60a5fa 46%, #a78bfa 74%, #f0a8bf) border-box;
      border: 2px solid transparent;
      box-shadow: 0 0 0 4px rgba(103, 232, 249, 0.05), 0 0 24px rgba(6, 182, 212, 0.18);
    }

    .brand-mark.brand-portrait img {
      display: block;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
      object-position: 50% 42%;
    }

    .core.profile-core {
      overflow: visible;
      place-content: initial;
      isolation: isolate;
      background: rgba(4, 10, 23, 0.96);
      border-color: rgba(103, 232, 249, 0.58);
      box-shadow:
        inset 0 0 50px rgba(6, 182, 212, 0.08),
        0 0 0 7px rgba(6, 182, 212, 0.035),
        0 0 78px rgba(6, 182, 212, 0.18);
    }

    .core.profile-core > img {
      position: absolute;
      inset: 8px;
      z-index: 1;
      width: calc(100% - 16px);
      height: calc(100% - 16px);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 50%;
      object-fit: cover;
      object-position: 50% 42%;
      filter: saturate(0.92) contrast(1.06);
      box-shadow: inset 0 -32px 42px rgba(3, 7, 18, 0.42);
    }

    .core.profile-core::before,
    .core.profile-core::after {
      z-index: -1;
    }

    .core.profile-core small,
    .core.profile-core span {
      position: absolute;
      left: 50%;
      z-index: 3;
      width: max-content;
      max-width: 86%;
      transform: translateX(-50%);
      border: 1px solid rgba(103, 232, 249, 0.22);
      border-radius: 999px;
      background: rgba(3, 7, 18, 0.72);
      box-shadow: 0 8px 22px rgba(0, 0, 0, 0.3);
      backdrop-filter: blur(8px);
      color: #e8fbff;
      text-shadow: 0 0 10px rgba(103, 232, 249, 0.35);
      white-space: nowrap;
    }

    .core.profile-core small {
      top: 17px;
      padding: 4px 8px;
      font-size: 0.48rem;
      letter-spacing: 0.14em;
    }

    .core.profile-core span {
      bottom: 15px;
      padding: 4px 7px;
      font-size: 0.42rem;
      letter-spacing: 0.11em;
    }

    .project-concept {
      min-height: 380px;
      border-color: rgba(103, 232, 249, 0.13);
    }

    .project-concept::before {
      content: "";
      position: absolute;
      inset: 0;
      z-index: 0;
      pointer-events: none;
      opacity: 0.62;
      background:
        linear-gradient(135deg, rgba(103, 232, 249, 0.04), transparent 44%),
        radial-gradient(circle at 88% 12%, var(--project-accent, rgba(103, 232, 249, 0.16)), transparent 34%);
    }

    .project-concept > * {
      position: relative;
      z-index: 1;
    }

    .project-health {
      --project-accent: rgba(52, 211, 153, 0.18);
    }

    .project-fraud {
      --project-accent: rgba(96, 165, 250, 0.18);
    }

    .project-arabic {
      --project-accent: rgba(167, 139, 250, 0.2);
    }

    .project-concept h3 {
      max-width: 95%;
    }

    .project-concept .project-status {
      border: 1px solid rgba(255, 255, 255, 0.08);
    }

    .status-planned {
      color: #6ee7b7 !important;
      background: rgba(52, 211, 153, 0.09) !important;
    }

    .status-roadmap {
      color: #93c5fd !important;
      background: rgba(96, 165, 250, 0.09) !important;
    }

    .status-future {
      color: #c4b5fd !important;
      background: rgba(167, 139, 250, 0.1) !important;
    }

    @media (max-width: 580px) {
      .core.profile-core small {
        top: 11px;
        font-size: 0.36rem;
      }

      .core.profile-core span {
        bottom: 10px;
        font-size: 0.31rem;
      }

      .core.profile-core > img {
        inset: 6px;
        width: calc(100% - 12px);
        height: calc(100% - 12px);
      }

      .project-concept {
        min-height: 350px;
      }
    }
  `;

  document.head.appendChild(style);
})();
