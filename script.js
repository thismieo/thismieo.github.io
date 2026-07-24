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
  const workshopTransition = document.querySelector("[data-workshop-transition]");
  const workshopOpeners = [...document.querySelectorAll("[data-open-workshop]")];
  const workshopClosers = [...document.querySelectorAll("[data-close-workshop]")];
  const backToTop = document.querySelector("[data-back-to-top]");
  const themeColor = document.querySelector('meta[name="theme-color"]');
  let portfolioScroll = 0;
  let workshopTransitioning = false;
  let workshopScrollTarget = null;
  let transitionControlsPopstate = false;
  let resolveTransitionPopstate = null;

  const pageTitle = (workshop = false) => workshop
    ? "The Workshop | Mohammed Muayad"
    : "Mohammed Muayad | AI Engineering & Applied AI";

  const jumpToScrollPosition = (top) => {
    const previousBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "auto";
    window.scrollTo({ top, left: 0, behavior: "auto" });
    document.documentElement.style.scrollBehavior = previousBehavior;
  };

  const settleScrollPosition = (top) => {
    jumpToScrollPosition(top);
    window.requestAnimationFrame(() => jumpToScrollPosition(top));
  };

  document.querySelector("[data-year]").textContent = String(new Date().getFullYear());

  let lastScrollY = window.scrollY;
  let scrollFrame = 0;
  const updateScrollInterface = () => {
    const currentY = Math.max(window.scrollY, 0);

    header?.classList.toggle("is-scrolled", currentY > 14);
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

  if (!stableTouchLayout) {
    window.addEventListener("scroll", requestScrollInterface, { passive: true });
    window.addEventListener("resize", requestScrollInterface);
    updateScrollInterface();
  } else {
    header?.classList.remove("is-hidden", "is-scrolled");
    const updateMobileUtilities = () => {
      const currentY = Math.max(window.scrollY, 0);
      backToTop?.classList.toggle("is-visible", currentY > Math.min(720, window.innerHeight * 0.8));
      scrollFrame = 0;
    };
    const requestMobileUtilities = () => {
      if (scrollFrame) return;
      scrollFrame = window.requestAnimationFrame(updateMobileUtilities);
    };
    window.addEventListener("scroll", requestMobileUtilities, { passive: true });
    updateMobileUtilities();
  }

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

  const scrollToSection = (link, { updateHistory = true } = {}) => {
    const hash = link.getAttribute("href");
    if (!hash || !hash.startsWith("#")) return;

    const target = document.querySelector(hash);
    if (!target) return;

    const headerPosition = header ? window.getComputedStyle(header).position : "static";
    const headerOffset = header && (headerPosition === "fixed" || headerPosition === "sticky")
      ? header.getBoundingClientRect().height
      : 0;
    const top = Math.max(0, target.getBoundingClientRect().top + window.scrollY - headerOffset - 12);

    header?.classList.remove("is-hidden");
    closeMenu();

    navLinks.forEach((item) => {
      const active = item === link;
      item.classList.toggle("is-active", active);
      if (active) item.setAttribute("aria-current", "page");
      else item.removeAttribute("aria-current");
    });

    if (updateHistory && window.location.hash !== hash) {
      window.history.pushState({}, "", hash);
    }

    window.scrollTo({
      top,
      left: 0,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

  navLinks.forEach((link) => link.addEventListener("click", (event) => {
    event.preventDefault();
    scrollToSection(link);
  }));
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

  if (!stableTouchLayout) {
    window.addEventListener("scroll", requestActiveUpdate, { passive: true });
    window.addEventListener("resize", requestActiveUpdate);
  }
  updateActiveSection();

  const isWorkshopLocation = () => new URLSearchParams(window.location.search).get("view") === "workshop";

  const renderWorkshop = (open, { restoreScroll = true } = {}) => {
    if (!workshopView) return;
    workshopScrollTarget = open ? 0 : (restoreScroll ? portfolioScroll : 0);
    document.documentElement.classList.toggle("workshop-open", open);
    themeColor?.setAttribute("content", open ? "#080c0e" : "#0d0f0f");
    if (open) {
      portfolioScroll = window.scrollY;
      jumpToScrollPosition(0);
      document.activeElement?.blur?.();
      workshopView.hidden = false;
      document.body.classList.add("workshop-open");
      document.title = pageTitle(true);
      settleScrollPosition(0);
      if (!stableTouchLayout) workshopView.querySelector("[data-close-workshop]")?.focus({ preventScroll: true });
    } else {
      document.body.classList.remove("workshop-open");
      workshopView.hidden = true;
      document.title = pageTitle(false);
      if (restoreScroll) settleScrollPosition(portfolioScroll);
      if (!stableTouchLayout) workshopOpeners[0]?.focus({ preventScroll: true });
    }
  };

  const nextPaint = () => new Promise((resolve) => window.requestAnimationFrame(resolve));

  const runWorkshopTransition = async (open, swapView) => {
    if (workshopTransitioning) return;
    workshopTransitioning = true;
    workshopScrollTarget = null;
    const previousScrollBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "auto";
    window.scrollTo({ top: window.scrollY, left: 0, behavior: "auto" });

    if (reduceMotion || !workshopTransition || typeof workshopTransition.animate !== "function") {
      try {
        await swapView();
        if (workshopScrollTarget !== null) jumpToScrollPosition(workshopScrollTarget);
        await nextPaint();
        if (workshopScrollTarget !== null) jumpToScrollPosition(workshopScrollTarget);
      } finally {
        document.documentElement.style.scrollBehavior = previousScrollBehavior;
        workshopTransitioning = false;
      }
      return;
    }

    const coverStart = open ? "translate3d(0, 120%, 0)" : "translate3d(0, -120%, 0)";
    const revealEnd = open ? "translate3d(0, -120%, 0)" : "translate3d(0, 120%, 0)";
    const easing = "cubic-bezier(0.76, 0, 0.24, 1)";
    let coverAnimation;
    let revealAnimation;

    document.body.classList.add("workshop-transitioning");
    workshopTransition.classList.toggle("is-reverse", !open);
    workshopTransition.classList.add("is-active");

    try {
      coverAnimation = workshopTransition.animate(
        [{ transform: coverStart }, { transform: "translate3d(0, 0, 0)" }],
        { duration: 250, easing, fill: "forwards" }
      );
      await coverAnimation.finished;
      await swapView();
      await nextPaint();

      revealAnimation = workshopTransition.animate(
        [{ transform: "translate3d(0, 0, 0)" }, { transform: revealEnd }],
        { duration: 280, easing, fill: "forwards" }
      );
      coverAnimation.cancel();
      await revealAnimation.finished;
    } catch (error) {
      if (error?.name !== "AbortError") console.error("Workshop transition failed", error);
    } finally {
      coverAnimation?.cancel();
      revealAnimation?.cancel();
      document.body.style.overflowY = "auto";
      void document.body.offsetHeight;
      if (workshopScrollTarget !== null) jumpToScrollPosition(workshopScrollTarget);
      await nextPaint();
      if (workshopScrollTarget !== null) jumpToScrollPosition(workshopScrollTarget);
      document.body.classList.remove("workshop-transitioning");
      document.body.style.removeProperty("overflow-y");
      document.documentElement.style.scrollBehavior = previousScrollBehavior;
      workshopTransition.classList.remove("is-active", "is-reverse");
      workshopTransitioning = false;
    }
  };

  const returnToPortfolio = () => {
    if (workshopTransitioning) return;

    void runWorkshopTransition(false, async () => {
      const openedFromPortfolio = window.history.state?.portfolioWorkshop === true;
      if (isWorkshopLocation() && openedFromPortfolio) {
        await new Promise((resolve) => {
          transitionControlsPopstate = true;
          resolveTransitionPopstate = resolve;
          window.history.back();
        });
        return;
      }

      const url = new URL(window.location.href);
      url.searchParams.delete("view");
      window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
      renderWorkshop(false, { restoreScroll: false });
      settleScrollPosition(0);
    });
  };

  workshopOpeners.forEach((opener) => opener.addEventListener("click", (event) => {
    event.preventDefault();
    if (workshopTransitioning) return;

    void runWorkshopTransition(true, () => {
      const url = new URL(window.location.href);
      url.searchParams.set("view", "workshop");
      window.history.pushState({ view: "workshop", portfolioWorkshop: true }, "", `${url.pathname}${url.search}${url.hash}`);
      renderWorkshop(true);
    });
  }));

  workshopClosers.forEach((closer) => closer.addEventListener("click", returnToPortfolio));

  window.addEventListener("popstate", () => {
    const open = isWorkshopLocation();

    if (transitionControlsPopstate) {
      transitionControlsPopstate = false;
      renderWorkshop(open);
      resolveTransitionPopstate?.();
      resolveTransitionPopstate = null;
      return;
    }

    const workshopIsOpen = document.documentElement.classList.contains("workshop-open");

    // Hash-only history changes belong to the portfolio navigation. They must
    // never trigger the full-screen Workshop transition.
    if (open === workshopIsOpen) {
      if (!open) {
        const matchingLink = navLinks.find((link) => link.getAttribute("href") === window.location.hash);
        if (matchingLink) scrollToSection(matchingLink, { updateHistory: false });
        else if (!window.location.hash) window.scrollTo({ top: 0, left: 0, behavior: reduceMotion ? "auto" : "smooth" });
      }
      return;
    }

    if (workshopTransitioning) {
      renderWorkshop(open);
      return;
    }

    void runWorkshopTransition(open, () => renderWorkshop(open));
  });
  if (isWorkshopLocation()) renderWorkshop(true, { restoreScroll: false });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || workshopView?.hidden) return;
    returnToPortfolio();
  });

  const pressTargets = [...document.querySelectorAll(
    ".facts > div, .project-card, .workshop-entry, .contact-card, .workshop-card, .current-track-card"
  )];
  const pressStates = new WeakMap();
  const pressPulseTimers = new WeakMap();

  const clearPressState = (target) => {
    const state = pressStates.get(target);
    if (state?.holdTimer) window.clearTimeout(state.holdTimer);
    target.classList.remove("is-pressing");
    pressStates.delete(target);
  };

  const pulsePress = (target) => {
    const previousPulseTimer = pressPulseTimers.get(target);
    if (previousPulseTimer) window.clearTimeout(previousPulseTimer);
    target.classList.remove("is-pressing", "is-pressed");
    void target.offsetWidth;
    target.classList.add("is-pressed");
    const pulseTimer = window.setTimeout(() => {
      target.classList.remove("is-pressed");
      pressPulseTimers.delete(target);
    }, reduceMotion ? 120 : 360);
    pressPulseTimers.set(target, pulseTimer);
  };

  pressTargets.forEach((target) => {
    target.addEventListener("pointerdown", (event) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      clearPressState(target);
      const previousPulseTimer = pressPulseTimers.get(target);
      if (previousPulseTimer) window.clearTimeout(previousPulseTimer);
      pressPulseTimers.delete(target);
      target.classList.remove("is-pressed");
      const state = {
        x: event.clientX,
        y: event.clientY,
        moved: false,
        holdTimer: window.setTimeout(() => {
          if (!state.moved) target.classList.add("is-pressing");
        }, 90),
      };
      pressStates.set(target, state);
    }, { passive: true });

    target.addEventListener("pointermove", (event) => {
      const state = pressStates.get(target);
      if (!state || state.moved) return;
      if (Math.hypot(event.clientX - state.x, event.clientY - state.y) <= 9) return;
      state.moved = true;
      clearPressState(target);
    }, { passive: true });

    target.addEventListener("pointerup", () => {
      const state = pressStates.get(target);
      if (!state || state.moved) return clearPressState(target);
      clearPressState(target);
      pulsePress(target);
    }, { passive: true });

    target.addEventListener("pointercancel", () => clearPressState(target), { passive: true });
    target.addEventListener("pointerleave", (event) => {
      if (event.pointerType === "mouse") clearPressState(target);
    }, { passive: true });

    target.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") target.classList.add("is-pressing");
    });
    target.addEventListener("keyup", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      pulsePress(target);
    });
  });
})();
