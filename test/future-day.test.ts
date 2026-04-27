import { describe, expect, test } from "bun:test";
import { futureDayContent } from "../src/content";
import { renderPage } from "../src/render";

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

describe("Один день в будущем MVP rendered page", () => {
  const html = renderPage(futureDayContent);

  test("renders accessible buttons for all 18 hotspots", () => {
    const hotspotButtons = html.match(/data-hotspot-button=/g) ?? [];
    expect(hotspotButtons).toHaveLength(18);
    expect(html).toContain('aria-expanded="false"');
    expect(html).toContain('aria-controls="hotspot-');
  });

  test("supports the required interactions and motion/accessibility hooks", () => {
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
