import { applyDailyVariation } from "./daily-variation.js?v=20260601-live-constructor";

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

const constructorMessages = [
  "NEON MODULE INBOUND",
  "STORY GRID REBUILT",
  "CYBERPUNK LAYOUT SHIFT",
  "NEW BLOCK DOCKED",
  "SIGNAL ROUTED",
  "INTERFACE MUTATION",
];

const moduleTitles = [
  "Слой города",
  "Слой памяти",
  "Слой маршрута",
  "Слой риска",
  "Слой энергии",
  "Слой выбора",
  "Слой прототипа",
  "Слой сигнала",
];

const moduleBodies = [
  "панель перестраивает маршрут чтения",
  "неоновый блок приезжает поверх старой сетки",
  "система меняет акцент, пока ты скроллишь",
  "конструктор собирает новую связку смыслов",
  "модуль уезжает за край и возвращается другим",
  "городская схема подстраивается под внимание",
];

const createLiveModule = (index) => {
  const module = document.createElement("aside");
  module.className = "live-module";
  module.dataset.liveModule = "";
  module.style.setProperty("--module-lane", String(index % 6));
  module.style.setProperty("--module-delay", `${(index % 5) * 0.35}s`);
  module.innerHTML = `
    <span class="live-module__code">${String(index + 1).padStart(2, "0")}</span>
    <strong>${moduleTitles[index % moduleTitles.length]}</strong>
    <span>${moduleBodies[index % moduleBodies.length]}</span>
  `;
  return module;
};

const activateLiveConstructor = () => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const shell = document.querySelector("[data-live-site-shell]");
  const rig = document.querySelector("[data-live-constructor]");
  if (!shell || !rig) return;

  document.body.classList.add("is-live-constructor");

  const status = document.createElement("div");
  status.className = "live-status";
  status.setAttribute("aria-live", "polite");
  status.dataset.liveStatus = "";
  status.textContent = "LIVE CONSTRUCTOR ONLINE";
  shell.prepend(status);

  const moduleRail = document.createElement("div");
  moduleRail.className = "live-module-rail";
  moduleRail.setAttribute("aria-hidden", "true");
  moduleRail.dataset.liveModuleRail = "";
  shell.append(moduleRail);

  for (let index = 0; index < 10; index += 1) {
    moduleRail.append(createLiveModule(index));
  }

  const morphScene = (scene, index) => {
    scene.classList.add("is-live-scene");
    scene.style.setProperty("--scene-lane", String(index % 4));
  };

  document.querySelectorAll(".scene").forEach(morphScene);

  let tick = 0;
  setInterval(() => {
    tick += 1;
    status.textContent = constructorMessages[tick % constructorMessages.length];
    shell.dataset.liveTick = String(tick % 100);

    const scenes = [...document.querySelectorAll(".scene")];
    const activeScene = scenes[tick % scenes.length];
    scenes.forEach((scene) => scene.classList.toggle("is-assembling", scene === activeScene));

    const retiring = moduleRail.querySelector("[data-live-module]");
    if (retiring) retiring.remove();
    moduleRail.append(createLiveModule(tick + 10));
  }, 3600);
};

activateLiveConstructor();
