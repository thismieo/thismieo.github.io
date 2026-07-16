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
