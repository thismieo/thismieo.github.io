(() => {
  "use strict";

  const header = document.querySelector("[data-header]");
  const nav = document.querySelector("[data-nav]");
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const navLinks = [...document.querySelectorAll(".wordmark, .site-nav a")];
  const sections = navLinks.map((link) => document.querySelector(link.getAttribute("href"))).filter(Boolean);
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const stableTouchLayout = window.matchMedia("(max-width: 700px), (hover: none), (pointer: coarse)").matches;
  const workshopView = document.querySelector("[data-workshop-view]");
  const workshopOpeners = [...document.querySelectorAll("[data-open-workshop]")];
  const workshopClosers = [...document.querySelectorAll("[data-close-workshop]")];
  const scrollProgress = document.querySelector("[data-scroll-progress]");
  const backToTop = document.querySelector("[data-back-to-top]");
  let portfolioScroll = 0;

  const localizedTitle = (workshop = false) => {
    const arabic = document.documentElement.lang === "ar";
    if (workshop) return arabic ? "الورشة | محمد مؤيد" : "The Workshop | Mohammed Muayad";
    return arabic ? "محمد مؤيد | هندسة الذكاء الاصطناعي والتطبيقات العملية" : "Mohammed Muayad | AI Engineering & Applied AI";
  };

  document.querySelector("[data-year]").textContent = String(new Date().getFullYear());

  let lastScrollY = window.scrollY;
  let scrollFrame = 0;
  const updateScrollInterface = () => {
    const currentY = Math.max(window.scrollY, 0);
    const scrollable = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    const progress = Math.min(currentY / scrollable, 1);

    header?.classList.toggle("is-scrolled", currentY > 14);
    if (scrollProgress) scrollProgress.style.transform = `scaleX(${progress})`;
    backToTop?.classList.toggle("is-visible", currentY > Math.min(720, window.innerHeight * 0.8));

    if (stableTouchLayout && header) {
      const delta = currentY - lastScrollY;
      if (currentY < 54 || delta < -7) header.classList.remove("is-hidden");
      else if (currentY > 110 && delta > 7) header.classList.add("is-hidden");
    }

    lastScrollY = currentY;
    scrollFrame = 0;
  };

  const requestScrollInterface = () => {
    if (scrollFrame) return;
    scrollFrame = window.requestAnimationFrame(updateScrollInterface);
  };

  window.addEventListener("scroll", requestScrollInterface, { passive: true });
  window.addEventListener("resize", requestScrollInterface);
  updateScrollInterface();

  backToTop?.addEventListener("click", () => {
    header?.classList.remove("is-hidden");
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  });

  const closeMenu = () => {
    nav?.classList.remove("is-open");
    menuToggle?.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
    header?.classList.remove("is-hidden");
  };

  menuToggle?.addEventListener("click", () => {
    const open = menuToggle.getAttribute("aria-expanded") !== "true";
    menuToggle.setAttribute("aria-expanded", String(open));
    nav?.classList.toggle("is-open", open);
    document.body.classList.toggle("menu-open", open);
  });

  navLinks.forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  let activeFrame = 0;
  const updateActiveSection = () => {
    const probe = window.scrollY + Math.min(window.innerHeight * 0.34, 320);
    let activeSection = sections[0];

    sections.forEach((section) => {
      if (section.offsetTop <= probe) activeSection = section;
    });

    navLinks.forEach((link) => {
      const active = link.getAttribute("href") === `#${activeSection?.id}`;
      link.classList.toggle("is-active", active);
      if (active) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
  };

  const requestActiveUpdate = () => {
    if (activeFrame) return;
    activeFrame = window.requestAnimationFrame(() => {
      updateActiveSection();
      activeFrame = 0;
    });
  };

  window.addEventListener("scroll", requestActiveUpdate, { passive: true });
  window.addEventListener("resize", requestActiveUpdate);
  updateActiveSection();

  const isWorkshopLocation = () => new URLSearchParams(window.location.search).get("view") === "workshop";

  const renderWorkshop = (open, { restoreScroll = true } = {}) => {
    if (!workshopView) return;
    if (open) {
      portfolioScroll = window.scrollY;
      workshopView.hidden = false;
      document.body.classList.add("workshop-open");
      document.title = localizedTitle(true);
      window.scrollTo(0, 0);
      workshopView.querySelector("[data-close-workshop]")?.focus({ preventScroll: true });
    } else {
      document.body.classList.remove("workshop-open");
      workshopView.hidden = true;
      document.title = localizedTitle(false);
      if (restoreScroll) window.scrollTo(0, portfolioScroll);
      workshopOpeners[0]?.focus({ preventScroll: true });
    }
  };

  workshopOpeners.forEach((opener) => opener.addEventListener("click", (event) => {
    event.preventDefault();
    const url = new URL(window.location.href);
    url.searchParams.set("view", "workshop");
    window.history.pushState({ view: "workshop" }, "", `${url.pathname}${url.search}${url.hash}`);
    renderWorkshop(true);
  }));

  workshopClosers.forEach((closer) => closer.addEventListener("click", () => {
    if (isWorkshopLocation()) window.history.back();
    else renderWorkshop(false);
  }));

  window.addEventListener("popstate", () => renderWorkshop(isWorkshopLocation()));
  window.addEventListener("portfolio:languagechange", () => {
    document.title = localizedTitle(!workshopView?.hidden);
  });
  if (isWorkshopLocation()) renderWorkshop(true, { restoreScroll: false });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || workshopView?.hidden) return;
    if (isWorkshopLocation()) window.history.back();
    else renderWorkshop(false);
  });

  const revealItems = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { rootMargin: stableTouchLayout ? "0px 0px -3%" : "0px 0px -8%", threshold: stableTouchLayout ? 0.03 : 0.08 });

    revealItems.forEach((item) => revealObserver.observe(item));
  }
})();
