import { applyDailyVariation } from "./daily-variation.js?v=20260601-kinetic-blocks";

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
  document.body.classList.remove("has-open-hotspot");
  if (!isOpen && card) {
    document.body.classList.add("has-open-hotspot");
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
    document.body.classList.remove("has-open-hotspot");
    return;
  }

  if (!event.target.closest?.(".hotspot-card") && !event.target.closest?.("[data-hotspot-button]")) {
    closeAllHotspots();
    document.body.classList.remove("has-open-hotspot");
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeAllHotspots();
    document.body.classList.remove("has-open-hotspot");
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

const constructorMessages = [
  "UI GRID SPLIT",
  "BLOCKS REDOCKING",
  "SECTION RECOMPOSED",
  "LAYOUT MUTATION",
  "READING PATH REWIRED",
  "CYBERPUNK CONSTRUCTOR ACTIVE",
];

const gridLayouts = ["metro", "tower", "market", "split", "stack"];

const activateLiveConstructor = () => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const shell = document.querySelector("[data-live-site-shell]");
  const story = document.querySelector(".story");
  if (!shell || !story) return;

  document.body.classList.add("is-block-constructor");

  const status = document.createElement("div");
  status.className = "constructor-status";
  status.setAttribute("aria-live", "polite");
  status.dataset.liveStatus = "";
  status.textContent = "CYBERPUNK CONSTRUCTOR ACTIVE";
  shell.prepend(status);

  const blocks = [...document.querySelectorAll(".hero, .scene, .final")];
  const heroPieces = [...document.querySelectorAll(".hero > .eyebrow, .hero > h1, .hero > .daily-badge, .hero > .hero__subtitle, .hero > .hero__lead, .hero > .primary-cta")];
  heroPieces.forEach((piece, index) => {
    piece.classList.add("kinetic-hero-block");
    piece.style.setProperty("--piece-index", String(index));
  });
  blocks.forEach((block, index) => {
    block.classList.add("constructor-block");
    block.dataset.constructorBlock = "";
    block.style.setProperty("--block-index", String(index));
    block.style.setProperty("--block-lane", String(index % 4));
  });

  let tick = 0;
  const rebuild = () => {
    tick += 1;
    const layout = gridLayouts[tick % gridLayouts.length];
    document.body.dataset.constructorLayout = layout;
    status.textContent = constructorMessages[tick % constructorMessages.length];
    shell.dataset.liveTick = String(tick % 100);

    const scenes = [...document.querySelectorAll(".scene")];
    const activeIndex = tick % scenes.length;
    heroPieces.forEach((piece, index) => {
      const direction = (index + tick) % 2 === 0 ? 1 : -1;
      piece.style.setProperty("--piece-shift", `${direction * (8 + ((tick + index) % 3) * 8)}px`);
      piece.style.setProperty("--piece-lift", `${((tick + index) % 3 - 1) * 8}px`);
      piece.classList.toggle("is-kinetic", (index + tick) % 3 === 0);
    });
    scenes.forEach((scene, index) => {
      scene.style.order = String((index + tick) % scenes.length);
    });
    scenes.forEach((scene, index) => {
      const phase = (index + tick) % 5;
      scene.style.setProperty("--dock-x", `${(phase - 2) * 3.2}rem`);
      scene.style.setProperty("--dock-y", `${((phase % 3) - 1) * 2.4}rem`);
      scene.style.setProperty("--tilt", `${(phase - 2) * 1.6}deg`);
      scene.classList.toggle("is-docking", index === activeIndex);
      scene.classList.toggle("is-receding", (index + tick) % 4 === 0);
    });
  };

  rebuild();
  setInterval(rebuild, 2300);
};

activateLiveConstructor();
