export const dailyVariationPresets = [
  {
    name: "Северное сияние",
    heroTitle: "Один день в неоновом завтра",
    subtitle: "Сегодня будущее светится холодным северным контуром.",
    accent: "#7df9ff",
    accent2: "#8b5cf6",
    bg: "#030615",
    bg2: "#101a3f",
    pattern: "aurora",
  },
  {
    name: "Золотой рассвет",
    heroTitle: "Один день на рассвете будущего",
    subtitle: "Сегодня технологии выглядят тёплыми, близкими и человеческими.",
    accent: "#ffd166",
    accent2: "#ff7a59",
    bg: "#120809",
    bg2: "#34200d",
    pattern: "sunrise",
  },
  {
    name: "Биолюминесцентный океан",
    heroTitle: "Один день среди светящихся океанов",
    subtitle: "Сегодня будущее похоже на живой океан возможностей.",
    accent: "#2fffd4",
    accent2: "#2f80ff",
    bg: "#020b10",
    bg2: "#04252b",
    pattern: "ocean",
  },
  {
    name: "Марсианская пыль",
    heroTitle: "Один день на красной орбите",
    subtitle: "Сегодня обычная жизнь звучит как экспедиция на новую планету.",
    accent: "#ff6b4a",
    accent2: "#ffc857",
    bg: "#120605",
    bg2: "#2b120c",
    pattern: "mars",
  },
  {
    name: "Лунная лаборатория",
    heroTitle: "Один день в тихой лаборатории Луны",
    subtitle: "Сегодня будущее минималистичное, точное и почти невесомое.",
    accent: "#d7e3ff",
    accent2: "#78a6ff",
    bg: "#05070d",
    bg2: "#151a26",
    pattern: "moon",
  },
  {
    name: "Сад данных",
    heroTitle: "Один день в саду данных",
    subtitle: "Сегодня технологии растут как живые связи, а не как холодные машины.",
    accent: "#9cff6e",
    accent2: "#38e8a6",
    bg: "#031005",
    bg2: "#102b16",
    pattern: "garden",
  },
  {
    name: "Квантовый фиолетовый",
    heroTitle: "Один день в квантовом городе",
    subtitle: "Сегодня всё чуть страннее: интерфейсы дышат, маршруты меняются, идеи искрят.",
    accent: "#c084fc",
    accent2: "#22d3ee",
    bg: "#090414",
    bg2: "#21113b",
    pattern: "quantum",
  },
  {
    name: "Чистое стекло",
    heroTitle: "Один день в прозрачном будущем",
    subtitle: "Сегодня сайт становится светлее, спокойнее и почти стеклянным.",
    accent: "#b7f7ff",
    accent2: "#ffffff",
    bg: "#071018",
    bg2: "#173142",
    pattern: "glass",
  },
  {
    name: "Кибер-ночь",
    heroTitle: "Один день в кибер-ночи",
    subtitle: "Сегодня будущее контрастное: больше ритма, глубины и электрического света.",
    accent: "#ff2bd6",
    accent2: "#00e5ff",
    bg: "#07020b",
    bg2: "#210426",
    pattern: "cybernight",
  },
  {
    name: "Спокойный ИИ",
    heroTitle: "Один день с тихим ИИ рядом",
    subtitle: "Сегодня главный герой — не эффектность, а мягкая забота системы.",
    accent: "#7dd3fc",
    accent2: "#a7f3d0",
    bg: "#020b13",
    bg2: "#0b2430",
    pattern: "calm-ai",
  },
  {
    name: "Город после дождя",
    heroTitle: "Один день после цифрового дождя",
    subtitle: "Сегодня всё отражается, мерцает и собирается в новый порядок.",
    accent: "#60a5fa",
    accent2: "#c4b5fd",
    bg: "#030712",
    bg2: "#111827",
    pattern: "rain-city",
  },
  {
    name: "Солнечная сеть",
    heroTitle: "Один день в солнечной сети",
    subtitle: "Сегодня будущее похоже на тёплую инфраструктуру, которая поддерживает жизнь.",
    accent: "#facc15",
    accent2: "#34d399",
    bg: "#0f0b03",
    bg2: "#222a0f",
    pattern: "solar-grid",
  },
  {
    name: "Глубокий космос",
    heroTitle: "Один день между звёздными маршрутами",
    subtitle: "Сегодня весь сайт становится темнее, шире и немного космичнее.",
    accent: "#93c5fd",
    accent2: "#f0abfc",
    bg: "#01030a",
    bg2: "#070f2c",
    pattern: "deep-space",
  },
  {
    name: "Тёплый минимализм",
    heroTitle: "Один день в простом будущем",
    subtitle: "Сегодня меньше шума: только смысл, воздух и ясная траектория дня.",
    accent: "#f9a8d4",
    accent2: "#fde68a",
    bg: "#10080c",
    bg2: "#24151b",
    pattern: "warm-minimal",
  },
];

