import type { FutureDayContent, Scene } from "./content";

const escapeHtml = (value: string): string =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const renderHotspots = (scene: Scene, sceneIndex: number): string =>
  scene.hotspots
    .map((hotspot, hotspotIndex) => {
      const id = `hotspot-${scene.id}-${hotspotIndex + 1}`;
      const label = escapeHtml(hotspot.label);
      return `
        <button
          class="hotspot"
          type="button"
          data-hotspot-button="${escapeHtml(scene.id)}-${hotspotIndex + 1}"
          data-scene-index="${sceneIndex}"
          data-hotspot-index="${hotspotIndex}"
          aria-expanded="false"
          aria-controls="${id}"
          aria-label="Открыть слой ${label} в сцене ${escapeHtml(scene.title)}"
        >
          <span class="hotspot__pulse" aria-hidden="true"></span>
          <span class="hotspot__label">${label}</span>
        </button>
        <article class="hotspot-card" id="${id}" data-hotspot-card hidden>
          <button class="hotspot-card__close" type="button" data-close-hotspot aria-label="Закрыть карточку ${label}">×</button>
          <p class="eyebrow">Технологический слой</p>
          <h3>${label}</h3>
          <p>${escapeHtml(hotspot.body)}</p>
          <p class="micro-example"><strong>Микро-пример:</strong> ${escapeHtml(hotspot.example)}</p>
        </article>`;
    })
    .join("\n");

const renderScene = (scene: Scene, index: number): string => `
  <section class="scene ${index % 2 === 1 ? "scene--reverse" : ""}" id="${escapeHtml(scene.id)}" data-scene-id="${escapeHtml(scene.id)}" aria-labelledby="${escapeHtml(scene.id)}-title">
    <div class="scene__copy">
      <p class="eyebrow">Кадр 0${index + 1} · ${escapeHtml(scene.title)}</p>
      <h2 id="${escapeHtml(scene.id)}-title">${escapeHtml(scene.headline)}</h2>
      <p>${escapeHtml(scene.body)}</p>
    </div>
    <div class="scene__visual scene__visual--${escapeHtml(scene.id)}" aria-label="${escapeHtml(scene.visual)}">
      <div class="visual-noise" aria-hidden="true"></div>
      <div class="orb orb--${index + 1}" aria-hidden="true"></div>
      <div class="data-current" aria-hidden="true"></div>
      <div class="data-current data-current--wide" aria-hidden="true"></div>
      <p>${escapeHtml(scene.visual)}</p>
      <div class="scene__hotspots">
        ${renderHotspots(scene, index)}
      </div>
    </div>
  </section>`;

export const renderPage = (content: FutureDayContent): string => `<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="description" content="${escapeHtml(content.hero.lead)}" />
  <title>${escapeHtml(content.hero.title)}</title>
  <link rel="stylesheet" href="styles.css" />
  <script type="module" src="app.js?v=20260601-live-constructor"></script>
</head>
<body>
  <a class="skip-link" href="#story">Перейти к истории</a>
  <main data-live-site-shell>
    <section class="hero" aria-labelledby="hero-title">
      <div class="hero__backdrop" aria-hidden="true"></div>
      <div class="constructor-rig" data-live-constructor aria-hidden="true">
        <div class="rig-line rig-line--one"></div>
        <div class="rig-line rig-line--two"></div>
        <div class="rig-node rig-node--a"></div>
        <div class="rig-node rig-node--b"></div>
        <div class="rig-node rig-node--c"></div>
      </div>
      <p class="eyebrow">Интерактивное путешествие в будущее</p>
      <h1 id="hero-title">${escapeHtml(content.hero.title)}</h1>
      <p class="hero__subtitle">${escapeHtml(content.hero.subtitle)}</p>
      <p class="hero__lead">${escapeHtml(content.hero.lead)}</p>
      <a class="primary-cta" href="#story">Начать день ↓</a>
    </section>

    <nav class="progress-line" aria-label="Прогресс истории">
      ${content.scenes.map((scene) => `<a href="#${escapeHtml(scene.id)}" data-progress-link="${escapeHtml(scene.id)}">${escapeHtml(scene.title.split(" /")[0])}</a>`).join("\n      ")}
      <a href="#ocean" data-progress-link="ocean">Океан</a>
    </nav>

    <div id="story" class="story" data-story-root>
      ${content.scenes.map(renderScene).join("\n")}
    </div>

    <section class="final" id="ocean" aria-labelledby="final-title">
      <p class="eyebrow">Финальный кадр</p>
      <h2 id="final-title">${escapeHtml(content.final.title)}</h2>
      <p>${escapeHtml(content.final.body)}</p>
      <p class="final__question">${escapeHtml(content.final.question)}</p>
      <div class="final__actions">
        <button class="primary-cta" type="button" data-share>Поделиться сайтом</button>
        <a class="secondary-cta" href="#hero-title">Начать путешествие заново</a>
      </div>
    </section>
  </main>
</body>
</html>`;
