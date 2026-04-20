const body = document.body;
const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav-menu]");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function normalizePath(pathname) {
  if (!pathname || pathname === "/index.html") return "/";
  return pathname.endsWith("/index.html") ? pathname.replace(/index\.html$/, "") : pathname;
}

function currentRoute() {
  const path = normalizePath(window.location.pathname);
  if (path.includes("/privacy")) return "privacy";
  if (path.includes("/terms")) return "terms";
  if (path.includes("/contact")) return "contact";
  return "home";
}

function markActiveNav() {
  const route = currentRoute();
  document.querySelectorAll("[data-route]").forEach((link) => {
    const isActive = link.dataset.route === route;
    link.classList.toggle("active", isActive);
    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

function syncHeaderState() {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 18);
}

function setNavState(isOpen) {
  body.classList.toggle("nav-open", isOpen);
  if (!navToggle) return;
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "Menüyü kapat" : "Menüyü aç");
}

function closeNav() {
  setNavState(false);
}

function initNav() {
  if (!navToggle || !nav) return;

  navToggle.addEventListener("click", () => {
    setNavState(!body.classList.contains("nav-open"));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeNav);
  });

  document.addEventListener("click", (event) => {
    if (!body.classList.contains("nav-open")) return;
    const target = event.target;
    if (!(target instanceof Node)) return;
    if (nav.contains(target) || navToggle.contains(target)) return;
    closeNav();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 920) closeNav();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeNav();
  });
}

function initReveal() {
  const revealItems = Array.from(document.querySelectorAll(".reveal"));
  revealItems.forEach((item) => {
    const delay = item.getAttribute("data-delay");
    if (delay) item.style.setProperty("--reveal-delay", `${delay}ms`);
  });

  if (!revealItems.length) return;
  if (prefersReducedMotion.matches || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -10% 0px" },
  );

  revealItems.forEach((item) => observer.observe(item));
}

markActiveNav();
syncHeaderState();
initNav();
initReveal();
window.addEventListener("scroll", syncHeaderState, { passive: true });
