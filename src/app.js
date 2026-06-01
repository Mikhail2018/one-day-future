import { applyDailyVariation } from "./daily-variation.js?v=20260601-full-identity";

applyDailyVariation();

const closeAllHotspots = () => {
  document.querySelectorAll("[data-hotspot-button]").forEach((button) => {
    button.setAttribute("aria-expanded", "false");
  });
  document.querySelectorAll("[data-hotspot-card]").forEach((card) => {
    card.setAttribute("hidden", "");
  });
};

const openHotspot = (button) => {
  const cardId = button.getAttribute("aria-controls");
  const card = cardId ? document.getElementById(cardId) : null;
  const isOpen = button.getAttribute("aria-expanded") === "true";
  closeAllHotspots();
  if (!isOpen && card) {
    button.setAttribute("aria-expanded", "true");
    card.removeAttribute("hidden");
    card.querySelector("[data-close-hotspot]")?.focus({ preventScroll: true });
  }
};

document.addEventListener("click", (event) => {
  const hotspotButton = event.target.closest?.("[data-hotspot-button]");
  if (hotspotButton) {
    openHotspot(hotspotButton);
    return;
  }

  if (event.target.closest?.("[data-close-hotspot]")) {
    closeAllHotspots();
    return;
  }

  if (!event.target.closest?.(".hotspot-card") && !event.target.closest?.("[data-hotspot-button]")) {
    closeAllHotspots();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeAllHotspots();
  }
});

document.querySelector("[data-share]")?.addEventListener("click", async () => {
  const shareData = {
    title: document.title,
    text: "Один день в будущем — технологии как голубые океаны возможностей.",
    url: window.location.href,
  };

  if (navigator.share) {
    await navigator.share(shareData);
    return;
  }

  await navigator.clipboard?.writeText(window.location.href);
  const button = document.querySelector("[data-share]");
  if (button) {
    const originalText = button.textContent;
    button.textContent = "Ссылка скопирована";
    setTimeout(() => {
      button.textContent = originalText;
    }, 1800);
  }
});

const progressLinks = [...document.querySelectorAll("[data-progress-link]")];
const sections = progressLinks
  .map((link) => document.getElementById(link.getAttribute("data-progress-link")))
  .filter(Boolean);

const setActiveProgress = (id) => {
  progressLinks.forEach((link) => {
    link.classList.toggle("is-active", link.getAttribute("data-progress-link") === id);
  });
};

if ("IntersectionObserver" in window) {
  setActiveProgress(sections[0]?.id || "morning");
  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target?.id) {
        setActiveProgress(visible.target.id);
      }
    },
    { rootMargin: "-35% 0px -45% 0px", threshold: [0.1, 0.35, 0.6] },
  );

  sections.forEach((section) => observer.observe(section));
}
