(() => {
  "use strict";

  const header = document.querySelector("[data-header]");
  const navLinks = [...document.querySelectorAll(".site-nav a")];
  const sectionLinks = [...document.querySelectorAll('.wordmark[href^="#"], .site-nav a[href^="#"], .hero-actions a[href^="#"]')];
  const sections = navLinks.map((link) => document.querySelector(link.getAttribute("href"))).filter(Boolean);
  const stepSections = [...document.querySelectorAll("#main-content > section")];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const workshopView = document.querySelector("[data-workshop-view]");
  const workshopTransition = document.querySelector("[data-workshop-transition]");
  const workshopOpeners = [...document.querySelectorAll("[data-open-workshop]")];
  const workshopClosers = [...document.querySelectorAll("[data-close-workshop]")];
  const previousSectionButton = document.querySelector("[data-previous-section]");
  const themeColor = document.querySelector('meta[name="theme-color"]');
  const copyButtons = [...document.querySelectorAll("[data-copy-email]")];
  const contactLinkActions = [...document.querySelectorAll(".contact-link-action")];
  const copyToast = document.querySelector("[data-copy-toast]");

  if ("scrollRestoration" in window.history) {
    window.history.scrollRestoration = "manual";
  }

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

  let sectionScrollFrame = 0;
  let resolveSectionScroll = null;

  const cancelSectionScroll = () => {
    if (sectionScrollFrame) window.cancelAnimationFrame(sectionScrollFrame);
    sectionScrollFrame = 0;
    if (resolveSectionScroll) resolveSectionScroll(false);
    resolveSectionScroll = null;
  };

  const sectionScrollEase = (progress) => progress * progress * progress * (progress * (progress * 6 - 15) + 10);

  const animateScrollPosition = (top) => {
    cancelSectionScroll();

    const startTop = window.scrollY;
    const distance = top - startTop;
    if (reduceMotion || Math.abs(distance) < 2) {
      jumpToScrollPosition(top);
      return Promise.resolve(true);
    }

    const viewport = Math.max(window.innerHeight, 1);
    const screenDistance = Math.min(4, Math.abs(distance) / viewport);
    const duration = Math.round(1250 + screenDistance * 260);
    const startedAt = performance.now();

    return new Promise((resolve) => {
      resolveSectionScroll = resolve;

      const step = (now) => {
        const progress = Math.min(1, (now - startedAt) / duration);
        window.scrollTo({
          top: startTop + distance * sectionScrollEase(progress),
          left: 0,
          behavior: "auto",
        });

        if (progress < 1) {
          sectionScrollFrame = window.requestAnimationFrame(step);
          return;
        }

        sectionScrollFrame = 0;
        resolveSectionScroll = null;
        resolve(true);
      };

      sectionScrollFrame = window.requestAnimationFrame(step);
    });
  };

  window.addEventListener("wheel", cancelSectionScroll, { passive: true });
  window.addEventListener("touchstart", cancelSectionScroll, { passive: true });
  window.addEventListener("keydown", (event) => {
    if (["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "].includes(event.key)) {
      cancelSectionScroll();
    }
  });

  const getHeaderOffset = () => {
    if (!header) return 0;
    const position = window.getComputedStyle(header).position;
    return position === "fixed" || position === "sticky"
      ? header.getBoundingClientRect().height
      : 0;
  };

  const getCurrentSectionIndex = () => {
    const documentHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
    if (window.scrollY + window.innerHeight >= documentHeight - 2) return Math.max(0, sections.length - 1);

    const probe = window.scrollY + getHeaderOffset() + 24;
    let currentIndex = 0;
    sections.forEach((section, index) => {
      if (section.offsetTop <= probe) currentIndex = index;
    });
    return currentIndex;
  };

  const getCurrentStepSectionIndex = () => {
    const documentHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
    if (window.scrollY + window.innerHeight >= documentHeight - 2) return Math.max(0, stepSections.length - 1);

    const probe = window.scrollY + getHeaderOffset() + 24;
    let currentIndex = 0;
    stepSections.forEach((section, index) => {
      if (section.offsetTop <= probe) currentIndex = index;
    });
    return currentIndex;
  };

  const sectionLabel = (section) => {
    const matchingLink = navLinks.find((link) => link.getAttribute("href") === `#${section?.id}`);
    const heading = section?.querySelector("h1, h2");
    return matchingLink?.textContent?.trim() || heading?.textContent?.trim() || "previous section";
  };

  const updatePreviousSectionButton = () => {
    if (!previousSectionButton) return;

    const workshopOpen = document.documentElement.classList.contains("workshop-open");
    if (workshopOpen || window.innerWidth < 1340) {
      previousSectionButton.classList.remove("is-visible", "is-navigating");
      previousSectionButton.disabled = true;
      return;
    }

    const currentIndex = getCurrentStepSectionIndex();
    const previousSection = currentIndex > 0 ? stepSections[currentIndex - 1] : null;
    previousSectionButton.classList.toggle("is-visible", Boolean(previousSection));
    previousSectionButton.disabled = !previousSection;

    const label = previousSection
      ? `Previous section: ${sectionLabel(previousSection)}`
      : "Previous section";
    previousSectionButton.setAttribute("aria-label", label);
    previousSectionButton.setAttribute("title", label);
  };

  const yearTarget = document.querySelector("[data-year]");
  if (yearTarget) yearTarget.textContent = String(new Date().getFullYear());

  let scrollFrame = 0;
  let lastHeaderScrollY = Math.max(window.scrollY, 0);
  let headerTravel = 0;
  let headerDirection = 0;

  const updateScrollInterface = () => {
    const currentY = Math.max(window.scrollY, 0);
    const delta = currentY - lastHeaderScrollY;
    header?.classList.toggle("is-scrolled", currentY > 14);

    if (header) {
      if (currentY <= 24) {
        header.classList.remove("is-hidden");
        headerTravel = 0;
        headerDirection = 0;
      } else if (Math.abs(delta) >= 1) {
        const direction = delta > 0 ? 1 : -1;
        if (direction !== headerDirection) {
          headerDirection = direction;
          headerTravel = 0;
        }
        headerTravel += delta;

        if (direction > 0 && currentY > 130 && headerTravel > 44) {
          header.classList.add("is-hidden");
          headerTravel = 0;
        } else if (direction < 0 && headerTravel < -28) {
          header.classList.remove("is-hidden");
          headerTravel = 0;
        }
      }
    }

    lastHeaderScrollY = currentY;
    scrollFrame = 0;
  };

  const requestScrollInterface = () => {
    if (scrollFrame) return;
    scrollFrame = window.requestAnimationFrame(updateScrollInterface);
  };

  window.addEventListener("scroll", requestScrollInterface, { passive: true });
  window.addEventListener("resize", () => {
    lastHeaderScrollY = Math.max(window.scrollY, 0);
    headerTravel = 0;
    requestScrollInterface();
    updatePreviousSectionButton();
  });
  updateScrollInterface();

  let programmaticSectionScroll = false;
  let sectionNavigationToken = 0;

  const updateActiveSection = () => {
    if (programmaticSectionScroll || !sections.length) return;
    const activeSection = sections[getCurrentSectionIndex()] || sections[0];
    navLinks.forEach((link) => {
      const active = link.getAttribute("href") === `#${activeSection?.id}`;
      link.classList.toggle("is-active", active);
      if (active) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
    updatePreviousSectionButton();
  };

  const scrollToSection = (link, { updateHistory = true } = {}) => {
    const hash = link.getAttribute("href");
    if (!hash?.startsWith("#")) return Promise.resolve(false);

    const target = document.querySelector(hash);
    if (!target) return Promise.resolve(false);

    const top = hash === "#home"
      ? 0
      : Math.max(0, target.getBoundingClientRect().top + window.scrollY - getHeaderOffset() - 12);
    const navigationToken = ++sectionNavigationToken;

    programmaticSectionScroll = true;
    document.body.classList.add("is-section-scrolling");

    navLinks.forEach((item) => {
      const active = item.getAttribute("href") === hash;
      item.classList.toggle("is-active", active);
      if (active) item.setAttribute("aria-current", "location");
      else item.removeAttribute("aria-current");
    });

    if (updateHistory && window.location.hash !== hash) window.history.pushState({}, "", hash);

    return animateScrollPosition(top).finally(() => {
      if (navigationToken !== sectionNavigationToken) return;
      programmaticSectionScroll = false;
      document.body.classList.remove("is-section-scrolling");
      updateActiveSection();
      updatePreviousSectionButton();
    });
  };

  let previousSectionBusy = false;
  previousSectionButton?.addEventListener("click", () => {
    if (previousSectionBusy || workshopTransitioning) return;
    const currentIndex = getCurrentStepSectionIndex();
    if (currentIndex <= 0) return updatePreviousSectionButton();

    const targetSection = stepSections[currentIndex - 1];
    const targetLink = sectionLinks.find((link) => link.getAttribute("href") === `#${targetSection.id}`);
    if (!targetLink) return;

    previousSectionBusy = true;
    previousSectionButton.classList.add("is-navigating");
    Promise.resolve(scrollToSection(targetLink, { updateHistory: false })).finally(() => {
      previousSectionBusy = false;
      previousSectionButton.classList.remove("is-navigating");
      previousSectionButton.blur();
      updatePreviousSectionButton();
    });
  });

  let navigationInteractionToken = 0;
  const clearNavigationFeedback = (except = null) => {
    document.querySelectorAll(".site-nav a.is-nav-activating").forEach((item) => {
      if (item === except) return;
      item.classList.remove("is-nav-activating");
      item.removeAttribute("aria-busy");
    });
  };
  const holdNavigationFeedback = (duration) => duration > 0
    ? new Promise((resolve) => window.setTimeout(resolve, duration))
    : Promise.resolve();

  sectionLinks.forEach((link) => link.addEventListener("click", async (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();

    const interactionToken = ++navigationInteractionToken;
    const headerNavigationLink = link.matches(".site-nav a");
    clearNavigationFeedback(link);

    if (headerNavigationLink) {
      link.classList.add("is-nav-activating");
      link.setAttribute("aria-busy", "true");
      await holdNavigationFeedback(reduceMotion ? 0 : 460);
      if (interactionToken !== navigationInteractionToken) return;
    }

    await Promise.resolve(scrollToSection(link));
    if (interactionToken !== navigationInteractionToken) return;

    if (headerNavigationLink) {
      await holdNavigationFeedback(reduceMotion ? 0 : 140);
      link.classList.remove("is-nav-activating");
      link.removeAttribute("aria-busy");
      link.blur();
    }
  }));

  let activeFrame = 0;
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
  updatePreviousSectionButton();

  let copyToastTimer = 0;
  let copyButtonTimer = 0;

  const clearCopyFeedback = () => {
    window.clearTimeout(copyToastTimer);
    window.clearTimeout(copyButtonTimer);
    copyToast?.classList.remove("is-visible", "is-error");
    if (copyToast) copyToast.textContent = "";
    copyButtons.forEach((button) => {
      button.classList.remove("is-copied");
      button.setAttribute("aria-label", button.dataset.copyLabel || "Copy email address");
    });
  };

  const showCopyToast = (message, success = true) => {
    if (!copyToast) return;
    window.clearTimeout(copyToastTimer);
    copyToast.textContent = message;
    copyToast.classList.toggle("is-error", !success);
    copyToast.classList.add("is-visible");
    copyToastTimer = window.setTimeout(() => {
      copyToast.classList.remove("is-visible", "is-error");
      window.setTimeout(() => { copyToast.textContent = ""; }, reduceMotion ? 0 : 220);
    }, reduceMotion ? 1300 : 1800);
  };

  const copyText = async (value) => {
    if (navigator.clipboard?.writeText && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(value);
        return;
      } catch {
        // Fall back to a selection-based copy for browsers that expose but reject Clipboard API calls.
      }
    }

    const fallback = document.createElement("textarea");
    fallback.value = value;
    fallback.setAttribute("readonly", "");
    fallback.setAttribute("aria-hidden", "true");
    Object.assign(fallback.style, {
      position: "fixed",
      top: "0",
      left: "-9999px",
      width: "1px",
      height: "1px",
      padding: "0",
      border: "0",
      fontSize: "16px",
      opacity: "0",
      pointerEvents: "none",
    });
    document.body.appendChild(fallback);
    try { fallback.focus({ preventScroll: true }); } catch { fallback.focus(); }
    fallback.select();
    fallback.setSelectionRange(0, fallback.value.length);
    const copied = document.execCommand("copy");
    fallback.remove();
    if (!copied) throw new Error("Copy command was not accepted");
  };

  copyButtons.forEach((button) => {
    button.addEventListener("click", async (event) => {
      event.preventDefault();
      event.stopPropagation();
      const email = button.dataset.copyEmail;
      if (!email) return;

      try {
        await copyText(email);
        window.clearTimeout(copyButtonTimer);
        copyButtons.forEach((item) => {
          item.classList.remove("is-copied");
          item.setAttribute("aria-label", item.dataset.copyLabel || "Copy email address");
        });
        button.classList.add("is-copied");
        button.setAttribute("aria-label", "Email copied successfully");
        showCopyToast("Copied successfully");
        copyButtonTimer = window.setTimeout(() => {
          button.classList.remove("is-copied");
          button.setAttribute("aria-label", button.dataset.copyLabel || "Copy email address");
        }, reduceMotion ? 1100 : 1700);
      } catch {
        showCopyToast("Copy failed — please copy the address manually", false);
      } finally {
        button.blur();
      }
    });
  });

  contactLinkActions.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.stopPropagation();
      link.blur();
    });
  });

  const isWorkshopLocation = () => new URLSearchParams(window.location.search).get("view") === "workshop";
  const initialHashLink = sectionLinks.find((link) => link.getAttribute("href") === window.location.hash);
  if (initialHashLink && !isWorkshopLocation()) {
    window.requestAnimationFrame(() => scrollToSection(initialHashLink, { updateHistory: false }));
  }

  const renderWorkshop = (open, { restoreScroll = true } = {}) => {
    if (!workshopView) return;
    workshopScrollTarget = open ? 0 : (restoreScroll ? portfolioScroll : 0);
    document.documentElement.classList.toggle("workshop-open", open);
    themeColor?.setAttribute("content", open ? "#08131d" : "#07111a");

    if (open) {
      clearCopyFeedback();
      portfolioScroll = window.scrollY;
      jumpToScrollPosition(0);
      document.activeElement?.blur?.();
      workshopView.hidden = false;
      document.body.classList.add("workshop-open");
      document.title = pageTitle(true);
      settleScrollPosition(0);
      workshopView.querySelector("[data-close-workshop]")?.focus({ preventScroll: true });
    } else {
      document.body.classList.remove("workshop-open");
      workshopView.hidden = true;
      document.title = pageTitle(false);
      if (restoreScroll) settleScrollPosition(portfolioScroll);
      workshopOpeners[0]?.focus({ preventScroll: true });
    }
    updatePreviousSectionButton();
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
    const easing = "cubic-bezier(0.33, 1, 0.68, 1)";
    let coverAnimation;
    let revealAnimation;

    document.body.classList.add("workshop-transitioning");
    workshopTransition.classList.toggle("is-reverse", !open);
    workshopTransition.classList.add("is-active");

    try {
      coverAnimation = workshopTransition.animate(
        [{ transform: coverStart }, { transform: "translate3d(0, 0, 0)" }],
        { duration: 520, easing, fill: "forwards" },
      );
      await coverAnimation.finished;
      await swapView();
      await nextPaint();

      revealAnimation = workshopTransition.animate(
        [{ transform: "translate3d(0, 0, 0)" }, { transform: revealEnd }],
        { duration: 600, easing, fill: "forwards" },
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
    if (workshopTransitioning) return Promise.resolve(false);
    return runWorkshopTransition(false, async () => {
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

  let workshopActionPending = false;

  workshopOpeners.forEach((opener) => opener.addEventListener("click", async (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (workshopActionPending || workshopTransitioning) return;
    workshopActionPending = true;

    try {
      await runWorkshopTransition(true, () => {
        const url = new URL(window.location.href);
        url.searchParams.set("view", "workshop");
        window.history.pushState({ view: "workshop", portfolioWorkshop: true }, "", `${url.pathname}${url.search}${url.hash}`);
        renderWorkshop(true);
      });
    } finally {
      workshopActionPending = false;
    }
  }));

  workshopClosers.forEach((closer) => closer.addEventListener("click", async (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (workshopActionPending || workshopTransitioning) return;
    workshopActionPending = true;
    try { await returnToPortfolio(); } finally { workshopActionPending = false; }
  }));

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
    if (open === workshopIsOpen) {
      if (!open) {
        const matchingLink = navLinks.find((link) => link.getAttribute("href") === window.location.hash);
        if (matchingLink) scrollToSection(matchingLink, { updateHistory: false });
        else if (!window.location.hash) void animateScrollPosition(0);
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
    if (event.key === "Escape" && workshopView && !workshopView.hidden) void returnToPortfolio();
  });
})();