const sceneIds = ["morning", "work", "learning", "creation", "safety", "evening"];

export const dateKeyUtc = (date = new Date()) => {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const hashString = (value) => {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};

const rotate = (items, amount) => [...items.slice(amount), ...items.slice(0, amount)];

export const createDailyVariation = (date = new Date()) => {
  const dateKey = dateKeyUtc(date);
  const hash = hashString(dateKey);
  const preset = dailyVariationPresets[hash % dailyVariationPresets.length];
  const sceneOffset = 1 + (hash % (sceneIds.length - 1));
  const sceneOrder = rotate(sceneIds, sceneOffset);

  return {
    dateKey,
    preset,
    heroTitle: preset.heroTitle,
    heroSubtitle: preset.subtitle,
    sceneOrder,
    visualDensity: 0.72 + ((hash >>> 5) % 28) / 100,
    gridSize: 72 + ((hash >>> 9) % 58),
    angle: -18 + ((hash >>> 13) % 37),
  };
};

export const applyDailyVariation = (documentRef = document, date = new Date()) => {
  const variation = createDailyVariation(date);
  const root = documentRef.documentElement;
  const body = documentRef.body;
  const title = documentRef.getElementById("hero-title");
  const subtitle = documentRef.querySelector(".hero__subtitle");
  const progress = documentRef.querySelector(".progress-line");
  const story = documentRef.querySelector("[data-story-root]");

  root.style.setProperty("--bg", variation.preset.bg);
  root.style.setProperty("--bg-2", variation.preset.bg2);
  root.style.setProperty("--cyan", variation.preset.accent);
  root.style.setProperty("--blue", variation.preset.accent2);
  root.style.setProperty("--daily-accent", variation.preset.accent);
  root.style.setProperty("--daily-accent-2", variation.preset.accent2);
  root.style.setProperty("--daily-grid", `${variation.gridSize}px`);
  root.style.setProperty("--daily-angle", `${variation.angle}deg`);
  root.style.setProperty("--daily-density", String(variation.visualDensity));

  body.dataset.dailyMood = variation.preset.pattern;
  body.dataset.dailyDate = variation.dateKey;

  if (title) title.textContent = variation.heroTitle;
  if (subtitle) subtitle.textContent = variation.heroSubtitle;

  if (story) {
    const sections = new Map(
      [...story.querySelectorAll("[data-scene-id]")].map((section) => [section.getAttribute("data-scene-id"), section]),
    );
    variation.sceneOrder.forEach((id) => {
      const section = sections.get(id);
      if (section) story.append(section);
    });
  }

  if (progress) {
    const links = new Map(
      [...progress.querySelectorAll("[data-progress-link]")].map((link) => [link.getAttribute("data-progress-link"), link]),
    );
    variation.sceneOrder.forEach((id) => {
      const link = links.get(id);
      if (link) progress.append(link);
    });
    const ocean = links.get("ocean");
    if (ocean) progress.append(ocean);
  }

  documentRef.querySelector("[data-daily-badge]")?.remove();
  const badge = documentRef.createElement("p");
  badge.className = "daily-badge";
  badge.dataset.dailyBadge = "";
  badge.textContent = `Сегодня: ${variation.preset.name}`;
  title?.insertAdjacentElement("afterend", badge);

  return variation;
};
