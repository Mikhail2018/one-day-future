import { describe, expect, test } from "bun:test";
import { futureDayContent } from "../src/content";
import { renderPage } from "../src/render";
import { createDailyVariation, dateKeyUtc, dailyThemePacks, dailyVariationPresets } from "../src/daily-variation.js";

describe("Один день в будущем MVP content contract", () => {
  test("has hero, exactly six scenes, and the final blue-ocean thesis", () => {
    expect(futureDayContent.hero.title).toBe("Один день в будущем");
    expect(futureDayContent.scenes).toHaveLength(6);
    expect(futureDayContent.scenes.map((scene) => scene.title)).toEqual([
      "Утро",
      "Работа",
      "Обучение",
      "Творчество",
      "Здоровье и безопасность",
      "Вечер / личный выбор",
    ]);
    expect(futureDayContent.final.title).toContain("Голубой океан — это не технология");
  });

  test("every scene has exactly three readable technology hotspots", () => {
    for (const scene of futureDayContent.scenes) {
      expect(scene.hotspots, scene.title).toHaveLength(3);
      for (const hotspot of scene.hotspots) {
        expect(hotspot.label.length).toBeGreaterThan(1);
        expect(hotspot.body.length).toBeGreaterThan(40);
        expect(hotspot.example.length).toBeGreaterThan(20);
      }
    }
  });
});

describe("daily variation engine", () => {
  test("uses a stable UTC date key so every visitor sees the same day variant", () => {
    expect(dateKeyUtc(new Date("2026-06-01T00:30:00Z"))).toBe("2026-06-01");
    expect(dateKeyUtc(new Date("2026-06-01T23:59:59Z"))).toBe("2026-06-01");
    expect(dateKeyUtc(new Date("2026-06-02T00:00:00Z"))).toBe("2026-06-02");
  });

  test("produces deterministic but visibly different variants for adjacent days", () => {
    const first = createDailyVariation(new Date("2026-06-01T12:00:00Z"));
    const second = createDailyVariation(new Date("2026-06-02T12:00:00Z"));

    expect(first.dateKey).toBe("2026-06-01");
    expect(second.dateKey).toBe("2026-06-02");
    expect(first.preset.name).not.toBe(second.preset.name);
    expect(first.heroTitle).not.toBe(second.heroTitle);
    expect(first.sceneOrder.join(",")).not.toBe(second.sceneOrder.join(","));
  });

  test("has enough daily presets to avoid repeating the same visual mood for weeks", () => {
    expect(dailyVariationPresets.length).toBeGreaterThanOrEqual(14);
    for (const preset of dailyVariationPresets) {
      expect(preset.name.length).toBeGreaterThan(3);
      expect(preset.accent).toMatch(/^#[0-9a-f]{6}$/i);
      expect(preset.heroTitle.length).toBeGreaterThan(10);
    }
  });

  test("changes the story theme, not only colors, on adjacent days", () => {
    const first = createDailyVariation(new Date("2026-06-01T12:00:00Z"));
    const second = createDailyVariation(new Date("2026-06-02T12:00:00Z"));

    expect(first.theme.name).not.toBe(second.theme.name);
    expect(first.theme.eyebrow).not.toBe(second.theme.eyebrow);
    expect(first.heroLead).not.toBe(second.heroLead);
    expect(first.sceneCopy.morning.headline).not.toBe(second.sceneCopy.morning.headline);
    expect(first.finalQuestion).not.toBe(second.finalQuestion);
  });

  test("has enough full theme packs with copy for every scene", () => {
    expect(dailyThemePacks.length).toBeGreaterThanOrEqual(10);
    for (const theme of dailyThemePacks) {
      expect(theme.name.length).toBeGreaterThan(3);
      expect(theme.eyebrow.length).toBeGreaterThan(10);
      expect(theme.heroLead.length).toBeGreaterThan(40);
      expect(theme.finalQuestion.length).toBeGreaterThan(15);
      expect(Object.keys(theme.scenes).sort()).toEqual(["creation", "evening", "learning", "morning", "safety", "work"]);
      for (const scene of Object.values(theme.scenes)) {
        expect(scene.headline.length).toBeGreaterThan(10);
        expect(scene.body.length).toBeGreaterThan(30);
        expect(scene.visual.length).toBeGreaterThan(20);
      }
    }
  });
});

describe("Один день в будущем MVP rendered page", () => {
  const html = renderPage(futureDayContent);

  test("renders accessible buttons for all 18 hotspots", () => {
    const hotspotButtons = html.match(/data-hotspot-button=/g) ?? [];
    expect(hotspotButtons).toHaveLength(18);
    expect(html).toContain('aria-expanded="false"');
    expect(html).toContain('aria-controls="hotspot-');
  });

  test("supports the required interactions, daily variation module, and motion/accessibility hooks", () => {
    expect(html).toContain("app.js");
    expect(html).toContain("styles.css");
    expect(html).toContain("Начать день");
    expect(html).toContain("Поделиться сайтом");
    expect(html).toContain("Начать путешествие заново");
  });

  test("does not introduce out-of-scope backend, accounts, canvas, or 3D dependencies", () => {
    expect(html).not.toContain("<canvas");
    expect(html).not.toContain("three.js");
    expect(html).not.toContain("login");
    expect(html).not.toContain("database");
  });
});
