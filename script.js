(() => {
  "use strict";

  const header = document.querySelector("[data-header]");
  const nav = document.querySelector("[data-nav]");
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const navLinks = [...document.querySelectorAll(".wordmark, .site-nav a")];
  const sectionLinks = [...document.querySelectorAll('.wordmark[href^="#"], .site-nav a[href^="#"], .hero-actions a[href^="#"]')];
  const sections = navLinks.map((link) => document.querySelector(link.getAttribute("href"))).filter(Boolean);
  const stepSections = [...document.querySelectorAll("#main-content > section")];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const stableTouchLayout = window.matchMedia("(max-width: 700px), (hover: none), (pointer: coarse)").matches;
  const compactNavQuery = window.matchMedia("(max-width: 700px)");
  const workshopView = document.querySelector("[data-workshop-view]");
  const workshopTransition = document.querySelector("[data-workshop-transition]");
  const workshopOpeners = [...document.querySelectorAll("[data-open-workshop]")];
  const workshopClosers = [...document.querySelectorAll("[data-close-workshop]")];
  const previousSectionButton = document.querySelector("[data-previous-section]");
  const themeColor = document.querySelector('meta[name="theme-color"]');
  const copyButtons = [...document.querySelectorAll("[data-copy-email]")];
  const contactCards = [...document.querySelectorAll(".contact-card")];
  const contactLinkActions = [...document.querySelectorAll(".contact-link-action")];
  const copyToast = document.querySelector("[data-copy-toast]");
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
        const eased = sectionScrollEase(progress);
        window.scrollTo({
          top: startTop + distance * eased,
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
    const atDocumentEnd = window.scrollY + window.innerHeight >= documentHeight - 2;
    if (atDocumentEnd) return Math.max(0, sections.length - 1);

    const probe = window.scrollY + getHeaderOffset() + 24;
    let currentIndex = 0;

    sections.forEach((section, index) => {
      if (section.offsetTop <= probe) currentIndex = index;
    });

    return currentIndex;
  };

  const getCurrentStepSectionIndex = () => {
    const documentHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
    const atDocumentEnd = window.scrollY + window.innerHeight >= documentHeight - 2;
    if (atDocumentEnd) return Math.max(0, stepSections.length - 1);

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

    const currentIndex = getCurrentStepSectionIndex();
    const previousSection = currentIndex > 0 ? stepSections[currentIndex - 1] : null;
    const workshopOpen = document.documentElement.classList.contains("workshop-open");
    const visible = Boolean(previousSection) && !workshopOpen;

    previousSectionButton.classList.toggle("is-visible", visible);
    previousSectionButton.disabled = !visible;

    if (previousSection) {
      const label = `Previous section: ${sectionLabel(previousSection)}`;
      previousSectionButton.setAttribute("aria-label", label);
      previousSectionButton.setAttribute("title", label);
    } else {
      previousSectionButton.setAttribute("aria-label", "Previous section");
      previousSectionButton.setAttribute("title", "Previous section");
    }
  };

  document.querySelector("[data-year]").textContent = String(new Date().getFullYear());

  let lastScrollY = window.scrollY;
  let scrollFrame = 0;
  const updateScrollInterface = () => {
    const currentY = Math.max(window.scrollY, 0);

    header?.classList.toggle("is-scrolled", currentY > 14);
    updatePreviousSectionButton();

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
      updatePreviousSectionButton();
      scrollFrame = 0;
    };
    const requestMobileUtilities = () => {
      if (scrollFrame) return;
      scrollFrame = window.requestAnimationFrame(updateMobileUtilities);
    };
    window.addEventListener("scroll", requestMobileUtilities, { passive: true });
    updateMobileUtilities();
  }

  let previousSectionBusy = false;
  previousSectionButton?.addEventListener("click", () => {
    if (previousSectionBusy || workshopTransitioning) return;

    const currentIndex = getCurrentStepSectionIndex();
    if (currentIndex <= 0) {
      updatePreviousSectionButton();
      return;
    }

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

  let programmaticSectionScroll = false;
  let sectionNavigationToken = 0;

  const scrollToSection = (link, { updateHistory = true } = {}) => {
    const hash = link.getAttribute("href");
    if (!hash || !hash.startsWith("#")) return Promise.resolve(false);

    const target = document.querySelector(hash);
    if (!target) return Promise.resolve(false);

    const top = hash === "#home"
      ? 0
      : Math.max(0, target.getBoundingClientRect().top + window.scrollY - getHeaderOffset() - 12);
    const navigationToken = ++sectionNavigationToken;

    header?.classList.remove("is-hidden");
    closeMenu();
    programmaticSectionScroll = true;
    document.body.classList.add("is-section-scrolling");

    navLinks.forEach((item) => {
      const active = item.getAttribute("href") === hash;
      item.classList.toggle("is-active", active);
      if (active) item.setAttribute("aria-current", "page");
      else item.removeAttribute("aria-current");
    });

    if (updateHistory && window.location.hash !== hash) {
      window.history.pushState({}, "", hash);
    }

    return animateScrollPosition(top).finally(() => {
      if (navigationToken !== sectionNavigationToken) return;
      programmaticSectionScroll = false;
      document.body.classList.remove("is-section-scrolling");
      header?.classList.remove("is-hidden");
      updateActiveSection();
      updatePreviousSectionButton();
    });
  };

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
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  let activeFrame = 0;
  const updateActiveSection = () => {
    if (programmaticSectionScroll) return;
    const activeSection = sections[getCurrentSectionIndex()] || sections[0];

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
  updatePreviousSectionButton();

  let copyToastTimer = 0;
  let copyButtonTimer = 0;

  const showCopyToast = (message, success = true) => {
    if (!copyToast) return;
    window.clearTimeout(copyToastTimer);
    copyToast.textContent = "";
    void copyToast.offsetWidth;
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
      } catch (error) {
        // Some mobile browsers expose the Clipboard API but still reject it.
        // Fall through to the selection-based copy method below.
        console.warn("Clipboard API unavailable; using fallback copy", error);
      }
    }

    const fallback = document.createElement("textarea");
    fallback.value = value;
    fallback.setAttribute("readonly", "");
    fallback.setAttribute("aria-hidden", "true");
    fallback.style.position = "fixed";
    fallback.style.top = "0";
    fallback.style.left = "-9999px";
    fallback.style.width = "1px";
    fallback.style.height = "1px";
    fallback.style.padding = "0";
    fallback.style.border = "0";
    fallback.style.fontSize = "16px";
    fallback.style.opacity = "0";
    fallback.style.pointerEvents = "none";
    document.body.appendChild(fallback);

    try {
      fallback.focus({ preventScroll: true });
    } catch {
      fallback.focus();
    }
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
      } catch (error) {
        console.error("Email copy failed", error);
        showCopyToast("Copy failed — please copy the address manually", false);
      } finally {
        // Prevent touch browsers from leaving a persistent focused/pressed state.
        button.blur();
      }
    });
  });

  contactLinkActions.forEach((link) => {
    link.addEventListener("click", (event) => {
      // The dedicated arrow is the only navigation control. Keep its interaction
      // completely separate from the surrounding visual card.
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
    themeColor?.setAttribute("content", open ? "#080c0e" : "#0d0f0f");
    if (open) {
      portfolioScroll = window.scrollY;
      jumpToScrollPosition(0);
      document.activeElement?.blur?.();
      workshopView.hidden = false;
      document.body.classList.add("workshop-open");
      document.title = pageTitle(true);
      settleScrollPosition(0);
      workshopView.querySelector("[data-close-workshop]")?.focus({ preventScroll: true });
      updatePreviousSectionButton();
    } else {
      document.body.classList.remove("workshop-open");
      workshopView.hidden = true;
      document.title = pageTitle(false);
      if (restoreScroll) settleScrollPosition(portfolioScroll);
      workshopOpeners[0]?.focus({ preventScroll: true });
      updatePreviousSectionButton();
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
    /* One calm transition rhythm is shared by entry and exit on every layout. */
    const transitionTiming = { cover: 520, reveal: 600 };
    const easing = "cubic-bezier(0.33, 1, 0.68, 1)";
    let coverAnimation;
    let revealAnimation;

    document.body.classList.add("workshop-transitioning");
    workshopTransition.classList.toggle("is-reverse", !open);
    workshopTransition.classList.add("is-active");

    try {
      coverAnimation = workshopTransition.animate(
        [{ transform: coverStart }, { transform: "translate3d(0, 0, 0)" }],
        { duration: transitionTiming.cover, easing, fill: "forwards" }
      );
      await coverAnimation.finished;
      await swapView();
      await nextPaint();

      revealAnimation = workshopTransition.animate(
        [{ transform: "translate3d(0, 0, 0)" }, { transform: revealEnd }],
        { duration: transitionTiming.reveal, easing, fill: "forwards" }
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

  // Only the dedicated Workshop action controls open or close the view.
  // The Workshop card itself is handled later as a visual press surface only.
  const workshopPressTargets = [...new Set([...workshopOpeners, ...workshopClosers])];
  const workshopPressStates = new WeakMap();
  const workshopPressTimers = new WeakMap();
  const workshopPressHoldDelay = 110;
  const workshopActionDelay = reduceMotion ? 0 : 300;
  let workshopActionPending = false;

  const clearWorkshopPress = (target, { clearPulse = false } = {}) => {
    const state = workshopPressStates.get(target);
    if (state?.holdTimer) window.clearTimeout(state.holdTimer);
    workshopPressStates.delete(target);
    target.classList.remove("is-pressing");

    if (!clearPulse) return;
    const pulseTimer = workshopPressTimers.get(target);
    if (pulseTimer) window.clearTimeout(pulseTimer);
    workshopPressTimers.delete(target);
    target.classList.remove("is-pressed");
  };

  const pulseWorkshopPress = (target) => {
    clearWorkshopPress(target, { clearPulse: true });
    void target.offsetWidth;
    target.classList.add("is-pressed");

    if (reduceMotion) return;
    const pulseTimer = window.setTimeout(() => {
      target.classList.remove("is-pressed");
      workshopPressTimers.delete(target);
    }, 390);
    workshopPressTimers.set(target, pulseTimer);
  };

  const wait = (duration) => duration > 0
    ? new Promise((resolve) => window.setTimeout(resolve, duration))
    : Promise.resolve();

  const runWorkshopAction = async (control, action) => {
    if (workshopActionPending || workshopTransitioning) return;
    workshopActionPending = true;
    pulseWorkshopPress(control);

    try {
      await wait(workshopActionDelay);
      clearWorkshopPress(control, { clearPulse: true });
      await action();
    } finally {
      clearWorkshopPress(control, { clearPulse: true });
      workshopActionPending = false;
    }
  };

  workshopPressTargets.forEach((target) => {
    target.addEventListener("pointerdown", (event) => {
      event.stopPropagation();
      if (event.pointerType === "mouse" && event.button !== 0) return;
      clearWorkshopPress(target, { clearPulse: true });

      const state = {
        x: event.clientX,
        y: event.clientY,
        moved: false,
        holdTimer: 0,
      };
      state.holdTimer = window.setTimeout(() => {
        if (!state.moved && workshopPressStates.get(target) === state) {
          target.classList.add("is-pressing");
        }
      }, workshopPressHoldDelay);
      workshopPressStates.set(target, state);
    }, { passive: true });

    target.addEventListener("pointermove", (event) => {
      event.stopPropagation();
      const state = workshopPressStates.get(target);
      if (!state || state.moved) return;
      if (Math.hypot(event.clientX - state.x, event.clientY - state.y) <= 9) return;
      state.moved = true;
      clearWorkshopPress(target, { clearPulse: true });
    }, { passive: true });

    target.addEventListener("pointerup", (event) => {
      event.stopPropagation();
      clearWorkshopPress(target);
    }, { passive: true });
    target.addEventListener("pointercancel", (event) => {
      event.stopPropagation();
      clearWorkshopPress(target, { clearPulse: true });
    }, { passive: true });
    target.addEventListener("pointerleave", (event) => {
      if (event.pointerType === "mouse") clearWorkshopPress(target, { clearPulse: true });
    }, { passive: true });

    target.addEventListener("keydown", (event) => {
      event.stopPropagation();
      if (event.repeat || (event.key !== "Enter" && event.key !== " ")) return;
      clearWorkshopPress(target, { clearPulse: true });
      target.classList.add("is-pressing");
    });
    target.addEventListener("keyup", (event) => {
      event.stopPropagation();
      if (event.key !== "Enter" && event.key !== " ") return;
      clearWorkshopPress(target);
    });
  });

  workshopOpeners.forEach((opener) => opener.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    void runWorkshopAction(opener, () => runWorkshopTransition(true, () => {
      const url = new URL(window.location.href);
      url.searchParams.set("view", "workshop");
      window.history.pushState({ view: "workshop", portfolioWorkshop: true }, "", `${url.pathname}${url.search}${url.hash}`);
      renderWorkshop(true);
    }));
  }));

  workshopClosers.forEach((closer) => closer.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    void runWorkshopAction(closer, returnToPortfolio);
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

    // Hash-only history changes belong to the portfolio navigation. They must
    // never trigger the full-screen Workshop transition.
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
    if (event.key !== "Escape" || workshopView?.hidden) return;
    returnToPortfolio();
  });

  // Version 2.0 — unified, mobile-safe press interactions.
  // General cards, including the Workshop card surface, are visual-only.
  // Dedicated Workshop, Copy, and Visit controls perform their own actions.
  const cardPressTargets = [...document.querySelectorAll(
    ".facts > div, .project-card, .workshop-entry, .workshop-card, .current-track-card"
  )];
  const cardPressStates = new WeakMap();
  const cardPressPulseTimers = new WeakMap();
  const cardPressHoldDelay = 90;
  const cardPressPulseDuration = reduceMotion ? 120 : 360;

  const clearCardPress = (target, { clearPulse = false } = {}) => {
    const state = cardPressStates.get(target);
    if (state?.holdTimer) window.clearTimeout(state.holdTimer);
    target.classList.remove("is-pressing");
    cardPressStates.delete(target);

    if (!clearPulse) return;
    const pulseTimer = cardPressPulseTimers.get(target);
    if (pulseTimer) window.clearTimeout(pulseTimer);
    cardPressPulseTimers.delete(target);
    target.classList.remove("is-pressed");
  };

  const pulseCardPress = (target) => {
    const previousPulseTimer = cardPressPulseTimers.get(target);
    if (previousPulseTimer) window.clearTimeout(previousPulseTimer);
    target.classList.remove("is-pressing", "is-pressed");
    void target.offsetWidth;
    target.classList.add("is-pressed");
    const pulseTimer = window.setTimeout(() => {
      target.classList.remove("is-pressed");
      cardPressPulseTimers.delete(target);
    }, cardPressPulseDuration);
    cardPressPulseTimers.set(target, pulseTimer);
  };

  cardPressTargets.forEach((target) => {
    target.addEventListener("pointerdown", (event) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      clearCardPress(target, { clearPulse: true });

      const state = {
        x: event.clientX,
        y: event.clientY,
        moved: false,
        holdTimer: 0,
      };
      state.holdTimer = window.setTimeout(() => {
        if (!state.moved && cardPressStates.get(target) === state) {
          target.classList.add("is-pressing");
        }
      }, cardPressHoldDelay);
      cardPressStates.set(target, state);
    }, { passive: true });

    target.addEventListener("pointermove", (event) => {
      const state = cardPressStates.get(target);
      if (!state || state.moved) return;
      if (Math.hypot(event.clientX - state.x, event.clientY - state.y) <= 9) return;
      state.moved = true;
      clearCardPress(target, { clearPulse: true });
    }, { passive: true });

    target.addEventListener("pointerup", () => {
      const state = cardPressStates.get(target);
      if (!state || state.moved) {
        clearCardPress(target, { clearPulse: true });
        return;
      }
      clearCardPress(target);
      pulseCardPress(target);
    }, { passive: true });

    target.addEventListener("pointercancel", () => clearCardPress(target, { clearPulse: true }), { passive: true });
    target.addEventListener("pointerleave", (event) => {
      if (event.pointerType === "mouse") clearCardPress(target, { clearPulse: true });
    }, { passive: true });

    target.addEventListener("keydown", (event) => {
      if (event.repeat || (event.key !== "Enter" && event.key !== " ")) return;
      clearCardPress(target, { clearPulse: true });
      target.classList.add("is-pressing");
    });
    target.addEventListener("keyup", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      clearCardPress(target);
      pulseCardPress(target);
    });
  });

  const contactActionTargets = [...copyButtons, ...contactLinkActions];

  // Action controls own their press feedback. Stopping pointer propagation here
  // prevents Copy/Visit presses from also animating the surrounding card.
  contactActionTargets.forEach((target) => {
    ["pointerdown", "pointermove", "pointerup", "pointercancel"].forEach((type) => {
      target.addEventListener(type, (event) => event.stopPropagation());
    });
  });

  const contactPressTargets = [...contactCards, ...contactActionTargets];
  const contactPressStates = new WeakMap();
  const contactPressPulseTimers = new WeakMap();
  // Match the confirmed hold-and-release timing used by the other portfolio cards.
  const contactPressHoldDelay = cardPressHoldDelay;
  const contactPressPulseDuration = cardPressPulseDuration;

  const clearContactPress = (target, { clearPulse = false } = {}) => {
    const state = contactPressStates.get(target);
    if (state?.holdTimer) window.clearTimeout(state.holdTimer);
    target.classList.remove("is-pressing");
    contactPressStates.delete(target);

    if (!clearPulse) return;
    const pulseTimer = contactPressPulseTimers.get(target);
    if (pulseTimer) window.clearTimeout(pulseTimer);
    contactPressPulseTimers.delete(target);
    target.classList.remove("is-pressed");
  };

  const pulseContactPress = (target) => {
    const previousPulseTimer = contactPressPulseTimers.get(target);
    if (previousPulseTimer) window.clearTimeout(previousPulseTimer);
    target.classList.remove("is-pressing", "is-pressed");
    void target.offsetWidth;
    target.classList.add("is-pressed");
    const pulseTimer = window.setTimeout(() => {
      target.classList.remove("is-pressed");
      contactPressPulseTimers.delete(target);
    }, contactPressPulseDuration);
    contactPressPulseTimers.set(target, pulseTimer);
  };

  const clearActiveContactPresses = ({ clearPulse = false } = {}) => {
    contactPressTargets.forEach((target) => {
      if (contactPressStates.has(target) || clearPulse) {
        clearContactPress(target, { clearPulse });
      }
    });
  };

  contactPressTargets.forEach((target) => {
    target.addEventListener("pointerdown", (event) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      clearContactPress(target, { clearPulse: true });

      const state = {
        x: event.clientX,
        y: event.clientY,
        moved: false,
        holdTimer: 0,
      };
      state.holdTimer = window.setTimeout(() => {
        if (!state.moved && contactPressStates.get(target) === state) {
          target.classList.add("is-pressing");
        }
      }, contactPressHoldDelay);
      contactPressStates.set(target, state);
    }, { passive: true });

    target.addEventListener("pointermove", (event) => {
      const state = contactPressStates.get(target);
      if (!state || state.moved) return;
      if (Math.hypot(event.clientX - state.x, event.clientY - state.y) <= 9) return;
      state.moved = true;
      clearContactPress(target, { clearPulse: true });
    }, { passive: true });

    target.addEventListener("pointerup", () => {
      const state = contactPressStates.get(target);
      if (!state || state.moved) {
        clearContactPress(target, { clearPulse: true });
        return;
      }
      clearContactPress(target);
      pulseContactPress(target);
    }, { passive: true });

    target.addEventListener("pointercancel", () => clearContactPress(target, { clearPulse: true }), { passive: true });
    target.addEventListener("pointerleave", (event) => {
      if (event.pointerType === "mouse") clearContactPress(target, { clearPulse: true });
    }, { passive: true });

    if (!target.matches("button, a")) return;
    target.addEventListener("keydown", (event) => {
      if (event.repeat || (event.key !== "Enter" && event.key !== " ")) return;
      clearContactPress(target, { clearPulse: true });
      target.classList.add("is-pressing");
    });
    target.addEventListener("keyup", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      clearContactPress(target);
      pulseContactPress(target);
    });
  });

  const clearAllPressEffects = () => {
    cardPressTargets.forEach((target) => clearCardPress(target, { clearPulse: true }));
    clearActiveContactPresses({ clearPulse: true });
  };

  // Target-level release handles normal taps. These bubble-phase listeners only
  // clear a press released outside its original target and never erase a completed pulse.
  document.addEventListener("pointerup", () => clearActiveContactPresses(), false);
  document.addEventListener("pointercancel", () => clearActiveContactPresses({ clearPulse: true }), false);
  window.addEventListener("blur", clearAllPressEffects);
  window.addEventListener("pagehide", clearAllPressEffects);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) clearAllPressEffects();
  });
})();
