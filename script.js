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

    const workshopOpen = document.documentElement.classList.contains("workshop-open");
    if (workshopOpen || window.innerWidth < 1340) {
      previousSectionButton.classList.remove("is-visible", "is-navigating");
      previousSectionButton.disabled = true;
      return;
    }

    const currentIndex = getCurrentStepSectionIndex();
    const previousSection = currentIndex > 0 ? stepSections[currentIndex - 1] : null;
    const visible = Boolean(previousSection);

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

    programmaticSectionScroll = true;
    document.body.classList.add("is-section-scrolling");

    navLinks.forEach((item) => {
      const active = item.getAttribute("href") === hash;
      item.classList.toggle("is-active", active);
      if (active) item.setAttribute("aria-current", "location");
      else item.removeAttribute("aria-current");
    });

    if (updateHistory && window.location.hash !== hash) {
      window.history.pushState({}, "", hash);
    }

    return animateScrollPosition(top).finally(() => {
      if (navigationToken !== sectionNavigationToken) return;
      programmaticSectionScroll = false;
      document.body.classList.remove("is-section-scrolling");
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
  let activeFrame = 0;
  const updateActiveSection = () => {
    if (programmaticSectionScroll) return;
    const activeSection = sections[getCurrentSectionIndex()] || sections[0];

    navLinks.forEach((link) => {
      const active = link.getAttribute("href") === `#${activeSection?.id}`;
      link.classList.toggle("is-active", active);
      if (active) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
    updatePreviousSectionButton();
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

  // Dedicated Workshop controls perform only their navigation action.
  // Visual press feedback is handled by the single interaction system below.
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

    try {
      await returnToPortfolio();
    } finally {
      workshopActionPending = false;
    }
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

  // Blue Continuum 4.1.0 — one pointer-safe left-to-right Silk Sweep system.
  // Navigation links intentionally use their dedicated underline feedback only.
  const pressSurfaces = [...document.querySelectorAll([
    ".facts > div",
    ".timeline-item",
    ".project-card",
    ".workshop-entry",
    ".workshop-card",
    ".current-track-card",
    ".contact-card",
    ".hero-actions .button",
    ".workshop-entry-action",
    ".workshop-back",
    ".workshop-closing .button",
    ".contact-card-action",
    ".contact-link-action",
    ".section-stepper",
  ].join(", "))];

  const pressStates = new WeakMap();
  const pressTimers = new WeakMap();
  const activePressSurfaces = new Set();
  const pressDistanceLimit = 10;
  const pressPulseDuration = reduceMotion ? 120 : 590;

  const isNestedInteractivePress = (surface, eventTarget) => {
    if (surface.matches("button, a")) return false;
    const interactive = eventTarget.closest?.("button, a");
    return Boolean(interactive && surface.contains(interactive));
  };



  const clearPressSurface = (surface, { clearPulse = false } = {}) => {
    pressStates.delete(surface);
    surface.classList.remove("is-pressing");

    if (!clearPulse) return;
    const timer = pressTimers.get(surface);
    if (timer) window.clearTimeout(timer);
    pressTimers.delete(surface);
    surface.classList.remove("is-pressed");
    activePressSurfaces.delete(surface);
  };

  const pulsePressSurface = (surface) => {
    const previousTimer = pressTimers.get(surface);
    if (previousTimer) window.clearTimeout(previousTimer);

    surface.classList.remove("is-pressing", "is-pressed");
    void surface.offsetWidth;
    surface.classList.add("is-pressed");
    activePressSurfaces.add(surface);

    const timer = window.setTimeout(() => {
      surface.classList.remove("is-pressed");
      pressTimers.delete(surface);
      activePressSurfaces.delete(surface);
    }, pressPulseDuration);
    pressTimers.set(surface, timer);
  };

  pressSurfaces.forEach((surface) => {
    surface.classList.add("press-surface");

    surface.addEventListener("pointerdown", (event) => {
      if (!event.isPrimary || (event.pointerType === "mouse" && event.button !== 0)) return;
      if (isNestedInteractivePress(surface, event.target)) return;

      clearPressSurface(surface, { clearPulse: true });
      pressStates.set(surface, {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        moved: false,
      });
      surface.classList.add("is-pressing");
      activePressSurfaces.add(surface);
    }, { passive: true });

    surface.addEventListener("pointermove", (event) => {
      const state = pressStates.get(surface);
      if (!state || state.pointerId !== event.pointerId || state.moved) return;
      if (Math.hypot(event.clientX - state.startX, event.clientY - state.startY) <= pressDistanceLimit) return;
      state.moved = true;
      clearPressSurface(surface, { clearPulse: true });
    }, { passive: true });

    surface.addEventListener("pointerup", (event) => {
      const state = pressStates.get(surface);
      if (!state || state.pointerId !== event.pointerId || state.moved) {
        clearPressSurface(surface, { clearPulse: true });
        return;
      }
      clearPressSurface(surface);
      pulsePressSurface(surface);
    }, { passive: true });

    surface.addEventListener("pointercancel", () => clearPressSurface(surface, { clearPulse: true }), { passive: true });
    surface.addEventListener("pointerleave", (event) => {
      if (event.pointerType === "mouse") clearPressSurface(surface, { clearPulse: true });
    }, { passive: true });

    if (!surface.matches("button, a")) return;
    const isKeyboardActivation = (event) => event.key === "Enter" || (surface.matches("button") && event.key === " ");
    surface.addEventListener("keydown", (event) => {
      if (event.repeat || !isKeyboardActivation(event)) return;
      clearPressSurface(surface, { clearPulse: true });
      surface.classList.add("is-pressing");
      activePressSurfaces.add(surface);
    });
    surface.addEventListener("keyup", (event) => {
      if (!isKeyboardActivation(event)) return;
      clearPressSurface(surface);
      pulsePressSurface(surface);
    });
    surface.addEventListener("blur", () => clearPressSurface(surface, { clearPulse: true }));
  });

  const clearAllPressSurfaces = () => {
    [...activePressSurfaces].forEach((surface) => clearPressSurface(surface, { clearPulse: true }));
  };

  const clearAbandonedPressSurfaces = () => {
    [...activePressSurfaces].forEach((surface) => {
      if (pressStates.has(surface)) clearPressSurface(surface, { clearPulse: true });
    });
  };

  document.addEventListener("pointerup", clearAbandonedPressSurfaces, { passive: true });
  document.addEventListener("pointercancel", clearAbandonedPressSurfaces, { passive: true });
  window.addEventListener("scroll", clearAllPressSurfaces, { passive: true });
  window.addEventListener("wheel", clearAllPressSurfaces, { passive: true });
  window.addEventListener("blur", clearAllPressSurfaces);
  window.addEventListener("pagehide", clearAllPressSurfaces);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) clearAllPressSurfaces();
  });
})();
